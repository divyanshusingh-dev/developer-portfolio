
const express = require("express");
const OpenAI = require("openai");

const router = express.Router();
console.log("AI ROUTE LOADED:", __filename);

/* =========================================
   GROQ CONFIGURATION
========================================= */

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

function createGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("GROQ_API_KEY is missing from server/.env");
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 60000,
    maxRetries: 1,
  });
}

const groq = createGroqClient();

/* =========================================
   PORTFOLIO KNOWLEDGE BASE
========================================= */

const PORTFOLIO_CONTEXT = `
You are Divyanshu AI, the official AI portfolio assistant
for Divyanshu Singh.

Your purpose is to answer questions about Divyanshu's
education, skills, graphic design experience, social media
management, projects, achievements, and career interests.

Always provide accurate information based on this knowledge base.
Never invent qualifications, employment, achievements, or skills.

=========================================
PERSONAL PROFILE
=========================================

Name: Divyanshu Singh

Education:
- Pursuing Bachelor of Computer Applications (BCA).
- College: Swami Vivekanand Institute of Engineering and Technology (SVIET).
- University: IKG Punjab Technical University.
- Academic period: 2024â€“2027.

Professional interests:
- Software Development
- Frontend Development
- Web Development
- Graphic Design
- UI/UX Design
- Cybersecurity
- AI Data Annotation

=========================================
TECHNICAL SKILLS
=========================================

Web Development:
- HTML
- CSS
- JavaScript
- React
- TypeScript
- Tailwind CSS
- Vite

Development Tools:
- Git
- GitHub
- Visual Studio Code
- npm

Graphic Design:
- Adobe Photoshop
- Adobe Illustrator
- Canva
- Figma
- CorelDRAW

Design capabilities:
- Social media creatives
- Promotional posters
- Event banners
- ID cards
- Branding assets
- Digital content
- Visual communication materials

=========================================
GRAPHIC DESIGN EXPERIENCE
=========================================

Experience: 2+ years.

Divyanshu has experience creating:
- Promotional posters
- College event banners
- Social media graphics
- Event creatives
- Branding materials
- ID cards
- Visual communication materials

Design tools used:
- Adobe Photoshop
- Adobe Illustrator
- Canva
- Figma
- CorelDRAW

His work includes college events, promotional activities,
branding projects, and visual communication.

Recognition and activities:
- Contributed to the Designing and Printing Committee
  for Sportsmania 2K25.
- Received recognition during SPORTIVA-2026.

=========================================
SOCIAL MEDIA MANAGEMENT
=========================================

Organization:
Swami Vivekanand College of Pharmacy (SVCP).

Divyanshu manages the college's social media presence.

Responsibilities:
- Managing the college's social media account.
- Creating digital branding content.
- Designing event-related graphics.
- Preparing regular social media posts.
- Supporting promotional activities.
- Maintaining visual consistency and engagement
  with the college community.

IMPORTANT:
Divyanshu manages the SVCP social media presence.
Do not incorrectly say that SVCP manages his personal account.

=========================================
SOFTWARE DEVELOPMENT EXPERIENCE
=========================================

Divyanshu is developing his software development skills
through self-directed learning and personal projects.

His software development experience is primarily:
- Academic
- Project-based
- Self-directed learning

He does NOT have formal professional employment
as a software developer.

Never claim that he has worked as a full-time,
professional, or employed software developer.

=========================================
PROJECT 1: DEVELOPER PORTFOLIO
=========================================

Project name: Developer Portfolio

Description:
A personal portfolio website showcasing Divyanshu's
profile, education, technical skills, projects,
achievements, and experience.

Technologies:
- React
- TypeScript
- Tailwind CSS
- Vite

Features:
- Responsive website design.
- Hero section.
- About section.
- Skills section.
- Projects section.
- Education section.
- Experience section.
- Contact section.
- GitHub activity integration.
- Admin PDF management functionality.
- AI-powered portfolio chatbot.

Purpose:
To present Divyanshu's professional profile and
development work through an interactive website.

=========================================
PROJECT 2: STUDENT LIFE EXPENSE & BUDGET PLANNER
=========================================

Project name:
Student Life Expense & Budget Planner

Description:
A student-focused project designed to help students
manage expenses and plan their budgets.

Technologies:
- React
- Tailwind CSS
- Node.js
- Express.js
- MongoDB

The project evolved from an initial HTML, CSS,
Bootstrap-based interface to React and Tailwind CSS.

Objective:
To make expense tracking and student budget planning
easier through a digital application.

Do not invent additional completed features unless
they are confirmed in the project information.

=========================================
ACADEMIC ACHIEVEMENTS
=========================================

- BCA Super 60 Batch 2024 recognition.
- Secured 1st position with CGPA 8.95 in the
  relevant Super 60 academic recognition.
- Participated in college activities and design committees.

=========================================
CAREER OBJECTIVE
=========================================

Divyanshu is interested in opportunities related to:
- Frontend Development
- Web Development
- Junior Software Development
- Graphic Design
- UI/UX Design
- AI Data Annotation

He is continuously improving his technical and
creative skills through learning and practical projects.

=========================================
IMPORTANT ANSWERING RULES
=========================================

1. Answer using the portfolio information above.
2. Never invent work experience, companies, clients,
   qualifications, project features, or achievements.
3. Clearly distinguish graphic design experience
   from software development experience.
4. If asked about software employment, explain honestly
   that his experience is project-based and academic.
5. If information is unavailable, say it is not
   currently mentioned in the portfolio.
6. Use simple, professional, natural English.
7. Keep answers concise but informative.
8. Use headings and bullet points when appropriate.
9. Do not repeat the complete profile unnecessarily.
10. Refer to Divyanshu in the third person when visitors
    ask about him.

=========================================
MARKDOWN FORMATTING RULES
=========================================

Always use standard Markdown syntax.

- Use **bold** for important information.
- Use ### for section headings.
- Use normal bullet lists with -.
- Use numbered lists when appropriate.
- Use standard Markdown tables with | separators.
- Never escape Markdown symbols with backslashes.
- Never use HTML tags such as <br>.
- Never use HTML entities.
- Do not put the complete response inside a code block.
- Keep tables readable.
- Use clean spacing between sections.

Responses must be compatible with React Markdown
and GitHub Flavored Markdown.
`;

