# Reachable prospects and website improvement analysis

Opportunity searches now require at least one non-blank phone, WhatsApp or email value. An Instagram profile alone does not satisfy this contact requirement. Filtering happens in `SearchOpportunities` after applying the owner’s saved contact state and manual WhatsApp confirmation, and applies to every website selection. Google Places does not provide an email field in its [place resource contract](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places); the current Google adapter explicitly leaves email and WhatsApp unknown. Neither channel is guessed from a telephone number, and no mail addresses are scraped automatically.

## Finding redesign opportunities

The default remains `website=missing`. The “No website listed” checkbox is editable: unchecking it selects `all`. The Website select exposes `missing`, `present` and `all`. Set the filter and click Search explicitly. Existing websites appear as links on result cards and in business details. The previous fixed no-website badge no longer prevents searching for businesses that already have a site. Google Nearby still returns at most 20 ranked places before application filters; results remain non-exhaustive.

The company model accepts optional `email`, so a provider returning a known email can preserve an email-only prospect. Google results generally qualify through their listed phone. The fixture provider includes clearly fictional reachable and existing-website cases; fixture contacts remain disabled for outbound WhatsApp.

## Reviewing a website

Open a business with a website and click Analyze website with AI in details or contact preparation. One explicit request resolves the website from Google Places using the business ID, reads the public HTML and invokes Gemini through authenticated Google Cloud ADC. The browser cannot submit an arbitrary website URL. Reports include English and Brazilian Portuguese summaries, up to five recommendations, observed-versus-suggested labels, source evidence and analysis time/model. Expand evidence to inspect it. Findings survive the move from details to contact preparation, but are not persisted after closing/reloading the drawer.

This is an HTML review, without JavaScript execution, visual rendering, speed measurement, ranking promises or accessibility certification. Static HTML omissions can reflect client rendering; review every finding before sharing. Website content is untrusted input, isolated from system instructions. The model cannot call tools, and the application rejects evidence IDs absent from the fetched page signals and rejects “observed” claims based solely on free text.

The reader rejects credentials, unsupported protocols/ports, non-public addresses, empty DNS responses and redirects into private networks. Every redirect is revalidated. Connections pin the validated public IP while retaining the original Host and TLS SNI; IPv4 is preferred when available. DNS, total read time, redirects and response bytes are bounded. Only HTML is accepted, with no credential forwarding or compressed-content parsing. It is not a crawler and does not bypass authentication, access blocks or TLS checks.

## Preparing the proposal

For existing websites, the draft offers a redesign rather than assuming the business has no site. Contact-message language remains independent of the workspace language. An optional checkbox includes the first three translated recommendations in a cautious, editable proposal. The portfolio and preview URLs remain optional; a supplied preview adapts the introduction. The proposal is never sent automatically and opening WhatsApp never marks a business contacted. A proposal edited while analysis is running is preserved.

## Architecture and configuration

The new `audits` domain has an `AnalyzeWebsite` usecase in the Process API, a website-reader port and a website-analyzer port. `AuditsFactory` selects adapters and the usecase. The Experience API forwards a verified user session through its own repository port, application usecase and factory; business rules remain in the Process API.

| Key | Default | Test override |
| --- | --- | --- |
| `infra.websites.provider` | `http` | `fixture` |
| `infra.websites.http.timeoutMs` | `15000` | Same contract |
| `infra.ai.provider` | `vertex` | `fixture` |
| `infra.ai.vertex.projectId` | `freela-c8c75` | No live calls |
| `infra.ai.vertex.model` | `gemini-3.8-flash` | `fixture-no-model-call` |
| `infra.ai.vertex.timeoutMs` | `45000` | No live calls |
| `domains.audits.usecases.analyze` | `default` | `default` |
| `infra.repositories.process-api.auditTimeoutMs` | `90000` | Same boundary |

The Process API Functions timeout is 120 seconds. The production API runtime can only predict with Gemini and consume the project service through custom IAM role `freelaWebsiteAnalyzer`; it cannot manage AI resources. No new API key or permanent credential is required. Fixture analyzer/reader adapters are forbidden in production. There is no background task or stored mutation: analysis is a bounded request/response query, with no automatic retry or persisted report. Existing contact-history and pending site-request transaction/idempotency behavior is unchanged. AI site generation remains deferred.

`POST /api/website-audits` forwards to authenticated `POST /v1/website-audits`. Body: `{ "companyId": "<place ID>" }`, with unknown fields rejected. Responses: `200` bilingual report; `400` invalid input/origin; `401` unauthenticated; `422` absent or unreadable/unsafe website; `502` provider/model/unsupported-evidence failure. The versioned OpenAPI includes the new route and optional search website filter with default `missing`.

## Verification

Unit, component, API/contract, Playwright and Storybook/a11y suites cover contactability, all website selections, URL validation, SSRF defenses, structured output, bilingual draft inclusion, mode transitions, failures and preservation of edits. Emulator tests continue verifying existing Firestore boundaries. A separate authorized live smoke fetched public example HTML and received a bilingual structured Gemini result; automated tests use fixtures and mocks without live model calls.

## Firebase JSON transport

Firebase consumes the incoming request stream before the Functions handler runs, as described in the [Fastify serverless guide](https://fastify.dev/docs/latest/Guides/Serverless/). The Functions adapter replays `rawBody` bytes through Fastify injection, discards obsolete request length/encoding headers, and forwards the resulting status, headers and bytes. This preserves authentication, secure JSON parsing, body limits and Zod validation without waiting on a consumed stream. The local Node server is unchanged. A consumed-stream HTTP contract tests searches, audits, contact replay, site-request replay, validation and oversized payloads. Deployment now also posts JSON to the public health path and requires the normal `404` response within 15 seconds, in addition to verifying the served commit. This probe carries no credentials and changes no business data.
