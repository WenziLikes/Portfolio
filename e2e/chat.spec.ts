import {expect, test} from "@playwright/test"

test("portfolio chat has room to expand its desktop launcher", async ({page, isMobile}) => {
    await page.route("https://vmnorth.com/chat-embed.js", (route) => route.fulfill({
        contentType: "application/javascript",
        body: `
            const frame = document.createElement("iframe")
            frame.id = "vmnorth-chat-portfolio"
            frame.src = "https://vmnorth.com/chat-widget?siteId=portfolio"
            const compact = matchMedia("(max-width: 520px)").matches
            frame.style.cssText = "position:fixed; right:0; bottom:0; height:176px; border:0; z-index:2147483000"
            frame.style.width = compact ? "176px" : "420px"
            document.body.append(frame)
        `,
    }))
    await page.route("https://vmnorth.com/chat-widget?siteId=portfolio", (route) => route.fulfill({
        contentType: "text/html",
        body: `
            <style>
                button { position: fixed; bottom: 27px; right: 29px; }
                span { display: none; }
                @media (min-width: 641px) { button:hover span { display: inline; } }
            </style>
            <button aria-label="Open chat">Talk <span>Chat about my work</span></button>
            <script>
                const postState = (open) => parent.postMessage({
                    type: "vmnorth:chat-widget-state", siteId: "portfolio", available: true, open,
                }, "*")
                document.querySelector("button").addEventListener("click", () => postState(true))
                postState(false)
            </script>
        `,
    }))

    await page.goto("/")

    const frame = page.locator("#vmnorth-chat-portfolio")
    const launcher = frame.contentFrame().getByRole("button", {name: "Open chat"})
    const compact = await page.evaluate(() => matchMedia("(max-width: 520px)").matches)
    const embeddedWidth = compact ? "176px" : "420px"
    await expect(frame).toHaveAttribute("data-chat-launcher", "")
    await expect(frame).toHaveCSS("width", isMobile ? embeddedWidth : "641px")

    if (!isMobile) {
        await launcher.hover()
        await expect(frame.contentFrame().getByText("Chat about my work")).toBeVisible()
    }

    await launcher.click()
    await expect(frame).not.toHaveAttribute("data-chat-launcher", "")
    await expect(frame).toHaveCSS("width", embeddedWidth)
})
