"use client";

import type React from "react";

import Link from "next/link";
import { Button as UIButton } from "@/components/ui/button";

interface Props {
  onClick?: () => void;
  href?: string;
  color: "onlineOrange" | "green" | "red";
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  onClick,
  href,
  color,
  children,
  className,
  type = "button",
  disabled,
}: Props) => {
  const colorStyle =
    color == "onlineOrange"
      ? "border-2 border-onlineOrange text-onlineOrange hover:bg-inherit hover:text-orange-500 hover:border-orange-500"
      : color == "green"
      ? "border-green-500/50 w-full border text-green-300 bg-green-900/30 hover:bg-green-900/60 hover:text-green-300"
      : color == "red"
      ? "border-red-500/50 w-full text-red-300 bg-red-900/30 hover:bg-red-900/60 hover:text-red-300"
      : "";

  if (href) {
    return (
      <Link
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors w-full bg-transparent border ${colorStyle} ${className}`}
        href={href}
      >
        {children}
      </Link>
    );
  }

  return (
    <UIButton
      type={type}
      disabled={disabled}
      variant="outline"
      className={`${className} w-full bg-transparent border ${colorStyle}`}
      onClick={onClick}
    >
      {children}
    </UIButton>
  );
};
