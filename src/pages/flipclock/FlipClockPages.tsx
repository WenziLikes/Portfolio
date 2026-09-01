import React from "react"
import {Link} from "react-router-dom"

import flipClockPreview from "../../assets/img/projects/flip-clock-1200.png"
import {FLIP_CLOCK_PRODUCT} from "../../content/flipClock"
import styles from "./FlipClockPages.module.scss"

const PRODUCT_PATH = FLIP_CLOCK_PRODUCT.productPath
const SUPPORT_EMAIL = "support@vmnorth.com"
const PRIVACY_EMAIL = "privacy@vmnorth.com"
const LEGAL_EMAIL = "legal@vmnorth.com"
const LAST_UPDATED = "August 31, 2026"

const PRODUCT_LINKS = [
    {label: "Overview", path: PRODUCT_PATH},
    {label: "Support", path: `${PRODUCT_PATH}/support`},
    {label: "Privacy", path: `${PRODUCT_PATH}/privacy`},
    {label: "Terms", path: `${PRODUCT_PATH}/terms`},
] as const

type ProductPath = (typeof PRODUCT_LINKS)[number]["path"]

interface FlipClockShellProps {
    activePath: ProductPath
    children: React.ReactNode
}

const FlipClockShell: React.FC<FlipClockShellProps> = ({activePath, children}) => (
    <div className={styles.page}>
        <header className={styles.header}>
            <Link className={styles.brand} to={PRODUCT_PATH} aria-label="FlipClock Display home">
                <span className={styles.brandMark} aria-hidden="true">12:48</span>
                <span>
                    <strong>FlipClock Display</strong>
                    <small>for macOS</small>
                </span>
            </Link>

            <nav className={styles.nav} aria-label="FlipClock Display">
                {PRODUCT_LINKS.map((item) => (
                    <Link
                        className={item.path === activePath ? styles.navLinkActive : styles.navLink}
                        key={item.path}
                        to={item.path}
                    >
                        {item.label}
                    </Link>
                ))}
                <a
                    className={styles.storeNavLink}
                    href={FLIP_CLOCK_PRODUCT.appStoreUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Mac App Store
                </a>
            </nav>
        </header>

        <main>{children}</main>
    </div>
)

const DocumentHeader: React.FC<{
    eyebrow: string
    lead: string
    title: string
}> = ({eyebrow, lead, title}) => (
    <header className={styles.documentHeader}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.documentLead}>{lead}</p>
    </header>
)

const MailButton: React.FC<{email: string; label: string; subject: string}> = ({email, label, subject}) => (
    <a
        className={styles.primaryAction}
        href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
    >
        {label}
    </a>
)

