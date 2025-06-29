"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show button when scrolled down at least 300px
      setIsVisible(scrollTop > 300);

      // Check if we're close to the bottom (within 100px)
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
      
      // Mark as initialized after first check
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };

    // 초기 상태 설정
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [isInitialized]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed rounded-full p-2 shadow-lg z-50 right-6 xl:hidden overflow-hidden"
          aria-label="Scroll to top"
          initial={{ 
            opacity: 0, 
            scale: 0.5,
            bottom: isAtBottom ? "10rem" : "5rem"
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            bottom: isAtBottom ? "10rem" : "5rem"
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ 
            type: "keyframes",
            duration: 0.3,
            ease: "easeOut",
            bottom: {
              type: "keyframes",
              duration: 0.4,
              ease: "easeInOut"
            }
          }}
        >
          <span className="absolute inset-0 bg-primary hover:bg-primary/90 transition-colors duration-200" />
          <ArrowUp className="h-5 w-5 relative z-10 text-primary-foreground" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
