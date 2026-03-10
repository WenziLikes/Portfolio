import React from "react"
import {SOCIAL_LINKS, type SocialLink} from "../../content/site"
import {trackContactClick, trackSocialClick} from "../../utils/analytics"

const ICON_PATHS: Record<SocialLink["id"], string> = {
    email: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm8 6.4L4.6 7.2A1 1 0 0 0 4 8v.2l8 4.6 8-4.6V8a1 1 0 0 0-.6-.8L12 11.4z",
    github: "M12 .5A12 12 0 0 0 8.2 24c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.8 1 2.9.7.1-.7.4-1.1.7-1.4-2.6-.3-5.2-1.3-5.2-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2A11.3 11.3 0 0 1 12 6.8c1 0 2 .1 2.9.4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.6 5.5-5.2 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z",
    linkedin: "M4.98 3.5a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6V21h-4v-5.4c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V21H9z",
    phone: "M6.7 2h2.8c.5 0 .9.3 1 .8l.9 4a1 1 0 0 1-.3.9L9 9.8a14.4 14.4 0 0 0 5.2 5.2l2.1-2.1a1 1 0 0 1 .9-.3l4 .9c.5.1.8.5.8 1v2.8a1.7 1.7 0 0 1-1.7 1.7C10.3 21 3 13.7 3 3.7A1.7 1.7 0 0 1 4.7 2h2z",
}

interface SocialLinksProps {
    ariaLabel?: string
    eventSource?: string
    iconClassName: string
    itemClassName?: string
    linkClassName: string
    listClassName: string
}

const SocialLinks: React.FC<SocialLinksProps> = ({
    ariaLabel = "Contact links",
    eventSource = "social_links",
    iconClassName,
    itemClassName,
    linkClassName,
    listClassName,
}) => {
    const handleClick = (linkId: SocialLink["id"]) => {
        if (linkId === "email" || linkId === "phone") {
            trackContactClick(linkId, eventSource)
            return
        }

        if (linkId === "github" || linkId === "linkedin") {
            trackSocialClick(linkId, eventSource)
        }
    }

    return (
        <ul className={listClassName} aria-label={ariaLabel}>
            {SOCIAL_LINKS.map((link) => (
                <li className={itemClassName} key={link.id}>
                    <a
                        aria-label={link.label}
                        className={linkClassName}
                        href={link.href}
                        onClick={() => handleClick(link.id)}
                        rel={link.external ? "noreferrer noopener" : undefined}
                        target={link.external ? "_blank" : undefined}
                        title={link.label}
                    >
                        <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden="true">
                            <path d={ICON_PATHS[link.id]}/>
                        </svg>
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default SocialLinks
