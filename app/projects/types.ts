export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  serviceUrl?: string; // 실제 서비스 중인 URL
  downloadUrl?: string; // 다운로드 URL (앱, 파일 등)
  featured: boolean;
  inDevelopment?: boolean; // 개발 중 여부
  createdAt: string;

  // 상세 정보 (선택적)
  overview?: string;
  features?: string[];
  lessons?: string;
  futurePlans?: string[]; // 향후 계획
  images?: string[];

  // 관련 포스트 (선택적)
  relatedPosts?: string[]; // 포스트 urlPath 배열

  // 관련 카테고리 (선택적)
  publishPath?: string; // 포스트의 publish 경로와 매칭
}
