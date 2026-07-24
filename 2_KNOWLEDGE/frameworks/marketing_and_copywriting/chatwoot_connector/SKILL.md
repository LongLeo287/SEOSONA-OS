---
name: seosona:chatwoot-connector
description: Connects SEOSONA agents to a self-hosted Chatwoot instance. Enables autonomous customer support, omni-channel messaging, and CRM integration.
metadata:
  author: seosona
  version: "1.0.0"
  reference: "http~/.seosona/path/"
---
# Chatwoot API Connector

Use this skill to programmatically interact with a Chatwoot instance. This allows SEOSONA OS to act as an automated customer support agent or synchronize CRM data.

## Authentication
All API requests must include the `api_access_token` in the headers.

```http
api_access_token: <your_bot_or_user_token>
Content-Type: application/json
```

## Core Endpoints

Assume `BASE_URL = http~/.seosona/path/`

### 1. Contacts (Khách hàng)
- **Create Contact**: `POST /contacts`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "phone_number": "+1234567890" }`
- **Search Contact**: `GET /contacts/search?q=john@example.com`

### 2. Conversations (Hội thoại)
- **List Conversations**: `GET /conversations?status=open&assignee_type=unassigned`
- **Create Conversation**: `POST /conversations`
  - Body: `{ "source_id": "contact_id", "inbox_id": "inbox_id" }`

### 3. Messages (Gửi / Nhận Tin Nhắn)
- **Send Message (Reply)**: `POST /conversations/{conversation_id}/messages`
  - Body: `{ "content": "Hello! How can I help you today?", "message_type": "outgoing", "private": false }`
- **List Messages**: `GET /conversations/{conversation_id}/messages`

### 4. Custom Attributes
You can update a conversation with custom attributes (e.g., SEO score, intent).
- `POST /conversations/{conversation_id}/custom_attributes`
  - Body: `{ "custom_attributes": { "intent": "purchase_seo_service" } }`

## Agent Rules
1. **Never hardcode tokens**: Always pull the `api_access_token` from `.env` or secure vault.
2. **Context Awareness**: Before replying, an Agent MUST fetch the conversation history to understand context.
3. **Zalo Bridge Integration**: When working with Zalo customers, this connector works seamlessly with `zca-bridge`.
4. **Handoff**: If the AI Agent cannot solve the issue, it MUST set the `assignee_id` to a human agent and add a `private: true` internal note summarizing the problem.
