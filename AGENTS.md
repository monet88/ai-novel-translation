# Repository Guidelines

## Project Structure & Module Organization
- `App.tsx` orchestrates the UI with providers from `contexts/AppContext`.
- UI widgets live in `components/`, with modals and views grouped by feature; shared icons stay in `components/icons`.
- Domain logic and network adapters are under `services/`, including `services/api/*` for provider clients and orchestrators in `services/batchOrchestrator.ts`.
- Hooks in `hooks/` encapsulate screen behavior (`useProjects`, `useSettings`) and should own side effects.
- Shared constants and types live in `constants.ts` and `types.ts`; reuse them instead of duplicating literals.

## Build, Test, and Development Commands
- `npm install` installs Vite + React dependencies.
- `npm run dev` starts the Vite dev server with hot reload at `http://localhost:5173`.
- `npm run build` outputs a static bundle in `dist/`.
- `npm run preview` serves the production bundle locally; use it before shipping.
- After configuring Jest (see Testing Guidelines), add `"test": "jest"` to `package.json` and run `npm test`.

## Coding Style & Naming Conventions
- TypeScript/React throughout; prefer function components with hooks.
- Indent with two spaces, use single quotes, and keep imports sorted by scope (external -> internal alias `@/` -> relative).
- Name components and context providers in `PascalCase`; hook files and exports start with `use`.
- Describe complex structures with exported `type` definitions and extend `types.ts` when adding shared shapes.

## Testing Guidelines
- Jest-style tests live beside the module (e.g., `services/geminiService.test.ts`).
- Mock `fetch` and API responses to avoid real network calls.
- Cover service orchestrators and any hook with branching logic; ensure new features include at least one regression-focused test.
- Run `npm test` (after configuration) or `npx jest path/to/file.test.ts` for targeted suites.

## Commit & Pull Request Guidelines
- Use concise, present-tense subjects: `feat: add glossary usage report export`.
- Reference issue IDs when available and list the user-visible impact in the PR description.
- Include reproduction or verification steps, plus screenshots for UI tweaks.
- Confirm `npm run build` passes and note any skipped tests or follow-ups.
- Never commit `.env.local` or API keys; rotate keys if exposed.
