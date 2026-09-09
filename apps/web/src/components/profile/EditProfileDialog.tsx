import { useState } from "react";
import "./EditProfileDialog.css";

import type { User } from "../../types/user";
import { updateUser } from "../../services/user.service";
import GeneratedAvatar from "../projects/shared/GeneratedAvatar/GeneratedAvatar";
import Button from "../ui/Button";

import { generateAvatarCandidates } from "../../utils/avatar.generator";
import type { AvatarCandidate } from "../../types/avatar";

interface EditProfileDialogProps {
  user: User;
  onClose: () => void;
}

export default function EditProfileDialog({
  user,
  onClose,
}: EditProfileDialogProps) {
  const [bio, setBio] = useState(user.bio ?? "");

  const [avatarSeed, setAvatarSeed] = useState(user.avatarSeed);
  const [avatarPattern, setAvatarPattern] = useState(user.avatarPattern);

  const [saving, setSaving] = useState(false);

  const [avatarCandidates, setAvatarCandidates] = useState<AvatarCandidate[]>(
    [],
  );

  const handleRandomize = () => {
    const candidates = generateAvatarCandidates();

    console.log("[Avatar Randomize] Candidates:", candidates);

    candidates.forEach((candidate, index) => {
      console.log(`\n[Avatar ${index + 1}]`);
      console.log("Pattern:", candidate.pattern);
      console.log("Seed:", candidate.seed);
    });

    setAvatarCandidates(candidates);
  };

  const handleSelectCandidate = (candidate: AvatarCandidate) => {
    setAvatarSeed(candidate.seed);
    setAvatarPattern(candidate.pattern);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateUser(user.id, {
        bio,
        avatarSeed,
        avatarPattern,
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

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="edit-profile_close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </Button>
        </div>

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
            <label>Username</label>

            <div className="edit-profile_readonly">{user.username}</div>
          </div>

          <div className="edit-profile_field">
            <label>Email</label>

            <div className="edit-profile_readonly">{user.email}</div>
          </div>

          <div className="edit-profile_field">
            <label htmlFor="edit-profile-bio">Bio</label>

            <textarea
              id="edit-profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={120}
              placeholder="Tell people a little about yourself..."
              rows={4}
            />

            <span className="edit-profile_counter">{bio.length}/120</span>
          </div>
        </div>

        <div className="edit-profile_actions">
          <Button
            type="button"
            variant="secondary"
            className="edit-profile_cancel"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            className="edit-profile_save"
            onClick={handleSave}
            loading={saving}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
