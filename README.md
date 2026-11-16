# Freelancer Workspace

A pnpm/Turborepo workspace with a Next.js web app, authenticated documentation, Fastify Process API and Storybook. Opportunities follows the reference exports in `.stitch/designs/`; future modules remain disabled.

## Run locally

Use Node 22 and pnpm 10.12.1. Run `pnpm install`. Create `.env.local` from `.env.example` and supply a random `LOCAL_SESSION_SECRET` (at least 32 random bytes). A local secret is generated during initial setup and never committed. Run these in separate terminals:

```sh
pnpm --filter @apps/api dev
pnpm --filter @apps/web dev
pnpm --filter @apps/docs dev
pnpm --filter @apps/storybook dev
```

- Web: http://localhost:3000
- Process API: http://localhost:3011/health and http://localhost:3011/docs
- Documentation: http://localhost:3002 and http://localhost:3002/changelog
- Storybook: http://localhost:6006

Use “Enter demonstration” for local sign-in. Demo contacts are fictional, and contact history is held in API process memory. Restarting the API clears it. The map is an interactive schematic in local mode; it does not load real Google data. Sign-in creates a signed HttpOnly session, and the API verifies it separately. Production rejects local/demo adapters.

## Live integrations

See `deploy/SETUP.md`. Set Firebase configuration, Application Default Credentials and restricted Places/Maps keys through environment references. Production overrides select Firebase Authentication, Firestore, Google Places and Google Maps. Google sign-in is prepared; provider setup must be verified before switching adapters. No credentials are committed. Nothing has been deployed.

Nearby Search is non-exhaustive and limited to 20 ranked places per query. The app filters out records with a website URL listed. Unknown WhatsApp/Instagram remain unknown. Opening WhatsApp never changes contact status; “Record contact” is a separate versioned, idempotent command. The portfolio stays `[TBD]` until supplied by the user.

## Validate

```sh
pnpm changelog
pnpm lint
pnpm typecheck
pnpm coverage
pnpm test:e2e
pnpm test:stories
pnpm ci:emulators
pnpm ci:coverage-new
pnpm build
```

Content is in `apps/docs/content/en/` and `pt-BR/`, behind the CMS port. Tokens live in `packages/config-tailwind`; accessible components live in `packages/design-system`. See `CONSTITUTION.md` for architecture boundaries.

The emulator suite requires Java 21. `pnpm ci:emulators` uses the ignored local tool download when present, otherwise Java on PATH. Production build outputs and coverage reports are ignored by Git.
