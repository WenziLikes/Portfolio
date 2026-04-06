import {PROJECTS_INFO} from "./content/projects"
import {ABOUT_STACK, PROFILE, RESUME_EXPERIENCE, ROUTE_META, SITE_META, SOCIAL_LINKS} from "./content/site"
import {EMAIL_ADDRESS} from "./utils/contact"

type SchemaNode = Record<string, unknown>

export const DEFAULT_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
export const NOINDEX_ROBOTS = "noindex,follow"
export const INDEXABLE_ROUTE_PATHS = ["/", "/about", "/expertise", "/experience", "/projects", "/resume"] as const
export const NON_INDEXABLE_ROUTE_PATHS = ["/privacy", "/copyright"] as const
export const PRERENDER_ROUTE_PATHS = [...INDEXABLE_ROUTE_PATHS, ...NON_INDEXABLE_ROUTE_PATHS] as const
export const NOT_FOUND_PATH = "/404"
export const LEGACY_HOME_PATH = "/home"

interface ResolvedRouteMeta {
    canonicalUrl: string
    description: string
    ogImageAlt: string
    ogImageHeight: number
    ogImageUrl: string
    ogImageWidth: number
    ogType: "profile" | "website"
    path: string
    robots: string
    title: string
}

interface SitemapRouteConfig {
    changefreq: "monthly" | "weekly"
    path: (typeof INDEXABLE_ROUTE_PATHS)[number]
    priority: `${number}.${number}`
}

const SITEMAP_ROUTES: SitemapRouteConfig[] = [
    {changefreq: "weekly", path: "/", priority: "1.0"},
    {changefreq: "monthly", path: "/about", priority: "0.8"},
    {changefreq: "monthly", path: "/expertise", priority: "0.8"},
    {changefreq: "monthly", path: "/experience", priority: "0.8"},
    {changefreq: "monthly", path: "/projects", priority: "0.9"},
    {changefreq: "weekly", path: "/resume", priority: "0.9"},
]

const WEBSITE_ID = `${SITE_META.url}#website`
const PERSON_ID = `${SITE_META.url}#person`
const ORGANIZATION_ID = `${SITE_META.url}#organization`
const SOCIAL_PROFILE_URLS = SOCIAL_LINKS
    .filter((link): link is (typeof SOCIAL_LINKS)[number] & {href: string} => Boolean(link.external && link.href))
    .map((link) => link.href)

const escapeXml = (value: string): string => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;")

export const getCanonicalUrl = (path: string): string => `${SITE_META.url}${path}`

export const getRouteMeta = (pathname: string): ResolvedRouteMeta => {
    const routeMeta = ROUTE_META[pathname] ?? ROUTE_META[NOT_FOUND_PATH]

    return {
        canonicalUrl: getCanonicalUrl(routeMeta.path),
        description: routeMeta.description,
        ogImageAlt: SITE_META.ogImageAlt,
        ogImageHeight: SITE_META.ogImageHeight,
        ogImageUrl: getCanonicalUrl(SITE_META.ogImagePath),
        ogImageWidth: SITE_META.ogImageWidth,
        ogType: routeMeta.ogType ?? "website",
        path: routeMeta.path,
        robots: routeMeta.robots ?? DEFAULT_ROBOTS,
        title: routeMeta.title,
    }
}

const getBreadcrumbSchema = (pathname: string): SchemaNode | null => {
    if (pathname === "/" || pathname === NOT_FOUND_PATH) {
        return null
    }

    const meta = getRouteMeta(pathname)

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                item: SITE_META.url,
                name: "Portfolio",
                position: 1,
            },
            {
                "@type": "ListItem",
                item: meta.canonicalUrl,
                name: meta.title.replace(/\s+\|\s+Viacheslav Murakhin$/, ""),
                position: 2,
            },
        ],
    }
}

const getOrganizationSchema = (): SchemaNode => ({
    "@context": "https://schema.org",
    "@id": ORGANIZATION_ID,
    "@type": "Organization",
    name: SITE_META.shortName,
    sameAs: SOCIAL_PROFILE_URLS,
    url: SITE_META.url,
})