export const FlipClockLandingPage: React.FC = () => (
    <FlipClockShell activePath={PRODUCT_PATH}>
        <section className={styles.hero}>
            <div className={styles.heroCopy}>
                <p className={styles.eyebrow}>A focused display for your Mac</p>
                <h1>Time, weather, and atmosphere—without the noise.</h1>
                <p className={styles.heroLead}>
                    FlipClock Display is a fullscreen macOS clock with a dedicated settings window,
                    polished themes, optional local weather, and multi-display support.
                </p>

                <div className={styles.actionRow}>
                    <a
                        className={styles.primaryAction}
                        href={FLIP_CLOCK_PRODUCT.appStoreUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Download on the Mac App Store
                    </a>
                    <Link className={styles.secondaryAction} to={`${PRODUCT_PATH}/support`}>Get support</Link>
                    <Link className={styles.secondaryAction} to={`${PRODUCT_PATH}/privacy`}>Privacy</Link>
                </div>

                <ul className={styles.trustList}>
                    <li>Available now on the Mac App Store</li>
                    <li>No account required</li>
                    <li>No advertising</li>
                    <li>No analytics or user tracking in the app</li>
                </ul>
            </div>

            <div className={styles.previewCard}>
                <img
                    src={flipClockPreview}
                    alt="FlipClock Display fullscreen clock preview"
                    width="1200"
                    height="675"
                />
                <div className={styles.previewMeta}>
                    <span>
                        Mac App Store · {FLIP_CLOCK_PRODUCT.version} ·{" "}
                        <time dateTime={FLIP_CLOCK_PRODUCT.versionReleaseDate}>
                            {FLIP_CLOCK_PRODUCT.versionReleaseDateLabel}
                        </time>
                    </span>
                    <span>React · TypeScript · Rust · Tauri</span>
                </div>
            </div>
        </section>

        <section className={styles.featureGrid} aria-label="FlipClock Display highlights">
            <article>
                <span>01</span>
                <h2>Quiet by design</h2>
                <p>The core clock renders locally and works without a network connection.</p>
            </article>
            <article>
                <span>02</span>
                <h2>Weather is optional</h2>
                <p>Location and weather requests run only after you enable them in settings.</p>
            </article>
            <article>
                <span>03</span>
                <h2>Built for real displays</h2>
                <p>Choose themes, layout scale, idle timing, night dimming, and display routing.</p>
            </article>
        </section>

        <section className={styles.linkPanel}>
            <div>
                <p className={styles.eyebrow}>Product information</p>
                <h2>Clear answers before you use the app.</h2>
            </div>
            <div className={styles.linkPanelActions}>
                <a href={FLIP_CLOCK_PRODUCT.appStoreUrl} target="_blank" rel="noreferrer noopener">
                    Mac App Store
                </a>
                <a href={FLIP_CLOCK_PRODUCT.repositoryUrl} target="_blank" rel="noreferrer noopener">
                    Source code
                </a>
                <Link to={`${PRODUCT_PATH}/support`}>Support</Link>
                <Link to={`${PRODUCT_PATH}/privacy`}>Privacy Policy</Link>
                <Link to={`${PRODUCT_PATH}/terms`}>Terms of Use</Link>
            </div>
        </section>
    </FlipClockShell>
)

export const FlipClockSupportPage: React.FC = () => (
    <FlipClockShell activePath={`${PRODUCT_PATH}/support`}>
        <article className={styles.document}>
            <DocumentHeader
                eyebrow="Support"
                title="Help with FlipClock Display"
                lead="For setup, weather, purchases, display behavior, or accessibility questions, contact the developer directly."
            />

            <section className={styles.contactCard}>
                <div>
                    <p className={styles.cardLabel}>Support email</p>
                    <a className={styles.emailAddress} href={`mailto:${SUPPORT_EMAIL}`}>
                        {SUPPORT_EMAIL}
                    </a>
                    <p>Support for FlipClock Display is handled through the VM North custom-domain mailbox.</p>
                </div>
                <MailButton
                    email={SUPPORT_EMAIL}
                    label="Email support"
                    subject="FlipClock Display Support"
                />
            </section>

            <section className={styles.documentSection}>
                <h2>What to include</h2>
                <ul>
                    <li>FlipClock Display version, shown in Settings → About / Links.</li>
                    <li>Your macOS version and Mac model.</li>
                    <li>What you expected, what happened, and steps that reproduce the issue.</li>
                    <li>A screenshot if it helps. Please remove personal or sensitive information first.</li>
                    <li>For purchase issues, never send passwords or full payment-card details.</li>
                </ul>
            </section>

            <section className={styles.documentSection}>
                <h2>Quick checks</h2>
                <div className={styles.supportGrid}>
                    <div>
                        <h3>Weather or location</h3>
                        <p>
                            Confirm Weather is on, save Coarse or Precise location again, and check
                            macOS System Settings → Privacy &amp; Security → Location Services.
                        </p>
                    </div>
                    <div>
                        <h3>Purchase or restore</h3>
                        <p>
                            Use Restore Purchases with the same Apple ID used for the original
                            purchase. Billing and refunds are handled by Apple.
                        </p>
                    </div>
                    <div>
                        <h3>Fullscreen or displays</h3>
                        <p>
                            Close other fullscreen apps, confirm the selected display in Settings,
                            and retry Open Fullscreen.
                        </p>
                    </div>
                    <div>
                        <h3>Reset local state</h3>
                        <p>
                            Open Settings → Reset. Shared app settings removes saved coordinates;
                            Weather cache removes cached forecasts and Apple geocoding results.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.documentSection}>
                <h2>Privacy and legal questions</h2>
                <p>
                    Read the <Link to={`${PRODUCT_PATH}/privacy`}>FlipClock Display Privacy Policy</Link> and
                    {" "}<Link to={`${PRODUCT_PATH}/terms`}>Terms of Use</Link>. Privacy-specific requests
                    can be sent to <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
                </p>
            </section>
        </article>
    </FlipClockShell>
)

