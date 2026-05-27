// src/lib/bgAudio.ts
// ─── Singleton audio manager ───────────────────────────────────────────────
// Dibagi antara SplashScreen (start) dan MusicPlayer (kontrol)

export const TRACKS = [
  { title: 'Gamelan Jegog',    artist: 'Musik Tradisional Jembrana', src: '/audio/jegog.mp3',    emoji: '🎵' },
  { title: 'Iringan Mekepung', artist: 'Tradisi Bali Barat',         src: '/audio/mekepung.mp3', emoji: '🐃' },
  { title: 'Ambient Jembrana', artist: 'Suara Alam Bali Barat',      src: '/audio/ambient.mp3',  emoji: '🌿' },
];

let _audio: HTMLAudioElement | null = null;
let _idx   = 0;
let _vol   = 0.55;

// Listeners untuk trigger re-render di MusicPlayer
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach(fn => fn());
}

export const bgAudio = {
  // ── WAJIB dipanggil dari user gesture (click handler) ──────────────────
  // Kalau dipanggil di luar user gesture → browser blokir
  start(volume = 0.55) {
    if (typeof window === 'undefined') return;
    if (_audio) return; // Prevent multiple start calls

    _vol   = volume;
    _audio = new Audio(TRACKS[_idx].src);
    _audio.volume = volume;
    _audio.preload = 'auto'; // Change to auto to start downloading earlier

    _audio.addEventListener('ended', () => {
      this.next();
    });

    // Synchronously call play to keep user gesture context intact
    const playPromise = _audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          notify();
        })
        .catch(err => {
          console.error("Autoplay prevented:", err);
          notify();
        });
    } else {
      notify();
    }
  },

  // ── Getter ──────────────────────────────────────────────────────────────
  get instance()  { return _audio; },
  get trackIdx()  { return _idx; },
  get track()     { return TRACKS[_idx]; },
  get isPlaying() { return _audio ? !_audio.paused : false; },
  get volume()    { return _vol; },

  // ── Kontrol ─────────────────────────────────────────────────────────────
  play()  { const p = _audio?.play(); p?.then(() => notify()); return p; },
  pause() { _audio?.pause(); notify(); },

  next() {
    _idx = (_idx + 1) % TRACKS.length;
    this._changeTrack();
  },
  prev() {
    _idx = (_idx - 1 + TRACKS.length) % TRACKS.length;
    this._changeTrack();
  },
  setTrack(idx: number) {
    if (idx < 0 || idx >= TRACKS.length) return;
    _idx = idx;
    this._changeTrack();
  },

  setVolume(v: number) {
    _vol = v;
    if (_audio) _audio.volume = v;
    notify();
  },

  _changeTrack() {
    if (!_audio) return;
    const wasPlaying = !_audio.paused;
    _audio.src = TRACKS[_idx].src;
    _audio.load();
    if (wasPlaying) _audio.play().then(() => notify());
    else notify();
  },

  // ── Subscribe/Unsubscribe untuk komponen React ───────────────────────────
  subscribe(fn: () => void) {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
};
