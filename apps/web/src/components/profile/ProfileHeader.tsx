import "./ProfileHeader.css";

import { User } from "../../types/user";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <>
      <section className="profile-header">
        <div className="profile-avatar">{initials}</div>

        <div className="profile-info">
          <h1>{user.username}</h1>

          <span>{user.email}</span>

          <p>{user.bio || "No bio added yet."}</p>

          <small>Joined {new Date(user.createdAt).toLocaleDateString()}</small>
        </div>

        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      </section>

      {isEditing && (
        <EditProfileDialog user={user} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
