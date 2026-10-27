// =============================================================================
// js/main.js - Bucle de Juego Principal, Motor Gráfico y Orquestador
// Noctis: Metroidvania - Núcleo de Ejecución (Fixed Timestep 60 FPS)
// =============================================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// =============================================================================
// MOTOR GRÁFICO (HD Nítido 960p vs Retro Pixel 480p)
// =============================================================================
let graphicsMode = localStorage.getItem('noctis_graphics_mode') || 'hd';
let renderScale = (graphicsMode === 'hd') ? 2 : 1;

function updateGraphicsBtnUI() {
  const btn = document.getElementById('btn-toggle-graphics');
  if (btn) {
    btn.innerHTML = (graphicsMode === 'hd') ? 'MODO: HD (NÍTIDO) [H]' : 'MODO: RETRO (PIXEL) [H]';
    btn.style.color = (graphicsMode === 'hd') ? '#00f5d4' : '#ffbe0b';
    btn.style.borderColor = (graphicsMode === 'hd') ? '#00f5d4' : '#ffbe0b';
  }
}

function setGraphicsMode(mode) {
  graphicsMode = mode;
  localStorage.setItem('noctis_graphics_mode', mode);
  if (mode === 'hd') {
    canvas.width = 960;
    canvas.height = 540;
    renderScale = 2;
  } else {
    canvas.width = 480;
    canvas.height = 270;
    renderScale = 1;
  }
  ctx.imageSmoothingEnabled = (mode === 'hd');
  if (mode === 'hd') ctx.imageSmoothingQuality = 'high';
  updateGraphicsBtnUI();
}

function toggleGraphicsMode() {
  setGraphicsMode(graphicsMode === 'hd' ? 'pixel' : 'hd');
  showBanner(graphicsMode === 'hd' ? 'MODO HD ACTIVADO (960p)' : 'MODO RETRO ACTIVADO (480p)', 90);
}

// Inicializar resolución
setGraphicsMode(graphicsMode);

// =============================================================================
// RENDER PRINCIPAL (Composición de Capas)
// =============================================================================
function draw() {
  ctx.save();

  // Escala de render según modo (HD 2x vs Pixel 1x)
  if (renderScale !== 1) {
    ctx.scale(renderScale, renderScale);
  }
  ctx.imageSmoothingEnabled = (graphicsMode === 'hd');
  if (graphicsMode === 'hd') ctx.imageSmoothingQuality = 'high';

  // Screen Shake
  if (screenShakeTimer > 0) {
    ctx.translate((Math.random() - 0.5) * shakeMagnitude, (Math.random() - 0.5) * shakeMagnitude);
  }

  // 1. Capa de Mundo (Fondos, Tiles, Entidades, Partículas)
  drawWorld(ctx);

  // 2. Capa de Interfaz (HUD de Vida/Habilidades, Minimapa, Banners, FPS)
  drawGothicHUD(ctx);
  drawGothicMinimap(ctx);
  drawGothicBanner(ctx);
  drawFpsCounter(ctx, currentFps);

  ctx.restore();
}

// =============================================================================
// GAME LOOP (Fixed Timestep 60 FPS)
// =============================================================================
const FIXED_STEP = 1000 / 60;
let lastTime = performance.now();
let accumulator = 0;

let currentFps = 60;
let fpsFrameCount = 0;
let fpsLastTime = performance.now();

function loop(currentTime) {
  if (!currentTime) currentTime = performance.now();
  let delta = currentTime - lastTime;
  lastTime = currentTime;

  // Medición continua de FPS
  fpsFrameCount++;
  if (currentTime - fpsLastTime >= 500) {
    currentFps = Math.round((fpsFrameCount * 1000) / (currentTime - fpsLastTime));
    fpsFrameCount = 0;
    fpsLastTime = currentTime;
  }

  // Si hubo retorno de pestaña o lag spike, limitar delta a 16.6ms
  if (delta > 60 || delta < 0) delta = 16.66;
  accumulator += delta;
  if (accumulator > 100) accumulator = 100;

  while (accumulator >= FIXED_STEP) {
    if (typeof pollGamepadInput === 'function') {
      pollGamepadInput();
    }

    if (gameStarted && !isPaused && (typeof isTutorialOpen === 'undefined' || !isTutorialOpen) && !gameWon) {
      if (hitStopTimer > 0) {
        hitStopTimer--;
      } else {
        updatePlayer(keys, justPressed);
        updateEnemies();
      }
    }
    clearJustPressed();
    accumulator -= FIXED_STEP;
  }

  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
