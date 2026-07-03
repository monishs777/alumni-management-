export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Stored securely in LocalStorage, but optional on clients if returned
  department: string;
  graduationYear: string;
  createdAt: string;
  role: "admin" | "user";
}

export interface Alumni {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  graduationYear: string;
  company: string;
  jobRole: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type View = "home" | "login" | "register" | "dashboard" | "alumni" | "users-list";
