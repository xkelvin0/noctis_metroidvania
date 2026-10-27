// =========================================================
// MOTOR BASE DE SPRITES Y RECURSOS COMUNES (js/sprites.js)
// =========================================================

// Carga de imágenes pixel art y tilesets del juego
const ambientSkylineImage = new Image();
ambientSkylineImage.src = 'img/backgrounds/ambient_skyline.jpg';
let ambientSkylineLoaded = false;
ambientSkylineImage.onload = () => { ambientSkylineLoaded = true; };

const villageSheetImage = new Image();
villageSheetImage.src = 'img/tilesets/village_sheet.jpg';
let villageSheetLoaded = false;
villageSheetImage.onload = () => { villageSheetLoaded = true; };

const villageDecorImage = new Image();
villageDecorImage.src = 'img/environment/village_decor.jpg';
let villageDecorLoaded = false;
villageDecorImage.onload = () => { villageDecorLoaded = true; };

const villageFrontHousesImage = new Image();
villageFrontHousesImage.src = 'img/environment/village_front_houses.jpg';
let villageFrontHousesLoaded = false;
villageFrontHousesImage.onload = () => { villageFrontHousesLoaded = true; };

const villageMilitaryBuildingsImage = new Image();
villageMilitaryBuildingsImage.src = 'img/environment/village_military_buildings.jpg';
let villageMilitaryBuildingsLoaded = false;
villageMilitaryBuildingsImage.onload = () => { villageMilitaryBuildingsLoaded = true; };

const dungeonTilesetImage = new Image();
dungeonTilesetImage.src = 'img/tilesets/dungeon_tileset.jpg';
let dungeonTilesetLoaded = false;
dungeonTilesetImage.onload = () => { dungeonTilesetLoaded = true; };

const merchantTentImage = new Image();
merchantTentImage.src = 'img/environment/merchant_tent.png';
let merchantTentLoaded = false;
merchantTentImage.onload = () => { merchantTentLoaded = true; };

const saveAltarImage = new Image();
saveAltarImage.src = 'img/environment/save_altar.png';
let saveAltarLoaded = false;
saveAltarImage.onload = () => { saveAltarLoaded = true; };

const tavernCottageImage = new Image();
tavernCottageImage.src = 'img/environment/tavern_cottage.png';
let tavernCottageLoaded = false;
tavernCottageImage.onload = () => { tavernCottageLoaded = true; };

const zoneBackgrounds = {
  carmesi: new Image(),
  catacumbas: new Image(),
  observatorio: new Image(),
  jardines: new Image()
};
zoneBackgrounds.carmesi.src = 'img/backgrounds/fortress_carmesi_bg.png';
zoneBackgrounds.catacumbas.src = 'img/backgrounds/catacumbas_bg.png';
zoneBackgrounds.observatorio.src = 'img/backgrounds/observatorio_bg.png';
zoneBackgrounds.jardines.src = 'img/backgrounds/jardines_reloj_bg.png';

// Canvas temporal fuera de pantalla para Chroma Key transparente y caché
const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');
const spriteCache = {};

function getCachedTransparentSprite(img, sx, sy, sw, sh, key, threshold = 20) {
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
    if (r < threshold && g < threshold && b < threshold) {
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
