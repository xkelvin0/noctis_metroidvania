// =============================================================================
// js/entities.js - Estado del Juego, Sellos, Checkpoints y Carga de Salas
// Noctis: Metroidvania - Módulo Central de Entidades y Progresión
// =============================================================================

let currentRoomId = -2;
let visitedRooms = { '-2': true };
let bannerText = "";
let bannerTimer = 0;
let particles = [];
let projectiles = [];
let enemies = [];
let relics = [];
let essenceOrbs = [];
let heartPickups = [];
let materials = { ash: 0, bone: 0, crystal: 0, gear: 0, flower: 0 };
const MATERIALS_DATA = {
  ash: { name: 'Ceniza', icon: '◈', color: '#b8a9c9' }, bone: { name: 'Hueso Antiguo', icon: '☠', color: '#e9dfc5' },
  crystal: { name: 'Cristal Astral', icon: '✦', color: '#7de2ff' }, gear: { name: 'Engranaje Roto', icon: '⚙', color: '#d8b766' }, flower: { name: 'Flor Lunar', icon: '✿', color: '#e0aaff' }
};
let floatingTexts = [];
let screenShakeTimer = 0;
let shakeMagnitude = 0;
let hitStopTimer = 0;
let respawnFrames = 0;
let arrivalPromptLocked = false;
let arrivalGuideBeacon = false;
const ROOM_TRANSITION_DURATION = 150;
let roomTransition = {
  active: false,
  elapsed: 0,
  switched: false,
  direction: 'right',
  destination: null
};
let lastAltarRoom = -2;
let lastAltarX = 150;
let lastAltarY = 200;

let breakableWallHits = {}; // Key: "roomId_col_row" -> hits remaining (default 3)
let brokenWalls = {};       // Key: "roomId_col_row" -> boolean true


function addMaterial(type, amount = 1) {
  if (!MATERIALS_DATA[type]) return;
  materials[type] = (materials[type] || 0) + amount;
  floatingTexts.push({ text: `+${amount} ${MATERIALS_DATA[type].name}`, x: player.x - 8, y: player.y - 12, vy: -0.9, life: 35, color: MATERIALS_DATA[type].color });
}

function materialForCurrentZone() {
  const zone = typeof getRoomZone === 'function' ? getRoomZone(currentRoomId) : 'carmesi';
  return zone === 'juramento' ? 'bone' : zone === 'reloj' ? 'gear' : zone === 'astral' ? 'crystal' : 'ash';
}

function respawnAtLastAltar() {
  showBanner("✦ RESUCITADO EN EL ALTAR DE SANGRE ✦", 180);
  respawnFrames = 2;
  hitStopTimer = 0;
  player.dashTimer = 0;
  player.attackTimer = 0;
  player.attackCooldown = 0;
  player.castCooldown = 0;
  player.vx = 0;
  player.vy = 0;
  projectiles = [];
  particles = [];
  player.hp = player.maxHp;

  const saved = localStorage.getItem('noctis_save');
  if (saved) {
    try {
      const d = JSON.parse(saved);
      if (d.lastAltarRoom !== undefined && ROOM_DEFS[d.lastAltarRoom]) {
        lastAltarRoom = d.lastAltarRoom;
        lastAltarX = d.lastAltarX || 150;
        lastAltarY = d.lastAltarY || 200;
      }
    } catch(err) {}
  }

  loadRoom(lastAltarRoom, lastAltarX, lastAltarY);
  sfx('relic');
  spawnParticles(player.x + 6, player.y + 10, '#ffbe0b', 24);
  spawnParticles(player.x + 6, player.y + 10, '#00f5d4', 16);
}

let gameWon = false;
let seals = { carmesi: false, juramento: false, astral: false, reloj: false };
let storyProgress = { eliteKills: 0, eliteDefeated: {}, talkedHubs: {}, discoveredAltars: {}, secretRewards: {} };

