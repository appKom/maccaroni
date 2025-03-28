"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DonationCardProps {
  name: string;
  amount: number | null;
  description: string | null;
  variant?: "default" | "top";
  className?: string;
}

export function DonationCard({
  name,
  amount,
  description,
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
        "flex items-stretch overflow-hidden rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-md",
        variant === "default"
          ? "bg-gradient-to-r from-orange-700 to-orange-800"
          : "bg-gradient-to-r from-emerald-700 to-emerald-800",
        className
      )}
    >
      <div className="relative bg-white/10 w-14 flex-shrink-0">
        <div className="relative h-full w-full">
          <Image
            src="/vipps.svg"
            alt="Donation"
            fill={true}
            sizes="56px"
            style={{ objectFit: "contain" }}
            className="p-2"
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow py-2 px-3">
        <div className="flex justify-between w-full items-center">
          <span className="text-white font-medium">{name}</span>
        </div>
        {description && (
          <div className="flex justify-between w-full items-center">
            <span className="text-white/80 text-sm mt-1">{description}</span>
            <span className="font-bold text-white">{amount} kr</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
