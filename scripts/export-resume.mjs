import {spawn} from "node:child_process"
import {once} from "node:events"
import {createServer} from "node:http"
import {createReadStream} from "node:fs"
import {access, mkdir, stat} from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {chromium} from "@playwright/test"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, "..")
const buildDir = path.join(projectDir, "build")
const resumePath = path.join(projectDir, "public", "documents", "viacheslav-murakhin-resume.pdf")
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"

const mimeTypes = new Map([
    [".css", "text/css; charset=utf-8"],
    [".html", "text/html; charset=utf-8"],
    [".ico", "image/x-icon"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
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
])

const isMissingPathError = (error) => {
    return error instanceof Error && "code" in error && error.code === "ENOENT"
}

const ensureFileExists = async (filePath) => {
    try {
        await access(filePath)
        return true
    } catch (error) {
        if (isMissingPathError(error)) {
            return false
        }

        throw error
    }
}

const runBuild = async () => {
    await new Promise((resolve, reject) => {
        const child = spawn(npmCommand, ["run", "build"], {
            cwd: projectDir,
            stdio: "inherit",
        })

        child.on("error", reject)
        child.on("exit", (code) => {
            if (code === 0) {
                resolve()
                return
            }

            reject(new Error(`Build failed with exit code ${code ?? "unknown"}.`))
        })
    })
}

const resolveRequestPath = async (requestPathname) => {
    const pathname = decodeURIComponent(requestPathname)
    const normalizedPath = path.posix.normalize(pathname)

    if (normalizedPath.includes("..")) {
        return null
    }

    const relativePath = normalizedPath.replace(/^\/+/, "")
    const filePath = path.join(buildDir, relativePath)

    if (await ensureFileExists(filePath)) {
        const fileStats = await stat(filePath)

        if (fileStats.isFile()) {
            return filePath
        }
    }

    if (!path.extname(relativePath)) {
        return path.join(buildDir, "index.html")
    }

    return null
}

const startStaticServer = async () => {
    const server = createServer(async (request, response) => {
        try {
            const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1")
            const filePath = await resolveRequestPath(requestUrl.pathname)

            if (!filePath) {
                response.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"})
                response.end("Not found")
                return
            }

            const extension = path.extname(filePath).toLowerCase()
            const contentType = mimeTypes.get(extension) ?? "application/octet-stream"

            response.writeHead(200, {"Content-Type": contentType})
            createReadStream(filePath).pipe(response)
        } catch (error) {
            response.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"})
            response.end(error instanceof Error ? error.message : "Internal server error")
        }
    })

    server.listen(0, "127.0.0.1")
    await once(server, "listening")

    const address = server.address()

    if (!address || typeof address === "string") {
        throw new Error("Unable to resolve local export server address.")
    }

    return {
        server,
        url: `http://127.0.0.1:${address.port}`,
    }
}

const exportResumePdf = async (baseUrl) => {
    await mkdir(path.dirname(resumePath), {recursive: true})

    const browser = await chromium.launch()

    try {
        const page = await browser.newPage({
            deviceScaleFactor: 1,
            viewport: {
                height: 1800,
                width: 1400,
            },
        })

        await page.goto(`${baseUrl}/resume`, {waitUntil: "networkidle"})
        await page.emulateMedia({media: "print"})
        await page.pdf({
            format: "A4",
            margin: {
                bottom: "0",
                left: "0",
                right: "0",
                top: "0",
            },
            path: resumePath,
            preferCSSPageSize: true,
            printBackground: true,
        })
    } finally {
        await browser.close()
    }
}

const main = async () => {
    console.log("Building portfolio...")
    await runBuild()

    const {server, url} = await startStaticServer()
    console.log(`Export server started at ${url}`)

    try {
        await exportResumePdf(url)
        console.log(`Resume PDF exported to ${resumePath}`)
    } catch (error) {
        if (error instanceof Error && error.message.includes("Executable doesn't exist")) {
            console.error("Playwright Chromium is not installed. Run `npm run test:e2e:install` first.")
        }

        throw error
    } finally {
        server.close()
        await once(server, "close")
    }
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})
