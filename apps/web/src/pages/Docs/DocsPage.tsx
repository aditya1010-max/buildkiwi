import { useState } from "react";

import "./DocsPage.css";

import DocumentationCard from "../../components/Documentation/DocumentationCard";

import {
  RocketIcon,
  FolderIcon,
  SearchIcon,
  HelpCircleIcon,
} from "../../assets/icons";
import { ProfileIcon as UserIcon } from "../../assets/icons";

export default function DocsPage() {
  const [article, setArticle] = useState("getting-started");

  function renderArticle() {
    switch (article) {
      case "projects":
        return (
          <>
            <h2>Projects</h2>
            <p>
              Projects are the core of BuildKiwi. Add a title, description,
              tags, links and a cover image to showcase your work.
            </p>
          </>
        );

      case "discover":
        return (
          <>
            <h2>Discover</h2>
            <p>
              Browse projects, search by technology and discover builders from
              the community.
            </p>
          </>
        );

      case "profiles":
        return (
          <>
            <h2>Profiles</h2>
            <p>Customize your profile and showcase your projects and skills.</p>
          </>
        );

      case "faq":
        return (
          <>
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common questions about BuildKiwi.</p>
          </>
        );

      default:
        return (
          <>
            <h2>Getting Started</h2>
            <p>
              Welcome to BuildKiwi! Learn how to create and publish your first
              project.
            </p>
          </>
        );
    }
  }

  return (
    <main className="docs-page">
      <div className="docs-page_container">
        <h1 className="docs-page_title">Documentation</h1>

        <p className="docs-page_subtitle">
          Everything you need to get started with BuildKiwi.
        </p>

        <div className="docs-page_cards">
          <DocumentationCard
            title="Getting Started"
            description="Create your first project."
            icon={<RocketIcon size={22} />}
            onClick={() => setArticle("getting-started")}
          />

          <DocumentationCard
            title="Projects"
            description="Learn about projects."
            icon={<FolderIcon size={22} />}
            onClick={() => setArticle("projects")}
          />

          <DocumentationCard
            title="Discover"
            description="Search projects and builders."
            icon={<SearchIcon size={22} />}
            onClick={() => setArticle("discover")}
          />

          <DocumentationCard
            title="Profiles"
            description="Customize your profile."
            icon={<UserIcon size={22} />}
            onClick={() => setArticle("profiles")}
          />

          <DocumentationCard
            title="FAQ"
            description="Frequently asked questions."
            icon={<HelpCircleIcon size={22} />}
            onClick={() => setArticle("faq")}
          />
        </div>

        <div className="docs-page_article">{renderArticle()}</div>
      </div>
    </main>
  );
}