export const FlipClockPrivacyPage: React.FC = () => (
    <FlipClockShell activePath={`${PRODUCT_PATH}/privacy`}>
        <article className={styles.document}>
            <DocumentHeader
                eyebrow={`Privacy Policy · Updated ${LAST_UPDATED}`}
                title="Privacy Policy for FlipClock Display"
                lead="This policy applies specifically to the FlipClock Display macOS application. The core clock works locally; weather and location are optional."
            />

            <section className={styles.callout}>
                <strong>The short version</strong>
                <p>
                    FlipClock Display has no advertising, analytics SDK, account system, cross-app
                    tracking, or user profiling. The app does not sell personal data. Network and
                    location access are used only for optional product features that you enable.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>1. Data processed on your Mac</h2>
                <p>The app can store the following information locally on your Mac:</p>
                <ul>
                    <li>Clock, theme, sound, display, idle-time, and accessibility preferences.</li>
                    <li>
                        A coarse location rounded to two decimal places (approximately 1–2 km) or
                        exact latitude and longitude, depending on the mode you choose.
                    </li>
                    <li>Location save timestamps, cached Apple Weather responses, and cached city/region labels.</li>
                    <li>App Store entitlement state needed to unlock Pro features.</li>
                </ul>
                <p>
                    This local information is not synced to a FlipClock account or uploaded to a
                    developer database. Forecast cache entries are refreshed according to your
                    selected 10, 30, or 60 minute interval. Apple geocoding results may be cached
                    on the Mac for up to 30 days. Settings and saved coordinates remain until you
                    reset them or remove the app data.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>2. Location permission and exact coordinates</h2>
                <p>
                    FlipClock Display requests macOS Location Services only when you press
                    Save Coarse or Save Precise. Precise mode stores and transmits the latitude and
                    longitude returned by macOS. Coarse mode rounds both values to two decimal places
                    before they are stored or sent.
                </p>
                <p>
                    When optional weather is active, the selected coordinates are used to request a
                    forecast, determine a city/region label, and select official regional weather
                    alerts. The app does not collect continuous location history and does not request
                    location in the background simply because the clock is running.
                </p>
                <p>
                    In the Mac App Store build, the selected coordinates go directly to Apple
                    WeatherKit and Apple geocoding. They are not sent to VM North or routed through a
                    developer-owned weather proxy. An Open-Meteo fallback exists only in explicitly
                    enabled non-App-Store diagnostic builds; it is not active in the Mac App Store version.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>3. Network providers, purposes, and retention</h2>
                <p>
                    Network providers receive the selected coordinates and technical request data
                    needed to return the requested service. Direct connections also expose your
                    public IP address. Provider policies can change; the descriptions below reflect
                    published notices as of {LAST_UPDATED}.
                </p>

                <div className={styles.providerTableWrap}>
                    <table className={styles.providerTable}>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Data and purpose</th>
                                <th>Published retention</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <a href="https://developer.apple.com/weatherkit/" rel="noreferrer" target="_blank">
                                        Apple WeatherKit
                                    </a>
                                </td>
                                <td>
                                    In the Mac App Store build, selected latitude/longitude and the
                                    technical request data needed to return current conditions and
                                    forecasts go directly to Apple. Apple states that WeatherKit uses
                                    location only to provide forecasts, does not associate it with
                                    personally identifiable information, and does not track it between requests.
                                </td>
                                <td>
                                    Apple does not publish a fixed WeatherKit-specific period on the
                                    linked page. Its{" "}
                                    <a href="https://www.apple.com/legal/privacy/en-ww/" rel="noreferrer" target="_blank">
                                        general privacy policy
                                    </a>{" "}
                                    says personal data is kept only as long as necessary for the stated
                                    purpose or as required by law.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="https://www.apple.com/legal/privacy/data/en/location-services/" rel="noreferrer" target="_blank">
                                        Apple geocoding and Location Services
                                    </a>
                                </td>
                                <td>
                                    The selected coordinates are processed through Apple's native
                                    geocoding service to obtain a city and region label. The Mac App
                                    Store build does not send this request through VM North or a
                                    developer-owned proxy.
                                </td>
                                <td>
                                    Apple's Location Services notice does not publish a fixed period
                                    for these geocoding requests. Apple handles collected information
                                    under its{" "}
                                    <a href="https://www.apple.com/legal/privacy/en-ww/" rel="noreferrer" target="_blank">
                                        general privacy policy
                                    </a>.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="https://open-meteo.com/en/terms" rel="noreferrer" target="_blank">
                                        Open-Meteo diagnostic fallback
                                    </a>
                                </td>
                                <td>
                                    Only an explicitly enabled non-App-Store diagnostic build can send
                                    selected latitude/longitude, public IP address, app version, and
                                    request details to Open-Meteo for current conditions and forecasts.
                                    This fallback is not active in the Mac App Store version.
                                </td>
                                <td>
                                    Open-Meteo states that API web-server logs, which may contain
                                    coordinates, are deleted after 90 days. Aggregated call counts may
                                    remain longer.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={styles.documentSection}>
                <h2>4. How to disable weather or location</h2>
                <ul>
                    <li>Turn Weather off in FlipClock Display Settings to stop weather requests.</li>
                    <li>Turn Use my location off to stop using the saved coordinates.</li>
                    <li>
                        Revoke permission in macOS System Settings → Privacy &amp; Security →
                        Location Services → FlipClock Display.
                    </li>
                </ul>
                <p>
                    Turning Weather or Use my location off stops active use but does not by itself
                    erase the previously saved coordinates.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>5. How to delete local coordinates and caches</h2>
                <ol>
                    <li>Open FlipClock Display Settings.</li>
                    <li>Select Reset.</li>
                    <li>
                        Keep Shared app settings selected to delete saved coarse/precise coordinates
                        and their timestamps.
                    </li>
                    <li>
                        Keep Weather cache selected to delete cached forecasts and native
                        Apple geocoding results.
                    </li>
                    <li>Confirm the reset.</li>
                </ol>
                <p>
                    Removing FlipClock Display and its application data also removes locally stored
                    settings and caches. A local reset cannot delete provider security logs that
                    were already created; those follow the provider periods above.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>6. Website, purchases, and contact</h2>
                <p>
                    These product pages are hosted separately from the app. The web host receives
                    ordinary IP and request data. They also load the VMNorth support chat independently
                    of the portfolio website’s consent-based analytics choice; both are described in
                    the separate <Link to="/privacy">website privacy notice</Link>. FlipClock Display
                    itself contains no analytics or advertising.
                </p>
                <p>
                    Apple processes App Store purchases, subscription management, refunds, and
                    related transaction data under Apple’s own policies. FlipClock Display receives
                    only the entitlement result needed to unlock purchased features.
                </p>
                <p>
                    For privacy questions or requests, email{" "}
                    <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>. General product support
                    is available at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                </p>
            </section>
        </article>
    </FlipClockShell>
)

