export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  createdAt: string;
  
  // 상세 정보 (선택적)
  overview?: string;
  features?: string[];
  lessons?: string;
  images?: string[];
  
  // 관련 포스트 (선택적)
  relatedPosts?: string[]; // 포스트 urlPath 배열
  
  // 관련 카테고리 (선택적)
  publishPath?: string; // 포스트의 publish 경로와 매칭
}