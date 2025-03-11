import Link from "next/link";
import { getPost, getPosts, getAdjacentPosts } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";
import PostAnimation from "@/components/post-animation";
import PostContent from "./post-content";

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  if (posts.length === 0) {
    return [{ slug: ["no-post"] }];
  }

  return posts.map((post) => ({
    slug: decodeURIComponent(post.urlPath).split("/"),
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const decodedSlug = slug.map((s) => decodeURIComponent(s)).filter(Boolean);
  const post = await getPost(decodedSlug);

  if (!post) {
    return (
      <article className="rounded-lg p-2 sm:p-7 max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          포스트를 찾을 수 없습니다.
        </h1>
        <Link
          href="/"
          className="text-primary hover:underline inline-flex items-center text-sm sm:text-base"
        >
          <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          홈으로 돌아가기
        </Link>
      </article>
    );
  }

  const publishPath = post.urlPath.split("/").slice(0, -1).join("/");

  // 이전/다음 게시물 가져오기
  const { prev, next } = await getAdjacentPosts(post);

  return (
    <PostAnimation>
      <PostContent
        content={post.content}
        publishPath={publishPath}
        published={post.createdAt}
        modified={post.modifiedAt}
        tags={post.tags}
        prevPost={prev}
        nextPost={next}
      />
    </PostAnimation>
  );
}
