
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Exploring the healing powers of traditional herbal medicine through modern technology.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/explore" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  Herb Database
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  Herbal Assistant
                </Link>
              </li>
              <li>
                <Link to="/3d-garden" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  3D Garden
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  About AYUSH
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  Research Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  Traditional Knowledge
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="mailto:contact@ayushgarden.org" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  contact@ayushgarden.org
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-herb-primary dark:hover:text-herb-secondary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AYUSH Virtual Herbal Garden. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
