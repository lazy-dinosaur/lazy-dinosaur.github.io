"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TreeView } from "./tree-view";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePosts } from "@/contexts/posts-context";
import { buildFolderStructure } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function LeftSidebarSheet() {
  const { posts } = usePosts();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const folderStructure = buildFolderStructure(posts);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <DialogTitle hidden={true}></DialogTitle>
      <DialogDescription hidden={true}></DialogDescription>
      <SheetTrigger asChild className="hidden">
        <Button id="sidebar-trigger" variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] sm:w-[320px] md:w-[360px] p-0 pt-10 sm:pt-12"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative h-full">
          <div className="h-full p-3 sm:p-4 flex flex-col">
            <div className="flex-grow overflow-y-auto">
              {/* 네비게이션 링크 추가 */}
              <div className="mb-6 px-1 sm:px-2">
                <h2 className="text-lg font-semibold mb-3">메뉴</h2>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname === "/"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent"
                      }`}
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    홈
                  </Link>
                  <Link
                    href="/projects"
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname === "/projects"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent"
                      }`}
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                      <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                      <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    포트폴리오
                  </Link>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-3 sm:mb-4 px-1 sm:px-2">
                카테고리
              </h2>
              <TreeView
                key={`mobile-tree-${pathname}`}
                data={folderStructure}
                onNodeClick={() => setOpen(false)}
              />
              
              {/* 최근 게시물 섹션 */}
              <div className="mt-6 px-1 sm:px-2">
                <h2 className="text-lg font-semibold mb-3">최근 게시물</h2>
                <RecentPostsSection pathname={pathname} onClose={() => setOpen(false)} />
              </div>
              
              {/* 인기 태그 섹션 */}
              <div className="mt-6 px-1 sm:px-2">
                <h2 className="text-lg font-semibold mb-3">인기 태그</h2>
                <div className="flex flex-wrap gap-1.5">
                  <PopularTagsSection />
                </div>
              </div>
            </div>

            {/* 푸터 정보 */}
            <div className="py-6 border-t border-border/60">
              {/* 소셜 링크 */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <Link
                  href="https://github.com/lazy-dinosaur"
                  target="_blank"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </Link>
                <Link
                  href="mailto:lazydino1314@gmail.com"
                  target="_blank"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </Link>
                <Link
                  href="https://open.kakao.com/o/sdG4BPjh"
                  target="_blank"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.486 2 2 5.677 2 10.2c0 2.933 1.904 5.41 4.666 6.82-.193.86-.707 3.088-.73 3.266-.036.268.127.517.364.593.085.028.174.041.262.041.147 0 .291-.054.404-.155.16-.143 2.398-1.647 3.484-2.384.503.07 1.026.118 1.55.118 5.514 0 10-3.675 10-8.2C22 5.677 17.514 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              {/* 저작권 정보 */}
              <div className="text-xs text-muted-foreground text-center">
                Copyright © {new Date().getFullYear()} by Hyeongseok Woo
              </div>
              <div className="text-xs text-muted-foreground text-center mt-1">
                Built with Next.js, TypeScript, and Tailwind CSS
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// 최근 게시물 섹션 컴포넌트
function RecentPostsSection({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const { posts } = usePosts();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const recentPosts = posts.slice(0, 5);
  const isInsidePostPage = pathname.startsWith("/posts/");
  
  return (
    <div className="space-y-2">
      {recentPosts.map((post, index) => {
        const isActive = mounted && isInsidePostPage && pathname === `/posts/${post.urlPath}`;
        
        return (
          <Link
            key={post.urlPath}
            href={`/posts/${post.urlPath}`}
            onClick={onClose}
            className={`block p-2 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-accent/50"
            }`}
          >
            <div className="flex items-start gap-2">
              {isActive && (
                <div className="w-1 h-full bg-primary rounded-full mt-1" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{post.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// 인기 태그 섹션 컴포넌트
function PopularTagsSection() {
  const { posts } = usePosts();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const sortedTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [posts]);
  
  if (!mounted) return null;
  
  return (
    <>
      {sortedTags.map((tag, index) => (
        <Badge
          key={tag}
          variant="outline"
          className="text-xs hover:bg-primary hover:text-primary-foreground px-2 py-1"
        >
          #{tag}
        </Badge>
      ))}
    </>
  );
}
