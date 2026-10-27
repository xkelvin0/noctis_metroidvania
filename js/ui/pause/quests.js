// =============================================================================
// js/ui/pause/quests.js - Pestaña de Misiones, Memorias del Eclipse y Logros
// Noctis: Metroidvania - Módulo de Progresión y Recompensas del Grimorio
// =============================================================================

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

