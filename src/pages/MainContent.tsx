import React, {useEffect, useRef} from "react"
import {About, Experience, Home, Projects} from "../sections"
import {useLocation, useNavigate} from "react-router-dom"
import {getSectionIdFromPath, getSectionPath} from "../constants/navigation"
import {getMainContentElement} from "../utils/scroll"

interface MainContentProps {
    theme: "dark" | "light"
}

const MainContent: React.FC<MainContentProps> = ({theme}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const sections = useRef<(HTMLElement | null)[]>([])

    useEffect(() => {
        const isCompactViewport = window.matchMedia("(max-width: 760px)").matches
        const contentRoot = getMainContentElement()

        const observer = new IntersectionObserver(
            (entries) => {
                const [visibleSection] = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)

                if (!visibleSection) {
                    return
                }

                const nextSectionId = visibleSection.target.id
                const currentSectionId = getSectionIdFromPath(location.pathname)
                const sectionPath = getSectionPath(nextSectionId as "home" | "about" | "experience" | "projects")

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
    }, [location.pathname, navigate])

    return (
        <>
            <section id="home" ref={(el) => (sections.current[0] = el)}>
                <Home theme={theme}/>
            </section>
            <section id="about" ref={(el) => (sections.current[1] = el)}>
                <About/>
            </section>
            <section id="experience" ref={(el) => (sections.current[2] = el)}>
                <Experience/>
            </section>
            <section id="projects" ref={(el) => (sections.current[3] = el)}>
                <Projects/>
            </section>
        </>
    )
}

export default MainContent
