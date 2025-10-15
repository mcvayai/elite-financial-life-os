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
};

type CoachResponse = {
  reply: string;
  error?: string;
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

    const { message, context, biblicalMode } = req.body as CoachRequest;

    if (!message?.trim()) {
      return res.status(400).json({ 
        reply: '', 
        error: 'Message is required' 
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
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

    // Call OpenAI Chat Completions API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      throw new Error('No response from AI');
    }

    res.status(200).json({ reply: aiReply.trim() });

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

// Helper function to get client IP
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  return ip;
}
