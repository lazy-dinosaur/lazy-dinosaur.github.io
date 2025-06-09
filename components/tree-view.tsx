"use client";
import { ChevronRight, Folder, File } from "lucide-react";
import { cn, FolderStructure } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TreeViewProps {
  data: FolderStructure[];
  level?: number;
  parentPath?: string;
  onNodeClick?: () => void;
}

export const TreeView = memo(function TreeView({
  data,
  level = 0,
  parentPath = "",
  onNodeClick
}: TreeViewProps) {
  // 콜백 최적화
  const handleNodeClick = useCallback(() => {
    onNodeClick?.();
  }, [onNodeClick]);

  return (
    <div className="space-y-0.5">
      {data.map((item) => (
        <TreeNode
          key={item.urlPath || item.name}
          node={item}
          level={level}
          parentPath={parentPath}
          onNodeClick={handleNodeClick}
        />
      ))}
    </div>
  );
});

const TreeNode = memo(function TreeNode({
  node,
  level,
  parentPath,
  onNodeClick,
}: {
  node: FolderStructure;
  level: number;
  parentPath: string;
  onNodeClick: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // 메모이제이션으로 경로 계산 최적화
  const paths = useMemo(() => {
    const decodedPath = decodeURIComponent(pathname);
    const urlPath = node.urlPath || "";
    const normalizedPath = `/posts/${urlPath}`;

    // 더 정확한 경로 매칭
    const isFileActive = node.type === "file" && decodedPath === normalizedPath;
    const isFolderActive = node.type === "folder" && decodedPath.startsWith(`${normalizedPath}/`);
    const shouldAutoExpand = isFolderActive ||
      (node.children?.some(child =>
        decodedPath === `/posts/${child.urlPath}` ||
        decodedPath.startsWith(`/posts/${child.urlPath}/`)
      ) ?? false);

    return { isFileActive, isFolderActive, shouldAutoExpand, normalizedPath };
  }, [pathname, node]);

  // 자동 확장 처리
  useEffect(() => {
    if (paths.shouldAutoExpand && !isExpanded) {
      setIsExpanded(true);
    }
  }, [paths.shouldAutoExpand, isExpanded]);

  // 토글 핸들러
  const handleToggle = useCallback(() => {
    if (node.type === "folder") {
      setIsExpanded(prev => !prev);
    }
  }, [node.type]);

  // 스타일 계산
  const paddingLeft = level * 16; // px 문자열 대신 숫자로
  const linkClassName = cn(
    "flex items-center gap-2 text-sm font-medium transition-colors duration-150",
    "w-full p-1.5 rounded-md relative",
    "hover:bg-accent/50",
    (paths.isFileActive || paths.isFolderActive) && "bg-primary/10 text-primary font-semibold"
  );

  return (
    <motion.div
      style={{ paddingLeft }}
      className="relative"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay: level * 0.02 }}
    >
      {node.type === "file" ? (
        <Link
          href={paths.normalizedPath}
          className={linkClassName}
          onClick={onNodeClick}
          title={node.name}
        >
          {paths.isFileActive && (
            <motion.span
              className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
              layoutId={`active-indicator-${node.urlPath}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="truncate">{node.name}</span>
        </Link>
      ) : (
        <>
          <button
            className={linkClassName}
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? '닫기' : '열기'} ${node.name} 폴더`}
            title={node.name}
          >
            {paths.isFolderActive && (
              <motion.span
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                layoutId={`active-indicator-${node.urlPath}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
            <Folder className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="truncate">{node.name}</span>
          </button>

          <AnimatePresence initial={false}>
            {node.children && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-0.5">
                  <TreeView
                    data={node.children}
                    level={level + 1}
                    parentPath={parentPath}
                    onNodeClick={onNodeClick}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
});
