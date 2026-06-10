# Code Review: Asset Preview System

## Scope
- Files reviewed: 6 core files
- Lines analyzed: ~2,000
- Review focus: Recent asset preview implementation
- Plan reviewed: fullstack-developer-251224-1119-elegant-asset-previews.md

## Overall Assessment
**CRITICAL SECURITY ISSUES IDENTIFIED** - Implementation has 13 failing security tests indicating path traversal vulnerabilities in file serving endpoint. Code quality excellent, UX polished, but security gaps must be addressed before production.

## Critical Issues ⚠️

### 1. Path Traversal Protection Incomplete
**Location:** `/server/routes/assets.js:210-258`
**Severity:** CRITICAL
**Impact:** Attackers can access files outside assets directory

**Current implementation blocks:**
- URL-encoded single `..` traversal ✅
- Unix absolute paths ✅
- `..` with extra dots ✅
- Unicode normalization ✅

**Current implementation FAILS to block:**
- Double URL-encoded traversal (`%252E%252E`)
- Mixed encoding (`%2E.`)
- Backslash traversal (`..\\`)
- Mixed slash/backslash (`../\\`)
- Windows absolute paths (`C:\\`)
- Paths starting with `/`
- Simple `..` in segments
- Multiple `..` sequences
- Normalized paths outside boundary
- Null byte injection (`%00`)
- Long paths (DoS)

**Evidence from test failures:**
```
❯ 13 failed tests in security-file-serving.test.js
  - should block double URL-encoded traversal
  - should block mixed encoding traversal
  - should block backslash directory traversal
  - should block mixed slash/backslash traversal
  - should block Windows absolute paths
  - should block paths starting with /
  - should block simple .. traversal
  - should block multiple .. traversal
  - should block hidden .. in path segments
  - should block normalized paths outside boundary
  - should block complex multi-segment traversal
  - should block null byte injection
  - should block overly long paths (DoS)
```

**Root cause:** Line 238 blocks `..` but implementation incomplete:
```javascript
// 4. Block any path containing '..' segments
if (filepath.includes('..')) {
  return c.json({ error: 'Access denied' }, 403);
}
```

This check happens AFTER decodeURIComponent (line 224) but doesn't catch:
- Multiple encoding layers
- Normalization attacks
- Mixed path separators

**Recommendation:** Replace lines 220-250 with comprehensive defense:

```javascript
// Security: Comprehensive path traversal prevention

// 1. URL decode (reject malformed)
try {
  filepath = decodeURIComponent(filepath);
  // Double-decode to catch %252E attacks
  const doubleDecoded = decodeURIComponent(filepath);
  if (doubleDecoded !== filepath) {
    return c.json({ error: 'Access denied' }, 403);
  }
} catch (e) {
  return c.json({ error: 'Access denied' }, 403);
}

// 2. Block null bytes
if (filepath.includes('\0') || filepath.includes('%00')) {
  return c.json({ error: 'Access denied' }, 403);
}

// 3. Length limit (DoS prevention)
if (filepath.length > 255) {
  return c.json({ error: 'Access denied' }, 403);
}

// 4. Normalize separators
filepath = filepath.replace(/\\/g, '/');

// 5. Block absolute paths
if (filepath.startsWith('/') || /^[A-Za-z]:/.test(filepath)) {
  return c.json({ error: 'Access denied' }, 403);
}

// 6. Block any .. sequences (before normalization)
if (filepath.includes('..')) {
  return c.json({ error: 'Access denied' }, 403);
}

// 7. Normalize and resolve
const assetsRoot = resolve(join(__dirname, '../../../../../assets'));
const requestedPath = resolve(join(assetsRoot, normalize(filepath)));

// 8. Final boundary check
const normalizedRoot = assetsRoot.endsWith('/') ? assetsRoot : assetsRoot + '/';
if (!requestedPath.startsWith(normalizedRoot)) {
  return c.json({ error: 'Access denied' }, 403);
}

// 9. Read file (404 if not found)
try {
  const content = readFileSync(requestedPath);
  return new Response(content);
} catch (error) {
  return c.json({ error: 'File not found' }, 404);
}
```

