import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import GenerateStory from "./pages/GenerateStory";
import StoryDetail from "./pages/StoryDetail";
import SharedStory from "./pages/SharedStory";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path={"/"}>
        {isAuthenticated ? <Dashboard /> : <Home />}
      </Route>
      <Route path={"/shared/:shareToken"} component={SharedStory} />
      {isAuthenticated && (
        <>
          <Route path={"/dashboard"} component={Dashboard} />
          <Route path={"/generate"} component={GenerateStory} />
          <Route path={"/story/:id"} component={StoryDetail} />
        </>
      )}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
