"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { targetDate } from "@/lib/constants";

interface CountdownBannerProps {
  title: string;
  subtitle?: string;
}

export function CountdownBanner({ title }: CountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return (
    <div className="w-full mb-8 bg-gradient-to-r from-purple-900 to-purple-800 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-6 md:size-12 text-purple-300" />
          <h2 className="text-2xl md:text-4xl font-bold text-purple-100">
            {title}
          </h2>
        </div>

        <div
          className={`grid ${
            timeLeft.days > 0 ? "grid-cols-4" : "grid-cols-3"
          }  gap-2 md:gap-4 font-mono`}
        >
          {timeLeft.days > 0 && (
            <TimeUnit value={timeLeft.days} label="Dager" />
          )}
          <TimeUnit value={timeLeft.hours} label="Timer" />
          <TimeUnit value={timeLeft.minutes} label="Minutter" />
          <TimeUnit value={timeLeft.seconds} label="Sekunder" />
        </div>
      </div>
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="bg-purple-950 rounded-md w-full py-3 px-2 flex items-center justify-center mb-2">
        <span className="text-2xl md:text-4xl font-mono font-bold text-white transition-all duration-300">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs md:text-sm text-purple-300">{label}</span>
    </div>
  );
}