const getPersonSchema = (): SchemaNode => ({
    "@context": "https://schema.org",
    "@id": PERSON_ID,
    "@type": "Person",
    description: PROFILE.summary,
    email: EMAIL_ADDRESS,
    familyName: PROFILE.lastName,
    givenName: PROFILE.firstName,
    image: getCanonicalUrl(SITE_META.ogImagePath),
    jobTitle: PROFILE.role,
    knowsAbout: [...ABOUT_STACK, "Frontend architecture", "Product engineering", "Responsive web development"],
    name: PROFILE.fullName,
    sameAs: SOCIAL_PROFILE_URLS,
    telephone: PROFILE.phoneHref.replace(/^tel:/, ""),
    url: SITE_META.url,
    worksFor: {
        "@id": ORGANIZATION_ID,
    },
})

const getWebsiteSchema = (): SchemaNode => ({
    "@context": "https://schema.org",
    "@id": WEBSITE_ID,
    "@type": "WebSite",
    author: {
        "@id": PERSON_ID,
    },
    description: SITE_META.description,
    inLanguage: SITE_META.language,
    name: SITE_META.shortName,
    publisher: {
        "@id": ORGANIZATION_ID,
    },
    url: SITE_META.url,
})

const getWebPageSchema = (pathname: string): SchemaNode => {
    const meta = getRouteMeta(pathname)
    const baseSchema: SchemaNode = {
        "@context": "https://schema.org",
        "@type": pathname === "/" || pathname === "/about" || pathname === "/expertise" || pathname === "/experience" || pathname === "/resume"
            ? "ProfilePage"
            : pathname === "/projects"
                ? "CollectionPage"
                : "WebPage",
        about: {
            "@id": PERSON_ID,
        },
        description: meta.description,
        inLanguage: SITE_META.language,
        isPartOf: {
            "@id": WEBSITE_ID,
        },
        mainEntity: {
            "@id": PERSON_ID,
        },
        name: meta.title,
        primaryImageOfPage: {
            "@type": "ImageObject",
            height: meta.ogImageHeight,
            url: meta.ogImageUrl,
            width: meta.ogImageWidth,
        },
        url: meta.canonicalUrl,
    }

    if (pathname === "/projects") {
        baseSchema.mainEntity = {
            "@id": `${meta.canonicalUrl}#projects`,
        }
    }

    return baseSchema
}

const getProjectsSchema = (): SchemaNode => ({
    "@context": "https://schema.org",
    "@id": `${getCanonicalUrl("/projects")}#projects`,
    "@type": "ItemList",
    itemListElement: PROJECTS_INFO.map((project, index) => ({
        "@type": "ListItem",
        item: {
            "@type": "SoftwareSourceCode",
            author: {
                "@id": PERSON_ID,
            },
            codeRepository: project.actions[0]?.href,
            creator: {
                "@id": PERSON_ID,
            },
            description: project.featuredDescription ?? project.description,
            keywords: project.stack.join(", "),
            name: project.title,
            programmingLanguage: project.stack.join(", "),
        },
        position: index + 1,
        url: project.actions[0]?.href ?? getCanonicalUrl("/projects"),
    })),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: PROJECTS_INFO.length,
})

const getResumeSchema = (): SchemaNode => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: RESUME_EXPERIENCE.map((experienceItem, index) => ({
        "@type": "ListItem",
        item: {
            "@type": "Role",
            description: experienceItem.bullets.join(" "),
            roleName: `${experienceItem.title} - ${experienceItem.role}`,
            startDate: experienceItem.period.split(" - ")[0],
        },
        position: index + 1,
    })),
    numberOfItems: RESUME_EXPERIENCE.length,
})

export const getStructuredData = (pathname: string): SchemaNode[] => {
    const schemas: SchemaNode[] = [
        getOrganizationSchema(),
        getPersonSchema(),
        getWebsiteSchema(),
        getWebPageSchema(pathname),
    ]

    const breadcrumbSchema = getBreadcrumbSchema(pathname)

    if (breadcrumbSchema) {
        schemas.push(breadcrumbSchema)
    }

    if (pathname === "/projects") {
        schemas.push(getProjectsSchema())
    }

    if (pathname === "/resume") {
        schemas.push(getResumeSchema())
    }

    return schemas
}

export const getStructuredDataJson = (pathname: string): string => JSON.stringify(getStructuredData(pathname))

export const getSitemapXml = (lastModified: string): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_ROUTES.map((route) => `  <url>
    <loc>${escapeXml(getCanonicalUrl(route.path))}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join("\n")}
</urlset>
`

export const getRobotsTxt = (): string => `User-agent: *
Allow: /
Disallow: ${LEGACY_HOME_PATH}
Disallow: ${NOT_FOUND_PATH}

Sitemap: ${getCanonicalUrl("/sitemap.xml")}
`
