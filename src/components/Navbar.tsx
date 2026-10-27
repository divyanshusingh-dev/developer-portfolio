import { useEffect, useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Keep the desktop navigation uncluttered by grouping secondary links.
  const primaryLinks = navLinks.filter((link) =>
    ["Home", "About", "Skills", "Projects", "Design Showcase", "Contact"].includes(link.name)
  );
  const moreLinks = navLinks.filter((link) =>
    ["GitHub Activity", "Certifications", "Experience", "Education"].includes(link.name)
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0
      );
    };

    window.addEventListener("scroll", handleScroll);
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
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  };

  const isLinkActive = (href: string) => activeSection === href.replace("#", "");
  const moreIsActive = moreLinks.some((link) => isLinkActive(link.href));

  return (
    <>
      <div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-transparent">
        <div
          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-slate-700/40 bg-slate-950/80 shadow-lg shadow-black/10 backdrop-blur-xl"
            : "border-transparent bg-slate-950/30 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
          <a
            href="#home"
            onClick={handleLinkClick}
            className="group flex shrink-0 items-center gap-1 whitespace-nowrap"
          >
            <span className="text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-400 xl:text-xl">
              Divyanshu
            </span>
            <span className="text-lg font-bold text-cyan-400 xl:text-xl">
              Singh
            </span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden min-w-0 items-center gap-0.5 lg:flex">
            {primaryLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`group relative whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-all duration-300 xl:px-2.5 xl:text-sm ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-slate-300 hover:bg-cyan-400/5 hover:text-cyan-300"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-cyan-400 transition-all duration-300 ${
                      isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
                    }`}
                  />
                </a>
              );
            })}

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
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-all duration-300 xl:px-2.5 xl:text-sm ${
                  moreIsActive || isMoreOpen
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-300 hover:bg-cyan-400/5 hover:text-cyan-300"
                }`}
              >
                More
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
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
                <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  {moreLinks.map((link) => {
                    const isActive = isLinkActive(link.href);
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={handleLinkClick}
                        className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
                          isActive
                            ? "bg-cyan-400/10 text-cyan-300"
                            : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-300"
                        }`}
                      >
                        {link.name}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a
              href="/admin-pdf-security"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-purple-400/40 bg-purple-400/5 px-2.5 py-2 text-xs font-semibold text-purple-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400 hover:bg-purple-400 hover:text-white hover:shadow-lg hover:shadow-purple-400/20 xl:px-3 xl:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin Login
            </a>

            <a
              href="#contact"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-3 py-2 text-xs font-semibold text-cyan-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-lg hover:shadow-cyan-400/20 xl:px-3.5 xl:text-sm"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-transparent transition-all duration-300 lg:hidden ${
              isMenuOpen
                ? "border-cyan-400 text-cyan-300"
                : "border-slate-700/70 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            }`}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu: all section links remain available */}
        <div
          className={`overflow-hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
            isMenuOpen ? "max-h-[85vh] overflow-y-auto opacity-100" : "max-h-0 border-t-0 opacity-0"
          }`}
        >
          <div className="space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-slate-300 hover:bg-cyan-400/5 hover:text-cyan-300"
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-300">
                    →
                  </span>
                </a>
              );
            })}

            <a
              href="/admin-pdf-security"
              onClick={handleLinkClick}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-400/5 px-3.5 py-2.5 text-sm font-semibold text-green-200 transition-all duration-300 hover:border-green-400 hover:bg-green-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin Login
            </a>

            <a
              href="#contact"
              onClick={handleLinkClick}
              className="mt-2 flex w-full items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-3.5 py-2.5 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:bg-cyan-400 hover:text-slate-950"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
