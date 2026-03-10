import React, {memo, useRef} from "react"
import useScrollProgress from "../../hooks/useScrollProgress"
import styles from "../sections.module.scss"
import {VM} from "../../components"
import {ABOUT_COPY, ABOUT_PRINCIPLES, ABOUT_STACK} from "../../content/site"

const About: React.FC = memo(() => {
    const aboutRef = useRef<HTMLDivElement>(null)

    useScrollProgress(aboutRef)

    return (
        <div className={styles.about} ref={aboutRef}>
            <VM/>
            <div className={styles["about__panel"]}>
                <div className={styles["about__main"]}>
                    <div className={styles["about__copy"]}>
                        <span className={styles["about__eyebrow"]}>About</span>
                        <h2 className={styles["about__title"]}>About Me</h2>
                        <p className={styles["about__lead"]}>{ABOUT_COPY.intro}</p>
                        <div className={styles["about__content"]}>
                            {ABOUT_COPY.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    <div className={styles["about__principles"]}>
                        {ABOUT_PRINCIPLES.map((item) => (
                            <div className={styles["about__principle"]} key={item.title}>
                                <span className={styles["about__principleTitle"]}>{item.title}</span>
                                <p className={styles["about__principleText"]}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles["about__rail"]}>
                    <div className={styles["about__note"]}>
                        <span className={styles["about__noteLabel"]}>Core stack</span>
                        <p className={styles["about__noteText"]}>{ABOUT_STACK.join(" / ")}</p>
                    </div>

                    <div className={styles["about__quote"]}>
                        <span className={styles["about__quoteLabel"]}>Approach</span>
                        <p>{ABOUT_COPY.quote}</p>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default About
