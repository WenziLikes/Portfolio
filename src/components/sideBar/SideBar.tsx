import React, {useEffect, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import styles from "./SideBar.module.scss"
import {EXTERNAL_NAV_LINKS, MAIN_SECTIONS, PROFILE, type MainSectionId} from "../../content/site"
import {getSectionIdFromPath, getSectionPath} from "../../constants/navigation"
import SocialLinks from "../socialLinks/SocialLinks"
import {scrollToSectionId} from "../../utils/scroll"

interface SideBarProps {
    setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>
    theme: "dark" | "light"
}

const DESKTOP_SIDEBAR_STORAGE_KEY = "portfolio-sidebar-collapsed"

const SECTION_ICON_PATHS: Record<MainSectionId, string> = {
    about: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6.4 8a6.4 6.4 0 0 1 12.8 0 .6.6 0 0 1-.6.6H6.2a.6.6 0 0 1-.6-.6Z",
    experience: "M9.25 4.5a1.25 1.25 0 0 1 1.25-1.25h3a1.25 1.25 0 0 1 1.25 1.25V6h3a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 17.75 18h-11A1.75 1.75 0 0 1 5 16.25v-8.5A1.75 1.75 0 0 1 6.75 6h2.5Zm1.25 0V6h3V4.5h-3Zm-3.75 3a.25.25 0 0 0-.25.25V10h4v-.75a.75.75 0 0 1 1.5 0V10h4v-.75a.75.75 0 0 1 1.5 0V10h1.25V7.75a.25.25 0 0 0-.25-.25h-11Zm11 4h-1.25v.75a.75.75 0 0 1-1.5 0v-.75h-4v.75a.75.75 0 0 1-1.5 0v-.75h-4v4.75c0 .14.11.25.25.25h11c.14 0 .25-.11.25-.25V11.5Z",
    home: "M4.5 10.5 12 4l7.5 6.5v8a1 1 0 0 1-1 1h-4.25v-5.5h-4.5V19.5H5.5a1 1 0 0 1-1-1v-8Z",
    projects: "M4.5 6.75A1.75 1.75 0 0 1 6.25 5h3.1c.33 0 .65.13.88.37l1.15 1.13c.23.24.55.37.88.37h5.49a1.75 1.75 0 0 1 1.75 1.75v8.13a1.75 1.75 0 0 1-1.75 1.75H6.25A1.75 1.75 0 0 1 4.5 16.75v-10Z",
}

const EXTERNAL_NAV_ICON_PATHS = {
    "vm-studio": "M8 5.75A2.25 2.25 0 0 1 10.25 3.5h8A2.25 2.25 0 0 1 20.5 5.75v8A2.25 2.25 0 0 1 18.25 16h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 0 .75-.75v-8a.75.75 0 0 0-.75-.75h-8a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 1-1.5 0v-1.5ZM13.47 9.47a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H4.75a.75.75 0 0 1 0-1.5h10.44l-1.72-1.72a.75.75 0 0 1 0-1.06Z",
} as const

const THEME_ICON_PATHS: Record<"dark" | "light", string> = {
    dark: "M14.8 3.2a.75.75 0 0 1 .86.96A7.25 7.25 0 1 0 19.84 13a.75.75 0 0 1 .96.86 8.75 8.75 0 1 1-6.96-10.66.75.75 0 0 1 .96 0Z",
    light: "M12 3.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4a.75.75 0 0 1 .75-.75Zm0 13a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm8-4.25a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM6.25 12a.75.75 0 0 1-.75.75H4a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75Zm10.17-5.42a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM5.46 17.54a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L5.46 18.6a.75.75 0 0 1 0-1.06Zm0-9.9a.75.75 0 0 1 0-1.06L6.52 5.52a.75.75 0 0 1 1.06 1.06L6.52 7.64a.75.75 0 0 1-1.06 0Zm10.96 9.9a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Z",
}

const renderIcon = (path: string, className: string) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d={path}/>
    </svg>
)

const getInitialDesktopSidebarCollapsed = () => {
    if (typeof window === "undefined") {
        return false
    }

    try {
        return window.localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY) === "true"
    } catch {
        return false
    }
}

