// =========================================================
// SPRITES Y ANIMACIONES DE ALARIC (js/sprites/player.js)
// =========================================================

// Datos y paletas de las Capas Cosméticas desbloqueables por Sello
const CAPES_DATA = {
  carmesi: {
    id: 'carmesi',
    name: 'Capa Carmesí',
    fullName: 'Capa Carmesí de Cazador',
    sealReq: null,
    desc: 'El manto rojo sangre tradicional de los cazadores de Véspera.',
    palette: {
      'C': '#9b002c', // Capa carmesí oscura
      'R': '#d90429', // Capa carmesí iluminada
      'E': '#ff0055'  // Ojo carmesí brillante
    },
    trailColor: 'rgba(217, 4, 41, 0.4)'
  },
  juramento: {
    id: 'juramento',
    name: 'Capa del Juramento',
    fullName: 'Manto Verde Musgo del Juramento',
    sealReq: 'juramento',
    desc: 'Tejida con líquenes antiguos y musgo de las catacumbas sagradas.',
    palette: {
      'C': '#1b4332', // Verde musgo umbrío
      'R': '#40916c', // Verde jade iluminado
      'E': '#52b788'  // Ojo esmeralda
    },
    trailColor: 'rgba(64, 145, 108, 0.45)'
  },
  reloj: {
    id: 'reloj',
    name: 'Capa del Reloj',
    fullName: 'Hábito Áureo del Reloj Eterno',
    sealReq: 'reloj',
    desc: 'Hilos de oro fundido y bronce de los engranajes del tiempo.',
    palette: {
      'C': '#7f5539', // Ámbar bronce profundo
      'R': '#ffbe0b', // Oro reluciente
      'E': '#ffd166'  // Ojo dorado solar
    },
    trailColor: 'rgba(255, 190, 11, 0.45)'
  },
  astral: {
    id: 'astral',
    name: 'Capa Astral',
    fullName: 'Mortaja Cósmica del Vacío Estelar',
    sealReq: 'astral',
    desc: 'Fragmentos de cielo nocturno que titilan con constelaciones vivas.',
    palette: {
      'C': '#0d1b2a', // Azul abismo estelar
      'R': '#3a86ff', // Azul cósmico radiante
      'E': '#7de2ff'  // Ojo celeste astral
    },
    trailColor: 'rgba(58, 134, 255, 0.45)',
    twinklingStars: true
  }
};

function isCapeUnlocked(capeId) {
  if (capeId === 'carmesi') return true;
  if (!CAPES_DATA[capeId]) return false;
  const seal = CAPES_DATA[capeId].sealReq;
  return !!(typeof seals !== 'undefined' && seals && seals[seal]);
}

function getUnlockedCapes() {
  return Object.keys(CAPES_DATA).filter(id => isCapeUnlocked(id));
}

function cyclePlayerCape() {
  const unlocked = getUnlockedCapes();
  if (unlocked.length <= 1) {
    if (typeof showBanner === 'function') {
      showBanner("🧣 SOLO TIENES LA CAPA CARMESÍ (Restaura sellos para desbloquear más)", 140);
    }
    return;
  }
  const currentIndex = unlocked.indexOf((typeof player !== 'undefined' && player.equippedCape) ? player.equippedCape : 'carmesi');
  const nextIndex = (currentIndex + 1) % unlocked.length;
  player.equippedCape = unlocked[nextIndex];
  if (typeof updateCapeButton === 'function') updateCapeButton();
  if (typeof showBanner === 'function') {
    showBanner(`🧣 Capa Equipada: ${CAPES_DATA[player.equippedCape].fullName}`, 130);
  }
  if (typeof sfx === 'function') sfx('orb');
  if (typeof saveProgress === 'function') saveProgress();
}

// Paleta base de Alaric
const ALARIC_PALETTE = {
  'H': '#e2eafc', // Cabello plateado/blanco estilo gótico
  'S': '#f8edeb', // Piel pálida
  'E': '#ff0055', // Ojo carmesí brillante (anulado dinámicamente según capa)
  'C': '#9b002c', // Capa oscura (anulado dinámicamente según capa)
  'R': '#d90429', // Capa iluminada (anulado dinámicamente según capa)
  'A': '#1f162b', // Gabardina / Armadura negra violácea
  'G': '#7209b7', // Detalles / Cinturón
  'B': '#0b090a'  // Botas oscuras
};

