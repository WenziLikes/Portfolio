import {createReadStream} from "node:fs"
import {access, readFile, stat} from "node:fs/promises"
import {createServer} from "node:http"
import {once} from "node:events"
import path from "node:path"
import {fileURLToPath} from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultBuildDir = path.resolve(scriptDir, "..", "build")

const mimeTypes = new Map([
    [".css", "text/css; charset=utf-8"],
    [".html", "text/html; charset=utf-8"],
    [".ico", "image/x-icon"],
    [".jpeg", "image/jpeg"],
    [".jpg", "image/jpeg"],
    [".js", "text/javascript; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
    [".pdf", "application/pdf"],
    [".png", "image/png"],
    [".svg", "image/svg+xml"],
    [".ttf", "font/ttf"],
    [".txt", "text/plain; charset=utf-8"],
    [".webmanifest", "application/manifest+json; charset=utf-8"],
    [".woff", "font/woff"],
    [".woff2", "font/woff2"],
    [".xml", "application/xml; charset=utf-8"],
])

const isMissingPathError = (error) => error instanceof Error && "code" in error && error.code === "ENOENT"

const readOptionalTextFile = async (filePath) => {
    try {
        return await readFile(filePath, "utf8")
    } catch (error) {
        if (isMissingPathError(error)) {
            return ""
        }

        throw error
    }
}

const parseHeadersConfig = (source) => {
    const rules = []
    let currentRule = null

    for (const rawLine of source.split(/\r?\n/)) {
        const line = rawLine.trim()

        if (!line || line.startsWith("#")) {
            continue
        }

        if (/^\s/.test(rawLine)) {
            const separatorIndex = line.indexOf(":")

            if (!currentRule || separatorIndex === -1) {
                continue
            }

            currentRule.headers[line.slice(0, separatorIndex).trim()] = line.slice(separatorIndex + 1).trim()
            continue
        }

        currentRule = {headers: {}, pattern: line}
        rules.push(currentRule)
    }

    return rules
}

const parseRedirectsConfig = (source) => source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
        const [sourcePath, targetPath, statusValue] = line.split(/\s+/)
        const status = Number(statusValue)

        return {sourcePath, status, targetPath}
    })
    .filter((rule) => rule.sourcePath && rule.targetPath && Number.isInteger(rule.status))

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const matchesPathPattern = (pathname, pattern) => {
    const expression = pattern
        .split("*")
        .map(escapeRegExp)
        .join(".*")

    return new RegExp(`^${expression}$`).test(pathname)
}

const resolveInsideBuild = (buildDir, pathname) => {
    const relativePath = pathname.replace(/^\/+/, "")
    const candidate = path.resolve(buildDir, relativePath)

    if (candidate !== buildDir && !candidate.startsWith(`${buildDir}${path.sep}`)) {
        return null
    }

    return candidate
}

const resolveStaticFile = async (buildDir, requestPathname) => {
    const decodedPathname = decodeURIComponent(requestPathname)
    const candidate = resolveInsideBuild(buildDir, decodedPathname)

    if (!candidate) {
        return null
    }

    const possiblePaths = decodedPathname.endsWith("/")
        ? [path.join(candidate, "index.html")]
        : [candidate, path.join(candidate, "index.html")]

    for (const possiblePath of possiblePaths) {
        try {
            const fileStats = await stat(possiblePath)

            if (fileStats.isFile()) {
                return {filePath: possiblePath, fileStats}
            }
        } catch (error) {
            if (!isMissingPathError(error)) {
                throw error
            }
        }
    }

    return null
}

const sendFile = (request, response, filePath, fileStats, statusCode) => {
    response.statusCode = statusCode
    response.setHeader("Content-Length", String(fileStats.size))
    response.setHeader("Content-Type", mimeTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream")

    if (request.method === "HEAD") {
        response.end()
        return
    }

    const stream = createReadStream(filePath)
    stream.on("error", (error) => response.destroy(error))
    stream.pipe(response)
}

export const startBuildServer = async ({
    buildDir = defaultBuildDir,
    host = "127.0.0.1",
    port = 4173,
} = {}) => {
    const resolvedBuildDir = path.resolve(buildDir)
    const indexPath = path.join(resolvedBuildDir, "index.html")
    await access(indexPath)

    const [headersSource, redirectsSource] = await Promise.all([
        readOptionalTextFile(path.join(resolvedBuildDir, "_headers")),
        readOptionalTextFile(path.join(resolvedBuildDir, "_redirects")),
    ])
    const headerRules = parseHeadersConfig(headersSource)
    const redirectRules = parseRedirectsConfig(redirectsSource)

    const server = createServer(async (request, response) => {
        try {
            if (request.method !== "GET" && request.method !== "HEAD") {
                response.writeHead(405, {Allow: "GET, HEAD"})
                response.end()
                return
            }

            const requestUrl = new URL(request.url ?? "/", `http://${host}`)
            const requestPathname = requestUrl.pathname

            for (const rule of headerRules) {
                if (matchesPathPattern(requestPathname, rule.pattern)) {
                    for (const [headerName, headerValue] of Object.entries(rule.headers)) {
                        response.setHeader(headerName, headerValue)
                    }
                }
            }

            const redirectRule = redirectRules.find((rule) => matchesPathPattern(requestPathname, rule.sourcePath))

            if (redirectRule && redirectRule.status >= 300 && redirectRule.status < 400) {
                response.writeHead(redirectRule.status, {Location: redirectRule.targetPath})
                response.end()
                return
            }

            const servedPathname = redirectRule?.status === 200
                ? new URL(redirectRule.targetPath, `http://${host}`).pathname
                : requestPathname
            const resolvedFile = await resolveStaticFile(resolvedBuildDir, servedPathname)

            if (resolvedFile) {
                sendFile(request, response, resolvedFile.filePath, resolvedFile.fileStats, 200)
                return
            }

            const notFoundPath = path.join(resolvedBuildDir, "404.html")
            const notFoundStats = await stat(notFoundPath)
            sendFile(request, response, notFoundPath, notFoundStats, 404)
        } catch (error) {
            response.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"})
            response.end(error instanceof Error ? error.message : "Internal server error")
        }
    })

    server.listen(port, host)
    await once(server, "listening")

    const address = server.address()

    if (!address || typeof address === "string") {
        server.close()
        throw new Error("Unable to resolve the static build server address.")
    }

    return {
        close: async () => {
            if (!server.listening) {
                return
            }

            server.close()
            await once(server, "close")
        },
        server,
        url: `http://${host}:${address.port}`,
    }
}

const getCliPort = () => {
    const portFlagIndex = process.argv.indexOf("--port")
    const value = portFlagIndex === -1 ? undefined : process.argv[portFlagIndex + 1]
    const port = value === undefined ? 4173 : Number(value)

    if (!Number.isInteger(port) || port < 0 || port > 65_535) {
        throw new Error(`Invalid --port value: ${value ?? ""}`)
    }

    return port
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
    const {close, url} = await startBuildServer({port: getCliPort()})
    console.log(`Serving the production build at ${url}`)

    const stop = async () => {
        await close()
        process.exit(0)
    }

    process.once("SIGINT", stop)
    process.once("SIGTERM", stop)
}
