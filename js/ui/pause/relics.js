// =============================================================================
// js/ui/pause/relics.js - Pestaña de Reliquias, Amuletos, Materiales y Árbol de Magia
// Noctis: Metroidvania - Módulo de Equipamiento del Grimorio
// =============================================================================

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
