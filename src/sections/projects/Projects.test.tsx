import {fireEvent, render, screen, within} from "@testing-library/react"
import {MemoryRouter} from "react-router-dom"
import {beforeEach, describe, expect, test, vi} from "vitest"
import Projects, {PROJECTS_CUSTOM_ORDER_STORAGE_KEY, PROJECTS_STORAGE_KEY} from "./Projects"

const getProjectOrder = () => screen.getAllByRole("heading", {level: 3}).map((heading) => heading.textContent)
const renderProjects = () => render(
    <MemoryRouter>
        <Projects/>
    </MemoryRouter>
)

const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            addEventListener: vi.fn(),
            addListener: vi.fn(),
            dispatchEvent: vi.fn(),
            matches,
            media: query,
            onchange: null,
            removeEventListener: vi.fn(),
            removeListener: vi.fn(),
        })),
    })
}

describe("Projects reordering", () => {
    beforeEach(() => {
        window.localStorage.clear()
        mockMatchMedia(false)
    })

    test("shows VM North as the featured project by default", () => {
        renderProjects()

        expect(getProjectOrder()).toEqual(["VM North", "FlipClock Display", "CRM Dashboard", "E42 Store", "Portfolio"])
    })

    test("restores the saved project order from localStorage", () => {
        window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([3, 1, 2]))
        window.localStorage.setItem(PROJECTS_CUSTOM_ORDER_STORAGE_KEY, "true")

        renderProjects()

        expect(getProjectOrder()).toEqual(["Portfolio", "E42 Store", "CRM Dashboard", "VM North", "FlipClock Display"])
    })

    test("shows a detached overlay while dragging a project card", () => {
        renderProjects()

        const draggableCard = screen.getByLabelText(/crm dashboard\. drag and drop to reorder\./i)

        fireEvent.pointerDown(draggableCard, {
            button: 0,
            clientX: 20,
            clientY: 20,
            pointerId: 1,
            pointerType: "mouse",
        })

        expect(document.querySelector('article[aria-hidden="true"]')).not.toBeNull()
    })

    test("reorders cards from the keyboard handle controls", () => {
        renderProjects()

        const draggableCard = screen.getByLabelText(/crm dashboard\. drag and drop to reorder\./i)

        fireEvent.keyDown(draggableCard, {key: "ArrowRight"})

        expect(getProjectOrder()).toEqual(["VM North", "FlipClock Display", "E42 Store", "CRM Dashboard", "Portfolio"])
        expect(window.localStorage.getItem(PROJECTS_STORAGE_KEY)).toBe(JSON.stringify([5, 4, 1, 2, 3]))
        expect(window.localStorage.getItem(PROJECTS_CUSTOM_ORDER_STORAGE_KEY)).toBe("true")
    })

    test("renders the first project card in compact mode on mobile", () => {
        mockMatchMedia(true)

        renderProjects()

        expect(screen.queryByRole("link", {name: /explore project/i})).toBeNull()
        expect(screen.getAllByRole("link", {name: /view repo/i})).toHaveLength(2)

        const crmCard = document.querySelector<HTMLElement>('[data-project-card-id="2"]')

        expect(crmCard).not.toBeNull()
        expect(within(crmCard!).queryAllByRole("link")).toHaveLength(0)
    })

    test("links FlipClock Display to the Mac App Store", () => {
        renderProjects()

        const flipClockCard = document.querySelector<HTMLElement>('[data-project-card-id="4"]')

        expect(flipClockCard).not.toBeNull()
        expect(within(flipClockCard!).getByRole("link", {name: /mac app store/i})).toHaveAttribute(
            "href",
            "https://apps.apple.com/ca/app/flipclock-display/id6759590290?mt=12"
        )
    })

    test("renders regional case-study links for internal SEO support", () => {
        renderProjects()

        expect(screen.getByRole("link", {name: /canada/i})).toHaveAttribute("href", "/canada")
        expect(screen.getByRole("link", {name: /usa/i})).toHaveAttribute("href", "/usa")
        expect(screen.getByRole("link", {name: /europe/i})).toHaveAttribute("href", "/europe")
    })
})
