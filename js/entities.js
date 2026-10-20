let currentRoomId = 1;
let visitedRooms = { 1: true };
let bannerText = "";
let bannerTimer = 0;
let particles = [];
let projectiles = [];
let enemies = [];
let relics = [];
let essenceOrbs = [];
let heartPickups = [];
let floatingTexts = [];
let screenShakeTimer = 0;
let shakeMagnitude = 0;
let hitStopTimer = 0;
let respawnFrames = 0;

let breakableWallHits = {}; // Key: "roomId_col_row" -> hits remaining (default 3)
let brokenWalls = {};       // Key: "roomId_col_row" -> boolean true

function triggerShake(duration, magnitude) {
  screenShakeTimer = duration;
  shakeMagnitude = magnitude;
}

function triggerHitStop(frames = 3) {
  hitStopTimer = frames;
}

let gameWon = false;
let seals = { carmesi: false, juramento: false, astral: false, reloj: false };
let storyProgress = { eliteKills: 0, talkedHubs: {}, discoveredAltars: {} };
let purchasedMaps = {};

const MAP_REGIONS = {
  villa: { name: 'Villa Refugio y Fortaleza Carmesí', roomIds: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 17, 27] },
  juramento: { name: 'Enclave Subterráneo y Catacumbas', roomIds: [9, 11, 12, 18, 19, 20, 28] },
  astral: { name: 'Santuario Astral y Observatorio', roomIds: [10, 13, 14, 21, 22, 23, 29] },
  reloj: { name: 'Jardines del Reloj Muerto', roomIds: [15, 16, 24, 25, 26, 30] }
};

function hasMapForRoom(roomId) {
  return Object.entries(MAP_REGIONS).some(([regionId, region]) =>
    purchasedMaps[regionId] && region.roomIds.includes(Number(roomId))
  );
}

function sealCount() {
  return Object.values(seals).filter(Boolean).length;
}

function allSealsRestored() {
  return sealCount() === Object.keys(seals).length;
}

const FORGE_UPGRADES = {
  '1': { label: '+5 ATK', cost: 60, buy: () => { player.atk += 5; } },
  '2': { label: '+6 alcance', cost: 65, buy: () => { player.attackReach = Math.min(18, player.attackReach + 6); } },
  '3': { label: '+10 magia', cost: 70, buy: () => { player.spellPower += 10; } },
  '4': { label: '-2 coste de hechizo', cost: 55, buy: () => { player.spellEfficiency = Math.min(6, player.spellEfficiency + 2); } },
  '5': { label: '+10 curación de corazones', cost: 50, buy: () => { player.healBonus = Math.min(40, player.healBonus + 10); } },
  '6': { label: '-5 recarga de dash', cost: 60, buy: () => { player.dashRecovery = Math.min(20, player.dashRecovery + 5); } }
};

function defeatBoss(boss) {
  if (boss.isFinal) {
    gameWon = true;
    setBgmMode('explore');
    sfx('relic');
    showBanner("¡NÚCLEO CARMESÍ DESTRUIDO! HAS COMPLETADO EL PROTOTIPO", 400);
    return;
  }

  if (boss.sealId && !seals[boss.sealId]) {
    seals[boss.sealId] = true;
    sfx('relic');
    showBanner(`✦ SELLO ${boss.sealName.toUpperCase()} RESTAURADO (${sealCount()}/4) · MEMORIA DESBLOQUEADA ✦`, 260);
  }
}

const player = {
  x: 45, y: 200, w: 12, h: 22,
  vx: 0, vy: 0,
  dir: 1,
  hp: 100, maxHp: 100,
  state: 'IDLE',
  onGround: false,
  coyoteTimer: 0,
  jumpsLeft: 1,
  hasDash: false,
  hasDoubleJump: false,
  hasWallJump: false,
  hasHook: false,
  hasMist: false,
  hasDive: false,
  hasAstralEye: false,
  hasParryBrooch: false,
  wallDir: 0,
  essence: 0,      // <-- NUEVO: Moneda de Esencia recolectada
  atk: 15,         // <-- NUEVO: Daño base de la espada
  hpUpgrades: 0,   // <-- NUEVO: Contador de mejoras de Vida
  atkUpgrades: 0,  // <-- NUEVO: Contador de mejoras de Daño
  attackReach: 0,
  spellPower: 0,
  spellEfficiency: 0,
  dashRecovery: 0,
  healBonus: 0,
  dashTimer: 0,
  dashCooldown: 0,
  mistTimer: 0,
  mistCooldown: 0,
  diveActive: false,
  hookCooldown: 0,
  attackTimer: 0,
  attackCooldown: 0,
  attackDir: 'forward', // 'forward' | 'down'
  attackHitRegistered: false, // Previene golpear muros múltiples veces en un mismo swing
  castCooldown: 0,
  invulnTimer: 0,
  animTimer: 0,
  dropThroughTimer: 0
};

let bannerSpeaker = '';
function showBanner(txt, duration = 150, speaker = '') {
  bannerText = txt;
  bannerTimer = duration;
  bannerSpeaker = speaker || '';
}

function saveProgress() {
  const data = {
    roomId: currentRoomId,
    x: player.x,
    y: player.y,
    hasDash: player.hasDash,
    hasDoubleJump: player.hasDoubleJump,
    hasWallJump: player.hasWallJump,
    essence: player.essence,
    maxHp: player.maxHp,
    atk: player.atk,
    hpUpgrades: player.hpUpgrades,
    atkUpgrades: player.atkUpgrades,
    attackReach: player.attackReach,
    spellPower: player.spellPower,
    spellEfficiency: player.spellEfficiency,
    dashRecovery: player.dashRecovery,
    healBonus: player.healBonus,
    brokenWalls,
    shopInventoryState,
    purchasedMaps,
    visitedRooms,
    seals,
    storyProgress
  };
  localStorage.setItem('noctis_save', JSON.stringify(data));
}

