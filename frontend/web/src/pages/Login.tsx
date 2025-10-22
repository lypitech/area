import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { isLoggedIn } from "../utils/auth";
import logo from "../assets/logo.png";
import Icon from "../components/icons/icons";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/home");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Logo */}
      <div className="absolute flex flex-row items-center gap-4 inset-4 w-12 h-12">
        <img src={logo} className="rounded-xl shadow" />
        <p className="text-3xl font-bold">Area</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
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
              iconName="login"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* Password with toggle */}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputClass="w-full pr-12 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-black"
                placeholder="Your password"
                aria-label="Password"
              />

              <Button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* eye-off icon */
                  <Icon iconName="eyeOff" iconClass="w-6 h-6" />
                ) : (
                  /* eye icon */
                  <Icon iconName="eye" iconClass="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-black text-white font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a
            onClick={() => navigate("/register")}
            className="text-black font-semibold hover:underline cursor-pointer"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
