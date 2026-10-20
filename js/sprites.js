// =========================================================
// MOTOR DE SPRITES PIXEL ART Y ANIMACIONES (js/sprites.js)
// =========================================================

// Carga de imágenes pixel art reales de alta definición retro
const ambientSkylineImage = new Image();
ambientSkylineImage.src = 'images/ambient_skyline.jpg';
let ambientSkylineLoaded = false;
ambientSkylineImage.onload = () => { ambientSkylineLoaded = true; };

const villageSheetImage = new Image();
villageSheetImage.src = 'images/village_sheet.jpg';
let villageSheetLoaded = false;
villageSheetImage.onload = () => { villageSheetLoaded = true; };

const villageDecorImage = new Image();
villageDecorImage.src = 'images/village_decor.jpg';
let villageDecorLoaded = false;
villageDecorImage.onload = () => { villageDecorLoaded = true; };

const villageFrontHousesImage = new Image();
villageFrontHousesImage.src = 'images/village_front_houses.jpg';
let villageFrontHousesLoaded = false;
villageFrontHousesImage.onload = () => { villageFrontHousesLoaded = true; };

const villageMilitaryBuildingsImage = new Image();
villageMilitaryBuildingsImage.src = 'images/village_military_buildings.jpg';
let villageMilitaryBuildingsLoaded = false;
villageMilitaryBuildingsImage.onload = () => { villageMilitaryBuildingsLoaded = true; };

const dungeonTilesetImage = new Image();
dungeonTilesetImage.src = 'images/dungeon_tileset.jpg';
let dungeonTilesetLoaded = false;
dungeonTilesetImage.onload = () => { dungeonTilesetLoaded = true; };

const zoneBackgrounds = {
  carmesi: new Image(),
  catacumbas: new Image(),
  observatorio: new Image(),
  jardines: new Image()
};
zoneBackgrounds.carmesi.src = 'images/fortress_carmesi_bg.png';
zoneBackgrounds.catacumbas.src = 'images/catacumbas_bg.png';
zoneBackgrounds.observatorio.src = 'images/observatorio_bg.png';
zoneBackgrounds.jardines.src = 'images/jardines_reloj_bg.png';

// Canvas temporal fuera de pantalla para recortar sprites sin fondo negro (Chroma key transparente)
const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');
const spriteCache = {};

function getCachedTransparentSprite(img, sx, sy, sw, sh, key) {
  if (spriteCache[key]) return spriteCache[key];
  if (!img.complete || img.naturalWidth === 0) return null;

  offCanvas.width = sw;
  offCanvas.height = sh;
  offCtx.clearRect(0, 0, sw, sh);
  offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  const imgData = offCtx.getImageData(0, 0, sw, sh);
  const data = imgData.data;
  // Convertir negro puro/casi negro en transparente
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r < 18 && g < 18 && b < 18) {
      data[i + 3] = 0; // Transparente
    }
  }
  offCtx.putImageData(imgData, 0, 0);

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = sw;
  finalCanvas.height = sh;
  finalCanvas.getContext('2d').drawImage(offCanvas, 0, 0);
  spriteCache[key] = finalCanvas;
  return finalCanvas;
}

// Función auxiliar para dibujar matrices de píxeles con soporte de volteo horizontal (flipX)
function drawPixelMatrix(ctx, matrix, palette, x, y, flipX = false, scale = 1) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let r = 0; r < rows; r++) {
    const rowStr = matrix[r];
    for (let c = 0; c < cols; c++) {
      const ch = rowStr[c];
      if (ch !== '.' && palette[ch]) {
        ctx.fillStyle = palette[ch];
        const drawCol = flipX ? (cols - 1 - c) : c;
        ctx.fillRect(Math.round(x + drawCol * scale), Math.round(y + r * scale), scale, scale);
      }
    }
  }
}

// =========================================================
// 1. SPRITE DE ALARIC (Cazador Gótico con Capa Carmesí)
// =========================================================
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

