# Opportunity navigation

Search opportunities beside the filters applies the current category, contact status, channel and website selection to the selected map region. Search this region below the map remains available and calls the same search operation. Both buttons are disabled during a request or while a region edit awaits Apply; the filter-side button also waits for hydration. Changing a filter alone does not issue a paid search.

The ambiguous category text-search input is removed. The complete grouped Google category catalog and recommended categories remain in the select.

Each company card exposes only Prepare contact. It fetches current details and opens the contact form directly, showing the company information, website and available channels together with the proposal and contact controls. Map markers open this same form. Manual WhatsApp confirmation, optional portfolio/preview, language selection and site requests retain their behavior.

This is an Experience UI change in Workspace, CategorySelect and CompanyCard. CompanyDrawer continues supporting its isolated detail presentation for catalog consumers, but the workspace has one contact entry flow. Existing SearchOpportunities/GetCompanyDetails usecases, repository ports, Process API adapters, factory selections and authenticated routes are reused. No new aggregate, persistence mutation, API contract, shift key or theme token is introduced. CMS labels and guide content are localized. Component, browser and Storybook accessibility tests cover the navigation.
