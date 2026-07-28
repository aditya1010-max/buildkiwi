import { useState } from "react";
import "./PrivacyPage.css";

interface PolicySection {
  id: string;
  title: string;
  content: string[];
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    content: [
      "Privacy Policy Privacy PolicyPrivacy PolicyPrivacy PolicyPrivacy PolicyPrivacy PolicyPrivacy PolicyPrivacy Policy",
    ],
  },
  {
    id: "data-usage",
    title: "Data Collection & Usage",
    content: [
      "Data Collection & Usage, Data Collection & UsageData Collection & UsageData Collection & UsageData Collection & UsageData Collection & UsageData Collection & Usage",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    content: [
      "We use essential cookies to maintain session states and security preferences.",
      "Optional performance cookies help us understand feature adoption. You can customize cookie preferences in your browser settings.",
    ],
  },
];

export default function PrivacyPage() {
  const [expanded, setExpanded] = useState<string | null>("privacy");

  const toggleSection = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <main className="privacy-page">
      <div className="privacy-page__container">
        <header className="privacy-page__header">
          <h1 className="privacy-page__title">Privacy Center</h1>
          <br />
          <p className="privacy-page__subtitle">
            Understand how your data is handled, stored, and protected.
          </p>
        </header>

        <section
          className="privacy-page__sections"
          aria-label="Privacy Documentation"
        >
          {POLICY_SECTIONS.map(({ id, title, content }) => {
            const isOpen = expanded === id;

            return (
              <div
                key={id}
                className={`privacy-card ${isOpen ? "privacy-card--expanded" : ""}`}
              >
                <button
                  type="button"
                  className="privacy-card__trigger"
                  onClick={() => toggleSection(id)}
                  aria-expanded={isOpen}
                  aria-controls={`content-${id}`}
                >
                  <span className="privacy-card__title">{title}</span>
                  <span
                    className={`privacy-card__icon ${isOpen ? "privacy-card__icon--open" : ""}`}
                  >
                    ▶
                  </span>
                </button>

                {isOpen && (
                  <div id={`content-${id}`} className="privacy-card__content">
                    {content.map((paragraph, index) => (
                      <p key={index} className="privacy-card__paragraph">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
