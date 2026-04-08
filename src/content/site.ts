import {isAnalyticsEnabled} from "../utils/analytics"
import {MARKET_ROUTE_META, type MarketAlternateLink} from "./marketPages"

export interface MainSection {
    id: "home" | "about" | "expertise" | "experience" | "projects"
    label: string
}

export type MainSectionId = MainSection["id"]

export interface ExternalNavLink {
    displayTitle: string
    href: string
    id: "vm-studio"
    label: string
    subtitle?: string
}

export interface SocialLink {
    id: "email" | "phone" | "github" | "linkedin"
    href?: string
    label: string
    text: string
    external?: boolean
}

export interface AboutPrinciple {
    title: string
    text: string
}

export interface ExperienceTimelineItem {
    company: string
    description: string
    period: string
    role: string
}

export interface ExpertiseItem {
    eyebrow: string
    keywords: string[]
    text: string
    title: string
}

export interface ResumeSkill {
    label: string
    value: string
}

export interface ResumeExperienceItem {
    bullets: string[]
    link?: {
        href: string
        label: string
    }
    period: string
    role: string
    title: string
}

export interface LegalSection {
    paragraphs?: string[]
    title: string
    bullets?: string[]
}

export interface RouteMetaEntry {
    alternates?: readonly MarketAlternateLink[]
    description: string
    keywords?: readonly string[]
    ogLocale?: string
    ogType?: "profile" | "website"
    path: string
    robots?: string
    title: string
}

export const SITE_META = {
    author: "Viacheslav Murakhin",
    description: "Full stack developer portfolio of Viacheslav Murakhin. React, TypeScript, Java, and Spring Boot work for remote product teams across Canada, the United States, and Europe.",
    language: "en",
    name: "Viacheslav Murakhin",
    ogImageAlt: "Portfolio preview for Viacheslav Murakhin",
    ogImageHeight: 842,
    ogImagePath: "/seo-preview.jpg",
    ogImageWidth: 1200,
    shortName: "VM Portfolio",
    title: "Viacheslav Murakhin | Full Stack Developer Portfolio",
    url: "https://viacheslavmurakhin.com",
} as const

export const TARGET_MARKETS = ["Canada", "United States", "Europe"] as const
export const TARGET_MARKETS_TEXT = "Canada, the United States, and Europe"
export const PROFESSIONAL_LANGUAGE_CODES = ["en", "pl", "ru", "uk"] as const
export const PROFESSIONAL_LANGUAGE_LABELS = ["English", "Polish", "Russian", "Ukrainian"] as const
export const DEFAULT_SITE_KEYWORDS = [
    "full stack developer",
    "react developer",
    "typescript developer",
    "frontend developer",
    "java spring boot developer",
    "developer portfolio",
    "remote developer",
    "North America",
    "Canada",
    "United States",
    "Europe",
] as const

export const COPYRIGHT_YEAR = "2026"
export const COPYRIGHT_NOTICE = `© ${COPYRIGHT_YEAR} ${SITE_META.name}. All rights reserved.`

export const PROFILE = {
    availability: `Open to full-time and contract roles with remote product teams across ${TARGET_MARKETS_TEXT}.`,
    firstName: "Viacheslav",
    fullName: "Viacheslav Murakhin",
    lastName: "Murakhin",
    location: "Remote-first | North America & Europe",
    phone: "+1 (437) 557-9029",
    phoneHref: "tel:+14375579029",
    primaryDomain: SITE_META.url,
    role: "Full Stack Developer",
    roleLine: "React | TypeScript | Java | Spring Boot",
    summary: `Full stack developer building React and TypeScript frontends, Java and Spring Boot backends, and scalable web applications for remote product teams across ${TARGET_MARKETS_TEXT}.`,
} as const

export const MAIN_SECTIONS: MainSection[] = [
    {id: "home", label: "Home"},
    {id: "about", label: "About"},
    {id: "expertise", label: "Expertise"},
    {id: "experience", label: "Experience"},
    {id: "projects", label: "Projects"},
]

