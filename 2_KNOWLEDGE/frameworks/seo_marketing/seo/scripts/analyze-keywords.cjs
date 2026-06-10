#!/usr/bin/env node
/**
 * Keyword Analysis with ReviewWeb.site SEO Insights API
 *
 * Features:
 * - Fetch keyword ideas, difficulty, and search volume from ReviewWeb.site API
 * - Analyze competitor traffic and top keywords
 * - Generate prioritized keyword reports
 *
 * Usage:
 *   node analyze-keywords.cjs --keyword "react tutorial" [options]
 *   node analyze-keywords.cjs --domain "example.com" [options]
 *   node analyze-keywords.cjs --file keywords.json [options]
 *
 * Options:
 *   --keyword <kw>     Seed keyword to analyze
 *   --domain <url>     Domain to analyze traffic/keywords
 *   --file <path>      JSON file with keywords to analyze
 *   --country <code>   Country code (default: us)
 *   --output <path>    Output report path (default: stdout)
 *   --format <type>    Output format: md, json (default: md)
 *   --api-key <key>    API key (or use REVIEWWEB_API_KEY env var)
 *
 * Environment (priority order):
 *   1. process.env.REVIEWWEB_API_KEY (highest)
 *   2. $HOME/.claude/skills/seo/.env
 *   3. $HOME/.claude/skills/.env
 *   4. $HOME/.claude/.env (lowest)
 *
 * API Endpoints Used:
 *   POST /api/v1/seo-insights/keyword-ideas
 *   POST /api/v1/seo-insights/keyword-difficulty
 *   POST /api/v1/seo-insights/traffic
 *   POST /api/v1/seo-insights/backlinks
 */

const fs = require('fs');
const { loadEnv, getEnv } = require('./env-loader.cjs');

// Load environment variables with proper priority
loadEnv('seo');

const API_BASE_URL = 'https://reviewweb.site/api/v1';

// Parse command line arguments
function parseArgs(args) {
  const options = {
    keyword: null,
    domain: null,
    file: null,
    country: 'us',
    output: null,
    format: 'md',
    apiKey: getEnv('REVIEWWEB_API_KEY'), // Uses priority-based env loading
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--keyword':
      case '-k':
        options.keyword = next;
        i++;
        break;
      case '--domain':
      case '-d':
        options.domain = next;
        i++;
        break;
      case '--file':
      case '-f':
        options.file = next;
        i++;
        break;
      case '--country':
      case '-c':
        options.country = next;
        i++;
        break;
      case '--output':
      case '-o':
        options.output = next;
        i++;
        break;
      case '--format':
        options.format = next;
        i++;
        break;
      case '--api-key':
        options.apiKey = next;
        i++;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
    }
  }

  return options;
}

function printUsage() {
  console.log(`
Keyword Analysis with ReviewWeb.site SEO Insights API

Usage:
  node analyze-keywords.cjs --keyword "react tutorial" [options]
  node analyze-keywords.cjs --domain "example.com" [options]
  node analyze-keywords.cjs --file keywords.json [options]

Options:
  --keyword, -k <kw>     Seed keyword to analyze
  --domain, -d <url>     Domain to analyze traffic/keywords
  --file, -f <path>      JSON file with keywords to analyze
  --country, -c <code>   Country code (default: us)
  --output, -o <path>    Output report path (default: stdout)
  --format <type>        Output format: md, json (default: md)
  --api-key <key>        API key (or use REVIEWWEB_API_KEY env var)
  --help, -h             Show this help message

Environment:
  REVIEWWEB_API_KEY      API key for ReviewWeb.site

Examples:
  # Analyze keyword ideas
  node analyze-keywords.cjs -k "seo tools" -c us -o report.md

  # Analyze competitor domain
  node analyze-keywords.cjs -d "competitor.com" -o competitor-analysis.md

  # Batch analyze keywords from file
  node analyze-keywords.cjs -f keywords.json --format json -o results.json
`);
}

