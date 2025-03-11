"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, ArrowRight } from "lucide-react";

import { Project } from "./types";
import ProjectDetailDialog from "./project-detail-dialog";

// 샘플 프로젝트 데이터
const SAMPLE_PROJECTS: Project[] = [
  {
    id: "my-blog",
    title: "개인 블로그",
    description: "Next.js, TypeScript, Tailwind CSS를 사용하여 개발한 개인 블로그입니다. 마크다운 기반 콘텐츠 관리와 다크 모드를 지원합니다.",
    thumbnail: "/postImg/project/blog/thumbnail.png", // 실제 썸네일 경로로 변경해야 합니다
    tags: ["웹", "프론트엔드"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/yourusername/my-blog",
    demoUrl: "https://your-blog-url.com",
    featured: true,
    createdAt: "2023-12-01",
  },
  {
    id: "ai-assistant",
    title: "AI 어시스턴트 앱",
    description: "OpenAI API를 활용한 챗봇 어시스턴트 애플리케이션으로, 사용자 질문에 답변하고 다양한 작업을 도와줍니다.",
    thumbnail: "/postImg/project/ai/assistant-app.png", // 실제 썸네일 경로로 변경해야 합니다
    tags: ["AI", "웹", "백엔드"],
    technologies: ["React", "Express.js", "OpenAI API", "MongoDB"],
    githubUrl: "https://github.com/yourusername/ai-assistant",
    featured: true,
    createdAt: "2023-10-15",
  },
  {
    id: "task-manager",
    title: "태스크 매니저",
    description: "React와 Redux를 사용하여 개발한 일정 관리 애플리케이션으로, 드래그 앤 드롭 인터페이스와 로컬 스토리지 동기화를 지원합니다.",
    thumbnail: "/postImg/project/task-manager.png", // 실제 썸네일 경로로 변경해야 합니다
    tags: ["웹", "프론트엔드", "생산성"],
    technologies: ["React", "Redux", "CSS Modules", "LocalStorage API"],
    githubUrl: "https://github.com/yourusername/task-manager",
    demoUrl: "https://your-task-app.com",
    featured: false,
    createdAt: "2023-08-20",
  },
  {
    id: "weather-app",
    title: "날씨 앱",
    description: "현재 위치 기반으로 날씨 정보를 제공하는 모바일 친화적인 웹 애플리케이션입니다.",
    thumbnail: "/postImg/project/weather-app.png", // 실제 썸네일 경로로 변경해야 합니다
    tags: ["웹", "API"],
    technologies: ["HTML", "CSS", "JavaScript", "Weather API"],
    githubUrl: "https://github.com/yourusername/weather-app",
    demoUrl: "https://your-weather-app.com",
    featured: false,
    createdAt: "2023-07-10",
  },
];

// 기본 이미지 경로 (실제 이미지가 없을 경우 사용)
const DEFAULT_IMAGE = "/postImg/project/default-project.png";

// 프로젝트 카드 컴포넌트
const ProjectCard = ({ 
  project, 
  onClick 
}: { 
  project: Project;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="relative h-full w-full"
        >
          <Image
            src={project.thumbnail || DEFAULT_IMAGE}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:opacity-90"
            width={600}
            height={340}
          />
          {project.featured && (
            <Badge
              className="absolute right-2 top-2 bg-primary text-primary-foreground"
              variant="default"
            >
              주요 프로젝트
            </Badge>
          )}
        </motion.div>
      </div>

      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h2>
        
        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
          {project.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge variant="secondary" key={tech} className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="outline">
                  <Github className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {project.demoUrl && (
              <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            className="group" 
            size="sm"
            onClick={onClick}
          >
            자세히 보기 
            <motion.span
              className="inline-block ml-1"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// 필터 컴포넌트
const ProjectFilter = ({
  tags,
  selectedTag,
  setSelectedTag,
}: {
  tags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}) => {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Button
        variant={selectedTag === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedTag("all")}
      >
        전체
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTag === tag ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTag(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

// 프로젝트 페이지 메인 컴포넌트
export default function ProjectsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // 전체 태그 목록 추출
  const allTags = Array.from(new Set(SAMPLE_PROJECTS.flatMap(p => p.tags)));
  
  // 선택된 태그에 따라 프로젝트 필터링
  useEffect(() => {
    if (selectedTag === "all") {
      setFilteredProjects(SAMPLE_PROJECTS);
    } else {
      const filtered = SAMPLE_PROJECTS.filter(project =>
        project.tags.includes(selectedTag)
      );
      setFilteredProjects(filtered);
    }
  }, [selectedTag]);
  
  // 프로젝트 상세 보기 열기
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  return (
    <div className="container px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">프로젝트</h1>
        <p className="text-muted-foreground mb-8">
          지금까지 진행한 다양한 프로젝트들을 소개합니다. 관심 있는 카테고리를 선택하여 필터링할 수 있습니다.
        </p>
      </motion.div>
      
      <ProjectFilter
        tags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center"
        >
          <p className="text-muted-foreground">선택한 카테고리에 해당하는 프로젝트가 없습니다.</p>
        </motion.div>
      )}
      
      {/* 프로젝트 상세 정보 다이얼로그 */}
      <ProjectDetailDialog
        project={selectedProject}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}