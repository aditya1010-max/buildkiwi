import { useState } from "react";

import "./PrivacyPage.css";

const SECTIONS = [
  {
    id: "privacy",
    title: "Privacy Policy",
    content: [
      "Your privacy matters to us. We don't want your personal information any more than you want another 47 marketing emails.",
      "We collect only the information required to run the app. No secret spy agency. No suspicious basement. Just a database.",
    ],
  },
  {
    id: "data-usage",
    title: "Data Collection & Usage",
    content: [
      "We use your data to make the website do website things. Profiles need profiles, projects need projects, and buttons need to know when you clicked them.",
      "We are not selling your data to fund a private island. Frankly, our server bill is already enough.",
      "Sometimes we look at technical logs when something explodes. This is called debugging, and yes, it is usually our fault.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    content: [
      "We use cookies. Not the chocolate-chip kind. We checked.",
      "Essential cookies help with things like sessions and security. Basically, they stop the website from having the memory of a goldfish.",
      "Optional tracking helps us understand how people use the site. If you disable it, we'll survive. Probably.",
    ],
  },
];

export default function PrivacyPage() {
  const [openSection, setOpenSection] = useState<string | null>("privacy");

  function toggleSection(id: string) {
    setOpenSection((current) => (current === id ? null : id));
  }

  return (
    <main className="privacy-page">
      <div className="privacy-page_container">
        <header className="privacy-page_header">
          <h1>Privacy Center</h1>
          <p>Understand how your data is handled, stored, and protected.</p>
        </header>

        <section
          className="privacy-page_sections"
          aria-label="Privacy Documentation"
        >
          {SECTIONS.map((section) => {
            const isOpen = openSection === section.id;

            return (
              <article key={section.id} className="privacy-section">
                <button
                  type="button"
                  className="privacy-section_trigger"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={`privacy-${section.id}`}
                >
                  <span>{section.title}</span>

                  <span
                    className={`privacy-section_icon${
                      isOpen ? " privacy-section_icon--open" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`privacy-${section.id}`}
                    className="privacy-section_content"
                  >
                    {section.content.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
