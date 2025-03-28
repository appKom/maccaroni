"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsComplete(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-[60vh] flex bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950  items-center justify-center z-50 relative overflow-hidden">
      {!isComplete && (
        <div className="text-center z-10 relative">
          <motion.div
            className="flex items-center justify-center mb-8 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <DollarSign className="text-yellow-400 size-12hidden md:block" />
            <h1 className="text-4xl md:text-6xl font-bold text-purple-100 pb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">
              Du kan begynne å by på auksjonen om
            </h1>
            <DollarSign className="text-yellow-400 size-12 hidden md:block" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { label: "Dager", value: timeLeft.days },
              { label: "Timer", value: timeLeft.hours },
              { label: "Minutter", value: timeLeft.minutes },
              { label: "Sekunder", value: timeLeft.seconds },
            ].map((item) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className="w-24 h-24 md:w-32 md:h-32 bg-purple-800/30 backdrop-blur-lg rounded-lg flex items-center justify-center text-4xl md:text-6xl font-bold text-purple-100 border border-purple-500/30 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(168,85,247,0.2)",
                      "0 0 20px rgba(168,85,247,0.5)",
                      "0 0 0px rgba(168,85,247,0.2)",
                    ],
                  }}
                  transition={{
                    boxShadow: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <span className="absolute top-1 right-2 text-yellow-400 text-sm">
                    $
                  </span>
                  {String(item.value).padStart(2, "0")}
                </motion.div>
                <span className="text-purple-200 text-lg md:text-xl mt-2 font-medium">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
