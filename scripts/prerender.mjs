import {mkdir, readdir, readFile, rm, writeFile} from "node:fs/promises"
import path from "node:path"
import {fileURLToPath, pathToFileURL} from "node:url"

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
const distDir = path.join(projectRoot, "build")
const serverDir = path.join(distDir, "server")

const escapeHtml = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")

const escapeScriptJson = (value) => value.replaceAll("<", "\\u003c")

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const replaceTitle = (html, title) => html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)

const replaceMetaContent = (html, attr, key, content) => {
    const pattern = new RegExp(`(<meta\\s+[^>]*${attr}="${escapeRegExp(key)}"[^>]*content=")([^"]*)(")`, "i")

    return html.replace(pattern, `$1${escapeHtml(content)}$3`)
}

const replaceLinkHref = (html, rel, href) => {
    const pattern = new RegExp(`(<link\\s+[^>]*rel="${escapeRegExp(rel)}"[^>]*href=")([^"]*)(")`, "i")

    return html.replace(pattern, `$1${escapeHtml(href)}$3`)
}

const replaceStructuredData = (html, content) => html.replace(
    /<script type="application\/ld\+json" data-route-structured-data="true">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" data-route-structured-data="true">${escapeScriptJson(content)}</script>`
)

const injectAppHtml = (html, appHtml) => html.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root">${appHtml}</div>`
)

const resolveServerEntryPath = async () => {
    const files = await readdir(serverDir)
    const entryFile = files.find((fileName) => /^entry-server\.(?:m?js|cjs)$/.test(fileName))

    if (!entryFile) {
        throw new Error("Could not find the built SSR entry file in dist/server.")
    }

    return path.join(serverDir, entryFile)
}

const getOutputPath = (pathname, notFoundPath) => {
    if (pathname === "/") {
        return path.join(distDir, "index.html")
    }

    if (pathname === notFoundPath) {
        return path.join(distDir, "404.html")
    }

    return path.join(distDir, pathname.replace(/^\/+/, ""), "index.html")
}

const buildHtmlDocument = ({
    appHtml,
    pathname,
    template,
    getRouteMeta,
    getStructuredDataJson,
}) => {
    const meta = getRouteMeta(pathname)

    let html = template
    html = injectAppHtml(html, appHtml)
    html = replaceTitle(html, meta.title)
    html = replaceMetaContent(html, "name", "description", meta.description)
    html = replaceMetaContent(html, "name", "robots", meta.robots)
    html = replaceMetaContent(html, "property", "og:title", meta.title)
    html = replaceMetaContent(html, "property", "og:description", meta.description)
    html = replaceMetaContent(html, "property", "og:type", meta.ogType)
    html = replaceMetaContent(html, "property", "og:url", meta.canonicalUrl)
    html = replaceMetaContent(html, "property", "og:image", meta.ogImageUrl)
    html = replaceMetaContent(html, "property", "og:image:alt", meta.ogImageAlt)
    html = replaceMetaContent(html, "property", "og:image:width", String(meta.ogImageWidth))
    html = replaceMetaContent(html, "property", "og:image:height", String(meta.ogImageHeight))
    html = replaceMetaContent(html, "name", "twitter:title", meta.title)
    html = replaceMetaContent(html, "name", "twitter:description", meta.description)
    html = replaceMetaContent(html, "name", "twitter:image", meta.ogImageUrl)
    html = replaceMetaContent(html, "name", "twitter:image:alt", meta.ogImageAlt)
    html = replaceLinkHref(html, "canonical", meta.canonicalUrl)
    html = replaceStructuredData(html, getStructuredDataJson(pathname))

    return html
}

const buildLegacyHomeRedirectHtml = ({canonicalUrl, template}) => {
    const redirectBody = `<div id="root"><main class="content content--page"><section><h1>Redirecting to the portfolio home page</h1><p><a href="${escapeHtml(canonicalUrl)}">Continue to ${escapeHtml(canonicalUrl)}</a></p></section></main></div>`
    let html = template

    html = injectAppHtml(html, redirectBody.replace(/^<div id="root">|<\/div>$/g, ""))
    html = replaceTitle(html, "Redirecting | Viacheslav Murakhin")
    html = replaceMetaContent(html, "name", "description", "Legacy home route redirecting to the canonical portfolio home page.")
    html = replaceMetaContent(html, "name", "robots", "noindex,follow")
    html = replaceMetaContent(html, "property", "og:title", "Redirecting | Viacheslav Murakhin")
    html = replaceMetaContent(html, "property", "og:description", "Legacy home route redirecting to the canonical portfolio home page.")
    html = replaceMetaContent(html, "property", "og:type", "website")
    html = replaceMetaContent(html, "property", "og:url", canonicalUrl)
    html = replaceMetaContent(html, "name", "twitter:title", "Redirecting | Viacheslav Murakhin")
    html = replaceMetaContent(html, "name", "twitter:description", "Legacy home route redirecting to the canonical portfolio home page.")
    html = replaceLinkHref(html, "canonical", canonicalUrl)
    html = replaceStructuredData(html, "[]")
    html = html.replace(/<\/head>/i, `    <meta http-equiv="refresh" content="0; url=/" />\n  </head>`)

    return html
}

const entryPath = await resolveServerEntryPath()
const {
    LEGACY_HOME_PATH,
    NOT_FOUND_PATH,
    PRERENDER_ROUTE_PATHS,
    getRobotsTxt,
    getRouteMeta,
    getSitemapXml,
    getStructuredDataJson,
    renderRoute,
} = await import(pathToFileURL(entryPath).href)

const template = await readFile(path.join(distDir, "index.html"), "utf8")
const lastModified = new Date().toISOString().slice(0, 10)

for (const pathname of [...PRERENDER_ROUTE_PATHS, NOT_FOUND_PATH]) {
    const appHtml = renderRoute(pathname)
    const html = buildHtmlDocument({
        appHtml,
        getRouteMeta,
        getStructuredDataJson,
        pathname,
        template,
    })
    const outputPath = getOutputPath(pathname, NOT_FOUND_PATH)

    await mkdir(path.dirname(outputPath), {recursive: true})
    await writeFile(outputPath, html)
}

const legacyHomeOutputPath = getOutputPath(LEGACY_HOME_PATH, NOT_FOUND_PATH)
await mkdir(path.dirname(legacyHomeOutputPath), {recursive: true})
await writeFile(legacyHomeOutputPath, buildLegacyHomeRedirectHtml({
    canonicalUrl: getRouteMeta("/").canonicalUrl,
    template,
}))

await writeFile(path.join(distDir, "sitemap.xml"), getSitemapXml(lastModified))
await writeFile(path.join(distDir, "robots.txt"), getRobotsTxt())
await rm(serverDir, {force: true, recursive: true})
