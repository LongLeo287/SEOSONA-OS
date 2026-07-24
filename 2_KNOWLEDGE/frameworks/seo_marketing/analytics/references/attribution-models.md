# Attribution Models

## Model Types

### Last Click
- **How it works:** 100% credit to last touchpoint
- **Pros:** Simple, clear accountability
- **Cons:** Ignores awareness/consideration
- **Use when:** Short sales cycles, direct response

### First Click
- **How it works:** 100% credit to first touchpoint
- **Pros:** Values discovery
- **Cons:** Ignores conversion influence
- **Use when:** Brand awareness focus

### Linear
- **How it works:** Equal credit to all touchpoints
- **Pros:** Fair, simple to understand
- **Cons:** Doesn't reflect true influence
- **Use when:** Long consideration phases

### Time Decay
- **How it works:** More credit to recent touchpoints
- **Pros:** Values recency
- **Cons:** May undervalue awareness
- **Use when:** Short consideration cycles

### Position-Based (U-shaped)
- **How it works:** 40% first, 40% last, 20% middle
- **Pros:** Values discovery and conversion
- **Cons:** Arbitrary weights
- **Use when:** Balanced view needed

### Data-Driven
- **How it works:** ML determines credit based on data
- **Pros:** Most accurate
- **Cons:** Requires significant data
- **Use when:** Sufficient conversion volume

## Choosing a Model

| Scenario | Recommended Model |
|----------|-------------------|
| New brand/product | First Click or Position-Based |
| E-commerce | Last Click or Time Decay |
| B2B long cycle | Linear or Position-Based |
| Mature business | Data-Driven |
| Limited data | Last Click |

## Multi-Touch Attribution Setup

1. **Define conversion events**
   - Primary: Purchase, sign-up
   - Secondary: Lead, add-to-cart

2. **Set lookback window**
   - B2C: 7-30 days
   - B2B: 30-90 days

3. **Track all touchpoints**
   - UTM parameters
   - Cross-device tracking
   - Offline touchpoints

4. **Compare models**
   - Run multiple models in parallel
   - Understand differences

## Common Pitfalls

- Over-crediting last click (kills awareness)
- Ignoring view-through conversions
- Not accounting for cross-device
- Too short lookback window
