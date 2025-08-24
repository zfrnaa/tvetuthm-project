import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useTheme } from "./lib/contexts/ThemeTypeContext.tsx";
import { FooterWithSocialLinks } from "./components/layout/footer.tsx";
import { SidebarMain } from "./components/layout/SidebarMain.tsx";
import { SidebarProvider, SidebarTrigger, useSidebar } from "./components/layout/sidebar.tsx";
import AvatarDropdown from "./components/ui/navigation/AvatarDropdown.tsx";
import { useEffect } from "react";
import NotFound from "./pages/+not-found.tsx";
import { useAuth } from "@clerk/clerk-react";
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from "./components/ui/special/ErrorBoundary.tsx";
import { ManageData } from "./pages/ManageData.tsx";

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
  const { isSignedIn } = useAuth();
  const { state } = useSidebar(); // ✅ Now inside SidebarProvider, so no error

  useEffect(() => {
    // Scroll to the top of the page smoothly on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

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
                <Route path="/manageData" element={
                  <ErrorBoundary fallback={<NotFound />}>
                    <ManageData />
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
            <Route path="/auth/login/*" element={<Login />} />
            <Route path="*" element={<Navigate replace to="/auth/login" />} />
          </Routes>
        </Suspense>
      )}
    </div>
  );
}