// =========================================================
// 2. SPRITES DEL BESTIARIO (Esqueleto, Murciélago, Armadura y Jefe)
// =========================================================
function drawEnemySprite(ctx, e, animClock) {
  const ex = Math.round(e.x);
  const ey = Math.round(e.y);
  const isHurt = (e.hurtTimer > 0 && e.hurtTimer % 2 === 0);

  if (e.type === 'citizen') {
    const sName = (e.name || '').toLowerCase();
    const isGuard = e.isGuard || sName.includes('guardia') || sName.includes('centinela') || 
      sName.includes('capitán') || sName.includes('vigía') || sName.includes('paladín') || 
      sName.includes('ballestero') || sName.includes('sargento');
    const isCleric = sName.includes('sacerdot') || sName.includes('monja') || sName.includes('clérigo') || sName.includes('hermano');
    const isScholar = sName.includes('erudito') || sName.includes('astrónomo') || sName.includes('alquimista') || sName.includes('corvus');
    const isChild = sName.includes('niña') || sName.includes('niño') || sName.includes('lía');

    const step = Math.floor(animClock / 8) % 2;

    if (isGuard) {
      // ==========================================
      // GUARDIA DE VÉSPERA / CENTINELA ACORAZADO
      // ==========================================
      // Capa roja tras la armadura
      ctx.fillStyle = '#7a001a';
      ctx.fillRect(ex + (e.dir === 1 ? 1 : 10), ey + 6, 3, 14);

      // Yelmo de Acero (Sallet con visera)
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(ex + 3, ey + 1, 8, 7);
      ctx.fillStyle = '#495057';
      ctx.fillRect(ex + 4, ey + 4, 6, 2); // Ranura de la visera
      // Penacho o Cresta Carmesí de la guardia
      ctx.fillStyle = '#d90429';
      ctx.fillRect(ex + 5, ey - 3, 4, 4);
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(ex + 6, ey - 1, 2, 2);

      // Placas de Acero del Torso y Hombreras
      ctx.fillStyle = '#ced4da';
      ctx.fillRect(ex + 2, ey + 8, 10, 8);
      // Tabardo heráldico carmesí con cruz de oro
      ctx.fillStyle = '#9d0208';
      ctx.fillRect(ex + 5, ey + 8, 4, 8);
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(ex + 6, ey + 10, 2, 4);

      // Escudo Heráldico de la Ciudadela en el flanco
      const shieldX = e.dir === 1 ? ex : ex + 9;
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(shieldX, ey + 7, 5, 11);
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(shieldX + 1, ey + 8, 3, 9);
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(shieldX + 2, ey + 10, 1, 5);

      // Piernas con grebas de hierro
      ctx.fillStyle = '#495057';
      ctx.fillRect(ex + 3 + (isGuard ? 0 : step), ey + 16, 3, 6);
      ctx.fillRect(ex + 8 - (isGuard ? 0 : step), ey + 16, 3, 6);

      // Gran Alabarda / Pica de Guardia en mano
      const halberdX = e.dir === 1 ? ex + 12 : ex - 1;
      // Asta de madera oscura
      ctx.fillStyle = '#3a2618';
      ctx.fillRect(halberdX, ey - 7, 2, 29);
      // Cuchilla de acero reluciente y punta de lanza
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(halberdX - 2, ey - 7, 6, 4);
      ctx.fillRect(halberdX, ey - 11, 2, 5);
      ctx.fillStyle = '#ffd166'; // Virola dorada
      ctx.fillRect(halberdX - 1, ey - 3, 4, 2);

    } else if (isCleric) {
      // Sacerdotes y Monjas con hábitos ceremoniales
      ctx.fillStyle = '#f4f1de'; // Hábito blanco marfil o indigo
      ctx.fillRect(ex + 2, ey + 6, 8, 14);
      ctx.fillStyle = '#3d405b'; // Capucha
      ctx.fillRect(ex + 3, ey + 1, 6, 6);
      ctx.fillStyle = '#f5cac3'; // Rostro
      ctx.fillRect(ex + (e.dir === 1 ? 5 : 3), ey + 3, 4, 3);
      // Cruz de oro en el pecho
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(ex + 5, ey + 9, 2, 4);
      ctx.fillRect(ex + 4, ey + 10, 4, 1);
      // Sandalias
      ctx.fillStyle = '#3a2618';
      ctx.fillRect(ex + 3 + step, ey + 19, 3, 3);
      ctx.fillRect(ex + 7 - step, ey + 19, 3, 3);

    } else if (isScholar) {
      // Erudito / Astrónomo con túnica astral violeta
      ctx.fillStyle = '#3c096c';
      ctx.fillRect(ex + 2, ey + 6, 8, 14);
      ctx.fillStyle = '#5a189a';
      ctx.fillRect(ex + 3, ey + 1, 6, 5);
      ctx.fillStyle = '#f5cac3';
      ctx.fillRect(ex + (e.dir === 1 ? 5 : 3), ey + 3, 4, 3);
      // Runas estelares bordadas
      ctx.fillStyle = '#7de2ff';
      ctx.fillRect(ex + 4, ey + 9, 2, 2);
      ctx.fillRect(ex + 6, ey + 13, 2, 2);
      ctx.fillStyle = '#240046';
      ctx.fillRect(ex + 3 + step, ey + 18, 3, 4);
      ctx.fillRect(ex + 7 - step, ey + 18, 3, 4);

    } else if (isChild) {
      // Niña pequeña con bufanda y estatura menor
      ctx.fillStyle = '#9c6644'; // Cabello castaño
      ctx.fillRect(ex + 4, ey + 7, 5, 4);
      ctx.fillStyle = '#f5cac3';
      ctx.fillRect(ex + (e.dir === 1 ? 5 : 3), ey + 8, 4, 3);
      ctx.fillStyle = '#d90429'; // Bufanda roja
      ctx.fillRect(ex + 3, ey + 11, 7, 3);
      ctx.fillStyle = '#ddb892'; // Vestido
      ctx.fillRect(ex + 3, ey + 14, 6, 6);
      ctx.fillStyle = '#7f5539';
      ctx.fillRect(ex + 3 + step, ey + 19, 2, 3);
      ctx.fillRect(ex + 6 - step, ey + 19, 2, 3);

    } else {
      // Aldeano / Ciudadano común con ropajes variados
      ctx.fillStyle = '#4a3b32';
      ctx.fillRect(ex + 3, ey + 2, 6, 5);
      ctx.fillStyle = '#f5cac3';
      ctx.fillRect(ex + (e.dir === 1 ? 5 : 3), ey + 4, 4, 4);
      ctx.fillStyle = sName.includes('greta') ? '#a23e48' : '#2f3e46';
      ctx.fillRect(ex + 2, ey + 7, 8, 9);
      ctx.fillStyle = sName.includes('greta') ? '#f1faee' : '#84a98c';
      ctx.fillRect(ex + 3, ey + 9, 6, 5);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(ex + 2 + step, ey + 16, 3, 6);
      ctx.fillRect(ex + 7 - step, ey + 16, 3, 6);
    }

    // Pequeño indicador luminoso superior para personajes interactivos
    ctx.fillStyle = isGuard ? '#ff0055' : 'rgba(255, 190, 11, 0.8)';
    ctx.fillRect(ex + 5, ey - 2, 2, 2);
    return;
  }

  if (e.type === 'skeleton') {
    // Esqueleto Lancero
    const boneColor = isHurt ? '#ffffff' : (e.attackTelegraph > 0 ? '#ffbe0b' : '#e0d8e8');
    ctx.fillStyle = boneColor;
    // Cráneo
    ctx.fillRect(ex + 3, ey, 8, 7);
    ctx.fillStyle = '#0c0814';
    ctx.fillRect(ex + (e.dir === 1 ? 7 : 4), ey + 2, 2, 2); // Cuenca ocular
    // Costillas y columna
    ctx.fillStyle = boneColor;
    ctx.fillRect(ex + 6, ey + 7, 2, 8);
    ctx.fillRect(ex + 3, ey + 8, 8, 2);
    ctx.fillRect(ex + 4, ey + 11, 6, 2);
    // Piernas animadas al caminar
    const step = Math.floor(animClock / 8) % 2;
    ctx.fillRect(ex + 3 + step, ey + 15, 2, 7);
    ctx.fillRect(ex + 9 - step, ey + 15, 2, 7);
    // Lanza larga
    ctx.fillStyle = e.lungeTimer > 0 ? '#ff0055' : '#adb5bd';
    const spearX = e.dir === 1 ? ex + 4 : ex - 10;
    ctx.fillRect(spearX, ey + 10, 20, 2);
  }

  else if (e.type === 'bat') {
    // Murciélago Vesperal con aleteo
    const flap = Math.floor(animClock / 5) % 2 === 0;
    ctx.fillStyle = isHurt ? '#ffffff' : '#7209b7';
    // Cuerpo central
    ctx.fillRect(ex + 5, ey + 3, 4, 6);
    // Alas extendidas arriba o abajo
    ctx.fillStyle = isHurt ? '#ffffff' : '#9d4edd';
    if (flap) {
      ctx.fillRect(ex, ey, 5, 4);
      ctx.fillRect(ex + 9, ey, 5, 4);
    } else {
      ctx.fillRect(ex, ey + 6, 5, 4);
      ctx.fillRect(ex + 9, ey + 6, 5, 4);
    }
    // Ojos rojos brillantes
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(ex + 5, ey + 4, 1, 1);
    ctx.fillRect(ex + 8, ey + 4, 1, 1);
  }

  else if (e.type === 'armor') {
    // Armadura Espectral Acorazada
    ctx.fillStyle = isHurt ? '#ffffff' : '#343a40';
    ctx.fillRect(ex + 2, ey + 4, e.w - 4, e.h - 4);
    // Yelmo con penacho carmesí
    ctx.fillStyle = '#d90429';
    ctx.fillRect(ex + 6, ey, 6, 4);
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(ex + 4, ey + 3, 10, 6);
    // Ojos espectrales celestes
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(ex + (e.dir === 1 ? 10 : 5), ey + 5, 3, 2);
    // Gran Escudo Frontal
    ctx.fillStyle = '#00bbf9';
    const sx = e.dir === 1 ? ex + e.w - 3 : ex - 1;
    ctx.fillRect(sx, ey + 4, 4, e.h - 6);
    ctx.fillStyle = '#e0fbfc';
    ctx.fillRect(sx + 1, ey + 6, 2, e.h - 10);
  }

  else if (e.type === 'archer' || e.type === 'bomber' || e.type === 'summoner' || e.type === 'shield') {
    const palette = { archer: '#80ed99', bomber: '#ff5400', summoner: '#c77dff', shield: '#00bbf9' };
    ctx.fillStyle = isHurt ? '#ffffff' : palette[e.type];
    ctx.fillRect(ex + 3, ey + 3, e.w - 6, e.h - 3);
    ctx.fillStyle = '#1f162b';
    ctx.fillRect(ex + 5, ey + 6, e.w - 10, 3);
    if (e.type === 'archer') ctx.fillRect(e.dir === 1 ? ex + 11 : ex - 5, ey + 9, 10, 2);
    if (e.type === 'bomber') { ctx.fillStyle = '#ffbe0b'; ctx.fillRect(ex + 7, ey, 3, 4); }
    if (e.type === 'summoner') { ctx.fillStyle = '#ffccd5'; ctx.fillRect(ex + 6, ey - 2, 4, 4); }
    if (e.type === 'shield') { ctx.fillStyle = '#e0fbfc'; ctx.fillRect(e.dir === 1 ? ex + 12 : ex, ey + 5, 4, 13); }
  }

  else if (e.type === 'boss') {
    const floatY = ey + Math.sin(animClock * (e.phase2 ? 0.16 : 0.08)) * (e.phase2 ? 5 : 3);
    
    // FASE 2: Alas espectrales carmesí gigantes
    if (e.phase2) {
      const wingBob = Math.sin(animClock * 0.2) * 4;
      ctx.fillStyle = 'rgba(255, 0, 85, 0.75)';
      // Ala Izquierda
      ctx.beginPath();
      ctx.moveTo(ex + 4, floatY + 12);
      ctx.lineTo(ex - 18, floatY - 8 + wingBob);
      ctx.lineTo(ex - 6, floatY + 22);
      ctx.fill();
      // Ala Derecha
      ctx.beginPath();
      ctx.moveTo(ex + e.w - 4, floatY + 12);
      ctx.lineTo(ex + e.w + 18, floatY - 8 + wingBob);
      ctx.lineTo(ex + e.w + 6, floatY + 22);
      ctx.fill();
    }

    // Manto real exterior (más oscuro e incandescente en Fase 2)
    ctx.fillStyle = isHurt ? '#ffffff' : (e.phase2 ? '#720026' : '#590d22');
    ctx.fillRect(ex, floatY + 6, e.w, e.h - 6);
    // Armadura pectoral oscura
    ctx.fillStyle = isHurt ? '#ffffff' : '#1f162b';
    ctx.fillRect(ex + 4, floatY + 8, e.w - 8, e.h - 12);
    // Cabeza y Corona de Cuernos
    ctx.fillStyle = '#e2eafc';
    ctx.fillRect(ex + 7, floatY + 2, 10, 7);
    ctx.fillStyle = e.phase2 ? '#ff0055' : '#ffbe0b'; // Cuernos carmesí en Fase 2
    ctx.fillRect(ex + 5, floatY - 3, 3, 6);
    ctx.fillRect(ex + 16, floatY - 3, 3, 6);
    // Ojos de fuego (amarillo incandescente en fase 2)
    ctx.fillStyle = e.phase2 ? '#ffbe0b' : '#ff0055';
    ctx.fillRect(ex + (e.dir === 1 ? 13 : 8), floatY + 4, 3, 2);

    // Pilares de Fuego y Barra de Vida del Jefe
    if (e.pattern === 2) {
      for (const px of e.pillars) {
        if (e.phaseTimer > 45) {
          ctx.fillStyle = 'rgba(255, 84, 0, 0.4)';
          ctx.fillRect(px - 6, 216, 12, 8);
        } else if (e.phaseTimer > 25) {
          ctx.fillStyle = '#ff5400';
          ctx.fillRect(px - 8, 80, 16, 144);
          ctx.fillStyle = '#ffbe0b';
          ctx.fillRect(px - 4, 80, 8, 144);
        }
      }
    }
    // Barra de vida inferior del Jefe
    ctx.fillStyle = '#220916';
    ctx.fillRect(120, 245, 240, 8);
    ctx.fillStyle = e.phase2 ? '#ff0055' : '#e63946';
    const hpW = Math.max(0, 240 * (e.hp / e.maxHp));
    ctx.fillRect(120, 245, hpW, 8);
    if (e.phase2) {
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(120, 245, hpW, 2);
    }
    ctx.strokeStyle = e.phase2 ? '#ffbe0b' : '#ffccd5';
    ctx.strokeRect(120, 245, 240, 8);

    // Texto de nombre del Jefe
    ctx.font = '8px monospace';
    ctx.fillStyle = e.phase2 ? '#ffbe0b' : '#ffccd5';
    ctx.textAlign = 'center';
    ctx.fillText(e.phase2 ? `⚡ ${e.name.toUpperCase()} (FASE 2) ⚡` : e.name.toUpperCase(), 240, 240);
    ctx.textAlign = 'left';
  }
}

