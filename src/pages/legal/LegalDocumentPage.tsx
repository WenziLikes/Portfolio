import React from "react"
import {Link} from "react-router-dom"
import styles from "./LegalPage.module.scss"
import {type LegalSection} from "../../content/site"
import {trackResumeClick} from "../../utils/analytics"

interface LegalDocumentPageProps {
    children?: React.ReactNode
    eyebrow?: string
    lead: string
    resumeEventSource: string
    sections: LegalSection[]
    title: string
}

const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({
    children,
    eyebrow = "Legal",
    lead,
    resumeEventSource,
    sections,
    title,
}) => {
    return (
        <div className={styles.legalPage}>
            <div className={styles.toolbar}>
                <Link className={styles.backLink} to="/">
                    Back to portfolio
                </Link>
                <Link className={styles.resumeLink} to="/resume" onClick={() => trackResumeClick("open_route", resumeEventSource)}>
                    Open resume
                </Link>
            </div>

            <article className={styles.sheet}>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.lead}>{lead}</p>

                {children}

                {sections.map((section) => (
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

export default LegalDocumentPage
