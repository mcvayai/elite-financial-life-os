![CI](https://github.com/mcvayai/elite-financial-life-os/actions/workflows/ci.yml/badge.svg)

# Elite Financial Life OS
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
