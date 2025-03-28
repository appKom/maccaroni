"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Medal, Sparkles, TrendingUp } from "lucide-react";

interface Props {
  name: string;
  amount: number | null;
  position: number;
  className?: string;
}

export function RunnerUpSpenderCard({ name, amount, position }: Props) {
  const [animate, setAnimate] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const animationTimer = setTimeout(() => setAnimate(false), 1000);

    const sparkleInterval = setInterval(() => {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 700);
    }, 4000);

    return () => {
      clearTimeout(animationTimer);
      clearInterval(sparkleInterval);
    };
  }, []);

  const colors = {
    borderColor: position === 2 ? "border-slate-300" : "border-amber-700",
    iconBg: position === 2 ? "bg-slate-300" : "bg-amber-700",
    textGradient:
      position === 2
        ? "from-slate-200 to-slate-400"
        : "from-amber-500 to-amber-700",
    barGradient:
      position === 2
        ? "from-slate-300 via-slate-400 to-slate-500"
        : "from-amber-400 via-amber-600 to-amber-800",
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: animate ? 1.03 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        scale: { duration: 0.3 },
        delay: position * 0.1,
      }}
      className={`relative overflow-hidden rounded-xl border-[2px] ${colors.borderColor} shadow-lg bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 blur-xl"></div>

      <div className="relative flex justify-between w-full items-center py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{
                rotate: animate ? [0, -5, 5, -3, 0] : 0,
                y: animate ? [0, -1, 1, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className={`${colors.iconBg} p-2 rounded-full text-purple-900`}
            >
              {position === 2 ? (
                <Medal className="h-5 w-5" />
              ) : (
                <Award className="h-5 w-5" />
              )}
            </motion.div>

            <AnimatePresence>
              {showSparkle && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute -top-2 -right-2 ${
                    position === 2 ? "text-slate-300" : "text-amber-600"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.span
            className="text-white font-bold text-xl"
            animate={{
              textShadow: animate
                ? "0 0 6px rgba(255,255,255,0.6)"
                : "0 0 0px rgba(255,255,255,0)",
            }}
          >
            {name}
          </motion.span>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              y: animate ? [0, -3, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1"
          >
            <TrendingUp
              className={`h-4 w-4 ${
                position === 2 ? "text-slate-300" : "text-amber-600"
              }`}
            />
            <span
              className={`font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r ${colors.textGradient}`}
            >
              {amount}kr
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div
        className={`h-1 bg-gradient-to-r ${colors.barGradient}`}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />
    </motion.div>
  );
}
