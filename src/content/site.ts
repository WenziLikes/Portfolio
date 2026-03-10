import {isAnalyticsEnabled} from "../utils/analytics"

export interface MainSection {
    id: "home" | "about" | "experience" | "projects"
    label: string
}

export type MainSectionId = MainSection["id"]

export interface SocialLink {
    id: "email" | "phone" | "github" | "linkedin"
    href: string
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
    description: string
    path: string
    title: string
}

export const SITE_META = {
    author: "Viacheslav Murakhin",
    description: "Portfolio of Viacheslav Murakhin, a full stack developer building responsive product interfaces, maintainable frontend systems, and production-ready web experiences.",
    name: "Viacheslav Murakhin",
    ogImagePath: "/logo512.png",
    shortName: "VM Portfolio",
    title: "Viacheslav Murakhin | Full Stack Developer",
    url: "https://viacheslavmurakhin.com",
} as const

export const COPYRIGHT_YEAR = "2026"
export const COPYRIGHT_NOTICE = `© ${COPYRIGHT_YEAR} ${SITE_META.name}. All rights reserved.`

export const PROFILE = {
    availability: "Open to full-time roles, freelance projects, and product collaborations.",
    email: "viacheslavmurakhin@icloud.com",
    firstName: "Viacheslav",
    fullName: "Viacheslav Murakhin",
    lastName: "Murakhin",
    location: "Niagara-on-the-Lake, ON, Canada",
    phone: "+1 (437) 557-9029",
    phoneHref: "tel:+14375579029",
    primaryDomain: SITE_META.url,
    role: "Full Stack Developer",
    roleLine: "React | TypeScript | Java | Spring Boot",
    summary: "I build responsive web products with clean interfaces, reliable frontend architecture, and strong production polish.",
} as const

export const MAIN_SECTIONS: MainSection[] = [
    {id: "home", label: "Home"},
    {id: "about", label: "About"},
    {id: "experience", label: "Experience"},
    {id: "projects", label: "Projects"},
]

export const SOCIAL_LINKS: SocialLink[] = [
    {
        href: `mailto:${PROFILE.email}`,
        id: "email",
        label: "Email",
        text: PROFILE.email,
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
    intro: "I build web products that are clear for users, reliable in code, and ready to grow.",
    quote: "I aim to deliver products that look polished, work reliably, and stay easy to improve.",
    paragraphs: [
        "My work sits at the intersection of interface, logic, and product thinking. I focus on turning ideas into web experiences that feel intuitive, perform well, and solve real problems.",
        "What matters most to me is long-term value: thoughtful UI, solid architecture, and code that remains maintainable as a product evolves and a team builds on top of it.",
    ],
} as const

export const EXPERIENCE_TIMELINE: ExperienceTimelineItem[] = [
    {
        company: "Independent Product Work",
        description: "Building and iterating on full-stack products, portfolio systems, and admin tooling with React, TypeScript, Java, Spring Boot, and modern testing workflows.",
        period: "2024 - Present",
        role: "Full Stack Developer",
    },
    {
        company: "Freelance & Client Projects",
        description: "Delivered client-facing websites and internal dashboards with focus on responsiveness, reporting, maintainability, and release quality.",
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

export const RESUME_PROFILE = "Full Stack Developer with 4+ years of experience building responsive web applications and product features from concept to deployment. Strong hands-on background in React, TypeScript, Java, and Spring Boot, with practical experience designing clean UI, implementing business logic, and maintaining scalable codebases. Focused on performance, usability, and clear architecture, with experience using Vite, React Router, Vitest, and Playwright to deliver reliable, production-ready products."

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
    "Authorized to work in Canada",
    "Valid Ontario Driver's License (G)",
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
                ? "This portfolio does not require an account and does not ask visitors to submit personal information directly on the site, but it does use Google Analytics 4 to measure page visits and navigation patterns."
                : "This portfolio does not require an account and does not ask visitors to submit personal information directly on the site.",
        ],
        title: "What This Site Collects",
    },
    {
        bullets: [
            "Your hosting provider may log basic technical request data such as IP address, browser, device, and access time as part of standard web server operations.",
            ...(isAnalyticsEnabled
                ? [
                    "Google Analytics 4 may process page views, approximate location, browser, device, referral information, and selected interaction events such as resume, social, and contact link clicks to help understand how the site is used.",
                    "Google Analytics can use cookies or similar browser storage to distinguish returning visitors and session activity.",
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
        path: "/",
        title: SITE_META.title,
    },
    "/about": {
        description: "About Viacheslav Murakhin, a full stack developer focused on responsive UI, product quality, and maintainable frontend architecture.",
        path: "/about",
        title: "About | Viacheslav Murakhin",
    },
    "/copyright": {
        description: "Copyright and usage notice for the Viacheslav Murakhin portfolio website.",
        path: "/copyright",
        title: "Copyright | Viacheslav Murakhin",
    },
    "/experience": {
        description: "Selected product, frontend, and full stack experience from Viacheslav Murakhin.",
        path: "/experience",
        title: "Experience | Viacheslav Murakhin",
    },
    "/home": {
        description: SITE_META.description,
        path: "/",
        title: SITE_META.title,
    },
    "/privacy": {
        description: "Privacy notice for visitors of the Viacheslav Murakhin portfolio website.",
        path: "/privacy",
        title: "Privacy | Viacheslav Murakhin",
    },
    "/projects": {
        description: "Featured portfolio projects by Viacheslav Murakhin, including commerce, dashboards, and frontend product work.",
        path: "/projects",
        title: "Projects | Viacheslav Murakhin",
    },
    "/resume": {
        description: "Resume of Viacheslav Murakhin with full stack experience, technical skills, and project history.",
        path: "/resume",
        title: "Resume | Viacheslav Murakhin",
    },
}
