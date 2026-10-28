
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import GitHubActivity from "./components/GitHubActivity";
import Certifications from "./components/Certifications";
import DesignShowcase from "./components/DesignShowcase";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPdfSecurity from "./components/AdminPdfSecurity";
import PublicAnnouncements from "./components/PublicAnnouncements";

import Copyright from "./components/Copyright";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";

function PortfolioLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      {/* GLOBAL BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[#020617]" />

        {/* Cyan Glow - Top Left */}
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/20
            blur-[140px]
          "
        />

        {/* Blue Glow - Right */}
        <div
          className="
            absolute
            -right-40
            top-[20%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-blue-600/20
            blur-[150px]
          "
        />

        {/* Purple Glow - Bottom */}
        <div
          className="
            absolute
            bottom-[-200px]
            left-[20%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-600/15
            blur-[150px]
          "
        />

        {/* Cyan Center Glow */}
        <div
          className="
            absolute
            left-[45%]
            top-[40%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-cyan-400/10
            blur-[130px]
          "
        />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.5) 1px,transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* TOP LIGHT */}
        <div
          className="
            absolute
            left-1/2
            top-0
            h-px
            w-[80%]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-cyan-400
            to-transparent
            opacity-40
          "
        />

        {/* VIGNETTE */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.45)_100%)]
          "
        />
      </div>

      {/* WEBSITE CONTENT */}
      <div className="relative z-10">
        <Navbar />

        <main>
          {/* Announcements published from the Admin Dashboard */}
          <PublicAnnouncements />

          <Hero />
          <About />
          <Skills />
          <Projects />
          <GitHubActivity />
          <Certifications />
          <DesignShowcase />
          <Experience />
          <Education />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Portfolio */}
        <Route path="/" element={<PortfolioLayout />} />

        {/* Existing Admin Page */}
        <Route
          path="/admin-pdf-security"
          element={<AdminPdfSecurity />}
        />

        {/* Legal Pages */}
        <Route path="/copyright" element={<Copyright />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
