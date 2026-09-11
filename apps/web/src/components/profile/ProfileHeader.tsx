import "./ProfileHeader.css";

import { useState } from "react";
import type { ReactElement } from "react";

import EditProfileDialog from "./EditProfileDialog";
import GeneratedAvatar from "../projects/shared/GeneratedAvatar/GeneratedAvatar";
import Button from "../ui/Button";

import type { User } from "../../types/user";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({
  user,
}: ProfileHeaderProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <section className="profile-header">
        <GeneratedAvatar
          seed={user.avatarSeed}
          pattern={user.avatarPattern}
          className="profile-avatar"
        />

        <div className="profile-info">
          <h1>{user.username}</h1>

          <p>{user.bio || "No bio added yet."}</p>

          <small>Joined {new Date(user.createdAt).toLocaleDateString()}</small>
        </div>

        <Button variant="secondary" onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </section>

      {isEditing && (
        <EditProfileDialog user={user} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
