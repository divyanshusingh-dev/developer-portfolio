import { projects } from "../data/projects"

function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-slate-800 bg-transparent px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Projects
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Things I've built
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            A selection of projects that showcase my development skills,
            creativity and problem-solving approach.
          </p>
        </div>

        {/* Projects */}
        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Gradient Line */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

              {/* Number */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wider text-slate-500">
                  PROJECT {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-2xl text-slate-700 transition duration-300 group-hover:text-cyan-400">
                  ↗
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-7 text-2xl font-bold text-white transition duration-300 group-hover:text-cyan-400">
                {project.title}
              </h3>

              {/* Description */}
              <p className="mt-4 flex-1 leading-7 text-slate-400">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mt-7 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 transition duration-300 hover:border-cyan-400/50 hover:text-cyan-400"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              {/* GitHub */}
              <div className="mt-8">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/5 hover:text-cyan-400"
                >
                  View on GitHub

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects