
import { useEffect, useRef } from "react";

function Skills() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll<HTMLElement>("[data-reveal]");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("skills-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add("skills-visible");
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const skillGroups = [
    {
      title: "Frontend",
      number: "01",
      category: "INTERFACE ENGINEERING",
      description:
        "Building modern, responsive and user-friendly interfaces with a focus on usability, performance and clean design.",
      skills: [
        "React",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
      ],
      featured: "React + TypeScript",
      symbol: "</>",
      accent: "cyan",
    },
    {
      title: "Backend",
      number: "02",
      category: "SERVER & DATA",
      description:
        "Developing server-side functionality, building APIs and working with application data and backend services.",
      skills: ["Node.js", "Express.js", "MongoDB"],
      featured: "APIs & Databases",
      symbol: "{ }",
      accent: "violet",
    },
    {
      title: "Tools",
      number: "03",
      category: "DEVELOPER WORKFLOW",
      description:
        "Using development tools and version control to organize projects, manage code and streamline development.",
      skills: ["Git", "GitHub", "Vite", "VS Code"],
      featured: "Code & Collaboration",
      symbol: "⌘",
      accent: "blue",
    },
  ];

  const focusAreas = [
    "Responsive Design",
    "Component Architecture",
    "Clean Code",
  ];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="skills-premium relative isolate overflow-hidden border-t border-white/[0.07] bg-[#080b12] px-4 py-24 sm:px-6 sm:py-28 lg:px-8"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="skills-orb skills-orb-cyan absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[120px]" />

        <div className="skills-orb skills-orb-purple absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-500/[0.07] blur-[130px]" />

        <div className="skills-grid absolute inset-0" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div
          data-reveal
          className="skills-reveal mb-14 flex flex-col justify-between gap-7 md:mb-16 md:flex-row md:items-end"
        >
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-400" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Skills & Technologies
              </p>
            </div>

            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              Tools of my
              <br />

              <span className="skills-gradient-text">
                digital craft.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              The technologies and tools I use to turn ideas into functional,
              maintainable and engaging digital experiences.
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-2">
            <div className="flex -space-x-1.5">
              <span className="h-3 w-3 rounded-full border-2 border-[#080b12] bg-cyan-400" />
              <span className="h-3 w-3 rounded-full border-2 border-[#080b12] bg-violet-400" />
              <span className="h-3 w-3 rounded-full border-2 border-[#080b12] bg-blue-400" />
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-slate-500">
              My development stack
            </span>
          </div>
        </div>

        {/* Skill cards */}
        <div className="grid items-stretch gap-5 md:grid-cols-3">
          {skillGroups.map((group, index) => (
            <article
              key={group.title}
              data-reveal
              style={
                {
                  "--skills-delay": `${index * 130}ms`,
                } as React.CSSProperties
              }
              className={`skills-reveal skills-card skills-accent-${group.accent} group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-slate-900/45 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.17] hover:bg-slate-900/75 sm:p-7`}
            >
              {/* Card atmosphere */}
              <div className="skills-card-glow pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-transparent opacity-60" />

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.22em] text-slate-500">
                    CATEGORY / {group.number}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-100">
                    {group.title}
                  </h3>
                </div>

                <div className="skills-symbol flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.025] font-mono text-sm text-slate-300 transition-all duration-500 group-hover:rotate-[-6deg] group-hover:scale-105">
                  {group.symbol}
                </div>
              </div>

              <p className="relative mt-3 text-[9px] font-medium uppercase tracking-[0.19em] text-slate-500">
                {group.category}
              </p>

              <p className="relative mt-5 min-h-[84px] text-sm leading-7 text-slate-400">
                {group.description}
              </p>

              <div className="relative my-6 h-px bg-white/[0.08]">
                <div className="skills-divider h-px w-0 transition-all duration-700 group-hover:w-full" />
              </div>

              <div className="relative mb-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">
                  Technologies
                </span>

                <span className="rounded-full border border-white/[0.08] bg-black/10 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                  {String(group.skills.length).padStart(2, "0")} skills
                </span>
              </div>

              <div className="relative flex flex-wrap content-start gap-2">
                {group.skills.map((skill, skillIndex) => (
                  <span
                    key={skill}
                    style={
                      {
                        "--chip-delay": `${skillIndex * 45}ms`,
                      } as React.CSSProperties
                    }
                    className="skills-chip rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2 text-xs font-medium text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-cyan-400/[0.06] hover:text-cyan-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="relative mt-auto pt-8">
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                  <span className="text-[10px] text-slate-500">
                    Core focus
                  </span>

                  <span className="text-right text-xs font-medium text-slate-300 transition-colors duration-300 group-hover:text-white">
                    {group.featured}
                  </span>
                </div>
              </div>

              {/* Animated bottom accent */}
              <div className="skills-card-accent absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          ))}
        </div>

        {/* Current focus */}
        <div
          data-reveal
          className="skills-reveal skills-delay-summary mt-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02]"
        >
          <div className="grid gap-0 lg:grid-cols-[0.75fr_1.5fr]">
            <div className="border-b border-white/[0.08] p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Currently focused on
              </p>

              <h3 className="mt-2 text-lg font-medium text-white">
                Growing through practice.
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Learning, experimenting and improving through projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 p-5 sm:p-6">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-xs text-slate-300 transition-colors duration-300 hover:border-cyan-400/30 hover:text-cyan-200"
                >
                  <span className="mr-2 text-cyan-400">↗</span>
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Closing line */}
        <div
          data-reveal
          className="skills-reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs leading-6 text-slate-500">
            Skills grow with every project, every challenge, and every iteration.
          </p>

          <span className="font-mono text-[10px] tracking-[0.16em] text-slate-600">
            LEARN / BUILD / REPEAT
          </span>
        </div>
      </div>

      {/* Scoped animation styles */}
      <style>{`
        .skills-premium .skills-reveal {
          opacity: 0;
          transform: translate3d(0, 28px, 0);
          filter: blur(2px);
          transition:
            opacity 750ms ease,
            transform 750ms cubic-bezier(0.2, 0.7, 0.2, 1),
            filter 750ms ease;
        }

        .skills-premium .skills-reveal.skills-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
        }

        .skills-premium .skills-card {
          transition-delay: var(--skills-delay, 0ms);
        }

        .skills-premium .skills-delay-summary {
          transition-delay: 150ms;
        }

        .skills-gradient-text {
          display: inline-block;
          background: linear-gradient(
            105deg,
            #ffffff 0%,
            #a5f3fc 25%,
            #67e8f9 45%,
            #c4b5fd 72%,
            #ffffff 100%
          );
          background-size: 220% 100%;
          background-position: 0% 50%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: skills-gradient-flow 8s ease-in-out infinite alternate;
        }

        .skills-grid {
          background-image:
            linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
          -webkit-mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .skills-orb {
          animation: skills-drift 18s ease-in-out infinite alternate;
          will-change: transform;
        }

        .skills-orb-purple {
          animation-delay: -9s;
        }

        .skills-accent-cyan {
          --card-accent: 34, 211, 238;
        }

        .skills-accent-violet {
          --card-accent: 167, 139, 250;
        }

        .skills-accent-blue {
          --card-accent: 96, 165, 250;
        }

        .skills-card-glow {
          background: rgba(var(--card-accent), 0.16);
        }

        .skills-card:hover {
          border-color: rgba(var(--card-accent), 0.28);
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.16),
            0 0 32px rgba(var(--card-accent), 0.035);
        }

        .skills-card:hover .skills-symbol {
          border-color: rgba(var(--card-accent), 0.28);
          color: rgb(var(--card-accent));
        }

        .skills-card:hover .skills-divider {
          background: linear-gradient(
            90deg,
            rgba(var(--card-accent), 0.75),
            rgba(var(--card-accent), 0.04)
          );
        }

        .skills-card:hover .skills-card-accent {
          background: linear-gradient(
            90deg,
            rgb(var(--card-accent)),
            rgba(167,139,250,0.9),
            transparent
          );
        }

        @keyframes skills-gradient-flow {
          from {
            background-position: 0% 50%;
          }
          to {
            background-position: 100% 50%;
          }
        }

        @keyframes skills-drift {
          from {
            transform: translate3d(0, -12px, 0) scale(1);
          }
          to {
            transform: translate3d(24px, 22px, 0) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skills-premium .skills-reveal,
          .skills-premium .skills-reveal.skills-visible {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

          .skills-gradient-text,
          .skills-orb {
            animation: none;
          }

          .skills-premium .skills-card {
            transition-delay: 0ms;
          }

          .skills-premium .skills-delay-summary {
            transition-delay: 0ms;
          }
        }
      `}</style>
    </section>
  );
}

export default Skills;
