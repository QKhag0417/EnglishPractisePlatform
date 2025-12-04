import { useState } from 'react';
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

interface  SpeakingContentEditorPageProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
  isEditMode?: boolean;
}

export function SpeakingContentEditorPage({ setCurrentPage, onLogout }:  SpeakingContentEditorPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  
  // Mock data
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Learner',
      status: 'Active',
      joinedDate: '2024-01-15',
      lastActive: '2024-03-20',
      testsCompleted: 12,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'Learner',
      status: 'Active',
      joinedDate: '2024-02-01',
      lastActive: '2024-03-19',
      testsCompleted: 8,
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mchen@example.com',
      role: 'Administrator',
      status: 'Active',
      joinedDate: '2023-12-10',
      lastActive: '2024-03-21',
      testsCompleted: 0,
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      role: 'Learner',
      status: 'Inactive',
      joinedDate: '2024-01-20',
      lastActive: '2024-02-15',
      testsCompleted: 5,
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'dwilson@example.com',
      role: 'Learner',
      status: 'Active',
      joinedDate: '2024-03-01',
      lastActive: '2024-03-21',
      testsCompleted: 3,
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavBarAdmin setCurrentPage={setCurrentPage} onLogout={onLogout} currentPage="user-management" />

      <div className="pt-[100px] pb-[60px] px-[60px]">
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
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Learner">Learner</SelectItem>
                <SelectItem value="Administrator">Administrator</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
                  defaultValue={editingUser ? editingUser.name.split(' ')[0] : ''}
                  placeholder="John"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue={editingUser ? editingUser.name.split(' ').slice(1).join(' ') : ''}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={editingUser?.email} placeholder="john.smith@example.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue={editingUser?.role || 'Learner'}>
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
                <Input id="password" type="password" placeholder="Enter password" />
              </div>
            ) : (
              // Edit User: Password is optional with helper text
              <div className="grid gap-2">
                <Label htmlFor="password">Password (optional)</Label>
                <Input id="password" type="password" placeholder="Enter new password" />
                <p className="text-[13px] text-gray-500">Leave blank to keep the current password.</p>
              </div>
            )}

            {/* Status field - only in Edit User modal */}
            {editingUser && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={editingUser?.status || 'Active'}>
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
