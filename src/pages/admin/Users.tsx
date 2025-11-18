import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Trash2, Users, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  focusHours?: number;
  mentees?: number;
}

const mockUsers: User[] = [
  { id: '1', name: 'Khawla Almaliki', email: 'khawla@example.com', role: 'End User', joinDate: '2024-01-10', status: 'Active', focusHours: 45 },
  { id: '2', name: 'Ahmed Hassan', email: 'ahmed@example.com', role: 'Coach', joinDate: '2024-01-08', status: 'Active', mentees: 5 },
  { id: '3', name: 'Sarah Smith', email: 'sarah@example.com', role: 'End User', joinDate: '2024-01-05', status: 'Active', focusHours: 120 },
  { id: '4', name: 'John Doe', email: 'john@example.com', role: 'Developer', joinDate: '2024-01-01', status: 'Active', mentees: 0 },
  { id: '5', name: 'Emma Wilson', email: 'emma@example.com', role: 'Coach', joinDate: '2023-12-28', status: 'Inactive', mentees: 3 },
  { id: '6', name: 'Michael Brown', email: 'michael@example.com', role: 'End User', joinDate: '2023-12-20', status: 'Active', focusHours: 85 },
  { id: '7', name: 'Lisa Anderson', email: 'lisa@example.com', role: 'End User', joinDate: '2023-12-15', status: 'Inactive', focusHours: 12 },
  { id: '8', name: 'David Garcia', email: 'david@example.com', role: 'Coach', joinDate: '2023-12-10', status: 'Active', mentees: 8 },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User removed successfully');
  };

  const handleDeactivate = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
    toast.success('User status updated');
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'End User': 'bg-blue-100 text-blue-800',
      'Coach': 'bg-green-100 text-green-800',
      'Admin': 'bg-purple-100 text-purple-800',
      'Developer': 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">User Management</h1>
          </div>
          <p className="text-lg text-muted-foreground">Manage all users, roles, and permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Total Users</p>
            <p className="text-4xl font-bold text-primary">{users.length}</p>
          </div>
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Active</p>
            <p className="text-4xl font-bold text-success">{users.filter(u => u.status === 'Active').length}</p>
          </div>
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Coaches</p>
            <p className="text-4xl font-bold text-secondary">{users.filter(u => u.role === 'Coach').length}</p>
          </div>
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Inactive</p>
            <p className="text-4xl font-bold text-destructive">{users.filter(u => u.status === 'Inactive').length}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 rounded-3xl border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl py-2 h-auto"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="rounded-xl h-auto py-2">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="End User">End User</SelectItem>
                  <SelectItem value="Coach">Coach</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl h-auto py-2">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground py-2 px-3">
                Showing {filteredUsers.length} of {users.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Join Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-foreground">{user.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-muted-foreground">{user.joinDate}</p>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/user/${user.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2 h-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeactivate(user.id)}
                          className="h-8"
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="gap-2 h-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
