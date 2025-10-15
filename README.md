# Elite Financial Life OS

> An AI-powered financial life management system with personality-based coaching

## Overview

Elite Financial Life OS is an intelligent financial management platform that combines AI coaching with personalized guidance. The system uses OpenAI's GPT models to provide contextual financial advice based on user personality types and goals.

## Features

- 🤖 **AI Financial Coach**: Get personalized financial advice powered by OpenAI
- 🎯 **Goal Tracking**: Set and monitor financial goals
- 📊 **Dashboard**: Track your financial journey
- ⚙️ **Customizable Settings**: Biblical mode and other preferences
- 🔒 **Secure**: Built with security best practices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini
- **State Management**: TanStack React Query
- **Animations**: Framer Motion

---

## Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn or pnpm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mcvayai/elite-financial-life-os.git
   cd elite-financial-life-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure required environment variables**

   Open `.env.local` and configure the following **required** variables:

---

### Environment Variables

#### 🔹 Required Variables

These variables are **required** for the application to function:

| Variable | Description | How to Get |
|----------|-------------|------------|
| `NEXTAUTH_URL` | The canonical URL of your site | `http://localhost:3000` for local dev, your production domain for deployment |
| `NEXTAUTH_SECRET` | Secret key for session encryption | Generate with: `openssl rand -base64 32` |
| `OPENAI_API_KEY` | OpenAI API key for AI coach | Get from [OpenAI Platform](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (client-side accessible) | Same as NEXTAUTH_URL |

#### 🔹 Optional Variables

These variables are optional but recommended for production:

**Authentication Providers** (Optional - for social login)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials

**AI Configuration** (Optional - for customization)
- `OPENAI_MODEL`: Specify which OpenAI model to use (default: `gpt-4o-mini`)
- `OPENAI_MAX_TOKENS`: Maximum tokens per response (default: `1000`)

**Database** (Optional - for production scaling)
- `DATABASE_URL`: PostgreSQL connection string (currently using localStorage)
- `SUPABASE_URL` / `SUPABASE_ANON_KEY`: For Supabase integration

**Storage** (Optional - for file uploads)
- `AWS_S3_BUCKET` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: For AWS S3 storage
- `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID`: For UploadThing service

**Financial Integrations** (Optional - for bank connections)
- `PLAID_CLIENT_ID` / `PLAID_SECRET` / `PLAID_ENV`: For Plaid bank connections
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: For payment processing

**Analytics & Monitoring** (Optional - for production)
- `NEXT_PUBLIC_GA_ID`: Google Analytics tracking ID
- `SENTRY_DSN`: Sentry error tracking
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog product analytics

**Email** (Optional - for notifications)
- `SENDGRID_API_KEY` / `SENDGRID_FROM_EMAIL`: SendGrid email service
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL`: Resend email service

**Rate Limiting** (Optional - for production)
- `REDIS_URL` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`: For distributed rate limiting

---

## Development

### Running Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

Create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Run Production Build Locally

Test the production build:

```bash
npm run start
# or
yarn start
# or
pnpm start
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add all required variables from `.env.local`
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel domain

4. **Deploy**
   - Vercel will automatically build and deploy
   - Every push to `main` triggers a new deployment

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Netlify Next.js plugin
- **Railway**: Connect your GitHub repo and deploy
- **Render**: Use the Web Service option
- **DigitalOcean App Platform**: Select Next.js as framework

For all platforms:
1. Ensure all required environment variables are set
2. Build command: `npm run build`
3. Start command: `npm run start`
4. Node version: 18.x or higher

---

## Project Structure

```
elite-financial-life-os/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── onboarding/        # User onboarding flow
│   ├── settings/          # User settings
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   └── rateLimit.ts       # Rate limiting utility
├── pages/                 # API routes (Pages Router)
│   └── api/
│       └── coach.ts       # AI coach endpoint
├── .env.example           # Environment variables template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

---

## Usage

### First Time Setup

1. **Visit the app** at `http://localhost:3000`
2. **Complete onboarding**: Enter your name and financial goal
3. **Access dashboard**: Start chatting with your AI financial coach

### Using the AI Coach

- Ask questions about financial planning, budgeting, or investing
- The coach adapts responses based on your personality and goals
- Enable "Biblical mode" in settings for faith-based guidance

---

## Troubleshooting

### OpenAI API Errors

**Issue**: "OpenAI API key is not configured"
- **Solution**: Ensure `OPENAI_API_KEY` is set in `.env.local`
- Restart the dev server after adding the key

**Issue**: Rate limit errors
- **Solution**: Check your OpenAI API quota and billing
- Consider upgrading your OpenAI plan

### Build Errors

**Issue**: Module not found
- **Solution**: Delete `node_modules` and `.next`, then reinstall:
  ```bash
  rm -rf node_modules .next
  npm install
  ```

**Issue**: TypeScript errors
- **Solution**: Check `tsconfig.json` and update dependencies:
  ```bash
  npm install --legacy-peer-deps
  ```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [Next.js documentation](https://nextjs.org/docs)
- Review the [OpenAI API documentation](https://platform.openai.com/docs)

---

## Roadmap

- [ ] Add database integration (PostgreSQL/Supabase)
- [ ] Implement Plaid for bank account connections
- [ ] Add user authentication with multiple providers
- [ ] Create expense tracking features
- [ ] Build investment portfolio management
- [ ] Add budget planning tools
- [ ] Implement goal progress tracking
- [ ] Create mobile app version

---

Built with ❤️ using Next.js and OpenAI