// =========================================================
// 2.5 SPRITES DEL POBLADO Y ALTARES (Pixel Art Detallado y Transparente)
// =========================================================

// Altar de Guardado Gótico con Monumento de Piedra y Cristal Flotante
function drawSaveAltarSprite(ctx, x, y, animClock) {
  const ax = Math.round(x);
  const ay = Math.round(y);

  if (villageSheetLoaded) {
    const altarSprite = getCachedTransparentSprite(villageSheetImage, 80, 500, 340, 440, 'altar_monument');
    if (altarSprite) {
      ctx.drawImage(altarSprite, ax - 14, ay - 32, 44, 54);
      // Cristal sagrado pulsante
      const bob = Math.sin(animClock * 0.12) * 2.5;
      const pulse = Math.sin(animClock * 0.18) * 0.25 + 0.75;
      ctx.fillStyle = `rgba(255, 190, 11, ${pulse * 0.4})`;
      ctx.beginPath();
      ctx.arc(ax + 8, ay - 8 + bob, 12, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  }

  // Respaldo
  ctx.fillStyle = '#ffbe0b';
  ctx.fillRect(ax + 5, ay - 6, 6, 12);
}

// Puesto / Tienda de Campaña del Mercader Dario
function drawMerchantStallSprite(ctx, x, y, animClock) {
  const mx = Math.round(x);
  const my = Math.round(y);

  if (villageSheetLoaded) {
    const tentSprite = getCachedTransparentSprite(villageSheetImage, 220, 30, 560, 400, 'merchant_tent');
    if (tentSprite) {
      ctx.drawImage(tentSprite, mx - 16, my - 34, 58, 48);
      // Farol parpadeante
      const lanternPulse = Math.sin(animClock * 0.15) * 0.25 + 0.75;
      ctx.fillStyle = `rgba(255, 190, 11, ${lanternPulse * 0.35})`;
      ctx.beginPath();
      ctx.arc(mx + 28, my - 12, 10, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  }

  // Respaldo
  ctx.fillStyle = '#4a2c1d';
  ctx.fillRect(mx - 4, my + 4, 28, 12);
}

// Cabaña / Fachada Frontal de la Taberna de la Villa ('H')
function drawTavernCottageSprite(ctx, x, y, animClock) {
  const hx = Math.round(x);
  const hy = Math.round(y);

  if (villageFrontHousesLoaded) {
    // Recorte de la casa frontal de madera y piedra (x: 10..340, y: 150..815)
    const cottageSprite = getCachedTransparentSprite(villageFrontHousesImage, 12, 150, 328, 665, 'front_tavern_cottage');
    if (cottageSprite) {
      ctx.drawImage(cottageSprite, hx - 16, hy - 72, 60, 86);
      return;
    }
  }

  ctx.fillStyle = '#3b2518';
  ctx.fillRect(hx, hy - 20, 40, 36);
}

// Boticaria / Botica Frontal de 2 Pisos con vitrina de pociones ('A')
function drawApothecaryHouseSprite(ctx, x, y) {
  const ax = Math.round(x);
  const ay = Math.round(y);

  if (villageFrontHousesLoaded) {
    // Recorte de la botica frontal central (x: 350..655, y: 190..815)
    const houseSprite = getCachedTransparentSprite(villageFrontHousesImage, 350, 190, 305, 625, 'front_apothecary_house');
    if (houseSprite) {
      ctx.drawImage(houseSprite, ax - 16, ay - 68, 56, 82);
      return;
    }
  }

  ctx.fillStyle = '#4a3b32';
  ctx.fillRect(ax, ay - 40, 45, 52);
}

// Fragua del Herrero Frontal con hogar de fuego y yunque ('F')
function drawForgeHouseSprite(ctx, x, y, animClock) {
  const fx = Math.round(x);
  const fy = Math.round(y);

  if (villageFrontHousesLoaded) {
    // Recorte de la fragua frontal derecha (x: 660..990, y: 190..815)
    const forgeSprite = getCachedTransparentSprite(villageFrontHousesImage, 660, 190, 330, 625, 'front_blacksmith_forge');
    if (forgeSprite) {
      ctx.drawImage(forgeSprite, fx - 16, fy - 68, 60, 82);
      // Fuego de la fragua parpadeante
      const firePulse = Math.sin(animClock * 0.25) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255, 84, 0, ${firePulse * 0.45})`;
      ctx.beginPath();
      ctx.arc(fx + 3, fy - 10, 8, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  }

  ctx.fillStyle = '#2f243a';
  ctx.fillRect(fx, fy - 35, 45, 48);
}

// NUEVO: Farol de Calle Gótico Iluminado ('L')
function drawStreetLampSprite(ctx, x, y, animClock) {
  const lx = Math.round(x);
  const ly = Math.round(y);

  if (villageDecorLoaded) {
    // Recorte del farol (x: 520..630, y: 520..790)
    const lampSprite = getCachedTransparentSprite(villageDecorImage, 525, 520, 110, 270, 'street_lamp');
    if (lampSprite) {
      ctx.drawImage(lampSprite, lx - 4, ly - 26, 16, 38);
      // Resplandor cálido de la bombilla
      const glow = Math.sin(animClock * 0.15) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255, 190, 11, ${glow * 0.35})`;
      ctx.beginPath();
      ctx.arc(lx + 4, ly - 20, 14, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  }

  ctx.fillStyle = '#ffbe0b';
  ctx.fillRect(lx + 6, ly - 18, 4, 4);
}

// NUEVO: Pozo de Agua de Piedra y Barriles ('W')
function drawWaterWellSprite(ctx, x, y) {
  const wx = Math.round(x);
  const wy = Math.round(y);

  if (villageDecorLoaded) {
    // Recorte del pozo (x: 770..980, y: 580..790)
    const wellSprite = getCachedTransparentSprite(villageDecorImage, 770, 580, 200, 210, 'water_well');
    if (wellSprite) {
      ctx.drawImage(wellSprite, wx - 6, wy - 22, 34, 34);
      return;
    }
  }

  ctx.fillStyle = '#5a5065';
  ctx.fillRect(wx, wy - 10, 20, 18);
}

// =========================================================
// NUEVOS EDIFICIOS GÓTICOS Y MILITARES DE VÉSPERA
// =========================================================

// 1. Torre de Guardia / Atalaya de Vigilancia ('G')
function drawWatchtowerSprite(ctx, x, y, animClock) {
  const gx = Math.round(x);
  const gy = Math.round(y);

  if (villageMilitaryBuildingsLoaded) {
    // Recorte de la Atalaya de piedra gótica con almenas y bandera (sx: 135, sy: 25, sw: 295, sh: 550)
    const towerSprite = getCachedTransparentSprite(villageMilitaryBuildingsImage, 135, 25, 295, 550, 'building_watchtower');
    if (towerSprite) {
      ctx.drawImage(towerSprite, gx - 16, gy - 86, 50, 100);
      return;
    }
  }

  // Respaldo
  ctx.fillStyle = '#2d223a';
  ctx.fillRect(gx - 4, gy - 60, 24, 60);
}

// 2. Capilla Gótica del Alba / Santuario de Piedra ('C')
function drawChapelSprite(ctx, x, y, animClock) {
  const cx = Math.round(x);
  const cy = Math.round(y);

  if (villageMilitaryBuildingsLoaded) {
    // Recorte de la Capilla gótica con campanario y rosetón (sx: 525, sy: 25, sw: 390, sh: 485)
    const chapelSprite = getCachedTransparentSprite(villageMilitaryBuildingsImage, 525, 25, 390, 485, 'building_chapel');
    if (chapelSprite) {
      ctx.drawImage(chapelSprite, cx - 22, cy - 74, 74, 88);
      // Resplandor vivo del rosetón carmesí
      const pulse = Math.sin(animClock * 0.12) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255, 0, 85, ${pulse * 0.35})`;
      ctx.beginPath();
      ctx.arc(cx + 34, cy - 36, 11, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  }

  // Respaldo
  ctx.fillStyle = '#291d38';
  ctx.fillRect(cx - 8, cy - 50, 40, 50);
}

// 3. Puesto Avanzado Militar / Barricada de Centinelas ('P')
function drawGuardPostSprite(ctx, x, y, animClock) {
  const px = Math.round(x);
  const py = Math.round(y);

  if (villageMilitaryBuildingsLoaded) {
    // Recorte del Puesto militar con empalizada, lanzas y antorcha (sx: 35, sy: 605, sw: 460, sh: 355)
    const guardpostSprite = getCachedTransparentSprite(villageMilitaryBuildingsImage, 35, 605, 460, 355, 'building_guardpost');
    if (guardpostSprite) {
      ctx.drawImage(guardpostSprite, px - 20, py - 40, 70, 54);
      // Luz cálida animada de la antorcha de campamento
      const torchGlow = Math.sin(animClock * 0.25) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(255, 140, 0, ${torchGlow * 0.35})`;
      ctx.beginPath();
      ctx.arc(px + 43, py - 20, 12, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  }

  // Respaldo
  ctx.fillStyle = '#4f3322';
  ctx.fillRect(px - 10, py - 24, 40, 24);
}

// 4. Almacén del Gremio / Casona de Suministros ('K')
function drawGuildStorehouseSprite(ctx, x, y) {
  const kx = Math.round(x);
  const ky = Math.round(y);

  if (villageMilitaryBuildingsLoaded) {
    // Recorte de la Casona-Almacén de 2 plantas con polea y barriles (sx: 535, sy: 540, sw: 445, sh: 425)
    const storehouseSprite = getCachedTransparentSprite(villageMilitaryBuildingsImage, 535, 540, 445, 425, 'building_storehouse');
    if (storehouseSprite) {
      ctx.drawImage(storehouseSprite, kx - 18, ky - 52, 68, 66);
      return;
    }
  }

  // Respaldo
  ctx.fillStyle = '#3e2c1e';
  ctx.fillRect(kx - 6, ky - 40, 40, 40);
}

// =========================================================
// 3. DECORACIÓN GÓTICA DE FONDO (Columnas y Arcos)
// =========================================================
function drawGothicBackground(ctx, roomId) {
  // Las zonas seguras de ciudades (-2, -1, 0, 9, 10) comparten el paisaje nocturno de horizonte gótico limpio
  if (roomId === 0 || roomId === -1 || roomId === -2 || roomId === 9 || roomId === 10) {
    if (ambientSkylineLoaded) {
      ctx.drawImage(ambientSkylineImage, 0, 0, W, H);
      // Suave velo nocturno violeta (más azulado en el observatorio 10, más oscuro en el enclave 9)
      const overlayColor = (roomId === 9) 
        ? 'rgba(6, 3, 14, 0.45)' 
        : ((roomId === 10) ? 'rgba(15, 10, 35, 0.20)' : 'rgba(8, 4, 15, 0.25)');
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = '#140e1d';
      ctx.fillRect(0, 0, W, H);
    }
    return;
  }

  const zone = ([11, 12, 18, 19, 20, 28].includes(roomId)) ? 'catacumbas'
    : ([13, 14, 21, 22, 23, 29].includes(roomId)) ? 'observatorio'
    : ([15, 16, 24, 25, 26, 30].includes(roomId)) ? 'jardines'
    : 'carmesi';
  const backdrop = zoneBackgrounds[zone];
  if (backdrop.complete && backdrop.naturalWidth > 0) {
    const scale = Math.max(W / backdrop.naturalWidth, H / backdrop.naturalHeight);
    const drawWidth = backdrop.naturalWidth * scale;
    const drawHeight = backdrop.naturalHeight * scale;
    ctx.drawImage(backdrop, (W - drawWidth) / 2, (H - drawHeight) / 2, drawWidth, drawHeight);
    const veils = {
      carmesi: 'rgba(27, 3, 16, 0.38)',
      catacumbas: 'rgba(2, 20, 24, 0.42)',
      observatorio: 'rgba(8, 14, 42, 0.32)',
      jardines: 'rgba(28, 14, 4, 0.35)'
    };
    ctx.fillStyle = veils[zone];
    ctx.fillRect(0, 0, W, H);
    return;
  }

  ctx.fillStyle = '#140e1d';
  // Dibujar columnas decorativas en los laterales del fondo
  ctx.fillRect(32, 48, 16, 176);
  ctx.fillRect(432, 48, 16, 176);

  // Detalles de arcos góticos superiores
  ctx.strokeStyle = '#221430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(240, 16, 80, 0, Math.PI);
  ctx.stroke();
}

function getRoomPalette(roomId) {
  if ([11, 12, 18, 19, 20, 28].includes(roomId)) return { stone: '#123338', edge: '#2d6565', platform: '#315f61', platformTop: '#79aeb0', spike: '#78b7a2', gate: '#7cc7c1' };
  if ([13, 14, 21, 22, 23, 29].includes(roomId)) return { stone: '#18234a', edge: '#5365a7', platform: '#4856a4', platformTop: '#b3d9ff', spike: '#7de2ff', gate: '#8f7cff' };
  if ([15, 16, 24, 25, 26, 30].includes(roomId)) return { stone: '#343021', edge: '#75623a', platform: '#75613a', platformTop: '#d8b766', spike: '#d6813f', gate: '#c89143' };
  return { stone: '#261427', edge: '#63334f', platform: '#733853', platformTop: '#d87987', spike: '#ef476f', gate: '#b655a2' };
}

const CITY_ROOM_IDS = new Set([-2, -1, 0, 9, 10]);

function isCityRoom(roomId) {
  return CITY_ROOM_IDS.has(Number(roomId));
}

function drawCityFloorSprite(ctx, x, y, depth) {
  if (dungeonTilesetLoaded) {
    const colHash = Math.abs(Math.floor((x / TILE) * 7 + (y / TILE) * 3)) % 4;
    const sx = 600 + (colHash * 68);
    const sy = depth === 0 ? 340 : 400;
    const tileKey = `city_pavement_${colHash}_${depth}`;
    const cachedStone = getCachedTransparentSprite(dungeonTilesetImage, sx, sy, 64, 60, tileKey);
    if (cachedStone) {
      ctx.drawImage(cachedStone, x, y, TILE, TILE);
      // Tono de adoquín gótico nocturno
      ctx.fillStyle = depth === 0 ? 'rgba(38, 30, 48, 0.45)' : 'rgba(18, 14, 25, 0.65)';
      ctx.fillRect(x, y, TILE, TILE);
      if (depth === 0) {
        // Friso de musgo y reborde de acera de piedra
        ctx.fillStyle = '#414833';
        ctx.fillRect(x, y, TILE, 2);
        ctx.fillStyle = '#656d4a';
        ctx.fillRect(x + ((x / TILE) % 2 === 0 ? 3 : 8), y, 5, 1);
      }
      return;
    }
  }

  // Adoquines detallados procedimentales de alta calidad
  const baseColor = depth === 0 ? '#2c243b' : '#1c1626';
  ctx.fillStyle = baseColor;
  ctx.fillRect(x, y, TILE, TILE);

  const stone1W = 7, stone2W = 8;
  ctx.fillStyle = depth === 0 ? '#3d3252' : '#272036';
  ctx.fillRect(x + 1, y + 2, stone1W, 5);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(x + 1, y + 2, stone1W, 1);

  ctx.fillStyle = depth === 0 ? '#352b47' : '#231c30';
  ctx.fillRect(x + stone1W + 2, y + 2, stone2W - 2, 5);

  ctx.fillStyle = depth === 0 ? '#382e4c' : '#251e33';
  ctx.fillRect(x + 2, y + 8, 12, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fillRect(x + 2, y + 8, 12, 1);

  if (depth === 0) {
    ctx.fillStyle = '#4a5335';
    ctx.fillRect(x, y, TILE, 2);
  }
}

function drawDungeonWallSprite(ctx, x, y, palette, edges) {
  // Si está disponible el tileset pixel art de la mazmorra, renderizar con corte de bloques
  if (dungeonTilesetLoaded) {
    const colHash = Math.abs(Math.floor((x / TILE) * 3 + (y / TILE) * 7)) % 4;
    // Variedad de bloques góticos (sx = 600..880, sy = 280..460)
    const sx = 600 + (colHash * 68);
    const sy = 280 + ((Math.floor(y / TILE) % 3) * 60);
    const tileKey = `dungeon_wall_${colHash}_${Math.floor(y / TILE) % 3}`;
    const cachedWall = getCachedTransparentSprite(dungeonTilesetImage, sx, sy, 64, 60, tileKey);
    
    if (cachedWall) {
      ctx.drawImage(cachedWall, x, y, TILE, TILE);
      // Tinte ambiental sutil según el bioma del castillo
      if (palette.stone) {
        ctx.fillStyle = palette.stone;
        ctx.globalAlpha = 0.28;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.globalAlpha = 1.0;
      }
      // Bisel de profundidad en los bordes expuestos
      if (edges.top) {
        ctx.fillStyle = palette.edge || 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(x, y, TILE, 2);
      }
      if (edges.bottom) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(x, y + TILE - 2, TILE, 2);
      }
      if (edges.left) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(x, y, 1, TILE);
      }
      if (edges.right) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(x + TILE - 1, y, 1, TILE);
      }
      return;
    }
  }

  // Renderizado procedimental retro enriquecido
  ctx.fillStyle = palette.stone;
  ctx.fillRect(x, y, TILE, TILE);
  // Bloques de sillar gótico con junturas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x, y + 7, TILE, 1);
  const jointX = ((y / TILE) % 2 === 0) ? 7 : 12;
  ctx.fillRect(x + jointX, y, 1, 7);
  ctx.fillRect(x + (jointX + 8) % 15, y + 8, 1, 8);

  // Relieve de piedra tallada
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(x + 1, y + 1, 5, 1);
  ctx.fillRect(x + 1, y + 9, 6, 1);

  if (edges.top) {
    ctx.fillStyle = palette.edge;
    ctx.fillRect(x, y, TILE, 2);
  }
  if (edges.bottom) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x, y + TILE - 2, TILE, 2);
  }
  if (edges.left) {
    ctx.fillStyle = palette.edge;
    ctx.fillRect(x, y, 1, TILE);
  }
  if (edges.right) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x + TILE - 1, y, 1, TILE);
  }
}

