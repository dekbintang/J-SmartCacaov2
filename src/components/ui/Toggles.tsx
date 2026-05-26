"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Globe } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex items-center px-1 ${
        isDark ? "bg-zinc-700" : "bg-amber-100 border border-amber-200"
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
          isDark ? "bg-zinc-900" : "bg-amber-400"
        }`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
            >
              <Moon size={11} className="text-amber-300" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
            >
              <Sun size={11} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

export function LangToggle() {
  const { lang, toggleLang } = useUIStore();

  return (
    <motion.button
      onClick={toggleLang}
      whileTap={{ scale: 0.93 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
        lang === "id"
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400"
          : "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400"
      }`}
      aria-label="Toggle language"
    >
      <Globe size={12} />
      <AnimatePresence mode="wait">
        <motion.span
          key={lang}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15 }}
        >
          {lang === "id" ? "ID" : "EN"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
