import { User, Alumni } from "../types";

const USERS_KEY = "users";
const ALUMNI_KEY = "alumni";
const SESSION_KEY = "current_user";

// Realistic dummy alumni data to seed the system if empty
const DEFAULT_ALUMNI: Alumni[] = [
  {
    id: "alm_1",
    name: "Jane Doe",
    email: "jane.doe@google.com",
    phone: "+1 (555) 019-2834",
    department: "Computer Science & Engineering",
    graduationYear: "2018",
    company: "Google",
    jobRole: "Senior Software Engineer",
    location: "Mountain View, CA",
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alm_2",
    name: "John Smith",
    email: "john.smith@tesla.com",
    phone: "+1 (555) 014-9988",
    department: "Electrical & Electronics Engineering",
    graduationYear: "2020",
    company: "Tesla",
    jobRole: "Power Electronics Engineer",
    location: "Austin, TX",
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alm_3",
    name: "Alice Johnson",
    email: "alice.j@microsoft.com",
    phone: "+1 (555) 017-1122",
    department: "Information Technology",
    graduationYear: "2015",
    company: "Microsoft",
    jobRole: "Principal Product Manager",
    location: "Redmond, WA",
    createdAt: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alm_4",
    name: "Dr. Robert Chen",
    email: "r.chen@mit.edu",
    phone: "+1 (555) 012-3456",
    department: "Mechanical Engineering",
    graduationYear: "2012",
    company: "MIT Media Lab",
    jobRole: "Research Scientist",
    location: "Boston, MA",
    createdAt: new Date(Date.now() - 1000 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alm_5",
    name: "Sarah Williams",
    email: "sarah.williams@stripe.com",
    phone: "+1 (555) 015-8844",
    department: "Business Administration",
    graduationYear: "2019",
    company: "Stripe",
    jobRole: "Head of Growth Operations",
    location: "New York, NY",
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const storage = {
  // --- USER AUTHENTICATION STORAGE ---
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse users from localStorage", e);
      return [];
    }
  },

  saveUser(user: Omit<User, "id" | "createdAt" | "role"> & { id?: string; createdAt?: string; role?: "admin" | "user" }): User {
    const users = this.getUsers();
    const newUser: User = {
      id: user.id || "usr_" + Math.random().toString(36).substr(2, 9),
      fullName: user.fullName,
      email: user.email.toLowerCase().trim(),
      password: user.password,
      department: user.department,
      graduationYear: user.graduationYear,
      createdAt: user.createdAt || new Date().toISOString(),
      role: user.role || "user",
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Failed to parse current user session", e);
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  // --- ALUMNI CRUD STORAGE ---
  getAlumni(): Alumni[] {
    try {
      const data = localStorage.getItem(ALUMNI_KEY);
      if (!data) {
        // Seed database if empty to improve first-time user experience
        localStorage.setItem(ALUMNI_KEY, JSON.stringify(DEFAULT_ALUMNI));
        return DEFAULT_ALUMNI;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse alumni from localStorage", e);
      return [];
    }
  },

  saveAlumniList(alumni: Alumni[]): void {
    localStorage.setItem(ALUMNI_KEY, JSON.stringify(alumni));
  },

  addAlumni(alumni: Omit<Alumni, "id" | "createdAt" | "updatedAt">): Alumni {
    const list = this.getAlumni();
    const newAlumni: Alumni = {
      ...alumni,
      id: "alm_" + Math.random().toString(36).substr(2, 9),
      name: alumni.name.trim(),
      email: alumni.email.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newAlumni); // Add to the top of the list
    this.saveAlumniList(list);
    return newAlumni;
  },

  updateAlumni(id: string, updatedFields: Partial<Omit<Alumni, "id" | "createdAt">>): Alumni | null {
    const list = this.getAlumni();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const updatedAlumni: Alumni = {
      ...list[idx],
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedAlumni;
    this.saveAlumniList(list);
    return updatedAlumni;
  },

  deleteAlumni(id: string): boolean {
    const list = this.getAlumni();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length === list.length) return false;
    this.saveAlumniList(filtered);
    return true;
  }
};
