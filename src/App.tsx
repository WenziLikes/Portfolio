import React, {useEffect, useState} from "react"
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom"
import {AnalyticsConsentBanner, Footer, RouteMeta, ScrollToSection, SideBar} from "./components"
import {MARKET_PAGE_PATHS} from "./content/marketPages"
import {MAIN_SECTIONS} from "./content/site"
import {CopyrightPage, MainContent, MarketLandingPage, NotFound, PrivacyPage, Resume} from "./pages"
import {disableAnalytics, getStoredAnalyticsConsent, initializeAnalytics, type AnalyticsConsentStatus, persistAnalyticsConsent} from "./utils/analytics"

type Theme = "dark" | "light"

const THEME_CHROME: Record<Theme, {themeColor: string; backgroundColor: string; statusBarStyle: string}> = {
    dark: {
        themeColor: "#14171B",
        backgroundColor: "#080B10",
        statusBarStyle: "black-translucent",
    },
    light: {
        themeColor: "#D9E3EA",
        backgroundColor: "#D4DDE5",
        statusBarStyle: "default",
    },
}

const getStoredTheme = (): Theme => {
    try {
        return localStorage.getItem("theme") === "light" ? "light" : "dark"
    } catch {
        return "dark"
    }
}

const applyBrowserTheme = (theme: Theme) => {
    const {themeColor, backgroundColor, statusBarStyle} = THEME_CHROME[theme]

    document.documentElement.setAttribute("data-theme", theme)
    document.documentElement.style.colorScheme = theme
    document.documentElement.style.backgroundColor = backgroundColor
    document.body.style.backgroundColor = backgroundColor

    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    themeColorMeta?.setAttribute("content", themeColor)

    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    statusBarMeta?.setAttribute("content", statusBarStyle)
}

interface PortfolioLayoutProps {
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
    theme: Theme
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({setTheme, theme}) => {
    const location = useLocation()
    const isHomePath = location.pathname === "/" || location.pathname === "/home"

    return (
        <>
            <ScrollToSection/>
            <SideBar setTheme={setTheme} theme={theme}/>
            <main className={isHomePath ? "content content--home" : "content"}>
                <MainContent theme={theme}/>
                <Footer/>
            </main>
        </>
    )
}

interface PageShellProps {
    children: React.ReactNode
}

const PageShell: React.FC<PageShellProps> = ({children}) => {
    return (
        <main className="content content--page">
            {children}
            <Footer/>
        </main>
    )
}

const PORTFOLIO_ROUTE_PATHS = ["/", ...MAIN_SECTIONS
    .filter((section) => section.id !== "home")
    .map((section) => `/${section.id}`)]

interface AppContentProps {
    initialTheme?: Theme
}

export const AppContent: React.FC<AppContentProps> = ({initialTheme = "dark"}) => {
    const [analyticsConsent, setAnalyticsConsent] = useState<AnalyticsConsentStatus>(() => getStoredAnalyticsConsent())
    const [theme, setTheme] = useState<Theme>(initialTheme)

    useEffect(() => {
        applyBrowserTheme(theme)
        try {
            localStorage.setItem("theme", theme)
        } catch {
            // Ignore unavailable storage; the theme still applies for this session.
        }
    }, [theme])

    const updateAnalyticsConsent = (nextConsent: Exclude<AnalyticsConsentStatus, "unset">) => {
        persistAnalyticsConsent(nextConsent)

        if (nextConsent === "granted") {
            initializeAnalytics()
        } else {
            disableAnalytics()
        }

        setAnalyticsConsent(nextConsent)
    }

    const standalonePageRoutes = [
        {
            element: <Resume/>,
            path: "/resume",
        },
        {
            element: <PrivacyPage analyticsConsent={analyticsConsent} onAnalyticsConsentChange={updateAnalyticsConsent}/>,
            path: "/privacy",
        },
        {
            element: <CopyrightPage/>,
            path: "/copyright",
        },
        ...MARKET_PAGE_PATHS.map((path) => ({
            element: <MarketLandingPage path={path}/>,
            path,
        })),
        {
            element: <NotFound/>,
            path: "*",
        },
    ]

    return (
        <div className="App">
            <RouteMeta shouldTrackAnalytics={analyticsConsent === "granted"}/>
            <Routes>
                {PORTFOLIO_ROUTE_PATHS.map((path) => (
                    <Route key={path} path={path} element={<PortfolioLayout setTheme={setTheme} theme={theme}/>}/>
                ))}
                <Route path="/home" element={<Navigate replace to="/"/>}/>
                {standalonePageRoutes.map(({element, path}) => (
                    <Route
                        key={path}
                        path={path}
                        element={(
                            <PageShell>
                                {element}
                            </PageShell>
                        )}
                    />
                ))}
            </Routes>
            <AnalyticsConsentBanner consent={analyticsConsent} onConsentChange={updateAnalyticsConsent}/>
        </div>
    )
}

const App: React.FC = () => {
    return (
        <BrowserRouter future={{v7_relativeSplatPath: true, v7_startTransition: true}}>
            <AppContent initialTheme={getStoredTheme()}/>
        </BrowserRouter>
    )
}

export default App
