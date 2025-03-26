"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Sparkles, TrendingUp } from "lucide-react"

interface Props {
  name: string
  amount: number | null
  className?: string
}

export function BiggestSpenderCard({ name, amount }: Props) {
  const [animate, setAnimate] = useState(false)
  const [showSparkle, setShowSparkle] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const animationTimer = setTimeout(() => setAnimate(false), 1000)

    const sparkleInterval = setInterval(() => {
      setShowSparkle(true)
      setTimeout(() => setShowSparkle(false), 700)
    }, 3000)

    return () => {
      clearTimeout(animationTimer)
      clearInterval(sparkleInterval)
    }
  }, [])

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: animate ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        scale: { duration: 0.3 },
      }}
      className="relative overflow-hidden rounded-xl border-[3px] border-amber-400 shadow-lg bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900"
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>

      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-purple-600 opacity-20 blur-xl"></div>

      <div className="relative flex justify-between w-full items-center py-6 px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{
                rotate: animate ? [0, -10, 10, -5, 0] : 0,
                y: animate ? [0, -2, 2, -1, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="bg-amber-400 p-2 rounded-full text-purple-900"
            >
              <Crown className="h-6 w-6" />
            </motion.div>

            <AnimatePresence>
              {showSparkle && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-2 -right-2 text-amber-300"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.span
            className="text-white font-bold text-2xl"
            animate={{
              textShadow: animate ? "0 0 8px rgba(255,255,255,0.8)" : "0 0 0px rgba(255,255,255,0)",
            }}
          >
            {name}
          </motion.span>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              y: animate ? [0, -5, 0] : 0,
              color: animate ? ["#ffffff", "#fcd34d", "#ffffff"] : "#ffffff",
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1"
          >
            <TrendingUp className="h-5 w-5 text-amber-300" />
            <span className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
              {amount} kr
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500"
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
  )
}

