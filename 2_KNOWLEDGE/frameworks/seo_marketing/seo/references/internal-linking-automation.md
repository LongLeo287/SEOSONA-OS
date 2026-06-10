# Internal Linking Automation

Algorithmic strategies for programmatic internal linking at scale.

## Algorithm Overview

```
Input: Page content + page corpus
Output: Relevant internal links with anchor text

Pipeline:
1. Topic Extraction → Extract key topics/entities from page
2. Similarity Scoring → Calculate relevance to other pages
3. Link Selection → Choose top N most relevant links
4. Anchor Text Generation → Create natural anchor variations
5. Placement → Insert links in appropriate content positions
```

## Topic Extraction

### Method 1: TF-IDF (Term Frequency-Inverse Document Frequency)

```javascript
class TFIDFExtractor {
  constructor(corpus) {
    this.corpus = corpus; // All pages
    this.idf = this.calculateIDF();
  }

  calculateIDF() {
    const idf = {};
    const docCount = this.corpus.length;

    // Count documents containing each term
    this.corpus.forEach(doc => {
      const uniqueTerms = new Set(this.tokenize(doc.content));
      uniqueTerms.forEach(term => {
        idf[term] = (idf[term] || 0) + 1;
      });
    });

    // Calculate IDF: log(N / df)
    Object.keys(idf).forEach(term => {
      idf[term] = Math.log(docCount / idf[term]);
    });

    return idf;
  }

  extract(page, topN = 10) {
    const terms = this.tokenize(page.content);
    const tf = {};

    // Calculate term frequency
    terms.forEach(term => {
      tf[term] = (tf[term] || 0) + 1;
    });

    // Calculate TF-IDF scores
    const tfidf = {};
    Object.keys(tf).forEach(term => {
      const tfScore = tf[term] / terms.length;
      const idfScore = this.idf[term] || 0;
      tfidf[term] = tfScore * idfScore;
    });

    // Return top N terms
    return Object.entries(tfidf)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([term, score]) => ({ term, score }));
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Remove short words
  }
}
```

### Method 2: Named Entity Recognition (NER)

```javascript
// Simplified NER (production would use NLP library)
class SimpleNER {
  constructor() {
    // Common entity patterns
    this.patterns = {
      location: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s+[A-Z]{2}\b/g,
      product: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g,
      // Add more patterns
    };
  }

  extract(text) {
    const entities = {
      locations: [],
      products: [],
      keywords: []
    };

    // Extract locations
    const locations = text.match(this.patterns.location) || [];
    entities.locations = [...new Set(locations)];

    // Extract products/brands
    const products = text.match(this.patterns.product) || [];
    entities.products = [...new Set(products)];

    return entities;
  }
}
```

## Relevance Scoring (Cosine Similarity)

### Vector-Based Similarity

```javascript
class CosineSimilarity {
  // Calculate similarity between two pages
  static calculate(pageA, pageB) {
    const vectorA = this.createVector(pageA);
    const vectorB = this.createVector(pageB);

    return this.cosine(vectorA, vectorB);
  }

  static createVector(page) {
    const terms = page.content
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3);

    const vector = {};
    terms.forEach(term => {
      vector[term] = (vector[term] || 0) + 1;
    });

    return vector;
  }

  static cosine(vecA, vecB) {
    const allTerms = new Set([
      ...Object.keys(vecA),
      ...Object.keys(vecB)
    ]);

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    allTerms.forEach(term => {
      const a = vecA[term] || 0;
      const b = vecB[term] || 0;

      dotProduct += a * b;
      magnitudeA += a * a;
      magnitudeB += b * b;
    });

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
  }
}
```

### Multi-Factor Relevance Scoring