// Frames de Alaric (12x22 píxeles)
const ALARIC_FRAMES = {
  IDLE_0: [
    "....HHHH....",
    "...HHHHHH...",
    "...HSSESH...",
    "...HSSSSH...",
    "....AAAA....",
    "..CCAAAA....",
    ".CCRAAAAG...",
    ".CCRAAAAA...",
    ".CC.GGGG....",
    ".CC.AAAA....",
    ".CC.AAAA....",
    ".C..AAAA....",
    "....BBBB....",
    "....B..B....",
    "....B..B....",
    "...BB..BB..."
  ],
  IDLE_1: [
    "............",
    "....HHHH....",
    "...HHHHHH...",
    "...HSSESH...",
    "...HSSSSH...",
    "..CCAAAA....",
    ".CCRAAAAG...",
    ".CCRAAAAA...",
    ".CC.GGGG....",
    ".CC.AAAA....",
    ".C..AAAA....",
    "....AAAA....",
    "....BBBB....",
    "....B..B....",
    "....B..B....",
    "...BB..BB..."
  ],
  RUN_0: [
    "....HHHH....",
    "...HHHHHH...",
    "...HSSESH...",
    "...HSSSSH...",
    "..CCAAAA....",
    ".CCRAAAAG...",
    "CCRRAAAAA...",
    "CC..GGGG....",
    "....AAAA....",
    "...AA..AA...",
    "..BB....BB..",
    ".BB......BB.",
    "............",
    "............",
    "............",
    "............"
  ],
  RUN_1: [
    "....HHHH....",
    "...HHHHHH...",
    "...HSSESH...",
    "...HSSSSH...",
    "...CAAAA....",
    "..CRAAAAG...",
    "..CRAAAAA...",
    "...CGGGG....",
    "....AAAA....",
    "....BBBB....",
    "...BB..BB...",
    "....B..B....",
    "............",
    "............",
    "............",
    "............"
  ],
  JUMP: [
    "....HHHH....",
    "...HHHHHH...",
    "...HSSESH...",
    "...HSSSSH...",
    "...CAAAA....",
    "..CRAAAAG...",
    ".CCRAAAAA...",
    ".CC.GGGG....",
    ".C..AAAA....",
    "...BB..BB...",
    "..BB....BB..",
    "............",
    "............",
    "............",
    "............",
    "............"
  ]
};

