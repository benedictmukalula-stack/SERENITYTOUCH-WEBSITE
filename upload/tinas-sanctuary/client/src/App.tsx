import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Therapists from "./pages/Therapists";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MemberPortal from "./pages/MemberPortal";
import ReferralDashboard from "./pages/ReferralDashboard";
import VirtualConsultation from "./pages/VirtualConsultation";
import Membership from "./pages/Membership";
import Analytics from "./pages/Analytics";
import MemberDashboard from "./pages/MemberDashboard";
import GiftCards from "./pages/GiftCards";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/therapists"} component={Therapists} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/about"} component={About} />
      <Route path={"/member-portal"} component={MemberPortal} />
      <Route path={"/referral-dashboard"} component={ReferralDashboard} />
      <Route path={"/virtual-consultation"} component={VirtualConsultation} />
      <Route path={"/membership"} component={Membership} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/dashboard"} component={MemberDashboard} />
      <Route path={"/gift-cards"} component={GiftCards} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
