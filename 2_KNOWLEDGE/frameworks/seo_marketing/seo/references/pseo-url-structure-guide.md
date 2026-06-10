# pSEO URL Structure Guide

URL patterns and generation rules for programmatic SEO at scale.

## Recommended URL Patterns

### 1. Location-Based Services

```
Pattern: /{service}/{location}/
Examples:
  /plumber/austin-tx/
  /dentist/miami-fl/
  /lawyer/new-york-ny/

Pattern: /{location}/{service}/
Examples:
  /austin-tx/plumber/
  /miami-fl/dentist/
  /new-york-ny/lawyer/
```

**Best Choice:** `/{service}/{location}/` (service is broader category)

### 2. Comparison Pages

```
Pattern: /compare/{item-a}-vs-{item-b}/
Examples:
  /compare/notion-vs-coda/
  /compare/react-vs-vue/
  /compare/iphone-15-vs-samsung-s24/

Pattern: /{item-a}-vs-{item-b}/
Examples:
  /notion-vs-coda/
  /react-vs-vue/
  /iphone-15-vs-samsung-s24/
```

**Best Choice:** `/{item-a}-vs-{item-b}/` (shorter, cleaner)

### 3. Integration/Compatibility Pages

```
Pattern: /integrations/{product-a}-{product-b}/
Examples:
  /integrations/slack-asana/
  /integrations/zapier-hubspot/

Pattern: /{product-a}-{product-b}-integration/
Examples:
  /slack-asana-integration/
  /zapier-hubspot-integration/
```

### 4. Glossary/Definition Pages

```
Pattern: /glossary/{term}/
Examples:
  /glossary/api/
  /glossary/machine-learning/

Pattern: /what-is/{term}/
Examples:
  /what-is/api/
  /what-is/machine-learning/
```

### 5. Statistics Pages

```
Pattern: /stats/{topic}-{year}/
Examples:
  /stats/remote-work-2025/
  /stats/ecommerce-2025/

Pattern: /{topic}-statistics/
Examples:
  /remote-work-statistics/
  /ecommerce-statistics/
```

### 6. Multi-Variable Pages

```
Pattern: /{category}/{subcategory}/{location}/
Examples:
  /healthcare/dentist/austin-tx/
  /legal/divorce-lawyer/chicago-il/
  /home-services/plumber/seattle-wa/
```

## URL Generation Rules

### 1. Lowercase Only

```javascript
// Bad
url: '/Plumber/Austin-TX/'

// Good
url: '/plumber/austin-tx/'
```

### 2. Hyphen-Separated (kebab-case)

```javascript
// Bad
url: '/new_york_plumber/'      // underscores
url: '/newYorkPlumber/'         // camelCase
url: '/new york plumber/'       // spaces

// Good
url: '/new-york-plumber/'       // hyphens
```

### 3. URL Length <75 Characters

```javascript
// Bad (82 chars)
url: '/compare/microsoft-visual-studio-code-vs-jetbrains-intellij-idea-ultimate/'

// Good (58 chars)
url: '/compare/vscode-vs-intellij/'
```

### 4. Remove Special Characters

```javascript
function sanitizeForUrl(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')           // Spaces to hyphens
    .replace(/-+/g, '-')            // Multiple hyphens to single
    .replace(/^-|-$/g, '');         // Trim hyphens
}

// Examples
sanitizeForUrl("Austin, TX")          // "austin-tx"
sanitizeForUrl("React.js vs Vue.js")  // "reactjs-vs-vuejs"
sanitizeForUrl("What is API?")        // "what-is-api"
```

### 5. No Trailing Slashes (or Always Trailing)

Pick one convention and stick to it:

```javascript
// Option A: No trailing slash
url: '/plumber/austin-tx'

// Option B: Always trailing slash (recommended for consistency)
url: '/plumber/austin-tx/'

// Implementation
function normalizeUrl(url) {
  return url.endsWith('/') ? url : url + '/';
}
```

## Slug Generation from Data

### Basic Slug Generation

```javascript
class SlugGenerator {
  static generate(data, pattern) {
    let slug = pattern;

    // Replace variables
    Object.keys(data).forEach(key => {
      const value = data[key];
      const sanitized = this.sanitize(value);
      slug = slug.replace(`{${key}}`, sanitized);
    });

    return slug;
  }

  static sanitize(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')                    // Handle accented characters
      .replace(/[\u0300-\u036f]/g, '')     // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '')        // Remove special chars
      .replace(/\s+/g, '-')                 // Spaces to hyphens
      .replace(/-+/g, '-')                  // Collapse hyphens
      .replace(/^-|-$/g, '');               // Trim edges
  }
}

// Usage
const data = { service: 'Plumber', city: 'Austin', state: 'TX' };
const pattern = '{service}/{city}-{state}';
const url = SlugGenerator.generate(data, pattern);
// Result: 'plumber/austin-tx'
```

