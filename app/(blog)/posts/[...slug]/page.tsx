import Link from "next/link";
import { getPost, getPosts, getAdjacentPosts } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";
import PostAnimation from "@/components/post-animation";
import PostContent from "./post-content";
import {
	generateMetadata as generateSEOMetadata,
	generateArticleJsonLd,
	generateBreadcrumbJsonLd,
} from "@/lib/metadata";
import Script from "next/script";
import type { Metadata } from "next";

interface PostPageProps {
	params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
	params,
}: PostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const decodedSlug = slug
		.map((s) => {
			try {
				return decodeURIComponent(s);
			} catch {
				return s;
			}
		})
		.filter(Boolean);

	const post = await getPost(decodedSlug);

	if (!post) {
		return generateSEOMetadata({
			title: "포스트를 찾을 수 없습니다",
			description: "요청하신 포스트를 찾을 수 없습니다.",
		});
	}

	// 포스트 제목 추출
	const titleMatch = post.content.match(/^#\s+(.+)$/m);
	const title = titleMatch
		? titleMatch[1]
		: post.urlPath.split("/").pop() || "제목 없음";

	// 포스트 설명 추출 (첫 번째 단락)
	const contentWithoutTitle = post.content.replace(/^#\s+.+$/m, "").trim();
	const descriptionMatch = contentWithoutTitle.match(/^(.+?)(?:\n|$)/);
	const description = descriptionMatch
		? descriptionMatch[1].replace(/[#*`]/g, "").trim().substring(0, 160)
		: "블로그 포스트";

	return generateSEOMetadata({
		title,
		description,
		path: `/posts/${post.urlPath}`,
		publishedTime: post.createdAt,
		modifiedTime: post.modifiedAt,
		tags: post.tags,
		type: "article",
	});
}

export async function generateStaticParams() {
	const posts = await getPosts();
	if (posts.length === 0) {
		return [{ slug: ["no-post"] }];
	}

	// 로깅 추가
	console.log("Generating static params for posts:");

	return posts.map((post) => {
		// 인코딩하지 않고 원래 경로 세그먼트 사용
		const slugSegments = post.urlPath.split("/");
		console.log(
			`Post path: ${post.urlPath} -> Segments: ${slugSegments.join("/")}`,
		);

		return {
			slug: slugSegments,
		};
	});
}

export default async function PostPage({ params }: PostPageProps) {
	const { slug } = await params;
	console.log("Raw URL slug segments:", slug);

	// 모든 세그먼트를 명시적으로 디코딩
	const decodedSlug = slug
		.map((s) => {
			try {
				return decodeURIComponent(s);
			} catch {
				console.error(`Failed to decode segment "${s}"`);
				return s; // 디코딩 실패 시 원본 유지
			}
		})
		.filter(Boolean);

	console.log("Decoded slug:", decodedSlug);
	const post = await getPost(decodedSlug);

	if (!post) {
		return (
			<article className="rounded-lg p-2 sm:p-7 max-w-3xl mx-auto">
				<h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
					포스트를 찾을 수 없습니다.
				</h1>
				<Link
					href="/"
					className="text-primary hover:underline inline-flex items-center text-sm sm:text-base"
				>
					<ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
					홈으로 돌아가기
				</Link>
			</article>
		);
	}

	const publishPath = post.urlPath.split("/").slice(0, -1).join("/");

	// 이전/다음 게시물 가져오기
	const { prev, next } = await getAdjacentPosts(post);

	// 포스트 제목 추출
	const titleMatch = post.content.match(/^#\s+(.+)$/m);
	const title = titleMatch
		? titleMatch[1]
		: post.urlPath.split("/").pop() || "제목 없음";

	// 포스트 설명 추출
	const contentWithoutTitle = post.content.replace(/^#\s+.+$/m, "").trim();
	const descriptionMatch = contentWithoutTitle.match(/^(.+?)(?:\n|$)/);
	const description = descriptionMatch
		? descriptionMatch[1].replace(/[#*`]/g, "").trim().substring(0, 160)
		: "블로그 포스트";

	// JSON-LD 생성
	const articleJsonLd = generateArticleJsonLd({
		title,
		description,
		url: `https://lazy-dino.github.io/posts/${post.urlPath}`,
		datePublished: post.createdAt,
		dateModified: post.modifiedAt,
		tags: post.tags,
	});

	const breadcrumbJsonLd = generateBreadcrumbJsonLd([
		{ name: "홈", url: "https://lazy-dino.github.io" },
		{ name: "포스트", url: "https://lazy-dino.github.io/posts" },
		{ name: title, url: `https://lazy-dino.github.io/posts/${post.urlPath}` },
	]);

	return (
		<>
			<Script
				id="article-jsonld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>
			<Script
				id="breadcrumb-jsonld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<PostAnimation>
				<PostContent
					content={post.content}
					publishPath={publishPath}
					published={post.createdAt}
					modified={post.modifiedAt}
					tags={post.tags}
					prevPost={prev}
					nextPost={next}
				/>
			</PostAnimation>
		</>
	);
}
