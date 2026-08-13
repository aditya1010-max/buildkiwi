export const ACHIEVEMENTS = {
  FIRST_PROJECT: {
    key: "FIRST_PROJECT",
    name: "First Spark",
    description: "Published your first project",
    image: "/achievements/first-spark.webp",
  },
} as const;

export type AchievementKey = keyof typeof ACHIEVEMENTS;
