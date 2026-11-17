# Production login and opportunity storage

## Login behind App Hosting

The Google popup exchanges its ID token for a server-managed Firebase session. App Hosting terminates HTTPS before the Next.js server, so the route's internal request URL can differ from the browser's public origin. Comparing those addresses rejected legitimate session creation after Google returned.

`infra.auth.publicOrigin` now defines the exact browser origin for same-origin mutation checks. The web production value is `https://freela-web--freela-c8c75.us-central1.hosted.app`. Empty values, used in development and unpublished documentation, compare against the request URL. The configuration accepts an origin without a path. Request-supplied forwarded headers never select a trusted origin. Both frontend session helpers apply the same rule; no authentication requirement, cookie protection or user access boundary is relaxed.

The deployment smoke check verifies anonymous same-origin logout succeeds and a foreign origin is rejected. This exercises the real proxy path without credentials or modifying a user's session. Popup navigation to Google is checked separately; completing Google account consent still requires the account holder.

## What is stored

Live Google company search/detail payloads are transient in the page and request memory. They are not copied into browser localStorage, IndexedDB, a local database or Firestore company records. Reloading performs a fresh search. Browsers and HTTP infrastructure can cache eligible assets according to HTTP behavior; this is not a saved prospect list.

Firestore stores owner-private company identifiers and user-generated contact state/history, manual WhatsApp confirmation, idempotency command results and pending site requests (language and brief). Authentication uses a protected HttpOnly session cookie. Development may use real cloud services; only explicit test profiles use in-memory contact records and an ignored local SQLite pending-request queue. An independent saved prospect list has not been implemented.

## Deferred website analysis

The requested analysis integration is prepared but remains disconnected. `domains.audits.usecases.analyze=deferred` is the normal Process API default. The deferred usecase returns 503 before looking up a place, reading a website or invoking an LLM. The existing `default` implementation and Vertex adapter remain available for a later explicit connection. Test profiles select `default` with fixtures and make no paid model calls.
