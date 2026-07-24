# context7.com URL Patterns

## Topic-Specific URLs (Priority #1)

**Pattern:** `http~/.seosona/path/?topic={keyword}`

**When to use:** User asks about specific feature/component

**Examples:**
```
shadcn/ui date picker
→ http~/.seosona/path/?topic=date

Next.js caching
→ http~/.seosona/path/?topic=cache

Better Auth OAuth
→ http~/.seosona/path/?topic=oauth

FFmpeg compression
→ http~/.seosona/path/?topic=compress
```

**Benefits:** Returns ONLY relevant docs, 10x faster, minimal tokens

## General Library URLs (Priority #2)

**GitHub repos:** `http~/.seosona/path/`

**Websites:** `http~/.seosona/path/`

## Known Repository Mappings

```
next.js → vercel/next.js
nextjs → vercel/next.js
astro → withastro/astro
remix → remix-run/remix
shadcn → shadcn-ui/ui
shadcn/ui → shadcn-ui/ui
better-auth → better-auth/better-auth
```

## Official Site Fallbacks

Use ONLY if context7.com unavailable:
```
Astro: http~/.seosona/path/
Next.js: http~/.seosona/path/
Remix: http~/.seosona/path/
SvelteKit: http~/.seosona/path/
```

## Topic Keyword Normalization

**Rules:**
- Lowercase
- Remove special chars
- Use first word for multi-word topics
- Max 20 chars

**Examples:**
```
"date picker" → "date"
"OAuth" → "oauth"
"Server-Side" → "server"
"caching strategies" → "caching"
```
