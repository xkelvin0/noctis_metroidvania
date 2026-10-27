// =============================================================================
// js/core/render.js - Renderizado del Mundo: Escenario, Tilemaps y Entidades
// Noctis: Metroidvania - Núcleo de Dibujado de Escena
// =============================================================================

function drawWorld(ctx) {
  // Fondo base
  ctx.fillStyle = '#0c0814';
  ctx.fillRect(0, 0, W, H);

  // Fondo gótico procedural / estelar
  drawGothicBackground(ctx, currentRoomId);
  updateAndDrawFogParticles(ctx, currentRoomId);

  // Renderizado del Tilemap
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
          if (secretNear && !player.hasAstralEye) {
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

  // Primera llegada: guía luminosa hacia el Bazar
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

  // Prompts de interacción (Altar, Mercader, Forja, Portal, NPCs)
  const pCol = Math.floor((player.x + player.w / 2) / TILE);
  const pRow = Math.floor((player.y + player.h / 2) / TILE);
  const pFoot = Math.floor((player.y + player.h - 1) / TILE);

  const isAtAltarTile = getTileAt(pCol, pRow) === 'S' || getTileAt(pCol, pFoot) === 'S';
  const isAtMirrorTile = getTileAt(pCol, pRow) === 'T' || getTileAt(pCol, pFoot) === 'T';

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

  // Jugador Alaric
  drawPlayerSprite(ctx, player);

  // Partículas
  for (const pt of particles) { ctx.fillStyle = pt.color; ctx.fillRect(pt.x, pt.y, 2, 2); }

  // Números de daño flotantes
  ctx.font = '14px "VT323", monospace';
  for (const ft of floatingTexts) { ctx.fillStyle = ft.color || '#ff0055'; ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y)); }

  // Viñeta gótica
  drawGothicVignette(ctx);
}