```javascript
class RelevanceScorer {
  static score(sourcePage, targetPage, options = {}) {
    const weights = {
      contentSimilarity: 0.4,
      topicOverlap: 0.3,
      categoryMatch: 0.2,
      depthProximity: 0.1,
      ...options.weights
    };

    const scores = {
      contentSimilarity: this.contentSimilarity(sourcePage, targetPage),
      topicOverlap: this.topicOverlap(sourcePage, targetPage),
      categoryMatch: this.categoryMatch(sourcePage, targetPage),
      depthProximity: this.depthProximity(sourcePage, targetPage)
    };

    // Weighted sum
    let totalScore = 0;
    Object.keys(scores).forEach(key => {
      totalScore += scores[key] * weights[key];
    });

    return {
      score: totalScore,
      breakdown: scores
    };
  }

  static contentSimilarity(pageA, pageB) {
    return CosineSimilarity.calculate(pageA, pageB);
  }

  static topicOverlap(pageA, pageB) {
    const topicsA = new Set(pageA.topics || []);
    const topicsB = new Set(pageB.topics || []);

    const intersection = new Set([...topicsA].filter(t => topicsB.has(t)));
    const union = new Set([...topicsA, ...topicsB]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  static categoryMatch(pageA, pageB) {
    const catsA = pageA.url.split('/').filter(Boolean);
    const catsB = pageB.url.split('/').filter(Boolean);

    let matches = 0;
    const maxDepth = Math.min(catsA.length, catsB.length);

    for (let i = 0; i < maxDepth; i++) {
      if (catsA[i] === catsB[i]) matches++;
      else break;
    }

    return maxDepth > 0 ? matches / maxDepth : 0;
  }

  static depthProximity(pageA, pageB) {
    const depthA = pageA.url.split('/').filter(Boolean).length;
    const depthB = pageB.url.split('/').filter(Boolean).length;
    const depthDiff = Math.abs(depthA - depthB);

    // Prefer pages at similar depth
    return 1 / (1 + depthDiff);
  }
}
```

## Link Selection Algorithm

```javascript
class LinkSelector {
  constructor(corpus, options = {}) {
    this.corpus = corpus;
    this.maxLinksPerPage = options.maxLinksPerPage || 10;
    this.minRelevanceScore = options.minRelevanceScore || 0.3;
    this.diversityWeight = options.diversityWeight || 0.2;
  }

  selectLinks(sourcePage) {
    // Calculate relevance scores for all pages
    const candidates = this.corpus
      .filter(page => page.url !== sourcePage.url) // Exclude self
      .map(page => ({
        page,
        relevance: RelevanceScorer.score(sourcePage, page)
      }))
      .filter(c => c.relevance.score >= this.minRelevanceScore)
      .sort((a, b) => b.relevance.score - a.relevance.score);

    // Select diverse set of links
    const selected = this.selectDiverse(candidates, this.maxLinksPerPage);

    return selected.map(c => ({
      url: c.page.url,
      title: c.page.title,
      relevance: c.relevance.score,
      anchor: this.generateAnchor(sourcePage, c.page)
    }));
  }

  selectDiverse(candidates, count) {
    const selected = [];
    const categories = new Set();

    for (const candidate of candidates) {
      if (selected.length >= count) break;

      const category = this.getCategory(candidate.page.url);

      // Prefer diverse categories
      if (!categories.has(category) || selected.length >= count / 2) {
        selected.push(candidate);
        categories.add(category);
      }
    }

    return selected;
  }

  getCategory(url) {
    const parts = url.split('/').filter(Boolean);
    return parts[0] || 'root';
  }

  generateAnchor(sourcePage, targetPage) {
    // Use target page title by default
    return targetPage.title;
  }
}
```

## Anchor Text Variation

