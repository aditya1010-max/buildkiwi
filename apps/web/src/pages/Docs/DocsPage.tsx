import { useState } from "react";

import "./DocsPage.css";

const SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: [
      "Welcome to BuildKiwi. Create an account, set up your profile, and start showcasing the projects you're building.",
      "To publish your first project, add a title, description, tags, links, and a cover image. Once you're happy with it, publish it to your profile.",
    ],
  },
  {
    id: "projects",
    title: "Projects",
    content: [
      "Projects are the core of BuildKiwi. Each project gives you a place to explain what you're building and share the resources behind it.",
      "You can add a project title, description, tags, GitHub and demo links, and a generated or uploaded cover image.",
      "Published projects can appear on your profile and in the Discover section for other builders to find.",
    ],
  },
  {
    id: "discover",
    title: "Discover",
    content: [
      "Discover is where you can explore projects and builders from the BuildKiwi community.",
      "Search for projects by technology, browse different categories, and find ideas or people you might want to learn from or collaborate with.",
    ],
  },
  {
    id: "profiles",
    title: "Profiles",
    content: [
      "Your profile is your home on BuildKiwi. It gives other builders a quick overview of who you are and what you're working on.",
      "You can customize your profile information, avatar, and showcase the projects you've created.",
    ],
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    content: [
      "Have a question about BuildKiwi? This section covers some of the common things you might want to know.",
      "If you can't find an answer here, you can always check the rest of the documentation or reach out to the BuildKiwi team.",
    ],
  },
];

export default function DocsPage() {
  const [openSection, setOpenSection] = useState<string | null>(
    "getting-started",
  );

  return (
    <main className="docs-page">
      <div className="docs-page_container">
        <header className="docs-page_header">
          <h1>Documentation</h1>

          <p>
            Everything you need to know about building, sharing, and discovering
            projects on BuildKiwi.
          </p>
        </header>

        <section
          className="docs-page_sections"
          aria-label="BuildKiwi Documentation"
        >
          {SECTIONS.map((section) => {
            const isOpen = openSection === section.id;

            return (
              <article key={section.id} className="docs-section">
                <button
                  type="button"
                  className="docs-section_trigger"
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  aria-expanded={isOpen}
                  aria-controls={`docs-${section.id}`}
                >
                  <span>{section.title}</span>

                  <span
                    className={`docs-section_icon ${
                      isOpen ? "docs-section_icon--open" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`docs-${section.id}`}
                    className="docs-section_content"
                  >
                    {section.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
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
