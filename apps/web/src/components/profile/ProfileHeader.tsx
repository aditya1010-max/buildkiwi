import "./ProfileHeader.css";

import { useState } from "react";
import type { ReactElement } from "react";

import EditProfileDialog from "./EditProfileDialog";
import GeneratedAvatar from "../../components/project/shared/GeneratedAvatar/GeneratedAvatar";

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
        <GeneratedAvatar seed={user._id} className="profile-avatar" />

        <div className="profile-info">
          <h1>{user.username}</h1>

          <span>{user.email}</span>

          <p>{user.bio || "No bio added yet."}</p>

          <small>Joined {new Date(user.createdAt).toLocaleDateString()}</small>
        </div>

        <button type="button" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      </section>

      {isEditing && (
        <EditProfileDialog user={user} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
