import React, {useEffect} from "react"
import {useLocation} from "react-router-dom"
import {MAIN_PATHS, getSectionIdFromPath} from "../../constants/navigation"
import {scrollToSectionId} from "../../utils/scroll"

const ScrollToSection: React.FC = () => {
    const {pathname} = useLocation()
    const previousPathRef = React.useRef<string | null>(null)
    const isFirstRenderRef = React.useRef(true)

    useEffect(() => {
        const sectionId = getSectionIdFromPath(pathname)

        if (!sectionId) {
            previousPathRef.current = pathname
            isFirstRenderRef.current = false
            return
        }

        const previousPath = previousPathRef.current
        const shouldScroll =
            isFirstRenderRef.current ||
            !previousPath ||
            previousPath === "/resume" ||
            !MAIN_PATHS.has(previousPath)

        previousPathRef.current = pathname
        isFirstRenderRef.current = false

        if (!shouldScroll) {
            return
        }

        if (scrollToSectionId(sectionId, "auto")) {
            return
        }

        requestAnimationFrame(() => {
            scrollToSectionId(sectionId, "auto")
        })
    }, [pathname])

    return null
}

export default ScrollToSection
