import React, { useState, useCallback, useRef, useEffect } from 'react';
import Background from './components/Background';
import FortuneStick from './components/FortuneStick';
import ResultModal from './components/ResultModal';
import { generateFortune } from './services/geminiService';
import { FortuneData } from './types';

const App: React.FC = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Audio Context for sound synthesis
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextShakeTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Initialize AudioContext on user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Synthesize a bamboo stick shaking sound
  const playShakeSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // Create noise buffer
    const bufferSize = ctx.sampleRate * 0.05; // Short duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to make it sound like wood/bamboo (Bandpass)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 400; 
    filter.Q.value = 1;

    // Envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
  };

  // Synthesize a clear "Clack/Drop" sound for the reveal
  const playRevealSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // A mix of a low thud and a high click
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);

    // Higher click component
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(800, t);
    clickOsc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
    
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.2, t);
    clickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.05);
  };

  // Loop sound while shaking
  const updateSound = () => {
    if (!isShaking) return;
    
    const now = Date.now();
    if (now >= nextShakeTimeRef.current) {
      playShakeSound();
      // Random interval between 100ms and 250ms for natural rattling
      nextShakeTimeRef.current = now + Math.random() * 150 + 100;
    }
    animationFrameRef.current = requestAnimationFrame(updateSound);
  };

  useEffect(() => {
    if (isShaking) {
      updateSound();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isShaking]);


  const handleShake = useCallback(async () => {
    if (isShaking || isRevealing || isLoading) return;

    initAudio();
    setIsShaking(true);
    setIsLoading(true);
    setFortune(null);
    
    // 1. Start Gemini Request
    const fortunePromise = generateFortune();

    // 2. Force Shake Duration (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Stop Shaking, Start Revealing Stick
    setIsShaking(false);
    setIsRevealing(true);
    playRevealSound();

    // 4. Wait for Reveal Animation (0.8 seconds matching CSS)
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // 5. Wait for Data if not ready (usually ready by now due to timeout logic in service)
      const result = await fortunePromise;
      setFortune(result);
      
      // 6. Show Modal
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to get fortune", error);
      // Could show toast error here
    } finally {
      setIsRevealing(false);
      setIsLoading(false);
    }
  }, [isShaking, isRevealing, isLoading]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-paper-bg text-ink-black font-serif selection:bg-cinnabar selection:text-white">
      <Background />

      <main className="relative z-10 w-full h-full flex flex-col items-center">
        {/* Header */}
        <header className="mt-12 mb-6 text-center animate-fade-in flex-shrink-0">
          <div className="inline-block p-1 rounded-lg">
            <div className="px-6 py-2">
               <h1 className="text-6xl font-calligraphy text-ink-black drop-shadow-sm tracking-widest">
                灵签
              </h1>
              <div className="flex items-center justify-center gap-2 mt-3 text-cinnabar">
                 <span className="h-[1px] w-8 bg-cinnabar/50"></span>
                 <p className="text-xs font-serif font-bold uppercase tracking-[0.3em]">
                  2026 丙午
                 </p>
                 <span className="h-[1px] w-8 bg-cinnabar/50"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Interactive Area */}
        <div className="flex-grow w-full max-w-md px-4 pb-24 flex flex-col justify-center">
          <FortuneStick 
            isShaking={isShaking} 
            isRevealing={isRevealing}
            onShake={handleShake} 
            disabled={isLoading || isModalOpen}
          />
        </div>
        
        {/* Footer */}
        <footer className="absolute bottom-4 w-full text-center opacity-40 text-xs font-serif">
          <p className="text-ink-black">心诚则灵 • Gemini AI Drive</p>
        </footer>
      </main>

      <ResultModal 
        fortune={fortune} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default App;
