
import { useEffect, useRef, useState, type FormEvent } from "react";

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Tell me about Divyanshu",
  "What are his technical skills?",
  "Show me his projects",
  "What experience does he have?",
];

function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Divyanshu AI, your personal portfolio assistant. Ask me anything about Divyanshu's skills, projects, education, experience, or achievements.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim();

    if (!text || isLoading) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(-12),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Unable to get a response right now. Please try again."
        );
      }

      const reply =
        typeof data?.reply === "string" ? data.reply.trim() : "";

      if (!reply) {
        throw new Error("The assistant returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
      setInput(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello again! I'm Divyanshu AI. What would you like to know about Divyanshu?",
      },
    ]);
    setError("");
    setInput("");
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Divyanshu AI assistant"
          className="
            fixed bottom-5 right-5 z-[100]
            flex h-16 w-16 items-center justify-center
            rounded-2xl border border-cyan-300/30
            bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600
            text-white shadow-[0_8px_35px_rgba(6,182,212,0.35)]
            transition duration-300
            hover:-translate-y-1 hover:scale-105
            hover:shadow-[0_12px_45px_rgba(6,182,212,0.5)]
            focus:outline-none focus:ring-2 focus:ring-cyan-300
            focus:ring-offset-2 focus:ring-offset-[#020617]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              d="M7 18.5 3.5 20l1.2-4A8.5 8.5 0 1 1 7 18.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 10h8M8 13.5h5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>

          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#020617] bg-emerald-400" />
          </span>
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="Divyanshu AI Portfolio Assistant"
          aria-modal="false"
          className="
            fixed bottom-4 right-4 z-[100]
            flex h-[min(650px,calc(100dvh-2rem))]
            w-[min(410px,calc(100vw-2rem))]
            flex-col overflow-hidden
            rounded-3xl border border-cyan-400/20
            bg-[#07111f] shadow-[0_20px_80px_rgba(0,0,0,0.65)]
            animate-[assistantAppear_0.25s_ease-out]
          "
        >
          {/* HEADER */}
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#082b43] via-[#10264b] to-[#21164a] px-5 py-4">
            <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold tracking-wide text-white">
                    Divyanshu AI
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs text-cyan-100/80">
                      Personal Portfolio Assistant
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleNewChat}
                  aria-label="Start a new chat"
                  title="New chat"
                  className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                  className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="m6 6 12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <div
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="mb-2 text-center">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                AI-powered portfolio chat
              </span>
            </div>

            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex items-end gap-2 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-300">
                      AI
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[84%] rounded-2xl px-4 py-3
                      text-[13px] leading-6
                      ${
                        isUser
                          ? "rounded-br-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/30"
                          : "rounded-bl-md border border-white/[0.08] bg-[#111e30] text-slate-200"
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-xs font-bold text-blue-300">
                      You
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-300">
                  AI
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.08] bg-[#111e30] px-4 py-4">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="ml-10 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs leading-5 text-red-200">
                {error}
                <p className="mt-1 text-red-200/70">
                  Your message is saved in the input box. You can try sending it again.
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTED QUESTIONS */}
          {messages.length === 1 && (
            <div className="border-t border-white/[0.06] px-4 pb-3 pt-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Suggested questions
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={isLoading}
                    onClick={() => void sendMessage(suggestion)}
                    className="
                      rounded-xl border border-cyan-400/15
                      bg-cyan-400/[0.05] px-3 py-2
                      text-left text-[11px] text-cyan-100
                      transition hover:border-cyan-300/40
                      hover:bg-cyan-400/10
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 bg-[#091525] p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#101f32] p-2 transition focus-within:border-cyan-400/40 focus-within:ring-2 focus-within:ring-cyan-400/10">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask me anything..."
                maxLength={3000}
                disabled={isLoading}
                aria-label="Type your message"
                className="
                  min-w-0 flex-1 bg-transparent px-2 py-2
                  text-sm text-white outline-none
                  placeholder:text-slate-500
                  disabled:opacity-50
                "
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="
                  flex h-10 w-10 shrink-0 items-center
                  justify-center rounded-xl
                  bg-gradient-to-br from-cyan-400 to-blue-600
                  text-white shadow-lg shadow-cyan-950/30
                  transition hover:scale-105
                  disabled:cursor-not-allowed disabled:opacity-40
                  disabled:hover:scale-100
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="m21 3-7.5 18-3.8-7.7L2 9.5 21 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3 9.7 13.3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-600">
              Powered by AI · Answers based on portfolio information
            </p>
          </form>
        </section>
      )}

      <style>{`
        @keyframes assistantAppear {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default PortfolioAssistant;
