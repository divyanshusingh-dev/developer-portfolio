
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork?: boolean;
};

type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

const GITHUB_USERNAME = "divyanshusingh-dev";
const GITHUB_API = "https://api.github.com";
const MAX_VISIBLE_REPOS = 6;

async function fetchGitHubJson<T>(
  url: string,
  signal: AbortSignal
): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error(
        "GitHub API rate limit reached. Please try again shortly."
      );
    }

    if (response.status === 404) {
      throw new Error("The requested GitHub profile was not found.");
    }

    throw new Error(
      `Unable to load GitHub data (${response.status}).`
    );
  }

  return response.json() as Promise<T>;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
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

function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.23-5.06-5.49 0-1.21.43-2.2 1.15-2.97-.12-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.53.23 2.66.12 2.94.71.77 1.14 1.76 1.14 2.97 0 4.27-2.6 5.2-5.08 5.48.4.35.75 1.02.75 2.06v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
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

function CodeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m14 4-4 16" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  );
}

function GitHubActivity() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [contributionFailed, setContributionFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Scroll-triggered reveal animation.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const elements =
      section.querySelectorAll<HTMLElement>("[data-reveal]");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("gh-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("gh-visible");
            observer.unobserve(entry.target);
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
  }, [loading, error, repos.length]);

  // Fetch public repositories and profile statistics.
  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHubData() {
      setLoading(true);
      setError("");

      try {
        const [reposResult, profileResult] = await Promise.allSettled([
          fetchGitHubJson<GitHubRepo[]>(
            `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
            controller.signal
          ),
          fetchGitHubJson<GitHubProfile>(
            `${GITHUB_API}/users/${GITHUB_USERNAME}`,
            controller.signal
          ),
        ]);

        if (controller.signal.aborted) return;

        if (reposResult.status === "rejected") {
          throw reposResult.reason instanceof Error
            ? reposResult.reason
            : new Error("Unable to load GitHub repositories.");
        }

        setRepos(reposResult.value);

        if (profileResult.status === "fulfilled") {
          setProfile(profileResult.value);
        } else {
          // Repositories can still be displayed if profile stats fail.
          setProfile(null);
        }
      } catch (err) {
        if (
          !controller.signal.aborted &&
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError(err.message);
        } else if (
          !controller.signal.aborted
        ) {
          setError("Unable to load GitHub data. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadGitHubData();

    return () => controller.abort();
  }, [retryKey]);

  const languages = useMemo(() => {
    const uniqueLanguages = Array.from(
      new Set(
        repos
          .map((repo) => repo.language)
          .filter((language): language is string => Boolean(language))
      )
    ).sort((a, b) => a.localeCompare(b));

    if (repos.some((repo) => !repo.language)) {
      uniqueLanguages.push("Other");
    }

    return uniqueLanguages;
  }, [repos]);

  const filteredRepos = useMemo(() => {
    if (selectedLanguage === "All") return repos;

    if (selectedLanguage === "Other") {
      return repos.filter((repo) => !repo.language);
    }

    return repos.filter(
      (repo) => repo.language === selectedLanguage
    );
  }, [repos, selectedLanguage]);

  const visibleRepos = filteredRepos.slice(0, MAX_VISIBLE_REPOS);

  const totalStars = useMemo(
    () => repos.reduce((total, repo) => total + repo.stargazers_count, 0),
    [repos]
  );

  const spotlight = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();

    element.style.setProperty(
      "--pointer-x",
      `${event.clientX - bounds.left}px`
    );
    element.style.setProperty(
      "--pointer-y",
      `${event.clientY - bounds.top}px`
    );
  };

  const resetSpotlight = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    event.currentTarget.style.setProperty("--pointer-x", "50%");
    event.currentTarget.style.setProperty("--pointer-y", "50%");
  };

  const profileUrl = `https://github.com/${GITHUB_USERNAME}`;
  const repositoriesUrl = `${profileUrl}?tab=repositories`;
  const contributionsUrl = `${profileUrl}?tab=overview`;

  const stats = [
    {
      label: "Public repositories",
      value: profile ? formatNumber(profile.public_repos) : "—",
      detail: "Projects shared publicly",
      icon: <CodeIcon />,
      accent: "cyan",
    },
    {
      label: "Followers",
      value: profile ? formatNumber(profile.followers) : "—",
      detail: "Developer community",
      icon: <GitHubIcon />,
      accent: "purple",
    },
    {
      label: "Stars earned",
      value: formatNumber(totalStars),
      detail: "Across fetched repositories",
      icon: <StarIcon />,
      accent: "amber",
    },
    {
      label: "Following",
      value: profile ? formatNumber(profile.following) : "—",
      detail: "Developer connections",
      icon: <ActivityIcon />,
      accent: "blue",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="github-activity"
      aria-labelledby="github-heading"
      className="gh-premium relative isolate overflow-hidden bg-[#020617] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-10"
    >
      {/* Ambient background effects */}
      <div
        aria-hidden="true"
        className="gh-grid pointer-events-none absolute inset-0"
      />

      <div
        aria-hidden="true"
        className="gh-orb gh-orb-one pointer-events-none absolute"
      />

      <div
        aria-hidden="true"
        className="gh-orb gh-orb-two pointer-events-none absolute"
      />

      <div
        aria-hidden="true"
        className="gh-orb gh-orb-three pointer-events-none absolute"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Hero heading */}
        <div
          data-reveal
          className="gh-reveal mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div className="min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3.5 py-2">
              <span
                aria-hidden="true"
                className="gh-status-dot h-2 w-2 rounded-full bg-emerald-400"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200 sm:text-xs">
                Open Source · Developer Activity
              </span>
            </div>

            <h2
              id="github-heading"
              className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Code in progress.
              <br />
              <span className="gh-gradient-text">
                Ideas in motion.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              Explore my recent projects, technologies, and public
              development work. Every repository is a step forward
              in building, learning, and experimenting.
            </p>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gh-primary-button inline-flex w-fit items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-bold text-white"
          >
            <GitHubIcon />
            Visit my GitHub
            <ExternalLinkIcon />
          </a>
        </div>

        {/* Profile identity panel */}
        <div
          data-reveal
          className="gh-reveal gh-profile-panel mb-6 overflow-hidden rounded-3xl border border-white/[0.09] p-5 sm:p-7"
          onPointerMove={spotlight}
          onPointerLeave={resetSpotlight}
        >
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="gh-avatar-frame shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={`${profile.login}'s GitHub avatar`}
                    className="h-full w-full rounded-2xl object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-800">
                    <GitHubIcon className="h-9 w-9 text-cyan-300" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Developer profile
                </p>

                <h3 className="break-words text-xl font-bold text-white sm:text-2xl">
                  {profile?.name || GITHUB_USERNAME}
                </h3>

                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm text-cyan-300 transition-colors hover:text-cyan-200"
                >
                  @{GITHUB_USERNAME}
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Account since
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-200">
                  {profile ? formatDate(profile.created_at) : "—"}
                </p>
              </div>

              <a
                href={repositoriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gh-outline-button inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
              >
                Repositories
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div
          data-reveal
          className="gh-reveal mb-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              className={`gh-stat-card gh-accent-${stat.accent} rounded-2xl border border-white/[0.08] p-4 sm:p-5`}
              style={
                { "--gh-delay": `${index * 90}ms` } as CSSProperties
              }
            >
              <div className="mb-5 flex items-center justify-between gap-2">
                <span className="text-xs font-medium leading-5 text-slate-400 sm:text-sm">
                  {stat.label}
                </span>

                <span className="gh-stat-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  {stat.icon}
                </span>
              </div>

              <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {stat.value}
              </p>

              <p className="mt-2 text-[11px] leading-5 text-slate-500 sm:text-xs">
                {stat.detail}
              </p>
            </article>
          ))}
        </div>

        {/* Repository showcase */}
        <div
          data-reveal
          className="gh-reveal mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-400 sm:text-xs">
              Selected from public repositories
            </p>

            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              The workbench<span className="text-cyan-400">.</span>
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Recently updated projects, pulled directly from GitHub.
            </p>
          </div>

          {!loading && !error && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              {repos.length} repositories loaded
            </span>
          )}
        </div>

        {/* Language filters */}
        {!loading && !error && languages.length > 0 && (
          <div
            data-reveal
            className="gh-reveal mb-7"
          >
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter repositories by programming language"
            >
              {["All", ...languages].map((language) => {
                const active = selectedLanguage === language;

                return (
                  <button
                    key={language}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedLanguage(language)}
                    className={`gh-filter-chip rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] ${
                      active
                        ? "gh-filter-active border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
                        : "border-white/[0.09] bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {language}
                    {language === "All" && (
                      <span className="ml-2 opacity-70">
                        {repos.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Loading GitHub repositories"
            aria-busy="true"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="gh-skeleton-card rounded-2xl border border-white/[0.07] p-5"
              >
                <div className="gh-skeleton mb-5 h-4 w-2/3 rounded" />
                <div className="gh-skeleton mb-3 h-3 w-full rounded" />
                <div className="gh-skeleton mb-8 h-3 w-4/5 rounded" />
                <div className="gh-skeleton h-7 w-full rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-500/[0.05] p-6 sm:p-8"
          >
            <p className="font-semibold text-slate-100">
              GitHub data could not be loaded
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setRetryKey((key) => key + 1)}
                className="gh-primary-button rounded-xl px-4 py-3 text-sm font-semibold text-white"
              >
                Try again
              </button>

              <a
                href={repositoriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gh-outline-button inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
              >
                View repositories
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        )}

        {/* Repository cards */}
        {!loading && !error && (
          <>
            {filteredRepos.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 text-center">
                <CodeIcon />
                <p className="mt-3 font-semibold text-slate-200">
                  No repositories found for this filter
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try another programming language.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage("All")}
                  className="mt-4 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Show all repositories
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p
                    className="text-xs text-slate-500"
                    aria-live="polite"
                  >
                    Showing {visibleRepos.length} of {filteredRepos.length}
                    {" "}matching repositories
                  </p>

                  {filteredRepos.length > MAX_VISIBLE_REPOS && (
                    <a
                      href={
                        selectedLanguage === "All"
                          ? repositoriesUrl
                          : `${repositoriesUrl}&language=${encodeURIComponent(selectedLanguage)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      View all on GitHub
                      <ExternalLinkIcon />
                    </a>
                  )}
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleRepos.map((repo, index) => (
                    <article
                      key={repo.id}
                      data-reveal
                      onPointerMove={spotlight}
                      onPointerLeave={resetSpotlight}
                      className="gh-reveal gh-repo-card group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080f21]/85 p-5 sm:p-6"
                      style={
                        {
                          "--gh-delay": `${index * 85}ms`,
                        } as CSSProperties
                      }
                    >
                      <div
                        aria-hidden="true"
                        className="gh-card-spotlight pointer-events-none absolute inset-0"
                      />

                      <div className="relative flex flex-1 flex-col">
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-cyan-300 transition duration-300 group-hover:border-cyan-400/25 group-hover:bg-cyan-400/[0.08]">
                            <GitHubIcon className="h-5 w-5" />
                          </div>

                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${repo.name} on GitHub`}
                            title="Open repository on GitHub"
                            className="gh-repo-link inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition duration-200 hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                          >
                            <ExternalLinkIcon />
                          </a>
                        </div>

                        <h4 className="break-words text-base font-bold leading-6 text-slate-100 transition-colors group-hover:text-cyan-100 [overflow-wrap:anywhere]">
                          {repo.name}
                        </h4>

                        <p className="mt-3 min-h-[4.5rem] flex-1 break-words text-sm leading-6 text-slate-400 [overflow-wrap:anywhere]">
                          {repo.description ||
                            "Explore this public project on GitHub."}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          {repo.language ? (
                            <span className="gh-language-tag inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.05] px-3 py-1.5 text-[11px] font-semibold text-cyan-200">
                              <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 rounded-full bg-cyan-400"
                              />
                              {repo.language}
                            </span>
                          ) : (
                            <span className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[11px] text-slate-500">
                              Language not specified
                            </span>
                          )}

                          {repo.fork && (
                            <span className="rounded-full border border-purple-400/20 bg-purple-400/[0.05] px-2.5 py-1.5 text-[10px] font-medium text-purple-200">
                              Fork
                            </span>
                          )}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-white/[0.07] pt-4 text-xs text-slate-500">
                          <span
                            className="inline-flex items-center gap-1.5"
                            title={`${repo.stargazers_count} stars`}
                          >
                            <StarIcon />
                            {formatNumber(repo.stargazers_count)}
                          </span>

                          <span
                            className="inline-flex items-center gap-1.5"
                            title={`${repo.forks_count} forks`}
                          >
                            <ForkIcon />
                            {formatNumber(repo.forks_count)}
                          </span>

                          <span className="ml-auto text-right">
                            Updated {formatDate(repo.updated_at)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {repos.length === 0 && (
                  <p className="mt-5 text-center text-sm text-slate-500">
                    No public repositories were returned by GitHub.
                  </p>
                )}
              </>
            )}
          </>
        )}

        {/* Contribution calendar */}
        <div
          data-reveal
          className="gh-reveal mt-20"
        >
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-purple-300 sm:text-xs">
                Consistency over time
              </p>

              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Contribution activity<span className="text-purple-400">.</span>
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Explore the public contribution calendar on my GitHub profile.
              </p>
            </div>

            <a
              href={contributionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-purple-300 transition hover:text-purple-200"
            >
              Open contribution history
              <ExternalLinkIcon />
            </a>
          </div>

          <div
            className="gh-contribution-panel relative overflow-hidden rounded-3xl border border-white/[0.08] p-4 sm:p-7"
            onPointerMove={spotlight}
            onPointerLeave={resetSpotlight}
          >
            <div className="relative">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <ActivityIcon />
                  <span>GitHub contribution graph</span>
                </div>

                <span className="hidden rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-slate-500 sm:inline-flex">
                  Public profile data
                </span>
              </div>

              {!contributionFailed ? (
                <div className="gh-calendar-image-wrap overflow-x-auto rounded-xl border border-white/[0.05] bg-[#020617]/70 p-3 sm:p-4">
                  <img
                    src={`https://github.com/users/${GITHUB_USERNAME}/contributions`}
                    alt={`Public contribution calendar for ${GITHUB_USERNAME}. Open the GitHub profile to inspect contribution details.`}
                    loading="lazy"
                    className="gh-calendar-image mx-auto block h-auto w-full min-w-[640px] max-w-full"
                    onError={() => setContributionFailed(true)}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.07] bg-[#020617]/60 px-5 py-10 text-center">
                  <ActivityIcon />
                  <p className="mt-3 font-semibold text-slate-200">
                    Contribution graph unavailable here
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    GitHub hosts the full contribution calendar on the public
                    profile.
                  </p>
                  <a
                    href={contributionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    View calendar on GitHub
                    <ExternalLinkIcon />
                  </a>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">
                  Contributions are displayed by GitHub. Private activity may
                  not be visible on this public graph.
                </p>

                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit shrink-0 items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-white"
                >
                  Explore profile
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Closing call to action */}
        <div
          data-reveal
          className="gh-reveal gh-closing-panel relative mt-12 overflow-hidden rounded-3xl border border-cyan-400/15 p-6 sm:p-9"
        >
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">
                Let's build something
              </p>

              <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Curious about the code behind the projects?
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Browse the repositories, explore the implementation, and
                follow along as the projects evolve.
              </p>
            </div>

            <a
              href={repositoriesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-primary-button inline-flex w-fit shrink-0 items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white"
            >
              Explore repositories
              <ExternalLinkIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Component-scoped styles */}
      <style>{`
        .gh-premium {
          --gh-cyan: 34, 211, 238;
          --gh-purple: 168, 85, 247;
          isolation: isolate;
        }

        .gh-grid {
          z-index: -3;
          opacity: 0.32;
          background-image:
            linear-gradient(rgba(148,163,184,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.045) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
        }

        .gh-orb {
          z-index: -2;
          width: 26rem;
          height: 26rem;
          border-radius: 9999px;
          filter: blur(105px);
          opacity: 0.12;
          pointer-events: none;
          animation: gh-orb-float 16s ease-in-out infinite alternate;
        }

        .gh-orb-one {
          top: 4rem;
          left: -14rem;
          background: rgb(6, 182, 212);
        }

        .gh-orb-two {
          top: 35rem;
          right: -15rem;
          background: rgb(124, 58, 237);
          animation-delay: -5s;
        }

        .gh-orb-three {
          bottom: 0;
          left: 35%;
          background: rgb(14, 165, 233);
          opacity: 0.07;
          animation-delay: -9s;
        }

        .gh-gradient-text {
          color: #67e8f9;
          background: linear-gradient(
            100deg,
            #67e8f9 0%,
            #a5b4fc 45%,
            #c084fc 75%,
            #67e8f9 100%
          );
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gh-gradient-shift 9s ease-in-out infinite;
        }

        .gh-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 650ms ease,
            transform 650ms cubic-bezier(.2,.7,.2,1);
          transition-delay: var(--gh-delay, 0ms);
        }

        .gh-reveal.gh-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .gh-profile-panel,
        .gh-contribution-panel {
          background:
            radial-gradient(
              circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
              rgba(34,211,238,0.065),
              transparent 36%
            ),
            linear-gradient(
              125deg,
              rgba(15,23,42,0.92),
              rgba(8,15,33,0.86)
            );
          transition: border-color 250ms ease;
        }

        .gh-profile-panel:hover,
        .gh-contribution-panel:hover {
          border-color: rgba(34,211,238,0.22);
        }

        .gh-avatar-frame {
          width: 68px;
          height: 68px;
          padding: 3px;
          border-radius: 19px;
          background: linear-gradient(
            135deg,
            rgba(34,211,238,0.9),
            rgba(168,85,247,0.85)
          );
          box-shadow: 0 0 28px rgba(34,211,238,0.1);
        }

        .gh-primary-button {
          border: 1px solid rgba(103,232,249,0.3);
          background: linear-gradient(
            110deg,
            rgba(8,145,178,0.9),
            rgba(109,40,217,0.9)
          );
          box-shadow: 0 8px 30px rgba(8,145,178,0.12);
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease,
            filter 220ms ease;
        }

        .gh-primary-button:hover {
          transform: translateY(-2px);
          border-color: rgba(165,243,252,0.7);
          box-shadow: 0 12px 35px rgba(34,211,238,0.2);
          filter: brightness(1.12);
        }

        .gh-outline-button {
          border: 1px solid rgba(148,163,184,0.17);
          background: rgba(255,255,255,0.025);
          color: #cbd5e1;
          transition:
            color 200ms ease,
            border-color 200ms ease,
            background 200ms ease;
        }

        .gh-outline-button:hover {
          border-color: rgba(34,211,238,0.35);
          background: rgba(34,211,238,0.07);
          color: #a5f3fc;
        }

        .gh-status-dot {
          box-shadow: 0 0 12px rgba(52,211,153,0.8);
          animation: gh-status-pulse 2.6s ease-in-out infinite;
        }

        .gh-stat-card {
          position: relative;
          overflow: hidden;
          background: rgba(15,23,42,0.57);
          transition:
            transform 280ms ease,
            border-color 280ms ease,
            background 280ms ease,
            box-shadow 280ms ease;
          transition-delay: 0ms;
        }

        .gh-stat-card::before {
          position: absolute;
          top: 0;
          right: 18%;
          left: 18%;
          height: 1px;
          content: "";
          opacity: 0.65;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(34,211,238,0.7),
            transparent
          );
        }

        .gh-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(34,211,238,0.22);
          background: rgba(15,23,42,0.88);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }

        .gh-stat-icon {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.035);
          color: #67e8f9;
          transition: transform 250ms ease;
        }

        .gh-stat-card:hover .gh-stat-icon {
          transform: rotate(-5deg) scale(1.07);
        }

        .gh-accent-purple .gh-stat-icon {
          color: #c4b5fd;
        }

        .gh-accent-amber .gh-stat-icon {
          color: #fcd34d;
        }

        .gh-accent-blue .gh-stat-icon {
          color: #93c5fd;
        }

        .gh-repo-card {
          background:
            radial-gradient(
              circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
              rgba(34,211,238,0.105),
              transparent 42%
            ),
            linear-gradient(
              145deg,
              rgba(15,23,42,0.92),
              rgba(7,14,29,0.95)
            );
          transition:
            transform 280ms cubic-bezier(.2,.7,.2,1),
            border-color 280ms ease,
            box-shadow 280ms ease,
            background-color 280ms ease;
          will-change: transform;
        }

        .gh-repo-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34,211,238,0.32);
          box-shadow:
            0 18px 45px rgba(0,0,0,0.22),
            0 0 28px rgba(34,211,238,0.055);
        }

        .gh-repo-card:focus-within {
          border-color: rgba(34,211,238,0.42);
        }

        .gh-card-spotlight {
          background: radial-gradient(
            280px circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
            rgba(34,211,238,0.075),
            transparent 72%
          );
          opacity: 0;
          transition: opacity 250ms ease;
        }

        .gh-repo-card:hover .gh-card-spotlight {
          opacity: 1;
        }

        .gh-repo-card > div {
          z-index: 1;
        }

        .gh-repo-link:hover {
          transform: translateY(-1px);
        }

        .gh-filter-chip {
          min-height: 36px;
        }

        .gh-filter-active {
          box-shadow: inset 0 0 0 1px rgba(34,211,238,0.06);
        }

        .gh-skeleton-card {
          background: rgba(15,23,42,0.45);
        }

        .gh-skeleton {
          background: linear-gradient(
            100deg,
            rgba(148,163,184,0.055) 25%,
            rgba(148,163,184,0.13) 45%,
            rgba(148,163,184,0.055) 65%
          );
          background-size: 200% 100%;
          animation: gh-skeleton-shimmer 1.8s ease-in-out infinite;
        }

        .gh-calendar-image-wrap {
          scrollbar-color: rgba(100,116,139,0.5) transparent;
          scrollbar-width: thin;
        }

        .gh-calendar-image {
          min-height: 100px;
          object-fit: contain;
        }

        .gh-closing-panel {
          background:
            radial-gradient(
              ellipse at 100% 0%,
              rgba(168,85,247,0.11),
              transparent 48%
            ),
            radial-gradient(
              ellipse at 0% 100%,
              rgba(34,211,238,0.09),
              transparent 50%
            ),
            rgba(8,15,33,0.8);
        }

        @keyframes gh-gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        @keyframes gh-orb-float {
          0% { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(28px,-22px,0) scale(1.08); }
        }

        @keyframes gh-status-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes gh-skeleton-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        @media (max-width: 640px) {
          .gh-avatar-frame {
            width: 58px;
            height: 58px;
            border-radius: 16px;
          }

          .gh-grid {
            background-size: 36px 36px;
          }

          .gh-repo-card:hover {
            transform: translateY(-2px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gh-premium *,
          .gh-premium *::before,
          .gh-premium *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }

          .gh-reveal {
            opacity: 1;
            transform: none;
          }

          .gh-repo-card:hover,
          .gh-stat-card:hover,
          .gh-primary-button:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

export default GitHubActivity;
