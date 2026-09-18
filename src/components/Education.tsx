function Education() {
  const semesters = [
    {
      name: "First Semester",
      percentage: "87.2%",
      dmc: "/1st-semester-dmc.pdf",
      fileName: "1st-semester-dmc.pdf",
      available: true,
    },
    {
      name: "Second Semester",
      percentage: "89.5%",
      dmc: "/2nd-semester-dmc.pdf",
      fileName: "2nd-semester-dmc.pdf",
      available: true,
    },
    {
      name: "Third Semester",
      percentage: "N\A",
      dmc: "/3rd-semester-dmc.pdf",
      fileName: "3rd-semester-dmc.pdf",
      available: false,
    },
    {
      name: "Fourth Semester",
      percentage: "N\A",
      dmc: "",
      fileName: "",
      available: false,
    },
    {
      name: "Fifth Semester",
      percentage: "N\A",
      dmc: "",
      fileName: "",
      available: false,
    },
    {
      name: "Sixth Semester",
      percentage: "N\A",
      dmc: "",
      fileName: "",
      available: false,
    },
  ]

  return (
    <section
      id="education"
      className="w-full overflow-hidden border-t border-slate-800 bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">

        {/* Heading */}
        <div className="mb-10 sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-sm sm:tracking-[0.3em]">
            Education
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            My Education
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            My academic background, achievements and educational journey.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">

          {/* BCA */}
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 lg:p-7">

            {/* BCA Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 sm:text-sm">
                  Bachelor of Computer Applications
                </p>

                <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
                  Bachelor of Computer Applications (BCA)
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                  I. K. Gujral Punjab Technical University (IKGPTU)
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Swami Vivekanand Faculty of Technology and Management,
                  Ramnagar
                </p>
              </div>

              <span className="w-fit shrink-0 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                2024 – 27
              </span>

            </div>

            {/* Semesters */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {semesters.map((semester) => (
                <div
                  key={semester.name}
                  className={`min-w-0 rounded-xl border p-4 sm:p-5 ${
                    semester.available
                      ? "border-slate-800 bg-slate-950/70"
                      : "border-slate-800/60 bg-slate-950/40"
                  }`}
                >

                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-400">
                      {semester.name}
                    </p>

                    {!semester.available && (
                      <span className="shrink-0 rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-600 sm:text-xs">
                        Pending
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-2 text-2xl font-bold ${
                      semester.available
                        ? "text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {semester.percentage}
                  </p>

                  {semester.available ? (
                    <a
                      href={semester.dmc}
                      download={semester.fileName}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-3 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm"
                    >
                      Download DMC
                      <span>↓</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-600 sm:text-sm"
                    >
                      DMC Not Available
                    </button>
                  )}

                </div>
              ))}

            </div>

            {/* Average */}
            <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 sm:mt-6 sm:p-5">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Current Average Percentage
                  </p>

                  <p className="mt-1 text-xl font-bold text-cyan-400 sm:text-2xl">
                    88.0%
                  </p>
                </div>

                <p className="text-xs text-slate-500 sm:text-sm">
                  Based on completed semesters
                </p>

              </div>

            </div>

          </div>

          {/* 12th */}
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 lg:p-7">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 sm:text-sm">
                  Senior Secondary
                </p>

                <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl">
                  Senior Secondary (Class XII)
                </h3>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Central Board of Secondary Education (CBSE)
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                  UNS HR SEC SCH SHANKARGANJ MAHURPUR JAUNPUR UP
                </p>
              </div>

              <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">

                <span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                  2023
                </span>

                <span className="text-sm font-semibold text-cyan-400">
                  Percentage: 60.4%
                </span>

                <a
                  href="/12th-marksheet.pdf"
                  download="12th-marksheet.pdf"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Download Marksheet
                  <span>↓</span>
                </a>
                <a
                  href="/12th-Migration Certificate.pdf"
                  download="12th-Migration Certificate.pdf"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Migration Certificate
                  <span>↓</span>
                </a>

              </div>
            </div>

          </div>

          {/* 10th */}
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 lg:p-7">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 sm:text-sm">
                  Secondary
                </p>

                <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl">
                  Secondary (Class X)
                </h3>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Central Board of Secondary Education (CBSE)
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                  UNS HR SEC SCH SHANKARGANJ MAHURPUR JAUNPUR UP
                </p>
              </div>

              <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">

                <span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                  2021
                </span>

                <span className="text-sm font-semibold text-cyan-400">
                  Percentage: 70.4%
                </span>

                <a
                  href="/10th-marksheet.pdf"
                  download="10th-marksheet.pdf"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Download Marksheet
                  <span>↓</span>
                </a>
                <a
                  href="/10th-Migration Certificate.pdf"
                  download="10th-Migration Certificate.pdf"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950 sm:text-sm lg:w-auto"
                >
                  Migration Certificate
                  <span>↓</span>
                </a>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default Education