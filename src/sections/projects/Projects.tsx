import React, {memo, useEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"
import {Link} from "react-router-dom"
import styles from "../sections.module.scss"
import {MARKET_PAGES} from "../../content/marketPages"
import useMediaQuery from "../../hooks/useMediaQuery"
import useScrollProgress from "../../hooks/useScrollProgress"
import {Card} from "../../components"
import {PROJECTS_INFO, type CardInfo} from "../../content/projects"

export const PROJECTS_STORAGE_KEY = "vm-projects-order"
export const PROJECTS_CUSTOM_ORDER_STORAGE_KEY = "vm-projects-order-customized"
const MOBILE_PROJECTS_LAYOUT_QUERY = "(max-width: 820px)"
const PROJECTS_SUBTITLE = "Product-focused builds across desktop apps, internal CRM tools, commerce flows, and modern frontend systems."
const PROJECTS_SUBTITLE_LINES = [
    "Product-focused builds",
    "across desktop, CRM,",
    "commerce, and frontend.",
]
const PROJECTS_SUBTITLE_LINES_MOBILE = PROJECTS_SUBTITLE_LINES

const DEFAULT_PROJECT_IDS = [4, 2, 1, 3]

const getDefaultProjects = (): CardInfo[] => {
    const projectsById = new Map(PROJECTS_INFO.map((card) => [card.id, card]))
    const seenIds = new Set<number>()
    const orderedProjects: CardInfo[] = []

    DEFAULT_PROJECT_IDS.forEach((cardId) => {
        const card = projectsById.get(cardId)

        if (!card || seenIds.has(cardId)) {
            return
        }

        seenIds.add(cardId)
        orderedProjects.push(card)
    })

    PROJECTS_INFO.forEach((card) => {
        if (!seenIds.has(card.id)) {
            orderedProjects.push(card)
        }
    })

    return orderedProjects
}

const DEFAULT_PROJECTS = getDefaultProjects()

const resolveProjectsOrder = (storedOrder: unknown): CardInfo[] => {
    if (!Array.isArray(storedOrder)) {
        return DEFAULT_PROJECTS
    }

    const projectsById = new Map(DEFAULT_PROJECTS.map((card) => [card.id, card]))
    const seenIds = new Set<number>()
    const orderedProjects: CardInfo[] = []

    storedOrder.forEach((value) => {
        const cardId = typeof value === "number" ? value : Number(value)

        if (Number.isNaN(cardId) || seenIds.has(cardId)) {
            return
        }

        const card = projectsById.get(cardId)

        if (!card) {
            return
        }

        seenIds.add(cardId)
        orderedProjects.push(card)
    })

    DEFAULT_PROJECTS.forEach((card) => {
        if (!seenIds.has(card.id)) {
            orderedProjects.push(card)
        }
    })

    return orderedProjects
}

const hasStoredCustomOrder = (): boolean => {
    if (typeof window === "undefined") {
        return false
    }

    try {
        return window.localStorage.getItem(PROJECTS_CUSTOM_ORDER_STORAGE_KEY) === "true"
    } catch {
        return false
    }
}

const getInitialProjects = (): CardInfo[] => {
    if (typeof window === "undefined") {
        return DEFAULT_PROJECTS
    }

    try {
        if (!hasStoredCustomOrder()) {
            return DEFAULT_PROJECTS
        }

        const storedOrder = window.localStorage.getItem(PROJECTS_STORAGE_KEY)

        if (!storedOrder) {
            return DEFAULT_PROJECTS
        }

        return resolveProjectsOrder(JSON.parse(storedOrder))
    } catch {
        return DEFAULT_PROJECTS
    }
}

const reorderProjects = (cards: CardInfo[], sourceId: number, targetId: number): CardInfo[] => {
    const sourceIndex = cards.findIndex((card) => card.id === sourceId)
    const targetIndex = cards.findIndex((card) => card.id === targetId)

    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return cards
    }

    const nextCards = [...cards]
    const [movedCard] = nextCards.splice(sourceIndex, 1)
    nextCards.splice(targetIndex, 0, movedCard)

    return nextCards
}

