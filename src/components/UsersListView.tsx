import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Search, GraduationCap, Calendar, Mail, BookOpen } from "lucide-react";
import { User } from "../types";
import { storage } from "../utils/storage";

export default function UsersListView() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load registered users from local storage
    const loadedUsers = storage.getUsers();
    setUsers(loadedUsers);
  }, []);

  // Filter users based on query
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.department.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
            Registered Users Directory
          </h1>
          <p className="text-xs text-slate-500">
            Manage and view regular users who registered accounts on the AlumNexus Portal.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100 self-start sm:self-center">
          <Users className="h-4 w-4" />
          <span>Total Users: {users.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search users by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
            id="user-search-input"
          />
        </div>
      </div>

      {/* Users Grid/Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">User Info</th>
                  <th className="py-3.5 px-6">Academic Details</th>
                  <th className="py-3.5 px-6">Registered On</th>
                  <th className="py-3.5 px-6">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {user.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 shrink-0" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{user.department}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Class of {user.graduationYear}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-[11px] font-mono">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        {user.role || "User"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-10 w-10 text-slate-300" />
            <h3 className="mt-4 font-sans text-sm font-bold text-slate-900">
              No Users Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
              We couldn't find any registered accounts matching your current search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