function loadRoom(id, spawnX, spawnY) {
  currentRoomId = id;
  visitedRooms[id] = true;
  if (spawnX !== undefined) player.x = spawnX;
  if (spawnY !== undefined) player.y = spawnY;
  player.vx = 0;
  player.vy = 0;
  enemies = [];
  projectiles = [];
  relics = [];
  essenceOrbs = [];
  heartPickups = [];

  const def = ROOM_DEFS[id];
  showBanner(def.name, 110);

  // La música de jefe solo se activa en arenas con un enemigo activo.
  if (typeof setBgmMode === 'function') {
    setBgmMode(def.spawns.some(s => s.type === 'boss') && !gameWon ? 'boss' : 'explore');
  }

  for (const s of def.spawns) {
    if (s.type === 'relic_dash' && !player.hasDash) {
      relics.push({ type: 'dash', name: 'Botas de Ceniza (Dash Sombrío [K / C])', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'relic_doublejump' && !player.hasDoubleJump) {
      relics.push({ type: 'doublejump', name: 'Pluma del Cuervo (Doble Salto)', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'relic_walljump' && !player.hasWallJump) {
      relics.push({ type: 'walljump', name: 'Garras de Gárgola (Salto en Pared)', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'citizen' || s.type === 'guard') {
      const isGuard = s.type === 'guard' || !!s.isGuard || (s.name || '').toLowerCase().includes('guardia') || 
        (s.name || '').toLowerCase().includes('centinela') || (s.name || '').toLowerCase().includes('vigía') || 
        (s.name || '').toLowerCase().includes('capitán') || (s.name || '').toLowerCase().includes('ballestero') || 
        (s.name || '').toLowerCase().includes('sargento') || (s.name || '').toLowerCase().includes('paladín');
      enemies.push({
        type: 'citizen', isGuard: isGuard, name: s.name, dialog: s.dialog, x: s.x, y: s.y,
        w: isGuard ? 14 : 12, h: 22,
        vx: isGuard ? 0 : (s.dir || 1) * 0.38, vy: 0, hp: 999, maxHp: 999, dir: s.dir || 1,
        walkTimer: isGuard ? 999999 : (70 + Math.random() * 50), isFriendly: true, hurtTimer: 0
      });
    } else if (s.type === 'skeleton') {
      enemies.push({
        type: 'skeleton', x: s.x, y: s.y, w: 14, h: 22,
        vx: 0.7, vy: 0, hp: 30, maxHp: 30, dir: -1,
        attackTelegraph: 0, lungeTimer: 0, hurtTimer: 0
      });
    } else if (s.type === 'bat') {
      enemies.push({
        type: 'bat', x: s.x, y: s.y, baseY: s.y, w: 14, h: 12,
        vx: 0, vy: 0, hp: 20, maxHp: 20, active: false, t: Math.random() * 6, hurtTimer: 0
      });
    } else if (s.type === 'armor') {
      enemies.push({
        type: 'armor', x: s.x, y: s.y, w: 18, h: 26,
        vx: 0.4, vy: 0, hp: 65, maxHp: 65, dir: -1, hurtTimer: 0
      });
    } else if (['archer', 'bomber', 'summoner', 'shield'].includes(s.type)) {
      enemies.push({
        type: s.type, x: s.x, y: s.y, baseY: s.y, w: 16, h: 22,
        vx: 0, vy: 0, hp: 45, maxHp: 45, dir: -1, hurtTimer: 0,
        actionTimer: 75, elite: true
      });
    } else if (s.type === 'boss' && !gameWon && (!s.sealId || !seals[s.sealId]) && (!s.isFinal || allSealsRestored())) {
      enemies.push({
        type: 'boss', name: s.name,
        x: s.x, y: s.y, w: 24, h: 36,
        vx: 0, vy: 0, hp: s.hp || 180, maxHp: s.hp || 180, dir: -1,
        phaseTimer: 80, pattern: 0, hurtTimer: 0, pillars: [],
        sealId: s.sealId, sealName: s.sealName, isFinal: !!s.isFinal
      });
    }
  }
}

// Utilidades de Colisión y Mapa
function getTileAt(col, row) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return '#';
  const key = `${currentRoomId}_${col}_${row}`;
  if (brokenWalls[key]) return '.';
  const map = ROOM_DEFS[currentRoomId].map;
  return map[row][col];
}

function isSolidTile(ch) {
  if (ch === '#' || ch === '?') return true;
  if (ch === 'B' && player.dashTimer <= 0) return true;
  return false;
}

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function spawnParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.5) * 3.5 - 0.5,
      life: 18 + Math.random() * 12,
      color
    });
  }
}

function moveWithCollisions(ent, isPlayer = false) {
  if (isPlayer) player.wallDir = 0;

  // Resolución en Eje X
  ent.x += ent.vx;
  let left = Math.floor(ent.x / TILE);
  let right = Math.floor((ent.x + ent.w - 0.01) / TILE);
  let top = Math.floor(ent.y / TILE);
  let bottom = Math.floor((ent.y + ent.h - 0.01) / TILE);

  for (let r = top; r <= bottom; r++) {
    for (let c = left; c <= right; c++) {
      const ch = getTileAt(c, r);
      if (isSolidTile(ch)) {
        if (ent.vx > 0) {
          ent.x = c * TILE - ent.w;
          if (isPlayer) player.wallDir = 1; // Tocando muro derecho
        } else if (ent.vx < 0) {
          ent.x = (c + 1) * TILE;
          if (isPlayer) player.wallDir = -1; // Tocando muro izquierdo
        }
        ent.vx = 0;
        left = Math.floor(ent.x / TILE);
        right = Math.floor((ent.x + ent.w - 0.01) / TILE);
      }
    }
  }

  // Resolución en Eje Y
  const prevBottom = ent.y + ent.h;
  ent.y += ent.vy;
  ent.onGround = false;

  left = Math.floor(ent.x / TILE);
  right = Math.floor((ent.x + ent.w - 0.01) / TILE);
  top = Math.floor(ent.y / TILE);
  bottom = Math.floor((ent.y + ent.h - 0.01) / TILE);

  for (let r = top; r <= bottom; r++) {
    for (let c = left; c <= right; c++) {
      const ch = getTileAt(c, r);
      if (isSolidTile(ch)) {
        if (ent.vy > 0) {
          ent.y = r * TILE - ent.h;
          ent.vy = 0;
          ent.onGround = true;
        } else if (ent.vy < 0) {
          ent.y = (r + 1) * TILE;
          ent.vy = 0;
        }
        top = Math.floor(ent.y / TILE);
        bottom = Math.floor((ent.y + ent.h - 0.01) / TILE);
      } else if (ch === '=' && ent.vy >= 0) {
        const platTop = r * TILE;
        const dropIgnore = isPlayer && player.dropThroughTimer > 0;
        if (!dropIgnore && prevBottom <= platTop + 2 && ent.y + ent.h >= platTop) {
          ent.y = platTop - ent.h;
          ent.vy = 0;
          ent.onGround = true;
        }
      }
    }
  }
}

