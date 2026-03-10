import React, {memo, useEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"
import styles from "../sections.module.scss"
import useScrollProgress from "../../hooks/useScrollProgress"
import {Card} from "../../components"
import {PROJECTS_INFO, type CardInfo} from "../../content/projects"

export const PROJECTS_STORAGE_KEY = "vm-projects-order"
export const PROJECTS_CUSTOM_ORDER_STORAGE_KEY = "vm-projects-order-customized"

const DEFAULT_PROJECT_IDS = [4, 3, 1, 2]

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

const getProjectVariant = (cards: CardInfo[], cardId: number): "featured" | "compact" => (cards[0]?.id === cardId ? "featured" : "compact")

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
    const [featuredProject, ...secondaryProjects] = projectCards

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
            variant: getProjectVariant(projectCards, cardId),
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
                <h2 className={styles["projects__title"]}>Projects</h2>
                <p className={styles.sub__title}>Selected work and shipped product experiences.</p>

                <div className={styles.projects__layout}>
                    {featuredProject && (
                        <Card
                            card={featuredProject}
                            isPlaceholder={draggedCardId === featuredProject.id}
                            onReorderKeyDown={handleDragKeyDown(featuredProject.id)}
                            onReorderPointerDown={handleDragPointerDown(featuredProject.id)}
                            variant="featured"
                        />
                    )}

                    <div className={styles.projects__rail}>
                        {secondaryProjects.map((card) => (
                            <Card
                                card={card}
                                isPlaceholder={draggedCardId === card.id}
                                key={card.id}
                                onReorderKeyDown={handleDragKeyDown(card.id)}
                                onReorderPointerDown={handleDragPointerDown(card.id)}
                                variant="compact"
                            />
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
