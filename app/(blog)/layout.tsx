import LeftSidebar from "@/components/left-sidebar";
import RightSidebar from "@/components/right-sidebar";

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<LeftSidebar className="w-60 xl:w-64 2xl:w-72 lg:shrink-0" />
			{/* 높이 관련 클래스 제거 */}
			<div className="xl:max-w-5xl mx-auto rounded-lg w-full overflow-x-hidden py-6 p-3 2xl:px-6">
				{children}
			</div>
			<RightSidebar className="w-60 xl:w-64 2xl:w-72 lg:shrink-0" />
		</>
	);
}
