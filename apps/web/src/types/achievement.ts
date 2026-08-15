export interface Achievement {
  key: string;
  name: string;
  description: string;
  image: string;
}

export interface AchievementActivity {
  username: string;
  achievement: Achievement;
  earnedAt: string;
}
