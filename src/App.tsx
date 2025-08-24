import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout"; // ✅ Ensure this is correctly imported
import { UserProvider } from "./lib/contexts/UserContext.tsx";
import { WindowDimensionsProvider } from "./lib/contexts/WindowDimensionContext";
import { ThemeProvider } from "./lib/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
        gcTime: 1000 * 60 * 10, // Automatically clear old queries after 10 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary fetches
      },
    },
  }
);

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WindowDimensionsProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>{children}</UserProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </WindowDimensionsProvider>

  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Layout />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;