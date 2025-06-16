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
import { generateMetadata, generateWebsiteJsonLd } from "@/lib/metadata";
import Script from "next/script";

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
  preload: true,
  display: "block", // Safari에서 더 나은 렌더링을 위해 'block'으로 변경
});

export const metadata: Metadata = generateMetadata({
  title: undefined,
  description: "개발과 기술에 대한 이야기를 나누는 블로그",
});

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

  const jsonLd = generateWebsiteJsonLd();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${notoSansKr.variable} antialiased transition-all `}
      >
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
