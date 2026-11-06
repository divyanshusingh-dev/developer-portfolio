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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  History,
  Download,
  Square,
  RotateCcw,
  Trash2,
  Clock3,
  MessageSquare,
} from "lucide-react";

const API_BASE =
  typeof window !== "undefined" &&
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://developer-portfolio-8.onrender.com";

const ASTRA_LOGO = "/images/astra-ai-logo.png";
const CHAT_STORAGE_KEY = "astra_ai_chat_history_v1";

const suggestions = [
  "Tell me about Divyanshu",
  "What are his technical skills?",
  "Show me his projects",
  "Tell me about his experience",
];

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

function AstraLogo({ className = "" }: { className?: string }) {
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

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

function createSessionTitle(messages: Message[]) {
  const firstUserMessage = messages.find((message) => message.role === "user");
  return firstUserMessage?.content.slice(0, 42) || "New conversation";
}

function getSmartFollowUps(messages: Message[]) {
  const lastAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.content.toLowerCase() || "";

  if (lastAssistant.includes("project")) {
    return ["Which project is most impressive?", "What technologies were used?", "Can I see the GitHub links?"];
  }
  if (lastAssistant.includes("skill") || lastAssistant.includes("technology")) {
    return ["Which skills is he improving?", "What projects demonstrate these skills?", "What is his development stack?"];
  }
  if (lastAssistant.includes("education") || lastAssistant.includes("bca")) {
    return ["What are his academic achievements?", "Which certifications does he have?", "What are his career goals?"];
  }
  if (lastAssistant.includes("experience") || lastAssistant.includes("design")) {
    return ["What design tools does he use?", "What type of work has he completed?", "How can I contact him?"];
  }
  return ["Tell me more about his work", "What makes his portfolio unique?", "How can I contact Divyanshu?"];
}

const welcomeMessage =
  "Hello! I'm ASTRA AI, your intelligent portfolio companion. ✨\n\nAsk me anything about Divyanshu's skills, projects, experience, education, or achievements.";

export default function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState("");
  const [lastUserPrompt, setLastUserPrompt] = useState("");
  const [followUps, setFollowUps] = useState<string[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: welcomeMessage,
      timestamp: Date.now(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setChatHistory(parsed);
      }
    } catch (err) {
      console.error("Unable to load ASTRA chat history:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (err) {
      console.error("Unable to save ASTRA chat history:", err);
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, error]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 350);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        stopListening();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
      recognitionRef.current?.stop?.();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function saveCurrentChat(nextMessages: Message[]) {
    if (nextMessages.length <= 1) return;

    const id = activeSessionId || `astra-${Date.now()}`;
    const session: ChatSession = {
      id,
      title: createSessionTitle(nextMessages),
      messages: nextMessages,
      updatedAt: Date.now(),
    };

    setActiveSessionId(id);
    setChatHistory((previous) => {
      const withoutCurrent = previous.filter((item) => item.id !== id);
      return [session, ...withoutCurrent].slice(0, 30);
    });
  }

  function stopGenerating() {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    loadingRef.current = false;
    setLoading(false);
    setError("");
  }

  function stopListening() {
    recognitionRef.current?.stop?.();
    recognitionRef.current = null;
    setIsListening(false);
  }

  function startVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript.trim());
    };

    recognition.onerror = (event: any) => {
      setError(
        event.error === "not-allowed"
          ? "Microphone permission was denied."
          : `Voice input error: ${event.error}`
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function speakMessage(content: string) {
    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const plainText = content
      .replace(/```[\s\S]*?```/g, " Code block omitted. ")
      .replace(/[#*_>`[\]()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setVoiceEnabled(false);
    utterance.onerror = () => setVoiceEnabled(false);
    setVoiceEnabled(true);
    window.speechSynthesis.speak(utterance);
  }

  function toggleVoice(content: string) {
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
      setVoiceEnabled(false);
      return;
    }
    speakMessage(content);
  }

  async function sendMessage(messageText?: string, retry = false, baseMessages?: Message[]) {
    const text = (messageText ?? input).trim();
    if (!text || loadingRef.current) return;

    const currentRequestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    loadingRef.current = true;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = retry
      ? (baseMessages ?? messages)
      : [...messages, userMessage];

    if (!retry) {
      setMessages(updatedMessages);
      setInput("");
      setLastUserPrompt(text);
    }

    setLoading(true);
    setError("");
    setLastFailedMessage("");
    setFollowUps([]);

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const responseText = await response.text();
      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(`Invalid server response (${response.status}).`);
      }

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || `Request failed (${response.status})`
        );
      }

      const reply =
        data?.reply ??
        data?.message ??
        data?.content ??
        data?.choices?.[0]?.message?.content;

      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error("ASTRA AI returned an empty response.");
      }

      if (requestIdRef.current !== currentRequestId) return;

      const assistantMessage: Message = {
        role: "assistant",
        content: normalizeMarkdown(reply),
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveCurrentChat(finalMessages);
      setFollowUps(getSmartFollowUps(finalMessages));
      setLastFailedMessage("");
    } catch (err) {
      if (requestIdRef.current !== currentRequestId) return;
      if (err instanceof Error && err.name === "AbortError") return;

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

  function regenerateResponse() {
    if (!lastUserPrompt || loadingRef.current) return;

    const lastUserIndex = [...messages]
      .map((message) => message.role)
      .lastIndexOf("user");

    if (lastUserIndex < 0) return;

    const historyWithoutLastAnswer = messages.slice(0, lastUserIndex + 1);
    setMessages(historyWithoutLastAnswer);
    setFollowUps([]);
    setError("");
    sendMessage(lastUserPrompt, true, historyWithoutLastAnswer);
  }

  function startNewChat() {
    stopGenerating();
    stopListening();
    window.speechSynthesis?.cancel();
    setVoiceEnabled(false);

    const freshMessages: Message[] = [
      {
        role: "assistant",
        content: welcomeMessage,
        timestamp: Date.now(),
      },
    ];

    setMessages(freshMessages);
    setInput("");
    setError("");
    setLastFailedMessage("");
    setLastUserPrompt("");
    setFollowUps([]);
    setCopiedIndex(null);
    setActiveSessionId(null);
    setShowHistory(false);

    window.setTimeout(() => inputRef.current?.focus(), 100);
  }

  function openHistorySession(session: ChatSession) {
    stopGenerating();
    setMessages(session.messages);
    setActiveSessionId(session.id);
    setLastUserPrompt(
      [...session.messages].reverse().find((message) => message.role === "user")?.content || ""
    );
    setFollowUps(getSmartFollowUps(session.messages));
    setError("");
    setShowHistory(false);
  }

  function deleteHistorySession(id: string) {
    setChatHistory((previous) => previous.filter((session) => session.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      startNewChat();
    }
  }

  async function copyMessage(content: string, index: number) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      window.setTimeout(() => {
        setCopiedIndex((previous) => (previous === index ? null : previous));
      }, 1800);
    } catch (err) {
      console.error("Copy failed:", err);
      setError("Unable to copy. Please check clipboard permissions.");
    }
  }

  function downloadTextFile() {
    const content = messages
      .map((message) => {
        const sender = message.role === "assistant" ? "ASTRA AI" : "You";
        return `[${formatDate(message.timestamp)} ${formatTime(message.timestamp)}] ${sender}\n${message.content}`;
      })
      .join("\n\n------------------------------\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `astra-chat-${Date.now()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function downloadPdf() {
    if (!messages.length) {
      setError("There are no messages to export yet.");
      return;
    }

    const printableMessages = messages
      .map((message, index) => {
        const isAssistant = message.role === "assistant";
        const sender = isAssistant ? "ASTRA AI" : "YOU";
        const safeContent = escapeHtml(message.content)
          .replace(
            /(https?:\/\/[^\s<]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
          )
          .replace(/\n/g, "<br>");

        return `
          <article class="message ${isAssistant ? "assistant" : "user"}">
            <div class="message-topline">
              <div class="sender">
                <span class="sender-mark ${isAssistant ? "ai-mark" : "user-mark"}">${isAssistant ? "A" : "Y"}</span>
                <span>${sender}</span>
              </div>
              <time datetime="${new Date(message.timestamp).toISOString()}">
                ${formatDate(message.timestamp)} · ${formatTime(message.timestamp)}
              </time>
            </div>
            <div class="message-content">${safeContent}</div>
            <div class="message-index">MESSAGE ${String(index + 1).padStart(2, "0")}</div>
          </article>
        `;
      })
      .join("");

    const userCount = messages.filter((message) => message.role === "user").length;
    const assistantCount = messages.filter((message) => message.role === "assistant").length;
    const firstTimestamp = messages[0]?.timestamp ?? Date.now();
    const lastTimestamp = messages[messages.length - 1]?.timestamp ?? Date.now();
    const reportDate = formatDate(Date.now());
    const logoUrl = new URL(ASTRA_LOGO, window.location.origin).href;
    const reportTitle = createSessionTitle(messages);

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) {
      setError("Please allow pop-ups to export the PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>ASTRA AI - Conversation Report</title>
          <style>
            :root {
              color-scheme: light;
              --navy: #14243b;
              --navy-deep: #0b1729;
              --cyan: #1597b5;
              --ink: #26364a;
              --muted: #718096;
              --line: #e4eaf1;
              --soft: #f4f7fa;
            }
            * { box-sizing: border-box; }
            html { background: #edf1f5; }
            body {
              margin: 0; padding: 34px 18px; background: #edf1f5;
              color: var(--ink); font-family: Inter, "Segoe UI", Arial, sans-serif;
              font-size: 10.5pt; line-height: 1.65;
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .report {
              width: 100%; max-width: 850px; margin: 0 auto; padding: 42px 48px 36px;
              background: #fff; box-shadow: 0 12px 45px rgba(15,35,60,.10);
            }
            .brand-bar {
              display: flex; align-items: center; justify-content: space-between;
              gap: 18px; padding-bottom: 22px; border-bottom: 1px solid var(--line);
            }
            .brand { display: flex; align-items: center; gap: 13px; min-width: 0; }
            .brand-logo {
              width: 48px; height: 48px; object-fit: contain; border-radius: 12px;
              background: var(--navy-deep); padding: 4px;
            }
            .brand-name {
              color: var(--navy); font-size: 17pt; font-weight: 800;
              letter-spacing: .11em; line-height: 1.1;
            }
            .brand-subtitle {
              margin-top: 4px; color: var(--muted); font-size: 7.5pt;
              font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
            }
            .document-tag {
              flex-shrink: 0; padding: 7px 11px; border: 1px solid #d5e8ef;
              border-radius: 5px; background: #f0f8fb; color: #176b87;
              font-size: 7pt; font-weight: 800; letter-spacing: .12em;
            }
            .intro { padding: 29px 0 23px; }
            .eyebrow {
              margin: 0 0 7px; color: var(--cyan); font-size: 7.5pt;
              font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
            }
            h1 {
              margin: 0; color: var(--navy); font-size: 25pt; font-weight: 750;
              letter-spacing: -.045em; line-height: 1.18; overflow-wrap: anywhere;
            }
            .intro-description {
              max-width: 580px; margin: 9px 0 0; color: var(--muted); font-size: 9.5pt;
            }
            .summary-grid {
              display: grid; grid-template-columns: repeat(3, 1fr);
              gap: 10px; margin: 0 0 26px;
            }
            .summary-card {
              min-height: 73px; padding: 13px 15px; border: 1px solid var(--line);
              border-radius: 8px; background: #fbfcfd;
            }
            .summary-label {
              color: var(--muted); font-size: 7pt; font-weight: 700;
              letter-spacing: .09em; text-transform: uppercase;
            }
            .summary-value {
              margin-top: 4px; color: var(--navy); font-size: 16pt;
              font-weight: 750; line-height: 1.2;
            }
            .section-heading {
              display: flex; align-items: center; justify-content: space-between;
              gap: 12px; margin: 0 0 13px; padding-bottom: 9px;
              border-bottom: 1px solid var(--line);
            }
            .section-heading h2 { margin: 0; color: var(--navy); font-size: 12pt; font-weight: 750; }
            .section-heading span { color: var(--muted); font-size: 7pt; font-weight: 700; letter-spacing: .08em; }
            .message {
              position: relative; margin: 0 0 13px; padding: 15px 17px 13px;
              border: 1px solid var(--line); border-radius: 8px; background: #fff;
              page-break-inside: avoid; break-inside: avoid;
            }
            .message.assistant { border-left: 3px solid #1597b5; background: #f8fbfd; }
            .message.user { border-left: 3px solid #64748b; background: #fff; }
            .message-topline {
              display: flex; align-items: center; justify-content: space-between;
              gap: 12px; margin-bottom: 9px;
            }
            .sender {
              display: flex; align-items: center; gap: 8px; color: var(--navy);
              font-size: 8pt; font-weight: 800; letter-spacing: .08em;
            }
            .sender-mark {
              display: inline-flex; width: 23px; height: 23px; align-items: center;
              justify-content: center; border-radius: 6px; font-size: 8pt; font-weight: 800;
            }
            .ai-mark { background: #e2f4f8; color: #126c86; }
            .user-mark { background: #e9edf2; color: #42536a; }
            time { color: var(--muted); font-size: 7.5pt; }
            .message-content {
              color: #344256; font-size: 9.5pt; line-height: 1.75;
              overflow-wrap: anywhere; white-space: normal;
            }
            .message-content a { color: #087d9d; text-decoration: underline; overflow-wrap: anywhere; }
            .message-index {
              margin-top: 11px; color: #a0acba; font-size: 6pt;
              font-weight: 700; letter-spacing: .12em; text-align: right;
            }
            .report-footer {
              display: flex; justify-content: space-between; gap: 16px;
              margin-top: 27px; padding-top: 13px; border-top: 1px solid var(--line);
              color: #8793a2; font-size: 7pt;
            }
            .report-footer strong { color: #526176; font-weight: 700; }
            @page { size: A4; margin: 15mm 14mm 16mm; }
            @media print {
              html, body { background: #fff; }
              body { padding: 0; }
              .report { max-width: none; margin: 0; padding: 0; box-shadow: none; }
              .brand-bar, .intro, .summary-grid, .section-heading, .report-footer {
                break-inside: avoid;
              }
              .message { page-break-inside: avoid; break-inside: avoid; }
              a { color: #087d9d !important; }
            }
            @media screen and (max-width: 650px) {
              body { padding: 0; }
              .report { padding: 25px 20px; }
              .summary-grid { grid-template-columns: 1fr 1fr; }
              .document-tag { display: none; }
              h1 { font-size: 21pt; }
            }
          </style>
        </head>
        <body>
          <main class="report">
            <header class="brand-bar">
              <div class="brand">
                <img class="brand-logo" src="${logoUrl}" alt="ASTRA AI logo" />
                <div>
                  <div class="brand-name">ASTRA AI</div>
                  <div class="brand-subtitle">Intelligent Portfolio Assistant</div>
                </div>
              </div>
              <div class="document-tag">CONVERSATION REPORT</div>
            </header>
            <section class="intro">
              <p class="eyebrow">Conversation transcript</p>
              <h1>${escapeHtml(reportTitle)}</h1>
              <p class="intro-description">
                A formatted record of the conversation with ASTRA AI, prepared for easy reading, sharing and archiving.
              </p>
            </section>
            <section class="summary-grid" aria-label="Conversation summary">
              <div class="summary-card">
                <div class="summary-label">Total messages</div>
                <div class="summary-value">${messages.length}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">Your messages</div>
                <div class="summary-value">${userCount}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">AI responses</div>
                <div class="summary-value">${assistantCount}</div>
              </div>
            </section>
            <div class="section-heading">
              <h2>Conversation details</h2>
              <span>${formatDate(firstTimestamp)} ${firstTimestamp !== lastTimestamp ? "— " + formatDate(lastTimestamp) : ""}</span>
            </div>
            <section class="conversation">${printableMessages}</section>
            <footer class="report-footer">
              <span><strong>ASTRA AI</strong> · Designed by Divyanshu Singh</span>
              <span>Generated on ${reportDate}</span>
            </footer>
          </main>
          <script>
            window.addEventListener("load", function () {
              const logo = document.querySelector(".brand-logo");
              const printWhenReady = function () {
                setTimeout(function () { window.focus(); window.print(); }, 350);
              };
              if (logo && !logo.complete) {
                logo.addEventListener("load", printWhenReady, { once: true });
                logo.addEventListener("error", printWhenReady, { once: true });
                setTimeout(printWhenReady, 1500);
              } else {
                printWhenReady();
              }
            });
          </script>
        </body>
      </html>`);
    printWindow.document.close();
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return (
    <>
      <style>{`
        @keyframes astraFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes astraBreathing {
          0%, 100% { box-shadow: 0 0 12px rgba(34,211,238,.18), 0 0 28px rgba(124,58,237,.12); }
          50% { box-shadow: 0 0 24px rgba(34,211,238,.42), 0 0 45px rgba(124,58,237,.24); }
        }
        @keyframes astraGlow {
          0%, 100% { opacity: .45; transform: scale(.96); }
          50% { opacity: .9; transform: scale(1.05); }
        }
        @keyframes astraChatOpen {
          from { opacity: 0; transform: translateY(22px) scale(.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes astraMessageIn {
          from { opacity: 0; transform: translateY(12px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes astraTyping {
          0%, 60%, 100% { transform: translateY(0); opacity: .4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes astraSpin { to { transform: rotate(360deg); } }
        @keyframes astraPulse {
          0%, 100% { transform: scale(1); opacity: .75; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes astraShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .astra-logo-wrapper {
          position: relative; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; overflow: visible;
          border-radius: 22px; isolation: isolate;
          animation: astraFloat 4s ease-in-out infinite;
        }
        .astra-logo-wrapper::before {
          content: ""; position: absolute; inset: -12%; border-radius: 50%;
          background: radial-gradient(circle, rgba(34,211,238,.25), rgba(124,58,237,.14), transparent 70%);
          filter: blur(12px); animation: astraGlow 3s ease-in-out infinite;
          pointer-events: none;
        }
        .astra-logo-image {
          position: relative; z-index: 1; width: 100%; height: 100%;
          object-fit: contain; user-select: none; border-radius: 22px;
          filter: drop-shadow(0 0 8px rgba(34,211,238,.18));
          transition: transform .35s ease, filter .35s ease;
        }
        .astra-logo-wrapper:hover .astra-logo-image {
          transform: scale(1.06); filter: drop-shadow(0 0 14px rgba(34,211,238,.4));
        }
        .astra-floating-button {
          -webkit-animation: astraFloat 4s ease-in-out infinite, astraBreathing 3.5s ease-in-out infinite;
          animation: astraFloat 4s ease-in-out infinite, astraBreathing 3.5s ease-in-out infinite;
          will-change: transform, box-shadow; transition: transform .3s ease;
        }
        .astra-floating-button:hover { transform: scale(1.08); }
        .astra-floating-button:active { transform: scale(.94); }
        .astra-chat-window {
          animation: astraChatOpen .38s cubic-bezier(.16,1,.3,1) both;
          transform-origin: bottom right;
        }
        .astra-chat-header { position: relative; overflow: hidden; }
        .astra-chat-header::after {
          content: ""; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
          animation: astraShimmer 6s linear infinite; pointer-events: none;
        }
        .astra-message { animation: astraMessageIn .35s cubic-bezier(.16,1,.3,1) both; }
        .astra-message-avatar { transition: transform .25s ease, box-shadow .25s ease; }
        .astra-message-avatar:hover { transform: scale(1.08); box-shadow: 0 0 18px rgba(34,211,238,.22); }
        .astra-typing-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #67e8f9;
          animation: astraTyping 1.2s ease-in-out infinite;
        }
        .astra-typing-dot:nth-child(2) { animation-delay: .15s; }
        .astra-typing-dot:nth-child(3) { animation-delay: .3s; }
        .astra-input { transition: border-color .25s ease, box-shadow .25s ease; }
        .astra-input:focus { border-color: rgba(34,211,238,.6); box-shadow: 0 0 0 3px rgba(34,211,238,.08); }
        .astra-send-button { transition: transform .2s ease, opacity .2s ease, box-shadow .2s ease; }
        .astra-send-button:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 0 18px rgba(34,211,238,.25); }
        .astra-send-button:active:not(:disabled) { transform: scale(.92); }
        .astra-suggestion {
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
          animation: astraMessageIn .4s both;
        }
        .astra-suggestion:hover {
          transform: translateY(-2px); border-color: rgba(34,211,238,.45);
          background: rgba(34,211,238,.08);
        }
        .astra-chat-scroll::-webkit-scrollbar { width: 5px; }
        .astra-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .astra-chat-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,.22); border-radius: 20px; }
        .astra-chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,.35); }
        .astra-markdown { overflow-wrap: anywhere; line-height: 1.75; }
        .astra-markdown p { margin: 0 0 10px; }
        .astra-markdown p:last-child { margin-bottom: 0; }
        .astra-markdown ul, .astra-markdown ol { margin: 8px 0; padding-left: 22px; }
        .astra-markdown li { margin: 4px 0; }
        .astra-markdown h1, .astra-markdown h2, .astra-markdown h3 {
          margin: 12px 0 8px; font-weight: 700; color: #e2e8f0;
        }
        .astra-markdown h1 { font-size: 1.15rem; }
        .astra-markdown h2 { font-size: 1.05rem; }
        .astra-markdown h3 { font-size: .98rem; }
        .astra-markdown strong { color: #67e8f9; font-weight: 650; }
        .astra-markdown a { color: #67e8f9; text-decoration: underline; text-underline-offset: 3px; }
        .astra-markdown code { padding: 2px 5px; border-radius: 5px; background: rgba(15,23,42,.8); color: #a5f3fc; font-size: .86em; }
        .astra-markdown pre { overflow-x: auto; padding: 12px; margin: 10px 0; border: 1px solid rgba(148,163,184,.15); border-radius: 10px; background: #080d19; }
        .astra-markdown pre code { padding: 0; background: transparent; }
        .astra-markdown blockquote { margin: 10px 0; padding-left: 12px; border-left: 2px solid #22d3ee; color: #94a3b8; }
        .astra-markdown table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
        .astra-markdown th, .astra-markdown td { padding: 7px 10px; border: 1px solid rgba(148,163,184,.18); }
        .astra-markdown th { color: #67e8f9; }
        .astra-tool-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          min-height: 34px; border: 1px solid rgba(148,163,184,.13);
          border-radius: 10px; padding: 0 10px; color: #94a3b8;
          background: rgba(255,255,255,.025); font-size: 11px;
          transition: all .2s ease;
        }
        .astra-tool-button:hover { color: #67e8f9; border-color: rgba(34,211,238,.35); background: rgba(34,211,238,.06); }
        .astra-tool-button:disabled { opacity: .4; cursor: not-allowed; }
        .astra-timestamp { font-size: 9px; color: #64748b; margin-top: 7px; text-align: right; }
        .astra-history-item { transition: background .2s ease; }
        .astra-history-item:hover { background: rgba(34,211,238,.07); }
        @media (max-width: 480px) {
          .astra-chat-window {
            right: 12px !important; bottom: 88px !important;
            width: calc(100vw - 24px) !important;
            height: min(620px, calc(100dvh - 112px)) !important;
            transform-origin: bottom center;
          }
          .astra-chat-header { padding: 14px !important; }
          .astra-chat-messages { padding: 14px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .astra-logo-wrapper, .astra-logo-wrapper::before, .astra-floating-button,
          .astra-chat-window, .astra-message, .astra-typing-dot,
          .astra-chat-header::after, .astra-suggestion { animation: none !important; }
          .astra-logo-image, .astra-suggestion, .astra-send-button { transition: none !important; }
        }
        @media (max-width: 768px) {
          .astra-logo-wrapper {
            -webkit-animation: astraFloat 4s ease-in-out infinite !important;
            animation: astraFloat 4s ease-in-out infinite !important;
            will-change: transform; -webkit-transform: translateZ(0);
            transform: translateZ(0); backface-visibility: hidden;
          }
          .astra-logo-wrapper::before {
            -webkit-animation: astraGlow 3s ease-in-out infinite !important;
            animation: astraGlow 3s ease-in-out infinite !important;
            will-change: opacity, transform;
          }
          .astra-floating-button {
            -webkit-animation: astraFloat 4s ease-in-out infinite, astraBreathing 3.5s ease-in-out infinite !important;
            animation: astraFloat 4s ease-in-out infinite, astraBreathing 3.5s ease-in-out infinite !important;
            will-change: transform, box-shadow; -webkit-transform: translateZ(0);
            transform: translateZ(0); backface-visibility: hidden;
            -webkit-tap-highlight-color: transparent;
          }
          .astra-chat-window {
            -webkit-animation: astraChatOpen .38s cubic-bezier(.16,1,.3,1) both !important;
            animation: astraChatOpen .38s cubic-bezier(.16,1,.3,1) both !important;
            will-change: transform, opacity;
          }
          .astra-chat-header::after {
            -webkit-animation: astraShimmer 6s linear infinite !important;
            animation: astraShimmer 6s linear infinite !important;
          }
          .astra-message, .astra-suggestion {
            -webkit-animation: astraMessageIn .35s cubic-bezier(.16,1,.3,1) both !important;
            animation: astraMessageIn .35s cubic-bezier(.16,1,.3,1) both !important;
          }
          .astra-typing-dot { -webkit-animation: astraTyping 1.2s ease-in-out infinite !important; animation: astraTyping 1.2s ease-in-out infinite !important; }
          .astra-typing-dot:nth-child(2) { animation-delay: .15s !important; }
          .astra-typing-dot:nth-child(3) { animation-delay: .3s !important; }
        }
      `}</style>

      {/* FLOATING ASTRA BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close ASTRA AI" : "Open ASTRA AI"}
        aria-expanded={isOpen}
        className="astra-floating-button fixed bottom-5 right-5 z-[9999] flex h-[82px] w-[82px] items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-br from-[#071827] via-[#10102b] to-[#24113c] shadow-[0_0_30px_rgba(34,211,238,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        {isOpen ? (
          <X size={30} className="text-cyan-100 transition-transform duration-300" />
        ) : (
          <>
            <AstraLogo className="h-[66px] w-[66px]" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400 text-[#06121d] shadow-[0_0_14px_rgba(34,211,238,0.45)]">
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
          className="astra-chat-window fixed bottom-[118px] right-5 z-[9998] flex h-[min(690px,calc(100dvh-150px))] w-[min(440px,calc(100vw-32px))] flex-col overflow-hidden rounded-[24px] border border-cyan-300/15 bg-[#080d19] shadow-[0_20px_90px_rgba(0,0,0,0.65)]"
        >
          {/* HEADER */}
          <header className="astra-chat-header flex shrink-0 items-center justify-between border-b border-white/[0.07] bg-gradient-to-r from-[#101c32] via-[#111329] to-[#201334] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="astra-message-avatar relative flex h-[66px] w-[66px] items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#07121f] shadow-[0_0_20px_rgba(34,211,238,0.12)]">
                <AstraLogo className="h-[58px] w-[58px]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold tracking-wide text-white">ASTRA AI</h2>
                  <Sparkles size={14} className="animate-[astraPulse_2.5s_ease-in-out_infinite] text-cyan-300" />
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  AI Portfolio Assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setShowHistory((value) => !value)} aria-label="Chat history" title="Chat history" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-cyan-300">
                <History size={17} />
              </button>
              <button type="button" onClick={downloadTextFile} aria-label="Export chat as text" title="Export TXT" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-cyan-300">
                <Download size={17} />
              </button>
              <button type="button" onClick={startNewChat} aria-label="Start new chat" title="New chat" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-cyan-300">
                <Plus size={18} />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" title="Close" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white">
                <X size={18} />
              </button>
            </div>
          </header>

          {/* HISTORY PANEL */}
          {showHistory && (
            <div className="max-h-56 shrink-0 overflow-y-auto border-b border-white/[0.07] bg-[#0c1424] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-200">Recent conversations</span>
                <button type="button" onClick={() => setShowHistory(false)} className="text-[10px] text-slate-500 hover:text-white">Close</button>
              </div>
              {chatHistory.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">Your saved conversations will appear here.</p>
              ) : (
                <div className="space-y-1">
                  {chatHistory.map((session) => (
                    <div key={session.id} className="astra-history-item flex items-center gap-2 rounded-lg px-2 py-2">
                      <button type="button" onClick={() => openHistorySession(session)} className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-xs text-slate-200">{session.title}</span>
                        <span className="mt-1 block text-[10px] text-slate-500">{formatDate(session.updatedAt)} · {formatTime(session.updatedAt)}</span>
                      </button>
                      <button type="button" onClick={() => deleteHistorySession(session.id)} aria-label="Delete conversation" title="Delete" className="rounded-md p-1.5 text-slate-500 hover:bg-red-400/10 hover:text-red-300">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES */}
          <div className="astra-chat-scroll astra-chat-messages flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-5">
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant";
                return (
                  <div key={`${index}-${message.role}-${message.timestamp}`} className={`astra-message flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`} style={{ animationDelay: `${Math.min(index * 30, 180)}ms` }}>
                    {isAssistant && (
                      <div className="astra-message-avatar flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#101a2b]">
                        <AstraLogo className="h-[42px] w-[42px]" />
                      </div>
                    )}

                    <div className={`group relative min-w-0 max-w-[83%] rounded-2xl px-4 py-3 text-[13px] ${isAssistant ? "rounded-tl-md border border-white/[0.06] bg-[#111827] text-slate-300" : "rounded-tr-md border border-cyan-300/15 bg-gradient-to-br from-[#0c3445] to-[#17213b] text-cyan-50"}`}>
                      {isAssistant ? (
                        <div className="astra-markdown">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      )}

                      <div className="astra-timestamp flex items-center justify-end gap-1">
                        <Clock3 size={9} />
                        {formatTime(message.timestamp)}
                      </div>

                      {isAssistant && (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <button type="button" onClick={() => copyMessage(message.content, index)} aria-label="Copy AI response" title="Copy response" className="flex items-center gap-1.5 rounded-md text-[10px] text-slate-500 transition-all hover:text-cyan-300 focus:opacity-100">
                            {copiedIndex === index ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                          </button>
                          <button type="button" onClick={() => toggleVoice(message.content)} title={voiceEnabled ? "Stop voice" : "Listen to response"} className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-cyan-300">
                            {voiceEnabled ? <><VolumeX size={12} /> Stop audio</> : <><Volume2 size={12} /> Listen</>}
                          </button>
                          {index === messages.length - 1 && lastUserPrompt && (
                            <button type="button" onClick={regenerateResponse} disabled={loading} title="Regenerate response" className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-cyan-300 disabled:opacity-40">
                              <RotateCcw size={12} /> Regenerate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* TYPING ANIMATION */}
              {loading && (
                <div className="astra-message flex items-start gap-2.5">
                  <div className="astra-message-avatar flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#101a2b]">
                    <AstraLogo className="h-[42px] w-[42px]" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-white/[0.06] bg-[#111827] px-4 py-4">
                    <span className="astra-typing-dot" />
                    <span className="astra-typing-dot" />
                    <span className="astra-typing-dot" />
                    <span className="ml-1 text-[11px] text-slate-500">ASTRA is thinking</span>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="astra-message flex items-start gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.06] p-3 text-[12px] text-red-300">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">Unable to connect to ASTRA AI</p>
                    <p className="mt-1 break-words text-red-300/75">{error}</p>
                    {lastFailedMessage && (
                      <button type="button" onClick={() => sendMessage(lastFailedMessage)} disabled={loading} className="mt-2 font-semibold text-cyan-300 hover:text-cyan-200 disabled:opacity-50">
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* INITIAL SUGGESTIONS */}
              {messages.length === 1 && !loading && !error && (
                <div className="astra-message pt-1">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <Sparkles size={13} className="text-cyan-400" />
                    Explore the portfolio
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button key={suggestion} type="button" disabled={loading} onClick={() => sendMessage(suggestion)} className="astra-suggestion rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-left text-[11px] text-slate-300 disabled:opacity-50" style={{ animationDelay: `${index * 60}ms` }}>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SMART FOLLOW-UP SUGGESTIONS */}
              {followUps.length > 0 && !loading && (
                <div className="astra-message ml-[56px] pt-1">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                    <MessageSquare size={12} className="text-cyan-400" />
                    Continue the conversation
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {followUps.map((item) => (
                      <button key={item} type="button" onClick={() => sendMessage(item)} className="astra-suggestion rounded-xl border border-cyan-300/10 bg-cyan-300/[0.035] px-3 py-2 text-left text-[10px] text-cyan-100/80">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT AREA */}
          <footer className="shrink-0 border-t border-white/[0.07] bg-[#0b1120] px-4 pb-4 pt-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <button type="button" onClick={downloadPdf} className="astra-tool-button" title="Print or save conversation as PDF">
                <Download size={12} /> Export PDF
              </button>
              <button type="button" onClick={downloadTextFile} className="astra-tool-button" title="Download conversation as TXT">
                <Download size={12} /> Export TXT
              </button>
              {loading && (
                <button type="button" onClick={stopGenerating} className="astra-tool-button border-red-400/20 text-red-300 hover:border-red-400/40 hover:text-red-200">
                  <Square size={11} fill="currentColor" /> Stop generating
                </button>
              )}
            </div>

            <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#111827] p-1.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={isListening ? "Listening..." : "Ask ASTRA anything..."}
                aria-label="Message ASTRA AI"
                disabled={loading}
                className="astra-input min-w-0 flex-1 border border-transparent bg-transparent px-3 py-2.5 text-[13px] text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
              />

              <button type="button" onClick={startVoiceInput} disabled={loading} aria-label={isListening ? "Stop voice input" : "Start voice input"} title={isListening ? "Stop listening" : "Voice input"} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-40 ${isListening ? "bg-red-400/15 text-red-300" : "text-slate-400 hover:bg-white/[0.06] hover:text-cyan-300"}`}>
                {isListening ? <MicOff size={17} /> : <Mic size={17} />}
              </button>

              <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="astra-send-button flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-[#06121d] disabled:cursor-not-allowed disabled:opacity-35">
                {loading ? (
                  <span className="h-4 w-4 animate-[astraSpin_0.8s_linear_infinite] rounded-full border-2 border-[#06121d]/30 border-t-[#06121d]" />
                ) : (
                  <ArrowUp size={19} />
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-600">
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
