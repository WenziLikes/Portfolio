import {useEffect, useRef, RefObject} from "react"

const useIntersectionObserver = (
    ref: RefObject<HTMLDivElement>,
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
) => {
    const callbackRef = useRef(callback)
    const root = options?.root ?? null
    const rootMargin = options?.rootMargin
    const thresholdOption = options?.threshold
    const thresholdKey = Array.isArray(thresholdOption)
        ? thresholdOption.join(",")
        : `${thresholdOption ?? ""}`

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        const currentRef = ref.current
        if (!currentRef) {
            return
        }

        const observer = new IntersectionObserver((entries, observerRef) => {
            callbackRef.current(entries, observerRef)
        }, {
            root,
            rootMargin,
            threshold: thresholdOption,
        })

        observer.observe(currentRef)

        return () => {
            observer.unobserve(currentRef)
        }
    }, [ref, root, rootMargin, thresholdOption, thresholdKey])
}

export default useIntersectionObserver
