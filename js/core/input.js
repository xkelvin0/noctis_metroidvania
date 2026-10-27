// =============================================================================
// js/core/input.js - Gestión de Entradas de Teclado, Ratón y Mandos (Gamepad API)
// Noctis: Metroidvania - Núcleo de Entrada y Háptica
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

// =============================================================================
// SOPORTE COMPLETO DE MANDOS (GAMEPAD API: Xbox, PlayStation, Switch)
// =============================================================================
let hasConnectedGamepad = false;
let gamepadIndex = null;
const prevGamepadButtons = {};

// Eventos de conexión y desconexión de mandos
window.addEventListener('gamepadconnected', (e) => {
  hasConnectedGamepad = true;
  gamepadIndex = e.gamepad.index;
  initAudio();
  const rawId = e.gamepad.id || 'Mando';
  const cleanName = rawId.split('(')[0].trim() || 'Gamepad Estándar';
  showBanner(`🎮 MANDO CONECTADO: ${cleanName.toUpperCase()}`, 130);
  triggerGamepadRumble(180, 0.4, 0.6);
});

window.addEventListener('gamepaddisconnected', (e) => {
  hasConnectedGamepad = false;
  showBanner('🎮 MANDO DESCONECTADO', 100);
});

// Vibración háptica en mandos (Rumble con Dual-Motor)
function triggerGamepadRumble(durationMs = 150, weak = 0.5, strong = 0.5) {
  if (typeof gameSettings !== 'undefined' && gameSettings.gamepadRumble === false) return;
  if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
  const gamepads = navigator.getGamepads();
  for (const gp of gamepads) {
    if (gp && gp.vibrationActuator && typeof gp.vibrationActuator.playEffect === 'function') {
      try {
        gp.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: durationMs,
          weakMagnitude: Math.min(1.0, Math.max(0, weak)),
          strongMagnitude: Math.min(1.0, Math.max(0, strong))
        });
      } catch (err) {}
    }
  }
}