// API client for ReviewWeb.site
class ReviewWebClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error(
        'API key required. Set REVIEWWEB_API_KEY env var or use --api-key'
      );
    }
    this.apiKey = apiKey;
  }

  async request(endpoint, body) {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error ${response.status}: ${error}`);
    }

    return response.json();
  }

  /**
   * Get keyword ideas for a seed keyword
   * @param {string} keyword - Seed keyword
   * @param {string} country - Country code (default: us)
   * @returns {Promise<Object>} Keyword ideas with volume, CPC, competition
   */
  async getKeywordIdeas(keyword, country = 'us') {
    return this.request('/seo-insights/keyword-ideas', {
      keyword,
      country,
      searchEngine: 'Google',
    });
  }

  /**
   * Get keyword difficulty score
   * @param {string} keyword - Keyword to check
   * @param {string} country - Country code (default: us)
   * @returns {Promise<Object>} Difficulty score and SERP analysis
   */
  async getKeywordDifficulty(keyword, country = 'us') {
    return this.request('/seo-insights/keyword-difficulty', {
      keyword,
      country,
    });
  }

  /**
   * Get traffic data for a domain
   * @param {string} domainOrUrl - Domain or URL to analyze
   * @param {string} country - Country code (optional)
   * @returns {Promise<Object>} Traffic history, top pages, keywords, countries
   */
  async getTraffic(domainOrUrl, country = null) {
    const body = {
      domainOrUrl,
      mode: 'subdomains',
    };
    if (country) {
      body.country = country;
    }
    return this.request('/seo-insights/traffic', body);
  }

  /**
   * Get backlinks for a domain
   * @param {string} domain - Domain to analyze
   * @returns {Promise<Object>} Backlink overview and list
   */
  async getBacklinks(domain) {
    return this.request('/seo-insights/backlinks', { domain });
  }
}

// Classify keyword intent based on patterns
function classifyIntent(keyword) {
  const kw = keyword.toLowerCase();
  if (/buy|price|discount|deal|shop|order|cheap|cost|purchase/.test(kw))
    return 'transactional';
  if (/best|review|vs|compare|top|alternative|recommended/.test(kw))
    return 'commercial';
  if (/how|what|why|guide|tutorial|learn|example|tips/.test(kw))
    return 'informational';
  return 'navigational';
}

// Calculate priority score (1=highest, 4=lowest)
function calculatePriority(volume, difficulty, cpc = 0) {
  // High volume, low difficulty = quick wins
  if (volume > 1000 && difficulty < 30) return 1;
  if (volume > 500 && difficulty < 40) return 1;
  // Medium opportunity
  if (volume > 100 && difficulty < 50) return 2;
  if (volume > 500 && difficulty < 60) return 2;
  // High value (good CPC) worth the effort
  if (cpc > 5 && difficulty < 60) return 2;
  // Difficult but possible
  if (difficulty < 70) return 3;
  // Very competitive
  return 4;
}

// Get recommended content type based on intent
function getContentType(intent) {
  const types = {
    informational: 'Blog/Guide',
    commercial: 'Comparison/Review',
    transactional: 'Product/Landing',
    navigational: 'Homepage/Feature',
  };
  return types[intent] || 'Blog';
}

// Analyze keywords using API data
async function analyzeKeywords(client, keywords, country) {
  const results = [];

  for (const kw of keywords) {
    const keyword = typeof kw === 'string' ? kw : kw.keyword;

    try {
      // Fetch keyword difficulty (includes volume data)
      const diffResult = await client.getKeywordDifficulty(keyword, country);

      const data = diffResult.data || {};
      const volume = data.search_volume || data.volume || 0;
      const difficulty = data.difficulty || data.keyword_difficulty || 50;
      const cpc = data.cpc || 0;

      const intent = classifyIntent(keyword);
      const priority = calculatePriority(volume, difficulty, cpc);

      results.push({
        keyword,
        volume,
        difficulty,
        cpc,
        intent,
        priority,
        contentType: getContentType(intent),
        serpFeatures: data.serp_features || [],
        topCompetitors: (data.top_results || []).slice(0, 3).map((r) => r.url),
      });

      // Rate limiting: small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error analyzing "${keyword}": ${error.message}`);
      results.push({
        keyword,
        error: error.message,
        volume: 0,
        difficulty: 100,
        intent: classifyIntent(keyword),
        priority: 4,
        contentType: getContentType(classifyIntent(keyword)),
      });
    }
  }

  return results.sort((a, b) => a.priority - b.priority);
}

