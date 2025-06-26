
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Olá! Vim do site Nome Limpo Agora e gostaria de saber mais sobre como limpar meu nome. Podem me ajudar?"
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Falar no WhatsApp"
    >
      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
      <MessageCircle className="w-6 h-6 relative z-10" />
    </button>
  );
};

export default WhatsAppButton;
