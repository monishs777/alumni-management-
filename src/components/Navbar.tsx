import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  Search,
  BookOpen
} from "lucide-react";
import { User, View } from "../types";

interface NavbarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  currentUser,
  onLogout,
}: NavbarProps) {
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";

  return (
    <>
      {/* ========================================== */}
      {/* 🖥️ DESKTOP SIDEBAR VIEW (md and up)        */}
      {/* ========================================== */}
      <aside className="hidden md:flex h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-5 sticky top-0">
        <div className="space-y-6">
          {/* Brand Header */}
          <div 
            onClick={() => onViewChange("dashboard")}
            className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/10">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-sans text-base font-bold tracking-tight text-slate-900 leading-none">
                AlumNexus
              </h1>
              <p className="mt-1 font-mono text-[9px] text-slate-500 font-bold tracking-wider uppercase">
                Portal Network
              </p>
            </div>
          </div>

          {/* Active Profile Info */}
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-sm">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate" title={currentUser.fullName}>
                {currentUser.fullName}
              </p>
              <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700 border border-blue-100/50">
                {isAdmin ? "Administrator" : "Alumnus"}
              </span>
            </div>
          </div>

          {/* Vertical Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Navigation
            </p>
            <button
              onClick={() => onViewChange("dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentView === "dashboard"
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2.5"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              id="sidebar-dashboard-btn"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Summary Dashboard</span>
            </button>
            <button
              onClick={() => onViewChange("alumni")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentView === "alumni"
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2.5"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              id="sidebar-alumni-btn"
            >
              <Users className="h-4 w-4" />
              <span>{isAdmin ? "Alumni Management" : "Alumni Directory"}</span>
            </button>

            {isAdmin && (
              <>
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-4 mb-2">
                  Admin Scope
                </p>
                <button
                  onClick={() => onViewChange("users-list")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    currentView === "users-list"
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2.5"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  id="sidebar-users-btn"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Registered Users</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="border-t border-slate-100 pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            id="sidebar-logout-btn"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 📱 MOBILE NAVIGATION BAR (Header + Bottom)  */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md md:hidden block shrink-0">
        <div className="flex h-15 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-sans text-sm font-bold text-slate-900">AlumNexus</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-600 uppercase">
              {isAdmin ? "Admin" : "User"}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="flex h-8 items-center justify-center rounded-lg border border-slate-200 px-2.5 text-[11px] font-bold text-slate-600 bg-white hover:text-rose-600"
            id="mobile-logout-btn"
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            Log Out
          </button>
        </div>

        {/* Sticky horizontal top tab navigation on mobile */}
        <div className="flex border-t border-slate-100 bg-white px-1.5 py-1">
          <button
            onClick={() => onViewChange("dashboard")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
              currentView === "dashboard"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => onViewChange("alumni")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
              currentView === "alumni"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            {isAdmin ? "Manage" : "Directory"}
          </button>
          {isAdmin && (
            <button
              onClick={() => onViewChange("users-list")}
              className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                currentView === "users-list"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Users
            </button>
          )}
        </div>
      </header>
    </>
  );
}
