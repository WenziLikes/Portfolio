import React, {useEffect, useState} from "react"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {Footer, RouteMeta, ScrollToSection, SideBar} from "./components"
import {MAIN_SECTIONS} from "./content/site"
import {CopyrightPage, MainContent, NotFound, PrivacyPage, Resume} from "./pages"

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

const getInitialTheme = (): Theme => {
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
    return (
        <>
            <ScrollToSection/>
            <SideBar setTheme={setTheme} theme={theme}/>
            <main className="content">
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

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        applyBrowserTheme(theme)
        try {
            localStorage.setItem("theme", theme)
        } catch {
            // Ignore unavailable storage; the theme still applies for this session.
        }
    }, [theme])

    const portfolioPaths = ["/", ...MAIN_SECTIONS.map((section) => `/${section.id}`)]

    return (
        <Router future={{v7_relativeSplatPath: true, v7_startTransition: true}}>
            <div className="App">
                <RouteMeta/>
                <Routes>
                    {portfolioPaths.map((path) => (
                        <Route key={path} path={path} element={<PortfolioLayout setTheme={setTheme} theme={theme}/>}/>
                    ))}
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
                                <PrivacyPage/>
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
            </div>
        </Router>
    )
}

export default App
