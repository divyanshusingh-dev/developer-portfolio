function About() {
  return (
    <section
      id="about"
      className="border-t border-slate-800 bg-slate-950 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            About Me
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Who I am
          </h2>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* About Text */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 lg:col-span-2">
            <h3 className="text-2xl font-bold text-white">
              I'm a developer who enjoys building useful things.
            </h3>

            <p className="mt-5 leading-8 text-slate-400">
              I'm a BCA student and aspiring software developer interested in
              creating modern, responsive and user-friendly web applications.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              I enjoy learning new technologies, solving programming problems
              and turning ideas into practical digital experiences. My current
              focus is on frontend development with React, TypeScript and
              Tailwind CSS, along with backend technologies such as Node.js,
              Express.js and MongoDB.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              I believe in continuous learning and improving through hands-on
              projects and real-world development experience.
            </p>
          </div>

          {/* Quick Info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <h3 className="text-xl font-bold text-white">
              Quick Info
            </h3>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Role
                </p>
                <p className="mt-1 text-slate-200">
                  Jr. Software Developer
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Education
                </p>
                <p className="mt-1 text-slate-200">
                  BCA
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Focus
                </p>
                <p className="mt-1 text-slate-200">
                  Web Development
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Goal
                </p>
                <p className="mt-1 text-slate-200">
                  Software Development
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default About