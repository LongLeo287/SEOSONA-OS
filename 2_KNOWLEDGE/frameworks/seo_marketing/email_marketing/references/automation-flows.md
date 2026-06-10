# Email Automation Flows

Complete templates for automated email sequences with timing, triggers, and content frameworks.

## Flow Components

### Trigger Types

| Trigger | Description | Example |
|---------|-------------|---------|
| Event | User action triggers flow | Signup, purchase, download |
| Time-based | Scheduled recurring | Weekly newsletter, monthly recap |
| Behavioral | Engagement patterns | Inactivity, high engagement |
| Segment | Entering a segment | Score threshold, tag applied |
| Date | Calendar-based | Birthday, anniversary, renewal |

### Decision Branches

```
┌─────────────┐
│   Trigger   │
└──────┬──────┘
       │
       ▼
┌─────────────┐    Yes    ┌────────────────┐
│  Condition? ├──────────►│   Path A       │
└──────┬──────┘           └────────────────┘
       │ No
       ▼
┌────────────────┐
│    Path B      │
└────────────────┘
```

**Common conditions:**
- Opened email? → Engaged path
- Clicked link? → Interest path
- Purchased? → Exit flow
- Tagged as X? → Specialized path
- Score > threshold? → Sales path

---

## Welcome Sequence (5 Emails)

**Trigger:** New subscriber signup
**Goal:** Build relationship, establish value, introduce offer
**Duration:** 14 days

```
┌──────────────────────────────────────────────────────────────────┐
│ DAY 0                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Welcome to [Brand] + Your [Lead Magnet]            │ │
│ │ Content:                                                     │ │
│ │ - Deliver promised resource                                  │ │
│ │ - Set expectations for email frequency                       │ │
│ │ - Quick win or immediate value                               │ │
│ │ - Invite to reply (2-way conversation)                       │ │
│ │ CTA: Access your [resource]                                  │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 1 day                              │
│                                ↓                                 │
│ DAY 1                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Why I started [Brand]                               │ │
│ │ Content:                                                     │ │
│ │ - Origin story (relatable struggle)                          │ │
│ │ - Mission and values                                         │ │
│ │ - What makes you different                                   │ │
│ │ CTA: Follow on [social]                                      │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 2 days                             │
│                                ↓                                 │
│ DAY 3                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: My best [topic] tip (most people miss this)         │ │
│ │ Content:                                                     │ │
│ │ - High-value educational content                             │ │
│ │ - Actionable tip they can use today                          │ │
│ │ - Position as trusted advisor                                │ │
│ │ CTA: Try this and reply with results                         │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 4 days                             │
│                                ↓                                 │
│ DAY 7                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: [Customer] went from [Before] to [After]            │ │
│ │ Content:                                                     │ │
│ │ - Case study or testimonial                                  │ │
│ │ - Specific results with numbers                              │ │
│ │ - "You can do this too"                                      │ │
│ │ CTA: See how [product] works                                 │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 7 days                             │
│                                ↓                                 │
│ DAY 14                                                           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Ready for [transformation]?                         │ │
│ │ Content:                                                     │ │
│ │ - Soft offer with value recap                                │ │
│ │ - Address objections                                         │ │
│ │ - Limited-time incentive (optional)                          │ │
│ │ CTA: Get started with [offer]                                │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
                    Move to Newsletter segment
```

---

## Abandoned Cart Recovery (4 Emails)

**Trigger:** Cart abandoned (no purchase within 1 hour)
**Goal:** Recover lost sale
**Duration:** 7 days

