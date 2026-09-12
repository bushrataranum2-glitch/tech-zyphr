import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useGame } from "./context/GameContext";
import { Navbar } from "./components/layout/Navbar";
import { MobileNav } from "./components/layout/MobileNav";
import { NotificationDrawer } from "./components/layout/NotificationDrawer";
import { LevelUpModal } from "./components/common/LevelUpModal";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AuthLoginPage } from "./pages/AuthLoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { QuestsPage } from "./pages/QuestsPage";
import { CharacterPage } from "./pages/CharacterPage";
import { SkillsPage } from "./pages/SkillsPage";
import { BossesPage } from "./pages/BossesPage";
import { MarketPage } from "./pages/MarketPage";
import { WorldPage } from "./pages/WorldPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { QuestMasterPage } from "./pages/QuestMasterPage";

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { activeToast } = useGame();

  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [authView, setAuthView] = useState<"LANDING" | "LOGIN" | "ONBOARDING">("LANDING");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rpg-bg flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-display font-bold text-slate-800 tracking-wider">INITIALIZING QUESTME...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Landing, Login, or Onboarding
  if (!user) {
    if (authView === "LOGIN") {
      return (
        <AuthLoginPage
          onSuccess={() => setAuthView("LANDING")}
          onSwitchToRegister={() => setAuthView("ONBOARDING")}
          onBackToLanding={() => setAuthView("LANDING")}
        />
      );
    }

    if (authView === "ONBOARDING") {
      return (
        <OnboardingPage
          onComplete={() => setAuthView("LANDING")}
          onCancel={() => setAuthView("LANDING")}
        />
      );
    }

    return (
      <LandingPage
        onStart={() => setAuthView("ONBOARDING")}
        onLogin={() => setAuthView("LOGIN")}
      />
    );
  }

  // Render Current Tab
  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentTab} />;
      case "quests":
        return <QuestsPage />;
      case "character":
        return <CharacterPage />;
      case "skills":
        return <SkillsPage />;
      case "bosses":
        return <BossesPage />;
      case "market":
        return <MarketPage />;
      case "world":
        return <WorldPage />;
      case "achievements":
        return <AchievementsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "quest-master":
        return <QuestMasterPage />;
      default:
        return <DashboardPage onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-rpg-bg text-slate-900 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 xl:pb-12">
        {renderTabContent()}
      </main>

      {/* Touch-Friendly Bottom Navigation on Mobile */}
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Cinematic Level Up Modal */}
      <LevelUpModal />

      {/* Real-Time Floating Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-16 sm:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300 max-w-sm">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 animate-pulse" />
            <div className="min-w-0 flex-1">
              <h5 className="font-display font-bold text-xs text-white">{activeToast.title}</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">{activeToast.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
