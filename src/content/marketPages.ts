export type MarketPagePath = "/canada" | "/usa" | "/europe"

export interface MarketPageSection {
    bullets?: readonly string[]
    paragraphs: readonly string[]
    title: string
}

export interface MarketPageContent {
    ctaSummary: string
    eyebrow: string
    heroLead: string
    heroPills: readonly string[]
    homeTeaser: string
    id: "canada" | "usa" | "europe"
    marketLabel: string
    path: MarketPagePath
    projectsTeaser: string
    sections: readonly MarketPageSection[]
    title: string
}

export interface MarketAlternateLink {
    hrefLang: "en" | "en-CA" | "en-US" | "x-default"
    path: "/" | MarketPagePath
}

export interface MarketRouteMetaEntry {
    alternates: readonly MarketAlternateLink[]
    description: string
    keywords: readonly string[]
    ogLocale: "en_CA" | "en_GB" | "en_US"
    ogType: "profile"
    path: MarketPagePath
    title: string
}

export const MARKET_PAGE_PATHS = ["/canada", "/usa", "/europe"] as const

export const MARKET_PAGE_ALTERNATES = [
    {hrefLang: "en-CA", path: "/canada"},
    {hrefLang: "en-US", path: "/usa"},
    {hrefLang: "en", path: "/europe"},
    {hrefLang: "x-default", path: "/"},
] as const satisfies readonly MarketAlternateLink[]

export const MARKET_PAGES: readonly MarketPageContent[] = [
    {
        ctaSummary: "Best fit for Canadian SaaS, ecommerce, and internal-product teams that want a developer who can own polished frontend delivery and ship dependable full-stack features without adding chaos.",
        eyebrow: "Canada",
        heroLead: "I help Canadian product teams ship clear React interfaces, maintainable TypeScript systems, and full-stack features that hold up after release.",
        heroPills: ["Toronto timezone overlap", "React + TypeScript + Java", "Remote-first delivery"],
        homeTeaser: "North American overlap for Canadian SaaS, product, and internal-tool teams.",
        id: "canada",
        marketLabel: "Canada",
        path: "/canada",
        projectsTeaser: "Use the Canada page when ecommerce, dashboards, and dependable product delivery are the strongest proof points.",
        sections: [
            {
                paragraphs: [
                    "Canadian teams often need a developer who can move between customer-facing product work and the deeper engineering details that keep a codebase healthy. That is the role I work best in.",
                    "I build React and TypeScript interfaces, connect them to backend services, and keep the implementation readable enough for a team to extend after launch. That is especially useful for startups, SaaS teams, and product groups that need both speed and technical discipline.",
                ],
                title: "What I help Canadian teams ship",
                bullets: [
                    "Responsive product interfaces and routed application flows",
                    "Admin tools, dashboards, and internal operations screens",
                    "Full-stack features connected to Java and Spring Boot services",
                    "Production-minded delivery with testing, accessibility, and maintainable structure",
                ],
            },
            {
                paragraphs: [
                    "Because I am already working in a North American timezone, collaboration with Canadian teams is straightforward for day-to-day delivery, planning sessions, and review cycles.",
                    "I am comfortable working in contract or full-time product settings where expectations are clear: take ownership, communicate early, and keep momentum visible.",
                ],
                title: "Why this fits Canada well",
                bullets: [
                    "Reliable overlap for Eastern and Central time-based teams",
                    "Clear written communication and calm remote collaboration",
                    "Strong focus on product quality, not just raw implementation speed",
                ],
            },
            {
                paragraphs: [
                    "I work best when I can connect product intent with engineering execution. That means translating requirements into a clean UI, practical architecture, and implementation details that do not become expensive to revisit later.",
                    "The result is code that is easier to maintain, easier to scale, and easier for a team to keep shipping on top of.",
                ],
                title: "How I usually work",
                bullets: [
                    "Own scoped features from interface to backend integration",
                    "Keep components and flows understandable as the product grows",
                    "Use testing and release discipline where it meaningfully reduces risk",
                ],
            },
        ],
        title: "Full Stack Developer for Canadian Product Teams",
    },
    {
        ctaSummary: "Strong fit for US startups and product teams that care about execution speed, ownership, and maintainable frontend and full-stack delivery across fast-moving roadmaps.",
        eyebrow: "USA",
        heroLead: "I work with US product teams that need fast execution, reliable frontend architecture, and full-stack delivery that supports real product momentum.",
        heroPills: ["North America overlap", "Startup-ready execution", "Product ownership mindset"],
        homeTeaser: "Startup-ready execution for fast-moving US product and software teams.",
        id: "usa",
        marketLabel: "USA",
        path: "/usa",
        projectsTeaser: "Use the USA page when ownership, feature velocity, and scalable React or full-stack delivery matter most.",
        sections: [
            {
                paragraphs: [
                    "US teams often operate with high product velocity, frequent iteration, and a strong expectation that engineers can own outcomes instead of just tickets. That is an environment I enjoy.",
                    "I can help build customer-facing React experiences, improve TypeScript structure, and connect features end to end with Java or Spring Boot services when the product needs someone who can move across the stack.",
                ],
                title: "What I help US teams accelerate",
                bullets: [
                    "React and TypeScript product surfaces that feel polished in real use",
                    "Commerce, onboarding, dashboard, and internal workflow features",
                    "Frontend architecture work that reduces future delivery friction",
                    "End-to-end implementation that keeps product velocity high without leaving cleanup debt behind",
                ],
            },
            {
                paragraphs: [
                    "For US startups and software companies, speed matters, but so does whether the code can survive the next ten releases. I try to balance both by shipping quickly while keeping structure clear and extendable.",
                    "That balance is especially valuable for teams scaling beyond MVP stage, redesigning important flows, or improving systems that already have active users.",
                ],
                title: "Why teams in the US hire me",
                bullets: [
                    "Comfortable taking ownership across UI, business logic, and delivery details",
                    "Strong bias toward clarity, maintainability, and release readiness",
                    "North American schedule overlap for planning, review, and iteration",
                ],
            },
            {
                paragraphs: [
                    "I bring a practical product-engineering approach: understand the user-facing outcome, structure the implementation so it stays workable, and keep communication direct when tradeoffs appear.",
                    "That makes me useful for founders, product leads, and engineering teams who want a dependable individual contributor on meaningful product work.",
                ],
                title: "How I add value day to day",
                bullets: [
                    "Translate product goals into scoped technical delivery",
                    "Strengthen weak frontend structure without rewriting everything",
                    "Ship features in a way that still respects long-term maintainability",
                ],
            },
        ],
        title: "Full Stack Developer for US Product Teams",
    },
    {
        ctaSummary: "Useful for European teams that want an English-first remote developer who works well asynchronously, overlaps mornings with Europe, and ships maintainable product work across frontend and backend boundaries.",
        eyebrow: "Europe",
        heroLead: "I collaborate with European product teams that need thoughtful React and TypeScript delivery, strong communication, and dependable async execution.",
        heroPills: ["Async-friendly collaboration", "Morning overlap with Europe", "English, Polish, Ukrainian, Russian"],
        homeTeaser: "Async-friendly collaboration for distributed European product teams.",
        id: "europe",
        marketLabel: "Europe",
        path: "/europe",
        projectsTeaser: "Use the Europe page when distributed teamwork, maintainability, and documented delivery style are the strongest fit.",
        sections: [
            {
                paragraphs: [
                    "European teams often work across countries, languages, and time zones. In that setting, clear communication and well-structured implementation matter just as much as raw coding speed.",
                    "I can contribute to customer-facing React work, full-stack feature delivery, and frontend architecture decisions in a way that supports distributed collaboration instead of fighting it.",
                ],
                title: "What I help European teams deliver",
                bullets: [
                    "React and TypeScript interfaces for real product usage",
                    "Maintainable frontend systems for distributed engineering teams",
                    "Full-stack product work connected to Java and Spring Boot backends",
                    "Implementation details documented and structured for async collaboration",
                ],
            },
            {
                paragraphs: [
                    "From Toronto, I have reliable overlap with UK and European morning hours, and I am comfortable working asynchronously when a team spans several countries or communication styles.",
                    "That makes the collaboration model practical for startups, agencies, and established product teams that want dependable progress without constant hand-holding.",
                ],
                title: "Why this works well for Europe",
                bullets: [
                    "Comfortable with distributed, async-first workflows",
                    "Strong written communication and documented handoff habits",
                    "Language range that supports multicultural collaboration environments",
                ],
            },
            {
                paragraphs: [
                    "I focus on work that stays understandable after the handoff: components that are easier to extend, UI decisions that support usability, and code that does not become a burden for the next engineer.",
                    "That is especially important for European teams where sustainable delivery and long-term maintainability are often part of the culture, not an afterthought.",
                ],
                title: "How I work with distributed teams",
                bullets: [
                    "Keep feature scope visible and communication proactive",
                    "Write implementation that other engineers can confidently continue",
                    "Treat performance, accessibility, and polish as shipping criteria",
                ],
            },
        ],
        title: "Full Stack Developer for European Product Teams",
    },
] as const

