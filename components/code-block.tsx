"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "./ui/button";
import { Copy, Check, ChevronRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
}

export default function CodeBlock({
  language,
  code,
  filename,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Get language display name
  const getDisplayLanguage = (lang: string) => {
    const langMap: Record<string, string> = {
      js: "JavaScript",
      jsx: "React JSX",
      ts: "TypeScript",
      tsx: "React TSX",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      py: "Python",
      bash: "Bash",
      sh: "Shell",
      md: "Markdown",
      sql: "SQL",
      java: "Java",
      c: "C",
      cpp: "C++",
      cs: "C#",
      go: "Go",
      rust: "Rust",
      swift: "Swift",
      kotlin: "Kotlin"
    };
    
    return langMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <motion.div 
      className="relative spacing-section rounded-lg overflow-hidden border border-primary/20 shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/20 to-primary/5 text-primary 
        px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-mono border-b border-primary/15">
        <div className="flex items-center gap-2">
          {filename ? (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-1.5 hover:text-primary transition-colors group"
              aria-label={isCollapsed ? "Expand code" : "Collapse code"}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 90 }}
                transition={{ duration: 0.2 }}
                className="text-primary/70 group-hover:text-primary"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.div>
              <span className="font-medium">{filename}</span>
            </button>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="font-medium">{getDisplayLanguage(language)}</span>
              <span className="text-2xs text-primary/50 uppercase bg-primary/10 px-1.5 py-0.5 rounded">
                {language}
              </span>
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs hover:bg-primary/20 hover:text-primary transition-all duration-200 group"
        >
          <motion.div
            animate={{ scale: isCopied ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            {isCopied ? (
              <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-primary" />
            ) : (
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-primary/70 group-hover:text-primary transition-colors duration-200" />
            )}
            <span className={isCopied ? "text-primary" : ""}>{isCopied ? "Copied!" : "Copy"}</span>
          </motion.div>
        </Button>
      </div>

      <motion.div
        initial={isCollapsed ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
        animate={isCollapsed ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="relative">
          <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
          
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: "1rem",
              borderRadius: 0,
              fontSize: "13px",
              background: "rgba(20, 20, 20, 0.95)",
            }}
            className="sm:text-[13px] md:text-[14px] sm:p-5 md:p-6 custom-scrollbar"
            wrapLines={true}
            showLineNumbers={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </motion.div>
    </motion.div>
  );
}
