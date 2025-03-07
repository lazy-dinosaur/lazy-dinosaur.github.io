import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  return (
    <Link href={`/posts/${urlPath}`}>
      <div className="hover:shadow-lg transition-shadow duration-300 h-full group shadow-md rounded-md overflow-hidden bg-card dark:border">
        {thumbnail && (
          <div className="relative w-full min-h-32 sm:min-h-40 md:min-h-48 aspect-video overflow-hidden rounded-md group-hover:shadow-md transition-shadow h-1/2">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>
        )}
        <div
          className={cn(
            "w-full aspect-video p-3 md:p-6 flex flex-col justify-between",
            thumbnail
              ? "min-h-32 sm:min-h-40 md:min-h-48 h-1/2"
              : "min-h-64 sm:min-h-80 md:min-h-96 h-full",
          )}
        >
          <div className="space-y-2">
            <div className="text-base md:text-lg line-clamp-2 font-bold">
              {title}
            </div>
            <p className="text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-5">
              {(summary || plainContent || content).substring(
                0,
                thumbnail ? 200 : 300,
              )}
              ...
            </p>
          </div>
          <div>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Published on {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
