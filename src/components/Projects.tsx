
import { useEffect, useRef } from "react"
import { projects } from "../data/projects"

function Projects() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const items = section.querySelectorAll<HTMLElement>(".project-reveal")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      items.forEach((item) => item.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative isolate overflow-hidden border-t border-slate-800/70 bg-[#030817] px-5 py-20 sm:px-8 sm:py-24"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.13) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        aria-hidden="true"
        className="project-ambient pointer-events-none absolute left-1/4 top-20 -z-10 h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="project-ambient project-ambient-slow pointer-events-none absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-purple-500/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="project-reveal mb-14 flex flex-col justify-between gap-6 md:mb-16 lg:flex-row lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-300">
                Selected Work
              </span>
            </div>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Turning ideas into{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                digital experiences.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              A selection of projects showcasing my approach to development,
              interface design, and practical problem-solving.
            </p>
          </div>

          <a
            href="https://github.com/divyanshusingh-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/50 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            Explore GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Projects */}
        <div className="space-y-8">
          {projects.map((project, index) => {
            const number = String(index + 1).padStart(2, "0")
            const isFeatured = index === 0

            // Optional image support without requiring changes to
            // the existing project data type.
            const projectWithImage = project as typeof project & {
              image?: string
            }

            const previewImage = projectWithImage.image

            const previewLines = [
              { key: "name", value: project.title },
              { key: "status", value: "completed" },
              {
                key: "stack",
                value: project.technologies,
              },
            ]

            return (
              <article
                key={project.title}
                className={`project-reveal project-card group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#050b1d]/90 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-950/20 ${
                  isFeatured ? "project-card-featured border-cyan-400/30" : ""
                }`}
                style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
              >
                {/* Top gradient */}
                <div
                  aria-hidden="true"
                  className="project-gradient absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-70 transition-opacity group-hover:opacity-100"
                />

                <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
                  {/* Left: project information */}
                  <div className="relative flex min-w-0 flex-col justify-center p-6 sm:p-9 lg:p-12">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-5 top-2 select-none text-8xl font-black tracking-tighter text-white/[0.025] sm:right-8 sm:text-9xl"
                    >
                      {number}
                    </span>

                    <div className="relative mb-6 flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.23em] text-cyan-300">
                        {project.label || `Project ${number}`}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-slate-600" />

                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Development
                      </span>
                    </div>

                    <h3 className="relative max-w-xl break-words text-2xl font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-cyan-100 sm:text-3xl">
                      {project.title}
                    </h3>

                    <p className="mt-5 max-w-xl break-words text-sm leading-7 text-slate-400 sm:text-base">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mt-7">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Technologies
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3.5 py-2 text-[11px] font-semibold text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} source code on GitHub`}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-white/[0.02] px-5 py-3 text-xs font-bold text-white transition-all hover:border-cyan-400/50 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
                        </svg>
                        View Source
                        <span aria-hidden="true">↗</span>
                      </a>

                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} live demo`}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-xs font-bold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400"
                        >
                          Live Demo <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right: real screenshot + code editor */}
                  <div className="relative flex min-w-0 flex-col justify-center gap-5 overflow-hidden border-t border-slate-800/80 bg-[#070d20]/80 p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-8">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.12]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />

                    {/* Website screenshot */}
                    <div className="project-preview relative overflow-hidden rounded-xl border border-slate-700/80 bg-[#020617] shadow-xl transition-transform duration-500 group-hover:scale-[1.01]">
                      <div className="flex h-10 items-center justify-between border-b border-slate-800 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                        </div>

                        <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-500">
                          Website Preview
                        </span>
                      </div>

                      {previewImage ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title} website preview`}
                          className="block"
                        >
                          <img
                            src={previewImage}
                            alt={`${project.title} website screenshot`}
                            loading="lazy"
                            className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                          />
                        </a>
                      ) : (
                        <div className="flex aspect-[16/10] flex-col justify-between p-5 sm:p-7">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                              Project Preview
                            </p>

                            <h4 className="mt-4 break-words text-xl font-bold text-white sm:text-2xl">
                              {project.title}
                            </h4>

                            <p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-400">
                              {project.description}
                            </p>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-cyan-400/20 bg-cyan-400/[0.05] px-2.5 py-1.5 text-[10px] text-cyan-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Code editor panel */}
                    <div className="project-editor relative overflow-hidden rounded-xl border border-slate-700/80 bg-[#030817] shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>

                        <span className="text-[9px] uppercase tracking-[0.15em] text-slate-500">
                          project.tsx
                        </span>
                      </div>

                      <div className="space-y-3 overflow-hidden p-4 font-mono text-[10px] leading-5 sm:p-5 sm:text-[11px]">
                        <p>
                          <span className="text-purple-400">const</span>{" "}
                          <span className="text-cyan-300">project</span>{" "}
                          <span className="text-slate-400">= {"{"}</span>
                        </p>

                        {previewLines.map((line) => (
                          <div key={line.key} className="pl-4">
                            <span className="text-slate-400">
                              {line.key}:{" "}
                            </span>

                            {Array.isArray(line.value) ? (
                              <div className="pl-3">
                                <span className="text-purple-300">[</span>

                                {line.value.slice(0, 4).map((tech) => (
                                  <div key={tech} className="pl-3">
                                    <span className="text-emerald-300">
                                      "{tech}"
                                    </span>
                                    <span className="text-slate-500">,</span>
                                  </div>
                                ))}

                                {line.value.length > 4 && (
                                  <div className="pl-3 text-slate-500">
                                    ...more
                                  </div>
                                )}

                                <span className="text-purple-300">]</span>
                              </div>
                            ) : (
                              <span className="break-words text-emerald-300">
                                "{line.value}"
                              </span>
                            )}

                            <span className="text-slate-500">,</span>
                          </div>
                        ))}

                        <p className="text-amber-300">{"}"}</p>
                      </div>
                    </div>

                    {/* Case study number */}
                    <div className="relative flex items-center justify-between border-t border-slate-800/70 pt-4">
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                        Case Study
                      </span>

                      <span className="font-mono text-xl font-black text-slate-600/70">
                        {number}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Footer */}
        <div className="project-reveal mt-12 flex flex-col gap-4 border-t border-slate-800/80 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-slate-500">
            Continuously learning, creating, and building better digital
            experiences.
          </p>

          <a
            href="https://github.com/divyanshusingh-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-cyan-400 transition hover:text-white"
          >
            More on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects
