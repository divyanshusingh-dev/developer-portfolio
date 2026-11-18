ADMIN DASHBOARD — CONSOLIDATED MODULAR PACKAGE

This package is based on the Phase 3 source that was installed and successfully built in the project.

INSTALL
1. Make a backup of src/components/AdminPdfSecurity.tsx.
2. Extract this ZIP into the project root and merge/replace the included src files.
3. Run: npm run build

IMPORTANT
- App.tsx is not included and must not be changed.
- Existing AdminPdfSecurity state, API calls, authentication, permissions, upload/replace handlers, academic save handlers, and announcement handlers remain in the parent component.
- ActivityLog, PDFManager, and PDFSecurity are connected layout boundaries in the parent.
- The remaining admin component modules are included under src/components/admin for the next safe extraction pass. Their presence does not mean the original detailed parent UI has been replaced by simplified versions; keeping the original flows avoids losing features.
- The package does not include node_modules, package.json, or the full project.
