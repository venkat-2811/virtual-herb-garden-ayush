
import React from 'react';
import { Leaf } from 'lucide-react';

interface LogoProps {
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  textColor = 'text-herb-primary dark:text-white', 
  size = 'md' 
}) => {
  const sizes = {
    sm: {
      iconSize: 16,
      text: 'text-lg font-semibold',
    },
    md: {
      iconSize: 24,
      text: 'text-2xl font-bold',
    },
    lg: {
      iconSize: 32,
      text: 'text-4xl font-bold',
    }
  };

  return (
    <div className={`flex items-center gap-2 ${textColor}`}>
      <Leaf 
        className="text-herb-primary dark:text-herb-secondary animate-leaf-wave" 
        size={sizes[size].iconSize} 
      />
      <span className={`font-serif ${sizes[size].text}`}>
        AYUSH <span className="text-herb-secondary">Herbal Garden</span>
      </span>
    </div>
  );
};

export default Logo;
