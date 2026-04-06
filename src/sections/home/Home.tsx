import React, {useEffect, useRef, useState} from "react"
import {useNavigate} from "react-router-dom"
import styles from "../sections.module.scss"
import heroImage2 from "../../assets/img/home/image2.png"
import {PROFILE} from "../../content/site"
import SocialLinks from "../../components/socialLinks/SocialLinks"
import useScrollProgress from "../../hooks/useScrollProgress"
import {trackResumeClick} from "../../utils/analytics"
import {scrollToSectionId} from "../../utils/scroll"

const RESUME_BUTTON_LABEL = "Resume"
const RESUME_BUTTON_HOVER_LABEL = "Download"
const PORTFOLIO_BUTTON_LABEL = "Portfolio"
const PORTFOLIO_BUTTON_HOVER_LABEL = "GO"
const HERO_EYEBROW = "Full Stack Developer"
const HERO_HEADLINE = "React, TypeScript, and dependable product engineering."
const HERO_HEADLINE_LINES = ["React, TypeScript,", "and dependable product engineering."]
const HERO_PILLS = ["React & TypeScript", "Frontend systems", "Production-ready builds"]
const HERO_STATEMENT_LINES = ["Clean", "UI", "Solid", "Code", "Ready", "To Ship"]
const HERO_STATEMENT_LINES_MOBILE_LIGHT = ["CLEAN UI", "SOLID CODE", "READY TO SHIP"]
const MOBILE_LIGHT_STATEMENT_QUERY = "(max-width: 760px)"

const getIsMobileLightStatementLayout = (): boolean => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false
    }

    return window.matchMedia(MOBILE_LIGHT_STATEMENT_QUERY).matches
}

interface AnimatedButtonLabelProps {
    primaryLabel: string
    secondaryLabel: string
}

const AnimatedButtonLabel: React.FC<AnimatedButtonLabelProps> = ({primaryLabel, secondaryLabel}) => {
    return (
        <span className={styles["home__buttonLabelStack"]} aria-hidden="true">
            <span className={`${styles["home__buttonLabel"]} ${styles["home__buttonLabelPrimary"]}`}>{primaryLabel}</span>
            <span className={`${styles["home__buttonLabel"]} ${styles["home__buttonLabelSecondary"]}`}>{secondaryLabel}</span>
        </span>
    )
}

interface HomeProps {
    theme: "dark" | "light"
}

const Home: React.FC<HomeProps> = ({theme}) => {
    const navigate = useNavigate()
    const homeRef = useRef<HTMLDivElement>(null)
    const isLightTheme = theme === "light"
    const [isMobileLightStatementLayout, setIsMobileLightStatementLayout] = useState(getIsMobileLightStatementLayout)
    const isLightMobileStatement = isLightTheme && isMobileLightStatementLayout
    const heroStatementLines = isLightMobileStatement ? HERO_STATEMENT_LINES_MOBILE_LIGHT : HERO_STATEMENT_LINES

    useScrollProgress(homeRef, {mode: "hero", reducedMotionValue: 0, variableName: "--home-progress"})

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return
        }

        const mediaQuery = window.matchMedia(MOBILE_LIGHT_STATEMENT_QUERY)
        const updateViewportState = (matches: boolean) => {
            setIsMobileLightStatementLayout(matches)
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

    return (
        <div className={`${styles.home} ${isLightTheme ? styles.homeLight : ""}`} ref={homeRef}>
            <div className={styles["home__stage"]}>
                <div className={styles["home__media"]} aria-hidden="true">
                    {!isLightTheme ? (
                        <img
                            src={heroImage2}
                            alt=""
                            width={1024}
                            height={1024}
                            decoding="async"
                            className={styles["home__backgroundGraphic"]}
                            loading="eager"
                        />
                    ) : null}
                </div>

                <div className={styles["home__brand"]} aria-label="Brand logo">
                    <span className={styles["home__brandMark"]}>
                        <span>&lt;</span>
                        <span className={styles["home__brandSlash"]}>/</span>
                        <span>&gt;</span>
                    </span>
                    <span className={styles["home__brandText"]}>VM Portfolio</span>
                </div>

                {isLightMobileStatement ? (
                    <div className={styles["home__mobileVisual"]} aria-hidden="true">
                        <div className={styles["home__statement"]}>
                            {heroStatementLines.map((line) => (
                                <span key={line} className={styles["home__statementLine"]}>{line}</span>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className={styles["home__layout"]}>
                    <div className={styles["home__content"]}>
                        <span className={styles["home__eyebrow"]}>{HERO_EYEBROW}</span>
                        <h1 className={styles["home__name"]}>
                            <span className={styles["home__nameTop"]}>{PROFILE.firstName}</span>
                            <span className={styles["home__nameBottom"]}>{PROFILE.lastName}</span>
                        </h1>
                        <p className={styles["home__role"]}>{PROFILE.role}</p>
                        <p className={styles["home__headline"]} aria-label={HERO_HEADLINE}>
                            {HERO_HEADLINE_LINES.map((line, index) => (
                                <span className={styles["home__headlineLine"]} key={line}>
                                    {line}
                                    {index < HERO_HEADLINE_LINES.length - 1 ? " " : null}
                                </span>
                            ))}
                        </p>
                        <p className={styles["home__description"]}>{PROFILE.summary}</p>
                        <div className={styles["home__pillRow"]} aria-label="Core strengths">
                            {HERO_PILLS.map((pill) => (
                                <span className={styles["home__pill"]} key={pill}>{pill}</span>
                            ))}
                        </div>
                        <p className={styles["home__summary"]}>
                            <span className={styles["home__summaryDot"]} aria-hidden="true"/>
                            {PROFILE.availability}
                        </p>

                        <div className={styles["home__actions"]}>
                            <button
                                type="button"
                                className={`${styles["home__button"]} ${styles["home__buttonGhost"]} ${styles["home__buttonSwap"]}`}
                                onClick={() => {
                                    trackResumeClick("open_route", "home_hero")
                                    navigate("/resume")
                                }}
                                aria-label="Resume"
                            >
                                <AnimatedButtonLabel
                                    primaryLabel={RESUME_BUTTON_LABEL}
                                    secondaryLabel={RESUME_BUTTON_HOVER_LABEL}
                                />
                            </button>
                            <button
                                type="button"
                                className={`${styles["home__button"]} ${styles["home__buttonGhost"]} ${styles["home__buttonSwap"]}`}
                                onClick={() => scrollToSectionId("projects")}
                                aria-label="Portfolio"
                            >
                                <AnimatedButtonLabel
                                    primaryLabel={PORTFOLIO_BUTTON_LABEL}
                                    secondaryLabel={PORTFOLIO_BUTTON_HOVER_LABEL}
                                />
                            </button>
                        </div>
                    </div>

                    {!isLightMobileStatement ? (
                        <div className={styles["home__visual"]} aria-hidden="true">
                            <div className={styles["home__statement"]}>
                                {heroStatementLines.map((line) => (
                                    <span key={line} className={styles["home__statementLine"]}>{line}</span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>

                <SocialLinks
                    eventSource="home_social_links"
                    iconClassName={styles["home__socialIcon"]}
                    linkClassName={styles["home__socialLink"]}
                    listClassName={styles["home__socials"]}
                />

                <button type="button" className={styles["home__scroll"]} onClick={() => scrollToSectionId("about")}>
                    Scroll
                    <span aria-hidden="true">↓</span>
                </button>
            </div>
        </div>
    )
}

export default Home
