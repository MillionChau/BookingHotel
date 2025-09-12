import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email && !password) {
      setError("Please enter your Email and Password.");
      return;
    } else if (!email) {
      setError("Please enter your Email.");
      return;
    } else if (!password) {
      setError("Please enter your Password.");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5360/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (typeof setUser === "function") {
          setUser(data.user);
        }

        if (data.user.role === "Admin") {
          navigate("/dashboard");
          console.log("Redirecting Admin to /dashboard");
        } else {
          navigate("/");
          console.log("Redirecting Customer to /");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-illustration">
          <Link to="/" className="illustration-circle-link">
            <div className="illustration-circle">
              <i className="bi bi-building"></i>
            </div>
          </Link>
        </div>
        <div className="login-form-section">
          <form onSubmit={handleSubmit} noValidate>
            <h2>Member Login</h2>

            <div className="input-group">
              <i className="bi bi-envelope-fill"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button">
              LOGIN
            </button>

            <div className="login-links">
              <Link to="/register">
                Create your Account <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