const moveProjectToIndex = (cards: CardInfo[], cardId: number, nextIndex: number): CardInfo[] => {
    const currentIndex = cards.findIndex((card) => card.id === cardId)

    if (currentIndex === -1 || currentIndex === nextIndex || nextIndex < 0 || nextIndex >= cards.length) {
        return cards
    }

    const nextCards = [...cards]
    const [movedCard] = nextCards.splice(currentIndex, 1)
    nextCards.splice(nextIndex, 0, movedCard)

    return nextCards
}

const getProjectIdAtPoint = (clientX: number, clientY: number): number | null => {
    if (typeof document === "undefined") {
        return null
    }

    const target = document.elementFromPoint(clientX, clientY)
    const projectCard = target?.closest<HTMLElement>("[data-project-card-id]")
    const cardId = Number(projectCard?.dataset.projectCardId)

    return Number.isNaN(cardId) ? null : cardId
}

const getProjectVariant = (cards: CardInfo[], cardId: number, isMobileProjectsLayout: boolean): "featured" | "compact" => {
    if (isMobileProjectsLayout) {
        return "compact"
    }

    return cards[0]?.id === cardId ? "featured" : "compact"
}

const getProjectSequenceLabel = (index: number): string => String(index + 1).padStart(2, "0")

interface DragPreviewState {
    cardId: number
    height: number
    pointerOffsetX: number
    pointerOffsetY: number
    variant: "featured" | "compact"
    width: number
    x: number
    y: number
}

