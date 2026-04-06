import React, {memo, useRef} from "react"
import useScrollProgress from "../../hooks/useScrollProgress"
import styles from "../sections.module.scss"
import {EXPERTISE_COPY, EXPERTISE_ITEMS, EXPERTISE_SIGNALS} from "../../content/site"

const Expertise: React.FC = memo(() => {
    const expertiseRef = useRef<HTMLDivElement>(null)

    useScrollProgress(expertiseRef)

    return (
        <div className={styles.expertise} ref={expertiseRef}>
            <div className={styles["expertise__header"]}>
                <div className={styles["expertise__lead"]}>
                    <span className={styles["expertise__eyebrow"]}>{EXPERTISE_COPY.eyebrow}</span>
                    <h2 className={styles["expertise__title"]}>{EXPERTISE_COPY.title}</h2>
                    <p className={styles["sub__title"]}>{EXPERTISE_COPY.lead}</p>
                </div>

                <div className={styles["expertise__aside"]}>
                    <p className={styles["expertise__summary"]}>{EXPERTISE_COPY.summary}</p>
                    <ul className={styles["expertise__signals"]} aria-label="Core expertise themes">
                        {EXPERTISE_SIGNALS.map((signal) => (
                            <li key={signal} className={styles["expertise__signal"]}>
                                {signal}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles["expertise__grid"]}>
                {EXPERTISE_ITEMS.map((item) => (
                    <article key={item.title} className={styles["expertise__card"]}>
                        <span className={styles["expertise__cardEyebrow"]}>{item.eyebrow}</span>
                        <h3 className={styles["expertise__cardTitle"]}>{item.title}</h3>
                        <p className={styles["expertise__cardText"]}>{item.text}</p>
                        <p className={styles["expertise__keywords"]}>{item.keywords.join(" / ")}</p>
                    </article>
                ))}
            </div>
        </div>
    )
})

export default Expertise
