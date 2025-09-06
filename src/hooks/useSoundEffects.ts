import { useCallback, useRef } from 'react';

interface SoundEffects {
  playQuestComplete: () => void;
  playLevelUp: () => void;
  playAchievement: () => void;
  playError: () => void;
  playClick: () => void;
}

export function useSoundEffects(): SoundEffects {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createTone = useCallback((frequency: number, duration: number, volume: number = 0.1, type: OscillatorType = 'sine') => {
    if (!enabledRef.current) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  }, [getAudioContext]);

  const playSequence = useCallback((notes: Array<{freq: number, duration: number, delay?: number, volume?: number, type?: OscillatorType}>) => {
    let totalDelay = 0;
    
    notes.forEach((note) => {
      setTimeout(() => {
        createTone(note.freq, note.duration, note.volume, note.type);
      }, totalDelay);
      totalDelay += (note.delay || note.duration * 1000);
    });
  }, [createTone]);

  const playQuestComplete = useCallback(() => {
    // Triumphant chord progression
    playSequence([
      { freq: 523.25, duration: 0.2, volume: 0.08, type: 'sine' }, // C5
      { freq: 659.25, duration: 0.2, volume: 0.08, type: 'sine', delay: 100 }, // E5
      { freq: 783.99, duration: 0.4, volume: 0.1, type: 'sine', delay: 200 }  // G5
    ]);
  }, [playSequence]);

  const playLevelUp = useCallback(() => {
    // Ascending magical scale
    playSequence([
      { freq: 261.63, duration: 0.15, volume: 0.06, type: 'triangle' }, // C4
      { freq: 329.63, duration: 0.15, volume: 0.07, type: 'triangle', delay: 120 }, // E4
      { freq: 392.00, duration: 0.15, volume: 0.08, type: 'triangle', delay: 120 }, // G4
      { freq: 523.25, duration: 0.15, volume: 0.09, type: 'triangle', delay: 120 }, // C5
      { freq: 659.25, duration: 0.4, volume: 0.1, type: 'sine', delay: 120 }  // E5
    ]);
  }, [playSequence]);

  const playAchievement = useCallback(() => {
    // Epic achievement fanfare
    playSequence([
      { freq: 440.00, duration: 0.3, volume: 0.08, type: 'square' }, // A4
      { freq: 554.37, duration: 0.3, volume: 0.08, type: 'square', delay: 200 }, // C#5
      { freq: 659.25, duration: 0.6, volume: 0.1, type: 'sine', delay: 200 }  // E5
    ]);
  }, [playSequence]);

  const playError = useCallback(() => {
    // Descending error tone
    playSequence([
      { freq: 330, duration: 0.2, volume: 0.05, type: 'sawtooth' },
      { freq: 220, duration: 0.3, volume: 0.05, type: 'sawtooth', delay: 150 }
    ]);
  }, [playSequence]);

  const playClick = useCallback(() => {
    // Subtle UI click
    createTone(800, 0.05, 0.03, 'sine');
  }, [createTone]);

  return {
    playQuestComplete,
    playLevelUp,
    playAchievement,
    playError,
    playClick
  };
}