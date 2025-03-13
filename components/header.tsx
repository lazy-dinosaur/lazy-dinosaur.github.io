"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Search, Menu, ChevronLeft } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { disassemble } from "es-hangul";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import Link from "next/link";
import { Command } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { usePosts } from "@/contexts/posts-context";
import { motion } from "framer-motion";
import { Post } from "@/lib/posts";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");
  const { posts } = usePosts();

  // 뒤로가기 버튼이 필요한 페이지인지 확인하는 로직
  const isPostPage = pathname?.startsWith("/posts/");
  const isProjectDetailPage =
    pathname === "/projects" &&
    typeof window !== "undefined" &&
    window.location.search.includes("project=");

  // 뒤로가기 버튼이 필요한 페이지인지 확인
  const shouldShowBackButton = isPostPage || isProjectDetailPage;

  // 검색 입력시 항상 전체 탭으로 초기화
  useEffect(() => {
    setActiveTab("전체");
  }, [searchQuery]);

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 30px 이상 스크롤했을 때만 동작 (모바일에서는 더 빨리 반응하도록)
      if (currentScrollY > 30) {
        // 이전 스크롤 위치보다 아래로 스크롤하면 헤더 숨김
        // 이전 스크롤 위치보다 위로 스크롤하면 헤더 표시
        setHeaderVisible(prevScrollY > currentScrollY);
      } else {
        // 상단 근처에서는 항상 헤더 표시
        setHeaderVisible(true);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);
  // 검색 로직을 함수로 분리
  const searchInPosts = (
    query: string,
    posts: Post[],
    options: {
      searchInTitle?: boolean;
      searchInContent?: boolean;
      searchInTags?: boolean;
    } = {
      searchInTitle: true,
      searchInContent: true,
      searchInTags: true,
    },
  ) => {
    if (!query.trim()) return [];

    // 검색어 소문자 변환
    const lowerQuery = query.toLowerCase();

    // 검색어 자모 분리
    const decomposedQuery = disassemble(lowerQuery);

    return posts.filter((post) => {
      // 포스트 제목과 내용
      const title = post.title.toLowerCase();
      const content = post.plainContent.toLowerCase();
      let matches = false;

      // 1. 제목 검색
      if (options.searchInTitle) {
        // 1.1 간단한 부분 문자열 검색
        if (title.includes(lowerQuery)) {
          matches = true;
        }

        // 1.2 단어 시작 부분 검색 (예: '개'로 검색하면 '개인'이 매칭됨)
        if (!matches) {
          const titleWords = title.split(/\s+/);
          for (const word of titleWords) {
            if (word.startsWith(lowerQuery)) {
              matches = true;
              break;
            }
          }
        }

        // 1.3 자모음 분리 검색 (제목)
        if (!matches && /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(lowerQuery)) {
          const decomposedTitle = disassemble(title);
          if (decomposedTitle.includes(decomposedQuery)) {
            matches = true;
          }
        }
      }

      // 2. 내용 검색
      if (!matches && options.searchInContent) {
        // 2.1 간단한 부분 문자열 검색
        if (content.includes(lowerQuery)) {
          matches = true;
        }

        // 2.2 단어 시작 부분 검색
        if (!matches) {
          const contentWords = content.split(/\s+/);
          for (const word of contentWords) {
            if (word.startsWith(lowerQuery)) {
              matches = true;
              break;
            }
          }
        }

        // 2.3 자모음 분리 검색 (내용)
        if (!matches && /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(lowerQuery)) {
          const decomposedContent = disassemble(content);
          if (decomposedContent.includes(decomposedQuery)) {
            matches = true;
          }
        }
      }

      // 3. 태그 검색
      if (!matches && options.searchInTags) {
        for (const tag of post.tags) {
          const lowerTag = tag.toLowerCase();

          // 3.1 단순 부분 문자열 검색
          if (lowerTag.includes(lowerQuery)) {
            matches = true;
            break;
          }

          // 3.2 자모음 분리 검색 (태그)
          if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(lowerQuery)) {
            const decomposedTag = disassemble(lowerTag);
            if (decomposedTag.includes(decomposedQuery)) {
              matches = true;
              break;
            }
          }
        }
      }

      return matches;
    });
  };

  // 전체 검색 결과
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    return searchInPosts(searchQuery, posts);
  }, [searchQuery, posts]);

  // 제목 검색 결과
  const titleFilteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchInPosts(searchQuery, posts, {
      searchInTitle: true,
      searchInContent: false,
      searchInTags: false,
    });
  }, [searchQuery, posts]);

  // 내용 검색 결과
  const contentFilteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchInPosts(searchQuery, posts, {
      searchInTitle: false,
      searchInContent: true,
      searchInTags: false,
    });
  }, [searchQuery, posts]);

  // 태그 검색 결과
  const tagFilteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchInPosts(searchQuery, posts, {
      searchInTitle: false,
      searchInContent: false,
      searchInTags: true,
    });
  }, [searchQuery, posts]);

  // 현재 탭에 따른 검색 결과 반환
  const getCurrentPosts = () => {
    switch (activeTab) {
      case "제목":
        return titleFilteredPosts;
      case "내용":
        return contentFilteredPosts;
      case "태그":
        return tagFilteredPosts;
      default:
        return filteredPosts;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { theme, setTheme } = useTheme();

  if (!isClient) return null;

  return (
    <motion.header
      className={cn(
        `fixed top-0 w-full h-14 sm:h-16 md:h-18 flex items-center justify-center z-20 border-border/40 backdrop-blur-lg bg-background/80`,
      )}
      initial={{ y: -100 }}
      animate={{
        y: headerVisible ? 0 : -100,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.2,
      }}
    >
      <div className="flex items-center justify-between py-2 px-4 md:px-6 w-full max-w-screen-2xl">
        <div className="flex items-center gap-2">
          {/* 포스트 페이지나 프로젝트 상세 페이지일 때만 뒤로가기 버튼 표시 */}
          {shouldShowBackButton && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                aria-label="뒤로가기"
              >
                <ChevronLeft className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
                <span className="sr-only">Back</span>
              </Button>
            </motion.div>
          )}
          <Link href="/">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05, rotate: 1.5 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
                duration: 0.2,
              }}
            >
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-2 sm:mr-3 rounded-full overflow-hidden">
                <Image
                  src="/lazydino-logo3.png"
                  alt="lazydino.dev"
                  className="h-full w-full object-cover"
                  width={160}
                  height={160}
                  priority
                />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors duration-300 hidden sm:block">
                {`Lazydino's DevLog`}
              </span>
            </motion.div>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 30 }}
            whileTap={{ scale: 0.95, rotate: -10 }}
            initial={false}
            className="flex items-center"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // 테마 직접 변경
                setTheme(theme === "light" ? "dark" : "light");
              }}
              className="relative overflow-hidden rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 
                border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary group"
              aria-label="Toggle theme"
            >
              {/* 배경 효과 */}
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></span>

              {/* 테마 전환 아이콘 - 개선된 애니메이션 */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={{
                  rotate: theme === "dark" ? -180 : 0,
                }}
                transition={{
                  duration: 0.25, // 더 빠른 회전
                  ease: "easeOut", // 더 간단한 이징 함수 사용
                }}
              >
                {/* 아이콘을 상황에 따라 렌더링하는 대신 두 아이콘을 항상 표시하고 불투명도 조정 */}
                <motion.div
                  initial={false}
                  animate={{ opacity: theme === "light" ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: "absolute" }}
                >
                  <Sun className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: theme === "dark" ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: "absolute" }}
                >
                  <Moon className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
                </motion.div>
              </motion.div>
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: [0, -3, 3, -2, 2, 0],
              transition: {
                rotate: { repeat: Infinity, duration: 0.8, ease: "easeInOut" },
                scale: { duration: 0.2 },
              },
            }}
            whileTap={{ scale: 0.95, rotate: 0 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpen(true)}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
            >
              <Search className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem] transition-all duration-300" />
              <span className="sr-only">Search</span>
            </Button>
          </motion.div>

          {/* 사이드바가 숨겨질 때만 사이드바 버튼 표시 (xl 브레이크포인트 이하에서) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center bg-primary/10 text-primary xl:hidden"
            onClick={() => document.getElementById("sidebar-trigger")?.click()}
            aria-label="사이드바 메뉴"
          >
            <Menu className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
          </motion.button>
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle hidden={true}></DialogTitle>
          <DialogDescription hidden={true}></DialogDescription>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search posts... (Ctrl + K)"
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1 border-none shadow-none focus:ring-0 text-sm sm:text-base focus:outline-none placeholder:text-muted-foreground/70"
              autoFocus
            />

            {/* 검색 결과 탭 추가 */}
            {searchQuery.trim() !== "" && (
              <div className="border-b border-border/40 mt-1">
                <div className="flex overflow-x-auto px-2 py-1 sm:px-3 sm:py-2 gap-2 sm:gap-3">
                  {["전체", "제목", "내용", "태그"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap
                        ${
                          activeTab === tab
                            ? "bg-primary/10 text-primary border border-primary/30"
                            : "bg-background hover:bg-secondary/20 border border-transparent"
                        }`}
                    >
                      {tab}
                      {tab === "전체" &&
                        filteredPosts.length > 0 &&
                        ` (${filteredPosts.length})`}
                      {tab === "제목" &&
                        titleFilteredPosts.length > 0 &&
                        ` (${titleFilteredPosts.length})`}
                      {tab === "내용" &&
                        contentFilteredPosts.length > 0 &&
                        ` (${contentFilteredPosts.length})`}
                      {tab === "태그" &&
                        tagFilteredPosts.length > 0 &&
                        ` (${tagFilteredPosts.length})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ScrollArea className="h-full max-h-[50vh] sm:max-h-[300px]">
              <CommandList className="px-2 py-3 max-h-full">
                <CommandEmpty className="py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, 0] }}
                      transition={{ duration: 0.5, type: "spring" }}
                      className="text-muted-foreground/50 text-xl mb-2"
                    >
                      😕
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      No results found.
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Try searching with different keywords
                    </p>
                  </div>
                </CommandEmpty>

                <CommandGroup
                  heading={
                    getCurrentPosts().length > 0
                      ? `${activeTab} 검색 결과 (${getCurrentPosts().length})`
                      : "Posts"
                  }
                  className="text-xs font-medium text-primary/80 px-2"
                >
                  {getCurrentPosts().map((post) => (
                    <CommandItem
                      key={post.urlPath}
                      value={`${post.title} ${disassemble(post.title)} ${post.tags.join(" ")}`}
                      onSelect={() => {
                        router.push(`/posts/${post.urlPath}`);
                        setOpen(false);
                      }}
                      className="cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary rounded-md mb-1 border border-transparent hover:border-border/40"
                    >
                      <div className="py-1 sm:py-2">
                        <h3 className="text-sm sm:text-base font-medium">
                          {(() => {
                            const lowerText = post.title;
                            const lowerQuery = searchQuery.toLowerCase();
                            const exactIndex = lowerText
                              .toLowerCase()
                              .indexOf(lowerQuery);
                            if (exactIndex !== -1) {
                              return (
                                <>
                                  {lowerText.slice(0, exactIndex)}
                                  <mark className="bg-yellow-200/30">
                                    {lowerText.slice(
                                      exactIndex,
                                      exactIndex + searchQuery.length,
                                    )}
                                  </mark>
                                  {lowerText.slice(
                                    exactIndex + searchQuery.length,
                                  )}
                                </>
                              );
                            }
                            return post.title;
                          })()}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                          {(() => {
                            // 먼저 요약(summary)에서 검색
                            const lowerSummary = post.summary.toLowerCase();
                            const lowerQuery = searchQuery.toLowerCase();
                            const summaryIndex =
                              lowerSummary.indexOf(lowerQuery);

                            if (summaryIndex !== -1) {
                              return (
                                <>
                                  {post.summary.slice(0, summaryIndex)}
                                  <mark className="bg-yellow-200/30">
                                    {post.summary.slice(
                                      summaryIndex,
                                      summaryIndex + searchQuery.length,
                                    )}
                                  </mark>
                                  {post.summary.slice(
                                    summaryIndex + searchQuery.length,
                                  )}
                                </>
                              );
                            }

                            // 요약에 없으면 본문(content)에서 검색
                            const lowerContent =
                              post.plainContent.toLowerCase();
                            const contentIndex =
                              lowerContent.indexOf(lowerQuery);

                            if (contentIndex !== -1) {
                              // 검색 결과 주변 텍스트 추출 (앞뒤 30자)
                              const start = Math.max(0, contentIndex - 30);
                              const end = Math.min(
                                lowerContent.length,
                                contentIndex + searchQuery.length + 30,
                              );
                              const beforeMatch = post.plainContent.slice(
                                start,
                                contentIndex,
                              );
                              const match = post.plainContent.slice(
                                contentIndex,
                                contentIndex + searchQuery.length,
                              );
                              const afterMatch = post.plainContent.slice(
                                contentIndex + searchQuery.length,
                                end,
                              );

                              return (
                                <>
                                  {start > 0 ? "..." : ""}
                                  {beforeMatch}
                                  <mark className="bg-yellow-200/30">
                                    {match}
                                  </mark>
                                  {afterMatch}
                                  {end < post.plainContent.length ? "..." : ""}
                                </>
                              );
                            }

                            // 단어 시작 부분 검색 결과
                            const words = post.plainContent.split(/\s+/);
                            for (let i = 0; i < words.length; i++) {
                              if (
                                words[i].toLowerCase().startsWith(lowerQuery)
                              ) {
                                const wordIndex = post.plainContent.indexOf(
                                  words[i],
                                );
                                if (wordIndex !== -1) {
                                  // 단어 주변 텍스트 추출
                                  const start = Math.max(0, wordIndex - 30);
                                  const end = Math.min(
                                    post.plainContent.length,
                                    wordIndex + words[i].length + 30,
                                  );
                                  const beforeMatch = post.plainContent.slice(
                                    start,
                                    wordIndex,
                                  );
                                  const match = post.plainContent.slice(
                                    wordIndex,
                                    wordIndex + lowerQuery.length,
                                  );
                                  const afterMatch = post.plainContent.slice(
                                    wordIndex + lowerQuery.length,
                                    wordIndex + words[i].length,
                                  );
                                  const remaining = post.plainContent.slice(
                                    wordIndex + words[i].length,
                                    end,
                                  );

                                  return (
                                    <>
                                      {start > 0 ? "..." : ""}
                                      {beforeMatch}
                                      <mark className="bg-yellow-200/30">
                                        {match}
                                      </mark>
                                      {afterMatch}
                                      {remaining}
                                      {end < post.plainContent.length
                                        ? "..."
                                        : ""}
                                    </>
                                  );
                                }
                              }
                            }

                            // 자모 검색 결과 (검색 결과가 있지만 정확한 위치를 찾기 어려움)
                            if (
                              /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(lowerQuery) &&
                              disassemble(lowerContent).includes(
                                disassemble(lowerQuery),
                              )
                            ) {
                              // 본문 앞부분 일부 표시 (100자)
                              return `${post.plainContent.slice(0, 100)}...`;
                            }

                            // 검색 결과가 없으면 요약 반환
                            return post.summary;
                          })()}
                        </p>
                        <div className="mt-1 flex gap-2">
                          {post.tags.map((tag) => {
                            const lowerTag = tag.toLowerCase();
                            const lowerQuery = searchQuery.toLowerCase();
                            const exactIndex = lowerTag.indexOf(lowerQuery);
                            if (exactIndex !== -1) {
                              return (
                                <Badge
                                  key={tag}
                                  className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                                >
                                  #{tag.slice(0, exactIndex)}
                                  <mark className="bg-yellow-200/30">
                                    {tag.slice(
                                      exactIndex,
                                      exactIndex + searchQuery.length,
                                    )}
                                  </mark>
                                  {tag.slice(exactIndex + searchQuery.length)}
                                </Badge>
                              );
                            }
                            return (
                              <Badge
                                key={tag}
                                className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                              >
                                #{tag}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
        </CommandDialog>
      </div>
    </motion.header>
  );
}