function drawDungeonFloorSprite(ctx, x, y, palette) {
  // Plataformas góticas ornamentadas
  if (dungeonTilesetLoaded) {
    // Recorte de plataforma de piedra gótica con ménsula de hierro (x: 5..490, y: 845..960)
    const platformKey = `dungeon_plat_${(x / TILE) % 2}`;
    const platSlice = getCachedTransparentSprite(dungeonTilesetImage, 10 + (((x / TILE) % 6) * 40), 845, 60, 48, platformKey);
    if (platSlice) {
      ctx.drawImage(platSlice, x, y, TILE, 8);
      ctx.fillStyle = palette.platformTop || '#ffbe0b';
      ctx.globalAlpha = 0.22;
      ctx.fillRect(x, y, TILE, 2);
      ctx.globalAlpha = 1.0;
      return;
    }
  }

  // Respaldo estilizado de plataforma de piedra y borde dorado
  ctx.fillStyle = palette.platform;
  ctx.fillRect(x, y, TILE, 6);
  ctx.fillStyle = palette.platformTop;
  ctx.fillRect(x, y, TILE, 2);
  // Sombra inferior de la losa
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(x, y + 4, TILE, 2);
  // Soporte o ménsula de forja en el centro
  ctx.fillStyle = '#1c1524';
  ctx.fillRect(x + 6, y + 6, 4, 3);
}

