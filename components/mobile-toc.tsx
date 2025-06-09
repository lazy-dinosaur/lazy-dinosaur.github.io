"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import TableOfContents from "@/components/table-of-contents";
import type { TOCItem } from "@/components/table-of-contents";
import { List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileTableOfContentsProps {
  headings: TOCItem[];
}

export function MobileTableOfContents({ headings }: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    // 헤딩이 없으면 표시 안함
    if (headings.length === 0) {
      setIsVisible(false);
      return;
    }

    // 스크롤 시 버튼 표시/숨김 처리
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // 300px 이상 스크롤했을 때만 표시
      setIsVisible(scrollTop > 300);

      // 페이지 하단 근처인지 확인 (100px 이내)
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
      
      // 초기화 완료 표시
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings.length, isInitialized]);

  if (headings.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        {/* 플로팅 버튼 */}
        {isVisible && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed rounded-full p-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-40 right-6 xl:hidden"
            aria-label="목차 열기"
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              bottom: isAtBottom ? "14rem" : "8.5rem"
            }}
            animate={{
              opacity: 1,
              scale: 1,
              bottom: isAtBottom ? "14rem" : "8.5rem"
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
              bottom: {
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            }}
          >
            <List className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 바텀 시트 */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="bottom"
          className="h-[60vh] rounded-t-2xl"
        >
          <SheetHeader className="mb-4">
            <SheetTitle>목차</SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-hidden">
            <TableOfContents
              headings={headings}
              onItemClick={() => setIsOpen(false)}
              className="h-full"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
