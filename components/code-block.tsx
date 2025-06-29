"use client";

import React, { useState, memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "./ui/button";
import { Copy, Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
}

// SyntaxHighlighter를 별도 컴포넌트로 분리
const CodeHighlighter = memo(({ 
  language, 
  code, 
  isDark 
}: { 
  language: string; 
  code: string; 
  isDark: boolean;
}) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={isDark ? oneDark : oneLight}
      customStyle={{
        margin: 0,
        padding: "1rem",
        borderRadius: 0,
        fontSize: "13px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        overflowWrap: "anywhere",
        maxWidth: "100%",
        overflowX: "visible",
        background: isDark
          ? "rgba(30, 30, 30, 0.95)"
          : "rgba(250, 250, 250, 0.95)",
        transition: "background 0.3s ease",
      }}
      wrapLines={true}
      wrapLongLines={true}
      lineProps={{
        style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
      }}
      className="whitespace-pre-wrap break-all"
      PreTag={({ children, ...props }) => (
        <pre {...props} className="transition-colors duration-300">
          {children}
        </pre>
      )}
    >
      {code}
    </SyntaxHighlighter>
  );
});

CodeHighlighter.displayName = "CodeHighlighter";

function CodeBlock({
  language,
  code,
  filename,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // 테마를 직접 체크 (서버와 클라이언트 모두에서 작동)
  const isDark = resolvedTheme === "dark";

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
      kotlin: "Kotlin",
    };

    return langMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <div className="relative spacing-section rounded-lg overflow-hidden border border-primary/20 shadow-md">
      <div
        className="flex items-center justify-between bg-gradient-to-r from-primary/20 to-primary/5 text-primary 
        px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-mono border-b border-primary/15"
      >
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
              <span className="font-medium">
                {getDisplayLanguage(language)}
              </span>
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
            <span className={isCopied ? "text-primary" : ""}>
              {isCopied ? "Copied!" : "Copy"}
            </span>
          </motion.div>
        </Button>
      </div>

      <motion.div
        initial={
          isCollapsed
            ? { height: 0, opacity: 0 }
            : { height: "auto", opacity: 1 }
        }
        animate={
          isCollapsed
            ? { height: 0, opacity: 0 }
            : { height: "auto", opacity: 1 }
        }
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="relative overflow-auto max-w-full break-all whitespace-pre-wrap">
          <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>

          {/* 항상 CodeHighlighter 렌더링 */}
          <CodeHighlighter language={language} code={code} isDark={isDark} />
        </div>
      </motion.div>
    </div>
  );
}

export default memo(CodeBlock, (prevProps, nextProps) => {
  return (
    prevProps.code === nextProps.code && 
    prevProps.language === nextProps.language &&
    prevProps.filename === nextProps.filename
  );
});
