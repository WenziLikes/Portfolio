import {spawn} from "node:child_process"
import {copyFile, mkdir, readFile, stat} from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {chromium} from "@playwright/test"
import {startBuildServer} from "./serve-build.mjs"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, "..")
const buildDir = path.join(projectDir, "build")
const resumePath = path.join(projectDir, "public", "documents", "viacheslav-murakhin-resume.pdf")
const buildResumePath = path.join(buildDir, "documents", "viacheslav-murakhin-resume.pdf")
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"

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

        await page.route("https://vmnorth.com/chat-embed.js", (route) => route.abort())
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

const syncResumeIntoBuild = async () => {
    await mkdir(path.dirname(buildResumePath), {recursive: true})
    await copyFile(resumePath, buildResumePath)

    const [sourceStats, buildStats, sourceContents, buildContents] = await Promise.all([
        stat(resumePath),
        stat(buildResumePath),
        readFile(resumePath),
        readFile(buildResumePath),
    ])

    if (sourceStats.size === 0 || sourceStats.size !== buildStats.size || !sourceContents.equals(buildContents)) {
        throw new Error("The generated resume PDF was not copied into the production build correctly.")
    }
}

const main = async () => {
    console.log("Building portfolio...")
    await runBuild()

    const {close, url} = await startBuildServer({buildDir, port: 0})
    console.log(`Export server started at ${url}`)

    try {
        await exportResumePdf(url)
        console.log(`Resume PDF exported to ${resumePath}`)
        await syncResumeIntoBuild()
        console.log(`Resume PDF synchronized to ${buildResumePath}`)
    } catch (error) {
        if (error instanceof Error && error.message.includes("Executable doesn't exist")) {
            console.error("Playwright Chromium is not installed. Run `npm run test:e2e:install` first.")
        }

        throw error
    } finally {
        await close()
    }
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})
