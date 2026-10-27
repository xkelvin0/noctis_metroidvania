// =============================================================================
// js/core/hud.js - Interfaz en Pantalla: HUD Gótico, Minimapa, Banners y FPS
// Noctis: Metroidvania - Núcleo de Interfaz Gráfica
// =============================================================================

function drawGothicHUD(ctx) {
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
}

function drawGothicMinimap(ctx) {
  const nearbyThreat = enemies.some(enemy => !enemy.isFriendly && Math.abs(enemy.x - player.x) < 150);
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
}

function drawGothicBanner(ctx) {
  if (bannerTimer <= 0) return;
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

function drawFpsCounter(ctx, currentFps) {
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
}
