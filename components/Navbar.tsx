"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LogInIcon, LogOutIcon, Menu, X } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const { data: session } = useSession();

  const handleLogin = () =>
    signIn("auth0", {
      callbackUrl: "/",
    });

  const handleLogout = () => signOut();

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

  const navLinks = [
    {
      title: "Stilleauksjon",
      href: "/auksjon",
    },
    {
      title: "Regelark",
      href: "/regelark",
    },
    {
      title: "Doner",
      href: "/doner",
    },
  ];

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 text-gray-100 bg-transparent/80 backdrop-blur-sm"
    >
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex flex-row items-center lg:items-start justify-center gap-4 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/Online_hvit.svg"
                alt="Appkom logo"
                width={100}
                height={100}
                className="hidden lg:block"
              />
              <Image
                src="/Online_hvit_o.svg"
                alt="Online logo"
                width={40}
                height={40}
                className="block lg:hidden"
              />
              <span className="text-md lg:text-2xl font-bold">
                Veldedighetsfest {new Date().getFullYear()}
              </span>
            </Link>
          </motion.div>

          <motion.nav
            className="hidden lg:flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-onlineOrange flex flex-row gap-2 items-center text-xl transition-colors group"
              >
                <p>{link.title}</p>
                <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}

            {session?.user.isAdmin && (
              <Link
                href="/admin"
                className="hover:text-onlineOrange flex flex-row gap-2 items-center text-xl transition-colors group"
              >
                <p>Admin</p>
                <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {session ? (
              <button
                onClick={handleLogout}
                className="hover:text-onlineOrange transition-colors text-xl group"
              >
                <span className="flex flex-row gap-2 items-center">
                  <p>Logg ut</p>
                  <LogOutIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="hover:text-onlineOrange transition-colors text-xl group"
              >
                <span className="flex flex-row gap-2 items-center">
                  <p>Logg inn</p>
                  <LogInIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            )}
          </motion.nav>

          <motion.div className="lg:hidden">
            <motion.button
              onClick={toggleMenu}
              className="p-2 text-gray-100 ml-4 hover:text-onlineOrange transition-colors"
              aria-label="Toggle menu"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X className="size-8" /> : <Menu className="size-8" />}
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-4"
            >
              <nav className="flex flex-col items-start gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="text-xl hover:text-onlineOrange w-full transition-colors group"
                    onClick={toggleMenu}
                  >
                    <span className="flex border-t border-gray-800 pt-2 flex-row justify-between items-center w-full">
                      {link.title}
                      <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}

                {session?.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-xl hover:text-onlineOrange w-full transition-colors group"
                    onClick={toggleMenu}
                  >
                    <span className="flex border-t border-gray-800 pt-2 flex-row justify-between items-center w-full">
                      Admin
                      <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                )}
                {session ? (
                  <button
                    onClick={handleLogout}
                    className="text-xl hover:text-onlineOrange  w-full transition-colors group"
                  >
                    <span className="flex border-t border-gray-800 pt-2 flex-row justify-between items-center w-full">
                      Logg ut
                      <LogOutIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="text-xl hover:text-onlineOrange transition-colors group w-full"
                  >
                    <span className="flex border-t border-gray-800 pt-2 flex-row justify-between items-center w-full">
                      Logg inn
                      <LogInIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
