import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

// Home page
function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Never used");

  // Read status from URL query params if redirected
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    if (statusParam) {
      setStatus(statusParam);
      // Clean up URL
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  const startOAuth = (action) => {
    const redirectUri = `${window.location.origin}/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=read:user user:email&state=${action}`;
    window.location.href = url;
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>GitHub OAuth Test</h2>
      <p>Status: {status}</p>
      <button onClick={() => startOAuth("register")}>Register with GitHub</button>
      <button onClick={() => startOAuth("login")}>Log in with GitHub</button>
    </div>
  );
}

// Callback page
function Callback() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const action = params.get("state") || "login"; // default to login

  useEffect(() => {
    if (!code) return;

    const url =
      action === "register"
        ? "http://localhost:8080/user/register/github"
        : "http://localhost:8080/user/login/github";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, front: true }),
    })
      .then(async (res) => {
        const text = await res.text();
        // After backend responds, redirect to Home with status in query
        navigate(`/?status=${encodeURIComponent(`Response ${res.status}: ${text}`)}`);
      })
      .catch((err) => {
        navigate(`/?status=${encodeURIComponent(`Error: ${err.message}`)}`);
      });
  }, [code, action, navigate]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>Processing GitHub OAuth...</h2>
      <p>Please wait...</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}
