import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

// End User Pages
import EndUserDashboard from "./pages/app/Dashboard";
import Onboarding from "./pages/app/Onboarding";
import Goal from "./pages/app/Goal";
import Session from "./pages/app/Session";
import Log from "./pages/app/Log";
import Challenges from "./pages/app/Challenges";
import Community from "./pages/app/Community";
import Profile from "./pages/app/Profile";
import KickoffSurvey from "./pages/app/KickoffSurvey";

// Coach Pages
import CoachDashboard from "./pages/coach/Dashboard";
import MenteeDetail from "./pages/coach/MenteeDetail";
import CoachChallenges from "./pages/coach/Challenges";
import Messages from "./pages/coach/Messages";
import CoachSettings from "./pages/coach/Settings";

// Admin Pages
import AdminUsers from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import CoachRequests from "./pages/admin/CoachRequests";
import AdminAnalytics from "./pages/admin/Analytics";

// Developer Pages
import Games from "./pages/dev/Games";
import GameDetail from "./pages/dev/GameDetail";
import Versions from "./pages/dev/Versions";
import DevAnalytics from "./pages/dev/Analytics";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={logout} />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* End User Routes */}
          <Route path="/app/kickoff-survey" element={<KickoffSurvey />} />
          <Route path="/app/onboarding" element={<Onboarding />} />
          <Route path="/app/goal" element={<Goal />} />
          <Route path="/app/dashboard" element={<EndUserDashboard />} />
          <Route path="/app/session" element={<Session />} />
          <Route path="/app/log" element={<Log />} />
          <Route path="/app/challenges" element={<Challenges />} />
          <Route path="/app/community" element={<Community />} />
          <Route path="/app/profile" element={<Profile />} />

          {/* Coach Routes */}
          <Route path="/coach/dashboard" element={<CoachDashboard />} />
          <Route path="/coach/mentee/:id" element={<MenteeDetail />} />
          <Route path="/coach/challenges" element={<CoachChallenges />} />
          <Route path="/coach/messages" element={<Messages />} />
          <Route path="/coach/settings" element={<CoachSettings />} />

          {/* Admin Routes */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/user/:id" element={<UserDetail />} />
          <Route path="/admin/coach-requests" element={<CoachRequests />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />

          {/* Developer Routes */}
          <Route path="/dev/games" element={<Games />} />
          <Route path="/dev/game/:id" element={<GameDetail />} />
          <Route path="/dev/versions" element={<Versions />} />
          <Route path="/dev/analytics" element={<DevAnalytics />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
