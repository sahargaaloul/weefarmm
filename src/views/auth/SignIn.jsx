import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedPassword && savedRememberMe) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(savedRememberMe);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/superadmin/login", {
        email,
        password,
        rememberMe,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      alert("Login successful!");

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", rememberMe.toString());
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h4 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h4>
        <p className="text-gray-600 mb-6">Enter your email and password to sign in!</p>
        <form onSubmit={handleLogin}>
          <InputField
            variant="auth"
            extra="mb-4"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <InputField
            variant="auth"
            extra="mb-4"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Checkbox 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                className="h-4 w-4"
              />
              <p className="ml-2 text-sm text-gray-700">Keep me logged In</p>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-700">Not registered yet?</span>
          <Link to="/sign-up" className="text-sm text-blue-500 hover:text-blue-600 ml-1">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
