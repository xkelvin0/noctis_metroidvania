// =============================================================================
// js/ui/pause/options.js - Pestaña de Opciones, Audio, Gráficos y Reasignación de Teclas
// Noctis: Metroidvania - Módulo de Ajustes del Grimorio
// =============================================================================

const musicVolumeInput = document.getElementById('music-volume');
const sfxVolumeInput = document.getElementById('sfx-volume');
const btnRebindJump = document.getElementById('btn-rebind-jump');
const btnRebindDash = document.getElementById('btn-rebind-dash');
const btnRebindAttack = document.getElementById('btn-rebind-attack');
const btnRebindLeft = document.getElementById('btn-rebind-left');
const btnRebindRight = document.getElementById('btn-rebind-right');
const btnRebindDown = document.getElementById('btn-rebind-down');
const btnRebindCast = document.getElementById('btn-rebind-cast');
const btnRebindHook = document.getElementById('btn-rebind-hook');
const btnRebindInteract = document.getElementById('btn-rebind-interact');
const btnRebindTravel = document.getElementById('btn-rebind-travel');
const difficultySelect = document.getElementById('difficulty-select');
const toggleShake = document.getElementById('toggle-shake');
const toggleFlashes = document.getElementById('toggle-flashes');
const btnToggleSound = document.getElementById('btn-toggle-sound');
const btnToggleObjective = document.getElementById('btn-toggle-objective');
const btnToggleGraphics = document.getElementById('btn-toggle-graphics');

function syncAudioOptions() {
  const music = gameSettings.musicVolume ?? 0.7, effects = gameSettings.sfxVolume ?? 0.8;
  if (musicVolumeInput) musicVolumeInput.value = music;
  if (sfxVolumeInput) sfxVolumeInput.value = effects;
  if (typeof setAudioVolumes === 'function') setAudioVolumes(music, effects);
  if (difficultySelect) difficultySelect.value = gameSettings.difficulty || 'normal';
  if (toggleShake) toggleShake.checked = gameSettings.screenShake !== false;
  if (toggleFlashes) toggleFlashes.checked = gameSettings.flashes !== false;
  const bindings = [
    [btnRebindJump, 'jumpKey', 'SALTO', ' '], [btnRebindDash, 'dashKey', 'DASH', 'shift'], [btnRebindAttack, 'attackKey', 'ATAQUE', 'mouseLeft'],
    [btnRebindLeft, 'leftKey', 'MOVIMIENTO IZQUIERDA', 'a'], [btnRebindRight, 'rightKey', 'MOVIMIENTO DERECHA', 'd'],
    [btnRebindDown, 'downKey', 'AGACHARSE', 's'], [btnRebindCast, 'castKey', 'HECHIZO', 'q'], [btnRebindHook, 'hookKey', 'GANCHO', 'f'],
    [btnRebindInteract, 'interactKey', 'INTERACTUAR', 'e'], [btnRebindTravel, 'travelKey', 'VIAJE RÁPIDO', 't']
  ];
  bindings.forEach(([button, setting, label, fallback]) => {
    if (button) button.textContent = `⌨️ ${label}: ${(gameSettings[setting] || fallback).toUpperCase()}`;
  });
}

function captureBinding(button, setting, label) {
  button.textContent = `⌨️ Presiona una tecla para ${label}`;
  const capture = event => {
    event.preventDefault();
    event.stopPropagation();
    gameSettings[setting] = event.key.toLowerCase();
    button.textContent = `⌨️ ${label}: ${event.key.toUpperCase()}`;
    window.removeEventListener('keydown', capture, true);
    saveProgress();
  };
  window.addEventListener('keydown', capture, true);
}

// Inicialización de eventos de opciones
if (musicVolumeInput && sfxVolumeInput) {
  const updateVolume = () => {
    gameSettings.musicVolume = Number(musicVolumeInput.value);
    gameSettings.sfxVolume = Number(sfxVolumeInput.value);
    if (typeof setAudioVolumes === 'function') setAudioVolumes(gameSettings.musicVolume, gameSettings.sfxVolume);
    saveProgress();
  };
  musicVolumeInput.addEventListener('input', updateVolume);
  sfxVolumeInput.addEventListener('input', updateVolume);
}

if (btnToggleSound) {
  btnToggleSound.addEventListener('click', () => {
    const muted = toggleMute();
    showBanner(muted ? "MÚSICA SILENCIADA (O)" : "MÚSICA ACTIVADA (O)", 90);
  });
}

if (btnToggleObjective) {
  btnToggleObjective.addEventListener('click', () => {
    gameSettings.showObjectiveMarker = !gameSettings.showObjectiveMarker;
    if (typeof updateObjectiveButton === 'function') updateObjectiveButton();
    saveProgress();
  });
}

if (btnToggleGraphics) {
  btnToggleGraphics.addEventListener('click', () => {
    if (typeof toggleGraphicsMode === 'function') {
      toggleGraphicsMode();
    }
  });
}

if (btnRebindJump) btnRebindJump.addEventListener('click', () => captureBinding(btnRebindJump, 'jumpKey', 'SALTO'));
if (btnRebindDash) btnRebindDash.addEventListener('click', () => captureBinding(btnRebindDash, 'dashKey', 'DASH'));
if (btnRebindAttack) btnRebindAttack.addEventListener('click', () => captureBinding(btnRebindAttack, 'attackKey', 'ATAQUE'));
if (btnRebindLeft) btnRebindLeft.addEventListener('click', () => captureBinding(btnRebindLeft, 'leftKey', 'MOVIMIENTO IZQUIERDA'));
if (btnRebindRight) btnRebindRight.addEventListener('click', () => captureBinding(btnRebindRight, 'rightKey', 'MOVIMIENTO DERECHA'));
if (btnRebindDown) btnRebindDown.addEventListener('click', () => captureBinding(btnRebindDown, 'downKey', 'AGACHARSE'));
if (btnRebindCast) btnRebindCast.addEventListener('click', () => captureBinding(btnRebindCast, 'castKey', 'HECHIZO'));
if (btnRebindHook) btnRebindHook.addEventListener('click', () => captureBinding(btnRebindHook, 'hookKey', 'GANCHO'));
if (btnRebindInteract) btnRebindInteract.addEventListener('click', () => captureBinding(btnRebindInteract, 'interactKey', 'INTERACTUAR'));
if (btnRebindTravel) btnRebindTravel.addEventListener('click', () => captureBinding(btnRebindTravel, 'travelKey', 'VIAJE RÁPIDO'));

if (difficultySelect) difficultySelect.addEventListener('change', () => { gameSettings.difficulty = difficultySelect.value; saveProgress(); });
if (toggleShake) toggleShake.addEventListener('change', () => { gameSettings.screenShake = toggleShake.checked; saveProgress(); });
if (toggleFlashes) toggleFlashes.addEventListener('change', () => { gameSettings.flashes = toggleFlashes.checked; saveProgress(); });
