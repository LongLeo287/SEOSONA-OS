# pSEO Template Syntax Guide

Nunjucks-style templating for programmatic SEO page generation.

## Variable Interpolation

```nunjucks
{{ variable }}
{{ object.property }}
{{ array[0] }}
```

**Example:**
```html
<h1>{{ service }} in {{ city }}</h1>
<p>Average cost: ${{ price | formatNumber }}</p>
```

## Loops

```nunjucks
{% for item in items %}
  <li>{{ item.name }}</li>
{% endfor %}

{% for key, value in object %}
  <dt>{{ key }}</dt>
  <dd>{{ value }}</dd>
{% endfor %}
```

**Example - Feature List:**
```html
<ul class="features">
{% for feature in features %}
  <li>
    <strong>{{ feature.name }}</strong>
    <p>{{ feature.description }}</p>
  </li>
{% endfor %}
</ul>
```

**Example - FAQ Schema:**
```html
{% for qa in faqs %}
<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
  <h3 itemprop="name">{{ qa.question }}</h3>
  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
    <p itemprop="text">{{ qa.answer }}</p>
  </div>
</div>
{% endfor %}
```

## Conditionals

```nunjucks
{% if condition %}
  <p>True branch</p>
{% endif %}

{% if value > 100 %}
  <span class="high">{{ value }}</span>
{% elif value > 50 %}
  <span class="medium">{{ value }}</span>
{% else %}
  <span class="low">{{ value }}</span>
{% endif %}
```

**Example - Conditional Content:**
```html
{% if isPremium %}
  <div class="premium-badge">Premium Service</div>
{% endif %}

{% if rating >= 4.5 %}
  <span class="badge-excellent">Excellent</span>
{% elif rating >= 3.5 %}
  <span class="badge-good">Good</span>
{% else %}
  <span class="badge-fair">Fair</span>
{% endif %}
```

## Filters

Common filters for content transformation:

```nunjucks
{{ text | upper }}              <!-- UPPERCASE -->
{{ text | lower }}              <!-- lowercase -->
{{ text | capitalize }}         <!-- Capitalize First -->
{{ text | truncate(100) }}      <!-- Truncate to 100 chars -->
{{ number | formatNumber }}     <!-- 1,234.56 -->
{{ date | formatDate }}         <!-- Jan 1, 2025 -->
{{ url | slugify }}             <!-- my-url-slug -->
```

**Example - Formatted Output:**
```html
<h1>{{ city | capitalize }} {{ service | lower }}</h1>
<p class="intro">{{ description | truncate(150) }}</p>
<span class="price">${{ price | formatNumber }}</span>
<time datetime="{{ date }}">{{ date | formatDate }}</time>
```

**Custom Filters:**
```javascript
// Filter implementation
filters: {
  formatNumber: (num) => num.toLocaleString('en-US'),
  slugify: (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  truncate: (str, len) => str.length > len ? str.slice(0, len) + '...' : str
}
```

## Include/Extends Patterns

```nunjucks
{% extends "layouts/base.html" %}

{% block title %}{{ city }} {{ service }} - Brand{% endblock %}

{% block content %}
  <h1>{{ heading }}</h1>
  {% include "partials/cta.html" %}
{% endblock %}
```

**Example - Layout Inheritance:**
```html
<!-- layouts/base.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Default Title{% endblock %}</title>
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>

<!-- pages/location.html -->
{% extends "layouts/base.html" %}
{% block title %}{{ service }} in {{ city }}{% endblock %}
{% block content %}
  <h1>{{ service }} in {{ city }}</h1>
  {% include "partials/service-list.html" %}
{% endblock %}
```

## Data Binding Examples

