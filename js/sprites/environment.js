// =========================================================
// SPRITES DE ENTORNO, EDIFICIOS Y ESCENOGRAFÍA (js/sprites/environment.js)
// =========================================================

// Barrera Sombría (B): Barrotes de hierro oscuro envueltos en energía espectral
function drawShadowBarrierSprite(ctx, tx, ty, animClock) {
  ctx.fillStyle = '#10051d';
  ctx.fillRect(tx, ty, 16, 16);
  ctx.fillStyle = '#261238';
  ctx.fillRect(tx + 2, ty, 3, 16);
  ctx.fillRect(tx + 7, ty, 3, 16);
  ctx.fillRect(tx + 12, ty, 3, 16);

  const pulse = Math.sin(animClock * 0.18 + tx * 0.1) * 0.35 + 0.65;
  ctx.fillStyle = `rgba(157, 78, 221, ${pulse * 0.75})`;
  ctx.fillRect(tx + 1, ty + 2, 14, 2);
  ctx.fillRect(tx + 1, ty + 12, 14, 2);
  ctx.fillStyle = `rgba(255, 0, 85, ${pulse * 0.6})`;
  const sparkY = ty + Math.floor((animClock * 2 + tx) % 14);
  ctx.fillRect(tx + 4, sparkY, 8, 2);
}

// Plataforma Astral (*): Cristal etéreo cósmico revelado con el Ojo Astral
function drawAstralPlatformSprite(ctx, tx, ty, hasAstralEye, animClock) {
  if (hasAstralEye) {
    const pulse = Math.sin(animClock * 0.14 + tx * 0.05) * 0.2 + 0.8;
    const grad = ctx.createLinearGradient(tx, ty, tx, ty + 16);
    grad.addColorStop(0, `rgba(254, 228, 64, ${pulse})`);
    grad.addColorStop(0.5, `rgba(0, 245, 212, ${pulse * 0.85})`);
    grad.addColorStop(1, `rgba(114, 9, 183, ${pulse * 0.6})`);

    ctx.fillStyle = grad;
    ctx.fillRect(tx, ty + 1, 16, 14);
    ctx.strokeStyle = '#fee440';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx + 0.5, ty + 1.5, 15, 13);

    // Runa astral central
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tx + 7, ty + 4, 2, 8);
    ctx.fillRect(tx + 4, ty + 7, 8, 2);
  } else {
    const faint = Math.sin(animClock * 0.08) * 0.04 + 0.08;
    ctx.fillStyle = `rgba(180, 210, 255, ${faint})`;
    ctx.fillRect(tx + 2, ty + 6, 12, 4);
  }
}

// Marcas de Garras en Muros Escalables para Salto en Pared
function drawWallClawMarks(ctx, tx, ty, side = 'left') {
  ctx.strokeStyle = 'rgba(255, 0, 127, 0.45)';
  ctx.lineWidth = 1;
  const ox = side === 'left' ? tx + 2 : tx + 10;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(ox + i * 2, ty + 3 + i);
    ctx.lineTo(ox + i * 2 + 3, ty + 12 + i);
    ctx.stroke();
  }
}

