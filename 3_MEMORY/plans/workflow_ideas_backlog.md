# Workflow Ideas Backlog

*This file stores ideas for future SEOSONA OS workflows that have not yet been implemented. AI Agents should review this backlog when asked for new workflow ideas.*

## 1. Omnichannel Content Repurposing
* **Purpose:** Transform a single piece of root content (e.g., a YouTube Video or a Podcast episode) into a complete content ecosystem.
* **Execution Flow:**
  1. `content-strategist`: Summarize the root content.
  2. `seo-content-master`: Write a 2000-word SEO-optimized blog post based on the content.
  3. `social-media-manager`: Repurpose the blog post into 5 Facebook/LinkedIn posts and 1 Twitter (X) thread.
  4. `email-wizard`: Write a summary email newsletter to send to the subscriber list.

## 2. Automated Cold Outreach
* **Purpose:** Automatically source potential leads, analyze their websites, and send personalized cold emails.
* **Execution Flow:**
  1. `scout-external` (or Firecrawl): Scrape data from the potential client's website.
  2. `lead-qualifier`: Perform Lead Scoring to determine if they match the ideal customer profile (ICP).
  3. `seo-specialist`: Run a quick audit on their website to find the top 3 biggest weaknesses.
  4. `copywriter`: Write a cold email proposing a solution that specifically addresses those 3 identified weaknesses.

## 3. Client Onboarding & Setup
* **Purpose:** Standardize the process when signing a contract with a new client.
* **Execution Flow:**
  1. Create a new project directory structure under `SEO_WORKSPACE/clients/`.
  2. `project-manager`: Create a task list (Kanban/Checklist) for the first month.
  3. Request access (GSC, GA4) and configure the `config.json` file for that project.
  4. Trigger the **SEOSONA Grand Audit** to generate the Kick-off report.

## 4. Content Decay Revival
* **Purpose:** Identify articles on the website that are losing traffic and "boost" them to rank again.
* **Execution Flow:**
  1. `analytics-analyst`: Pull data from GSC, find articles that dropped off page 1 in the last 3 months.
  2. `seo-specialist`: Scan the current SERP to see what competitors are doing better.
  3. `seo-content-master`: Update the content, add new sections, fix meta tags, and generate a diff file for the update.

## 5. Automated Multimedia Video Factory
* **Purpose:** Convert text content (like a blog URL) into a complete, ready-to-publish short-form video.
* **Execution Flow:**
  1. `content-strategist`: Write a 60-second video script based on the target URL.
  2. `ai-artist` & ElevenLabs integration: Generate visual assets and voiceover audio.
  3. `remotion` (React video): Render an MP4 video combining the audio, visuals, and dynamic subtitles.
  4. `social-media-manager`: Automatically format and schedule the video post to social platforms.

## 6. Scientific Literature & Medical E-E-A-T Synthesis
* **Purpose:** Automatically retrieve and synthesize peer-reviewed medical and scientific data to supercharge YMYL (Your Money or Your Life) content E-E-A-T scores.
* **Execution Flow:**
  1. `researcher`: Fetch data from PubMed, ClinicalTrials, AlphaFold, or ChEMBL databases related to the target keyword.
  2. `seo-content-master`: Inject scientifically accurate citations, biological IDs, and factual data points into the blog post.
  3. `seo-specialist`: Validate the content against Google's Medical/Health E-E-A-T guidelines to ensure maximum trust signals.
