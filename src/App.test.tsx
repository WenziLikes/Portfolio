import {describe, expect, test, vi} from "vitest"
import {fireEvent, render, screen} from "@testing-library/react"
import App from "./App"
import {RESUME_DOWNLOAD_NAME, RESUME_FILE_URL} from "./constants/resume"

const renderAt = (path: string) => {
    window.history.pushState({}, "", path)
    return render(<App/>)
}

const mockDesktopMatchMedia = () => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    })
}

describe("App routing", () => {
    test("renders path-based portfolio navigation on the home route", () => {
        renderAt("/")

        expect(screen.getAllByText("VM Portfolio").length).toBeGreaterThan(0)
        expect(screen.getByRole("button", {name: "Resume"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Portfolio"})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: "About"})).toHaveAttribute("href", "/about")
        expect(screen.queryByText(/hello@viacheslavmurakhin\.com/i)).not.toBeInTheDocument()
        expect(document.querySelectorAll('a[href="mailto:hello@viacheslavmurakhin.com"]').length).toBeGreaterThan(0)
    })

    test("renders the resume page on /resume", () => {
        renderAt("/resume")

        expect(screen.getByRole("heading", {name: /profile/i})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: /back to portfolio/i})).toHaveAttribute("href", "/")
        expect(screen.getByRole("link", {name: /download pdf/i})).toHaveAttribute("href", RESUME_FILE_URL)
        expect(screen.getByRole("link", {name: /download pdf/i})).toHaveAttribute("download", RESUME_DOWNLOAD_NAME)
        expect(screen.getAllByText(/hello@viacheslavmurakhin\.com/i).length).toBeGreaterThan(0)
        expect(document.querySelector('a[href="mailto:hello@viacheslavmurakhin.com"]')).not.toBeNull()
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

    test("collapses the desktop sidebar into icon mode", () => {
        window.localStorage.clear()
        mockDesktopMatchMedia()

        renderAt("/about")

        const sidebar = document.querySelector(".portfolio-sidebar")
        const collapseButton = document.querySelector('button[title="Collapse sidebar"]')

        expect(sidebar).not.toHaveClass("portfolio-sidebar--compact")
        expect(collapseButton).not.toBeNull()

        fireEvent.click(collapseButton!)

        expect(sidebar).toHaveClass("portfolio-sidebar--compact")
        expect(window.localStorage.getItem("portfolio-sidebar-collapsed")).toBe("true")
        expect(screen.getByRole("link", {name: "About"})).toHaveAttribute("title", "About")
    })
})
