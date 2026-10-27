// =============================================================================
// js/ui/pause/bestiary.js - Pestaña del Bestiario Gótico y Diario del Cazador
// Noctis: Metroidvania - Módulo de Bestiario, Progreso de Bajas y Recompensas
// =============================================================================

let selectedMonsterId = 'skeleton';

function updateBestiaryUI() {
  const sidebar = document.getElementById('bestiary-list');
  const detail = document.getElementById('bestiary-detail');
  if (!sidebar || !detail) return;

  // Actualizar contador global de especies dominadas en la cabecera
  const badgeHeader = document.querySelector('#tab-bestiary .stat-badge');
  const masteredCount = BESTIARY_DATA.filter(x => typeof hasBestiaryMastery === 'function' && hasBestiaryMastery(x.id)).length;
  if (badgeHeader) {
    badgeHeader.innerHTML = `📖 ${masteredCount}/${BESTIARY_DATA.length} Especies Dominadas`;
    if (masteredCount > 0) {
      badgeHeader.classList.add('mastered-glow');
    }
  }

  sidebar.innerHTML = '';
  BESTIARY_DATA.forEach(m => {
    const kills = (typeof bestiaryKills !== 'undefined' && bestiaryKills[m.id]) ? bestiaryKills[m.id] : 0;
    const quota = m.killQuota || 5;
    const isMastered = typeof hasBestiaryMastery === 'function' && hasBestiaryMastery(m.id);

    const btn = document.createElement('button');
    btn.className = `bestiary-btn ${m.id === selectedMonsterId ? 'active' : ''} ${isMastered ? 'mastered' : ''}`;
    btn.innerHTML = `
      <span class="bestiary-btn-name">${m.icon} ${m.name}</span>
      <span class="hunter-sidebar-badge ${isMastered ? 'mastered' : ''}">
        ${isMastered ? '✦ ' : ''}${Math.min(kills, quota)}/${quota}
      </span>
    `;
    btn.addEventListener('click', () => { selectedMonsterId = m.id; updateBestiaryUI(); });
    sidebar.appendChild(btn);
  });

  const m = BESTIARY_DATA.find(x => x.id === selectedMonsterId) || BESTIARY_DATA[0];
  const kills = (typeof bestiaryKills !== 'undefined' && bestiaryKills[m.id]) ? bestiaryKills[m.id] : 0;
  const quota = m.killQuota || 5;
  const pct = Math.min(100, Math.round((kills / quota) * 100));
  const isMastered = typeof hasBestiaryMastery === 'function' && hasBestiaryMastery(m.id);

  detail.innerHTML = `
    <div class="monster-header">
      <div class="monster-avatar ${isMastered ? 'mastered' : ''}">${m.icon}</div>
      <div class="monster-info">
        <h4>${m.name}</h4>
        <span>${m.title}</span>
      </div>
      <div class="monster-habitat-tag">📍 ${m.habitat || 'Fortaleza Carmesí'}</div>
    </div>

    <!-- Diario de Caza: Progreso de Bajas -->
    <div class="hunter-progress-box">
      <div class="hunter-progress-header">
        <span class="hunter-progress-label">⚔️ REGISTRO DE CAZA:</span>
        <span class="hunter-progress-ratio ${isMastered ? 'mastered' : ''}">${kills} / ${quota} bajas registradas (${pct}%)</span>
      </div>
      <div class="hunter-bar-bg">
        <div class="hunter-bar-fill ${isMastered ? 'mastered' : ''}" style="width: ${pct}%"></div>
      </div>
    </div>

    <!-- Bono Pasivo Permanente por Maestría -->
    <div class="hunter-reward-card ${isMastered ? 'unlocked' : 'locked'}">
      <div class="reward-card-header">
        <span class="reward-card-icon">${isMastered ? '✦' : '🔒'}</span>
        <span class="reward-card-title">${isMastered ? 'MAESTRÍA DE CAZA ACTIVA' : 'RECOMPENSA DE CAZA'} — <strong>${m.reward.title}</strong></span>
        <span class="reward-status-pill ${isMastered ? 'active' : 'locked'}">
          ${isMastered ? '✓ ACTIVO PERMANENTE' : `Faltan ${Math.max(0, quota - kills)} bajas`}
        </span>
      </div>
      <p class="reward-desc">${m.reward.desc}</p>
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
