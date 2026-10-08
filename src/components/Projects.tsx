import { projects } from "../data/projects"

function Projects() {
  const visibleProjects = projects.filter(
    (project) =>
      project.title.toLowerCase() !== "student expense tracker"
  )

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-slate-800/80 bg-transparent px-6 py-20"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* =========================
            SECTION HEADING
        ========================== */}
        <div className="mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            {/* Small Label */}
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-7 bg-cyan-400" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
                Selected Work
              </p>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Projects that{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                speak for themselves.
              </span>
            </h2>
          </div>

          {/* Intro */}
          <p className="max-w-md text-sm leading-6 text-slate-400">
            A collection of projects built with a focus on clean
            interfaces, practical functionality and modern web
            technologies.
          </p>
        </div>

        {/* =========================
            PROJECTS
        ========================== */}
        <div className="space-y-6">
          {visibleProjects.map((project, index) => {
            const isFeatured = index === 0

            return (
              <article
                key={project.title}
                className={`group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/70 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 ${
                  isFeatured ? "min-h-[350px]" : "min-h-[300px]"
                }`}
              >
                {/* Top Gradient */}
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Background Number */}
                <div className="pointer-events-none absolute -right-2 -top-8 select-none text-[120px] font-black leading-none text-white/[0.025] transition-all duration-500 group-hover:text-cyan-400/[0.05]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="relative grid h-full lg:grid-cols-[1.2fr_0.8fr]">
                  {/* =========================
                      LEFT CONTENT
                  ========================== */}
                  <div className="flex flex-col justify-between p-7 sm:p-8 lg:p-10">
                    <div>
                      {/* Project Label */}
                      <div className="mb-5 flex items-center gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400">
                          {isFeatured
                            ? "Featured Project"
                            : `Project ${String(index + 1).padStart(
                                2,
                                "0"
                              )}`}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-600" />

                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                          Development
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3
                        className={`font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-100 ${
                          isFeatured
                            ? "text-2xl sm:text-3xl"
                            : "text-xl sm:text-2xl"
                        }`}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom Content */}
                    <div className="mt-7">
                      {/* Technologies */}
                      <div className="mb-6 flex flex-wrap gap-2">
                        {project.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-300"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>

                      {/* GitHub */}
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="group/button inline-flex items-center gap-2 rounded-full border border-slate-700 bg-white/[0.02] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        {/* GitHub Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
                        </svg>

                        <span>View Source</span>

                        <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                          ↗
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* =========================
                      RIGHT VISUAL
                  ========================== */}
                  <div className="relative hidden overflow-hidden border-l border-slate-800/70 lg:block">
                    {/* Grid */}
                    <div
                      className="absolute inset-0 opacity-25"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                      }}
                    />

                    {/* Glow */}
                    <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-700 group-hover:scale-150" />

                    {/* Code Window */}
                    <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-xl border border-slate-700/80 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 transition-all duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-1.5 border-b border-slate-800 pb-3">
                        <span className="h-2 w-2 rounded-full bg-red-400/70" />
                        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                        <span className="h-2 w-2 rounded-full bg-green-400/70" />

                        <span className="ml-auto text-[8px] uppercase tracking-widest text-slate-600">
                          project.tsx
                        </span>
                      </div>

                      {/* Code */}
                      <div className="space-y-2 font-mono text-[10px] leading-5">
                        <div>
                          <span className="text-purple-400">
                            const
                          </span>{" "}
                          <span className="text-cyan-300">
                            project
                          </span>{" "}
                          <span className="text-slate-500">
                            =
                          </span>{" "}
                          <span className="text-yellow-300">
                            {"{"}
                          </span>
                        </div>

                        <div className="pl-4">
                          <span className="text-slate-500">
                            name:
                          </span>{" "}
                          <span className="text-green-300">
                            "{project.title}"
                          </span>
                          <span className="text-slate-500">
                            ,
                          </span>
                        </div>

                        <div className="pl-4">
                          <span className="text-slate-500">
                            status:
                          </span>{" "}
                          <span className="text-cyan-300">
                            "completed"
                          </span>
                          <span className="text-slate-500">
                            ,
                          </span>
                        </div>

                        <div className="pl-4">
                          <span className="text-slate-500">
                            stack:
                          </span>{" "}
                          <span className="text-purple-300">
                            [
                          </span>
                        </div>

                        {project.technologies
                          .slice(0, 3)
                          .map((technology) => (
                            <div
                              key={technology}
                              className="pl-8 text-slate-400"
                            >
                              <span className="text-green-300">
                                "{technology}"
                              </span>
                              <span className="text-slate-600">
                                ,
                              </span>
                            </div>
                          ))}

                        <div className="pl-4">
                          <span className="text-purple-300">
                            ]
                          </span>
                        </div>

                        <div>
                          <span className="text-yellow-300">
                            {"}"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Case Study */}
                    <div className="absolute bottom-6 right-7 text-right">
                      <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-600">
                        Case Study
                      </div>

                      <div className="mt-1 text-xl font-black text-slate-700">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* =========================
            BOTTOM
        ========================== */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800/80 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            More projects are continuously being designed and developed.
          </p>

          <a
            href="https://github.com/divyanshusingh-dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 transition-colors duration-300 hover:text-white"
          >
            Explore GitHub
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects