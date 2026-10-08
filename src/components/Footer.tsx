function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-7">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">

        {/* Copyright */}
        <div className="text-center sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-slate-300">
              Divyanshu Singh
            </span>
            . All rights reserved.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6">

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/divyanshusingh077"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-xs font-medium text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan-400"
          >
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/divyanshusingh-dev"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-xs font-medium text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan-400"
          >
            GitHub
          </a>

          {/* Email */}
          <a
            href="mailto:divyanshusingh2006r@gmail.com"
            aria-label="Email"
            className="text-xs font-medium text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan-400"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer