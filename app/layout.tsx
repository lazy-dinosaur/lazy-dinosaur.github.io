import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getPosts, getPostsMetadata } from "@/lib/posts";
import Header from "../components/header";
import { PostsProvider } from "@/contexts/posts-context";
import Footer from "@/components/footer";
import LeftSidebarSheet from "@/components/left-sidebar-sheet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
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
  // 메타데이터와 기본 포스트 콘텐츠를 병렬로 가져옴
  const [postsMetadata, posts] = await Promise.all([
    getPostsMetadata(),
    getPosts(),
  ]);

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${notoSansKr.variable} antialiased transition-all`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostsProvider posts={posts} postsMetadata={postsMetadata}>
            <div className="min-h-screen flex flex-col motion-reduce">
              <Header />
              <main className="flex flex-col xl:flex-row mt-12 sm:mt-14 md:mt-16 2xl:container 2xl:mx-auto md:px-5">
                <LeftSidebarSheet />
                {children}
              </main>
              <Footer />
            </div>
          </PostsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