function damagePlayer(amount, sourceX) {
  if (player.invulnTimer > 0 || player.dashTimer > 0) return;
  const finalDmg = player.damageReduction ? Math.max(1, Math.round(amount * (1 - player.damageReduction))) : amount;
  player.hp = Math.max(0, player.hp - finalDmg);
  player.invulnTimer = 45;
  player.vy = -3.2;
  player.vx = (player.x + player.w / 2 < sourceX) ? -3.5 : 3.5;
  triggerShake(12, 3.5); // Temblor de pantalla al recibir daño
  sfx('hit');
  spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#e63946', 12);

  if (player.hp <= 0) {
    showBanner("HAS CAÍDO... RENACIENDO EN EL ALTAR", 140);
    respawnFrames = 2;
    hitStopTimer = 0;
    player.dashTimer = 0;
    player.attackTimer = 0;
    player.attackCooldown = 0;
    player.castCooldown = 0;
    player.vx = 0;
    player.vy = 0;
    projectiles = [];
    particles = [];
    player.hp = player.maxHp;
    const saved = localStorage.getItem('noctis_save');
    if (saved) {
      const d = JSON.parse(saved);
      player.hasDash = d.hasDash;
      player.hasDoubleJump = d.hasDoubleJump;
      player.hasWallJump = d.hasWallJump;
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
      seals = { carmesi: false, juramento: false, astral: false, reloj: false, ...(d.seals || {}) };
      storyProgress = { eliteKills: 0, talkedHubs: {}, discoveredAltars: {}, ...(d.storyProgress || {}) };
      const spawnRoom = ROOM_DEFS[d.roomId] ? d.roomId : -2;
      const spawnX = Number.isFinite(d.x) ? d.x : 45;
      const spawnY = Number.isFinite(d.y) ? d.y : 200;
      loadRoom(spawnRoom, spawnX, spawnY);
    } else {
      loadRoom(1, 45, 200);
    }
  }
}

