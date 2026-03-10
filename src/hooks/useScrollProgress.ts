import {RefObject, useEffect} from "react"
import {getMainContentElement} from "../utils/scroll"

type ScrollProgressMode = "hero" | "reveal"

interface UseScrollProgressOptions {
    end?: number
    mode?: ScrollProgressMode
    reducedMotionValue?: number
    start?: number
    variableName?: `--${string}`
}

const clamp = (value: number): number => Math.min(1, Math.max(0, value))

const prefersReducedMotion = (): boolean => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)")?.matches ?? false
}

const getViewportMetrics = (root: HTMLElement | null): {height: number; top: number} => {
    if (root) {
        const rootRect = root.getBoundingClientRect()

        return {
            height: root.clientHeight || rootRect.height,
            top: rootRect.top,
        }
    }

    return {
        height: window.innerHeight,
        top: 0,
    }
}

const useScrollProgress = <T extends HTMLElement>(
    ref: RefObject<T>,
    {
        end = 0.2,
        mode = "reveal",
        reducedMotionValue = 1,
        start = 0.9,
        variableName = "--section-progress",
    }: UseScrollProgressOptions = {}
) => {
    useEffect(() => {
        const element = ref.current

        if (!element) {
            return
        }

        if (prefersReducedMotion()) {
            element.style.setProperty(variableName, `${reducedMotionValue}`)
            return
        }

        const root = getMainContentElement()
        const scrollTarget: HTMLElement | Window = root ?? window
        let frameId = 0
        let lastProgressValue = ""
        let resizeObserver: ResizeObserver | null = null

        const updateProgress = () => {
            frameId = 0

            const currentElement = ref.current

            if (!currentElement) {
                return
            }

            const {height: viewportHeight, top: viewportTop} = getViewportMetrics(root)
            const {height: elementHeight, top: elementTop} = currentElement.getBoundingClientRect()
            const relativeTop = elementTop - viewportTop

            const progress = mode === "hero"
                ? clamp((-relativeTop) / Math.max(elementHeight - viewportHeight, 1))
                : clamp((viewportHeight * start - relativeTop) / (viewportHeight * (start - end)))

            const nextProgressValue = progress.toFixed(4)

            if (nextProgressValue === lastProgressValue) {
                return
            }

            lastProgressValue = nextProgressValue
            currentElement.style.setProperty(variableName, nextProgressValue)
        }

        const requestUpdate = () => {
            if (frameId !== 0) {
                return
            }

            frameId = window.requestAnimationFrame(updateProgress)
        }

        requestUpdate()
        scrollTarget.addEventListener("scroll", requestUpdate, {passive: true})
        window.addEventListener("resize", requestUpdate)

        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(requestUpdate)
            resizeObserver.observe(element)

            if (root) {
                resizeObserver.observe(root)
            }
        }

        return () => {
            if (frameId !== 0) {
                window.cancelAnimationFrame(frameId)
            }

            scrollTarget.removeEventListener("scroll", requestUpdate)
            window.removeEventListener("resize", requestUpdate)
            resizeObserver?.disconnect()
        }
    }, [end, mode, reducedMotionValue, ref, start, variableName])
}

export default useScrollProgress
