export interface DemoImage {
  url: string;
  description: string;
  showControls?: boolean;
  playbackRate?: number;
}

export interface ThumbnailOptions {
  playbackRate?: number;
}

export interface Project {
  projectType: "project" | "study";
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailOptions?: ThumbnailOptions;
  tags: string[];
  technologies: string[];
  githubUrl?: string;
  serviceUrl?: string;
  featured: boolean;
  createdAt: string;
  overview: string;
  features: string[];
  lessons: string;
  challenges: string[];
  demoType: "images" | "video";
  demoImages?: DemoImage[];
  demoVideo?: string;
  inDevelopment?: boolean;
  futurePlans?: string[];
  publishPath: string;
}