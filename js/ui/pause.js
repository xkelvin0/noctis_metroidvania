// =========================================================
// js/ui/pause.js — Menú de Pausa / Grimorio de Alaric
// =========================================================

let isPaused = false;
const pauseMenu = document.getElementById('pause-menu');
const btnResume = document.getElementById('btn-resume');
const btnQuickResume = document.getElementById('btn-quick-resume');
const btnRestart = document.getElementById('btn-restart');
const btnToggleSound = document.getElementById('btn-toggle-sound');

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
  if (countBadge) countBadge.textContent = `${count} / ${RELICS_DATA.length} Reliquias`;
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
    if (done) completed++;
    return `<article class="quest-card ${done ? 'completed' : ''}"><h4>${done ? '✦' : '○'} ${quest.title}</h4><p>${quest.desc}</p><div class="quest-progress">${current}/${total} ${done ? '— COMPLETADA' : ''}</div></article>`;
  }).join('');
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
  const gap = 10;
  const cellW = Math.max(52, Math.min(82, (mw - 36 - (gridCols - 1) * gap) / gridCols));
  const cellH = Math.max(32, Math.min(48, (mh - 42 - (gridRows - 1) * gap) / gridRows));
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
    const zoneColor = ([11,12,18,19,20,28].includes(Number(id))) ? '#247b7b'
      : ([13,14,21,22,23,29].includes(Number(id))) ? '#4153a2'
      : ([15,16,24,25,26,30].includes(Number(id))) ? '#8a6930'
      : '#6c2850';

    if (isVisited) {
      const isCurrent = (Number(id) === currentRoomId);
      mctx.fillStyle = isCurrent ? '#ff0055' : zoneColor;
      mctx.fillRect(rx, ry, cellW, cellH);
      mctx.strokeStyle = isCurrent ? '#ffffff' : '#d7c7e8';
      mctx.lineWidth = isCurrent ? 3 : 1;
      mctx.strokeRect(rx, ry, cellW, cellH);
      mctx.textAlign = 'center';
      mctx.font = 'bold 12px monospace';
      mctx.fillStyle = '#ffffff';
      mctx.fillText(`#${id}`, rx + cellW / 2, ry + 16);
      const icons = [];
      if (rm.map.some(row => row.includes('S'))) icons.push('⚡');
      if (rm.spawns.some(s => s.type && s.type.startsWith('relic'))) icons.push('🔮');
      if (rm.spawns.some(s => s.type === 'boss')) icons.push('👑');
      if (Object.values(rm.doors || {}).some(d => d.requiresAllSeals || d.requiresAbility)) icons.push('⛓');
      mctx.font = '16px sans-serif';
      mctx.fillText(icons.join(' '), rx + cellW / 2, ry + cellH - 9);
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
      mctx.font = 'bold 11px monospace';
      mctx.fillText(`#${id}`, rx + cellW / 2, ry + cellH / 2 + 4);
    }
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
  if (percentElem) percentElem.textContent = `Exploración: ${Math.round((visitedCount / totalRooms) * 100)}% (${visitedCount}/${totalRooms} Salones)`;
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
      tooltip.innerHTML = `<strong>Sala ${roomId}: ${room.name}</strong>Carta adquirida · aún no explorada.`;
    } else {
      const points = [];
      if (room.map.some(row => row.includes('S'))) points.push('Altar de descanso');
      if (room.spawns.some(s => s.type && s.type.startsWith('relic'))) points.push('Reliquia');
      if (room.spawns.some(s => s.type === 'boss')) points.push('Jefe');
      if (Object.values(room.doors || {}).some(d => d.requiresAllSeals || d.requiresAbility)) points.push('Ruta bloqueada');
      tooltip.innerHTML = `<strong>Sala ${roomId}: ${room.name}</strong>${points.length ? points.join(' · ') : 'Sala de exploración'}`;
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
    updateBestiaryUI();
    updateAchievementsUI();
  }
}

btnResume.addEventListener('click', togglePause);
if (btnQuickResume) btnQuickResume.addEventListener('click', togglePause);
btnRestart.addEventListener('click', () => { togglePause(); damagePlayer(999, player.x); });
if (btnToggleSound) {
  btnToggleSound.addEventListener('click', () => {
    const muted = toggleMute();
    showBanner(muted ? "MÚSICA SILENCIADA (O)" : "MÚSICA ACTIVADA (O)", 90);
  });
}
const btnToggleGraphics = document.getElementById('btn-toggle-graphics');
if (btnToggleGraphics) {
  btnToggleGraphics.addEventListener('click', () => {
    if (typeof toggleGraphicsMode === 'function') {
      toggleGraphicsMode();
    }
  });
}
