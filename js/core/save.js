// =============================================================================
// js/core/save.js - Gestión de Pantalla de Inicio, Guardado y Continuación
// Noctis: Metroidvania - Núcleo de Estado de Partida
// =============================================================================

let gameStarted = false;
const titleScreen = document.getElementById('title-screen');
const btnNewGame = document.getElementById('btn-new-game');
const btnContinue = document.getElementById('btn-continue');

const savedDataCheck = localStorage.getItem('noctis_save');
if (savedDataCheck && btnContinue) {
  btnContinue.classList.remove('disabled');
}

if (btnNewGame) {
  btnNewGame.addEventListener('click', () => {
    initAudio();
    localStorage.removeItem('noctis_save');
    player.hasDash = false;
    player.hasDoubleJump = false;
    player.hasWallJump = false;
    player.hasAstralEye = false;
    player.hasParryBrooch = false;
    player.hasBloodFang = false;
    player.hasShadeThread = false;
    player.hasStarWard = false;
    player.equippedAmulets = [];
    player.magicTree = { blood: 0, shadow: 0, astro: 0 };
    player.amuletSlotBonus = 0;
    player.nextSpellBonus = 0;
    player.hasHook = false;
    player.hasMist = false;
    player.hasDive = false;
    player.essence = 0;
    player.maxHp = 100;
    player.hp = 100;
    player.atk = 15;
    player.hpUpgrades = 0;
    player.atkUpgrades = 0;
    player.attackReach = 0;
    player.spellPower = 0;
    player.spellEfficiency = 0;
    player.dashRecovery = 0;
    player.healBonus = 0;

    if (typeof questTracker !== 'undefined') {
      questTracker = {
        kills: { bat: 0, skeleton: 0, armor: 0, summoner: 0, total: 0, elite: 0 },
        talkedNpcs: {},
        altars: {},
        secretsFound: 0,
        bossDefeated: false,
        claimed: {}
      };
    }

    if (typeof bestiaryKills !== 'undefined') bestiaryKills = {};
    if (typeof bestiaryMastery !== 'undefined') bestiaryMastery = {};

    seals = { carmesi: false, juramento: false, astral: false, reloj: false };
    storyProgress = { eliteKills: 0, eliteDefeated: {}, talkedHubs: {}, discoveredAltars: {} };
    purchasedMaps = {};
    materials = { ash: 0, bone: 0, crystal: 0, gear: 0, flower: 0 };
    gameSettings = { showObjectiveMarker: true, leftKey: 'a', rightKey: 'd', downKey: 's', castKey: 'q', hookKey: 'f', interactKey: 'e', travelKey: 't' };
    visitedRooms = { '-2': true };
    brokenWalls = {};
    breakableWallHits = {};
    shopInventoryState = {};
    gameWon = false;

    startIntroCutscene();
  });
}

if (btnContinue) {
  btnContinue.addEventListener('click', () => {
    const currentSave = localStorage.getItem('noctis_save');
    if (!currentSave) return;
    initAudio();
    const d = JSON.parse(currentSave);

    player.hasDash = !!d.hasDash;
    player.hasDoubleJump = !!d.hasDoubleJump;
    player.hasWallJump = !!d.hasWallJump;
    player.hasAstralEye = !!d.hasAstralEye;
    player.hasParryBrooch = !!d.hasParryBrooch;
    player.hasBloodFang = !!d.hasBloodFang;
    player.hasShadeThread = !!d.hasShadeThread;
    player.hasStarWard = !!d.hasStarWard;
    player.equippedAmulets = d.equippedAmulets || [];
    player.magicTree = { blood: 0, shadow: 0, astro: 0, ...(d.magicTree || {}) };
    player.amuletSlotBonus = d.amuletSlotBonus || 0;
    player.nextSpellBonus = d.nextSpellBonus || 0;
    player.hasHook = !!d.hasHook;
    player.hasMist = !!d.hasMist;
    player.hasDive = !!d.hasDive;
    player.essence = d.essence || 0;
    player.maxHp = d.maxHp || 100;
    player.hp = player.maxHp;
    player.atk = d.atk || 15;
    player.hpUpgrades = d.hpUpgrades || 0;
    player.atkUpgrades = d.atkUpgrades || 0;
    player.attackReach = d.attackReach || 0;
    player.spellPower = d.spellPower || 0;
    player.spellEfficiency = d.spellEfficiency || 0;
    player.dashRecovery = d.dashRecovery || 0;
    player.healBonus = d.healBonus || 0;

    brokenWalls = d.brokenWalls || {};
    shopInventoryState = d.shopInventoryState || {};
    purchasedMaps = d.purchasedMaps || {};
    materials = { ash: 0, bone: 0, crystal: 0, gear: 0, flower: 0, ...(d.materials || {}) };
    gameSettings = { showObjectiveMarker: true, ...(d.gameSettings || {}) };
    breakableWallHits = {};
    visitedRooms = d.visitedRooms || { 1: true };
    seals = { carmesi: false, juramento: false, astral: false, reloj: false, ...(d.seals || {}) };
    storyProgress = { eliteKills: 0, eliteDefeated: {}, talkedHubs: {}, discoveredAltars: {}, ...(d.storyProgress || {}) };

    if (d.questTracker && typeof questTracker !== 'undefined') {
      questTracker = d.questTracker;
    }
    if (d.bestiaryKills && typeof bestiaryKills !== 'undefined') {
      bestiaryKills = d.bestiaryKills;
    }
    if (d.bestiaryMastery && typeof bestiaryMastery !== 'undefined') {
      bestiaryMastery = d.bestiaryMastery;
    }
    if (d.lastAltarRoom !== undefined && typeof lastAltarRoom !== 'undefined') {
      lastAltarRoom = d.lastAltarRoom;
      lastAltarX = d.lastAltarX || 150;
      lastAltarY = d.lastAltarY || 200;
    }
    gameWon = !!d.gameWon;

    loadRoom(d.roomId, d.x, d.y);
    if (titleScreen) titleScreen.classList.add('hidden');
    gameStarted = true;
    setBgmMode('explore');
  });
}

