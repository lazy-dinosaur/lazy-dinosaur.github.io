"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // 마운트 상태 관리
  const [mounted, setMounted] = useState(false);

  // 테마 변경 애니메이션을 위한 오버레이 생성
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 마운트 상태 업데이트
    setMounted(true);
    
    // 오버레이 생성
    let overlay = document.getElementById('theme-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'theme-overlay';
      document.body.appendChild(overlay);
    }
    
    // 클린업
    return () => {
      overlay?.remove();
    };
  }, []);

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      enableSystem
      onThemeChange={(theme) => {
        // 테마 변경 시 오버레이 활성화 - 성능 최적화
        requestAnimationFrame(() => {
          const overlay = document.getElementById('theme-overlay');
          if (overlay) {
            // 테마에 따라 다른 클래스 적용
            if (theme === 'dark') {
              document.documentElement.classList.add('animating-to-dark');
              document.documentElement.classList.remove('animating-to-light');
            } else {
              document.documentElement.classList.add('animating-to-light');
              document.documentElement.classList.remove('animating-to-dark');
            }
            
            // 애니메이션 활성화
            overlay.classList.add('active');
            
            // 애니메이션 완료 후 정리 - 백그라운드에서 처리
            setTimeout(() => {
              requestAnimationFrame(() => {
                overlay.classList.remove('active');
                document.documentElement.classList.remove('animating-to-dark', 'animating-to-light');
              });
            }, 500); // 시간 단축
          }
        });
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
