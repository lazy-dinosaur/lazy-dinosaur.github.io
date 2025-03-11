"use client";
import { ChevronRight, Folder, File } from "lucide-react";
import { cn, FolderStructure } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TreeViewProps {
  data: FolderStructure[];
  level?: number;
  parentPath?: string;
}

export function TreeView({ data, level = 0, parentPath = "" }: TreeViewProps) {
  return (
    <div className="space-y-1.5">
      {data.map((item) => (
        <TreeNode
          key={item.urlPath || item.name}
          node={item}
          level={level}
          parentPath={parentPath}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  level,
  parentPath,
}: {
  node: FolderStructure;
  level: number;
  parentPath: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const decodedPath = decodeURIComponent(pathname);
  const currentPath =
    node.type === "folder"
      ? `${parentPath}/${node.name}`.replace("//", "/")
      : node.urlPath || "";
  const normalizedCurrentPath = `/posts/${node.urlPath}`;
  // 정확한 매치 대신 포함 관계로 확인
  const isFileActive = decodedPath.includes(node.urlPath || "");
  const isFolderActive = decodedPath.startsWith(`${normalizedCurrentPath}/`);
  const shouldAutoExpand = decodedPath.startsWith(`/posts${currentPath}/`);

  useEffect(() => {
    if (shouldAutoExpand && !isExpanded) {
      setIsExpanded(true);
    }
  }, [shouldAutoExpand, isExpanded]);

  const paddingLeft = `${level * 12}px`;
  const linkClassName = cn(
    "flex items-center gap-1.5 text-xs 2xl:text-sm font-medium transition-all duration-200 w-full max-w-full px-2.5 py-1.5 rounded-md relative overflow-hidden",
    isFileActive || isFolderActive
      ? "text-primary bg-primary/10"
      : "hover:bg-accent hover:text-primary",
  );

  return (
    <div style={{ paddingLeft }} className="py-0.5">
      <div
        className="flex items-center rounded-md mb-1 sm:mb-1.5 relative w-full max-w-full overflow-hidden"
        onClick={() => node.type === "folder" && setIsExpanded(!isExpanded)}
      >
        {node.type === "folder" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 sm:h-8 w-6 sm:w-8 p-0 absolute left-1 z-10 opacity-80 hover:opacity-100 hover:bg-transparent"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.div>
          </Button>
        )}
        <div className="flex-1 min-w-0 max-w-full">
          {node.type === "file" ? (
            <Link href={normalizedCurrentPath} className={linkClassName}>
              {isFileActive && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
              )}
              <File
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4 mr-1.5 transition-colors",
                  isFileActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="line-clamp-1">{node.name}</span>
            </Link>
          ) : (
            <button className={linkClassName} style={{ paddingLeft: "28px" }}>
              {isFolderActive && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
              )}
              <Folder
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4 mr-1.5 transition-colors",
                  isFolderActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="line-clamp-1">{node.name}</span>
            </button>
          )}
        </div>
      </div>
      {node.children && (
        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <TreeView
            data={node.children}
            level={level + 1}
            parentPath={currentPath}
          />
        </motion.div>
      )}
    </div>
  );
}
