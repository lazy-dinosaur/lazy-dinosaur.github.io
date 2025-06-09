"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export default function TableOfContents({ className }: TableOfContentsProps) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // 헤딩 상태 관리
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  
  // 헤딩 요소 추출 - DOM이 완전히 로드된 후 실행
  useEffect(() => {
    // DOM이 완전히 로드되었는지 확인하는 함수
    const extractHeadings = () => {
      const headingElements = document.querySelectorAll("h1, h2, h3, h4");
      const items: TOCItem[] = Array.from(headingElements)
        .filter((el) => el.id && el.textContent?.trim() && el.id !== "post-title")
        .map((el) => ({
          id: el.id,
          text: el.textContent?.trim() || "",
          level: parseInt(el.tagName.substring(1)),
        }));
      
      setHeadings(items);
    };
    
    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver((mutations) => {
      // 헤딩 요소가 추가되었는지 확인
      const hasHeadingChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            return element.matches('h1, h2, h3, h4') || 
                   element.querySelector('h1, h2, h3, h4');
          }
          return false;
        });
      });
      
      if (hasHeadingChanges) {
        extractHeadings();
      }
    });
    
    // 초기 실행을 지연시켜 DOM이 완전히 로드되도록 함
    const initialTimer = setTimeout(extractHeadings, 50);
    
    // DOM 변경 감지 시작
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // 추가적으로 여러 번 확인 (fallback)
    const timer1 = setTimeout(extractHeadings, 200);
    const timer2 = setTimeout(extractHeadings, 500);
    
    return () => {
      observer.disconnect();
      clearTimeout(initialTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  // IntersectionObserver 설정
  useEffect(() => {
    if (headings.length === 0) return;

    // 기존 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 새로운 observer 생성
    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 보이는 헤딩들 찾기
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            id: entry.target.id,
            y: entry.boundingClientRect.y,
          }))
          .sort((a, b) => a.y - b.y);

        if (visibleHeadings.length > 0) {
          // 가장 위에 있는 헤딩을 활성화
          setActiveId(visibleHeadings[0].id);
        } else {
          // 보이는 헤딩이 없으면 현재 스크롤 위치 위에 있는 가장 가까운 헤딩 활성화
          const scrollTop = window.scrollY;
          let closestHeading = headings[0];
          
          for (const heading of headings) {
            const element = document.getElementById(heading.id);
            if (element && element.offsetTop <= scrollTop + 150) {
              closestHeading = heading;
            } else {
              break;
            }
          }
          
          setActiveId(closestHeading.id);
        }
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: [0, 0.5, 1.0],
      }
    );

    // 모든 헤딩 관찰
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    observerRef.current = observer;

    // 초기 상태 설정
    const handleInitialScroll = () => {
      const scrollTop = window.scrollY;
      let activeHeading = headings[0];
      
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollTop + 150) {
          activeHeading = heading;
        }
      }
      
      setActiveId(activeHeading.id);
    };

    // 약간의 지연 후 초기 상태 설정
    const timer = setTimeout(handleInitialScroll, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // URL 해시 처리
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && headings.some((h) => h.id === hash)) {
      setActiveId(hash);
      // 해당 요소로 스크롤
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [headings, pathname]);

  // 클릭 핸들러 - useCallback으로 최적화
  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // URL 해시 업데이트
      window.history.pushState(null, "", `#${id}`);
      
      // 부드러운 스크롤
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      
      setActiveId(id);
    }
  }, []);

  // 키보드 네비게이션 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(id);
    }
  }, [handleClick]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav 
      className={cn("toc w-full", className)}
      aria-label="목차"
      role="navigation"
    >
      <div className="pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-hierarchy-h4">목차</h4>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-accent rounded-md transition-colors"
            aria-label={isExpanded ? "목차 접기" : "목차 펼치기"}
            aria-expanded={isExpanded}
          >
            <svg
              className={cn(
                "w-4 h-4 transition-transform",
                isExpanded ? "rotate-180" : ""
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <ul role="list" className="space-y-1 text-sm">
            {headings.map((heading) => {
              const isActive = heading.id === activeId;
              
              return (
                <li
                  key={heading.id}
                  role="listitem"
                  style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  className="relative"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  
                  <button
                    onClick={() => handleClick(heading.id)}
                    onKeyDown={(e) => handleKeyDown(e, heading.id)}
                    className={cn(
                      "block w-full text-left py-1 px-2 rounded-md transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      isActive
                        ? "text-primary font-medium bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    role="link"
                    aria-current={isActive ? "location" : undefined}
                    aria-label={`${heading.text}로 이동`}
                  >
                    {heading.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
        
        {/* 진행률 표시기 */}
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{
              width: activeId
                ? `${((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100}%`
                : "0%",
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </nav>
  );
}