const BOSS_IDENTITIES = {
  carmesi: { phaseName: 'Filo del Eclipse', color: '#ff0055', phaseTwo: 'Embiste dos veces y sus pilares arden con sangre.', arena: 'Brasas carmesíes' },
  juramento: { phaseName: 'Marea Profana', color: '#7cc7c1', phaseTwo: 'Las aguas consagradas irrumpen entre cada ataque.', arena: 'Marea de sal' },
  astral: { phaseName: 'Supernova Fracturada', color: '#7de2ff', phaseTwo: 'Invoca una lluvia de estrellas sobre la arena.', arena: 'Lluvia de cometas' },
  reloj: { phaseName: 'Última Campanada', color: '#d8b766', phaseTwo: 'Sus embestidas encadenadas aceleran el combate.', arena: 'Engranajes errantes' },
  malakor: { phaseName: 'Furia del Eclipse', color: '#ff0055', phaseTwo: 'Despliega las alas y desata todo el núcleo carmesí.', arena: 'Sangre del Eclipse' }
};
const BOSS_MEMORIES = {
  juramento: 'MEMORIA: La Abadesa inundó la cripta para ocultar el primer fragmento del Eclipse.',
  reloj: 'MEMORIA: El Cronista congeló la hora en que Malakor robó la luz del cielo.',
  astral: 'MEMORIA: El Serafín vio la grieta del Eclipse y la escondió entre constelaciones.',
  carmesi: 'MEMORIA: El Caballero aceptó la sangre de Malakor para proteger a los suyos.'
};

const BOSS_ATTACK_ORDERS = {
  carmesi: [[0, 1, 2], [0, 1, 2, 3]],
  juramento: [[2, 0, 1], [2, 4, 0, 2, 1]],
  astral: [[0, 1, 2], [3, 0, 3, 1]],
  reloj: [[1, 0, 2], [1, 3, 0, 1]],
  malakor: [[0, 1, 2], [0, 1, 2, 3]]
};
let purchasedMaps = {};
let gameSettings = { showObjectiveMarker: true, leftKey: 'a', rightKey: 'd', downKey: 's', castKey: 'q', hookKey: 'f', interactKey: 'e', travelKey: 't' };

function isRoomTransitionActive() {
  return roomTransition.active;
}

function startRoomTransition(id, spawnX, spawnY, direction = 'right') {
  if (roomTransition.active || !ROOM_DEFS[id]) return false;

  player.vx = 0;
  player.vy = 0;
  roomTransition = {
    active: true,
    elapsed: 0,
    switched: false,
    direction,
    destination: { id, spawnX, spawnY }
  };
  return true;
}

function updateRoomTransition(deltaMs) {
  if (!roomTransition.active) return;

  roomTransition.elapsed = Math.min(ROOM_TRANSITION_DURATION, roomTransition.elapsed + deltaMs);
  if (!roomTransition.switched && roomTransition.elapsed >= ROOM_TRANSITION_DURATION / 2) {
    const { id, spawnX, spawnY } = roomTransition.destination;
    loadRoom(id, spawnX, spawnY);
    roomTransition.switched = true;
  }

  if (roomTransition.elapsed >= ROOM_TRANSITION_DURATION) {
    roomTransition.active = false;
    roomTransition.destination = null;
  }
}

const MAP_REGIONS = {
  villa: { name: 'Villa Refugio, Sendero de Ceniza y Fortaleza Carmesí', roomIds: [-2, -1, 0, 31, 32, 33, ...Array.from({ length: 8 }, (_, index) => 101 + index), 1, 2, 3, 4, 5, 6, 7, 8, 17, 27, ...Array.from({ length: 20 }, (_, index) => 1001 + index)] },
  juramento: { name: 'Enclave Subterráneo y Catacumbas', roomIds: [9, 34, 35, ...Array.from({ length: 5 }, (_, index) => 41 + index), 11, 12, 18, 19, 20, 28, ...Array.from({ length: 24 }, (_, index) => 201 + index)] },
  astral: { name: 'Santuario Astral y Observatorio', roomIds: [10, 36, 37, ...Array.from({ length: 5 }, (_, index) => 51 + index), 13, 14, 21, 22, 23, 29, ...Array.from({ length: 24 }, (_, index) => 501 + index)] },
  reloj: { name: 'Jardines del Reloj Muerto', roomIds: [...Array.from({ length: 5 }, (_, index) => 46 + index), 15, 16, 24, 25, 26, 30, ...Array.from({ length: 24 }, (_, index) => 401 + index)] }
};

