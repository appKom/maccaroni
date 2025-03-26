"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../Button";

export default function MentalHelseBanner() {
  const controls = useAnimation();
  const bannerRef = useRef(null);
  const isInView = useInView(bannerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const pulseAnimation = {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
    },
  };

  return (
    <section
      ref={bannerRef}
      className="w-full bg-gradient-to-br mb-16 rounded-lg from-[#4a1d6a] to-[#2d1145] text-white overflow-hidden relative py-12 md:py-16"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-400/20 opacity-50" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-purple-500/20 opacity-50" />

      <div className="container px-4 md:px-6 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-purple-200">Mental Helse</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-100">
                  45 år for psykisk helse
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-purple-100 text-lg max-w-md"
            >
              En medlemsorganisasjon for mennesker med psykiske
              helseutfordringer, pårørende og andre interesserte.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Button href="https://mentalhelse.no/om-oss/" color="purple">
                Mer om Mental Helse
                <motion.span
                  animate={pulseAnimation}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Button>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 bg-purple-900/40 rounded-2xl p-6 border border-purple-700/30"
            >
              <div className="flex justify-center mb-6">
                <Image
                  src="/mental_helse.svg"
                  alt="Mental Helse Logo"
                  width={200}
                  height={60}
                  className="object-contain"
                />
              </div>

              <motion.p
                variants={itemVariants}
                className="mt-6 text-sm text-center text-purple-200"
              >
                I 45 år har Mental Helse kjempet for økt åpenhet og et mer
                inkluderende samfunn. Vi jobber for at alle mennesker skal ha
                rett til et meningsfullt liv med en opplevelse av egenverd og
                mestring. Vi er aktive og synlige i alle fylker med lokallag som
                dekker de fleste kommuner i Norge.
              </motion.p>
            </motion.div>

            <div className="absolute top-6 right-6 w-full h-full bg-purple-800/20 rounded-2xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
