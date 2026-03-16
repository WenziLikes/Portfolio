import {describe, expect, test} from "vitest"
import {getEmailAddress, getEmailHref, getObfuscatedEmailText} from "./contact"

describe("protected email helpers", () => {
    test("decodes a valid email address from encoded fragments", () => {
        const emailAddress = getEmailAddress()

        expect(emailAddress).toContain("@")
        expect(emailAddress.endsWith(".com")).toBe(true)
    })

    test("returns obfuscated text without a raw email token", () => {
        const obfuscatedEmail = getObfuscatedEmailText()

        expect(obfuscatedEmail).toContain("[at]")
        expect(obfuscatedEmail).toContain("[dot]")
        expect(obfuscatedEmail).not.toContain("@")
    })

    test("builds the composer href from the decoded email address", () => {
        expect(getEmailHref()).toBe(`mailto:${getEmailAddress()}`)
    })
})
