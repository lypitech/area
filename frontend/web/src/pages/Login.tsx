import { useState } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // Check if user is already logged in
  if (localStorage.getItem("token")) {
    window.location.href = "/home";
  }

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login success:", data);

        localStorage.setItem("token", data.token);

        navigate("/home");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        console.error("Login failed:", errorData);
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false); // 🔹 arrête le loading dans tous les cas
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Logo */}
      <div className="absolute flex flex-row items-center gap-4 inset-4 w-12 h-12">
        <img src="/src/assets/logo.png" className="rounded-xl shadow" />
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
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center">Login failed</p>
          )}

          {/* Submit button */}
          <Button
            className="w-full bg-black text-white font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            Sign in
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
