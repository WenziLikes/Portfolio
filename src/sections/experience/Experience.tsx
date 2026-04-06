import React, {memo, useRef} from "react"
import useScrollProgress from "../../hooks/useScrollProgress"
import styles from "../sections.module.scss"
import {EXPERIENCE_TIMELINE} from "../../content/site"

const Experience: React.FC = memo(() => {
    const experienceRef = useRef<HTMLDivElement>(null)

    useScrollProgress(experienceRef)

    return (
        <div className={styles.experience} ref={experienceRef}>
            <h2 className={styles["experience__title"]}>Experience</h2>
            <p className={styles["sub__title"]}>Selected React, TypeScript, frontend, and full stack work across product delivery.</p>
            <div className={styles["experience__timeline"]}>
                {EXPERIENCE_TIMELINE.map((item, index) => (
                    <article
                        key={`${item.company}-${item.period}`}
                        className={styles["experience__item"]}
                        style={{"--index": index} as React.CSSProperties}
                    >
                        <div className={styles["experience__node"]} aria-hidden="true">
                            <span className={styles["experience__dot"]}/>
                        </div>

                        <div className={styles["experience__meta"]}>
                            <span className={styles["experience__period"]}>{item.period}</span>
                            <h4 className={styles["experience__company"]}>{item.company}</h4>
                        </div>

                        <div className={styles["experience__body"]}>
                            <h3 className={styles["experience__role"]}>{item.role}</h3>
                            <p className={styles["experience__description"]}>{item.description}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
})

export default Experience
