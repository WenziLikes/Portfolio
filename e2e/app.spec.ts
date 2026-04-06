import {expect, test} from "@playwright/test"

test("home and resume routes render", async ({page}) => {
    await page.goto("/")

    await expect(page.getByLabel("Brand logo")).toContainText("VM Portfolio")

    await page.getByRole("button", {name: "Resume"}).click()

    await expect(page).toHaveURL(/\/resume$/)
    await expect(page.getByRole("heading", {name: /Profile/i})).toBeVisible()
    await expect(page.getByRole("link", {name: "Download PDF"})).toHaveAttribute("download", "Viacheslav-Murakhin-Resume.pdf")
})

test("deep links and not found routes work", async ({page}) => {
    await page.goto("/about")

    await expect(page).toHaveURL(/\/about$/)
    await expect(page.getByRole("heading", {name: /About Me/i})).toBeVisible()

    await page.goto("/expertise")
    await expect(page).toHaveURL(/\/expertise$/)
    await expect(page.getByRole("heading", {name: /React, TypeScript, and full stack expertise/i})).toBeVisible()

    await page.goto("/home")
    await expect(page).toHaveURL(/\/$/)

    await page.goto("/missing")

    await expect(page.getByRole("heading", {name: /Page not found/i})).toBeVisible()
})

test("legal routes render", async ({page}) => {
    await page.goto("/privacy")

    await expect(page.getByRole("heading", {name: /Privacy/i})).toBeVisible()
    await expect(page.getByRole("link", {name: "Copyright"})).toBeVisible()

    await page.goto("/copyright")

    await expect(page.getByRole("heading", {name: /Copyright/i})).toBeVisible()
})

test("mobile header on Home appears only after scroll starts", async ({page}, testInfo) => {
    test.skip(!/^(phone|tablet)-/.test(testInfo.project.name))

    await page.goto("/")

    const menuButton = page.getByRole("button", {name: "Open navigation menu"})
    const content = page.locator("main.content")

    await expect(menuButton).not.toBeInViewport()

    await content.evaluate((element) => {
        element.scrollTo({top: 220, behavior: "auto"})
    })

    await expect(menuButton).toBeInViewport()

    await content.evaluate((element) => {
        element.scrollTo({top: 0, behavior: "auto"})
    })

    await expect(menuButton).not.toBeInViewport()
})

test("mobile menu switches to About and keeps it active", async ({page}, testInfo) => {
    test.skip(!/^(phone|tablet)-/.test(testInfo.project.name))

    await page.goto("/")

    const content = page.locator("main.content")
    const menuButton = page.getByRole("button", {name: "Open navigation menu"})
    const mobileNavigation = page.locator("#portfolio-mobile-navigation")
    const aboutLink = mobileNavigation.locator('a[href="/about"]').first()

    await content.evaluate((element) => {
        element.scrollTo({top: 220, behavior: "auto"})
    })

    await menuButton.click()
    await aboutLink.click()

    await expect(page).toHaveURL(/\/about$/)

    await menuButton.click()
    await expect(aboutLink).toHaveAttribute("aria-current", "location")
})

test("mobile home and projects stay inside the viewport", async ({page}, testInfo) => {
    test.skip(!/^(phone|tablet)-/.test(testInfo.project.name))

    await page.goto("/")

    const content = page.locator("main.content")
    const homeMetrics = await content.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
    }))

    const homeHeading = page.getByRole("heading", {name: /Murakhin/i}).first()
    const homeHeadingBox = await homeHeading.boundingBox()
    const homeViewport = page.viewportSize()

    expect(homeHeadingBox).not.toBeNull()
    expect(homeViewport).not.toBeNull()
    expect(homeHeadingBox!.x).toBeGreaterThanOrEqual(0)
    expect(homeHeadingBox!.x + homeHeadingBox!.width).toBeLessThanOrEqual(homeViewport!.width + 1)

    await page.goto("/projects")
    await expect(page.getByRole("heading", {name: /^Projects$/i})).toBeVisible()

    const projectMetrics = await content.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
    }))

    expect(projectMetrics.scrollWidth).toBeLessThanOrEqual(projectMetrics.clientWidth + 1)

    const featuredCard = page.locator('[data-project-card-id="4"]').first()
    const featuredMediaBox = await featuredCard.locator("[data-project-card-media]").boundingBox()
    const featuredContentBox = await featuredCard.locator("[data-project-card-content]").boundingBox()
    const featuredCardBox = await featuredCard.boundingBox()
    const projectsViewport = page.viewportSize()

    expect(featuredMediaBox).not.toBeNull()
    expect(featuredContentBox).not.toBeNull()
    expect(featuredCardBox).not.toBeNull()
    expect(projectsViewport).not.toBeNull()
    expect(featuredCardBox!.x).toBeGreaterThanOrEqual(0)
    expect(featuredCardBox!.x + featuredCardBox!.width).toBeLessThanOrEqual(projectsViewport!.width + 1)
    expect(featuredContentBox!.y).toBeGreaterThanOrEqual(featuredMediaBox!.y + featuredMediaBox!.height - 24)
    expect(homeMetrics.scrollWidth).toBeLessThanOrEqual(homeMetrics.clientWidth + 1)
})

