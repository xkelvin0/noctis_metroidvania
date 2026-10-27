// =========================================================
// js/data/quests.js — Sistema Activo de Misiones, Logros y Memorias
// =========================================================

// Estado dinámico del rastreador de misiones
let questTracker = {
  kills: { bat: 0, skeleton: 0, armor: 0, summoner: 0, total: 0, elite: 0 },
  talkedNpcs: {},
  altars: {},
  secretsFound: 0,
  bossDefeated: false,
  claimed: {}
};

const ACHIEVEMENTS_DATA = [
  {
    id: 'cartographer',
    icon: '🗺️',
    title: 'Cartógrafo Carmesí',
    desc: 'Descubre el 100% de los salones de la Fortaleza de Véspera.',
    check: () => Object.keys(visitedRooms).length >= Object.keys(ROOM_DEFS).length
  },
  {
    id: 'slayer',
    icon: '👑',
    title: 'Fin del Eclipse',
    desc: 'Derrota a Lord Malakor y rompe la maldición de la sangre.',
    check: () => gameWon === true || questTracker.bossDefeated
  },
  {
    id: 'relic_master',
    icon: '🔮',
    title: 'Coleccionista de Sombras',
    desc: 'Encuentra las 3 Reliquias ancestrales (Dash, Doble Salto y Salto en Pared).',
    check: () => player.hasDash && player.hasDoubleJump && player.hasWallJump
  },
  {
    id: 'seal_master',
    icon: '🔴',
    title: 'Portador de los Cuatro Sellos',
    desc: 'Restaura los Sellos Carmesí, del Juramento, Astral y del Reloj.',
    check: () => allSealsRestored()
  },
  {
    id: 'parry_master',
    icon: '⚔️',
    title: 'Duelista Implacable',
    desc: 'Aumenta el filo de tu espada a 25 ATK o más en el Altar.',
    check: () => player.atk >= 25
  }
];

const MEMORIES_DATA = {
  carmesi: { title: 'La Promesa de Ceniza', text: 'Malakor juró proteger a Alaric cuando ambos eran niños, antes de que la sangre se convirtiera en una condena.' },
  juramento: { title: 'El Juramento Roto', text: 'Para detener la plaga, Malakor sacrificó a quienes le habían jurado lealtad. Aún escucha sus voces bajo el agua.' },
  astral: { title: 'La Noche de Cristal', text: 'Los astrónomos le ofrecieron una cura; Malakor eligió el Eclipse porque temía perder a su hermano.' },
  reloj: { title: 'El Tiempo Robado', text: 'El Guardián congeló el amanecer para ganar una noche más. Ese instante se prolongó durante un siglo.' }
};

const QUESTS_DATA = [
  {
    id: 'juramento_city', icon: '⚗️', title: 'Remedio del Enclave',
    desc: 'Recupera el Sello del Juramento y vuelve a hablar con el Alquimista Umbrío.', rewardEssence: 60,
    progress: () => [seals.juramento && questTracker.talkedNpcs['Alquimista Umbrío'] ? 1 : 0, 1]
  },
  {
    id: 'astral_city', icon: '🌟', title: 'Cartas del Firmamento',
    desc: 'Recupera el Sello Astral y conversa con Corvus en el Santuario.', rewardEssence: 70,
    progress: () => [seals.astral && questTracker.talkedNpcs['Astrónomo Mayor Corvus'] ? 1 : 0, 1]
  },
  {
    id: 'villa_city', icon: '🏮', title: 'Faroles de la Villa',
    desc: 'Restaura dos sellos y visita de nuevo la Posada del Farol Azul.', rewardEssence: 55,
    progress: () => [sealCount() >= 2 && questTracker.talkedNpcs['Posadera Greta'] ? 1 : 0, 1]
  },
  {
    id: 'relics',
    icon: '🔮',
    title: 'Herencia de la Sangre',
    desc: 'Recupera las 3 reliquias ancestrales de movimiento (Dash, Doble Salto, Garras de Muro).',
    rewardEssence: 75,
    progress: () => [
      (player.hasDash ? 1 : 0) + (player.hasDoubleJump ? 1 : 0) + (player.hasWallJump ? 1 : 0),
      3
    ]
  },
  {
    id: 'cities',
    icon: '🗣️',
    title: 'Voces del Refugio',
    desc: 'Habla con al menos 4 habitantes distintos de la Villa y puestos fronterizos.',
    rewardEssence: 50,
    progress: () => [
      Math.min(4, Object.keys(questTracker.talkedNpcs).length),
      4
    ]
  },
  {
    id: 'elites',
    icon: '🛡️',
    title: 'Cacería Vesperal',
    desc: 'Derrota a 3 enemigos pesados de élite (Armaduras centinelas o Invocadores).',
    rewardEssence: 80,
    progress: () => [
      Math.min(3, questTracker.kills.elite),
      3
    ]
  },
  {
    id: 'beasts',
    icon: '🦇',
    title: 'Purga de las Criptas',
    desc: 'Extermina a 8 criaturas malditas del Eclipse (esqueletos, murciélagos o armaduras).',
    rewardEssence: 60,
    progress: () => [
      Math.min(8, questTracker.kills.total),
      8
    ]
  },
  {
    id: 'altars',
    icon: '⚡',
    title: 'Llama del Santuario',
    desc: 'Descubre y consagra 3 Altares de Sangre a lo largo del reino.',
    rewardEssence: 70,
    progress: () => [
      Math.min(3, Object.keys(questTracker.altars).length),
      3
    ]
  },
  {
    id: 'secrets',
    icon: '👁️',
    title: 'Ecos en la Roca',
    desc: 'Descubre y rompe 2 pasajes secretos ocultos tras muros agrietados.',
    rewardEssence: 50,
    progress: () => [
      Math.min(2, questTracker.secretsFound),
      2
    ]
  },
  {
    id: 'malakor',
    icon: '👑',
    title: 'El Ocaso del Tirano',
    desc: 'Vence a Lord Malakor en el Santuario del Eclipse y pon fin a la noche eterna.',
    rewardEssence: 200,
    progress: () => [
      (gameWon || questTracker.bossDefeated) ? 1 : 0,
      1
    ]
  },
  {
    id: 'minor_relics', icon: '🧿', title: 'Talismanes de los Caídos',
    desc: 'Encuentra los tres amuletos menores ocultos en las salas opcionales.', rewardEssence: 100,
    progress: () => [(player.hasBloodFang ? 1 : 0) + (player.hasShadeThread ? 1 : 0) + (player.hasStarWard ? 1 : 0), 3]
  },
  {
    id: 'blood_build', icon: '🩸', title: 'Juramento de Sangre',
    desc: 'Invierte dos rangos en cualquier rama del árbol de magia.', rewardEssence: 80,
    progress: () => [Math.min(2, Object.values(player.magicTree || {}).reduce((sum, value) => sum + value, 0)), 2]
  },
  {
    id: 'return_home', icon: '🏮', title: 'Mensajero del Amanecer',
    desc: 'Tras recuperar dos sellos, habla con Greta, el Alquimista y Corvus.', rewardEssence: 120,
    progress: () => [sealCount() < 2 ? 0 : ['Posadera Greta', 'Alquimista Umbrío', 'Astrónomo Mayor Corvus'].filter(name => questTracker.talkedNpcs[name]).length, 3]
  }
];

