export const getTagSelectionPrompt = (userMessage: string) => {
  return `You are an expert frontend design engineer. Your task is to analyze the user's request and select the most appropriate component tags.

Available tags:
---
button
input
form
checkbox
radio-button
select
modal-dialog
tooltip
popover
alert
badge
card
list
table
accordion
tab
carousel
breadcrumb
pagination
navbar-navigation
sidebar
footer
header
avatar
icon
image
video-player
map
chart-graph
calendar
date-picker
time-picker
progress-bar
spinner-loader
stepper-wizard
notification
chip-tag
rating
tree-view
timeline
authentication-login
registration-signup
search
filter
upload-download
drag-and-drop
animation
responsive-design
accessibility
internationalization
data-visualization
form-validation
error-handling
social-sharing
media-playback
material-design
flat-design
neumorphism
skeuomorphism
minimalist
dark-theme
light-theme
glassmorphism
3d-elements
e-commerce
dashboard
admin-panel
blog
portfolio
landing-page
mobile-app
enterprise
education
healthcare
finance
entertainment
text
video
audio
rich-media
code-snippet
shadcn
new-tag
menu
tanstack
otp
scroll-area
sheet
skeleton
sonner
switch
toggle
magicui
icons
mockup
integrations
border
gradient
confetti
iphone
bento
hotkey
shortcut
hint
separator
motion-primitives
number
segments
cursor
collapse
shimmer
number-flow
chat
buildui
web3
control
volume
sound
counter
hover
hook
comparison
link
profile
banner
upgrade
background
canvas
call-to-action
testimonials
beam
hero
cover
demo
features
grid
linear
highlight
parallax
labe
clients
event
reviews
plans
waitlist
email
users
faq
social-links
placeholder
scroll-progress
brands
partners
section
show-more
transition
text-effects
particles
success-page
desktop
safari
file-tree
deploy
planet
earth
globe
toast
aspect-ratio
changelog
ai-chat
pattern
ripple
dock
sign-in
lightboard
color-picker
drawer
pricing-card
pricing-section
infinite-scroll
credit-card
password
copy
textarea
texa
announcement
empty-state
team
status
slider
dropdown
theme-toggle
cookie
countdown
success
hover-card
android
statistics
tweets
marquee
toolbar
feedback
news
kanban
multiselect
radio-group
verification
payment-method
payment-plans
day-picker
react-aria
tag-list
categories
dropzone
tabs
combobox
meter
async
contacts
physics
open-source
git-hub
logos
spline
get-started
messaging
web-gl
voice
social-card
i-mac
macbook
apple
macbook-pro
documentation
newsletter
subscribe-form
table-of-content
gemini
options
price-slider
alert-dialog
tool
navbar
designali
stack
steps
progress
glitch
smoke
hexta-ui
snappy-slider
glow
flip-button
ai
sort
pin
draggable
checkout
horizontal
responsive
responsive-scroll-area
label
currency
delete
kbd
user
add-new
date-input
phone-number
mask
range
stats
preview
like
navigation
timezone
flag
listbox
retro
windows
position
equalizer
warning
update
tags
edit-profile
terms-conditions
invite
saa-s
onboarding
command
cmdk
info
help
share
tour
appointment
pricing-calendar
booking
kibo-ui
lib
sortable
system-theme
save
media
pixel
code-editor
sandbox
console
gantt
roadmap
gooey
order
order-tracking
bill
404
page-not-found
audio-player
projects
quote
todo
gallery
cycle
banners
reaction
emoji
stagger-animation
marketing
startup
agency
free
developer-tool
directory
personal-website
authentication
analytics
cms
boilerplate
shadcn-ui
neobrutalism
context-menu
image-card
floating-action-menu
floating-action-button
folder
menubar
document-editor
pill
interactive
stars
chetanui
whatsapp
resizable
search-bar
widget
panel
weather-ui
weather-card
animated-card
weather-widget
dashboard-widget
disclosure
in-view
sliding-number
blur
retro-ui
pointer
spartkles
vaib
award-badge
geist
product-hunt
liquid
color
qr-code
generator
choicebox
relative-time
home
login
matrix
rain
circle-progress-bar
status-dot
description
surface
material
fun
attachment
markdown
suggestion
keyboard
database
balloons
gauge
book
motion
typography
duration
time
page
submit
ufo
lucide
anime-js
decoration
lottie
orbital
saas
ui
date
clock
scroll-animation
cartoon
link-preview
lens
framer-motion
scroll-trigger
scroll-effect
scaling
file-upload
dots
music
wrapper
galaxy
draw
paint
graphs
animated
image-expansion
video-expansion
agi
machine-learning
voice-interface
knowledge-engine
memory-vault
modular-architecture
text-to-knowledge
creative-ai
open-ai-compatible
text-to-video
video-to-text
image-to-text
text-to-image
idea-to-script
movie-script
youtube
social-network
premium
morphing
rabden
text-animation
reading
reveal
focus
meta-balls
hover-animation
container
ai-input
scroll
showcase-card
p5-js
dropdown-menu
pdf
three
neura-network
swarm
dark-mode
simulation
7-segment
light-mode
futuristic
agent
planner
plan
neomorphic
glow-effect
cyber
pulse
cryptocurrency
trading
charts
real-time
blockchain
crypto-assets
fintech
market-data
sparkline
wallet
connect
ux
dapp
project-management
subscription
hover-effect
pixel-art
component
indicator
cta
mouse
cyberpunk
neon
animted
sci-fi
cards
expand
sophiscated
robot
holographic
eva
mvpblocks
button-hover
gsap
careers
jobs
contact
contact-form
shadcnblocks
casestudy
about-us
re-ui
easemize-ui
vignette
react-bitz
gradient-text
decrypted-text
text-effect
scroll-reveal
rotating-text
fade-in
magnet-lines
click-spark
magnet-hover
pixel-trail
splash-cursor
tilted-card
smooth
masonry
adaptive
shine
elastic
pricing
infinite-menu
rolling
colored
shaders
lightning
wave
thread
minimalistic
shape
distortion-effect
orb
balls
realistic
letter
waves
signup
dynamic
fluid
annotation
axis
brush
chords
delaunay-triangulation
voronoi
zoom
curves
finance-chart
threshold
radial-lines
glyphs
streamgraph
bar-group
static
bar-stack
dendrogram
linktypes
pie-chart
heatmaps
word-cloud
stacked-areas
legends
treemap
radar
radial-bar
split-line-path
polygons
network
box-plot
violin-plot
area-chart
incident-report
middle
incident-bar-chart
hover-ripple
border-ripple
ripple-in-and-out
multiple
stacked
bar-chart
horizontal-bar
stacked-diverging
funnel-chart
layered-chart
interpolation-chat
interpolation-chart
hexagon
dialog
3d-background
svg-filter
spiral
fibonacci-spiral
mathematical
geomatric
noise
grainy
customizable-background
visual-effects
cursor-trail
customizable
callout
picker
wheel-picker
download
hud
world
traffic
route
reusable
swiper
svg-animation
spotlight
hover-reaveal
proximity-effect
test
group
radial-charts
gddfg
timer
ripple-generator
selector
dither
dithering
trail
8bit
image-uploader
gaming
----

User request: ${userMessage}

Think step by step:
1. What is the user trying to build?
2. What UI components would be needed?
3. Which tags best represent these components?

Output a JSON array with 1-7 most relevant tags, depending on the complexity of the user's request. Be selective - quality over quantity.
`
}

