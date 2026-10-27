// =========================================================
// MOTOR DE FÍSICAS, COLISIONES Y PARTÍCULAS (js/entities/physics.js)
// =========================================================

// Consulta el tile en la cuadrícula de la sala actual respetando muros destruidos
function getTileAt(col, row) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return '#';
  const key = `${currentRoomId}_${col}_${row}`;
  if (brokenWalls[key]) return '.';
  const currentRoom = ROOM_DEFS[currentRoomId];
  if (!currentRoom || !currentRoom.map || !currentRoom.map[row]) return '#';
  return currentRoom.map[row][col];
}

// Determina si un tile es sólido para la entidad según sus habilidades
function isSolidTile(ch) {
  if (ch === '#' || ch === '?') return true;
  if (ch === 'B' && (typeof player !== 'undefined' ? player.dashTimer <= 0 : true)) return true;
  if (ch === '*' && (typeof player !== 'undefined' ? player.hasAstralEye : false)) return true;
  return false;
}

// Detección de colisión entre cajas alineadas a los ejes (AABB)
function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Efectos de vibración de pantalla (Screen Shake)
function triggerShake(duration, magnitude) {
  if (typeof gameSettings !== 'undefined' && gameSettings.screenShake === false) return;
  screenShakeTimer = duration;
  shakeMagnitude = magnitude;
}

// Congelamiento momentáneo de frames para impacto visceral (HitStop)
function triggerHitStop(frames = 3) {
  hitStopTimer = frames;
}

// Generación de partículas de sangre carmesí direccionales
function spawnBloodParticles(x, y, dir = 1, count = 10) {
  const bloodColors = ['#ff0055', '#d90429', '#9d0208', '#6a040f', '#ff4d6d'];
  const reducedFlashes = typeof gameSettings !== 'undefined' && gameSettings.flashes === false;
  const visualCount = reducedFlashes ? Math.max(1, Math.ceil(count * 0.4)) : count;
  for (let i = 0; i < visualCount; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: (dir * (Math.random() * 2.8 + 0.8)) + (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3.2 - 0.5,
      life: 20 + Math.random() * 14,
      color: bloodColors[Math.floor(Math.random() * bloodColors.length)]
    });
  }
}

// Generador genérico de partículas
function spawnParticles(x, y, color, count = 8) {
  const reducedFlashes = typeof gameSettings !== 'undefined' && gameSettings.flashes === false;
  const visualCount = reducedFlashes ? Math.max(1, Math.ceil(count * 0.4)) : count;
  for (let i = 0; i < visualCount; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.5) * 3.5 - 0.5,
      life: (reducedFlashes ? 10 : 18) + Math.random() * (reducedFlashes ? 8 : 12),
      color
    });
  }
}

// Movimiento con resolución continua de colisiones en X e Y
function moveWithCollisions(ent, isPlayer = false) {
  if (isPlayer && typeof player !== 'undefined') player.wallDir = 0;

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
          if (isPlayer && typeof player !== 'undefined') player.wallDir = 1;
        } else if (ent.vx < 0) {
          ent.x = (c + 1) * TILE;
          if (isPlayer && typeof player !== 'undefined') player.wallDir = -1;
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
        const dropIgnore = isPlayer && typeof player !== 'undefined' && player.dropThroughTimer > 0;
        if (!dropIgnore && prevBottom <= platTop + 2 && ent.y + ent.h >= platTop) {
          ent.y = platTop - ent.h;
          ent.vy = 0;
          ent.onGround = true;
        }
      }
    }
  }
}

// Ajusta instantáneamente una entidad verticalmente al suelo sólido más cercano
function snapToGround(ent) {
  if (!ent) return;
  const leftCol = Math.floor(ent.x / TILE);
  const rightCol = Math.floor((ent.x + ent.w - 0.01) / TILE);
  const startRow = Math.max(0, Math.floor(ent.y / TILE));

  for (let r = startRow; r < ROWS; r++) {
    for (let c = leftCol; c <= rightCol; c++) {
      const ch = getTileAt(c, r);
      if (isSolidTile(ch) || ch === '=') {
        const floorY = r * TILE;
        ent.y = floorY - ent.h;
        ent.vy = 0;
        ent.onGround = true;
        return;
      }
    }
  }
}

// Aplica daño, invulnerabilidad y empuje al jugador Alaric
function damagePlayer(amount, sourceX) {
  if (player.invulnTimer > 0 || player.dashTimer > 0) return;
  const difficultyMultiplier = (typeof gameSettings !== 'undefined' && gameSettings.difficulty === 'story') ? 0.7 : ((typeof gameSettings !== 'undefined' && gameSettings.difficulty === 'nightmare') ? 1.3 : 1);
  const wardReduction = (player.equippedAmulets || []).includes('star_ward') ? 0.10 : 0;
  const reduction = Math.min(0.75, (player.damageReduction || 0) + wardReduction);
  const finalDmg = Math.max(1, Math.round(amount * difficultyMultiplier * (1 - reduction)));
  player.hp = Math.max(0, player.hp - finalDmg);
  player.invulnTimer = 45;
  player.vy = -3.2;
  player.vx = (player.x + player.w / 2 < sourceX) ? -3.5 : 3.5;
  triggerShake(12, 3.5);
  sfx('hit');
  spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#e63946', 12);

  if (player.hp <= 0) {
    respawnAtLastAltar();
  }
}

