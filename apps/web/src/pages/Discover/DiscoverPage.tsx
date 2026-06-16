import FeedHeader from "../../components/feed/FeedHeader";
import Feed from "../../components/feed/Feed";

export default function DiscoverPage() {
  return (
    <section className="page">
      <FeedHeader title="Discover" subtitle="Explore new projects and ideas" />
      {Feed({ type: "discover" })}
    </section>
  );
}
