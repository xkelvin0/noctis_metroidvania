// =============================================================================
// js/core/input.js - Gestión de Entradas de Teclado, Ratón y Atajos de Juego
// Noctis: Metroidvania - Núcleo de Entrada
// =============================================================================

const keys = {};
const justPressed = {};

function clearJustPressed() {
  for (const k in justPressed) delete justPressed[k];
}

// Prevenir menú contextual del clic derecho
window.addEventListener('contextmenu', e => e.preventDefault());

// Detección de botones del ratón
window.addEventListener('mousedown', e => {
  if (!gameStarted || isPaused) return;
  initAudio();
  if (e.button === 0) justPressed['mouseLeft'] = true;
  else if (e.button === 2) justPressed['mouseRight'] = true;
});

// Detección de teclas del teclado y atajos globales
window.addEventListener('keydown', e => {
  if (!gameStarted) return;
  initAudio();
  if (typeof currentBgmMode !== 'undefined' && currentBgmMode === 'none') {
    setBgmMode(currentRoomId === 5 && !gameWon ? 'boss' : 'explore');
  }

  const k = e.key.toLowerCase();
  const code = e.code.toLowerCase();

  // Tienda abierta
  if (typeof isShopOpen === 'function' && isShopOpen()) {
    if (k === 'escape' || k === 'e') {
      closeShop();
      e.preventDefault();
      return;
    }
    return;
  }

  // Tutorial de reliquia abierto
  if (typeof isTutorialOpen !== 'undefined' && isTutorialOpen) {
    if (k === 'escape' || k === ' ' || k === 'enter') {
      closeSkillTutorial();
      e.preventDefault();
      return;
    }
  }

  // Atajos directos del Grimorio (Menú de Pausa)
  if (k === 'm') {
    isPaused && document.getElementById('tab-map').classList.contains('active') ? togglePause() : togglePause('tab-map');
    e.preventDefault(); return;
  }
  if (k === 'k') {
    isPaused && document.getElementById('tab-bestiary').classList.contains('active') ? togglePause() : togglePause('tab-bestiary');
    e.preventDefault(); return;
  }
  if (k === 'n') {
    isPaused && document.getElementById('tab-relics').classList.contains('active') ? togglePause() : togglePause('tab-relics');
    e.preventDefault(); return;
  }
  if (k === 'l') {
    isPaused && document.getElementById('tab-achievements').classList.contains('active') ? togglePause() : togglePause('tab-achievements');
    e.preventDefault(); return;
  }

  // Silenciar / Activar audio
  if (k === 'o') {
    const muted = toggleMute();
    showBanner(muted ? "MÚSICA SILENCIADA (O)" : "MÚSICA ACTIVADA (O)", 90);
    return;
  }

  // Alternar modo gráfico HD / Retro
  if (k === 'h') {
    toggleGraphicsMode();
    e.preventDefault();
    return;
  }

  // Diálogo con NPC activo: escape cierra el banner
  if (bannerTimer > 0 && bannerSpeaker) {
    if (k === 'escape') {
      if (typeof closeBanner === 'function') closeBanner();
      else { bannerTimer = 0; bannerText = ''; bannerSpeaker = ''; }
      e.preventDefault();
      return;
    }
  }

  // Menú de pausa principal
  if (k === 'escape' || k === 'p') {
    togglePause();
    e.preventDefault();
    return;
  }

  if (isPaused || (typeof isTutorialOpen !== 'undefined' && isTutorialOpen)) return;
  if (!keys[k]) justPressed[k] = true;
  if (!keys[code]) justPressed[code] = true;
  keys[k] = true;
  keys[code] = true;
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
});

window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
  keys[e.code.toLowerCase()] = false;
});

// Manejo de cambio de ventana y pérdida de foco (evita teclas atascadas)
function resetInputAndTiming() {
  for (const k in keys) keys[k] = false;
  for (const k in justPressed) justPressed[k] = false;
  if (typeof lastTime !== 'undefined') lastTime = performance.now();
  if (typeof accumulator !== 'undefined') accumulator = 0;
}

window.addEventListener('blur', resetInputAndTiming);
window.addEventListener('focus', resetInputAndTiming);
document.addEventListener('visibilitychange', () => {
  resetInputAndTiming();
});

