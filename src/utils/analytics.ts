const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? ""
const GA_SCRIPT_ID = "ga4-script"
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

type AnalyticsEventParamValue = boolean | number | string

type AnalyticsEventParams = Record<string, AnalyticsEventParamValue>

type ContactType = "email" | "phone"
type ResumeAction = "download_pdf" | "open_route"
type SocialPlatform = "github" | "linkedin"

export const isAnalyticsEnabled = GA_MEASUREMENT_ID.length > 0

let analyticsInitialized = false
let lastTrackedSignature = ""
let lastTrackedAt = 0

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
    if (!isAnalyticsEnabled || typeof window === "undefined" || analyticsInitialized) {
        return
    }

    ensureGtagBridge()
    ensureAnalyticsScript()

    window.gtag?.("js", new Date())
    window.gtag?.("config", GA_MEASUREMENT_ID, {
        debug_mode: SHOULD_DEBUG_LOG,
        send_page_view: false,
    })
    debugLog("analytics initialized", {measurementId: GA_MEASUREMENT_ID})

    analyticsInitialized = true
}

export const trackPageView = ({location, path, title}: PageViewPayload) => {
    if (!isAnalyticsEnabled || typeof window === "undefined") {
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
    if (!isAnalyticsEnabled || typeof window === "undefined") {
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
