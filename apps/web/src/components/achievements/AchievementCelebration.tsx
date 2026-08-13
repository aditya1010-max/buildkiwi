import "./AchievementCelebration.css";
import type { Achievement } from "../../types/achievement";

interface AchievementCelebrationProps {
  achievement: Achievement;
  username: string;
  onClose: () => void;
}

export default function AchievementCelebration({
  achievement,
  username,
  onClose,
}: AchievementCelebrationProps) {
  return (
    <div
      className="achievement-celebration"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-title"
    >
      <div className="achievement-celebration__card">
        <div className="achievement-celebration__sparkles">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>

        <p className="achievement-celebration__eyebrow">Achievement unlocked</p>

        <div className="achievement-celebration__badge">
          <img src={achievement.image} alt={achievement.name} />
        </div>

        <h2 id="achievement-title" className="achievement-celebration__title">
          {achievement.name}
        </h2>

        <p className="achievement-celebration__description">
          {achievement.description}
        </p>

        {username && (
          <p className="achievement-celebration__username">@{username}</p>
        )}

        <button
          type="button"
          className="achievement-celebration__button"
          onClick={onClose}
        >
          Nice!
        </button>
      </div>
    </div>
  );
}
