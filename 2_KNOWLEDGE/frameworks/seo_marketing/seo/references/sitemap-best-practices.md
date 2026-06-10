# Sitemap Best Practices

## XML Sitemap Basics

XML sitemap lists URLs on your site for search engines to discover and crawl.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Required Tags

### `<loc>` (required)
URL of the page. Must be absolute URL.

```xml
<loc>https://example.com/blog/article</loc>
```

**Rules:**
- Use HTTPS (if site is HTTPS)
- Must be < 2,048 characters
- Properly escaped (`&` → `&amp;`)
- Should return 200 status

### `<lastmod>` (recommended)
Last modification date in W3C format.

```xml
<lastmod>2025-01-15</lastmod>
<!-- or with time -->
<lastmod>2025-01-15T14:30:00+00:00</lastmod>
```

**Rules:**
- Format: YYYY-MM-DD or full ISO 8601
- Must be accurate (Google ignores if incorrect)
- Update when content changes significantly

### `<changefreq>` (optional, low value)
How frequently page changes.

```xml
<changefreq>daily</changefreq>
```

**Values:** `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`

**Note:** Google largely ignores this. Use `lastmod` instead.

### `<priority>` (optional, low value)
Relative priority (0.0 to 1.0).

```xml
<priority>0.8</priority>
```

**Default:** 0.5

**Note:** Google ignores this. All pages get equal weight.

## Complete Sitemap Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Homepage -->
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Product page -->
  <url>
    <loc>https://example.com/products/item-1</loc>
    <lastmod>2025-01-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog post -->
  <url>
    <loc>https://example.com/blog/post-1</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>never</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>
```

## Sitemap Index (for large sites)

Use when > 50,000 URLs or > 50MB file size.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
    <lastmod>2025-01-15</lastmod>
  </sitemap>

  <sitemap>
    <loc>https://example.com/sitemap-blog.xml</loc>
    <lastmod>2025-01-14</lastmod>
  </sitemap>

  <sitemap>
    <loc>https://example.com/sitemap-images.xml</loc>
    <lastmod>2025-01-12</lastmod>
  </sitemap>

</sitemapindex>
```

**Split by:**
- Content type (products, blog, pages)
- Update frequency (daily, weekly, monthly)
- Language/region
- Date (for news sites: sitemap-2025-01.xml)

## Image Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <url>
    <loc>https://example.com/page</loc>

    <image:image>
      <image:loc>https://example.com/images/photo1.jpg</image:loc>
      <image:caption>Image caption</image:caption>
      <image:title>Image title</image:title>
      <image:geo_location>New York, USA</image:geo_location>
      <image:license>https://example.com/license</image:license>
    </image:image>

    <image:image>
      <image:loc>https://example.com/images/photo2.jpg</image:loc>
    </image:image>

  </url>
</urlset>
```

**Rules:**
- Max 1,000 images per `<url>`
- Only `<image:loc>` is required
- Use for images you want in Google Images

## Video Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <url>
    <loc>https://example.com/video-page</loc>

    <video:video>
      <video:thumbnail_loc>https://example.com/thumbs/video.jpg</video:thumbnail_loc>
      <video:title>Video Title</video:title>
      <video:description>Video description (max 2048 chars)</video:description>
      <video:content_loc>https://example.com/video.mp4</video:content_loc>
      <video:player_loc>https://example.com/player?video=123</video:player_loc>
      <video:duration>600</video:duration>
      <video:publication_date>2025-01-15T08:00:00+00:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:uploader info="https://example.com/about">Example Studio</video:uploader>
      <video:live>no</video:live>
    </video:video>

  </url>
</urlset>
```

**Required:** `thumbnail_loc`, `title`, `description`, (`content_loc` OR `player_loc`)

## News Sitemap (for news publishers)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

  <url>
    <loc>https://example.com/news/article-1</loc>

    <news:news>
      <news:publication>
        <news:name>Example News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2025-01-15T08:00:00+00:00</news:publication_date>
      <news:title>Breaking News Title</news:title>
    </news:news>

  </url>
