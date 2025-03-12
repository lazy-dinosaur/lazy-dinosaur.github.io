"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TreeView } from "@/components/tree-view";
import { useState } from "react";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { usePosts } from "@/contexts/posts-context";
import { buildFolderStructure } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SidebarSection } from "./sidebar-section";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface LeftSidebarProps {
  className?: string;
}

export default function LeftSidebar({ className }: LeftSidebarProps) {
  const [open, setOpen] = useState(false);
  const { posts } = usePosts();
  const pathname = usePathname();
  const folderStructure = buildFolderStructure(posts);

  // URL이 변경될 때마다 컴포넌트를 강제로 리렌더링하기 위한 key 생성
  const sidebarKey = `left-sidebar-${pathname}`;

  return (
    <>
      {/* 모바일 버전 */}
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
              <h2 className="text-lg font-semibold mb-3 sm:mb-4 px-1 sm:px-2">
                카테고리
              </h2>
              <TreeView
                key={`mobile-tree-${pathname}`}
                data={folderStructure}
              />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* 데스크톱 버전 */}
      <motion.aside
        key={sidebarKey}
        className={cn("hidden xl:block", className)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
          delay: 0.05,
        }}
      >
        <ScrollArea className="h-full">
          <SidebarSection title="카테고리">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.1 }}
            >
              <TreeView
                key={`desktop-tree-${pathname}`}
                data={folderStructure}
              />
            </motion.div>
          </SidebarSection>
        </ScrollArea>
      </motion.aside>
    </>
  );
}
