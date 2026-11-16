# Setup and operational readiness

Target project: **freela-c8c75** (project number **68606654717**). Google sign-in was selected, with per-user opportunity/contact ownership. No application has been deployed.

## Verified

- [x] Firebase CLI authenticated project access; project is active.
- [x] Web App registered: `1:68606654717:web:af89178b765f097eeb2694`.
- [x] Public SDK config discovered; the browser API key is supplied through an environment reference.
- [x] Firestore API enabled and verified in Service Usage.
- [x] Identity Toolkit API already enabled.
- [ ] Billing: checked with Cloud Billing API; `billingEnabled: false`.
- [ ] Firebase Auth: administrative config returned `CONFIGURATION_NOT_FOUND`.
- [x] Firestore default database created in `us-central1` (Iowa), Standard Native edition. Provider reports `freeTier: true`.
- [x] Deletion protection enabled; paid point-in-time recovery disabled.
- [x] Deny-all browser rules compiled and released to the live database. An anonymous REST document read was rejected with HTTP 403 `PERMISSION_DENIED` (missing or insufficient permissions).
- [ ] Live Google Places / Maps, App Check, runtime ADC and cloud deployments verified.

## User actions

1. Enable billing: https://console.firebase.google.com/project/freela-c8c75/usage/details . The agent will recheck `billingEnabled` before provisioning billing-dependent resources.
2. Location is resolved: `us-central1` (Iowa), chosen under your cheapest/free preference. No further location choice is required.
3. Complete interactive Google consent / Application Default Credentials when the Admin SDK setup reaches that step. Never paste credentials or codes into chat. The agent will verify the exact project afterward.
4. Repository destination is resolved: https://github.com/bruno-bert/freela . Deployment workflows remain inactive under `deploy/templates/` until resource IDs, WIF and private hosting protection are configured.

The agent will handle supported API activation, Firebase Auth/Google provider setup, database provisioning, restricted key configuration, runtime identities, app backends and CI setup under the authorized scope once prerequisites are available. Provider consent or organization restrictions may require a browser step.

## Local capability

The API uses signed development sessions and an in-memory contact repository. The app has Portuguese/English CMS content, company filters, explicit circle selection, search, detail/contact drawers, editable proposals and versioned contact registration. Fictional WhatsApp destinations are disabled. A real provider returns unknown WhatsApp/Instagram rather than guessing them. Demo history resets when the API restarts.

Default ports: web `3000`, API **`3011`** (another service occupies `3001`), docs `3002`, Storybook `6006`. `/health` and `/docs` are available on the API. Local auth and demo persistence/search are rejected in production. Production session cookies are Secure, HttpOnly and SameSite=Lax; local HTTP uses a development-only non-Secure cookie.

## Deployment inventory

- Web and docs: separate App Hosting backends, not provisioned.
- API: independent Firebase Functions codebase, not deployed.
- Storybook: static Hosting target with access protection required before private publishing.
- Firestore rules deny all browser access; only authorized server operations use Admin SDK.
- No listener or scheduler is needed: searches are bounded request/response operations; WhatsApp is a user action.

`project.setup.json` is the machine-readable setup record. Deployment readiness must not be inferred from enabled APIs or generated templates.

## Implementation verification

- Unit, component, API, adapter and OpenAPI contract suites: passing.
- Coverage: 99.62% lines, 98.36% statements, 97.59% branches, 98.20% functions overall; all changed runtime files meet the 90% gate. API, web and docs have individual reports under their `coverage/` directories.
- Playwright: four passing browser/API flows, including real Next.js routes tested with Supertest.
- Storybook: 24 passing render/accessibility checks across 14 story files.
- Firestore emulator: browser access denied; concurrent update protection and idempotent replay verified. Java 21 is required; the local checkout has a private tool download under ignored `.data/java/`.
- Builds: web, docs, Process API and Storybook passed. The bundled API passed `/health` and Swagger smoke checks. The Functions package is staged under ignored `deploy/api/build/`; the configured deployment region is `us-central1`.
- OpenAPI is exported in `apps/api/openapi/v1.json` and compared with registered routes by tests.
- Next.js page/layout composition and standalone entrypoints are verified through builds/E2E; coverage measures the domain, application, infrastructure, components, HTTP/API handlers and proxy. Type-only contracts and generated files have no executable coverage obligation.

Before live use, activate billing, finish Google sign-in/ADC and provide restricted Maps/Places credentials through secure local environment or Secret Manager configuration. Local mode intentionally remains enabled until live setup is verified. No live Google results, cloud sign-in or deployment smoke test has been claimed.

## Cost-first location decision

The user requested the cheapest or free option. The `(default)` database was created in Iowa (`us-central1`) with Standard Native edition and `freeTier: true`, verified from the provider after creation. This first database qualifies for Firestore free usage: 1 GiB stored data, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day and the documented transfer allowance. There is no capacity reservation or paid recovery feature enabled. Billing remains disabled. See [official pricing](https://cloud.google.com/firestore/pricing).

The API runtime is configured for the same region for future deployment; no application deployment occurred. Existing local demo providers remain active until authentication, credentials and the rest of the cloud setup are verified. Billing-dependent Maps/Places and hosting services are separate from Firestore's free quota.

## Authorized push and deployment request

The user authorized source publication and application deployment without repeated approval prompts. On November 16, the user supplied https://github.com/bruno-bert/freela.git and it was configured as `origin`. The GitHub connector verified admin/push access to the empty public repository. Terminal Git has no HTTPS credentials, so source publication uses the authenticated GitHub Git Data API. The source tree SHA is compared with the local Git tree before publication. Original local commits are preserved on a backup branch if local main is aligned to the connector-created remote history.

A fresh November 16 Cloud Billing check still returned `billingEnabled: false`; Auth configuration returned `CONFIGURATION_NOT_FOUND`. Firebase App Hosting and Cloud Functions require the Blaze plan. Activate billing at https://console.firebase.google.com/project/freela-c8c75/usage/details before application deployment can proceed. Google sign-in and restricted Maps/Places credentials also require completed configuration.

Local development adapters must not be published as production. No application deployment or production URL is claimed. Existing Firestore free-tier provisioning and private rules remain verified. Once billing is available, continue setup, validate the exact checkout, deploy each app independently and verify the served commit.

Local initial application commit prepared: `8499f077818872e6a7f62eb8e5db1837d680d67a`. It has not been pushed to any remote.

## Source publication verification — November 16, 2026

The complete source and original Stitch assets were published to [bruno-bert/freela](https://github.com/bruno-bert/freela) through the authenticated GitHub connector. Published application source commit: `b56e63cab1942c536c2399b6937991a0e73c95a9`. Its tree `e4adb54d19508b223d6de57293e5863b74895e92` exactly matches the prepared local source tree; each PNG blob SHA was checked independently. The publication contains no local environment file or generated build artifacts.

Because terminal Git lacks HTTPS credentials, GitHub generated the publication commit through its API. The original local history is preserved on local branch `local-history-before-github-20261116`; local `main` tracks `origin/main`. Subsequent documentation records this verified source publication. Application deployment remains blocked by billing and production integration prerequisites; no deployed app URL is claimed.
