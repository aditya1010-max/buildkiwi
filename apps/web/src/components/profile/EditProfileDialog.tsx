import { useState } from "react";
import "./EditProfileDialog.css";

import type { User } from "../../types/user";
import { updateUser } from "../../services/user.service";
import GeneratedAvatar from "../projects/shared/GeneratedAvatar/GeneratedAvatar";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

import { generateAvatarCandidates } from "../../utils/avatar.generator";
import type { AvatarCandidate } from "../../types/avatar";

interface EditProfileDialogProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function EditProfileDialog({
  user,
  onClose,
  onSave,
}: EditProfileDialogProps) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarSeed, setAvatarSeed] = useState(user.avatarSeed);
  const [avatarPattern, setAvatarPattern] = useState(user.avatarPattern);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [avatarCandidates, setAvatarCandidates] = useState<AvatarCandidate[]>(
    [],
  );

  const handleRandomize = () => {
    setAvatarCandidates(generateAvatarCandidates());
  };

  const handleSelectCandidate = (candidate: AvatarCandidate) => {
    setAvatarSeed(candidate.seed);
    setAvatarPattern(candidate.pattern);
  };

  const handleSave = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Username cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateUser(user.id, {
        username: trimmedUsername,
        bio,
        avatarSeed,
        avatarPattern,
      });

      onSave({
        ...user,
        username: trimmedUsername,
        bio,
        avatarSeed,
        avatarPattern,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit Profile"
      className="edit-profile-dialog"
    >
      <div className="edit-profile-content">
        <div className="edit-profile_avatar-section">
          <div className="edit-profile_avatar">
            <GeneratedAvatar
              seed={avatarSeed}
              pattern={avatarPattern}
              className="edit-profile_avatar-image"
            />

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="edit-profile_randomize"
              onClick={handleRandomize}
              disabled={saving}
            >
              Randomize
            </Button>

            {avatarCandidates.length > 0 && (
              <div className="edit-profile_avatar-candidates">
                {avatarCandidates.map((candidate) => {
                  const isSelected =
                    avatarSeed === candidate.seed &&
                    avatarPattern === candidate.pattern;

                  return (
                    <button
                      key={`${candidate.pattern}-${candidate.seed}`}
                      type="button"
                      className={`edit-profile_avatar-candidate ${
                        isSelected
                          ? "edit-profile_avatar-candidate--selected"
                          : ""
                      }`}
                      onClick={() => handleSelectCandidate(candidate)}
                      aria-label={`Select ${candidate.pattern} avatar`}
                      aria-pressed={isSelected}
                      disabled={saving}
                    >
                      <GeneratedAvatar
                        seed={candidate.seed}
                        pattern={candidate.pattern}
                        className="edit-profile_avatar-candidate-image"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="edit-profile_field">
          <label htmlFor="edit-profile-username">Username</label>

          <input
            id="edit-profile-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            maxLength={30}
            autoComplete="username"
            placeholder="Choose a username"
            disabled={saving}
            required
          />
        </div>

        <div className="edit-profile_field">
          <label htmlFor="edit-profile-bio">Bio</label>

          <textarea
            id="edit-profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={120}
            placeholder="Tell people a little about yourself..."
            rows={4}
            disabled={saving}
          />

          <span className="edit-profile_counter">{bio.length}/120</span>
        </div>

        {error && (
          <p className="edit-profile_error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="edit-profile_actions">
        <Button
          type="button"
          variant="secondary"
          className="edit-profile_cancel"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="primary"
          className="edit-profile_save"
          onClick={handleSave}
          loading={saving}
          disabled={saving}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
