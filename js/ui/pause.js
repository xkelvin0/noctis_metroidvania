// =========================================================
// js/ui/pause.js — Menú de Pausa / Grimorio de Alaric
// =========================================================

let isPaused = false;
const pauseMenu = document.getElementById('pause-menu');
const btnResume = document.getElementById('btn-resume');
const btnQuickResume = document.getElementById('btn-quick-resume');
const btnRestart = document.getElementById('btn-restart');
const btnToggleSound = document.getElementById('btn-toggle-sound');
const btnToggleObjective = document.getElementById('btn-toggle-objective');
const musicVolumeInput = document.getElementById('music-volume');
const sfxVolumeInput = document.getElementById('sfx-volume');
const btnRebindJump = document.getElementById('btn-rebind-jump');
const btnRebindDash = document.getElementById('btn-rebind-dash');
const btnRebindAttack = document.getElementById('btn-rebind-attack');
const btnRebindLeft = document.getElementById('btn-rebind-left');
const btnRebindRight = document.getElementById('btn-rebind-right');
const btnRebindDown = document.getElementById('btn-rebind-down');
const btnRebindCast = document.getElementById('btn-rebind-cast');
const btnRebindHook = document.getElementById('btn-rebind-hook');
const btnRebindInteract = document.getElementById('btn-rebind-interact');
const btnRebindTravel = document.getElementById('btn-rebind-travel');
const difficultySelect = document.getElementById('difficulty-select');
const toggleShake = document.getElementById('toggle-shake');
const toggleFlashes = document.getElementById('toggle-flashes');

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
  if (btnToggleObjective) btnToggleObjective.textContent = `✦ Marcador de objetivo: ${gameSettings.showObjectiveMarker ? 'ACTIVADO' : 'OCULTO'}`;
}

// --- Bestiary ---
let selectedMonsterId = 'skeleton';

function updateBestiaryUI() {
  const sidebar = document.getElementById('bestiary-list');
  const detail = document.getElementById('bestiary-detail');
  if (!sidebar || !detail) return;

  sidebar.innerHTML = '';
  BESTIARY_DATA.forEach(m => {
    const btn = document.createElement('button');
    btn.className = `bestiary-btn ${m.id === selectedMonsterId ? 'active' : ''}`;
    btn.innerHTML = `${m.icon} ${m.name}`;
    btn.addEventListener('click', () => { selectedMonsterId = m.id; updateBestiaryUI(); });
    sidebar.appendChild(btn);
  });

  const m = BESTIARY_DATA.find(x => x.id === selectedMonsterId) || BESTIARY_DATA[0];
  detail.innerHTML = `
    <div class="monster-header">
      <div class="monster-avatar">${m.icon}</div>
      <div class="monster-info"><h4>${m.name}</h4><span>${m.title}</span></div>
      <div class="monster-habitat-tag">📍 ${m.habitat || 'Fortaleza Carmesí'}</div>
    </div>
    <div class="monster-stats">
      <span>❤️ Salud: ${m.hp} HP</span>
      <span>⚔️ Ataque: ${m.dmg} DMG</span>
      <span>♦ Botín: ${m.essence}</span>
    </div>
    <p class="monster-desc">${m.desc}</p>
    <div class="monster-weakness"><strong>💡 ESTRATEGIA / DEBILIDAD:</strong><br>${m.weakness}</div>
  `;
}

