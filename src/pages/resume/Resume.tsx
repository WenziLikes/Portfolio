import React from "react"
import {Link} from "react-router-dom"
import styles from "./Resume.module.scss"
import ProtectedEmailLink from "../../components/protectedEmailLink/ProtectedEmailLink"
import {RESUME_DOWNLOAD_NAME, RESUME_FILE_URL} from "../../constants/resume"
import {
    PROFILE,
    RESUME_ADDITIONAL_INFO,
    RESUME_CERTIFICATIONS,
    RESUME_EXPERIENCE,
    RESUME_PROFILE,
    RESUME_SKILLS,
    SITE_META,
    SOCIAL_LINKS,
} from "../../content/site"
import {trackContactClick, trackResumeClick, trackSocialClick} from "../../utils/analytics"

const ResumeSection: React.FC<React.PropsWithChildren<{title: string}>> = ({title, children}) => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <div className={styles.sectionRule} aria-hidden="true"/>
            </div>
            <div className={styles.sectionBody}>{children}</div>
        </section>
    )
}

const Resume: React.FC = () => {
    return (
        <div className={styles.resume}>
            <div className={styles.toolbar}>
                <Link className={styles.backLink} to="/">
                    Back to portfolio
                </Link>
                <a
                    className={styles.downloadLink}
                    href={RESUME_FILE_URL}
                    download={RESUME_DOWNLOAD_NAME}
                    onClick={() => trackResumeClick("download_pdf", "resume_toolbar")}
                >
                    Download PDF
                </a>
            </div>

            <div className={styles.paperStack}>
                <article className={styles.sheet}>
                    <header className={styles.header}>
                        <div className={styles.headerMain}>
                            <div className={styles.identityBlock}>
                                <h1 className={styles.name}>VIACHESLAV MURAKHIN</h1>
                                <p className={styles.roleTitle}>{PROFILE.role}</p>
                                <p className={styles.roleLine}>{PROFILE.roleLine}</p>
                            </div>

                            <div className={styles.contactBlock}>
                                <p className={styles.location}>{PROFILE.location}</p>

                                <div className={styles.contactLinks}>
                                    <ProtectedEmailLink eventSource="resume_contact_block" title="Email Viacheslav"/>
                                    <span className={styles.contactDivider} aria-hidden="true">|</span>
                                    <a href={PROFILE.phoneHref} onClick={() => trackContactClick("phone", "resume_contact_block")}>{PROFILE.phone}</a>
                                </div>

                                <div className={styles.socialLinks}>
                                    <a href={SITE_META.url} target="_blank" rel="noreferrer noopener">
                                        {SITE_META.url.replace(/^https?:\/\//, "")}
                                    </a>
                                    <span className={styles.contactDivider} aria-hidden="true">|</span>
                                    <a
                                        href={SOCIAL_LINKS.find((link) => link.id === "linkedin")?.href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        onClick={() => trackSocialClick("linkedin", "resume_contact_block")}
                                    >
                                        LinkedIn
                                    </a>
                                    <span className={styles.contactDivider} aria-hidden="true">|</span>
                                    <a
                                        href={SOCIAL_LINKS.find((link) => link.id === "github")?.href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        onClick={() => trackSocialClick("github", "resume_contact_block")}
                                    >
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </header>

                    <ResumeSection title="Profile">
                        <p className={styles.copy}>{RESUME_PROFILE}</p>
                    </ResumeSection>

                    <ResumeSection title="Technical Skills">
                        <div className={styles.skillList}>
                            {RESUME_SKILLS.map((skill) => (
                                <p key={skill.label} className={styles.skillRow}>
                                    <strong>{skill.label}:</strong> {skill.value}
                                </p>
                            ))}
                        </div>
                    </ResumeSection>

                    <ResumeSection title="Professional Experience">
                        {RESUME_EXPERIENCE.slice(0, 2).map((item) => (
                            <article key={item.title} className={styles.experienceCard}>
                                <h3 className={styles.experienceTitle}>
                                    {item.link ? (
                                        <a href={item.link.href} target="_blank" rel="noreferrer noopener">
                                            {item.title}
                                        </a>
                                    ) : (
                                        item.title
                                    )}
                                </h3>
                                <p className={styles.experienceMeta}>{item.role} | {item.period}</p>
                                <ul className={styles.bulletList}>
                                    {item.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                    {item.link ? (
                                        <li>
                                            <a href={item.link.href} target="_blank" rel="noreferrer noopener">
                                                {item.link.label}
                                            </a>
                                        </li>
                                    ) : null}
                                </ul>
                            </article>
                        ))}
                    </ResumeSection>
                </article>

                <article className={styles.sheet}>
                    <ResumeSection title="Professional Experience">
                        {RESUME_EXPERIENCE.slice(2).map((item) => (
                            <article key={item.title} className={styles.experienceCard}>
                                <h3 className={styles.experienceTitle}>
                                    {item.link ? (
                                        <a href={item.link.href} target="_blank" rel="noreferrer noopener">
                                            {item.title}
                                        </a>
                                    ) : (
                                        item.title
                                    )}
                                </h3>
                                <p className={styles.experienceMeta}>{item.role} | {item.period}</p>
                                <ul className={styles.bulletList}>
                                    {item.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                    {item.link ? (
                                        <li>
                                            <a href={item.link.href} target="_blank" rel="noreferrer noopener">
                                                {item.link.label}
                                            </a>
                                        </li>
                                    ) : null}
                                </ul>
                            </article>
                        ))}
                    </ResumeSection>

                    <ResumeSection title="Education">
                        <div className={styles.educationBlock}>
                            <h3 className={styles.educationTitle}>Dnipro National Mining University</h3>
                            <p className={styles.copy}>Department of Mine Aerology and Labor Safety</p>
                            <p className={styles.copy}>Graduated in 2018 (Worked as a Labor Inspector)</p>
                        </div>
                    </ResumeSection>

                    <ResumeSection title="Courses & Certifications">
                        <ul className={styles.plainList}>
                            {RESUME_CERTIFICATIONS.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </ResumeSection>

                    <ResumeSection title="Additional Information">
                        <ul className={styles.plainList}>
                            {RESUME_ADDITIONAL_INFO.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </ResumeSection>
                </article>
            </div>
        </div>
    )
}

export default Resume
