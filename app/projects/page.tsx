import { Metadata } from "next";
import ProjectsPage from "./projects-component";

export const metadata: Metadata = {
  title: "프로젝트 | lazydino",
  description: "개발자 lazydino의 프로젝트 포트폴리오",
};

export default function Projects() {
  // 서버 컴포넌트에서는 데이터를 가져오고, 클라이언트 컴포넌트에 전달
  return <ProjectsPage />;
}
