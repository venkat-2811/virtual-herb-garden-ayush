
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, User, Search, Book, Settings, Check } from 'lucide-react';

const NavigationMenu: React.FC = () => {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-6">
              <Logo size="sm" />
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-4">
                <Link 
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(isAdmin ? "/admin/dashboard" : "/dashboard") 
                    ? "text-herb-primary bg-herb-primary/10"
                    : "text-gray-600 hover:text-herb-primary hover:bg-herb-primary/5"
                  }`}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                
                <Link 
                  to="/explore" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive("/explore") 
                    ? "text-herb-primary bg-herb-primary/10" 
                    : "text-gray-600 hover:text-herb-primary hover:bg-herb-primary/5"
                  }`}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Explore
                </Link>
                
                <Link 
                  to="/chat" 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive("/chat") 
                    ? "text-herb-primary bg-herb-primary/10" 
                    : "text-gray-600 hover:text-herb-primary hover:bg-herb-primary/5"
                  }`}
                >
                  <Book className="mr-2 h-4 w-4" />
                  Herbal Assistant
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin/herbs" 
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive("/admin/herbs") 
                      ? "text-herb-primary bg-herb-primary/10" 
                      : "text-gray-600 hover:text-herb-primary hover:bg-herb-primary/5"
                    }`}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Herbs
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-herb-primary text-white">
                      {currentUser?.name.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser?.name}</span>
                      <span className="text-xs text-gray-500">{currentUser?.email}</span>
                      <span className="text-xs mt-1 inline-flex items-center rounded-full bg-herb-primary/10 px-2 py-0.5 text-xs font-medium text-herb-primary">
                        {currentUser?.role === 'admin' ? 'Administrator' : 'User'}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-herb-primary hover:bg-herb-secondary" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
