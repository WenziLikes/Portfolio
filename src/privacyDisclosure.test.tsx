import {render, screen} from "@testing-library/react"
import {MemoryRouter} from "react-router-dom"
import {describe, expect, test} from "vitest"

import {PRIVACY_CONTENT} from "./content/site"
import {FlipClockPrivacyPage} from "./pages/flipclock/FlipClockPages"

describe("privacy disclosures", () => {
    test("documents the unconditional VMNorth chat data flow and deletion path", () => {
        const disclosure = JSON.stringify(PRIVACY_CONTENT)

        expect(disclosure).toContain("chat iframe on every route")
        expect(disclosure).toContain("loads independently of the portfolio's optional analytics setting")
        expect(disclosure).toContain("name and email address")
        expect(disclosure).toContain("server-side conversation")
        expect(disclosure).toContain("privacy@vmnorth.com")
        expect(disclosure).toContain("does not state one fixed retention period")
    })

    test("documents Apple providers for the App Store build and isolates the diagnostic fallback", () => {
        render(
            <MemoryRouter>
                <FlipClockPrivacyPage/>
            </MemoryRouter>
        )

        expect(screen.getByRole("link", {name: "Apple WeatherKit"})).toHaveAttribute(
            "href",
            "https://developer.apple.com/weatherkit/"
        )
        expect(screen.getByRole("link", {name: "Apple geocoding and Location Services"})).toHaveAttribute(
            "href",
            "https://www.apple.com/legal/privacy/data/en/location-services/"
        )
        expect(screen.getByRole("link", {name: "Open-Meteo diagnostic fallback"})).toBeInTheDocument()
        expect(screen.getAllByText(/not active in the Mac App Store version/i)).toHaveLength(2)
        expect(screen.queryByText(/Nominatim/i)).not.toBeInTheDocument()
    })
})