// =========================================================
// 4. ATMÓSFERA GÓTICA: CENIZAS CARMESÍ, NIEBLA Y VIÑETA
// =========================================================
const AMBIENT_PARTICLES_COUNT = 36;
const ambientParticles = [];

// Inicializar motas de polvo y cenizas carmesí flotantes
for (let i = 0; i < AMBIENT_PARTICLES_COUNT; i++) {
  ambientParticles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4 - 0.2, // Deriva suave hacia la izquierda
    vy: Math.random() * 0.35 + 0.1,        // Caen lentamente como ceniza
    size: Math.random() < 0.3 ? 2 : 1,
    alpha: Math.random() * 0.4 + 0.2,
    color: Math.random() < 0.4 ? '#ff0055' : (Math.random() < 0.5 ? '#9d4edd' : '#e2eafc')
  });
}

function updateAndDrawFogParticles(ctx, roomId) {
  const zoneParticles = ([11, 12, 18, 19, 20, 28].includes(roomId)) ? ['#7cc7c1', '#b8f2e6']
    : ([13, 14, 21, 22, 23, 29].includes(roomId)) ? ['#7de2ff', '#c7d2fe']
    : ([15, 16, 24, 25, 26, 30].includes(roomId)) ? ['#d6813f', '#d8b766']
    : ['#ff0055', '#c77dff'];
  for (const p of ambientParticles) {
    p.x += p.vx;
    p.y += p.vy;

    // Reposicionar al salir de la pantalla
    if (p.y > H) {
      p.y = -4;
      p.x = Math.random() * W;
    }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.size === 2 ? zoneParticles[0] : zoneParticles[1];
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    ctx.restore();
  }
}