export const EXTERNAL_NAV_LINKS: ExternalNavLink[] = [
    {
        displayTitle: "VM NORTH",
        href: "https://vmnorth.com",
        id: "vm-studio",
        label: "Vm North",
        subtitle: "DIGITAL PRODUCT STUDIO",
    },
]

export const SOCIAL_LINKS: SocialLink[] = [
    {
        id: "email",
        label: "Email",
        text: "Email",
    },
    {
        href: PROFILE.phoneHref,
        id: "phone",
        label: "Phone",
        text: PROFILE.phone,
    },
    {
        external: true,
        href: "https://github.com/WenziLikes",
        id: "github",
        label: "GitHub",
        text: "GitHub",
    },
    {
        external: true,
        href: "https://www.linkedin.com/in/viacheslav-murakhin",
        id: "linkedin",
        label: "LinkedIn",
        text: "LinkedIn",
    },
]

export const ABOUT_PRINCIPLES: AboutPrinciple[] = [
    {
        title: "Build",
        text: "I create interfaces that feel intuitive, responsive, and polished in real use.",
    },
    {
        title: "Structure",
        text: "I write clean, scalable code that stays easy to extend as products grow.",
    },
    {
        title: "Ship",
        text: "I focus on production readiness: performance, accessibility, testing, and details that hold up after launch.",
    },
]

export const ABOUT_STACK = ["React", "TypeScript", "Java", "Spring Boot", "SCSS Modules", "Vitest", "Playwright"]

export const ABOUT_COPY = {
    eyebrow: "About",
    intro: "I am a full stack developer building React and TypeScript products that are clear for users, reliable in code, and ready to scale for teams across North America and Europe.",
    quote: "I build React and TypeScript products that feel polished for users and stay maintainable for teams.",
    paragraphs: [
        "My work connects interface, logic, and product thinking. I design and build full stack web applications with React, TypeScript, Java, and Spring Boot, focusing on experiences that load fast, feel intuitive, and support real business goals for distributed teams.",
        "I work with product teams across Canada, the United States, and Europe on frontend architecture, reusable UI systems, and production-ready delivery. I care about long-term maintainability, accessibility, performance, and code that stays easy to extend.",
    ],
} as const

export const EXPERTISE_COPY = {
    eyebrow: "Expertise",
    lead: `Product delivery for modern teams, startups, and software products across ${TARGET_MARKETS_TEXT}.`,
    summary: "I help teams build clear user-facing experiences, strengthen TypeScript codebases, and ship full-stack features that hold up in production for international product work.",
    title: "React, TypeScript, and full stack expertise",
} as const

export const EXPERTISE_SIGNALS = [
    "React developer",
    "TypeScript developer",
    "Full stack developer",
    "Frontend architecture",
    "Java & Spring Boot",
    "Product teams",
    "North America & Europe",
] as const

export const EXPERTISE_ITEMS = [
    {
        eyebrow: "React Developer",
        keywords: ["React developer", "Product teams"],
        text: "I build responsive React interfaces for product teams that care about UX, maintainability, and release quality. That includes reusable components, routed flows, responsive layouts, and details that improve real-world usability.",
        title: "React product interfaces that feel polished",
    },
    {
        eyebrow: "TypeScript Systems",
        keywords: ["TypeScript developer", "Frontend architecture"],
        text: "I use TypeScript to keep frontend systems easier to scale, refactor, and maintain. My focus is clean component structure, predictable state, and architecture that stays understandable as features grow.",
        title: "TypeScript frontend systems that stay maintainable",
    },
    {
        eyebrow: "Full Stack Delivery",
        keywords: ["Full stack developer", "Java & Spring Boot"],
        text: "I work across frontend and backend delivery, connecting React and TypeScript clients with Java and Spring Boot services, business logic, and relational data flows so features ship end to end.",
        title: "Full stack execution from UI to backend logic",
    },
] satisfies ExpertiseItem[]

