"use client";
import Link from "next/link";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerVisible, setFooterVisible] = useState(false);

  return (
    <>
      {footerVisible ? (
        <></>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 py-6 border-border/60 hidden xl:block w-full md:px-5 -z-10"
        >
          {/* 소셜 링크 */}
          <div className="flex items-center justify-end gap-4 mb-4 max-w-screen-2xl mx-auto">
            <Link
              href="https://github.com/lazy-dinosaur"
              target="_blank"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </Link>
            <Link
              href="mailto:lazydino1314@gmail.com"
              target="_blank"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </Link>
            <Link
              href="https://open.kakao.com/o/sdG4BPjh"
              target="_blank"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.486 2 2 5.677 2 10.2c0 2.933 1.904 5.41 4.666 6.82-.193.86-.707 3.088-.73 3.266-.036.268.127.517.364.593.085.028.174.041.262.041.147 0 .291-.054.404-.155.16-.143 2.398-1.647 3.484-2.384.503.07 1.026.118 1.55.118 5.514 0 10-3.675 10-8.2C22 5.677 17.514 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {/* 저작권 정보 */}
          {/* <div className="text-xs text-muted-foreground text-center"> */}
          {/* 	Copyright © {new Date().getFullYear()} by Hyeongseok Woo */}
          {/* </div> */}
          {/* <div className="text-xs text-muted-foreground text-center mt-1"> */}
          {/* 	Built with Next.js, TypeScript, and Tailwind CSS */}
          {/* </div> */}
        </motion.div>
      )}
      <motion.footer
        onViewportEnter={() => setFooterVisible(true)}
        onViewportLeave={() => setFooterVisible(false)}
        className="w-full border-border/40 bg-background/50 backdrop-blur-sm py-6 md:py-8 mt-10"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="https://github.com/lazy-dinosaur"
                  target="_blank"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <FaGithub size={16} />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="mailto:lazydino1314@gmail.com"
                  target="_blank"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <FaEnvelope size={16} />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
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

          <div className="mt-6 pt-4 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Copyright © {currentYear} by Hyeongseok Woo. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground mt-2 md:mt-0">
              Built with Next.js, TypeScript, and Tailwind CSS
            </div>
          </div>
        </div>
      </motion.footer>
    </>
  );
}
