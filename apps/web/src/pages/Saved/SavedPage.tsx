import EmptySaved from "../../components/saved/EmptySaved";
import SavedHeader from "../../components/saved/SavedHeader";
import SavedProjectCard from "../../components/saved/SavedProjectCard";
import { useBookmarks } from "../../hooks/useBookmarks";
import type { ReactElement } from "react";

export default function SavedPage(): ReactElement {
  const { bookmarks, loading, error } = useBookmarks();

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

  return (
    <main className="saved-page">
      <SavedHeader count={bookmarks.length} />

      {bookmarks.length === 0 ? (
        <EmptySaved />
      ) : (
        <section className="saved-grid">
          {bookmarks.map((project) => (
            <SavedProjectCard key={project._id.toString()} project={project} />
          ))}
        </section>
      )}
    </main>
  );
}