// Altar de Guardado Gótico con Monumento de Piedra y Cristal Flotante
function drawSaveAltarSprite(ctx, x, y, animClock) {
  const ax = Math.round(x);
  const ay = Math.round(y);
  const floorY = ay + 16; // Nivel exacto del suelo sólido

  if (saveAltarLoaded) {
    const drawW = 42;
    const drawH = 68;
    ctx.drawImage(saveAltarImage, ax - 13, floorY - drawH, drawW, drawH);
    // Cristal sagrado pulsante
    const bob = Math.sin(animClock * 0.12) * 2;
    const pulse = Math.sin(animClock * 0.18) * 0.25 + 0.75;
    ctx.fillStyle = `rgba(255, 190, 11, ${pulse * 0.35})`;
    ctx.beginPath();
    ctx.arc(ax + 8, floorY - 38 + bob, 14, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Respaldo
  ctx.fillStyle = '#ffbe0b';
  ctx.fillRect(ax + 5, ay - 6, 6, 12);
}

// Puesto / Tienda de Campaña del Mercader Dario ('M')
function drawMerchantStallSprite(ctx, x, y, animClock) {
  const mx = Math.round(x);
  const my = Math.round(y);
  const floorY = my + 16; // Nivel exacto del suelo sólido

  if (merchantTentLoaded) {
    const drawW = 66;
    const drawH = 59;
    ctx.drawImage(merchantTentImage, mx - 25, floorY - drawH, drawW, drawH);
    // Farol parpadeante
    const lanternPulse = Math.sin(animClock * 0.15) * 0.25 + 0.75;
    ctx.fillStyle = `rgba(255, 190, 11, ${lanternPulse * 0.35})`;
    ctx.beginPath();
    ctx.arc(mx + 13, floorY - 33, 12, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Respaldo
  ctx.fillStyle = '#4a2c1d';
  ctx.fillRect(mx - 4, my + 4, 28, 12);
}

// Cabaña / Fachada Frontal de la Taberna de la Villa ('H')
function drawTavernCottageSprite(ctx, x, y, animClock) {
  const hx = Math.round(x);
  const hy = Math.round(y);
  const floorY = hy + 16; // Nivel exacto del suelo sólido

  if (tavernCottageLoaded) {
    const drawW = 70;
    const drawH = 85;
    ctx.drawImage(tavernCottageImage, hx - 27, floorY - drawH, drawW, drawH);
    // Luz cálida en la ventana y linterna exterior
    const windowGlow = Math.sin(animClock * 0.1) * 0.15 + 0.85;
    ctx.fillStyle = `rgba(255, 190, 11, ${windowGlow * 0.22})`;
    ctx.beginPath();
    ctx.arc(hx + 8, floorY - 38, 16, 0, Math.PI * 2);
    ctx.fill();
    return;
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

function drawSpecialistShopSprite(ctx, x, y, theme, animClock) {
  const sx = Math.round(x), sy = Math.round(y);
  const styles = {
    cartography: { crop: [12, 150, 328, 665], trim: '#78c7df', glow: '#c5f6ff' },
    alchemy: { crop: [350, 190, 305, 625], trim: '#64c7ad', glow: '#b8ffe9' },
    reliquary: { crop: [660, 190, 330, 625], trim: '#c39cff', glow: '#ead7ff' },
    inn: { crop: [12, 150, 328, 665], trim: '#e9b96d', glow: '#ffd996' },
    library: { crop: [350, 190, 305, 625], trim: '#9bb9ff', glow: '#dce6ff' }
  };
  const style = styles[theme];
  const pulse = 0.65 + Math.sin(animClock * 0.13) * 0.25;
  if (villageFrontHousesLoaded) {
    const [cropX, cropY, cropW, cropH] = style.crop;
    const cacheKey = `specialist_house_${theme}`;
    const houseSprite = getCachedTransparentSprite(villageFrontHousesImage, cropX, cropY, cropW, cropH, cacheKey);
    if (houseSprite) {
      ctx.drawImage(houseSprite, sx - 16, sy - 72, 60, 86);
      if (theme === 'alchemy') { ctx.fillStyle = style.glow; ctx.fillRect(sx + 37, sy - 5, 4, 8); ctx.fillStyle = '#d7fff2'; ctx.fillRect(sx + 36, sy - 7, 6, 3); }
      if (theme === 'reliquary') { ctx.fillStyle = style.glow; ctx.fillRect(sx + 12, sy - 77, 4, 5); }
      return;
    }
  }
  ctx.fillStyle = '#25192d'; ctx.fillRect(sx - 12, sy - 48, 50, 58);
  ctx.fillStyle = style.trim; ctx.fillRect(sx - 15, sy - 55, 56, 8);
  ctx.fillStyle = '#0a0610'; ctx.fillRect(sx + 10, sy - 17, 12, 27);
  ctx.fillStyle = style.glow; ctx.globalAlpha = pulse; ctx.fillRect(sx - 3, sy - 31, 9, 12); ctx.fillRect(sx + 26, sy - 31, 8, 12); ctx.globalAlpha = 1;
}

function drawCartographyHouseSprite(ctx, x, y, animClock) { drawSpecialistShopSprite(ctx, x, y, 'cartography', animClock); }
function drawAlchemyHouseSprite(ctx, x, y, animClock) { drawSpecialistShopSprite(ctx, x, y, 'alchemy', animClock); }
function drawReliquaryHouseSprite(ctx, x, y, animClock) { drawSpecialistShopSprite(ctx, x, y, 'reliquary', animClock); }
function drawInnHouseSprite(ctx, x, y, animClock) { drawTavernCottageSprite(ctx, x, y, animClock); }
function drawLibraryHouseSprite(ctx, x, y, animClock) { drawSpecialistShopSprite(ctx, x, y, 'library', animClock); }

// Farol de Calle Gótico Iluminado ('L')
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

// Pozo de Agua de Piedra y Barriles ('W')
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

// Configuración de Paletas y Habitaciones de la Ciudadela
function getRoomPalette(roomId) {
  const zone = typeof getRoomZone === 'function' ? getRoomZone(roomId) : 'carmesi';
  if (zone === 'juramento') return { stone: '#123338', edge: '#2d6565', platform: '#315f61', platformTop: '#79aeb0', spike: '#78b7a2', gate: '#7cc7c1' };
  if (zone === 'astral') return { stone: '#18234a', edge: '#5365a7', platform: '#4856a4', platformTop: '#b3d9ff', spike: '#7de2ff', gate: '#8f7cff' };
  if (zone === 'reloj') return { stone: '#343021', edge: '#75623a', platform: '#75613a', platformTop: '#d8b766', spike: '#d6813f', gate: '#c89143' };
  return { stone: '#261427', edge: '#63334f', platform: '#733853', platformTop: '#d87987', spike: '#ef476f', gate: '#b655a2' };
}

const CITY_ROOM_IDS = new Set([-2, -1, 0, 9, 10, 31, 32, 33, 34, 35, 36, 37]);

function isCityRoom(roomId) {
  return CITY_ROOM_IDS.has(Number(roomId));
}

// Pavimento y Adoquines de Ciudad
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

// Muros de Mazmorra con Sillar Gótico
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

// Plataformas Flotantes de Mazmorra
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

