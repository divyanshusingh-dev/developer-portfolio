import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isPurposeOpen, setIsPurposeOpen] = useState(false);

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumePassword, setResumePassword] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [isResumeDownloading, setIsResumeDownloading] = useState(false);

  const purposeRef = useRef<HTMLDivElement>(null);

  const purposeOptions = [
    {
      title: "Job Opportunity",
      description: "Full-time or part-time position",
    },
    {
      title: "Internship",
      description: "Internship or training opportunity",
    },
    {
      title: "Freelance Project",
      description: "Paid freelance work",
    },
    {
      title: "Collaboration",
      description: "Work together on a project",
    },
    {
      title: "Graphic Design Work",
      description: "Posters, banners and creative work",
    },
    {
      title: "Website / Web Development",
      description: "Website or web application",
    },
    {
      title: "Project Inquiry",
      description: "Discuss a project or idea",
    },
    {
      title: "General Inquiry",
      description: "Any general question",
    },
    {
      title: "Others",
      description: "Something else",
    },
  ];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        purposeRef.current &&
        !purposeRef.current.contains(event.target as Node)
      ) {
        setIsPurposeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePurposeSelect = (purpose: string) => {
    setFormData({
      ...formData,
      purpose,
    });

    setIsPurposeOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.purpose) {
      setStatus("Please select a purpose.");
      return;
    }

    setIsSending(true);
    setStatus("");

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");

        setFormData({
          name: "",
          email: "",
          phone: "",
          purpose: "",
          message: "",
        });
      } else {
        setStatus(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Unable to connect to the server.");
    } finally {
      setIsSending(false);
    }
  };

  const downloadResume = async (password = "") => {
    setIsResumeDownloading(true);
    setResumeError("");

    try {
      const response = await fetch(`${API_BASE}/api/protected-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: "resume.pdf",
          password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        let message = "Unable to download resume.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // Keep default message if response is not JSON.
        }

        throw new Error(message);
      }

      if (!contentType.includes("application/pdf")) {
        throw new Error("Invalid PDF response received.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setResumePassword("");
      setIsResumeModalOpen(false);
      setResumeError("");
    } catch (error) {
      console.error(error);

      setResumeError(
        error instanceof Error
          ? error.message
          : "Unable to download resume."
      );
    } finally {
      setIsResumeDownloading(false);
    }
  };

  const handleResumeClick = async () => {
    setResumeError("");
    setResumePassword("");

    try {
      const response = await fetch(
        `${API_BASE}/api/protected-pdf/status/resume.pdf`
      );

      if (!response.ok) {
        throw new Error("Unable to check resume protection status.");
      }

      const data = await response.json();

      if (data.protected) {
        setIsResumeModalOpen(true);
        return;
      }

      await downloadResume("");
    } catch (error) {
      console.error(error);

      setResumeError(
        error instanceof Error
          ? error.message
          : "Unable to access resume."
      );
    }
  };

  const handleResumeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resumePassword.trim()) {
      setResumeError("Please enter the PDF password.");
      return;
    }

    await downloadResume(resumePassword);
  };

  return (
    <section
      id="contact"
      className="w-full overflow-hidden border-t border-slate-800 bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Get In Touch
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Let's Work Together
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Have a project, internship opportunity, or collaboration in mind?
            Feel free to reach out. I would be happy to connect with you.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left Side */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white">
                Contact Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                You can contact me directly through email, phone, or social
                platforms.
              </p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <a
                href="mailto:divyanshusingh2006r@gmail.com"
                className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-950"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-400">
                  ✉
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-200 transition group-hover:text-cyan-400">
                    divyanshusingh2006r@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+919473681245"
                className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-950"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-400">
                  ☎
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-200 transition group-hover:text-cyan-400">
                    +91 94736 81245
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
                    />

                    <circle cx="12" cy="10" r="2.3" />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-200">
                    Jaunpur, Uttar Pradesh, India
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8 border-t border-slate-800 pt-7">
              <p className="mb-4 text-sm font-semibold text-white">
                Connect With Me
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://linkedin.com/in/divyanshusingh077"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  LinkedIn
                </a>

                <a
                  href="https://github.com/divyanshusingh-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  GitHub
                </a>

                <button
                  type="button"
                  onClick={handleResumeClick}
                  className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  Download Resume
                </button>
              </div>

              {resumeError && !isResumeModalOpen && (
                <p className="mt-3 text-xs text-red-400">{resumeError}</p>
              )}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative overflow-visible rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative">
              <h3 className="text-2xl font-bold text-white">
                Send Me a Message
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Fill out the form below and I will get back to you as soon as
                possible.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Your Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                    />
                  </div>
                </div>

                {/* Phone + Purpose */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Phone Number
                      <span className="ml-1 text-xs text-slate-500">
                        (Optional)
                      </span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                    />
                  </div>

                  {/* Purpose */}
                  <div ref={purposeRef} className="relative">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Purpose
                    </label>

                    {/* Selected Purpose */}
                    <button
                      type="button"
                      onClick={() => setIsPurposeOpen((prev) => !prev)}
                      className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-300 ${
                        isPurposeOpen
                          ? "border-cyan-500 bg-slate-950 shadow-lg shadow-cyan-500/5"
                          : "border-slate-700 bg-slate-950/70 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Icon */}
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                            formData.purpose
                              ? "bg-cyan-500/10 text-cyan-400"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7"
                            />

                            <rect
                              x="4"
                              y="7"
                              width="16"
                              height="13"
                              rx="2"
                            />

                            <path
                              strokeLinecap="round"
                              d="M4 11h16"
                            />
                          </svg>
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm ${
                              formData.purpose
                                ? "font-medium text-white"
                                : "text-slate-600"
                            }`}
                          >
                            {formData.purpose || "Select a purpose"}
                          </p>

                          {formData.purpose && (
                            <p className="mt-0.5 truncate text-[11px] text-slate-500">
                              Click to change
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`ml-3 h-4 w-4 shrink-0 transition-all duration-300 ${
                          isPurposeOpen
                            ? "rotate-180 text-cyan-400"
                            : "text-slate-500 group-hover:text-slate-300"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m6 9 6 6 6-6"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isPurposeOpen && (
                      <div className="absolute left-0 right-0 top-full z-[100] mt-2">
                        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#07101f]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
                          {/* Header */}
                          <div className="border-b border-slate-800 px-3 pb-2.5 pt-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Choose Purpose
                            </p>
                          </div>

                          {/* Options */}
                          <div className="mt-1 max-h-72 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
                            {purposeOptions.map((option) => {
                              const isSelected =
                                formData.purpose === option.title;

                              return (
                                <button
                                  key={option.title}
                                  type="button"
                                  onClick={() =>
                                    handlePurposeSelect(option.title)
                                  }
                                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                                    isSelected
                                      ? "bg-cyan-500/10"
                                      : "hover:bg-white/[0.04]"
                                  }`}
                                >
                                  {/* Option Icon */}
                                  <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all ${
                                      isSelected
                                        ? "bg-cyan-500/15 text-cyan-400"
                                        : "bg-slate-800/80 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300"
                                    }`}
                                  >
                                    {isSelected ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m5 12 4 4L19 6"
                                        />
                                      </svg>
                                    ) : (
                                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    )}
                                  </div>

                                  {/* Text */}
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={`truncate text-sm font-medium ${
                                        isSelected
                                          ? "text-cyan-400"
                                          : "text-slate-200 group-hover:text-white"
                                      }`}
                                    >
                                      {option.title}
                                    </p>

                                    <p className="mt-0.5 truncate text-[11px] text-slate-500 group-hover:text-slate-400">
                                      {option.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Required validation helper */}
                    <input
                      tabIndex={-1}
                      aria-hidden="true"
                      value={formData.purpose}
                      onChange={() => {}}
                      required
                      className="pointer-events-none absolute h-0 w-0 opacity-0"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                  />
                </div>

                {/* Status */}
                {status === "success" && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    ✓ Message sent successfully!
                  </div>
                )}

                {status && status !== "success" && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {status}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? "Sending..." : "Send Message"}

                  {!isSending && (
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Email */}
        {/* Bottom Email CTA */}
<div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
  <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
    
    {/* Left */}
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4 7 8 6 8-6"
          />
        </svg>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">
          Prefer direct email?
        </p>

        <p className="mt-1 break-all text-sm text-slate-400">
          divyanshusingh2006r@gmail.com
        </p>
      </div>
    </div>

    {/* Right */}
    <a
      href="mailto:divyanshusingh2006r@gmail.com?subject=Portfolio%20Inquiry"
      className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10"
      aria-label="Compose an email to Divyanshu Singh"
    >
      <span>Compose Email</span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h13"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m13 6 6 6-6 6"
        />
      </svg>
    </a>
  </div>
</div>
      </div>

      {/* Resume Password Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Protected Resume
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter the password to download the resume.
              </p>
            </div>

            <form onSubmit={handleResumeSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="resume-password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  PDF Password
                </label>

                <input
                  id="resume-password"
                  type="password"
                  value={resumePassword}
                  onChange={(e) => {
                    setResumePassword(e.target.value);
                    setResumeError("");
                  }}
                  placeholder="Enter password"
                  autoFocus
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                />
              </div>

              {resumeError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {resumeError}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!isResumeDownloading) {
                      setIsResumeModalOpen(false);
                      setResumePassword("");
                      setResumeError("");
                    }
                  }}
                  disabled={isResumeDownloading}
                  className="rounded-xl border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isResumeDownloading}
                  className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResumeDownloading
                    ? "Downloading..."
                    : "Download Resume"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Contact;