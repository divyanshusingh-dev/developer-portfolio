import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

const API_BASE =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com";

const EMAIL = "divyanshusingh2006r@gmail.com";
const PHONE = "+919473681245";
const WHATSAPP = "919473681245";
const DRAFT_KEY = "portfolio_contact_draft_v2";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  message: string;
  company: string;
  designation: string;
  budget: string;
  deadline: string;
  preferredContact: "Email" | "WhatsApp" | "Phone";
  website: string; // Honeypot: must remain empty.
};

const EMPTY_FORM: ContactForm = {
  name: "",
  email: "",
  phone: "",
  purpose: "",
  message: "",
  company: "",
  designation: "",
  budget: "",
  deadline: "",
  preferredContact: "Email",
  website: "",
};

const PURPOSES = [
  { title: "Job Opportunity", description: "Full-time or part-time position" },
  { title: "Internship", description: "Internship or training opportunity" },
  { title: "Freelance Project", description: "Paid freelance work" },
  { title: "Collaboration", description: "Work together on a project" },
  { title: "Graphic Design Work", description: "Posters, banners and creative work" },
  { title: "Website / Web Development", description: "Website or web application" },
  { title: "Project Inquiry", description: "Discuss a project or idea" },
  { title: "General Inquiry", description: "Any general question" },
  { title: "Others", description: "Something else" },
];

const TEMPLATES: Record<string, string> = {
  "Job Opportunity":
    "Hello Divyanshu,\n\nI am reaching out regarding a job opportunity. Here are a few details about the role:\n\nRole:\nCompany:\nLocation / Work mode:\n\nI would be happy to discuss this further.",
  Internship:
    "Hello Divyanshu,\n\nI would like to share an internship opportunity with you.\n\nOrganization:\nRole / Department:\nDuration:\nWork mode:\n\nPlease let me know if you are interested.",
  "Freelance Project":
    "Hello Divyanshu,\n\nI have a freelance project that may be a good fit for your skills.\n\nProject overview:\nExpected deliverables:\nTimeline:\nBudget:\n\nPlease let me know if we can discuss it.",
  Collaboration:
    "Hello Divyanshu,\n\nI am interested in collaborating with you.\n\nCollaboration idea:\nExpected contribution:\nProposed timeline:\n\nLet me know what you think.",
  "Graphic Design Work":
    "Hello Divyanshu,\n\nI am looking for graphic design support.\n\nDesign requirements:\nRequired sizes / formats:\nNumber of creatives:\nDeadline:\n\nPlease share your availability.",
  "Website / Web Development":
    "Hello Divyanshu,\n\nI would like to discuss a website / web development requirement.\n\nProject overview:\nRequired features:\nPreferred technology (if any):\nTimeline:\n\nPlease let me know how we can proceed.",
  "Project Inquiry":
    "Hello Divyanshu,\n\nI would like to discuss a project.\n\nProject idea:\nMain requirements:\nExpected timeline:\n\nLooking forward to connecting.",
  "General Inquiry":
    "Hello Divyanshu,\n\nI am contacting you regarding:\n\n\nThank you.",
};

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10";
const labelClass = "mb-2 block text-sm font-medium text-slate-300";
const secondaryButton =
  "rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400";

