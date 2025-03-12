"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "./types";
import { usePosts } from "@/contexts/posts-context";
import type { Post } from "@/lib/posts";

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
            filteredPosts = posts.filter(post => 
              // 정확히 일치하거나 하위 카테고리 포함
              post.publish === project.publishPath ||
              post.publish.startsWith(`${project.publishPath}/`)
            );
            
            console.log("### 방법 1: publish 필드 매칭 ###");
            console.log("project.publishPath:", project.publishPath);
            console.log("Posts with publish field:", posts.filter(p => p.publish).map(p => `${p.urlPath} (${p.publish})`));
            console.log("Filtered by publish:", filteredPosts.map(p => p.urlPath));
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
                post.urlPath.startsWith(project.publishPath) ||
                post.urlPath.includes(`/${project.publishPath}/`) ||
                post.urlPath.includes(`/${project.publishPath}`),
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
  }, [project, open, getProjectRelatedPosts, posts]);

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          </div>
          <DialogDescription>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-hidden rounded-lg">
          <Image
            src={project.thumbnail || "/postImg/project/default-project.png"}
            alt={project.title}
            width={800}
            height={450}
            className="w-full object-cover"
          />
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
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">배운 점</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.lessons}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Github className="mr-2 h-4 w-4" />
                GitHub 저장소
              </Button>
            </Link>
          )}
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                라이브 데모
              </Button>
            </Link>
          )}
        </div>

        {/* 관련 포스트 섹션 */}
        {relatedPosts.length > 0 && (
          <div className="mt-8 border-t pt-6">
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
      </DialogContent>
    </Dialog>
  );
}
