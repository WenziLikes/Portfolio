import React from "react"
import {Link} from "react-router-dom"
import styles from "./MarketLandingPage.module.scss"
import ProtectedEmailLink from "../../components/protectedEmailLink/ProtectedEmailLink"
import {RESUME_DOWNLOAD_NAME, RESUME_FILE_URL} from "../../constants/resume"
import {MARKET_PAGES, MARKET_PAGES_BY_PATH, type MarketPagePath} from "../../content/marketPages"
import {PROFILE} from "../../content/site"
import {trackContactClick, trackResumeClick} from "../../utils/analytics"

interface MarketLandingPageProps {
    path: MarketPagePath
}

const MarketLandingPage: React.FC<MarketLandingPageProps> = ({path}) => {
    const page = MARKET_PAGES_BY_PATH[path]

    return (
        <div className={styles.marketPage}>
            <div className={styles.toolbar}>
                <Link className={styles.backLink} to="/">
                    Back to portfolio
                </Link>
                <Link className={styles.projectsLink} to="/projects">
                    View projects
                </Link>
                <Link
                    className={styles.resumeLink}
                    to="/resume"
                    onClick={() => trackResumeClick("open_route", `market_${page.id}_toolbar`)}
                >
                    Open resume
                </Link>
            </div>

            <article className={styles.sheet}>
                <header className={styles.hero}>
                    <p className={styles.eyebrow}>{page.eyebrow}</p>
                    <h1 className={styles.title}>{page.title}</h1>
                    <p className={styles.lead}>{page.heroLead}</p>
                    <div className={styles.pillRow} aria-label={`${page.marketLabel} hiring signals`}>
                        {page.heroPills.map((pill) => (
                            <span key={pill} className={styles.pill}>{pill}</span>
                        ))}
                    </div>
                </header>

                <div className={styles.summaryGrid}>
                    <section className={styles.summaryCard}>
                        <h2 className={styles.cardTitle}>Why this page exists</h2>
                        <p className={styles.summaryCopy}>{page.ctaSummary}</p>
                    </section>

                    <aside className={styles.ctaCard}>
                        <h2 className={styles.cardTitle}>Direct contact</h2>
                        <ul className={styles.contactList}>
                            <li>
                                <a
                                    className={styles.contactLine}
                                    href={PROFILE.phoneHref}
                                    onClick={() => trackContactClick("phone", `market_${page.id}_phone`)}
                                >
                                    {PROFILE.phone}
                                </a>
                            </li>
                            <li>
                                <ProtectedEmailLink
                                    className={styles.contactLine}
                                    eventSource={`market_${page.id}_email`}
                                    title={`Email Viacheslav about ${page.marketLabel}`}
                                >
                                    hello@viacheslavmurakhin.com
                                </ProtectedEmailLink>
                            </li>
                        </ul>

                        <div className={styles.ctaActions}>
                            <a
                                className={styles.downloadLink}
                                href={RESUME_FILE_URL}
                                download={RESUME_DOWNLOAD_NAME}
                                onClick={() => trackResumeClick("download_pdf", `market_${page.id}_download_resume`)}
                            >
                                Download resume
                            </a>
                            <Link
                                className={styles.secondaryAction}
                                to="/resume"
                                onClick={() => trackResumeClick("open_route", `market_${page.id}_open_resume`)}
                            >
                                Review full resume
                            </Link>
                        </div>
                    </aside>
                </div>

                <div className={styles.sections}>
                    {page.sections.map((section) => (
                        <section className={styles.section} key={section.title}>
                            <h2 className={styles.sectionTitle}>{section.title}</h2>
                            <div className={styles.sectionBody}>
                                {section.paragraphs.map((paragraph) => (
                                    <p key={paragraph} className={styles.sectionCopy}>{paragraph}</p>
                                ))}
                                {section.bullets ? (
                                    <ul className={styles.bulletList}>
                                        {section.bullets.map((bullet) => (
                                            <li key={bullet}>{bullet}</li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </section>
                    ))}
                </div>

                <section className={styles.related}>
                    <h2 className={styles.relatedTitle}>Other regional pages</h2>
                    <p className={styles.relatedCopy}>
                        Each page has market-specific hiring copy. The Europe version is the generic English fallback for `hreflang`, while Canada and USA use regional English variants.
                    </p>
                    <nav className={styles.relatedNav} aria-label="Regional SEO landing pages">
                        {MARKET_PAGES.map((marketPage) => (
                            marketPage.path === path ? (
                                <span key={marketPage.path} className={styles.relatedCurrent} aria-current="page">
                                    {marketPage.marketLabel}
                                </span>
                            ) : (
                                <Link key={marketPage.path} className={styles.relatedLink} to={marketPage.path}>
                                    {marketPage.marketLabel}
                                </Link>
                            )
                        ))}
                    </nav>
                </section>
            </article>
        </div>
    )
}

export default MarketLandingPage