export const EXPERIENCE_TIMELINE: ExperienceTimelineItem[] = [
    {
        company: "Independent Product Work",
        description: "Building and iterating on full-stack products, React and TypeScript frontends, portfolio systems, and admin tooling with Java, Spring Boot, and modern testing workflows.",
        period: "2024 - Present",
        role: "Full Stack Developer",
    },
    {
        company: "Freelance & Client Projects",
        description: "Delivered client-facing websites and internal dashboards as a frontend and full stack developer, with focus on responsive UI, reporting, maintainability, and release quality.",
        period: "2020 - 2024",
        role: "Frontend / Full Stack Developer",
    },
    {
        company: "Engineering Background",
        description: "Built a disciplined technical foundation through engineering education and regulated operations work before moving fully into software delivery.",
        period: "2018 - 2020",
        role: "Technical Operations",
    },
]

export const RESUME_PROFILE = `Full Stack Developer with 4+ years of experience building responsive web applications and product features from concept to deployment. Strong hands-on background in React, TypeScript, Java, and Spring Boot, with practical experience building ecommerce flows, admin dashboards, portfolio systems, and maintainable frontend architecture. Focused on performance, usability, and clear delivery for remote product teams across ${TARGET_MARKETS_TEXT}, with experience using Vite, React Router, Vitest, and Playwright to ship reliable production-ready products.`

export const RESUME_SKILLS: ResumeSkill[] = [
    {
        label: "Languages",
        value: "HTML5, CSS3 / SCSS / Sass, JavaScript, TypeScript, Java, Rust",
    },
    {
        label: "Frameworks / Libraries",
        value: "React, React Router, Redux, Tauri v2, Spring Boot, Spring Security, Hibernate, JDBC",
    },
    {
        label: "Build Tools / Testing",
        value: "Vite, pnpm, npm, Maven, Gradle, Vitest, Playwright",
    },
    {
        label: "Rendering / Runtime",
        value: "Canvas 2D, Tauri desktop runtime, macOS app packaging",
    },
    {
        label: "Databases",
        value: "PostgreSQL, MySQL, Firebase",
    },
    {
        label: "Tools",
        value: "IntelliJ IDEA, VS Code, Terminal, Bash, Vim, Git",
    },
    {
        label: "Containerization",
        value: "Docker",
    },
    {
        label: "Languages Spoken",
        value: "English, Polish, Russian, Ukrainian",
    },
]

export const RESUME_EXPERIENCE: ResumeExperienceItem[] = [
    {
        bullets: [
            "Developed a full-featured eCommerce application from scratch.",
            "Implemented user authentication, catalog management, cart flows, and checkout logic.",
            "Integrated backend services and relational data flows using React, TypeScript, Java, and Spring Boot.",
            "Structured reusable components and business logic so the product stayed maintainable as features expanded.",
        ],
        link: {
            href: "https://github.com/WenziLikes/E42-StoreEcommerce",
            label: "GitHub Project",
        },
        period: "2024 - Present",
        role: "Full Stack Developer",
        title: "E42 Store Ecommerce Project",
    },
    {
        bullets: [
            "Built a macOS flip-clock screensaver with React, TypeScript, Tauri v2, and a Rust-backed desktop runtime.",
            "Implemented a deterministic Canvas 2D rendering engine with live settings updates and stable runtime behavior without canvas re-mounts.",
            "Added multi-display support, night dimming, audio click feedback, and a floating settings panel for a polished desktop experience.",
            "Structured the app with Feature-Sliced Design and release flows prepared for App Store distribution.",
        ],
        link: {
            href: "https://github.com/WenziLikes/FlipClock",
            label: "GitHub Project",
        },
        period: "2025 - Present",
        role: "Frontend / Desktop Developer",
        title: "Flip Clock Screensaver",
    },
    {
        bullets: [
            "Built a personal portfolio focused on strong first impression, responsive layout, and direct resume access.",
            "Implemented reusable sections, route-based navigation, and a dedicated resume page for a clearer content flow.",
            "Added automated coverage with Vitest and Playwright to verify routes, cards, and mobile navigation behavior.",
        ],
        link: {
            href: SITE_META.url,
            label: "Live Portfolio",
        },
        period: "2026 - Present",
        role: "Frontend Developer",
        title: "Portfolio Project",
    },
    {
        bullets: [
            "Developed an admin dashboard for user operations, exports, and internal reporting.",
            "Implemented CRUD flows, role-based access patterns, and data management features for day-to-day product operations.",
            "Improved maintainability by organizing frontend and backend modules around reusable workflows.",
        ],
        link: {
            href: "https://github.com/WenziLikes/PetProjectCRM",
            label: "GitHub Project",
        },
        period: "2021 - Present",
        role: "Full Stack Developer",
        title: "CRM Dashboard Project",
    },
    {
        bullets: [
            "Designed and developed a full-stack educational website from concept to production delivery.",
            "Improved website performance and usability through targeted frontend optimization and cleaner page structure.",
            "Handled implementation independently, including interface development, logic integration, and deployment preparation.",
        ],
        period: "2020",
        role: "Freelance Developer",
        title: "Freelance Project - ProfiZNO.com (Ukraine)",
    },
]

