import React from "react"
import {Link} from "react-router-dom"
import styles from "./AnalyticsConsentBanner.module.scss"
import {type AnalyticsConsentStatus, isAnalyticsEnabled} from "../../utils/analytics"

interface AnalyticsConsentBannerProps {
    consent: AnalyticsConsentStatus
    onConsentChange: (consent: Exclude<AnalyticsConsentStatus, "unset">) => void
}

const AnalyticsConsentBanner: React.FC<AnalyticsConsentBannerProps> = ({consent, onConsentChange}) => {
    if (!isAnalyticsEnabled || consent !== "unset") {
        return null
    }

    return (
        <aside className={styles.banner} aria-label="Analytics consent">
            <div className={styles.content}>
                <p className={styles.title}>Analytics is optional</p>
                <p className={styles.copy}>
                    Google Analytics stays off until you allow it on this device. You can change this choice later on the privacy page.
                </p>
            </div>

            <div className={styles.actions}>
                <button className={styles.secondaryButton} type="button" onClick={() => onConsentChange("denied")}>
                    Decline
                </button>
                <button className={styles.primaryButton} type="button" onClick={() => onConsentChange("granted")}>
                    Allow analytics
                </button>
            </div>

            <Link className={styles.link} to="/privacy">
                Review privacy details
            </Link>
        </aside>
    )
}

export default AnalyticsConsentBanner
