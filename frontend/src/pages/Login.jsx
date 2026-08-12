import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Sending login request to the backend API
      const response = await axios.post(
        "http://15.206.185.215:8080/api/user/login",
        {
          aadharCardNumber: aadharCardNumber,
          password: password,
        },
      );

      // Save token and redirect
      const token = response.data.token;
      localStorage.setItem("token", token);

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    }
  };

  return (
    // Full screen dark gradient background
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-violet-900 p-4 font-sans">
      {/* Glassmorphism transparent card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-sm">Sign in to cast your vote</p>
        </div>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6 text-center text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Aadhar Input Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Aadhar Number
            </label>
            <input
              type="number"
              placeholder="Enter your 12-digit Aadhar"
              value={aadharCardNumber}
              onChange={(e) => setAadharCardNumber(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Gradient Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-95"
          >
            Secure Login
          </button>
        </form>

        {/* Link to Signup Page */}
        <p className="mt-6 text-center text-gray-300 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-400 hover:text-pink-300 font-semibold underline-offset-2 hover:underline transition-all"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
