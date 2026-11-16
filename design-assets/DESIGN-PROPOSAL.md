# Design proposal: Freelancer Workspace

Status: visual direction approved by the user. Stitch screen exports are available for review; see README.md. This proposal records the approved input, not the generated output.
Stitch project: 8650887222206239999. Design system: assets/514812703809497c8099d48b23b4bf5b.

## 1. Visual theme and atmosphere

A calm, precise desktop workspace for daily prospecting. Moderate information density, clear action hierarchy, restrained decoration and persistent geographic context. Display name is a working label, not an approved brand.

## 2. Color palette and roles

- Canvas: soft slate (#F8FAFC).
- Surfaces: white (#FFFFFF).
- Main text: deep slate (#0F172A).
- Secondary text: slate (#475569).
- Primary action and selected region: deep teal (#0F766E).
- Dividers: pale slate (#E2E8F0).
- Input boundaries: slate (#64748B).
- Keyboard focus: blue (#2563EB).
- Success: green (#166534), with explicit status text.
- Warning: ochre (#854D0E), with explicit status text.
- Error: red (#B91C1C), with explicit error text.

Color does not carry meaning alone. Validate final rendered WCAG AA contrast before approval of implementation.

## 3. Typography rules

Inter with a system sans-serif fallback. Main content at 14–16 px, page headings at 24–28 px, medium-weight field labels and semibold actions. Keep names and contact information readable; allow translated labels to wrap.

## 4. Component styling

Buttons and fields use gently rounded 8 px corners. Panels use 12 px corners. Status badges are pill-shaped with text. Panels rely on fine dividers; elevation is reserved for menus and dialogs. Outline icons always accompany accessible labels.

## 5. Layout principles

Desktop reference: 1440 × 1000 px. A 216 px module sidebar, a compact top bar and a split content workspace: approximately 45% company list and 55% map. Spacing follows a 4 px base scale. Keep filters above the list and region search actions inside the map panel. The list and map scroll independently where needed.

## 6. Screen set and content

End-user copy: Brazilian Portuguese for the initial mockups. Documentation and filenames remain English. All companies and contact data are clearly fictional examples.

1. Opportunities with results: Opportunities selected in the module sidebar; Finance and AI site creation shown as future modules. Filters for category, contact status and available contact channels. Company rows show name, address, phone, known WhatsApp/Instagram, status and actions. Missing channels are unknown, not inferred.
2. Region selection: map drawing control, editable radius, highlighted selected area and an explicit search action. Moving the map does not automatically launch another search. Display provider attribution and an indicative result count without implying exhaustive coverage.
3. Company details: overlay panel with business information, source link, contact channels and contact history while preserving context of the list and map.
4. Contact preparation: editable message with company name, website proposal and a portfolio placeholder. Primary action opens WhatsApp; a separate action confirms that contact occurred. Opening WhatsApp never implies message delivery.
5. Loading: skeleton list and progress text, with duplicate search disabled.
6. Empty: concise explanation and actions to adjust category or selected region.
7. Error: preserve filters and region; show a clear error and retry action.

Label the eligibility criterion as “Sem site informado”. Portfolio URL remains [TBD]. Illustrations are optional for empty states; the primary screen prioritizes working space.

## 7. Stitch generation brief

Create a desktop-first web application screen for a freelancer finding local business opportunities. This is an authenticated operational workspace.

**PLATFORM:** Web, desktop-first.

**PAGE STRUCTURE:**
1. Persistent module navigation with Opportunities active, plus Finance, AI site creation, settings and account.
2. Compact page header with page title and workspace context.
3. Primary split workspace with company search results on the left and an interactive geographic region selection map on the right.
4. Search filters, region summary and explicit search action; no decorative hero or marketing footer.
5. Results with company identity, address, phone, known contact channels, contact status and details/contact actions.
6. Context-preserving details and contact preparation panels.
7. Consistent loading, empty and recoverable error variants.

Apply visual tokens through the project design system rather than embedding theme instructions into generation prompts. Download original HTML and screenshots to `.stitch/designs/`; copy approved outputs and their specification into `design-assets/`. Record actual project, screen and design system identifiers after creation.
