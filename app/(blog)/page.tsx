"use client";
import PostCard from "@/components/post-card";
import { HeaderSection, PostGrid, PostItem } from "@/components/home-animation";
import { usePosts } from "@/contexts/posts-context";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// 페이지당 포스트 수 정의
const POSTS_PER_PAGE = 8;

export default function Home() {
  const { posts } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState([]);
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
  const goToPage = (page) => {
    setCurrentPage(page);
    // 페이지 상단으로 부드럽게 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 페이지네이션 UI에 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // 최대 표시할 페이지 버튼 수
    
    if (totalPages <= maxPageButtons) {
      // 전체 페이지가 최대 버튼 수보다 적으면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 앞뒤로 표시할 페이지 수 계산
      const halfButtons = Math.floor(maxPageButtons / 2);
      
      // 시작 페이지와 끝 페이지 계산
      let startPage = Math.max(1, currentPage - halfButtons);
      let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      
      // 끝 페이지가 totalPages를 초과하지 않도록 조정
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
      
      // 시작 페이지가 1이 아니면 첫 페이지와 줄임표 추가
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push("...");
      }
      
      // 중간 페이지들 추가
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // 끝 페이지가 totalPages가 아니면 줄임표와 마지막 페이지 추가
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push("...");
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

      {/* 페이지네이션 UI */}
      {totalPages > 1 && (
        <motion.div 
          className="flex justify-center items-center gap-2 mt-8 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 이전 페이지 버튼 */}
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-3"
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
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>

          {/* 페이지 번호 버튼들 */}
          {getPageNumbers().map((pageNum, index) => (
            pageNum === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <Button
                key={`page-${pageNum}`}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => goToPage(pageNum)}
                className="w-10 h-10"
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
            className="px-3"
            aria-label="다음 페이지"
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
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Button>
        </motion.div>
      )}

      {/* 현재 페이지 정보 */}
      <div className="text-center text-sm text-muted-foreground">
        {posts.length > 0 ? (
          <p>총 {posts.length}개의 포스트 중 {(currentPage - 1) * POSTS_PER_PAGE + 1}-{Math.min(currentPage * POSTS_PER_PAGE, posts.length)}번째 포스트</p>
        ) : (
          <p>포스트가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
