type FeedProps = {
  type: "home" | "discover" | "saved";
};

export default function Feed({ type }: FeedProps) {
  // later:
  // fetch different APIs depending on type

  return <div className="feed">Feed: {type}</div>;
}
