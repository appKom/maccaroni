"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
  intervalInMinutes: number;
  children: React.ReactNode;
}

export default function AutoRefresh({
  intervalInMinutes,
  children,
}: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const intervalInMs = intervalInMinutes * 60 * 1000;

    const interval = setInterval(() => {
      router.refresh();
    }, intervalInMs);

    return () => clearInterval(interval);
  }, [router, intervalInMinutes]);

  return <>{children}</>;
}
