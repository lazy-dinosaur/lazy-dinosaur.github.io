export type DemoType = "iframe" | "video" | "images" | "code" | "none";

export type ProjectType = "project" | "study"; // 프로젝트 유형: 실제 프로젝트 또는 학습/실습

export interface DemoImage {
  url: string;
  description?: string;
  // isVideo 속성은 더 이상 필요하지 않음 - 확장자로 자동 감지
}

export interface Project {
  projectType?: ProjectType; // 프로젝트 유형
  id: string;
  title: string;
  description: string;
  thumbnail: string; // 이미지 URL 또는 비디오 URL
  // thumbnailType은 필요 없음 - 확장자로 자동 감지됨
  // 비디오는 항상 autoplay=true, loop=true, muted=true로 설정됨
  tags: string[];
  technologies: string[];
  githubUrl?: string;
  liveSiteUrl?: string; // 라이브 사이트 URL (카드에 표시되는 데모 링크)
  serviceUrl?: string; // 실제 서비스 중인 URL
  downloadUrl?: string; // 다운로드 URL (앱, 파일 등)
  featured: boolean;
  inDevelopment?: boolean; // 개발 중 여부
  createdAt: string;

  // 상세 정보 (선택적)
  overview?: string;
  features?: string[];
  lessons?: string;
  challenges?: string[]; // 개발 과정에서 어려웠던 점들
  futurePlans?: string[]; // 향후 계획
  images?: string[];

  // 라이브 데모 관련
  demoType?: DemoType;
  demoUrl?: string; // iframe 또는 코드 타입일 경우 URL
  demoVideoUrl?: string; // 비디오 타입일 경우 비디오 URL
  demoImages?: DemoImage[]; // 이미지 타입일 경우 이미지와 설명이 포함된 객체 배열
  demoCodeSandboxId?: string; // 코드 타입일 경우 CodeSandbox ID

  // 관련 포스트 (선택적)
  relatedPosts?: string[]; // 포스트 urlPath 배열

  // 관련 카테고리 (선택적)
  publishPath?: string; // 포스트의 publish 경로와 매칭
}