export const getComponentFilterPromptByTags = (
  userMessage: string,
  selectedTag: string,
  tags: string[],
  demos: string,
) => {
  // we may need to filter demos to fit context's length
  // use tiktoken or something to get into; 200k context window for claude |
  // or we will just use gemini 2.5 flash LOL (that's go)

  return `You are a RAG expert selecting components for UI generation.

  User request: ${userMessage}
  Current category: ${selectedTag}
  Other selected categories: ${tags.join(", ")}
  
  Available components in ${selectedTag}:
  ${demos}
  
  Select the most relevant components that:
  1. Best fit the user's request
  2. Don't overlap with components likely selected from other categories
  3. Provide unique value for this specific category
  
  Return an array of ONE component ID. Select the most fitting one. Return empty array if none fit.

  Think first then output your answer in JSON format.

  Output format: \`\`\`json
  [demoId]
  \`\`\`
  `
}

export const generateComponentWithTagContext = (
  message: string,
  contextComponents: Array<{
    categoryName: string
    components: Array<{
      demoId: number
      demoName: string
      componentName: string
      description: string
      code: string
      demoCode: string
      tailwindConfig?: string
      globalCss?: string
      indexCss?: string
    }>
  }>,
  selectedTags: string[],
) => {
  const formattedContext = contextComponents
    .map(({ categoryName, components }) => {
      const componentDetails = components
        .map(
          (comp) => `
Demo: ${comp.demoName}
Component: ${comp.componentName}
Description: ${comp.description || "N/A"}
Demo Code:
\`\`\`tsx
${comp.demoCode}
\`\`\`
Component Code:
\`\`\`tsx
${comp.code}
\`\`\`
${comp.tailwindConfig ? `Tailwind Config Extension:\n\`\`\`js\n${comp.tailwindConfig}\n\`\`\`` : ""}
${comp.globalCss ? `Global CSS:\n\`\`\`css\n${comp.globalCss}\n\`\`\`` : ""}
${comp.indexCss ? `Index CSS:\n\`\`\`css\n${comp.indexCss}\n\`\`\`` : ""}
`,
        )
        .join("\n---\n")

      return `## Category: ${categoryName}\n${componentDetails}`
    })
    .join("\n\n")

  return `
Goal:
Generate a UI component that satisfies the user's request, intelligently combining and adapting elements from the provided reference components organized by categories.

Context:
The reference components have been selected based on these relevant tags: ${selectedTags.join(", ")}
Each category contains components that excel in that particular aspect of the design.

Component Requirements:
- Use Tailwind CSS for styling
- Use shadcn theming variables like \`bg-background\`, \`text-foreground\`, \`border-border\`, etc.
- Use icons only from 'lucide-react' or '@remixicon/react' libraries

CRITICAL - Component Inclusion Rules:
1. ONLY use components from this default list without including their code:
'accordion', 'alert-dialog', 'alert', 'aspect-ratio', 'avatar', 'badge', 'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox', 'collapsible', 'command', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'form', 'hover-card', 'input-otp', 'input', 'label', 'menubar', 'navigation-menu', 'pagination', 'popover', 'progress', 'radio-group', 'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'sidebar', 'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'toaster', 'toggle-group', 'toggle', 'tooltip', 'use-mobile'

2. If you use ANY component from the reference examples that is NOT in the default list above, you MUST include its FULL implementation code in the output file.

3. Intelligently combine elements from different categories:
   - Take the best structural patterns from one category
   - Adopt visual styling from another
   - Merge interaction patterns that complement each other
   - Create a cohesive component that leverages strengths from multiple references

TypeScript/React Code Quality Requirements:
1. NO duplicate component/function/variable names
2. Merge similar functionality instead of duplicating
3. Properly define TypeScript interfaces for all props
4. Ensure all imports are valid
5. Only ONE default export
6. Follow React Hooks rules
7. Include default prop values for preview

Component Guidelines:
- Analyze how components from different categories can work together
- Don't just copy one component - synthesize the best aspects from multiple references
- Consider how different category strengths can enhance the final result
- Ensure the merged design is cohesive and purposeful

Return Format:
Return ONE complete TypeScript/TSX file that includes:
1. ALL necessary imports
2. The FULL implementation of ANY custom components used
3. The main component implementation
4. A usage example with \`export default\`

User Message:
\`\`\`
${message}
\`\`\`

Reference Components by Category:
${formattedContext}

Generate a single valid, complete TypeScript/TSX file that intelligently combines elements from the provided categories. Output ONLY the code with no additional text.
`
}
