import type { NextApiRequest, NextApiResponse } from 'next';

type CoachRequest = {
  message: string;
  context?: any;
};

type CoachResponse = {
  reply: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoachResponse>
) {
  if (req.method === 'POST') {
    const { message, context } = req.body as CoachRequest;
    
    // Mocked AI coach response
    res.status(200).json({
      reply: "Here are 3 actions to improve your financial health: 1) Set up automatic savings transfers, 2) Review and categorize last month's expenses, 3) Consider increasing your emergency fund by 10%."
    });
  } else {
    res.status(405).json({
      reply: 'Method not allowed'
    });
  }
}
