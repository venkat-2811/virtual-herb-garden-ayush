
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHerbs } from '@/contexts/HerbContext';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Leaf,
  Upload,
  Users,
  Settings,
  Plus,
  ArrowRight,
  BarChart,
} from 'lucide-react';

// Simple chart component
const SimpleBarChart = () => {
  return (
    <div className="w-full h-64 flex items-end gap-2 pt-8">
      {[65, 40, 85, 30, 55, 60, 75].map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full bg-herb-primary hover:bg-herb-secondary transition-colors rounded-t"
            style={{ height: `${value}%` }}
          ></div>
          <div className="text-xs mt-2 text-gray-600">Day {index + 1}</div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { herbs, loading } = useHerbs();
  
  // Stats
  const totalHerbs = herbs.length;
  const herbsWith3D = herbs.filter(herb => herb.model3dUrl).length;
  const regionsCount = new Set(herbs.flatMap(herb => herb.region)).size;
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Manage the AYUSH Virtual Herbal Garden and monitor system activity.
      </p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Herbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHerbs}</div>
            <p className="text-xs text-muted-foreground mt-1">+3 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Herbs with 3D Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{herbsWith3D}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((herbsWith3D / totalHerbs) * 100).toFixed(1)}% coverage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+5 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chat Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">+43 from last week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>User interactions in the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Herbs</CardTitle>
                <CardDescription>Latest additions to the database</CardDescription>
              </div>
              <Button asChild>
                <Link to="/admin/herbs/add">
                  <Plus className="mr-2 h-4 w-4" /> Add Herb
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {herbs.slice(0, 5).map(herb => (
                  <div key={herb.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        {herb.images.length > 0 ? (
                          <img 
                            src={herb.images[0].url} 
                            alt={herb.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-herb-primary/20 flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-herb-primary" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{herb.name}</p>
                        <p className="text-xs text-gray-500">{herb.scientificName}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/herbs/${herb.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/herbs">
                  View All Herbs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" asChild>
                <Link to="/admin/herbs/add">
                  <Plus className="mr-2 h-4 w-4" /> Add New Herb
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link to="/admin/uploads">
                  <Upload className="mr-2 h-4 w-4" /> Upload 3D Models
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link to="/admin/users">
                  <Users className="mr-2 h-4 w-4" /> Manage Users
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" /> System Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">AI Chatbot:</span>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Database:</span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage:</span>
                  <span className="text-sm font-medium text-green-600">65% Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Backup:</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
