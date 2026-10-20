const AudioCtx = window.AudioContext || window.webkitAudioContext;
let actx = null;

function initAudio() {
  if (!actx) actx = new AudioCtx();
  if (actx.state === 'suspended') actx.resume();
}

function sfx(type) {
  if (!actx) return;
  const now = actx.currentTime;
  const osc = actx.createOscillator();
  const gain = actx.createGain();
  osc.connect(gain);
  gain.connect(actx.destination);

  if (type === 'jump') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'sword') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
    osc.start(now);
    osc.stop(now + 0.09);
  } else if (type === 'dash') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  } else if (type === 'hit') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(55, now + 0.15);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'relic') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(261.6, now);
    osc.frequency.setValueAtTime(329.6, now + 0.12);
    osc.frequency.setValueAtTime(392.0, now + 0.24);
    osc.frequency.setValueAtTime(523.2, now + 0.36);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.7);
    osc.start(now);
    osc.stop(now + 0.7);
  } else if (type === 'orb') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'heart') {
    // Sonido cálido de recuperación de salud
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(659.25, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.22);
  } else if (type === 'wallslide') {
    // Ráfaga o fricción de piedra
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.06);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.06);
  } else if (type === 'parry') {
    // Sonido metálico agudo de parry perfecto / choque de aceros
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // Nota Si5
    osc.frequency.exponentialRampToValueAtTime(1975.53, now + 0.15); // Si6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'cast') {
    // Disparo místico / Hechizo de sangre
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.16);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
    osc.start(now);
    osc.stop(now + 0.16);
  } else if (type === 'crumble') {
    // Sonido de derrumbe de escombros y piedra rota
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(35, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  }
}

// =========================================================
// SECUENCIADOR DE MÚSICA AMBIENTAL GÓTICA (BGM)
// =========================================================
let bgmInterval = null;
let bgmStep = 0;
let currentBgmMode = 'none'; // 'explore' | 'boss'
let isMuted = false;

// Tema de Exploración (Arpegio gótico en Re Menor Armónica)
const EXPLORE_MELODY = [
  293.66, 349.23, 440.00, 349.23, // D4, F4, A4, F4
  466.16, 440.00, 349.23, 329.63, // Bb4, A4, F4, E4
  277.18, 329.63, 440.00, 329.63, // C#4, E4, A4, E4
  293.66, 220.00, 196.00, 220.00  // D4, A3, G3, A3
];
const EXPLORE_BASS = [
  73.42, 0, 73.42, 0,   // D2
  58.27, 0, 58.27, 0,   // Bb1
  69.30, 0, 69.30, 0,   // C#2
  73.42, 0, 55.00, 0    // D2, A1
];

// Tema del Jefe Final: Lord Malakor (Rápido y agresivo)
const BOSS_MELODY = [
  293.66, 311.13, 293.66, 277.18, // D4, Eb4, D4, C#4
  293.66, 349.23, 329.63, 277.18, // D4, F4, E4, C#4
  440.00, 466.16, 440.00, 392.00, // A4, Bb4, A4, G4
  349.23, 329.63, 293.66, 277.18  // F4, E4, D4, C#4
];
const BOSS_BASS = [
  73.42, 73.42, 77.78, 73.42,
  69.30, 69.30, 73.42, 55.00,
  73.42, 73.42, 77.78, 73.42,
  87.31, 82.41, 73.42, 69.30
];

function playNote(freq, type, duration, vol) {
  if (!actx || isMuted || freq <= 0) return;
  const now = actx.currentTime;
  const osc = actx.createOscillator();
  const gain = actx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(actx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

function setBgmMode(mode) {
  if (currentBgmMode === mode) return;
  currentBgmMode = mode;
  bgmStep = 0;

  if (bgmInterval) clearInterval(bgmInterval);
  if (mode === 'none') return;

  const tempoMs = (mode === 'boss') ? 140 : 250; // Jefe más rápido (140ms por nota)

  bgmInterval = setInterval(() => {
    // No sonar si el navegador aún no activó el audio o si el juego está en pausa
    if (!actx || actx.state !== 'running' || isMuted) return;
    if (typeof isPaused !== 'undefined' && isPaused) return;

    const idx = bgmStep % 16;
    if (currentBgmMode === 'explore') {
      playNote(EXPLORE_MELODY[idx], 'triangle', 0.22, 0.035);
      playNote(EXPLORE_BASS[idx], 'sawtooth', 0.35, 0.025);
    } else if (currentBgmMode === 'boss') {
      playNote(BOSS_MELODY[idx], 'square', 0.12, 0.035);
      playNote(BOSS_BASS[idx], 'sawtooth', 0.13, 0.04);
    }
    bgmStep++;
  }, tempoMs);
}

function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}