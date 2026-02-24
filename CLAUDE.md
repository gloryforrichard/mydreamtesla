# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with content collections
- `pnpm build` - Build the application and content collections
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter (use for code quality checks)
- `pnpm format` - Format code with Biome

### Database Operations (Drizzle ORM)
- `pnpm db:generate` - Generate new migration files based on schema changes
- `pnpm db:migrate` - Apply pending migrations to the database
- `pnpm db:push` - Sync schema changes directly to the database (development only)
- `pnpm db:studio` - Open Drizzle Studio for database inspection and management

### Content and Email
- `pnpm content` - Process MDX content collections
- `pnpm email` - Start email template development server on port 3333

## Project Architecture

This is a Next.js full-stack SaaS application with the following key architectural components:

### Core Stack
- **Framework**: Next.js with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with social providers (Google, GitHub)
- **Payments**: Stripe integration with subscription and one-time payments
- **UI**: Radix UI components with TailwindCSS
- **State Management**: Zustand for client-side state
- **Internationalization**: next-intl with English and Chinese locales
- **Content**: Fumadocs for documentation and MDX for content
- **Code Quality**: Biome for formatting and linting

### Key Directory Structure
- `src/app/` - Next.js app router with internationalized routing
- `src/components/` - Reusable React components organized by feature
- `src/lib/` - Utility functions and shared code
- `src/db/` - Database schema and migrations
- `src/actions/` - Server actions for API operations
- `src/stores/` - Zustand state management
- `src/hooks/` - Custom React hooks
- `src/config/` - Application configuration files
- `src/i18n/` - Internationalization setup
- `src/mail/` - Email templates and mail functionality
- `src/payment/` - Stripe payment integration
- `src/credits/` - Credit system implementation
- `content/` - MDX content files for docs and blog
- `messages/` - Translation files (en.json, zh.json) for internationalization

### Authentication & User Management
- Uses Better Auth with PostgreSQL adapter
- Supports email/password and social login (Google, GitHub)
- Includes user management, email verification, and password reset
- Admin plugin for user management and banning
- Automatic newsletter subscription on user creation

### Payment System
- Stripe integration for subscriptions and one-time payments
- Three pricing tiers: Free, Pro (monthly/yearly), and Lifetime
- Credit system with packages for pay-per-use features
- Customer portal for subscription management

### Feature Modules
- **Blog**: MDX-based blog with pagination and categories
- **Docs**: Fumadocs-powered documentation
- **AI Features**: Image generation with multiple providers (OpenAI, Replicate, etc.)
- **Newsletter**: Email subscription system
- **Analytics**: Multiple analytics providers support
- **Storage**: S3 integration for file uploads

### Development Workflow
1. Use TypeScript for all new code
2. Follow Biome formatting rules (single quotes, trailing commas)
3. Write server actions in `src/actions/`
4. Use Zustand for client-side state management
5. Implement database changes through Drizzle migrations
6. Use Radix UI components for consistent UI
7. Follow the established directory structure
8. Use proper error handling with error.tsx and not-found.tsx
9. Leverage Next.js features like Server Actions
10. Use `next-safe-action` for secure form submissions

### Configuration
- Main config in `src/config/website.tsx`
- Environment variables template in `env.example`
- Database config in `drizzle.config.ts`
- Biome config in `biome.json` with specific ignore patterns
- TypeScript config with path aliases (@/* for src/*)

### Testing and Quality
- Use Biome for linting and formatting
- TypeScript for type safety
- Environment variables for configuration
- Proper error boundaries and not-found pages
- Zod for runtime validation

## Git Workflow

每次修改完成后，同步更新到 GitHub 做版本备份：

```bash
git add -A && git commit -m "<type>: <description>" && git push
```

- 每完成一个功能模块或修复后立即 commit + push
- 使用 conventional commits: feat, fix, refactor, docs, chore
- 不要攒一大堆改动再提交，小步快跑

## 开发问题记录与解决方案

### 1. PostgreSQL 端口冲突
- **问题**: 本机 5432 端口已被占用
- **方案**: Docker Compose 映射 `5433:5432`，DATABASE_URL 使用 `localhost:5433`

### 2. MkSaaS 模板大量类型错误
- **问题**: 模板删除了很多文件（sanity schemas, actions, components）但引用仍存在，导致 ~50 个 TS 错误
- **方案**:
  - 重建 `src/types/index.ts`（从 config 文件反推所需类型）
  - 不影响核心功能的模板文件加 `// @ts-nocheck`（custom-mde, custom-mdx, image-upload, sort-filter 等）
  - 内联修复：`confetti-effect.tsx` 加类型标注，`combobox.tsx` FilterItem.value 改为 `string`
  - `faq.ts` 内联定义 FAQItem/FAQConfig 类型（原从已删除的 `@/types` 导入）

### 3. Stripe API 版本不匹配
- **问题**: `apiVersion: "2024-04-10"` 与安装的 Stripe SDK 不兼容
- **方案**: 改为 `"2025-01-27.acacia"` 并加 `?? ''` 处理环境变量可能为 undefined

### 4. Tailwind darkMode 类型错误
- **问题**: `darkMode: ["class"]` 类型不匹配
- **方案**: 改为 `["class", "html"]`

### 5. Figma 同步 — i18n 重定向丢失 hash fragment
- **问题**: Figma Code-to-Canvas 用 URL hash 传递 captureId，但 next-intl 的 307 重定向（`/models` → `/en/models`）会丢弃 hash fragment
- **方案**: 使用带 locale 前缀的完整 URL（`/en/models`）避免重定向

### 6. Figma MCP 配置
- **问题**: Figma Desktop MCP 只读，不支持 `generate_figma_design`
- **方案**: 通过 Claude Code `/mcp` 命令认证远程 Figma MCP Server，使用 Code-to-Canvas 功能同步设计
- **捕获脚本**: 仅在 `NODE_ENV === 'development'` 时加载（layout.tsx）

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how


## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections


## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Language**: Always respond in Chinese, except for necessary technical terms (code, commands, file paths, error messages, etc.).


## Important Notes

- The project uses pnpm as the package manager
- Database schema is in `src/db/schema.ts` with auth, payment, and credit tables
- Email templates are in `src/mail/templates/`
- The app supports both light and dark themes
- Content is managed through MDX files in the `content/` directory
- The project includes comprehensive internationalization support
- Docker Compose 在 `docker-compose.yml`，PostgreSQL 端口 5433
- Figma 设计文件: https://www.figma.com/design/g4IOIsh9WGdCEBskuclxtk
