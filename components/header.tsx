"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

// 디바운스 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 검색 인덱스 타입
interface SearchIndex {
  id: string;
  title: string;
  titleLower: string;
  titleDecomposed: string;
  summary: string;
  summaryLower: string;
  tags: string[];
  tagsLower: string[];
  tagsDecomposed: string[];
}

// 검색 결과 타입
interface SearchResult {
  post: Post;
  matchedIn: Set<'title' | 'content' | 'tag'>;
  score: number;
}

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
  const { theme, setTheme } = useTheme();

  // 검색 결과 캐시
  const searchCache = useRef<Map<string, SearchResult[]>>(new Map());

  // 디바운스된 검색어
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 검색 인덱스 생성 (포스트 변경 시에만 재생성)
  const searchIndex = useMemo(() => {
    const index = new Map<string, SearchIndex>();

    posts.forEach(post => {
      const titleLower = post.title.toLowerCase();
      const summaryLower = post.summary.toLowerCase();

      index.set(post.urlPath, {
        id: post.urlPath,
        title: post.title,
        titleLower,
        titleDecomposed: disassemble(titleLower),
        summary: post.summary,
        summaryLower,
        tags: post.tags,
        tagsLower: post.tags.map(tag => tag.toLowerCase()),
        tagsDecomposed: post.tags.map(tag => disassemble(tag.toLowerCase())),
      });
    });

    return index;
  }, [posts]);

  // 포스트 맵 (빠른 조회용)
  const postMap = useMemo(() => {
    const map = new Map<string, Post>();
    posts.forEach(post => {
      map.set(post.urlPath, post);
    });
    return map;
  }, [posts]);

  // 뒤로가기 버튼이 필요한 페이지인지 확인하는 로직
  const isPostPage = pathname?.startsWith("/posts/");
  const isProjectDetailPage =
    pathname === "/projects/" &&
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

  // 최적화된 검색 함수
  const performSearch = useCallback((
    query: string,
    searchType: 'all' | 'title' | 'content' | 'tag' = 'all'
  ): SearchResult[] => {
    if (!query.trim()) return [];

    // 캐시 키 생성
    const cacheKey = `${searchType}:${query}`;

    // 캐시 확인
    if (searchCache.current.has(cacheKey)) {
      return searchCache.current.get(cacheKey)!;
    }

    const lowerQuery = query.toLowerCase();
    const decomposedQuery = disassemble(lowerQuery);
    const isKorean = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(query);

    const results: SearchResult[] = [];

    searchIndex.forEach((indexItem, postId) => {
      const matchedIn = new Set<'title' | 'content' | 'tag'>();
      let score = 0;

      // 제목 검색
      if (searchType === 'all' || searchType === 'title') {
        if (indexItem.titleLower.includes(lowerQuery)) {
          matchedIn.add('title');
          score += 10; // 제목 매칭은 높은 점수

          // 정확한 매칭은 추가 점수
          if (indexItem.titleLower === lowerQuery) {
            score += 5;
          }
        } else if (isKorean && indexItem.titleDecomposed.includes(decomposedQuery)) {
          matchedIn.add('title');
          score += 5; // 자모 매칭은 낮은 점수
        }
      }

      // 내용 검색 (summary 검색으로 변경)
      if (searchType === 'all' || searchType === 'content') {
        if (indexItem.summaryLower.includes(lowerQuery)) {
          matchedIn.add('content');
          score += 3;
        }
      }

      // 태그 검색
      if (searchType === 'all' || searchType === 'tag') {
        indexItem.tagsLower.forEach((tagLower, idx) => {
          if (tagLower.includes(lowerQuery)) {
            matchedIn.add('tag');
            score += 5;
          } else if (isKorean && indexItem.tagsDecomposed[idx].includes(decomposedQuery)) {
            matchedIn.add('tag');
            score += 3;
          }
        });
      }

      // 매칭된 경우에만 결과에 추가
      if (matchedIn.size > 0) {
        const post = postMap.get(postId);
        if (post) {
          results.push({ post, matchedIn, score });
        }
      }
    });

    // 점수순으로 정렬
    results.sort((a, b) => b.score - a.score);

    // 캐시에 저장
    searchCache.current.set(cacheKey, results);

    return results;
  }, [searchIndex, postMap]);

  // 검색 결과 가져오기 (디바운스된 검색어 사용)
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return {
        all: [],
        title: [],
        content: [],
        tag: []
      };
    }

    return {
      all: performSearch(debouncedSearchQuery, 'all'),
      title: performSearch(debouncedSearchQuery, 'title'),
      content: performSearch(debouncedSearchQuery, 'content'),
      tag: performSearch(debouncedSearchQuery, 'tag')
    };
  }, [debouncedSearchQuery, performSearch]);

  // 현재 탭에 따른 검색 결과 반환
  const getCurrentResults = useCallback(() => {
    switch (activeTab) {
      case "제목":
        return searchResults.title;
      case "내용":
        return searchResults.content;
      case "태그":
        return searchResults.tag;
      default:
        return searchResults.all;
    }
  }, [activeTab, searchResults]);

  // 하이라이트 렌더링 최적화
  const renderHighlightedText = useCallback((
    text: string,
    query: string
  ) => {
    if (!query.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-yellow-200/30">
          {text.slice(index, index + query.length)}
        </mark>
        {text.slice(index + query.length)}
      </>
    );
  }, []);

  // 검색 다이얼로그가 닫힐 때 캐시 초기화
  useEffect(() => {
    if (!open) {
      // 일정 시간 후 캐시 초기화 (메모리 절약)
      const timer = setTimeout(() => {
        searchCache.current.clear();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open]);

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
              <span className="text-base sm:text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors duration-300">
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
            className={cn(
              "rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center bg-primary/10 text-primary",
              pathname != "/projects/" ? "xl:hidden" : "",
            )}
            onClick={() => document.getElementById("sidebar-trigger")?.click()}
            aria-label="사이드바 메뉴"
          >
            <Menu className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
          </motion.button>
        </div>
        <CommandDialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setSearchQuery("");
            }
          }}
        >
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
                  {["전체", "제목", "내용", "태그"].map((tab) => {
                    const count =
                      tab === "전체" ? searchResults.all.length :
                        tab === "제목" ? searchResults.title.length :
                          tab === "내용" ? searchResults.content.length :
                            tab === "태그" ? searchResults.tag.length : 0;

                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap
                          ${activeTab === tab
                            ? "bg-primary/10 text-primary border border-primary/30"
                            : "bg-background hover:bg-secondary/20 border border-transparent"
                          }`}
                      >
                        {tab}
                        {count > 0 && ` (${count})`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <ScrollArea className="h-full max-h-[50vh] sm:max-h-[300px]">
              <CommandList className="px-2 py-3 max-h-full">
                {/* 검색어가 없을 때 */}
                {!searchQuery.trim() && (
                  <div className="py-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className="text-muted-foreground/50 text-2xl mb-3"
                    >
                      🔍
                    </motion.div>
                    <p className="text-sm text-muted-foreground font-medium">
                      검색어를 입력하세요
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      포스트 제목, 내용, 태그로 검색할 수 있습니다
                    </p>
                  </div>
                )}

                {/* 검색어가 있지만 결과가 없을 때 */}
                {searchQuery.trim() && getCurrentResults().length === 0 && (
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
                        검색 결과가 없습니다
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        다른 키워드로 검색해보세요
                      </p>
                    </div>
                  </CommandEmpty>
                )}

                {/* 검색 결과가 있을 때 */}
                {searchQuery.trim() && getCurrentResults().length > 0 && (
                  <CommandGroup
                    heading={`${activeTab} 검색 결과 (${getCurrentResults().length})`}
                    className="text-xs font-medium text-primary/80 px-2"
                  >
                    {getCurrentResults().map((result) => (
                      <CommandItem
                        key={result.post.urlPath}
                        value={`${result.post.title} ${disassemble(result.post.title)} ${result.post.tags.join(" ")}`}
                        onSelect={() => {
                          router.push(`/posts/${result.post.urlPath}`);
                          setOpen(false);
                        }}
                        className="cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary rounded-md mb-1 border border-transparent hover:border-border/40"
                      >
                        <div className="py-1 sm:py-2">
                          <h3 className="text-sm sm:text-base font-medium">
                            {renderHighlightedText(result.post.title, searchQuery)}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                            {result.matchedIn.has('content') && searchQuery ?
                              renderHighlightedText(
                                result.post.summary,
                                searchQuery
                              ) :
                              result.post.summary
                            }
                          </p>
                          <div className="mt-1 flex gap-2">
                            {result.post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                              >
                                #{result.matchedIn.has('tag') && searchQuery ?
                                  renderHighlightedText(tag, searchQuery) :
                                  tag
                                }
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </ScrollArea>
          </Command>
        </CommandDialog>
      </div>
    </motion.header>
  );
}
