import React, {useEffect} from "react"
import {useLocation} from "react-router-dom"
import {ROUTE_META, SITE_META} from "../../content/site"
import {trackPageView} from "../../utils/analytics"

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

const RouteMeta: React.FC = () => {
    const {pathname} = useLocation()

    useEffect(() => {
        const meta = ROUTE_META[pathname] ?? ROUTE_META["/"]
        const canonicalUrl = `${SITE_META.url}${meta.path}`

        document.title = meta.title
        setMetaContent('meta[name="description"]', meta.description)
        setMetaContent('meta[property="og:title"]', meta.title)
        setMetaContent('meta[property="og:description"]', meta.description)
        setMetaContent('meta[property="og:url"]', canonicalUrl)
        setMetaContent('meta[name="twitter:title"]', meta.title)
        setMetaContent('meta[name="twitter:description"]', meta.description)
        setLinkHref('link[rel="canonical"]', canonicalUrl)
        trackPageView({
            location: window.location.href,
            path: pathname,
            title: meta.title,
        })
    }, [pathname])

    return null
}

export default RouteMeta
