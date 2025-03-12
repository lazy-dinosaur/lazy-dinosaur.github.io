"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "./types";

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
            {project.description}
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

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">주요 기능</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>기능 1에 대한 설명이 들어갑니다.</li>
            <li>기능 2에 대한 설명이 들어갑니다.</li>
            <li>기능 3에 대한 설명이 들어갑니다.</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">배운 점</h3>
          <p className="text-muted-foreground leading-relaxed">
            이 프로젝트를 통해 배운 점이나 도전 과제, 해결 방법 등을 설명합니다.
          </p>
        </div>

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
      </DialogContent>
    </Dialog>
  );
}
