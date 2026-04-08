import React, {useEffect} from "react"
import {useLocation} from "react-router-dom"
import {getAnalyticsPageLocation, trackPageView} from "../../utils/analytics"
import {getRouteMeta, getStructuredDataJson} from "../../seo"

const setMetaContent = (selector: string, content: string) => {
    const element = document.querySelector(selector)

    if (element instanceof HTMLMetaElement) {
        element.setAttribute("content", content)
    }
}

const setLinkHref = (selector: string, href: string) => {
    const element = document.querySelector(selector)

    if (element instanceof HTMLLinkElement) {
        element.setAttribute("href", href)
    }
}

const setStructuredData = (selector: string, content: string) => {
    const element = document.querySelector(selector)

    if (element instanceof HTMLScriptElement) {
        element.textContent = content
    }
}

const setAlternateLinks = (alternates: ReadonlyArray<{href: string; hrefLang: string}>) => {
    document.querySelectorAll('link[rel="alternate"][data-route-alternate="true"]').forEach((element) => {
        element.parentNode?.removeChild(element)
    })

    alternates.forEach((alternate) => {
        const element = document.createElement("link")

        element.rel = "alternate"
        element.href = alternate.href
        element.hreflang = alternate.hrefLang
        element.setAttribute("data-route-alternate", "true")
        document.head.appendChild(element)
    })
}

interface RouteMetaProps {
    shouldTrackAnalytics?: boolean
}

const RouteMeta: React.FC<RouteMetaProps> = ({shouldTrackAnalytics = false}) => {
    const {pathname} = useLocation()

    useEffect(() => {
        const meta = getRouteMeta(pathname)

        document.title = meta.title
        setMetaContent('meta[name="description"]', meta.description)
        setMetaContent('meta[name="keywords"]', meta.keywords.join(", "))
        setMetaContent('meta[name="robots"]', meta.robots)
        setMetaContent('meta[name="googlebot"]', meta.robots)
        setMetaContent('meta[property="og:title"]', meta.title)
        setMetaContent('meta[property="og:description"]', meta.description)
        setMetaContent('meta[property="og:locale"]', meta.ogLocale)
        setMetaContent('meta[property="og:type"]', meta.ogType)
        setMetaContent('meta[property="og:url"]', meta.canonicalUrl)
        setMetaContent('meta[property="og:image"]', meta.ogImageUrl)
        setMetaContent('meta[property="og:image:secure_url"]', meta.ogImageUrl)
        setMetaContent('meta[property="og:image:alt"]', meta.ogImageAlt)
        setMetaContent('meta[property="og:image:width"]', String(meta.ogImageWidth))
        setMetaContent('meta[property="og:image:height"]', String(meta.ogImageHeight))
        setMetaContent('meta[name="twitter:title"]', meta.title)
        setMetaContent('meta[name="twitter:description"]', meta.description)
        setMetaContent('meta[name="twitter:image"]', meta.ogImageUrl)
        setMetaContent('meta[name="twitter:image:alt"]', meta.ogImageAlt)
        setLinkHref('link[rel="canonical"]', meta.canonicalUrl)
        setAlternateLinks(meta.alternates)
        setStructuredData('script[data-route-structured-data="true"]', getStructuredDataJson(pathname))

        if (shouldTrackAnalytics) {
            trackPageView({
                location: getAnalyticsPageLocation(pathname),
                path: pathname,
                title: meta.title,
            })
        }
    }, [pathname, shouldTrackAnalytics])

    return null
}

export default RouteMeta
