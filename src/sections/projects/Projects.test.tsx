import {fireEvent, render, screen} from "@testing-library/react"
import {beforeEach, describe, expect, test} from "vitest"
import Projects, {PROJECTS_CUSTOM_ORDER_STORAGE_KEY, PROJECTS_STORAGE_KEY} from "./Projects"

const getProjectOrder = () => screen.getAllByRole("heading", {level: 3}).map((heading) => heading.textContent)

describe("Projects reordering", () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

    test("shows Flip Clock as the featured project by default", () => {
        render(<Projects/>)

        expect(getProjectOrder()).toEqual(["Flip Clock", "Portfolio", "E42 Store", "CRM Dashboard"])
    })

    test("restores the saved project order from localStorage", () => {
        window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([3, 1, 2]))
        window.localStorage.setItem(PROJECTS_CUSTOM_ORDER_STORAGE_KEY, "true")

        render(<Projects/>)

        expect(getProjectOrder()).toEqual(["Portfolio", "E42 Store", "CRM Dashboard", "Flip Clock"])
    })

    test("shows a detached overlay while dragging a project card", () => {
        render(<Projects/>)

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
        render(<Projects/>)

        const draggableCard = screen.getByLabelText(/portfolio\. drag and drop to reorder\./i)

        fireEvent.keyDown(draggableCard, {key: "ArrowRight"})

        expect(getProjectOrder()).toEqual(["Flip Clock", "E42 Store", "Portfolio", "CRM Dashboard"])
        expect(window.localStorage.getItem(PROJECTS_STORAGE_KEY)).toBe(JSON.stringify([4, 1, 3, 2]))
        expect(window.localStorage.getItem(PROJECTS_CUSTOM_ORDER_STORAGE_KEY)).toBe("true")
    })
})
