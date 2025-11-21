import React, { useEffect, useState } from 'react';
import { FortuneData } from '../types';

interface ResultModalProps {
  fortune: FortuneData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ fortune, isOpen, onClose }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen || !fortune) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Paper Scroll Container */}
      <div 
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#FDFBF7] text-ink-black rounded shadow-2xl transform transition-all duration-700 ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'}`}
        style={{ boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.25)' }}
      >
        {/* Top Red accent line */}
        <div className="h-2 w-full bg-cinnabar"></div>

        <div className="p-8 flex flex-col items-center text-center">
          
          {/* Header: Level & Title */}
          <div className="mb-8">
            <div className="inline-block border-2 border-cinnabar rounded-full px-3 py-1 mb-3">
              <span className="text-cinnabar text-sm font-bold tracking-widest">{fortune.level}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-ink-black mb-1">{fortune.title}</h2>
          </div>

          {/* The Poem (2 Lines - Vertical or large centered) */}
          <div className="bg-stone-100 p-8 rounded-sm w-full mb-8 border-l-4 border-stone-300 relative">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                <svg viewBox="0 0 100 100" fill="currentColor" className="text-ink-black">
                    <path d="M10,10 L90,10 L90,90 L10,90 Z" />
                </svg>
            </div>
            <div className="flex flex-col gap-4 font-calligraphy text-3xl text-ink-black leading-relaxed">
               {fortune.poem.map((line, idx) => (
                 <p key={idx} className="drop-shadow-sm">{line}</p>
               ))}
            </div>
          </div>

          {/* Interpretation (Concise) */}
          <div className="w-full text-left mb-8">
            <h4 className="text-stone-500 text-xs uppercase tracking-widest mb-2 border-b border-stone-200 pb-1">解签</h4>
            <p className="text-ink-black text-lg leading-relaxed font-serif">
              {fortune.interpretation}
            </p>
          </div>

          {/* Advice Grid */}
          <div className="w-full grid grid-cols-2 gap-4 text-left">
             <AdviceBlock title="事业" content={fortune.advice.career} />
             <AdviceBlock title="财运" content={fortune.advice.wealth} />
             <AdviceBlock title="缘分" content={fortune.advice.love} />
             <AdviceBlock title="健康" content={fortune.advice.health} />
          </div>

          {/* Seal / Stamp Button */}
          <button 
            onClick={onClose}
            className="mt-10 group relative"
          >
            <div className="w-16 h-16 rounded border-4 border-cinnabar flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                 <span className="font-calligraphy text-cinnabar text-2xl">收<br/>纳</span>
            </div>
          </button>
        </div>
        
        {/* Bottom Red accent line */}
        <div className="h-2 w-full bg-cinnabar"></div>
      </div>
    </div>
  );
};

const AdviceBlock: React.FC<{title: string, content: string}> = ({ title, content }) => (
  <div className="bg-stone-50 p-3 rounded border border-stone-100">
    <p className="font-bold text-stone-400 text-xs mb-1">{title}</p>
    <p className="text-ink-black text-sm font-serif leading-snug">{content}</p>
  </div>
);

export default ResultModal;