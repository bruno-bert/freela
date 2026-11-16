# International prospecting

The workspace starts in New York. Eight shortcuts move the map and clear stale results; only the Search action queries Places. Filters stay selected. Centers are approximate starting points rather than administrative boundaries. Each shortcut has an adjustable 1–1.5 km radius.

| Country | District | Curation source |
| --- | --- | --- |
| United States | New York Flatiron / NoMad | [District business guide](https://flatironnomad.nyc/things-to-do/district-guide/) |
| United States | Austin South Congress | [Visit Austin district guide](https://www.austintexas.org/explore/entertainment-districts/south-congress/) |
| Canada | Toronto Queen West | [Destination Toronto](https://www.destinationtoronto.com/neighbourhoods/westside/queen-west/) |
| Canada | Vancouver Mount Pleasant | [Destination Vancouver](https://www.destinationvancouver.com/neighbourhoods/mount-pleasant) |
| Ireland | Dublin Creative Quarter | [Visit Dublin shopping guide](https://www.visitdublin.com/guides/dublin-shopping-streets) |
| Ireland | Cork Oliver Plunkett Street | [Discover Ireland business listing](https://www.discoverireland.ie/cork/keane-s-jewellers-cork) |
| Netherlands | Amsterdam De Pijp | [I amsterdam neighbourhood guide](https://www.iamsterdam.com/en/explore/neighbourhoods/de-pijp/things-to-do) |
| Netherlands | Rotterdam Witte de With | [Rotterdam tourism shopping guide](https://www.rotterdam.info/en/visit/guide/urban-rotterdam-ultimate-sneaker-haven) |

These sources establish the presence of shops and services. The choice of prospecting areas is a product inference; sources do not establish missing websites, buying intent or guaranteed earnings. Country selection does not lock the invoice currency. No payment or conversion feature is introduced.

The referenced catalog lives in `packages/core/src/domain/region-presets.ts`; translated country names and field labels use the JSON CMS. International demo businesses are fictional fixtures near each center, never live leads. Their contact buttons remain disabled. The local grid is a schematic, not a geographic basemap. Google Maps pans to each center when its production adapter is configured.

## Contact preparation

Message language defaults to English independently of the workspace locale. English and Brazilian Portuguese templates live under `proposal.<locale>.*` in the workspace CMS. Portfolio is optional and its paragraph disappears when blank. The existing-preview checkbox and valid HTTPS URL select a different introduction explaining the preview and possible customization. Invalid links block opening WhatsApp. Language and URL changes regenerate the draft, as explained beside the language controls. Manual edits remain possible. Preparing, opening a chat and queuing a site never mark a contact as completed.

## Pending website requests

The user explicitly deferred the AI backend. This delivery only captures requests; it dispatches no asynchronous work and has no generator/listener. A future execution stage must use the constitution’s Cloud Tasks/separate-listener, bounded-retry and failed-job recovery standards.

Authenticated Experience routes `POST /api/site-requests` and `GET /api/site-requests/:id` forward to the matching `/v1` Process API routes. POST accepts `{companyId, language, brief, idempotencyKey}` and returns 202 with a schema-version-1, version-0 pending record. GET returns the owner’s pending record or null. Input IDs, locale, UUID and brief length are validated. A brief is user-entered and optional. Google business snapshots are not persisted.

The Sites domain has RequestSite/GetSiteRequest contracts and implementations, a queue port, local SQLite and Firestore adapters, and factories. `infra.queue.provider=local-sqlite` is the development default with `.data/site-requests.sqlite`; production selects `firestore-pending`. `domains.sites.usecases.request/get=default` select the application implementations. The Next.js factory uses its existing `infra.repositories.provider=process-api`. These pending adapters are storage, not active Cloud Tasks queues.

SQLite acquires a connection per operation and serializes writes with BEGIN IMMEDIATE. Firestore uses atomic transactions. Owner/company keys identify one pending request. Owner/idempotency-key records replay successful requests. Equivalent requests with new keys deduplicate; altered existing requests or reused keys with different payloads return 409 without overwriting. No processing state transitions are offered. Reopening a contact form loads the existing pending record. Local SQLite is ignored by Git and forbidden in production.

## Validation

Validation passed on November 16, 2026: lint and typecheck; 67 unit/component/API/contract tests across 29 files; 5 Playwright flows, including Supertest against the running Experience API; 29 Storybook render/a11y checks across 15 story files; 3 Firestore emulator security/concurrency tests; and all four application builds. Coverage: 99.70% lines, 98.65% statements, 97.56% branches and 98.64% functions overall. Every changed runtime file passes the 90% gate. Browser inspection confirmed the compact district selector and no runtime console errors. Theme and design-system tokens were reused without changes. The apps remain local/demo; cloud billing and Auth initialization are now verified, while Google OAuth provider setup and remaining production integrations block deployment.
