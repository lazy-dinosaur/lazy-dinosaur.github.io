"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  // 헤딩 요소 추출
  useEffect(() => {
    // 이전 headingRefs 초기화
    headingRefs.current = new Map();
    setActiveId("");

    // h1, h2, h3, h4 + h2-, h3-, h4- 프리픽스가 있는 id도 포함하도록 쿼리 수정
    const headingElements = document.querySelectorAll("h1, h2, h3, h4");

    // 중복된 ID를 처리하기 위한 Set
    const usedIds = new Set<string>();

    const items: TOCItem[] = Array.from(headingElements)
      .filter((el) => el.id && el.textContent?.trim()) // id가 있고 내용이 비어있지 않은 헤딩만 포함
      .map((el, index) => {
        let id = el.id;
        
        // ID가 이미 사용되었으면 고유 식별자 추가
        if (usedIds.has(id)) {
          id = `${id}-${index}`;
          el.id = id; // DOM 요소의 ID도 업데이트
        }

        usedIds.add(id);

        return {
          id,
          text: el.textContent?.trim() || "",
          level: parseInt(el.tagName.substring(1)), // h1 -> 1, h2 -> 2, ...
        };
      })
      .filter(item => item.text); // 빈 텍스트를 가진 항목 제외

    setHeadings(items);

    // observerRef가 있으면 연결 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, [pathname]);

  // IntersectionObserver는 사용하지 않고 직접 스크롤 이벤트로 계산하는 방식으로 변경
  useEffect(() => {
    if (headings.length === 0) return;

    // 기존 Observer가 있으면 연결 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // 헤딩 참조 초기화
    headingRefs.current.clear();

    // 콘솔에 디버그 정보 출력
    console.log(`Table of Contents: ${headings.length} headings found`);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [headings, pathname]);

  // 스크롤 이벤트 핸들러
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  // 스크롤 이벤트 감지
  useEffect(() => {
    // 문서가 완전히 로드되었는지 확인
    if (typeof window === "undefined") return;

    // 직접 요소의 가시성을 계산하는 함수
    const calculateVisibility = () => {
      // 현재 문서에 존재하는 모든 헤딩 요소 선택 (h1은 제목이므로 제외)
      // 새로운 h2-, h3-, h4- 프리픽스가 있는 id도 가져오도록 수정
      const headingElements = Array.from(
        document.querySelectorAll("h2, h3, h4"),
      ).filter((el) => 
        el.id && 
        el.id !== "post-title" && 
        el.textContent?.trim()
      );

      if (headingElements.length === 0) return;

      // 화면의 상단에서 어느 정도 아래 위치한 영역을 활성 영역으로 간주
      // 이렇게 하면 스크롤 시 현재 읽고 있는 섹션이 활성화됨
      const activeZoneTop = 100; // 화면 상단에서 100px 아래 위치
      const activeZoneBottom = 300; // 화면 상단에서 300px 아래 위치

      // 현재 활성 영역에 있는 헤딩 찾기
      let activeHeading = null;
      let closestHeadingAbove = null;
      let closestDistanceAbove = Number.MAX_SAFE_INTEGER;

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();

        // 활성 영역 내에 있는 헤딩
        if (rect.top <= activeZoneBottom && rect.bottom >= activeZoneTop) {
          activeHeading = el;
          break;
        }

        // 활성 영역보다 위에 있는 가장 가까운 헤딩 찾기
        if (rect.bottom < activeZoneTop) {
          const distance = activeZoneTop - rect.bottom;
          if (distance < closestDistanceAbove) {
            closestDistanceAbove = distance;
            closestHeadingAbove = el;
          }
        }
      }

      // 활성 영역에 헤딩이 있으면 그것을 활성화
      if (activeHeading) {
        setActiveId(activeHeading.id);
      }
      // 없으면 활성 영역 위에 있는 가장 가까운 헤딩 활성화
      else if (closestHeadingAbove) {
        setActiveId(closestHeadingAbove.id);
      }
      // 둘 다 없으면 첫 번째 헤딩 활성화
      else if (headingElements.length > 0) {
        setActiveId(headingElements[0].id);
      }
    };

    // 스로틀링 함수 구현
    function throttle<T extends (...args: unknown[]) => unknown>(
      fn: T,
      delay: number,
    ): (...args: Parameters<T>) => ReturnType<T> | undefined {
      let lastCall = 0;

      return function (...args: Parameters<T>): ReturnType<T> | undefined {
        const now = new Date().getTime();
        if (now - lastCall < delay) return undefined;
        lastCall = now;
        return fn(...args) as ReturnType<T>;
      };
    }

    // 스로틀된 스크롤 핸들러
    const handleScroll = throttle(() => {
      requestAnimationFrame(calculateVisibility);
    }, 100); // 100ms마다 최대 한 번만 실행

    window.addEventListener("scroll", handleScroll);

    // 초기 로딩 시 한 번 실행하여 현재 보이는 요소 표시
    setTimeout(calculateVisibility, 300);

    // 추가: 윈도우 리사이즈 시에도 계산
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("toc w-full", className)}>
      <div className="pt-2 pb-4">
        <h4 className="text-hierarchy-h4 mb-4">목차</h4>
        <nav className="toc">
          <ul className="space-y-1 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                className={cn(
                  "border-l-2 pl-2 py-1 transition-colors duration-200",
                  heading.id === activeId
                    ? "border-primary text-primary font-medium"
                    : "border-muted hover:border-primary/50 text-muted-foreground hover:text-foreground",
                )}
              >
                <button
                  onClick={() => handleClick(heading.id)}
                  className="block w-full text-left hover:text-primary transition-colors"
                >
                  {heading.id === activeId && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute left-0 w-0.5 h-5 bg-primary rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 600,
                        damping: 35,
                        duration: 0.1
                      }}
                    />
                  )}
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
