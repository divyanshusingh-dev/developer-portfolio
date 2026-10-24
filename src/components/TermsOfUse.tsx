
import { Link } from "react-router-dom";

const sections = [
  {
    id: "01",
    label: "ACCEPTABLE USE",
    title: "Use of This Website",
    content:
      "Please use this portfolio website lawfully and responsibly. Do not attempt unauthorized access, disrupt website functionality, or interfere with its normal operation.",
  },
  {
    id: "02",
    label: "OWNERSHIP",
    title: "Intellectual Property",
    content:
      "Original designs, projects, written content, and other materials may be protected by applicable intellectual property laws. Third-party content remains subject to its respective licenses and terms.",
  },
  {
    id: "03",
    label: "EXTERNAL RESOURCES",
    title: "Third-Party Links",
    content:
      "This portfolio may contain links to external websites and services for convenience. Their content, security, and availability are outside the control of this portfolio owner.",
  },
  {
    id: "04",
    label: "AVAILABILITY",
    title: "Website Availability",
    content:
      "The website may occasionally be updated, modified, or temporarily unavailable due to maintenance or technical issues. Continuous, uninterrupted access cannot be guaranteed.",
  },
];

export default function TermsOfUse() {
  const email = "divyanshusingh2006r@gmail.com";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-300 selection:bg-cyan-400/30 selection:text-white">
      {/* Background effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(8,145,178,0.13),transparent_50%)]" />
        <div className="absolute -left-40 top-[35%] h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[130px]" />
        <div className="absolute -right-40 top-[65%] h-96 w-96 rounded-full bg-blue-600/[0.07] blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 text-sm text-slate-400 transition hover:text-cyan-300"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg transition group-hover:border-cyan-400/40 group-hover:bg-cyan-400/[0.08]">
              ←
            </span>
            <span>Back to portfolio</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.04] px-3 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300 sm:text-xs">
              Legal / Terms
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="relative py-12 sm:py-16 lg:py-20">
          <div className="absolute right-0 top-10 hidden select-none font-mono text-[240px] font-black leading-none text-white/[0.018] xl:block">
            T
          </div>

          <div className="relative max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300 sm:text-xs">
                Clear terms. Responsible use.
              </span>
            </div>

            <h1 className="font-sans text-4xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Terms of Use
            </h1>

            <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                Important guidelines for accessing this portfolio,
                respecting original work, and using external resources.
              </p>

              <div className="flex items-center gap-3 border-l-2 border-cyan-400/50 pl-4">
                <div>
                  <p className="font-mono text-2xl font-bold text-white">
                    {String(sections.length).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Terms sections
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 h-px w-full bg-gradient-to-r from-cyan-400/50 via-white/10 to-transparent" />
        </section>

        {/* Content layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[235px_minmax(0,1fr)] lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl border border-white/[0.09] bg-[#07101f]/90 p-4 backdrop-blur-xl sm:p-5">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                On this page
              </p>

              <nav
                aria-label="Terms of use sections"
                className="mt-4 grid grid-cols-2 gap-1 lg:grid-cols-1"
              >
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="group flex min-w-0 items-center gap-2 rounded-lg px-2 py-2.5 text-xs text-slate-400 transition hover:bg-cyan-400/[0.06] hover:text-cyan-300 sm:px-3 sm:text-sm"
                  >
                    <span className="font-mono text-[10px] text-slate-600 transition group-hover:text-cyan-400">
                      {section.id}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-5 border-t border-white/[0.08] pt-5">
                <p className="text-xs text-slate-500">
                  Document
                  <span className="mt-1 block font-medium text-slate-300">
                    Terms of Use
                  </span>
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            <section className="mb-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.07] to-transparent p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-xl text-cyan-300">
                  i
                </div>

                <div>
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    Welcome to my portfolio
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    By accessing this website, you agree to use it
                    responsibly and respect applicable laws, intellectual
                    property rights, and third-party terms.
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-4">
              {sections.map((section) => (
                <section
                  id={`section-${section.id}`}
                  key={section.id}
                  className="scroll-mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.035] to-transparent p-5 transition duration-300 hover:border-cyan-400/25 sm:p-7"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] font-mono text-xs font-bold text-cyan-300 sm:h-12 sm:w-12 sm:text-sm">
                      {section.id}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/80">
                        {section.label}
                      </p>

                      <h2 className="text-lg font-bold leading-snug text-white sm:text-xl">
                        {section.title}
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-[15px] sm:leading-8">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Contact panel */}
            <section className="relative mt-5 overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#07182a] p-6 sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-[80px]"
              />

              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                  Open communication
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Have a question?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                  If you have questions about these terms or the use
                  of this portfolio, feel free to contact me.
                </p>

                <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={`mailto:${email}?subject=Terms%20of%20Use%20Question`}
                    className="max-w-full break-all text-sm font-medium text-cyan-300 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {email}
                  </a>

                  <a
                    href={`mailto:${email}?subject=Terms%20of%20Use%20Question`}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#020617] transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#07182a] sm:w-auto"
                  >
                    Contact me ↗
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.08] pt-6 sm:mt-16 sm:pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/"
                className="text-sm font-bold tracking-wide text-white transition hover:text-cyan-300"
              >
                Divyanshu Singh
                <span className="text-cyan-400">.</span>
              </Link>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                © {new Date().getFullYear()} Divyanshu Singh. All rights reserved.
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap gap-x-5 gap-y-3 text-xs sm:text-sm"
            >
              <Link
                to="/"
                className="text-slate-500 transition hover:text-cyan-300"
              >
                Home
              </Link>

              <Link
                to="/privacy-policy"
                className="text-slate-500 transition hover:text-cyan-300"
              >
                Privacy Policy
              </Link>

              <Link
                to="/copyright"
                className="text-slate-500 transition hover:text-cyan-300"
              >
                Copyright
              </Link>
            </nav>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent" />
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-600">
              End of document
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-cyan-400/30 to-transparent" />
          </div>
        </footer>
      </div>
    </main>
  );
}
