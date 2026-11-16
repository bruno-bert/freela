# Production deployment

The primary application uses Firebase App Hosting backend `freela-web` in `us-central1`. The Process API is the independently deployed `opportunities-api` Functions codebase, exporting the second-generation HTTPS function `api`.

Production URL: https://freela-web--freela-c8c75.us-central1.hosted.app

## Delivery and identity

`.github/workflows/web.yml` and `api.yml` filter changes to their app, transitive shared packages and delivery configuration. Pull requests run quality gates without cloud credentials. Main deployments follow a successful full lint, typecheck, coverage, emulator, Playwright, Storybook/a11y and build job. Actions are pinned to immutable commits. The production Environment and OIDC federation restrict access to this repository's numeric owner/repository IDs, main branch, production environment and the two delivery workflows.

Deploy service accounts and runtime service accounts are separate. Authentication uses ADC at runtime and short-lived OIDC credentials in Actions. No service-account private key is created. Google Places credentials stay in Secret Manager, bound only to the Process API. Public Firebase/Maps browser configuration is bound to the web runtime; the Maps key restricts API usage and production/local referrers. Google sign-in authorizes the production hostname.

`node scripts/deploy.mjs web|api` deploys one explicit target, stamps the checkout SHA, waits for Firebase and checks an uncached health response against that SHA. App Hosting uploads the entire monorepo with the app root set to `apps/web`; ignores exclude credentials and generated artifacts. Explicit Next tracing includes runtime configuration, CMS JSON and the workspace marker. Business calls remain browser → Next Experience API → authenticated Process API → Places/Firestore.

Both runtimes allow scaling down to zero; maximum instances are two. A first request can therefore incur a cold start. Google Places remains a paid, explicit user-triggered search and returns at most 20 ranked results per Nearby request. Site creation only records an owner-scoped pending request; the AI execution backend remains deferred as requested.

## Access and verification

Anonymous workspace requests must redirect to `/login`; business API requests require a verified Firebase session. Firestore browser rules deny reads and writes. Public health endpoints contain only status and deployed commit. Use `/api/health` on the web hostname and `/health` under `https://us-central1-freela-c8c75.cloudfunctions.net/api` to verify a rollout. Swagger is available at the Process API `/docs` endpoint.

The documentation and Storybook applications remain local until their private publication access policy is decided; this does not block the primary application. `deploy/project.setup.json` and `deploy/SETUP.md` record actual cloud verification separately from source publication.

The initial public rollout passed web/API health probes and rendered Google sign-in without browser runtime errors. The Google OAuth popup reached accounts.google.com. Anonymous business requests returned 401 and Swagger returned 200. International shortcuts remain disabled in server-rendered HTML until React hydrates their event handlers, preventing early selection events from being lost on a cold load. The release health check polls for bounded CDN propagation before reporting failure.
