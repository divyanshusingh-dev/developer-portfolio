import { useState, type FormEvent } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSending(true);
    setStatus("");

    try {
      const response = await fetch(
        "https://developer-portfolio-8.onrender.com/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
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

  return (
    <section
      id="contact"
      className="w-full overflow-hidden border-t border-slate-800 bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
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

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Contact Information */}
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

            {/* Social Links */}
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

                <a
                  href="/resume.pdf"
                  download
                  className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            {/* Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative">
              <h3 className="text-2xl font-bold text-white">
                Send Me a Message
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Fill out the form below and your message will be sent to my
                portfolio backend.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Name */}
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

                {/* Email */}
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

                {/* Button */}
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

        {/* Bottom CTA */}
        <div className="mt-10 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-center sm:p-8">
          <p className="text-sm text-slate-400">Prefer email?</p>

          <a
            href="mailto:divyanshusingh2006r@gmail.com"
            className="mt-2 inline-block text-lg font-semibold text-cyan-400 transition hover:text-cyan-300 sm:text-xl"
          >
            divyanshusingh2006r@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;