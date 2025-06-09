"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);

  // 헤더 높이 계산 (responsive)
  const getHeaderHeight = useCallback(() => {
    if (typeof window === 'undefined') return 80;
    const width = window.innerWidth;
    if (width >= 768) return 72; // md: h-18
    if (width >= 640) return 64; // sm: h-16
    return 56; // h-14
  }, []);

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

  // 스크롤 기반 활성화 로직 (IntersectionObserver 대신)
  useEffect(() => {
    if (headings.length === 0) return;

    let rafId: number | null = null;
    let lastActiveId = '';
    let debounceTimer: NodeJS.Timeout | null = null;
    let scrollEndTimer: NodeJS.Timeout | null = null;

    const updateActiveHeading = () => {
      // 클릭으로 인한 하이라이팅이 활성화된 경우 스크롤 기반 업데이트 무시
      if (clickedId && isUserScrolling) {
        return;
      }

      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      // 동적 헤더 높이를 고려한 활성화 지점
      const scrollOffset = getHeaderHeight() + 20;
      const activationPoint = scrollTop + scrollOffset;

      let newActiveId = '';

      // 각 헤딩의 위치와 다음 헤딩까지의 영역을 확인
      for (let i = 0; i < headings.length; i++) {
        const element = document.getElementById(headings[i].id);
        if (!element) continue;

        // getBoundingClientRect를 사용하여 더 정확한 위치 계산
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        
        const nextElement = i < headings.length - 1 ?
          document.getElementById(headings[i + 1].id) : null;
        const elementBottom = nextElement ?
          nextElement.getBoundingClientRect().top + scrollTop : document.body.scrollHeight;

        // 활성화 지점이 현재 섹션 내에 있는지 확인
        // 1px의 여유를 두어 경계선 상의 미세한 차이 보정
        if (activationPoint >= elementTop - 1 && activationPoint < elementBottom) {
          newActiveId = headings[i].id;
          break;
        }
      }

      // 스크롤이 최상단 근처인 경우 첫 번째 헤딩 활성화
      if (!newActiveId && scrollTop < 100) {
        newActiveId = headings[0]?.id || '';
      }

      // 스크롤이 최하단인 경우 마지막 헤딩 활성화
      if (!newActiveId && scrollTop + viewportHeight >= document.body.scrollHeight - 50) {
        newActiveId = headings[headings.length - 1]?.id || '';
      }

      // 활성 ID가 변경된 경우에만 업데이트 (깜빡임 방지)
      if (newActiveId && newActiveId !== lastActiveId) {
        lastActiveId = newActiveId;

        // 디바운싱을 통해 빠른 스크롤 시 안정성 향상
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          setActiveId(newActiveId);
        }, 50);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;

      // 스크롤 시작 감지
      setIsUserScrolling(true);

      // 스크롤 종료 감지를 위한 타이머 재설정
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        setIsUserScrolling(false);
        setClickedId(null);
        updateActiveHeading(); // 스크롤이 멈추면 현재 위치에 맞게 업데이트
      }, 300); // 300ms 동안 스크롤이 없으면 멈춘 것으로 간주

      rafId = requestAnimationFrame(() => {
        updateActiveHeading();
        rafId = null;
      });
    };

    // 초기 상태 설정
    updateActiveHeading();

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
      }
    };
  }, [headings, clickedId, isUserScrolling, getHeaderHeight]);

  // URL 해시 처리
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && headings.some((h) => h.id === hash)) {
      // setActiveId(hash); 제거 - 스크롤 이벤트가 자연스럽게 처리하도록
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
      // 즉시 하이라이팅 활성화
      setClickedId(id);
      setActiveId(id);
      
      // URL 해시 업데이트
      window.history.pushState(null, "", `#${id}`);

      // 부드러운 스크롤 - 헤더 높이 고려
      const scrollOffset = getHeaderHeight() + 20;
      // getBoundingClientRect를 사용하여 정확한 위치 계산
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const targetPosition = absoluteTop - scrollOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }, [getHeaderHeight]);

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
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h2 className="text-base 2xl:text-lg font-semibold mb-3 sm:mb-4 md:mb-5 px-2 sm:px-3 pb-2 border-b border-border/50 flex items-center justify-between transition-colors">
          <div className="flex items-center">
            <span className="w-1 h-4 bg-primary rounded-full mr-2 opacity-60" />
            목차
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-accent rounded-md transition-colors"
            aria-label={isExpanded ? "목차 접기" : "목차 펼치기"}
            aria-expanded={isExpanded}
          >
            <svg
              className={cn(
                "w-4 h-4 transition-transform text-muted-foreground",
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
        </h2>

        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden px-1 sm:px-2"
        >
          <ul role="list" className="space-y-1">
            {headings.map((heading, index) => {
              const isActive = heading.id === activeId;

              return (
                <motion.li
                  key={heading.id}
                  role="listitem"
                  style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  className="relative"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="toc-active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  <button
                    onClick={() => handleClick(heading.id)}
                    onKeyDown={(e) => handleKeyDown(e, heading.id)}
                    className={cn(
                      "block w-full text-left text-sm py-0.5 px-2.5 rounded-md transition-all duration-200 relative overflow-hidden group",
                      isActive
                        ? "text-primary bg-primary/10 font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-primary"
                    )}
                    role="link"
                    aria-current={isActive ? "location" : undefined}
                    aria-label={`${heading.text}로 이동`}
                  >
                    <span className="relative line-clamp-2">{heading.text}</span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        {/* 진행률 표시기 */}
        <div className="mt-4 mx-1 sm:mx-2 h-0.5 bg-border/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary/60"
            initial={{ width: "0%" }}
            animate={{
              width: activeId
                ? `${((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100}%`
                : "0%",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </nav>
  );
}
