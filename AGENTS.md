# AGENTS.md

## Project Overview
- Stack: Node.js + Express, static frontend in `public/`.
- Entry point: `server.js`.
- Main page: `public/index.html`.
- Start command: `npm start` (serves on `http://localhost:3000` by default).

## Repository Structure
- `server.js`: Express static server and root route.
- `public/index.html`: Download page UI (HTML/CSS/JS in one file).
- `package.json`: Scripts and dependencies.

## Working Rules
- Keep the current architecture: static files served by Express.
- Prefer minimal, targeted edits over broad refactors.
- Preserve existing visual style unless asked to redesign.
- Do not add new dependencies unless necessary and explicitly justified.
- Use ASCII by default in code/content.

## Design System
- `design-system/` is a git submodule (`https://github.com/1132-fixer/design-system.git`) and the source of truth for all design decisions.
- For any design matter — colors, typography, spacing, components, icons, visual patterns — consult `design-system/` first and follow its tokens/components.
- Do not invent new visual patterns, colors, or component styles that diverge from `design-system/`.
- If `design-system/` lacks guidance for a needed case, ask the user before improvising rather than guessing.
- Run `git submodule update --init --recursive` if `design-system/` appears empty.

## Validation
- For server or routing changes, run:
  - `npm start`
- For UI changes, verify in browser:
  - Page loads at `/`
  - Core interactions still work (tab switching and download actions)
  - Layout remains usable on desktop and mobile widths

## Notes
- If a requested file is missing (for example `public/1132-fixer.html`), confirm actual files on disk before editing.
