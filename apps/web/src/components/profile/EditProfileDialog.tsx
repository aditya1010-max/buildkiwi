import { useState } from "react";
import "./EditProfileDialog.css";

import { User } from "../../types/user";
import { updateUser } from "../../services/user.service";

interface EditProfileDialogProps {
  user: User;
  onClose: () => void;
}

export default function EditProfileDialog({
  user,
  onClose,
}: EditProfileDialogProps) {
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateUser(user._id, {
        bio,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>

          <button
            type="button"
            className="edit-profile_close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="edit-profile-content">
          <div className="edit-profile_field">
            <label>Username</label>

            <input type="text" value={user.username} readOnly />
          </div>

          <div className="edit-profile_field">
            <label>Email</label>

            <input type="email" value={user.email} readOnly />
          </div>

          <div className="edit-profile_field">
            <label>Bio</label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              placeholder="Tell people a little about yourself..."
              rows={4}
            />

            <span className="edit-profile_counter">{bio.length}/160</span>
          </div>
        </div>

        <div className="edit-profile_actions">
          <button
            type="button"
            className="edit-profile_cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-profile_save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
