import { getAccessToken } from "../../utils/token";
import GuestPrompt from "../../components/shared/GuestPrompt";
import EmptySaved from "../../components/saved/EmptySaved";
import SavedHeader from "../../components/saved/SavedHeader";
import SavedProjectCard from "../../components/saved/SavedProjectCard";
import { useBookmarks } from "../../hooks/useBookmarks";
import type { ReactElement } from "react";

export default function SavedPage(): ReactElement {
  const { bookmarks, loading, error } = useBookmarks();

  const isGuest = !getAccessToken();

  if (isGuest) {
    return (
      <main className="saved-page">
        <SavedHeader count={0} />

        <GuestPrompt
          icon="pin"
          title="Save projects"
          description="Sign in to save your favourite projects and access them anytime."
        />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="saved-page">
        <SavedHeader count={0} />
        <p>Loading bookmarks...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="saved-page">
        <SavedHeader count={0} />
        <p>{error}</p>
      </main>
    );
  }

  const validBookmarks = bookmarks.filter(
    (project): project is NonNullable<typeof project> => project !== null,
  );

  return (
    <main className="saved-page">
      <SavedHeader count={validBookmarks.length} />

      {validBookmarks.length === 0 ? (
        <EmptySaved />
      ) : (
        <section className="saved-grid">
          {validBookmarks.map((project) => (
            <SavedProjectCard key={project._id} project={project} />
          ))}
        </section>
      )}
    </main>
  );
}
