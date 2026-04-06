const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? ""
const GA_SCRIPT_ID = "ga4-script"
const ANALYTICS_CONSENT_STORAGE_KEY = "vm-analytics-consent"
const DUPLICATE_PAGE_VIEW_WINDOW_MS = 1000
const IS_DEV = import.meta.env.DEV
const IS_TEST = import.meta.env.MODE === "test"
const SHOULD_DEBUG_LOG = IS_DEV && !IS_TEST

type Gtag = (...args: unknown[]) => void

declare global {
    interface Window {
        dataLayer: Array<IArguments | unknown[]>
        gtag?: Gtag
    }
}

interface PageViewPayload {
    location: string
    path: string
    title: string
}

export type AnalyticsConsentStatus = "unset" | "granted" | "denied"

type AnalyticsEventParamValue = boolean | number | string

type AnalyticsEventParams = Record<string, AnalyticsEventParamValue>

type ContactType = "email" | "phone"
type ResumeAction = "download_pdf" | "open_route"
type SocialPlatform = "github" | "linkedin"
type PersistedAnalyticsConsentStatus = Exclude<AnalyticsConsentStatus, "unset">

export const isAnalyticsEnabled = GA_MEASUREMENT_ID.length > 0

let analyticsInitialized = false
let lastTrackedSignature = ""
let lastTrackedAt = 0

const isPersistedAnalyticsConsentStatus = (value: string | null): value is PersistedAnalyticsConsentStatus => value === "granted" || value === "denied"

const debugLog = (message: string, payload?: unknown) => {
    if (!SHOULD_DEBUG_LOG) {
        return
    }

    if (payload === undefined) {
        console.info(`[GA4] ${message}`)
        return
    }

    console.info(`[GA4] ${message}`, payload)
}

const setAnalyticsDisabled = (disabled: boolean) => {
    if (!isAnalyticsEnabled || typeof window === "undefined") {
        return
    }

    const analyticsWindow = window as unknown as Record<string, boolean | undefined>
    analyticsWindow[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled
}

export const getStoredAnalyticsConsent = (): AnalyticsConsentStatus => {
    if (typeof window === "undefined") {
        return "unset"
    }

    try {
        const storedValue = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)

        return isPersistedAnalyticsConsentStatus(storedValue) ? storedValue : "unset"
    } catch {
        return "unset"
    }
}

export const persistAnalyticsConsent = (consent: PersistedAnalyticsConsentStatus) => {
    if (typeof window === "undefined") {
        return
    }

    try {
        window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent)
    } catch {
        // Ignore unavailable storage; the current session state still updates in React.
    }
}

export const getAnalyticsPageLocation = (path: string) => {
    if (typeof window === "undefined") {
        return path
    }

    return new URL(path, window.location.origin).toString()
}

const isAnalyticsCollectionAllowed = () => isAnalyticsEnabled && typeof window !== "undefined" && getStoredAnalyticsConsent() === "granted"

const ensureGtagBridge = () => {
    window.dataLayer = window.dataLayer || []

    if (!window.gtag) {
        window.gtag = function (..._args: unknown[]) {
            window.dataLayer.push(arguments)
        }
    }
}

const ensureAnalyticsScript = () => {
    if (IS_TEST) {
        return
    }

    if (document.getElementById(GA_SCRIPT_ID)) {
        return
    }

    const script = document.createElement("script")
    script.async = true
    script.id = GA_SCRIPT_ID
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
    script.onload = () => {
        debugLog("gtag.js loaded")
    }
    script.onerror = () => {
        debugLog("gtag.js failed to load")
    }
    document.head.append(script)
}

const isDuplicatePageView = (signature: string) => {
    const now = Date.now()
    const isDuplicate = lastTrackedSignature === signature && now - lastTrackedAt < DUPLICATE_PAGE_VIEW_WINDOW_MS

    lastTrackedSignature = signature
    lastTrackedAt = now

    return isDuplicate
}

export const initializeAnalytics = () => {
    if (!isAnalyticsCollectionAllowed() || analyticsInitialized) {
        return
    }

    setAnalyticsDisabled(false)
    ensureGtagBridge()
    ensureAnalyticsScript()

    window.gtag?.("js", new Date())
    window.gtag?.("config", GA_MEASUREMENT_ID, {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        debug_mode: SHOULD_DEBUG_LOG,
        send_page_view: false,
    })
    debugLog("analytics initialized", {measurementId: GA_MEASUREMENT_ID})

    analyticsInitialized = true
}

export const disableAnalytics = () => {
    if (typeof window === "undefined") {
        return
    }

    setAnalyticsDisabled(true)
    analyticsInitialized = false
    lastTrackedSignature = ""
    lastTrackedAt = 0
    debugLog("analytics disabled")
}

export const trackPageView = ({location, path, title}: PageViewPayload) => {
    if (!isAnalyticsCollectionAllowed()) {
        return
    }

    initializeAnalytics()

    const signature = `${path}|${title}|${location}`
    if (isDuplicatePageView(signature)) {
        return
    }

    window.gtag?.("event", "page_view", {
        debug_mode: SHOULD_DEBUG_LOG,
        page_location: location,
        page_path: path,
        page_title: title,
    })
    debugLog("page_view sent", {
        location,
        path,
        title,
    })
}

export const trackEvent = (name: string, params: AnalyticsEventParams = {}) => {
    if (!isAnalyticsCollectionAllowed()) {
        return
    }

    initializeAnalytics()
    window.gtag?.("event", name, {
        debug_mode: SHOULD_DEBUG_LOG,
        ...params,
    })
    debugLog(`event sent: ${name}`, params)
}

export const trackContactClick = (contactType: ContactType, source: string) => {
    trackEvent("contact_click", {
        contact_type: contactType,
        source,
    })
}

export const trackResumeClick = (action: ResumeAction, source: string) => {
    trackEvent("resume_click", {
        action,
        source,
    })
}

export const trackSocialClick = (platform: SocialPlatform, source: string) => {
    trackEvent(`${platform}_click`, {
        source,
    })
}
