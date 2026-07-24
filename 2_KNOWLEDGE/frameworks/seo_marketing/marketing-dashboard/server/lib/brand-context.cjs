/**
 * Brand context extractor
 * Extracts brand guidelines for Content Hub sidebar
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract hex colors from text
 */
function extractColors(text) {
  const hexPattern = /#[0-9A-Fa-f]{6}\b/g;
  return [...new Set(text.match(hexPattern) || [])];
}

/**
 * Extract section from markdown
 */
function extractSection(content, heading) {
  const regex = new RegExp(`###?\\s*${heading}[\\s\\S]*?(?=###?\\s|$)`, 'i');
  const match = content.match(regex);
  return match ? match[0] : '';
}

/**
 * Extract brand context from markdown file
 */
function extractBrandContext(brandGuidelinesPath) {
  const defaultContext = {
    exists: false,
    colors: { primary: [], secondary: [], neutral: [] },
    typography: { heading: null, body: null },
    voice: { personality: '', traits: [] },
    summary: 'No brand guidelines found. Run /marketing:init to create them.'
  };

  if (!fs.existsSync(brandGuidelinesPath)) {
    return defaultContext;
  }

  try {
    const content = fs.readFileSync(brandGuidelinesPath, 'utf8');

    // Extract colors
    const primarySection = extractSection(content, 'Primary Colors');
    const secondarySection = extractSection(content, 'Secondary Colors');
    const neutralSection = extractSection(content, 'Neutral');

    const colors = {
      primary: extractColors(primarySection).slice(0, 5),
      secondary: extractColors(secondarySection).slice(0, 5),
      neutral: extractColors(neutralSection).slice(0, 5)
    };

    // Extract typography
    const fontSection = extractSection(content, 'Font|Typography');
    const headingMatch = fontSection.match(/heading[^']*['"]([^'"]+)['"]/i);
    const bodyMatch = fontSection.match(/body[^']*['"]([^'"]+)['"]/i);

    const typography = {
      heading: headingMatch ? headingMatch[1] : null,
      body: bodyMatch ? bodyMatch[1] : null
    };

    // Extract voice/personality
    const personalitySection = extractSection(content, 'Brand Personality|Voice');
    const traits = [];
    const traitMatches = personalitySection.match(/\*\*([^*]+)\*\*/g);
    if (traitMatches) {
      traits.push(...traitMatches.map(t => t.replace(/\*\*/g, '').trim()).slice(0, 5));
    }

    // Build summary
    const summaryParts = [];
    if (colors.primary.length) summaryParts.push(`Primary: ${colors.primary[0]}`);
    if (typography.heading) summaryParts.push(`Font: ${typography.heading}`);
    if (traits.length) summaryParts.push(`Voice: ${traits.slice(0, 3).join(', ')}`);

    return {
      exists: true,
      colors,
      typography,
      voice: {
        personality: traits.join(', '),
        traits
      },
      summary: summaryParts.join(' | ') || 'Brand guidelines loaded',
      source: brandGuidelinesPath,
      extractedAt: new Date().toISOString()
    };

  } catch (err) {
    console.error('Error extracting brand context:', err);
    return defaultContext;
  }
}

/**
 * Get brand context from project
 */
function getBrandContext(projectRoot) {
  const possiblePaths = [
    path.join(projectRoot, 'docs', 'brand-guidelines.md'),
    path.join(projectRoot, 'docs', 'design-guidelines.md'),
    path.join(projectRoot, 'brand-guidelines.md')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return extractBrandContext(p);
    }
  }

  return extractBrandContext(possiblePaths[0]); // Returns default context
}

module.exports = { getBrandContext, extractBrandContext };
