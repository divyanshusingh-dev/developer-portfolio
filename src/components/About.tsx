
import { useEffect, useRef, useState } from "react";

function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [pointer, setPointer] = useState({ x: 50, y: 35 });
  const [spotlightEnabled, setSpotlightEnabled] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll<HTMLElement>("[data-reveal]");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add("is-visible");
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!mediaQuery.matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();

      setPointer({
        x: ((event.clientX - bounds.left) / bounds.width) * 100,
        y: ((event.clientY - bounds.top) / bounds.height) * 100,
      });
    };

    const handlePointerEnter = () => setSpotlightEnabled(true);
    const handlePointerLeave = () => setSpotlightEnabled(false);

    section.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    section.addEventListener("pointerenter", handlePointerEnter);
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerenter", handlePointerEnter);
      section.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const technologies = [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "MongoDB",
  ];

  const details = [
    {
      label: "Education",
      value: "Bachelor of Computer Applications",
      number: "01",
    },
    {
      label: "Specialization",
      value: "Web Development",
      number: "02",
    },
    {
      label: "Currently Learning",
      value: "Modern Application Development",
      number: "03",
    },
    {
      label: "Career Goal",
      value: "Software Development",
      number: "04",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-premium relative isolate overflow-hidden border-t border-white/[0.07] bg-[#080b12] px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
    >
      {/* Dynamic background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="about-orb about-orb-cyan absolute -left-48 top-10 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.07] blur-[120px]" />

        <div className="about-orb about-orb-purple absolute -right-48 top-[35%] h-[460px] w-[460px] rounded-full bg-violet-600/[0.075] blur-[140px]" />

        <div className="about-grid absolute inset-0 opacity-30" />

        <div
          className="about-spotlight absolute inset-0"
          style={{
            background: spotlightEnabled
              ? `radial-gradient(480px circle at ${pointer.x}% ${pointer.y}%, rgba(34,211,238,0.075), transparent 65%)`
              : "radial-gradient(480px circle at 50% 35%, rgba(34,211,238,0.025), transparent 65%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Hero heading */}
        <div
          data-reveal
          className="about-reveal mb-16 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end"
        >
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="about-heading-line h-px w-8 bg-cyan-400" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                A little introduction
              </span>

              <span className="about-status-dot h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </div>

            <h2 className="text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">
              Beyond the
              <br />

              <span className="about-gradient-text">
                code &amp; pixels.
              </span>
            </h2>
          </div>

          <div className="max-w-xs md:pb-2">
            <p className="text-sm leading-7 text-slate-400 sm:text-base">
              A curious mind, a growing skill set, and a passion for creating
              digital experiences that make a difference.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Introduction / 001
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.8fr] lg:gap-20">
          {/* Story */}
          <div data-reveal className="about-reveal about-delay-1">
            <div className="mb-8 flex items-center justify-between border-b border-white/[0.09] pb-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                My Story
              </span>

              <span className="font-mono text-xs text-slate-600">
                01 — 02
              </span>
            </div>

            <h3 className="max-w-2xl text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
              I enjoy building things that bring{" "}
              <span className="about-muted-text">ideas to life.</span>
            </h3>

            <div className="mt-7 max-w-2xl space-y-5 text-sm leading-8 text-slate-400 sm:text-[15px]">
              <p>
                I'm a BCA student and aspiring software developer interested
                in creating modern, responsive, and user-friendly web
                applications. I enjoy exploring how technology and thoughtful
                design come together to solve real problems.
              </p>

              <p>
                My current development stack includes React, TypeScript, and
                Tailwind CSS on the frontend, along with Node.js, Express.js,
                and MongoDB for backend development. I strengthen my skills
                through hands-on projects, experimentation, and continuous
                learning.
              </p>

              <p>
                For me, every project is an opportunity to improve — whether
                that means writing cleaner code, refining the user experience,
                or learning a better way to solve a problem. I'm working
                towards becoming a capable software developer by building
                practical solutions and learning from experience.
              </p>
            </div>

            {/* Technology collection */}
            <div className="mt-10">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Technologies I work with
              </p>

              <div className="flex flex-wrap gap-2">
                {technologies.map((technology, index) => (
                  <span
                    key={technology}
                    style={{ "--tag-index": index } as React.CSSProperties}
                    className="about-tech rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-xs text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/[0.07] hover:text-cyan-200"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            {/* Personal principle */}
            <div className="about-principle mt-12 flex items-start gap-4 border-l-2 border-cyan-400/50 pl-5 transition-colors duration-300 hover:border-violet-400">
              <div>
                <p className="text-sm font-medium text-white">
                  Learn with curiosity. Build with purpose.
                </p>

                <p className="mt-1 text-xs leading-6 text-slate-500">
                  Progress comes from the things you create and the lessons
                  you learn along the way.
                </p>
              </div>
            </div>
          </div>

          {/* Profile details */}
          <aside data-reveal className="about-reveal about-delay-2">
            <div className="flex h-full flex-col border-t border-white/[0.12] pt-6">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    The essentials
                  </p>

                  <h3 className="mt-2 text-2xl font-medium tracking-tight text-white">
                    At a glance.
                  </h3>
                </div>

                <span className="font-mono text-xs text-slate-600">
                  02 / 02
                </span>
              </div>

              <div className="divide-y divide-white/[0.08]">
                {details.map((detail) => (
                  <div
                    key={detail.number}
                    className="about-detail group grid grid-cols-[36px_1fr] gap-3 py-6 transition-all duration-300 first:pt-2 hover:translate-x-1"
                  >
                    <span className="pt-1 font-mono text-[10px] text-slate-600 transition-colors duration-300 group-hover:text-cyan-300">
                      {detail.number}
                    </span>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                        {detail.label}
                      </p>

                      <p className="mt-2 text-sm font-medium leading-6 text-slate-200 transition-colors duration-300 group-hover:text-white">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Philosophy panel */}
              <div className="about-philosophy relative mt-7 overflow-hidden border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-500 hover:border-cyan-400/25 hover:bg-white/[0.035] sm:p-6">
                <div className="about-line absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-cyan-400 to-violet-400" />

                <div className="about-corner absolute right-0 top-0 h-16 w-16 border-r border-t border-violet-400/20" />

                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                  The mindset
                </p>

                <p className="mt-4 text-lg font-medium leading-7 tracking-tight text-white">
                  Small details.
                  <br />
                  Thoughtful solutions.
                  <br />

                  <span className="about-gradient-text">
                    Continuous growth.
                  </span>
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <span className="h-1 w-7 rounded-full bg-cyan-400" />
                  <span className="h-1 w-3 rounded-full bg-violet-400/60" />
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom information strip */}
        <div
          data-reveal
          className="about-reveal about-delay-3 mt-20 border-y border-white/[0.09] py-7 sm:mt-24 sm:py-8"
        >
          <div className="grid gap-7 sm:grid-cols-3 sm:gap-5">
            <div className="about-bottom-item group">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                My approach
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200 transition-colors duration-300 group-hover:text-cyan-200">
                Understand <span className="text-cyan-400">→</span> Create{" "}
                <span className="text-cyan-400">→</span> Refine
              </p>
            </div>

            <div className="about-bottom-item group sm:border-l sm:border-white/[0.08] sm:pl-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                My focus
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200 transition-colors duration-300 group-hover:text-cyan-200">
                Modern Web Applications
              </p>
            </div>

            <div className="about-bottom-item group sm:border-l sm:border-white/[0.08] sm:pl-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                My direction
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200 transition-colors duration-300 group-hover:text-cyan-200">
                Learn. Build. Evolve.
              </p>
            </div>
          </div>
        </div>

        {/* Closing signature */}
        <div
          data-reveal
          className="about-reveal mt-8 flex items-center justify-between gap-4"
        >
          <p className="text-xs leading-6 text-slate-500">
            Every project is another step forward.
          </p>

          <span className="font-mono text-[9px] tracking-[0.16em] text-slate-600 sm:text-[10px]">
            DESIGNED TO EVOLVE
          </span>
        </div>
      </div>

      {/* Scoped animation styles */}
      <style>{`
        .about-premium .about-reveal {
          opacity: 0;
          transform: translate3d(0, 30px, 0);
          filter: blur(3px);
          transition:
            opacity 800ms ease,
            transform 800ms cubic-bezier(0.2, 0.7, 0.2, 1),
            filter 800ms ease;
        }

        .about-premium .about-reveal.is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
        }

        .about-premium .about-delay-1 {
          transition-delay: 100ms;
        }

        .about-premium .about-delay-2 {
          transition-delay: 220ms;
        }

        .about-premium .about-delay-3 {
          transition-delay: 320ms;
        }

        .about-gradient-text {
          display: inline-block;
          background: linear-gradient(
            105deg,
            #ffffff 0%,
            #a5f3fc 24%,
            #67e8f9 42%,
            #c4b5fd 67%,
            #ffffff 85%,
            #a5f3fc 100%
          );
          background-size: 250% 100%;
          background-position: 0% 50%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: about-gradient-flow 9s ease-in-out infinite alternate;
        }

        .about-grid {
          background-image:
            linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
          -webkit-mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        .about-spotlight {
          transition: background 180ms ease-out;
        }

        .about-orb {
          animation: about-drift 18s ease-in-out infinite alternate;
          will-change: transform;
        }

        .about-orb-purple {
          animation-delay: -9s;
        }

        .about-heading-line {
          transform-origin: left;
          animation: about-line-grow 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        .about-status-dot {
          animation: about-status-pulse 2.5s ease-in-out infinite;
        }

        .about-line {
          transform-origin: left;
          animation: about-line-shift 4s ease-in-out infinite alternate;
        }

        .about-tech {
          animation: about-tag-enter 650ms backwards;
          animation-delay: calc(var(--tag-index, 0) * 65ms + 250ms);
        }

        .about-tech:hover {
          box-shadow: 0 5px 22px rgba(34,211,238,0.07);
        }

        .about-principle:hover {
          background: linear-gradient(
            90deg,
            rgba(34,211,238,0.035),
            transparent
          );
        }

        .about-philosophy:hover .about-corner {
          border-color: rgba(34,211,238,0.4);
        }

        .about-corner {
          transition: border-color 400ms ease;
        }

        @keyframes about-gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes about-drift {
          0% {
            transform: translate3d(0, -12px, 0) scale(1);
          }
          50% {
            transform: translate3d(18px, 12px, 0) scale(1.045);
          }
          100% {
            transform: translate3d(28px, 24px, 0) scale(1.09);
          }
        }

        @keyframes about-line-grow {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes about-status-pulse {
          0%, 100% {
            opacity: 0.45;
            box-shadow: 0 0 0 0 rgba(34,211,238,0);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 12px 3px rgba(34,211,238,0.16);
          }
        }

        @keyframes about-line-shift {
          from {
            transform: scaleX(0.55);
            opacity: 0.5;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes about-tag-enter {
          from {
            opacity: 0;
            transform: translateY(7px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (hover: none) {
          .about-tech {
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-premium .about-reveal,
          .about-premium .about-reveal.is-visible {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

          .about-premium .about-orb,
          .about-premium .about-gradient-text,
          .about-premium .about-heading-line,
          .about-premium .about-status-dot,
          .about-premium .about-line,
          .about-premium .about-tech {
            animation: none;
          }

          .about-premium .about-delay-1,
          .about-premium .about-delay-2,
          .about-premium .about-delay-3 {
            transition-delay: 0ms;
          }
        }
      `}</style>
    </section>
  );
}

export default About;
