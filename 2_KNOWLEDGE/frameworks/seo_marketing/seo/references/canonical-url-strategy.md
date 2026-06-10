# Canonical URL Strategy

## What is a Canonical Tag?

Tells search engines which version of a page is the "master" when duplicate/similar content exists.

```html
<link rel="canonical" href="https://example.com/preferred-url">
```

## When to Use Canonical Tags

### 1. Self-Referencing Canonicals (Best Practice)
Every page should have a canonical pointing to itself.

```html
<!-- On: https://example.com/blog/seo-tips -->
<link rel="canonical" href="https://example.com/blog/seo-tips">
```

**Benefits:**
- Prevents parameter-based duplicates
- Protects against URL manipulation
- Clarifies preferred URL version

### 2. URL Parameters (Tracking, Filters, Sorting)

```html
<!-- All these point to canonical: -->
<!-- https://shop.com/shoes?utm_source=email -->
<!-- https://shop.com/shoes?color=red&size=10 -->
<!-- https://shop.com/shoes?sort=price -->

<link rel="canonical" href="https://shop.com/shoes">
```

### 3. HTTP vs HTTPS / www vs non-www

```html
<!-- All variations point to preferred version -->
<!-- On: http://example.com -->
<!-- On: http://www.example.com -->
<!-- On: https://example.com -->

<link rel="canonical" href="https://www.example.com">
```

### 4. Pagination

**Option A: Each page canonical to itself**
```html
<!-- Page 1: https://blog.com/posts -->
<link rel="canonical" href="https://blog.com/posts">
<link rel="next" href="https://blog.com/posts?page=2">

<!-- Page 2: https://blog.com/posts?page=2 -->
<link rel="canonical" href="https://blog.com/posts?page=2">
<link rel="prev" href="https://blog.com/posts">
<link rel="next" href="https://blog.com/posts?page=3">
```

**Option B: All pages point to "View All"**
```html
<!-- Page 1, 2, 3 all point to: -->
<link rel="canonical" href="https://blog.com/posts/all">
```

**Best Practice:** Use Option A unless you have a genuine "View All" page.

### 5. Syndicated/Duplicate Content

When republishing content on another domain:

```html
<!-- On: https://medium.com/@you/article -->
<link rel="canonical" href="https://yourblog.com/article">
```

**Rules:**
- Original site gets the credit
- Syndicated version must include canonical
- Both pages should be nearly identical

### 6. Similar Products (Variants)

```html
<!-- Red T-Shirt: https://shop.com/tshirt-red -->
<!-- Blue T-Shirt: https://shop.com/tshirt-blue -->
<!-- Green T-Shirt: https://shop.com/tshirt-green -->

<!-- If content is 90%+ identical, pick one: -->
<link rel="canonical" href="https://shop.com/tshirt">

<!-- Or keep separate if significantly different -->
```

### 7. Mobile vs Desktop Versions (Legacy)

```html
<!-- Desktop: https://example.com/page -->
<link rel="canonical" href="https://example.com/page">
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.example.com/page">

<!-- Mobile: https://m.example.com/page -->
<link rel="canonical" href="https://example.com/page">
```

**Note:** Responsive design (single URL) is now preferred.

## Cross-Domain Canonicals

When you control multiple domains with duplicate content:

```html
<!-- On: https://site-b.com/article -->
<link rel="canonical" href="https://site-a.com/article">
```

**Use Cases:**
- International sites (.com, .co.uk, .de)
- Brand acquisitions (old-brand.com → new-brand.com)
- Content syndication (Medium, LinkedIn)

**Warning:** Cross-domain canonical tells Google to ignore the page. Use only when intentional.

## Canonical vs 301 Redirect

