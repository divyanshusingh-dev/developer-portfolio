
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  BriefcaseBusiness,
  FileText,
  Download,
  Eye,
  RotateCcw,
  Send,
  X,
  ExternalLink,
  
} from "lucide-react";

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com";

const EMAIL = "divyanshusingh2006r@gmail.com";
const PHONE = "+919473681245";
const WHATSAPP = "919473681245";
const MESSAGE_MAX_LENGTH = 1000;

type FormData = {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  customPurpose: string;
  message: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  purpose: "",
  customPurpose: "",
  message: "",
};

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

function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isPurposeOpen, setIsPurposeOpen] = useState(false);

  const [copiedItem, setCopiedItem] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumePassword, setResumePassword] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [isResumeDownloading, setIsResumeDownloading] = useState(false);

  const [resumePreviewUrl, setResumePreviewUrl] = useState("");
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
  const [isResumePreviewLoading, setIsResumePreviewLoading] = useState(false);

  const purposeRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef(false);

  const selectedPurpose =
    formData.purpose === "Others"
      ? formData.customPurpose.trim()
      : formData.purpose;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        purposeRef.current &&
        !purposeRef.current.contains(event.target as Node)
      ) {
        setIsPurposeOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPurposeOpen(false);
        setIsResumeModalOpen(false);
        closeResumePreview();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resumePreviewUrl) {
        URL.revokeObjectURL(resumePreviewUrl);
      }
    };
  }, [resumePreviewUrl]);

  const closeResumePreview = () => {
    setIsResumePreviewOpen(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setStatus("");
  };

  const handlePurposeSelect = (purpose: string) => {
    setFormData((previous) => ({
      ...previous,
      purpose,
      customPurpose: purpose === "Others" ? previous.customPurpose : "",
    }));

    setFieldErrors((previous) => ({
      ...previous,
      purpose: "",
      customPurpose: "",
    }));

    setIsPurposeOpen(false);
    setStatus("");
  };

  // Feature 1 & 2: Copy email and phone
  const copyToClipboard = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(type);

      window.setTimeout(() => {
        setCopiedItem("");
      }, 2000);
    } catch {
      setStatus("Unable to copy. Please copy manually.");
    }
  };

  // Feature 5: Smart validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Please enter your name.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must contain at least 2 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (formData.phone.trim()) {
      const phoneDigits = formData.phone.replace(/\D/g, "");

      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.phone = "Please enter a valid phone number.";
      }
    }

    if (!formData.purpose) {
      errors.purpose = "Please select a purpose.";
    }

    if (
      formData.purpose === "Others" &&
      !formData.customPurpose.trim()
    ) {
      errors.customPurpose = "Please specify your purpose.";
    }

    if (!formData.message.trim()) {
      errors.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must contain at least 10 characters.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Feature 6: Reset with confirmation
  const resetForm = () => {
    const hasData = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (!hasData) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear all form fields?"
    );

    if (!confirmed) return;

    setFormData(INITIAL_FORM);
    setFieldErrors({});
    setStatus("");
  };

  // Feature 7: Duplicate submission protection
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestRef.current || isSending) return;

    if (!validateForm()) return;

    requestRef.current = true;
    setIsSending(true);
    setStatus("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        purpose: selectedPurpose,
        message: formData.message.trim(),
      };

      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("success");
      setFormData(INITIAL_FORM);
      setFieldErrors({});
    } catch (error) {
      console.error(error);

      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server."
      );
    } finally {
      requestRef.current = false;
      setIsSending(false);
    }
  };

  // Resume download / preview helper
  const getResumeBlob = async (password = "") => {
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
      let message = "Unable to access resume.";

      try {
        const data = await response.json();
        message = data.message || message;
      } catch {
        // Keep default error.
      }

      throw new Error(message);
    }

    if (!contentType.includes("application/pdf")) {
      throw new Error("Invalid PDF response received.");
    }

    return response.blob();
  };

  // Feature 9: Resume preview
  const previewResume = async (password = "") => {
    setIsResumePreviewLoading(true);
    setResumeError("");

    try {
      const blob = await getResumeBlob(password);

      if (resumePreviewUrl) {
        URL.revokeObjectURL(resumePreviewUrl);
      }

      const url = URL.createObjectURL(blob);

      setResumePreviewUrl(url);
      setIsResumePreviewOpen(true);
      setIsResumeModalOpen(false);
      setResumePassword("");
    } catch (error) {
      setResumeError(
        error instanceof Error
          ? error.message
          : "Unable to preview resume."
      );
    } finally {
      setIsResumePreviewLoading(false);
    }
  };

  const downloadResume = async (password = "") => {
    setIsResumeDownloading(true);
    setResumeError("");

    try {
      const blob = await getResumeBlob(password);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

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

  // Feature 11: Dynamic email subject
  const emailSubject = encodeURIComponent(
    selectedPurpose
      ? `Portfolio Inquiry - ${selectedPurpose}`
      : "Portfolio Inquiry"
  );

  const emailBody = encodeURIComponent(
    `Hello Divyanshu,\n\nI would like to contact you regarding ${
      selectedPurpose || "an inquiry"
    }.\n\n`
  );

  const composeEmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${emailSubject}&body=${emailBody}`;

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 sm:text-sm";

  const labelClass =
    "mb-1.5 block text-xs font-medium text-slate-300";

  const errorClass = "mt-1.5 text-[11px] text-red-400";

  return (
    <section
      id="contact"
      className="w-full overflow-hidden border-t border-slate-800 bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-9 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Get In Touch
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Let's Work Together
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
            Have a project, internship opportunity, or collaboration in mind?
            Feel free to reach out. I would be happy to connect with you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

          {/* LEFT SIDE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm sm:p-6">

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">
                Contact Information
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                You can contact me directly through email, phone, or social
                platforms.
              </p>
            </div>

            <div className="space-y-3.5">

              {/* Email */}
              <div className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 transition hover:border-cyan-500/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Mail size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-0.5 block break-all text-xs text-slate-200 transition hover:text-cyan-400 sm:text-sm"
                  >
                    {EMAIL}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(EMAIL, "email")}
                  aria-label="Copy email address"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  {copiedItem === "email" ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 transition hover:border-cyan-500/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Phone size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Phone
                  </p>

                  <a
                    href={`tel:${PHONE}`}
                    className="mt-0.5 block text-xs text-slate-200 transition hover:text-cyan-400 sm:text-sm"
                  >
                    +91 94736 81245
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(PHONE, "phone")}
                  aria-label="Copy phone number"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  {copiedItem === "phone" ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Location
                  </p>

                  <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                    Jaunpur, Uttar Pradesh, India
                  </p>
                </div>
              </div>

            </div>

            {/* Feature 12: Availability status */}
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <div>
                <p className="text-xs font-semibold text-emerald-400">
                  Open to Opportunities
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Available for suitable projects and collaborations
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 border-t border-slate-800 pt-5">
              <p className="mb-3 text-xs font-semibold text-white sm:text-sm">
                Connect With Me
              </p>

              <div className="flex flex-wrap gap-2.5">

                <a
                  href="https://linkedin.com/in/divyanshusingh077"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  LinkedIn
                </a>

                <a
                  href="https://github.com/divyanshusingh-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  GitHub
                </a>

                {/* Feature 3: WhatsApp */}
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                    "Hello Divyanshu, I visited your portfolio and would like to connect with you."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3.5 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>

                <button
                  type="button"
                  onClick={handleResumeClick}
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  Download Resume
                </button>

                {/* Feature 9: Resume Preview */}
                <button
                  type="button"
                  onClick={() => previewResume("")}
                  disabled={isResumePreviewLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-50"
                >
                  <Eye size={14} />
                  {isResumePreviewLoading ? "Loading..." : "Preview Resume"}
                </button>
              </div>

              {resumeError && !isResumeModalOpen && (
                <p className="mt-2 text-[11px] text-red-400">
                  {resumeError}
                </p>
              )}

              {copiedItem && (
                <p className="mt-2 text-[11px] text-emerald-400">
                  {copiedItem === "email"
                    ? "Email address copied!"
                    : "Phone number copied!"}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <div className="relative overflow-visible rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm sm:p-6">

            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Send Me a Message
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                    Fill out the form below and I will get back to you as soon
                    as possible.
                  </p>
                </div>

                {/* Feature 6: Reset */}
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSending}
                  title="Reset form"
                  className="shrink-0 rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                >
                  <RotateCcw size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                {/* Name + Email */}
                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      className={inputClass}
                      required
                    />

                    {fieldErrors.name && (
                      <p className={errorClass}>{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Your Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputClass}
                      required
                    />

                    {fieldErrors.email && (
                      <p className={errorClass}>{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone + Purpose */}
                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number
                      <span className="ml-1 text-[10px] text-slate-500">
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
                      autoComplete="tel"
                      className={inputClass}
                    />

                    {fieldErrors.phone && (
                      <p className={errorClass}>{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Purpose dropdown */}
                  <div ref={purposeRef} className="relative">
                    <label className={labelClass}>
                      Purpose
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsPurposeOpen((prev) => !prev)}
                      aria-expanded={isPurposeOpen}
                      className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-3 text-left transition ${
                        isPurposeOpen
                          ? "border-cyan-500 bg-slate-950"
                          : "border-slate-700 bg-slate-950/70 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                          <BriefcaseBusiness size={14} />
                        </div>

                        <span className="truncate text-xs text-slate-300">
                          {formData.purpose || "Select a purpose"}
                        </span>
                      </div>

                      <span className="ml-2 text-slate-500">
                        {isPurposeOpen ? "⌃" : "⌄"}
                      </span>
                    </button>

                    {isPurposeOpen && (
                      <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-slate-700 bg-[#07101f] p-1.5 shadow-2xl">
                        <div className="border-b border-slate-800 px-2.5 pb-2 pt-1.5">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Choose Purpose
                          </p>
                        </div>

                        <div className="mt-1 max-h-64 overflow-y-auto">
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
                                className={`w-full rounded-lg px-2.5 py-2 text-left transition ${
                                  isSelected
                                    ? "bg-cyan-500/10"
                                    : "hover:bg-white/[0.04]"
                                }`}
                              >
                                <p
                                  className={`text-xs font-medium ${
                                    isSelected
                                      ? "text-cyan-400"
                                      : "text-slate-200"
                                  }`}
                                >
                                  {option.title}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-500">
                                  {option.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {fieldErrors.purpose && (
                      <p className={errorClass}>
                        {fieldErrors.purpose}
                      </p>
                    )}
                  </div>
                </div>

                {/* Feature 10: Custom purpose */}
                {formData.purpose === "Others" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label htmlFor="customPurpose" className={labelClass}>
                      Specify Your Purpose
                    </label>

                    <input
                      id="customPurpose"
                      name="customPurpose"
                      type="text"
                      value={formData.customPurpose}
                      onChange={handleChange}
                      placeholder="Enter your purpose"
                      className={inputClass}
                      required
                    />

                    {fieldErrors.customPurpose && (
                      <p className={errorClass}>
                        {fieldErrors.customPurpose}
                      </p>
                    )}
                  </div>
                )}

                {/* Message + Feature 4 */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="message" className={labelClass}>
                      Message
                    </label>

                    <span
                      className={`text-[10px] ${
                        formData.message.length >= MESSAGE_MAX_LENGTH
                          ? "text-red-400"
                          : "text-slate-500"
                      }`}
                    >
                      {formData.message.length}/{MESSAGE_MAX_LENGTH}
                    </span>
                  </div>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={MESSAGE_MAX_LENGTH}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className={`${inputClass} resize-none`}
                    required
                  />

                  {fieldErrors.message && (
                    <p className={errorClass}>
                      {fieldErrors.message}
                    </p>
                  )}

                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        formData.message.length >= MESSAGE_MAX_LENGTH
                          ? "bg-red-400"
                          : "bg-cyan-500"
                      }`}
                      style={{
                        width: `${
                          (formData.message.length / MESSAGE_MAX_LENGTH) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Feature 8: Success animation */}
                {status === "success" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                        <Check size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-emerald-400">
                          Message sent successfully!
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Thank you for reaching out. I'll get back to you.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {status && status !== "success" && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
                    {status}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  {isSending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* Bottom Email CTA */}
        <div className="mt-20 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <Mail size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white sm:text-sm">
                  Prefer direct email?
                </p>

                <p className="mt-0.5 break-all text-xs text-slate-400 sm:text-sm">
                  {EMAIL}
                </p>
              </div>
            </div>

            <a
              href={composeEmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 sm:text-sm"
              aria-label="Compose an email to Divyanshu Singh"
            >
              <span>Compose Email</span>
              <ExternalLink size={14} />
            </a>

          </div>
        </div>
      </div>

      {/* Resume Password Modal */}
      {isResumeModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isResumeDownloading) {
              setIsResumeModalOpen(false);
              setResumePassword("");
              setResumeError("");
            }
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6">

            <div className="mb-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <FileText size={20} />
              </div>

              <h3 className="text-xl font-bold text-white">
                Protected Resume
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                Enter the password to access your resume.
              </p>
            </div>

            <form onSubmit={handleResumeSubmit} className="space-y-3.5">
              <div>
                <label
                  htmlFor="resume-password"
                  className={labelClass}
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
                  className={inputClass}
                />
              </div>

              {resumeError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
                  {resumeError}
                </div>
              )}

              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
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
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50 sm:text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isResumeDownloading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60 sm:text-sm"
                >
                  {isResumeDownloading ? (
                    "Downloading..."
                  ) : (
                    <>
                      <Download size={14} />
                      Download Resume
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 9: Resume Preview Modal */}
      {isResumePreviewOpen && resumePreviewUrl && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-md sm:p-6">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Resume Preview
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Divyanshu Singh
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={resumePreviewUrl}
                  download="resume.pdf"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  <Download size={14} />
                  Download
                </a>

                <button
                  type="button"
                  onClick={closeResumePreview}
                  className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:border-red-500/50 hover:text-red-400"
                  aria-label="Close resume preview"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <iframe
              src={resumePreviewUrl}
              title="Resume PDF Preview"
              className="h-full w-full flex-1 bg-white"
            />
          </div>
        </div>
      )}

    </section>
  );
}

export default Contact;
