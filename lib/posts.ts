import { promises as fs } from "fs";
import path from "path";
import metaData from "../public/meta-data.json";

// interface MetaData {
//   urlPath: string;
//   title: string;
//   summary: string;
//   image: string;
//   tags: string[];
//   createdAt: string;
//   modifiedAt: string;
// }

export interface Post {
  urlPath: string;
  title: string;
  summary: string;
  content: string;
  plainContent: string;
  image: string;
  tags: string[];
  series: string;
  createdAt: string;
  modifiedAt: string;
  publish: string; // publish 필드 추가 (카테고리 역할)
}

interface PostContent {
  content: string;
  plainContent: string;
}

// 최적화된 getPosts 함수 - 메타데이터만 반환하고 콘텐츠는 필요할 때 가져옴
export async function getPostsMetadata(): Promise<
  Omit<Post, "content" | "plainContent">[]
> {
  try {
    if (!metaData || metaData.length === 0) return [];

    const posts = metaData.map((item: Record<string, unknown>) => ({
      urlPath: item.urlPath as string,
      title: item.title as string,
      summary: item.summary as string,
      image: (item.image || "") as string,
      tags: (item.tags || []) as string[],
      series: (item.series || "") as string,
      createdAt: item.createdAt as string,
      modifiedAt: item.modifiedAt as string,
      publish: (item.publish || "") as string,
    }));

    // 날짜 기준으로 정렬 (최신 글이 먼저 오도록)
    return posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.error("Error loading posts metadata:", error);
    return []; // 에러 시 빈 배열 반환
  }
}

// 모든 포스트를 가져오는 함수 (하위 호환성 유지)
export async function getPosts(): Promise<Post[]> {
  try {
    const postsMetadata = await getPostsMetadata();

    const posts = await Promise.all(
      postsMetadata.map(async (metadata) => {
        try {
          const content = await getPostContent(metadata.urlPath);
          return {
            ...metadata,
            ...content,
          };
        } catch (error) {
          console.log(error);
          console.warn(`Skipping invalid post: ${metadata.urlPath}`);
          return null;
        }
      }),
    );

    return posts.filter(Boolean) as Post[];
  } catch (error) {
    console.error("Error loading posts:", error);
    return []; // 에러 시 빈 배열 반환
  }
}

// 포스트 콘텐츠만 가져오는 함수
async function getPostContent(urlPath: string): Promise<PostContent> {
  try {
    // 먼저 최적화된 JSON 콘텐츠 파일이 있는지 확인
    const contentJsonPath = path.join(
      process.cwd(),
      "public",
      "post-contents",
      `${urlPath}.json`,
    );

    try {
      // JSON 콘텐츠 파일이 있으면 그것을 사용
      await fs.access(contentJsonPath, fs.constants.F_OK);
      const contentJson = await fs.readFile(contentJsonPath, "utf8");
      return JSON.parse(contentJson);
    } catch (error) {
      console.log(error);
      // JSON 파일이 없으면 원래 MD 파일을 사용 (하위 호환성)
      const mdFilePath = path.join(
        process.cwd(),
        "content",
        "posts",
        `${urlPath}.md`,
      );

      const fileContent = await fs.readFile(mdFilePath, "utf8");

      // 프론트매터 제거 및 내용만 추출
      const content = fileContent.replace(/^---[\s\S]*?---\s*/, "");
      return {
        content,
        plainContent: extractPlainTextFromMarkdown(content),
      };
    }
  } catch (error) {
    console.error(`Error loading post content for ${urlPath}:`, error);
    throw error;
  }
}

// 이전/다음 게시물 포함하여 가져오는 함수
export async function getPost(slug: string[]): Promise<Post | null> {
  // 슬러그 유효성 검사 강화
  if (!slug || !Array.isArray(slug) || slug.length === 0) {
    return null;
  }

  const urlPath = slug.join("/").replace(/\/+/g, "/").replace(/\.md$/, "");

  try {
    // 메타데이터 타입 안전성 강화
    const postMeta = (metaData as Array<Record<string, unknown>>).find(
      (item) =>
        typeof item.urlPath === "string" &&
        item.urlPath.localeCompare(urlPath, undefined, {
          sensitivity: "base",
        }) === 0,
    );

    if (!postMeta) return null;

    // 콘텐츠 가져오기
    const content = await getPostContent(postMeta.urlPath as string);

    return {
      urlPath: postMeta.urlPath as string,
      title: postMeta.title as string,
      summary: postMeta.summary as string,
      ...content,
      image: (postMeta.image || "") as string,
      tags: (postMeta.tags || []) as string[],
      series: (postMeta.series || "") as string,
      createdAt: postMeta.createdAt as string,
      modifiedAt: postMeta.modifiedAt as string,
      publish: (postMeta.publish || "") as string,
    };
  } catch (error) {
    console.error("Error loading post:", error);
    return null; // 모든 에러 경우에 null 반환
  }
}

// 이전 및 다음 게시물 가져오기 (최적화된 버전)
export async function getAdjacentPosts(
  currentPost: Post,
): Promise<{ prev: Post | null; next: Post | null }> {
  try {
    // 메타데이터만 먼저 가져와서 순서 파악
    const allPostsMetadata = await getPostsMetadata();

    // 현재 게시물의 인덱스 찾기
    const currentIndex = allPostsMetadata.findIndex(
      (post) => post.urlPath === currentPost.urlPath,
    );

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    // 이전 글과 다음 글의 메타데이터
    const prevMeta =
      currentIndex > 0 ? allPostsMetadata[currentIndex - 1] : null;
    const nextMeta =
      currentIndex < allPostsMetadata.length - 1
        ? allPostsMetadata[currentIndex + 1]
        : null;

    // 이전 글과 다음 글의 전체 콘텐츠 가져오기 (병렬로 처리)
    const [prev, next] = await Promise.all([
      prevMeta ? getPost(prevMeta.urlPath.split("/")) : Promise.resolve(null),
      nextMeta ? getPost(nextMeta.urlPath.split("/")) : Promise.resolve(null),
    ]);

    return { prev, next };
  } catch (error) {
    console.error("Error getting adjacent posts:", error);
    return { prev: null, next: null };
  }
}

function extractPlainTextFromMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/^#+\s+(.*)$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|\*)(.*?)\1/g, "$2")
    .replace(/^[\s-*]+(.*)$/gm, "$1")
    .replace(/\[\[([^|]+)(?:\|([^\]]+))?\]\]/g, (_, __, label) => label || "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function searchPosts(
  posts: Post[],
  query: string,
  searchFields: ("title" | "summary" | "tags" | "content" | "series")[] = [
    "title",
    "summary",
    "content",
    "series",
  ],
): Post[] {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return posts;

  return posts.filter((post) => {
    const checkField = (field: string) =>
      field?.toLowerCase().includes(lowerQuery) ?? false;
    const checkTags = post.tags.some((tag) =>
      tag.toLowerCase().includes(lowerQuery),
    );

    return (
      (searchFields.includes("title") && checkField(post.title)) ||
      (searchFields.includes("summary") && checkField(post.summary)) ||
      (searchFields.includes("tags") && checkTags) ||
      (searchFields.includes("content") &&
        post.plainContent.toLowerCase().includes(lowerQuery))
    );
  });
}

// 프로젝트 ID와 관련된 포스트 찾기는 contexts/posts-context.tsx로 이동
// 클라이언트 컴포넌트에서 fs 모듈 사용 문제 해결을 위함
