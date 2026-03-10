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
    const featuredImageBox = await featuredCard.locator("img").first().boundingBox()
    const featuredTitleBox = await featuredCard.getByRole("heading", {name: /^Flip Clock$/i}).boundingBox()
    const featuredCardBox = await featuredCard.boundingBox()
    const projectsViewport = page.viewportSize()

    expect(featuredImageBox).not.toBeNull()
    expect(featuredTitleBox).not.toBeNull()
    expect(featuredCardBox).not.toBeNull()
    expect(projectsViewport).not.toBeNull()
    expect(featuredCardBox!.x).toBeGreaterThanOrEqual(0)
    expect(featuredCardBox!.x + featuredCardBox!.width).toBeLessThanOrEqual(projectsViewport!.width + 1)
    expect(featuredTitleBox!.y).toBeGreaterThanOrEqual(featuredImageBox!.y + featuredImageBox!.height - 2)
    expect(homeMetrics.scrollWidth).toBeLessThanOrEqual(homeMetrics.clientWidth + 1)
})
