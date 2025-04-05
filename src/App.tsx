import { BrowserRouter} from "react-router-dom";
import Layout from "./Layout"; // ✅ Ensure this is correctly imported
import { UserProvider } from "./lib/contexts/UserContext.tsx";
import { WindowDimensionsProvider } from "./lib/contexts/WindowDimensionContext";
import { ThemeProvider } from "./lib/contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient(
  {defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Automatically clear old queries after 10 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary fetches
    },
  },}
);

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <WindowDimensionsProvider>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </I18nextProvider>
        </ThemeProvider>
      </WindowDimensionsProvider>
    </UserProvider>
  );
}

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     {/* Default route goes to Login */}
    //     <Route path="/" element={<Login />} />
    //     {/* Load Layout for other routes */}
    //     <Route path="/*" element={<Layout />} />
    //   </Routes>
    // </BrowserRouter>
    <BrowserRouter>
      <AppProviders>
        <Layout />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;