"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  isTriggered: boolean;
  duration?: number;
  loop?: boolean;
  intensity?: "low" | "medium" | "high";
}

export default function Celebration({
  isTriggered,
  duration = 5000,
  loop = false,
  intensity = "medium",
}: CelebrationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getParticleCounts = () => {
    switch (intensity) {
      case "low":
        return { initial: 50, burst: 30 };
      case "high":
        return { initial: 150, burst: 80 };
      default:
        return { initial: 100, burst: 50 };
    }
  };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const fireworks = () => {
    const end = Date.now() + 1000;
    const colors = [
      "#ff0000",
      "#ffa500",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#4b0082",
      "#ee82ee",
    ];

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 20,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
        colors: colors.sort(() => 0.5 - Math.random()).slice(0, 3),
        zIndex: 1000,
      });
    }, 50);
  };

  const schoolPride = () => {
    const end = Date.now() + 1000;
    const colors = ["#FFD700", "#FFA500", "#FF4500", "#32CD32", "#1E90FF"];

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: getParticleCounts().burst,
        angle: randomInRange(30, 150),
        spread: randomInRange(50, 100),
        origin: {
          x: randomInRange(0.1, 0.9),
          y: randomInRange(0.2, 0.5),
        },
        colors: colors,
        zIndex: 1000,
      });
    }, 200);
  };

  const startCelebration = () => {
    setIsPlaying(true);
    const { initial, burst } = getParticleCounts();

    confetti({
      particleCount: initial,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 1000,
    });

    intervalRef.current = setInterval(() => {
      const effects = [
        () => {
          confetti({
            particleCount: burst,
            angle: randomInRange(30, 150),
            spread: randomInRange(50, 100),
            origin: {
              x: randomInRange(0.1, 0.9),
              y: randomInRange(0.2, 0.5),
            },
            colors: ["#FFD700", "#FFA500", "#FF4500", "#32CD32", "#1E90FF"],
            zIndex: 1000,
          });
        },
        fireworks,
        schoolPride,
      ];

      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      randomEffect();
    }, 300);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsPlaying(false);

      if (loop && isTriggered) {
        setTimeout(() => {
          if (isTriggered) {
            startCelebration();
          }
        }, 1000);
      }
    }, duration);
  };

  const stopCelebration = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsPlaying(false);
  };

  useEffect(() => {
    if (isTriggered && !isPlaying) {
      startCelebration();
    } else if (!isTriggered && isPlaying) {
      stopCelebration();
    }

    return () => {
      stopCelebration();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTriggered]);

  return null;
}
