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
        expect(xml).not.toContain("/privacy")
        expect(xml).not.toContain("/copyright")
    })
})
