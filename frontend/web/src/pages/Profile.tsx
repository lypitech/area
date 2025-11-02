import React, { useEffect } from "react";
import type { User } from "../types";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userService";
import Footer from "../components/Footer";
// import { useState } from "react";
// import EditProfileModal from "../components/EditProfile";
// import { u } from "framer-motion/client";

export default function Profile() {
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (typeof userData === "string") {
        setError(userData);
        setUser(null);
      } else {
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p>Loading profile...</p>
      </div>
    );
  }

  const { nickname, username, email, profile_picture } = user;

  const initial = nickname
    ? nickname[0].toUpperCase()
    : username[0].toUpperCase();

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // <EditProfileModal
  //   isOpen={isModalOpen}
  //   onClose={() => setIsModalOpen(false)}
  //   initialData={{
  //     nickname: user.nickname,
  //     username: user.username,
  //     email: user.email,
  //     profile_picture: user.profile_picture,
  //   }}
  //   onSave={async (updated) => {
  //     await updateUser(updated);
  //   }}
  // />;

  return (
    <div className="flex flex-col h-full items-center p-8 pb-0">
      {/* Profile Picture */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-md flex items-center justify-center bg-gray-300 text-4xl font-bold text-white">
        {profile_picture ? (
          <img
            src={profile_picture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {/* Informations */}
      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold">{nickname}</h1>
        <p className="text-gray-600">@{username}</p>
        <p className="text-gray-800 mt-2">{email}</p>
      </div>

      {/* Edit Profile and Logout */}
      <div className="mt-6 flex gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Edit Profile
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
}
