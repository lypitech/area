import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { Button } from "../components/Button";
import { fileToBase64 } from "../utils/fileToBase64";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    nickname: string;
    username: string;
    email: string;
    profile_picture?: string | null;
  };
  onSave: (updatedData: {
    nickname: string;
    username: string;
    email: string;
    profile_picture?: string | null;
  }) => Promise<void> | void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState(initialData.nickname);
  const [username, setUsername] = useState(initialData.username);
  const [email, setEmail] = useState(initialData.email);
  const [profilePicture, setProfilePicture] = useState<string | null>(
    initialData.profile_picture || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setProfilePicture(base64);
    } catch {
      setError("Failed to load image");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave({
        nickname,
        username,
        email,
        profile_picture: profilePicture,
      });
      onClose();
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-black">
          Edit Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="edit-profile-picture"
            className="relative cursor-pointer"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm flex items-center justify-center bg-gray-100">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Upload</span>
              )}
            </div>
            <input
              id="edit-profile-picture"
              name="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Click to change profile picture
          </p>
        </div>

        {/* Nickname */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-black mb-1"
          >
            Nickname
          </label>
          <Input
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your nickname"
            iconName="login"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-black mb-1"
          >
            Username
          </label>
          <Input
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            iconName="at"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black mb-1"
          >
            Email
          </label>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            iconName="mail"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
