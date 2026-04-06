import React from "react"
import {Link} from "react-router-dom"
import styles from "./Footer.module.scss"
import {COPYRIGHT_NOTICE, PROFILE, SITE_META, SOCIAL_LINKS} from "../../content/site"
import {RESUME_DOWNLOAD_NAME, RESUME_FILE_URL} from "../../constants/resume"
import {trackContactClick, trackResumeClick, trackSocialClick} from "../../utils/analytics"
import ProtectedEmailLink from "../protectedEmailLink/ProtectedEmailLink"

const footerLinks = [
    {label: "Portfolio", to: "/"},
    {label: "Resume", to: "/resume"},
    {label: "Privacy", to: "/privacy"},
    {label: "Copyright", to: "/copyright"},
]

const Footer: React.FC = () => {
    const externalLinks = SOCIAL_LINKS.filter((link) => link.external)

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brand}>
                    <span className={styles.eyebrow}>{PROFILE.role}</span>
                    <h2 className={styles.title}>{PROFILE.fullName}</h2>
                    <p className={styles.copy}>{PROFILE.summary}</p>
                    <div className={styles.meta}>
                        <span className={styles.metaLine}>{PROFILE.location}</span>
                        <span className={styles.dot} aria-hidden="true">•</span>
                        <a
                            className={styles.metaLine}
                            href={PROFILE.phoneHref}
                            onClick={() => trackContactClick("phone", "footer_meta")}
                        >
                            {PROFILE.phone}
                        </a>
                    </div>
                </div>

                <div className={styles.side}>
                    <div className={styles.actions}>
                        <a
                            className={styles.primaryCta}
                            href={RESUME_FILE_URL}
                            download={RESUME_DOWNLOAD_NAME}
                            onClick={() => trackResumeClick("download_pdf", "footer_primary_cta")}
                        >
                            Download Resume
                        </a>
                        <ProtectedEmailLink
                            className={styles.secondaryCta}
                            eventSource="footer_secondary_cta"
                            title="Email Viacheslav"
                        >
                            Email Me
                        </ProtectedEmailLink>
                    </div>

                    <ul className={styles.nav}>
                        {footerLinks.map((item) => (
                            <li key={item.to}>
                                <Link
                                    className={styles.navLink}
                                    to={item.to}
                                    onClick={item.to === "/resume" ? () => trackResumeClick("open_route", "footer_nav") : undefined}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.external}>
                        {externalLinks.map((link, index, array) => (
                            <React.Fragment key={link.id}>
                                <a
                                    href={link.href!}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    onClick={() => {
                                        if (link.id === "github" || link.id === "linkedin") {
                                            trackSocialClick(link.id, "footer_external")
                                        }
                                    }}
                                >
                                    {link.text}
                                </a>
                                {index < array.length - 1 ? (
                                    <span className={styles.externalDivider} aria-hidden="true">/</span>
                                ) : null}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <p className={styles.notice}>{COPYRIGHT_NOTICE}</p>
                <p className={styles.legal}>
                    Original code, copy, and visual presentation are protected.
                    {" "}
                    <a href={SITE_META.url} target="_blank" rel="noreferrer noopener">{SITE_META.url.replace(/^https?:\/\//, "")}</a>
                </p>
            </div>
        </footer>
    )
}

export default Footer
