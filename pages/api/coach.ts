import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../lib/rateLimit';

// Rate limiter: 10 requests per 5 minutes
const limiter = rateLimit({
  interval: 5 * 60 * 1000, // 5 minutes in milliseconds
  uniqueTokenPerInterval: 500, // Max 500 unique IPs in interval
  tokensPerInterval: 10, // 10 requests per IP per interval
});

type CoachRequest = {
  message: string;
  context?: any;
  biblicalMode?: boolean;
  provider?: 'openai' | 'perplexity' | 'auto';
  stream?: boolean;
};

type CoachResponse = {
  reply: string;
  error?: string;
  provider?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoachResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: '', error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    await limiter.check(res, 10, getClientIP(req));

    const { message, context, biblicalMode, provider = 'auto', stream = false } = req.body as CoachRequest;

    if (!message?.trim()) {
      return res.status(400).json({ 
        reply: '', 
        error: 'Message is required' 
      });
    }

    // Determine which provider to use
    let selectedProvider = provider;
    if (provider === 'auto') {
      // Auto mode: prefer Perplexity if available, fallback to OpenAI
      selectedProvider = process.env.PERPLEXITY_API_KEY ? 'perplexity' : 'openai';
    }

    // Construct system prompt with optional biblical context
    let systemPrompt = `You are an expert personal financial advisor. Provide practical, actionable financial advice that is:
- Specific and actionable
- Based on sound financial principles
- Tailored to the user's situation
- Encouraging and supportive
- Brief but comprehensive (max 150 words)

Always structure your response as clear action items when possible.`;

    if (biblicalMode) {
      systemPrompt += `\n\nIMPORTANT: Frame your advice through a biblical perspective, incorporating relevant scripture and Christian financial principles like stewardship, generosity, contentment, and wise planning. Reference biblical wisdom where appropriate.`;
    }

    // Try the selected provider
    try {
      if (selectedProvider === 'perplexity') {
        const reply = await callPerplexityAPI(systemPrompt, message, stream, res);
        if (!stream) {
          return res.status(200).json({ reply, provider: 'perplexity' });
        }
        // For streaming, response is already sent
        return;
      } else {
        const reply = await callOpenAIAPI(systemPrompt, message, stream, res);
        if (!stream) {
          return res.status(200).json({ reply, provider: 'openai' });
        }
        // For streaming, response is already sent
        return;
      }
    } catch (providerError: any) {
      console.error(`${selectedProvider} provider error:`, providerError);
      
      // If primary provider fails and we have a fallback, try it
      if (selectedProvider === 'perplexity' && process.env.OPENAI_API_KEY) {
        console.log('Falling back to OpenAI...');
        try {
          const reply = await callOpenAIAPI(systemPrompt, message, stream, res);
          if (!stream) {
            return res.status(200).json({ reply, provider: 'openai' });
          }
          return;
        } catch (fallbackError: any) {
          console.error('OpenAI fallback error:', fallbackError);
          throw new Error('Both providers failed');
        }
      }
      
      // No fallback available, throw original error
      throw providerError;
    }
  } catch (error: any) {
    console.error('Coach API error:', error);
    
    // Handle rate limit errors specifically
    if (error.status === 429) {
      return res.status(429).json({ 
        reply: '', 
        error: 'Too many requests. Please wait a few minutes before trying again.' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      reply: '', 
      error: 'Sorry, I\'m temporarily unavailable. Please try again in a moment.' 
    });
  }
}

// Call Perplexity API
async function callPerplexityAPI(
  systemPrompt: string, 
  message: string, 
  stream: boolean,
  res: NextApiResponse
): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('Perplexity API key not configured');
  }

  const model = process.env.PERPLEXITY_MODEL || 'llama-3.1-sonar-large-128k-online';

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.7,
      stream,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Perplexity API error:', error);
    throw new Error('Failed to get Perplexity response');
  }

  if (stream) {
    // Handle streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      res.end();
    }
    
    return ''; // Streaming handled
  } else {
    // Handle non-streaming response
    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      throw new Error('No response from Perplexity AI');
    }

    return aiReply.trim();
  }
}

// Call OpenAI API
async function callOpenAIAPI(
  systemPrompt: string, 
  message: string,
  stream: boolean,
  res: NextApiResponse
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.7,
      presence_penalty: 0.1,
      stream,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get OpenAI response');
  }

  if (stream) {
    // Handle streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      res.end();
    }
    
    return ''; // Streaming handled
  } else {
    // Handle non-streaming response
    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      throw new Error('No response from OpenAI');
    }

    return aiReply.trim();
  }
}

// Helper function to get client IP
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  return ip;
}
