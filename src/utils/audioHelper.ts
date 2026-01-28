/**
 * Ensures an audio element has looping enabled through multiple approaches
 * for maximum cross-browser compatibility
 */
export const ensureAudioLooping = (audio: HTMLAudioElement): void => {
  // Standard loop attribute
  audio.loop = true;
  
  // Add looping through event listener as fallback
  const loopHandler = () => {
    audio.currentTime = 0;
    audio.play().catch(e => console.error("Loop play failed:", e));
  };
  
  // Remove any existing handler to avoid duplicates
  audio.removeEventListener('ended', loopHandler);
  
  // Add the loop handler
  audio.addEventListener('ended', loopHandler);
};

/**
 * Pre-loads an audio file to reduce delay when playing
 */
export const preloadAudio = (audioSrc: string): HTMLAudioElement => {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = audioSrc;
  return audio;
};

/**
 * Play audio with a fallback for browsers that don't support Promises with audio.play()
 */
export const playAudioWithFallback = (audio: HTMLAudioElement): Promise<void> => {
  try {
    return audio.play();
  } catch (err) {
    console.error("Legacy browser detected, using alternative play method");
    audio.play();
    return Promise.resolve();
  }
};
