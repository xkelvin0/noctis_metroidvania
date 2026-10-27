// =========================================================
// js/main.js — Núcleo del Juego: Canvas, Input, Draw, Loop
// =========================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// =========================================================
// MODO GRÁFICO Y SUPER-SAMPLING HD (480p vs 960p)
// =========================================================
let graphicsMode = localStorage.getItem('noctis_graphics_mode') || 'hd';
let renderScale = (graphicsMode === 'hd') ? 2 : 1;

function updateGraphicsBtnUI() {
  const btn = document.getElementById('btn-toggle-graphics');
  if (btn) {
    btn.textContent = (graphicsMode === 'hd') 
      ? '🖥️ Modo Gráfico: HD Nítido 960p (H)' 
      : '👾 Modo Gráfico: Retro Pixel 480p (H)';
  }
}

function setGraphicsMode(mode) {
  graphicsMode = mode;
  localStorage.setItem('noctis_graphics_mode', mode);
  renderScale = (mode === 'hd') ? 2 : 1;
  canvas.width = 480 * renderScale;
  canvas.height = 270 * renderScale;
  if (mode === 'hd') {
    canvas.classList.add('hd-canvas');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  } else {
    canvas.classList.remove('hd-canvas');
    ctx.imageSmoothingEnabled = false;
  }
  updateGraphicsBtnUI();
}

function toggleGraphicsMode() {
  const nextMode = (graphicsMode === 'hd') ? 'retro' : 'hd';
  setGraphicsMode(nextMode);
  showBanner(nextMode === 'hd' ? "MODO GRÁFICO: HD NÍTIDO 960p ACTIVADO" : "MODO GRÁFICO: RETRO PIXEL 480p ACTIVADO", 90);
}

// Inicializar en modo HD nítido por defecto
setGraphicsMode(graphicsMode);

const keys = {};
const justPressed = {};

function clearJustPressed() {
  for (let k in justPressed) delete justPressed[k];
}

// =========================================================
// PANTALLA DE TÍTULO / CONTINUAR PARTIDA
// =========================================================
let gameStarted = false;
const titleScreen = document.getElementById('title-screen');
const btnNewGame = document.getElementById('btn-new-game');
const btnContinue = document.getElementById('btn-continue');

const savedDataCheck = localStorage.getItem('noctis_save');
if (savedDataCheck) btnContinue.classList.remove('disabled');

btnNewGame.addEventListener('click', () => {
  initAudio();
  localStorage.removeItem('noctis_save');
  player.hasDash = false;
  player.hasDoubleJump = false;
  player.hasWallJump = false;
  player.hasAstralEye = false;
  player.hasParryBrooch = false;
  player.hasBloodFang = false;
  player.hasShadeThread = false;
  player.hasStarWard = false;
  player.equippedAmulets = [];
  player.magicTree = { blood: 0, shadow: 0, astro: 0 };
  player.amuletSlotBonus = 0;
  player.nextSpellBonus = 0;
  player.hasHook = false;
  player.hasMist = false;
  player.hasDive = false;
  player.essence = 0;
  player.maxHp = 100;
  player.hp = 100;
  player.atk = 15;
  player.hpUpgrades = 0;
  player.atkUpgrades = 0;
  player.attackReach = 0;
  player.spellPower = 0;
  player.spellEfficiency = 0;
  player.dashRecovery = 0;
  player.healBonus = 0;
  if (typeof questTracker !== 'undefined') {
    questTracker = {
      kills: { bat: 0, skeleton: 0, armor: 0, summoner: 0, total: 0, elite: 0 },
      talkedNpcs: {},
      altars: {},
      secretsFound: 0,
      bossDefeated: false,
      claimed: {}
    };
  }
  seals = { carmesi: false, juramento: false, astral: false, reloj: false };
  storyProgress = { eliteKills: 0, eliteDefeated: {}, talkedHubs: {}, discoveredAltars: {} };
  purchasedMaps = {};
  materials = { ash: 0, bone: 0, crystal: 0, gear: 0, flower: 0 };
  gameSettings = { showObjectiveMarker: true, leftKey: 'a', rightKey: 'd', downKey: 's', castKey: 'q', hookKey: 'f', interactKey: 'e', travelKey: 't' };
  visitedRooms = { '-2': true };
  brokenWalls = {};
  breakableWallHits = {};
  shopInventoryState = {};
  gameWon = false;
  startIntroCutscene();
});