// --- Reliquias ---
function updateRelicsUI() {
  const list = document.getElementById('relics-list');
  const countBadge = document.getElementById('relics-collected-count');
  if (!list) return;
  let count = 0;
  list.innerHTML = '';
  RELICS_DATA.forEach(r => {
    const isUnlocked = !!player[r.key];
    if (isUnlocked) count++;
    const card = document.createElement('div');
    card.className = `relic-card ${isUnlocked ? 'found' : 'locked'}`;
    card.innerHTML = `
      <div class="relic-icon-box" style="background:${isUnlocked ? r.color + '22' : '#221630'};border:1px solid ${isUnlocked ? r.color : '#443055'};">
        <span>${isUnlocked ? r.icon : '🔒'}</span>
      </div>
      <h4>${isUnlocked ? r.name : '??? (Artefacto Bloqueado)'}</h4>
      <p>${isUnlocked ? r.desc : 'Explora los rincones más profundos de la fortaleza para descubrir este artefacto.'}</p>
      <div class="relic-command">${isUnlocked ? `Comando: ${r.command}` : 'Pistas: En algún lugar de la fortaleza'}</div>
    `;
    list.appendChild(card);
  });
  const slots = Math.min(5, 3 + Math.floor(sealCount() / 2) + (player.amuletSlotBonus || 0));
  const equipped = player.equippedAmulets || [];
  const buildPanel = document.createElement('section');
  buildPanel.style.cssText = 'grid-column:1/-1;background:#120a1d;border:1px solid #67406f;padding:12px;margin-top:8px;color:#f0def8;';
  buildPanel.innerHTML = `<h4 style="margin:0 0 8px;color:#ffbe0b">MATERIALES</h4><p style="margin:0 0 10px">${Object.entries(MATERIALS_DATA).map(([id, material]) => `${material.icon} ${material.name}: <b>${materials[id] || 0}</b>`).join(' &nbsp; ')}</p><h4 style="margin:0 0 8px;color:#ffbe0b">AMULETOS (${equipped.length}/${slots})</h4>` + MINOR_RELICS_DATA.map(amulet => {
    const unlocked = !!player[amulet.key];
    const active = equipped.includes(amulet.id);
    return `<button class="amulet-toggle" data-amulet="${amulet.id}" ${unlocked ? '' : 'disabled'} style="margin:3px;padding:6px;background:${active ? amulet.color : '#26162f'};color:#fff;border:1px solid ${amulet.color}">${unlocked ? `${amulet.icon} ${amulet.name}${active ? ' · EQUIPADO' : ''}` : '🔒 Amuleto desconocido'}</button>`;
  }).join('') + `<h4 style="margin:14px 0 8px;color:#ffbe0b">ÁRBOL DE MAGIA</h4>` + MAGIC_TREE_DATA.map(branch => {
    const rank = player.magicTree[branch.id] || 0;
    const cost = [45, 75, 115][rank];
    return `<button class="magic-upgrade" data-branch="${branch.id}" ${rank >= 3 ? 'disabled' : ''} style="margin:3px;padding:6px;background:#26162f;color:${branch.color};border:1px solid ${branch.color}">${branch.icon} ${branch.name} ${rank}/3 · ${rank >= 3 ? 'DOMINADA' : `Mejorar ${cost} ♦`}</button>`;
  }).join('');
  list.appendChild(buildPanel);
  buildPanel.querySelectorAll('.amulet-toggle').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.amulet;
    const current = player.equippedAmulets || [];
    if (current.includes(id)) player.equippedAmulets = current.filter(item => item !== id);
    else if (current.length < slots) player.equippedAmulets = [...current, id];
    else { showBanner(`SIN RANURAS: EQUIPA SOLO ${slots} AMULETOS`, 110); return; }
    sfx('relic'); saveProgress(); updateRelicsUI();
  }));
  buildPanel.querySelectorAll('.magic-upgrade').forEach(button => button.addEventListener('click', () => {
    const branch = button.dataset.branch;
    const rank = player.magicTree[branch] || 0;
    const cost = [45, 75, 115][rank];
    if (rank >= 3) return;
    if (player.essence < cost) { showBanner(`ESENCIA INSUFICIENTE: NECESITAS ${cost} ♦`, 100); return; }
    player.essence -= cost;
    player.magicTree[branch] = rank + 1;
    sfx('relic'); showBanner(`MAGIA ${branch.toUpperCase()} MEJORADA A RANGO ${rank + 1}`, 120); saveProgress(); updateRelicsUI();
  }));
  if (countBadge) countBadge.textContent = `${count} / ${RELICS_DATA.length} Reliquias · ${equipped.length}/${slots} Amuletos`;
}

