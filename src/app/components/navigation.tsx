import { BookOpen, Clock, Heart } from "lucide-react";
import { motion } from "motion/react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "quran", label: "القرآن الكريم", icon: BookOpen },
  { id: "prayer", label: "مواعيد الصلاة", icon: Clock },
  { id: "azkar", label: "الأذكار", icon: Heart },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange(item.id)}
                className={`relative px-6 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-transparent hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="arabic-text">{item.label}</span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
