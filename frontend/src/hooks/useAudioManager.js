import { useEffect, useMemo, useRef, useState } from 'react';

// Simple, reusable audio manager for background music and SFX
// Usage:
// const audio = useAudioManager({ tracks: { normal, urgent }, sfx: { correct, wrong } });
// audio.playBg('normal'); audio.switchBg('urgent'); audio.playSfx('correct'); audio.toggleMute();

export default function useAudioManager({ tracks = {}, sfx = {}, initialMuted = false, volume = 0.6, onError }) {
  const [muted, setMuted] = useState(initialMuted);
  const [currentBgKey, setCurrentBgKey] = useState(null);
  const bgRef = useRef(null);
  const sfxCacheRef = useRef({});
  const audioCtxRef = useRef(null);
  const bgOscRef = useRef(null);
  const bgGainRef = useRef(null);

  const preloadSfx = useMemo(() => {
    const cache = {};
    Object.entries(sfx).forEach(([key, url]) => {
      // Skip creating HTMLAudio for synthesized tone URLs
      if (typeof url === 'string' && url.startsWith('tone:')) return;
      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      cache[key] = audio;
    });
    return cache;
  }, [sfx]);

  // Initialize cache once
  useEffect(() => {
    sfxCacheRef.current = preloadSfx;
  }, [preloadSfx]);

  // Clean up background audio on unmount
  useEffect(() => () => {
    if (bgRef.current) {
      try { bgRef.current.pause(); } catch (_) {}
      bgRef.current = null;
    }
  }, []);

  const applyVolume = (audio) => {
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  };

  const ensureAudioCtx = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        if (onError) onError(e);
      }
    }
    return audioCtxRef.current;
  };

  const startBgTone = (freq = 220) => {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    stopBgTone();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(muted ? 0 : volume, ctx.currentTime);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    bgOscRef.current = osc;
    bgGainRef.current = gain;
  };

  const stopBgTone = () => {
    if (bgOscRef.current) {
      try { bgOscRef.current.stop(); } catch (_) {}
      bgOscRef.current.disconnect();
      bgOscRef.current = null;
    }
    if (bgGainRef.current) {
      try { bgGainRef.current.disconnect(); } catch (_) {}
      bgGainRef.current = null;
    }
  };

  const playSfxTone = (freq = 880, durationMs = 180, type = 'sine') => {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(muted ? 0 : Math.min(1, volume + 0.1), ctx.currentTime);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        try { osc.stop(); } catch (_) {}
        try { osc.disconnect(); gain.disconnect(); } catch (_) {}
      }, durationMs);
    } catch (e) {
      if (onError) onError(e);
    }
  };

  const playBg = (key) => {
    const url = tracks[key];
    if (!url) return;
    // Support synthesized tones via special tokens
    if (typeof url === 'string' && url.startsWith('tone:')) {
      // Map token to frequency
      const freq = url.includes('urgent') ? 440 : 220;
      stopBg();
      startBgTone(freq);
      setCurrentBgKey(key);
      return;
    }
    // HTMLAudio path
    if (bgRef.current) {
      try { bgRef.current.pause(); } catch (_) {}
    }
    const audio = new Audio(url);
    audio.crossOrigin = 'anonymous';
    audio.loop = true;
    applyVolume(audio);
    bgRef.current = audio;
    setCurrentBgKey(key);
    audio.play().catch((err) => {
      if (onError) onError(err);
    });
  };

  const switchBg = (key) => {
    if (currentBgKey === key) return;
    playBg(key);
  };

  const stopBg = () => {
    stopBgTone();
    if (bgRef.current) {
      try { bgRef.current.pause(); } catch (_) {}
      bgRef.current = null;
      setCurrentBgKey(null);
    }
  };

  const playSfx = (key) => {
    const url = sfx[key];
    if (typeof url === 'string' && url.startsWith('tone:')) {
      if (url.includes('correct')) {
        playSfxTone(880, 160, 'sine');
      } else if (url.includes('wrong')) {
        playSfxTone(140, 220, 'square');
      } else {
        playSfxTone(600, 150, 'sine');
      }
      return;
    }
    const audio = sfxCacheRef.current[key];
    if (!audio) return;
    try {
      // Reuse a single element per SFX to avoid creating many WebMediaPlayers
      audio.pause();
      audio.currentTime = 0;
      applyVolume(audio);
      audio.crossOrigin = 'anonymous';
      audio.play().catch((err) => {
        if (onError) onError(err);
      });
    } catch (_) {}
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (bgRef.current) {
      bgRef.current.volume = next ? 0 : volume;
    }
    if (bgGainRef.current) {
      try {
        const ctx = ensureAudioCtx();
        bgGainRef.current.gain.setValueAtTime(next ? 0 : volume, ctx.currentTime);
      } catch (_) {}
    }
  };

  return {
    muted,
    currentBgKey,
    playBg,
    switchBg,
    stopBg,
    playSfx,
    toggleMute,
  };
}


