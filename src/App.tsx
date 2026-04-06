import React, {useEffect, useState} from "react"
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom"
import {AnalyticsConsentBanner, Footer, RouteMeta, ScrollToSection, SideBar} from "./components"
import {MAIN_SECTIONS} from "./content/site"
import {CopyrightPage, MainContent, NotFound, PrivacyPage, Resume} from "./pages"
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

    const portfolioPaths = ["/", ...MAIN_SECTIONS
        .filter((section) => section.id !== "home")
        .map((section) => `/${section.id}`)]

    return (
        <div className="App">
            <RouteMeta shouldTrackAnalytics={analyticsConsent === "granted"}/>
            <Routes>
                {portfolioPaths.map((path) => (
                    <Route key={path} path={path} element={<PortfolioLayout setTheme={setTheme} theme={theme}/>}/>
                ))}
                <Route path="/home" element={<Navigate replace to="/"/>}/>
                <Route
                    path="/resume"
                    element={(
                        <PageShell>
                            <Resume/>
                        </PageShell>
                    )}
                />
                <Route
                    path="/privacy"
                    element={(
                        <PageShell>
                            <PrivacyPage analyticsConsent={analyticsConsent} onAnalyticsConsentChange={updateAnalyticsConsent}/>
                        </PageShell>
                    )}
                />
                <Route
                    path="/copyright"
                    element={(
                        <PageShell>
                            <CopyrightPage/>
                        </PageShell>
                    )}
                />
                <Route
                    path="*"
                    element={(
                        <PageShell>
                            <NotFound/>
                        </PageShell>
                    )}
                />
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
