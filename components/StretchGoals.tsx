"use client";

import { useState, useEffect } from "react";
import { Check, Gift, Star, Trophy } from "lucide-react";
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
          <h2 className="text-4xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-300" />
            Stretchgoals
            <Trophy className="h-8 w-8 text-yellow-300" />
          </h2>
          <div className="text-2xl sm:text-4xl font-bold text-orange-100 bg-orange-950/50 px-4 py-1 rounded-full">
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

          {sortedGoals.map((goal) => {
            const markerPosition = (goal.goal / maxAmount) * 100;
            const isReached = collectedAmount >= goal.goal;

            if (!isHighestGoal(goal))
              return (
                <div
                  key={goal.id}
                  className="absolute top-0 bottom-0 flex flex-col items-center"
                  style={{
                    left: `${markerPosition}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className={`absolute -top-12 transform ${
                      isReached ? "scale-110" : "scale-100"
                    } transition-transform duration-300`}
                  >
                    <div className="relative">
                      <div
                        className={`w-1 h-12 ${
                          isReached ? "bg-yellow-400" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`absolute top-0 right-0 w-10 h-6 
                        ${
                          isReached
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-300"
                            : "bg-gradient-to-r from-gray-500 to-gray-400"
                        } 
                        flex items-center justify-center text-xs font-bold
                        ${isReached ? "text-orange-900" : "text-white"}
                        shadow-md`}
                      >
                        {(goal.goal / 1000).toFixed(0)}K
                      </div>
                      {isReached && (
                        <div className="absolute -right-2 -top-2 animate-bounce">
                          <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`h-full w-1 ${
                      isReached
                        ? "bg-gradient-to-b from-yellow-300 to-green-500 border-white"
                        : "bg-orange-100 border-orange-600"
                    } z-10 ${isReached ? "shadow-glow" : ""}`}
                  />

                  {isReached && (
                    <div className="absolute -bottom-6 bg-green-600 rounded-full p-1 animate-pulse">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            else
              return (
                <div
                  key={goal.id}
                  className="absolute top-0 bottom-0 flex flex-col items-center"
                  style={{
                    left: `${markerPosition}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="absolute -top-14 transform scale-125 transition-transform duration-300">
                    <div className="relative">
                      <div
                        className={`w-1 h-14 ${
                          isReached ? "bg-purple-500" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`absolute top-0 right-0 w-12 h-8 
                      ${
                        isReached
                          ? "bg-gradient-to-r from-purple-600 to-purple-400"
                          : "bg-gradient-to-r from-gray-600 to-gray-400"
                      } 
                      flex items-center justify-center text-xs font-bold
                      ${isReached ? "text-white" : "text-white"}
                      shadow-md`}
                      >
                        Siste
                      </div>
                      {isReached && (
                        <div className="absolute -right-2 -top-2 animate-ping">
                          <Trophy className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
          })}
        </div>

        {nextGoal && (
          <div className="text-center text-white animate-pulse">
            <span className="font-bold">Neste mål: </span>
            {(nextGoal.goal - collectedAmount).toLocaleString("nb-NO")}kr igjen!
          </div>
        )}

        {!nextGoal && reachedGoals.length === sortedGoals.length && (
          <div className="text-center text-yellow-300 font-bold text-xl animate-bounce">
            🎉 Alle mål er nådd! Bazinga! 🎉
          </div>
        )}

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
                  {goal.goal.toLocaleString()}kr
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {reachedGoals.length === sortedGoals.length && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 flex items-center justify-center text-white">
          <Trophy className="h-6 w-6 mr-2" />
          <span className="font-bold">Alle mål er nådd! Tusen takk!</span>
        </div>
      )}
    </article>
  );
}
