import React from "react"
import styles from "./ProtectedEmailLink.module.scss"
import {trackContactClick} from "../../utils/analytics"
import {getObfuscatedEmailText, openEmailComposer} from "../../utils/contact"

interface ProtectedEmailLinkProps {
    ariaLabel?: string
    children?: React.ReactNode
    className?: string
    eventSource: string
    title?: string
}

const ProtectedEmailLink: React.FC<ProtectedEmailLinkProps> = ({
    ariaLabel = "Open email composer",
    children,
    className,
    eventSource,
    title = "Email",
}) => {
    const handleClick = () => {
        trackContactClick("email", eventSource)
        openEmailComposer()
    }

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className={className ? `${styles.button} ${className}` : styles.button}
            onClick={handleClick}
            title={title}
        >
            {children ?? getObfuscatedEmailText()}
        </button>
    )
}

export default ProtectedEmailLink