### 2. XSS Risk in Markdown Rendering
**Location:** `/app/src/components/assets/previews/MarkdownPreview.vue:78`
**Severity:** HIGH
**Impact:** Malicious markdown files can execute JavaScript

**Issue:** Using `v-html` without sanitization:
```vue
<div v-html="renderedHtml"></div>
```

Marked library escapes HTML by default, but custom renderer may introduce XSS if markdown contains malicious HTML.

**Recommendation:** Add DOMPurify sanitization:
```bash
npm install dompurify
```

```javascript
import DOMPurify from 'dompurify'

const renderedHtml = computed(() => {
  const html = await marked(parsed.content)
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'em', 'img', 'hr'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id']
  })
})
```

### 3. Missing Error Boundaries in Content Fetch
**Location:** All preview components
**Severity:** MEDIUM
**Impact:** Malformed API responses crash component

**Issue:** No validation of API response structure in:
- `MarkdownPreview.vue:154` - assumes `data.content` exists
- `CodePreview.vue:249` - assumes `data.content` exists
- `ImagePreview.vue:160` - no validation of `local_path`
- `VideoPreview.vue:216` - no validation of `local_path`

**Recommendation:** Add response validation:
```javascript
const response = await fetch(`/api/assets/${props.asset.id}/content`)
if (!response.ok) throw new Error('Failed to load content')

const data = await response.json()
if (!data || typeof data.content !== 'string') {
  throw new Error('Invalid response format')
}
```

## High Priority Findings

### 4. Memory Leak Risk: Event Listeners Not Cleaned Up
**Location:** `MarkdownPreview.vue:201-203`
**Severity:** HIGH
**Impact:** Memory leak if component unmounted before fetch completes

**Issue:** `fetchContent()` called in `onMounted` but no cleanup if component unmounts:
```javascript
onMounted(() => {
  fetchContent()
})
```

If user closes modal during fetch, Promise continues + updates refs on unmounted component.

**Recommendation:** Add abort controller:
```javascript
const abortController = ref(null)

const fetchContent = async () => {
  abortController.value = new AbortController()
  try {
    const response = await fetch(`/api/assets/${props.asset.id}/content`, {
      signal: abortController.value.signal
    })
    // ... rest of fetch logic
  } catch (err) {
    if (err.name === 'AbortError') return
    error.value = err.message
  }
}

onUnmounted(() => {
  abortController.value?.abort()
})
```

**Apply to:** MarkdownPreview.vue, CodePreview.vue

### 5. Keyboard Event Pollution
**Location:** `ImagePreview.vue:268-274`, `VideoPreview.vue:341-348`
**Severity:** MEDIUM
**Impact:** Keyboard shortcuts trigger even when preview closed

**Issue:** Event listeners added to `window` but not removed on unmount:
```javascript
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
```

This pattern correct BUT `handleKeyPress` doesn't check if modal is visible. If parent component caches preview component, shortcuts remain active.

**Recommendation:** Add guard in handler:
```javascript
const handleKeyPress = (e) => {
  if (!props.asset) return // Only if modal visible
  // ... rest of logic
}
```

### 6. Large File Handling Missing
**Location:** All preview components
**Severity:** MEDIUM
**Impact:** Browser freeze on large files (>10MB)

**Issue:** No file size checks before fetch:
- Markdown: Could fetch 100MB markdown file
- Code: Could fetch massive JSON file
- No streaming for large files

**Recommendation:** Add size validation:
```javascript
const MAX_PREVIEW_SIZE = 10 * 1024 * 1024 // 10MB

const fetchContent = async () => {
  if (props.asset.size_bytes > MAX_PREVIEW_SIZE) {
    error.value = `File too large for preview (${formatSize(props.asset.size_bytes)}). Maximum: 10MB`
    loading.value = false
    return
  }
  // ... proceed with fetch
}
```

