# Firebase setup and reusable deployment assets

Read on first use of `dev`, when resuming setup, or when implementing Firebase/CI/CD. The assets are sanitized from a working Firebase application: source deployment, quality gates, WIF, private rules, emulators and served-commit verification. They intentionally contain no product integrations, personal accounts, project IDs or commercial feature flags.

## First-use questionnaire

Check `deploy/project.setup.json` first. The user manually **creates the Firebase project and enables billing**. Ask for its **project ID** and request authenticated Firebase/Google Cloud access if unavailable. Offer **Skip for now** for any or all setup. Do not ask the user for generated resource identifiers or credentials. Infer app/repository information from the workspace/Git remote and discover project metadata through authenticated APIs. Ask about region, sign-in methods or other product choices only when unknown and needed; explain irreversible location choices before provisioning.

Record discovered and created non-secret values in `deploy/project.setup.json`; retain unresolved placeholders in `pending`. Use `deferred` for skip, `in-progress` during provisioning and `configured` only after verification. Save partial progress to resume idempotently. A skip prevents repeating onboarding but never means deployment readiness. Keep a persistent human-readable checklist at `deploy/SETUP.md` and in the docs app when available.

## Authenticate, discover and provision

1. **Inspect access first:** check available Firebase/Google Cloud tooling and authenticated identities without printing credentials. Use a connected tool when it supports the required operation; otherwise use Firebase CLI, gcloud or official REST APIs. Verify access to the exact supplied project ID, discover its project number, existing Firebase resources and enabled services, and check billing (for example `gcloud billing projects describe PROJECT_ID`). Never silently switch accounts/projects or rely on a global default project.
2. **Request interactive access when missing:** explain which project and operations need access, then initiate supported login (`firebase login`, using `--no-localhost` when appropriate; `gcloud auth login` for gcloud). Use `gcloud auth application-default login` only when the selected SDK/REST client needs ADC: gcloud credentials and ADC are distinct. The user completes Google consent in the browser. Do not request passwords, access/refresh tokens, JSON keys or login codes in chat; use the tool's secure interactive channel. Do not create permanent CI keys or deprecated `login:ci` tokens. If interactive auth is unavailable, give exact supported login steps and resume after authentication. A `403` requires a specific missing permission/access grant, not endless login retries.
3. **Check prerequisites:** verify billing is enabled and Firebase is attached. If needed, use the Firebase Management API/CLI to add Firebase to the existing supplied project, not to create a replacement. If billing is inactive, report the project's billing link and resume other independent work; linking billing remains the user's step. Discover existing locations before choosing new ones; reuse compatible settings. For a new irreversible database/bucket location, obtain the missing location choice rather than inventing it.
4. **Enable required APIs:** inspect enabled services and use Service Usage or `gcloud services enable SERVICE... --project PROJECT_ID` for missing services only. Derive the service list from actual app features and current provider documentation. Typical services are listed below; do not activate every optional integration by default. Wait for long-running operations and verify the enabled state. Report organization-policy, permission, quota or billing failures precisely; never disable existing services to fix them.
5. **Provision and configure:** discover/reuse or create Web Apps and retrieve their public SDK config; initialize Auth and selected sign-in methods/domains; create Firestore and the Firebase-linked Storage bucket; configure private rules/indexes; create App Hosting backends and Hosting targets for deployed apps. Configure App Check/recaptcha when applicable, Functions runtime identities, task queues, scheduled jobs and requested FCM. Use supported resource-specific CLI/REST APIs; a Web App registration alone does not initialize all services. Trigger-managed resources may be created during deployment: record them as pending until deployed and verified. Do not disable protections to make checks pass.
6. **Automate CI/CD bootstrap:** discover the GitHub remote and authenticated repository access; configure the deploy/runtime service accounts, minimal IAM grants, WIF pool/provider with restricted trust, GitHub Environment/variables and Secret Manager bindings. Reuse resources and merge policies without removing unrelated bindings. Request GitHub access only when absent. For private integration values, offer supported secure local input or Secret Manager entry; never ask the user to paste secrets into chat. Provisioning authorization covers these setup operations, not unrelated repository writes or a production rollout.
7. **Verify and record:** re-read resources after creation, confirm access boundaries and relevant emulator/security checks, then perform the requested deployment and smoke checks only within its authorization. Use bounded polling; on permission/policy errors, stop that operation, record the blocker and continue independent work. On rerun, reconcile current state instead of creating duplicates. Never report a resource ready merely because its API is enabled.