```javascript
class AnchorTextGenerator {
  static generate(targetPage, context, options = {}) {
    const variations = [];

    // 1. Exact match (target keyword)
    variations.push(targetPage.primaryKeyword);

    // 2. Page title
    variations.push(targetPage.title);

    // 3. Partial match
    const words = targetPage.primaryKeyword.split(' ');
    if (words.length > 2) {
      variations.push(words.slice(0, 2).join(' '));
    }

    // 4. Branded
    if (targetPage.brand) {
      variations.push(`${targetPage.brand} ${words[words.length - 1]}`);
    }

    // 5. Generic + context
    variations.push(`learn more about ${words[words.length - 1]}`);
    variations.push(`read our guide on ${words[words.length - 1]}`);

    // 6. Natural language
    variations.push(`${targetPage.title.replace(/\|.+$/, '').trim()}`);

    // Return variation based on strategy
    return this.selectVariation(variations, context, options);
  }

  static selectVariation(variations, context, options) {
    // Distribute anchor types for natural link profile
    const distribution = options.distribution || {
      exact: 0.15,      // 15% exact match
      partial: 0.25,    // 25% partial match
      branded: 0.20,    // 20% branded
      generic: 0.20,    // 20% generic
      natural: 0.20     // 20% natural language
    };

    // Simple selection (production would track usage across corpus)
    const rand = Math.random();
    let cumulative = 0;

    const types = ['exact', 'partial', 'branded', 'generic', 'natural'];
    for (const type of types) {
      cumulative += distribution[type];
      if (rand <= cumulative) {
        return this.getByType(variations, type);
      }
    }

    return variations[0];
  }

  static getByType(variations, type) {
    const map = {
      exact: 0,
      natural: 5,
      partial: 2,
      branded: 3,
      generic: 4
    };

    return variations[map[type]] || variations[0];
  }
}
```

## Orphan Page Detection

```javascript
class OrphanDetector {
  constructor(corpus) {
    this.corpus = corpus;
    this.linkGraph = this.buildLinkGraph();
  }

  buildLinkGraph() {
    const graph = {};

    this.corpus.forEach(page => {
      graph[page.url] = {
        outbound: page.links || [],
        inbound: []
      };
    });

    // Build inbound links
    this.corpus.forEach(page => {
      (page.links || []).forEach(link => {
        if (graph[link]) {
          graph[link].inbound.push(page.url);
        }
      });
    });

    return graph;
  }

  findOrphans(minInboundLinks = 1) {
    const orphans = [];

    Object.keys(this.linkGraph).forEach(url => {
      const node = this.linkGraph[url];
      if (node.inbound.length < minInboundLinks) {
        orphans.push({
          url,
          inboundCount: node.inbound.length,
          outboundCount: node.outbound.length
        });
      }
    });

    return orphans.sort((a, b) => a.inboundCount - b.inboundCount);
  }

  suggestLinkers(orphanUrl, count = 5) {
    const orphanPage = this.corpus.find(p => p.url === orphanUrl);
    if (!orphanPage) return [];

    return this.corpus
      .filter(page => page.url !== orphanUrl)
      .map(page => ({
        url: page.url,
        relevance: RelevanceScorer.score(page, orphanPage).score
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, count);
  }
}
```

## Link Graph Analysis

```javascript
class LinkGraphAnalyzer {
  constructor(corpus) {
    this.corpus = corpus;
    this.graph = this.buildGraph();
  }

  buildGraph() {
    const graph = {};

    this.corpus.forEach(page => {
      graph[page.url] = {
        outbound: page.links || [],
        inbound: [],
        pageRank: 1.0 / this.corpus.length
      };
    });

    this.corpus.forEach(page => {
      (page.links || []).forEach(link => {
        if (graph[link]) {
          graph[link].inbound.push(page.url);
        }
      });
    });

    return graph;
  }

  calculatePageRank(iterations = 10, dampingFactor = 0.85) {
    for (let i = 0; i < iterations; i++) {
      const newRanks = {};

      Object.keys(this.graph).forEach(url => {
        let rank = (1 - dampingFactor) / this.corpus.length;

        this.graph[url].inbound.forEach(inboundUrl => {
          const inboundNode = this.graph[inboundUrl];
          rank += dampingFactor * (inboundNode.pageRank / inboundNode.outbound.length);
        });

        newRanks[url] = rank;
      });

      // Update ranks
      Object.keys(newRanks).forEach(url => {
        this.graph[url].pageRank = newRanks[url];
      });
    }

    return this.graph;
  }

  findHubs() {
    // Pages with many outbound links
    return Object.entries(this.graph)
      .map(([url, node]) => ({
        url,
        outbound: node.outbound.length,
        inbound: node.inbound.length,
        pageRank: node.pageRank
      }))
      .sort((a, b) => b.outbound - a.outbound)
      .slice(0, 10);
  }

  findAuthorities() {
    // Pages with many inbound links
    return Object.entries(this.graph)
      .map(([url, node]) => ({
        url,
        inbound: node.inbound.length,
        outbound: node.outbound.length,
        pageRank: node.pageRank
      }))
      .sort((a, b) => b.inbound - a.inbound)
      .slice(0, 10);
  }
}
```