const SideBar: React.FC<SideBarProps> = ({setTheme, theme}) => {
    const [activeSection, setActiveSection] = useState<string>("home")
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true)
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(getInitialDesktopSidebarCollapsed)
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
        try {
            window.localStorage.setItem(DESKTOP_SIDEBAR_STORAGE_KEY, String(isDesktopSidebarCollapsed))
        } catch {
            // Ignore unavailable storage; the layout still updates for this session.
        }
    }, [isDesktopSidebarCollapsed])

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

    const nextTheme = theme === "dark" ? "light" : "dark"

    const handleThemeSelect = (nextSelectedTheme: "dark" | "light") => {
        if (nextSelectedTheme === theme) {
            return
        }

        setTheme(nextSelectedTheme)
    }

    const handleThemeToggle = () => {
        setTheme(nextTheme)
    }

    const handleScrollToSection = (sectionId: string) => {
        setActiveSection(sectionId)
        navigate(getSectionPath(sectionId as "home" | "about" | "experience" | "projects"), {replace: true})
        scrollToSectionId(sectionId, isMobileViewport ? "auto" : "smooth")
        setIsMobileMenuOpen(false)
    }

    const handleDesktopSidebarToggle = () => {
        if (isMobileViewport) {
            return
        }

        setIsDesktopSidebarCollapsed((currentState) => !currentState)
    }

    const homeSection = MAIN_SECTIONS.find((section) => section.id === "home")
    const secondarySections = MAIN_SECTIONS.filter((section) => section.id !== "home")
    const mobileMenuId = "portfolio-mobile-navigation"
    const isHomePath = location.pathname === "/" || location.pathname === "/home"
    const isMobileBarVisible = !isMobileViewport || !isHomePath || mobileContentScrollTop > 12 || isMobileMenuOpen
    const routeSectionId = getSectionIdFromPath(location.pathname) ?? "home"
    const isRouteMainSection = MAIN_SECTIONS.some((section) => section.id === routeSectionId)
    const highlightedSection = isRouteMainSection && routeSectionId !== "home" ? routeSectionId : activeSection
    const isDesktopCompact = !isMobileViewport && isDesktopSidebarCollapsed
    const initials = `${PROFILE.firstName.charAt(0)}${PROFILE.lastName.charAt(0)}`
    const renderThemeSwitcher = (extraClassName?: string) => (
        <div
            className={extraClassName ? `${styles.themeSwitch} ${extraClassName}` : styles.themeSwitch}
            data-mode={theme}
            role="group"
            aria-label="Theme switcher"
        >
            <button
                type="button"
                className={`${styles.themeCard} ${theme === "dark" ? styles.themeCardActive : ""}`}
                data-tone="dark"
                onClick={() => handleThemeSelect("dark")}
                aria-pressed={theme === "dark"}
                aria-label="Switch to dark theme"
                title={isDesktopCompact ? "Dark theme" : undefined}
            >
                <span className={styles.themeCardIcon} aria-hidden="true">
                    {renderIcon(THEME_ICON_PATHS.dark, styles.themeIconSvg)}
                </span>
                <span className={styles.themeCardTitle}>Dark</span>
            </button>

            <button
                type="button"
                className={`${styles.themeCard} ${theme === "light" ? styles.themeCardActive : ""}`}
                data-tone="light"
                onClick={() => handleThemeSelect("light")}
                aria-pressed={theme === "light"}
                aria-label="Switch to light theme"
                title={isDesktopCompact ? "Light theme" : undefined}
            >
                <span className={styles.themeCardIcon} aria-hidden="true">
                    {renderIcon(THEME_ICON_PATHS.light, styles.themeIconSvg)}
                </span>
                <span className={styles.themeCardTitle}>Light</span>
            </button>
        </div>
    )

    return (
        <section
            className={`portfolio-sidebar ${styles.sidebar} ${isDesktopCompact ? `portfolio-sidebar--compact ${styles.sidebarCompact}` : ""} ${isSidebarVisible ? "portfolio-sidebar--visible" : `portfolio-sidebar--hidden ${styles.hidden}`} ${isMobileViewport ? styles.sidebarMobile : ""}`}
        >
            {!isMobileViewport ? (
                <button
                    type="button"
                    className={styles.themeToggleFloating}
                    data-mode={theme}
                    onClick={handleThemeToggle}
                    aria-label={`Switch to ${nextTheme} theme`}
                    title={`Switch to ${nextTheme} theme`}
                >
                    <span className={styles.themeToggleIconWrap} aria-hidden="true">
                        {renderIcon(theme === "dark" ? THEME_ICON_PATHS.dark : THEME_ICON_PATHS.light, styles.themeToggleIcon)}
                    </span>
                    <span className={styles.themeToggleText}>{theme === "dark" ? "Dark" : "Light"}</span>
                </button>
            ) : null}

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

                <div className={styles.mobileBarActions}>
                    {!isMobileMenuOpen ? renderThemeSwitcher(styles.mobileThemeSwitch) : null}

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
            </div>

            <button
                type="button"
                className={`${styles.mobileBackdrop} ${isMobileMenuOpen ? styles.mobileBackdropVisible : ""}`}
                aria-hidden={!isMobileViewport || !isMobileMenuOpen}
                tabIndex={isMobileViewport && isMobileMenuOpen ? 0 : -1}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <button
                type="button"
                className={styles.desktopCollapseButton}
                data-mode={isDesktopCompact ? "mini" : "full"}
                onClick={handleDesktopSidebarToggle}
                aria-pressed={isDesktopCompact}
                aria-label={isDesktopCompact ? "Expand sidebar" : "Collapse sidebar"}
                title={isDesktopCompact ? "Expand sidebar" : "Collapse sidebar"}
            >
                <span className={styles.desktopCollapseBurger} aria-hidden="true">
                    <span className={styles.desktopCollapseLine}/>
                    <span className={styles.desktopCollapseLine}/>
                    <span className={styles.desktopCollapseLine}/>
                </span>
            </button>

            <div
                id={mobileMenuId}
                className={`${styles.sidebarPanel} ${isMobileMenuOpen ? styles.sidebarPanelOpen : ""}`}
                aria-hidden={isMobileViewport ? !isMobileMenuOpen : undefined}
            >
                <div className={styles.header}>
                    <div className={styles.profile}>
                        <div className={styles.profileHeader}>
                            <div className={styles.brandLockup}>
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
                                        <span className={styles.compactBrandMark} aria-hidden="true">
                                            {Array.from(initials).map((letter, index) => (
                                                <span className={styles.compactBrandLetter} key={`${letter}-${index}`}>{letter}</span>
                                            ))}
                                        </span>
                                        <span className={styles.logoText}>
                                            &lt; {PROFILE.fullName}
                                            <span className={styles.color__blue}>
                                                <span className={styles.logoSlash}>/</span>
                                                <span>&gt;</span>
                                            </span>
                                        </span>
                                    </a>
                                </h1>
                            </div>
                        </div>
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
                                                aria-label={homeSection.label}
                                                aria-current={highlightedSection === homeSection.id ? "location" : undefined}
                                                title={isDesktopCompact ? homeSection.label : undefined}
                                            >
                                                <span className={styles.navItemIcon} aria-hidden="true">
                                                    {renderIcon(SECTION_ICON_PATHS[homeSection.id], styles.navIconSvg)}
                                                </span>
                                                <span className={styles.navItemLabel}>{homeSection.label}</span>
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
                                                aria-label={section.label}
                                                aria-current={highlightedSection === section.id ? "location" : undefined}
                                                title={isDesktopCompact ? section.label : undefined}
                                            >
                                                <span className={styles.navItemIcon} aria-hidden="true">
                                                    {renderIcon(SECTION_ICON_PATHS[section.id], styles.navIconSvg)}
                                                </span>
                                                <span className={styles.navItemLabel}>{section.label}</span>
                                            </a>
                                        </li>
                                    ))}
                                    {EXTERNAL_NAV_LINKS.map((link) => (
                                        <li key={link.id} className={styles.navItemStudioGroup}>
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className={styles.navItem}
                                                aria-label={link.label}
                                                title={isDesktopCompact ? link.label : undefined}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <span className={styles.navItemIcon} aria-hidden="true">
                                                    {renderIcon(EXTERNAL_NAV_ICON_PATHS[link.id], styles.navIconSvg)}
                                                </span>
                                                <span className={styles.navItemLabel}>{link.displayTitle}</span>
                                            </a>
                                            {link.subtitle ? (
                                                <span className={styles.navItemStudioSubtitle}>{link.subtitle}</span>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>

                        {isMobileViewport ? (
                            <div className={styles.themeBlock}>
                                <span className={styles.themeLabel}>Theme</span>
                                {renderThemeSwitcher()}
                            </div>
                        ) : null}
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