btnContinue.addEventListener('click', () => {
  const currentSave = localStorage.getItem('noctis_save');
  if (!currentSave) return;
  initAudio();
  const d = JSON.parse(currentSave);
  player.hasDash = !!d.hasDash;
  player.hasDoubleJump = !!d.hasDoubleJump;
  player.hasWallJump = !!d.hasWallJump;
  player.hasAstralEye = !!d.hasAstralEye;
  player.hasParryBrooch = !!d.hasParryBrooch;
  player.hasBloodFang = !!d.hasBloodFang;
  player.hasShadeThread = !!d.hasShadeThread;
  player.hasStarWard = !!d.hasStarWard;
  player.equippedAmulets = d.equippedAmulets || [];
  player.magicTree = { blood: 0, shadow: 0, astro: 0, ...(d.magicTree || {}) };
  player.amuletSlotBonus = d.amuletSlotBonus || 0;
  player.nextSpellBonus = d.nextSpellBonus || 0;
  player.hasHook = !!d.hasHook;
  player.hasMist = !!d.hasMist;
  player.hasDive = !!d.hasDive;
  player.essence = d.essence || 0;
  player.maxHp = d.maxHp || 100;
  player.hp = player.maxHp;
  player.atk = d.atk || 15;
  player.hpUpgrades = d.hpUpgrades || 0;
  player.atkUpgrades = d.atkUpgrades || 0;
  player.attackReach = d.attackReach || 0;
  player.spellPower = d.spellPower || 0;
  player.spellEfficiency = d.spellEfficiency || 0;
  player.dashRecovery = d.dashRecovery || 0;
  player.healBonus = d.healBonus || 0;
  brokenWalls = d.brokenWalls || {};
  shopInventoryState = d.shopInventoryState || {};
  purchasedMaps = d.purchasedMaps || {};
  materials = { ash: 0, bone: 0, crystal: 0, gear: 0, flower: 0, ...(d.materials || {}) };
  gameSettings = { showObjectiveMarker: true, ...(d.gameSettings || {}) };
  breakableWallHits = {};
  visitedRooms = d.visitedRooms || { 1: true };
  seals = { carmesi: false, juramento: false, astral: false, reloj: false, ...(d.seals || {}) };
  storyProgress = { eliteKills: 0, eliteDefeated: {}, talkedHubs: {}, discoveredAltars: {}, ...(d.storyProgress || {}) };
  if (d.questTracker && typeof questTracker !== 'undefined') {
    questTracker = d.questTracker;
  }
  if (d.lastAltarRoom !== undefined && typeof lastAltarRoom !== 'undefined') {
    lastAltarRoom = d.lastAltarRoom;
    lastAltarX = d.lastAltarX || 150;
    lastAltarY = d.lastAltarY || 200;
  }
  gameWon = !!d.gameWon;
  loadRoom(d.roomId, d.x, d.y);
  titleScreen.classList.add('hidden');
  gameStarted = true;
  setBgmMode('explore');
});

// =========================================================
// INPUT — Teclado y Ratón
// =========================================================
window.addEventListener('contextmenu', e => e.preventDefault());

window.addEventListener('mousedown', e => {
  if (!gameStarted || isPaused) return;
  initAudio();
  if (e.button === 0) justPressed['mouseLeft'] = true;
  else if (e.button === 2) justPressed['mouseRight'] = true;
});

