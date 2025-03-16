"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, FileText, Globe, Download, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "./types";
import { usePosts } from "@/contexts/posts-context";
import type { Post } from "@/lib/posts";
import LiveDemoModal from "./live-demo-modal";
import { isVideoFile, isGifFile } from "@/lib/utils";

interface ProjectDetailDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export default function ProjectDetailDialog({
  project,
  open,
  onOpenChangeAction,
}: ProjectDetailDialogProps) {
  const { getProjectRelatedPosts, getPostsByUrlPaths, posts } = usePosts();
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liveDemoOpen, setLiveDemoOpen] = useState(false);

  // 프로젝트가 열릴 때 관련 포스트 로드
  useEffect(() => {
    function loadRelatedPosts() {
      if (project && open) {
        console.log("전체 로그 스타트");
        console.log("PROJECT:", project);
        console.log("Available Posts:", posts);

        setIsLoading(true);
        try {
          // 프로젝트의 publishPath를 기반으로 포스트 필터링
          let filteredPosts: Post[] = [];

          // 방법 1: 스크립트 수정 후 사용 - publish 필드를 기준으로 필터링
          // Python 스크립트 실행 후 이 코드를 사용할 것

          // 포스트가 있고 프로젝트에 publishPath가 지정된 경우
          if (posts.length > 0 && project.publishPath) {
            filteredPosts = posts.filter(
              (post) =>
                // 정확히 일치하거나 하위 카테고리 포함
                post.publish === project.publishPath ||
                (post.publish &&
                  project.publishPath &&
                  post.publish.startsWith(`${project.publishPath}/`)),
            );

            console.log("### 방법 1: publish 필드 매칭 ###");
            console.log("project.publishPath:", project.publishPath);
            console.log(
              "Posts with publish field:",
              posts
                .filter((p) => p.publish)
                .map((p) => `${p.urlPath} (${p.publish})`),
            );
            console.log(
              "Filtered by publish:",
              filteredPosts.map((p) => p.urlPath),
            );
          }
          // 기존 방식으로 시도
          else if (project.relatedPosts && project.relatedPosts.length > 0) {
            // urlPath를 기준으로 매칭
            filteredPosts = getPostsByUrlPaths(project.relatedPosts);

            // 디버깅용 로그
            console.log("### 방법 2: relatedPosts ###");
            console.log("Checking relatedPosts:", project.relatedPosts);
            console.log(
              "Available posts:",
              posts.map((p) => p.urlPath),
            );
            console.log(
              "Filtered posts by relatedPosts:",
              filteredPosts.map((p) => p.urlPath),
            );
          }
          // publishPath가 지정된 경우 해당 경로 기준으로 포스트 필터링
          else if (project.publishPath) {
            // urlPath로 매칭 (publish 필드가 없어서)
            filteredPosts = posts.filter(
              (post) =>
                (project.publishPath &&
                  post.urlPath.startsWith(project.publishPath)) ||
                (project.publishPath &&
                  post.urlPath.includes(`/${project.publishPath}/`)) ||
                (project.publishPath &&
                  post.urlPath.includes(`/${project.publishPath}`)),
            );

            // 디버깅용 로그
            console.log("### 방법 3: publishPath ###");
            console.log("Checking publishPath:", project.publishPath);
            console.log(
              "Filtered posts by publishPath:",
              filteredPosts.map((p) => p.urlPath),
            );
          }
          // 자동 검색
          else {
            filteredPosts = getProjectRelatedPosts(project.id);

            // 디버깅용 로그
            console.log("### 방법 4: 자동 검색 ###");
            console.log("Using automatic search for projectId:", project.id);
            console.log(
              "Filtered posts by auto search:",
              filteredPosts.map((p) => p.urlPath),
            );
          }

          setRelatedPosts(filteredPosts);
        } catch (error) {
          console.error("Error loading related posts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadRelatedPosts();
  }, [project, open, getProjectRelatedPosts, getPostsByUrlPaths, posts]);

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="w-[92vw] max-w-full sm:max-w-3xl p-0 overflow-hidden flex flex-col h-[85vh] max-h-[85vh] sm:max-h-[90vh] fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] gap-0 rounded-xl">
        {/* 헤더 영역 - 상단 고정 */}
        <div className="border-b px-4 sm:px-6 pt-3 pb-3">
          <DialogHeader className="pb-0 pr-4 sm:pr-8">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl sm:text-2xl break-all">{project.title}</DialogTitle>
                {project.inDevelopment && (
                  <Badge className="bg-amber-500 text-white">개발 중</Badge>
                )}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="px-3 sm:px-6 pt-2 pb-0 overflow-y-auto flex-1 overscroll-contain">
          {/* 패딩 없음 - 스크롤 영역 */}
          <div className="overflow-hidden rounded-lg">
            {(project.thumbnailType === "video" || (!project.thumbnailType && isVideoFile(project.thumbnail))) ? (
              <div className="w-full aspect-video">
                <video
                  src={project.thumbnail}
                  className="w-full h-full object-cover"
                  width={800}
                  height={450}
                  autoPlay={project.thumbnailOptions?.autoplay !== false}
                  loop={project.thumbnailOptions?.loop !== false}
                  muted={project.thumbnailOptions?.muted !== false}
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture={true}
                  onError={(e) => console.error("비디오 로딩 오류:", e)}
                />
              </div>
            ) : (
              <Image
                src={project.thumbnail || "/postImg/project/default-project.png"}
                alt={project.title}
                width={800}
                height={450}
                className="w-full object-cover"
                priority
              />
            )}
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">프로젝트 개요</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.overview || project.description}
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">사용 기술</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          {project.features && project.features.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">주요 기능</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          {project.lessons && (
            <div className="py-6">
              <h3 className="text-lg font-medium mb-2">배운 점</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.lessons}
              </p>
            </div>
          )}
          {project.challenges && project.challenges.length > 0 && (
            <div className="py-6">
              <h3 className="text-lg font-medium mb-2">어려웠던 점</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="leading-relaxed">{challenge}</li>
                ))}
              </ul>
            </div>
          )}
          {project.futurePlans && project.futurePlans.length > 0 && (
            <div className="py-6">
              <h3 className="text-lg font-medium mb-2">향후 계획</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {project.futurePlans.map((plan, index) => (
                  <li key={index}>{plan}</li>
                ))}
              </ul>
            </div>
          )}
          {/* 관련 포스트 섹션 */}
          {relatedPosts.length > 0 && (
            <div className="mt-8 border-t py-6">
              <h3 className="text-lg font-medium mb-4">관련 포스트</h3>
              <div className="space-y-3">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.urlPath}
                    href={`/posts/${post.urlPath}`}
                    className="block p-3 rounded-md border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">
                          {post.title}
                        </h4>
                        {post.summary && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {post.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {isLoading && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">관련 포스트</h3>
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">
                  포스트 로딩 중...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 영역 - 고정 */}
        <div className="border-t px-3 sm:px-6 py-2 sm:py-3 flex flex-wrap gap-1.5 sm:gap-3 bg-background mt-1">
          {project.demoType && project.demoType !== 'none' && (
            <Button 
              variant="default" 
              size="sm"
              className="text-xs sm:text-sm py-1 h-7 sm:h-9"
              onClick={() => setLiveDemoOpen(true)}
            >
              <Play className="mr-2 h-4 w-4" />
              라이브 데모
            </Button>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm py-1 h-7 sm:h-9"
              >
                <Github className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                GitHub 저장소
              </Button>
            </Link>
          )}
          {project.liveSiteUrl && (
            <Link
              href={project.liveSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm py-1 h-7 sm:h-9"
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                데모 사이트
              </Button>
            </Link>
          )}
          {project.serviceUrl && (
            <Link
              href={project.serviceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm py-1 h-7 sm:h-9"
              >
                <Globe className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                서비스 바로가기
              </Button>
            </Link>
          )}
          {project.downloadUrl && (
            <Link
              href={project.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm py-1 h-7 sm:h-9"
              >
                <Download className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                다운로드
              </Button>
            </Link>
          )}
        </div>
      </DialogContent>
      
      {/* 라이브 데모 모달 */}
      <LiveDemoModal 
        project={project} 
        open={liveDemoOpen} 
        onOpenChangeAction={(open) => {
          // 모달이 닫힐 때만 상태 업데이트
          setLiveDemoOpen(open);
        }} 
      />
    </Dialog>
  );
}
