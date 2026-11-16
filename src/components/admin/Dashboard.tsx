type DashboardProps = {
  files: Array<{ hasFile: boolean; effectiveProtected: boolean }>;
  totalSlots: number;
  adminRole: string;
  adminEmail: string;
  onLogout: () => void;
  children?: React.ReactNode;
};

/** Dashboard overview and content outlet; data/actions are supplied by the parent. */
export default function Dashboard({ files, totalSlots, adminRole, adminEmail, onLogout, children }: DashboardProps) {
  const uploadedCount = files.filter((file) => file.hasFile).length;
  const protectedCount = files.filter((file) => file.hasFile && file.effectiveProtected).length;

  const stats = [
    { label: "PDF slots", value: files.length || totalSlots, note: "Configured documents", color: "cyan" },
    { label: "Uploaded", value: uploadedCount, note: "PDFs available in admin", color: "emerald" },
    { label: "Protected", value: protectedCount, note: "Uploaded PDFs protected", color: "violet" },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Administration</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">PDF Security &amp; Education Manager</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Upload or replace a PDF, control portfolio visibility, manage passwords and maintain semester SGPA data without editing source code.</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-600">Signed in as {adminRole === "superadmin" ? "Super Admin" : "Administrator"} · {adminEmail}</p>
        </div>
        <button type="button" onClick={onLogout} className="w-fit rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white">Logout</button>
      </header>
      <section aria-label="PDF portfolio summary" className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-4 shadow-lg sm:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
          </article>
        ))}
      </section>
      {children}
    </section>
  );
}
