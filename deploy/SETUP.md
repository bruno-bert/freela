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
- [ ] Google sign-in: provider does not yet exist. Creating it with the supported API returned HTTP 400 `INVALID_CONFIG : client_id cannot be empty.`
- [ ] Restricted Maps/Places keys, runtime identities/ADC, App Check, App Hosting backends, independent CI/deploy pipelines and production smoke tests.

## Required console step

Open [Firebase Authentication sign-in providers](https://console.firebase.google.com/project/freela-c8c75/authentication/providers), choose **Google**, enable it, select the support email and save. Firebase must provision/configure the Google OAuth web client. The available REST provider API requires an existing OAuth client ID/secret and cannot complete this missing configuration by merely enabling the provider. Never paste credentials into chat.

The agent can then verify the Google provider and continue restricted API keys, runtime identities, separate App Hosting backends, WIF/CI and deployment. Interactive Google consent or ADC should be completed only if the supported tooling requires it. This is missing provider configuration, not a request to approve the already-authorized deployment.

Official references: [initialize Auth](https://docs.cloud.google.com/identity-platform/docs/reference/rest/v2/projects.identityPlatform/initializeAuth), [configure OAuth providers through REST](https://firebase.google.com/docs/auth/configure-oauth-rest-api), [Google provider setup](https://firebase.google.com/docs/auth/web/google-signin).

## Local applications

- Web: http://localhost:3000
- API: http://localhost:3011/health and http://localhost:3011/docs (another service occupies port 3001).
- Documentation: http://localhost:3002 and http://localhost:3002/changelog
- Storybook: http://localhost:6006

Signed local sessions and fictional company fixtures support development. Contact history is in API process memory and resets on restart. Site requests are durable in ignored `.data/site-requests.sqlite` and remain pending across restarts. International presets cover eight commercial districts in the US, Canada, Ireland and the Netherlands. The local map is a schematic; live Places/Maps and Google sign-in have not been verified. WhatsApp opens only known real destinations and never records contact automatically. Production refuses development adapters.

## Pending site request capture

The user explicitly deferred the AI backend. The Sites domain only captures durable pending records: `local-sqlite` locally and `firestore-pending` in production. There is no generator, listener, task dispatch or automatic publishing. Site requests are owner-scoped, idempotent and transactionally deduplicated. Contact history stays independent. A future execution stage must add the constitution’s Cloud Tasks/separate-listener and failed-job recovery implementation before dispatch. See [international prospecting](../docs/international-prospecting.md).

## Source publication

The initial application snapshot and original Stitch PNG/HTML assets were published through the authenticated GitHub Git Data API: commit `b56e63cab1942c536c2399b6937991a0e73c95a9`, tree `e4adb54d19508b223d6de57293e5863b74895e92`, verified identical to the prepared local Git tree. Terminal Git has no HTTPS write credentials. Original local history is preserved on `local-history-before-github-20261116`; local main tracks origin/main. Each subsequent source publication also verifies the complete tree and uses a branch-head lease. No environment files or build artifacts are published.

## Validation

Lint, typecheck, all unit/component/API/contract suites, 5 Playwright flows, 29 Storybook/a11y checks, 3 Firestore emulator tests, coverage gates and all four builds are required and recorded with the feature’s validation evidence in `docs/international-prospecting.md`. OpenAPI is compared against the registered Fastify routes. Native SQLite is development-only and requires the repository’s Node 22 runtime. Java 21 runs the Firestore emulator.

`project.setup.json` is the machine-readable record. No production URL is claimed until deployment and exact served-commit probes succeed. Private docs/Storybook hosting protection remains unresolved, so those private catalogs are not published.