function updatePlayer(keys, justPressed) {
  if (respawnFrames > 0) {
    respawnFrames--;
    return;
  }
  player.animTimer++;
  if (player.invulnTimer > 0) player.invulnTimer--;
  if (player.dashCooldown > 0) player.dashCooldown--;
  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.castCooldown > 0) player.castCooldown--;
  if (player.dropThroughTimer > 0) player.dropThroughTimer--;

  const leftKey = keys['a'] || keys['arrowleft'];
  const rightKey = keys['d'] || keys['arrowright'];
  const downKey = keys['s'] || keys['arrowdown'];
  const jumpPressed = justPressed['w'] || justPressed[' '] || justPressed['z'] || justPressed['arrowup'];
  const jumpHeld = keys['w'] || keys[' '] || keys['z'] || keys['arrowup'];
  const attackPressed = justPressed['mouseLeft'];
  const castPressed = justPressed['mouseRight'] || justPressed['q'];
  const dashPressed = justPressed['shiftleft'] || justPressed['shift'];
  const hookPressed = justPressed['f'];

  // RELIQUIA: Forma de Bruma (S + Shift)
  if (player.hasMist && downKey && dashPressed && player.mistCooldown <= 0 && player.mistTimer <= 0) {
    player.mistTimer = 45; // ~0.75s de forma intangible
    player.mistCooldown = 90;
    player.invulnTimer = 50;
    sfx('dash');
    showBanner("FORMA DE BRUMA ACTIVADA", 60);
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#c77dff', 16);
  }

  if (player.mistTimer > 0) {
    player.mistTimer--;
    player.state = 'MIST';
    player.vx = player.dir * 4.2;
    player.vy = 0;
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#7209b7', 2);
  }

  // RELIQUIA: Gancho de Sombra (Cadena del Condenado - Tecla F)
  if (hookPressed && player.hasHook && player.hookCooldown <= 0) {
    player.hookCooldown = 40;
    player.vy = -7.5; // Impulso vertical / acrobático hacia el techo
    player.vx = player.dir * 4.8;
    sfx('dash');
    showBanner("CADENA DEL CONDENADO", 50);
    triggerShake(4, 2);
    // Trazar línea de cadena con partículas ascendentes
    for (let k = 0; k < 12; k++) {
      particles.push({
        x: player.x + player.w / 2 + (Math.random() - 0.5) * 4,
        y: player.y - k * 6,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -2,
        life: 20,
        color: '#7de2ff'
      });
    }
  }

  // RELIQUIA: Martillo de Sangre / Dive Attack (S + Ataque en el aire)
  if (player.hasDive && downKey && attackPressed && !player.onGround && !player.diveActive) {
    player.diveActive = true;
    player.vy = 8.5; // Caída acelerada en picada
    player.vx = 0;
    sfx('cast');
    showBanner("¡MARTILLO DE SANGRE!", 50);
    triggerShake(5, 2);
  }

  if (player.diveActive) {
    player.vy = 9.5;
    spawnParticles(player.x + player.w / 2, player.y + player.h, '#ff0055', 4);
    // Impacto al tocar el suelo
    if (player.onGround) {
      player.diveActive = false;
      triggerShake(12, 5);
      triggerHitStop(6);
      sfx('hit');
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ef476f', 24);
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffbe0b', 16);
      // Onda expansiva que daña a enemigos cercanos
      for (const e of enemies) {
        if (Math.hypot(e.x - player.x, e.y - player.y) < 70) {
          e.hp -= Math.round(player.atk * 1.8);
          e.hurtTimer = 16;
          e.vy = -3.5;
          floatingTexts.push({
            text: `-${Math.round(player.atk * 1.8)}`,
            x: e.x + e.w / 2,
            y: e.y - 6,
            vy: -1.4,
            life: 30,
            color: '#ef476f'
          });
        }
      }
    }
  }

  // Hechizo Carmesí / Sub-Arma: Lanza de Sangre (Clic Derecho o Q) - Consume 10 Esencia
  if (castPressed && player.castCooldown <= 0) {
    const SPELL_COST = Math.max(4, 10 - (player.spellEfficiency || 0));
    if (player.essence >= SPELL_COST) {
      player.essence -= SPELL_COST;
      player.castCooldown = 22;
      sfx('cast');
      triggerShake(4, 1.5);
      projectiles.push({
        x: player.x + (player.dir === 1 ? player.w + 4 : -4),
        y: player.y + 10,
        vx: player.dir * 6.5,
        vy: 0,
        r: 3.5,
        fromPlayer: true,
        dmg: Math.round(player.atk * 1.4 + (player.spellPower || 0))
      });
      spawnParticles(player.x + (player.dir === 1 ? player.w : 0), player.y + 10, '#ff0055', 8);
    } else {
      sfx('hit');
      showBanner("ESENCIA INSUFICIENTE (Requiere 10 ♦)", 70);
    }
  }

  // Habilidad: Dash Sombrío
  if (dashPressed && !downKey && player.hasDash && player.dashCooldown <= 0 && player.dashTimer <= 0) {
    player.dashTimer = 11;
    player.dashCooldown = Math.max(12, 32 - (player.dashRecovery || 0));
    player.vy = 0;
    player.vx = player.dir * 6.5;
    sfx('dash');
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#9d4edd', 10);
  }

  if (player.dashTimer > 0) {
    player.dashTimer--;
    player.vy = 0;
    player.vx = player.dir * 6.5;
    player.state = 'DASH';
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#7b2cbf', 2);

    // Permitir Salto durante el Dash (Dash-Jump fluido como en Hollow Knight / Celeste)
    if (jumpPressed && (player.onGround || player.coyoteTimer > 0 || player.jumpsLeft > 0)) {
      player.dashTimer = 0; // Terminar el congelamiento vertical del dash
      player.vy = -6.2;
      player.vx = player.dir * 5.2; // Salto largo hacia adelante con inercia
      if (player.onGround || player.coyoteTimer > 0) {
        player.coyoteTimer = 0;
        player.jumpsLeft = player.hasDoubleJump ? 1 : 0;
      } else {
        player.jumpsLeft--;
      }
      sfx('jump');
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#c77dff', 8);
    }
  } else {
    const speed = 2.2;
    if (leftKey) {
      player.vx = -speed;
      player.dir = -1;
    } else if (rightKey) {
      player.vx = speed;
      player.dir = 1;
    } else {
      player.vx *= 0.7;
      if (Math.abs(player.vx) < 0.1) player.vx = 0;
    }

    player.vy = Math.min(player.vy + 0.32, 6.5);

    // Deslizamiento en pared (WALL_SLIDE) si tiene las Garras de Gárgola
    const touchingWall = player.hasWallJump && !player.onGround && player.wallDir !== 0 &&
                         ((player.wallDir === -1 && leftKey) || (player.wallDir === 1 && rightKey));
    if (touchingWall && player.vy > 1.2) {
      player.vy = 1.2; // Cae lento por el muro
      if (player.animTimer % 8 === 0) sfx('wallslide');
      spawnParticles(player.x + (player.wallDir === 1 ? player.w : 0), player.y + 10, '#adb5bd', 1);
    }

    if (player.onGround) {
      player.coyoteTimer = 6;
      player.jumpsLeft = player.hasDoubleJump ? 2 : 1;
    } else if (player.coyoteTimer > 0) {
      player.coyoteTimer--;
    }

    if (downKey && jumpPressed && player.onGround) {
      player.dropThroughTimer = 10;
      player.onGround = false;
    } else if (jumpPressed) {
      if (player.hasWallJump && !player.onGround && player.wallDir !== 0) {
        // ¡Salto en Pared (Wall Jump)!
        player.vy = -6.0;
        player.vx = -player.wallDir * 4.2;
        player.dir = -player.wallDir;
        sfx('jump');
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#00bbf9', 10);
      } else if (player.coyoteTimer > 0) {
        player.vy = -6.2;
        player.coyoteTimer = 0;
        player.jumpsLeft = player.hasDoubleJump ? 1 : 0;
        sfx('jump');
      } else if (player.jumpsLeft > 0) {
        player.vy = -5.8;
        player.jumpsLeft--;
        sfx('jump');
        spawnParticles(player.x + player.w / 2, player.y + player.h, '#c77dff', 8);
      }
    }

    if (!jumpHeld && player.vy < -2.2) {
      player.vy *= 0.65;
    }

    if (attackPressed && player.attackCooldown <= 0) {
      player.attackTimer = 12;
      player.attackCooldown = 18;
      player.attackDir = (downKey && !player.onGround) ? 'down' : 'forward';
      player.attackHitRegistered = false;
      sfx('sword');
    }

    if (player.attackTimer > 0) {
      player.attackTimer--;
      player.state = 'ATTACK';
    } else if (!player.onGround) {
      player.state = player.vy < 0 ? 'JUMP' : 'FALL';
    } else if (Math.abs(player.vx) > 0.2) {
      player.state = 'RUN';
    } else {
      player.state = 'IDLE';
    }
  }

  moveWithCollisions(player, true);

  // Interacción con el entorno
  const cx = Math.floor((player.x + player.w / 2) / TILE);
  const cy = Math.floor((player.y + player.h / 2) / TILE);
  const footRow = Math.floor((player.y + player.h - 1) / TILE);
  const footTile = getTileAt(cx, footRow);

  // Daño por pinchos (a menos que ejecute un Down-Slash / Pogo con éxito)
  const isPogoSlash = player.attackTimer > 2 && player.attackDir === 'down';
  if (footTile === '^') {
    if (isPogoSlash) {
      // ¡Pogo Jump exitoso sobre pinchos!
      player.vy = -6.4;
      player.jumpsLeft = player.hasDoubleJump ? 1 : 0;
      sfx('hit');
      triggerShake(6, 2);
      triggerHitStop(3);
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffffff', 10);
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffbe0b', 8);
    } else {
      damagePlayer(20, cx * TILE + 8);
    }
  }

  // Interacción con el Altar: E (Guardar/Curar), 1 (Mejorar Vida), 2 (Mejorar Espada)
  const isAtAltar = (getTileAt(cx, cy) === 'S' || getTileAt(cx, footRow) === 'S');
  if (isAtAltar) {
    const hpCost = 30 + player.hpUpgrades * 25;
    const atkCost = 40 + player.atkUpgrades * 30;

    if (justPressed['e']) {
      storyProgress.discoveredAltars[currentRoomId] = true;
      player.hp = player.maxHp;
      saveProgress();
      sfx('relic');
      showBanner(`GUARDADO | [1] +25 HP | [2] +5 ATK | [T] Viaje rápido`, 220);
      spawnParticles(player.x + 6, player.y + 10, '#ffbe0b', 16);
    } else if (justPressed['t']) {
      const altarRooms = Object.keys(storyProgress.discoveredAltars).map(Number).filter(id => id !== currentRoomId);
      if (altarRooms.length) {
        const destination = altarRooms[0];
        sfx('relic');
        triggerShake(10, 3);
        spawnParticles(player.x + 6, player.y + 10, '#c77dff', 25);
        loadRoom(destination, 235, 200);
        showBanner(`✦ VIAJE RÁPIDO: ${ROOM_DEFS[destination].name.toUpperCase()} ✦`, 150);
        return;
      } else {
        showBanner("ACTIVA OTRO ALTAR PARA DESBLOQUEAR VIAJE RÁPIDO", 120);
      }
    } else if (justPressed['1']) {
      if (player.essence >= hpCost) {
        player.essence -= hpCost;
        player.hpUpgrades++;
        player.maxHp += 25;
        player.hp = player.maxHp;
        saveProgress();
        sfx('relic');
        showBanner(`¡VIDA MEJORADA A ${player.maxHp} HP!`, 140);
        spawnParticles(player.x + 6, player.y + 10, '#00f5d4', 20);
      } else {
        sfx('hit');
        showBanner(`ESENCIA INSUFICIENTE: Necesitas ${hpCost} ♦ para mejorar HP`, 120);
      }
    } else if (justPressed['2']) {
      if (player.essence >= atkCost) {
        player.essence -= atkCost;
        player.atkUpgrades++;
        player.atk += 5;
        saveProgress();
        sfx('relic');
        showBanner(`¡FILO CARMESÍ MEJORADO A ${player.atk} ATK!`, 140);
        spawnParticles(player.x + 6, player.y + 10, '#ff0055', 20);
      } else {
        sfx('hit');
        showBanner(`ESENCIA INSUFICIENTE: Necesitas ${atkCost} ♦ para mejorar ATK`, 120);
      }
    }
  }

  // Interacción con Espejo de Sangre 'T' en Sala 07
  const isAtMirror = (getTileAt(cx, cy) === 'T' || getTileAt(cx, footRow) === 'T');
  if (isAtMirror) {
    if (justPressed['e'] || justPressed['t']) {
      sfx('relic');
      triggerShake(10, 3);
      spawnParticles(player.x + 6, player.y + 10, '#c77dff', 25);
      loadRoom(2, 235, 200); // Teletransporta de vuelta al Altar del Gran Vestíbulo
      showBanner("✦ TELETRANSPORTE AL ALTAR DEL GRAN VESTÍBULO (SALA 02) ✦", 150);
      return;
    }
  }

  // Transiciones entre habitaciones y puertas de progreso.
  const doors = ROOM_DEFS[currentRoomId].doors;
  const useDoor = (door) => {
    if (door.requiresAllSeals && !allSealsRestored()) {
      showBanner(`EL SANTUARIO DEL ECLIPSE EXIGE LOS 4 SELLOS (${sealCount()}/4)`, 180);
      return true;
    }
    if (door.requiresAbility && !player[door.requiresAbility]) {
      showBanner(`RUTA BLOQUEADA: REQUIERE ${door.requiresLabel}`, 150);
      // Empujar ligeramente al jugador hacia adentro para que no se quede pegado al borde
      if (player.x < 14) {
        player.x = 14;
        player.vx = 0;
      }
      return true;
    }
    loadRoom(door.to, door.x, door.y);
    return true;
  };
  if (player.x + player.w > W - 6 && doors.right) {
    useDoor(doors.right);
    return;
  }

  const isAtForge = (getTileAt(cx, cy) === 'F' || getTileAt(cx, footRow) === 'F');
  if (isAtForge) {
    for (const [key, upgrade] of Object.entries(FORGE_UPGRADES)) {
      if (!justPressed[key]) continue;
      if (player.essence < upgrade.cost) showBanner(`ESENCIA INSUFICIENTE (${upgrade.cost} ♦)`, 100);
      else {
        player.essence -= upgrade.cost;
        upgrade.buy();
        sfx('relic');
        showBanner(`BOROS FORJA: ${upgrade.label.toUpperCase()}`, 150);
      }
      break;
    }
  }
  if (player.x < 6 && doors.left && player.y > 140) {
    useDoor(doors.left);
    return;
  }
  if (player.x < 6 && doors.westUpper && player.y <= 140) {
    useDoor(doors.westUpper);
    return;
  }
  if (player.y < 10 && doors.up) {
    useDoor(doors.up);
    return;
  }
  if (player.y + player.h > H - 10 && doors.down) {
    useDoor(doors.down);
    return;
  }

  // Combate con espada (Frontal o Hacia Abajo / Pogo Jump)
  if (player.attackTimer > 3 && player.attackTimer < 10) {
    const isDown = player.attackDir === 'down';
    const swordBox = isDown
      ? {
          x: player.x - 4,
          y: player.y + player.h - 2,
          w: player.w + 8,
          h: 18
        }
      : {
          x: player.dir === 1 ? player.x + player.w : player.x - (22 + player.attackReach),
          y: player.y + 2,
          w: 22 + player.attackReach,
          h: 18
        };

    // Combate con espada (Frontal o Hacia Abajo / Pogo Jump)
    // PARREAR PROYECTILES ENEMIGOS: si tu espada corta una bola enemiga, ¡la desvías!
    for (let k = projectiles.length - 1; k >= 0; k--) {
      const prj = projectiles[k];
      if (!prj.fromPlayer && aabb(swordBox, { x: prj.x - prj.r, y: prj.y - prj.r, w: prj.r * 2, h: prj.r * 2 })) {
        prj.fromPlayer = true;
        prj.vx = -prj.vx * (player.hasParryBrooch ? 2.4 : 1.6);
        prj.vy = (Math.random() - 0.5) * 1.5;
        prj.dmg = player.atk * (player.hasParryBrooch ? 4.5 : 2.5); // El proyectil desviado causa daño masivo
        sfx('parry');
        triggerShake(player.hasParryBrooch ? 12 : 8, player.hasParryBrooch ? 4 : 3);
        triggerHitStop(player.hasParryBrooch ? 8 : 5);
        floatingTexts.push({
          text: player.hasParryBrooch ? "¡CONTRAGOLPE CRÍTICO!" : "¡PARRY!",
          x: prj.x - 24,
          y: prj.y - 12,
          vy: -1.2,
          life: 35,
          color: player.hasParryBrooch ? '#06d6a0' : '#ffbe0b'
        });
        spawnParticles(prj.x, prj.y, player.hasParryBrooch ? '#06d6a0' : '#ffbe0b', 18);
        spawnParticles(prj.x, prj.y, '#ffffff', 10);
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.hurtTimer <= 0 && aabb(swordBox, e)) {
        if (!isDown && e.type === 'armor' && e.dir !== player.dir) {
          sfx('hit');
          spawnParticles(swordBox.x + 10, swordBox.y + 8, '#adb5bd', 5);
          continue;
        }
        e.hp -= player.atk; // <-- Usa el daño mejorable de Alaric
        e.hurtTimer = 12;
        triggerShake(6, 2); // Temblor leve al golpear
        triggerHitStop(e.type === 'boss' ? 5 : 3); // <-- NUEVO: Hit-Stop / Frame Freeze de impacto
        
        // Empuje (Knockback) o Rebote Pogo
        if (isDown) {
          // ¡Rebote hacia arriba (Pogo Jump) al golpear enemigo desde arriba!
          player.vy = -6.4;
          player.jumpsLeft = player.hasDoubleJump ? 1 : 0; // Restaura opción de salto aéreo
          e.vy = 2.0; // Aplasta al enemigo contra el suelo
          spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffffff', 8);
        } else {
          const kbForce = e.type === 'boss' ? 0.8 : (e.type === 'armor' ? 1.6 : 3.2);
          e.knockbackX = player.dir * kbForce;
          if (e.type !== 'boss') e.vy = -1.8;
        }
        
        // NUEVO: Texto de daño flotante
        floatingTexts.push({
          text: `-${player.atk}`,
          x: e.x + e.w / 2 - 4,
          y: e.y - 4,
          vy: -1.2,
          life: 25
        });

        sfx('hit');
        spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff0055', 8);
        if (e.hp <= 0) {
          if (e.elite) storyProgress.eliteKills++;
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ffbe0b', 18);

          // NUEVO: Soltar Orbes de Esencia según el tipo de enemigo
          const orbCount = e.type === 'boss' ? 20 : (e.type === 'armor' ? 5 : (e.type === 'skeleton' ? 3 : 2));
          for (let k = 0; k < orbCount; k++) {
            essenceOrbs.push({
              x: e.x + e.w / 2,
              y: e.y + e.h / 2,
              w: 5, h: 5,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 3.5 - 1,
              val: 5 // Cada orbe vale 5 de Esencia
            });
          }

          // Probabilidad de soltar Corazón de Vida (35% enemigos normales, 100% jefe)
          const dropChance = e.type === 'boss' ? 1.0 : 0.35;
          if (Math.random() < dropChance) {
            heartPickups.push({
              x: e.x + e.w / 2 - 3,
              y: e.y + e.h / 2 - 3,
              w: 8, h: 8,
              vx: (Math.random() - 0.5) * 2,
              vy: -2.8,
              heal: 25
            });
          }

          if (e.type === 'boss') defeatBoss(e);
          enemies.splice(i, 1);
        }
      }
    }

    // Interacción de espada con Muros Secretos Rompibles ('?')
    if (!player.attackHitRegistered) {
      const minCol = Math.floor(swordBox.x / TILE);
      const maxCol = Math.floor((swordBox.x + swordBox.w) / TILE);
      const minRow = Math.floor(swordBox.y / TILE);
      const maxRow = Math.floor((swordBox.y + swordBox.h) / TILE);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
          const key = `${currentRoomId}_${c}_${r}`;
          if (brokenWalls[key]) continue;

          const rawTile = ROOM_DEFS[currentRoomId].map[r][c];
          if (rawTile === '?') {
            player.attackHitRegistered = true;
            if (breakableWallHits[key] === undefined) breakableWallHits[key] = 3;
            breakableWallHits[key]--;

            const tileCenterX = c * TILE + TILE / 2;
            const tileCenterY = r * TILE + TILE / 2;

            if (breakableWallHits[key] <= 0) {
              // ¡Muro destruido por completo!
              brokenWalls[key] = true;
              sfx('crumble');
              triggerShake(10, 4);
              triggerHitStop(4);
              floatingTexts.push({
                text: "¡SECRETO REVELADO!",
                x: tileCenterX - 35,
                y: tileCenterY - 14,
                vy: -1.0,
                life: 45
              });

              // Escombros masivos volando
              for (let k = 0; k < 18; k++) {
                particles.push({
                  x: tileCenterX,
                  y: tileCenterY,
                  vx: (Math.random() - 0.5) * 5,
                  vy: -Math.random() * 4 - 1,
                  life: 25 + Math.random() * 15,
                  color: ['#4a3b5c', '#7209b7', '#adb5bd', '#332447'][Math.floor(Math.random() * 4)]
                });
              }

              // Recompensa: Alijo Gigante de Esencia (8 orbes = 40 de esencia) + Corazón
              for (let k = 0; k < 8; k++) {
                essenceOrbs.push({
                  x: tileCenterX,
                  y: tileCenterY,
                  w: 5, h: 5,
                  vx: (Math.random() - 0.5) * 4.5,
                  vy: -Math.random() * 3.5 - 1.5,
                  val: 5
                });
              }
              heartPickups.push({
                x: tileCenterX - 4,
                y: tileCenterY - 4,
                w: 8, h: 8,
                vx: (Math.random() - 0.5) * 2,
                vy: -3.2,
                heal: 35
              });
            } else {
              // Golpe al muro: se agrieta más
              sfx('hit');
              triggerShake(5, 2);
              triggerHitStop(2);
              floatingTexts.push({
                text: `${breakableWallHits[key]} golpes restantes`,
                x: tileCenterX - 30,
                y: tileCenterY - 10,
                vy: -0.8,
                life: 25
              });
              // Polvo y pequeñas esquirlas
              spawnParticles(tileCenterX, tileCenterY, '#7209b7', 8);
              spawnParticles(tileCenterX, tileCenterY, '#adb5bd', 6);
            }
            break;
          }
        }
        if (player.attackHitRegistered) break;
      }
    }
  }

  // Recolección de Reliquias
  for (let i = relics.length - 1; i >= 0; i--) {
    const r = relics[i];
    if (aabb(player, r)) {
      if (r.type === 'dash') player.hasDash = true;
      if (r.type === 'doublejump') player.hasDoubleJump = true;
      if (r.type === 'walljump') player.hasWallJump = true;
      if (r.type === 'hook') player.hasHook = true;
      if (r.type === 'mist') player.hasMist = true;
      if (r.type === 'dive') player.hasDive = true;
      if (r.type === 'astraleye') player.hasAstralEye = true;
      if (r.type === 'parrybrooch') player.hasParryBrooch = true;
      sfx('relic');
      showBanner("RELIQUIA OBTENIDA: " + r.name, 190);
      spawnParticles(r.x + 7, r.y + 7, '#00f5d4', 24);
      if (typeof showSkillTutorial === 'function') {
        showSkillTutorial(r.type);
      }
      relics.splice(i, 1);
    }
  }
}

