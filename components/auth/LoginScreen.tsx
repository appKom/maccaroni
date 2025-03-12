"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, Sparkles } from "lucide-react";
import { Button } from "../Button";

export default function LoginScreen({
  handleLogin,
}: {
  handleLogin: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      {mounted && (
        <>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-onlineOrange/10 w-64 h-64"
                initial={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  scale: 0.5,
                  opacity: 0.1,
                }}
                animate={{
                  x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  scale: [0.5, Math.random() * 0.5 + 0.8],
                  opacity: [0.1, 0.2],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 10 + i * 2,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Login card */}
      <motion.div
        className="relative z-10 bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center justify-center w-full gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {/* Logo or icon */}
          <motion.div
            className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-2 border-onlineOrange"
            variants={{
              hidden: { scale: 0.8, opacity: 0 },
              visible: { scale: 1, opacity: 1 },
            }}
          >
            <Sparkles className="w-10 h-10 text-onlineOrange" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-3xl font-bold text-white tracking-tight"
            variants={{
              hidden: { y: -20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            Vennligst logg inn
          </motion.h1>

          {/* Login button */}
          <motion.div
            className="w-full"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              color="onlineOrange"
              onClick={handleLogin}
              className="py-6 text-lg font-medium group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Logg inn med OW
                <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-onlineOrange opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
