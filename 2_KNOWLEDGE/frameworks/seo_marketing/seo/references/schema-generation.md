# JSON+LD Schema Generation

## Common Schema Types

### Article/BlogPosting
```json
{
  "@context": "http~/.seosona/path/",
  "@type": "Article",
  "headline": "{title}",
  "author": {"@type": "Person", "name": "{author}"},
  "datePublished": "{date}",
  "image": "{image_url}",
  "publisher": {
    "@type": "Organization",
    "name": "{org}",
    "logo": {"@type": "ImageObject", "url": "{logo}"}
  }
}
```

### FAQPage
```json
{
  "@context": "http~/.seosona/path/",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "{question}",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "{answer}"
    }
  }]
}
```

### Product
```json
{
  "@context": "http~/.seosona/path/",
  "@type": "Product",
  "name": "{name}",
  "description": "{desc}",
  "offers": {
    "@type": "Offer",
    "price": "{price}",
    "priceCurrency": "USD"
  }
}
```

### HowTo
```json
{
  "@context": "http~/.seosona/path/",
  "@type": "HowTo",
  "name": "{title}",
  "step": [{
    "@type": "HowToStep",
    "name": "{step_name}",
    "text": "{step_text}"
  }]
}
```

### Organization
```json
{
  "@context": "http~/.seosona/path/",
  "@type": "Organization",
  "name": "{name}",
  "url": "{url}",
  "logo": "{logo}",
  "sameAs": ["{social_urls}"]
}
```

### BreadcrumbList
```json
{
  "@context": "http~/.seosona/path/",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "{name}",
    "item": "{url}"
  }]
}
```

## Validation
- Test: http~/.seosona/path/
- Validator: http~/.seosona/path/

## Best Practices
- One primary schema per page
- Match schema to content type
- Include all required fields
- Use absolute URLs
- Keep updated with content changes