# Email Template System

A reusable email template system for 21st.dev with consistent design, components, and styling based on our Figma design system.

## Overview

This system provides:
- **Design Tokens**: Centralized colors, typography, spacing, and other design values
- **Reusable Components**: Pre-built email components that work with `@react-email/components`
- **Base Template**: A complete template you can fork and customize
- **Consistency**: All emails follow the same design language

## Design System

### Colors
- **Primary**: `#0033ff` (21st blue)
- **Background**: `#0033ff` (email background)
- **Text**: Black/gray with proper opacity levels
- **Footer**: White with reduced opacity on blue background

### Typography
- **Heading 1**: ABC Semibold 45px, -0.9px tracking, 50px line-height
- **Heading 2**: ABC Semibold 35px, -0.7px tracking, 40px line-height
- **Body**: ABC Regular 19px, -0.38px tracking, 32px line-height
- **Footer**: ABC Regular 15px, -0.3px tracking, 20px line-height
- **Button**: Geist Mono Regular 11px, 0.66px tracking, uppercase

### Layout
- **Container Width**: 480px
- **Card Border Radius**: 32px
- **Card Padding**: 48px
- **Button Border Radius**: 999px (fully rounded)

## Quick Start

### Using the Base Template

The simplest way to create a new email is to use the `BaseEmailTemplate`:

```tsx
import { BaseEmailTemplate } from "@/lib/emails/base-template"

export const MyEmail = () => {
  return (
    <BaseEmailTemplate
      preview="Welcome to 21st.dev!"
      title="Welcome aboard!"
      content="We're excited to have you join our community."
      buttonText="Get Started"
      buttonUrl="https://21st.dev/magic"
      authorName="Serafim"
    />
  )
}
```

### Building Custom Emails

For more control, use individual components:

```tsx
import { Heading, Text } from "@react-email/components"
import {
  EmailLayout,
  EmailHeader,
  EmailCard,
  EmailSection,
  EmailButton,
  EmailSignature,
  EmailFooter,
} from "@/lib/emails/components"
import { colors, typography, spacing } from "@/lib/emails/design-tokens"

export const CustomEmail = () => {
  return (
    <EmailLayout preview="Your preview text">
      <EmailHeader />
      <EmailCard>
        <EmailSection>
          <Heading style={h1Style}>Your Title</Heading>
          <Text style={bodyStyle}>Your content here...</Text>
          
          <EmailButton variant="primary" href="https://21st.dev">
            Call to Action
          </EmailButton>
          
          <EmailSignature authorName="Serafim" />
        </EmailSection>
      </EmailCard>
      <EmailFooter />
    </EmailLayout>
  )
}

const h1Style = {
  fontSize: typography.h1.fontSize,
  fontWeight: typography.h1.fontWeight,
  lineHeight: typography.h1.lineHeight,
  letterSpacing: typography.h1.letterSpacing,
  fontFamily: typography.h1.fontFamily,
  color: colors.text.primary,
  margin: "0 0 16px 0",
}

const bodyStyle = {
  fontSize: typography.body.fontSize,
  fontWeight: typography.body.fontWeight,
  lineHeight: typography.body.lineHeight,
  letterSpacing: typography.body.letterSpacing,
  fontFamily: typography.body.fontFamily,
  color: colors.text.secondary,
  margin: `0 0 ${spacing.sm} 0`,
}
```

## Components

### EmailLayout

Base wrapper for all emails. Provides HTML structure, preview text, and blue background.

```tsx
<EmailLayout preview="Email preview text">
  {/* Your content */}
</EmailLayout>
```

**Props:**
- `children: React.ReactNode` - Email content
- `preview: string` - Preview text shown in email clients

---

### EmailHeader

Logo header section with 21st.dev logo.

```tsx
<EmailHeader />
<EmailHeader logoUrl="https://custom.com/logo.svg" />
```

**Props:**
- `logoUrl?: string` - Optional custom logo URL (defaults to `/logo-blue.svg`)

---

### EmailCard

White card container with rounded corners and padding.

```tsx
<EmailCard>
  {/* Your content */}
</EmailCard>
```

**Props:**
- `children: React.ReactNode` - Card content

---

### EmailSection

Content section with vertical spacing between elements.

```tsx
<EmailSection>
  {/* Your content with automatic spacing */}
</EmailSection>

<EmailSection gap="32px">
  {/* Custom gap */}
</EmailSection>
```

**Props:**
- `children: React.ReactNode` - Section content
- `gap?: string` - Custom gap between elements (defaults to 48px)

---

### EmailButton

Styled button with three variants.

```tsx
<EmailButton variant="primary" href="https://21st.dev">
  Click me
</EmailButton>

<EmailButton variant="secondary" href="https://21st.dev">
  Secondary Action
</EmailButton>

<EmailButton variant="inverse" href="https://21st.dev">
  Inverse Style
</EmailButton>
```

**Props:**
- `children: React.ReactNode` - Button text
- `href: string` - Button URL
- `variant?: "primary" | "secondary" | "inverse"` - Button style (defaults to "primary")

**Variants:**
- `primary`: Blue background, white text
- `secondary`: Transparent background, blue text, blue border
- `inverse`: White background, blue text, blue border

---

### EmailSignature

Author signature with optional logo.

```tsx
<EmailSignature authorName="Serafim" />

<EmailSignature
  authorName="Serafim"
  showLogo={true}
  logoUrl="https://21st.dev/union-logo.svg"
/>
```

**Props:**
- `authorName: string` - Name to display in signature
- `showLogo?: boolean` - Whether to show logo below signature
- `logoUrl?: string` - Custom logo URL (only used if `showLogo` is true)