// Analyze a domain's traffic and keywords
async function analyzeDomain(client, domain, country) {
  const results = {
    domain,
    traffic: null,
    backlinks: null,
    topKeywords: [],
    opportunities: [],
  };

  try {
    // Get traffic data
    const trafficResult = await client.getTraffic(domain, country);
    results.traffic = trafficResult.data;

    // Extract top keywords from traffic data
    if (trafficResult.data?.top_keywords) {
      results.topKeywords = trafficResult.data.top_keywords.slice(0, 20);

      // Analyze keyword opportunities
      for (const kw of results.topKeywords.slice(0, 10)) {
        const keyword = kw.keyword || kw;
        const intent = classifyIntent(keyword);
        results.opportunities.push({
          keyword,
          position: kw.position || 'N/A',
          traffic: kw.traffic || kw.search_volume || 0,
          intent,
          contentType: getContentType(intent),
        });
      }
    }
  } catch (error) {
    console.error(`Error fetching traffic: ${error.message}`);
  }

  try {
    // Get backlink data
    const backlinksResult = await client.getBacklinks(domain);
    results.backlinks = backlinksResult.data;
  } catch (error) {
    console.error(`Error fetching backlinks: ${error.message}`);
  }

  return results;
}

// Generate keyword ideas from a seed
async function generateKeywordIdeas(client, seedKeyword, country) {
  try {
    const result = await client.getKeywordIdeas(seedKeyword, country);
    const ideas = result.data || [];

    return ideas.map((idea) => ({
      keyword: idea.keyword || idea,
      volume: idea.search_volume || idea.volume || 0,
      difficulty: idea.difficulty || 50,
      cpc: idea.cpc || 0,
      intent: classifyIntent(idea.keyword || idea),
      priority: calculatePriority(
        idea.search_volume || idea.volume || 0,
        idea.difficulty || 50,
        idea.cpc || 0
      ),
      contentType: getContentType(classifyIntent(idea.keyword || idea)),
    }));
  } catch (error) {
    console.error(`Error fetching keyword ideas: ${error.message}`);
    return [];
  }
}

