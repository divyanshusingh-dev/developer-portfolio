import type { Dispatch, SetStateAction } from "react"

export type AdminTab = "dashboard" | "announcements"

type AdminSidebarProps = {
  activeTab: AdminTab
  setActiveTab: Dispatch<SetStateAction<AdminTab>>
  announcementCount: number
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  announcementCount,
}: AdminSidebarProps) {
  const tabClass = (tab: AdminTab) =>
    `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
      activeTab === tab
        ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`

  return (
    <nav
      aria-label="Admin dashboard navigation"
      className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2"
    >
      <button
        type="button"
        onClick={() => setActiveTab("dashboard")}
        aria-current={activeTab === "dashboard" ? "page" : undefined}
        className={tabClass("dashboard")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Dashboard
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("announcements")}
        aria-current={activeTab === "announcements" ? "page" : undefined}
        className={tabClass("announcements")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
          <path d="m3 11 18-5-5 17-4-7-9-5Z" strokeLinejoin="round" />
          <path d="m12 16 5-7" strokeLinecap="round" />
        </svg>
        Announcements
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === "announcements" ? "bg-slate-950/15" : "bg-slate-800 text-slate-300"}`}>
          {announcementCount}
        </span>
      </button>
    </nav>
  )
}
