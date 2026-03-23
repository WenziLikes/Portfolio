import {describe, expect, test} from "vitest"
import {EMAIL_ADDRESS, EMAIL_HREF} from "./contact"

describe("contact constants", () => {
    test("exports the public contact email address", () => {
        expect(EMAIL_ADDRESS).toBe("hello@viacheslavmurakhin.com")
    })

    test("exports the mailto href for the contact email", () => {
        expect(EMAIL_HREF).toBe("mailto:hello@viacheslavmurakhin.com")
    })
})