// Generate markdown report
function generateMarkdownReport(data, type) {
  let report = `# SEO Keyword Analysis Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  if (type === 'keywords') {
    const keywords = data;
    const quickWins = keywords.filter((k) => k.priority === 1);
    const mediumOpp = keywords.filter((k) => k.priority === 2);

    report += `## Summary\n\n`;
    report += `- **Total Keywords:** ${keywords.length}\n`;
    report += `- **Quick Wins (Priority 1):** ${quickWins.length}\n`;
    report += `- **Medium Opportunities (Priority 2):** ${mediumOpp.length}\n\n`;

    if (quickWins.length > 0) {
      report += `## Quick Wins\n\n`;
      report += `High volume, low difficulty keywords to target first:\n\n`;
      report += `| Keyword | Volume | Difficulty | CPC | Intent | Content Type |\n`;
      report += `|---------|--------|------------|-----|--------|-------------|\n`;
      for (const kw of quickWins) {
        report += `| ${kw.keyword} | ${kw.volume.toLocaleString()} | ${kw.difficulty} | $${kw.cpc?.toFixed(2) || '0.00'} | ${kw.intent} | ${kw.contentType} |\n`;
      }
      report += `\n`;
    }

    report += `## All Keywords by Priority\n\n`;
    report += `| Keyword | Volume | Difficulty | CPC | Intent | Priority | Content Type |\n`;
    report += `|---------|--------|------------|-----|--------|----------|-------------|\n`;

    for (const kw of keywords) {
      if (kw.error) {
        report += `| ${kw.keyword} | Error | - | - | ${kw.intent} | - | ${kw.contentType} |\n`;
      } else {
        report += `| ${kw.keyword} | ${kw.volume.toLocaleString()} | ${kw.difficulty} | $${kw.cpc?.toFixed(2) || '0.00'} | ${kw.intent} | ${kw.priority} | ${kw.contentType} |\n`;
      }
    }
  } else if (type === 'domain') {
    report += `## Domain Analysis: ${data.domain}\n\n`;

    if (data.traffic) {
      report += `### Traffic Overview\n\n`;
      const t = data.traffic.traffic || data.traffic;
      if (t.organic_traffic !== undefined) {
        report += `- **Organic Traffic:** ${t.organic_traffic?.toLocaleString() || 'N/A'}\n`;
      }
      if (t.organic_keywords !== undefined) {
        report += `- **Organic Keywords:** ${t.organic_keywords?.toLocaleString() || 'N/A'}\n`;
      }
      if (t.traffic_cost !== undefined) {
        report += `- **Traffic Value:** $${t.traffic_cost?.toLocaleString() || 'N/A'}\n`;
      }
      report += `\n`;

      if (data.traffic.top_pages?.length > 0) {
        report += `### Top Pages\n\n`;
        report += `| Page | Traffic | Keywords |\n`;
        report += `|------|---------|----------|\n`;
        for (const page of data.traffic.top_pages.slice(0, 10)) {
          report += `| ${page.url || page.page} | ${page.traffic?.toLocaleString() || 'N/A'} | ${page.keywords || 'N/A'} |\n`;
        }
        report += `\n`;
      }

      if (data.traffic.top_countries?.length > 0) {
        report += `### Top Countries\n\n`;
        report += `| Country | Traffic Share |\n`;
        report += `|---------|---------------|\n`;
        for (const country of data.traffic.top_countries.slice(0, 5)) {
          report += `| ${country.country || country.code} | ${country.share || country.traffic_share || 'N/A'}% |\n`;
        }
        report += `\n`;
      }
    }

    if (data.backlinks?.overview) {
      report += `### Backlink Profile\n\n`;
      const bl = data.backlinks.overview;
      report += `- **Total Backlinks:** ${bl.total_backlinks?.toLocaleString() || bl.backlinks?.toLocaleString() || 'N/A'}\n`;
      report += `- **Referring Domains:** ${bl.referring_domains?.toLocaleString() || 'N/A'}\n`;
      report += `- **Domain Rating:** ${bl.domain_rating || bl.authority || 'N/A'}\n`;
      report += `\n`;
    }

    if (data.opportunities.length > 0) {
      report += `### Keyword Opportunities\n\n`;
      report += `| Keyword | Position | Traffic | Intent | Content Type |\n`;
      report += `|---------|----------|---------|--------|-------------|\n`;
      for (const opp of data.opportunities) {
        report += `| ${opp.keyword} | ${opp.position} | ${opp.traffic?.toLocaleString() || 'N/A'} | ${opp.intent} | ${opp.contentType} |\n`;
      }
    }
  }

  return report;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const options = parseArgs(args);

  // Validate inputs
  if (!options.keyword && !options.domain && !options.file) {
    console.error('Error: Must provide --keyword, --domain, or --file');
    process.exit(1);
  }

  let client;
  try {
    client = new ReviewWebClient(options.apiKey);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  let result;
  let reportType;

  if (options.file) {
    // Batch analyze keywords from file
    const fileContent = fs.readFileSync(options.file, 'utf-8');
    const keywords = JSON.parse(fileContent);
    console.error(`Analyzing ${keywords.length} keywords...`);
    result = await analyzeKeywords(client, keywords, options.country);
    reportType = 'keywords';
  } else if (options.domain) {
    // Analyze domain traffic and keywords
    console.error(`Analyzing domain: ${options.domain}`);
    result = await analyzeDomain(client, options.domain, options.country);
    reportType = 'domain';
  } else if (options.keyword) {
    // Get keyword ideas for seed keyword
    console.error(`Fetching keyword ideas for: ${options.keyword}`);
    const ideas = await generateKeywordIdeas(
      client,
      options.keyword,
      options.country
    );

    // Also get difficulty for the seed keyword
    const analyzed = await analyzeKeywords(
      client,
      [options.keyword],
      options.country
    );

    result = [...analyzed, ...ideas].sort((a, b) => a.priority - b.priority);
    reportType = 'keywords';
  }

  // Generate output
  let output;
  if (options.format === 'json') {
    output = JSON.stringify(result, null, 2);
  } else {
    output = generateMarkdownReport(result, reportType);
  }

  // Write output
  if (options.output) {
    fs.writeFileSync(options.output, output);
    console.error(`Report saved: ${options.output}`);
  } else {
    console.log(output);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = {
  ReviewWebClient,
  analyzeKeywords,
  analyzeDomain,
  generateKeywordIdeas,
  classifyIntent,
  calculatePriority,
  generateMarkdownReport,
};
