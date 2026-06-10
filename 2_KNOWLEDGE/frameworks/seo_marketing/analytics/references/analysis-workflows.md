# Analysis Workflows

## Campaign Performance Analysis

### Step 1: Define Questions
- Did we hit targets?
- Which elements drove success/failure?
- What should we do differently?

### Step 2: Gather Data
- Export from ad platforms
- Pull GA4 data
- Get CRM conversion data
- Compile costs

### Step 3: Calculate Metrics
```
ROAS = Revenue / Ad Spend
CVR = Conversions / Clicks × 100
CPL = Spend / Leads
CAC = Total Cost / Customers
```

### Step 4: Benchmark
- vs. prior period
- vs. targets
- vs. industry averages

### Step 5: Generate Insights
- What patterns emerge?
- What's statistically significant?
- What's actionable?

## A/B Test Analysis

### Prerequisites
- Clear hypothesis
- Single variable tested
- Adequate sample size

### Statistical Significance
```
Minimum sample per variant:
n = (Z² × p × (1-p)) / E²

Where:
Z = 1.96 (95% confidence)
p = baseline conversion rate
E = minimum detectable effect
```

### Analysis Steps
1. Check sample sizes met
2. Calculate conversion rate per variant
3. Determine statistical significance
4. Calculate lift/confidence interval
5. Document learnings

### Decision Framework
| Significance | Effect Size | Decision |
|--------------|-------------|----------|
| Yes | Positive | Implement winner |
| Yes | Negative | Keep control |
| No | - | Continue testing |

## Funnel Analysis

### Funnel Stages
```
Awareness → Interest → Consideration → Intent → Purchase
```

### Identify Drop-offs
1. Map conversion rates between stages
2. Calculate drop-off rates
3. Compare to benchmarks
4. Prioritize biggest leaks

### Optimization Priority
```
Impact = Drop-off Rate × Potential Fix × Effort

Focus on: High impact, low effort fixes first
```

## Cohort Analysis

### Setup
- Define cohort (acquisition date, first action)
- Define metric (retention, revenue)
- Set time periods (weeks, months)

### Output Format
```
| Cohort | Week 1 | Week 2 | Week 3 | Week 4 |
|--------|--------|--------|--------|--------|
| Jan W1 | 100% | 45% | 35% | 30% |
| Jan W2 | 100% | 50% | 40% | 35% |
```

### Insights to Look For
- Improving/declining retention over time
- Seasonal patterns
- Impact of product changes
