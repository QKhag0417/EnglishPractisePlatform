import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Footer } from "../components/Footer";
import { NavBarAdmin } from "../components/NavBarAdmin";
import { Plus, Pencil, Trash2, Search, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { API_BASE } from "../env";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "Learner" | "Administrator";
  status: "Active" | "Inactive";
  joinedDate: string;
  lastActive: string;
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
  role?: string | null; // "Administrator" | "Learner" (or other from backend)
  isActive?: boolean | null;
  createdAt?: string | null;
  lastLoginAt?: string | null;
  testsCompleted?: number | null;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

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
    const createdAt = u.createdAt ?? new Date().toISOString();
    const lastActive = u.lastLoginAt ?? createdAt;

    return {
      id: String(u.userId),
      name: `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || "(No name)",
      email: u.email ?? "",
      role: u.role === "Administrator" ? "Administrator" : "Learner",
      status: u.isActive ? "Active" : "Inactive",
      joinedDate: createdAt,
      lastActive,
      testsCompleted: u.testsCompleted ?? 0,
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
      const res = await fetch(`${API_BASE}/api/user`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

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
    setFormPassword(""); // clear
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
        const res = await fetch(API_BASE, {
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

        const json = (await res.json()) as ApiResponse<ApiUser>;
        const created = json.data ? mapApiUser(json.data) : null;

        if (created) {
          setUsers((prev) => [...prev, created]);
        } else {
          // fallback
          await fetchUsers();
        }
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

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBarAdmin onLogout={handleLogout} />

      <div className="pt-[100px] pb-[60px] px-[60px] flex-1">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-[40px]">
            <div>
              <h1 className="font-['Inter'] text-[#1977f3] text-[36px] mb-2">
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
          <div className="grid grid-cols-4 gap-[20px] mb-[30px]">
            <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-[20px]">
              <p className="text-gray-600 text-[14px] mb-1">Total Users</p>
              <p className="text-[#1977f3] text-[32px]">{users.length}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-[12px] p-[20px]">
              <p className="text-gray-600 text-[14px] mb-1">Active Users</p>
              <p className="text-green-600 text-[32px]">
                {users.filter((u) => u.status === "Active").length}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-[12px] p-[20px]">
              <p className="text-gray-600 text-[14px] mb-1">Learners</p>
              <p className="text-purple-600 text-[32px]">
                {users.filter((u) => u.role === "Learner").length}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-[12px] p-[20px]">
              <p className="text-gray-600 text-[14px] mb-1">Administrators</p>
              <p className="text-orange-600 text-[32px]">
                {users.filter((u) => u.role === "Administrator").length}
              </p>
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

            <Select value={filterRole} onValueChange={handleFormRoleChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Learner">Learner</SelectItem>
                <SelectItem value="Administrator">Administrator</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterStatus}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Table */}
          <div className="bg-white border rounded-[12px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Tests Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-[14px] text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Administrator"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            user.role === "Administrator" ? "bg-purple-500" : ""
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "Active" ? "default" : "outline"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.joinedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(user.lastActive).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{user.testsCompleted}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password field */}
            {!editingUser ? (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="password">Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Enter new password"
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
