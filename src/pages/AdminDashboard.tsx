
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, PlusCircle, ListChecks, Upload, Leaf, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHerbs } from '@/contexts/HerbContext';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { herbs } = useHerbs();
  
  // For demonstration purposes
  const totalUsers = 42;
  const newUsersThisMonth = 7;
  const questionsAnswered = 152;
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Welcome back, {currentUser?.name || 'Admin'}. Here's an overview of your AYUSH platform.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Herbs
            </CardTitle>
            <Leaf className="h-4 w-4 text-herb-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{herbs.length}</div>
            <p className="text-xs text-muted-foreground">
              Cataloged medicinal herbs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Interactions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questionsAnswered}</div>
            <p className="text-xs text-muted-foreground">
              Questions answered by the AI
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="herbs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="herbs">Herb Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="herbs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Herbs</CardTitle>
                <CardDescription>
                  View and modify the herb catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Edit details, update scientific information, or remove herbs from the database.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="/admin/herbs">
                    Browse Herbs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Herb</CardTitle>
                <CardDescription>
                  Create a new herb entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add new medicinal herbs along with their properties, uses, and regional information.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="/admin/herbs/add">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Herb
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Herb Verification</CardTitle>
                <CardDescription>
                  Review and approve herb submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verify scientific accuracy and approve submissions from community contributors.
                </p>
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                  <p className="flex items-center">
                    <ListChecks className="h-4 w-4 mr-2" />
                    No pending submissions
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  Review Submissions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View all users, change roles and permissions, or deactivate accounts if needed.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="/admin/users">
                    <Users className="mr-2 h-4 w-4" /> Manage Users
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  Track user engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor user activity, popular herbs, search patterns, and AI interactions.
                </p>
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                  <p className="flex items-center">
                    <ListChecks className="h-4 w-4 mr-2" />
                    Activity reporting in development
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  View Activity Reports
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feedback & Support</CardTitle>
                <CardDescription>
                  Manage user feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Review user feedback, support requests, and feature suggestions.
                </p>
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                  <p className="flex items-center">
                    <ListChecks className="h-4 w-4 mr-2" />
                    No pending support requests
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  View Feedback
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
