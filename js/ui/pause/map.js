// =============================================================================
// js/ui/pause/map.js - Visualización del Gran Mapa, Estadísticas y Niebla de Guerra
// Noctis: Metroidvania - Módulo de Cartografía del Grimorio
// =============================================================================

const ABILITY_MAP_INFO = {
  hasDash: { icon: 'D', label: 'Dash Sombrío' },
  hasDoubleJump: { icon: '2J', label: 'Doble Salto' },
  hasWallJump: { icon: 'G', label: 'Garras / Salto en pared' },
  hasAstralEye: { icon: 'O', label: 'Ojo Astral' },
  hasParryBrooch: { icon: 'P', label: 'Parry' }
};

function getRoomAbilityLocks(room) {
  return Object.values(room.doors || {})
    .filter(door => door.requiresAbility)
    .map(door => ABILITY_MAP_INFO[door.requiresAbility])
    .filter(Boolean);
}

function getRegionStats(roomId) {
  const cityRooms = new Set([-2, -1, 0, 9, 10, 31, 32, 33, 34, 35, 36, 37]);
  const region = cityRooms.has(Number(roomId)) ? 'ciudades' : (typeof getRoomZone === 'function' ? getRoomZone(roomId) : 'carmesi');
  const regionalRooms = Object.entries(ROOM_DEFS).filter(([id]) => {
    if (region === 'ciudades') return cityRooms.has(Number(id));
    return getRoomZone(Number(id)) === region;
  });
  const stat = { visited: 0, total: regionalRooms.length, altars: 0, altarsTotal: 0, bosses: 0, bossesTotal: 0, relics: 0, relicsTotal: 0, elites: 0, elitesTotal: 0, secrets: 0, secretsTotal: 0 };
  regionalRooms.forEach(([id, room]) => {
    if (visitedRooms[id]) stat.visited++;
    const hasAltar = room.map.some(row => row.includes('S'));
    if (hasAltar) { stat.altarsTotal++; if (storyProgress.discoveredAltars && storyProgress.discoveredAltars[id]) stat.altars++; }
    room.spawns.forEach(spawn => {
      if (spawn.type === 'boss') { stat.bossesTotal++; if ((spawn.sealId && seals[spawn.sealId]) || (spawn.isFinal && gameWon)) stat.bosses++; }
      if (spawn.type && spawn.type.startsWith('relic')) {
        stat.relicsTotal++;
        const relicKey = { relic_dash: 'hasDash', relic_doublejump: 'hasDoubleJump', relic_walljump: 'hasWallJump', relic_parrybrooch: 'hasParryBrooch' }[spawn.type];
        if (relicKey && player[relicKey]) stat.relics++;
      }
      if (spawn.elite) { stat.elitesTotal++; if (storyProgress.eliteDefeated && storyProgress.eliteDefeated[spawn.name || `${id}_${spawn.type}`]) stat.elites++; }
    });
    room.map.forEach((row, rowIndex) => {
      [...row].forEach((tile, colIndex) => {
        if (tile !== '?') return;
        stat.secretsTotal++;
        if (brokenWalls[`${id}_${colIndex}_${rowIndex}`]) stat.secrets++;
      });
    });
  });
  stat.name = region === 'ciudades' ? 'Ciudades' : ({ juramento: 'Catacumbas', reloj: 'Jardines', astral: 'Observatorio', carmesi: 'Fortaleza Carmesí' }[region]);
  return stat;
}

function updateObjectiveButton() {
  const btnToggleObjective = document.getElementById('btn-toggle-objective');
  if (btnToggleObjective) btnToggleObjective.textContent = `✦ Marcador de objetivo: ${gameSettings.showObjectiveMarker ? 'ACTIVADO' : 'OCULTO'}`;
}

