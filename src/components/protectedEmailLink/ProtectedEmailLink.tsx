import React from "react"
import styles from "./ProtectedEmailLink.module.scss"
import {trackContactClick} from "../../utils/analytics"
import {EMAIL_ADDRESS, EMAIL_HREF} from "../../utils/contact"

interface ProtectedEmailLinkProps {
    ariaLabel?: string
    children?: React.ReactNode
    className?: string
    eventSource: string
    title?: string
}

const ProtectedEmailLink: React.FC<ProtectedEmailLinkProps> = ({
    ariaLabel,
    children,
    className,
    eventSource,
    title = "Email",
}) => {
    const handleClick = () => {
        trackContactClick("email", eventSource)
    }

    return (
        <a
            aria-label={ariaLabel}
            className={className ? `${styles.button} ${className}` : styles.button}
            href={EMAIL_HREF}
            onClick={handleClick}
            title={title}
        >
            {children ?? EMAIL_ADDRESS}
        </a>
    )
}

export default ProtectedEmailLink
