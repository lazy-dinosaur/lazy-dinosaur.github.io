"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "./types";

interface LiveDemoModalProps {
  project: Project | null;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export default function LiveDemoModal({
  project,
  open,
  onOpenChangeAction,
}: LiveDemoModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  // 이미지 갤러리 컨트롤
  const nextImage = () => {
    if (project.demoImages) {
      setCurrentImageIndex((prev) =>
        prev === project.demoImages!.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (project.demoImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.demoImages!.length - 1 : prev - 1,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-4xl p-0 h-[80vh] max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-3 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">
                {project.title} - 라이브 데모
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-grow overflow-hidden relative">
            {project.demoType === "iframe" && project.demoUrl && (
              <iframe
                src={project.demoUrl}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
                title={`${project.title} 데모`}
              />
            )}

            {project.demoType === "code" &&
              (project.demoCodeSandboxId || project.demoUrl) && (
                <iframe
                  src={
                    project.demoCodeSandboxId
                      ? `https://codesandbox.io/embed/${project.demoCodeSandboxId}?fontsize=14&hidenavigation=1&theme=dark`
                      : project.demoUrl
                  }
                  className="w-full h-full border-none"
                  loading="lazy"
                  title={`${project.title} 코드 데모`}
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              )}

            {project.demoType === "video" && project.demoVideoUrl && (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <iframe
                  className="w-full h-full"
                  src={project.demoVideoUrl}
                  title={`${project.title} 데모 비디오`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {project.demoType === "images" &&
              project.demoImages &&
              project.demoImages.length > 0 && (
                <div className="w-full h-full relative flex items-center justify-center bg-black/5">
                  <div className="relative w-full h-full">
                    <Image
                      src={project.demoImages[currentImageIndex]}
                      alt={`${project.title} 스크린샷 ${currentImageIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* 이미지 갤러리 컨트롤 */}
                  {project.demoImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {project.demoImages.map((_, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 p-0 rounded-full ${
                              currentImageIndex === index
                                ? "bg-white"
                                : "bg-white/40 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

            {(!project.demoType || project.demoType === "none") && (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground text-center px-4">
                  이 프로젝트는 현재 라이브 데모를 제공하지 않습니다.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {project.demoType === "iframe" &&
                "실제 서비스 환경에서의 데모입니다."}
              {project.demoType === "code" &&
                "인터랙티브 코드 데모입니다. 코드를 수정하고 결과를 확인해보세요."}
              {project.demoType === "video" && "프로젝트 소개 영상입니다."}
              {project.demoType === "images" &&
                project.demoImages &&
                `스크린샷 ${currentImageIndex + 1}/${project.demoImages.length}`}
            </p>
            <Button onClick={() => onOpenChangeAction(false)}>닫기</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
