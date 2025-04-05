import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useTheme } from "./lib/contexts/ThemeTypeContext.tsx";
import { FooterWithSocialLinks } from "./components/ui/footer.tsx";
import { SidebarMain } from "./components/ui/SidebarMain.tsx";
import { SidebarProvider, SidebarTrigger, useSidebar } from "./components/ui/sidebar.tsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import AvatarDropdown from "./components/AvatarDropdown.tsx";
import ThemeToggle from "./components/ui/ThemeToggle.tsx";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";
import NotFound from "./pages/+not-found.tsx";
import { useAuth } from "@clerk/clerk-react";
import { lazy, Suspense } from 'react';
import { UserPage } from "./pages/UserP.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

// Lazy load components
const Dashboard = lazy(() => import("./pages/dashboard.tsx"));
const Login = lazy(() => import("./auth/login.tsx"));
const Laporan = lazy(() => import("./pages/laporan.tsx"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function Layout() {
  return (
    <SidebarProvider> {/* ✅ Ensure SidebarProvider wraps everything */}
      <MainLayout />
    </SidebarProvider>
  );
}

function MainLayout() {
  const { gradientColors } = useTheme();
  const location = useLocation();
  const hideHeader = location.pathname === "/auth/login";
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [langChecked, setLangChecked] = useState(false);
  const { isSignedIn } = useAuth();
  const { state } = useSidebar(); // ✅ Now inside SidebarProvider, so no error

  // Set the default language before rendering content
  useEffect(() => {
    const storedLanguage = localStorage.getItem("preferredLanguage");
    if (!storedLanguage) {
      i18n.changeLanguage("ms");
      localStorage.setItem("preferredLanguage", "ms");
      setSelectedLang("ms");
    }
    setLangChecked(true);
  }, [i18n]);

  useEffect(() => {
    // Scroll to the top of the page smoothly on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  // Render nothing (or a fallback) until the language has been set
  if (!langChecked) {
    return null; // or <LoadingFallback />
  }

  const changeLanguage = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  return (
    <div className="relative h-screen w-screen overflow-auto">
      {!hideHeader && (
        <div
          className="fixed top-0 left-0 w-full h-full z-0"
          style={{
            background: `linear-gradient(${gradientColors?.[0] || "#f3f3f3"}, ${gradientColors?.[1] || "#a3bffa"})`
          }}
        />
      )}

      {/* ✅ Sidebar state correctly updates main content width */}
      {!hideHeader ? (
        <>
          <SidebarMain />
          <main className={`relative z-10 transition-all duration-300 ${state === "collapsed" ? "" : "lg:ml-[16rem]"}`}>
            {!hideHeader && (
              <header className="w-full sticky top-0 z-20 flex items-center gap-4 border-b bg-background dark:bg-sidebar px-6 py-2 justify-between">
                <SidebarTrigger />
                <div className="flex items-center gap-2 md:ml-auto">
                  <ThemeToggle />
                  <Menu as="div" className="relative">
                    <MenuButton className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
                      <Flag code={selectedLang === "ms" ? "MY" : "GB"} className="w-5 h-3" />
                      <span>{selectedLang.toUpperCase()}</span>
                      <ChevronDown size={16} />
                    </MenuButton>
                    <MenuItems className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg w-24">
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            className={`flex items-center gap-2 px-4 py-2 w-full ${focus ? "bg-gray-200 dark:bg-gray-700" : ""
                              }`}
                            onClick={() => changeLanguage("ms")}
                          >
                            <Flag code="MY" className="w-6 h-4" />
                            <span>MS</span>
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            className={`flex items-center gap-2 px-4 py-2 w-full ${focus ? "bg-gray-200 dark:bg-gray-700" : ""
                              }`}
                            onClick={() => changeLanguage("en")}
                          >
                            <Flag code="GB" className="w-6 h-4" />
                            <span>EN</span>
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                  <AvatarDropdown />
                </div>
              </header>
            )}

            {/* Routes & Content */}
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={isSignedIn ? <Navigate replace to="/dashboard" /> : <Navigate replace to="/auth/login" />} />
                <Route path="/dashboard" element={
                  <ErrorBoundary fallback={<NotFound />}>
                    <Dashboard />
                  </ErrorBoundary>
                } />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/laporan" element={
                  <ErrorBoundary fallback={<NotFound />}>
                    <Laporan />
                  </ErrorBoundary>
                } />
                <Route path="/users" element={
                  <ErrorBoundary fallback={<NotFound />}>
                    <UserPage />
                  </ErrorBoundary>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            {/* Footer */}
            {!hideHeader && <FooterWithSocialLinks />}

          </main>
        </>) : (
        // When on the login page, render a separate Routes block
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/auth/login" />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      )}
    </div>
  );
}
