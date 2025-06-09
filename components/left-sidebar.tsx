"use client";
import { TreeView } from "@/components/tree-view";
import { usePosts } from "@/contexts/posts-context";
import { buildFolderStructure } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SidebarSection } from "./sidebar-section";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface LeftSidebarProps {
  className?: string;
}

export default function LeftSidebar({ className }: LeftSidebarProps) {
  const { posts } = usePosts();
  const pathname = usePathname();
  const folderStructure = buildFolderStructure(posts);

  // URL이 변경될 때마다 컴포넌트를 강제로 리렌더링하기 위한 key 생성
  const sidebarKey = `left-sidebar-${pathname}`;

  return (
    <>
      {/* 모바일 버전 */}

      {/* 데스크톱 버전 */}
      <motion.aside
        key={sidebarKey}
        className={cn(
          "hidden xl:block h-[calc(100vh-4rem)] sticky top-16 mt-52", // 높이와 sticky 설정 수정
          className,
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
          delay: 0.05,
        }}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="pb-6">{/* 하단 패딩을 ScrollArea 내부로 이동 */}
            {/* 네비게이션 메뉴 (데스크톱) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.1 }}
            >
              <SidebarSection title="메뉴">
                <div className="flex flex-col space-y-2 px-1 py-1">
                  <Link
                    href="/"
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname === "/"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent"
                      }`}
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
              </SidebarSection>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.1 }}
            >
              <SidebarSection title="카테고리">
                <TreeView
                  key={`desktop-tree-${pathname}`}
                  data={folderStructure}
                />
              </SidebarSection>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
