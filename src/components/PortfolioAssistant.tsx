
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  X,
  Sparkles,
  Plus,
  Copy,
  Check,
  AlertCircle,
  ArrowUp,
} from "lucide-react";

const API_BASE =
  typeof window !== "undefined" &&
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com";

const ASTRA_LOGO = "/images/astra-ai-logo.png";

const suggestions = [
  "Tell me about Divyanshu",
  "What are his technical skills?",
  "Show me his projects",
  "Tell me about his experience",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

function AstraLogo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`astra-logo-wrapper ${className}`}>
      <img
        src={ASTRA_LOGO}
        alt="ASTRA AI robot"
        className="astra-logo-image"
        draggable={false}
      />
    </div>
  );
}

function normalizeMarkdown(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const welcomeMessage =
  "Hello! I'm ASTRA AI, your intelligent portfolio companion. ✨\n\nAsk me anything about Divyanshu's skills, projects, experience, education, or achievements.";

export default function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: welcomeMessage,
    },
  ]);

  const [lastFailedMessage, setLastFailedMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, error]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
    };
  }, []);

  async function sendMessage(messageText?: string) {
    const text = (messageText ?? input).trim();

    if (!text || loadingRef.current) return;

    const currentRequestId = ++requestIdRef.current;
    const controller = new AbortController();

    abortControllerRef.current = controller;
    loadingRef.current = true;

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");
    setLastFailedMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const responseText = await response.text();

      let data: any = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        throw new Error(
          `Invalid server response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Request failed (${response.status})`
        );
      }

      const reply =
        data?.reply ??
        data?.message ??
        data?.content ??
        data?.choices?.[0]?.message?.content;

      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error(
          "ASTRA AI returned an empty response."
        );
      }

      if (requestIdRef.current !== currentRequestId) {
        return;
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: normalizeMarkdown(reply),
        },
      ]);

      setLastFailedMessage("");
    } catch (err) {
      if (requestIdRef.current !== currentRequestId) {
        return;
      }

      if (
        err instanceof Error &&
        err.name === "AbortError"
      ) {
        return;
      }

      console.error("ASTRA AI error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setLastFailedMessage(text);
    } finally {
      if (requestIdRef.current === currentRequestId) {
        loadingRef.current = false;
        setLoading(false);
        abortControllerRef.current = null;
        inputRef.current?.focus();
      }
    }
  }

  function startNewChat() {
    requestIdRef.current += 1;

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    loadingRef.current = false;

    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
      },
    ]);

    setInput("");
    setError("");
    setLoading(false);
    setLastFailedMessage("");
    setCopiedIndex(null);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  async function copyMessage(
    content: string,
    index: number
  ) {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex((previous) =>
          previous === index ? null : previous
        );
      }, 1800);
    } catch (err) {
      console.error("Copy failed:", err);
      setError("Unable to copy. Please check clipboard permissions.");
    }
  }

  return (
    <>
      <style>{`
        @keyframes astraFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes astraBreathing {
          0%, 100% {
            box-shadow:
              0 0 12px rgba(34, 211, 238, 0.18),
              0 0 28px rgba(124, 58, 237, 0.12);
          }
          50% {
            box-shadow:
              0 0 24px rgba(34, 211, 238, 0.42),
              0 0 45px rgba(124, 58, 237, 0.24);
          }
        }

        @keyframes astraGlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes astraChatOpen {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes astraMessageIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes astraTyping {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @keyframes astraSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes astraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes astraShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .astra-logo-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: visible;
  border-radius: 22px;
  isolation: isolate;
  animation: astraFloat 4s ease-in-out infinite;
}

        .astra-logo-wrapper::before {
          content: "";
          position: absolute;
          inset: -12%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(34, 211, 238, 0.25),
            rgba(124, 58, 237, 0.14),
            transparent 70%
          );
          filter: blur(12px);
          animation: astraGlow 3s ease-in-out infinite;
          pointer-events: none;
        }

    .astra-logo-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  border-radius: 22px;
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.18));
  transition:
    transform 0.35s ease,
    filter 0.35s ease;
}

        .astra-logo-wrapper:hover .astra-logo-image {
  transform: scale(1.06);
  filter: drop-shadow(0 0 14px rgba(34, 211, 238, 0.4));
}

        .astra-floating-button {
          -webkit-animation:
            astraFloat 4s ease-in-out infinite,
            astraBreathing 3.5s ease-in-out infinite;
          animation:
            astraFloat 4s ease-in-out infinite,
            astraBreathing 3.5s ease-in-out infinite;
          will-change: transform, box-shadow;
          transition: transform 0.3s ease;
        }

        .astra-floating-button:hover {
          transform: scale(1.08);
        }

        .astra-floating-button:active {
          transform: scale(0.94);
        }

        .astra-chat-window {
          animation: astraChatOpen 0.38s
            cubic-bezier(0.16, 1, 0.3, 1) both;
          transform-origin: bottom right;
        }

        .astra-chat-header {
          position: relative;
          overflow: hidden;
        }

        .astra-chat-header::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.07),
            transparent
          );
          animation: astraShimmer 6s linear infinite;
          pointer-events: none;
        }

        .astra-message {
          animation: astraMessageIn 0.35s
            cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .astra-message-avatar {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .astra-message-avatar:hover {
          transform: scale(1.08);
          box-shadow: 0 0 18px rgba(34, 211, 238, 0.22);
        }

        .astra-typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #67e8f9;
          animation: astraTyping 1.2s ease-in-out infinite;
        }

        .astra-typing-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .astra-typing-dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        .astra-input {
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .astra-input:focus {
          border-color: rgba(34, 211, 238, 0.6);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.08);
        }

        .astra-send-button {
          transition: transform 0.2s ease, opacity 0.2s ease,
            box-shadow 0.2s ease;
        }

        .astra-send-button:hover:not(:disabled) {
          transform: scale(1.06);
          box-shadow: 0 0 18px rgba(34, 211, 238, 0.25);
        }

        .astra-send-button:active:not(:disabled) {
          transform: scale(0.92);
        }

        .astra-suggestion {
          transition: background 0.2s ease, border-color 0.2s ease,
            transform 0.2s ease;
          animation: astraMessageIn 0.4s both;
        }

        .astra-suggestion:hover {
          transform: translateY(-2px);
          border-color: rgba(34, 211, 238, 0.45);
          background: rgba(34, 211, 238, 0.08);
        }

        .astra-chat-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .astra-chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .astra-chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.22);
          border-radius: 20px;
        }

        .astra-chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.35);
        }

        .astra-markdown {
          overflow-wrap: anywhere;
          line-height: 1.75;
        }

        .astra-markdown p {
          margin: 0 0 10px;
        }

        .astra-markdown p:last-child {
          margin-bottom: 0;
        }

        .astra-markdown ul,
        .astra-markdown ol {
          margin: 8px 0;
          padding-left: 22px;
        }

        .astra-markdown li {
          margin: 4px 0;
        }

        .astra-markdown h1,
        .astra-markdown h2,
        .astra-markdown h3 {
          margin: 12px 0 8px;
          font-weight: 700;
          color: #e2e8f0;
        }

        .astra-markdown h1 {
          font-size: 1.15rem;
        }

        .astra-markdown h2 {
          font-size: 1.05rem;
        }

        .astra-markdown h3 {
          font-size: 0.98rem;
        }

        .astra-markdown strong {
          color: #67e8f9;
          font-weight: 650;
        }

        .astra-markdown a {
          color: #67e8f9;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .astra-markdown code {
          padding: 2px 5px;
          border-radius: 5px;
          background: rgba(15, 23, 42, 0.8);
          color: #a5f3fc;
          font-size: 0.86em;
        }

        .astra-markdown pre {
          overflow-x: auto;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 10px;
          background: #080d19;
        }

        .astra-markdown pre code {
          padding: 0;
          background: transparent;
        }

        .astra-markdown blockquote {
          margin: 10px 0;
          padding-left: 12px;
          border-left: 2px solid #22d3ee;
          color: #94a3b8;
        }

        .astra-markdown table {
          display: block;
          max-width: 100%;
          overflow-x: auto;
          border-collapse: collapse;
        }

        .astra-markdown th,
        .astra-markdown td {
          padding: 7px 10px;
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .astra-markdown th {
          color: #67e8f9;
        }

        @media (max-width: 480px) {
          .astra-chat-window {
            right: 12px !important;
            bottom: 88px !important;
            width: calc(100vw - 24px) !important;
            height: min(620px, calc(100dvh - 112px)) !important;
            transform-origin: bottom center;
          }

          .astra-chat-header {
            padding: 14px !important;
          }

          .astra-chat-messages {
            padding: 14px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .astra-logo-wrapper,
          .astra-logo-wrapper::before,
          .astra-floating-button,
          .astra-chat-window,
          .astra-message,
          .astra-typing-dot,
          .astra-chat-header::after,
          .astra-suggestion {
            animation: none !important;
          }

          .astra-logo-image,
          .astra-suggestion,
          .astra-send-button {
            transition: none !important;
          }
        }

        /*
          Mobile animation compatibility:
          Re-enable ASTRA's visual animations on touch-sized screens.
          The !important declarations also protect these effects from
          broad global animation-reset rules in the main stylesheet.
        */
        @media (max-width: 768px) {
          .astra-logo-wrapper {
            -webkit-animation: astraFloat 4s ease-in-out infinite !important;
            animation: astraFloat 4s ease-in-out infinite !important;
            will-change: transform;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            backface-visibility: hidden;
          }

          .astra-logo-wrapper::before {
            -webkit-animation: astraGlow 3s ease-in-out infinite !important;
            animation: astraGlow 3s ease-in-out infinite !important;
            will-change: opacity, transform;
          }

          .astra-floating-button {
            -webkit-animation:
              astraFloat 4s ease-in-out infinite,
              astraBreathing 3.5s ease-in-out infinite !important;
            animation:
              astraFloat 4s ease-in-out infinite,
              astraBreathing 3.5s ease-in-out infinite !important;
            will-change: transform, box-shadow;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            backface-visibility: hidden;
            -webkit-tap-highlight-color: transparent;
          }

          .astra-chat-window {
            -webkit-animation: astraChatOpen 0.38s cubic-bezier(0.16, 1, 0.3, 1) both !important;
            animation: astraChatOpen 0.38s cubic-bezier(0.16, 1, 0.3, 1) both !important;
            will-change: transform, opacity;
          }

          .astra-chat-header::after {
            -webkit-animation: astraShimmer 6s linear infinite !important;
            animation: astraShimmer 6s linear infinite !important;
          }

          .astra-message,
          .astra-suggestion {
            -webkit-animation: astraMessageIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both !important;
            animation: astraMessageIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both !important;
          }

          .astra-typing-dot {
            -webkit-animation: astraTyping 1.2s ease-in-out infinite !important;
            animation: astraTyping 1.2s ease-in-out infinite !important;
          }

          .astra-typing-dot:nth-child(2) {
            animation-delay: 0.15s !important;
          }

          .astra-typing-dot:nth-child(3) {
            animation-delay: 0.3s !important;
          }
        }
      `}</style>

      {/* FLOATING ASTRA BUTTON */}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close ASTRA AI" : "Open ASTRA AI"}
        aria-expanded={isOpen}
        className="
          astra-floating-button
          fixed bottom-5 right-5 z-[9999]
          flex h-[82px] w-[82px]
          items-center justify-center
          rounded-full
          border border-cyan-300/30
          bg-gradient-to-br
          from-[#071827]
          via-[#10102b]
          to-[#24113c]
          shadow-[0_0_30px_rgba(34,211,238,0.18)]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-cyan-300
        "
      >
        {isOpen ? (
          <X
            size={30}
            className="text-cyan-100 transition-transform duration-300"
          />
        ) : (
          <>
            <AstraLogo className="h-[66px] w-[66px]" />

            <span
              className="
                absolute -right-1 -top-1
                flex h-6 w-6
                items-center justify-center
                rounded-full
                border border-cyan-300/40
                bg-cyan-400
                text-[#06121d]
                shadow-[0_0_14px_rgba(34,211,238,0.45)]
              "
            >
              <Sparkles size={13} />
            </span>
          </>
        )}
      </button>

      {/* CHAT WINDOW */}

      {isOpen && (
        <section
          ref={chatRef}
          aria-label="ASTRA AI Chat"
          className="
            astra-chat-window
            fixed bottom-[118px] right-5
            z-[9998]
            flex h-[min(690px,calc(100dvh-150px))]
            w-[min(440px,calc(100vw-32px))]
            flex-col overflow-hidden
            rounded-[24px]
            border border-cyan-300/15
            bg-[#080d19]
            shadow-[0_20px_90px_rgba(0,0,0,0.65)]
          "
        >
          {/* HEADER */}

          <header
            className="
              astra-chat-header
              flex shrink-0
              items-center justify-between
              border-b border-white/[0.07]
              bg-gradient-to-r
              from-[#101c32]
              via-[#111329]
              to-[#201334]
              px-5 py-4
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  astra-message-avatar
                  relative flex h-[66px] w-[66px]
                  items-center justify-center
                  rounded-2xl
                  border border-cyan-300/20
                  bg-[#07121f]
                  shadow-[0_0_20px_rgba(34,211,238,0.12)]
                "
              >
                <AstraLogo className="h-[58px] w-[58px]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold tracking-wide text-white">
                    ASTRA AI
                  </h2>

                  <Sparkles
                    size={14}
                    className="text-cyan-300 animate-[astraPulse_2.5s_ease-in-out_infinite]"
                  />
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span
                    className="
                      h-1.5 w-1.5 rounded-full
                      bg-emerald-400
                      shadow-[0_0_8px_rgba(52,211,153,0.5)]
                    "
                  />
                  AI Portfolio Assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startNewChat}
                aria-label="Start new chat"
                title="New chat"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl text-slate-400
                  transition-colors
                  hover:bg-white/[0.07]
                  hover:text-cyan-300
                "
              >
                <Plus size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                title="Close"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl text-slate-400
                  transition-colors
                  hover:bg-white/[0.07]
                  hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* MESSAGES */}

          <div
            className="
              astra-chat-scroll
              astra-chat-messages
              flex-1 overflow-y-auto
              px-5 py-5
            "
          >
            <div className="space-y-5">
              {messages.map((message, index) => {
                const isAssistant =
                  message.role === "assistant";

                return (
                  <div
                    key={`${index}-${message.role}`}
                    className={`
                      astra-message
                      flex items-start gap-2.5
                      ${isAssistant ? "justify-start" : "justify-end"}
                    `}
                    style={{
                      animationDelay: `${Math.min(index * 30, 180)}ms`,
                    }}
                  >
                    {isAssistant && (
                      <div
                        className="
                          astra-message-avatar
                          flex h-[46px] w-[46px]
                          shrink-0 items-center justify-center
                          rounded-xl
                          border border-cyan-300/15
                          bg-[#101a2b]
                        "
                      >
                        <AstraLogo className="h-[42px] w-[42px]" />
                      </div>
                    )}

                    <div
                      className={`
                        group relative min-w-0 max-w-[83%]
                        rounded-2xl px-4 py-3 text-[13px]
                        ${
                          isAssistant
                            ? `
                              rounded-tl-md
                              border border-white/[0.06]
                              bg-[#111827]
                              text-slate-300
                            `
                            : `
                              rounded-tr-md
                              border border-cyan-300/15
                              bg-gradient-to-br
                              from-[#0c3445]
                              to-[#17213b]
                              text-cyan-50
                            `
                        }
                      `}
                    >
                      {isAssistant ? (
                        <div className="astra-markdown">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}

                      {isAssistant && (
                        <button
                          type="button"
                          onClick={() =>
                            copyMessage(message.content, index)
                          }
                          aria-label="Copy AI response"
                          title="Copy response"
                          className="
                            mt-3 flex items-center gap-1.5
                            rounded-md text-[10px]
                            text-slate-500 opacity-0
                            transition-all
                            hover:text-cyan-300
                            group-hover:opacity-100
                            focus:opacity-100
                          "
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check size={12} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* TYPING ANIMATION */}

              {loading && (
                <div className="astra-message flex items-start gap-2.5">
                  <div
                    className="
                      astra-message-avatar
                      flex h-[46px] w-[46px]
                      shrink-0 items-center justify-center
                      rounded-xl
                      border border-cyan-300/15
                      bg-[#101a2b]
                    "
                  >
                    <AstraLogo className="h-[42px] w-[42px]" />
                  </div>

                  <div
                    className="
                      flex items-center gap-2
                      rounded-2xl rounded-tl-md
                      border border-white/[0.06]
                      bg-[#111827]
                      px-4 py-4
                    "
                  >
                    <span className="astra-typing-dot" />
                    <span className="astra-typing-dot" />
                    <span className="astra-typing-dot" />

                    <span className="ml-1 text-[11px] text-slate-500">
                      ASTRA is thinking
                    </span>
                  </div>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div
                  className="
                    astra-message
                    flex items-start gap-2
                    rounded-xl
                    border border-red-400/15
                    bg-red-400/[0.06]
                    p-3 text-[12px]
                    text-red-300
                  "
                >
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <div className="min-w-0">
                    <p className="font-medium">
                      Unable to connect to ASTRA AI
                    </p>

                    <p className="mt-1 break-words text-red-300/75">
                      {error}
                    </p>

                    {lastFailedMessage && (
                      <button
                        type="button"
                        onClick={() =>
                          sendMessage(lastFailedMessage)
                        }
                        disabled={loading}
                        className="
                          mt-2 font-semibold
                          text-cyan-300
                          hover:text-cyan-200
                          disabled:opacity-50
                        "
                      >
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SUGGESTIONS */}

              {messages.length === 1 &&
                !loading &&
                !error && (
                  <div className="astra-message pt-1">
                    <div
                      className="
                        mb-3 flex items-center gap-2
                        text-[11px] font-medium
                        text-slate-500
                      "
                    >
                      <Sparkles
                        size={13}
                        className="text-cyan-400"
                      />
                      Explore the portfolio
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {suggestions.map(
                        (suggestion, index) => (
                          <button
                            key={suggestion}
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              sendMessage(suggestion)
                            }
                            className="
                              astra-suggestion
                              rounded-xl
                              border border-white/[0.08]
                              bg-white/[0.025]
                              px-3 py-2
                              text-left text-[11px]
                              text-slate-300
                              disabled:opacity-50
                            "
                            style={{
                              animationDelay: `${index * 60}ms`,
                            }}
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT AREA */}

          <footer
            className="
              shrink-0
              border-t border-white/[0.07]
              bg-[#0b1120]
              px-4 pb-4 pt-3
            "
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="
                flex items-center gap-2
                rounded-2xl
                border border-white/[0.08]
                bg-[#111827]
                p-1.5
              "
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask ASTRA anything..."
                aria-label="Message ASTRA AI"
                disabled={loading}
                className="
                  astra-input
                  min-w-0 flex-1
                  border border-transparent
                  bg-transparent
                  px-3 py-2.5
                  text-[13px] text-white
                  outline-none
                  placeholder:text-slate-500
                  disabled:opacity-50
                "
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="
                  astra-send-button
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-cyan-400 to-blue-500
                  text-[#06121d]
                  disabled:cursor-not-allowed
                  disabled:opacity-35
                "
              >
                {loading ? (
                  <span
                    className="
                      h-4 w-4 rounded-full
                      border-2 border-[#06121d]/30
                      border-t-[#06121d]
                      animate-[astraSpin_0.8s_linear_infinite]
                    "
                  />
                ) : (
                  <ArrowUp size={19} />
                )}
              </button>
            </form>

            {/* FOOTER */}

            <div
              className="
                mt-3 flex items-center
                justify-center gap-1.5
                text-[10px] text-slate-600
              "
            >
              <Bot size={11} />
              <span>Powered by ASTRA AI</span>
              <span className="text-slate-700">·</span>
              <span>Designed by Divyanshu Singh</span>
            </div>
          </footer>
        </section>
      )}
    </>
  );
}
