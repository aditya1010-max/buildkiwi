import "./AchievementCelebration.css";
import type { Achievement } from "../../../types/achievement";

import Button from "../../ui/Button";

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
  const handleShare = async () => {
    const shareData = {
      title: `${achievement.name} — BuildKiwi`,
      text: `I just unlocked "${achievement.name}" on BuildKiwi!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the share dialog.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard unavailable.
    }
  };

  return (
    <div
      className="achievement-celebration"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-title"
    >
      <div className="achievement-celebration__card">
        <div className="achievement-celebration__sparkles" aria-hidden="true">
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

        <div className="achievement-celebration__actions">
          <Button
            type="button"
            variant="primary"
            className="achievement-celebration__button"
            onClick={onClose}
          >
            Nice!
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="achievement-celebration__share"
            onClick={handleShare}
          >
            Share achievement
          </Button>
        </div>
      </div>
    </div>
  );
}