### 7. Content Type Validation Missing
**Location:** `server/routes/assets.js:169-207`
**Severity:** MEDIUM
**Impact:** Binary files served as UTF-8 causing corruption

**Issue:** Content endpoint reads all files as UTF-8:
```javascript
const content = readFileSync(filePath, 'utf-8')
```

No validation if file is actually text. Binary files (images served through this endpoint) will corrupt.

**Recommendation:** Add MIME type check:
```javascript
const textFormats = ['md', 'json', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'xml', 'txt', 'py', 'sh', 'bash']
if (!textFormats.includes(asset.format.toLowerCase())) {
  return c.json({ error: 'Content preview not available for binary files' }, 400)
}
```

## Medium Priority Improvements

### 8. Vue Composition API Pattern Violations
**Location:** Multiple files
**Severity:** LOW
**Impact:** Inconsistent code patterns

**Issues:**
1. `watch` imported inline in CodePreview.vue:351 instead of top-level
2. Duplicate `formatSize` utility in 4 files (AssetPreview.vue:231, ImagePreview.vue:244, VideoPreview.vue:308, CodePreview.vue:331)
3. Mixed reactive patterns (`ref` vs `computed`)

**Recommendation:**
- Extract utilities to `/src/utils/formatters.js`
- Import `watch` at top of script setup
- Consistent reactive pattern usage

### 9. Error State UX Improvements
**Location:** All preview components
**Severity:** LOW
**Impact:** Poor error recovery UX

**Current:** Error shows message but no retry action
**Recommendation:** Add retry button:
```vue
<div v-else-if="error" class="p-6">
  <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
    <p class="text-red-400 mb-3">{{ error }}</p>
    <button @click="fetchContent" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
      Retry
    </button>
  </div>
</div>
```

### 10. Accessibility Gaps
**Location:** All preview components
**Severity:** LOW
**Impact:** Screen reader users cannot navigate

**Missing:**
- ARIA labels on icon-only buttons
- Focus trap in modal
- Keyboard navigation for TOC
- Alt text generation for images

**Recommendation:**
```vue
<button
  @click="handleClose"
  aria-label="Close preview"
  class="..."
>
  <svg aria-hidden="true" ...>
```

### 11. Code Search Implementation Incomplete
**Location:** `CodePreview.vue:298-312`
**Severity:** LOW
**Impact:** Search feature non-functional

**Issue:** `scrollToMatch()` function is stub:
```javascript
const scrollToMatch = (index) => {
  currentMatchIndex.value = index
  // Implement scroll to line logic here
}
```

**Recommendation:** Implement scroll:
```javascript
const scrollToMatch = (index) => {
  currentMatchIndex.value = index
  const lineNumber = searchMatches.value[index]
  const lineElement = codeContainerRef.value?.querySelector(`[data-line="${lineNumber}"]`)
  lineElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
```

## Low Priority Suggestions

### 12. Performance: Lazy Load Highlight.js Languages
**Location:** `MarkdownPreview.vue:88-108`, `CodePreview.vue:162-182`
**Impact:** Faster initial load

**Current:** Registers all 8 languages upfront
**Recommendation:** Dynamic import based on detected language

### 13. Video Autoplay Risk
**Location:** `VideoPreview.vue`
**Impact:** Unexpected audio on open

**Observation:** Video doesn't autoplay (correct), but no explicit `autoplay={false}` attribute.
**Recommendation:** Add explicit `autoplay="false"` for clarity.

### 14. Image Aspect Ratio Calculation Edge Case
**Location:** `ImagePreview.vue:166-173`
**Impact:** Division by zero if GCD fails

