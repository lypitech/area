import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { isLoggedIn } from "../utils/auth";
import logo from "../assets/logo.png";
import Icon from "../components/icons/icons";

export default function Register() {
  const navigate = useNavigate();
  const [profile_picture, setProfile_picture] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn()) navigate("/home");
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile_picture(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Updated: special char = any char that is NOT a letter or digit
  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(pwd);
  };

  const getPasswordErrors = (pwd: string) => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("one lowercase letter");
    if (!/\d/.test(pwd)) errors.push("one number");
    if (!/[^A-Za-z0-9]/.test(pwd))
      errors.push("one special character (non alphanumeric, e.g. _ or !)");
    return errors;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const pwd = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const nickname = formData.get("nickname") as string;
    const username = formData.get("username") as string;

    if (pwd !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const passwordErrors = getPasswordErrors(pwd);
    if (passwordErrors.length > 0) {
      setError(`Password must include: ${passwordErrors.join(", ")}.`);
      setLoading(false);
      return;
    }

    try {
      await register(email, pwd, nickname, username, profile_picture);
      navigate("/login");
    } catch {
      setError("Registration failed.");
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
          Register your account
        </h1>

        <form className="space-y-4" onSubmit={onSubmit}>
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputClass="w-full pr-12 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-black"
              />
              <Button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Icon iconName="eyeOff" iconClass="w-6 h-6" />
                ) : (
                  <Icon iconName="eye" iconClass="w-6 h-6" />
                )}
              </Button>
            </div>

            {!validatePassword(password) && password.length > 0 && (
              <ul className="text-xs text-red-500 mt-2 list-disc list-inside">
                {getPasswordErrors(password).map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-black mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                inputClass="w-full pr-12 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-black"
              />
              <Button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <Icon iconName="eyeOff" iconClass="w-6 h-6" />
                ) : (
                  <Icon iconName="eye" iconClass="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
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
