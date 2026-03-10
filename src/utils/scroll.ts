export const getMainContentElement = (): HTMLElement | null => (
    document.querySelector("main.content") as HTMLElement | null
)

export const getMainSectionElement = (sectionId: string): HTMLElement | null => {
    const content = getMainContentElement()

    return (content?.querySelector(`#${sectionId}`) as HTMLElement | null) ?? document.getElementById(sectionId)
}

export const scrollToSectionId = (sectionId: string, behavior: ScrollBehavior = "smooth"): boolean => {
    const section = getMainSectionElement(sectionId)

    if (!section) {
        return false
    }

    const content = getMainContentElement()

    if (content) {
        const contentPaddingTop = Number.parseFloat(window.getComputedStyle(content).paddingTop) || 0
        const top = Math.max(
            0,
            section.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - contentPaddingTop
        )

        content.scrollTo({top, behavior})
        return true
    }

    section.scrollIntoView({behavior, block: "start"})
    return true
}
