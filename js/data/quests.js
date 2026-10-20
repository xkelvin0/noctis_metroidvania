// =========================================================
// js/data/quests.js — Logros, Misiones y Memorias
// =========================================================

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
    check: () => gameWon === true
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
  { id: 'relics', title: 'Herencia de la Sangre', desc: 'Recupera las tres reliquias ancestrales.', progress: () => [Number(player.hasDash) + Number(player.hasDoubleJump) + Number(player.hasWallJump), 3] },
  { id: 'cities', title: 'Voces del Reino', desc: 'Habla con un habitante de cada ciudad segura.', progress: () => [Object.keys(storyProgress.talkedHubs).length, 3] },
  { id: 'elites', title: 'Cacería Vesperal', desc: 'Derrota a tres enemigos de élite.', progress: () => [storyProgress.eliteKills, 3] }
];
