
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Design Showcase", href: "#design-showcase" },
  { name: "GitHub Activity", href: "#github-activity" },
  { name: "Certifications", href: "#certifications" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

const primaryLinks = navLinks.filter((link) =>
  ["Home", "About", "Skills", "Projects", "Design Showcase", "Contact"].includes(link.name)
);

const moreLinks = navLinks.filter((link) =>
  ["GitHub Activity", "Certifications", "Experience", "Education"].includes(link.name)
);

const moreIcons: Record<string, string> = {
  "GitHub Activity": "⌘",
  Certifications: "✧",
  Experience: "◷",
  Education: "▤",
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setIsScrolled(scrollY > 30);
      setScrollProgress(
        documentHeight > 0
          ? Math.min(100, (scrollY / documentHeight) * 100)
          : 0
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((section): section is Element => Boolean(section));

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsMoreOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  };

  const isLinkActive = (href: string) =>
    activeSection === href.replace("#", "");

  const moreIsActive = moreLinks.some((link) =>
    isLinkActive(link.href)
  );

  return (
    <>
      {/* Top Scroll Progress */}
      <div className="fixed left-0 top-0 z-[70] h-[2px] w-full">
        <div
          className="h-full rounded-r-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.35)] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navbar Wrapper */}
      <header className="fixed left-0 top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          className={`relative mx-auto flex h-[64px] w-full max-w-[1380px] items-center justify-between gap-3 rounded-full border px-4 transition-all duration-500 sm:px-6 ${
            isScrolled
              ? "h-[58px] border-white/[0.10] bg-slate-950/90 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
              : "border-white/[0.09] bg-slate-950/55 shadow-[0_5px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          }`}
        >
          {/* Brand */}
          <a
            href="#home"
            onClick={handleLinkClick}
            aria-label="Divyanshu Singh - Home"
            className="group flex shrink-0 items-center gap-1"
          >
            <span className="text-[19px] font-bold tracking-[-0.9px] text-white transition-colors duration-300 group-hover:text-cyan-300 sm:text-[21px]">
              Divyanshu
            </span>
            <span className="text-[19px] font-medium tracking-[-0.8px] text-cyan-400 sm:text-[21px]">
              Singh
            </span>
            <span className="ml-0.5 mt-[-11px] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {primaryLinks.map((link) => {
              const active = isLinkActive(link.href);

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`relative whitespace-nowrap rounded-full px-2.5 py-2.5 text-[12px] font-medium transition-all duration-300 xl:px-3 xl:text-[13px] ${
                    active
                      ? "bg-white/[0.10] text-white"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                  }`}
                >
                  {link.name}

                  {active && (
                    <span className="absolute bottom-[3px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,0.55)]" />
                  )}
                </a>
              );
            })}

            {/* More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isMoreOpen}
                onClick={() => setIsMoreOpen((open) => !open)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2.5 text-[12px] font-medium transition-all duration-300 xl:text-[13px] ${
                  moreIsActive || isMoreOpen
                    ? "bg-white/[0.10] text-white"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                }`}
              >
                More
                <svg
                  className={`h-3 w-3 transition-transform duration-300 ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 top-full z-50 w-[255px] pt-3">
                  <div className="overflow-hidden rounded-[20px] border border-white/[0.10] bg-slate-950/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                    <div className="flex items-center justify-between px-3 pb-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-[1.8px] text-slate-500">
                        Explore Portfolio
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    </div>

                    {moreLinks.map((link) => {
                      const active = isLinkActive(link.href);

                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          onClick={handleLinkClick}
                          className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                            active
                              ? "bg-cyan-400/[0.08] text-cyan-300"
                              : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-base text-cyan-400 transition-colors group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10">
                            {moreIcons[link.name]}
                          </span>

                          <span className="text-[13px] font-medium">
                            {link.name}
                          </span>

                          <svg
                            className="ml-auto h-3.5 w-3.5 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-cyan-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden="true"
                          >
                            <path d="M7 17 17 7M7 7h10v10" />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a
              href="/admin-pdf-security"
              title="Admin Login"
              className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-medium text-slate-500 transition-all duration-300 hover:bg-white/[0.06] hover:text-slate-200"
            >
              <svg
                className="h-3.5 w-3.5 transition-colors group-hover:text-cyan-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin
            </a>

            <a
              href="#contact"
              onClick={handleLinkClick}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-950 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_5px_20px_rgba(34,211,238,0.18)] xl:text-[13px]"
            >
              Let's Talk

              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 lg:hidden ${
              isMenuOpen
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10"
            }`}
          >
            {isMenuOpen ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          aria-hidden={!isMenuOpen}
          className={`mx-auto mt-2 w-full max-w-[1380px] overflow-hidden rounded-[24px] border border-white/[0.09] bg-slate-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 lg:hidden ${
            isMenuOpen
              ? "max-h-[85vh] overflow-y-auto p-3 opacity-100"
              : "pointer-events-none max-h-0 border-transparent p-0 opacity-0"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pb-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-[1.8px] text-slate-500">
                Navigation
              </span>
              <span className="text-[10px] text-slate-600">
                Divyanshu Singh
              </span>
            </div>

            {navLinks.map((link, index) => {
              const active = isLinkActive(link.href);

              return (
                <a
                  key={link.name}
                  href={link.href}
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-cyan-400/[0.08] text-cyan-300"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-5 text-[10px] text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.name}
                  </span>

                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  )}
                </a>
              );
            })}

            <div className="grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3">
              <a
                href="/admin-pdf-security"
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs font-medium text-slate-400 transition-all hover:bg-white/[0.05] hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Admin Login
              </a>

              <a
                href="#contact"
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-semibold text-slate-950 transition-all hover:bg-cyan-300"
              >
                Let's Talk
                <span>→</span>
              </a>
            </div>

            <p className="pb-1 pt-2 text-center text-[10px] text-slate-600">
              Designed & Developed by{" "}
              <span className="font-medium text-cyan-400">
                Divyanshu Singh
              </span>
            </p>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
