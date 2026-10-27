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

  // Animación de Tajo de Espada / Látigo Carmesí en Arco (Frontal o Hacia Abajo)
  if (p.attackTimer > 0) {
    const progress = (12 - p.attackTimer) / 12; // 0.0 a 1.0

    ctx.save();
    if (p.attackDir === 'down') {
      // Tajo hacia abajo (Pogo Down-Slash)
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px + 6, py + 18, 16, 0.2 + progress * 0.4, Math.PI - 0.2 - progress * 0.4);
      ctx.stroke();

      // Filo vertical brillante
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px + 6, py + 16);
      ctx.lineTo(px + 6, py + 30);
      ctx.stroke();
    } else {
      // Tajo frontal tradicional
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (p.dir === 1) {
        ctx.arc(px + 8, py + 11, 22, -0.8 + progress * 0.5, 0.7 + progress * 0.4);
      } else {
        ctx.arc(px + 4, py + 11, 22, Math.PI - 0.7 - progress * 0.4, Math.PI + 0.8 - progress * 0.5);
      }
      ctx.stroke();

      // Filo interior blanco brillante
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px + (p.dir === 1 ? 10 : 2), py + 11);
      ctx.lineTo(px + (p.dir === 1 ? 32 : -20), py + 9 + Math.sin(progress * Math.PI) * 5);
      ctx.stroke();
    }
    ctx.restore();
  }
}

