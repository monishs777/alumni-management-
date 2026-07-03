import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  X, 
  AlertCircle,
  ChevronsUpDown,
  MapPin
} from "lucide-react";
import { Alumni, User } from "../types";

interface AlumniViewProps {
  currentUser: User;
  alumniList: Alumni[];
  onAddAlumni: (alumni: Omit<Alumni, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateAlumni: (id: string, updatedFields: Partial<Omit<Alumni, "id" | "createdAt">> & { location: string }) => void;
  onDeleteAlumni: (id: string) => void;
  isAddModalOpenInitially: boolean;
  onCloseAddModalInitially: () => void;
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

const YEARS = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() + 2 - i));

export default function AlumniView({
  currentUser,
  alumniList,
  onAddAlumni,
  onUpdateAlumni,
  onDeleteAlumni,
  isAddModalOpenInitially,
  onCloseAddModalInitially,
}: AlumniViewProps) {
  const isAdmin = currentUser?.role === "admin";

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formLocation, setFormLocation] = useState("");
  
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Synchronize modal state if opened from parent
  React.useEffect(() => {
    if (isAddModalOpenInitially && isAdmin) {
      handleOpenAddModal();
      onCloseAddModalInitially();
    }
  }, [isAddModalOpenInitially, isAdmin]);

  // Open Add modal
  const handleOpenAddModal = () => {
    setEditingAlumni(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormDept("");
    setFormYear("");
    setFormCompany("");
    setFormRole("");
    setFormLocation("");
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (alumni: Alumni) => {
    setEditingAlumni(alumni);
    setFormName(alumni.name);
    setFormEmail(alumni.email);
    setFormPhone(alumni.phone || "");
    setFormDept(alumni.department);
    setFormYear(alumni.graduationYear);
    setFormCompany(alumni.company || "");
    setFormRole(alumni.jobRole || "");
    setFormLocation(alumni.location || "");
    setFormError(null);
    setIsModalOpen(true);
  };

  // Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formEmail.trim() || !formDept || !formYear) {
      setFormError("Name, Email, Department, and Graduation Year are required.");
      return;
    }

    const payload = {
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      department: formDept,
      graduationYear: formYear,
      company: formCompany.trim(),
      jobRole: formRole.trim(),
      location: formLocation.trim(),
    };

    if (editingAlumni) {
      onUpdateAlumni(editingAlumni.id, payload);
    } else {
      onAddAlumni(payload);
    }

    setIsModalOpen(false);
  };

  // Handle delete trigger
  const handleDeleteTrigger = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      onDeleteAlumni(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Filtered Alumni List
  const filteredAlumni = useMemo(() => {
    return alumniList.filter((alumni) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        alumni.name.toLowerCase().includes(q) ||
        (alumni.company && alumni.company.toLowerCase().includes(q)) ||
        (alumni.jobRole && alumni.jobRole.toLowerCase().includes(q)) ||
        (alumni.location && alumni.location.toLowerCase().includes(q));
      
      const matchesDept = selectedDept ? alumni.department === selectedDept : true;
      const matchesYear = selectedYear ? alumni.graduationYear === selectedYear : true;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [alumniList, searchQuery, selectedDept, selectedYear]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDept("");
    setSelectedYear("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
            Alumni Directory
          </h2>
          <p className="text-sm text-slate-500">
            Search, filter, and view members of the alumni network ({filteredAlumni.length} results)
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700 active:scale-[0.98]"
            id="add-alumni-btn"
          >
            <Plus className="h-4 w-4" />
            Add Alumnus
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, company, role, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
              id="alumni-search-input"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <BookOpen className="h-4 w-4" />
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-8 text-xs text-slate-950 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
              id="dept-filter-select"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronsUpDown className="h-3 w-3" />
            </span>
          </div>

          {/* Graduation Year Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Calendar className="h-4 w-4" />
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-8 text-xs text-slate-950 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
              id="year-filter-select"
            >
              <option value="">All Years</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronsUpDown className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Clear filters shortcut */}
        {(searchQuery || selectedDept || selectedYear) && (
          <div className="flex justify-end">
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            >
              <X className="h-3 w-3" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Directory Grid/List */}
      {filteredAlumni.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  <th className="p-4 pl-6">Alumnus ID</th>
                  <th className="p-4">Alumnus Info</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Grad Year</th>
                  <th className="p-4">Professional Placement</th>
                  <th className="p-4">Contact</th>
                  {isAdmin && <th className="p-4 pr-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAlumni.map((alumnus) => (
                  <tr key={alumnus.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Alumnus ID */}
                    <td className="p-4 pl-6 font-mono text-[10px] text-slate-400">
                      {alumnus.id}
                    </td>

                    {/* Alumnus Name / Avatar */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-800 border border-slate-200">
                          {alumnus.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{alumnus.name}</p>
                          {alumnus.location && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              {alumnus.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-4 text-slate-600 font-medium">
                      {alumnus.department}
                    </td>

                    {/* Graduation Year */}
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200">
                        {alumnus.graduationYear}
                      </span>
                    </td>

                    {/* Company and Job Role */}
                    <td className="p-4">
                      {alumnus.company ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800">{alumnus.jobRole || "Professional"}</p>
                          <p className="text-[11px] text-slate-500 font-medium">at {alumnus.company}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not Specified</span>
                      )}
                    </td>

                    {/* Contact details */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate max-w-[150px]">{alumnus.email}</span>
                      </div>
                      {alumnus.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{alumnus.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    {isAdmin && (
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(alumnus)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="Edit Details"
                            id={`edit-btn-${alumnus.id}`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrigger(alumnus.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete Record"
                            id={`delete-btn-${alumnus.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card Grid View */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {filteredAlumni.map((alumnus) => (
              <div 
                key={alumnus.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-800 border border-slate-200">
                      {alumnus.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{alumnus.name}</h4>
                      <p className="text-[11px] font-medium text-slate-500">{alumnus.department}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200">
                    Class of {alumnus.graduationYear}
                  </span>
                </div>

                {/* Job / Company info */}
                <div className="rounded-lg bg-slate-50 p-3 flex flex-col gap-2 text-xs border border-slate-100">
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      {alumnus.company ? (
                        <p className="text-slate-700 font-medium">
                          <strong>{alumnus.jobRole || "Alumnus"}</strong> at <span className="font-semibold text-slate-900">{alumnus.company}</span>
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">No professional record provided</p>
                      )}
                    </div>
                  </div>
                  {alumnus.location && (
                    <div className="flex items-center gap-2 text-slate-500 pl-6 text-[11px]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{alumnus.location}</span>
                    </div>
                  )}
                </div>

                {/* Contact details */}
                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{alumnus.email}</span>
                  </div>
                  {alumnus.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{alumnus.phone}</span>
                    </div>
                  )}
                </div>

                {/* Actions row */}
                {isAdmin && (
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleOpenEditModal(alumnus)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
                      id={`mobile-edit-${alumnus.id}`}
                    >
                      <Edit2 className="h-3 w-3 text-slate-500" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTrigger(alumnus.id)}
                      className="flex items-center gap-1 rounded-lg border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50/50 hover:bg-rose-50"
                      id={`mobile-delete-${alumnus.id}`}
                    >
                      <Trash2 className="h-3 w-3 text-rose-500" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <AlertCircle className="h-10 w-10 text-slate-300" />
          <h4 className="mt-3 text-sm font-semibold text-slate-900">No Alumni Found</h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            We couldn't find any alumni matching your search terms or filters. Try resetting the query.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

      {/* --- ADD/EDIT MODAL OVERLAY --- */}
      <AnimatePresence>
        {isModalOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            >
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-sans text-lg font-bold text-slate-900">
                    {editingAlumni ? "Edit Alumnus Details" : "Add New Alumnus"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingAlumni ? "Update academic and professional history" : "Add a graduate to the central registry"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Form errors */}
              {formError && (
                <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-800 border border-rose-100">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4" id="alumni-form">
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                    id="form-full-name"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@provider.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                      id="form-email"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 012-3456"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                      id="form-phone"
                    />
                  </div>
                </div>

                {/* Academic Profile */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Department *
                    </label>
                    <select
                      required
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                      id="form-department"
                    >
                      <option value="" disabled>Select Department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Graduation Year *
                    </label>
                    <select
                      required
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                      id="form-year"
                    >
                      <option value="" disabled>Select Year</option>
                      {YEARS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Professional Status */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Google, SpaceX"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                      id="form-company"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Job Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                      id="form-role"
                    />
                  </div>
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Geographic Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA or London, UK"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                    id="form-location"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all"
                    id="save-alumni-form-btn"
                  >
                    {editingAlumni ? "Save Changes" : "Create Record"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRM DELETE DIALOG --- */}
      <AnimatePresence>
        {deleteConfirmId && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3 border border-rose-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="font-sans text-sm font-bold text-slate-950">
                Delete Alumnus Record?
              </h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Are you sure you want to delete this record? This action cannot be undone and will permanently remove the record from LocalStorage.
              </p>
              <div className="mt-5 flex gap-2 justify-center">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
                  id="confirm-delete-btn"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
