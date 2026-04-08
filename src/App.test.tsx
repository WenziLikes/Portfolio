import {describe, expect, test, vi} from "vitest"
import {fireEvent, render, screen, within} from "@testing-library/react"
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

const mockMobileMatchMedia = () => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: query.includes("max-width"),
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
        expect(screen.getByRole("link", {name: "Expertise"})).toHaveAttribute("href", "/expertise")
        const regionalNav = screen.getByRole("navigation", {name: /regional hiring pages/i})
        expect(within(regionalNav).getByRole("link", {name: /canada/i})).toHaveAttribute("href", "/canada")
        expect(within(regionalNav).getByRole("link", {name: /usa/i})).toHaveAttribute("href", "/usa")
        expect(within(regionalNav).getByRole("link", {name: /europe/i})).toHaveAttribute("href", "/europe")
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

    test("renders the canada landing page on /canada", () => {
        renderAt("/canada")

        expect(screen.getByRole("heading", {name: /full stack developer for canadian product teams/i})).toBeInTheDocument()
        expect(screen.getByRole("link", {name: /open resume/i})).toHaveAttribute("href", "/resume")
        expect(screen.getByRole("link", {name: /view projects/i})).toHaveAttribute("href", "/projects")
        expect(screen.getByText(/toronto timezone overlap/i)).toBeInTheDocument()
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

    test("shows theme switching controls inside the mobile menu", () => {
        window.localStorage.clear()
        mockMobileMatchMedia()

        renderAt("/about")

        expect(screen.queryByRole("button", {name: /switch to dark theme/i})).not.toBeInTheDocument()
        expect(screen.queryByRole("button", {name: /switch to light theme/i})).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", {name: /open navigation menu/i}))
        const mobileMenu = document.getElementById("portfolio-mobile-navigation")

        expect(mobileMenu).not.toBeNull()
        expect(within(mobileMenu!).getByText("Theme")).toBeInTheDocument()
        expect(within(mobileMenu!).getByRole("button", {name: /switch to dark theme/i})).toBeInTheDocument()
        expect(within(mobileMenu!).getByRole("button", {name: /switch to light theme/i})).toBeInTheDocument()
        expect(within(mobileMenu!).getByRole("link", {name: /vm north/i})).toBeInTheDocument()
    })
})
