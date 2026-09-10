import { useEffect, useState } from "react";

import { getAchievementActivity } from "../../../services/achievement.api";

import type { AchievementActivity } from "../../../types/achievement";

import "./KiwiAchievements.css";
import Tooltip from "../../ui/Tooltip";

function AchievementLoader() {
  return (
    <div className="kiwi-achievement-loader">
      <div className="kiwi-achievement-skeleton-image" />

      <div className="kiwi-achievement-skeleton-content">
        <div className="kiwi-achievement-skeleton-line title" />
        <div className="kiwi-achievement-skeleton-line username" />
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
        if (isMounted) setActivities(data);
      } catch (error) {
        if (isMounted)
          console.error(
            "[KiwiAchievements] Failed to load achievements:",
            error,
          );
      } finally {
        if (isMounted) setLoading(false);
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

        if (nextIndex > activities.length - 3) {
          return 0;
        }

        return nextIndex;
      });
    }, 3500);

    return () => {
      clearInterval(interval);
    };
  }, [activities.length]);

  const visibleActivities = activities.slice(startIndex, startIndex + 3);

  return (
    <section className="widget kiwi-achievements">
      <h3>Kiwi Achievements</h3>

      {loading ? (
        <div className="kiwi-achievements-list">
          <AchievementLoader />
          <AchievementLoader />
          <AchievementLoader />
        </div>
      ) : (
        activities.length > 0 && (
          <div className="kiwi-achievements-list">
            {visibleActivities.map((activity) => (
              <div
                key={`${activity.username}-${activity.achievement.key}-${activity.earnedAt}`}
                className="kiwi-achievement"
              >
                <Tooltip content={activity.achievement.name} placement="top">
                  <img
                    src={activity.achievement.image}
                    alt={activity.achievement.name}
                    className="kiwi-achievement-image"
                  />
                </Tooltip>

                <div className="kiwi-achievement-info">
                  <strong>{activity.achievement.name}</strong>
                  <span>{activity.username}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}
