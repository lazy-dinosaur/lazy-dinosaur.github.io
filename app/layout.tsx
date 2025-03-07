import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getPosts } from "@/lib/posts";
import Header from "../components/header";
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
              <div className="flex-1 flex flex-col xl:flex-row mt-12 sm:mt-14 md:mt-16 2xl:container 2xl:mx-auto md:px-5">
                {children}
              </div>
            </div>
          </PostsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
