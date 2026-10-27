// =============================================================================
// js/ui/pause.js — Menú de Pausa / Grimorio de Alaric (Coordinador de Pestañas)
// Noctis: Metroidvania - Orquestador del Menú de Pausa
// =============================================================================

let isPaused = false;
const pauseMenu = document.getElementById('pause-menu');
const btnResume = document.getElementById('btn-resume');
const btnQuickResume = document.getElementById('btn-quick-resume');
const btnRestart = document.getElementById('btn-restart');
const btnSaveGame = document.getElementById('btn-save-game');

// --- Pestañas del Grimorio ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const targetId = btn.getAttribute('data-tab');
    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add('active');
    if (targetId === 'tab-map' && typeof renderLargeMap === 'function') renderLargeMap();
    if (targetId === 'tab-relics' && typeof updateRelicsUI === 'function') updateRelicsUI();
    if (targetId === 'tab-quests' && typeof updateQuestsUI === 'function') updateQuestsUI();
    if (targetId === 'tab-bestiary' && typeof updateBestiaryUI === 'function') updateBestiaryUI();
    if (targetId === 'tab-achievements' && typeof updateAchievementsUI === 'function') updateAchievementsUI();
  });
});

function switchPauseTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  const pane = document.getElementById(tabId);
  if (pane) pane.classList.add('active');
  if (tabId === 'tab-map' && typeof renderLargeMap === 'function') renderLargeMap();
  if (tabId === 'tab-relics' && typeof updateRelicsUI === 'function') updateRelicsUI();
  if (tabId === 'tab-quests' && typeof updateQuestsUI === 'function') updateQuestsUI();
  if (tabId === 'tab-bestiary' && typeof updateBestiaryUI === 'function') updateBestiaryUI();
  if (tabId === 'tab-achievements' && typeof updateAchievementsUI === 'function') updateAchievementsUI();
}

function togglePause(targetTab) {
  if (typeof isRoomTransitionActive === 'function' && isRoomTransitionActive()) {
    return;
  }
  if (typeof isShopOpen === 'function' && isShopOpen()) {
    closeShop();
    return;
  }
  if (typeof isTutorialOpen !== 'undefined' && isTutorialOpen) {
    closeSkillTutorial();
    return;
  }

  if (targetTab) {
    if (!isPaused) {
      isPaused = true;
      if (pauseMenu) pauseMenu.classList.remove('hidden');
      if (typeof keys !== 'undefined') for (let k in keys) keys[k] = false;
      if (typeof clearJustPressed === 'function') clearJustPressed();
    }
    switchPauseTab(targetTab);
    return;
  }

  isPaused = !isPaused;
  if (pauseMenu) pauseMenu.classList.toggle('hidden', !isPaused);

  if (isPaused) {
    if (typeof keys !== 'undefined') for (let k in keys) keys[k] = false;
    if (typeof clearJustPressed === 'function') clearJustPressed();
    if (typeof renderLargeMap === 'function') renderLargeMap();
    if (typeof updateRelicsUI === 'function') updateRelicsUI();
    if (typeof updateQuestsUI === 'function') updateQuestsUI();
    if (typeof updateBestiaryUI === 'function') updateBestiaryUI();
    if (typeof updateAchievementsUI === 'function') updateAchievementsUI();
    if (typeof updateObjectiveButton === 'function') updateObjectiveButton();
    if (typeof syncAudioOptions === 'function') syncAudioOptions();
  }
}

// Botones de acción principales del Grimorio
if (btnResume) btnResume.addEventListener('click', togglePause);
if (btnQuickResume) btnQuickResume.addEventListener('click', togglePause);

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

if (btnRestart) {
  btnRestart.addEventListener('click', () => { 
    togglePause(); 
    if (typeof respawnAtLastAltar === 'function') {
      respawnAtLastAltar();
    } else {
      damagePlayer(999, player.x); 
    }
  });
}
