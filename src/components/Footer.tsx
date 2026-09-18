function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">

        {/* Copyright */}
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Divyanshu Singh. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-6">

          <a
            href="https://linkedin.com/in/divyanshusingh077"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-400 transition hover:text-cyan-400"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-400 transition hover:text-cyan-400"
          >
            GitHub
          </a>

          <a
            href="https://gmail.com/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-400 transition hover:text-cyan-400"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer