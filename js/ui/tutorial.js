// =========================================================
// js/ui/tutorial.js — Modal de Habilidades Desbloqueadas
// =========================================================

let isTutorialOpen = false;
const tutorialModal = document.getElementById('skill-tutorial-modal');
const tutBadge = document.getElementById('tut-badge');
const tutTitle = document.getElementById('tut-title');
const tutCommand = document.getElementById('tut-command');
const tutDesc = document.getElementById('tut-desc');
const tutTip = document.getElementById('tut-tip');
const btnCloseTutorial = document.getElementById('btn-close-tutorial');

const seenTutorials = {};

function showSkillTutorial(skillKey, force = false) {
  const data = TUTORIALS_DATA[skillKey];
  if (!data || !tutorialModal) return;
  if (!force && seenTutorials[skillKey]) return;
  seenTutorials[skillKey] = true;

  if (tutBadge) tutBadge.textContent = data.badge;
  if (tutTitle) tutTitle.textContent = data.title;
  if (tutCommand) tutCommand.textContent = data.command;
  if (tutDesc) tutDesc.textContent = data.desc;
  if (tutTip) tutTip.innerHTML = '💡 <strong>Consejo táctico:</strong> ' + data.tip;

  tutorialModal.classList.remove('hidden');
  isTutorialOpen = true;

  for (let k in keys) keys[k] = false;
  clearJustPressed();
}

function closeSkillTutorial() {
  if (!tutorialModal) return;
  tutorialModal.classList.add('hidden');
  isTutorialOpen = false;
  clearJustPressed();
}

if (btnCloseTutorial) {
  btnCloseTutorial.addEventListener('click', closeSkillTutorial);
}
