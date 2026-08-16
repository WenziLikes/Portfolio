import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import {afterEach, describe, expect, test, vi} from "vitest"

import {RESUME_DOWNLOAD_NAME, RESUME_FILE_URL} from "../../constants/resume"
import ResumeDownloadLink from "./ResumeDownloadLink"

const originalMatchMedia = window.matchMedia
const originalShareDescriptor = Object.getOwnPropertyDescriptor(window.navigator, "share")
const originalCanShareDescriptor = Object.getOwnPropertyDescriptor(window.navigator, "canShare")

const restoreNavigatorProperty = (property: "canShare" | "share", descriptor?: PropertyDescriptor) => {
    if (descriptor) {
        Object.defineProperty(window.navigator, property, descriptor)
        return
    }

    Reflect.deleteProperty(window.navigator, property)
}

describe("ResumeDownloadLink", () => {
    afterEach(() => {
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            writable: true,
            value: originalMatchMedia,
        })
        restoreNavigatorProperty("share", originalShareDescriptor)
        restoreNavigatorProperty("canShare", originalCanShareDescriptor)
        vi.unstubAllGlobals()
    })

    test("shares the PDF file from an installed web app instead of navigating to the document viewer", async () => {
        const share = vi.fn().mockResolvedValue(undefined)

        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: query === "(display-mode: standalone)",
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            })),
        })
        Object.defineProperty(window.navigator, "share", {
            configurable: true,
            value: share,
        })
        Object.defineProperty(window.navigator, "canShare", {
            configurable: true,
            value: vi.fn().mockReturnValue(true),
        })
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            blob: () => Promise.resolve(new Blob(["resume"], {type: "application/pdf"})),
            ok: true,
            status: 200,
        }))

        render(
            <ResumeDownloadLink eventSource="test" standaloneLabel="Save PDF">
                Download PDF
            </ResumeDownloadLink>
        )

        const link = await screen.findByRole("link", {name: "Save PDF"})
        fireEvent.click(link)

        await waitFor(() => expect(share).toHaveBeenCalledTimes(1))

        const sharedFile = share.mock.calls[0][0].files[0] as File
        expect(sharedFile.name).toBe(RESUME_DOWNLOAD_NAME)
        expect(sharedFile.type).toBe("application/pdf")
        expect(link).toHaveAttribute("href", RESUME_FILE_URL)
        expect(link).toHaveAttribute("download", RESUME_DOWNLOAD_NAME)
    })
})
