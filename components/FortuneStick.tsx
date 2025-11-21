import React from 'react';

interface FortuneStickProps {
  isShaking: boolean;
  isRevealing: boolean;
  onShake: () => void;
  disabled: boolean;
}

const FortuneStick: React.FC<FortuneStickProps> = ({ isShaking, isRevealing, onShake, disabled }) => {
  return (
    <div className="relative flex flex-col items-center justify-center z-10 h-full w-full perspective-[800px]">
      
      {/* Main Container Wrapper - Handles Shake Animation */}
      <div className={`relative w-48 h-80 flex justify-center items-end ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* 1. Back Inner Wall (The dark inside of the cylinder) */}
        {/* Dark red/black shadow for depth inside */}
        <div className="absolute top-12 w-36 h-12 bg-[#5e0b0b] rounded-[50%] z-0 transform scale-x-95"></div>

        {/* 2. The Sticks Group (Sitting inside) */}
        <div className="absolute bottom-8 w-full h-full flex justify-center items-end z-10 pointer-events-none">
          <div className={`relative w-full h-full transition-transform duration-100 ${isShaking ? 'translate-y-2' : 'translate-y-0'}`}>
             
             {/* Background decorative sticks (Bamboo color) */}
             <div className="absolute bottom-10 left-[35%] w-2.5 h-56 bg-bamboo border-r border-amber-200/50 rotate-[-6deg] origin-bottom rounded-t-sm"></div>
             <div className="absolute bottom-10 right-[38%] w-2.5 h-52 bg-[#dcc39c] border-r border-amber-200/50 rotate-[4deg] origin-bottom rounded-t-sm"></div>
             <div className="absolute bottom-12 left-[42%] w-2.5 h-54 bg-[#e6cdab] border-r border-amber-200/50 rotate-[-2deg] origin-bottom rounded-t-sm"></div>
             <div className="absolute bottom-11 right-[45%] w-2.5 h-58 bg-bamboo border-r border-amber-200/50 rotate-[3deg] origin-bottom rounded-t-sm"></div>
             <div className="absolute bottom-9 left-[30%] w-2.5 h-48 bg-[#d4bb95] rotate-[-12deg] origin-bottom rounded-t-sm"></div>
             <div className="absolute bottom-9 right-[32%] w-2.5 h-50 bg-[#d4bb95] rotate-[10deg] origin-bottom rounded-t-sm"></div>

             {/* THE CHOSEN STICK - Animates Out and Drops */}
             <div 
               className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-4 h-64 bg-gradient-to-r from-amber-100 to-bamboo border-x border-amber-300 shadow-sm origin-bottom rounded-t-sm 
               ${isRevealing ? 'animate-drop-out' : 'rotate-[-1deg]'}
               `}
               style={{ zIndex: 15 }}
             >
                {/* Clean bamboo look, no red dots */}
                <div className="w-full h-full opacity-60 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-multiply"></div>
                {/* Subtle text hint on stick */}
                <div className="absolute top-4 left-0 w-full text-center opacity-40">
                    <span className="block w-[1px] h-12 bg-stone-400 mx-auto"></span>
                </div>
             </div>
          </div>
        </div>

        {/* 3. Cylinder Body (Front) - Chinese Red Lacquer Style */}
        <div className="absolute bottom-0 w-40 h-64 z-20">
           {/* Rim (Front half) - Gold/Bronze Accent */}
           <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 rounded-[50%] border-b-2 border-yellow-900 shadow-md"></div>
           
           {/* Tube Body */}
           <div className="absolute top-6 w-full h-[calc(100%-24px)] bg-gradient-to-r from-chinese-red via-lacquer-light to-chinese-red rounded-b-3xl shadow-2xl flex flex-col items-center overflow-hidden border-x border-red-900">
              
              {/* Glossy Lacquer Shine */}
              <div className="absolute top-0 left-2 w-6 h-full bg-white/10 blur-md z-10 rounded-full transform -skew-x-12"></div>
              <div className="absolute top-0 right-4 w-2 h-full bg-white/5 blur-sm z-10"></div>

              {/* Subtle Cloud Pattern Overlay */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/chinese-cloud-pattern.png')]"></div>

              {/* Decorative Gold Bands */}
              <div className="absolute top-4 w-full h-1 bg-yellow-500/50 border-y border-yellow-300/30"></div>
              <div className="absolute bottom-8 w-full h-2 bg-yellow-500/50 border-y border-yellow-300/30"></div>

              {/* Center Plaque - Vertical Gold Text */}
              <div className="mt-8 relative z-20 flex flex-col items-center">
                 <div className="w-16 py-4 bg-black/20 rounded-full border border-yellow-500/30 backdrop-blur-[1px] flex flex-col items-center justify-center shadow-inner">
                    <div className="flex flex-col items-center justify-center gap-0 text-gold-accent font-calligraphy text-4xl drop-shadow-md">
                        <span>丙</span>
                        <span>午</span>
                    </div>
                    <div className="w-4 h-4 mt-2 rounded-full border border-gold-accent flex items-center justify-center">
                        <div className="w-2 h-2 bg-gold-accent rounded-full"></div>
                    </div>
                    <h3 className="text-gold-muted font-serif text-xs mt-2 tracking-widest">二〇二六</h3>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Ground Shadow */}
        <div className="absolute -bottom-4 w-32 h-4 bg-black/40 blur-xl rounded-[100%] z-0"></div>

      </div>

      {/* Interaction Area */}
      <div className="mt-16 h-20 flex items-center justify-center w-full">
        {!isShaking && !isRevealing && !disabled && (
          <button 
            onClick={onShake}
            className="group relative px-12 py-4 bg-chinese-red text-paper-bg rounded-sm text-2xl font-serif tracking-[0.5em] shadow-lg hover:shadow-red-900/50 transition-all transform hover:-translate-y-1 overflow-hidden border border-red-800"
          >
             {/* Button texture */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <span className="relative z-10 drop-shadow-md font-bold">求签</span>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gold-accent opacity-50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gold-accent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gold-accent opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gold-accent opacity-50"></div>
          </button>
        )}
        
        {(isShaking || isRevealing) && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-chinese-red font-calligraphy text-2xl animate-pulse drop-shadow-sm">
              {isShaking ? '诚心祈福...' : '灵签已降'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FortuneStick;