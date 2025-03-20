"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

interface PostCardProps {
  urlPath: string;
  title: string;
  summary: string;
  content: string;
  plainContent?: string;
  image: string;
  tags: string[];
  createdAt: string;
}

const DEFAULT_IMAGE = "/lazydino-logo.png";

const PostCard = ({
  urlPath,
  title,
  summary,
  content,
  plainContent,
  image,
  tags,
  createdAt,
}: PostCardProps) => {
  let thumbnail = image || (content.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? "");

  if (
    thumbnail &&
    !thumbnail.startsWith("http") &&
    !thumbnail.startsWith("/")
  ) {
    const publishDir = urlPath.split("/").slice(0, -1).join("/");
    const imageName = thumbnail.split("/").pop();
    thumbnail = `/postImg/${publishDir}/${imageName}`;
  }

  // 날짜 포맷팅
  const formattedDate = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 게시물 요약 텍스트
  const postSummary =
    (summary || plainContent || content).substring(0, 150) + "...";

  return (
    <Link 
      href={`/posts/${urlPath}`} 
      className="block h-full">
      <motion.div
        className="h-full group overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-md"
        whileHover={{
          y: -5,
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
      >
        <div className="aspect-video w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <Image
              src={thumbnail || DEFAULT_IMAGE}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:opacity-90"
              width={600}
              height={340}
            />
          </motion.div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col justify-between h-max">
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2 duration-300">
            {title}
          </h2>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {postSummary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex justify-end">
            <motion.div
              className="text-sm text-primary font-medium flex items-center"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              Read More
              <ArrowRight className="ml-1 h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;
