import { motion } from "motion/react";
import { BookOpen, Clock, Heart, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-2xl"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-5xl md:text-6xl mb-4 arabic-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          >
            بسم الله الرحمن الرحيم
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl mb-12 text-muted-foreground arabic-text"
          >
            موقعك الإسلامي المتكامل للقرآن الكريم والأذكار ومواعيد الصلاة
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg mb-2 arabic-text">القرآن الكريم</h3>
              <p className="text-sm text-muted-foreground">
                استمع لأفضل المشايخ بصوت مجود
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg mb-2 arabic-text">مواعيد الصلاة</h3>
              <p className="text-sm text-muted-foreground">
                مع إشعارات قبل كل صلاة
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border">
              <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg mb-2 arabic-text">الأذكار اليومية</h3>
              <p className="text-sm text-muted-foreground">
                أذكار الصباح والمساء والنوم
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-12 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:shadow-3xl transition-shadow text-lg arabic-text"
          >
            ابدأ الآن
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