// --- DISPARADORES Y REGISTRO EN TIEMPO REAL ---

function checkQuestNotifications(prevValues) {
  QUESTS_DATA.forEach((q, idx) => {
    const [cur, total] = q.progress();
    const prev = prevValues[idx] || 0;
    if (cur > prev) {
      if (cur >= total && prev < total) {
        if (typeof sfx === 'function') sfx('relic');
        if (typeof showBanner === 'function') {
          showBanner(`✦ ¡MISIÓN COMPLETADA! ${q.title.toUpperCase()} ✦ (Reclama +${q.rewardEssence} ♦ en Grimorio)`, 240);
        }
      } else {
        if (typeof showBanner === 'function') {
          showBanner(`✦ MISIÓN ACTUALIZADA: ${q.title} (${cur}/${total})`, 130);
        }
      }
    }
  });
}

function getQuestCurrentStates() {
  return QUESTS_DATA.map(q => q.progress()[0]);
}

function recordQuestKill(enemyType, isElite = false) {
  const prev = getQuestCurrentStates();
  questTracker.kills.total++;
  if (enemyType && questTracker.kills[enemyType] !== undefined) {
    questTracker.kills[enemyType]++;
  }
  if (isElite || enemyType === 'armor' || enemyType === 'summoner') {
    questTracker.kills.elite++;
  }
  checkQuestNotifications(prev);
}

function recordQuestTalk(npcName) {
  if (!npcName) return;
  const prev = getQuestCurrentStates();
  questTracker.talkedNpcs[npcName] = true;
  // También sincronizar con storyProgress.talkedHubs
  if (typeof storyProgress !== 'undefined' && storyProgress.talkedHubs) {
    storyProgress.talkedHubs[npcName] = true;
  }
  checkQuestNotifications(prev);
}

function recordQuestAltar(roomId) {
  const prev = getQuestCurrentStates();
  questTracker.altars[roomId] = true;
  checkQuestNotifications(prev);
}

function recordQuestWall() {
  const prev = getQuestCurrentStates();
  questTracker.secretsFound++;
  checkQuestNotifications(prev);
}

function recordQuestBoss() {
  const prev = getQuestCurrentStates();
  questTracker.bossDefeated = true;
  checkQuestNotifications(prev);
}

function isQuestClaimed(questId) {
  return !!questTracker.claimed[questId];
}

function claimQuestReward(questId) {
  const quest = QUESTS_DATA.find(q => q.id === questId);
  if (!quest || isQuestClaimed(questId)) return false;
  const [cur, total] = quest.progress();
  if (cur < total) return false;

  questTracker.claimed[questId] = true;
  if (typeof player !== 'undefined') {
    player.essence = (player.essence || 0) + quest.rewardEssence;
  }
  if (typeof sfx === 'function') sfx('orb');
  if (typeof showBanner === 'function') {
    showBanner(`✦ RECOMPENSA RECLAMADA: +${quest.rewardEssence} ♦ ESENCIA ✦`, 160);
  }
  if (typeof saveProgress === 'function') {
    saveProgress();
  }
  if (typeof updateQuestsUI === 'function') {
    updateQuestsUI();
  }
  return true;
}
