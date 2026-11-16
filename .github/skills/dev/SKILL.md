---
name: dev
description: 'Develop features for Next.js monorepos with Next.js frontends as Experience API (apps/web, apps/docs), a separate Process API backend (apps/api) and Storybook (apps/storybook), following CONSTITUTION.md. Use when: new feature, change or fix, new domain, usecase, port/adapter, factory, screen/page, React component, design system, theme, design assets, story, API route, process API endpoint, OpenAPI, shift keys/config, CMS content, documentation update, DDD layers, asynchronous service, queue listener, file storage/upload, notifications/email, Firebase deploy. Enforces DDD structure, factories with ConfigManager, implementation switching via config, Tailwind-only styling with a separate theme and design system generated from user-provided design assets, Storybook stories, 90% test coverage and docs update.'
metadata:
  argument-hint: 'Describe the feature and, for UI work, the design assets folder'
---

# Dev Skill — Features (Next.js Monorepo: Experience + Process API)

Mandatory workflow for any feature, change or fix in the monorepo. The source of rules is the [constitution](../../../CONSTITUTION.md) — **read it in full before starting**, every time (it may have changed).

All output (code, comments, file names, variables, documentation, Markdown) must be in **English**, per the constitution.

## Agent compatibility

This skill is shared by GitHub Copilot and Codex. The canonical source is `.github/skills/dev/`; `.agents/skills/dev` is a relative symlink to that directory for Codex discovery. Keep instructions, references and assets in the canonical directory; do not maintain separate copies. Preserve the symlink when using this repository as an application template.

Resolve relative links from this skill directory. Both discovery paths have the same depth, so `../../../CONSTITUTION.md` resolves to the repository constitution in either agent. Use the current agent's available tools for the procedure; MCP integrations are optional and CLI/REST alternatives are described in the Firebase reference.

## Principles

- If the request conflicts with the constitution, **stop and ask the user** before implementing: describe the conflict (rule and section) and offer the options — follow the constitution, grant a one-off exception for this request, or update the constitution. The decision is always the user's. If they choose to update it, edit `CONSTITUTION.md` before implementing.
- Items marked `[TBD]`/`[TO CONFIRM]` in the constitution must not be invented: ask, or leave an explicit placeholder.
- Every request changes the affected apps — `apps/web` (experience), `apps/api` (process rules) —, always `apps/docs` (documentation) and, if there is a new/changed React component, `apps/storybook` (stories).
- The project is always controlled by Git (constitution § 2.1): add/update the necessary `.gitignore` entries for any new tooling, app or generated artifact.
- **Be autonomous (constitution intro):** never ask whether to write tests, run validations, update docs/changelog or apply something the constitution already requires. Ask only when a rule demands a question or information cannot be discovered.
- **Tests are mandatory for anything new or changed** and **every test layer is always run** (lint, typecheck, unit, component, API, contract, E2E with Playwright, Storybook stories with a11y, coverage, build). Fix failures; report only real blockers.
- **Documentation is mandatory** in `apps/docs` for every change, including the generated **changelog** page (`pnpm changelog`: full commit history with maximum detail).
- Packages come from the public npm registry unless the user says otherwise (constitution § 3.1). Never write tokens to files.
- **Firebase + GitHub Actions are fixed defaults** (constitution § 14). Read [Firebase setup and templates](references/firebase.md) for first-use onboarding, infrastructure work or CI/CD. Keep every SDK/trigger in infra, use ports/factories/shift keys and deploy each app independently. Never deploy with unresolved required settings.
- Decide where each rule lives: adaptation for the screen → Experience API (Next.js); process/business rule and access to systems of record → Process API.
- **Styling is Tailwind only** (constitution § 10). The visual identity comes from **design assets supplied by the user**, never invented (see "Design assets, theme and design system" below).
- **Data safety is mandatory (constitution § 4.5):** database connections are acquired and released within each request/transaction; never keep connections or transactions globally or across requests. Every mutation checks the current persisted state, validates the allowed domain transition atomically, uses optimistic versioning or a database lock, returns `409 Conflict` on concurrent state changes, and is idempotent through an idempotency key/correlation id. Retries and listeners must not duplicate side effects.
- **Authentication/database:** Firebase Authentication and Firestore; do not ask which provider. Collect unknown sign-in methods and domain-role mapping with a skip option.
- **Async:** Process API → `queue` port → Firebase task queue Functions (Cloud Tasks); implement a separate listener app, bounded retries, deduplication and a failed-job store/replay (Cloud Tasks has no native DLQ). Use Pub/Sub for fan-out where appropriate.
- **Schedules:** Firebase scheduled Functions backed by Cloud Scheduler; SDK registration stays in infra. Confirm the schedule/timezone when unknown; handle overlapping invocations and retries.
- **Notifications:** publish through the queue, then deliver from the listener through `notifications`; ask the channel with `To be defined (work with mock)`. FCM is the push adapter; email/SMS remain channel-specific decisions.
- **Storage:** Firebase Storage behind `storage`; ask only for an unknown transfer path (backend or backend-issued signed URL), offering skip with a local fake until decided.

