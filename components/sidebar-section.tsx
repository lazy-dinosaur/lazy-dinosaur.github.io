export const SidebarSection = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="mb-6 sm:mb-8 md:mb-10">
    <h2 className="text-base 2xl:text-lg font-semibold mb-3 sm:mb-4 md:mb-5 px-2 sm:px-3 pb-2 border-b border-border/50 flex items-center transition-colors">
      <span className="w-1 h-4 bg-primary rounded-full mr-2 opacity-60" />
      {title}
    </h2>
    <div className="px-1 sm:px-2">{children}</div>
  </div>
);
