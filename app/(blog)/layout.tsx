import LeftSidebar from "@/components/left-sidebar";
import RightSidebar from "@/components/right-sidebar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LeftSidebar className="w-60 xl:w-64 2xl:w-72 lg:shrink-0 lg:sticky h-full lg:top-16 mb-4 lg:mb-0 mt-52" />
      <div className="xl:max-w-5xl mx-auto rounded-lg w-full overflow-x-hidden p-3 2xl:p-6 h-full">
        {children}
      </div>
      <RightSidebar className="w-60 xl:w-64 2xl:w-72 shrink-0 hidden xl:block sticky top-16 h-full mt-52" />
    </>
  );
}
