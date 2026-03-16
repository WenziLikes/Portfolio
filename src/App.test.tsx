import {describe, expect, test} from "vitest"
import {render, screen} from "@testing-library/react"
import App from "./App"
import {RESUME_DOWNLOAD_NAME, RESUME_FILE_URL} from "./constants/resume"

const renderAt = (path: string) => {
    window.history.pushState({}, "", path)
    return render(<App/>)
}

describe("App routing", () => {
    test("renders path-based portfolio navigation on the home route", () => {
        renderAt("/")

        expect(screen.getAllByText("VM Portfolio").length).toBeGreaterThan(0)
        expect(screen.getByRole("button", {name: "Resume"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Portfolio"})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: "About"})).toHaveAttribute("href", "/about")
        expect(screen.getAllByText(/viacheslavmurakhin \[at\] icloud \[dot\] com/i).length).toBeGreaterThan(0)
        expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
    })

    test("renders the resume page on /resume", () => {
        renderAt("/resume")

        expect(screen.getByRole("heading", {name: /profile/i})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: /back to portfolio/i})).toHaveAttribute("href", "/")
        expect(screen.getByRole("link", {name: /download pdf/i})).toHaveAttribute("href", RESUME_FILE_URL)
        expect(screen.getByRole("link", {name: /download pdf/i})).toHaveAttribute("download", RESUME_DOWNLOAD_NAME)
        expect(screen.getAllByText(/viacheslavmurakhin \[at\] icloud \[dot\] com/i).length).toBeGreaterThan(0)
        expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
    })

    test("renders the 404 page for unknown routes", () => {
        renderAt("/missing")

        expect(screen.getByRole("heading", {name: /page not found/i})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: /back to portfolio/i})).toHaveAttribute("href", "/")
        expect(screen.getByRole("link", {name: /open resume/i})).toHaveAttribute("href", "/resume")
    })

    test("renders the privacy page on /privacy", () => {
        renderAt("/privacy")

        expect(screen.getByRole("heading", {name: /privacy/i})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: /back to portfolio/i})).toHaveAttribute("href", "/")
        expect(screen.getByRole("link", {name: /copyright/i})).toHaveAttribute("href", "/copyright")
    })
})
