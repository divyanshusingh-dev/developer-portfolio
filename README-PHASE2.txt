ADMIN DASHBOARD MODULAR INTEGRATION — PHASE 2

This package is based on the successful Phase 1 parent component.

Phase 2 change:
- Integrates the ActivityLog presentational component into AdminPdfSecurity.tsx.
- Keeps the existing show/hide activity toggle and confirmation-based Clear log control in the parent.
- Keeps all original API calls, authentication, admin management, PDF workflows, academic calculations, announcements, and modals.
- Keeps the Phase 1 AdminSidebar integration.
- Includes the modular admin component folder and modal files.
- Does not include or require App.tsx changes.

Install by merging the included src/components files into the project after backing up the current AdminPdfSecurity.tsx. Then run npm run build.

This is a staged integration. Other modular sections are not yet wired because their current simplified props/UI do not preserve all original controls and metadata.
