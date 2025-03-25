"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DonationCardProps {
  name: string;
  amount: number;
  variant?: "default" | "top";
  className?: string;
}

export function DonationCard({
  name,
  amount,
  variant = "default",
  className,
}: DonationCardProps) {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when component mounts
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        scale: animate ? 1.03 : 1,
      }}
      transition={{
        duration: 0.3,
        scale: { duration: 0.2 },
      }}
      className={cn(
        "flex items-center overflow-hidden rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-md",
        variant === "default"
          ? "bg-gradient-to-r from-orange-700 to-orange-800"
          : "bg-gradient-to-r from-emerald-700 to-emerald-800",
        className
      )}
    >
      <div className="p-2 bg-white/10 flex items-center justify-center">
        <img
          src="https://i.imgur.com/RVgB3E6.png"
          width="40"
          height="40"
          alt="Donation"
          className="object-contain"
        />
      </div>
      <div className="flex justify-between w-full items-center">
        <span className="p-3 text-white font-medium">{name}</span>
        <span className="p-3 font-bold text-white">{amount} kr</span>
      </div>
    </motion.div>
  );
}