### Advanced Slug Generation

```javascript
class AdvancedSlugGenerator {
  constructor(options = {}) {
    this.maxLength = options.maxLength || 75;
    this.stopWords = options.stopWords || ['a', 'an', 'the', 'and', 'or', 'but'];
  }

  generate(data, pattern) {
    let slug = pattern;

    Object.keys(data).forEach(key => {
      const value = data[key];
      const sanitized = this.sanitize(value);
      slug = slug.replace(`{${key}}`, sanitized);
    });

    // Enforce max length
    if (slug.length > this.maxLength) {
      slug = this.truncate(slug, this.maxLength);
    }

    return slug;
  }

  sanitize(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  truncate(slug, maxLength) {
    if (slug.length <= maxLength) return slug;

    // Try to break at hyphen
    const parts = slug.substring(0, maxLength).split('-');
    parts.pop(); // Remove partial last word
    return parts.join('-');
  }

  removeStopWords(str) {
    const words = str.split('-');
    return words
      .filter(word => !this.stopWords.includes(word))
      .join('-');
  }
}

// Usage
const gen = new AdvancedSlugGenerator({ maxLength: 50 });
const url = gen.generate(
  { service: 'Emergency Plumbing Services', city: 'Austin' },
  '{service}/{city}'
);
// Result: 'emergency-plumbing-services/austin'
```

## Avoiding Duplicate URLs

### 1. Unique Combinations

```javascript
// Prevent duplicate combinations
const usedUrls = new Set();

function generateUniqueUrl(data, pattern) {
  const url = SlugGenerator.generate(data, pattern);

  if (usedUrls.has(url)) {
    throw new Error(`Duplicate URL detected: ${url}`);
  }

  usedUrls.add(url);
  return url;
}
```

### 2. Canonical URLs for Variations

```javascript
// Multiple patterns point to same canonical
const urlMap = {
  '/plumber/austin/': '/plumber/austin-tx/',
  '/austin-plumber/': '/plumber/austin-tx/',
  '/plumbing-austin-texas/': '/plumber/austin-tx/'
};

// Set canonical in template
function getCanonical(currentUrl) {
  return urlMap[currentUrl] || currentUrl;
}
```

### 3. Deduplication in Generation

```javascript
// Check for conflicts before generation
function detectDuplicates(data, pattern) {
  const urls = {};

  data.forEach((item, index) => {
    const url = SlugGenerator.generate(item, pattern);

    if (urls[url]) {
      console.warn(`Duplicate URL: ${url}`);
      console.warn(`  Item ${urls[url]}: ${JSON.stringify(data[urls[url]])}`);
      console.warn(`  Item ${index}: ${JSON.stringify(item)}`);
    } else {
      urls[url] = index;
    }
  });

  return Object.keys(urls).length === data.length;
}
```

## Parameter Handling

### Query Parameters (Avoid in pSEO)

```javascript
// Bad: Uses query params for content variation
url: '/plumber?city=austin&state=tx'

// Good: Baked into URL structure
url: '/plumber/austin-tx/'
```

### Filter/Sort Parameters (OK for UX)

```javascript
// OK: User interaction parameters
url: '/plumber/austin-tx/?sort=rating&filter=emergency'

// Canonical should point to base
canonical: '/plumber/austin-tx/'
```

## Examples for Different Use Cases

### Location Pages (Single Variable)

```javascript
const cities = ['austin-tx', 'miami-fl', 'seattle-wa'];
const service = 'plumber';

const urls = cities.map(city => `/${service}/${city}/`);
/*
/plumber/austin-tx/
/plumber/miami-fl/
/plumber/seattle-wa/
*/
```

### Comparison Pages (Two Variables)

```javascript
const products = ['notion', 'coda', 'airtable'];

const urls = [];
for (let i = 0; i < products.length; i++) {
  for (let j = i + 1; j < products.length; j++) {
    urls.push(`/compare/${products[i]}-vs-${products[j]}/`);
  }
}
/*
/compare/notion-vs-coda/
/compare/notion-vs-airtable/
/compare/coda-vs-airtable/
*/
```