function updateEnemies() {
  if (respawnFrames > 0) return;
  for (const e of enemies) {
    if (e.hurtTimer > 0) e.hurtTimer--;

    if (e.type === 'citizen') {
      // Ciudadano pacífico paseando de lado a lado por la calle
      e.vy = Math.min(e.vy + 0.32, 6);
      e.walkTimer--;
      if (e.walkTimer <= 0) {
        e.dir = -e.dir;
        e.vx = e.dir * (0.35 + Math.random() * 0.2);
        e.walkTimer = 90 + Math.random() * 80;
      }
      // No salir de la habitación
      if (e.x < 30) { e.dir = 1; e.vx = 0.45; }
      if (e.x > W - 50) { e.dir = -1; e.vx = -0.45; }
      moveWithCollisions(e);
      continue; // No atacan ni dañan
    }

    if (e.type === 'skeleton') {
      e.vy = Math.min(e.vy + 0.32, 6);
      const dist = Math.hypot((player.x - e.x), (player.y - e.y));

      // Aplicar retroceso de impacto
      if (e.knockbackX) {
        e.vx = e.knockbackX;
        e.knockbackX *= 0.82;
        if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
      } else if (e.lungeTimer > 0) {
        e.lungeTimer--;
        e.vx = e.dir * 3.2;
      } else if (e.attackTelegraph > 0) {
        e.attackTelegraph--;
        e.vx = 0;
        if (e.attackTelegraph === 0) e.lungeTimer = 14;
      } else if (dist < 75 && Math.abs(player.y - e.y) < 24) {
        e.dir = player.x < e.x ? -1 : 1;
        e.attackTelegraph = 25;
      } else {
        e.vx = e.dir * 0.75;
        const aheadCol = Math.floor((e.x + (e.dir > 0 ? e.w + 2 : -2)) / TILE);
        const footRow = Math.floor((e.y + e.h + 2) / TILE);
        const wallCol = getTileAt(aheadCol, Math.floor((e.y + 8) / TILE));
        const floorBelow = getTileAt(aheadCol, footRow);
        if (wallCol === '#' || (floorBelow === '.' || floorBelow === '^')) {
          e.dir *= -1;
        }
      }
      moveWithCollisions(e);
    } else if (e.type === 'bat') {
      const dist = Math.hypot(player.x - e.x, player.y - e.y);
      if (!e.active && dist < 150) e.active = true;
      if (e.active) {
        if (e.knockbackX) {
          e.x += e.knockbackX;
          e.knockbackX *= 0.85;
          if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
        } else {
          e.t += 0.1;
          e.dir = player.x < e.x ? -1 : 1;
          e.x += e.dir * 1.1;
          e.y = e.baseY + 35 + Math.sin(e.t) * 26;
        }
      }
    } else if (e.type === 'armor') {
      e.vy = Math.min(e.vy + 0.32, 6);
      if (e.knockbackX) {
        e.vx = e.knockbackX;
        e.knockbackX *= 0.8;
        if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
      } else {
        e.dir = player.x < e.x ? -1 : 1;
        e.vx = e.dir * 0.45;
      }
      moveWithCollisions(e);
    } else if (e.type === 'archer') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      if (--e.actionTimer <= 0) {
        e.actionTimer = 95;
        projectiles.push({ x: e.x + 8, y: e.y + 10, vx: e.dir * 3.4, vy: -0.4, r: 3 });
      }
      moveWithCollisions(e);
    } else if (e.type === 'bomber') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      e.vx = e.dir * 0.9;
      moveWithCollisions(e);
      if (Math.hypot(player.x - e.x, player.y - e.y) < 20) {
        damagePlayer(28, e.x);
        e.x = -100;
        e.hp = 0;
      }
    } else if (e.type === 'summoner') {
      e.t = (e.t || 0) + 0.08;
      e.y = e.baseY + Math.sin(e.t) * 8;
      if (--e.actionTimer <= 0) {
        e.actionTimer = 150;
        enemies.push({ type: 'bat', x: e.x, y: e.y, baseY: e.y, w: 14, h: 12, vx: 0, vy: 0, hp: 20, maxHp: 20, active: true, t: 0, hurtTimer: 0 });
      }
    } else if (e.type === 'shield') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      e.vx = e.dir * 0.3;
      moveWithCollisions(e);
    } else if (e.type === 'boss') {
      // COMPROBACIÓN FASE 2: LORD MALAKOR DESATADO (<= 50% HP)
      if (!e.phase2 && e.hp <= e.maxHp * 0.5) {
        e.phase2 = true;
        e.phaseTimer = 100;
        e.pattern = 3; // Patrón de transformación / rugido
        sfx('relic');
        triggerShake(20, 5);
        triggerHitStop(10);
        showBanner("¡LORD MALAKOR HA DESATADO EL ECLIPSE CARMESÍ!", 180);
        floatingTexts.push({
          text: "¡FASE 2: FURIA DEL ECLIPSE!",
          x: e.x - 45,
          y: e.y - 18,
          vy: -1.0,
          life: 55,
          color: '#ff0055'
        });
        // Explosión de aura oscura
        for (let k = 0; k < 25; k++) {
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff0055', 2);
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ffbe0b', 2);
        }
      }

      e.vy = Math.min(e.vy + 0.32, 6);
      if (e.knockbackX) {
        e.x += e.knockbackX;
        e.knockbackX *= 0.8;
        if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
      }
      e.phaseTimer--;

      if (e.phaseTimer <= 0) {
        // En Fase 2 los patrones van de 0 a 3 (incluyendo cometas aéreos) y los intervalos son más rápidos
        const maxPatterns = e.phase2 ? 4 : 3;
        e.pattern = (e.pattern + 1) % maxPatterns;
        e.dir = player.x < e.x ? -1 : 1;

        if (e.pattern === 0) {
          // Ráfaga de proyectiles (3 en fase 1, 5 en fase 2)
          e.vx = 0;
          e.phaseTimer = e.phase2 ? 70 : 95;
          const angles = e.phase2 ? [-0.35, -0.18, 0, 0.18, 0.35] : [-0.25, 0, 0.25];
          for (const a of angles) {
            const baseAngle = Math.atan2((player.y + 10) - (e.y + 15), (player.x + 6) - (e.x + 12)) + a;
            const spd = e.phase2 ? 3.6 : 2.8;
            projectiles.push({
              x: e.x + 10, y: e.y + 14,
              vx: Math.cos(baseAngle) * spd,
              vy: Math.sin(baseAngle) * spd,
              r: e.phase2 ? 5 : 4
            });
          }
          sfx('sword');
        } else if (e.pattern === 1) {
          // Embestida rápida (más veloz en fase 2)
          e.vx = e.dir * (e.phase2 ? 5.8 : 4.2);
          e.phaseTimer = e.phase2 ? 55 : 70;
          sfx('dash');
          spawnParticles(e.x, e.y + 16, '#ff0055', 8);
        } else if (e.pattern === 2) {
          // Pilares solares del suelo
          e.x = 228; e.y = 140; e.vx = 0;
          e.phaseTimer = e.phase2 ? 85 : 110;
          e.pillars = [70, 140, 210, 280, 350, 410];
          sfx('relic');
        } else if (e.pattern === 3 && e.phase2) {
          // NUEVO ATAQUE FASE 2: Lluvia de Cometas Carmesí en picado desde el cielo
          e.x = 228; e.y = 80; e.vx = 0;
          e.phaseTimer = 80;
          sfx('cast');
          for (let c = 0; c < 6; c++) {
            const startX = 60 + c * 60 + (Math.random() - 0.5) * 30;
            projectiles.push({
              x: startX,
              y: 20,
              vx: (player.x - startX) * 0.02,
              vy: 3.2 + Math.random() * 1.5,
              r: 5
            });
          }
        }
      }

      if (e.pattern === 2 && e.pillars && e.pillars.length > 0) {
        const hitFrame = e.phase2 ? 30 : 45;
        if (e.phaseTimer === hitFrame) {
          sfx('hit');
          for (const px of e.pillars) {
            spawnParticles(px, 210, e.phase2 ? '#ff0055' : '#ff5400', 16);
            if (Math.abs((player.x + 6) - px) < 14 && player.y + player.h > 140) {
              damagePlayer(e.phase2 ? 30 : 25, px);
            }
          }
        }
      }
      moveWithCollisions(e);
    }

    if (aabb(player, e)) {
      if (!e.isFriendly) {
        damagePlayer(15, e.x + e.w / 2);
      }
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
      projectiles.splice(i, 1);
      continue;
    }

    if (p.fromPlayer) {
      // Proyectil disparado por Alaric
      let hit = false;
      const pBox = { x: p.x - p.r, y: p.y - p.r, w: p.r * 2, h: p.r * 2 };

      // Impacto con muros y muros rompibles
      const tileC = Math.floor(p.x / TILE);
      const tileR = Math.floor(p.y / TILE);
      const tileAtP = getTileAt(tileC, tileR);
      if (tileAtP === '?') {
        const key = `${currentRoomId}_${tileC}_${tileR}`;
        if (!brokenWalls[key]) {
          if (breakableWallHits[key] === undefined) breakableWallHits[key] = 3;
          breakableWallHits[key]--;
          const tileCenterX = tileC * TILE + TILE / 2;
          const tileCenterY = tileR * TILE + TILE / 2;
          if (breakableWallHits[key] <= 0) {
            brokenWalls[key] = true;
            sfx('crumble');
            triggerShake(10, 4);
            triggerHitStop(4);
            floatingTexts.push({
              text: "¡SECRETO REVELADO!",
              x: tileCenterX - 35,
              y: tileCenterY - 14,
              vy: -1.0,
              life: 45
            });
            for (let k = 0; k < 18; k++) {
              particles.push({
                x: tileCenterX, y: tileCenterY,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 4 - 1,
                life: 25 + Math.random() * 15,
                color: ['#4a3b5c', '#7209b7', '#adb5bd', '#332447'][Math.floor(Math.random() * 4)]
              });
            }
            for (let k = 0; k < 8; k++) {
              essenceOrbs.push({
                x: tileCenterX, y: tileCenterY,
                w: 5, h: 5,
                vx: (Math.random() - 0.5) * 4.5,
                vy: -Math.random() * 3.5 - 1.5,
                val: 5
              });
            }
            heartPickups.push({
              x: tileCenterX - 4, y: tileCenterY - 4,
              w: 8, h: 8,
              vx: (Math.random() - 0.5) * 2, vy: -3.2,
              heal: 35
            });
          } else {
            sfx('hit');
            triggerShake(5, 2);
            triggerHitStop(2);
            floatingTexts.push({
              text: `${breakableWallHits[key]} golpes restantes`,
              x: tileCenterX - 30, y: tileCenterY - 10,
              vy: -0.8,
              life: 25
            });
            spawnParticles(tileCenterX, tileCenterY, '#7209b7', 8);
          }
          projectiles.splice(i, 1);
          continue;
        }
      } else if (tileAtP === '#') {
        spawnParticles(p.x, p.y, '#ff0055', 4);
        projectiles.splice(i, 1);
        continue;
      }
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (aabb(pBox, e)) {
          if (e.type === 'armor' && (p.vx > 0 ? e.dir === -1 : e.dir === 1)) {
            // Escudo frontal de la armadura bloquea
            sfx('hit');
            spawnParticles(p.x, p.y, '#adb5bd', 6);
            hit = true;
            break;
          }

          e.hp -= p.dmg;
          e.hurtTimer = 12;
          triggerShake(5, 2);
          triggerHitStop(2);
          
          // Empuje por impacto mágico a distancia
          const kbSpell = e.type === 'boss' ? 0.6 : (e.type === 'armor' ? 1.2 : 2.5);
          e.knockbackX = (p.vx > 0 ? 1 : -1) * kbSpell;
          if (e.type !== 'boss') e.vy = -1.4;

          sfx('hit');
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff0055', 10);

          floatingTexts.push({
            text: `-${p.dmg}`,
            x: e.x + e.w / 2 - 4,
            y: e.y - 6,
            vy: -1.3,
            life: 25,
            color: '#ff007f'
          });

          if (e.hp <= 0) {
            if (e.elite) storyProgress.eliteKills++;
            spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ffbe0b', 18);
            const orbCount = e.type === 'boss' ? 20 : (e.type === 'armor' ? 5 : (e.type === 'skeleton' ? 3 : 2));
            for (let k = 0; k < orbCount; k++) {
              essenceOrbs.push({
                x: e.x + e.w / 2, y: e.y + e.h / 2,
                w: 5, h: 5,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3.5 - 1,
                val: 5
              });
            }
            if (Math.random() < (e.type === 'boss' ? 1.0 : 0.35)) {
              heartPickups.push({
                x: e.x + e.w / 2 - 3, y: e.y + e.h / 2 - 3,
                w: 8, h: 8,
                vx: (Math.random() - 0.5) * 2, vy: -2.8,
                heal: 25
              });
            }
            if (e.type === 'boss') defeatBoss(e);
            enemies.splice(j, 1);
          }
          hit = true;
          break;
        }
      }
      if (hit) {
        projectiles.splice(i, 1);
        continue;
      }
    } else {
      // Proyectil enemigo hacia Alaric
      if (aabb(player, { x: p.x - p.r, y: p.y - p.r, w: p.r * 2, h: p.r * 2 })) {
        damagePlayer(15, p.x);
        projectiles.splice(i, 1);
      }
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
    if (pt.life <= 0) particles.splice(i, 1);
  }

  // Física e imán de Orbes de Esencia
  for (let i = essenceOrbs.length - 1; i >= 0; i--) {
    const o = essenceOrbs[i];
    o.vy = Math.min(o.vy + 0.22, 5);
    o.vx *= 0.96;

    // Imán hacia Alaric cuando está cerca
    const dx = (player.x + player.w / 2) - o.x;
    const dy = (player.y + player.h / 2) - o.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 65) {
      o.vx += (dx / dist) * 0.65;
      o.vy += (dy / dist) * 0.65;
    }

    moveWithCollisions(o);

    // Recolectar orbe al tocarlo
    if (aabb(player, o)) {
      player.essence += o.val;
      sfx('orb');
      spawnParticles(o.x, o.y, '#ff0055', 4);
      essenceOrbs.splice(i, 1);
    }
  }

  // Física y recolección de Corazones de Vida
  for (let i = heartPickups.length - 1; i >= 0; i--) {
    const h = heartPickups[i];
    h.vy = Math.min(h.vy + 0.2, 4.5);
    h.vx *= 0.95;

    // Imán hacia Alaric cuando está cerca y no tiene la vida al tope
    const dx = (player.x + player.w / 2) - h.x;
    const dy = (player.y + player.h / 2) - h.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 55) {
      h.vx += (dx / dist) * 0.55;
      h.vy += (dy / dist) * 0.55;
    }

    moveWithCollisions(h);

    if (aabb(player, h)) {
      const healedAmount = h.heal + player.healBonus;
      player.hp = Math.min(player.maxHp, player.hp + healedAmount);
      sfx('heart');
      floatingTexts.push({
        text: `+${healedAmount} HP`,
        x: player.x + player.w / 2 - 8,
        y: player.y - 6,
        vy: -1.0,
        life: 28,
        color: '#00f5d4'
      });
      spawnParticles(h.x + 4, h.y + 4, '#ff0055', 10);
      spawnParticles(h.x + 4, h.y + 4, '#00f5d4', 6);
      heartPickups.splice(i, 1);
    }
  }

  // Actualizar Textos Flotantes de Daño
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy;
    ft.life--;
    if (ft.life <= 0) floatingTexts.splice(i, 1);
  }

  // Actualizar Screen Shake
  if (screenShakeTimer > 0) screenShakeTimer--;
}
