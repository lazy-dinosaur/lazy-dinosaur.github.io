const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const SITE_URL = 'https://lazy-dino.github.io';
const POSTS_DIR = path.join(__dirname, '../content/posts');
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

function getAllPosts() {
  const posts = [];
  const files = fs.readdirSync(POSTS_DIR);
  
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const publishMatch = frontmatter.match(/publish:\s*(true|false)/);
        const dateMatch = frontmatter.match(/date:\s*"?(\d{4}-\d{2}-\d{2})"?/);
        
        if (publishMatch && publishMatch[1] === 'true') {
          const slug = file.replace('.md', '');
          const date = dateMatch ? new Date(dateMatch[1]) : new Date();
          
          posts.push({
            slug,
            date,
            priority: 0.8
          });
        }
      }
    }
  });
  
  return posts.sort((a, b) => b.date - a.date);
}

function generateSitemap() {
  const posts = getAllPosts();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // sitemap.xml 내용을 out 폴더에도 복사해야 함
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${posts.map(post => `  <url>
    <loc>${SITE_URL}/posts/${post.slug}</loc>
    <lastmod>${format(post.date, 'yyyy-MM-dd')}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // public 폴더에 저장
  fs.writeFileSync(OUTPUT_PATH, sitemap);
  
  // out 폴더가 있으면 거기에도 복사
  const outPath = path.join(__dirname, '../out/sitemap.xml');
  if (fs.existsSync(path.dirname(outPath))) {
    fs.writeFileSync(outPath, sitemap);
  }
  
  console.log(`✅ Sitemap generated at ${OUTPUT_PATH}`);
  console.log(`📝 Total pages: ${posts.length + 2}`);
}

generateSitemap();