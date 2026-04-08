import React from "react"
import styles from "./LegalPage.module.scss"
import {PRIVACY_CONTENT} from "../../content/site"
import {isAnalyticsEnabled, type AnalyticsConsentStatus} from "../../utils/analytics"
import LegalDocumentPage from "./LegalDocumentPage"

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
        <LegalDocumentPage
            lead="This page explains the limited data handling involved in visiting this portfolio website and using its external links."
            resumeEventSource="privacy_toolbar"
            sections={PRIVACY_CONTENT}
            title="Privacy"
        >
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
        </LegalDocumentPage>
    )
}

export default PrivacyPage
