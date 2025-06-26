
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
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">NL</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full"></div>
      </div>
      <div>
        <h1 className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent`}>
          Nome Limpo Agora
        </h1>
        <p className="text-xs text-gray-600 font-medium">
          Nome sujo não combina com você!
        </p>
      </div>
    </Link>
  );
};

export default Logo;
