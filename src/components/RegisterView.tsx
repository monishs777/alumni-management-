import React, { useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, User as UserIcon, Mail, Lock, BookOpen, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { storage } from "../utils/storage";

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Business Administration",
  "Data Science & Analytics",
  "Sciences & Humanities"
];

// Generate years from current year down to 1980
const YEARS = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() + 2 - i));

export default function RegisterView({ onRegisterSuccess, onNavigateToLogin, onNavigateToHome }: RegisterViewProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic Validations
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword || !department || !graduationYear) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = storage.getUsers();
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (emailExists) {
      setError("This email is already registered. Try logging in!");
      return;
    }

    // Save User
    try {
      storage.saveUser({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password,
        department,
        graduationYear,
      });

      setSuccess("Account registered successfully! Redirecting to login...");
      
      // Clear fields
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDepartment("");
      setGraduationYear("");

      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/10">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Register to join the AlumNexus Portal
          </p>
        </div>

        {/* Notifications */}
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>

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
                  placeholder="john.doe@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <BookOpen className="h-4 w-4" />
                </span>
                <select
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                >
                  <option value="" disabled>Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Graduation Year
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Calendar className="h-4 w-4" />
                </span>
                <select
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                >
                  <option value="" disabled>Select Year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          >
            Register Account
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-6 border-t border-slate-200 pt-5 text-center space-y-3">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="font-semibold text-blue-600 hover:underline"
              id="signin-redirect-btn"
            >
              Sign in instead
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
