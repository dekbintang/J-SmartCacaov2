import { useRef, useState } from 'react';

const PLAYLIST = [
  '/sounds/jegog-1.mp3',
  '/sounds/gamelan-ambient.mp3',
  '/sounds/jegog-2.mp3',
];

export function useBgMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const loadTrack = (index: number) => {
    audioRef.current?.pause();
    audioRef.current = new Audio(PLAYLIST[index]);
    audioRef.current.loop = false;
    audioRef.current.volume = volume;
    audioRef.current.onended = () => nextTrack(); // auto next
  };

  const play = () => { audioRef.current?.play(); setIsPlaying(true); };
  const pause = () => { audioRef.current?.pause(); setIsPlaying(false); };
  const nextTrack = () => {
    const next = (trackIndex + 1) % PLAYLIST.length;
    setTrackIndex(next);
    loadTrack(next);
    play();
  };

  return { isPlaying, play, pause, nextTrack, volume, setVolume, trackIndex };
}