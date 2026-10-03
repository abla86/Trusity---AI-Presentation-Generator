# Trusity AI Presentation Generator

AI-assisted presentation authoring application for generating, editing, presenting and exporting structured slide decks.

## What it demonstrates

- React + TypeScript + Vite
- Express/TypeScript backend
- Gemini API integration
- Structured presentation planning
- Slide regeneration and polishing
- Story-arc inspection
- Presentation mode
- Snapshot/history workflows
- Collaboration UI
- PPTX, JSON, Markdown and image export
- PDF/print workflow
- Client-side visual effects and layout optimization

## Architecture

```text
React / Vite
  |
  +-- Presentation editor
  +-- Story / layout tools
  +-- Export tools
  +-- Presentation mode
  |
  v
Express API
  |
  v
Gemini API
```

## Local development

Requirements:

- Node.js 20+
- npm
- Gemini API key for AI generation

Install:

```bash
npm install
```

Configure the server environment using `.env`:

```env
GEMINI_API_KEY=your_key_here
```

Start:

```bash
npm run dev
```

Build:

```bash
npm run lint
npm run build
```

## Security and privacy

The Gemini API key belongs on the server and must never be embedded in client-side source or committed to Git. Do not use the public repository or an unapproved deployment for confidential presentations, personal data or proprietary material.

Generated presentations are AI-assisted output. Users remain responsible for reviewing factual claims, citations, images, licensing and final presentation content.

## Publication boundary

The repository demonstrates application engineering and export workflows. It does not claim that every generated deck is factually correct, legally cleared for publication, or suitable for a specific professional domain without human review.

External services are optional deployment dependencies; the repository itself does not prove that a production Gemini account or hosted environment exists.

## License

Apache License 2.0. See [LICENSE](LICENSE).
