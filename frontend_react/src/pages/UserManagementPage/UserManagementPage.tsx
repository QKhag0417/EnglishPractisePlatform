import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Footer } from "../../components/Footer";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Mail,
  Users,
  BookOpen,
  UserX,
  UserCheck,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { API_BASE } from "../../env";
import { NavBarUnified } from "../../components/NavBarUnified";
import {
  SelectOption,
  SelectV2,
} from "../TutorDashboardPage/components/SelectV2";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "Learner" | "Tutor" | "Administrator";
  status: "Active" | "Inactive";
  joinedDate: LocalDateTimeArray;
  lastActive: LocalDateTimeArray;
  testsCompleted: number;
}

interface UserManagementPageProps {
  onLogout?: () => void;
}

type ApiUser = {
  userId: string | number;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  role?: string | null;
  isActive?: boolean | null;
  createdAt: LocalDateTimeArray;
  lastLoginAt: LocalDateTimeArray;
  testsCompleted?: number | null;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type LocalDateTimeArray = [
  number, // year
  number, // month
  number, // day
  number, // hour
  number, // minute
  number, // second
  number, // nanosecond
];

export function UserManagementPage({ onLogout }: UserManagementPageProps) {
  // =========================
  // Auth + navigation + session handling
  // =========================

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // prefer parent handler if supplied, otherwise use auth context
    if (onLogout) {
      onLogout();
      return;
    }
    logout();
    navigate("/");
  };

  const handleUnauthorized = () => {
    handleLogout();
  };

  // =========================
  // UI filters state
  // =========================

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | UserData["role"]>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | UserData["status"]>(
    "all",
  );

  // =========================
  // Dialog + editing state
  // =========================

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // =========================
  // Form state (create/edit user)
  // =========================

  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserData["role"]>("Learner");
  const [formPassword, setFormPassword] = useState("");
  const [formStatus, setFormStatus] = useState<UserData["status"]>("Active");
  const [formError, setFormError] = useState("");

  // =========================
  // Data state (users + loading)
  // =========================

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // API mapping + error helpers
  // =========================

  function mapApiUser(u: ApiUser): UserData {
    return {
      id: String(u.userId),
      name: `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || "(No name)",
      email: u.email ?? "—",
      role:
        u.role === "Administrator"
          ? "Administrator"
          : u.role === "Tutor"
            ? "Tutor"
            : "Learner",
      status: u.isActive ? "Active" : "Inactive",
      joinedDate: u.createdAt ?? [0, 0, 0, 0, 0, 0, 0],
      lastActive: u.lastLoginAt ?? u.createdAt ?? [0, 0, 0, 0, 0, 0, 0],
      testsCompleted: 0, // remove if not used
    };
  }

  async function readErrorMessage(res: Response): Promise<string> {
    // try JSON message first, fallback to text
    try {
      const json = (await res.json()) as ApiResponse<unknown>;
      return json?.message || `Request failed (${res.status})`;
    } catch {
      const txt = await res.text().catch(() => "");
      return txt || `Request failed (${res.status})`;
    }
  }

  // =========================
  // Data fetching (list users)
  // =========================

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/user?include=email,firstname,lastname,isactive,createdat,lastloginat,role`,
        {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        },
      );

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        console.error("Failed to fetch users:", res.status, await res.text());
        return;
      }

      const json = (await res.json()) as ApiResponse<ApiUser[]>;
      const backendUsers = json.data ?? [];
      setUsers(backendUsers.map(mapApiUser));
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // Derived view data (search + role/status filters)
  // =========================

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, filterRole, filterStatus]);

  // =========================
  // Row actions (delete/edit) + create new
  // =========================

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const msg = await readErrorMessage(res);
        console.error("Delete failed:", msg);
        alert("Failed to delete user");
        return;
      }

      // optimistic update
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);

    const parts = user.name.split(" ");
    setFormFirstName(parts[0] ?? "");
    setFormLastName(parts.slice(1).join(" ") ?? "");
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setFormPassword("");
    setFormError("");
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsDialogOpen(true);

    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormRole("Learner");
    setFormPassword("");
    setFormStatus("Active");
    setFormError("");
  };

  // =========================
  // Save action (create/update) + validation + state reset
  // =========================

  const handleSave = async () => {
    setFormError("");

    // Validation aligned with your new page UX:
    // - Create: password required
    // - Edit: password optional
    if (!formFirstName.trim() || !formLastName.trim() || !formEmail.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (!editingUser && !formPassword.trim()) {
      setFormError("Password is required for new users.");
      return;
    }

    const payloadCreate = {
      firstname: formFirstName.trim(),
      lastname: formLastName.trim(),
      email: formEmail.trim(),
      password: formPassword.trim(),
      role: formRole,
    };

    const payloadUpdate: any = {
      firstname: formFirstName.trim(),
      lastname: formLastName.trim(),
      email: formEmail.trim(),
      role: formRole,
      isActive: formStatus === "Active",
    };
    if (formPassword.trim()) {
      payloadUpdate.password = formPassword.trim();
    }

    try {
      if (editingUser) {
        const res = await fetch(`${API_BASE}/api/user/${editingUser.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payloadUpdate),
        });

        if (res.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!res.ok) {
          const msg = await readErrorMessage(res);
          console.error("Update failed:", msg);
          setFormError(msg);
          return;
        }

        const json = (await res.json()) as ApiResponse<ApiUser>;
        const updated = json.data ? mapApiUser(json.data) : null;

        if (updated) {
          setUsers((prev) =>
            prev.map((u) => (u.id === editingUser.id ? updated : u)),
          );
        } else {
          // fallback
          await fetchUsers();
        }
      } else {
        const res = await fetch(`${API_BASE}/api/user`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payloadCreate),
        });

        if (res.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!res.ok) {
          const msg = await readErrorMessage(res);
          console.error("Create failed:", msg);
          setFormError(msg);
          return;
        }

        await fetchUsers();
      }

      // reset + close
      setIsDialogOpen(false);
      setEditingUser(null);
      setFormFirstName("");
      setFormLastName("");
      setFormEmail("");
      setFormPassword("");
      setFormRole("Learner");
      setFormStatus("Active");
      setFormError("");
    } catch (err) {
      console.error("Save error:", err);
      setFormError("Failed to save user.");
    }
  };

  // =========================
  // Filter + form select handlers
  // =========================

  const handleRoleFilterChange = (value: "all" | UserData["role"]) => {
    setFilterRole(value);
  };

  const handleStatusFilterChange = (value: "all" | UserData["status"]) => {
    setFilterStatus(value);
  };

  const handleFormRoleChange = (value: UserData["role"]) => {
    setFormRole(value);
  };

  const handleFormStatusChange = (value: UserData["status"]) => {
    setFormStatus(value);
  };

  // =========================
  // Role filter options
  // =========================

  type RoleFilter = "all" | UserData["role"];

  const roleOptions: SelectOption<RoleFilter>[] = [
    { value: "all", label: "All Roles" },
    { value: "Learner", label: "Learner" },
    { value: "Tutor", label: "Tutor" },
    { value: "Administrator", label: "Administrator" },
  ];

  // =========================
  // Status filter options
  // =========================

  type StatusFilter = "all" | UserData["status"];

  const statusOptions: SelectOption<StatusFilter>[] = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  // =========================
  // Derived statistics for cards
  // =========================

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const learners = users.filter((u) => u.role === "Learner").length;
  const administrators = users.filter((u) => u.role === "Administrator").length;

  // =========================
  // Helper to get badge color based on role (for user table)
  // =========================

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Tutor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Learner":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // =========================
  // Helper to get badge color based on status (for user table)
  // =========================

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // =========================
  // Helper to format LocalDateTimeArray to readable date string
  // =========================

  const formatLocalDateTimeArray = (dateArray?: LocalDateTimeArray | null) => {
    if (!dateArray) return "";

    const [year, month, day, hour = 0, minute = 0, second = 0, nanosecond = 0] =
      dateArray;

    return new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      Math.floor(nanosecond / 1_000_000),
    ).toLocaleDateString();
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBarUnified />

      <div className="pt-[100px] pb-[60px] px-[60px] flex-1">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-[24px]">
            <div>
              <h1 className="font-['Inter'] text-[#1977f3] text-[36px]">
                User Management
              </h1>
              <p className="text-gray-600 text-[16px]">
                Manage user accounts and permissions
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-[#1977f3] hover:bg-[#1567d3]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New User
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-[24px] mb-[24px]">
            {/* Total Users */}
            <div className="bg-gray-50 rounded-[12px] p-[24px] border border-gray-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-gray-200 flex items-center justify-center">
                  <Users className="w-[24px] h-[24px] text-gray-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-gray-500 uppercase">
                    Total Users
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-gray-900">
                    {totalUsers}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-green-50 rounded-[12px] p-[24px] border border-green-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-green-200 flex items-center justify-center">
                  <UserCheck className="w-[24px] h-[24px] text-green-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-green-600 uppercase">
                    Active Users
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-green-900">
                    {activeUsers}
                  </p>
                </div>
              </div>
            </div>

            {/* Learners */}
            <div className="bg-blue-50 rounded-[12px] p-[24px] border border-blue-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-blue-200 flex items-center justify-center">
                  <BookOpen className="w-[24px] h-[24px] text-blue-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-blue-600 uppercase">
                    Learners
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-blue-900">
                    {learners}
                  </p>
                </div>
              </div>
            </div>

            {/* Administrators */}
            <div className="bg-purple-50 rounded-[12px] p-[24px] border border-purple-200">
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-purple-200 flex items-center justify-center">
                  <UserX className="w-[24px] h-[24px] text-purple-700" />
                </div>
                <div>
                  <p className="font-['Inter'] text-[12px] text-purple-600 uppercase">
                    Administrators
                  </p>
                  <p className="font-['Inter'] text-[28px] font-semibold text-purple-900">
                    {administrators}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-[20px] mb-[30px]">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <SelectV2
              value={filterRole}
              onChange={handleRoleFilterChange}
              options={roleOptions}
              placeholder="Filter by role"
              className="w-[200px]"
            />

            <SelectV2
              value={filterStatus}
              onChange={handleStatusFilterChange}
              options={statusOptions}
              placeholder="Filter by status"
              className="w-[200px]"
            />
          </div>

          {/* User Table */}
          <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_140px_120px_120px_120px_130px_120px] gap-[20px] bg-gray-50 px-[24px] py-[16px] border-b border-gray-200">
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                User
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Role
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Status
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Joined Date
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Last Active
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase">
                Tests Completed
              </span>
              <span className="font-['Inter'] font-semibold text-[12px] text-gray-600 uppercase text-center">
                Actions
              </span>
            </div>

            {/* Table Body */}
            <div>
              {loading ? (
                <div className="px-[24px] py-[60px] text-center">
                  <p className="font-['Inter'] text-[16px] text-gray-600">
                    Loading users...
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="px-[24px] py-[60px] text-center">
                  <Users className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[16px]" />

                  <p className="font-['Inter'] text-[16px] text-gray-600 mb-[4px]">
                    No users found
                  </p>

                  <p className="font-['Inter'] text-[14px] text-gray-500">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[2fr_140px_120px_120px_120px_130px_120px] gap-[20px] px-[24px] py-[20px] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* User */}
                    <div className="min-w-0">
                      <p
                        className="font-['Inter'] text-[14px] text-gray-900 font-medium truncate"
                        title={user.name}
                      >
                        {user.name}
                      </p>

                      <p
                        className="font-['Inter'] text-[14px] text-gray-500 flex items-center gap-[4px] truncate"
                        title={user.email}
                      >
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </p>
                    </div>

                    {/* Role */}
                    <div>
                      <Badge
                        className={`${getRoleColor(user.role)} font-['Inter'] text-[14px] w-fit px-[12px]`}
                      >
                        {user.role}
                      </Badge>
                    </div>

                    {/* Status */}
                    <div>
                      <Badge
                        variant="outline"
                        className={`${getUserStatusColor(user.status)} font-['Inter'] text-[14px] w-fit px-[12px]`}
                      >
                        {user.status}
                      </Badge>
                    </div>

                    {/* Joined Date */}
                    <div>
                      <p className="font-['Inter'] text-[14px] text-gray-700">
                        {formatLocalDateTimeArray(user.joinedDate)}
                      </p>
                    </div>

                    {/* Last Active */}
                    <div>
                      <p className="font-['Inter'] text-[14px] text-gray-700">
                        {formatLocalDateTimeArray(user.lastActive)}
                      </p>
                    </div>

                    {/* Tests Completed */}
                    <div>
                      <p className="font-['Inter'] text-[14px] text-gray-700">
                        {user.testsCompleted}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-[8px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="font-['Inter']"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="font-['Inter']"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update the user details and permissions."
                : "Create a new user account."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formFirstName}
                  onChange={(e) => setFormFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formLastName}
                  onChange={(e) => setFormLastName(e.target.value)}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="john.smith@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formRole} onValueChange={handleFormRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Learner">Learner</SelectItem>
                  <SelectItem value="Tutor">Tutor</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password field */}
            {!editingUser ? (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="user-password-input"
                  name="user_password_input"
                  type="password"
                  autoComplete="new-password"
                  value={formPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormPassword(e.target.value)
                  }
                  placeholder="Enter password"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="password">Password (optional)</Label>
                <Input
                  id="user-password-input"
                  name="user_password_input"
                  type="password"
                  autoComplete="new-password"
                  value={formPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormPassword(e.target.value)
                  }
                  placeholder="Enter password"
                />
                <p className="text-[13px] text-gray-500">
                  Leave blank to keep the current password.
                </p>
              </div>
            )}

            {/* Status only in edit */}
            {editingUser && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formStatus}
                  onValueChange={handleFormStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formError && (
              <div className="text-red-600 text-center font-semibold text-[16px]">
                {formError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#1977f3] hover:bg-[#1567d3]"
            >
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