function hasMapForRoom(roomId) {
  return Object.entries(MAP_REGIONS).some(([regionId, region]) =>
    purchasedMaps[regionId] && region.roomIds.includes(Number(roomId))
  );
}

function getObjectiveTargetRoom() {
  if (!player.hasDash) return 104;
  if (!player.hasDoubleJump) return 213;
  if (!seals.juramento) return 12;
  if (!player.hasWallJump) return 413;
  if (!seals.reloj) return 16;
  if (!seals.astral) return 14;
  if (!seals.carmesi) return 17;
  return 5;
}

function sealCount() {
  return Object.values(seals).filter(Boolean).length;
}

function allSealsRestored() {
  return sealCount() === Object.keys(seals).length;
}

const FORGE_UPGRADES = {
  '1': { label: '+5 ATK', cost: 60, buy: () => { player.atk += 5; } },
  '2': { label: '+6 alcance', cost: 65, buy: () => { player.attackReach = Math.min(18, player.attackReach + 6); } },
  '3': { label: '+10 magia', cost: 70, buy: () => { player.spellPower += 10; } },
  '4': { label: '-2 coste de hechizo', cost: 55, buy: () => { player.spellEfficiency = Math.min(6, player.spellEfficiency + 2); } },
  '5': { label: '+10 curación de corazones', cost: 50, buy: () => { player.healBonus = Math.min(40, player.healBonus + 10); } },
  '6': { label: '-5 recarga de dash', cost: 60, buy: () => { player.dashRecovery = Math.min(20, player.dashRecovery + 5); } }
};

function defeatBoss(boss) {
  if (boss.isFinal) {
    gameWon = true;
    if (typeof recordQuestBoss === 'function') recordQuestBoss();
    setBgmMode('explore');
    sfx('relic');
    triggerShake(35, 7);
    triggerHitStop(14);
    showBanner("¡LORD MALAKOR PURIFICADO! EL SOL RENACE SOBRE VÉSPERA", 400);

    // Dropeo especial de victoria
    relics.push({
      type: 'sun_heart',
      name: 'Corazón del Sol Renacido',
      x: boss.x + boss.w / 2 - 7,
      y: boss.y + 10,
      w: 14, h: 14
    });
    for (let k = 0; k < 30; k++) {
      essenceOrbs.push({
        x: boss.x + boss.w / 2, y: boss.y + boss.h / 2,
        w: 5, h: 5,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 5 - 2,
        val: 5
      });
    }
    for (let k = 0; k < 4; k++) {
      heartPickups.push({
        x: boss.x + boss.w / 2 + (k - 2) * 12,
        y: boss.y + boss.h / 2,
        w: 8, h: 8,
        vx: (Math.random() - 0.5) * 3,
        vy: -3.5,
        heal: 35
      });
    }
    saveProgress();
    setTimeout(() => showBanner(BOSS_MEMORIES[boss.sealId] || 'MEMORIA DEL ECLIPSE RECUPERADA.', 300), 320);
    return;
  }

  if (boss.sealId && !seals[boss.sealId]) {
    seals[boss.sealId] = true;
    addMaterial(materialForCurrentZone(), 5);
    sfx('relic');
    showBanner(`✦ SELLO ${boss.sealName.toUpperCase()} RESTAURADO (${sealCount()}/4) · MEMORIA DESBLOQUEADA ✦`, 260);
    saveProgress();
  }
}

let bannerSpeaker = '';
let dialoguePages = [];
let dialoguePageIndex = 0;

function paginateDialogueText(text, maxCharsPerLine = 52, maxLinesPerPage = 2) {
  if (!text) return [['']];
  const words = text.trim().split(/\s+/);
  const pages = [];
  let currentLines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? (currentLine + ' ' + word) : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) currentLines.push(currentLine);
      currentLine = word;
      if (currentLines.length >= maxLinesPerPage) {
        pages.push(currentLines);
        currentLines = [];
      }
    }
  }
  if (currentLine) currentLines.push(currentLine);
  if (currentLines.length > 0) pages.push(currentLines);

  return pages.length > 0 ? pages : [['']];
}