## First invocation in a repository

Before feature implementation, read [references/firebase.md](references/firebase.md) and check `deploy/project.setup.json`. Ask for the **Firebase project ID** and request **Firebase/Google Cloud access through interactive authentication** only if current access is missing. Offer **Skip for now**. The user creates the project and enables billing; the skill handles supported remaining setup, including enabling required Google APIs and provisioning resources through CLI/REST. Discover or generate Web App config, project number, buckets, backend IDs and WIF/service identities rather than asking the user to gather them.

Once setup is authorized, complete the provisioning procedure in the reference, verify actual state, and persist non-secret results and pending work using [the setup template](assets/firebase/project.setup.json). Ask only for choices that cannot be inferred and access/consent that automation cannot supply. Never ask for credentials in chat. A saved skip prevents repeated onboarding; continue independent local work and resume specific missing fields only when needed. Report **working capabilities, blockers and exact remaining user actions** on every handover, with a persistent checklist in `deploy/SETUP.md` and the docs app when present. Do not claim readiness while required APIs, integrations, credentials, deployment or smoke checks are pending.

## Design assets, theme and design system

Applies to any request that creates or changes UI (and to the first request of a new project).

1. **Ask for the design assets as a prompt.** Before building UI, ask the user for the **path of the folder with the design assets**: icons, logos, fonts, screen mockups/screenshots, brand guidelines, color palette, etc. Do this whenever the folder is unknown. If none is provided, ask again or get explicit confirmation to proceed with neutral placeholder styling marked `[TBD]`. Never fabricate a brand identity.
2. **Import the assets** into `design-assets/` at the repo root (copy or reference; do not modify originals). Inspect screens/mockups (images can be viewed) and the palette/typography to extract tokens.
3. **Create the theme and the design system as two separate packages:**
   - `packages/config-tailwind` — **theme only**: tokens for colors, typography/fonts, spacing, radii, shadows, breakpoints (and dark mode if the assets define it), exposed as a Tailwind preset/CSS theme. No components.
   - `packages/design-system` — **components only**: accessible React components (Button, Input, Card, Modal, etc.) and the icon set (SVGs converted to typed React components), using only Tailwind classes backed by the theme tokens. No business logic, no data access.
4. Apps (`web`, `docs`) and Storybook consume the theme preset and the design system. Feature-specific components in the apps use the same tokens. Hardcoded colors, fonts and spacing outside the theme are forbidden.
5. Every design-system component gets a story (variants, a11y) and tests. Check WCAG 2.1 AA contrast of the provided palette; if it fails, report it and propose compliant adjustments.
6. When the user later supplies new or updated assets, update the **theme** for identity changes and the **design system** for component changes — keep them separate.

## Procedure

### 1. Understand the request
1. Read [CONSTITUTION.md](../../../CONSTITUTION.md).
2. If the request mentions issues, epics, pages or repositories, query the configured MCPs ("MCPs" section).
3. Explore the existing code to reuse domains, ports, adapters and factories.
4. If the request involves UI and the design assets folder is unknown, ask for it (mandatory).
5. If there is relevant ambiguity (domain, business rule, provider) or a conflict with the constitution, ask before proceeding.
6. Apply Firebase defaults for auth, persistence, storage, queues, Functions and schedules (§ 14); reuse saved setup answers.
7. For notifications ask only an unknown channel, offering mock. For storage ask only an unknown transfer path, offering skip.
8. Ask for specific missing app settings only when they block the current operation; otherwise retain explicit placeholders and continue.

