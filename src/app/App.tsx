import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { Navigation } from "./components/navigation";
import { QuranReader } from "./components/quran-reader";
import { PrayerTimes } from "./components/prayer-times";
import { Azkar } from "./components/azkar";
import { WelcomeScreen } from "./components/welcome-screen";

function AppContent() {
  const [activeTab, setActiveTab] = useState("quran");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      setShowWelcome(false);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem("hasVisited", "true");
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AnimatePresence>
        {showWelcome && <WelcomeScreen onStart={handleStart} />}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <ThemeToggle />
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="pt-20">
            <AnimatePresence mode="wait">
              {activeTab === "quran" && (
                <motion.div
                  key="quran"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuranReader />
                </motion.div>
              )}

              {activeTab === "prayer" && (
                <motion.div
                  key="prayer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PrayerTimes />
                </motion.div>
              )}

              {activeTab === "azkar" && (
                <motion.div
                  key="azkar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Azkar />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}