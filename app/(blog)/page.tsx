"use client";
import PostCard from "@/components/post-card";
import { HeaderSection, PostGrid, PostItem } from "@/components/home-animation";
import { usePosts } from "@/contexts/posts-context";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Post } from "@/lib/posts";

// 페이지당 포스트 수 정의
const POSTS_PER_PAGE = 6;

export default function Home() {
  // 상태 타입 정의
  const { posts } = usePosts();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // 페이지 변경 시 표시할 포스트 업데이트
  useEffect(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    // 페이지 변경 시 즉시 이전 포스트를 지우고 새 포스트를 설정
    setDisplayedPosts([]);

    // 약간의 지연 후 새 포스트 표시 (애니메이션 효과 향상)
    setTimeout(() => {
      setDisplayedPosts(posts.slice(startIndex, endIndex));
    }, 10);
  }, [currentPage, posts]);

  // 페이지 이동 함수
  const goToPage = (page: number): void => {
    setCurrentPage(page);
    // 페이지 상단으로 부드럽게 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 다음 페이지로 이동
  const goToNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 이전 페이지로 이동
  const goToPrevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 페이지네이션 UI에 표시할 페이지 번호 계산
  const getPageNumbers = (): Array<number | string> => {
    const pageNumbers: Array<number | string> = [];
    const maxPageButtons = 4; // 최대 표시할 페이지 버튼 수

    if (totalPages <= maxPageButtons) {
      // 전체 페이지가 최대 버튼 수보다 적으면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 페이지 번호 계산
      if (currentPage <= 2) {
        // 현재 페이지가 2 이하면 1~4 표시
        for (let i = 1; i <= maxPageButtons; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > maxPageButtons) {
          pageNumbers.push("...");
          pageNumbers.push(totalPages);
        }
      } else if (currentPage >= totalPages - 1) {
        // 현재 페이지가 끝에서 1번째 이내면 마지막 4개 표시
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 중간 페이지인 경우 현재 페이지 중심으로 표시
        pageNumbers.push(1);
        pageNumbers.push("...");

        // 현재 페이지 주변 표시
        if (currentPage === 3) {
          // 3페이지인 경우 2, 3, 4 표시
          pageNumbers.push(2);
          pageNumbers.push(3);
          pageNumbers.push(4);
        } else if (currentPage === totalPages - 2) {
          // 뒤에서 3번째인 경우
          pageNumbers.push(totalPages - 3);
          pageNumbers.push(totalPages - 2);
          pageNumbers.push(totalPages - 1);
        } else {
          // 그 외의 경우 현재 페이지와 주변 1개씩 표시
          pageNumbers.push(currentPage - 1);
          pageNumbers.push(currentPage);
          pageNumbers.push(currentPage + 1);
        }

        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-6 sm:space-y-8 2xl:space-y-10 h-full rounded-lg p-1 sm:p-7">
      {/* 헤더 섹션 */}
      <HeaderSection
        title="Lazydino's DevLog"
        description="내가 한걸 티내기 위해 만든 블로그"
        extraContent={
          <div className="text-muted-foreground">
            <p>세상을 게으르게 만들기 위해 발전하고 싶은 프론트엔드 개발자입니다. 🚀</p>
          </div>
        }
      />

      {/* 포스트 그리드 */}
      {displayedPosts.length > 0 ? (
        <PostGrid key={`post-grid-page-${currentPage}`}>
          {displayedPosts.map((post, index) => (
            <PostItem key={`${currentPage}-${post.urlPath}`} index={index}>
              <PostCard
                urlPath={post.urlPath}
                title={post.title}
                summary={post.summary}
                content={post.content}
                plainContent={post.plainContent}
                image={post.image}
                tags={post.tags}
                createdAt={post.createdAt}
              />
            </PostItem>
          ))}
        </PostGrid>
      ) : posts.length > 0 ? (
        <PostGrid>
          {[...Array(POSTS_PER_PAGE)].map((_, index) => (
            <PostItem key={`skeleton-${index}`} index={index}>
              <motion.div
                className="bg-card rounded-lg p-6 h-[300px] relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* 스켈레톤 효과 */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
                  <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* 스켈레톤 컨텐츠 */}
                <div className="space-y-4">
                  <div className="h-32 bg-muted/50 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded w-full animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded w-5/6 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-muted/50 rounded-full animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </PostItem>
          ))}
        </PostGrid>
      ) : null}

      {/* 페이지네이션 UI */}
      {totalPages > 1 && displayedPosts.length > 0 && (
        <motion.div
          className="flex justify-center items-center gap-1 sm:gap-2 mt-8 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 이전 페이지 버튼 */}
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 h-8 w-8 sm:h-10 sm:w-auto"
            aria-label="이전 페이지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="hidden sm:inline ml-1">이전</span>
          </Button>

          {/* 페이지 번호 버튼들 */}
          {getPageNumbers().map((pageNum, index) => (
            pageNum === "..." ? (
              <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-sm">...</span>
            ) : (
              <Button
                key={`page-${pageNum}`}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => goToPage(pageNum as number)}
                className="w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base"
                aria-label={`${pageNum}페이지로 이동`}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </Button>
            )
          ))}

          {/* 다음 페이지 버튼 */}
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 h-8 w-8 sm:h-10 sm:w-auto"
            aria-label="다음 페이지"
          >
            <span className="hidden sm:inline mr-1">다음</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </motion.div>
      )}

      {/* 현재 페이지 정보 */}
      <div className="text-center text-sm text-muted-foreground">
        {posts.length > 0 && displayedPosts.length > 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            총 {posts.length}개의 포스트 중 {(currentPage - 1) * POSTS_PER_PAGE + 1}-{Math.min(currentPage * POSTS_PER_PAGE, posts.length)}번째 포스트
          </motion.p>
        ) : posts.length > 0 ? (
          <></>
        ) : (
          <p>포스트가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
