#!/usr/bin/env node
/**
 * JSON+LD Schema Generator
 * Usage: node generate-schema.cjs <type> [--data data.json] [--output schema.json]
 */

const fs = require('fs');

const schemas = {
  article: (data) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "author": { "@type": "Person", "name": data.author || "Author" },
    "datePublished": data.date || new Date().toISOString(),
    "image": data.image || "",
    "publisher": {
      "@type": "Organization",
      "name": data.org || "Organization",
      "logo": { "@type": "ImageObject", "url": data.logo || "" }
    }
  }),

  faq: (data) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (data.questions || []).map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": { "@type": "Answer", "text": q.answer }
    }))
  }),

  product: (data) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description || "",
    "image": data.image || "",
    "offers": {
      "@type": "Offer",
      "price": data.price || "0",
      "priceCurrency": data.currency || "USD",
      "availability": "https://schema.org/InStock"
    }
  }),

  howto: (data) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": data.title,
    "description": data.description || "",
    "step": (data.steps || []).map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.name || `Step ${i + 1}`,
      "text": step.text
    }))
  }),

  organization: (data) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "url": data.url || "",
    "logo": data.logo || "",
    "sameAs": data.social || []
  }),

  breadcrumb: (data) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": (data.items || []).map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  })
};

function generateSchema(type, data) {
  const generator = schemas[type.toLowerCase()];
  if (!generator) {
    throw new Error(`Unknown schema type: ${type}. Available: ${Object.keys(schemas).join(', ')}`);
  }
  return generator(data);
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node generate-schema.cjs <type> [--data data.json]');
    console.log('Types: article, faq, product, howto, organization, breadcrumb');
    process.exit(1);
  }

  const type = args[0];
  const dataIndex = args.indexOf('--data');
  let data = {};

  if (dataIndex !== -1 && args[dataIndex + 1]) {
    data = JSON.parse(fs.readFileSync(args[dataIndex + 1], 'utf-8'));
  }

  const schema = generateSchema(type, data);
  const output = JSON.stringify(schema, null, 2);

  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    fs.writeFileSync(args[outputIndex + 1], output);
    console.log(`Schema saved: ${args[outputIndex + 1]}`);
  } else {
    console.log(output);
  }
}

module.exports = { generateSchema, schemas };
