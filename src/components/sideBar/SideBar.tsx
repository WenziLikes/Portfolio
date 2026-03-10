import React, {useEffect, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import styles from "./SideBar.module.scss"
import {MAIN_SECTIONS, PROFILE} from "../../content/site"
import {getSectionIdFromPath, getSectionPath} from "../../constants/navigation"
import SocialLinks from "../socialLinks/SocialLinks"
import {scrollToSectionId} from "../../utils/scroll"

interface SideBarProps {
    setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>
    theme: "dark" | "light"
}

const SideBar: React.FC<SideBarProps> = ({setTheme, theme}) => {
    const [activeSection, setActiveSection] = useState<string>("home")
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false)
    const [mobileContentScrollTop, setMobileContentScrollTop] = useState<number>(0)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1080px)")

        const updateViewportState = (matches: boolean) => {
            setIsMobileViewport(matches)
            if (!matches) {
                setIsMobileMenuOpen(false)
            }
        }

        updateViewportState(mediaQuery.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            updateViewportState(event.matches)
        }

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleChange)

            return () => {
                mediaQuery.removeEventListener("change", handleChange)
            }
        }

        mediaQuery.addListener(handleChange)

        return () => {
            mediaQuery.removeListener(handleChange)
        }
    }, [])

    useEffect(() => {
        const className = "mobile-nav-open"
        const shouldLockScroll = isMobileViewport && isMobileMenuOpen

        document.body.classList.toggle(className, shouldLockScroll)

        return () => {
            document.body.classList.remove(className)
        }
    }, [isMobileMenuOpen, isMobileViewport])

    useEffect(() => {
        if (!isMobileViewport) {
            setMobileContentScrollTop(0)
            return
        }

        const content = document.querySelector("main.content") as HTMLElement | null
        if (!content) {
            return
        }

        let animationFrameId: number | null = null

        const updateScrollState = () => {
            const nextScrollTop = content.scrollTop
            const activationLine = nextScrollTop + content.clientHeight * 0.28
            let nextActiveSection = "home"

            MAIN_SECTIONS.forEach((section) => {
                const sectionElement = document.getElementById(section.id)
                if (sectionElement && sectionElement.offsetTop <= activationLine) {
                    nextActiveSection = section.id
                }
            })

            setMobileContentScrollTop((currentScrollTop) => (
                Math.abs(currentScrollTop - nextScrollTop) > 0.5 ? nextScrollTop : currentScrollTop
            ))
            setActiveSection((currentSection) => (currentSection === nextActiveSection ? currentSection : nextActiveSection))
        }

        updateScrollState()

        const handleScroll = () => {
            if (animationFrameId !== null) {
                return
            }

            animationFrameId = window.requestAnimationFrame(() => {
                animationFrameId = null
                updateScrollState()
            })
        }

        content.addEventListener("scroll", handleScroll, {passive: true})

        return () => {
            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId)
            }
            content.removeEventListener("scroll", handleScroll)
        }
    }, [isMobileViewport])

    useEffect(() => {
        if (!isMobileViewport) {
            return
        }

        const content = document.querySelector("main.content") as HTMLElement | null
        if (!content) {
            return
        }

        const animationFrameId = window.requestAnimationFrame(() => {
            setMobileContentScrollTop(content.scrollTop)
        })

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [isMobileViewport, location.pathname])

    useEffect(() => {
        const sectionId = getSectionIdFromPath(location.pathname) ?? "home"
        const isMainSection = MAIN_SECTIONS.some((section) => section.id === sectionId)
        const shouldShowDesktopSidebar = sectionId !== "home" && location.pathname !== "/resume"

        setActiveSection(isMainSection ? sectionId : "home")
        setIsSidebarVisible(isMobileViewport ? isMainSection : shouldShowDesktopSidebar)
        setIsMobileMenuOpen(false)
    }, [isMobileViewport, location.pathname])

    const handleThemeSelect = (nextTheme: "dark" | "light") => {
        if (nextTheme === theme) {
            return
        }

        setTheme(nextTheme)
    }

    const handleScrollToSection = (sectionId: string) => {
        setActiveSection(sectionId)
        navigate(getSectionPath(sectionId as "home" | "about" | "experience" | "projects"), {replace: true})
        scrollToSectionId(sectionId, isMobileViewport ? "auto" : "smooth")
        setIsMobileMenuOpen(false)
    }

    const homeSection = MAIN_SECTIONS.find((section) => section.id === "home")
    const secondarySections = MAIN_SECTIONS.filter((section) => section.id !== "home")
    const mobileMenuId = "portfolio-mobile-navigation"
    const isHomePath = location.pathname === "/" || location.pathname === "/home"
    const isMobileBarVisible = !isMobileViewport || !isHomePath || mobileContentScrollTop > 12 || isMobileMenuOpen
    const routeSectionId = getSectionIdFromPath(location.pathname) ?? "home"
    const isRouteMainSection = MAIN_SECTIONS.some((section) => section.id === routeSectionId)
    const highlightedSection = isRouteMainSection && routeSectionId !== "home" ? routeSectionId : activeSection

    return (
        <section
            className={`portfolio-sidebar ${styles.sidebar} ${isSidebarVisible ? "portfolio-sidebar--visible" : `portfolio-sidebar--hidden ${styles.hidden}`} ${isMobileViewport ? styles.sidebarMobile : ""}`}
        >
            <div className={`${styles.mobileBar} ${isMobileBarVisible ? styles.mobileBarVisible : styles.mobileBarHidden}`}>
                <button
                    type="button"
                    className={styles.mobileLogo}
                    onClick={() => handleScrollToSection("home")}
                    aria-label="Go to Home section"
                >
                    <span className={styles.mobileLogoMark}>
                        <span>&lt;</span>
                        <span className={styles.logoSlash}>/</span>
                        <span>&gt;</span>
                    </span>
                    <span className={styles.mobileLogoText}>VM Portfolio</span>
                </button>

                <button
                    type="button"
                    className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.mobileMenuButtonOpen : ""}`}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls={mobileMenuId}
                    aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    onClick={() => setIsMobileMenuOpen((currentState) => !currentState)}
                >
                    <span className={styles.mobileMenuLine}/>
                    <span className={styles.mobileMenuLine}/>
                    <span className={styles.mobileMenuLine}/>
                </button>
            </div>

            <button
                type="button"
                className={`${styles.mobileBackdrop} ${isMobileMenuOpen ? styles.mobileBackdropVisible : ""}`}
                aria-hidden={!isMobileViewport || !isMobileMenuOpen}
                tabIndex={isMobileViewport && isMobileMenuOpen ? 0 : -1}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                id={mobileMenuId}
                className={`${styles.sidebarPanel} ${isMobileMenuOpen ? styles.sidebarPanelOpen : ""}`}
                aria-hidden={isMobileViewport ? !isMobileMenuOpen : undefined}
            >
                <div className={styles.header}>
                    <div className={styles.profile}>
                        <h1 className={styles.name}>
                            <a
                                href="/home"
                                className={styles.logoLink}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleScrollToSection("home")
                                }}
                                aria-label="Go to Home section"
                            >
                                &lt; {PROFILE.fullName}
                                <span className={styles.color__blue}>
                                    <span className={styles.logoSlash}>/</span>
                                    <span>&gt;</span>
                                </span>
                            </a>
                        </h1>
                        <h2 className={styles.role}>{PROFILE.role}</h2>
                    </div>

                    <div className={styles.navBlock}>
                        <nav className={styles.nav} aria-label="Section navigation">
                            <div className={styles.navLayout}>
                                {homeSection && (
                                    <ul className={styles.navTop}>
                                        <li key={homeSection.id}>
                                            <a
                                                href={`/${homeSection.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleScrollToSection(homeSection.id)
                                                }}
                                                className={
                                                    highlightedSection === homeSection.id
                                                        ? `${styles.navItem} ${styles.active}`
                                                        : styles.navItem
                                                }
                                                aria-current={highlightedSection === homeSection.id ? "location" : undefined}
                                            >
                                                {homeSection.label}
                                            </a>
                                        </li>
                                    </ul>
                                )}

                                <ul className={styles.navBottom}>
                                    {secondarySections.map((section) => (
                                        <li key={section.id}>
                                            <a
                                                href={`/${section.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleScrollToSection(section.id)
                                                }}
                                                className={
                                                    highlightedSection === section.id
                                                        ? `${styles.navItem} ${styles.active}`
                                                        : styles.navItem
                                                }
                                                aria-current={highlightedSection === section.id ? "location" : undefined}
                                            >
                                                {section.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>

                        <div className={styles.themeBlock}>
                            <span className={styles.themeLabel}>Theme</span>
                            <div
                                className={styles.themeSwitch}
                                data-mode={theme}
                                role="group"
                                aria-label="Theme switcher"
                            >
                                <button
                                    type="button"
                                    className={`${styles.themeCard} ${styles.themeCardDark} ${theme === "dark" ? styles.themeCardActive : ""}`}
                                    onClick={() => handleThemeSelect("dark")}
                                    aria-pressed={theme === "dark"}
                                >
                                    <span className={styles.themeCardTitle}>Dark</span>
                                </button>

                                <button
                                    type="button"
                                    className={`${styles.themeCard} ${styles.themeCardLight} ${theme === "light" ? styles.themeCardActive : ""}`}
                                    onClick={() => handleThemeSelect("light")}
                                    aria-pressed={theme === "light"}
                                >
                                    <span className={styles.themeCardTitle}>Light</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contacts}>
                        <SocialLinks
                            eventSource="sidebar_social_links"
                            iconClassName={styles.contactIcon}
                            itemClassName={undefined}
                            linkClassName={styles.contactLink}
                            listClassName={styles.contactsList}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SideBar
