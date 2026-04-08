import {useEffect, useState} from "react"

const getMediaQueryMatch = (query: string, fallbackValue: boolean): boolean => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return fallbackValue
    }

    return window.matchMedia(query).matches
}

const useMediaQuery = (query: string, fallbackValue = false): boolean => {
    const [matches, setMatches] = useState<boolean>(() => getMediaQueryMatch(query, fallbackValue))

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return
        }

        const mediaQuery = window.matchMedia(query)
        const updateMatch = (nextMatch: boolean) => {
            setMatches(nextMatch)
        }
        const handleChange = (event: MediaQueryListEvent) => {
            updateMatch(event.matches)
        }

        updateMatch(mediaQuery.matches)

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleChange)

            return () => {
                mediaQuery.removeEventListener("change", handleChange)
            }
        }

        mediaQuery.addListener(handleChange)

        return () => {
            mediaQuery.removeListener(handleChange)
        }
    }, [query])

    return matches
}

export default useMediaQuery
