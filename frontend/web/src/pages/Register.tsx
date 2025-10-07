import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authServices";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);
  const [profile_picture, setProfile_picture] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile_picture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    setError(null);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const nickname = formData.get("nickname") as string;
    const username = formData.get("username") as string;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register(email, password, nickname, username, profile_picture);
      navigate("/login");
    } catch {
      setError("Registration failed");
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="absolute flex flex-row items-center gap-4 inset-4 w-12 h-12">
        <img src={logo} className="rounded-xl shadow" />
        <p className="text-3xl font-bold">Area</p>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="flex flex-col justify-center items-center gap-4 text-3xl font-bold text-center text-black mb-6">
          <p>Register your account</p>
        </h1>

        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Profile picture */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="profile-picture"
              className="relative cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm flex items-center justify-center bg-gray-100">
                {profile_picture ? (
                  <img
                    src={profile_picture}
                    alt="profile_picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">Upload</span>
                )}
              </div>
              <input
                name="profile-picture"
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
            <Input
              name="nickname"
              placeholder="John Doe"
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
              Username <span className="text-red-500">*</span>
            </label>
            <Input
              name="username"
              placeholder="username123"
              iconName="at"
              required
            />
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
            <Input
              name="email"
              placeholder="you@example.com"
              iconName="mail"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password
            </label>
            <Input
              name="password"
              placeholder="Your password"
              iconName="lock"
              required
            />
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
              name="confirm-password"
              placeholder="Confirm your password"
              iconName="lock"
              required
            />
          </div>

          <Button
            className="w-full bg-black text-white font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
