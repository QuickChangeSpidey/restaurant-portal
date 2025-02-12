"use client"; // Enables hooks in App Router

import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    birthdate: "",
    phoneNumber: "",
    givenName: "",
    familyName: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", { email, password });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signing up with", { ...formData, userType: "Restaurant" });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Resetting password for", email);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-500 text-white">
      <h1 className="text-4xl font-bold mb-6">BOGO NINJA</h1>
      <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96">
        {showSignup ? (
          <form onSubmit={handleSignup}>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {Object.keys(formData).map((key) => (
              <input
                key={key}
                type={key === "password" ? "password" : "text"}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
                required
              />
            ))}
            <button className="w-full p-2 bg-green-500 text-white rounded" type="submit">
              Sign Up
            </button>
            <p className="mt-2 text-center">
              Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => setShowSignup(false)}>Login</span>
            </p>
          </form>
        ) : showForgot ? (
          <form onSubmit={handleForgotPassword}>
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <button className="w-full p-2 bg-green-500 text-white rounded" type="submit">
              Reset Password
            </button>
            <p className="mt-2 text-center">
              Remembered? <span className="text-blue-500 cursor-pointer" onClick={() => setShowForgot(false)}>Login</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <button className="w-full p-2 bg-green-500 text-white rounded" type="submit">
              Login
            </button>
            <p className="mt-2 text-center">
              <span className="text-blue-500 cursor-pointer" onClick={() => setShowForgot(true)}>Forgot Password?</span>
            </p>
            <p className="mt-2 text-center">
              Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => setShowSignup(true)}>Sign Up</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
