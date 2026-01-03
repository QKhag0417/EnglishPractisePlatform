import { useState, useEffect } from 'react';
import { Page } from '../App';
import { Footer } from '../components/Footer';
import { NavBarAdmin } from '../components/NavBarAdmin';
import { Plus, Pencil, Trash2, Search, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Learner' | 'Administrator';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastActive: string;
  testsCompleted: number;
}

interface UserManagementPageProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
}

export function UserManagementPage({ setCurrentPage, onLogout }: UserManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  
  // Form state
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'Learner' | 'Administrator'>('Learner');
  const [formPassword, setFormPassword] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string>("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:8080/api/user";

  // fetch all users on mount
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        method: "GET",
        credentials: "include", // send cookies (jwt)
        headers: {
          "Accept": "application/json",
        },
      });

      if (res.status === 401) {
        // unauthorized -> call onLogout if provided
        onLogout?.();
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error("Failed to fetch users:", res.status, text);
        return;
      }

      const json = await res.json(); // expected ApiResponse { success, message, data }
      const backendUsers: any[] = json.data ?? [];

      const mapped: UserData[] = backendUsers.map((u: any) => ({
        id: String(u.userId),
        name: `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim(),
        email: u.email ?? '',
        role: (u.role === 'Administrator' ? 'Administrator' : 'Learner'),
        status: u.isActive ? 'Active' : 'Inactive',
        joinedDate: u.createdAt ?? new Date().toISOString(),
        lastActive: u.lastLoginAt ?? (u.createdAt ?? new Date().toISOString()),
        testsCompleted: (u.testsCompleted ?? 0),
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  // Delete user
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Accept": "application/json" },
      });

      if (res.status === 401) {
        onLogout?.();
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.error("Delete failed", res.status, txt);
        alert("Failed to delete user");
        return;
      }

      // optimistic UI update
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user");
    }
  };

  // Open edit dialog and populate form
  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
    const parts = user.name.split(' ');
    setFormFirstName(parts[0] ?? '');
    setFormLastName(parts.slice(1).join(' ') ?? '');
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setFormPassword('');
    setFormError("");
  };

  // Open create dialog
  const handleAddNew = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormRole('Learner');
    setFormError("");
    setFormPassword('');
    setFormStatus('Active');
  };

  // Save (create or update)
  const handleSave = async () => {
    // basic validation
    setFormError(""); // clear previous errors

    if (!formFirstName.trim() || !formLastName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const payloadCreate: any = {
      firstname: formFirstName.trim(),
      lastname: formLastName.trim(),
      email: formEmail.trim(),
      password: formPassword || undefined,
      role: formRole,
    };

    const payloadUpdate: any = {
      firstname: formFirstName.trim(),
      lastname: formLastName.trim(),
      email: formEmail.trim(),
      role: formRole,
      isActive: formStatus === 'Active',
    };
    if (formPassword && formPassword.trim() !== '') {
      payloadUpdate.password = formPassword;
    }

    try {
      if (editingUser) {
        // update
        const res = await fetch(`${API_BASE}/${editingUser.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payloadUpdate),
        });

        if (res.status === 401) {
          onLogout?.();
          return;
        }

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          console.error("Update failed", res.status, txt);
          alert("Failed to update user");
          return;
        }

        const json = await res.json();
        const u = json.data;
        // update local list
        setUsers(prev => prev.map(item => item.id === editingUser.id ? {
          id: String(u.userId),
          name: `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim(),
          email: u.email ?? '',
          role: u.role === 'Administrator' ? 'Administrator' : 'Learner',
          status: u.isActive ? 'Active' : 'Inactive',
          joinedDate: u.createdAt ?? item.joinedDate,
          lastActive: u.lastLoginAt ?? new Date().toISOString(),
          testsCompleted: u.testsCompleted ?? item.testsCompleted,
        } : item));
      } else {
        // create
        const res = await fetch(API_BASE, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payloadCreate),
        });

        if (res.status === 401) {
          onLogout?.();
          return;
        }

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          console.error("Create failed", res.status, txt);
          alert("Failed to create user");
          return;
        }

        const json = await res.json();
        const u = json.data;
        const newUser: UserData = {
          id: String(u.userId),
          name: `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim(),
          email: u.email ?? '',
          role: u.role === 'Administrator' ? 'Administrator' : 'Learner',
          status: u.isActive ? 'Active' : 'Inactive',
          joinedDate: u.createdAt ?? new Date().toISOString(),
          lastActive: u.lastLoginAt ?? (u.createdAt ?? new Date().toISOString()),
          testsCompleted: u.testsCompleted ?? 0,
        };
        setUsers(prev => [...prev, newUser]);
      }

      // close dialog & reset form
      setIsDialogOpen(false);
      setEditingUser(null);
      setFormFirstName('');
      setFormLastName('');
      setFormEmail('');
      setFormPassword('');
      setFormRole('Learner');
      setFormStatus('Active');

    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save user");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBarAdmin setCurrentPage={setCurrentPage} onLogout={onLogout} currentPage="user-management" />

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
            <Button onClick={handleAddNew} className="bg-[#1977f3] hover:bg-[#1567d3]">
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
              <p className="text-green-600 text-[32px]">{users.filter(u => u.status === 'Active').length}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-[12px] p-[20px]">
              <p className="text-gray-600 text-[14px] mb-1">Learners</p>
              <p className="text-purple-600 text-[32px]">{users.filter(u => u.role === 'Learner').length}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-[12px] p-[20px]">
              <p className="text-gray-600 text-[14px] mb-1">Administrators</p>
              <p className="text-orange-600 text-[32px]">{users.filter(u => u.role === 'Administrator').length}</p>
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
            <Select value={filterRole} onValueChange={(v: string) => setFilterRole(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Learner">Learner</SelectItem>
                <SelectItem value="Administrator">Administrator</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v: string) => setFilterStatus(v)}>
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
                {filteredUsers.map((user) => (
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
                        variant={user.role === 'Administrator' ? 'default' : 'secondary'}
                        className={user.role === 'Administrator' ? 'bg-purple-500' : ''}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update the user details and permissions.' : 'Create a new user account.'}
            </DialogDescription>
          </DialogHeader>


          <div className="grid gap-4 py-4">
            {/* First Name and Last Name - side by side */}
            {/* Behaviour: When editing, these fields are pre-filled with the user's current first and last name */}
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
              <Input id="email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="john.smith@example.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formRole} onValueChange={(v: any) => setFormRole(v)}>
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
              // Add New User: Password is required
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Enter password" />
              </div>
            ) : (
              // Edit User: Password is optional with helper text
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Enter new password" />
              </div>
            )}

            {/* Status field - only in Edit User modal */}
            {editingUser && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formStatus} onValueChange={(v: any) => setFormStatus(v)}>
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
              <div className="text-red-600 text-center font-semibold text-[16px] mb-3">
                {formError}
              </div>
            )}

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#1977f3] hover:bg-[#1567d3]">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
