import FeedHeader from "../../components/feed/FeedHeader";
import Feed from "../../components/feed/Feed";

export default function SavedPage() {
  return (
    <section className="page">
      <FeedHeader title="Saved" subtitle="Your saved projects and ideas" />
      {Feed({ type: "saved" })}
    </section>
  );
}
