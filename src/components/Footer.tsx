
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinkClass =
    "inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-400 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300";

  const legalLinkClass =
    "text-sm text-slate-500 transition-colors duration-200 hover:text-cyan-400";

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#020617] text-slate-300">
      {/* Subtle top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
          {/* Brand */}
          <div className="max-w-md">
            <Link
              to="/"
              aria-label="Divyanshu Singh - Home"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] text-sm font-extrabold tracking-wide text-cyan-300 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/[0.14]">
                DS
              </span>

              <span className="text-lg font-bold tracking-tight text-white">
                Divyanshu
                <span className="ml-1 text-cyan-400">Singh</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Aspiring Software Developer passionate about building
              useful digital experiences through code, creativity,
              and continuous learning.
            </p>

            <a
              href="mailto:divyanshusingh2006r@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              Contact me
            </a>
          </div>

          {/* Connect */}
          <div className="sm:justify-self-end">
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Let's Connect
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Feel free to connect or explore my work.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://github.com/divyanshusingh-dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my GitHub profile"
                className={socialLinkClass}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
                GitHub
                <span aria-hidden="true" className="text-xs">↗</span>
              </a>

              <a
                href="https://linkedin.com/in/divyanshusingh077"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my LinkedIn profile"
                className={socialLinkClass}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8 19H4.5V9H8ZM6.25 7.65a2.03 2.03 0 1 1 0-4.06 2.03 2.03 0 0 1 0 4.06ZM19.5 19H16v-4.87c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.26-1.87 2.57V19H9V9h3.36v1.37h.05a3.68 3.68 0 0 1 3.3-1.81c3.53 0 4.19 2.32 4.19 5.34Z" />
                </svg>
                LinkedIn
                <span aria-hidden="true" className="text-xs">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/[0.08]" />

        {/* Copyright and legal links */}
        <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-slate-500">
            © {currentYear}{" "}
            <Link
              to="/copyright"
              className="font-medium text-slate-300 transition-colors hover:text-cyan-400"
            >
              Divyanshu Singh
            </Link>
            . All rights reserved.
          </p>

          <nav
            aria-label="Legal information"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          >
            <Link to="/copyright" className={legalLinkClass}>
              Copyright
            </Link>

            <Link to="/privacy-policy" className={legalLinkClass}>
              Privacy Policy
            </Link>

            <Link to="/terms-of-use" className={legalLinkClass}>
              Terms of Use
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
