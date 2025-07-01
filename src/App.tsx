import AppRoutes from "./routes";
import { ThemeProvider } from "@/components/homepage/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <div className="min-h-screen">
      <AppRoutes />
    </div>
  </ThemeProvider>

  );
}
export default App;