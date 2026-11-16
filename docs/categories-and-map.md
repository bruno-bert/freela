# Category filters and compact map workspace

## Category catalog

`packages/core/src/domain/place-types.ts` contains a reviewed snapshot of all **478 Table A** identifiers from [Google Places types](https://developers.google.com/maps/documentation/places/web-service/place-types#table-a), reviewed November 16, 2026. The catalog preserves the provider’s 19 groups. Table B values such as `health`, `point_of_interest` and `establishment` are response metadata and are not accepted as direct Nearby Search filters.

CategorySelect places 31 recommended types first, followed by all remaining types without duplicates. Recommendations prioritize the user’s requested medical/veterinary clinics, groceries and beauty businesses, plus local services where appointments or service information can make a website useful. This is a product judgment, not evidence of buying intent or expected earnings. Business size is not directly filterable by Places; supermarkets may include larger chains. Types limited to a region can yield no results in other regions.

Labels and group names are editable in the English/Portuguese workspace CMS (`placeType.<id>` and `placeGroup.<id>`). The search field matches localized labels without accents or case distinctions and also matches original IDs. Filtering the selector does not call Places. A selected type stays visible while the list is filtered. The request always contains the canonical Google ID. “All” omits the type filter rather than sending hundreds of IDs in a request. Search remains one explicit bounded Nearby Search call, with the existing 20-result/non-exhaustive limitation.

PlaceCategory validates the shared catalog inside SearchOpportunities. Both Experience and Process route schemas use its category enum; OpenAPI includes all allowed values. Existing ports, factories and shift keys are retained, and authentication/ownership/mutation rules are unchanged. Tests verify the entire catalog, reject response-only types, and exercise the newly supported categories through the Process adapter/API contract.

## Map behavior

The Google circle is a passive overlay (`clickable=false`, `draggable=false`, `editable=false`). It no longer intercepts basemap dragging. Map drag-end updates the draft center, and clicking a point selects it. The viewport uses setCenter for coordinate changes; radius changes fit the circle into view. Marker-only updates preserve the camera. Form coordinates preview immediately, Apply confirms the region, and Cancel restores it. Invalid coordinate/radius drafts are not sent to an already loaded map. Radius changes preserve edited coordinates.

The cooperative Google gesture mode allows normal mouse-wheel page scrolling, with Ctrl+wheel available for map zoom. Dragging or editing coordinates never starts a Places search automatically.

## Layout and scrolling

The map is above region shortcuts, drawing controls and search actions. The fixed-height/overflow-hidden desktop wrapper and nested result scroller were replaced by normal page flow. The document scrollbar has a stable gutter and visible theme-colored thumb; sidebar/dialog scrolling uses the same scrollbar styling. Cards and controls have compact spacing; the existing palette and Inter font remain unchanged.

Theme tokens: control height 36px, compact spacing 12px, scrollbar width 12px, map height clamp(240px,40dvh,420px), minimum map height 240px. The map sticks only on desktop viewports at least 640px tall; shorter screens can scroll past the whole panel. On narrow screens it precedes the result list. Dialog internal heading/action containers no longer become duplicate document banner/footer landmarks.

## Validation

Unit/component tests cover map pointer selection, camera updates, invalid/late-loading drafts, category search/selection and preserved coordinate edits. Browser tests check all category options, request IDs, map-before-controls ordering, coordinate preview, page scrolling, mobile overflow and dialog accessibility. Stories cover the category selector, international map, dense result list, long card address and scrolling dialog.

A real Google Maps adapter smoke check confirmed mouse dragging and a coordinate jump from New York to Amsterdam. No customer details or credentials were logged. The normal app still uses live Firebase/Maps/Places; automated tests use isolated fixtures/emulators. Public application hosting remains separate and pending as recorded in deploy/SETUP.md.

Validation results: 78 unit/component/API/contract tests across 32 files, 6 Playwright flows, 37 Storybook render/a11y checks and 3 emulator checks passed. Overall coverage: 99.72% lines, 98.70% statements, 97.63% branches, 98.72% functions. Lint/typecheck and all four builds are validated. A real `medical_clinic` Nearby Search request returned HTTP 200 with 20 results; this confirms filter support, not website eligibility or buying intent. The native scrollbar was visually inspected with browser scrollbars enabled.
