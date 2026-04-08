import crmDashboardPreview from "../assets/img/projects/crm-dashboard-preview.svg"
import doc720 from "../assets/img/projects/doc-720.jpg"
import doc1200 from "../assets/img/projects/doc-1200.jpg"
import flipClockPreview720 from "../assets/img/projects/flip-clock-720.png"
import flipClockPreview1200 from "../assets/img/projects/flip-clock-1200.png"
import portfolioPreview720 from "../assets/img/projects/portfolio-720.webp"
import portfolioPreview1200 from "../assets/img/projects/portfolio-1200.webp"

export interface CardImage {
    alt: string
    frameInset?: string
    fit?: "contain" | "cover"
    height: number
    hoverScale?: number
    panelInsetBottom?: string
    panelInsetBottomMobile?: string
    position?: string
    scale?: number
    sizes?: string
    src: string
    srcSet?: string
    width: number
}

export interface CardAction {
    href: string
    label: string
}

export interface CardInfo {
    actions: CardAction[]
    description: string
    eyebrow: string
    featuredActionLabel?: string
    featuredDescription?: string
    id: number
    image: CardImage
    proofPoints?: string[]
    scope: string
    stack: string[]
    title: string
    year: string
}

export const PROJECTS_INFO: CardInfo[] = [
    {
        actions: [
            {
                href: "https://github.com/WenziLikes/E42-StoreEcommerce",
                label: "View repo",
            },
        ],
        description: "Full-stack ecommerce platform built with React, TypeScript, Java, and Spring Boot, covering authentication, catalog browsing, cart management, and checkout flows.",
        eyebrow: "Full-stack commerce",
        id: 1,
        image: {
            alt: "E42 Store eCommerce project preview",
            height: 657,
            hoverScale: 1.04,
            scale: 1.01,
            sizes: "(max-width: 760px) 100vw, (max-width: 1200px) 100vw, 56rem",
            src: doc1200,
            srcSet: `${doc720} 720w, ${doc1200} 1200w`,
            width: 1200,
        },
        scope: "Full Stack / Commerce",
        stack: ["React", "TypeScript", "Java", "Spring Boot"],
        title: "E42 Store",
        year: "2025",
    },
    {
        actions: [
            {
                href: "https://github.com/WenziLikes/PetProjectCRM",
                label: "View repo",
            },
        ],
        description: "Internal CRM dashboard built for support and operations, bringing user management, reporting, exports, and day-to-day admin workflows into one workspace.",
        eyebrow: "CRM / Operations tool",
        featuredDescription: "Internal operations dashboard that centralizes support, reporting, exports, and manager workflows in a single CRM interface.",
        id: 2,
        image: {
            alt: "CRM dashboard interface illustration",
            height: 800,
            hoverScale: 1.04,
            scale: 1.01,
            sizes: "(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 32rem",
            src: crmDashboardPreview,
            width: 1200,
        },
        proofPoints: ["User management", "Reporting and exports", "Internal workflow dashboard"],
        scope: "CRM / Operations",
        stack: ["React", "TypeScript", "SCSS", "Spring Boot"],
        title: "CRM Dashboard",
        year: "2024",
    },
    {
        actions: [
            {
                href: "https://github.com/WenziLikes/Portfolio",
                label: "View repo",
            },
        ],
        description: "Personal portfolio site built with React and TypeScript, designed as a polished frontend system with responsive sections, routed pages, reusable UI components, and automated testing.",
        eyebrow: "Frontend system",
        id: 3,
        image: {
            alt: "Portfolio project preview",
            fit: "contain",
            height: 842,
            hoverScale: 1.04,
            panelInsetBottom: "1.8rem",
            position: "center",
            scale: 1.01,
            sizes: "(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 32rem",
            src: portfolioPreview1200,
            srcSet: `${portfolioPreview720} 720w, ${portfolioPreview1200} 1200w`,
            width: 1200,
        },
        scope: "Frontend / Portfolio",
        stack: ["React", "TypeScript", "React Router", "SCSS Modules", "Vite", "Vitest", "Playwright"],
        title: "Portfolio",
        year: "2026",
    },
    {
        actions: [
            {
                href: "https://github.com/WenziLikes/FlipClock",
                label: "View repo",
            },
        ],
        description: "macOS flip-clock screensaver built with React, TypeScript, Rust, and Tauri, focused on deterministic rendering, multi-display support, and a polished settings experience.",
        eyebrow: "Desktop product",
        featuredActionLabel: "Explore project",
        featuredDescription: "Desktop product for macOS with a deterministic Canvas engine, floating controls, multi-display support, and packaging prepared for App Store release.",
        id: 4,
        image: {
            alt: "Flip Clock project preview",
            fit: "contain",
            frameInset: "5.2rem",
            height: 675,
            hoverScale: 1.04,
            panelInsetBottomMobile: "-2.4rem",
            scale: 1,
            sizes: "(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 32rem",
            src: flipClockPreview1200,
            srcSet: `${flipClockPreview720} 720w, ${flipClockPreview1200} 1200w`,
            width: 1200,
        },
        proofPoints: ["Deterministic Canvas engine", "Multi-display support", "Prepared for App Store"],
        scope: "macOS / Screensaver",
        stack: ["React", "TypeScript", "Tauri v2", "Rust", "Canvas 2D", "CSS Modules"],
        title: "Flip Clock",
        year: "2025",
    },
]
