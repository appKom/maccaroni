"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 text-gray-100 bg-transparent/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex flex-row items-start justify-center gap-4 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/Online_hvit.svg"
                alt="Appkom logo"
                width={100}
                height={100}
                className="hidden md:block"
              />

              <Image
                src="/Online_hvit_o.svg"
                alt="Online logo"
                width={40}
                height={40}
                className="block md:hidden"
              />

              <span className="text-sm md:text-2xl font-bold">
                Veldedighetsfest {new Date().getFullYear()}
              </span>
            </Link>
          </motion.div>

          <motion.nav
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/auksjon"
              className="hover:text-onlineOrange flex flex-row gap-2 items-center text-xl transition-colors group"
            >
              <p>Stilleauksjon</p>

              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/regelark"
              className="hover:text-onlineOrange flex flex-row gap-2 items-center text-xl transition-colors group"
            >
              <p>Regelark</p>

              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.nav>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-100 hover:text-onlineOrange transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4"
            >
              <nav className="flex flex-col gap-4">
                <Link
                  href="/auksjon"
                  className="text-xl hover:text-onlineOrange transition-colors"
                  onClick={toggleMenu}
                >
                  Stilleauksjon
                </Link>
                <Link
                  href="/regelark"
                  className="text-xl hover:text-onlineOrange transition-colors"
                  onClick={toggleMenu}
                >
                  Regelark
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
