// =============================================================================
// js/ui/pause/bestiary.js - Pestaña del Bestiario Gótico y Fichas de Monstruos
// Noctis: Metroidvania - Módulo de Bestiario del Grimorio
// =============================================================================

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
