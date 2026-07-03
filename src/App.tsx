import { useState, useEffect } from "react";
import { storage } from "./utils/storage";
import { User, Alumni, View } from "./types";
import Navbar from "./components/Navbar";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";
import DashboardView from "./components/DashboardView";
import AlumniView from "./components/AlumniView";
import HomeView from "./components/HomeView";
import UsersListView from "./components/UsersListView";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>("home"); // Default to Home Landing Page
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Global Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Show a global toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load session and alumni on mount
  useEffect(() => {
    const user = storage.getCurrentUser();
    const alumni = storage.getAlumni();
    
    setAlumniList(alumni);
    
    if (user) {
      setCurrentUser(user);
      setView("dashboard");
    } else {
      setView("home");
    }
  }, []);

  // Secure Route Guard
  // Redirects non-logged-in users trying to access dashboard/alumni/users-list to login page
  // Redirects regular users trying to access users-list back to dashboard
  useEffect(() => {
    if (!currentUser) {
      if (view !== "home" && view !== "login" && view !== "register") {
        setView("login");
      }
    } else {
      // User is logged in
      if (view === "users-list" && currentUser.role !== "admin") {
        setView("dashboard");
        showToast("Access Denied: Admin clearance required.", "error");
      }
      if (view === "home" || view === "login" || view === "register") {
        setView("dashboard");
      }
    }
  }, [currentUser, view]);

  const handleLoginSuccess = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
    setView("dashboard");
    showToast(`Welcome back, ${user.fullName}!`, "success");
  };

  const handleRegisterSuccess = () => {
    setView("login");
    showToast("Registration successful! Please log in to your new account.", "success");
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setView("home");
    showToast("Successfully logged out.", "success");
  };

  const handleAddAlumni = (newAlumnus: Omit<Alumni, "id" | "createdAt" | "updatedAt">) => {
    const added = storage.addAlumni(newAlumnus);
    setAlumniList(storage.getAlumni());
    showToast(`Added ${added.name} to the directory.`, "success");
  };

  const handleUpdateAlumni = (id: string, updatedFields: Partial<Omit<Alumni, "id" | "createdAt">> & { location: string }) => {
    const updated = storage.updateAlumni(id, updatedFields);
    if (updated) {
      setAlumniList(storage.getAlumni());
      showToast(`Updated details for ${updated.name}.`, "success");
    } else {
      showToast("Failed to update alumni record.", "error");
    }
  };

  const handleDeleteAlumni = (id: string) => {
    const success = storage.deleteAlumni(id);
    if (success) {
      setAlumniList(storage.getAlumni());
      showToast("Alumnus record deleted.", "success");
    } else {
      showToast("Failed to delete alumni record.", "error");
    }
  };

  // Determine if we should show the sidebar navigation layout
  const showSidebar = currentUser && (view === "dashboard" || view === "alumni" || view === "users-list");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col md:flex-row">
      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl border border-slate-800"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Sidebar (Left side on desktop, top/bottom bar on mobile) */}
      {showSidebar && (
        <Navbar
          currentView={view}
          onViewChange={(v) => setView(v)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Space */}
      <main className="flex-1 min-w-0 relative">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HomeView onNavigate={(v) => setView(v)} />
            </motion.div>
          )}

          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LoginView
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={() => setView("register")}
                onNavigateToHome={() => setView("home")}
              />
            </motion.div>
          )}

          {view === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterView
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={() => setView("login")}
                onNavigateToHome={() => setView("home")}
              />
            </motion.div>
          )}

          {view === "dashboard" && currentUser && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardView
                currentUser={currentUser}
                alumniList={alumniList}
                onViewChange={(v) => setView(v)}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            </motion.div>
          )}

          {view === "alumni" && currentUser && (
            <motion.div
              key="alumni"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AlumniView
                currentUser={currentUser}
                alumniList={alumniList}
                onAddAlumni={handleAddAlumni}
                onUpdateAlumni={handleUpdateAlumni}
                onDeleteAlumni={handleDeleteAlumni}
                isAddModalOpenInitially={isAddModalOpen}
                onCloseAddModalInitially={() => setIsAddModalOpen(false)}
              />
            </motion.div>
          )}

          {view === "users-list" && currentUser && currentUser.role === "admin" && (
            <motion.div
              key="users-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <UsersListView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
