
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, UserPlus, Users, Shield, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
  createdAt: string;
  lastSignIn: string | null;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from Supabase
      // For the mock version, we'll use our predefined users
      const mockUsers: AdminUser[] = [
        {
          id: '1',
          email: 'admin@ayush.com',
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date('2023-01-01').toISOString(),
          lastSignIn: new Date('2023-05-01').toISOString()
        },
        {
          id: '2',
          email: 'user@ayush.com',
          name: 'Regular User',
          role: 'user',
          createdAt: new Date('2023-02-15').toISOString(),
          lastSignIn: new Date('2023-04-20').toISOString()
        },
        {
          id: '3',
          email: 'botanist@ayush.com',
          name: 'Botanist Expert',
          role: 'user',
          createdAt: new Date('2023-03-10').toISOString(),
          lastSignIn: null
        }
      ];
      
      // Get any users from localStorage if they exist
      try {
        const storedUsers = localStorage.getItem('ayushUsers');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          // Merge mock users with stored users, avoiding duplicates by email
          const emails = new Set(mockUsers.map(u => u.email));
          for (const user of parsedUsers) {
            if (!emails.has(user.email)) {
              mockUsers.push(user);
              emails.add(user.email);
            }
          }
        }
      } catch (error) {
        console.error("Error loading stored users:", error);
      }
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserRole = (userId: string, newRole: 'admin' | 'user') => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: newRole } 
        : user
    ));
    
    // Store updated users in localStorage
    localStorage.setItem('ayushUsers', JSON.stringify(users));
    
    toast.success(`User role updated to ${newRole}`);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Store updated users in localStorage
    localStorage.setItem('ayushUsers', JSON.stringify(
      users.filter(user => user.id !== userId)
    ));
    
    toast.success('User deleted successfully');
  };
  
  const filteredUsers = activeTab === 'all' 
    ? users 
    : users.filter(user => user.role === activeTab);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4 pl-0" asChild>
        <Link to="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the details for the new user account
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <input
                  id="name"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right">
                  Role
                </label>
                <select
                  id="role"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  toast.info('This feature is not implemented in the demo');
                }}
              >
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <CardTitle>Users</CardTitle>
              <TabsList>
                <TabsTrigger value="all" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Admins
                </TabsTrigger>
                <TabsTrigger value="user" className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Users
                </TabsTrigger>
              </TabsList>
            </div>
            
            <CardDescription className="mt-2">
              {activeTab === 'all' && 'Showing all registered users'}
              {activeTab === 'admin' && 'Showing administrator accounts'}
              {activeTab === 'user' && 'Showing regular user accounts'}
            </CardDescription>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <span className="ml-3">Loading users...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{user.name || 'Unnamed User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.role === 'admin' ? (
                            <Badge variant="default" className="bg-blue-500">Admin</Badge>
                          ) : (
                            <Badge variant="outline">User</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{formatDate(user.lastSignIn)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  {user.role === 'admin' ? 'Demote' : 'Promote'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {user.role === 'admin' 
                                      ? 'Demote to regular user?' 
                                      : 'Promote to admin?'}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {user.role === 'admin'
                                      ? 'This will remove administrator privileges from this user.'
                                      : 'This will grant administrator privileges to this user.'}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p>
                                    <span className="font-medium">{user.name}</span> 
                                    <span className="text-muted-foreground"> ({user.email})</span>
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="default"
                                    onClick={() => {
                                      updateUserRole(
                                        user.id, 
                                        user.role === 'admin' ? 'user' : 'admin'
                                      );
                                    }}
                                  >
                                    {user.role === 'admin' ? (
                                      <><XCircle className="mr-2 h-4 w-4" /> Demote</>
                                    ) : (
                                      <><CheckCircle className="mr-2 h-4 w-4" /> Promote</>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete User</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p>
                                    <span className="font-medium">{user.name}</span> 
                                    <span className="text-muted-foreground"> ({user.email})</span>
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Delete User
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
