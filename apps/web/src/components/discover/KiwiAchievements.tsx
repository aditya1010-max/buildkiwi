import "./KiwiAchievements.css";

const achievements = [
  {
    username: "FirstProjectGuy",
    achievement: "First Spark",
    image: "/achievements/first-spark.webp",
  },
  {
    username: "adi",
    achievement: "First Spark",
    image: "/achievements/first-spark.webp",
  },
  {
    username: "messi",
    achievement: "First Spark",
    image: "/achievements/first-spark.webp",
  },
];

export default function KiwiAchievements() {
  return (
    <section className="widget kiwi-achievements">
      <h3>Kiwi Achievements</h3>

      <div className="kiwi-achievements-list">
        {achievements.slice(0, 3).map((item) => (
          <div
            className="kiwi-achievement"
            key={`${item.username}-${item.achievement}`}
          >
            <img
              src={item.image}
              alt={item.achievement}
              className="kiwi-achievement-image"
            />

            <div className="kiwi-achievement-info">
              <span className="kiwi-achievement-name">{item.achievement}</span>

              <span className="kiwi-achievement-user">@{item.username}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
