import type { ReactNode, Dispatch, SetStateAction } from "react"
import AdminHeader from "./AdminHeader"
import AdminSidebar, { type AdminTab } from "./AdminSidebar"

type AdminLayoutProps = {
  children: ReactNode
  activeTab: AdminTab
  setActiveTab: Dispatch<SetStateAction<AdminTab>>
  announcementCount: number
  adminRole: "superadmin" | "admin" | ""
  adminEmail: string
  onLogout: () => void
}

export default function AdminLayout({
  children,
  activeTab,
  setActiveTab,
  announcementCount,
  adminRole,
  adminEmail,
  onLogout,
}: AdminLayoutProps) {
  return (
    <main className="admin-shell relative min-h-screen bg-[#020617] px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
      <style>{`
        .admin-shell {
          isolation: isolate;
          background-image: radial-gradient(ellipse at 12% 0%, rgba(34, 211, 238, .09), transparent 32%), radial-gradient(ellipse at 88% 8%, rgba(139, 92, 246, .08), transparent 28%);
        }
        .admin-shell::before {
          content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
          opacity: .18;
          background-image: linear-gradient(rgba(148,163,184,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.06) 1px, transparent 1px);
          background-size: 36px 36px; mask-image: linear-gradient(to bottom, black, transparent 78%);
        }
        .admin-shell section > div, .admin-shell section article,
        .admin-shell [class*="rounded-2xl"][class*="border"],
        .admin-shell [class*="rounded-3xl"][class*="border"] {
          transition: border-color .22s ease, box-shadow .22s ease, background-color .22s ease, transform .22s ease;
        }
        .admin-shell [class*="rounded-2xl"][class*="border"]:hover,
        .admin-shell [class*="rounded-3xl"][class*="border"]:hover { border-color: rgba(103, 232, 249, .24); }
        .admin-shell button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        .admin-shell button:focus-visible, .admin-shell input:focus-visible,
        .admin-shell select:focus-visible, .admin-shell textarea:focus-visible {
          outline: 2px solid rgba(103, 232, 249, .9); outline-offset: 3px;
        }
        .admin-shell input, .admin-shell select, .admin-shell textarea { min-width: 0; }
        .admin-shell ::-webkit-scrollbar { width: 8px; height: 8px; }
        .admin-shell ::-webkit-scrollbar-track { background: rgba(15, 23, 42, .7); }
        .admin-shell ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, .6); border-radius: 999px; }
        .admin-shell ::-webkit-scrollbar-thumb:hover { background: rgba(103, 232, 249, .55); }
        @media (hover: hover) and (pointer: fine) { .admin-shell button:not(:disabled):hover { transform: translateY(-1px); } }
        @media (max-width: 640px) {
          .admin-shell { padding-left: 14px !important; padding-right: 14px !important; }
          .admin-shell h1 { overflow-wrap: anywhere; }
          .admin-shell [class*="overflow-x-auto"] { overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; }
          .admin-shell table { min-width: 620px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-shell *, .admin-shell *::before, .admin-shell *::after {
            scroll-behavior: auto !important; animation-duration: .01ms !important;
            animation-iteration-count: 1 !important; transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-7">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            announcementCount={announcementCount}
          />
        </div>

        {activeTab === "dashboard" && (
          <AdminHeader adminRole={adminRole} adminEmail={adminEmail} onLogout={onLogout} />
        )}

        {children}
      </div>
    </main>
  )
}
