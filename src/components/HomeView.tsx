import { motion } from "motion/react";
import { GraduationCap, Users, Search, ShieldAlert, LogIn, UserPlus, ArrowRight, BookOpen, Award, CheckCircle } from "lucide-react";
import { View } from "../types";

interface HomeViewProps {
  onNavigate: (view: View) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  // Container stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/10">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="font-sans text-lg font-bold tracking-tight text-slate-900">
                AlumNexus
              </h1>
              <p className="font-mono text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
                Management Portal
              </p>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              id="landing-login-btn"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700"
              id="landing-register-btn"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-slate-900 text-white">
        {/* Decorative background shapes */}
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 border border-blue-500/25"
            >
              🎓 Institutional Network Platform
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white max-w-3xl mx-auto leading-tight"
            >
              Bridge the Gap Between <span className="text-blue-400">Past & Present</span> Graduates
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Welcome to AlumNexus, the unified portal designed to streamline alumni tracking, professional directory searches, and institutional networking with secure access control.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Enter System
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate("register")}
                className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-6 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-700"
              >
                Create Alumni Account
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Column 1: Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                About AlumNexus
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A Unified Gateway for Legacy and Growth
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                AlumNexus serves as an institutional directory bridging graduates with the active community. With support for multiple user roles, secure credentials, and powerful search tools, our application keeps everyone linked to current job placements, geographic distribution, and academic records.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span><strong>Secure Client-Side Database:</strong> Powered by LocalStorage with zero external backend dependencies.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span><strong>Role-Based Security:</strong> Strict access privileges for Administrators and regular registered Users.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span><strong>Advanced Directory Filters:</strong> Search instantly by Name, Company, Department, and Graduation Year.</span>
                </div>
              </div>
            </div>

            {/* Column 2: Visual feature cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Alumni Registry</h3>
                <p className="mt-2 text-slate-500 text-xs leading-relaxed">
                  Manage complete biographical sheets, work histories, placement companies, job roles, and geographic positions.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100 mb-4">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Dynamic Explorer</h3>
                <p className="mt-2 text-slate-500 text-xs leading-relaxed">
                  Lookup peers using full-text keywords on names, current employers, and role titles with drop-down filter menus.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100 mb-4">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Strict Security</h3>
                <p className="mt-2 text-slate-500 text-xs leading-relaxed">
                  Restricted admin views. Non-admins are programmatically prevented from accessing creation, modification, or deletion screens.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Verified Accounts</h3>
                <p className="mt-2 text-slate-500 text-xs leading-relaxed">
                  Graduates register directly using academic records, departments, and class year fields, updating stats in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Stats Section */}
      <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-around items-center gap-8 text-center">
            <div>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-400">100%</p>
              <p className="text-slate-400 text-xs tracking-wider uppercase mt-1">Client Storage</p>
            </div>
            <div className="h-px w-16 bg-slate-800 sm:h-12 sm:w-px" />
            <div>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-400">Zero</p>
              <p className="text-slate-400 text-xs tracking-wider uppercase mt-1">Backend Setup</p>
            </div>
            <div className="h-px w-16 bg-slate-800 sm:h-12 sm:w-px" />
            <div>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-400">Secure</p>
              <p className="text-slate-400 text-xs tracking-wider uppercase mt-1">Role Boundaries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>© 2026 AlumNexus Management Portal. Built for secure institutional directory services.</p>
      </footer>
    </div>
  );
}
