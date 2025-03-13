"use client";
import Link from "next/link";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 border-border/40 bg-background/50 backdrop-blur-sm py-6 md:py-8 mt-10 max-w-screen-2xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left side - Nav links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="https://github.com/lazy-dinosaur"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </Link>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://github.com/lazy-dinosaur"
                target="_blank"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <FaGithub size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="mailto:woohs0130@naver.com"
                target="_blank"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <FaEnvelope size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://open.kakao.com/o/sdG4BPjh"
                target="_blank"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <RiKakaoTalkFill size={18} />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-border/20 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Copyright © {currentYear} by Hyeongseok Woo. All rights reserved.
          </div>
          <div className="text-xs text-muted-foreground mt-2 md:mt-0">
            Built with Next.js, TypeScript, and Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
}
