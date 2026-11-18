ADMIN DASHBOARD — SAFE INTEGRATION PACKAGE (PHASE 1)

Included:
- src/components/AdminPdfSecurity.tsx (original 3,750-line component, with only the dashboard navigation replaced by AdminSidebar)
- src/components/admin/* (all supplied modular components and modal components)

IMPORTANT:
1. This package preserves the original API calls, authentication, state, PDF workflows, academic calculations, admin management, announcements, activity log, and modal implementations.
2. Only AdminSidebar is connected in this safe first integration. Other modular section components are included but are NOT wired into the parent yet; directly swapping them would remove existing controls/metadata.
3. App.tsx is not included and does not need to change.
4. Merge the included src/components files into the project, preserving folder paths. Back up the current AdminPdfSecurity.tsx first.
5. Run: npm run build

This is a safe staged integration, not a claim that all sections have been modularized.