**Location Page Template:**
```html
{% extends "layouts/base.html" %}

{% block title %}{{ service }} in {{ city }}, {{ state }} - {{ brand }}{% endblock %}

{% block meta %}
<meta name="description" content="Find the best {{ service | lower }} in {{ city }}. {{ rating | formatNumber }} stars from {{ reviewCount }} reviews.">
{% endblock %}

{% block content %}
<article>
  <h1>{{ service }} in {{ city }}, {{ state }}</h1>

  <div class="intro">
    <p>{{ introText }}</p>
    <div class="stats">
      <span>⭐ {{ rating }}/5.0</span>
      <span>💬 {{ reviewCount }} reviews</span>
      <span>📍 {{ businessCount }} providers</span>
    </div>
  </div>

  <h2>Top {{ service }} Providers in {{ city }}</h2>
  <ul class="providers">
  {% for provider in topProviders %}
    <li>
      <h3>{{ provider.name }}</h3>
      <p>{{ provider.description | truncate(120) }}</p>
      <span class="price">From ${{ provider.price | formatNumber }}</span>
    </li>
  {% endfor %}
  </ul>

  {% if faqs.length > 0 %}
  <h2>Frequently Asked Questions</h2>
  {% for faq in faqs %}
  <div class="faq-item">
    <h3>{{ faq.question }}</h3>
    <p>{{ faq.answer }}</p>
  </div>
  {% endfor %}
  {% endif %}

  <h2>Related Services in {{ city }}</h2>
  <nav class="related">
  {% for related in relatedServices %}
    <a href="{{ related.url }}">{{ related.title }}</a>
  {% endfor %}
  </nav>
</article>
{% endblock %}
```

**Comparison Page Template:**
```html
{% extends "layouts/base.html" %}

{% block title %}{{ productA }} vs {{ productB }}: Which is Better?{% endblock %}

{% block content %}
<article>
  <h1>{{ productA }} vs {{ productB }} Comparison</h1>

  <table class="comparison">
    <thead>
      <tr>
        <th>Feature</th>
        <th>{{ productA }}</th>
        <th>{{ productB }}</th>
      </tr>
    </thead>
    <tbody>
    {% for feature in features %}
      <tr>
        <td>{{ feature.name }}</td>
        <td>
          {% if feature.productA %}
            {{ feature.productA }}
          {% else %}
            <span class="unavailable">Not available</span>
          {% endif %}
        </td>
        <td>
          {% if feature.productB %}
            {{ feature.productB }}
          {% else %}
            <span class="unavailable">Not available</span>
          {% endif %}
        </td>
      </tr>
    {% endfor %}
    </tbody>
  </table>

  <div class="verdict">
    <h2>Verdict</h2>
    <p>{{ verdict }}</p>
  </div>
</article>
{% endblock %}
```

## Complete Template Example

**Input Data (JSON):**
```json
{
  "city": "Austin",
  "state": "TX",
  "service": "Plumbing Services",
  "rating": 4.7,
  "reviewCount": 342,
  "businessCount": 127,
  "topProviders": [
    {
      "name": "ABC Plumbing",
      "description": "Licensed plumbers serving Austin since 2005",
      "price": 125
    }
  ],
  "faqs": [
    {
      "question": "How much does a plumber cost in Austin?",
      "answer": "Average hourly rate is $125-175 depending on complexity."
    }
  ]
}
```

**Generated Output (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Plumbing Services in Austin, TX - PlumberPro</title>
  <meta name="description" content="Find the best plumbing services in Austin. 4.7 stars from 342 reviews.">
</head>
<body>
  <article>
    <h1>Plumbing Services in Austin, TX</h1>

    <div class="stats">
      <span>⭐ 4.7/5.0</span>
      <span>💬 342 reviews</span>
      <span>📍 127 providers</span>
    </div>

    <h2>Top Plumbing Services Providers in Austin</h2>
    <ul class="providers">
      <li>
        <h3>ABC Plumbing</h3>
        <p>Licensed plumbers serving Austin since 2005</p>
        <span class="price">From $125</span>
      </li>
    </ul>

    <h2>Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>How much does a plumber cost in Austin?</h3>
      <p>Average hourly rate is $125-175 depending on complexity.</p>
    </div>
  </article>
</body>
</html>
```

## Best Practices

1. **Variable Names:** Use descriptive camelCase or snake_case
2. **Filter Chain:** `{{ text | truncate(100) | capitalize }}`
3. **Whitespace Control:** `{%- for -%}` removes whitespace
4. **Safe Output:** Auto-escapes HTML by default
5. **Comments:** `{# This is a comment #}`
