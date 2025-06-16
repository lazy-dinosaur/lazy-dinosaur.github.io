import type { Metadata } from 'next';

const SITE_URL = 'https://lazy-dino.github.io';
const SITE_NAME = 'Lazy Dino Blog';
const DEFAULT_DESCRIPTION = '개발과 기술에 대한 이야기를 나누는 블로그';
const DEFAULT_AUTHOR = 'Lazy Dino';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  type?: 'website' | 'article';
}

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = '/og-image.svg',
  publishedTime,
  modifiedTime,
  tags = [],
  type = 'website'
}: GenerateMetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    authors: [{ name: DEFAULT_AUTHOR }],
    creator: DEFAULT_AUTHOR,
    publisher: DEFAULT_AUTHOR,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        }
      ],
      locale: 'ko_KR',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [DEFAULT_AUTHOR],
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@lazy_dino',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    keywords: [...tags, '개발', '프로그래밍', '블로그', 'development'],
  };
}

interface JsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  tags?: string[];
}

export function generateArticleJsonLd({
  title,
  description,
  url,
  image = '/og-image.svg',
  datePublished,
  dateModified,
  author = DEFAULT_AUTHOR,
  tags = []
}: JsonLdProps) {
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageUrl,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
  };
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    author: {
      '@type': 'Person',
      name: DEFAULT_AUTHOR,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}