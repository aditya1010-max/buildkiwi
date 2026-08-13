import mongoose, { Document, Schema } from "mongoose";
import type { AchievementKey } from "../constants/achievements";

export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementKey: AchievementKey;
  earnedAt: Date;
}

const userAchievementSchema = new Schema<IUserAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    achievementKey: {
      type: String,
      required: true,
    },

    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

userAchievementSchema.index({ userId: 1, achievementKey: 1 }, { unique: true });

export const UserAchievement = mongoose.model<IUserAchievement>(
  "UserAchievement",
  userAchievementSchema,
);
