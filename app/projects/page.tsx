import { Metadata } from "next";
import ProjectsPage from "./projects-component";
import { getPosts } from "@/lib/posts";
import { PostsProvider } from "@/contexts/posts-context";

export const metadata: Metadata = {
  title: "포트폴리오 | lazydino",
  description: "개발자 lazydino의 프로젝트 및 학습 포트폴리오",
};

export default async function Projects() {
  // 서버 컴포넌트에서 데이터를 가져와서 클라이언트 컴포넌트에 전달
  const posts = await getPosts();
  
  return (
    <PostsProvider posts={posts}>
      <ProjectsPage />
    </PostsProvider>
  );
}
