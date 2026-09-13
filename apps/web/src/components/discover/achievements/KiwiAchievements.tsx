import { useEffect, useState } from "react";

import { getAchievementActivity } from "../../../services/achievement.api";
import type { AchievementActivity } from "../../../types/achievement";

import Tooltip from "../../ui/Tooltip";

import "./KiwiAchievements.css";

function AchievementLoader() {
  return (
    <div className="kiwi-achievement-loader">
      <div className="kiwi-achievement-skeleton-image" />

      <div className="kiwi-achievement-skeleton-content">
        <div className="kiwi-achievement-skeleton-line kiwi-achievement-skeleton-line--title" />
        <div className="kiwi-achievement-skeleton-line kiwi-achievement-skeleton-line--username" />
      </div>
    </div>
  );
}

function AchievementItem({ activity }: { activity: AchievementActivity }) {
  return (
    <div className="kiwi-achievement">
      <Tooltip content={activity.achievement.name} placement="top">
        <div className="kiwi-achievement-image-wrapper">
          <img
            src={activity.achievement.image}
            alt=""
            className="kiwi-achievement-image"
          />
        </div>
      </Tooltip>

      <div className="kiwi-achievement-info">
        <strong>{activity.achievement.name}</strong>
        <span>{activity.username}</span>
      </div>
    </div>
  );
}

export default function KiwiAchievements() {
  const [activities, setActivities] = useState<AchievementActivity[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAchievements() {
      try {
        const data = await getAchievementActivity(10);

        if (isMounted) {
          setActivities(data);
          setStartIndex(0);
        }
      } catch (error) {
        if (isMounted) {
          console.error(
            "[KiwiAchievements] Failed to load achievements:",
            error,
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAchievements();

    const refreshInterval = setInterval(loadAchievements, 30_000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (activities.length <= 3) {
      return;
    }

    const interval = setInterval(() => {
      setStartIndex((currentIndex) => {
        const nextIndex = currentIndex + 1;

        return nextIndex > activities.length - 3 ? 0 : nextIndex;
      });
    }, 3500);

    return () => {
      clearInterval(interval);
    };
  }, [activities.length]);

  const visibleActivities = activities.slice(startIndex, startIndex + 3);

  return (
    <section className="widget kiwi-achievements">
      <div className="kiwi-achievements_header">
        <h3 className="kiwi-achievements_title">Kiwi Achievements</h3>
      </div>

      {loading ? (
        <div className="kiwi-achievements_list">
          <AchievementLoader />
          <AchievementLoader />
          <AchievementLoader />
        </div>
      ) : activities.length > 0 ? (
        <div className="kiwi-achievements_list">
          {visibleActivities.map((activity) => (
            <AchievementItem
              key={`${activity.username}-${activity.achievement.key}-${activity.earnedAt}`}
              activity={activity}
            />
          ))}
        </div>
      ) : (
        <div className="kiwi-achievements_empty">
          <span className="kiwi-achievements_empty-icon">🏆</span>
          <p>No achievements yet</p>
        </div>
      )}
    </section>
  );
}
