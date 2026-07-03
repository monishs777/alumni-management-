import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Plus, 
  Search, 
  Clock,
  Briefcase,
  ShieldCheck,
  MapPin,
  Mail
} from "lucide-react";
import { User, Alumni, View } from "../types";
import { storage } from "../utils/storage";

interface DashboardViewProps {
  currentUser: User;
  alumniList: Alumni[];
  onViewChange: (view: View) => void;
  onOpenAddModal: () => void;
}

export default function DashboardView({
  currentUser,
  alumniList,
  onViewChange,
  onOpenAddModal,
}: DashboardViewProps) {
  const [totalUsers, setTotalUsers] = useState(0);
  const isAdmin = currentUser?.role === "admin";

  // Load registered users count on mount
  useEffect(() => {
    const users = storage.getUsers();
    setTotalUsers(users.length);
  }, [alumniList]);

  // Stats calculations
  const totalAlumni = alumniList.length;
  const uniqueDepts = Array.from(new Set(alumniList.map((a) => a.department))).length;
  const uniqueYears = Array.from(new Set(alumniList.map((a) => a.graduationYear))).length;

  // Department distribution
  const deptCounts = alumniList.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deptDistribution = Object.entries(deptCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / (totalAlumni || 1)) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4); // Show top 4

  // Recent additions
  const recentAlumni = [...alumniList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-xl bg-slate-900 p-6 text-white shadow-md border border-slate-800 sm:p-8"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-400 border border-blue-500/30">
            {isAdmin ? "⚡ Administrative Command" : "🏫 Alumni Network Portal"}
          </span>
          <h1 className="mt-4 font-sans text-2xl font-bold tracking-tight sm:text-3xl text-white">
            Welcome back, {isAdmin ? "System Admin" : currentUser.fullName}!
          </h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base leading-relaxed">
            {isAdmin ? (
              <span>
                You are currently logged in as the central <strong className="text-blue-400 font-semibold">Administrator</strong>. 
                You have full CRUD clearance to create, update, and delete institutional alumni records and audit registered users.
              </span>
            ) : (
              <span>
                You are logged into the AlumNexus Portal for the{" "}
                <span className="font-semibold text-blue-400">{currentUser.department}</span>,{" "}
                Class of <span className="font-semibold text-blue-400">{currentUser.graduationYear}</span>. 
                Browse placement catalogs, search alumni listings, and network with fellow graduates.
              </span>
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => {
                    onViewChange("alumni");
                    setTimeout(onOpenAddModal, 100);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-[0.98] hover:bg-blue-700"
                  id="admin-quick-add-btn"
                >
                  <Plus className="h-4 w-4" />
                  Add New Alumnus
                </button>
                <button
                  onClick={() => onViewChange("users-list")}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-700"
                  id="admin-view-users-btn"
                >
                  <Users className="h-4 w-4" />
                  View Registered Users
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewChange("alumni")}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-[0.98] hover:bg-blue-700"
                id="user-browse-dir-btn"
              >
                <Search className="h-4 w-4" />
                Browse Directory
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-blue-600/10 blur-2xl" />
        <div className="absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-indigo-500/10 blur-xl" />
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Alumni Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
            <Users className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Total Alumni Records
            </p>
            <h3 className="mt-1 font-sans text-2xl font-extrabold text-slate-900" id="stat-alumni-count">
              {totalAlumni}
            </h3>
          </div>
        </div>

        {/* Total Registered Users Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
            <ShieldCheck className="h-5.5 w-5.5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Total Registered Users
            </p>
            <h3 className="mt-1 font-sans text-2xl font-extrabold text-slate-900" id="stat-users-count">
              {totalUsers}
            </h3>
          </div>
        </div>

        {/* Departments Represented Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
            <BookOpen className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Departments
            </p>
            <h3 className="mt-1 font-sans text-2xl font-extrabold text-slate-900">
              {uniqueDepts}
            </h3>
          </div>
        </div>

        {/* Graduation Batches Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
            <Calendar className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Graduation Batches
            </p>
            <h3 className="mt-1 font-sans text-2xl font-extrabold text-slate-900">
              {uniqueYears}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/Middle Column - Top Departments & Recents */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Recent Alumni List */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-sans text-base font-bold text-slate-900">
                  Recently Added Alumni
                </h3>
                <p className="text-xs text-slate-500">
                  Latest profiles registered in the system
                </p>
              </div>
              <button
                onClick={() => onViewChange("alumni")}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {recentAlumni.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentAlumni.map((alumnus) => (
                  <div
                    key={alumnus.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 font-bold text-slate-800 border border-slate-200">
                        {alumnus.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          {alumnus.name}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                            {alumnus.department}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline" />
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            Class of {alumnus.graduationYear}
                          </span>
                          {alumnus.location && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline" />
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                {alumnus.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {alumnus.company && (
                      <div className="mt-2 sm:mt-0 flex items-center gap-1.5 self-start sm:self-center rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 border border-slate-100">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-medium">
                          {alumnus.jobRole || "Alumnus"} at <strong className="font-semibold text-slate-900">{alumnus.company}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  No alumni registered yet.
                </p>
                {isAdmin && (
                  <button
                    onClick={() => {
                      onViewChange("alumni");
                      setTimeout(onOpenAddModal, 100);
                    }}
                    className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Create the first record
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Academic Breakdown & Meta */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Academic Department Stats */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-sans text-base font-bold text-slate-900">
              Department Share
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              Alumni distribution by department
            </p>

            {deptDistribution.length > 0 ? (
              <div className="space-y-4">
                {deptDistribution.map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="truncate text-slate-700 max-w-[70%]" title={dept.name}>
                        {dept.name}
                      </span>
                      <span className="text-slate-500">
                        {dept.count} {dept.count === 1 ? "alumnus" : "alumni"} ({dept.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-xs text-slate-500 font-medium">
                No department data available.
              </p>
            )}
          </div>

          {/* Quick Info Checklist */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              Quick System Check
            </h4>
            <ul className="mt-3.5 space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Database Engine: <strong>LocalStorage</strong> (Active)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Auth Clearance: <strong>{isAdmin ? "ADMIN" : "USER"}</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Seeded Records: <strong>Available</strong>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