function renderLargeMap() {
  const mapCanvas = document.getElementById('large-map-canvas');
  const tooltip = document.getElementById('map-room-tooltip');
  if (!mapCanvas) return;
  const mctx = mapCanvas.getContext('2d');
  const mw = mapCanvas.width, mh = mapCanvas.height;

  mctx.clearRect(0, 0, mw, mh);
  mctx.fillStyle = '#09050f';
  mctx.fillRect(0, 0, mw, mh);

  const rooms = Object.values(ROOM_DEFS);
  const minGridX = Math.min(...rooms.map(r => r.gridX));
  const maxGridX = Math.max(...rooms.map(r => r.gridX));
  const minGridY = Math.min(...rooms.map(r => r.gridY));
  const maxGridY = Math.max(...rooms.map(r => r.gridY));
  const gridCols = maxGridX - minGridX + 1;
  const gridRows = maxGridY - minGridY + 1;
  const gap = gridCols > 20 || gridRows > 12 ? 3 : 10;
  const cellW = Math.max(18, Math.min(82, (mw - 36 - (gridCols - 1) * gap) / gridCols));
  const cellH = Math.max(14, Math.min(48, (mh - 42 - (gridRows - 1) * gap) / gridRows));
  const offsetX = 18, offsetY = 20;

  let visitedCount = 0;
  let mappedRoomCount = 0;

  for (const id in ROOM_DEFS) {
    const rm = ROOM_DEFS[id];
    const isVisited = !!visitedRooms[id];
    if (isVisited) visitedCount++;
    if (!hasMapForRoom(id)) continue;
    mappedRoomCount++;

    const gx = rm.gridX - minGridX;
    const gy = rm.gridY - minGridY;
    const rx = offsetX + gx * (cellW + gap);
    const ry = offsetY + gy * (cellH + gap);
    const zone = typeof getRoomZone === 'function' ? getRoomZone(id) : 'carmesi';
    const zoneColor = zone === 'juramento' ? '#247b7b'
      : zone === 'astral' ? '#4153a2'
      : zone === 'reloj' ? '#8a6930'
      : '#6c2850';

    if (isVisited) {
      const isCurrent = (Number(id) === currentRoomId);
      mctx.fillStyle = isCurrent ? '#ff0055' : zoneColor;
      mctx.fillRect(rx, ry, cellW, cellH);
      mctx.strokeStyle = isCurrent ? '#ffffff' : '#d7c7e8';
      mctx.lineWidth = isCurrent ? 3 : 1;
      mctx.strokeRect(rx, ry, cellW, cellH);
      mctx.textAlign = 'center';
      mctx.font = cellW < 34 ? 'bold 8px monospace' : 'bold 12px monospace';
      mctx.fillStyle = '#ffffff';
      if (cellW >= 42 && cellH >= 24) mctx.fillText(getRoomMapLabel(id), rx + cellW / 2, ry + Math.min(16, cellH - 5));
      const icons = [];
      if (rm.map.some(row => row.includes('S'))) icons.push('⚡');
      if (rm.spawns.some(s => s.type && s.type.startsWith('relic'))) icons.push('🔮');
      if (rm.spawns.some(s => s.type === 'boss')) icons.push('👑');
      const abilityLocks = getRoomAbilityLocks(rm);
      if (abilityLocks.length) icons.push(...abilityLocks.map(lock => lock.icon));
      else if (Object.values(rm.doors || {}).some(d => d.requiresAllSeals)) icons.push('⛓');
      if (cellW >= 30 && cellH >= 28) {
        mctx.font = icons.some(icon => icon.length > 1) ? 'bold 11px monospace' : '16px sans-serif';
        mctx.fillText(icons.join(' '), rx + cellW / 2, ry + cellH - 9);
      }
      if (isCurrent) {
        mctx.fillStyle = '#ffffff';
        mctx.beginPath();
        mctx.arc(rx + cellW - 10, ry + 10, 4, 0, Math.PI * 2);
        mctx.fill();
      }
    } else {
      mctx.fillStyle = '#161123';
      mctx.fillRect(rx, ry, cellW, cellH);
      mctx.strokeStyle = zoneColor;
      mctx.globalAlpha = 0.55;
      mctx.strokeRect(rx, ry, cellW, cellH);
      mctx.globalAlpha = 1;
      mctx.fillStyle = '#867494';
      mctx.textAlign = 'center';
      if (cellW >= 42 && cellH >= 24) {
        mctx.font = 'bold 11px monospace';
        mctx.fillText(getRoomMapLabel(id), rx + cellW / 2, ry + cellH / 2 + 4);
      }
    }
  }

  const objectiveRoomId = getObjectiveTargetRoom();
  const objectiveRoom = ROOM_DEFS[objectiveRoomId];
  if (gameSettings.showObjectiveMarker && objectiveRoom && hasMapForRoom(objectiveRoomId)) {
    const markerX = offsetX + (objectiveRoom.gridX - minGridX) * (cellW + gap) + cellW - 10;
    const markerY = offsetY + (objectiveRoom.gridY - minGridY) * (cellH + gap) + cellH - 10;
    const pulse = 0.65 + Math.sin(Date.now() * 0.008) * 0.35;
    mctx.save();
    mctx.globalAlpha = pulse;
    mctx.fillStyle = '#ffbe0b';
    mctx.beginPath();
    mctx.moveTo(markerX, markerY - 6); mctx.lineTo(markerX + 6, markerY);
    mctx.lineTo(markerX, markerY + 6); mctx.lineTo(markerX - 6, markerY);
    mctx.fill();
    mctx.restore();
  }

  if (mappedRoomCount === 0) {
    mctx.textAlign = 'center';
    mctx.fillStyle = '#d7c7e8';
    mctx.font = 'bold 18px serif';
    mctx.fillText('GRIMORIO SIN CARTAS', mw / 2, mh / 2 - 8);
    mctx.fillStyle = '#9e8fb2';
    mctx.font = '13px monospace';
    mctx.fillText('Dario vende cartas regionales en el Bazar de Villa Refugio.', mw / 2, mh / 2 + 18);
  }

  const percentElem = document.getElementById('map-percentage');
  if (percentElem) {
    const stats = getRegionStats(currentRoomId);
    const regionPercent = stats.total ? Math.round((stats.visited / stats.total) * 100) : 0;
    percentElem.textContent = `${stats.name}: ${regionPercent}% · ${stats.visited}/${stats.total} salas · Altares ${stats.altars}/${stats.altarsTotal} · Jefes ${stats.bosses}/${stats.bossesTotal} · Reliquias ${stats.relics}/${stats.relicsTotal} · Élites ${stats.elites}/${stats.elitesTotal} · Secretos ${stats.secrets}/${stats.secretsTotal}`;
  }
  const title = document.getElementById('map-title');
  if (title) title.textContent = mappedRoomCount ? `Mapa: ${ROOM_DEFS[currentRoomId].name}` : 'Mapa: Cartografía sin revelar';
  mctx.textAlign = 'left';

  mapCanvas.onmousemove = (event) => {
    if (!tooltip) return;
    const bounds = mapCanvas.getBoundingClientRect();
    const scaleX = mw / bounds.width, scaleY = mh / bounds.height;
    const mouseX = (event.clientX - bounds.left) * scaleX;
    const mouseY = (event.clientY - bounds.top) * scaleY;
    const room = rooms.find(candidate => {
      const roomX = offsetX + (candidate.gridX - minGridX) * (cellW + gap);
      const roomY = offsetY + (candidate.gridY - minGridY) * (cellH + gap);
      return mouseX >= roomX && mouseX <= roomX + cellW && mouseY >= roomY && mouseY <= roomY + cellH;
    });
    if (!room) { tooltip.classList.remove('visible'); return; }
    const roomId = Object.keys(ROOM_DEFS).find(id => ROOM_DEFS[id] === room);
    if (!hasMapForRoom(roomId)) { tooltip.classList.remove('visible'); return; }
    const isVisited = !!visitedRooms[roomId];
    if (!isVisited) {
      tooltip.innerHTML = `<strong>${getRoomDisplayLabel(roomId)} · ${room.name}</strong>Carta adquirida · aún no explorada.`;
    } else {
      const points = [];
      if (room.map.some(row => row.includes('S'))) points.push('Altar de descanso');
      if (room.spawns.some(s => s.type && s.type.startsWith('relic'))) points.push('Reliquia');
      if (room.spawns.some(s => s.type === 'boss')) points.push('Jefe');
      if (room.optionalKind === 'lore') points.push('Sala opcional de lore');
      if (room.optionalKind === 'elite') points.push('Arena élite opcional');
      if (Object.values(room.doors || {}).some(d => d.shortcut)) points.push('Atajo permanente');
      const abilityLocks = getRoomAbilityLocks(room);
      if (abilityLocks.length) points.push(`Requiere: ${abilityLocks.map(lock => lock.label).join(', ')}`);
      else if (Object.values(room.doors || {}).some(d => d.requiresAllSeals)) points.push('Requiere los 4 Sellos');
      else if (Object.values(room.doors || {}).some(d => d.requiresSealCount)) points.push(`Requiere ${Object.values(room.doors).find(d => d.requiresSealCount).requiresSealCount} Sellos`);
      if (Number(roomId) === getObjectiveTargetRoom() && gameSettings.showObjectiveMarker) points.push('Objetivo actual');
      tooltip.innerHTML = `<strong>${getRoomDisplayLabel(roomId)} · ${room.name}</strong>${points.length ? points.join(' · ') : 'Sala de exploración'}`;
    }
    const cb = mapCanvas.parentElement.getBoundingClientRect();
    tooltip.style.left = `${Math.max(8, Math.min(event.clientX - cb.left + 14, cb.width - 250))}px`;
    tooltip.style.top = `${Math.max(8, event.clientY - cb.top - 46)}px`;
    tooltip.classList.add('visible');
  };
  mapCanvas.onmouseleave = () => { if (tooltip) tooltip.classList.remove('visible'); };
}

