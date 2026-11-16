# Manual WhatsApp confirmation

Google Places supplies phone numbers, not a separate verified WhatsApp number. The contact drawer can try the listed international phone through Open WhatsApp. Its badge remains unconfirmed: opening a tab does not detect an account or mark the business contacted.

After checking the number in WhatsApp, return and choose Confirm WhatsApp. This explicit assertion saves the normalized number and confirmation timestamp in the authenticated owner's contact state. The saved number is also exposed as the company's WhatsApp field. Confirmation survives reopening and reloading; another account cannot read it. Register contact remains a separate action.

The confirmation control becomes available after an attempt with the current number. Failed saves preserve a retry command and never show success. Mutations share contact-state versions, reject stale writes with 409 and use owner-scoped idempotency keys. Repeated confirmation of the same number is a no-op. Recording contact preserves the existing confirmation. A different provider phone is shown unconfirmed; a saved number remains usable when the provider has no number. No Google listing is edited and no automatic WhatsApp verification service is called.

The Experience route POST /api/whatsapp-confirmations forwards to POST /v1/whatsapp-confirmations. Both require authentication; the Experience route also checks origin. Input: companyId, phone, expectedVersion and UUID idempotencyKey. Output: ContactState, with optional whatsappConfirmation {number, confirmedAt}. The factory shift domains.opportunities.usecases.confirmWhatsapp defaults to default in all apps. Existing Firestore owner contact documents and transactions are reused; no new credentials, index or queue are required.

Unit, repository contract, Firestore emulator concurrency, HTTP/BFF, Storybook accessibility and browser tests cover the workflow. Browser tests stub window.open and use fictional numbers; they never send outreach.