### API selection guide

Use current official API/service documentation when materializing a setup script; this list is a starting point, not an unconditional enable-all command.

| Capability | Typical API service names |
|---|---|
| Service management / project discovery | `serviceusage.googleapis.com`, `cloudresourcemanager.googleapis.com`, `firebase.googleapis.com` |
| Authentication | `identitytoolkit.googleapis.com` |
| Firestore | `firestore.googleapis.com` |
| Firebase Storage | `firebasestorage.googleapis.com`, `storage.googleapis.com` |
| Functions and build/runtime | `cloudfunctions.googleapis.com`, `run.googleapis.com`, `cloudbuild.googleapis.com`, `artifactregistry.googleapis.com`, `logging.googleapis.com` |
| IAM, WIF and secret bindings | `iam.googleapis.com`, `iamcredentials.googleapis.com`, `sts.googleapis.com`, `secretmanager.googleapis.com` |
| Task queues / schedules | `cloudtasks.googleapis.com`, `cloudscheduler.googleapis.com` |
| Event delivery / fan-out when used | `eventarc.googleapis.com`, `pubsub.googleapis.com` |
| App Hosting / static Hosting | `firebaseapphosting.googleapis.com`, `firebasehosting.googleapis.com` |
| App Check / reCAPTCHA Enterprise when used | `firebaseappcheck.googleapis.com`, `recaptchaenterprise.googleapis.com` |
| Push when used | `fcm.googleapis.com`, `firebaseinstallations.googleapis.com` |

### Every handover: operational readiness

Always report and persist: the target project/environment; verified APIs/resources; capabilities working locally and in cloud; deployment status and served-commit verification; and a checklist of outstanding work. For each remaining user action, give the exact command or project-specific console/provider URL, why it is needed, which capability it blocks and how completion will be checked. Distinguish actions the agent will do once access is available from actions that truly need the user (Google consent/access grants, billing, external provider authorization/secrets, domain ownership/DNS, organizational restrictions). Do not instruct manual API activation or routine resource creation when supported authenticated automation is available. If nothing remains, state that only after applicable end-to-end checks succeed. External providers and ownership/consent requirements may still need user participation; never promise automation can bypass them.

## Materialize only what the requested app needs

All files in `../assets/firebase/` are inactive source templates. Do not move the workflow into `.github/workflows/` until its placeholders, commands and required gates are configured.

| Asset | Destination / adaptation |
|---|---|
| `project.setup.json` | `deploy/project.setup.json`; non-secret onboarding record |
| `firebase.json` | `deploy/<app>/firebase.json`; remove sections not owned by that pipeline |
| `.firebaserc` | Beside the Firebase config; map environment aliases and Hosting targets |
| `firestore.rules`, `firestore.indexes.json`, `storage.rules` | `deploy/shared/`; owned by a separate rules pipeline |
| `apphosting.yaml` | Each Next.js app root (`apps/web`, `apps/docs`), with its own values |
| `.env.example` | Relevant app; retain only needed keys; never populate with credentials |
| `.gitignore` | Merge into root ignore rules, preserving existing entries |
| `github-actions.yml` | One `.github/workflows/<app>.yml` per app; another for shared rules |
| `verify-deployment.mjs` | `scripts/verify-deployment.mjs` or per-app equivalent |

The Firebase config is an inventory example combining sections for illustration, **not a deploy-all pipeline**. A web/docs config retains only its App Hosting backend; API/listener/job configs retain one Functions codebase; Storybook retains Hosting; shared config retains rules/indexes/storage. Resolve all file paths relative to the chosen config location. The example `../../apps/...` paths assume `deploy/<app>/firebase.json`. Place rule files beside the shared config, or adjust their paths. Do not overwrite existing rules/indexes with empty examples: merge deliberately. For a monorepo App Hosting upload, retain workspace manifests, shared packages and sources; verify the uploaded source includes transitive dependencies.

Replace `__APP_NAME__`, `__APP_PATH__`, `__APP_PACKAGE__`, `__TRANSITIVE_PACKAGE_PATH__`, `__DEPLOY_PATH__`, `__WORKFLOW_FILE__`, `__GITHUB_ENVIRONMENT__`, `__FIREBASE_CONFIG_PATH__`, `__VERIFY_SCRIPT_PATH__` and all Firebase identifiers. Expand the shared-package path list using the actual transitive dependency graph; do not deploy unrelated apps. `__DEPLOY_TARGET__` becomes exactly one `apphosting:<backendId>`, `functions:<codebase>`, `hosting:<target>`, or `firestore:rules,firestore:indexes,storage` for shared rules. Serialize all writers of the same project/target under the same concurrency group.

