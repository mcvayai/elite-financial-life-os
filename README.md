![CI](https://github.com/mcvayai/elite-financial-life-os/actions/workflows/ci.yml/badge.svg)

# Elite Financial Life OS

A comprehensive AI-powered financial management system built with Next.js 14, TypeScript, and multiple AI providers (OpenAI & Perplexity).

## ✨ Key Features

- **💬 AI Financial Coach**: Get personalized financial advice powered by OpenAI or Perplexity
- **🤖 Multiple AI Providers**: Choose between OpenAI, Perplexity, or Auto mode
- **📊 Smart Recommendations**: The coach adapts responses based on your personality and goals
- **✝️ Biblical Mode**: Enable "Biblical mode" in settings for faith-based financial guidance
- **🔄 Automatic Fallback**: If one provider fails, automatically fallback to another
- **⚡ Streaming Responses**: Real-time AI responses via Server-Sent Events
- **🛡️ Rate Limiting**: Built-in protection against API abuse

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (required) - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- Perplexity API key (optional) - Get from [Perplexity Settings](https://www.perplexity.ai/settings/api)

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
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure AI providers**
   
   Edit `.env.local` and add your API keys:
   ```env
   # Required: OpenAI API key
   OPENAI_API_KEY=sk-proj-your-openai-api-key-here
   
   # Optional: Perplexity API key (for alternative AI provider)
   PERPLEXITY_API_KEY=pplx-your-perplexity-api-key-here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Provider Configuration

### OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key
3. Add it to your `.env.local`:
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   OPENAI_MODEL=gpt-3.5-turbo  # Optional, defaults to gpt-3.5-turbo
   ```

### Perplexity Setup (Optional)

Perplexity provides access to real-time information and alternative AI models.

1. Go to [Perplexity Settings](https://www.perplexity.ai/settings/api)
2. Generate an API key
3. Add it to your `.env.local`:
   ```env
   PERPLEXITY_API_KEY=pplx-your-key-here
   PERPLEXITY_MODEL=llama-3.1-sonar-large-128k-online  # Optional
   ```

### Selecting Your AI Provider

1. Navigate to **Settings** in the app
2. Under **AI Coach Settings**, select your preferred provider:
   - **Auto (Recommended)**: Automatically uses Perplexity if available, otherwise OpenAI
   - **OpenAI**: Always use OpenAI's GPT models
   - **Perplexity**: Always use Perplexity's Sonar models

### Provider Comparison

| Feature | OpenAI | Perplexity |
|---------|--------|------------|
| Real-time information | ❌ | ✅ |
| Streaming support | ✅ | ✅ |
| Model options | GPT-3.5, GPT-4 | Sonar models |
| Automatic fallback | ✅ | ✅ |

## 🔧 Environment Variables

### Required
- `OPENAI_API_KEY` - Your OpenAI API key
- `NEXTAUTH_SECRET` - Secret for NextAuth.js session encryption
- `NEXTAUTH_URL` - Your app URL (e.g., http://localhost:3000)

### Optional
- `PERPLEXITY_API_KEY` - Your Perplexity API key (enables Perplexity provider)
- `PERPLEXITY_MODEL` - Perplexity model to use (default: llama-3.1-sonar-large-128k-online)
- `OPENAI_MODEL` - OpenAI model to use (default: gpt-3.5-turbo)
- `NODE_ENV` - Environment (development, production, test)

See `.env.example` for a complete list of configuration options.

---

## 📝 Usage

### Chat with AI Coach
1. Navigate to the dashboard
2. Type your financial question
3. Get personalized advice from your AI coach

### Enable Biblical Mode
1. Go to Settings
2. Toggle "Biblical Mode" on
3. Your coach will now provide faith-based financial guidance

### Switch AI Providers
1. Go to Settings
2. Select your preferred AI provider
3. The change takes effect immediately

---

## 🛠️ Troubleshooting

### AI Provider Errors

**Issue**: "OpenAI API key is not configured" or "Perplexity API key not configured"
- **Solution**: Ensure the respective API key is set in `.env.local`
- Restart the dev server after adding the key
- Verify the key format (OpenAI: starts with `sk-`, Perplexity: starts with `pplx-`)

**Issue**: Rate limit errors
- **Solution**: Check your API quota and billing on the provider's dashboard
  - [OpenAI Usage](https://platform.openai.com/usage)
  - [Perplexity Settings](https://www.perplexity.ai/settings)
- Consider upgrading your plan
- The app will automatically fallback to alternative provider if available

**Issue**: "Both providers failed" error
- **Solution**: Verify both API keys are valid
- Check your internet connection
- Ensure at least one provider has available credits

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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write TypeScript for type safety
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [Next.js documentation](https://nextjs.org/docs)
- Review the [OpenAI API documentation](https://platform.openai.com/docs)
- Review the [Perplexity API documentation](https://docs.perplexity.ai/)

---

## 🗺️ Roadmap

- [x] Multiple AI provider support (OpenAI, Perplexity)
- [x] Streaming responses via SSE
- [x] Provider selection in settings
- [x] Automatic fallback between providers
- [ ] Add database integration (PostgreSQL/Supabase)
- [ ] Implement Plaid for bank account connections
- [ ] Add user authentication with multiple providers
- [ ] Create expense tracking features
- [ ] Build investment portfolio management
- [ ] Add budget planning tools
- [ ] Implement goal progress tracking
- [ ] Create mobile app version

---

Built with ❤️ using Next.js, OpenAI, and Perplexity
