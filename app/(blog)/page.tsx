import PostCard from "@/components/post-card";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="space-y-6 sm:space-y-8 2xl:space-y-10 h-full rounded-lg p-1 sm:p-7">
      {/* 헤더 섹션 */}
      <section className="space-y-2 sm:space-y-3 md:space-y-4 ">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
          {`Lazydino's DevLog`}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          내가 한걸 티내기 위해 만든 블로그
        </p>
      </section>

      {/* 포스트 그리드 */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard
              key={post.urlPath}
              urlPath={post.urlPath}
              title={post.title}
              summary={post.summary}
              content={post.content}
              plainContent={post.plainContent}
              image={post.image}
              tags={post.tags}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