## CI and runtime preparation

1. Pin pnpm in root `packageManager`, Node to a supported runtime, `firebase-tools` in devDependencies and all dependencies in `pnpm-lock.yaml`. Review current action releases and pin immutable SHAs when activating workflows. Templates use major action tags as examples.
2. Implement `ci:quality` to run lint, typecheck, unit/component/API/contract tests, Playwright, Storybook render/a11y tests, 90% overall coverage and builds for the selected app and dependencies. Implement `ci:emulators` using `firebase emulators:exec --project demo-<app>` and security/integration suites without live cloud access. Implement `ci:coverage-new` with a configured changed-code coverage gate (90%); a successful command that does nothing is unacceptable. Adapt scripts for the rules-only pipeline. Required checks must run before deploy.
3. Follow the authenticated provisioning procedure above: the user creates the project and enables billing; the agent enables APIs and provisions/configures required services. Templates alone do not provision anything. Keep region and endpoint config consistent. Emulator tests never require production credentials.
4. Configure WIF with trust restricted to the repository/owner IDs, main branch and intended workflow/environment. Grant only required deploy permissions and service-account impersonation; keep runtime identities separate with per-resource permissions. Set GitHub Environment variables `FIREBASE_PROJECT_ID`, `SITE_URL`, `WIF_PROVIDER`, `DEPLOY_SERVICE_ACCOUNT`. Secrets live in Google Secret Manager with access granted to the runtime that needs them; bind references in Functions/App Hosting. Do not copy a service account JSON key.
5. Functions apps need a deployable package with `main`, matching Node engine, built output, and bundled/workspace-resolved shared code. Infra adapters register `onRequest`, `onTaskDispatched`, Firestore/Pub/Sub events or `onSchedule` and invoke factory-produced usecases. No business rules in trigger wrappers. Firebase SDK imports stay in infra, including Functions registration; entry points only export handlers.
6. Before App Hosting deploy, verify `git rev-parse HEAD` equals `GITHUB_SHA` and replace the **single** `__DEPLOY_COMMIT_SHA__` value in the chosen app's `apphosting.yaml` with that SHA. Fail if the marker is missing or duplicated. This marker is intentionally resolved at deployment rather than onboarding. Add that stamp step to the materialized workflow. Expose an uncached `/api/health` returning `{ "status": "ok", "commit": "<runtime SHA>" }` via ConfigManager/factory, then run the verification script after the CLI rollout completes. For Functions/Hosting, replace verification with the relevant authenticated health check or served artifact SHA. Keep any private health probe authenticated.
7. Disable duplicate automatic App Hosting branch rollouts when Actions owns source deployment. Use explicit project/target commands. Run a placeholder scan over the selected active config/workflow/script files before deployment; exclude inactive templates. Validate the selected backend/codebase exists in the config, since a mistyped target must not count as success. Do not deploy required unresolved placeholders, accept deletion prompts with blanket force, or report success until the served version is verified.

For schedules, record cron expression, timezone, region, runtime identity, bounded retries, overlap handling and failed-job recovery. For Cloud Tasks, implement failed-job persistence and controlled replay; Pub/Sub can use a dead-letter topic. Never perform external side effects inside retried Firestore transaction callbacks. Private rules do not constrain Admin SDK calls: authorize in the usecase before reading or mutating data.

## Official references

- [App Hosting source deployment](https://firebase.google.com/docs/app-hosting/alt-deploy)
- [App Hosting monorepos](https://firebase.google.com/docs/app-hosting/monorepos)
- [Task queue Functions](https://firebase.google.com/docs/functions/task-functions)
- [Scheduled Functions](https://firebase.google.com/docs/functions/schedule-functions)
- [Functions runtime management](https://firebase.google.com/docs/functions/manage-functions)
- [GitHub Actions Google authentication](https://github.com/google-github-actions/auth)

- [Enable Google APIs](https://docs.cloud.google.com/sdk/gcloud/reference/services/enable)
- [Check project billing](https://docs.cloud.google.com/sdk/gcloud/reference/billing/projects/describe)
- [Firebase programmatic project setup](https://firebase.google.com/docs/projects/api/workflow_set-up-and-manage-project)
- [Firebase CLI authentication](https://firebase.google.com/docs/cli)
- [Application Default Credentials](https://docs.cloud.google.com/docs/authentication/application-default-credentials)