### 2. Model and present the plan
Before coding, present the user a short plan containing:
- **Domain(s)** affected (new or existing).
- **Aggregates / Value Objects**.
- **Usecases**: contracts in `domain/usecases/<domain>/` and implementations in `application/<domain>/`.
- **Ports** in `domain/ports/<type>/` and **adapters** in `infra/adapters/<type>/<impl>/`.
- **Async (if requested)**: Process API usecase, `queue` port + adapter for the chosen provider, message contract (Zod, versioned), listener app in `apps/listeners/<name>/`, its hosting runtime, provider-appropriate dead-letter/recovery and idempotency strategy.
- **Notifications (if requested)**: Process API service → queue → listener app, `notifications` port + adapter for the chosen channel (or `mock`), message contract.
- **Storage (if requested)**: `storage` port + adapter for the chosen provider, shift key, and the chosen upload path.
- **Factory** `infra/factories/<domain>/<domain>.factory.ts`.
- New **shift keys** (`infra.<port>.provider` and `domains.<domain>.usecases.<usecase>`) with defaults.
- **UI**: routes/pages, composition root, components (Tailwind + theme + design system); theme/design-system changes derived from the design assets.
- **Stories**: new/changed components and their variants in `apps/storybook`.
- **API**: route handlers / server actions (Experience) and Process API routes (`http/`, OpenAPI), with Zod schemas.
- **Data safety (if persistence/mutation is involved)**: request-scoped connection lifecycle, transaction boundary, current-state validation, allowed transition, version/lock strategy, idempotency key and conflict response.
- **Docs**: content pages to create/update in `apps/docs`.
- **Tests** per layer.

### 3. Implement (in this order)
If the feature touches the Process API, implement it first in `apps/api` (steps 1–5 + `http/` + OpenAPI) and then the `process-api` adapter in Next.js.

1. `domain`: value objects → aggregates → ports → usecase contracts. No external dependencies.
2. `application`: one file per usecase, dependencies received via constructor.
3. `infra/adapters`: port implementations; external errors converted into domain errors. External SDKs and tools only inside the corresponding adapter. In Next.js, data access via the `repositories` port with the `process-api` adapter (default) and, where applicable, a direct adapter.
3.5. For Firestore, reuse the infra SDK client but keep each transaction scoped to the operation; never perform external side effects inside retryable callbacks. For connection-based adapters, acquire and release the connection within the request/transaction. For every mutation, load the current record, validate the domain transition, and atomically mutate only if the expected version/current state still matches; implement idempotency and map conflicts to `409`.
4. `infra/factories`: extends `AbstractFactory`, receives `ConfigManager`, registry per shift key, fail fast on unknown key.
5. Config: add keys to `config/default.json` + Zod schema. Secrets only as an env reference (`tokenEnv`).
5.5. Read [references/firebase.md](references/firebase.md), copy/adapt the needed inactive templates and update `deploy/project.setup.json`. `deploy/`: add or update the affected app's Firebase configuration (hosting target, function/service definition, rules, emulator config) using only values provided by the user; leave `[TBD]` otherwise.
6. `lib/server`: `server-only` helper that instantiates the factory and calls `make()`.
7. `app` / `components`: Server Component as composition root; client components only when necessary; pure presentational components built on `packages/design-system` and the Tailwind theme.
8. `packages/config-tailwind` / `packages/design-system`: create or update from the design assets (see section above).
9. `apps/storybook`: one story per new/changed component in `stories/<source>/<component-path>.stories.tsx`, with variants (default, loading, empty, error, disabled), typed `args` and `tags: ['autodocs']`; data via fixtures, never via factories.
10. `apps/docs`: content via CMS (JSON in `content/<locale>/`), including new shift keys and API routes.
11. Async (if requested): after the Process API usecase and `queue` port/adapter, implement the listener app in `apps/listeners/<name>/` (same DDD structure; thin entry point for the chosen runtime — `handler.ts` for functions, `main.ts` for a long-running container), with Zod-validated messages, idempotency, bounded retries and provider-appropriate failed-job recovery; document the flow in `apps/docs`.

### 4. Test
- Vitest (unit) for domain, application, adapters, factories and lib.
- Contract suite for each port with more than one adapter.
- React Testing Library for components (including the design system).
- Supertest for route handlers (Experience) and Process API routes.
- Contract test of the `process-api` adapter against the OpenAPI of `apps/api`.
- Playwright E2E for the new user flows.
- Stories run as tests (render + a11y via `@storybook/addon-vitest`), with no accessibility violations.
- Never skip a layer and never ask whether to run it: run everything and fix what fails.
- Run coverage: **≥ 90% overall and on new code, in all layers**. If not met, complete the tests before finishing. The overall figure is enforced by the Vitest thresholds; new code is validated by the quality gate of the CI — ensure the new files produce coverage in the app's `coverage/lcov.info`.