function makeInquiryId() {
  return `DS-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function getEmailSuggestion(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return "";
  const corrections: Record<string, string> = {
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "yaho.com": "yahoo.com",
    "outlok.com": "outlook.com",
    "hotmal.com": "hotmail.com",
  };
  return corrections[domain] ? email.replace(domain, corrections[domain]) : "";
}

function Contact() {
  const [formData, setFormData] = useState<ContactForm>(EMPTY_FORM);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isPurposeOpen, setIsPurposeOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const [draftRestored, setDraftRestored] = useState(false);
  const [lastSaved, setLastSaved] = useState("");
  const [inquiryId, setInquiryId] = useState("");
  const [copied, setCopied] = useState("");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumePassword, setResumePassword] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [isResumeDownloading, setIsResumeDownloading] = useState(false);
  const purposeRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const lastSubmissionRef = useRef("");

  const emailSuggestion = useMemo(
    () => getEmailSuggestion(formData.email.trim()),
    [formData.email]
  );
  const messageProgress = Math.min((formData.message.length / 500) * 100, 100);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ContactForm>;
        setFormData({ ...EMPTY_FORM, ...parsed, website: "" });
        setDraftRestored(true);
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    const hasContent = Object.entries(formData).some(
      ([key, value]) => key !== "website" && String(value).trim()
    );
    if (!hasContent) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const timer = window.setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      setLastSaved(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
    }, 500);
    return () => window.clearTimeout(timer);
  }, [formData]);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

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
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setStatus("");
  };

  const handlePurposeSelect = (purpose: string) => {
    setFormData((current) => ({
      ...current,
      purpose,
      message: current.message.trim()
        ? current.message
        : TEMPLATES[purpose] || "",
    }));
    setIsPurposeOpen(false);
    setStatus("");
  };

  const clearDraft = useCallback(() => {
    setFormData(EMPTY_FORM);
    localStorage.removeItem(DRAFT_KEY);
    setDraftRestored(false);
    setLastSaved("");
    setStatus("");
    setToast("Form draft cleared.");
  }, []);

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setToast(`${label} copied to clipboard.`);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setToast("Clipboard access is not available in this browser.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!formData.purpose) {
      setStatus("Please select a purpose.");
      return;
    }
    if (formData.message.trim().length < 10) {
      setStatus("Please enter a message with at least 10 characters.");
      return;
    }
    if (formData.message.length > 500) {
      setStatus("Your message must be 500 characters or fewer.");
      return;
    }
    if (!isOnline) {
      setStatus("You are offline. Please reconnect and try again.");
      return;
    }

    // Client-side duplicate guard for accidental double-clicks.
    const fingerprint = [
      formData.name.trim().toLowerCase(),
      formData.email.trim().toLowerCase(),
      formData.purpose,
      formData.message.trim(),
    ].join("|");
    if (fingerprint === lastSubmissionRef.current) {
      setStatus("This inquiry has already been submitted from this page.");
      return;
    }

    submittingRef.current = true;
    setIsSending(true);
    setStatus("");

    const currentInquiryId = makeInquiryId();
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Inquiry-ID": currentInquiryId,
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          inquiryId: currentInquiryId,
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      lastSubmissionRef.current = fingerprint;
      const confirmedId = data.inquiryId || data.contactId || currentInquiryId;
      setInquiryId(String(confirmedId));
      setStatus("success");
      setToast("Your message has been sent successfully.");
      setFormData(EMPTY_FORM);
      localStorage.removeItem(DRAFT_KEY);
      setDraftRestored(false);
      setLastSaved("");
      setIsPreviewOpen(false);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSending(false);
      submittingRef.current = false;
    }
  };

  const downloadResume = async (password = "") => {
    setIsResumeDownloading(true);
    setResumeError("");
    try {
      const response = await fetch(`${API_BASE}/api/protected-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: "resume.pdf", password }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to download resume.");
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
    } catch (error) {
      setResumeError(
        error instanceof Error ? error.message : "Unable to download resume."
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
      if (!response.ok) throw new Error("Unable to check resume protection status.");
      const data = await response.json();
      if (data.protected) setIsResumeModalOpen(true);
      else await downloadResume("");
    } catch (error) {
      setResumeError(
        error instanceof Error ? error.message : "Unable to access resume."
      );
    }
  };

  const handleResumeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resumePassword.trim()) {
      setResumeError("Please enter the PDF password.");
      return;
    }
    await downloadResume(resumePassword);
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden border-t border-slate-800 bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="pointer-events-none absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-8rem] h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
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
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                isOnline
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                  : "border-red-500/20 bg-red-500/5 text-red-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-red-400"}`} />
              {isOnline ? "You are online" : "You are offline"}
            </span>
            {lastSaved && (
              <span className="text-slate-500">Draft saved at {lastSaved}</span>
            )}
            {draftRestored && (
              <span className="text-cyan-400">Previous draft restored</span>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white">Contact Information</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                You can contact me directly through email, phone, or social platforms.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">✉</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
                  <p className="mt-1 break-all text-sm text-slate-200">{EMAIL}</p>
                </div>
                <button type="button" onClick={() => copyText(EMAIL, "Email")} className={secondaryButton}>
                  {copied === "Email" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">☎</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Phone</p>
                  <p className="mt-1 text-sm text-slate-200">+91 94736 81245</p>
                </div>
                <button type="button" onClick={() => copyText(PHONE, "Phone")} className={secondaryButton}>
                  {copied === "Phone" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">⌖</div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Location</p>
                  <p className="mt-1 text-sm text-slate-200">Jaunpur, Uttar Pradesh, India</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-7">
              <p className="mb-4 text-sm font-semibold text-white">Connect With Me</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://linkedin.com/in/divyanshusingh077" target="_blank" rel="noopener noreferrer" className={secondaryButton}>LinkedIn</a>
                <a href="https://github.com/divyanshusingh-dev" target="_blank" rel="noopener noreferrer" className={secondaryButton}>GitHub</a>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={secondaryButton}>WhatsApp</a>
                <button type="button" onClick={handleResumeClick} className={secondaryButton}>Download Resume</button>
              </div>
              {resumeError && !isResumeModalOpen && (
                <p className="mt-3 text-xs text-red-400">{resumeError}</p>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4">
              <p className="text-sm font-semibold text-cyan-300">Preferred response time</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                I will review your message and respond as soon as possible.
              </p>
            </div>
          </div>

          <div className="relative overflow-visible rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Send Me a Message</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Share a few details and I will get back to you.
                  </p>
                </div>
                <button type="button" onClick={clearDraft} className="text-xs text-slate-500 transition hover:text-red-400">
                  Clear form
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Hidden honeypot field. Real visitors should never fill this. */}
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Your Name *</label>
                    <input id="contact-name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required maxLength={80} autoComplete="name" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Your Email *</label>
                    <input id="contact-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required maxLength={120} autoComplete="email" className={inputClass} />
                    {emailSuggestion && (
                      <p className="mt-2 text-xs text-amber-400">
                        Did you mean{" "}
                        <button type="button" className="font-semibold underline" onClick={() => setFormData((current) => ({ ...current, email: emailSuggestion }))}>
                          {emailSuggestion}
                        </button>
                        ?
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>Phone Number <span className="text-xs text-slate-500">(Optional)</span></label>
                    <input id="contact-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" maxLength={25} autoComplete="tel" className={inputClass} />
                  </div>
                  <div ref={purposeRef} className="relative">
                    <label className={labelClass}>Purpose *</label>
                    <button type="button" aria-haspopup="listbox" aria-expanded={isPurposeOpen} onClick={() => setIsPurposeOpen((value) => !value)} className={`${inputClass} flex items-center justify-between text-left ${isPurposeOpen ? "border-cyan-500" : ""}`}>
                      <span className={formData.purpose ? "text-white" : "text-slate-600"}>{formData.purpose || "Select a purpose"}</span>
                      <span className="text-slate-400">⌄</span>
                    </button>
                    {isPurposeOpen && (
                      <div role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                        {PURPOSES.map((option) => (
                          <button key={option.title} type="button" role="option" aria-selected={formData.purpose === option.title} onClick={() => handlePurposeSelect(option.title)} className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-cyan-500/10">
                            <span className="block text-sm font-medium text-slate-200">{option.title}</span>
                            <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>Company / Organization <span className="text-xs text-slate-500">(Optional)</span></label>
                    <input id="contact-company" name="company" value={formData.company} onChange={handleChange} placeholder="Company name" maxLength={100} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="contact-designation" className={labelClass}>Your Designation <span className="text-xs text-slate-500">(Optional)</span></label>
                    <input id="contact-designation" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. HR Manager" maxLength={80} className={inputClass} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-budget" className={labelClass}>Budget / Salary Range <span className="text-xs text-slate-500">(Optional)</span></label>
                    <input id="contact-budget" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. ₹10,000 - ₹20,000" maxLength={80} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="contact-deadline" className={labelClass}>Expected Deadline <span className="text-xs text-slate-500">(Optional)</span></label>
                    <input id="contact-deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-channel" className={labelClass}>Preferred Contact Method</label>
                  <select id="contact-channel" name="preferredContact" value={formData.preferredContact} onChange={handleChange} className={inputClass}>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>

                {formData.purpose && TEMPLATES[formData.purpose] && !formData.message.trim() && (
                  <button type="button" onClick={() => setFormData((current) => ({ ...current, message: TEMPLATES[current.purpose] || "" }))} className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300">
                    + Insert a suggested message template
                  </button>
                )}

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label htmlFor="contact-message" className="text-sm font-medium text-slate-300">Message *</label>
                    <span className={`text-xs tabular-nums ${formData.message.length > 500 ? "text-red-400" : "text-slate-500"}`}>{formData.message.length}/500</span>
                  </div>
                  <textarea id="contact-message" name="message" rows={6} value={formData.message} onChange={handleChange} placeholder="Write your message here..." required maxLength={500} className={`${inputClass} resize-y`} />
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full transition-all ${formData.message.length > 500 ? "bg-red-500" : "bg-cyan-500"}`} style={{ width: `${messageProgress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Please include enough detail so I can understand your request.</p>
                </div>

                {status === "success" && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    <p className="font-semibold">✓ Message sent successfully!</p>
                    {inquiryId && <p className="mt-1 text-xs">Inquiry reference: {inquiryId}</p>}
                    <p className="mt-1 text-xs text-emerald-400/80">Please keep this reference for your records.</p>
                  </div>
                )}
                {status && status !== "success" && (
                  <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{status}</div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" disabled={isSending} onClick={() => setIsPreviewOpen(true)} className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-50">
                    Preview Message
                  </button>
                  <button type="submit" disabled={isSending || !isOnline} className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSending ? "Sending..." : "Send Message"}
                    {!isSending && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
                  </button>
                </div>
                <p className="text-center text-[11px] leading-5 text-slate-500">
                  Your details are used only to respond to this inquiry. Drafts are saved locally in this browser and cleared after successful submission.
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">✉</div>
              <div>
                <p className="text-sm font-semibold text-white">Prefer direct email?</p>
                <p className="mt-1 break-all text-sm text-slate-400">{EMAIL}</p>
              </div>
            </div>
            <a href={`mailto:${EMAIL}?subject=Portfolio%20Inquiry`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-300">
              Compose Email <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-[250] max-w-[calc(100vw-2.5rem)] rounded-xl border border-cyan-500/20 bg-slate-900 px-4 py-3 text-sm text-cyan-300 shadow-2xl">
          {toast}
        </div>
      )}

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsPreviewOpen(false); }}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Review Details</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Message Preview</h3>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close preview">✕</button>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Name", formData.name],
                ["Email", formData.email],
                ["Phone", formData.phone || "Not provided"],
                ["Purpose", formData.purpose],
                ["Company", formData.company || "Not provided"],
                ["Designation", formData.designation || "Not provided"],
                ["Budget", formData.budget || "Not provided"],
                ["Deadline", formData.deadline || "Not specified"],
                ["Preferred contact", formData.preferredContact],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
                  <dd className="mt-1 break-words text-sm text-slate-200">{value || "Not provided"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Message</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{formData.message || "No message entered."}</p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsPreviewOpen(false)} className={secondaryButton}>Continue Editing</button>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400">Looks Good</button>
            </div>
          </div>
        </div>
      )}

      {isResumeModalOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">🔒</div>
              <h3 className="text-2xl font-bold text-white">Protected Resume</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Enter the password to download the resume.</p>
            </div>
            <form onSubmit={handleResumeSubmit} className="space-y-4">
              <div>
                <label htmlFor="resume-password" className={labelClass}>PDF Password</label>
                <input id="resume-password" type="password" value={resumePassword} onChange={(event) => { setResumePassword(event.target.value); setResumeError(""); }} placeholder="Enter password" autoFocus className={inputClass} />
              </div>
              {resumeError && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{resumeError}</div>}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => { if (!isResumeDownloading) { setIsResumeModalOpen(false); setResumePassword(""); setResumeError(""); } }} disabled={isResumeDownloading} className={secondaryButton}>Cancel</button>
                <button type="submit" disabled={isResumeDownloading} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {isResumeDownloading ? "Downloading..." : "Download Resume"}
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