export const FlipClockTermsPage: React.FC = () => (
    <FlipClockShell activePath={`${PRODUCT_PATH}/terms`}>
        <article className={styles.document}>
            <DocumentHeader
                eyebrow={`Terms of Use · Updated ${LAST_UPDATED}`}
                title="Terms of Use for FlipClock Display"
                lead="These terms govern your use of the FlipClock Display macOS application and its optional services."
            />

            <section className={styles.documentSection}>
                <h2>1. Agreement and license</h2>
                <p>
                    By downloading or using FlipClock Display, you agree to these terms. You receive
                    a personal, limited, non-exclusive, non-transferable, revocable license to use the
                    app on Apple devices you own or control, subject to the App Store rules.
                </p>
                <p>
                    Where applicable, Apple’s{" "}
                    <a
                        href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                        rel="noreferrer"
                        target="_blank"
                    >
                        Standard Licensed Application End User License Agreement
                    </a>{" "}
                    also applies. If these terms conflict with mandatory App Store terms, the
                    mandatory App Store terms control.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>2. Free and Pro features</h2>
                <p>
                    Core clock features may be available without purchase. Optional Pro features can
                    include premium themes, weather, launch at login, idle-time control, night
                    dimming modes, and multi-display features. Feature availability may depend on
                    macOS capabilities and the app version.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>3. Purchases and subscriptions</h2>
                <ul>
                    <li>Payment is charged to your Apple ID when Apple confirms the purchase.</li>
                    <li>
                        A yearly subscription renews automatically unless cancelled through your
                        Apple account settings before the renewal deadline shown by Apple.
                    </li>
                    <li>A lifetime purchase is a one-time license for the offered Pro entitlement.</li>
                    <li>Prices, taxes, refunds, billing, and cancellation are handled by Apple.</li>
                    <li>Restore Purchases requires the same Apple ID used for the original purchase.</li>
                </ul>
            </section>

            <section className={styles.documentSection}>
                <h2>4. Weather, location, and alerts</h2>
                <p>
                    Weather and alert information comes from third-party public services, including
                    Apple WeatherKit and Apple geocoding in the Mac App Store build. An Open-Meteo
                    fallback may be used only by an explicitly enabled non-App-Store diagnostic build.
                    Data can be delayed, unavailable, incomplete, or inaccurate. FlipClock Display is
                    not an emergency-warning system and must not be your only source for safety-critical,
                    travel, medical, or property-protection decisions. Follow official local authorities
                    during severe weather.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>5. Acceptable use</h2>
                <p>You may not:</p>
                <ul>
                    <li>Use the app or its network features unlawfully or to abuse provider services.</li>
                    <li>Attempt to bypass purchase validation or access controls.</li>
                    <li>Interfere with the app, provider APIs, servers, rate limits, or other users.</li>
                    <li>
                        Copy, redistribute, resell, or reverse engineer the app except where applicable
                        law expressly permits it.
                    </li>
                </ul>
            </section>

            <section className={styles.documentSection}>
                <h2>6. Availability, changes, and termination</h2>
                <p>
                    The app and third-party services are provided on an “as available” basis.
                    Features may be changed, suspended, or discontinued when required for security,
                    provider compatibility, legal compliance, or product maintenance. Your license
                    may end if you materially violate these terms.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>7. Disclaimer and limitation of liability</h2>
                <p>
                    To the maximum extent permitted by law, FlipClock Display is provided without
                    warranties of uninterrupted operation, availability, merchantability, fitness
                    for a particular purpose, or accuracy of third-party data. The developer is not
                    liable for indirect, incidental, special, consequential, or punitive losses
                    arising from use of the app or unavailable/inaccurate third-party information.
                    Nothing in these terms excludes rights or liability that cannot lawfully be
                    excluded.
                </p>
            </section>

            <section className={styles.documentSection}>
                <h2>8. Governing law and contact</h2>
                <p>
                    These terms are governed by the applicable laws of Ontario and Canada, without
                    limiting mandatory consumer protections that apply where you live. Questions
                    about these terms can be sent to <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
                    Product support is available at{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                </p>
            </section>
        </article>
    </FlipClockShell>
)