### 5. Validate
- Lint (including layer boundary rules), typecheck, tests and build of all affected apps (including `storybook build`).
- Regenerate the changelog page (`pnpm changelog`) and update the other docs pages.
- Check the constitution's Definition of Done item by item.

### 6. Run the apps and hand over the links
Always, without asking: start every app in development mode in background terminals (`pnpm --filter @apps/api dev`, `@apps/web dev`, `@apps/docs dev`, `@apps/storybook dev`), check that each one answers, and give the user the links (API `http://localhost:3001/health` and **Swagger UI `http://localhost:3001/docs`**, web `http://localhost:3000`, docs `http://localhost:3002` and `/changelog`, Storybook `http://localhost:6006`) plus what is not runnable locally (listeners) and the dev-mode limitations. Fix any app that fails to start.

### 7. Report
Short summary with: files per layer, shift keys added (with defaults), theme/design-system changes, stories created, coverage obtained, documentation updated and any `[TBD]` items found. Always state which app capabilities actually work, cloud setup/deploy/verification status, and remaining user actions with exact steps or links and how to verify completion. If nothing remains, say so only after the applicable checks pass. Update `deploy/SETUP.md` and the docs app checklist when present.

## MCPs

Use the MCP servers configured in `.vscode/mcp.json` (if any) whenever external context is needed (e.g. requirements in an issue tracker, pages in a wiki, code in a repository, builds in CI).

- Reading is free.
- Firebase/Google Cloud setup and its GitHub CI/CD configuration may proceed under the user's setup authorization (§ 14.4), without repeated per-step confirmations. Other external writes require authorization; login alone does not authorize unrelated writes or production deployment.
- If an MCP fails or is unavailable, report it and proceed with what is possible.

## Anti-patterns (reject)

- Importing `application` or `infra` directly from `app`/`components`.
- Reading `process.env` or a config file outside the `ConfigManager`/factory.
- `new SomeAdapter()` outside a factory.
- A single implementation without a shift key "because only one exists".
- Hardcoded colors/fonts/spacing outside the theme tokens; any styling technology other than Tailwind; third-party UI kits added without the user asking.
- Building UI without asking for the design assets folder, or inventing a brand identity.
- Mixing theme tokens and components in the same package (theme = `packages/config-tailwind`, components = `packages/design-system`).
- Route, route handler or server action without server-side authentication/authorization checks.
- A Next.js app without the sign-in screen and flow for the chosen auth provider (constitution § 13).
- Feature without an update in `apps/docs` or without tests.
- Process/business rule implemented in the Experience API (Next.js) instead of the Process API.
- Browser calling the Process API directly.
- Process API route without an OpenAPI update.
- Process API without Swagger UI at `/docs` (constitution § 9.1), or a Swagger/OpenAPI that is out of sync with the routes.
- New/changed React component without a story in `apps/storybook`.
- Non-English comments, identifiers, file names or documentation.
- Finishing an implementation without starting the apps and giving the user the links.
- Asking the user whether to write/run tests, update docs or do work the constitution already requires; skipping a test layer; a docs update without the regenerated changelog.
- Missing or incomplete `.gitignore`, or committing secrets/env files/service account keys/build output.
- A single repo-wide pipeline that deploys all apps, instead of separate per-app pipelines with change-based triggers.
- Inventing Firebase project IDs, regions, hosting targets or other deploy values that the user has not provided.
- Asynchronous service implemented in the Experience API, or without a listener, or with the listener inside the Process API/Next.js app instead of its own app.
- Calling a queue SDK outside the `queue` adapter.
- Asking for queue/runtime providers already fixed as Firebase, or importing Firebase SDKs/trigger registration outside infra.
- Sending notifications directly from the service instead of publishing to the queue, or asking about the listener channel without offering `To be defined (work with mock)`.
- Asking for the already fixed storage provider, or assuming an unknown upload path.
- Calling storage SDKs outside the `storage` adapter, or exposing storage credentials to the browser.
- Holding checked-out database connections, transactions or cursors across requests; Firestore SDK client reuse inside infra is allowed.
- Mutating a record without checking its current state and allowed domain transition atomically.
- Silently overwriting concurrent changes, omitting optimistic locking/row locking, or returning success for a failed conditional mutation.
- A command or listener without idempotency handling and duplicate-side-effect protection.
