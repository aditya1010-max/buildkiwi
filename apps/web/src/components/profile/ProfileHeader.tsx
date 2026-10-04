import { useState } from "react";

import EditProfileDialog from "./EditProfileDialog";
import GeneratedAvatar from "../projects/shared/GeneratedAvatar/GeneratedAvatar";
import Button from "../ui/Button";

import type { User } from "../../types/user";

import "./ProfileHeader.css";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onSave: (user: User) => void;
}

export default function ProfileHeader({
  user,
  isOwnProfile = false,
  onSave,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <section className="profile-header">
        <div className="profile-header__identity">
          <GeneratedAvatar
            seed={user.avatarSeed}
            pattern={user.avatarPattern}
            className="profile-avatar"
          />

          <div className="profile-info">
            <h1>{user.username}</h1>

            <p>{user.bio || "No bio added yet."}</p>

            {user.createdAt && (
              <small>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </small>
            )}
          </div>
        </div>

        <div className="profile-header__actions">
          {isOwnProfile && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </section>

      {isEditing && (
        <EditProfileDialog
          user={user}
          onClose={() => setIsEditing(false)}
          onSave={onSave}
        />
      )}
    </>
  );
}
