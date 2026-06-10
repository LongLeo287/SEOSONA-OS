# LinkedIn API Workflow

OAuth 2.0 with REST API v2. Supports personal profiles and company pages.

## OAuth Flow

```typescript
const scopes = [
  'openid', 'profile', 'w_member_social', 'r_basicprofile',
  'rw_organization_admin', 'w_organization_social', 'r_organization_social'
];

// Auth URL
const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
  `response_type=code&client_id=${LINKEDIN_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(redirectUri)}&` +
  `scope=${encodeURIComponent(scopes.join(' '))}`;

// Exchange code for tokens
const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code, redirect_uri, client_id, client_secret
  })
});
const { access_token, refresh_token, expires_in } = await tokenResponse.json();

// Refresh token
const refreshResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'refresh_token', refresh_token, client_id, client_secret
  })
});
```

## Media Upload (Images/Videos/PDFs)

```typescript
// 1. Initialize upload
const initResponse = await fetch(`https://api.linkedin.com/rest/images?action=initializeUpload`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202511',
    Authorization: `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    initializeUploadRequest: {
      owner: `urn:li:person:${personId}` // or urn:li:organization:${orgId}
    }
  })
});
const { value: { uploadUrl, image } } = await initResponse.json();

// 2. Upload media
await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'X-Restli-Protocol-Version': '2.0.0', 'LinkedIn-Version': '202511' },
  body: imageBuffer
});

// For videos, use chunked upload (2MB chunks) and finalize
await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
  method: 'POST',
  body: JSON.stringify({ finalizeUploadRequest: { video: videoUrn, uploadToken: '', uploadedPartIds: etags } })
});
```

## Post Creation

```typescript
// Text escaping required for special characters
const fixText = (text) => text
  .replace(/\\/g, '\\\\').replace(/</g, '\\<').replace(/>/g, '\\>')
  .replace(/#/g, '\\#').replace(/@/g, '\\@').replace(/\[/g, '\\[')
  .replace(/]/g, '\\]').replace(/\*/g, '\\*').replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');
// Note: Preserve @[Name](urn:li:organization:ID) mentions

// Create post
const response = await fetch('https://api.linkedin.com/rest/posts', {
  method: 'POST',
  headers: {
    'LinkedIn-Version': '202511',
    'X-Restli-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    author: `urn:li:person:${id}`, // or urn:li:organization:${id}
    commentary: fixText(message),
    visibility: 'PUBLIC',
    distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
    content: { media: { id: mediaUrn } }, // single media
    // OR for multiple images: content: { multiImage: { images: mediaIds.map(id => ({ id })) } }
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  })
});
const postId = response.headers.get('x-restli-id');
```

## PDF Carousel (Images as PDF)

Convert multiple images to PDF for carousel posts:
```typescript
import imageToPDF from 'image-to-pdf';
const pdfBuffer = await imageToPDF(imageBuffers, [width, height]);
// Upload as document type, add title: 'slides.pdf' in content
```

## Comments

```typescript
await fetch(`https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postId)}/comments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    actor: `urn:li:person:${id}`,
    object: postId,
    message: { text: fixText(comment) }
  })
});
```

## Company Page Lookup

```typescript
// Get company from vanity URL
const { elements } = await fetch(
  `https://api.linkedin.com/v2/organizations?q=vanityName&vanityName=${vanity}`,
  { headers: { 'X-Restli-Protocol-Version': '2.0.0', 'LinkedIn-Version': '202511', Authorization: `Bearer ${token}` } }
).then(r => r.json());
// Mention format: @[Company Name](urn:li:organization:123456)
```

## Repost

```typescript
await fetch('https://api.linkedin.com/rest/posts', {
  method: 'POST',
  headers: { /* same as post */ },
  body: JSON.stringify({
    author: `urn:li:person:${id}`,
    commentary: '',
    visibility: 'PUBLIC',
    lifecycleState: 'PUBLISHED',
    reshareContext: { parent: originalPostUrn }
  })
});
```

## Rate Limits

- Max concurrent: 2 jobs recommended
- Refresh required (tokens expire)
- Use `refreshWait` pattern for reliability