const Projects: React.FC = () => {
    const projectsRef = useRef<HTMLDivElement>(null)
    const activeDragRef = useRef<{cardId: number; pointerId: number} | null>(null)
    const dragStartOrderRef = useRef<CardInfo[] | null>(null)
    const dragWindowListenersRef = useRef<{
        pointercancel: (event: PointerEvent) => void
        pointermove: (event: PointerEvent) => void
        pointerup: (event: PointerEvent) => void
    } | null>(null)
    const [projectCards, setProjectCards] = useState<CardInfo[]>(getInitialProjects)
    const [hasCustomProjectOrder, setHasCustomProjectOrder] = useState(hasStoredCustomOrder)
    const [draggedCardId, setDraggedCardId] = useState<number | null>(null)
    const [dragPreview, setDragPreview] = useState<DragPreviewState | null>(null)
    const isMobileProjectsLayout = useMediaQuery(MOBILE_PROJECTS_LAYOUT_QUERY)
    const [featuredProject, ...secondaryProjects] = projectCards
    const projectCountLabel = String(projectCards.length).padStart(2, "0")
    const projectSubtitleLines = isMobileProjectsLayout ? PROJECTS_SUBTITLE_LINES_MOBILE : PROJECTS_SUBTITLE_LINES
    const railItemClassNames = [
        styles.projects__railItemFirst,
        styles.projects__railItemSecond,
        styles.projects__railItemThird,
    ]
    const featuredProjectVariant = featuredProject ? getProjectVariant(projectCards, featuredProject.id, isMobileProjectsLayout) : "featured"

    useScrollProgress(projectsRef)

    useEffect(() => {
        if (typeof window === "undefined" || !hasCustomProjectOrder) {
            return
        }

        try {
            window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectCards.map((card) => card.id)))
            window.localStorage.setItem(PROJECTS_CUSTOM_ORDER_STORAGE_KEY, "true")
        } catch {
            return
        }
    }, [hasCustomProjectOrder, projectCards])

    useEffect(() => () => {
        detachWindowDragListeners()
    }, [])

    const detachWindowDragListeners = () => {
        if (typeof window === "undefined" || !dragWindowListenersRef.current) {
            return
        }

        window.removeEventListener("pointermove", dragWindowListenersRef.current.pointermove)
        window.removeEventListener("pointerup", dragWindowListenersRef.current.pointerup)
        window.removeEventListener("pointercancel", dragWindowListenersRef.current.pointercancel)
        dragWindowListenersRef.current = null
    }

    const clearDragState = () => {
        detachWindowDragListeners()
        activeDragRef.current = null
        dragStartOrderRef.current = null
        setDraggedCardId(null)
        setDragPreview(null)
    }

    const handleDragPointerDown = (cardId: number) => (event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerType !== "mouse") {
            return
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
            return
        }

        const targetElement = event.target as HTMLElement | null

        if (targetElement?.closest("a, button")) {
            return
        }

        const cardElement = event.currentTarget.closest<HTMLElement>("[data-project-card-id]") ?? event.currentTarget

        if (!cardElement) {
            return
        }

        const cardRect = cardElement.getBoundingClientRect()

        activeDragRef.current = {cardId, pointerId: event.pointerId}
        dragStartOrderRef.current = projectCards
        setDraggedCardId(cardId)
        setDragPreview({
            cardId,
            height: cardRect.height,
            pointerOffsetX: event.clientX - cardRect.left,
            pointerOffsetY: event.clientY - cardRect.top,
            variant: getProjectVariant(projectCards, cardId, isMobileProjectsLayout),
            width: cardRect.width,
            x: cardRect.left,
            y: cardRect.top,
        })

        detachWindowDragListeners()
        dragWindowListenersRef.current = {
            pointercancel: (pointerEvent: PointerEvent) => {
                if (pointerEvent.pointerId !== event.pointerId) {
                    return
                }

                cancelDraggedProject()
            },
            pointermove: (pointerEvent: PointerEvent) => {
                if (pointerEvent.pointerId !== event.pointerId) {
                    return
                }

                updateDraggedProjectPosition(pointerEvent.clientX, pointerEvent.clientY)
            },
            pointerup: (pointerEvent: PointerEvent) => {
                if (pointerEvent.pointerId !== event.pointerId) {
                    return
                }

                finishDraggedProject(pointerEvent.clientX, pointerEvent.clientY)
            },
        }

        window.addEventListener("pointermove", dragWindowListenersRef.current.pointermove)
        window.addEventListener("pointerup", dragWindowListenersRef.current.pointerup)
        window.addEventListener("pointercancel", dragWindowListenersRef.current.pointercancel)
        event.preventDefault()
    }

    const updateDraggedProjectPosition = (clientX: number, clientY: number) => {
        const activeDrag = activeDragRef.current

        if (!activeDrag) {
            return
        }

        setDragPreview((currentPreview) => {
            if (!currentPreview) {
                return currentPreview
            }

            return {
                ...currentPreview,
                x: clientX - currentPreview.pointerOffsetX,
                y: clientY - currentPreview.pointerOffsetY,
            }
        })

        const targetCardId = getProjectIdAtPoint(clientX, clientY)

        if (targetCardId === null) {
            return
        }

        setProjectCards((currentCards) => reorderProjects(currentCards, activeDrag.cardId, targetCardId))
    }

    const finishDraggedProject = (clientX: number, clientY: number) => {
        const activeDrag = activeDragRef.current

        if (!activeDrag) {
            return
        }

        const targetCardId = getProjectIdAtPoint(clientX, clientY)

        if (targetCardId !== null && targetCardId !== activeDrag.cardId) {
            setHasCustomProjectOrder(true)
            setProjectCards((currentCards) => reorderProjects(currentCards, activeDrag.cardId, targetCardId))
        }

        clearDragState()
    }

    const cancelDraggedProject = () => {
        if (dragStartOrderRef.current) {
            setProjectCards(dragStartOrderRef.current)
        }

        clearDragState()
    }

    const handleDragKeyDown = (cardId: number) => (event: React.KeyboardEvent<HTMLElement>) => {
        const currentIndex = projectCards.findIndex((card) => card.id === cardId)

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            const nextIndex = currentIndex - 1

            if (currentIndex === -1 || nextIndex < 0) {
                return
            }

            event.preventDefault()
            setHasCustomProjectOrder(true)
            setProjectCards((currentCards) => moveProjectToIndex(currentCards, cardId, nextIndex))
            return
        }

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            const nextIndex = currentIndex + 1

            if (currentIndex === -1 || nextIndex >= projectCards.length) {
                return
            }

            event.preventDefault()
            setHasCustomProjectOrder(true)
            setProjectCards((currentCards) => moveProjectToIndex(currentCards, cardId, nextIndex))
            return
        }

        if (event.key === "Home") {
            if (currentIndex <= 0) {
                return
            }

            event.preventDefault()
            setHasCustomProjectOrder(true)
            setProjectCards((currentCards) => moveProjectToIndex(currentCards, cardId, 0))
            return
        }

        if (event.key === "End") {
            if (currentIndex === -1 || currentIndex >= projectCards.length - 1) {
                return
            }

            event.preventDefault()
            setHasCustomProjectOrder(true)
            setProjectCards((currentCards) => moveProjectToIndex(currentCards, cardId, currentCards.length - 1))
        }
    }

    useEffect(() => {
        if (typeof document === "undefined" || draggedCardId === null) {
            return
        }

        const {body} = document
        const previousCursor = body.style.cursor
        const previousUserSelect = body.style.userSelect

        body.style.cursor = "grabbing"
        body.style.userSelect = "none"

        return () => {
            body.style.cursor = previousCursor
            body.style.userSelect = previousUserSelect
        }
    }, [draggedCardId])

    const draggedCard = draggedCardId === null ? null : projectCards.find((card) => card.id === draggedCardId)

    return (
        <>
            <div className={styles.projects} ref={projectsRef}>
                <div className={styles.projects__intro}>
                    <div className={styles.projects__introLead}>
                        <span className={styles.projects__eyebrow}>Selected work</span>
                        <h2 className={styles["projects__title"]}>Projects</h2>
                    </div>

                    <div className={styles.projects__introCopy}>
                        <p className={`${styles.sub__title} ${styles.projects__subtitle}`} aria-label={PROJECTS_SUBTITLE}>
                            {projectSubtitleLines.map((line) => (
                                <span className={styles.projects__subtitleLine} key={line}>{line}</span>
                            ))}
                        </p>

                        <div className={styles.projects__facts} aria-label="Projects section summary">
                            <span className={styles.projects__fact} style={{"--motion-index": 0} as React.CSSProperties}>
                                <strong>{projectCountLabel}</strong> selected builds
                            </span>
                            <span className={styles.projects__fact} style={{"--motion-index": 1} as React.CSSProperties}>
                                Desktop, CRM, and commerce work
                            </span>
                            <span className={styles.projects__fact} style={{"--motion-index": 2} as React.CSSProperties}>
                                React, TypeScript, and full-stack delivery
                            </span>
                        </div>

                        <div className={styles.projects__marketLinks}>
                            {MARKET_PAGES.map((marketPage, index) => (
                                <Link
                                    key={marketPage.path}
                                    className={styles.projects__marketLink}
                                    style={{"--motion-index": index} as React.CSSProperties}
                                    to={marketPage.path}
                                >
                                    <span className={styles.projects__marketLinkLabel}>{marketPage.marketLabel}</span>
                                    <span className={styles.projects__marketLinkTitle}>{marketPage.title}</span>
                                    <span className={styles.projects__marketLinkCopy}>{marketPage.projectsTeaser}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.projects__deck}>
                    {featuredProject && (
                        <div className={styles.projects__featuredSlot}>
                            <Card
                                card={featuredProject}
                                isPlaceholder={draggedCardId === featuredProject.id}
                                onReorderKeyDown={handleDragKeyDown(featuredProject.id)}
                                onReorderPointerDown={handleDragPointerDown(featuredProject.id)}
                                sequence={getProjectSequenceLabel(0)}
                                variant={featuredProjectVariant}
                            />
                        </div>
                    )}

                    <div className={styles.projects__rail}>
                        {secondaryProjects.map((card, index) => (
                            <div
                                className={`${styles.projects__railItem} ${railItemClassNames[index] ?? ""}`}
                                key={card.id}
                                style={{"--motion-index": index} as React.CSSProperties}
                            >
                                <Card
                                    card={card}
                                    isPlaceholder={draggedCardId === card.id}
                                    onReorderKeyDown={handleDragKeyDown(card.id)}
                                    onReorderPointerDown={handleDragPointerDown(card.id)}
                                    sequence={getProjectSequenceLabel(index + 1)}
                                    variant="compact"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {dragPreview && draggedCard && typeof document !== "undefined"
                ? createPortal(
                    <Card
                        card={draggedCard}
                        isDragOverlay
                        style={{
                            height: dragPreview.height,
                            transform: `translate3d(${dragPreview.x}px, ${dragPreview.y}px, 0) rotate(0.6deg)`,
                            width: dragPreview.width,
                        }}
                        variant={dragPreview.variant}
                    />,
                    document.body
                )
                : null}
        </>
    )
}

export default memo(Projects)
