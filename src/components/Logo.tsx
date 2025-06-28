
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link to="/" className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-[3px] border-green-500">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full" />
        </div>
        <div className="absolute -top-[1px] -right-[-1px] w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full"></div>
      </div>

      <span className="font-bold text-gray-800 dark:text-white transition-colors duration-300 ${sizeClasses[size] || sizeClasses.md}">
        <span className="text-green-500">NOME</span> <span className="text-yellow-500">LIMPO</span>
      </span>

    </Link>
  );
};

export default Logo;