</urlset>
```

**Rules:**
- Only include articles from last 2 days
- Update continuously as new articles publish
- Requires Google News approval

## Sitemap Submission

### robots.txt
```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-images.xml
```

### Google Search Console
1. Go to Search Console → Sitemaps
2. Enter sitemap URL: `sitemap.xml`
3. Click Submit

### Bing Webmaster Tools
1. Go to Bing Webmaster → Sitemaps
2. Submit sitemap URL
3. Monitor crawl status

### Ping Search Engines (legacy)
```bash
# Google
curl "https://www.google.com/ping?sitemap=https://example.com/sitemap.xml"

# Bing
curl "https://www.bing.com/ping?sitemap=https://example.com/sitemap.xml"
```

**Note:** Submission via Search Console is preferred.

## What to Include

✅ **Include:**
- All public pages (200 status)
- Canonical URLs only
- Indexable content (no noindex)
- Important pages you want crawled

❌ **Exclude:**
- Pages blocked by robots.txt
- Pages with noindex tag
- Redirect URLs (301, 302)
- Error pages (404, 500)
- Duplicate content (include canonical only)
- Admin/login pages
- Low-value pages (tag pages, filters)

## Dynamic Sitemap Generation

### Node.js/Express
```javascript
const express = require('express');
const app = express();

app.get('/sitemap.xml', async (req, res) => {
  const posts = await getPostsFromDB();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts.map(post => `
      <url>
        <loc>https://example.com/blog/${post.slug}</loc>
        <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
      </url>
    `).join('')}
  </urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});
```

### Next.js (App Router)
```javascript
// app/sitemap.js
export default async function sitemap() {
  const posts = await getPosts();

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map(post => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
  ];
}
```

### WordPress
```php
// Use Yoast SEO or RankMath (handles automatically)
// Or generate custom:
function generate_custom_sitemap() {
  header('Content-Type: application/xml; charset=utf-8');
  echo '<?xml version="1.0" encoding="UTF-8"?>';
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  $posts = get_posts(['numberposts' => -1]);
  foreach ($posts as $post) {
    echo '<url>';
    echo '<loc>' . get_permalink($post) . '</loc>';
    echo '<lastmod>' . get_the_modified_date('Y-m-d', $post) . '</lastmod>';
    echo '</url>';
  }

  echo '</urlset>';
}
```

## Validation & Testing

```bash
# Validate XML syntax
xmllint --noout sitemap.xml

# Check sitemap file size
ls -lh sitemap.xml

# Count URLs
grep -c '<loc>' sitemap.xml

# Test HTTP status
curl -I https://example.com/sitemap.xml
```

**Online validators:**
- XML Sitemap Validator: xml-sitemaps.com/validate-xml-sitemap.html
- Google Search Console (automatic validation)

## Common Mistakes

- Sitemap > 50MB or > 50,000 URLs (use index)
- Including non-canonical URLs
- Including noindex pages
- Incorrect lastmod dates (Google ignores sitemap)
- Relative URLs instead of absolute
- Not escaping special characters (`&`, `<`, `>`)
- Sitemap returns 404 or non-200 status
- Not declaring sitemap in robots.txt
- Including parameters/filters as separate URLs
- Forgetting to update sitemap after content changes

## Checklist

- [ ] Sitemap accessible at /sitemap.xml
- [ ] Returns 200 status
- [ ] Valid XML (no syntax errors)
- [ ] Only canonical URLs included
- [ ] All URLs return 200 status
- [ ] No noindex pages included
- [ ] Absolute URLs (https://)
- [ ] lastmod dates accurate
- [ ] Declared in robots.txt
- [ ] Submitted to Search Console
- [ ] Updates automatically when content changes
- [ ] < 50MB and < 50,000 URLs per file
- [ ] Uses sitemap index if needed
- [ ] Compressed (gzip) if > 10MB
