import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const backgroundImage = "/b2b28a20-3e0f-493b-9a5d-cda2fcc64185.jfif";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful — please login.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 shadow-lg rounded-lg max-w-md w-full p-8"
        aria-label="Register Form"
      >
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Create an Account
        </h2>

        {error && (
          <div
            className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded"
            role="alert"
          >
            {error}
          </div>
        )}

        <label
          htmlFor="username"
          className="block mb-1 font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          autoComplete="username"
        />

        <label
          htmlFor="password"
          className="block mb-1 font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
