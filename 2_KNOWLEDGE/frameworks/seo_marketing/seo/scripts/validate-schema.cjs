#!/usr/bin/env node
/**
 * JSON-LD Schema Validator
 *
 * Validates JSON-LD schema markup against Schema.org specs and Google Rich Results requirements
 *
 * Usage:
 *   node validate-schema.cjs -f schema.json
 *   cat schema.json | node validate-schema.cjs
 *   node validate-schema.cjs -f schema.json --verbose
 *
 * Options:
 *   -f, --file <path>    Path to JSON-LD file
 *   -v, --verbose        Show detailed validation messages
 *   -h, --help           Show help
 */

const fs = require('fs');

// Schema.org required fields by type
const REQUIRED_FIELDS = {
  Article: ['@type', 'headline', 'author', 'datePublished', 'image'],
  BlogPosting: ['@type', 'headline', 'author', 'datePublished', 'image'],
  NewsArticle: ['@type', 'headline', 'author', 'datePublished', 'image'],
  Product: ['@type', 'name', 'image', 'offers'],
  Organization: ['@type', 'name', 'url'],
  Person: ['@type', 'name'],
  FAQPage: ['@type', 'mainEntity'],
  HowTo: ['@type', 'name', 'step'],
  Recipe: ['@type', 'name', 'image', 'recipeIngredient', 'recipeInstructions'],
  Event: ['@type', 'name', 'startDate', 'location'],
  LocalBusiness: ['@type', 'name', 'address', 'telephone'],
  BreadcrumbList: ['@type', 'itemListElement'],
  VideoObject: ['@type', 'name', 'description', 'thumbnailUrl', 'uploadDate'],
};

// Date field names that should be ISO 8601 format
const DATE_FIELDS = [
  'datePublished',
  'dateModified',
  'dateCreated',
  'startDate',
  'endDate',
  'uploadDate',
  'expires',
  'validFrom',
  'validThrough',
];

// URL field names
const URL_FIELDS = [
  'url',
  'sameAs',
  'logo',
  'image',
  'thumbnailUrl',
  'contentUrl',
  'embedUrl',
];

// Validation result tracking
class ValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = true;
  }

  addError(message, field = null) {
    this.errors.push(field ? `[${field}] ${message}` : message);
    this.passed = false;
  }

  addWarning(message, field = null) {
    this.warnings.push(field ? `[${field}] ${message}` : message);
  }

  get isValid() {
    return this.passed;
  }
}

// Validate ISO 8601 date format
function isValidISO8601(dateString) {
  if (typeof dateString !== 'string') return false;

  // Basic ISO 8601 patterns: YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, etc.
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

  if (!iso8601Regex.test(dateString)) return false;

  // Check if it's a valid date
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Validate URL format
function isValidURL(urlString) {
  if (typeof urlString !== 'string') return false;

  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

// Validate required fields for a schema type
function validateRequiredFields(schema, result) {
  const schemaType = Array.isArray(schema['@type']) ? schema['@type'][0] : schema['@type'];

  if (!schemaType) {
    result.addError('Missing @type field');
    return;
  }

  const requiredFields = REQUIRED_FIELDS[schemaType];

  if (!requiredFields) {
    result.addWarning(`Unknown schema type: ${schemaType}. Cannot validate required fields.`);
    return;
  }

  for (const field of requiredFields) {
    if (!(field in schema) || schema[field] === '' || schema[field] === null) {
      result.addError(`Missing required field`, field);
    }
  }
}

// Validate date fields
function validateDateFields(obj, result, parentKey = '') {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (DATE_FIELDS.includes(key)) {
      if (!isValidISO8601(value)) {
        result.addError(`Invalid ISO 8601 date format: ${value}`, fullKey);
      }
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      validateDateFields(value, result, fullKey);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          validateDateFields(item, result, `${fullKey}[${index}]`);
        }
      });
    }
  }
}

// Validate URL fields
function validateURLFields(obj, result, parentKey = '') {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (URL_FIELDS.includes(key)) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && !isValidURL(item)) {
            result.addError(`Invalid URL format: ${item}`, `${fullKey}[${index}]`);
          } else if (typeof item === 'object' && item !== null) {
            // Handle ImageObject in arrays
            validateURLFields(item, result, `${fullKey}[${index}]`);
          }
        });
      } else if (typeof value === 'string' && !isValidURL(value)) {
        result.addError(`Invalid URL format: ${value}`, fullKey);
      }
      // If value is an object (e.g., ImageObject), recursion will handle it below
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      validateURLFields(value, result, fullKey);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          validateURLFields(item, result, `${fullKey}[${index}]`);
        }
      });
    }
  }
}

// Validate @context
function validateContext(schema, result) {
  if (!schema['@context']) {
    result.addError('Missing @context field');
  } else if (schema['@context'] !== 'https://schema.org' &&
             schema['@context'] !== 'http://schema.org') {
    result.addWarning(`Non-standard @context: ${schema['@context']}. Expected https://schema.org`);
  }
}

