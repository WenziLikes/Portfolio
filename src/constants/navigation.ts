import {MAIN_SECTIONS, type MainSectionId} from "../content/site"

export const MAIN_PATHS = new Set<string>([
    "/",
    ...MAIN_SECTIONS
        .filter((section) => section.id !== "home")
        .map((section) => `/${section.id}`),
])

export const getSectionIdFromPath = (pathname: string): MainSectionId | null => {
    const sectionId = pathname === "/" ? "home" : pathname.replace(/^\/+/, "")

    return MAIN_SECTIONS.some((section) => section.id === sectionId)
        ? sectionId as MainSectionId
        : null
}

export const getSectionPath = (sectionId: MainSectionId): string => (
    sectionId === "home" ? "/" : `/${sectionId}`
)
