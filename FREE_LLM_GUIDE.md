# Free LLM Integration Guide

This guide covers free alternatives to OpenAI for powering the Highpeak chatbot.

## Options Comparison

| Option | Cost | Setup | Speed | Quality | Best For |
|--------|------|-------|-------|---------|----------|
| **Ollama** | Free | Local | Fast | Good | Development |
| **HuggingFace Inference** | Free tier | Cloud | Medium | Good | Testing |
| **Replicate** | Free tier | Cloud | Medium | Very good | Production |
| **Together AI** | Free tier | Cloud | Fast | Excellent | Production |
| **LLaMA 2** | Free | Local | Slow | Good | Offline |

## 1. Ollama (Recommended for Development)

### What is Ollama?
Self-hosted LLM platform - run models locally on your machine. Completely free, no API keys needed.

### Installation

#### macOS
```bash
brew install ollama
```

#### Ubuntu/Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Windows
Download from [ollama.ai](https://ollama.ai)

### Setup

1. **Start Ollama service:**
```bash
ollama serve
```

2. **Pull a model** (in another terminal):
```bash
# Mistral - Fast, good quality (7B)
ollama pull mistral

# LLaMA 2 - Good quality (7B)
ollama pull llama2

# Neural Chat - Optimized for chat (7B)
ollama pull neural-chat
```

3. **Verify it's working:**
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "Hello"
}'
```

### Integration with Chatbot

Update chatbot API to use Ollama:

**File: `app/api/chatbot/message/route.ts`**

```typescript
async function generateResponseWithOllama(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
) {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral', // or 'llama2', 'neural-chat'
      messages: [
        {
          role: 'system',
          content: `You are Highpeak Consultants assistant. Help visitors learn about our architecture projects and services. Be helpful, professional, and encourage them to contact us for detailed inquiries.`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ],
      stream: false,
    }),
  })

  const data = await response.json()
  return data.message.content
}
```

### Environment Setup

No environment variables needed - Ollama runs locally.

### Advantages
- ✅ Completely free
- ✅ No API keys required
- ✅ Works offline
- ✅ Fast responses
- ✅ Privacy (data stays local)

### Disadvantages
- ❌ Requires local machine resources
- ❌ Not ideal for production
- ❌ Limited model selection

---

## 2. HuggingFace Inference API (Free Tier)

### What is It?
Cloud-hosted LLM inference. Free tier with rate limits.

### Setup

1. **Create account:** [huggingface.co](https://huggingface.co)

2. **Get API token:**
   - Settings → Access Tokens → New token
   - Copy token

3. **Add to `.env.local`:**
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
```

### Integration

```typescript
async function generateResponseWithHuggingFace(
  message: string,
  apiKey: string
) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1/v1/chat/completions',
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are Highpeak Consultants assistant...'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
      }),
    }
  )

  const data = await response.json()
  return data.choices[0].message.content
}
```

### Popular Free Models
- `mistralai/Mistral-7B-Instruct-v0.1` - Fast, good quality
- `meta-llama/Llama-2-7b-chat-hf` - Llama 2
- `NousResearch/Nous-Hermes-2-Mistral-7B-DPO` - High quality

### Advantages
- ✅ Cloud-hosted (no local resources)
- ✅ Easy setup
- ✅ Multiple models available
- ✅ Free tier available

### Disadvantages
- ❌ API rate limits on free tier
- ❌ Requires internet
- ❌ Slower responses than Ollama

---

## 3. Replicate (Free Tier)

### What is It?
API for running open-source models in the cloud.

### Setup

