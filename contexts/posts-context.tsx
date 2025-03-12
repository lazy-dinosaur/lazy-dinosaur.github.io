// context/posts-context.tsx
"use client";

import { createContext, useContext } from "react";
import { Post } from "@/lib/posts";

type PostsContextType = {
  posts: Post[];
  getProjectRelatedPosts: (projectId: string, relatedPostPaths?: string[]) => Post[];
  getPostsByUrlPaths: (urlPaths: string[]) => Post[];
};

const defaultContext: PostsContextType = {
  posts: [],
  getProjectRelatedPosts: () => [],
  getPostsByUrlPaths: () => [],
};

const PostsContext = createContext<PostsContextType>(defaultContext);

export function PostsProvider({
  children,
  posts,
}: {
  children: React.ReactNode;
  posts: Post[];
}) {
  // 프로젝트 관련 포스트 찾기 (클라이언트측 구현)
  const getProjectRelatedPosts = (projectId: string, relatedPostPaths?: string[]): Post[] => {
    if (!posts || posts.length === 0) return [];
    
    // 1. 프로젝트에 명시적으로 관련 포스트가 지정된 경우
    if (relatedPostPaths && relatedPostPaths.length > 0) {
      return posts.filter(post => 
        relatedPostPaths.some(path => 
          post.urlPath === path || post.urlPath.endsWith(path)
        )
      );
    }
    
    // 2. 명시적으로 지정되지 않은 경우 자동 검색
    return posts.filter((post) => {
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
    if (!posts || posts.length === 0 || !urlPaths || urlPaths.length === 0) return [];
    
    return posts.filter(post => 
      urlPaths.some(path => 
        post.urlPath === path || post.urlPath.endsWith(path)
      )
    );
  };

  return (
    <PostsContext.Provider value={{ posts, getProjectRelatedPosts, getPostsByUrlPaths }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}
