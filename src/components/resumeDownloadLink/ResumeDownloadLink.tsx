import React, {useEffect, useState} from "react"

import {RESUME_DOWNLOAD_NAME, RESUME_FILE_URL} from "../../constants/resume"
import {trackResumeClick} from "../../utils/analytics"

type PreparationStatus = "default" | "fallback" | "preparing" | "ready"

interface ResumeDownloadLinkProps {
    children: React.ReactNode
    className?: string
    eventSource: string
    preparingLabel?: string
    standaloneLabel?: string
}

type NavigatorWithStandalone = Navigator & {
    standalone?: boolean
}

const isStandaloneWebApp = () => {
    if (typeof window === "undefined") {
        return false
    }

    const navigatorWithStandalone = window.navigator as NavigatorWithStandalone
    const standaloneMediaQuery = typeof window.matchMedia === "function"
        ? window.matchMedia("(display-mode: standalone)")
        : undefined
    const matchesStandaloneDisplay = standaloneMediaQuery?.matches === true

    return matchesStandaloneDisplay || navigatorWithStandalone.standalone === true
}

const getShareErrorName = (error: unknown) => {
    if (error && typeof error === "object" && "name" in error) {
        return String(error.name)
    }

    return ""
}

const ResumeDownloadLink: React.FC<ResumeDownloadLinkProps> = ({
    children,
    className,
    eventSource,
    preparingLabel = "Preparing PDF…",
    standaloneLabel = "Save PDF",
}) => {
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [status, setStatus] = useState<PreparationStatus>("default")

    useEffect(() => {
        if (!isStandaloneWebApp() || typeof window.navigator.share !== "function") {
            return
        }

        let isActive = true
        setStatus("preparing")

        void fetch(RESUME_FILE_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Resume request failed with ${response.status}`)
                }

                return response.blob()
            })
            .then((blob) => {
                const file = new File([blob], RESUME_DOWNLOAD_NAME, {
                    lastModified: Date.now(),
                    type: blob.type || "application/pdf",
                })
                const shareData = {files: [file]}

                if (typeof window.navigator.canShare === "function" && !window.navigator.canShare(shareData)) {
                    throw new Error("File sharing is not supported")
                }

                if (isActive) {
                    setResumeFile(file)
                    setStatus("ready")
                }
            })
            .catch(() => {
                if (isActive) {
                    setStatus("fallback")
                }
            })

        return () => {
            isActive = false
        }
    }, [])

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
        trackResumeClick("download_pdf", eventSource)

        if (status === "preparing") {
            event.preventDefault()
            return
        }

        if (status !== "ready" || !resumeFile || typeof window.navigator.share !== "function") {
            return
        }

        event.preventDefault()

        try {
            const shareResult = window.navigator.share({files: [resumeFile]})

            if (shareResult && typeof shareResult.catch === "function") {
                void shareResult.catch((error: unknown) => {
                    if (getShareErrorName(error) !== "AbortError") {
                        setStatus("fallback")
                    }
                })
            }
        } catch {
            setStatus("fallback")
        }
    }

    const isPreparing = status === "preparing"
    const linkLabel = status === "ready" ? standaloneLabel : isPreparing ? preparingLabel : children
    const usesFallbackWindow = status === "fallback" && isStandaloneWebApp()

    return (
        <a
            aria-busy={isPreparing || undefined}
            aria-disabled={isPreparing || undefined}
            className={className}
            download={RESUME_DOWNLOAD_NAME}
            href={RESUME_FILE_URL}
            onClick={handleClick}
            rel={usesFallbackWindow ? "noreferrer noopener" : undefined}
            target={usesFallbackWindow ? "_blank" : undefined}
            title={status === "ready" ? "Open the iOS share menu to save the resume PDF" : undefined}
        >
            {linkLabel}
        </a>
    )
}

export default ResumeDownloadLink
