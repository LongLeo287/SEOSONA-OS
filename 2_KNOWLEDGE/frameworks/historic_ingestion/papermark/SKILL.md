---
name: "papermark"
description: "Historic standalone skill"
keywords: ["papermark", "ingested"]
mcp_compatible: true
---

# Papermark (Open-source DocSend alternative)

## Overview
Papermark is an open-source document-sharing platform featuring built-in analytics and custom domains. It serves as a privacy-first, self-hostable alternative to DocSend.

## Core Features
- **Shareable Links:** Secure document sharing via custom links.
- **Custom Branding:** Support for custom domains and branding.
- **Analytics:** Document tracking (views, soon page-by-page analytics).
- **Self-hosted:** Open-source architecture allowing full customization.

## Tech Stack
- **Framework:** Next.js (TypeScript)
- **Styling/UI:** Tailwind CSS, shadcn/ui
- **Database/ORM:** PostgreSQL, Prisma
- **Auth & Analytics:** NextAuth.js, Tinybird (Analytics)
- **Infrastructure:** AWS S3 / Vercel Blob, Resend, Stripe, Vercel

## System Architecture / Insights
Papermark relies heavily on Tinybird for real-time analytics, pushing data sources and endpoints via the `tb` CLI. Its dependency on Next.js App Router and Prisma gives it a modern, scalable full-stack structure.

*Source: github.com/mfts/papermark*
