type AdminHeaderProps = {
  adminRole: "superadmin" | "admin" | ""
  adminEmail: string
  onLogout: () => void
}

export default function AdminHeader({ adminRole, adminEmail, onLogout }: AdminHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          PDF Security &amp; Education Manager
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Upload or replace a PDF, control portfolio visibility, manage passwords and maintain semester SGPA data without editing source code.
        </p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Signed in as {adminRole === "superadmin" ? "Super Admin" : "Administrator"} · {adminEmail}
        </p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="w-fit rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
      >
        Logout
      </button>
    </header>
  )
}