export const RESUME_CERTIFICATIONS = [
    "Java Courses - SDAcademy (Certificate of Completion)",
    "Scrum - SDAcademy (Certificate of Completion)",
    "JavaScript Course - WebDev (Verification available)",
    "Spring Boot - AmigosCode (Certificate of Completion)",
]

export const RESUME_ADDITIONAL_INFO = [
    `Open to remote collaboration across ${TARGET_MARKETS_TEXT}`,
    "Experienced with product teams, startups, and modern web delivery",
    "Focused on accessible, responsive, and maintainable product delivery",
    "Comfortable collaborating across product, frontend, and backend work",
]

export const COPYRIGHT_CONTENT: LegalSection[] = [
    {
        paragraphs: [
            `${COPYRIGHT_NOTICE} The original code, writing, layout, branding, custom graphics, and portfolio presentation on this site are protected intellectual property unless a different license is stated explicitly.`,
        ],
        title: "Ownership",
    },
    {
        bullets: [
            "Copying substantial parts of the codebase, written copy, or design system into another site or portfolio is not permitted without prior written permission.",
            "Project screenshots, mockups, and custom illustrations on this site are provided for presentation purposes only.",
            "Open-source packages used to build the site remain under their respective third-party licenses.",
        ],
        title: "Permitted and Restricted Use",
    },
    {
        paragraphs: [
            "The name Viacheslav Murakhin, the VM Portfolio presentation, and related brand elements are used to identify this website and professional work. They may not be reused in a way that implies endorsement, authorship, or affiliation.",
        ],
        title: "Brand and Attribution",
    },
    {
        paragraphs: [
            "For licensing questions, speaking requests, or permission to reuse material, contact via email before republishing any portion of this site.",
        ],
        title: "Contact",
    },
]

export const PRIVACY_CONTENT: LegalSection[] = [
    {
        paragraphs: [
            isAnalyticsEnabled
                ? "This portfolio does not require an account and does not ask visitors to submit personal information directly on the site, but it can use Google Analytics 4 to measure page visits and navigation patterns after you explicitly allow analytics on your device."
                : "This portfolio does not require an account and does not ask visitors to submit personal information directly on the site.",
        ],
        title: "What This Site Collects",
    },
    {
        bullets: [
            "Your hosting provider may log basic technical request data such as IP address, browser, device, and access time as part of standard web server operations.",
            ...(isAnalyticsEnabled
                ? [
                    "Google Analytics 4 loads only after you allow analytics on this device.",
                    "Once enabled, Google Analytics 4 may process page views, approximate location, browser, device, referral information, and selected interaction events such as resume, social, and contact link clicks to help understand how the site is used.",
                    "If you allow analytics, Google Analytics can use cookies or similar browser storage to distinguish returning visitors and session activity.",
                ]
                : []),
            "The site includes external links to email, phone, GitHub, and LinkedIn. Those services apply their own privacy policies after you leave this site.",
            "Google Fonts are requested from Google's CDN for typography rendering while browsing the site.",
        ],
        title: "Third-Party Requests",
    },
    {
        paragraphs: [
            isAnalyticsEnabled
                ? "If analytics settings, cookies, forms, embeds, or other third-party scripts change in the future, this policy should be reviewed and updated before those changes go live."
                : "If analytics, forms, or cookies are added in the future, this policy should be updated before those features go live.",
        ],
        title: "Future Changes",
    },
]

