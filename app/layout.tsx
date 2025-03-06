import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import RightSidebar from "../components/RightSidebar";
import { getPosts } from "@/lib/posts";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import { PostsProvider } from "@/contexts/posts-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LazyDino Dev Log",
  description: "내가 한걸 티내기 위해 만든 블로그",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getPosts();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostsProvider posts={posts}>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1 flex flex-col lg:flex-row mt-12 sm:mt-14 md:mt-16 justify-center container mx-auto">
                {/* 좌측 사이드바 - 데스크톱에서만 고정 */}
                <LeftSidebar className="w-full lg:w-52 xl:w-56 2xl:w-64 lg:shrink-0 lg:sticky h-full lg:top-0 mb-4 lg:mb-0 py-16" />

                {/* 메인 콘텐츠 - 중앙 정렬 & 최대 너비 제한 */}
                <div className="max-w-2xl sm:max-w-3xl lg:max-w-5xl mx-auto rounded-lg w-full overflow-x-hidden">
                  {children}
                </div>

                {/* 우측 사이드바 - 큰 화면에서만 표시 */}
                <RightSidebar className="w-52 xl:w-56 2xl:w-64 shrink-0 hidden xl:block sticky top-0 py-16 h-full" />
              </div>
            </div>
          </PostsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
