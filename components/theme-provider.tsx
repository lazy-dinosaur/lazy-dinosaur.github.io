"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // 마운트 상태 관리
  const [mounted, setMounted] = useState(false);

  // 마운트 상태만 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
