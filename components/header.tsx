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

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { posts } = usePosts();

  // 뒤로가기 버튼이 필요한 페이지인지 확인하는 로직
  const isPostPage = pathname?.startsWith("/posts/");
  const isProjectDetailPage =
    pathname === "/projects" &&
    typeof window !== "undefined" &&
    window.location.search.includes("project=");

  // 뒤로가기 버튼이 필요한 페이지인지 확인
  const shouldShowBackButton = isPostPage || isProjectDetailPage;

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
  const filteredPosts = useMemo(() => {
    const cleanQuery = searchQuery.toLowerCase().replace(/\s/g, "");
    const decomposedQuery = disassemble(cleanQuery);
    return posts.filter((post) => {
      const cleanTitle = post.title.toLowerCase().replace(/\s/g, "");
      const cleanContent = post.plainContent.toLowerCase().replace(/\s/g, "");

      const exactMatch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.plainContent.toLowerCase().includes(searchQuery.toLowerCase());

      const decomposedTitle = disassemble(cleanTitle);
      const decomposedContent = disassemble(cleanContent);

      const initialMatch = [decomposedTitle, decomposedContent].some(
        (decomp) => {
          let queryIndex = 0;
          for (const c of decomp) {
            if (c === decomposedQuery[queryIndex]) queryIndex++;
            if (queryIndex === decomposedQuery.length) return true;
          }
          return false;
        },
      );

      const tagMatch = (post.tags || []).some((tag) => {
        const cleanTag = tag.toLowerCase().replace(/\s/g, "");
        return (
          tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disassemble(cleanTag).includes(decomposedQuery)
        );
      });
      return exactMatch || initialMatch || tagMatch;
    });
  }, [searchQuery, posts]);

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
        `fixed top-0 w-full h-14 sm:h-16 md:h-18 flex items-center justify-center z-20`,
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
      <div className="flex items-center justify-between py-2 px-4 md:px-6 w-full max-w-screen-2xl border-b border-border/40 backdrop-blur-lg bg-background/80 shadow-sm">
        <div className="flex items-center gap-2">
          {/* 포스트 페이지나 프로젝트 상세 페이지일 때만 뒤로가기 버튼 표시 */}
          {shouldShowBackButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center bg-primary/10 text-primary"
              onClick={() => router.back()}
              aria-label="뒤로가기"
            >
              <ChevronLeft className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
            </motion.button>
          )}
          <Link className="flex items-center group" href="/">
            <motion.div
              className="relative w-10 h-8 sm:w-12 sm:h-10 md:w-14 md:h-12 mr-2 sm:mr-3 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 25,
                duration: 0.15,
              }}
            >
              <Image
                src="/lazydino-logo3.png"
                alt="lazydino.dev"
                className="h-full w-full object-cover"
                width={80}
                height={80}
              />
            </motion.div>
            <span className="text-base sm:text-lg md:text-xl font-bold group-hover:text-primary transition-colors duration-300 hidden sm:block">
              {`Lazydino's DevLog`}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                    filteredPosts.length > 0
                      ? `Results (${filteredPosts.length})`
                      : "Posts"
                  }
                  className="text-xs font-medium text-primary/80 px-2"
                >
                  {filteredPosts.map((post) => (
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
                            const lowerQuery = searchQuery;
                            const exactIndex = lowerText
                              .toLowerCase()
                              .indexOf(lowerQuery.toLowerCase());
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
                            const lowerText = post.summary.toLowerCase();
                            const lowerQuery = searchQuery.toLowerCase();
                            const exactIndex = lowerText.indexOf(lowerQuery);
                            if (exactIndex !== -1) {
                              return (
                                <>
                                  {post.summary.slice(0, exactIndex)}
                                  <mark className="bg-yellow-200/30">
                                    {post.summary.slice(
                                      exactIndex,
                                      exactIndex + searchQuery.length,
                                    )}
                                  </mark>
                                  {post.summary.slice(
                                    exactIndex + searchQuery.length,
                                  )}
                                </>
                              );
                            }
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
                              <span
                                key={tag}
                                className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                              >
                                {tag}
                              </span>
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
