export type ManagedAdmin = { id: string; name: string; email: string; role: string; status: string; createdAt?: string; updatedAt?: string }
export type AdminRequest = ManagedAdmin

type Props = {
  admins: ManagedAdmin[]
  pendingRequests: AdminRequest[]
  search: string
  statusFilter: string
  loading?: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onRequestAction: (id: string, action: "approve" | "reject") => void
  onAdminAction: (id: string, action: "disable" | "enable" | "delete") => void
  onRefresh?: () => void
  onExport?: () => void
}

export default function AdminManagement({ admins, pendingRequests, search, statusFilter, loading = false, onSearchChange, onStatusFilterChange, onRequestAction, onAdminAction, onRefresh, onExport }: Props) {
  return (
    <section className="space-y-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Access control</p><h2 className="mt-2 text-xl font-bold">Administrator management</h2><p className="mt-1 text-sm text-slate-400">Review access requests and manage registered administrator accounts.</p></div><div className="flex gap-2">{onRefresh && <button type="button" onClick={onRefresh} disabled={loading} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold">{loading ? "Refreshing…" : "Refresh"}</button>}{onExport && <button type="button" onClick={onExport} className="rounded-xl border border-cyan-400/30 px-3 py-2 text-xs font-semibold text-cyan-200">Export CSV</button>}</div></div>
      {pendingRequests.length > 0 && <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4"><h3 className="font-semibold text-amber-200">Pending requests ({pendingRequests.length})</h3><div className="mt-3 space-y-2">{pendingRequests.map((request) => <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div><p className="text-sm font-semibold">{request.name}</p><p className="text-xs text-slate-400">{request.email}</p></div><div className="flex gap-2"><button type="button" onClick={() => onRequestAction(request.id, "approve")} className="rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">Approve</button><button type="button" onClick={() => onRequestAction(request.id, "reject")} className="rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-300">Reject</button></div></div>)}</div></div>}
      <div className="flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search name or email" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"/><select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"><option value="all">All statuses</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="disabled">Disabled</option></select></div>
      <div className="overflow-x-auto rounded-2xl border border-slate-800"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Administrator</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{admins.map((admin) => <tr key={admin.id} className="border-t border-slate-800"><td className="px-4 py-3"><p className="font-semibold text-slate-200">{admin.name}</p><p className="text-xs text-slate-500">{admin.email}</p></td><td className="px-4 py-3 text-slate-400">{admin.role}</td><td className="px-4 py-3 text-slate-400">{admin.status}</td><td className="px-4 py-3"><div className="flex gap-2">{admin.status === "disabled" ? <button type="button" onClick={() => onAdminAction(admin.id, "enable")} className="text-xs text-emerald-300">Enable</button> : <button type="button" onClick={() => onAdminAction(admin.id, "disable")} className="text-xs text-amber-300">Disable</button>}<button type="button" onClick={() => onAdminAction(admin.id, "delete")} className="text-xs text-red-300">Delete</button></div></td></tr>)}</tbody></table>{admins.length === 0 && <p className="p-5 text-center text-sm text-slate-500">No administrator records match the current filters.</p>}</div>
    </section>
  )
}
