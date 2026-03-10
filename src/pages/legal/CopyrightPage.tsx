import React from "react"
import {Link} from "react-router-dom"
import styles from "./LegalPage.module.scss"
import {COPYRIGHT_CONTENT, COPYRIGHT_NOTICE} from "../../content/site"
import {trackResumeClick} from "../../utils/analytics"

const CopyrightPage: React.FC = () => {
    return (
        <div className={styles.legalPage}>
            <div className={styles.toolbar}>
                <Link className={styles.backLink} to="/">
                    Back to portfolio
                </Link>
                <Link className={styles.resumeLink} to="/resume" onClick={() => trackResumeClick("open_route", "copyright_toolbar")}>
                    Open resume
                </Link>
            </div>

            <article className={styles.sheet}>
                <p className={styles.eyebrow}>Legal</p>
                <h1 className={styles.title}>Copyright</h1>
                <p className={styles.lead}>{COPYRIGHT_NOTICE}</p>

                {COPYRIGHT_CONTENT.map((section) => (
                    <section className={styles.section} key={section.title}>
                        <h2 className={styles.sectionTitle}>{section.title}</h2>
                        <div className={styles.sectionBody}>
                            {section.paragraphs?.map((paragraph) => (
                                <p className={styles.copy} key={paragraph}>
                                    {paragraph}
                                </p>
                            ))}
                            {section.bullets ? (
                                <ul className={styles.list}>
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    </section>
                ))}
            </article>
        </div>
    )
}

export default CopyrightPage
