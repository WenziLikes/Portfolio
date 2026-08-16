import crmDashboardPreview from "../assets/img/projects/crm-dashboard-preview.svg"
import doc720 from "../assets/img/projects/doc-720.jpg"
import doc1200 from "../assets/img/projects/doc-1200.jpg"
import flipClockPreview720 from "../assets/img/projects/flip-clock-720.png"
import flipClockPreview1200 from "../assets/img/projects/flip-clock-1200.png"
import portfolioPreview720 from "../assets/img/projects/portfolio-720.webp"
import portfolioPreview1200 from "../assets/img/projects/portfolio-1200.webp"
import vmNorthPreview720 from "../assets/img/projects/vmnorth-homepage-720.jpg"
import vmNorthPreview1280 from "../assets/img/projects/vmnorth-homepage-1280.jpg"
import {FLIP_CLOCK_PRODUCT} from "./flipClock"

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
    productUrl?: string
    proofPoints?: string[]
    repositoryUrl?: string
    scope: string
    stack: string[]
    title: string
    year: string
}

export const PROJECTS_INFO: CardInfo[] = [
    {
        actions: [
            {
                href: "https://vmnorth.com",
                label: "Project site",
            },
        ],
        description: "Multilingual digital product studio platform with a React and TypeScript marketing frontend, Node.js backend, real-time visitor chat, secure admin workspace, and production deployment tooling.",
        eyebrow: "Product platform",
        featuredActionLabel: "Review platform",
        featuredDescription: "Pre-launch studio platform that combines a multilingual marketing site, real-time chat, project brief intake, passkey-first admin tools, and Docker-ready production operations.",
        id: 5,
        image: {
            alt: "VM North product studio platform homepage preview",
            fit: "contain",
            frameInset: "4.4rem",
            height: 720,
            hoverScale: 1.02,
            panelInsetBottomMobile: "-1.6rem",
            position: "center",
            scale: 0.99,
            sizes: "(max-width: 760px) 100vw, (max-width: 1200px) 100vw, 56rem",
            src: vmNorthPreview1280,
            srcSet: `${vmNorthPreview720} 720w, ${vmNorthPreview1280} 1280w`,
            width: 1280,
        },
        proofPoints: ["Multilingual product site", "Realtime chat and admin", "Docker and CI release flow"],
        scope: "Platform / Studio",
        stack: ["React 19", "TypeScript", "Node.js", "PostgreSQL", "SSE", "WebAuthn", "Docker"],
        title: "VM North",
        year: "2026",
    },
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
            fit: "contain",
            frameInset: "4.8rem",
            height: 657,
            hoverScale: 1.02,
            panelInsetBottomMobile: "-1.6rem",
            position: "center",
            scale: 0.99,
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
            fit: "contain",
            frameInset: "4.8rem",
            height: 800,
            hoverScale: 1.02,
            panelInsetBottomMobile: "-1.6rem",
            position: "center",
            scale: 0.98,
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
            frameInset: "4.8rem",
            height: 842,
            hoverScale: 1.02,
            panelInsetBottom: "1.8rem",
            panelInsetBottomMobile: "-1.6rem",
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
                href: FLIP_CLOCK_PRODUCT.appStoreUrl,
                label: "Mac App Store",
            },
        ],
        description: "Published macOS fullscreen clock built with React, TypeScript, Rust, and Tauri, with polished themes, optional weather, and multi-display support.",
        eyebrow: "Shipped Mac app",
        featuredActionLabel: "View on Mac App Store",
        featuredDescription: "Live Mac App Store product with a deterministic Canvas engine, privacy-first optional weather, premium themes, idle controls, and multi-display support.",
        id: 4,
        image: {
            alt: "FlipClock Display fullscreen clock and settings preview",
            fit: "contain",
            frameInset: "5.2rem",
            height: 675,
            hoverScale: 1.02,
            panelInsetBottomMobile: "-2.4rem",
            scale: 1,
            sizes: "(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 32rem",
            src: flipClockPreview1200,
            srcSet: `${flipClockPreview720} 720w, ${flipClockPreview1200} 1200w`,
            width: 1200,
        },
        productUrl: FLIP_CLOCK_PRODUCT.appStoreUrl,
        proofPoints: ["Live on the Mac App Store", "Privacy-first optional weather", "Multi-display support"],
        repositoryUrl: FLIP_CLOCK_PRODUCT.repositoryUrl,
        scope: "macOS / App Store",
        stack: ["React", "TypeScript", "Tauri v2", "Rust", "Canvas 2D", "CSS Modules"],
        title: FLIP_CLOCK_PRODUCT.name,
        year: "2026",
    },
]
