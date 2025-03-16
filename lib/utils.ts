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
  return videoExtensions.some(ext => lowercaseUrl.endsWith(ext));
}

// 파일이 GIF인지 확인하는 함수
export function isGifFile(url: string): boolean {
  if (!url) return false;
  return url.toLowerCase().endsWith('.gif');
}

export function buildFolderStructure(posts: Post[]): FolderStructure[] {
  const structure: FolderStructure[] = [];

  posts.forEach((post) => {
    const pathSegments = post.urlPath.split("/");
    let currentLevel = structure;

    pathSegments.forEach((segment, index) => {
      const existingNode = currentLevel.find((n) => n.name === segment);

      if (!existingNode) {
        const newNode: FolderStructure = {
          name: segment,
          type: index === pathSegments.length - 1 ? "file" : "folder",
          urlPath: pathSegments.slice(0, index + 1).join("/"),
          children: [],
        };
        currentLevel.push(newNode);
        currentLevel = newNode.children!;
      } else {
        currentLevel = existingNode.children || [];
      }
    });
  });

  return structure;
}