function showBanner(txt, duration = 150, speaker = '') {
  bannerText = txt;
  bannerSpeaker = speaker || '';
  if (speaker) {
    bannerTimer = 999999; // Diálogos de NPCs no expiran por tiempo: permanecen hasta presionar 'E'
    dialoguePages = paginateDialogueText(txt, 52, 2);
    dialoguePageIndex = 0;
  } else {
    bannerTimer = duration;
    dialoguePages = [];
    dialoguePageIndex = 0;
  }
}

function beginArrivalTutorial() {
  arrivalPromptLocked = true;
  arrivalGuideBeacon = true;
}

function closeBanner() {
  bannerTimer = 0;
  bannerText = '';
  bannerSpeaker = '';
  dialoguePages = [];
  dialoguePageIndex = 0;
}
if (typeof window !== 'undefined') {
  window.showBanner = showBanner;
  window.closeBanner = closeBanner;
  window.paginateDialogueText = paginateDialogueText;
}

function saveProgress() {
  const data = {
    roomId: currentRoomId,
    x: player.x,
    y: player.y,
    lastAltarRoom,
    lastAltarX,
    lastAltarY,
    hasDash: player.hasDash,
    hasDoubleJump: player.hasDoubleJump,
    hasWallJump: player.hasWallJump,
    hasAstralEye: player.hasAstralEye,
    hasParryBrooch: player.hasParryBrooch,
    hasBloodFang: player.hasBloodFang,
    hasShadeThread: player.hasShadeThread,
    hasStarWard: player.hasStarWard,
    equippedAmulets: player.equippedAmulets,
    magicTree: player.magicTree,
    amuletSlotBonus: player.amuletSlotBonus,
    nextSpellBonus: player.nextSpellBonus,
    hasHook: player.hasHook,
    hasMist: player.hasMist,
    hasDive: player.hasDive,
    essence: player.essence,
    maxHp: player.maxHp,
    atk: player.atk,
    hpUpgrades: player.hpUpgrades,
    atkUpgrades: player.atkUpgrades,
    attackReach: player.attackReach,
    spellPower: player.spellPower,
    spellEfficiency: player.spellEfficiency,
    dashRecovery: player.dashRecovery,
    healBonus: player.healBonus,
    brokenWalls,
    shopInventoryState,
    materials,
    purchasedMaps,
    gameSettings,
    visitedRooms,
    seals,
    gameWon,
    storyProgress,
    questTracker: (typeof questTracker !== 'undefined' ? questTracker : undefined),
    bestiaryKills: (typeof bestiaryKills !== 'undefined' ? bestiaryKills : {}),
    bestiaryMastery: (typeof bestiaryMastery !== 'undefined' ? bestiaryMastery : {})
  };
  localStorage.setItem('noctis_save', JSON.stringify(data));
  const continueBtn = document.getElementById('btn-continue');
  if (continueBtn) continueBtn.classList.remove('disabled');
}

function getCitySealDialogue(roomId, baseDialog) {
  const sealsNow = sealCount();
  if (!sealsNow) return baseDialog;
  const city = [9, 34, 35].includes(Number(roomId)) ? 'enclave'
    : [10, 36, 37].includes(Number(roomId)) ? 'santuario' : 'villa';
  const reactions = {
    villa: ['«La villa contiene la respiración; una luz ha vuelto a encenderse.»', '«Los faroles arden más tiempo desde que luchas por nosotros.»', '«Ya no hablamos de sobrevivir: hablamos del amanecer.»', '«¡Escucha! Por primera vez los niños no temen la noche.»'],
    enclave: ['«El agua se ha calmado. Los juramentos ya no gritan bajo el pozo.»', '«La sal dejó de sangrar. Algo se está reparando en las catacumbas.»', '«Los caballeros han vuelto a pronunciar sus nombres.»', '«El Enclave abre sus compuertas: no hay nada que ocultar al alba.»'],
    santuario: ['«Una constelación ha vuelto a dibujarse sobre la torre.»', '«Los prismas cantan; la grieta del Eclipse se está cerrando.»', '«Corvus dice que las estrellas ya recuerdan el camino a casa.»', '«El Observatorio prepara una señal para recibir el primer sol.»']
  };
  return `${baseDialog} ${reactions[city][Math.min(3, sealsNow - 1)]}`;
}

