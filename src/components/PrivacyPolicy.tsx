
import { Link } from "react-router-dom";

const sections = [
  {
    id: "01",
    label: "COLLECTION",
    title: "Information You Provide",
    content:
      "When you contact me through this portfolio, you may choose to share information such as your name, email address, subject, or message. The information involved depends on the contact method and features available on the website.",
  },
  {
    id: "02",
    label: "PURPOSE",
    title: "How Information May Be Used",
    content:
      "Information you provide may be used to respond to your inquiry, discuss a project, or communicate about a professional opportunity. Actual use depends on the features and services connected to the portfolio.",
  },
  {
    id: "03",
    label: "COMMUNICATION",
    title: "Email and Contact Forms",
    content:
      "If you contact me by email, your email provider handles the message you send. If a website contact form is available, submitted information may be processed by the website and its connected services. Please check the relevant service settings and policies for details about storage and processing.",
  },
  {
    id: "04",
    label: "EXTERNAL SERVICES",
    title: "Third-Party Links",
    content:
      "This portfolio may link to external websites, including GitHub, LinkedIn, and email services. Those websites operate independently and have their own privacy policies. I cannot control how third-party services collect, use, or store information on their platforms.",
  },
  {
    id: "05",
    label: "TECHNOLOGY",
    title: "Cookies and Analytics",
    content:
      "The use of cookies, analytics, or other tracking technologies depends on the tools configured on the live website. This policy does not assert that such technologies are in use. If they are introduced, this section should be updated to explain their purpose and relevant choices.",
  },
  {
    id: "06",
    label: "DATA CARE",
    title: "Storage, Retention, and Security",
    content:
      "The storage and retention of information depend on the website implementation and any connected providers. Information should be retained only as appropriate for its purpose and applicable obligations. No online transmission or storage method can be guaranteed to be completely secure.",
  },
  {
    id: "07",
    label: "YOUR CHOICES",
    title: "Your Privacy Choices",
    content:
      "You can choose what information to include when contacting me. Avoid sharing passwords, payment details, government identification numbers, or other sensitive information unless there is a clear and necessary reason. You may email me with questions about information you have shared.",
  },
  {
    id: "08",
    label: "YOUNG VISITORS",
    title: "Children's Privacy",
    content:
      "This portfolio is intended to present personal projects and professional information. It is not specifically designed to collect personal information from children. If you are a parent or guardian with a concern about information submitted through the website, please contact me.",
  },
  {
    id: "09",
    label: "REVISIONS",
    title: "Changes to This Policy",
    content:
      "This Privacy Policy may be revised when the portfolio, its features, or its data practices change. The updated version will be published on this page. Please review it occasionally to stay informed.",
  },
];

export default function PrivacyPolicy() {
  const email = "divyanshusingh2006r@gmail.com";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-300 selection:bg-cyan-400/30 selection:text-white">
      {/* Cinematic background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(8,145,178,0.13),transparent_50%)]" />
        <div className="absolute -left-40 top-[35%] h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[130px]" />
        <div className="absolute -right-40 top-[65%] h-96 w-96 rounded-full bg-blue-600/[0.07] blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Top bar */}
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
              Legal / Privacy
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="relative py-12 sm:py-16 lg:py-20">
          <div className="absolute right-0 top-10 hidden select-none font-mono text-[240px] font-black leading-none text-white/[0.018] xl:block">
            P
          </div>

          <div className="relative max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300 sm:text-xs">
                Your data. Your choice.
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl font-family: 'Inter', sans-serif;">
              Privacy Policy
            </h1>

            <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                A clear guide to the information you may share through this
                portfolio, the role of external services, and the choices
                available to you.
              </p>

              <div className="flex items-center gap-3 border-l-2 border-cyan-400/50 pl-4 sm:min-w-40">
                <div>
                  <p className="font-mono text-2xl font-bold text-white">
                    09
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Policy sections
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 h-px w-full bg-gradient-to-r from-cyan-400/50 via-white/10 to-transparent" />
        </section>

        {/* Content with sidebar */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[235px_minmax(0,1fr)] lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl border border-white/[0.09] bg-[#07101f]/80 p-4 backdrop-blur-xl sm:p-5">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                On this page
              </p>

              <nav
                aria-label="Privacy policy sections"
                className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1"
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
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-cyan-400" aria-hidden="true">
                    ◈
                  </span>
                  Policy information
                </div>
                <p className="mt-2 px-0.5 text-xs leading-6 text-slate-500">
                  Last updated
                  <span className="mt-1 block font-medium text-slate-300">
                    October 10, 2026
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 hidden rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] p-5 lg:block">
              <p className="text-xs font-semibold text-cyan-300">
                Need clarification?
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Contact me if you have a question about this policy.
              </p>
              <a
                href={`mailto:${email}?subject=Privacy%20Policy%20Question`}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white transition hover:text-cyan-300"
              >
                Send an email <span aria-hidden="true">↗</span>
              </a>
            </div>
          </aside>

          {/* Main policy content */}
          <div className="min-w-0">
            <section className="mb-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.07] to-transparent p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-xl text-cyan-300">
                  i
                </div>
                <div>
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    Before you continue
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    The information handled by this website depends on its
                    actual configuration and the services it uses. This policy
                    describes possible data practices and should be aligned
                    with the live implementation before publication.
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
                      <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-500/80 sm:text-[10px]">
                        {section.label}
                      </div>
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
                  Have a privacy question?
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                  For questions about this policy or information you have
                  shared, you can contact me directly by email.
                </p>

                <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={`mailto:${email}?subject=Privacy%20Policy%20Question`}
                    className="max-w-full break-all text-sm font-medium text-cyan-300 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {email}
                  </a>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                      email
                    )}&su=${encodeURIComponent("Privacy Policy Question")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#020617] transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#07182a] sm:w-auto"
                  >
                    Contact me <span aria-hidden="true">↗</span>
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
                © {new Date().getFullYear()} Divyanshu Singh. All rights
                reserved.
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
                to="/copyright"
                className="text-slate-500 transition hover:text-cyan-300"
              >
                Copyright
              </Link>
              <Link
                to="/terms-of-use"
                className="text-slate-500 transition hover:text-cyan-300"
              >
                Terms of Use
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