test("mobile hero keeps primary actions in the first viewport on modern phone widths", async ({page}, testInfo) => {
    test.skip(!/^phone-/.test(testInfo.project.name) || testInfo.project.name === "phone-320")

    await page.goto("/")

    await expect(page.getByRole("button", {name: "Resume"})).toBeInViewport()
    await expect(page.getByRole("button", {name: "Portfolio"})).toBeInViewport()
})

test("desktop sections and footer stay inside the viewport with the sidebar open", async ({page}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium")

    const content = page.locator("main.content")
    const viewport = page.viewportSize()

    expect(viewport).not.toBeNull()

    for (const route of ["/", "/about", "/expertise", "/experience", "/projects"]) {
        await page.goto(route)

        const metrics = await content.evaluate((element) => ({
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
        }))

        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
    }

    await page.goto("/")

    const homeHeadingBox = await page.locator("section#home h1").boundingBox()
    expect(homeHeadingBox).not.toBeNull()
    expect(homeHeadingBox!.x).toBeGreaterThanOrEqual(0)
    expect(homeHeadingBox!.x + homeHeadingBox!.width).toBeLessThanOrEqual(viewport!.width + 1)

    await page.goto("/about")

    const aboutTitleBox = await page.getByRole("heading", {name: /About Me/i}).boundingBox()
    expect(aboutTitleBox).not.toBeNull()
    expect(aboutTitleBox!.x).toBeGreaterThanOrEqual(0)
    expect(aboutTitleBox!.x + aboutTitleBox!.width).toBeLessThanOrEqual(viewport!.width + 1)

    await page.goto("/expertise")

    const expertiseTitleBox = await page.getByRole("heading", {name: /React, TypeScript, and full stack expertise/i}).boundingBox()
    expect(expertiseTitleBox).not.toBeNull()
    expect(expertiseTitleBox!.x).toBeGreaterThanOrEqual(0)
    expect(expertiseTitleBox!.x + expertiseTitleBox!.width).toBeLessThanOrEqual(viewport!.width + 1)

    await page.goto("/experience")

    const experienceTitleBox = await page.getByRole("heading", {name: /^Experience$/i}).boundingBox()
    expect(experienceTitleBox).not.toBeNull()
    expect(experienceTitleBox!.x).toBeGreaterThanOrEqual(0)
    expect(experienceTitleBox!.x + experienceTitleBox!.width).toBeLessThanOrEqual(viewport!.width + 1)

    await page.goto("/projects")

    const projectsTitleBox = await page.getByRole("heading", {name: /^Projects$/i}).boundingBox()
    expect(projectsTitleBox).not.toBeNull()
    expect(projectsTitleBox!.x).toBeGreaterThanOrEqual(0)
    expect(projectsTitleBox!.x + projectsTitleBox!.width).toBeLessThanOrEqual(viewport!.width + 1)

    await content.evaluate((element) => {
        element.scrollTo({top: element.scrollHeight, behavior: "auto"})
    })

    const footerBox = await page.locator("footer").boundingBox()
    expect(footerBox).not.toBeNull()
    expect(footerBox!.x).toBeGreaterThanOrEqual(0)
    expect(footerBox!.x + footerBox!.width).toBeLessThanOrEqual(viewport!.width + 1)

    await page.goto("/resume")

    const resumeMetrics = await content.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
    }))

    expect(resumeMetrics.scrollWidth).toBeLessThanOrEqual(resumeMetrics.clientWidth + 1)

    const resumeSheetBox = await page.locator("article").first().boundingBox()
    expect(resumeSheetBox).not.toBeNull()
    expect(resumeSheetBox!.x).toBeGreaterThanOrEqual(0)
    expect(resumeSheetBox!.x + resumeSheetBox!.width).toBeLessThanOrEqual(viewport!.width + 1)
})