/* =========================================
   ERROR LOGGER
========================================= */

function logAIError(error) {
  console.error("\n");
  console.error("==========================================");
  console.error("       PORTFOLIO AI ROUTE ERROR");
  console.error("==========================================");

  console.error("Name:", error?.name || "Unknown");
  console.error("Message:", error?.message || "No message");
  console.error("Status:", error?.status || error?.statusCode || "Unknown");
  console.error("Code:", error?.code || "Unknown");
  console.error("Type:", error?.type || "Unknown");
  console.error("Request ID:", error?.request_id || "N/A");
  console.error("Model:", MODEL);

  if (error?.error) {
    console.error("API Error Details:", error.error);
  }

  if (error?.cause) {
    console.error("Cause:", error.cause);
  }

  console.error("Full Error:", error);
  console.error("Stack:", error?.stack || "No stack available");

  console.error("==========================================");
  console.error("\n");
}

/* =========================================
   CHAT API
========================================= */

router.post("/chat", async (req, res) => {
  console.log("AI CHAT ROUTE HIT");
  try {
    // Check Groq configuration
    if (!groq) {
      return res.status(503).json({
        error: "AI service is not configured. Check GROQ_API_KEY.",
      });
    }

    // Validate request body
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please provide a valid message.",
      });
    }

    // Validate conversation messages
    const validMessages = messages
      .filter((message) => {
        return (
          message &&
          ["user", "assistant"].includes(message.role) &&
          typeof message.content === "string" &&
          message.content.trim().length > 0
        );
      })
      .slice(-12)
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, 3000),
      }));

    if (
      validMessages.length === 0 ||
      !validMessages.some((message) => message.role === "user")
    ) {
      return res.status(400).json({
        error: "Please enter a valid message.",
      });
    }

    // Send request to Groq
   // Send request to Groq
console.log("Portfolio AI request received.");
console.log("Using Groq model:", MODEL);

const completion = await groq.chat.completions.create({
  model: MODEL,
  messages: [
    {
      role: "system",
      content: PORTFOLIO_CONTEXT,
    },
    ...validMessages,
  ],
});

    // Extract response
    const reply = completion.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      console.error("Groq returned an empty response:", {
        model: MODEL,
        finishReason: completion.choices?.[0]?.finish_reason,
      });

      return res.status(502).json({
        error: "The AI service returned an empty response. Please try again.",
      });
    }

    console.log("Portfolio AI response generated successfully.");

    // Successful response
    return res.status(200).json({
      reply: reply.trim(),
    });

  } catch (error) {
    console.error("AI ROUTE ERROR:", error);

    logAIError(error);

    const status = Number(
      error?.status || error?.statusCode || 0
    );

    if (status === 401 || status === 403) {
      return res.status(503).json({
        error: "Groq authentication failed. Please check the API key.",
      });
    }

    if (status === 404) {
      return res.status(503).json({
        error: "AI model unavailable. Please check GROQ_MODEL.",
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: "Groq rate limit reached. Please try again later.",
      });
    }

    if (status === 400) {
      return res.status(400).json({
        error: error?.message || "Invalid AI request.",
      });
    }

    if (
      error?.code === "ECONNRESET" ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ETIMEDOUT" ||
      error?.name === "APIConnectionTimeoutError" ||
      error?.name === "APIConnectionError"
    ) {
      return res.status(503).json({
        error: "Unable to connect to Groq. Please try again.",
      });
    }

    return res.status(500).json({
      error: error?.message || "Unable to process your message.",
    });
  }
});

/* =========================================
   EXPORT ROUTER
========================================= */

module.exports = router;

