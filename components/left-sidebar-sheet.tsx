"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TreeView } from "./tree-view";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePosts } from "@/contexts/posts-context";
import { buildFolderStructure } from "@/lib/utils";

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
          <ScrollArea className="h-full p-3 sm:p-4">
            {/* 네비게이션 링크 추가 */}
            <div className="mb-6 px-1 sm:px-2">
              <h2 className="text-lg font-semibold mb-3">메뉴</h2>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    pathname === "/"
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
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    pathname === "/projects"
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
            <TreeView key={`mobile-tree-${pathname}`} data={folderStructure} />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
