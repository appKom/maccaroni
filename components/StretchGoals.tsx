"use client";

import { useState, useEffect } from "react";
import { Check, Gift, Trophy } from "lucide-react";
import { Collected, PrizeGoal } from "@prisma/client";

interface Props {
  prizeGoals: PrizeGoal[];
  collected: Collected[];
  className?: string;
}

export default function StretchGoals({
  prizeGoals,
  collected,
  className = "",
}: Props) {
  const [animate, setAnimate] = useState(false);
  const sortedGoals = [...prizeGoals].sort((a, b) => a.goal - b.goal);
  const maxAmount = sortedGoals.reduce(
    (acc, goal) => Math.max(acc, goal.goal),
    0
  );

  const collectedAmount = collected.reduce((acc, goal) => acc + goal.amount, 0);

  const progressPercentage = Math.min(
    100,
    Math.round((collectedAmount / maxAmount) * 100)
  );

  const reachedGoals = sortedGoals.filter(
    (goal) => collectedAmount >= goal.goal
  );
  const nextGoal = sortedGoals.find((goal) => collectedAmount < goal.goal);

  useEffect(() => {
    if (reachedGoals.length > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [reachedGoals.length]);

  const isHighestGoal = (goal: PrizeGoal) => {
    return goal === sortedGoals[sortedGoals.length - 1];
  };

  return (
    <article
      className={`rounded-lg w-full shadow-lg bg-gradient-to-r from-orange-800 to-amber-800 ${className}`}
    >
      <div className="p-2 sm:p-6 space-y-4">
        <div className="flex flex-col w-full sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-4xl font-bold text-white">Stretchgoals</h2>
          <div className="text-2xl sm:text-4xl font-bold text-orange-100">
            {collectedAmount.toLocaleString("nb-NO")} /{" "}
            {maxAmount.toLocaleString("nb-NO")}kr
          </div>
        </div>

        <div className="h-24 bg-orange-950 border border-orange-800 dark:bg-orange-900 rounded-full overflow-hidden relative">
          <div
            className={`h-full bg-gradient-to-r from-green-700 to-green-900 transition-all duration-1000 ease-out ${
              animate ? "animate-pulse" : ""
            }`}
            style={{ width: `${progressPercentage}%` }}
          />

          {/* Goal markers */}
          {sortedGoals.map((goal) => {
            const markerPosition = (goal.goal / maxAmount) * 100;
            const isReached = collectedAmount >= goal.goal;

            if (!isHighestGoal(goal))
              return (
                <div
                  key={goal.id}
                  className="absolute top-0 bottom-0 flex items-center justify-center"
                  style={{
                    left: `${markerPosition}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className={`h-full border-2 ${
                      isReached
                        ? "bg-green-500 border-white"
                        : "bg-orange-100 border-white"
                    } z-10`}
                  />
                </div>
              );
          })}
        </div>

        <div className="space-y-3 mt-4">
          {sortedGoals.map((goal) => {
            const isReached = collectedAmount >= goal.goal;
            return (
              <div
                key={goal.id}
                className={`flex items-center p-3 rounded-lg transition-all ${
                  isReached
                    ? "bg-green-900 border-l-4 border-green-500"
                    : goal === nextGoal
                    ? "bg-orange-950 border-l-4 border-orange-500"
                    : "bg-orange-900"
                }`}
              >
                <div
                  className={`p-2 rounded-full mr-3 ${
                    isReached
                      ? "bg-green-800 text-green-300"
                      : "bg-orange-800 text-orange-300"
                  }`}
                >
                  {isReached ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Gift className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base break-words break-all overflow-wrap whitespace-normal overflow-hidden">
                    {goal.description}
                  </div>
                </div>
                <div className="font-bold text-right ml-2 flex-shrink-0">
                  {goal.goal.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Celebration when all goals are reached */}
      {reachedGoals.length === sortedGoals.length && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 flex items-center justify-center text-white">
          <Trophy className="h-6 w-6 mr-2" />
          <span className="font-bold">All goals reached! Thank you!</span>
        </div>
      )}
    </article>
  );
}
