import { NextApiResponse } from 'next';

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max unique tokens (IPs) to track
  tokensPerInterval: number; // Max requests per token per interval
}

interface TokenBucket {
  count: number;
  lastRefill: number;
}

class RateLimiter {
  private tokens: Map<string, TokenBucket> = new Map();
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
    
    // Clean up old tokens every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  async check(res: NextApiResponse, limit: number, token: string): Promise<void> {
    const now = Date.now();
    let bucket = this.tokens.get(token);

    if (!bucket) {
      bucket = {
        count: 0,
        lastRefill: now
      };
      this.tokens.set(token, bucket);
    }

    // Refill tokens based on time elapsed
    const timePassed = now - bucket.lastRefill;
    if (timePassed >= this.options.interval) {
      bucket.count = 0;
      bucket.lastRefill = now;
    }

    // Check if limit exceeded
    if (bucket.count >= this.options.tokensPerInterval) {
      const error = new Error('Rate limit exceeded');
      (error as any).status = 429;
      throw error;
    }

    // Increment counter
    bucket.count++;
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.options.interval * 2; // Keep data for 2 intervals

    for (const [token, bucket] of this.tokens.entries()) {
      if (bucket.lastRefill < cutoff) {
        this.tokens.delete(token);
      }
    }

    // Limit memory usage by keeping only the most recent tokens
    if (this.tokens.size > this.options.uniqueTokenPerInterval) {
      const entries = Array.from(this.tokens.entries());
      entries.sort((a, b) => b[1].lastRefill - a[1].lastRefill);
      
      this.tokens.clear();
      entries.slice(0, this.options.uniqueTokenPerInterval).forEach(([token, bucket]) => {
        this.tokens.set(token, bucket);
      });
    }
  }
}

export function rateLimit(options: RateLimitOptions): RateLimiter {
  return new RateLimiter(options);
}
