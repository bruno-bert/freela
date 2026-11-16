# Live Firebase and Google services

The default app now uses Firebase Google sign-in, Google Maps, Places API (New) and Firestore. No local sign-in, schematic basemap, memory contacts or fictional companies are selected by normal development or production.

## Configuration

| Shift | Normal default | Explicit test profile |
| --- | --- | --- |
| infra.auth.provider | firebase-auth | local |
| API infra.repositories.provider | firestore | memory |
| Next.js infra.repositories.provider | process-api | process-api on port 3111 |
| infra.places.provider | google-places | demo |
| infra.maps.provider | google | schematic |
| infra.queue.provider (API) | firestore-pending | local-sqlite |
| app.buildDirectory (Next.js) | .next | .next-test |

The existing auth/opportunities/sites ports, adapters, usecases and factories remain in place. Only the selected providers change. RuntimeFactory projects the validated framework output directory through ConfigManager, keeping test and live development servers separate. Invalid build-directory values fail startup. There is no fallback to fictional leads when a live service fails. The workspace provider badge follows the configured Places provider even during initial errors or region changes, so a live failure is never labeled demonstration. API routes and OpenAPI contracts are unchanged.

Google sign-in was enabled in Firebase and localhost/127.0.0.1 added to its authorized domains. Supported `gcloud auth application-default login --project=freela-c8c75` authorized the local Admin SDK. The local tool download is ignored; credentials are in the normal protected Google SDK credential location, never in source or chat. A future cloud runtime must use its own managed identity and secret bindings.

Places and Maps have separate keys: Places is server-only and API-restricted; Maps is browser/API/referrer restricted to the local web origins. Keys live in ignored `.env.local` with private permissions. The Firebase Web SDK key is public configuration. Add the verified production domains to the relevant restrictions before public rollout. No service-account private key was created.

## Verification on November 16, 2026

- Google provider API returned enabled=true with a configured OAuth client.
- A real Google login created an HttpOnly session (HTTP 200), followed by an authenticated workspace and company-details request (HTTP 200). Existing demo cookies are rejected and require Google sign-in.
- A live read-only OpportunitiesFactory search around New York fetched 20 Google places, with 10 eligible records without a listed website. All eligible records were non-fictional. No company names/phone numbers were written to verification logs.
- A browser Maps load returned the expected center with no authentication failure or runtime errors. The loader initializes once across React mounts and rejects changing credentials without a page reload. Legacy Google markers remain supported; their upstream deprecation warning does not prevent map use.
- Firestore read and an ephemeral unique readiness record create/transaction/read/delete succeeded. Verification data was removed, and no existing user records were changed.

These are live-service checks with a local frontend/API, not proof of a public App Hosting/Functions rollout. Production runtime identities, Secret Manager, domains, WIF/CI, App Check, private catalog access and exact served-commit probes remain pending.

## Automated checks

Automated suites always select explicit test profiles or mocked ports/emulators. Playwright owns ports 3100 (web), 3111 (API) and 3102 (docs), does not reuse live servers, and supplies a non-production fixture session secret. Next test output uses .next-test so the live user’s app can stay running. Generated next-env.d.ts files and local tool downloads are ignored.

Validation: 70 unit/component/API/contract tests across 30 files, 5 isolated Playwright flows, 30 Storybook/a11y checks and 3 Firestore emulator checks passed. Lint and typecheck passed. Coverage is 99.70% lines, 98.66% statements, 97.56% branches and 98.65% functions; changed runtime files must meet 90% in every metric. All four builds and the changed-runtime coverage gate passed. A clean source copy also passed typecheck without generated next-env files.

Website creation remains pending-request capture only. It is now saved in Firestore for the authenticated user, with transactional deduplication and no AI worker, as requested.