export const ROUTE_META: Record<string, RouteMetaEntry> = {
    "/": {
        description: SITE_META.description,
        keywords: [
            ...DEFAULT_SITE_KEYWORDS,
            "full stack developer portfolio",
            "react developer portfolio",
            "remote product teams",
        ],
        ogType: "profile",
        path: "/",
        title: SITE_META.title,
    },
    "/about": {
        description: `About Viacheslav Murakhin, a React and full stack developer focused on responsive UI, TypeScript architecture, and reliable product delivery for teams across ${TARGET_MARKETS_TEXT}.`,
        keywords: [
            "about react developer",
            "full stack developer",
            "frontend developer",
            "product engineering",
            "remote developer",
            "North America",
            "Europe",
        ],
        ogType: "profile",
        path: "/about",
        title: "About | Viacheslav Murakhin",
    },
    "/copyright": {
        description: "Copyright and usage notice for the Viacheslav Murakhin portfolio website.",
        keywords: ["copyright notice", "portfolio copyright", "usage policy"],
        ogType: "website",
        path: "/copyright",
        robots: "noindex,follow",
        title: "Copyright | Viacheslav Murakhin",
    },
    "/experience": {
        description: `Selected React, TypeScript, frontend, and full stack experience from Viacheslav Murakhin across shipped web apps, internal tools, and client work for teams in ${TARGET_MARKETS_TEXT}.`,
        keywords: [
            "full stack developer experience",
            "react developer experience",
            "typescript developer experience",
            "frontend developer portfolio",
            "remote product teams",
            "North America",
            "Europe",
        ],
        ogType: "profile",
        path: "/experience",
        title: "Experience | Viacheslav Murakhin",
    },
    "/expertise": {
        description: `React, TypeScript, frontend architecture, and full stack expertise from Viacheslav Murakhin for product teams and startups across ${TARGET_MARKETS_TEXT}.`,
        keywords: [
            "react typescript developer",
            "frontend architecture",
            "java spring boot developer",
            "remote full stack developer",
            "North America",
            "Europe",
        ],
        ogType: "profile",
        path: "/expertise",
        title: "Expertise | Viacheslav Murakhin",
    },
    "/home": {
        description: SITE_META.description,
        keywords: [
            ...DEFAULT_SITE_KEYWORDS,
            "full stack developer portfolio",
            "react developer portfolio",
            "remote product teams",
        ],
        ogType: "profile",
        path: "/",
        robots: "noindex,follow",
        title: SITE_META.title,
    },
    "/privacy": {
        description: "Privacy notice for visitors of the Viacheslav Murakhin portfolio website.",
        keywords: ["privacy notice", "portfolio privacy policy", "analytics consent"],
        ogType: "website",
        path: "/privacy",
        robots: "noindex,follow",
        title: "Privacy | Viacheslav Murakhin",
    },
    "/projects": {
        description: "Featured React and TypeScript portfolio projects by Viacheslav Murakhin, including ecommerce, admin dashboards, portfolio engineering, and a macOS screensaver built for modern product teams.",
        keywords: [
            "react developer portfolio",
            "typescript portfolio",
            "software developer portfolio",
            "full stack projects",
            "frontend portfolio",
            "product engineering",
        ],
        ogType: "website",
        path: "/projects",
        title: "Projects | Viacheslav Murakhin",
    },
    "/resume": {
        description: `Resume of Viacheslav Murakhin, a full stack developer with React, TypeScript, Java, and Spring Boot experience for remote teams across ${TARGET_MARKETS_TEXT}.`,
        keywords: [
            "full stack developer resume",
            "react developer resume",
            "typescript developer resume",
            "java spring boot developer",
            "North America",
            "Europe",
        ],
        ogType: "profile",
        path: "/resume",
        title: "Resume | Viacheslav Murakhin",
    },
    "/404": {
        description: "The page you requested could not be found on the Viacheslav Murakhin portfolio website.",
        keywords: ["page not found", "portfolio 404"],
        ogType: "website",
        path: "/404",
        robots: "noindex,follow",
        title: "Page Not Found | Viacheslav Murakhin",
    },
    ...MARKET_ROUTE_META,
}
