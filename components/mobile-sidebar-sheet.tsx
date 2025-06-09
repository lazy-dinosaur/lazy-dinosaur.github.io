"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import TableOfContents from "@/components/table-of-contents";
import type { TOCItem } from "@/components/table-of-contents";
import { List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePosts } from "@/contexts/posts-context";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SidebarSection } from "./sidebar-section";
import { cn } from "@/lib/utils";

interface MobileSidebarSheetProps {
  headings: TOCItem[];
}

export function MobileSidebarSheet({ headings }: MobileSidebarSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/posts/");

  useEffect(() => {
    // 헤딩이 없으면 표시 안함
    if (headings.length === 0 && isPostPage) {
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
  }, [headings.length, isPostPage]);

  if (headings.length === 0 && isPostPage) return null;

  return (
    <>
      <AnimatePresence>
        {/* 플로팅 버튼 */}
        {isVisible && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed rounded-full p-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-40 right-6 xl:hidden"
            aria-label="사이드바 열기"
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
          className="h-[70vh] rounded-t-2xl overflow-hidden"
        >
          <SheetHeader className="mb-4">
            <SheetTitle>메뉴</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-4rem)] overflow-y-auto custom-scrollbar">
            {/* 포스트 페이지에서만 목차 표시 */}
            {isPostPage && headings.length > 0 && (
              <div className="mb-6">
                <TableOfContents
                  headings={headings}
                  onItemClick={() => setIsOpen(false)}
                  className="h-auto"
                />
              </div>
            )}
            
            {/* 최근 게시물 */}
            <SidebarSection title="최근 게시물">
              <RecentPosts onItemClick={() => setIsOpen(false)} />
            </SidebarSection>

            {/* 인기 태그 */}
            <SidebarSection title="인기 태그">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 px-1.5">
                <PopularTags />
              </div>
            </SidebarSection>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// 최근 게시물 컴포넌트
function RecentPosts({ onItemClick }: { onItemClick?: () => void }) {
  const { posts } = usePosts();
  const pathname = usePathname();
  const recentPosts = posts.slice(0, 5);
  const isInsidePostPage = pathname.startsWith("/posts/");

  return (
    <div className="space-y-2">
      {recentPosts.map((post) => {
        const isActive = isInsidePostPage && pathname === `/posts/${post.urlPath}`;
        
        return (
          <Link
            key={post.urlPath}
            href={`/posts/${post.urlPath}`}
            onClick={onItemClick}
            className={cn(
              "block text-sm transition-all duration-200 line-clamp-1 py-0.5 px-2.5 rounded-md relative overflow-hidden",
              isActive
                ? "text-primary bg-primary/10 font-medium"
                : "hover:bg-accent hover:text-primary"
            )}
          >
            {isActive && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}
            <span className="relative">{post.title}</span>
          </Link>
        );
      })}
    </div>
  );
}

// 인기 태그 컴포넌트
function PopularTags() {
  const { posts } = usePosts();
  
  // 태그 빈도수 계산
  const tagCount: Record<string, number> = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  // 빈도수로 정렬하여 상위 10개 태그 선택
  const sortedTags = Object.entries(tagCount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10)
    .map(([tag]) => tag);

  return (
    <>
      {sortedTags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="text-xs hover:bg-primary hover:text-primary-foreground px-1.5 py-0.5"
        >
          #{tag}
        </Badge>
      ))}
    </>
  );
}