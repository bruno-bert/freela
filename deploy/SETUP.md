# Setup and operational readiness

Target project: **freela-c8c75**, project number **68606654717**, region **us-central1** (Iowa), under the user’s cost-first choice. Source repository: [bruno-bert/freela](https://github.com/bruno-bert/freela). Source publication and deployment are authorized without repeated approval prompts. No production application deployment or served-commit verification has occurred.

## Verified cloud resources — November 16, 2026

- [x] Authenticated Firebase CLI access to the exact active project.
- [x] Cloud Billing now reports `billingEnabled: true`. Earlier disabled-billing evidence is superseded.
- [x] Web App `1:68606654717:web:af89178b765f097eeb2694` registered; public SDK configuration discovered.
- [x] Identity Platform initialized through the supported REST API (HTTP 200); administrative Auth config now returns HTTP 200.
- [x] Functions, Cloud Run, Cloud Build, Artifact Registry, IAM, IAM Credentials, Secret Manager, App Hosting, Hosting, Places, Maps, API Keys, Firestore and Identity Toolkit APIs enabled. The Service Usage batch operation completed successfully.
- [x] Default Firestore Standard Native database in `us-central1`, with provider-verified `freeTier: true`. Deletion protection is enabled; paid point-in-time recovery is disabled. Billing for other services remains separate.
- [x] Deny-all browser Firestore rules released and verified: anonymous REST reads return HTTP 403. Emulator tests also deny authenticated browser access.
- [x] Google provider enabled, with an OAuth web client; verified through the provider API.
- [x] `localhost` and `127.0.0.1` authorized for Firebase Auth.
- [x] Separate Places server and Maps browser keys created. Places is restricted to the Places API; Maps is restricted to the Maps JavaScript API and local web referrers. Values are only in ignored `.env.local` with private file permissions.
- [x] Local Application Default Credentials authorized for this project. A real Firestore read and temporary transaction write/cleanup succeeded.
- [x] Real Google sign-in/session creation and authenticated workspace/details returned HTTP 200.
- [x] Live Places pipeline returned 20 places and 10 eligible records without listed websites in the New York preset. No fictional records were used.
- [x] Browser Google Maps loaded at the intended coordinates with no auth failure or runtime errors.
- [ ] Production runtime identities/secrets, App Hosting/Functions rollout, WIF/CI, production domains, App Check and private catalog protection.

No further user credential/configuration step is currently required to use the local live app. A future machine needs its own supported ADC login; cloud runtime identities will use managed ADC.

## Local applications

- Web: http://localhost:3000
- API: http://localhost:3011/health and http://localhost:3011/docs (another service occupies port 3001).
- Documentation: http://localhost:3002 and http://localhost:3002/changelog
- Storybook: http://localhost:6006

The normal app now uses real Google sign-in, Firestore contact/request persistence, Google Maps and Google Places. It has no demonstration sign-in or fictional search results. The Google provider, ADC and keys are configured for the local runtime. Existing demonstration cookies are rejected by Firebase and require a new Google login.

Tests alone explicitly select `APP_ENV=test`: local signed fixture sessions, memory contacts, SQLite pending requests, demo places and the schematic map. Playwright uses ports 3100/3111/3102 and `.next-test` output, never the live running app. Storybook fixtures remain isolated component examples. No test calls live Google services. `next-env.d.ts` is generated per runtime and ignored.

## Pending site request capture

The user explicitly deferred the AI backend. The Sites domain only captures durable pending records: `firestore-pending` in the normal app, with `local-sqlite` only in explicit automated-test profiles. There is no generator, listener, task dispatch or automatic publishing. Site requests are owner-scoped, idempotent and transactionally deduplicated. Contact history stays independent. A future execution stage must add the constitution’s Cloud Tasks/separate-listener and failed-job recovery implementation before dispatch. See [international prospecting](../docs/international-prospecting.md).

## Source publication

The initial application snapshot and original Stitch PNG/HTML assets were published through the authenticated GitHub Git Data API: commit `b56e63cab1942c536c2399b6937991a0e73c95a9`, tree `e4adb54d19508b223d6de57293e5863b74895e92`, verified identical to the prepared local Git tree. Terminal Git has no HTTPS write credentials. Original local history is preserved on `local-history-before-github-20261116`; local main tracks origin/main. Each subsequent source publication also verifies the complete tree and uses a branch-head lease. No environment files or build artifacts are published.

## Validation

Lint, typecheck, all unit/component/API/contract suites, 5 Playwright flows, 30 Storybook/a11y checks, 3 Firestore emulator tests, coverage gates and all four builds are required and recorded in `docs/live-services.md` and `docs/international-prospecting.md`. OpenAPI is compared against the registered Fastify routes. Native SQLite is fixture-only and requires the repository’s Node 22 runtime. Java 21 runs the Firestore emulator.

`project.setup.json` is the machine-readable record. No production URL is claimed until deployment and exact served-commit probes succeed. Private docs/Storybook hosting protection remains unresolved, so those private catalogs are not published.
