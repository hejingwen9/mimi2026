import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-paper-bg">
      {/* Paper Texture Base */}
      <div className="absolute inset-0 paper-texture mix-blend-multiply opacity-60"></div>

      {/* Subtle Gradient for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-stone-200 opacity-50"></div>
      
      {/* Ink Wash Style Circle (Enso-like) - Top Right */}
      <svg className="absolute -top-20 -right-20 w-96 h-96 text-stone-300 opacity-20 transform rotate-45" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" fill="none" strokeDasharray="200" strokeDashoffset="40" strokeLinecap="round" />
      </svg>

      {/* Bamboo/Leaf hints - Bottom Left */}
      <svg className="absolute bottom-0 left-0 w-80 h-80 text-bamboo opacity-10 transform -translate-x-10 translate-y-10" viewBox="0 0 100 100" fill="currentColor">
        <path d="M40,100 Q45,70 30,50" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M40,90 L25,85 M40,80 L55,75 M35,60 L20,55" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M60,100 Q65,60 50,30" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>

      {/* Floating Particles (Dust/Spirit) */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-ink-black rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-gold-muted rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cinnabar rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default Background;