// Validate image fields (must be URL or ImageObject)
function validateImages(obj, result, parentKey = '') {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (key === 'image') {
      if (typeof value === 'string') {
        if (!isValidURL(value)) {
          result.addError(`Image must be a valid URL`, fullKey);
        }
      } else if (typeof value === 'object' && value !== null) {
        if (!value['@type'] || value['@type'] !== 'ImageObject') {
          result.addWarning(`Image object should have @type: "ImageObject"`, fullKey);
        }
        if (!value.url || !isValidURL(value.url)) {
          result.addError(`ImageObject must have valid url field`, `${fullKey}.url`);
        }
      } else if (Array.isArray(value)) {
        value.forEach((img, index) => {
          if (typeof img === 'string' && !isValidURL(img)) {
            result.addError(`Image must be a valid URL`, `${fullKey}[${index}]`);
          }
        });
      }
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      validateImages(value, result, fullKey);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          validateImages(item, result, `${fullKey}[${index}]`);
        }
      });
    }
  }
}

// Main validation function
function validateSchema(schemaData, verbose = false) {
  const result = new ValidationResult();

  try {
    // Parse JSON if string
    const schema = typeof schemaData === 'string' ? JSON.parse(schemaData) : schemaData;

    // Basic structure validation
    validateContext(schema, result);
    validateRequiredFields(schema, result);

    // Field format validation
    validateDateFields(schema, result);
    validateURLFields(schema, result);
    validateImages(schema, result);

    // Type-specific validations
    const schemaType = Array.isArray(schema['@type']) ? schema['@type'][0] : schema['@type'];

    if (schemaType === 'Product' && schema.offers) {
      const offers = Array.isArray(schema.offers) ? schema.offers : [schema.offers];
      offers.forEach((offer, index) => {
        if (!offer.price && !offer.priceRange) {
          result.addError('Product offer must have price or priceRange', `offers[${index}]`);
        }
        if (!offer.priceCurrency) {
          result.addWarning('Product offer should have priceCurrency', `offers[${index}]`);
        }
      });
    }

    if (schemaType === 'FAQPage' && schema.mainEntity) {
      const questions = Array.isArray(schema.mainEntity) ? schema.mainEntity : [schema.mainEntity];
      questions.forEach((q, index) => {
        if (!q.name) {
          result.addError('Question must have name field', `mainEntity[${index}]`);
        }
        if (!q.acceptedAnswer) {
          result.addError('Question must have acceptedAnswer', `mainEntity[${index}]`);
        } else if (!q.acceptedAnswer.text) {
          result.addError('Answer must have text field', `mainEntity[${index}].acceptedAnswer`);
        }
      });
    }

    if (schemaType === 'HowTo' && schema.step) {
      const steps = Array.isArray(schema.step) ? schema.step : [schema.step];
      steps.forEach((step, index) => {
        if (!step.text && !step.itemListElement) {
          result.addError('HowToStep must have text or itemListElement', `step[${index}]`);
        }
      });
    }

  } catch (error) {
    result.addError(`JSON parsing error: ${error.message}`);
  }

  return result;
}

// Print validation results
function printResults(result, verbose) {
  if (result.isValid && result.warnings.length === 0) {
    console.log('✓ Schema validation passed');
    return 0;
  }

  if (result.errors.length > 0) {
    console.log(`✗ Schema validation failed (${result.errors.length} errors)\n`);
    console.log('Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  } else {
    console.log('✓ Schema validation passed');
  }

  if (result.warnings.length > 0) {
    console.log(`\nWarnings (${result.warnings.length}):`);
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  return result.isValid ? 0 : 1;
}

// Parse CLI arguments
function parseArgs(args) {
  const options = {
    file: null,
    verbose: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '-f':
      case '--file':
        options.file = next;
        i++;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
    }
  }

  return options;
}

// Print usage
function printUsage() {
  console.log(`
JSON-LD Schema Validator

Validates JSON-LD schema markup against Schema.org specs and Google Rich Results requirements

Usage:
  node validate-schema.cjs -f schema.json
  cat schema.json | node validate-schema.cjs
  node validate-schema.cjs -f schema.json --verbose

Options:
  -f, --file <path>    Path to JSON-LD file
  -v, --verbose        Show detailed validation messages
  -h, --help           Show this help

Exit codes:
  0 - Validation passed
  1 - Validation failed
`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    printUsage();
    process.exit(0);
  }

  let schemaData;

  if (options.file) {
    // Read from file
    try {
      schemaData = fs.readFileSync(options.file, 'utf-8');
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Read from stdin
    const chunks = [];
    process.stdin.on('data', chunk => chunks.push(chunk));
    process.stdin.on('end', () => {
      schemaData = Buffer.concat(chunks).toString('utf-8');

      if (!schemaData.trim()) {
        console.error('Error: No input provided. Use -f <file> or pipe JSON to stdin');
        printUsage();
        process.exit(1);
      }

      const result = validateSchema(schemaData, options.verbose);
      const exitCode = printResults(result, options.verbose);
      process.exit(exitCode);
    });
    return;
  }

  const result = validateSchema(schemaData, options.verbose);
  const exitCode = printResults(result, options.verbose);
  process.exit(exitCode);
}

module.exports = { validateSchema, ValidationResult };