```
┌──────────────────────────────────────────────────────────────────┐
│ HOUR 1                                                           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Did something go wrong?                             │ │
│ │ Content:                                                     │ │
│ │ - Helpful tone (not pushy)                                   │ │
│ │ - Show cart items with images                                │ │
│ │ - Technical support offer                                    │ │
│ │ CTA: Complete your order                                     │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│              ┌─────────────────┴─────────────────┐               │
│              │          Purchased?               │               │
│              └─────────────────┬─────────────────┘               │
│                    Yes ↓               ↓ No                      │
│              ┌────────────┐    ┌───────────────────┐             │
│              │  EXIT      │    │  Continue flow    │             │
│              └────────────┘    └───────────────────┘             │
│                                        ↓                         │
│                                   Wait 23 hours                  │
│                                        ↓                         │
│ DAY 1                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Your [items] are waiting                            │ │
│ │ Content:                                                     │ │
│ │ - Reminder of cart contents                                  │ │
│ │ - Benefits recap                                             │ │
│ │ - Urgency (limited stock, price may change)                  │ │
│ │ CTA: Grab your [items]                                       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 2 days                             │
│                                ↓                                 │
│ DAY 3                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Still thinking it over?                             │ │
│ │ Content:                                                     │ │
│ │ - Address common objections                                  │ │
│ │ - Customer testimonial                                       │ │
│ │ - Money-back guarantee reminder                              │ │
│ │ CTA: Try risk-free                                           │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 4 days                             │
│                                ↓                                 │
│ DAY 7                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Last chance: [X]% off expires tonight               │ │
│ │ Content:                                                     │ │
│ │ - Final reminder with discount                               │ │
│ │ - Scarcity (cart will clear)                                 │ │
│ │ - One-click checkout link                                    │ │
│ │ CTA: Save [X]% now                                           │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
                    Exit (cart cleared from session)
```

---

## Re-engagement Campaign (4 Emails)

**Trigger:** No email opens in 60+ days
**Goal:** Win back inactive subscribers or clean list
**Duration:** 21 days

```
┌──────────────────────────────────────────────────────────────────┐
│ DAY 0                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: We miss you, [Name]                                 │ │
│ │ Content:                                                     │ │
│ │ - Acknowledge absence                                        │ │
│ │ - What they're missing (best recent content)                 │ │
│ │ - Ask what they'd like to see                                │ │
│ │ CTA: Tell us your preferences                                │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│              ┌─────────────────┴─────────────────┐               │
│              │           Opened?                 │               │
│              └─────────────────┬─────────────────┘               │
│                    Yes ↓               ↓ No                      │
│              ┌────────────┐    ┌───────────────────┐             │
│              │  Tag: Re-  │    │  Continue flow    │             │
│              │  engaged   │    └───────────────────┘             │
│              │  EXIT      │            ↓                         │
│              └────────────┘       Wait 5 days                    │
│                                        ↓                         │
│ DAY 5                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: A gift just for you                                 │ │
│ │ Content:                                                     │ │
│ │ - Exclusive discount/offer                                   │ │
│ │ - "Because you've been with us"                              │ │
│ │ - Time-limited                                               │ │
│ │ CTA: Claim your [X]% off                                     │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 7 days                             │
│                                ↓                                 │
│ DAY 12                                                           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Should we part ways?                                │ │
│ │ Content:                                                     │ │
│ │ - Direct and honest                                          │ │
│ │ - Offer preference options                                   │ │
│ │ - Last value offer                                           │ │
│ │ CTA: Stay subscribed / Update preferences                    │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 9 days                             │
│                                ↓                                 │
│ DAY 21                                                           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Goodbye (for now)                                   │ │
│ │ Content:                                                     │ │
│ │ - Final notice                                               │ │
│ │ - Will remove from active list                               │ │
│ │ - Easy re-subscribe option                                   │ │
│ │ CTA: Keep me subscribed / I'll miss you too                  │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
           If no action: Tag "Inactive" + Remove from active list
```

---

## Upsell/Cross-sell Sequence (3 Emails)

**Trigger:** Purchase of Product A
**Goal:** Sell complementary Product B
**Duration:** 30 days

```
┌──────────────────────────────────────────────────────────────────┐
│ DAY 7 (After initial onboarding)                                 │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Getting value from [Product A]? Try this            │ │
│ │ Content:                                                     │ │
│ │ - Check how they're doing with Product A                     │ │
│ │ - Introduce complementary Product B                          │ │
│ │ - Show how they work together                                │ │
│ │ CTA: See how [Product B] enhances [Product A]                │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│              ┌─────────────────┴─────────────────┐               │
│              │        Purchased B?               │               │
│              └─────────────────┬─────────────────┘               │
│                    Yes ↓               ↓ No                      │
│              ┌────────────┐    ┌───────────────────┐             │
│              │  EXIT to   │    │  Continue flow    │             │
│              │  Product B │    └───────────────────┘             │
│              │  onboard   │            ↓                         │
│              └────────────┘       Wait 7 days                    │
│                                        ↓                         │
│ DAY 14                                                           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: [Customer] doubled results with this combo          │ │
│ │ Content:                                                     │ │
│ │ - Case study of A + B together                               │ │
│ │ - Specific metrics/results                                   │ │
│ │ - Bundle offer/discount                                      │ │
│ │ CTA: Get the bundle                                          │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                ↓                                 │
│                          Wait 16 days                            │
│                                ↓                                 │
│ DAY 30                                                           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Subject: Quick question about [Product A]                    │ │
│ │ Content:                                                     │ │
│ │ - Genuine check-in                                           │ │
│ │ - Soft mention of Product B benefits                         │ │
│ │ - Offer to help/demo                                         │ │
│ │ CTA: Schedule a quick call / See Product B                   │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Event-Triggered Flows

### Lead Magnet Download

```
Trigger: Downloaded [Resource Name]
         ↓