function drawPlayerSprite(ctx, p) {
  if (p.invulnTimer % 4 >= 2) return; // Parpadeo de invulnerabilidad

  const px = Math.round(p.x);
  const py = Math.round(p.y);
  const flip = (p.dir === -1);

  const capeId = p.equippedCape || 'carmesi';
  const capeDef = CAPES_DATA[capeId] || CAPES_DATA['carmesi'];

  // Estela fantasma durante el Dash Sombrío (con el color de la capa equipada)
  if (p.dashTimer > 0) {
    ctx.fillStyle = capeDef.trailColor || 'rgba(157, 78, 221, 0.35)';
    ctx.fillRect(px - p.dir * 10, py + 2, p.w, p.h - 2);
    ctx.fillStyle = 'rgba(199, 125, 255, 0.2)';
    ctx.fillRect(px - p.dir * 20, py + 4, p.w, p.h - 4);
  }

  // Selección de frame según la Máquina de Estados (FSM)
  let matrix = ALARIC_FRAMES.IDLE_0;
  if (p.state === 'IDLE') {
    matrix = (Math.floor(p.animTimer / 18) % 2 === 0) ? ALARIC_FRAMES.IDLE_0 : ALARIC_FRAMES.IDLE_1;
  } else if (p.state === 'RUN') {
    matrix = (Math.floor(p.animTimer / 6) % 2 === 0) ? ALARIC_FRAMES.RUN_0 : ALARIC_FRAMES.RUN_1;
  } else if (p.state === 'JUMP' || p.state === 'FALL' || p.state === 'DASH') {
    matrix = ALARIC_FRAMES.JUMP;
  }

  // Paleta dinámica según la capa equipada
  const activePalette = {
    ...ALARIC_PALETTE,
    ...capeDef.palette
  };

  // Dibujar a Alaric (escala 1x en ancho, ajustado a su hitbox de 12x22)
  drawPixelMatrix(ctx, matrix, activePalette, px, py + 6, flip, 1);

  // Efecto especial: Estrellas cósmicas titilantes en la Capa Astral
  if (capeDef.twinklingStars) {
    const clock = (p.animTimer || 0);
    const starOffsets = [
      { dx: flip ? 9 : 2, dy: 10, speed: 0.14, phase: 0 },
      { dx: flip ? 8 : 3, dy: 14, speed: 0.18, phase: 2 },
      { dx: flip ? 10 : 1, dy: 12, speed: 0.11, phase: 4 }
    ];

    for (const star of starOffsets) {
      const twinkle = (Math.sin(clock * star.speed + star.phase) + 1) / 2;
      if (twinkle > 0.3) {
        const sx = px + star.dx;
        const sy = py + 6 + star.dy;
        const starAlpha = Math.min(1, (twinkle - 0.3) * 1.5);

        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        ctx.fillRect(sx, sy, 1, 1);

        if (twinkle > 0.75) {
          ctx.fillStyle = `rgba(125, 226, 255, ${starAlpha * 0.8})`;
          ctx.fillRect(sx - 1, sy, 1, 1);
          ctx.fillRect(sx + 1, sy, 1, 1);
          ctx.fillRect(sx, sy - 1, 1, 1);
          ctx.fillRect(sx, sy + 1, 1, 1);
        }
      }
    }

    if ((p.state === 'RUN' || p.state === 'DASH') && Math.random() < 0.25 && typeof particles !== 'undefined') {
      particles.push({
        x: px + (flip ? 9 : 2) + (Math.random() - 0.5) * 3,
        y: py + 16 + Math.random() * 4,
        vx: (flip ? 0.8 : -0.8) + (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.6 - 0.2,
        life: 14 + Math.random() * 8,
        color: ['#7de2ff', '#ffffff', '#a0c4ff', '#e0aaff'][Math.floor(Math.random() * 4)]
      });
    }
  }

  // =========================================================================
  // TAJO DE ESPADA VISCERAL (Slash Arc & Pogo Burst con Estela Carmesí/Plata)
  // =========================================================================
  if (p.attackTimer > 0) {
    const progress = (12 - p.attackTimer) / 12; // 0.0 a 1.0
    const alpha = Math.max(0.15, 1 - progress * 0.82);
    const reach = p.attackReach || 0;

    ctx.save();
    if (p.attackDir === 'down') {
      // --- TAJO HACIA ABAJO (Pogo Down-Slash) ---
      const cx = px + 6, cy = py + 15;
      const r = 18 + reach * 0.5;
      const startAngle = 0.15 + progress * 0.15;
      const endAngle = Math.PI - 0.15 - progress * 0.15;

      // 1. Estela de halo carmesí exterior
      ctx.lineWidth = 6;
      ctx.strokeStyle = `rgba(180, 0, 50, ${alpha * 0.45})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 2, startAngle, endAngle);
      ctx.stroke();

      // 2. Arco cortante carmesí vivo
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = `rgba(255, 0, 85, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.stroke();

      // 3. Filo interior blanco puro luminoso
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1.5, startAngle + 0.1, endAngle - 0.1);
      ctx.stroke();

      // 4. Hoja penetrando hacia abajo desde el guardamanos
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(cx, py + 14);
      ctx.lineTo(cx, py + 33 + reach * 0.4);
      ctx.stroke();

      // 5. Destello de impacto en la punta durante la fase inicial
      if (progress < 0.5) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 2, py + 31 + reach * 0.4, 4, 4);
        ctx.fillStyle = '#ffbe0b';
        ctx.fillRect(cx - 4, py + 32 + reach * 0.4, 8, 2);
      }
    } else {
      // --- TAJO FRONTAL (Wide Crescent Slash) ---
      const cx = px + (flip ? 4 : 8), cy = py + 11;
      const r = 24 + reach;
      const startAngle = flip ? (Math.PI * 1.45 - progress * 0.3) : (-Math.PI * 0.45 + progress * 0.3);
      const endAngle = flip ? (Math.PI * 0.65 - progress * 0.4) : (Math.PI * 0.35 + progress * 0.4);

      // 1. Halo difuminado de energía carmesí exterior
      ctx.lineWidth = 7;
      ctx.strokeStyle = `rgba(180, 0, 50, ${alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 2.5, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle));
      ctx.stroke();

      // 2. Arco cortante carmesí vivo
      ctx.lineWidth = 3.8;
      ctx.strokeStyle = `rgba(255, 0, 85, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle));
      ctx.stroke();

      // 3. Filo interior blanco puro luminoso
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1.5, Math.min(startAngle, endAngle) + 0.1, Math.max(startAngle, endAngle) - 0.1);
      ctx.stroke();

      // 4. Hoja metálica extendida desde la empuñadura hasta la punta
      const currentTipAngle = startAngle + (endAngle - startAngle) * progress;
      const tipX = cx + Math.cos(currentTipAngle) * (r + 1);
      const tipY = cy + Math.sin(currentTipAngle) * (r + 1);
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // 5. Destello en cruz de acero en la punta
      if (progress < 0.55) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.round(tipX - 2), Math.round(tipY - 2), 4, 4);
        ctx.fillStyle = '#ffbe0b';
        ctx.fillRect(Math.round(tipX - 4), Math.round(tipY - 1), 8, 2);
        ctx.fillRect(Math.round(tipX - 1), Math.round(tipY - 4), 2, 8);
      }
    }
    ctx.restore();
  }
}
