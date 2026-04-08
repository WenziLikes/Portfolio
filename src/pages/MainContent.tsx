import React, {useEffect, useRef} from "react"
import {About, Experience, Expertise, Home, Projects} from "../sections"
import {useLocation, useNavigate} from "react-router-dom"
import {getSectionIdFromPath, getSectionPath} from "../constants/navigation"
import {MAIN_SECTIONS, type MainSectionId} from "../content/site"
import useMediaQuery from "../hooks/useMediaQuery"
import {getMainContentElement} from "../utils/scroll"

interface MainContentProps {
    theme: "dark" | "light"
}

const ROUTE_SYNC_SETTLE_MS = 350
const COMPACT_ROUTE_SYNC_QUERY = "(max-width: 760px)"

const renderSectionContent = (sectionId: MainSectionId, theme: "dark" | "light") => {
    switch (sectionId) {
        case "home":
            return <Home theme={theme}/>
        case "about":
            return <About/>
        case "expertise":
            return <Expertise/>
        case "experience":
            return <Experience/>
        case "projects":
            return <Projects/>
        default:
            return null
    }
}

const MainContent: React.FC<MainContentProps> = ({theme}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const sections = useRef<(HTMLElement | null)[]>([])
    const isCompactViewport = useMediaQuery(COMPACT_ROUTE_SYNC_QUERY)

    useEffect(() => {
        const contentRoot = getMainContentElement()
        const observerActivationTime = window.performance.now() + ROUTE_SYNC_SETTLE_MS

        const observer = new IntersectionObserver(
            (entries) => {
                if (window.performance.now() < observerActivationTime) {
                    return
                }

                const [visibleSection] = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)

                if (!visibleSection) {
                    return
                }

                const nextSectionId = visibleSection.target.id as MainSectionId
                const currentSectionId = getSectionIdFromPath(location.pathname)
                const sectionPath = getSectionPath(nextSectionId)

                if (currentSectionId !== nextSectionId) {
                    navigate(sectionPath, {replace: true})
                }
            },
            {
                root: contentRoot,
                threshold: isCompactViewport ? 0.35 : 0.6,
            }
        )

        const currentSections = sections.current

        currentSections.forEach((section) => {
            if (section) {
                observer.observe(section)
            }
        })

        return () => {
            currentSections.forEach((section) => {
                if (section) {
                    observer.unobserve(section)
                }
            })
        }
    }, [isCompactViewport, location.pathname, navigate])

    return (
        <>
            {MAIN_SECTIONS.map((section, index) => (
                <section key={section.id} id={section.id} ref={(el) => (sections.current[index] = el)}>
                    {renderSectionContent(section.id, theme)}
                </section>
            ))}
        </>
    )
}

export default MainContent
