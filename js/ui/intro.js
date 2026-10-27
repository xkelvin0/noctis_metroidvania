// =========================================================
// js/ui/intro.js — Cinemática Introductoria / Prólogo
// =========================================================

const introScreen = document.getElementById('intro-screen');
const introBg = document.querySelector('.intro-bg');
const introSpeaker = document.getElementById('intro-speaker');
const introDialogText = document.getElementById('intro-dialog-text');
const btnSkipIntro = document.getElementById('btn-skip-intro');

const INTRO_DIALOGS = [
  {
    bg: "img/cinematics/intro_bg.jpg",
    speaker: "EL SUSURRO DE LA CENIZA",
    text: "La piedra del sepulcro cede con un quejido hueco... El aire entra en tus pulmones como agujas de escarcha. No hay canto de aves, ni viento, ni sol. Solo un silencio sepulcral."
  },
  {
    bg: "img/cinematics/intro_alaric.jpg",
    speaker: "ALARIC — EL DESPERTAR",
    text: "«¿Cuánto tiempo ha pasado?... Mis manos tiemblan. La carne me pesa como si hubiera dormido un siglo bajo tierra. Y este frío... mi sangre late con dolor, cristalizándose en las venas.»"
  },
  {
    bg: "img/cinematics/intro_bg.jpg",
    speaker: "ALARIC — EL DESPERTAR",
    text: "«En lo alto... el sol ha sido devorado por un disco negro sangrante. Malakor... hermano... ¿qué locura cometiste con este reino mientras yo dormía en estasis?»"
  },
  {
    bg: "img/cinematics/intro_villa.jpg",
    speaker: "ALARIC — EL DESPERTAR",
    text: "«A lo lejos, entre la niebla carmesí, distingo el débil tañido de una campana de plata y chimeneas encendidas. Hay supervivientes al pie de la montaña... Necesito respuestas antes de que mi corazón se congele.»"
  },
  {
    bg: "img/cinematics/intro_plaza.jpg",
    speaker: "EL ECO DEL ECLIPSE",
    text: "Tu sangre es la última llama viva de Véspera. Avanza hacia la luz de la villa... habla con aquellos que aún resisten y descubre qué le ocurrió al mundo."
  }
];

let introStep = 0;
let typewriterInterval = null;
let isTyping = false;
let currentFullText = "";

function startIntroCutscene() {
  introScreen.classList.remove('hidden');
  titleScreen.classList.add('hidden');
  introStep = 0;
  playIntroStep();
}

function playIntroStep() {
  if (introStep >= INTRO_DIALOGS.length) {
    finishIntroCutscene();
    return;
  }
  const d = INTRO_DIALOGS[introStep];
  if (introBg && d.bg) introBg.style.backgroundImage = `url('${d.bg}')`;
  introSpeaker.textContent = d.speaker;
  currentFullText = d.text;
  introDialogText.textContent = "";
  isTyping = true;
  clearInterval(typewriterInterval);

  let charIndex = 0;
  typewriterInterval = setInterval(() => {
    if (charIndex < currentFullText.length) {
      introDialogText.textContent += currentFullText[charIndex];
      charIndex++;
      if (charIndex % 3 === 0) sfx('orb');
    } else {
      clearInterval(typewriterInterval);
      isTyping = false;
    }
  }, 22);
}

function advanceIntro() {
  if (!introScreen || introScreen.classList.contains('hidden')) return;
  if (isTyping) {
    clearInterval(typewriterInterval);
    introDialogText.textContent = currentFullText;
    isTyping = false;
  } else {
    introStep++;
    playIntroStep();
  }
}

function finishIntroCutscene() {
  clearInterval(typewriterInterval);
  introScreen.classList.add('hidden');
  gameStarted = true;
  loadRoom(-2, 80, 200);
  setBgmMode('explore');
  sfx('relic');
  beginArrivalTutorial();
  showBanner("Adéntrate en la Villa: busca a los supervivientes y descubre la verdad del Eclipse", 280);
}

introScreen.addEventListener('click', (e) => {
  if (e.target.id !== 'btn-skip-intro') advanceIntro();
});

btnSkipIntro.addEventListener('click', (e) => {
  e.stopPropagation();
  finishIntroCutscene();
});

window.addEventListener('keydown', (e) => {
  if (introScreen && !introScreen.classList.contains('hidden')) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      advanceIntro();
    } else if (e.code === 'Escape') {
      e.preventDefault();
      finishIntroCutscene();
    }
  }
});