**Recommendation:** Add fallback:
```javascript
const aspectRatio = computed(() => {
  if (!imageDimensions.value.width || !imageDimensions.value.height) return 'Unknown'
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(imageDimensions.value.width, imageDimensions.value.height)
  if (divisor === 0) return 'Custom'
  return `${imageDimensions.value.width / divisor}:${imageDimensions.value.height / divisor}`
})
```

## Positive Observations ✅

**Excellent code quality:**
- Clean Vue 3 Composition API usage
- Proper reactive state management
- Consistent naming conventions
- Well-structured component hierarchy

**Strong UX implementation:**
- Keyboard shortcuts comprehensive
- Loading states properly handled
- Smooth transitions and animations
- Responsive design patterns

**Good practices:**
- Event listener cleanup in onUnmounted
- Computed properties for derived state
- Props validation with types
- Error state handling

**Security awareness shown:**
- Path traversal checks attempted (needs strengthening)
- Error messages don't leak paths
- Input sanitization attempted

## Build Status

**Build:** ✅ Passes (969ms)
**Bundle size:** 382.06 kB (114.52 kB gzipped)
**Note:** Gray-matter eval warning is library-internal, acceptable

**Test results:**
- ✅ 71 passing tests
- ❌ 14 failing tests (all security-related)
- Test coverage: Assets API, AI routes, security

## Task Completeness Verification

**Plan:** fullstack-developer-251224-1119-elegant-asset-previews.md

**Completed tasks:**
- ✅ MarkdownPreview.vue with frontmatter + TOC
- ✅ ImagePreview.vue with zoom/pan
- ✅ VideoPreview.vue with custom controls
- ✅ CodePreview.vue with syntax highlighting
- ✅ AssetPreview.vue smart router
- ✅ Server API content endpoint
- ✅ Build passes
- ✅ Theme consistency

**Incomplete tasks:**
- ❌ Security tests failing (13 tests)
- ❌ Code search not implemented (stub)
- ⚠️ XSS sanitization missing

**Plan status:** 85% complete - core features done, security hardening required

## Recommended Actions

**Priority 1 - CRITICAL (Block production):**
1. Fix path traversal vulnerabilities in `/server/routes/assets.js:210-258` (see issue #1)
2. Add DOMPurify sanitization to MarkdownPreview.vue (see issue #2)
3. Add abort controllers to async fetches (see issue #4)

**Priority 2 - HIGH (Complete before deployment):**
4. Add file size limits to preview components (see issue #6)
5. Add content type validation to server endpoint (see issue #7)
6. Fix response validation in all preview components (see issue #3)

**Priority 3 - MEDIUM (Quality improvements):**
7. Extract duplicate utilities to shared module (see issue #8)
8. Add retry buttons to error states (see issue #9)
9. Implement code search scroll functionality (see issue #11)

**Priority 4 - LOW (Future enhancements):**
10. Add ARIA labels and focus management (see issue #10)
11. Lazy load highlight.js languages (see issue #12)
12. Add aspect ratio edge case handling (see issue #14)

## Metrics

- **Critical issues:** 3
- **High priority:** 4
- **Medium priority:** 4
- **Low priority:** 3
- **Total findings:** 14
- **Positive observations:** 8
- **Security test failures:** 14 (13 path traversal + 1 env config)
- **Build time:** 969ms ✅
- **Lines of code:** ~2,000
- **Files reviewed:** 6

## Conclusion

**APPROVAL STATUS: ❌ BLOCKED**

Implementation demonstrates strong frontend engineering skills with excellent UX, but **CRITICAL security vulnerabilities** in path traversal protection must be addressed before production deployment.

**Estimated fix time:** 2-4 hours
**Retest required:** Yes - run `npm run test` in server directory after fixes

**Next review checkpoint:** After implementing Priority 1-2 fixes, resubmit for security approval.

---

**Reviewer:** code-reviewer subagent
**Date:** 2025-12-24
**Review duration:** ~15 minutes