function loadRoom(id, spawnX, spawnY) {
  currentRoomId = id;
  visitedRooms[id] = true;
  player.vx = 0;
  player.vy = 0;
  if (spawnX !== undefined) player.x = spawnX;
  if (spawnY !== undefined) player.y = spawnY;
  snapToGround(player);
  enemies = [];
  projectiles = [];
  relics = [];
  essenceOrbs = [];
  heartPickups = [];

  const def = ROOM_DEFS[id];
  showBanner(def.name, 110);
  const cityRoom = [-2, -1, 0, 31, 32, 33, 9, 34, 35, 10, 36, 37].includes(Number(id));
  if (cityRoom && sealCount() > 0) {
    const mood = sealCount() === 4 ? 'LAS CIUDADES CELEBRAN: LOS 4 SELLOS HAN SIDO RESTAURADOS' : `LA CIUDAD HA CAMBIADO TRAS EL SELLO ${sealCount()}/4`;
    setTimeout(() => showBanner(mood, 150), 120);
  }

  // La música de jefe solo se activa en arenas con un enemigo activo.
  if (typeof setBgmMode === 'function') {
    const activeBoss = def.spawns.some(s => s.type === 'boss' && !gameWon && (!s.sealId || !seals[s.sealId]) && (!s.isFinal || allSealsRestored()));
    setBgmMode(activeBoss ? 'boss' : 'explore');
  }

  for (const s of def.spawns) {
    if (s.type === 'material_node') {
      const nodeKey = `${id}_${s.x}_${s.y}`;
      storyProgress.collectedNodes = storyProgress.collectedNodes || {};
      if (!storyProgress.collectedNodes[nodeKey]) relics.push({ type: 'materialnode', material: s.material, nodeKey, name: `Nodo de ${MATERIALS_DATA[s.material].name}`, x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'relic_dash' && !player.hasDash) {
      relics.push({ type: 'dash', name: 'Botas de Ceniza (Dash Sombrío [K / C])', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'relic_doublejump' && !player.hasDoubleJump) {
      relics.push({ type: 'doublejump', name: 'Pluma del Cuervo (Doble Salto)', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'relic_walljump' && !player.hasWallJump) {
      relics.push({ type: 'walljump', name: 'Garras de Gárgola (Salto en Pared)', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'relic_parrybrooch' && !player.hasParryBrooch) {
      relics.push({ type: 'parrybrooch', name: 'Broche del Contraataque (Parry)', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'minor_bloodfang' && !player.hasBloodFang) {
      relics.push({ type: 'bloodfang', name: 'Colmillo de la Herida', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'minor_shadethread' && !player.hasShadeThread) {
      relics.push({ type: 'shadethread', name: 'Hilo de Sombra', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'minor_starward' && !player.hasStarWard) {
      relics.push({ type: 'starward', name: 'Vigilia Estelar', x: s.x, y: s.y, w: 14, h: 14 });
    } else if (s.type === 'citizen' || s.type === 'guard') {
      const isGuard = s.type === 'guard' || !!s.isGuard || (s.name || '').toLowerCase().includes('guardia') || 
        (s.name || '').toLowerCase().includes('centinela') || (s.name || '').toLowerCase().includes('vigía') || 
        (s.name || '').toLowerCase().includes('capitán') || (s.name || '').toLowerCase().includes('ballestero') || 
        (s.name || '').toLowerCase().includes('sargento') || (s.name || '').toLowerCase().includes('paladín');
      const npc = {
        type: 'citizen', isGuard: isGuard, name: s.name, dialog: cityRoom ? getCitySealDialogue(id, s.dialog) : s.dialog, x: s.x, y: s.y,
        w: isGuard ? 14 : 12, h: 22,
        vx: isGuard ? 0 : (s.dir || 1) * 0.38, vy: 0, hp: 999, maxHp: 999, dir: s.dir || 1,
        walkTimer: isGuard ? 999999 : (70 + Math.random() * 50), isFriendly: true, hurtTimer: 0,
        stationary: !!s.stationary,
        blocksPassage: !!s.blocksPassage, blockUntilAbility: s.blockUntilAbility || null
      };
      snapToGround(npc);
      enemies.push(npc);
    } else if (s.type === 'skeleton') {
      const sk = {
        type: 'skeleton', x: s.x, y: s.y, w: 14, h: 22,
        vx: 0.7, vy: 0, hp: 30, maxHp: 30, dir: -1,
        attackTelegraph: 0, lungeTimer: 0, hurtTimer: 0
      };
      snapToGround(sk);
      enemies.push(sk);
    } else if (s.type === 'bat') {
      enemies.push({
        type: 'bat', x: s.x, y: s.y, baseY: s.y, w: 14, h: 12,
        vx: 0, vy: 0, hp: 20, maxHp: 20, active: false, t: Math.random() * 6, hurtTimer: 0
      });
    } else if (s.type === 'armor') {
      const arm = {
        type: 'armor', x: s.x, y: s.y, w: 18, h: 26,
        vx: 0.4, vy: 0, hp: s.elite ? 110 : 65, maxHp: s.elite ? 110 : 65, dir: -1, hurtTimer: 0, elite: !!s.elite, name: s.name
      };
      snapToGround(arm);
      enemies.push(arm);
    } else if (['archer', 'bomber', 'summoner', 'shield', 'duelist', 'trapper', 'beast', 'specter'].includes(s.type)) {
      enemies.push({
        type: s.type, x: s.x, y: s.y, baseY: s.y, w: 16, h: 22,
        vx: 0, vy: 0, hp: s.type === 'beast' ? 80 : 45, maxHp: s.type === 'beast' ? 80 : 45, dir: -1, hurtTimer: 0,
        actionTimer: 75, elite: !!s.elite, name: s.name, baseX: s.x
      });
    } else if (s.type === 'boss' && !gameWon && (!s.sealId || !seals[s.sealId]) && (!s.isFinal || allSealsRestored())) {
      const bossId = s.isFinal ? 'malakor' : (s.sealId || 'carmesi');
      const identity = BOSS_IDENTITIES[bossId];
      enemies.push({
        type: 'boss', name: s.name,
        x: s.x, y: s.y, w: 24, h: 36,
        vx: 0, vy: 0, hp: s.hp || 180, maxHp: s.hp || 180, dir: -1,
        phaseTimer: 80, pattern: 0, attackStep: -1, attackOrder: BOSS_ATTACK_ORDERS[bossId], hurtTimer: 0, pillars: [],
        sealId: s.sealId, sealName: s.sealName, isFinal: !!s.isFinal,
        bossId, bossColor: identity.color, phaseName: identity.phaseName, phaseDescription: identity.phaseTwo,
        entryTimer: 75, arenaTimer: 130, arenaName: identity.arena
      });
      setTimeout(() => {
        sfx('boss_entry');
        showBanner(`⚔ ${s.name.toUpperCase()} EMERGE EN LA ARENA ⚔`, 105);
        spawnParticles(s.x + 12, s.y + 18, identity.color, 28);
      }, 90);
    }
  }

  const travelerRooms = sealCount() >= 3 ? [10, 36] : (sealCount() >= 1 ? [9, 34] : [-2, 31]);
  if (travelerRooms.includes(Number(id))) {
    const traveler = { type: 'citizen', isGuard: false, isFriendly: true, name: 'Viajero de los Sellos', dialog: `«He seguido la luz de tus ${sealCount()} sello(s). La siguiente ciudad ya conoce tu nombre.»`, x: 430, y: 200, w: 12, h: 22, vx: 0, vy: 0, dir: -1, walkTimer: 999999, hp: 999, maxHp: 999, hurtTimer: 0 };
    snapToGround(traveler);
    enemies.push(traveler);
  }
}
