import { useState } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // Check if user is already logged in
  if (localStorage.getItem("token")) {
    window.location.href = "/home";
  }

  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Récupération des champs depuis le formulaire
    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("nickname"), // ou "username" selon ton back
    };

    try {
      const response = await fetch("http://localhost:3000/login/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Register success:", data);
        // Redirige vers le login
        navigate("/login");
      } else {
        const error = await response.json();
        console.error("Register failed:", error);
        alert(error.message || "Registration failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Header logo + title */}
      <div className="absolute flex flex-row items-center gap-4 inset-4 w-12 h-12">
        <img src="/src/assets/logo.png" className="rounded-xl shadow" />
        <p className="text-3xl font-bold">Area</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="flex flex-col justify-center items-center gap-4 text-3xl font-bold text-center text-black mb-6">
          <p>Register your account</p>
        </h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Profile picture */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="profile-picture"
              className="relative cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm flex items-center justify-center bg-gray-100">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">Upload</span>
                )}
              </div>
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Click to upload your profile picture
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
            <Input placeholder="John Doe" iconName="login" required />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black mb-1"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <Input placeholder="username123" iconName="at" required />
            <p className="text-xs text-gray-500 mt-1">
              Only lowercase letters, digits and underscores are allowed.
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Email
            </label>
            <Input placeholder="you@example.com" iconName="mail" required />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password
            </label>
            <Input placeholder="Your password" iconName="lock" required />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-black mb-1"
            >
              Confirm Password
            </label>
            <Input
              placeholder="Confirm your password"
              iconName="lock"
              required
            />
          </div>

          {/* Submit button */}
          <Button className="w-full bg-black text-white font-semibold hover:opacity-90 transition">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-black font-semibold hover:underline cursor-pointer"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
