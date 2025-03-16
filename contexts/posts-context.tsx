// context/posts-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Post } from "@/lib/posts";

type PostMetadata = Omit<Post, 'content' | 'plainContent'>;

type PostsContextType = {
  posts: Post[];
  postsMetadata: PostMetadata[];
  isLoading: boolean;
  getProjectRelatedPosts: (projectId: string, relatedPostPaths?: string[]) => Post[];
  getPostsByUrlPaths: (urlPaths: string[]) => Post[];
  loadPostContent: (urlPath: string) => Promise<Post | null>;
};

const defaultContext: PostsContextType = {
  posts: [],
  postsMetadata: [],
  isLoading: false,
  getProjectRelatedPosts: () => [],
  getPostsByUrlPaths: () => [],
  loadPostContent: async () => null,
};

const PostsContext = createContext<PostsContextType>(defaultContext);

export function PostsProvider({
  children,
  posts,
  postsMetadata,
}: {
  children: React.ReactNode;
  posts: Post[];
  postsMetadata: PostMetadata[];
}) {
  const [loadedPosts, setLoadedPosts] = useState<Record<string, Post>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 초기 포스트 데이터 적용
  useEffect(() => {
    const postsMap: Record<string, Post> = {};
    posts.forEach(post => {
      postsMap[post.urlPath] = post;
    });
    setLoadedPosts(postsMap);
  }, [posts]);

  // 콘텐츠 로딩 함수 - 정적 JSON 파일에서 직접 로드
  const loadPostContent = async (urlPath: string): Promise<Post | null> => {
    // 이미 로드된 포스트라면 캐시에서 반환
    if (loadedPosts[urlPath]) {
      return loadedPosts[urlPath];
    }

    // 포스트 메타데이터 찾기 - try 블록 밖으로 이동하여 catch 블록에서도 접근 가능하게 함
    const metadata = postsMetadata.find(post => post.urlPath === urlPath);
    if (!metadata) {
      return null;
    }

    setIsLoading(true);
    try {
      // 정적 JSON 파일에서 직접 콘텐츠 가져오기
      const response = await fetch(`/post-contents/${urlPath}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load post content: ${response.statusText}`);
      }

      const contentData = await response.json();
      const post: Post = {
        ...metadata,
        content: contentData.content,
        plainContent: contentData.plainContent
      };

      // 캐시에 저장
      setLoadedPosts(prev => ({
        ...prev,
        [urlPath]: post
      }));

      return post;
    } catch (error) {
      console.error(`Error loading post content for ${urlPath}:`, error);
      // 콘텐츠 로드 실패 시, 빈 콘텐츠로 메타데이터만 반환
      return {
        ...metadata,
        content: '',
        plainContent: ''
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 프로젝트 관련 포스트 찾기 (클라이언트측 구현) - 메타데이터만 사용
  const getProjectRelatedPosts = (projectId: string, relatedPostPaths?: string[]): Post[] => {
    if (postsMetadata.length === 0) return [];
    
    // 관련 메타데이터 필터링
    const relatedMetadata = getProjectRelatedMetadata(projectId, relatedPostPaths);
    
    // 이미 로드된 포스트와 매칭
    return relatedMetadata.map(metadata => 
      loadedPosts[metadata.urlPath] || {
        ...metadata,
        content: '',
        plainContent: ''
      }
    );
  };

  // 프로젝트 관련 메타데이터 찾기
  const getProjectRelatedMetadata = (projectId: string, relatedPostPaths?: string[]): PostMetadata[] => {
    // 1. 프로젝트에 명시적으로 관련 포스트가 지정된 경우
    if (relatedPostPaths && relatedPostPaths.length > 0) {
      return postsMetadata.filter(post => 
        relatedPostPaths.some(path => 
          post.urlPath === path || post.urlPath.endsWith(path)
        )
      );
    }
    
    // 2. 명시적으로 지정되지 않은 경우 자동 검색
    return postsMetadata.filter((post) => {
      // URL 경로에 프로젝트 ID가 포함되어 있는 경우
      const urlPathMatch = post.urlPath.includes(`project/${projectId}`);
      
      // 태그에 'project'와 프로젝트 ID 관련 태그가 있는 경우
      const hasProjectTag = post.tags.includes('project');
      const hasProjectIdTag = post.tags.some(tag => 
        tag.toLowerCase() === projectId.toLowerCase() || 
        tag.toLowerCase().includes(projectId.toLowerCase())
      );
      
      return urlPathMatch || (hasProjectTag && hasProjectIdTag);
    });
  };

  // urlPath 배열을 기준으로 포스트를 가져오는 함수
  const getPostsByUrlPaths = (urlPaths: string[]): Post[] => {
    if (!urlPaths || urlPaths.length === 0) return [];
    
    // 매칭되는 포스트 찾기
    const matchedMetadata = postsMetadata.filter(post => 
      urlPaths.some(path => 
        post.urlPath === path || post.urlPath.endsWith(path)
      )
    );
    
    // 이미 로드된 포스트와 매칭
    return matchedMetadata.map(metadata => 
      loadedPosts[metadata.urlPath] || {
        ...metadata,
        content: '',
        plainContent: ''
      }
    );
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      postsMetadata, 
      isLoading, 
      getProjectRelatedPosts, 
      getPostsByUrlPaths,
      loadPostContent
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}
