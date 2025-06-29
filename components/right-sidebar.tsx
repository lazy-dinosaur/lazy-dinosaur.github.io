"use client";
import { cn } from "@/lib/utils";
import { usePosts } from "@/contexts/posts-context";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SidebarSection } from "./sidebar-section";
import TableOfContents from "@/components/table-of-contents";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, Suspense } from "react";

interface RightSidebarProps {
  className?: string;
}

const RightSidebar = ({ className }: RightSidebarProps) => {
  const pathname = usePathname();

  // 포스트 페이지인지 확인 (/posts/로 시작하는 경로)
  const isPostPage = pathname.startsWith("/posts/");

  // URL이 변경될 때마다 컴포넌트를 강제로 리렌더링하기 위한 key 생성
  const sidebarKey = `right-sidebar-${pathname}`;

  return (
    <motion.aside
      key={sidebarKey}
      className={cn(
        "hidden xl:block h-[calc(100vh-4rem)] sticky top-16 mt-52", // 높이와 sticky 설정 수정
        className,
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.15,
        ease: "easeOut",
        delay: 0.05,
      }}
    >
      {isPostPage ? (
        <motion.div
          className="mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.15 }}
        >
          <TableOfContents key={`toc-${pathname}`} />
        </motion.div>
      ) : null}
      <div className="h-full overflow-y-auto custom-scrollbar">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.15 }}
        >
          <SidebarSection title="최근 게시물">
            <RecentPosts key={`recent-posts-${pathname}`} />
          </SidebarSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.15 }}
        >
          <SidebarSection title="인기 태그">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 px-1.5">
              <Suspense fallback={<div>Loading tags...</div>}>
                <PopularTags key={`popular-tags-${pathname}`} />
              </Suspense>
            </div>
          </SidebarSection>
        </motion.div>
      </div>
    </motion.aside>
  );
};

// 최근 게시물 목록 컴포넌트
// 클라이언트 컴포넌트로 분리
const RecentPostItem = ({
  post,
  index,
  isActive,
}: {
  post: { urlPath: string; title: string };
  index: number;
  isActive: boolean;
}) => {
  // 서버/클라이언트 간 하이드레이션 불일치 방지
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      key={post.urlPath}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.1,
        delay: 0.1 + index * 0.02,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/posts/${post.urlPath}`}
        className={cn(
          "block text-sm transition-all duration-200 line-clamp-1 py-0.5 px-2.5 rounded-md relative overflow-hidden group",
          mounted && isActive
            ? "text-primary bg-primary/10 font-medium"
            : "hover:bg-accent hover:text-primary",
        )}
      >
        {/* 클라이언트 사이드 렌더링 이후에만 활성화 표시 */}
        {mounted && isActive && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
        )}
        <span className="relative">{post.title}</span>
      </Link>
    </motion.div>
  );
};

// 메인 컴포넌트
function RecentPosts() {
  const { posts } = usePosts();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 마운트 여부만 한 번 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // 최근 5개 게시물 선택
  const recentPosts = posts.slice(0, 5);

  // 현재 페이지가 특정 포스트 페이지인지 확인
  const isInsidePostPage = pathname.startsWith("/posts/");

  return (
    <div className="space-y-2 sm:space-y-3">
      {recentPosts.map((post, index) => {
        // 클라이언트 사이드 렌더링 이후에만 활성화 상태 적용
        const isActive =
          mounted && isInsidePostPage && pathname === `/posts/${post.urlPath}`;

        return (
          <RecentPostItem
            key={post.urlPath}
            post={post}
            index={index}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
}

// 개별 태그 컴포넌트
const TagItem = ({ tag, index, onClick, isSelected }: { tag: string; index: number; onClick?: () => void; isSelected?: boolean }) => {
  return (
    <motion.div
      key={tag}
      style={{ display: "inline-block" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.1,
        delay: 0.15 + index * 0.01,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.1 },
      }}
    >
      <Badge
        variant={isSelected ? "default" : "outline"}
        className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 cursor-pointer transition-colors ${
          isSelected 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-primary hover:text-primary-foreground"
        }`}
        onClick={onClick}
      >
        #{tag}
      </Badge>
    </motion.div>
  );
};

// 인기 태그 컴포넌트 (useSearchParams 사용)
function PopularTagsContent() {
  const { posts } = usePosts();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 마운트 여부만 한 번 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // useMemo를 사용하여 인기 태그 계산
  const sortedTags = useMemo(() => {
    // 태그 빈도수 계산
    const tagCount: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    // 빈도수로 정렬하여 상위 10개 태그 선택
    return Object.entries(tagCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [posts]);

  // 현재 선택된 태그들 가져오기
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  // 태그 클릭 핸들러
  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    const params = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      {mounted &&
        sortedTags.map((tag, index) => (
          <TagItem 
            key={tag} 
            tag={tag} 
            index={index} 
            onClick={() => handleTagClick(tag)}
            isSelected={selectedTags.includes(tag)}
          />
        ))}
    </>
  );
}

// Wrapper component for PopularTags to use Suspense
function PopularTags() {
  return <PopularTagsContent />;
}

export default RightSidebar;
