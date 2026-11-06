
import { useEffect, useRef, useState } from "react";

function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const responsibilities = [
    {
      number: "01",
      title: "Creative Design",
      description:
        "Designed engaging social media posts, event posters, banners, and promotional materials for institutional campaigns.",
    },
    {
      number: "02",
      title: "Visual Branding",
      description:
        "Created consistent branding assets with attention to typography, color combinations, composition, and visual identity.",
    },
    {
      number: "03",
      title: "Team Collaboration",
      description:
        "Worked with team members to understand creative requirements and transform ideas into impactful visual content.",
    },
    {
      number: "04",
      title: "Content Production",
      description:
        "Managed multiple creative projects and delivered quality visual assets while maintaining deadlines and design standards.",
    },
  ];

  const tools = [
    "Adobe Photoshop",
    "Canva",
    "Graphic Design",
    "Social Media Creatives",
    "Visual Branding",
  ];

  const highlights = [
    {
      number: "01",
      label: "Experience",
      value: "2+ Years",
      detail: "Professional Design",
    },
    {
      number: "02",
      label: "Creative Tools",
      value: "Photoshop & Canva",
      detail: "Design & Production",
    },
    {
      number: "03",
      label: "Core Expertise",
      value: "Visual Design",
      detail: "Branding & Communication",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative isolate overflow-hidden border-t border-slate-800/80 bg-slate-950 px-5 py-24 sm:px-6 lg:py-28"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-48 top-20 -z-10 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[130px]" />

      <div className="pointer-events-none absolute -right-48 bottom-0 -z-10 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-[130px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div
          className={`mb-16 max-w-3xl transition-all duration-700 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              My Career Journey
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Where I've Worked
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-400 sm:text-base">
            Every experience is an opportunity to learn, create, and grow.
            Here's a look at my professional journey and the creative work
            I've been part of.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Vertical Line */}
          <div className="absolute bottom-0 left-[19px] top-0 hidden w-px bg-gradient-to-b from-cyan-400/80 via-cyan-400/20 to-transparent sm:block" />

          {/* Timeline Item */}
          <div
            className={`relative transition-all duration-1000 sm:pl-16 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            {/* Timeline Marker */}
            <div className="absolute left-[9px] top-9 hidden h-[22px] w-[22px] items-center justify-center rounded-full border border-cyan-400/50 bg-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.25)] sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            </div>

            {/* Main Experience Card */}
            <article className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_25px_80px_rgba(34,211,238,0.06)]">
              {/* Top Gradient */}
              <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Card Header */}
              <div className="p-6 sm:p-9 lg:p-10">
                <div className="flex flex-col justify-between gap-7 md:flex-row md:items-start">
                  <div className="flex gap-5">
                    {/* Company Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-7 w-7 text-cyan-400"
                        aria-hidden="true"
                      >
                        <rect x="3" y="7" width="18" height="14" rx="2" />

                        <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
                      </svg>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                        Professional Experience
                      </p>

                      <h4 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                        Graphic Designer
                      </h4>

                      <p className="mt-3 text-sm font-semibold text-slate-300 sm:text-base">
                        Swami Vivekanand Group of Institutes
                      </p>

                      <p className="mt-1 text-xs tracking-wide text-slate-500">
                        SVGOI
                      </p>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Professional Role
                    </span>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-3.5 py-2 text-xs font-semibold text-cyan-300">
                      2+ Years Experience
                    </span>
                  </div>
                </div>

                {/* Decorative Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-cyan-400/30 via-slate-700/70 to-transparent" />

                {/* Responsibilities */}
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    <h4 className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.17em] text-slate-300">
                      What I Do
                    </h4>

                    <div className="h-px flex-1 bg-slate-800" />
                  </div>

                  <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                    {responsibilities.map((item, index) => (
                      <div
                        key={item.number}
                        className="group/item flex gap-4"
                        style={{
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-[10px] font-bold text-cyan-400 transition-all duration-300 group-hover/item:border-cyan-400/30 group-hover/item:bg-cyan-400/10">
                          {item.number}
                        </div>

                        <div>
                          <h5 className="mb-2 text-sm font-bold text-slate-200 transition-colors group-hover/item:text-cyan-300">
                            {item.title}
                          </h5>

                          <p className="text-xs leading-7 text-slate-400 sm:text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools Section */}
                <div className="mt-9 border-t border-slate-800 pt-7">
                  <div className="mb-4 flex items-center gap-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Tools & Technologies
                    </h4>

                    <div className="h-px flex-1 bg-slate-800" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-lg border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-[11px] font-medium text-slate-400 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex flex-col gap-2 border-t border-slate-800 bg-slate-950/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-9">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Focused on Creativity & Quality
                </span>

                <span className="text-xs font-semibold text-cyan-400">
                  Design · Branding · Visual Communication
                </span>
              </div>
            </article>
          </div>
        </div>

        {/* Career Highlights */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 delay-300 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          {highlights.map((item) => (
            <div
              key={item.number}
              className="group relative isolate overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/70"
            >
              {/* Decorative Number - FIXED */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-2 z-0 select-none text-5xl font-black leading-none text-cyan-400/[0.07] transition-colors duration-300 group-hover:text-cyan-400/[0.12] sm:right-4 sm:top-3 sm:text-6xl"
              >
                {item.number}
              </span>

              {/* Card Content */}
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </p>

                <h4 className="mt-4 text-lg font-medium text-white transition-colors group-hover:text-cyan-300">
                  {item.value}
                </h4>

                <p className="mt-2 text-xs text-slate-500">
                  {item.detail}
                </p>

                <div className="mt-5 h-px w-10 bg-cyan-400/50 transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
