"use client";

import { useState, useEffect } from "react";
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
import { isVideoFile, isGifFile } from "@/lib/utils";

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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  // 모달이 열리면 초기 이미지 로딩 상태 설정
  useEffect(() => {
    if (open && project?.demoImages && project.demoImages.length > 0) {
      // 로딩 상태 초기화
      setIsImageLoading(true);
      setCurrentImageIndex(0); // 항상 첫 번째 이미지부터 시작하도록 초기화

      // 초기 로딩 상태 설정 - 모든 이미지를 미로드 상태로 설정
      const initialLoadState: Record<number, boolean> = {};
      project.demoImages.forEach((_, idx) => {
        initialLoadState[idx] = false;
      });
      setLoadedImages(initialLoadState);
    }
  }, [open, project]);

  // 이미지 URL이 변경될 때 로딩 상태 처리
  useEffect(() => {
    if (
      project?.demoImages &&
      Array.isArray(project.demoImages) &&
      currentImageIndex >= 0 &&
      currentImageIndex < project.demoImages.length &&
      project.demoImages[currentImageIndex]
    ) {
      // 현재 이미지가 이미 로딩되었는지 확인
      if (!loadedImages[currentImageIndex]) {
        setIsImageLoading(true);
      }
    }
  }, [currentImageIndex, project, loadedImages]);

  if (!project) return null;

  // 이미지 갤러리 컨트롤
  const nextImage = () => {
    if (
      project.demoImages &&
      Array.isArray(project.demoImages) &&
      project.demoImages.length > 0
    ) {
      const nextIndex =
        currentImageIndex === project.demoImages.length - 1
          ? 0
          : currentImageIndex + 1;

      // 이미지가 아직 로드되지 않았다면 로딩 상태 활성화
      if (!loadedImages[nextIndex]) {
        setIsImageLoading(true);
      }

      setCurrentImageIndex(nextIndex);
    }
  };

  const prevImage = () => {
    if (
      project.demoImages &&
      Array.isArray(project.demoImages) &&
      project.demoImages.length > 0
    ) {
      const prevIndex =
        currentImageIndex === 0
          ? project.demoImages.length - 1
          : currentImageIndex - 1;

      // 이미지가 아직 로드되지 않았다면 로딩 상태 활성화
      if (!loadedImages[prevIndex]) {
        setIsImageLoading(true);
      }

      setCurrentImageIndex(prevIndex);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="w-[92vw] max-w-full sm:max-w-4xl p-0 overflow-hidden h-[85vh] max-h-[85vh] sm:max-h-[90vh] fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-xl">
        <div className="flex flex-col h-[85vh] max-h-[85vh] sm:max-h-[90vh]">
          <DialogHeader className="px-4 sm:px-6 py-3 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-lg sm:text-xl break-all">
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

            {(project.demoType === "video" ||
              (!project.demoType &&
                project.demoUrl &&
                isVideoFile(project.demoUrl))) && (
              <div className="relative w-full h-[85vh] max-h-[85vh] sm:max-h-[90vh] pb-3 flex items-center justify-center bg-black/5">
                {project.demoVideoUrl ? (
                  // iframe으로 외부 비디오(YouTube 등) 표시
                  <iframe
                    className="w-full h-full"
                    src={project.demoVideoUrl}
                    title={`${project.title} 데모 비디오`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  // 직접 비디오 파일을 표시하고 자동 재생, 루프 설정
                  <video
                    src={project.demoUrl}
                    className="max-w-full max-h-full object-contain"
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture={true}
                    onError={(e) => console.error("비디오 로딩 오류:", e)}
                    key={`video-demo-${project.id}`}
                  ></video>
                )}
              </div>
            )}

            {project.demoType === "images" &&
              project.demoImages &&
              project.demoImages.length > 0 &&
              currentImageIndex >= 0 &&
              currentImageIndex < project.demoImages.length && (
                <div className="w-full h-full relative flex items-center justify-center bg-black/5">
                  <div className="relative w-full h-full flex flex-col">
                    <div className="relative flex-grow">
                      {/* 로딩 오버레이 */}
                      {isImageLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-white mb-2"></div>
                            <p className="text-white text-sm">
                              이미지 로딩 중...
                            </p>
                          </div>
                        </div>
                      )}

                      {project.demoImages &&
                        project.demoImages[currentImageIndex] &&
                        // GIF는 이미지로 처리, 비디오는 비디오 플레이어로 처리
                        (isGifFile(
                          project.demoImages[currentImageIndex]?.url || "",
                        ) ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                            <Image
                              src={
                                project.demoImages[currentImageIndex]?.url || ""
                              }
                              alt={`${project.title} GIF ${currentImageIndex + 1}`}
                              className="max-w-full max-h-full object-contain"
                              fill
                              onLoad={() => {
                                setIsImageLoading(false);
                                setLoadedImages((prev) => ({
                                  ...prev,
                                  [currentImageIndex]: true,
                                }));
                              }}
                              onError={() => {
                                console.error("GIF 로딩 오류");
                                setIsImageLoading(false);
                              }}
                              key={`gif-${project.demoImages[currentImageIndex]?.url}`}
                            />
                          </div>
                        ) : project.demoImages[currentImageIndex]?.isVideo ||
                          isVideoFile(
                            project.demoImages[currentImageIndex]?.url || "",
                          ) ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                            <video
                              src={
                                project.demoImages[currentImageIndex]?.url || ""
                              }
                              className="max-w-full max-h-full object-contain"
                              autoPlay={
                                project.demoImages[currentImageIndex]
                                  ?.autoplay !== false
                              }
                              loop={
                                project.demoImages[currentImageIndex]?.loop !==
                                false
                              }
                              muted={
                                project.demoImages[currentImageIndex]?.muted !==
                                false
                              }
                              ref={(videoEl) => {
                                if (videoEl) {
                                  // 재생 속도 설정
                                  const currentImage =
                                    project.demoImages?.[currentImageIndex];
                                  const rate =
                                    currentImage &&
                                    "playbackRate" in currentImage &&
                                    typeof currentImage.playbackRate ===
                                      "number"
                                      ? currentImage.playbackRate
                                      : undefined;
                                  if (rate) videoEl.playbackRate = rate;
                                }
                              }}
                              playsInline
                              preload="auto"
                              controls={Boolean(
                                project.demoImages?.[currentImageIndex] &&
                                  "showControls" in
                                    project.demoImages[currentImageIndex] &&
                                  project.demoImages[currentImageIndex]
                                    .showControls === true,
                              )}
                              disablePictureInPicture={true}
                              onLoadedData={() => {
                                // 비디오가 로드되면 로딩 상태 해제
                                setIsImageLoading(false);
                                setLoadedImages((prev) => ({
                                  ...prev,
                                  [currentImageIndex]: true,
                                }));
                              }}
                              onError={(e) => {
                                console.error("비디오 로딩 오류:", e);
                                setIsImageLoading(false);
                              }}
                              key={`video-${project.demoImages[currentImageIndex]?.url}`}
                            />
                            {/* 비디오 설명 추가 */}
                            {project.demoImages[currentImageIndex]?.description && (
                              <div className="absolute bottom-12 left-0 right-0 p-3 sm:p-4 bg-background/90 dark:bg-background/90 backdrop-blur-sm w-full text-center">
                                <p className="text-xs sm:text-sm text-foreground">
                                  {
                                    project.demoImages[currentImageIndex]
                                      ?.description
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Image
                            src={
                              project.demoImages[currentImageIndex]?.url || ""
                            }
                            alt={`${project.title} 스크린샷 ${currentImageIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                            onLoadingComplete={() => {
                              // 현재 이미지가 로드되면 로딩 상태 해제
                              setIsImageLoading(false);
                              setLoadedImages((prev) => ({
                                ...prev,
                                [currentImageIndex]: true,
                              }));
                            }}
                          />
                        ))}

                      {/* 이미지 설명 - 페이지네이션 불릿보다 위에 배치 */}
                      {project.demoImages &&
                        project.demoImages[currentImageIndex]?.description && (
                          <div className="absolute bottom-12 left-0 right-0 p-3 sm:p-4 bg-background/90 dark:bg-background/90 backdrop-blur-sm w-full text-center">
                            <p className="text-xs sm:text-sm text-foreground">
                              {
                                project.demoImages[currentImageIndex]
                                  ?.description
                              }
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* 이미지 갤러리 컨트롤 */}
                  {project.demoImages && project.demoImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {project.demoImages.map((_, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (!loadedImages[index]) {
                                setIsImageLoading(true);
                              }
                              setCurrentImageIndex(index);
                            }}
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

          <div className="p-2 sm:p-4 border-t flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {project.demoType === "iframe" &&
                "실제 서비스 환경에서의 데모입니다."}
              {project.demoType === "code" &&
                "인터랙티브 코드 데모입니다. 코드를 수정하고 결과를 확인해보세요."}
              {project.demoType === "video" && "프로젝트 소개 영상입니다."}
              {project.demoType === "images" &&
                project.demoImages &&
                project.demoImages.length > 0 &&
                currentImageIndex >= 0 &&
                currentImageIndex < project.demoImages.length &&
                `스크린샷 ${currentImageIndex + 1}/${project.demoImages.length}`}
            </p>
            <Button
              onClick={() => onOpenChangeAction(false)}
              size="sm"
              className="text-xs sm:text-sm py-1 h-7 sm:h-9"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
