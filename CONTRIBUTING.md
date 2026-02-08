# Contributing to Carlos Pomares Portfolio

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Git

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pomaretta.com.git
   cd pomaretta.com
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/pomaretta/pomaretta.com.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Notion credentials
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔀 Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint        # Check for linting errors
   npm run type-check  # Check for TypeScript errors
   npm run build       # Ensure the build succeeds
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in navigation"
   ```

   **Commit Message Convention:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Provide a clear title and description
   - Reference any related issues

## ✅ Pull Request Guidelines

### Before Submitting

- [ ] Code follows the existing style and conventions
- [ ] All tests pass (`npm run lint`, `npm run type-check`, `npm run build`)
- [ ] Commits follow the commit message convention
- [ ] Documentation is updated if necessary
- [ ] No unnecessary dependencies added

### PR Description Should Include

- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: Technical details if complex
- **Testing**: How you tested the changes
- **Screenshots**: If UI changes (before/after)

## 🎨 Code Style

### TypeScript

- Use strict TypeScript (no `any` unless absolutely necessary)
- Define proper types and interfaces
- Use type imports: `import type { MyType } from './types'`

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use proper prop types
- Add JSDoc comments for complex components

### File Naming

- Components: PascalCase (`Button.tsx`, `Navigation.tsx`)
- Utilities: camelCase (`utils.ts`, `formatDate.ts`)
- Types: PascalCase (`index.ts` in types folder)
- Data files: camelCase (`projects.ts`, `skills.ts`)

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme (use CSS variables)
- Ensure dark mode compatibility
- Keep responsive design in mind (mobile-first)

## 🧪 Testing

Before submitting your PR, ensure:

```bash
# Linting passes
npm run lint

# Type checking passes
npm run type-check

# Build succeeds
npm run build

# Dev server runs without errors
npm run dev
```

## 📝 Documentation

- Update `README.md` if you add new features
- Update AI documentation for architectural changes:
  - **`.copilot-instructions.md`**: Code patterns and conventions for GitHub Copilot
  - **`AGENTS.md`**: Complete project context for AI assistants
- Add JSDoc comments for public APIs
- Include inline comments for complex logic

## 🤖 AI-Assisted Development

This project includes comprehensive documentation for AI assistants:

### For Developers Using AI Tools

- **GitHub Copilot**: The [.copilot-instructions.md](.copilot-instructions.md) file provides code patterns, conventions, and best practices for optimal Copilot suggestions
- **Any AI Assistant**: The [AGENTS.md](AGENTS.md) file contains complete project context and development guidelines
- **Migration Information**: See [AI_MIGRATION.md](AI_MIGRATION.md) for details on the documentation migration

### When Contributing AI-Related Changes

- Update both files if changes affect code patterns AND project understanding
- Test AI suggestions with your changes to ensure they remain helpful
- Keep code examples current and reflect actual project patterns
- Maintain consistency between the documentation files

## 🐛 Reporting Issues

### Bug Reports Should Include

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, browser, Node version)
- Screenshots if applicable
- Error messages or logs

### Feature Requests Should Include

- Clear description of the feature
- Use cases and benefits
- Proposed implementation (optional)
- Any relevant examples or references

## 📧 Questions?

If you have questions or need help:

- Open a [GitHub Discussion](https://github.com/pomaretta/pomaretta.com/discussions)
- Check existing [Issues](https://github.com/pomaretta/pomaretta.com/issues)
- Review the [README.md](README.md), [AGENTS.md](AGENTS.md), and [.copilot-instructions.md](.copilot-instructions.md)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers this project.

---

Thank you for contributing! 🎉
