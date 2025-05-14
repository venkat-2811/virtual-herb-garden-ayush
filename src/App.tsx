
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { HerbProvider } from '@/contexts/HerbContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import HerbDetails from './pages/HerbDetails';
import ChatPage from './pages/ChatPage';
import Garden3D from './pages/Garden3D';
import UserProfile from './pages/UserProfile';
import Profile from './pages/Profile';
import AdminHerbsList from './pages/admin/AdminHerbsList';
import AdminHerbForm from './pages/admin/AdminHerbForm';
import AdminUpload from './pages/admin/AdminUpload';
import AdminUsers from './pages/admin/AdminUsers';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Wrapper to redirect based on auth status
const DashboardRedirect = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HerbProvider>
        <ChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Route to redirect to the appropriate dashboard */}
                  <Route path="/dashboard-redirect" element={<DashboardRedirect />} />
                  
                  {/* User Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/herbs/:id" element={<HerbDetails />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/3d-garden" element={<Garden3D />} />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/herbs" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminHerbsList />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/herbs/add" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminHerbForm />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/herbs/:id/edit" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminHerbForm />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/herbs/:id/upload" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUpload />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </ChatProvider>
      </HerbProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
