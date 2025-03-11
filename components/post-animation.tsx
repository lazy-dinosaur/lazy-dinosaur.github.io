"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// interface PostAnimationProps {
//   children: ReactNode;
//   publishPath: string;
//   content: string;
//   tags: string[];
//   createdAt: string;
//   modifiedAt: string;
// }

export default function PostAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.article
      className="rounded-lg p-2 sm:p-7 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.article>
  );
}

export function PostAnimationWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function BackToHomeButton() {
  return (
    <div className="mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 border-t">
      <Link
        href="/"
        className="text-primary hover:underline inline-flex items-center text-sm sm:text-base"
      >
        <motion.span
          whileHover={{ x: -3 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        </motion.span>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
