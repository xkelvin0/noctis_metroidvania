// =========================================================
// SPRITES Y ANIMACIONES DE ALARIC (js/sprites/player.js)
// =========================================================

// Paleta gótica de Alaric (Cazador Gótico con Capa Carmesí)
const ALARIC_PALETTE = {
  'H': '#e2eafc', // Cabello plateado/blanco estilo gótico
  'S': '#f8edeb', // Piel pálida
  'E': '#ff0055', // Ojo carmesí brillante
  'C': '#9b002c', // Capa carmesí oscura
  'R': '#d90429', // Capa carmesí iluminada
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

  // Estela fantasma durante el Dash Sombrío
  if (p.dashTimer > 0) {
    ctx.fillStyle = 'rgba(157, 78, 221, 0.35)';
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

  // Dibujar a Alaric (escala 1x en ancho, ajustado a su hitbox de 12x22)
  drawPixelMatrix(ctx, matrix, ALARIC_PALETTE, px, py + 6, flip, 1);

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
