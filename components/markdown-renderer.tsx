"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Element } from "hast";
import CodeBlock from "./code-block";
import { motion } from "framer-motion";

export interface MarkdownRendererProps {
  content: string;
  publish?: string;
  tags?: string[];
  published?: string;
  modified?: string;
}

interface LinkMap {
  [key: string]: string;
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "날짜 정보 없음";

  try {
    return new Date(dateString).toLocaleDateString("ko-KR");
  } catch (error) {
    console.error("날짜 변환 오류:", error);
    return "유효하지 않은 날짜";
  }
}

export default function MarkdownRenderer({
  content,
  tags,
  published,
  modified,
}: MarkdownRendererProps) {
  const [linkMap, setLinkMap] = useState<LinkMap>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  useEffect(() => {
    fetch("/link-map.json")
      .then((res) => res.json())
      .then((data) => {
        setLinkMap(data);
        setIsMapLoaded(true);
      })
      .catch((err) => {
        console.error("링크 매핑 로드 실패:", err);
        setIsMapLoaded(true);
      });
  }, []);

  const processWikiLinks = (text: string) => {
    // 이스케이프된 링크 패턴을 정상 링크로 변환
    let processed = text.replace(
      /\\\[(.*?)\\\]\((.*?)\)/g,
      (_, linkText, href) => {
        // 링크 텍스트는 그대로, href는 URI 인코딩
        return `[${linkText}](${encodeURIComponent(href)})`;
      },
    );

    // 위키링크 처리
    processed = processed.replace(
      /\[\[([^|]+)(?:\|([^\]]+))?\]\]/g,
      (_, path, label) => {
        // 경로 정규화
        const cleanPath = path.replace(/\.md$/, "");
        // 표시할 이름이 없으면 경로의 마지막 부분을 사용
        const displayName = label || cleanPath.split("/").pop() || cleanPath;

        // URI 인코딩 적용
        const encodedPath = encodeURIComponent(cleanPath);

        // 인코딩된 경로로 마크다운 링크 생성
        return `[${displayName}](${encodedPath})`;
      },
    );

    return processed;
  };

  const processedContent = processWikiLinks(content);

  const components = {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <div className="spacing-section">
        <motion.h1 
          id="post-title" 
          className="text-hierarchy-h1 mb-3 sm:mb-4 md:mb-5 text-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.h1>
        
        {/* 태그 목록 */}
        <motion.div 
          className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {tags?.map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Badge
                variant="secondary"
                className="text-hierarchy-small hover:bg-primary/20 transition-colors duration-200"
              >
                #{tag}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        {/* 날짜 정보 */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:justify-between text-hierarchy-small mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-primary/70">작성일:</span>
            <span>{formatDate(published)}</span>
          </div>
          {modified && (
            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
              <span className="text-primary/70">수정일:</span>
              <span>{formatDate(modified)}</span>
            </div>
          )}
        </motion.div>
      </div>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => {
      // 텍스트만 추출해서 id로 사용, 특수문자 제거하여 안전한 ID 생성
      const id =
        children
          ?.toString()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]/g, "") || "heading";
      return (
        <h2
          id={id}
          className="group text-hierarchy-h2 spacing-heading pb-2 sm:pb-3 border-b border-primary/10 flex items-center"
        >
          <span>{children}</span>
          <a 
            href={`#${id}`} 
            className="ml-2 opacity-0 group-hover:opacity-100 text-primary/60 hover:text-primary transition-opacity duration-200"
            aria-label="Link to this heading"
          >
            #
          </a>
        </h2>
      );
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const id =
        children
          ?.toString()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]/g, "") || "heading";
      return (
        <h3 
          id={id} 
          className="group text-hierarchy-h3 spacing-heading flex items-center"
        >
          <span>{children}</span>
          <a 
            href={`#${id}`} 
            className="ml-2 opacity-0 group-hover:opacity-100 text-primary/60 hover:text-primary transition-opacity duration-200"
            aria-label="Link to this heading"
          >
            #
          </a>
        </h3>
      );
    },
    h4: ({ children }: { children?: React.ReactNode }) => {
      const id =
        children
          ?.toString()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]/g, "") || "heading";
      return (
        <h4 
          id={id} 
          className="group text-hierarchy-h4 spacing-heading flex items-center"
        >
          <span>{children}</span>
          <a 
            href={`#${id}`} 
            className="ml-2 opacity-0 group-hover:opacity-100 text-primary/60 hover:text-primary transition-opacity duration-200"
            aria-label="Link to this heading"
          >
            #
          </a>
        </h4>
      );
    },
    p: ({ children }: { children?: React.ReactNode }) => {
      const hasBlockElement = React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) return false;

        const childType = (child as React.ReactElement).type;
        const isCustomImage = childType === components.img;

        const htmlElementType =
          typeof childType === "string"
            ? childType
            : (childType as React.ComponentType).displayName;

        return (
          isCustomImage ||
          (htmlElementType &&
            ["div", "img", "pre", "table"].includes(htmlElementType))
        );
      });

      return hasBlockElement ? (
        <div className="spacing-paragraph">{children}</div>
      ) : (
        <p className="text-hierarchy-body spacing-paragraph">{children}</p>
      );
    },
    code({
      inline,
      className,
      children,
      ...props
    }: {
      node?: Element;
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    }) {
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");

      // Check for filename in a comment at the start of the code block (e.g. // filename: app.js)
      let filename = undefined;
      const filenameMatch = code.match(/^\/\/\s*filename:\s*(.+)$/m);
      if (filenameMatch) {
        filename = filenameMatch[1].trim();
      }

      return !inline && match ? (
        <CodeBlock language={match[1]} code={code} filename={filename} />
      ) : (
        <code
          className="bg-primary/5 text-primary px-1.5 py-0.5 rounded-md mx-0.5 font-mono text-[0.9em] border border-primary/10"
          {...props}
        >
          {children}
        </code>
      );
    },
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <motion.div 
        className="spacing-section relative group"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col w-full items-center justify-center">
          <div
            className="relative overflow-hidden rounded-md sm:rounded-lg shadow-lg transition-all duration-300 
            group-hover:shadow-xl border border-primary/10 w-full max-w-full sm:max-w-2xl md:max-w-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent z-0"></div>
            <Image
              src={src || ""}
              alt={alt || ""}
              width={1200}
              height={630}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03] relative z-10"
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 85vw, (max-width: 1024px) 75vw, 50vw"
              loading="lazy"
            />
          </div>
          {alt && (
            <div className="text-center text-hierarchy-small mt-3 sm:mt-4 italic text-primary/80 font-medium">
              {alt}
            </div>
          )}
        </div>
      </motion.div>
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      if (!href) return <span>{children}</span>;

      // 외부 링크 처리 (http로 시작하는 경우)
      if (href.startsWith("http")) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-primary font-medium transition-all duration-200
              hover:text-primary/80 after:absolute after:left-0 after:right-0 after:bottom-0 
              after:h-[1px] after:bg-primary after:origin-bottom-right after:scale-x-0 
              hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            {children}
          </a>
        );
      }

      // 홈으로 가는 링크
      if (href === "/") {
        return (
          <Link
            href="/"
            className="relative text-primary font-medium transition-all duration-200
              hover:text-primary/80 after:absolute after:left-0 after:right-0 after:bottom-0 
              after:h-[1px] after:bg-primary after:origin-bottom-right after:scale-x-0 
              hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            {children}
          </Link>
        );
      }

      // 내부 링크 처리
      if (!isMapLoaded)
        return <span className="text-muted-foreground">{children}</span>;

      // 디코딩 및 정규화
      const decodedHref = decodeURIComponent(href);
      const normalizedHref = decodedHref.replace(/\.md$/, "");
      const targetFileName = normalizedHref.split("/").pop();

      // 링크맵에서 검색
      for (const [key, value] of Object.entries(linkMap)) {
        const srcFileName = key.replace(/\.md$/, "").split("/").pop();
        if (srcFileName === targetFileName) {
          return (
            <Link
              href={`/posts/${value}`}
              className="relative text-primary font-medium transition-all duration-200
                hover:text-primary/80 after:absolute after:left-0 after:right-0 after:bottom-0 
                after:h-[1px] after:bg-primary after:origin-bottom-right after:scale-x-0 
                hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {children}
            </Link>
          );
        }
      }

      // 발행되지 않은 문서 링크
      return (
        <span
          className="relative text-muted-foreground cursor-not-allowed border-b border-dashed border-muted-foreground/50
            hover:text-muted-foreground/80 transition-colors duration-200"
          title="발행되지 않은 문서"
        >
          {children}
        </span>
      );
    },
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <motion.blockquote 
        className="spacing-paragraph border-l-4 border-primary pl-4 sm:pl-5 md:pl-6 py-2 sm:py-3
          bg-primary/5 rounded-r-lg shadow-sm"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-foreground/80 italic font-medium">{children}</div>
      </motion.blockquote>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="spacing-paragraph ml-4 sm:ml-5 md:ml-6 space-y-1.5 sm:space-y-2 md:space-y-2.5 list-disc marker:text-primary/70">
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="spacing-paragraph ml-4 sm:ml-5 md:ml-6 space-y-1.5 sm:space-y-2 md:space-y-2.5 list-decimal marker:text-primary/70 marker:font-medium">
        {children}
      </ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-hierarchy-body pl-1.5 sm:pl-2">
        {children}
      </li>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
      <motion.div 
        className="spacing-section overflow-x-auto rounded-md sm:rounded-lg border border-primary/10 shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <table className="w-full border-collapse text-hierarchy-body">
          {children}
        </table>
      </motion.div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <thead className="bg-primary/10 font-medium text-primary/90">{children}</thead>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <th className="text-left py-2.5 sm:py-3.5 px-3 sm:px-4 md:px-5 font-semibold border-b border-primary/10">
        {children}
      </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 md:px-5 border-b border-primary/5 transition-colors duration-150 hover:bg-primary/2">
        {children}
      </td>
    ),
    hr: () => (
      <motion.hr 
        className="spacing-section border-none h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.7 }}
      />
    ),
    input: ({ checked }: { checked?: boolean }) => (
      <span className="inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/30 mr-2 transition-all duration-200"
          readOnly
        />
      </span>
    ),
  };

  return (
    <div className="prose-custom">
      <ReactMarkdown components={components}>{processedContent}</ReactMarkdown>
    </div>
  );
}
