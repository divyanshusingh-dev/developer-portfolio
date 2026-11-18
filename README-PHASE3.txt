ADMIN DASHBOARD MODULAR INTEGRATION — PHASE 3

This package builds on Phase 2. It extracts the PDF Manager and PDF Security section boundaries into dedicated components while preserving the complete original JSX inside them.

Important: all original upload/replace form controls, selected-slot logic, file input, SGPA/percentage fields, password field, protection toggle, master-protection toggle, API calls, validation, and event handlers remain in AdminPdfSecurity.tsx. The new components are layout wrappers only; no simplified UI replaces the original workflows.

Install by extracting this ZIP into the project root and replacing the included files. It updates src/components/AdminPdfSecurity.tsx and the two files under src/components/admin/. App.tsx is not changed. Back up the current parent file first, then run npm run build.
