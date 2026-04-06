import React from "react"
import {Link} from "react-router-dom"
import styles from "./LegalPage.module.scss"
import {PRIVACY_CONTENT} from "../../content/site"
import {isAnalyticsEnabled, trackResumeClick, type AnalyticsConsentStatus} from "../../utils/analytics"

interface PrivacyPageProps {
    analyticsConsent: AnalyticsConsentStatus
    onAnalyticsConsentChange: (consent: Exclude<AnalyticsConsentStatus, "unset">) => void
}

const ANALYTICS_STATUS_COPY: Record<AnalyticsConsentStatus, string> = {
    denied: "Analytics is disabled on this device.",
    granted: "Analytics is allowed on this device.",
    unset: "Analytics has not been enabled on this device.",
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({analyticsConsent, onAnalyticsConsentChange}) => {
    return (
        <div className={styles.legalPage}>
            <div className={styles.toolbar}>
                <Link className={styles.backLink} to="/">
                    Back to portfolio
                </Link>
                <Link className={styles.resumeLink} to="/resume" onClick={() => trackResumeClick("open_route", "privacy_toolbar")}>
                    Open resume
                </Link>
            </div>

            <article className={styles.sheet}>
                <p className={styles.eyebrow}>Legal</p>
                <h1 className={styles.title}>Privacy</h1>
                <p className={styles.lead}>
                    This page explains the limited data handling involved in visiting this portfolio website and using its external links.
                </p>

                {isAnalyticsEnabled ? (
                    <section className={styles.preferenceCard}>
                        <h2 className={styles.sectionTitle}>Analytics Controls</h2>
                        <div className={styles.sectionBody}>
                            <p className={styles.copy}>
                                Google Analytics loads only after you allow it on this device. You can change this choice at any time here.
                            </p>
                            <p className={styles.preferenceStatus}>
                                {ANALYTICS_STATUS_COPY[analyticsConsent]}
                            </p>
                            <div className={styles.preferenceActions}>
                                <button
                                    className={styles.secondaryButton}
                                    type="button"
                                    onClick={() => onAnalyticsConsentChange("denied")}
                                >
                                    Disable analytics
                                </button>
                                <button
                                    className={styles.primaryButton}
                                    type="button"
                                    onClick={() => onAnalyticsConsentChange("granted")}
                                >
                                    Allow analytics
                                </button>
                            </div>
                        </div>
                    </section>
                ) : null}

                {PRIVACY_CONTENT.map((section) => (
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

export default PrivacyPage
