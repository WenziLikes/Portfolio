import {describe, expect, test} from "vitest"
import {getRouteMeta, getSitemapXml, getStructuredData} from "./seo"

const findSchemaByType = (schemas: Record<string, unknown>[], type: string) => schemas.find((schema) => schema["@type"] === type)

describe("seo configuration", () => {
    test("returns route keywords and international market copy for resume", () => {
        const meta = getRouteMeta("/resume")

        expect(meta.description).toContain("Canada, the United States, and Europe")
        expect(meta.keywords).toEqual(expect.arrayContaining(["full stack developer resume", "Europe"]))
    })

    test("includes international hiring signals in structured data", () => {
        const schemas = getStructuredData("/")
        const organization = findSchemaByType(schemas, "Organization")
        const person = findSchemaByType(schemas, "Person")

        expect(organization).toEqual(expect.objectContaining({
            areaServed: expect.arrayContaining(["Canada", "United States", "Europe"]),
        }))
        expect(organization).toEqual(expect.objectContaining({
            contactPoint: expect.arrayContaining([
                expect.objectContaining({
                    availableLanguage: expect.arrayContaining(["en", "pl", "ru", "uk"]),
                    contactType: "professional inquiries",
                }),
            ]),
        }))

        expect(person).toEqual(expect.objectContaining({
            hasOccupation: expect.objectContaining({
                name: "Full Stack Developer",
            }),
            knowsLanguage: expect.arrayContaining(["English", "Polish", "Russian", "Ukrainian"]),
        }))
    })

    test("returns hreflang alternates for regional landing pages", () => {
        const meta = getRouteMeta("/canada")

        expect(meta.alternates).toEqual(expect.arrayContaining([
            expect.objectContaining({hrefLang: "en-CA", href: "https://viacheslavmurakhin.com/canada"}),
            expect.objectContaining({hrefLang: "en-US", href: "https://viacheslavmurakhin.com/usa"}),
            expect.objectContaining({hrefLang: "en", href: "https://viacheslavmurakhin.com/europe"}),
            expect.objectContaining({hrefLang: "x-default", href: "https://viacheslavmurakhin.com/"}),
        ]))
    })

    test("renders sitemap with public portfolio routes only", () => {
        const xml = getSitemapXml("2026-04-07")

        expect(xml).toContain("<loc>https://viacheslavmurakhin.com/</loc>")
        expect(xml).toContain("<loc>https://viacheslavmurakhin.com/resume</loc>")
        expect(xml).toContain("<loc>https://viacheslavmurakhin.com/canada</loc>")
        expect(xml).toContain("<loc>https://viacheslavmurakhin.com/usa</loc>")
        expect(xml).toContain("<loc>https://viacheslavmurakhin.com/europe</loc>")
        expect(xml).toContain("<loc>https://viacheslavmurakhin.com/flipclock</loc>")
        expect(xml).toContain("<loc>https://viacheslavmurakhin.com/flipclock/support</loc>")
        expect(xml).not.toContain("/privacy")
        expect(xml).not.toContain("/copyright")
    })

    test("returns product-specific metadata for FlipClock legal routes", () => {
        const privacyMeta = getRouteMeta("/flipclock/privacy")
        const termsMeta = getRouteMeta("/flipclock/terms")

        expect(privacyMeta.title).toBe("Privacy Policy | FlipClock Display")
        expect(privacyMeta.description).toContain("location")
        expect(privacyMeta.robots).toBe("noindex,follow")
        expect(termsMeta.title).toBe("Terms of Use | FlipClock Display")
    })

    test("exposes FlipClock Display as a published Mac App Store application", () => {
        const meta = getRouteMeta("/flipclock")
        const schemas = getStructuredData("/flipclock")
        const application = findSchemaByType(schemas, "SoftwareApplication")
        const webPage = findSchemaByType(schemas, "WebPage")

        expect(meta.title).toContain("Mac App Store")
        expect(meta.ogImageAlt).toContain("FlipClock Display")
        expect(application).toEqual(expect.objectContaining({
            applicationCategory: "Utilities",
            downloadUrl: "https://apps.apple.com/ca/app/flipclock-display/id6759590290?mt=12",
            isAccessibleForFree: true,
            name: "FlipClock Display",
            operatingSystem: "macOS 13.0 or later",
            softwareVersion: "1.0.1",
        }))
        expect(webPage).toEqual(expect.objectContaining({
            mainEntity: {"@id": "https://viacheslavmurakhin.com/flipclock#software"},
            primaryImageOfPage: expect.objectContaining({
                caption: "FlipClock Display fullscreen clock and settings preview",
            }),
        }))
    })

    test("normalizes Cloudflare trailing slashes for route metadata", () => {
        const privacyMeta = getRouteMeta("/flipclock/privacy/")
        const schemas = getStructuredData("/flipclock/privacy/")
        const webPage = findSchemaByType(schemas, "WebPage")

        expect(privacyMeta.title).toBe("Privacy Policy | FlipClock Display")
        expect(privacyMeta.canonicalUrl).toBe("https://viacheslavmurakhin.com/flipclock/privacy")
        expect(webPage).toEqual(expect.objectContaining({
            name: "Privacy Policy | FlipClock Display",
            url: "https://viacheslavmurakhin.com/flipclock/privacy",
        }))
    })
})
