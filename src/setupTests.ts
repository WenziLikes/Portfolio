import {cleanup} from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"
import {afterEach, expect, vi} from "vitest"

expect.extend(matchers)

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

class IntersectionObserverMock implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin = "0px"
    readonly thresholds = [0]

    disconnect = vi.fn()
    observe = vi.fn()
    takeRecords = vi.fn(() => [] as IntersectionObserverEntry[])
    unobserve = vi.fn()
}

Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverMock,
})

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
    writable: true,
    value: vi.fn(),
})

Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
    writable: true,
    value: vi.fn(),
})

Object.defineProperty(window, "requestAnimationFrame", {
    writable: true,
    value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 0),
})

Object.defineProperty(window, "cancelAnimationFrame", {
    writable: true,
    value: (id: number) => window.clearTimeout(id),
})

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

Object.defineProperty(document, "elementFromPoint", {
    writable: true,
    value: vi.fn(),
})
