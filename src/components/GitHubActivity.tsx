
import { useEffect, useState } from "react";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

const GITHUB_USERNAME = "divyanshusingh-dev";

export default function GitHubActivity() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRepos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load GitHub repositories.");
        }

        const data: GitHubRepo[] = await response.json();
        setRepos(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchRepos();

    return () => controller.abort();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  return (
    <section
      id="github-activity"
      className="relative overflow-hidden bg-[#020617] px-5 py-16 text-white sm:px-8 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.09),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(147,51,234,0.08),transparent_45%)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-400">
              Open Source &amp; Activity
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              GitHub Activity
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Explore my recent public repositories, projects and development
              work.
            </p>
          </div>

          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-cyan-500/30 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-400/10"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="6" r="2.5" />
              <circle cx="18" cy="18" r="2.5" />
              <path d="M8.5 11 15.5 7 M8.5 13 15.5 17" />
            </svg>
            Visit GitHub
            <ExternalLinkIcon />
          </a>
        </div>

        {loading && (
          <p className="py-8 text-sm text-slate-400">
            Loading GitHub repositories...
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-slate-300">
            {error}{" "}
            <a
              href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline"
            >
              View repositories on GitHub
            </a>
          </div>
        )}

        {!loading && !error && (
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <article
                key={repo.id}
                className="min-w-0 max-w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition duration-300 hover:border-cyan-500/40 hover:bg-slate-900/90"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <h3 className="min-w-0 flex-1 [overflow-wrap:anywhere] text-base font-bold leading-6 text-slate-100">
                    {repo.name}
                  </h3>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${repo.name} on GitHub`}
                    title="Open repository"
                    className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <ExternalLinkIcon />
                  </a>
                </div>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400 [overflow-wrap:anywhere]">
                  {repo.description || "Explore this project on GitHub."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
                  {repo.language && (
                    <span className="rounded-full border border-slate-700 px-2.5 py-1 text-slate-300">
                      {repo.language}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1">
                    <StarIcon />
                    {repo.stargazers_count}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <ForkIcon />
                    {repo.forks_count}
                  </span>

                  <span className="ml-auto">
                    Updated {formatDate(repo.updated_at)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-100">
            Contribution activity
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Visit GitHub to view my current contribution calendar.
          </p>

          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            View contribution calendar
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="5" r="2" />
      <circle cx="12" cy="19" r="2" />
      <path d="M6 7v2a4 4 0 0 0 4 4h2m0 0a4 4 0 0 0 4-4V7m-4 6v4" />
    </svg>
  );
}
