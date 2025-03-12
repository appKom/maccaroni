"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, Heart } from "lucide-react";
import { Button } from "../Button";
import Image from "next/image";

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-gradient-to-br from-emerald-950 to-slate-900 relative overflow-hidden">
      {mounted && (
        <>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-500/20 text-4xl font-bold"
                initial={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  scale: 0.5,
                  opacity: 0.1,
                  rotate: Math.random() * 30 - 15,
                }}
                animate={{
                  x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  scale: [0.5, Math.random() * 0.5 + 0.8],
                  opacity: [0.1, 0.2],
                  rotate: [Math.random() * 30 - 15, Math.random() * 30 - 15],
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
              >
                {i % 3 === 0 ? "$" : i % 3 === 1 ? "€" : "£"}
              </motion.div>
            ))}

            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`coin-${i}`}
                className="absolute rounded-full border border-yellow-500/30 bg-yellow-500/10 w-64 h-64"
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

            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                className="absolute text-red-500/20"
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
                  duration: 12 + i * 2,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                <Heart className="w-24 h-24" />
              </motion.div>
            ))}
          </div>
        </>
      )}

      <motion.div
        className="relative z-10 bg-slate-900/80 backdrop-blur-lg border border-gray-400 rounded-xl shadow-2xl p-8 w-full max-w-md"
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
          <motion.div
            className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-2 border-gray-400"
            variants={{
              hidden: { scale: 0.8, opacity: 0 },
              visible: { scale: 1, opacity: 1 },
            }}
          >
            <Image
              src={"/Online_hvit_o.svg"}
              width={50}
              height={50}
              alt="Online logo"
            />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold text-white tracking-tight"
            variants={{
              hidden: { y: -20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            Vennligst logg inn
          </motion.h1>

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
              className="py-6 text-lg font-medium group relative overflow-hidden bg-green-600 hover:bg-green-700"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Logg inn med OW
                <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
