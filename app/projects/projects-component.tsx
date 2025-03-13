"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Project } from "./types";
import ProjectDetailDialog from "./project-detail-dialog";

// 기본 이미지 경로 (실제 이미지가 없을 경우 사용)
const DEFAULT_IMAGE = "/postImg/project/default-project.png";

// 프로젝트 카드 컴포넌트
const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col">
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
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            {project.featured && (
              <Badge
                className="bg-primary text-primary-foreground"
                variant="default"
              >
                주요 프로젝트
              </Badge>
            )}
            {project.inDevelopment && (
              <Badge className="bg-amber-500 text-white" variant="default">
                개발 중
              </Badge>
            )}
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-1 p-2 bg-gradient-to-t from-slate-900/30 to-transparent dark:from-black/60">
              {project.tags.map((tag, index) => (
                <Badge
                  key={`img-tag-${index}`}
                  className="text-xs bg-primary/90 text-primary-foreground border-none shadow-sm hover:bg-primary/100 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h2>

        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1">
          {project.technologies &&
            project.technologies.slice(0, 4).map((tech) => (
              <Badge variant="secondary" key={tech} className="text-xs">
                {tech}
              </Badge>
            ))}
          {project.technologies && project.technologies.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="icon" variant="outline">
                  <Github className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="icon" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          <Button variant="ghost" className="group" size="sm" onClick={onClick}>
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
    </div>
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
  // Ensure tags is an array
  const validTags = Array.isArray(tags) ? tags : [];

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        key="all"
        variant={selectedTag === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedTag("all")}
      >
        전체
      </Button>
      {validTags.map((tag, index) => (
        <Button
          key={`tag-${index}-${tag}`} // Ensure unique keys with index
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
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");

  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 상태 추가

  const [projects, setProjects] = useState<Project[]>([]);

  // 프로젝트 데이터 불러오기
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/projects.json");
        const data = await response.json();
        setProjects(data);
        if (selectedTag === "all") {
          setFilteredProjects(data);
        } else {
          const filtered = data.filter(
            (project: Project) =>
              project.tags &&
              Array.isArray(project.tags) &&
              project.tags.includes(selectedTag),
          );
          setFilteredProjects(filtered);
        }
      } catch (error) {
        console.error(
          "프로젝트 데이터를 불러오는 중 오류가 발생했습니다:",
          error,
        );
      }
    };

    fetchProjects();
  }, [selectedTag]);

  // 프로젝트 타입 목록 설정
  const projectTypes = [
    { value: "project", label: "프로젝트" },
    { value: "study", label: "학습/실습" },
  ];

  // 선택한 프로젝트 타입
  const [selectedProjectType, setSelectedProjectType] =
    useState<string>("project");

  // 전체 태그 목록 추출 - make sure to filter undefined tags
  const allTags = Array.from(
    new Set(
      projects
        .filter((p) => p.tags && Array.isArray(p.tags))
        .flatMap((p) => p.tags),
    ),
  );

  // 태그와 프로젝트 타입에 따라 프로젝트 필터링
  useEffect(() => {
    let filtered = [...projects];

    // 프로젝트 타입으로 필터링 (항상 특정 타입으로 필터링)
    filtered = filtered.filter(
      (project) => project.projectType === selectedProjectType,
    );

    // 태그로 필터링
    if (selectedTag !== "all") {
      filtered = filtered.filter(
        (project) =>
          project.tags &&
          Array.isArray(project.tags) &&
          project.tags.includes(selectedTag),
      );
    }

    setFilteredProjects(filtered);

    // 필터링이 변경될 때마다 애니메이션 키를 업데이트
    setAnimationKey((prevKey) => prevKey + 1);
  }, [selectedTag, selectedProjectType, projects]);

  // URL 파라미터를 통해 프로젝트 모달 열기 처리
  useEffect(() => {
    if (projectParam && projects.length > 0) {
      const foundProject = projects.find((p) => p.id === projectParam);
      if (foundProject) {
        setSelectedProject(foundProject);
        setDialogOpen(true);
      }
    }
  }, [projectParam, projects]);

  // 프로젝트 상세 보기 열기
  const handleProjectClick = (project: Project) => {
    // URL에 프로젝트 ID 추가 (히스토리 스택에 추가)
    const url = new URL(window.location.href);
    url.searchParams.set("project", project.id);
    window.history.pushState({}, "", url);

    setSelectedProject(project);
    setDialogOpen(true);
  };

  // 모달이 닫힐 때 URL 파라미터 제거
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // 모달이 닫힐 때 URL에서 프로젝트 파라미터 제거
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      window.history.pushState({}, "", url);
    }
    setDialogOpen(open);
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            {selectedProjectType === "project" ? "프로젝트" : "학습/실습"}
          </h1>
          <p className="text-muted-foreground mb-2">
            지금까지 진행한 다양한 프로젝트와 학습/실습 작업물을 소개합니다.
            카테고리와 태그를 선택하여 필터링할 수 있습니다.
          </p>

          {selectedProjectType === "project" ? (
            <p className="text-muted-foreground mb-6">
              서비스를 목표로 개발한 프로젝트들입니다. 문제를 해결하고 효율을
              높이는 것이 제 프로젝트의 핵심 가치입니다. 게으름이 버그가 아닌
              기능이 되는 세상을 만들기 위한 솔루션들입니다. 🚀
            </p>
          ) : (
            <p className="text-muted-foreground mb-6">
              새로운 기술과 개념을 학습하기 위해 진행한 작업물들입니다. 실무에
              적용하기 위한 연습 프로젝트와 기술 검증을 위한 실험적 코드를
              포함합니다. 지속적인 성장을 위한 기록들입니다. 📚
            </p>
          )}

          {/* 프로젝트 타입 필터 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">
              카테고리
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={
                    selectedProjectType === type.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedProjectType(type.value)}
                  className={
                    selectedProjectType === type.value ? "bg-primary" : ""
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">
            태그
          </h3>
          <ProjectFilter
            key="project-filter"
            tags={allTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
        </div>

        {/* 결과 개수 표시 */}
        {filteredProjects.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {selectedProjectType === "project" ? "🚀" : "📚"} 총{" "}
              <span className="font-medium">{filteredProjects.length}개</span>의
              {selectedProjectType === "project"
                ? " 프로젝트"
                : " 학습/실습 작업물"}
              이 있습니다.
            </p>
          </div>
        )}

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-full">
            <AnimatePresence mode="wait" key={animationKey}>
              <div key={`content-${animationKey}`} className="contents">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1, // 순차적으로 나타나도록 딜레이 추가
                      },
                    }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-muted-foreground">
              선택한 카테고리와 태그에 해당하는 프로젝트가 없습니다.
            </p>
          </motion.div>
        )}
      </div>

      {/* 프로젝트 상세 정보 다이얼로그 */}
      <ProjectDetailDialog
        project={selectedProject}
        open={dialogOpen}
        onOpenChangeAction={handleDialogOpenChange}
      />
    </div>
  );
}
