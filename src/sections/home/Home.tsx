import React, {useRef} from "react"
import {useNavigate} from "react-router-dom"
import styles from "../sections.module.scss"
import homePhoto1280 from "../../assets/img/home/hero-1280.jpg"
import homePhoto2200 from "../../assets/img/home/hero-2200.jpg"
import homePhotoLight1280 from "../../assets/img/home/hero-light-1280.jpg"
import homePhotoLight2200 from "../../assets/img/home/hero-light-2200.jpg"
import {PROFILE} from "../../content/site"
import SocialLinks from "../../components/socialLinks/SocialLinks"
import useScrollProgress from "../../hooks/useScrollProgress"
import {trackResumeClick} from "../../utils/analytics"
import {scrollToSectionId} from "../../utils/scroll"

const RESUME_BUTTON_LABEL = "Resume"
const RESUME_BUTTON_HOVER_LABEL = "Download"
const PORTFOLIO_BUTTON_LABEL = "Portfolio"
const PORTFOLIO_BUTTON_HOVER_LABEL = "GO"

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

    useScrollProgress(homeRef, {mode: "hero", reducedMotionValue: 0, variableName: "--home-progress"})

    const currentPhoto1280 = isLightTheme ? homePhotoLight1280 : homePhoto1280
    const currentPhoto2200 = isLightTheme ? homePhotoLight2200 : homePhoto2200

    return (
        <div className={`${styles.home} ${isLightTheme ? styles.homeLight : ""}`} ref={homeRef}>
            <div className={styles["home__stage"]}>
                <div className={styles["home__media"]} aria-hidden="true">
                    <picture>
                        <img
                            src={currentPhoto2200}
                            srcSet={`${currentPhoto1280} 1280w, ${currentPhoto2200} 2200w`}
                            sizes="100vw"
                            width={2200}
                            height={1506}
                            alt=""
                            aria-hidden="true"
                            decoding="async"
                            className={`${styles["home__backgroundImage"]} ${isLightTheme ? styles["home__backgroundImageLight"] : ""}`}
                            loading="eager"
                        />
                    </picture>
                    <div
                        className={`${styles["home__overlay"]} ${isLightTheme ? styles["home__overlayLight"] : ""}`}
                        aria-hidden="true"
                    />
                </div>

                <div className={styles["home__brand"]} aria-label="Brand logo">
                    <span className={styles["home__brandMark"]}>
                        <span>&lt;</span>
                        <span className={styles["home__brandSlash"]}>/</span>
                        <span>&gt;</span>
                    </span>
                    <span className={styles["home__brandText"]}>VM Portfolio</span>
                </div>

                <div className={styles["home__content"]}>
                    <p className={styles["home__nameTop"]}>{PROFILE.firstName}</p>
                    <h1 className={styles["home__nameBottom"]}>{PROFILE.lastName}</h1>
                    <p className={styles["home__role"]}>{PROFILE.role}</p>
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
