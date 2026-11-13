
import React, { useState } from "react";
import "./WhatsAppButton.css";

const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "9473681245";

  const message =
    "Hello Mr. Divyanshu Singh, I came across your portfolio and would appreciate the opportunity to connect with you regarding a potential inquiry or collaboration.";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="whatsapp-widget">
      {/* Welcome Popup */}
      {isOpen && (
        <div className="whatsapp-popup">
          <div className="whatsapp-popup-header">
            <div className="whatsapp-profile">
              <div className="whatsapp-avatar">DS</div>

              <div>
                <h3>Divyanshu Singh</h3>
                <span className="whatsapp-online-text">
                  <span className="online-dot" />
                  Available to chat
                </span>
              </div>
            </div>

            <button
              type="button"
              className="whatsapp-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp popup"
            >
              ×
            </button>
          </div>

          <div className="whatsapp-popup-body">
            <span className="whatsapp-time">Welcome 👋</span>

            <div className="whatsapp-message">
              Hi there! Thanks for visiting my portfolio.
              <br />
              Have a question or want to collaborate? Let's connect!
            </div>

            <span className="whatsapp-time">
              Feel free to send me a message.
            </span>
          </div>

          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-start-chat"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M16.04 3C8.87 3 3.04 8.82 3.04 16c0 2.29.6 4.52 1.74 6.5L3 29l6.67-1.75A13 13 0 1 0 16.04 3zm0 23.5c-1.98 0-3.92-.53-5.6-1.54l-.4-.24-3.95 1.04 1.05-3.85-.26-.41A10.47 10.47 0 1 1 16.04 26.5z" />
            </svg>
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        className="whatsapp-float"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Toggle WhatsApp chat"
        aria-expanded={isOpen}
      >
        <span className="whatsapp-ring" aria-hidden="true" />
        <span
          className="whatsapp-ring whatsapp-ring-delay"
          aria-hidden="true"
        />
        <span className="whatsapp-status-dot" aria-hidden="true" />

        {/* WhatsApp Icon - Always Visible */}
        <svg
          className="whatsapp-icon"
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.04 3C8.87 3 3.04 8.82 3.04 16c0 2.29.6 4.52 1.74 6.5L3 29l6.67-1.75A13 13 0 1 0 16.04 3zm0 23.5c-1.98 0-3.92-.53-5.6-1.54l-.4-.24-3.95 1.04 1.05-3.85-.26-.41A10.47 10.47 0 1 1 16.04 26.5zm5.75-7.84c-.31-.15-1.83-.9-2.12-1-.29-.11-.5-.16-.71.15-.21.31-.82 1-.99 1.2-.18.21-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.13-.63.14-.13.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.71-1.7-.97-2.33-.25-.61-.51-.53-.71-.54h-.61c-.21 0-.54.08-.83.39-.28.31-1.08 1.05-1.08 2.56s1.11 2.97 1.26 3.18c.16.21 2.18 3.33 5.28 4.67.74.32 1.32.52 1.77.66.74.24 1.42.21 1.96.13.6-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.36z" />
        </svg>
      </button>
    </div>
  );
};

export default WhatsAppButton;