// --- Logros ---
function updateAchievementsUI() {
  const container = document.getElementById('achievements-list');
  const countBadge = document.getElementById('achievements-count');
  if (!container) return;
  let count = 0;
  container.innerHTML = '';
  ACHIEVEMENTS_DATA.forEach(ach => {
    const isUnlocked = ach.check();
    if (isUnlocked) count++;
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <div class="achievement-badge">${isUnlocked ? ach.icon : '🔒'}</div>
      <div class="achievement-info">
        <h4>${ach.title}</h4>
        <p>${ach.desc}</p>
        <div class="achievement-status">${isUnlocked ? '✦ ¡DESBLOQUEADO! ✦' : 'Pendiente por completar'}</div>
      </div>
    `;
    container.appendChild(card);
  });
  if (countBadge) countBadge.textContent = `${count} / ${ACHIEVEMENTS_DATA.length} Logros`;
}

// --- Misiones y Memorias ---
function updateQuestsUI() {
  const list = document.getElementById('quests-list');
  const memories = document.getElementById('memories-list');
  const badge = document.getElementById('quest-count');
  if (!list || !memories || !badge) return;
  let completed = 0;
  list.innerHTML = QUESTS_DATA.map(quest => {
    const [current, total] = quest.progress();
    const done = current >= total;
    const claimed = isQuestClaimed(quest.id);
    if (done) completed++;
    const pct = Math.min(100, Math.round((current / total) * 100));
    
    let actionHtml = '';
    if (done && !claimed) {
      actionHtml = `<button class="quest-claim-btn" data-quest-id="${quest.id}">✦ RECLAMAR +${quest.rewardEssence} ♦</button>`;
    } else if (claimed) {
      actionHtml = `<span class="quest-claimed-badge">✓ RECLAMADA</span>`;
    } else {
      actionHtml = `<span class="quest-reward-tag">Recompensa: +${quest.rewardEssence} ♦</span>`;
    }

    return `
      <article class="quest-card ${done ? 'completed' : ''} ${claimed ? 'claimed' : ''}">
        <div class="quest-header">
          <h4>${quest.icon || '✦'} ${quest.title}</h4>
          ${done && !claimed ? '<span style="color:#ffbe0b;font-size:11px;animation:pulse-glow 1s infinite;">¡LISTA!</span>' : ''}
        </div>
        <p>${quest.desc}</p>
        <div class="quest-progress-container">
          <div class="quest-bar-bg">
            <div class="quest-bar-fill" style="width: ${pct}%"></div>
          </div>
          <span class="quest-ratio">${current}/${total} (${pct}%)</span>
        </div>
        <div class="quest-footer">
          ${actionHtml}
        </div>
      </article>
    `;
  }).join('');

  // Vincular eventos a los botones de reclamar recompensa
  list.querySelectorAll('.quest-claim-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const qId = e.target.getAttribute('data-quest-id');
      if (qId && typeof claimQuestReward === 'function') {
        claimQuestReward(qId);
      }
    });
  });

  badge.textContent = `${completed} / ${QUESTS_DATA.length} Misiones`;
  memories.innerHTML = Object.entries(MEMORIES_DATA).map(([sealId, memory]) => {
    const unlocked = seals[sealId];
    return `<article class="memory-card ${unlocked ? 'unlocked' : 'locked'}"><h4>${unlocked ? '✦ ' + memory.title : '🔒 Memoria sellada'}</h4><p>${unlocked ? memory.text : 'Restaura el sello correspondiente para revelar esta memoria.'}</p></article>`;
  }).join('');
}

// --- Mapa Grande ---
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
  const totalRooms = Object.keys(ROOM_DEFS).length;
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

// --- Pestañas del Grimorio ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const targetId = btn.getAttribute('data-tab');
    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add('active');
    if (targetId === 'tab-map') renderLargeMap();
    if (targetId === 'tab-relics') updateRelicsUI();
    if (targetId === 'tab-quests') updateQuestsUI();
    if (targetId === 'tab-bestiary') updateBestiaryUI();
    if (targetId === 'tab-achievements') updateAchievementsUI();
  });
});

function switchPauseTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  const pane = document.getElementById(tabId);
  if (pane) pane.classList.add('active');
  if (tabId === 'tab-map') renderLargeMap();
  if (tabId === 'tab-relics') updateRelicsUI();
  if (tabId === 'tab-quests') updateQuestsUI();
  if (tabId === 'tab-bestiary') updateBestiaryUI();
  if (tabId === 'tab-achievements') updateAchievementsUI();
}

function togglePause(targetTab) {
  if (typeof isShopOpen === 'function' && isShopOpen()) {
    closeShop();
    return;
  }
  if (isTutorialOpen) { closeSkillTutorial(); return; }
  if (targetTab) {
    if (!isPaused) {
      isPaused = true;
      pauseMenu.classList.remove('hidden');
      for (let k in keys) keys[k] = false;
      clearJustPressed();
    }
    switchPauseTab(targetTab);
    return;
  }
  isPaused = !isPaused;
  pauseMenu.classList.toggle('hidden', !isPaused);
  if (isPaused) {
    for (let k in keys) keys[k] = false;
    clearJustPressed();
    renderLargeMap();
    updateRelicsUI();
    updateQuestsUI();
    updateBestiaryUI();
    updateAchievementsUI();
    updateObjectiveButton();
    syncAudioOptions();
  }
}

btnResume.addEventListener('click', togglePause);
if (btnQuickResume) btnQuickResume.addEventListener('click', togglePause);

const btnSaveGame = document.getElementById('btn-save-game');
if (btnSaveGame) {
  btnSaveGame.addEventListener('click', () => {
    if (typeof saveProgress === 'function') {
      saveProgress();
      if (typeof sfx === 'function') sfx('relic');
      if (typeof showBanner === 'function') {
        showBanner("✦ PARTIDA GUARDADA CON ÉXITO ✦", 150);
      }
      btnSaveGame.textContent = "✓ ¡Partida Guardada!";
      setTimeout(() => {
        if (btnSaveGame) btnSaveGame.textContent = "💾 Guardar Partida (Progreso Actual)";
      }, 2000);
    }
  });
}

btnRestart.addEventListener('click', () => { 
  togglePause(); 
  if (typeof respawnAtLastAltar === 'function') {
    respawnAtLastAltar();
  } else {
    damagePlayer(999, player.x); 
  }
});

if (btnToggleSound) {
  btnToggleSound.addEventListener('click', () => {
    const muted = toggleMute();
    showBanner(muted ? "MÚSICA SILENCIADA (O)" : "MÚSICA ACTIVADA (O)", 90);
  });
}
if (btnToggleObjective) {
  btnToggleObjective.addEventListener('click', () => {
    gameSettings.showObjectiveMarker = !gameSettings.showObjectiveMarker;
    updateObjectiveButton();
    saveProgress();
  });
}
function syncAudioOptions() {
  const music = gameSettings.musicVolume ?? 0.7, effects = gameSettings.sfxVolume ?? 0.8;
  if (musicVolumeInput) musicVolumeInput.value = music;
  if (sfxVolumeInput) sfxVolumeInput.value = effects;
  if (typeof setAudioVolumes === 'function') setAudioVolumes(music, effects);
  if (difficultySelect) difficultySelect.value = gameSettings.difficulty || 'normal';
  if (toggleShake) toggleShake.checked = gameSettings.screenShake !== false;
  if (toggleFlashes) toggleFlashes.checked = gameSettings.flashes !== false;
  const bindings = [
    [btnRebindJump, 'jumpKey', 'SALTO', ' '], [btnRebindDash, 'dashKey', 'DASH', 'shift'], [btnRebindAttack, 'attackKey', 'ATAQUE', 'mouseLeft'],
    [btnRebindLeft, 'leftKey', 'MOVIMIENTO IZQUIERDA', 'a'], [btnRebindRight, 'rightKey', 'MOVIMIENTO DERECHA', 'd'],
    [btnRebindDown, 'downKey', 'AGACHARSE', 's'], [btnRebindCast, 'castKey', 'HECHIZO', 'q'], [btnRebindHook, 'hookKey', 'GANCHO', 'f'],
    [btnRebindInteract, 'interactKey', 'INTERACTUAR', 'e'], [btnRebindTravel, 'travelKey', 'VIAJE RÁPIDO', 't']
  ];
  bindings.forEach(([button, setting, label, fallback]) => {
    if (button) button.textContent = `⌨️ ${label}: ${(gameSettings[setting] || fallback).toUpperCase()}`;
  });
}
if (musicVolumeInput && sfxVolumeInput) {
  const updateVolume = () => { gameSettings.musicVolume = Number(musicVolumeInput.value); gameSettings.sfxVolume = Number(sfxVolumeInput.value); setAudioVolumes(gameSettings.musicVolume, gameSettings.sfxVolume); saveProgress(); };
  musicVolumeInput.addEventListener('input', updateVolume); sfxVolumeInput.addEventListener('input', updateVolume);
}
function captureBinding(button, setting, label) {
  button.textContent = `⌨️ Presiona una tecla para ${label}`;
  const capture = event => { event.preventDefault(); event.stopPropagation(); gameSettings[setting] = event.key.toLowerCase(); button.textContent = `⌨️ ${label}: ${event.key.toUpperCase()}`; window.removeEventListener('keydown', capture, true); saveProgress(); };
  window.addEventListener('keydown', capture, true);
}
if (btnRebindJump) btnRebindJump.addEventListener('click', () => captureBinding(btnRebindJump, 'jumpKey', 'SALTO'));
if (btnRebindDash) btnRebindDash.addEventListener('click', () => captureBinding(btnRebindDash, 'dashKey', 'DASH'));
if (btnRebindAttack) btnRebindAttack.addEventListener('click', () => captureBinding(btnRebindAttack, 'attackKey', 'ATAQUE'));
if (btnRebindLeft) btnRebindLeft.addEventListener('click', () => captureBinding(btnRebindLeft, 'leftKey', 'MOVIMIENTO IZQUIERDA'));
if (btnRebindRight) btnRebindRight.addEventListener('click', () => captureBinding(btnRebindRight, 'rightKey', 'MOVIMIENTO DERECHA'));
if (btnRebindDown) btnRebindDown.addEventListener('click', () => captureBinding(btnRebindDown, 'downKey', 'AGACHARSE'));
if (btnRebindCast) btnRebindCast.addEventListener('click', () => captureBinding(btnRebindCast, 'castKey', 'HECHIZO'));
if (btnRebindHook) btnRebindHook.addEventListener('click', () => captureBinding(btnRebindHook, 'hookKey', 'GANCHO'));
if (btnRebindInteract) btnRebindInteract.addEventListener('click', () => captureBinding(btnRebindInteract, 'interactKey', 'INTERACTUAR'));
if (btnRebindTravel) btnRebindTravel.addEventListener('click', () => captureBinding(btnRebindTravel, 'travelKey', 'VIAJE RÁPIDO'));
if (difficultySelect) difficultySelect.addEventListener('change', () => { gameSettings.difficulty = difficultySelect.value; saveProgress(); });
if (toggleShake) toggleShake.addEventListener('change', () => { gameSettings.screenShake = toggleShake.checked; saveProgress(); });
if (toggleFlashes) toggleFlashes.addEventListener('change', () => { gameSettings.flashes = toggleFlashes.checked; saveProgress(); });
const btnToggleGraphics = document.getElementById('btn-toggle-graphics');
if (btnToggleGraphics) {
  btnToggleGraphics.addEventListener('click', () => {
    if (typeof toggleGraphicsMode === 'function') {
      toggleGraphicsMode();
    }
  });
}
