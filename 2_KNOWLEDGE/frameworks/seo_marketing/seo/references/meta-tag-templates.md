# Meta Tag Templates

## Title Tag Template

**Formula:** `{Primary Keyword} - {Benefit} | {Brand}`

**Length:** 50-60 characters (display limit ~600px)

```html
<!-- E-commerce Product -->
<title>Nike Air Max 270 - Free Shipping & Returns | Nike Store</title>

<!-- Blog Post -->
<title>10 JavaScript Interview Tips - Ace Your Next Job | DevBlog</title>

<!-- Service Page -->
<title>Affordable Web Design Services - Custom Sites | WebCo</title>

<!-- Homepage -->
<title>Digital Marketing Agency - SEO, PPC & Content | AgencyName</title>
```

**Rules:**
- Primary keyword first 5 words
- Include brand at end
- Avoid keyword stuffing
- Unique per page
- Use pipe (|) or dash (-) as separator

## Meta Description Template

**Formula:** `{Action} {benefit}. {Detail/proof}. {CTA}.`

**Length:** 155-160 characters

```html
<!-- E-commerce -->
<meta name="description" content="Shop Nike Air Max 270 with free 2-day shipping. Lightweight cushioning for all-day comfort. Order now and save 20% on your first purchase.">

<!-- Blog Post -->
<meta name="description" content="Master JavaScript interviews with 10 proven tips from senior developers. Includes code examples and common mistakes to avoid. Read the full guide.">

<!-- Service Page -->
<meta name="description" content="Get a custom website designed for your business. Mobile-responsive, SEO-optimized, and conversion-focused. Free consultation available.">

<!-- Local Business -->
<meta name="description" content="NYC's top-rated Italian restaurant serving authentic cuisine since 1995. Reserve your table online or call (212) 555-0123. See our menu.">
```

**Rules:**
- Start with action verb (Get, Learn, Discover, Shop)
- Include target keyword naturally
- Add social proof/numbers when possible
- End with clear CTA
- Unique per page

## Open Graph Tags (Facebook/LinkedIn)

```html
<!-- Complete OG template -->
<meta property="og:title" content="10 JavaScript Interview Tips - Ace Your Next Job">
<meta property="og:description" content="Master JavaScript interviews with 10 proven tips from senior developers. Includes code examples and common mistakes.">
<meta property="og:image" content="https://example.com/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://example.com/blog/javascript-interview-tips">
<meta property="og:type" content="article">
<meta property="og:site_name" content="DevBlog">
<meta property="og:locale" content="en_US">

<!-- For articles, add: -->
<meta property="article:published_time" content="2025-01-15T08:00:00Z">
<meta property="article:author" content="https://example.com/author/john">
<meta property="article:section" content="JavaScript">
<meta property="article:tag" content="JavaScript">
<meta property="article:tag" content="Interviews">
```

**OG Image Requirements:**
- Size: 1200x630px (1.91:1 ratio)
- Format: JPG or PNG
- Max: 8MB
- Include text overlay (40% of users see no preview text)

## Twitter Card Tags

```html
<!-- Summary Card with Large Image -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourbrand">
<meta name="twitter:creator" content="@authorhandle">
<meta name="twitter:title" content="10 JavaScript Interview Tips - Ace Your Next Job">
<meta name="twitter:description" content="Master JavaScript interviews with 10 proven tips from senior developers. Includes code examples and common mistakes.">
<meta name="twitter:image" content="https://example.com/images/twitter-card.jpg">
<meta name="twitter:image:alt" content="Laptop showing JavaScript code with interview tips checklist">
```

**Card Types:**
- `summary` - Small square image (1:1, 144x144px min)
- `summary_large_image` - Large image (2:1, 300x157px min)
- `app` - Mobile app promotion
- `player` - Video/audio player

## Canonical URL

```html
<!-- Self-referencing (best practice for all pages) -->
<link rel="canonical" href="https://example.com/page">

<!-- Cross-domain canonical (syndicated content) -->
<link rel="canonical" href="https://original-site.com/article">

<!-- Pagination -->
<!-- Page 2 -->
<link rel="canonical" href="https://example.com/blog?page=2">

<!-- Or use view-all canonical -->
<link rel="canonical" href="https://example.com/blog/all">
```

**Rules:**
- Always use absolute URLs
- Use HTTPS version
- Include trailing slash if site uses it
- Must be accessible (200 status)
- Same language/region as page

## Complete Meta Tag Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Primary Meta Tags -->
  <title>Your Page Title - Benefit | Brand</title>
  <meta name="title" content="Your Page Title - Benefit | Brand">
  <meta name="description" content="Compelling description with CTA. 155-160 characters max.">
  <meta name="keywords" content="keyword1, keyword2, keyword3"> <!-- Optional, low value -->
  <meta name="robots" content="index, follow">
  <meta name="language" content="English">
  <meta name="author" content="Author Name">

  <!-- Canonical -->
  <link rel="canonical" href="https://example.com/page">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:title" content="Your Page Title - Benefit">
  <meta property="og:description" content="Compelling description for social sharing.">
  <meta property="og:image" content="https://example.com/images/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Brand Name">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://example.com/page">
  <meta name="twitter:title" content="Your Page Title - Benefit">
  <meta name="twitter:description" content="Compelling description for Twitter.">
  <meta name="twitter:image" content="https://example.com/images/twitter-card.jpg">
  <meta name="twitter:site" content="@yourbrand">
  <meta name="twitter:creator" content="@authorhandle">

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Theme Color -->
  <meta name="theme-color" content="#ffffff">
</head>
<body>
  <!-- Content -->
</body>
</html>
```

## Page-Type Specific Templates

### Homepage
```html
<title>Brand Name - Tagline or Main Benefit</title>
<meta name="description" content="Company description. What you do, who you serve, unique value. CTA.">
```

### Product Page
```html
<title>Product Name - Key Feature | Brand</title>
<meta name="description" content="Product description highlighting main benefit. Price, shipping, guarantee. Buy now.">
```

### Category Page
```html
<title>Category Name - Shop [Product Type] | Brand</title>
<meta name="description" content="Browse [number] [products] in [category]. Free shipping, easy returns. Shop now.">
```

### Blog Post
```html
<title>How to [Achieve Goal] - [Method/Timeframe] | Blog Name</title>
<meta name="description" content="Learn [skill/solution] with [approach]. Includes examples, tips, and [bonus]. Read more.">
```

## Testing Tools

```bash
# Preview meta tags
curl -s https://example.com | grep -E '<title>|<meta'

# Social media debuggers
# Facebook: https://developers.facebook.com/tools/debug/
# Twitter: https://cards-dev.twitter.com/validator
# LinkedIn: https://www.linkedin.com/post-inspector/
```

## Common Mistakes

- Title too long (truncated in SERPs)
- Description too short (< 120 chars, wasted space)
- Missing OG image (poor social sharing)
- Duplicate meta across pages
- Missing canonical tags
- Using HTTP in canonical when site is HTTPS
- OG image too small or wrong ratio
- Not testing social sharing previews