// Viñeta perimetral de oscuridad gótica (Efecto opresivo en los bordes)
function drawGothicVignette(ctx) {
  const gradient = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.65);
  gradient.addColorStop(0, 'rgba(7, 5, 10, 0)');
  gradient.addColorStop(0.7, 'rgba(7, 5, 10, 0.35)');
  gradient.addColorStop(1, 'rgba(4, 2, 7, 0.85)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}


// =========================================================
// RETRATOS DETALLADOS PIXEL ART PARA DIÁLOGOS DE PERSONAJES
// =========================================================
function drawNpcPortrait(ctx, speakerName, px, py, size = 30) {
  const s = speakerName.toLowerCase();
  
  // Marco del retrato
  ctx.fillStyle = '#0a0512';
  ctx.fillRect(px, py, size, size);
  ctx.strokeStyle = '#5a3d72';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);

  // Fondo del retrato según alineación
  let bgGrad = ctx.createLinearGradient(px, py, px, py + size);
  if (s.includes('maría') || s.includes('elena') || s.includes('lyra')) {
    bgGrad.addColorStop(0, '#2d1832');
    bgGrad.addColorStop(1, '#120816');
  } else if (s.includes('greta') || s.includes('boros') || s.includes('dario')) {
    bgGrad.addColorStop(0, '#362016');
    bgGrad.addColorStop(1, '#150c07');
  } else if (s.includes('corvus') || s.includes('erudito') || s.includes('alquimista')) {
    bgGrad.addColorStop(0, '#162838');
    bgGrad.addColorStop(1, '#08121a');
  } else if (s.includes('vane') || s.includes('guardia') || s.includes('escudero')) {
    bgGrad.addColorStop(0, '#242a38');
    bgGrad.addColorStop(1, '#0e121a');
  } else {
    bgGrad.addColorStop(0, '#281c3c');
    bgGrad.addColorStop(1, '#0e0817');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(px + 1, py + 1, size - 2, size - 2);

  // Cara base
  ctx.fillStyle = '#f5cac3';
  ctx.fillRect(px + 9, py + 10, 12, 12);
  // Cuello
  ctx.fillStyle = '#e0a899';
  ctx.fillRect(px + 12, py + 22, 6, 4);

  if (s.includes('maría')) {
    // Aldeana María: Pañuelo carmesí rústico y cabello castaño
    ctx.fillStyle = '#6f1d1b';
    ctx.fillRect(px + 7, py + 5, 16, 7); // Pañuelo
    ctx.fillRect(px + 6, py + 11, 4, 11);
    ctx.fillRect(px + 20, py + 11, 4, 11);
    ctx.fillStyle = '#ffe6a7';
    ctx.fillRect(px + 8, py + 11, 14, 2); // Broche
    // Ojos y boca
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#c9184a';
    ctx.fillRect(px + 13, py + 19, 4, 1);
    // Vestido
    ctx.fillStyle = '#43281c';
    ctx.fillRect(px + 7, py + 25, 16, 5);
  } else if (s.includes('greta')) {
    // Posadera Greta: Cofia blanca de taberna y delantal
    ctx.fillStyle = '#f4f1de';
    ctx.fillRect(px + 8, py + 5, 14, 6); // Cofia
    ctx.fillStyle = '#7f4f24';
    ctx.fillRect(px + 6, py + 10, 4, 9); // Pelo rizado castaño
    ctx.fillRect(px + 20, py + 10, 4, 9);
    // Rostro alegre
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#9c6644';
    ctx.fillRect(px + 13, py + 18, 4, 2);
    // Vestimenta
    ctx.fillStyle = '#582f0e';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  } else if (s.includes('boros')) {
    // Herrero Boros: Cinta de forja, barba espesa y cicatriz
    ctx.fillStyle = '#2b2d42';
    ctx.fillRect(px + 7, py + 6, 16, 4); // Pelo rapado oscuro
    ctx.fillStyle = '#8d0801';
    ctx.fillRect(px + 6, py + 9, 18, 3); // Cinta de sudor roja
    // Ojos decididos
    ctx.fillStyle = '#000000';
    ctx.fillRect(px + 11, py + 13, 3, 2);
    ctx.fillRect(px + 17, py + 13, 3, 2);
    // Barba espesa de herrero
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(px + 8, py + 17, 14, 8);
    // Peto de cuero quemado
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(px + 5, py + 24, 20, 6);
  } else if (s.includes('dario')) {
    // Mercader Dario el Tuerto: Parche de cuero y capucha
    ctx.fillStyle = '#2d1e2f';
    ctx.fillRect(px + 6, py + 5, 18, 7); // Capucha
    ctx.fillStyle = '#111111';
    ctx.fillRect(px + 10, py + 13, 4, 3); // Parche en ojo izquierdo
    ctx.fillRect(px + 7, py + 11, 10, 1); // Tira de parche
    // Ojo sano astuto
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(px + 17, py + 13, 2, 2);
    // Bigote fino
    ctx.fillStyle = '#33272a';
    ctx.fillRect(px + 12, py + 18, 6, 2);
    // Cuello de pieles
    ctx.fillStyle = '#5c4d3c';
    ctx.fillRect(px + 5, py + 24, 20, 6);
  } else if (s.includes('corvus')) {
    // Astrónomo Mayor Corvus: Capucha mística azul con tiara astral
    ctx.fillStyle = '#1d3557';
    ctx.fillRect(px + 6, py + 5, 18, 7);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(px + 13, py + 6, 4, 3); // Símbolo astral
    // Ojos celestes iluminados
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    // Barba canosa
    ctx.fillStyle = '#ced4da';
    ctx.fillRect(px + 11, py + 18, 8, 7);
    ctx.fillStyle = '#14213d';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  } else if (s.includes('vane') || s.includes('guardia') || s.includes('centinela') || s.includes('vigía') || s.includes('capitán') || s.includes('ballestero') || s.includes('sargento') || s.includes('paladín')) {
    // Capitán / Guardia / Centinela: Casco de hierro con visera, cresta roja y armadura
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(px + 7, py + 4, 16, 9); // Yelmo de acero
    ctx.fillStyle = '#adb5bd';
    ctx.fillRect(px + 8, py + 5, 14, 2); // Reflejo metálico
    ctx.fillStyle = '#d90429';
    ctx.fillRect(px + 12, py + 1, 6, 3); // Penacho rojo
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 10, py + 10, 10, 2); // Ranura de visera
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(px + 12, py + 10, 2, 1); // Ojo iluminado
    // Hombrera de armadura y tabardo
    ctx.fillStyle = '#495057';
    ctx.fillRect(px + 5, py + 23, 20, 7);
    ctx.fillStyle = '#9d0208';
    ctx.fillRect(px + 12, py + 23, 6, 7); // Tabardo carmesí
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(px + 14, py + 25, 2, 3);
  } else if (s.includes('anselmo') || s.includes('silas')) {
    // Sacerdote / Monje: Hábito con capucha y cruz dorada
    ctx.fillStyle = '#3d405b';
    ctx.fillRect(px + 6, py + 5, 18, 8); // Capucha
    ctx.fillStyle = '#f5cac3';
    ctx.fillRect(px + 9, py + 10, 12, 10); // Rostro sereno
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 13, 2, 2);
    ctx.fillRect(px + 17, py + 13, 2, 2);
    ctx.fillStyle = '#f4f1de';
    ctx.fillRect(px + 5, py + 23, 20, 7); // Manto
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(px + 14, py + 24, 2, 5); // Cruz de oro
    ctx.fillRect(px + 12, py + 25, 6, 2);
  } else if (s.includes('lía') || s.includes('niña')) {
    // Niña Huérfana Lía: Cabello castaño y bufanda carmesí
    ctx.fillStyle = '#9c6644';
    ctx.fillRect(px + 8, py + 6, 14, 8);
    ctx.fillStyle = '#f5cac3';
    ctx.fillRect(px + 10, py + 11, 10, 9);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#d90429';
    ctx.fillRect(px + 8, py + 20, 14, 5); // Bufanda roja
    ctx.fillStyle = '#ddb892';
    ctx.fillRect(px + 7, py + 25, 16, 5);
  } else if (s.includes('elena') || s.includes('lyra')) {
    // Boticaria / Sacerdotisa: Velo violeta y colgante de hierbas
    ctx.fillStyle = '#4a154b';
    ctx.fillRect(px + 7, py + 5, 16, 7);
    ctx.fillRect(px + 6, py + 12, 4, 12);
    ctx.fillRect(px + 20, py + 12, 4, 12);
    // Ojos esmeralda
    ctx.fillStyle = '#52b788';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#d8bbff';
    ctx.fillRect(px + 13, py + 21, 4, 4); // Amuleto
    ctx.fillStyle = '#31103f';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  } else {
    // Erudito / Viajero genérico de Véspera: Capucha oscura de viajero
    ctx.fillStyle = '#343a40';
    ctx.fillRect(px + 6, py + 5, 18, 7);
    ctx.fillRect(px + 6, py + 11, 4, 12);
    ctx.fillRect(px + 20, py + 11, 4, 12);
    ctx.fillStyle = '#212529';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#1b263b';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  }

  // Brillo exterior dorado del marco
  ctx.strokeStyle = 'rgba(255, 190, 11, 0.4)';
  ctx.strokeRect(px + 1.5, py + 1.5, size - 3, size - 3);
}