## Quality Controls

### Link Density Check

```javascript
class LinkQualityControl {
  static validate(page) {
    const issues = [];

    // 1. Max links per page (100 recommended)
    if (page.links.length > 100) {
      issues.push({
        type: 'too_many_links',
        count: page.links.length,
        max: 100
      });
    }

    // 2. Link density (links per 100 words)
    const wordCount = page.content.split(/\s+/).length;
    const linkDensity = (page.links.length / wordCount) * 100;

    if (linkDensity > 5) {
      issues.push({
        type: 'high_link_density',
        density: linkDensity,
        max: 5
      });
    }

    // 3. Broken links
    const brokenLinks = page.links.filter(link => !this.exists(link));
    if (brokenLinks.length > 0) {
      issues.push({
        type: 'broken_links',
        links: brokenLinks
      });
    }

    // 4. Self-referential links
    const selfLinks = page.links.filter(link => link === page.url);
    if (selfLinks.length > 0) {
      issues.push({
        type: 'self_links',
        count: selfLinks.length
      });
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  static exists(url) {
    // Check if URL exists in corpus
    // Implementation depends on corpus structure
    return true;
  }
}
```

## Complete Linking Pipeline

```javascript
class InternalLinkingPipeline {
  constructor(corpus, options = {}) {
    this.corpus = corpus;
    this.options = {
      maxLinksPerPage: 10,
      minRelevanceScore: 0.3,
      ...options
    };

    this.linkSelector = new LinkSelector(corpus, this.options);
    this.orphanDetector = new OrphanDetector(corpus);
  }

  process() {
    const results = [];

    // 1. Generate links for each page
    this.corpus.forEach(page => {
      const links = this.linkSelector.selectLinks(page);
      const quality = LinkQualityControl.validate({ ...page, links });

      results.push({
        url: page.url,
        links,
        quality
      });
    });

    // 2. Fix orphan pages
    const orphans = this.orphanDetector.findOrphans();
    orphans.forEach(orphan => {
      const suggestedLinkers = this.orphanDetector.suggestLinkers(orphan.url);

      // Add links to orphan from suggested pages
      suggestedLinkers.forEach(linker => {
        const resultPage = results.find(r => r.url === linker.url);
        if (resultPage && resultPage.links.length < this.options.maxLinksPerPage) {
          resultPage.links.push({
            url: orphan.url,
            anchor: this.generateAnchor(orphan),
            reason: 'orphan_fix'
          });
        }
      });
    });

    return results;
  }

  generateAnchor(page) {
    const pageObj = this.corpus.find(p => p.url === page.url);
    return pageObj ? pageObj.title : page.url;
  }

  exportToJSON() {
    return JSON.stringify(this.process(), null, 2);
  }
}

// Usage
const corpus = [
  {
    url: '/plumber/austin-tx/',
    title: 'Plumber in Austin, TX',
    content: '...',
    topics: ['plumbing', 'austin', 'texas']
  },
  // ... more pages
];

const pipeline = new InternalLinkingPipeline(corpus, {
  maxLinksPerPage: 8,
  minRelevanceScore: 0.35
});

const results = pipeline.process();
console.log(results);
```

## Best Practices Summary

1. **Relevance First:** Only link to truly relevant pages (>0.3 similarity)
2. **Diversity:** Vary anchor text (15% exact, 85% variations)
3. **Quality Over Quantity:** 5-10 high-quality links > 20 weak links
4. **Natural Placement:** Insert links in contextual positions
5. **Bidirectional:** Link clusters of related pages together
6. **Monitor Orphans:** Ensure all pages have 1+ inbound links
7. **Link Graph Health:** Balanced hub/authority distribution
8. **Quality Controls:** Max 100 links/page, <5% link density
