import React from "react"
import {renderToString} from "react-dom/server"
import {StaticRouter} from "react-router-dom/server"
import {AppContent} from "./App"
export {
    LEGACY_HOME_PATH,
    NOT_FOUND_PATH,
    PRERENDER_ROUTE_PATHS,
    getRobotsTxt,
    getRouteMeta,
    getSitemapXml,
    getStructuredDataJson,
} from "./seo"

export const renderRoute = (pathname: string): string => renderToString(
    <StaticRouter location={pathname}>
        <AppContent initialTheme="dark"/>
    </StaticRouter>
)
