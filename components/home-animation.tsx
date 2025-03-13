"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export function HeaderSection({
  title,
  description,
  extraContent,
}: {
  title: string;
  description: string;
  extraContent?: React.ReactNode;
}) {
  return (
    <motion.section
      className="space-y-2 sm:space-y-3 md:space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.h1
        className="text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="text-base text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
      >
        {description}
      </motion.p>
      {extraContent && (
        <motion.div
          className="mt-4 text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          {extraContent}
        </motion.div>
      )}
    </motion.section>
  );
}

export function PostGrid({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.2 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-5">
        {children}
      </div>
    </motion.section>
  );
}

export function PostItem({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 * (index % 3) + 0.25,
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
