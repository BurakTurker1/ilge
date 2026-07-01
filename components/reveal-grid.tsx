"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function RevealGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.06
          }
        }
      }}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
