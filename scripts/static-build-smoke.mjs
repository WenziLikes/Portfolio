import assert from "node:assert/strict"
import {readFile, stat} from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {startBuildServer} from "./serve-build.mjs"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, "..")
const buildDir = path.join(projectDir, "build")
const productionOrigin = "https://viacheslavmurakhin.com"
const resumeRelativePath = "documents/viacheslav-murakhin-resume.pdf"

const indexableRoutes = [
    "/",
    "/about",
    "/expertise",
    "/experience",
    "/projects",
    "/resume",
    "/flipclock",
    "/flipclock/support",
    "/canada",
    "/usa",
    "/europe",
]

const nonIndexableRoutes = [
    "/privacy",
    "/copyright",
    "/flipclock/privacy",
    "/flipclock/terms",
]

const prerenderedRoutes = [...indexableRoutes, ...nonIndexableRoutes]

const expectedRedirectRules = [
    "/flipclock /flipclock/ 200",
    "/flipclock/support /flipclock/support/ 200",
    "/flipclock/privacy /flipclock/privacy/ 200",
    "/flipclock/terms /flipclock/terms/ 200",
]

const getRouteFilePath = (route) => route === "/"
    ? path.join(buildDir, "index.html")
    : path.join(buildDir, route.replace(/^\//, ""), "index.html")

const getMetaContent = (html, attribute, value) => {
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const match = html.match(new RegExp(`<meta\\s+[^>]*${attribute}="${escapedValue}"[^>]*content="([^"]+)"`, "i"))

    return match?.[1] ?? ""
}

const getCanonicalUrl = (html) => {
    const match = html.match(/<link\s+[^>]*rel="canonical"[^>]*href="([^"]+)"/i)

    return match?.[1] ?? ""
}

const assertMetadata = (html, {canonicalUrl, shouldIndex}) => {
    assert.match(html, /<title>[^<]+<\/title>/i, "HTML title is missing")
    assert.ok(getMetaContent(html, "name", "description"), "Meta description is missing")
    assert.equal(getCanonicalUrl(html), canonicalUrl, "Canonical URL does not match the route")
    assert.equal(getMetaContent(html, "property", "og:url"), canonicalUrl, "Open Graph URL does not match the route")

    const robots = getMetaContent(html, "name", "robots")
    assert.equal(robots.startsWith(shouldIndex ? "index," : "noindex,"), true, `Unexpected robots metadata: ${robots}`)

    const structuredDataMatch = html.match(/<script type="application\/ld\+json" data-route-structured-data="true">([\s\S]*?)<\/script>/i)
    assert.ok(structuredDataMatch, "Route structured data is missing")
    assert.doesNotThrow(() => JSON.parse(structuredDataMatch[1]), "Route structured data is not valid JSON")
    assert.match(html, /<div id="root"><[a-z]/i, "Route does not contain prerendered application HTML")
}

const normalizeConfigLines = (source) => source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))

const verifyBuildFiles = async () => {
    const [headersSource, redirectsSource, publicResume, buildResume, manifestSource, robotsSource, sitemapSource] = await Promise.all([
        readFile(path.join(buildDir, "_headers"), "utf8"),
        readFile(path.join(buildDir, "_redirects"), "utf8"),
        readFile(path.join(projectDir, "public", resumeRelativePath)),
        readFile(path.join(buildDir, resumeRelativePath)),
        readFile(path.join(buildDir, "manifest.json"), "utf8"),
        readFile(path.join(buildDir, "robots.txt"), "utf8"),
        readFile(path.join(buildDir, "sitemap.xml"), "utf8"),
    ])

    assert.match(
        headersSource,
        /\/documents\/viacheslav-murakhin-resume\.pdf\s+Content-Disposition:\s*attachment; filename="Viacheslav-Murakhin-Resume\.pdf"/,
        "The production PDF attachment header is missing"
    )
    assert.deepEqual(normalizeConfigLines(redirectsSource), expectedRedirectRules, "Unexpected production rewrite rules")
    assert.ok(publicResume.length > 10_000, "The public resume PDF is unexpectedly small")
    assert.equal(buildResume.equals(publicResume), true, "The resume PDF in build/ is stale")

    const manifest = JSON.parse(manifestSource)
    assert.ok(manifest.name || manifest.short_name, "The web manifest is missing an application name")
    assert.match(robotsSource, new RegExp(`${productionOrigin.replaceAll(".", "\\.")}\/sitemap\\.xml`))
    assert.match(sitemapSource, new RegExp(`${productionOrigin.replaceAll(".", "\\.")}\/`))

    const previewStats = await stat(path.join(buildDir, "seo-preview.jpg"))
    assert.ok(previewStats.size > 10_000, "The social preview image is unexpectedly small")
}

const verifyHttpBehavior = async () => {
    const {close, url} = await startBuildServer({buildDir, port: 0})

    try {
        for (const route of prerenderedRoutes) {
            const [response, expectedHtml] = await Promise.all([
                fetch(`${url}${route}`, {redirect: "manual"}),
                readFile(getRouteFilePath(route), "utf8"),
            ])
            const html = await response.text()
            const canonicalUrl = route === "/" ? `${productionOrigin}/` : `${productionOrigin}${route}`

            assert.equal(response.status, 200, `${route} did not return HTTP 200`)
            assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/)
            assert.equal(html, expectedHtml, `${route} did not serve its prerendered route file`)
            assertMetadata(html, {canonicalUrl, shouldIndex: indexableRoutes.includes(route)})
        }

        const [legacyHomeResponse, legacyHomeHtml] = await Promise.all([
            fetch(`${url}/home`, {redirect: "manual"}),
            readFile(path.join(buildDir, "home", "index.html"), "utf8"),
        ])
        assert.equal(legacyHomeResponse.status, 200)
        assert.equal(await legacyHomeResponse.text(), legacyHomeHtml)
        assertMetadata(legacyHomeHtml, {canonicalUrl: `${productionOrigin}/`, shouldIndex: false})
        assert.match(legacyHomeHtml, /<meta http-equiv="refresh" content="0; url=\/"/i)

        const [notFoundResponse, expectedNotFoundHtml] = await Promise.all([
            fetch(`${url}/this-route-must-not-exist`, {redirect: "manual"}),
            readFile(path.join(buildDir, "404.html"), "utf8"),
        ])
        const notFoundHtml = await notFoundResponse.text()
        assert.equal(notFoundResponse.status, 404, "An unknown route did not return a real HTTP 404")
        assert.equal(notFoundHtml, expectedNotFoundHtml, "An unknown route did not serve build/404.html")
        assertMetadata(notFoundHtml, {canonicalUrl: `${productionOrigin}/404`, shouldIndex: false})
        assert.match(notFoundHtml, /Page not found/i)

        const resumeResponse = await fetch(`${url}/${resumeRelativePath}`)
        const resumeContents = Buffer.from(await resumeResponse.arrayBuffer())
        assert.equal(resumeResponse.status, 200)
        assert.equal(resumeResponse.headers.get("content-type"), "application/pdf")
        assert.equal(
            resumeResponse.headers.get("content-disposition"),
            'attachment; filename="Viacheslav-Murakhin-Resume.pdf"',
            "The PDF attachment header from build/_headers was not applied"
        )
        assert.ok(resumeContents.length > 10_000)
    } finally {
        await close()
    }
}

await verifyBuildFiles()
await verifyHttpBehavior()
console.log(`Static build smoke passed for ${prerenderedRoutes.length} routes, /home, 404 handling, metadata, redirects, headers, and resume assets.`)