| Scenario | Use Canonical | Use 301 Redirect |
|----------|---------------|------------------|
| Duplicate content, both accessible | ✅ | ❌ |
| Old URL no longer needed | ❌ | ✅ |
| Tracking parameters | ✅ | ❌ |
| Pagination | ✅ | ❌ |
| HTTP → HTTPS migration | ❌ | ✅ |
| Domain migration | ❌ | ✅ |
| Syndicated content | ✅ | ❌ |
| Product variants | ✅ | ⚠️ |

**Rule:** If users should never see old URL, use 301. If both should be accessible, use canonical.

## Common Mistakes

### ❌ Canonical Chain
```html
<!-- Page A -->
<link rel="canonical" href="https://example.com/b">

<!-- Page B -->
<link rel="canonical" href="https://example.com/c">
```
**Fix:** Point directly to final canonical.

### ❌ Canonical to Non-Canonical
```html
<!-- Page -->
<link rel="canonical" href="https://example.com/page">

<!-- Canonical target has: -->
<meta name="robots" content="noindex">
```
**Fix:** Canonical target must be indexable.

### ❌ Canonical to 404/301
```html
<link rel="canonical" href="https://example.com/deleted-page"> <!-- 404 -->
```
**Fix:** Canonical must return 200 status.

### ❌ Relative URLs
```html
<!-- Bad -->
<link rel="canonical" href="/blog/post">

<!-- Good -->
<link rel="canonical" href="https://example.com/blog/post">
```
**Fix:** Always use absolute URLs.

### ❌ Multiple Canonicals
```html
<link rel="canonical" href="https://example.com/page-a">
<link rel="canonical" href="https://example.com/page-b">
```
**Fix:** Only one canonical per page. Google may ignore both.

### ❌ Canonical to Different Content
```html
<!-- Page about dogs -->
<link rel="canonical" href="https://example.com/cats">
```
**Fix:** Canonical should point to very similar content (90%+ overlap).

## Implementation Examples

### React/Next.js
```jsx
// pages/blog/[slug].js
import Head from 'next/head';

export default function BlogPost({ post }) {
  const canonicalUrl = `https://example.com/blog/${post.slug}`;

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      {/* Content */}
    </>
  );
}
```

### Express.js
```javascript
app.get('/product/:id', (req, res) => {
  const canonicalUrl = `https://example.com/product/${req.params.id}`;

  res.send(`
    <head>
      <link rel="canonical" href="${canonicalUrl}">
    </head>
  `);
});
```

### WordPress
```php
<!-- WordPress handles automatically, but override: -->
<?php
function custom_canonical() {
  if (is_singular()) {
    $canonical = get_permalink();
    echo '<link rel="canonical" href="' . esc_url($canonical) . '">';
  }
}
add_action('wp_head', 'custom_canonical', 1);
```

### Static HTML
```html
<head>
  <link rel="canonical" href="https://example.com/page">
</head>
```

## Validation Checklist

- [ ] Every page has canonical tag
- [ ] Canonical URLs are absolute (not relative)
- [ ] Canonical target returns 200 status
- [ ] Canonical target is indexable (no noindex)
- [ ] No canonical chains (A→B→C)
- [ ] Only one canonical per page
- [ ] Canonical points to same language/region
- [ ] HTTPS canonical for HTTPS pages
- [ ] Trailing slash matches site convention
- [ ] Cross-domain canonicals intentional

## Testing Tools

```bash
# Check canonical tag
curl -s https://example.com | grep -i canonical

# Verify canonical target is 200
curl -I https://example.com/canonical-url

# View all meta tags
curl -s https://example.com | grep -E '<link|<meta'
```

```javascript
// JavaScript check
const canonical = document.querySelector('link[rel="canonical"]');
console.log(canonical?.href);
```

## When NOT to Use Canonical

- Genuinely unique content
- Intentional duplicate pages (print versions, archives)
- Pages you want indexed separately
- 301 redirect is more appropriate

**Remember:** Canonical is a hint, not a directive. Google may ignore it if signals contradict (e.g., internal links point to non-canonical version).