1. **Create account:** [replicate.com](https://replicate.com)

2. **Get API token:**
   - Account → API tokens → Copy token

3. **Add to `.env.local`:**
```env
REPLICATE_API_KEY=r8_xxxxxxxxxxxxx
```

4. **Install SDK:**
```bash
npm install replicate
```

### Integration

```typescript
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
})

async function generateResponseWithReplicate(message: string) {
  const output = await replicate.run(
    'mistralai/mistral-7b-instruct-v0.1:8e6975e5ed6174911a6ff3d60540dfd466844e7be6793602331e5da0cb944a02',
    {
      input: {
        prompt: `System: You are Highpeak Consultants assistant.
User: ${message}
Assistant:`,
      },
    }
  )

  return output.join('')
}
```

### Popular Models
- Mistral 7B
- LLaMA 2
- Nous Hermes

### Advantages
- ✅ Free tier (50 runs/month)
- ✅ Good quality responses
- ✅ Easy API
- ✅ Suitable for production

### Disadvantages
- ❌ Limited free credits
- ❌ Requires API key management

---

## 4. Together AI (Recommended for Production)

### What is It?
Fast, scalable LLM API with free tier and good pricing.

### Setup

1. **Create account:** [together.ai](https://together.ai)

2. **Get API key:** Account settings

3. **Add to `.env.local`:**
```env
TOGETHER_API_KEY=xxxxxxxxxxxxx
```

### Integration

```typescript
async function generateResponseWithTogether(message: string) {
  const response = await fetch('https://api.together.xyz/inference', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      prompt: `System: You are Highpeak Consultants assistant.
User: ${message}
Assistant:`,
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  return data.output.choices[0].text
}
```

### Advantages
- ✅ Fast responses
- ✅ Free tier available
- ✅ Good pricing
- ✅ Production-ready
- ✅ No rate limiting on paid tier

### Disadvantages
- ❌ Requires API key
- ❌ Paid after free tier

---

## Recommended Setup by Stage

### Development
```
Use Ollama locally
- No costs
- Instant setup
- Works offline
```

### Testing/Demo
```
Use HuggingFace Inference or Replicate free tier
- Cloud-hosted
- Easy to share
- Limited usage
```

### Production
```
Use Together AI or Replicate paid tier
- Reliable
- Scalable
- Reasonable pricing
```

---

## Implementation Checklist

- [ ] Choose LLM provider
- [ ] Set up account/installation
- [ ] Get API key (if needed)
- [ ] Add to `.env.local`
- [ ] Update chatbot API route
- [ ] Test conversation
- [ ] Deploy with environment variables

## Configuration Templates

### For Ollama (`.env.local`)
```env
# No configuration needed - runs locally
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### For HuggingFace (`.env.local`)
```env
LLM_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.1
```

### For Replicate (`.env.local`)
```env
LLM_PROVIDER=replicate
REPLICATE_API_KEY=r8_xxxxxxxxxxxxx
```

### For Together AI (`.env.local`)
```env
LLM_PROVIDER=together
TOGETHER_API_KEY=xxxxxxxxxxxxx
TOGETHER_MODEL=mistralai/Mistral-7B-Instruct-v0.1
```

## Next Steps

1. **Start with Ollama** for development
2. **Test responses** in chatbot
3. **Add conversation history** for context
4. **Switch to cloud provider** when ready for production
5. **Monitor costs** and adjust as needed

## Resources

- [Ollama](https://ollama.ai) - Local LLM
- [HuggingFace](https://huggingface.co) - Model hub
- [Replicate](https://replicate.com) - Model API
- [Together AI](https://together.ai) - LLM API
- [LLaMA 2 Paper](https://arxiv.org/abs/2307.09288) - Model details
- [Mistral Docs](https://docs.mistral.ai) - Mistral model info

## FAQ

**Q: Can I use multiple LLMs?**
A: Yes! Implement a provider abstraction to switch between providers.

**Q: Which is fastest?**
A: Ollama (local) or Together AI (cloud).

**Q: Which is cheapest for production?**
A: Together AI has best pricing for volume.

**Q: Can I use Claude instead?**
A: Claude API is paid only (no free tier), but offers best quality.

**Q: What about GPT-4?**
A: OpenAI GPT-4 is paid only.