Email 1 (Immediately): Resource delivery + quick win
         ↓ Wait 2 days
Email 2: Related tip that expands on resource
         ↓ Wait 3 days
Email 3: Case study showing resource in action
         ↓ Wait 4 days
Email 4: Common mistakes when applying [topic]
         ↓ Wait 5 days
Email 5: Soft pitch for product/service
         ↓
Move to main newsletter
```

### Webinar Registration

```
Trigger: Registered for webinar
         ↓
Email 1 (Immediately): Confirmation + calendar invite
         ↓ Wait until Day -1
Email 2: Reminder + preparation tips
         ↓ Wait until Day 0 (1 hour before)
Email 3: "Starting soon" + join link
         ↓
         ├── Attended? → Thank you + replay + offer
         └── No-show? → Replay available + FOMO
         ↓ Wait 1 day
Email 4: Offer reminder + expiration
         ↓ Wait 2 days
Email 5: Last chance + testimonials
```

### Customer Renewal

```
Trigger: Subscription renewal date approaching
         ↓ 30 days before
Email 1: Renewal reminder + value recap
         ↓ 14 days before
Email 2: What's coming next (new features)
         ↓ 7 days before
Email 3: Early renewal incentive
         ↓ 1 day before
Email 4: Final reminder
         ↓
         ├── Renewed? → Thank you + onboard to new features
         └── Lapsed? → Win-back sequence
```

### Birthday/Anniversary

```
Trigger: Birthday date field
         ↓ On birthday
Email 1: Happy birthday + special gift
         ↓ Wait 7 days
Email 2: Hope you enjoyed your gift!
         ↓
         ├── Redeemed? → Thank you
         └── Not redeemed? → Reminder + extended deadline
```

---

## Flow Best Practices

### Timing Guidelines

| Flow Type | Typical Duration | Emails | Spacing |
|-----------|-----------------|--------|---------|
| Welcome | 14 days | 5-7 | Frequent start, then space out |
| Abandoned Cart | 7 days | 4 | 1hr, 24hr, 3d, 7d |
| Re-engagement | 21 days | 4 | Weekly |
| Onboarding | 30 days | 7-8 | Based on user actions |
| Nurture | 21-30 days | 5-7 | Every 2-4 days |

### Exit Conditions

Always define clear exit conditions:
- **Goal achieved** (purchased, signed up, etc.)
- **Unsubscribed**
- **Entered conflicting flow** (don't overwhelm)
- **Hard bounce** (invalid email)
- **Manual override** (support intervention)

### Personalization Tokens

```
{{first_name}} - Subscriber name
{{company}} - Company name
{{product_name}} - Product they bought/viewed
{{cart_items}} - Items in abandoned cart
{{last_purchase_date}} - Date of last order
{{expiry_date}} - When offer expires
{{segment}} - Their segment name
{{score}} - Lead score
```

### Metrics to Track

| Metric | Good | Great | Action if Low |
|--------|------|-------|---------------|
| Open Rate | 20-30% | 35%+ | Test subject lines |
| Click Rate | 2-5% | 5%+ | Improve CTAs |
| Conversion | 1-3% | 5%+ | Refine offer/copy |
| Unsubscribe | <0.5% | <0.2% | Check frequency |

---

## Integration

Use with:
- `copywriting` skill - Email body copy formulas
- `brand` skill - Voice consistency
- `/email:flow` command - Generate custom sequences
- `seo` skill - Landing page alignment
