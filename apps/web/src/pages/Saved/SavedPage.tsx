import type { ReactElement } from "react";

import { useBookmarks } from "../../hooks/useBookmarks";
import { getAccessToken } from "../../utils/token";

import Loader from "../../components/ui/Loader";
import GuestPrompt from "../../components/auth/GuestPrompt";
import EmptySaved from "../../components/saved/EmptySaved";
import SavedHeader from "../../components/saved/SavedHeader";
import SavedProjectCard from "../../components/saved/SavedProjectCard";

import "./SavedPage.css";

export default function SavedPage(): ReactElement {
  const { bookmarks, loading, error } = useBookmarks();

  const isGuest = !getAccessToken();

  if (isGuest) {
    return (
      <main className="saved-page">
        <div className="saved-page_container">
          <SavedHeader count={0} />

          <GuestPrompt
            icon="pin"
            title="Save projects"
            description="Sign in to save your favourite projects and access them anytime."
          />
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="saved-page">
        <div className="saved-page_container">
          <SavedHeader count={0} />

          <div className="saved-page_state">
            <Loader label="Loading bookmarks..." />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="saved-page">
        <div className="saved-page_container">
          <SavedHeader count={0} />

          <div
            className="saved-page_state saved-page_state--error"
            role="alert"
          >
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const validBookmarks = bookmarks.filter(
    (project): project is NonNullable<typeof project> => project !== null,
  );

  return (
    <main className="saved-page">
      <div className="saved-page_container">
        <SavedHeader count={validBookmarks.length} />

        {validBookmarks.length === 0 ? (
          <EmptySaved />
        ) : (
          <section className="saved-grid" aria-label="Saved projects">
            {validBookmarks.map((project) => (
              <SavedProjectCard key={project._id} project={project} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
