# Conversational AI Agents Guide

Build real-time voice agents with ElevenLabs Agents Platform.

## SDK Installation

```bash
# Python (with audio support)
pip install "elevenlabs[pyaudio]"

# JavaScript/Node.js
npm install @11labs/client
```

## Python Quick Start

```python
from elevenlabs import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation

# Initialize client
client = ElevenLabs(api_key="YOUR_API_KEY")

# Start conversation (uses default system audio)
conversation = Conversation.start_session(
    agent_id="YOUR_AGENT_ID",
    on_message=lambda msg: print(f"Agent: {msg}"),
    on_user_message=lambda msg: print(f"User: {msg}"),
    on_error=lambda e: print(f"Error: {e}")
)

# The conversation runs until stopped
conversation.wait_for_session_end()
```

## JavaScript Quick Start

```javascript
import { Conversation } from "@11labs/client";

const conversation = await Conversation.startSession({
  agentId: "YOUR_AGENT_ID",
  onMessage: (message) => console.log("Agent:", message),
  onUserMessage: (message) => console.log("User:", message),
  onConnect: () => console.log("Connected"),
  onDisconnect: () => console.log("Disconnected"),
});

// End session
conversation.endSession();
```

## WebSocket Streaming

For custom audio handling:

```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    if data["type"] == "audio":
        # Handle audio chunk
        audio_bytes = base64.b64decode(data["audio"])

ws = websocket.WebSocketApp(
    "wss://api.elevenlabs.io/v1/convai/conversation",
    header={"xi-api-key": "YOUR_API_KEY"},
    on_message=on_message
)

# Send user audio
ws.send(json.dumps({
    "type": "audio",
    "audio": base64.b64encode(audio_chunk).decode()
}))
```

## Phone Integration

### Twilio Setup

1. Create agent in ElevenLabs dashboard
2. Get webhook URL from agent settings
3. Configure Twilio number to forward to webhook

```python
# Twilio webhook handler
from flask import Flask, request
app = Flask(__name__)

@app.route("/voice", methods=["POST"])
def voice():
    return f"""
    <Response>
        <Connect>
            <Stream url="wss://api.elevenlabs.io/v1/convai/twilio/{AGENT_ID}" />
        </Connect>
    </Response>
    """
```

### Supported Providers
- Twilio
- Vonage
- Telnyx
- Plivo
- Genesys
- Generic SIP

## Agent Configuration

### Knowledge Base (RAG)
Upload documents for agent to reference:

```python
client.agents.knowledge_base.add(
    agent_id="YOUR_AGENT_ID",
    files=["product_docs.pdf", "faq.txt"]
)
```

### Custom Tools

Define tools agent can invoke:

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"}
            }
        }
    }
]
```

### Voice Selection

Use low-latency voices for agents:
- Flash v2.5 recommended (~75ms)
- Turbo v2.5 for higher quality (~250ms)

## Best Practices

1. **Latency**: Use Flash models + streaming
2. **Interruption Handling**: Configure turn detection sensitivity
3. **Error Recovery**: Implement reconnection logic
4. **Testing**: Use agent test mode before production
5. **Monitoring**: Track conversation metrics in dashboard

## Concurrency Limits

| Plan | Agent Connections |
|------|------------------|
| Free | 2 |
| Starter | 3 |
| Creator | 5 |
| Pro | 10 |
| Scale | 15 |
| Enterprise | Custom |

~5 concurrent connections supports ~100 simultaneous audio broadcasts.
