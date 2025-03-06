export const SidebarSection = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="mb-6 sm:mb-8 md:mb-10">
    <h2 className="text-base 2xl:text-lg font-semibold mb-3 sm:mb-4 md:mb-5 px-1 sm:px-2 border-b pb-2">
      {title}
    </h2>
    {children}
  </div>
);
