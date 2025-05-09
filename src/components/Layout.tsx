
import React from 'react';
import NavigationMenu from './NavigationMenu';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