// Muestreo cíclico de mandos por paso fijo de físicas
function pollGamepadInput() {
  if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
  const gamepads = navigator.getGamepads();
  let activeGp = null;
  for (const gp of gamepads) {
    if (gp && gp.connected) {
      activeGp = gp;
      break;
    }
  }
  if (!activeGp) return;

  const btns = activeGp.buttons;
  const axes = activeGp.axes;
  if (!btns || btns.length < 4) return;

  const isBtnPressed = (idx) => btns[idx] && (btns[idx].pressed || btns[idx].value > 0.5);
  const isJustPressed = (idx) => isBtnPressed(idx) && !prevGamepadButtons[idx];

  // 1. Pantalla de Inicio / Menú Principal
  if (typeof gameStarted !== 'undefined' && !gameStarted) {
    if (isJustPressed(0) || isJustPressed(9)) { // A o Start
      const btnContinue = document.getElementById('btn-continue');
      const btnNewGame = document.getElementById('btn-new-game');
      if (btnContinue && !btnContinue.classList.contains('disabled')) {
        btnContinue.click();
      } else if (btnNewGame) {
        btnNewGame.click();
      }
    }
    for (let i = 0; i < btns.length; i++) prevGamepadButtons[i] = isBtnPressed(i);
    return;
  }

  // 2. Control de Menú de Pausa / Grimorio
  if (typeof isPaused !== 'undefined' && isPaused) {
    if (isJustPressed(9) || isJustPressed(1)) { // Start o B para reanudar
      togglePause();
    } else if (isJustPressed(4)) { // LB / L1: Pestaña anterior
      const tabs = ['tab-map', 'tab-relics', 'tab-bestiary', 'tab-quests', 'tab-options'];
      const activePane = document.querySelector('.tab-pane.active');
      const curId = activePane ? activePane.id : 'tab-map';
      const curIdx = tabs.indexOf(curId);
      const prevTab = tabs[(curIdx - 1 + tabs.length) % tabs.length];
      if (typeof switchPauseTab === 'function') switchPauseTab(prevTab);
      triggerGamepadRumble(50, 0.2, 0.3);
    } else if (isJustPressed(5)) { // RB / R1: Pestaña siguiente
      const tabs = ['tab-map', 'tab-relics', 'tab-bestiary', 'tab-quests', 'tab-options'];
      const activePane = document.querySelector('.tab-pane.active');
      const curId = activePane ? activePane.id : 'tab-map';
      const curIdx = tabs.indexOf(curId);
      const nextTab = tabs[(curIdx + 1) % tabs.length];
      if (typeof switchPauseTab === 'function') switchPauseTab(nextTab);
      triggerGamepadRumble(50, 0.2, 0.3);
    }
    for (let i = 0; i < btns.length; i++) prevGamepadButtons[i] = isBtnPressed(i);
    return;
  }

  // 3. Tienda abierta
  if (typeof isShopOpen === 'function' && isShopOpen()) {
    if (isJustPressed(1) || isJustPressed(3)) {
      closeShop();
    }
    for (let i = 0; i < btns.length; i++) prevGamepadButtons[i] = isBtnPressed(i);
    return;
  }

  // 4. Tutorial de reliquia abierto
  if (typeof isTutorialOpen !== 'undefined' && isTutorialOpen) {
    if (isJustPressed(0) || isJustPressed(1) || isJustPressed(9)) {
      closeSkillTutorial();
    }
    for (let i = 0; i < btns.length; i++) prevGamepadButtons[i] = isBtnPressed(i);
    return;
  }

  // 5. Diálogos / Banners con NPCs
  if (typeof bannerTimer !== 'undefined' && bannerTimer > 0 && typeof bannerSpeaker !== 'undefined' && bannerSpeaker) {
    if (isJustPressed(0) || isJustPressed(3)) { // A o Y: siguiente página o cerrar
      justPressed['e'] = true;
    } else if (isJustPressed(1)) { // B: cerrar banner
      if (typeof closeBanner === 'function') closeBanner();
      else { bannerTimer = 0; bannerText = ''; bannerSpeaker = ''; }
    }
  }

  // 6. Botones de Sistema durante Gameplay
  if (isJustPressed(9)) { // Start / Options
    togglePause();
    for (let i = 0; i < btns.length; i++) prevGamepadButtons[i] = isBtnPressed(i);
    return;
  }
  if (isJustPressed(8)) { // Select / Back / Share -> Mapa Grande
    togglePause('tab-map');
    for (let i = 0; i < btns.length; i++) prevGamepadButtons[i] = isBtnPressed(i);
    return;
  }

  // 7. Mapeo de Ejes Analógicos y Cruceta (D-Pad)
  const deadzoneX = 0.28;
  const deadzoneY = 0.38;
  const axisX = axes[0] || 0;
  const axisY = axes[1] || 0;

  // Izquierda (Stick o D-Pad [14])
  if (axisX < -deadzoneX || isBtnPressed(14)) {
    keys['a'] = true;
    keys['arrowleft'] = true;
  }
  // Derecha (Stick o D-Pad [15])
  if (axisX > deadzoneX || isBtnPressed(15)) {
    keys['d'] = true;
    keys['arrowright'] = true;
  }
  // Abajo (Stick o D-Pad [13])
  if (axisY > deadzoneY || isBtnPressed(13)) {
    keys['s'] = true;
    keys['arrowdown'] = true;
  }
  // Arriba (Stick o D-Pad [12])
  if (axisY < -deadzoneY || isBtnPressed(12)) {
    keys['w'] = true;
    keys['arrowup'] = true;
  }

  // 8. Mapeo de Acciones de Combate y Habilidades
  // Botón 0 (A / Cruz): SALTO
  if (isBtnPressed(0)) {
    keys[' '] = true;
    keys['w'] = true;
    if (isJustPressed(0)) {
      justPressed[' '] = true;
      justPressed['w'] = true;
    }
  }

  // Botón 2 (X / Cuadrado): ATAQUE CON ESPADA
  if (isBtnPressed(2)) {
    keys['mouseLeft'] = true;
    if (isJustPressed(2)) {
      justPressed['mouseLeft'] = true;
    }
  }

  // Botón 5 (RB / R1) o Botón 6 (LT / L2): DASH SOMBRÍO
  if (isBtnPressed(5) || isBtnPressed(6)) {
    keys['shift'] = true;
    if (isJustPressed(5) || isJustPressed(6)) {
      justPressed['shift'] = true;
      justPressed['shiftleft'] = true;
    }
  }

  // Botón 1 (B / Círculo) o Botón 7 (RT / R2): HECHIZO / DISPARO MÍSTICO
  if (isBtnPressed(1) || isBtnPressed(7)) {
    keys['q'] = true;
    keys['mouseRight'] = true;
    if (isJustPressed(1) || isJustPressed(7)) {
      justPressed['q'] = true;
      justPressed['mouseRight'] = true;
    }
  }

  // Botón 3 (Y / Triángulo): INTERACTUAR / HABLAR / ALTARES
  if (isBtnPressed(3)) {
    keys['e'] = true;
    if (isJustPressed(3)) {
      justPressed['e'] = true;
    }
  }

  // Botón 4 (LB / L1): GANCHO ESPECTRAL
  if (isBtnPressed(4)) {
    keys['f'] = true;
    if (isJustPressed(4)) {
      justPressed['f'] = true;
    }
  }

  // Actualizar buffer de pulsaciones previas
  for (let i = 0; i < btns.length; i++) {
    prevGamepadButtons[i] = isBtnPressed(i);
  }
}