---

### EmailFooter

Footer with social links and company name.

```tsx
<EmailFooter />

<EmailFooter
  links={[
    { name: "LinkedIn", url: "https://linkedin.com/..." },
    { name: "Twitter", url: "https://twitter.com/..." },
  ]}
  companyName="Custom Company Name"
/>
```

**Props:**
- `links?: SocialLink[]` - Array of social links (defaults to LinkedIn, Twitter, Github)
- `companyName?: string` - Company name (defaults to "21st Labs Inc.")

**SocialLink Type:**
```tsx
interface SocialLink {
  name: string
  url: string
}
```

---

## Design Tokens

Import design tokens to ensure consistency:

```tsx
import { colors, typography, spacing, borderRadius, layout } from "@/lib/emails/design-tokens"
```

### Colors
```tsx
colors.primary        // #0033ff
colors.background     // #0033ff
colors.white          // #ffffff
colors.text.primary   // #000000
colors.text.secondary // rgba(0, 0, 0, 0.8)
colors.highlight      // #0033ff
```

### Typography
```tsx
typography.h1         // Heading 1 styles
typography.h2         // Heading 2 styles
typography.body       // Body text styles
typography.footer     // Footer text styles
typography.button     // Button text styles
```

### Spacing
```tsx
spacing.xs           // 10px
spacing.sm           // 16px
spacing.md           // 24px
spacing.lg           // 32px
spacing.xl           // 48px
spacing.section      // 48px
spacing.subsection   // 32px
spacing.element      // 16px
```

## Migration Guide

### Migrating Existing Templates

To migrate an existing email template to the new system:

1. **Import new components**:
```tsx
import {
  EmailLayout,
  EmailHeader,
  EmailCard,
  EmailSection,
  EmailButton,
  EmailSignature,
  EmailFooter,
} from "@/lib/emails/components"
import { colors, typography, spacing } from "@/lib/emails/design-tokens"
```

2. **Replace structure**:
- Replace `<Html>`, `<Head>`, `<Body>`, `<Container>` with `<EmailLayout>`
- Wrap content in `<EmailCard>`
- Use `<EmailSection>` for content blocks
- Replace custom buttons with `<EmailButton>`

3. **Update styles**:
- Use design tokens instead of inline style objects
- Apply typography tokens to `<Heading>` and `<Text>` components

4. **Example**: See `invite-template-new.tsx` for a complete migration example

### Before & After

**Before:**
```tsx
<Html>
  <Head />
  <Body style={main}>
    <Container style={container}>
      <Section style={section}>
        <Heading style={h1}>Title</Heading>
        <Button style={button} href="url">Click</Button>
      </Section>
    </Container>
  </Body>
</Html>
```

**After:**
```tsx
<EmailLayout preview="Preview text">
  <EmailHeader />
  <EmailCard>
    <EmailSection>
      <Heading style={h1}>Title</Heading>
      <EmailButton variant="primary" href="url">Click</EmailButton>
    </EmailSection>
  </EmailCard>
  <EmailFooter />
</EmailLayout>
```

## Sending Emails

Use with Resend as before:

```tsx
import { Resend } from "resend"
import { MyEmail } from "@/lib/emails/my-email"

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: "Serafim from 21st.dev <serafim@hey.21st.dev>",
  to: email,
  subject: "Your subject",
  react: MyEmail({ ...props }),
})
```

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Use EmailLayout** as the root wrapper for all emails
3. **Keep content in EmailCard** for consistent white card appearance
4. **Use EmailSection** for proper vertical spacing
5. **Prefer BaseEmailTemplate** for simple emails
6. **Build custom** when you need specific layouts
7. **Test emails** with different email clients
8. **Keep it simple** - email clients have limited CSS support

## Examples

### Invite Email (Waitlist)

Use `InviteEmail` from `invite-template.tsx`:

```tsx
import { Resend } from "resend"
import { InviteEmail } from "@/lib/emails/invite-template"

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: "Serafim from 21st <serafim@hey.21st.dev>",
  replyTo: "21st Support <support@21st.dev>",
  to: userEmail,
  subject: "Thank you for joining our waitlist!",
  react: InviteEmail({
    inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/community`,
    userName: userDisplayName, // optional
  }),
})
```

Notes:
- Explore library: `https://21st.dev/community`
- First invites: October 30

### Simple Notification Email

```tsx
export const NotificationEmail = ({ message }: { message: string }) => {
  return (
    <BaseEmailTemplate
      preview="You have a new notification"
      title="New Notification"
      content={message}
      authorName="21st.dev Team"
    />
  )
}
```

### Multi-Section Email

```tsx
export const WelcomeEmail = ({ firstName }: { firstName: string }) => {
  return (
    <EmailLayout preview="Welcome to 21st.dev!">
      <EmailHeader />
      <EmailCard>
        <EmailSection>
          <Heading style={h1}>Welcome, {firstName}!</Heading>
          <Text style={bodyText}>
            We're excited to have you join our community.
          </Text>
          
          <Heading style={h2}>What's next?</Heading>
          <Text style={bodyText}>
            Start exploring our component library and build amazing UIs.
          </Text>
          
          <EmailButton variant="primary" href="https://21st.dev/magic">
            Explore Components
          </EmailButton>
          
          <EmailSignature authorName="Serafim" />
        </EmailSection>
      </EmailCard>
      <EmailFooter />
    </EmailLayout>
  )
}
```

## Support

For questions or issues with the email template system, contact the engineering team or check our internal documentation.

---

**Last Updated**: Based on Figma design (node-id=7464-82893)

