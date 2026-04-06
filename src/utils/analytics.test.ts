import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

describe("analytics privacy safeguards", () => {
    beforeEach(() => {
        window.localStorage.clear()
        window.history.pushState({}, "", "/about?email=person@example.com#contact")
        vi.resetModules()
        vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-PRIVACY01")
    })

    afterEach(() => {
        delete (window as Window & {gtag?: (...args: unknown[]) => void}).gtag
        vi.unstubAllEnvs()
    })

    test("stores analytics consent choices", async () => {
        const analytics = await import("./analytics")

        expect(analytics.getStoredAnalyticsConsent()).toBe("unset")

        analytics.persistAnalyticsConsent("denied")
        expect(analytics.getStoredAnalyticsConsent()).toBe("denied")

        analytics.persistAnalyticsConsent("granted")
        expect(analytics.getStoredAnalyticsConsent()).toBe("granted")
    })

    test("uses a sanitized page location without search params or fragments", async () => {
        const analytics = await import("./analytics")

        expect(analytics.getAnalyticsPageLocation(window.location.pathname)).toBe(
            new URL("/about", window.location.origin).toString()
        )
    })

    test("does not send events until consent is granted", async () => {
        const analytics = await import("./analytics")
        const gtag = vi.fn()

        ;(window as Window & {gtag?: typeof gtag}).gtag = gtag

        analytics.trackEvent("contact_click", {source: "footer"})
        expect(gtag).not.toHaveBeenCalled()

        analytics.persistAnalyticsConsent("granted")
        analytics.trackEvent("contact_click", {source: "footer"})

        expect(gtag).toHaveBeenCalledWith("js", expect.any(Date))
        expect(gtag).toHaveBeenCalledWith(
            "config",
            "G-PRIVACY01",
            expect.objectContaining({
                allow_ad_personalization_signals: false,
                allow_google_signals: false,
                send_page_view: false,
            })
        )
        expect(gtag).toHaveBeenCalledWith(
            "event",
            "contact_click",
            expect.objectContaining({source: "footer"})
        )
    })

    test("stops sending events after analytics is disabled", async () => {
        const analytics = await import("./analytics")
        const gtag = vi.fn()

        ;(window as Window & {gtag?: typeof gtag}).gtag = gtag
        analytics.persistAnalyticsConsent("granted")
        analytics.trackEvent("contact_click", {source: "footer"})

        analytics.disableAnalytics()
        analytics.persistAnalyticsConsent("denied")
        gtag.mockClear()

        analytics.trackEvent("contact_click", {source: "footer"})
        expect(gtag).not.toHaveBeenCalled()
    })
})
