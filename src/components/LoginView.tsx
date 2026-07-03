import React, { useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { storage } from "../utils/storage";
import { User, View } from "../types";

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  onNavigateToHome: () => void;
}

export default function LoginView({ onLoginSuccess, onNavigateToRegister, onNavigateToHome }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailTrimmed = email.trim();
    const passTrimmed = password.trim();

    if (!emailTrimmed || !passTrimmed) {
      setError("Please fill in all fields.");
      return;
    }

    // Hardcoded Admin Credentials Check
    if (emailTrimmed.toLowerCase() === "admin@gmail.com" && passTrimmed === "Admin123!") {
      const adminUser: User = {
        id: "admin",
        fullName: "System Admin",
        email: "admin@gmail.com",
        department: "Administration",
        graduationYear: "N/A",
        createdAt: new Date().toISOString(),
        role: "admin",
      };
      setSuccess("Welcome, System Admin! Redirecting to Admin Dashboard...");
      setTimeout(() => {
        onLoginSuccess(adminUser);
      }, 800);
      return;
    }

    // Check user credentials from LocalStorage
    const users = storage.getUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === emailTrimmed.toLowerCase()
    );

    if (!foundUser) {
      setError("This email is not registered yet. Please sign up!");
      return;
    }

    if (foundUser.password !== passTrimmed) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // Ensure the role is assigned
    const userWithRole: User = {
      ...foundUser,
      role: foundUser.role || "user",
    };

    // Success login
    setSuccess("Login successful! Redirecting you...");
    setTimeout(() => {
      onLoginSuccess(userWithRole);
    }, 800);
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        {/* Branding logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/10">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to access the AlumNexus Portal
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 flex items-start gap-2.5 rounded-lg bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 border border-rose-100"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Notification */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 flex items-start gap-2.5 rounded-lg bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-100"
          >
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          >
            Sign In
          </button>
        </form>

        {/* Redirect / Register Link */}
        <div className="mt-6 border-t border-slate-200 pt-5 text-center space-y-3">
          <p className="text-sm text-slate-500">
            New to the portal?{" "}
            <button
              onClick={onNavigateToRegister}
              className="font-semibold text-blue-600 hover:underline"
              id="signup-redirect-btn"
            >
              Create an account
            </button>
          </p>
          <div className="text-center">
            <button
              onClick={onNavigateToHome}
              className="text-xs text-slate-400 hover:text-slate-600 hover:underline font-medium"
              id="home-redirect-btn"
            >
              ← Back to Home Page
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