window.addEventListener('keydown', e => {
  if (!gameStarted) return;
  initAudio();
  if (currentBgmMode === 'none') setBgmMode(currentRoomId === 5 && !gameWon ? 'boss' : 'explore');

  const k = e.key.toLowerCase();
  const code = e.code.toLowerCase();

  if (typeof isShopOpen === 'function' && isShopOpen()) {
    if (k === 'escape' || k === 'e') {
      closeShop();
      e.preventDefault();
      return;
    }
    return;
  }

  if (isTutorialOpen) {
    if (k === 'escape' || k === ' ' || k === 'enter') { closeSkillTutorial(); e.preventDefault(); return; }
  }

  // Atajos directos del Grimorio
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
  if (k === 'o') {
    const muted = toggleMute();
    showBanner(muted ? "MÚSICA SILENCIADA (O)" : "MÚSICA ACTIVADA (O)", 90);
    return;
  }
  if (k === 'h') {
    toggleGraphicsMode();
    e.preventDefault();
    return;
  }
  if (bannerTimer > 0 && bannerSpeaker) {
    if (k === 'escape') {
      if (typeof closeBanner === 'function') closeBanner();
      else { bannerTimer = 0; bannerText = ''; bannerSpeaker = ''; }
      e.preventDefault();
      return;
    }
  }

  if (k === 'escape' || k === 'p') { togglePause(); e.preventDefault(); return; }

  if (isPaused || isTutorialOpen) return;
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

// Manejo de cambio de ventana y pérdida de foco (evita teclas atascadas o personajes flotando)
function resetInputAndTiming() {
  for (const k in keys) keys[k] = false;
  for (const k in justPressed) justPressed[k] = false;
  lastTime = performance.now();
  accumulator = 0;
}

window.addEventListener('blur', resetInputAndTiming);
window.addEventListener('focus', resetInputAndTiming);
document.addEventListener('visibilitychange', () => {
  resetInputAndTiming();
});

// =========================================================
// DRAW — Render principal del juego
// =========================================================
function draw() {
  ctx.save();
  if (renderScale !== 1) {
    ctx.scale(renderScale, renderScale);
  }
  ctx.imageSmoothingEnabled = (graphicsMode === 'hd');
  if (graphicsMode === 'hd') ctx.imageSmoothingQuality = 'high';

  if (screenShakeTimer > 0) {
    ctx.translate((Math.random() - 0.5) * shakeMagnitude, (Math.random() - 0.5) * shakeMagnitude);
  }

  ctx.fillStyle = '#0c0814';
  ctx.fillRect(0, 0, W, H);

  drawGothicBackground(ctx, currentRoomId);
  updateAndDrawFogParticles(ctx, currentRoomId);

  // Tilemap
  const map = ROOM_DEFS[currentRoomId].map;
  const roomPalette = getRoomPalette(currentRoomId);
  const cityRoom = isCityRoom(currentRoomId);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = map[r][c];
      const tx = c * TILE, ty = r * TILE;
      if (ch === '#') {
        const hasWallAbove = map[r - 1]?.[c] === '#';
        const hasWallBelow = map[r + 1]?.[c] === '#';
        const hasWallLeft = map[r]?.[c - 1] === '#';
        const hasWallRight = map[r]?.[c + 1] === '#';
        if (cityRoom) {
          if (r >= ROWS - 2) drawCityFloorSprite(ctx, tx, ty, r - (ROWS - 2));
        } else {
          drawDungeonWallSprite(ctx, tx, ty, roomPalette, { top: !hasWallAbove, bottom: !hasWallBelow, left: !hasWallLeft, right: !hasWallRight });
        }
      } else if (ch === '?') {
        const key = `${currentRoomId}_${c}_${r}`;
        if (!brokenWalls[key]) {
          const hitsLeft = breakableWallHits[key] !== undefined ? breakableWallHits[key] : 3;
          ctx.fillStyle = '#261a35'; ctx.fillRect(tx, ty, TILE, TILE);
          ctx.strokeStyle = '#43285c'; ctx.strokeRect(tx + 0.5, ty + 0.5, TILE - 1, TILE - 1);
          if (player.hasAstralEye) {
            const eyePulse = Math.sin(player.animTimer * 0.18) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 238, 0, ${eyePulse * 0.45})`; ctx.fillRect(tx, ty, TILE, TILE);
            ctx.strokeStyle = '#fee440'; ctx.lineWidth = 1.5; ctx.strokeRect(tx + 0.5, ty + 0.5, TILE - 1, TILE - 1);
          }
          ctx.strokeStyle = player.hasAstralEye ? '#ffe3a8' : '#b5179e'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(tx + 3, ty + 2); ctx.lineTo(tx + 7, ty + 7); ctx.lineTo(tx + 5, ty + 12); ctx.lineTo(tx + 9, ty + 15); ctx.stroke();
          const secretNear = Math.abs(player.x - tx) < 68 && Math.abs(player.y - ty) < 52;
          if (secretNear) {
            const pulse = 0.35 + Math.sin(player.animTimer * 0.14) * 0.2;
            ctx.fillStyle = `rgba(255, 190, 11, ${pulse})`; ctx.fillRect(tx + 11, ty + 2, 2, 3);
            ctx.fillStyle = `rgba(255, 120, 70, ${pulse})`; ctx.fillRect(tx + 11, ty + 5, 2, 4);
          }
          if (hitsLeft <= 2) { ctx.strokeStyle = '#f72585'; ctx.beginPath(); ctx.moveTo(tx + 13, ty + 3); ctx.lineTo(tx + 8, ty + 8); ctx.lineTo(tx + 12, ty + 13); ctx.stroke(); }
          if (hitsLeft <= 1) { ctx.strokeStyle = '#ffbe0b'; ctx.beginPath(); ctx.moveTo(tx + 2, ty + 8); ctx.lineTo(tx + 14, ty + 10); ctx.stroke(); }
          ctx.lineWidth = 1;
        }
      } else if (ch === '=') { drawDungeonFloorSprite(ctx, tx, ty, roomPalette);
      } else if (ch === '^') {
        ctx.fillStyle = roomPalette.spike;
        for (let s = 0; s < 2; s++) { ctx.beginPath(); ctx.moveTo(tx + s * 8, ty + TILE); ctx.lineTo(tx + s * 8 + 4, ty + 5); ctx.lineTo(tx + s * 8 + 8, ty + TILE); ctx.fill(); }
      } else if (ch === 'B') {
        if (typeof drawShadowBarrierSprite === 'function') {
          drawShadowBarrierSprite(ctx, tx, ty, player.animTimer);
        } else {
          ctx.fillStyle = roomPalette.gate; ctx.fillRect(tx + 3, ty, 3, TILE); ctx.fillRect(tx + 10, ty, 3, TILE);
        }
      } else if (ch === '*') {
        if (typeof drawAstralPlatformSprite === 'function') {
          drawAstralPlatformSprite(ctx, tx, ty, player.hasAstralEye, player.animTimer);
        }
      } else if (ch === 'S') { drawSaveAltarSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'M') { drawMerchantStallSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'H') { drawTavernCottageSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'A') { drawApothecaryHouseSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'F') { drawForgeHouseSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'Q') { drawCartographyHouseSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'U') { drawAlchemyHouseSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'R') { drawReliquaryHouseSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'I') { drawInnHouseSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'V') { drawLibraryHouseSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'G') { drawWatchtowerSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'C') { drawChapelSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'P') { drawGuardPostSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'K') { drawGuildStorehouseSprite(ctx, tx, ty);
      } else if (ch === 'L') { drawStreetLampSprite(ctx, tx, ty, player.animTimer);
      } else if (ch === 'W') { drawWaterWellSprite(ctx, tx, ty);
      } else if (ch === 'T') {
        ctx.fillStyle = '#2b0938'; ctx.fillRect(tx + 1, ty - 8, 14, 24);
        ctx.strokeStyle = '#c77dff'; ctx.strokeRect(tx + 1.5, ty - 7.5, 13, 23);
        const pulse = Math.sin(player.animTimer * 0.1) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255, 0, 85, ${pulse})`; ctx.fillRect(tx + 3, ty - 5, 10, 19);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(tx + 5, ty - 2, 2, 4);
      }
    }
  }

  // Reliquias
  for (const r of relics) {
    const bob = Math.sin(player.animTimer * 0.1) * 3;
    ctx.fillStyle = r.type === 'dash' ? '#00f5d4' : (r.type === 'doublejump' ? '#ffbe0b' : '#ff007f');
    ctx.fillRect(r.x, r.y + bob, r.w, r.h);
    ctx.strokeStyle = '#ffffff'; ctx.strokeRect(r.x - 2, r.y + bob - 2, r.w + 4, r.h + 4);
  }

  // Orbes de Esencia
  for (const o of essenceOrbs) {
    ctx.fillStyle = '#ff0055'; ctx.fillRect(Math.round(o.x), Math.round(o.y), o.w, o.h);
    ctx.fillStyle = '#ffccd5'; ctx.fillRect(Math.round(o.x) + 1, Math.round(o.y) + 1, 2, 2);
  }

  // Corazones
  for (const h of heartPickups) {
    const hx = Math.round(h.x), hy = Math.round(h.y);
    const bob = Math.sin(player.animTimer * 0.15) * 1.5;
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(hx + 1, hy + bob, 2, 2); ctx.fillRect(hx + 5, hy + bob, 2, 2);
    ctx.fillRect(hx, hy + 2 + bob, 8, 3); ctx.fillRect(hx + 1, hy + 5 + bob, 6, 2);
    ctx.fillRect(hx + 2, hy + 7 + bob, 4, 1); ctx.fillRect(hx + 3, hy + 8 + bob, 2, 1);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(hx + 1, hy + 2 + bob, 1, 2);
  }

  // Primera llegada: una luz señala el Bazar hacia el este sin añadir otro cartel.
  if (arrivalGuideBeacon && Number(currentRoomId) === -2) {
    const pulse = Math.sin(player.animTimer * 0.12) * 0.2 + 0.55;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath(); ctx.moveTo(452, 174); ctx.lineTo(468, 182); ctx.lineTo(452, 190); ctx.fill();
    ctx.fillRect(432, 181, 23, 2);
    ctx.globalAlpha = pulse * 0.2;
    ctx.beginPath(); ctx.arc(452, 182, 20, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Prompts de interacción (Altar, Mercader, Forja, Portal)
  const pCol = Math.floor((player.x + player.w / 2) / TILE);
  const pRow = Math.floor((player.y + player.h / 2) / TILE);
  const pFoot = Math.floor((player.y + player.h - 1) / TILE);

  const isAtAltarTile = getTileAt(pCol, pRow) === 'S' || getTileAt(pCol, pFoot) === 'S';
  const isAtMirrorTile = getTileAt(pCol, pRow) === 'T' || getTileAt(pCol, pFoot) === 'T';

  // Buscar si hay un ciudadano o guardia interactivo cerca
  let nearbyCitizen = null;
  if (!isAtAltarTile && !isAtMirrorTile) {
    for (const ent of enemies) {
      if (ent.type === 'citizen' && ent.isFriendly) {
        const dist = Math.hypot((player.x + player.w / 2) - (ent.x + (ent.w || 12) / 2), (player.y + player.h / 2) - (ent.y + (ent.h || 22) / 2));
        if (dist < 42) {
          nearbyCitizen = ent;
          break;
        }
      }
    }
  }

  const drawPrompt = (text, color = '#ffbe0b') => {
    ctx.font = '12px "VT323", monospace';
    const textW = ctx.measureText(text).width;
    const bW = Math.max(68, Math.round(textW + 14));
    const bx = Math.round(player.x + player.w / 2 - bW / 2);
    const by = Math.round(player.y - 20);
    const bH = 14;
    ctx.fillStyle = 'rgba(8, 4, 14, 0.94)'; ctx.fillRect(bx, by, bW, bH);
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bW - 1, bH - 1);
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.fillText(text, bx + Math.floor(bW / 2), by + 10);
    ctx.textAlign = 'left';
  };

  function getCitizenDialog(ent) {
    return ent.dialog || '«La niebla carmesí susurra cosas extrañas...»';
  }

  if (!arrivalPromptLocked && isAtAltarTile) {
    drawPrompt('[E] Guardar  [1]+HP [2]+ATK [T]Viaje', '#ffbe0b');
  } else if (!arrivalPromptLocked && isAtMirrorTile) {
    drawPrompt('[E/T] Teletransporte Altar', '#c77dff');
  } else if (!arrivalPromptLocked && nearbyCitizen) {
    const ent = nearbyCitizen;
    ctx.font = '12px "VT323", monospace';
    let promptLabel = '[E] Hablar';
    if (ent.name.includes('Cartógrafa')) promptLabel = '[E] Cartografía';
    else if (ent.name.includes('Alquimista Umbrío')) promptLabel = '[E] Alquimia';
    else if (ent.name.includes('Custodia Selene')) promptLabel = '[E] Reliquiario';
    else if (ent.name.includes('Elena')) promptLabel = '[E] Botica';
    else if (ent.name.includes('Corvus')) promptLabel = '[E] Arcanos';
    else if (ent.name.includes('Boros')) promptLabel = '[E] Forja';
    else if (ent.name.includes('Dario')) promptLabel = '[E] Bazar';
    if (bannerTimer > 0 && bannerSpeaker === ent.name) {
      if (typeof dialoguePages !== 'undefined' && dialoguePages.length > 1 && dialoguePageIndex < dialoguePages.length - 1) {
        promptLabel = `[E] Siguiente (${dialoguePageIndex + 1}/${dialoguePages.length})`;
      } else {
        promptLabel = '[E] Cerrar';
      }
    }
    const bW = Math.max(68, Math.round(ctx.measureText(promptLabel).width + 14));
    const bx = Math.round(ent.x + (ent.w || 12) / 2 - bW / 2);
    const by = Math.round(ent.y - 20);
    const bH = 14;
    ctx.fillStyle = 'rgba(8, 4, 14, 0.94)'; ctx.fillRect(bx, by, bW, bH);
    ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bW - 1, bH - 1);
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.fillText(promptLabel, bx + Math.floor(bW / 2), by + 10);
    ctx.textAlign = 'left';
  } else if (!arrivalPromptLocked && (getTileAt(pCol, pRow) === 'M' || getTileAt(pCol, pFoot) === 'M')) {
    drawPrompt('[E] Bazar Dario', '#ffbe0b');
  }

  // Enemigos
  for (const e of enemies) drawEnemySprite(ctx, e, player.animTimer);

  // Proyectiles
  for (const p of projectiles) {
    if (p.fromPlayer) {
      ctx.fillStyle = '#ff0055'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p.x + (p.vx > 0 ? 1 : -1), p.y, p.r - 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 0, 85, 0.3)'; ctx.fillRect(p.x - p.vx * 1.5, p.y - 1, 3, 2);
    } else {
      ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Jugador
  drawPlayerSprite(ctx, player);

  // Partículas
  for (const pt of particles) { ctx.fillStyle = pt.color; ctx.fillRect(pt.x, pt.y, 2, 2); }

  // Números de daño flotantes
  ctx.font = '14px "VT323", monospace';
  for (const ft of floatingTexts) { ctx.fillStyle = ft.color || '#ff0055'; ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y)); }

  // =========================================================
  // HUD GÓTICO
  // =========================================================
  const nearbyThreat = enemies.some(enemy => !enemy.isFriendly && Math.abs(enemy.x - player.x) < 150);
  const hudAlpha = nearbyThreat || player.hp < player.maxHp * 0.45 || bannerTimer > 0 ? 1 : 0.30;
  ctx.save();
  ctx.globalAlpha = hudAlpha;
  const hudX = 8, hudY = 8, hudW = 142, hudH = 36;
  ctx.fillStyle = 'rgba(10, 5, 16, 0.76)'; ctx.fillRect(hudX, hudY, hudW, hudH);
  ctx.strokeStyle = 'rgba(159, 83, 173, 0.82)'; ctx.lineWidth = 1; ctx.strokeRect(hudX + 0.5, hudY + 0.5, hudW - 1, hudH - 1);

  const hpRatio = Math.max(0, Math.min(1, player.hp / player.maxHp));
  const barX = hudX + 7, barY = hudY + 7, barW = 74, barH = 8;
  ctx.fillStyle = '#1c0510'; ctx.fillRect(barX, barY, barW, barH);
  const currHpW = Math.round(barW * hpRatio);
  if (currHpW > 0) {
    const hpGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
    hpGrad.addColorStop(0, '#ff4d6d'); hpGrad.addColorStop(0.5, '#c9184a'); hpGrad.addColorStop(1, '#800f2f');
    ctx.fillStyle = hpGrad; ctx.fillRect(barX, barY, currHpW, barH);
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(barX, barY, currHpW, 2);
  }
  ctx.strokeStyle = '#ffccd5'; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barW, barH);
  ctx.font = '11px "VT323", monospace'; ctx.fillStyle = '#ffffff'; ctx.fillText(`${player.hp}/${player.maxHp}`, barX + barW + 5, barY + 7);

  ctx.font = '10px "VT323", monospace';
  const drawSkill = (x, label, active, color) => {
    ctx.fillStyle = active ? color : '#51405b'; ctx.fillRect(x, hudY + 21, 4, 4);
    ctx.fillStyle = active ? '#ffffff' : '#786985'; ctx.fillText(label, x + 6, hudY + 25);
  };
  drawSkill(hudX + 7, 'DASH', player.hasDash, '#00f5d4');
  drawSkill(hudX + 42, '2x', player.hasDoubleJump, '#ffbe0b');
  drawSkill(hudX + 62, 'GARRAS', player.hasWallJump, '#ff007f');

  ctx.fillStyle = '#ffccd5'; ctx.fillText(`♦${player.essence}`, hudX + 105, hudY + 25);
  ctx.fillStyle = '#fff0c2'; ctx.fillText(`⚔${player.atk}`, hudX + 105, hudY + 34);
  const sealsDone = allSealsRestored();
  ctx.fillStyle = sealsDone ? '#70e000' : '#e0aaff'; ctx.fillText(`✦${sealCount()}/4`, hudX + 79, hudY + 34);
  ctx.restore();

  // Minimapa
  const mapBoxW = 80, mapBoxH = 52, mapX = W - mapBoxW - 8, mapY = 8;
  ctx.save();
  ctx.globalAlpha = nearbyThreat || bannerTimer > 0 ? 1 : 0.38;
  ctx.fillStyle = 'rgba(10, 5, 16, 0.68)'; ctx.fillRect(mapX, mapY, mapBoxW, mapBoxH);
  ctx.strokeStyle = 'rgba(159, 83, 173, 0.78)'; ctx.lineWidth = 1; ctx.strokeRect(mapX + 0.5, mapY + 0.5, mapBoxW - 1, mapBoxH - 1);
  ctx.font = '10px "VT323", monospace'; ctx.fillStyle = '#ffbe0b'; ctx.fillText('MAPA', mapX + 5, mapY + 10);
  ctx.fillStyle = '#9e8fb2'; ctx.fillText('[M]', mapX + mapBoxW - 17, mapY + 10);

  const miniRooms = Object.values(ROOM_DEFS);
  const miniMinX = Math.min(...miniRooms.map(r => r.gridX));
  const miniMinY = Math.min(...miniRooms.map(r => r.gridY));
  const miniMaxX = Math.max(...miniRooms.map(r => r.gridX));
  const miniMaxY = Math.max(...miniRooms.map(r => r.gridY));
  const spanCols = miniMaxX - miniMinX + 1, spanRows = miniMaxY - miniMinY + 1;
  const cellW = Math.max(5, Math.floor((mapBoxW - 10) / spanCols));
  const cellH = Math.max(4, Math.floor((mapBoxH - 16) / spanRows));
  const gridStartX = mapX + Math.floor((mapBoxW - spanCols * cellW) / 2);
  const gridStartY = mapY + 14 + Math.floor((mapBoxH - 15 - spanRows * cellH) / 2);

  for (const id in ROOM_DEFS) {
    if (!visitedRooms[id]) continue;
    const rm = ROOM_DEFS[id];
    const rx = gridStartX + (rm.gridX - miniMinX) * cellW;
    const ry = gridStartY + (rm.gridY - miniMinY) * cellH;
    const isCurrent = (Number(id) === currentRoomId);
    if (isCurrent) {
      const pulse = 0.75 + Math.sin(player.animTimer * 0.12) * 0.25;
      ctx.fillStyle = `rgba(255, 0, 85, ${pulse})`; ctx.fillRect(rx, ry, cellW, cellH);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.strokeRect(rx + 0.5, ry + 0.5, cellW - 1, cellH - 1);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(rx + Math.floor(cellW / 2) - 1, ry + Math.floor(cellH / 2) - 1, 2, 2);
    } else {
      const isHub = ['-2', '-1', '0', '9', '10'].includes(id);
      ctx.fillStyle = isHub ? '#3a205a' : '#281c3c'; ctx.fillRect(rx, ry, cellW, cellH);
      ctx.strokeStyle = '#5a3d72'; ctx.lineWidth = 1; ctx.strokeRect(rx + 0.5, ry + 0.5, cellW - 1, cellH - 1);
    }
  }
  ctx.restore();

  drawGothicVignette(ctx);

  // Diálogo / Banner
  if (bannerTimer > 0) {
    const hasSpeaker = (typeof bannerSpeaker === 'string' && bannerSpeaker.trim().length > 0);
    if (!hasSpeaker) {
      bannerTimer--;
    }

    if (hasSpeaker) {
      const boxW = 390, boxH = 46, boxX = Math.round((W - boxW) / 2), boxY = H - boxH - 8;
      ctx.fillStyle = 'rgba(8, 4, 14, 0.95)'; ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#5c2d68'; ctx.lineWidth = 1.5; ctx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1);
      ctx.strokeStyle = 'rgba(255, 190, 11, 0.35)'; ctx.lineWidth = 1; ctx.strokeRect(boxX + 2.5, boxY + 2.5, boxW - 5, boxH - 5);
      if (typeof drawNpcPortrait === 'function') drawNpcPortrait(ctx, bannerSpeaker, boxX + 6, boxY + 6, 34);
      ctx.font = '14px "VT323", monospace'; ctx.fillStyle = '#ffbe0b'; ctx.fillText(bannerSpeaker.toUpperCase(), boxX + 48, boxY + 14);

      const totalPages = (typeof dialoguePages !== 'undefined' && dialoguePages.length) || 1;
      const curPage = ((typeof dialoguePageIndex !== 'undefined' ? dialoguePageIndex : 0) + 1);
      const hasMorePages = (typeof dialoguePages !== 'undefined' && dialoguePages.length > 1 && dialoguePageIndex < dialoguePages.length - 1);

      ctx.font = '11px "VT323", monospace';
      ctx.fillStyle = hasMorePages ? '#ffbe0b' : 'rgba(240, 210, 255, 0.65)';
      ctx.textAlign = 'right';
      const actionHint = hasMorePages 
        ? `[E] Siguiente ▶ (${curPage}/${totalPages})  [ESC] Salir` 
        : (totalPages > 1 ? `[E / ESC] Cerrar (${curPage}/${totalPages})` : `[E / ESC] Cerrar`);
      ctx.fillText(actionHint, boxX + boxW - 8, boxY + 14);
      ctx.textAlign = 'left';

      ctx.font = '13px "VT323", monospace'; ctx.fillStyle = '#ffffff';
      const pageLines = (typeof dialoguePages !== 'undefined' && dialoguePages[dialoguePageIndex]) 
        ? dialoguePages[dialoguePageIndex] 
        : [bannerText];

      ctx.fillText(pageLines[0] || '', boxX + 48, boxY + 27);
      if (pageLines[1]) ctx.fillText(pageLines[1], boxX + 48, boxY + 39);
    } else {
      ctx.font = '13px "VT323", monospace';
      const maxInnerW = 380, words = bannerText.split(' ');
      const lines = []; let currentLine = '';
      for (const w of words) {
        const testLine = currentLine ? (currentLine + ' ' + w) : w;
        if (ctx.measureText(testLine).width <= maxInnerW) currentLine = testLine;
        else { if (currentLine) lines.push(currentLine); currentLine = w; }
      }
      if (currentLine) lines.push(currentLine);
      let maxLineWidth = 0;
      for (const l of lines) { const lw = ctx.measureText(l).width; if (lw > maxLineWidth) maxLineWidth = lw; }
      const boxW = Math.min(W - 24, Math.max(220, Math.round(maxLineWidth + 36)));
      const lineSpacing = 13, padTop = 13, padBottom = 9;
      const boxH = Math.max(30, padTop + (lines.length - 1) * lineSpacing + padBottom);
      const boxX = Math.round((W - boxW) / 2), boxY = H - boxH - 8;
      ctx.fillStyle = 'rgba(8, 4, 14, 0.95)'; ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#5c2d68'; ctx.lineWidth = 1.5; ctx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1);
      ctx.strokeStyle = 'rgba(255, 190, 11, 0.35)'; ctx.lineWidth = 1; ctx.strokeRect(boxX + 2.5, boxY + 2.5, boxW - 5, boxH - 5);
      ctx.textAlign = 'center';
      for (let i = 0; i < lines.length; i++) {
        ctx.fillStyle = lines[i].includes('MISIÓN:') ? '#ffbe0b' : '#f8edeb';
        ctx.fillText(lines[i], W / 2, boxY + padTop + (i * lineSpacing));
      }
      ctx.textAlign = 'left';
    }
  }

  // Contador de FPS (esquina superior derecha, bajo el minimapa)
  const fpsText = `${currentFps} FPS`;
  ctx.save();
  ctx.font = '10px "VT323", monospace';
  const fpsW = ctx.measureText(fpsText).width + 8;
  const fpsX = W - fpsW - 8;
  const fpsY = 64;
  ctx.fillStyle = 'rgba(10, 5, 16, 0.85)';
  ctx.fillRect(fpsX, fpsY, fpsW, 13);
  ctx.strokeStyle = 'rgba(159, 83, 173, 0.8)';
  ctx.lineWidth = 1;
  ctx.strokeRect(fpsX + 0.5, fpsY + 0.5, fpsW - 1, 12);
  ctx.fillStyle = currentFps >= 50 ? '#00f5d4' : (currentFps >= 30 ? '#ffbe0b' : '#ff0055');
  ctx.fillText(fpsText, fpsX + 4, fpsY + 10);
  ctx.restore();

  ctx.restore();
}

// =========================================================
// GAME LOOP (Fixed Timestep 60 FPS)
// =========================================================
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

  // Medición de FPS
  fpsFrameCount++;
  if (currentTime - fpsLastTime >= 500) {
    currentFps = Math.round((fpsFrameCount * 1000) / (currentTime - fpsLastTime));
    fpsFrameCount = 0;
    fpsLastTime = currentTime;
  }

  // Si hubo un cambio de ventana, lag spike o retorno de pestaña, limitar delta a 16.6ms
  if (delta > 60 || delta < 0) delta = 16.66;
  accumulator += delta;
  if (accumulator > 100) accumulator = 100;

  while (accumulator >= FIXED_STEP) {
    if (gameStarted && !isPaused && !isTutorialOpen && !gameWon) {
      if (hitStopTimer > 0) hitStopTimer--;
      else { updatePlayer(keys, justPressed); updateEnemies(); }
    }
    clearJustPressed();
    accumulator -= FIXED_STEP;
  }
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
