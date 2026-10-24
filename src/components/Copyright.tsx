
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  const legalLinks = [
    {
      label: "Copyright",
      description: "Ownership and permitted use",
      to: "/copyright",
      number: "01",
    },
    {
      label: "Privacy Policy",
      description: "Privacy and data practices",
      to: "/privacy-policy",
      number: "02",
    },
    {
      label: "Terms of Use",
      description: "Website usage guidelines",
      to: "/terms-of-use",
      number: "03",
    },
  ];

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.08] bg-[#020617] text-slate-300">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-20 h-64 w-64 rounded-full bg-cyan-500/[0.07] blur-[100px] sm:h-96 sm:w-96" />
        <div className="absolute -right-32 top-1/3 h-64 w-64 rounded-full bg-blue-600/[0.06] blur-[110px] sm:h-96 sm:w-96" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-9 py-10 sm:gap-12 sm:py-14 lg:grid-cols-[1.25fr_0.65fr_1fr] lg:gap-14 lg:py-20">
          {/* Brand */}
          <div className="min-w-0">
            <Link
              to="/"
              className="group inline-flex max-w-full items-center gap-3"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/15 to-blue-500/10 text-base font-black text-white transition duration-300 group-hover:border-cyan-300/50 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">
                D<span className="text-cyan-300">S</span>
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#020617] bg-cyan-300" />
              </span>

              <span className="min-w-0">
                <span className="block break-words text-base font-bold tracking-tight text-white sm:text-lg">
                  Divyanshu Singh
                </span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-400 sm:text-[10px] sm:tracking-[0.25em]">
                  Software Developer
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400 sm:mt-7 sm:leading-7">
              Building digital experiences with thoughtful design, clean code,
              and a passion for learning new technologies.
            </p>

            {/* Email CTA */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=divyanshusingh2006r@gmail.com&su=Portfolio%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex max-w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.05] hover:text-cyan-300 sm:mt-6 sm:gap-3 sm:px-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/[0.08] text-base text-cyan-300">
                @
              </span>
              <span className="min-w-0">Let’s talk about your idea</span>
              <span className="shrink-0 transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </a>
          </div>

          {/* Navigation */}
          <div className="min-w-0">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:mb-6 sm:text-[11px] sm:tracking-[0.25em]">
              Navigation
            </p>

            <nav
  aria-label="Footer navigation"
  className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1 sm:gap-y-3"
>
  {exploreLinks.map((item, index) => (
    <a
      key={item.label}
      href={item.href}
      className="group flex min-w-0 items-center gap-2 text-xs text-slate-400 transition hover:text-cyan-300 sm:gap-3 sm:text-sm"
    >
      <span className="w-4 shrink-0 font-mono text-[9px] text-slate-600 group-hover:text-cyan-400">
        0{index + 1}
      </span>
      <span>{item.label}</span>
    </a>
  ))}
</nav>
          </div>

          {/* Social links */}
          <div className="min-w-0">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:mb-6 sm:text-[11px] sm:tracking-[0.25em]">
              Find me online
            </p>

            <p className="mb-4 max-w-xs text-sm leading-6 text-slate-400 sm:mb-5">
              Connect with me, explore my work, and discover what I’m building.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://github.com/divyanshusingh-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group min-w-0 rounded-xl border border-white/[0.09] bg-white/[0.025] p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.04] sm:p-4"
              >
                <span className="flex items-center justify-between gap-1 text-sm font-semibold text-white">
                  GitHub
                  <span className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300">
                    ↗
                  </span>
                </span>
                <span className="mt-1.5 block text-xs text-slate-500 sm:mt-2">
                  My projects
                </span>
              </a>

              <a
                href="https://linkedin.com/in/divyanshusingh077"
                target="_blank"
                rel="noopener noreferrer"
                className="group min-w-0 rounded-xl border border-white/[0.09] bg-white/[0.025] p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.04] sm:p-4"
              >
                <span className="flex items-center justify-between gap-1 text-sm font-semibold text-white">
                  LinkedIn
                  <span className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300">
                    ↗
                  </span>
                </span>
                <span className="mt-1.5 block text-xs text-slate-500 sm:mt-2">
                  Let’s connect
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Legal panel */}
        <section
          aria-labelledby="footer-legal-heading"
          className="overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#07111f]/90"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Legal introduction */}
            <div className="relative min-w-0 overflow-hidden border-b border-white/[0.07] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="pointer-events-none absolute -right-3 -top-5 select-none text-[100px] font-black leading-none text-cyan-300/[0.035] sm:text-[150px]">
                ©
              </div>

              <div className="relative">
                <p className="mb-3 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300 sm:mb-4 sm:text-[10px] sm:tracking-[0.25em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Copyright & Legal Info
                </p>

                <h2
                  id="footer-legal-heading"
                  className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
                >
                  Your rights.
                  <br />
                  <span className="text-slate-500">Our transparency.</span>
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400 sm:mt-4 sm:leading-7">
                  Find details about content ownership, privacy practices, and
                  the terms that apply to this website.
                </p>

                <p className="mt-4 text-[10px] font-medium tracking-wide text-slate-500 sm:mt-6 sm:text-xs">
                  LAST UPDATED · OCTOBER 10, 2026
                </p>
              </div>
            </div>

            {/* Legal links */}
            <nav
              aria-label="Copyright and legal information"
              className="min-w-0 p-3 sm:p-5 lg:p-7"
            >
              <p className="mb-2 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:mb-3 sm:text-[10px]">
                Explore legal documents
              </p>

              <div className="space-y-1">
                {legalLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-white/[0.07] hover:bg-white/[0.025] sm:gap-4 sm:py-4"
                  >
                    <span className="shrink-0 font-mono text-[10px] text-cyan-500/70 sm:text-xs">
                      {item.number}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-200 transition group-hover:text-cyan-300">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {item.description}
                      </span>
                    </span>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-sm text-slate-500 transition group-hover:border-cyan-300/30 group-hover:bg-cyan-300/[0.08] group-hover:text-cyan-300 sm:h-8 sm:w-8">
                      ↗
                    </span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </section>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] py-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-6">
          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            © {year}{" "}
            <Link
              to="/copyright"
              className="font-semibold text-slate-300 transition hover:text-cyan-300"
            >
              Divyanshu Singh
            </Link>
            . All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 sm:text-sm">
            <span>Designed with purpose.</span>
            <a
              href="#home"
              className="font-medium text-cyan-400 transition hover:text-cyan-200"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
