import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "@/lib/posts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FolderStructure {
  name: string;
  type: "folder" | "file";
  children?: FolderStructure[];
  urlPath?: string;
}

// 파일이 비디오인지 확인하는 함수
export function isVideoFile(url: string): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
  const lowercaseUrl = url.toLowerCase();
  
  // URL에 확장자가 없는 경우(예: "/video/my-video")
  if (!lowercaseUrl.includes('.')) {
    // 비디오 관련 키워드 검사
    const videoKeywords = ['video', 'mp4', 'webm'];
    return videoKeywords.some(keyword => lowercaseUrl.includes(keyword));
  }
  
  return videoExtensions.some(ext => lowercaseUrl.endsWith(ext));
}

// 파일이 GIF인지 확인하는 함수
export function isGifFile(url: string): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  
  // URL에 확장자가 없는 경우
  if (!lowercaseUrl.includes('.')) {
    // GIF 관련 키워드 검사
    return lowercaseUrl.includes('gif');
  }
  
  return lowercaseUrl.endsWith('.gif');
}

export function buildFolderStructure(posts: Post[]): FolderStructure[] {
  const structure: FolderStructure[] = [];
  const sortedPosts = [...posts].sort((a, b) => a.urlPath.localeCompare(b.urlPath));

  sortedPosts.forEach((post) => {
    const pathSegments = post.urlPath.split("/").filter(Boolean); // 빈 문자열 제거
    let currentLevel = structure;

    pathSegments.forEach((segment, index) => {
      const existingNode = currentLevel.find((n) => n.name === segment);

      if (!existingNode) {
        const newNode: FolderStructure = {
          name: segment,
          type: index === pathSegments.length - 1 ? "file" : "folder",
          urlPath: pathSegments.slice(0, index + 1).join("/"),
          children: index === pathSegments.length - 1 ? undefined : [],
        };
        currentLevel.push(newNode);
        if (newNode.children) {
          currentLevel = newNode.children;
        }
      } else {
        if (existingNode.children) {
          currentLevel = existingNode.children;
        }
      }
    });
  });

  // 각 레벨에서 폴더를 먼저, 파일을 나중에 정렬
  const sortStructure = (items: FolderStructure[]): FolderStructure[] => {
    return items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    }).map(item => ({
      ...item,
      children: item.children ? sortStructure(item.children) : undefined
    }));
  };

  return sortStructure(structure);
}
