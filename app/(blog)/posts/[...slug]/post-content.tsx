"use client";

import React, { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/markdown-renderer";
import { BackToHomeButton } from "@/components/post-animation";
import ScrollToTop from "@/components/scroll-to-top";
import { Post } from "@/lib/posts";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MobileSidebarSheet } from "@/components/mobile-sidebar-sheet";
import type { TOCItem } from "@/components/table-of-contents";

interface PostContentProps {
  content: string;
  publishPath: string;
  published: string;
  modified: string;
  tags: string[];
  prevPost: Post | null;
  nextPost: Post | null;
}

export default function PostContent({
  content,
  publishPath,
  published,
  modified,
  tags,
  prevPost,
  nextPost,
}: PostContentProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);

  useEffect(() => {
    const extractHeadings = () => {
      const headingElements = document.querySelectorAll("h1, h2, h3, h4");
      const items: TOCItem[] = Array.from(headingElements)
        .filter((el) => el.id && el.textContent?.trim() && el.id !== "post-title")
        .map((el) => ({
          id: el.id,
          text: el.textContent?.trim() || "",
          level: parseInt(el.tagName.substring(1)),
        }));
      setHeadings(items);
    };

    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, [content]);
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 콘텐츠 부분 */}
        <div className="lg:w-[calc(100%)]">
          <div className="min-h-[250px] sm:min-h-[300px]">
            <MarkdownRenderer
              content={content}
              publish={publishPath}
              published={published}
              modified={modified}
              tags={tags}
            />
          </div>

          {/* 이전글/다음글 네비게이션 */}
          <nav className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t">
            <div className="flex justify-between items-center ">
              {prevPost ? (
                <motion.div
                  className="w-full sm:w-auto"
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Link
                    href={`/posts/${prevPost.urlPath}`}
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <div>
                      <div className="text-xs mb-1">이전 글</div>
                      <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-[250px]">
                        {prevPost.title}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <div className="w-full sm:w-auto opacity-50">
                  <div className="flex items-center text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <div>
                      <div className="text-xs mb-1">이전 글</div>
                      <div className="text-sm font-medium">없음</div>
                    </div>
                  </div>
                </div>
              )}

              {nextPost ? (
                <motion.div
                  className="w-full sm:w-auto text-right"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Link
                    href={`/posts/${nextPost.urlPath}`}
                    className="flex items-center justify-end text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div>
                      <div className="text-xs mb-1">다음 글</div>
                      <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-[250px]">
                        {nextPost.title}
                      </div>
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              ) : (
                <div className="w-full sm:w-auto text-right opacity-50">
                  <div className="flex items-center justify-end text-muted-foreground">
                    <div>
                      <div className="text-xs mb-1">다음 글</div>
                      <div className="text-sm font-medium">없음</div>
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
          </nav>

          <BackToHomeButton />
        </div>
      </div>
      <ScrollToTop />
      <MobileSidebarSheet headings={headings} />
    </>
  );
}