### Multi-Level Hierarchy

```javascript
const hierarchy = {
  'healthcare': {
    'dentist': ['austin-tx', 'miami-fl'],
    'doctor': ['austin-tx', 'miami-fl']
  },
  'legal': {
    'lawyer': ['austin-tx', 'miami-fl']
  }
};

const urls = [];
Object.keys(hierarchy).forEach(category => {
  Object.keys(hierarchy[category]).forEach(subcategory => {
    hierarchy[category][subcategory].forEach(location => {
      urls.push(`/${category}/${subcategory}/${location}/`);
    });
  });
});
/*
/healthcare/dentist/austin-tx/
/healthcare/dentist/miami-fl/
/healthcare/doctor/austin-tx/
/healthcare/doctor/miami-fl/
/legal/lawyer/austin-tx/
/legal/lawyer/miami-fl/
*/
```

### Integration Matrix

```javascript
const tools = ['slack', 'asana', 'trello', 'notion'];

const urls = [];
tools.forEach((toolA, i) => {
  tools.forEach((toolB, j) => {
    if (i !== j) {
      urls.push(`/integrations/${toolA}-${toolB}/`);
    }
  });
});
/*
/integrations/slack-asana/
/integrations/slack-trello/
/integrations/slack-notion/
...
*/
```

## URL Validation

```javascript
class URLValidator {
  static validate(url) {
    const rules = {
      lowercase: /^[a-z0-9\/-]+$/.test(url),
      length: url.length <= 75,
      noSpecialChars: !/[^a-z0-9\/-]/.test(url),
      noDoubleSlash: !url.includes('//'),
      noTrailingHyphen: !url.match(/-\//)
    };

    const failed = Object.keys(rules).filter(rule => !rules[rule]);

    return {
      valid: failed.length === 0,
      failed
    };
  }
}

// Usage
const result = URLValidator.validate('/plumber/austin-tx/');
console.log(result); // { valid: true, failed: [] }
```

## Complete URL Generation Pipeline

```javascript
class PSEOURLGenerator {
  constructor(options = {}) {
    this.maxLength = options.maxLength || 75;
    this.baseUrl = options.baseUrl || '';
    this.trailingSlash = options.trailingSlash !== false;
    this.usedUrls = new Set();
  }

  generate(data, pattern) {
    let url = this.replacePlaceholders(pattern, data);
    url = this.sanitize(url);
    url = this.enforceLength(url);
    url = this.normalize(url);

    if (this.isDuplicate(url)) {
      throw new Error(`Duplicate URL: ${url}`);
    }

    this.usedUrls.add(url);
    return this.baseUrl + url;
  }

  replacePlaceholders(pattern, data) {
    let result = pattern;
    Object.keys(data).forEach(key => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), data[key]);
    });
    return result;
  }

  sanitize(url) {
    return url
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\/\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/\/-\//g, '/')
      .replace(/^-|-$/g, '');
  }

  enforceLength(url) {
    if (url.length <= this.maxLength) return url;

    const parts = url.split('/');
    while (parts.join('/').length > this.maxLength && parts.length > 2) {
      parts.pop();
    }
    return parts.join('/');
  }

  normalize(url) {
    // Ensure leading slash
    if (!url.startsWith('/')) {
      url = '/' + url;
    }

    // Handle trailing slash
    if (this.trailingSlash && !url.endsWith('/')) {
      url += '/';
    } else if (!this.trailingSlash && url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    return url;
  }

  isDuplicate(url) {
    return this.usedUrls.has(url);
  }

  reset() {
    this.usedUrls.clear();
  }
}

// Usage
const generator = new PSEOURLGenerator({
  maxLength: 75,
  baseUrl: 'https://example.com',
  trailingSlash: true
});

const url = generator.generate(
  { service: 'Plumber', city: 'Austin', state: 'TX' },
  '/{service}/{city}-{state}'
);
// Result: 'https://example.com/plumber/austin-tx/'
```

## Best Practices Summary

1. **Keep URLs short:** <75 chars ideal
2. **Use hyphens:** Not underscores or spaces
3. **Lowercase only:** Consistency matters
4. **Logical hierarchy:** Broad to specific
5. **Avoid parameters:** Bake variables into path
6. **Prevent duplicates:** Validate uniqueness
7. **Be consistent:** Pick conventions and stick
8. **Test readability:** URLs should make sense to humans
