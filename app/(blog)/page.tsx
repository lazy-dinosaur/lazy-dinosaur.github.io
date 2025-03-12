"use client";
import PostCard from "@/components/post-card";
import { HeaderSection, PostGrid, PostItem } from "@/components/home-animation";
import { usePosts } from "@/contexts/posts-context";

// Import global CSS classes for typography

export default function Home() {
  const { posts } = usePosts();
  return (
    <div className="space-y-6 sm:space-y-8 2xl:space-y-10 h-full rounded-lg p-1 sm:p-7">
      {/* 헤더 섹션 */}
      <HeaderSection
        title="Lazydino's DevLog"
        description="내가 한걸 티내기 위해 만든 블로그"
      />

      {/* 포스트 그리드 */}
      <PostGrid>
        {posts.map((post, index) => (
          <PostItem key={post.urlPath} index={index}>
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
    </div>
  );
}