export const MARKET_PAGES_BY_PATH = Object.fromEntries(
    MARKET_PAGES.map((page) => [page.path, page])
) as Record<MarketPagePath, MarketPageContent>

export const MARKET_ROUTE_META = {
    "/canada": {
        alternates: MARKET_PAGE_ALTERNATES,
        description: "Full stack developer for Canadian product teams. React, TypeScript, Java, and Spring Boot delivery with North American timezone overlap and production-ready execution.",
        keywords: [
            "full stack developer canada",
            "react developer canada",
            "typescript developer canada",
            "remote developer canada",
            "canadian product teams",
            "toronto timezone developer",
        ],
        ogLocale: "en_CA",
        ogType: "profile",
        path: "/canada",
        title: "Full Stack Developer for Canada | Viacheslav Murakhin",
    },
    "/usa": {
        alternates: MARKET_PAGE_ALTERNATES,
        description: "Full stack developer for US product teams and startups. React, TypeScript, Java, and Spring Boot delivery focused on ownership, speed, and maintainable execution.",
        keywords: [
            "full stack developer usa",
            "react developer usa",
            "typescript developer us startup",
            "remote developer usa",
            "us product teams",
            "startup product engineer",
        ],
        ogLocale: "en_US",
        ogType: "profile",
        path: "/usa",
        title: "Full Stack Developer for USA | Viacheslav Murakhin",
    },
    "/europe": {
        alternates: MARKET_PAGE_ALTERNATES,
        description: "Full stack developer for European product teams. React, TypeScript, Java, and Spring Boot delivery with async-friendly collaboration and strong support for distributed engineering work.",
        keywords: [
            "full stack developer europe",
            "react developer europe",
            "typescript developer europe",
            "remote developer europe",
            "distributed product teams",
            "async product engineering",
        ],
        ogLocale: "en_GB",
        ogType: "profile",
        path: "/europe",
        title: "Full Stack Developer for Europe | Viacheslav Murakhin",
    },
} as const satisfies Record<MarketPagePath, MarketRouteMetaEntry>
