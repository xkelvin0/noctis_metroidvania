// =========================================================
// MOTOR GENERADOR DE EXPEDICIONES Y RUTAS EXTERIORES (js/rooms/expeditions.js)
// =========================================================

// Motor de 8 arquetipos arquitectónicos rotativos para evitar repetición
function makeExpeditionMap(index, danger) {
  const spikePattern = danger > 1 ? (index % 2 === 0 ? '^^^^' : '^^^^^^') : '....';
  const archetype = (index + danger * 2) % 8;

  switch (archetype) {
    case 0: // Pasarela a doble altura con puente superior central
      return [
        '##############################', '#............................#', '#............................#',
        '#.........==========.........#', '#............................#', '#..====................====..#',
        '#............................#', '#..............====..........#', '#............................#',
        '#....====....................#', '#............................#', '#....................====....#',
        '#............................#', '<............................>', `<.......${spikePattern}..................>`,
        '##############################', '##############################'
      ];
    case 1: // Salto en zigzag ascendente / descendente
      return [
        '##############################', '#............................#', '#.....====...................#',
        '#...................====.....#', '#............................#', '#...........====.............#',
        '#............................#', '#..====..............====....#', '#............................#',
        '#.......====.................#', '#..................====......#', '#...........====.............#',
        '#............................#', '<............................>', `<...${spikePattern}..........${spikePattern}.......>`,
        '##############################', '##############################'
      ];
    case 2: // Columnas de piedra y fosos simétricos
      return [
        '##############################', '#............................#', '#............................#',
        '#...====............====.....#', '#............................#', '#........==========..........#',
        '#............................#', '#............................#', '#....====..........====......#',
        '#............................#', '#............................#', '#..====..............====....#',
        '#............................#', '<............................>', `<.....${spikePattern}..........${spikePattern}.....>`,
        '##############################', '##############################'
      ];
    case 3: // Baluarte central elevado con cornisas laterales
      return [
        '##############################', '#............................#', '#............................#',
        '#..............========......#', '#............................#', '#......======................#',
        '#............................#', '#..................====......#', '#............................#',
        '#...====.....................#', '#............................#', '#..........====..............#',
        '#............................#', '<............................>', `<.......${spikePattern}......${spikePattern}.......>`,
        '##############################', '##############################'
      ];
    case 4: // Plataformas flotantes en cascada suave
      return [
        '##############################', '#............................#', '#..====......................#',
        '#............................#', '#.......====.................#', '#............................#',
        '#............====............#', '#............................#', '#.................====.......#',
        '#............................#', '#......................====..#', '#............................#',
        '#............................#', '<............................>', `<..........${spikePattern}..........>`,
        '##############################', '##############################'
      ];
    case 5: // Gran foso de estacas con islas seguras
      return [
        '##############################', '#............................#', '#............................#',
        '#......====........====......#', '#............................#', '#..====................====..#',
        '#............................#', '#...........======...........#', '#............................#',
        '#............................#', '#....====............====....#', '#............................#',
        '#............................#', '<............................>', `<....${spikePattern}${spikePattern}....>`,
        '##############################', '##############################'
      ];
    case 6: // Desfiladero con pasarela baja y mirador alto
      return [
        '##############################', '#............................#', '#..................======....#',
        '#............................#', '#...........====.............#', '#............................#',
        '#....====....................#', '#............................#', '#.................====.......#',
        '#............................#', '#...======...................#', '#............................#',
        '#............................#', '<............................>', `<................${spikePattern}....>`,
        '##############################', '##############################'
      ];
    case 7: default: // Arquería gótica con plataformas triples
      return [
        '##############################', '#............................#', '#............................#',
        '#...====......====......====.#', '#............................#', '#............................#',
        '#........====......====......#', '#............................#', '#..====..................==..#',
        '#............................#', '#.......====........====.....#', '#............................#',
        '#............................#', '<............................>', `<..${spikePattern}..............${spikePattern}..>`,
        '##############################', '##############################'
      ];
  }
}

function makeExpeditionSpawns(index, danger) {
  const patterns = [
    [{ type: 'skeleton', x: 165, y: 200 }, { type: 'bat', x: 330, y: 70 }],
    [{ type: 'archer', x: 190, y: 200 }, { type: 'shield', x: 335, y: 200 }],
    [{ type: 'bomber', x: 145, y: 200 }, { type: 'armor', x: 315, y: 200 }],
    [{ type: 'summoner', x: 220, y: 95 }, { type: 'bat', x: 360, y: 70 }]
  ];
  return patterns[(index + danger) % patterns.length].map(spawn => ({ ...spawn }));
}

function addExpeditionRooms({ start, count, prefix, gridX, gridY, danger, firstLeft, lastRight, relicAt, relicType }) {
  for (let offset = 0; offset < count; offset++) {
    const id = start + offset;
    const spawns = makeExpeditionSpawns(offset, danger);
    if (offset === relicAt) spawns.push({ type: relicType, x: 370, y: 72 });
    const map = makeExpeditionMap(offset, danger);
    if (offset > 0 && offset % 8 === 0) map[14] = '<.............S..............>';
    ROOM_DEFS[id] = {
      name: `${prefix}: Tramo ${String(offset + 1).padStart(2, '0')}`,
      gridX: gridX + (offset % 6),
      gridY: gridY + Math.floor(offset / 6),
      doors: {
        left: { to: offset === 0 ? firstLeft : id - 1, x: 430, y: 200 },
        right: { to: offset === count - 1 ? lastRight : id + 1, x: 30, y: 200 }
      },
      map,
      spawns
    };
  }
}

// GENERACIÓN DE LAS 4 GRANDES REGIONES
addExpeditionRooms({
  start: 201, count: 24, prefix: 'Catacumbas del Juramento', gridX: -12, gridY: 4,
  danger: 1, firstLeft: 9, lastRight: 11, relicAt: 12, relicType: 'relic_doublejump'
});
addExpeditionRooms({
  start: 401, count: 24, prefix: 'Jardines del Reloj Muerto', gridX: -12, gridY: 12,
  danger: 2, firstLeft: 15, lastRight: 24, relicAt: 12, relicType: 'relic_walljump'
});
addExpeditionRooms({
  start: 501, count: 24, prefix: 'Observatorio Quebrado', gridX: -12, gridY: -5,
  danger: 3, firstLeft: 10, lastRight: 13, relicAt: -1, relicType: 'relic_astraleye'
});
addExpeditionRooms({
  start: 1001, count: 20, prefix: 'Fortaleza Carmesí', gridX: 5, gridY: 3,
  danger: 3, firstLeft: 1, lastRight: 2, relicAt: -1, relicType: 'relic_none'
});

// RUTAS DE APROXIMACIÓN (TRANSICIÓN ENTRE CIUDAD Y MAZMORRAS)
function addApproachRoute({ start, prefix, gridX, gridY, fromCity, toFortress, ability, abilityLabel, danger }) {
  for (let offset = 0; offset < 5; offset++) {
    const id = start + offset;
    const map = makeExpeditionMap(offset + 4, danger);
    if (offset === 2) map[14] = '<.............S..............>';
    ROOM_DEFS[id] = {
      name: `${prefix}: Tramo de acceso ${offset + 1}`,
      gridX: gridX - offset,
      gridY,
      doors: {
        left: { to: offset === 4 ? toFortress : id + 1, x: 430, y: 200 },
        right: { to: offset === 0 ? fromCity : id - 1, x: 30, y: 200 }
      },
      map,
      spawns: makeExpeditionSpawns(offset + 2, danger)
    };
  }
  ROOM_DEFS[start].doors.right = { to: fromCity, x: 30, y: 200 };
  ROOM_DEFS[start].doors.left = { to: start + 1, x: 430, y: 200 };
  ROOM_DEFS[start + 4].doors.left = { to: toFortress, x: 430, y: 200 };
  ROOM_DEFS[start + 4].doors.right = { to: start + 3, x: 30, y: 200 };
  ROOM_DEFS[fromCity].doors.left = { to: start, x: 430, y: 200, requiresAbility: ability, requiresLabel: abilityLabel };
}

addApproachRoute({ start: 41, prefix: 'Túneles de Sal Negra', gridX: -3, gridY: 6, fromCity: 9, toFortress: 201, ability: 'hasDash', abilityLabel: 'DASH SOMBRÍO', danger: 1 });
addApproachRoute({ start: 46, prefix: 'Camino del Reloj Marchito', gridX: 8, gridY: 0, fromCity: 0, toFortress: 15, ability: 'hasDoubleJump', abilityLabel: 'DOBLE SALTO', danger: 2 });
addApproachRoute({ start: 51, prefix: 'Puentes de la Vigilia Astral', gridX: -2, gridY: -2, fromCity: 10, toFortress: 501, ability: 'hasWallJump', abilityLabel: 'SALTO EN PARED', danger: 3 });

// CONEXIONES DE PUERTAS ESPECÍFICAS
ROOM_DEFS[201].doors.left = { to: 45, x: 430, y: 200 };
ROOM_DEFS[0].doors.eastUpper = { to: 46, x: 30, y: 120, requiresAbility: 'hasDoubleJump', requiresLabel: 'DOBLE SALTO' };
ROOM_DEFS[0].doors.left = { to: -1, x: 430, y: 218 };
ROOM_DEFS[0].map[7] = '#............................>';
ROOM_DEFS[0].map[8] = '#............................>';
ROOM_DEFS[46].doors = {
  westUpper: { to: 0, x: 430, y: 120 },
  right: { to: 47, x: 30, y: 200 }
};
ROOM_DEFS[46].map[7] = '<............................#';
ROOM_DEFS[46].map[8] = '<............................#';
for (let id = 47; id <= 49; id++) {
  ROOM_DEFS[id].doors = { left: { to: id - 1, x: 430, y: 200 }, right: { to: id + 1, x: 30, y: 200 } };
}
ROOM_DEFS[50].doors = { left: { to: 49, x: 430, y: 200 }, right: { to: 15, x: 30, y: 200 } };
ROOM_DEFS[15].doors = { left: { to: 50, x: 430, y: 200 }, right: { to: 401, x: 30, y: 200 } };

ROOM_DEFS[9].doors = {
  left: { to: 108, x: 430, y: 200 },
  right: { to: 41, x: 30, y: 200 },
  westUpper: { to: 34, x: 430, y: 120 }
};
ROOM_DEFS[41].doors = { left: { to: 9, x: 430, y: 200 }, right: { to: 42, x: 30, y: 200 } };
for (let id = 42; id <= 44; id++) {
  ROOM_DEFS[id].doors = { left: { to: id - 1, x: 430, y: 200 }, right: { to: id + 1, x: 30, y: 200 } };
}
ROOM_DEFS[45].doors = { left: { to: 44, x: 430, y: 200 }, right: { to: 201, x: 30, y: 200 } };
ROOM_DEFS[201].doors = { left: { to: 45, x: 430, y: 200 }, right: { to: 202, x: 30, y: 200 } };

ROOM_DEFS[10].doors = {
  left: { to: 16, x: 430, y: 200 },
  right: { to: 51, x: 30, y: 200, requiresAbility: 'hasWallJump', requiresLabel: 'SALTO EN PARED' }
};
ROOM_DEFS[51].doors = { left: { to: 10, x: 430, y: 200 }, right: { to: 52, x: 30, y: 200 } };
for (let id = 52; id <= 54; id++) {
  ROOM_DEFS[id].doors = { left: { to: id - 1, x: 430, y: 200 }, right: { to: id + 1, x: 30, y: 200 } };
}
ROOM_DEFS[55].doors = { left: { to: 54, x: 430, y: 200 }, right: { to: 501, x: 30, y: 200 } };
ROOM_DEFS[501].doors = { left: { to: 55, x: 430, y: 200 }, right: { to: 502, x: 30, y: 200 } };

// TITULACIÓN Y NOMENCLATURA ORDENADA
const EXPEDITION_TITLES = [
  'Umbral de los Vigías', 'Pasaje de Ceniza', 'Galería del Juramento', 'Cruce de las Campanas',
  'Cámara de los Ecos', 'Escalera del Olvido', 'Patio de los Caídos', 'Bóveda sin Luna',
  'Corredor de las Velas', 'Puente de Hierro Frío', 'Nicho de los Exiliados', 'Sala de los Susurros',
  'Santuario Quebrado', 'Foso de las Cenizas', 'Pasarela de los Cuervos', 'Claustro Marchito',
  'Cripta de los Centinelas', 'Galería del Velo', 'Taller Abandonado', 'Umbral de la Vigilia',
  'Atrio de la Sangre Antigua', 'Escalinata del Eclipse', 'Cámara del Juramento Roto', 'Vestíbulo del Desafío'
];

function applyOrderedNames(prefix, shortPrefix, roomIds, generatedTitles = []) {
  roomIds.forEach((id, index) => {
    const room = ROOM_DEFS[id];
    if (!room) return;
    const order = String(index + 1).padStart(2, '0');
    const originalTitle = generatedTitles[index] || room.name.replace(/^.*?:\s*/, '').replace(/^Sala \d+:\s*/, '');
    room.mapLabel = `${shortPrefix} ${order}/${String(roomIds.length).padStart(2, '0')}`;
    room.mapShortLabel = `${shortPrefix.slice(0, 1)}-${order}`;
    room.name = `${prefix} ${order}/${roomIds.length} — ${originalTitle}`;
  });
}

applyOrderedNames('Sendero de Ceniza', 'Ceniza', Array.from({ length: 8 }, (_, index) => 101 + index), EXPEDITION_TITLES.slice(0, 8));
applyOrderedNames('Catacumbas del Juramento', 'Juramento', [...Array.from({ length: 24 }, (_, index) => 201 + index), 11, 18, 19, 20, 28, 12], EXPEDITION_TITLES);
applyOrderedNames('Jardines del Reloj Muerto', 'Reloj', [15, ...Array.from({ length: 24 }, (_, index) => 401 + index), 24, 25, 26, 30, 16], [
  'Sendero Marchito', ...EXPEDITION_TITLES, 'Invernadero Roto', 'Engranajes Petrificados', 'Santuario de la Hora Cero', 'Pasarela del Péndulo', 'Cámara del Cronista'
]);
applyOrderedNames('Observatorio Quebrado', 'Astral', [...Array.from({ length: 24 }, (_, index) => 501 + index), 13, 21, 22, 23, 29, 14], [
  ...EXPEDITION_TITLES, 'Escalinata de Cristal', 'Aguja de los Cometas', 'Puentes de Constelación', 'Plataforma del Zenith', 'Cámara del Prisma Invertido', 'Cámara del Serafín'
]);
applyOrderedNames('Fortaleza Carmesí', 'Carmesí', [1, ...Array.from({ length: 20 }, (_, index) => 1001 + index), 2, 3, 6, 7, 4, 8, 27, 17, 5], [
  'Patio de Entrada de la Ciudadela', ...EXPEDITION_TITLES.slice(0, 20), 'Gran Vestíbulo', 'Galería de los Susurros', 'Foso de las Ánimas', 'Cripta Subterránea', 'Capilla Hundida', 'Gran Chimenea', 'Puente de los Estandartes Rotos', 'Salón del Caballero', 'Santuario del Eclipse'
]);

applyOrderedNames('Acceso del Juramento', 'Jura', [41, 42, 43, 44, 45], ['Túnel de Sal', 'Galería Ahogada', 'Altar de la Sal Negra', 'Derrumbe Juramentado', 'Portal del Osario']);
applyOrderedNames('Acceso del Reloj', 'Reloj', [46, 47, 48, 49, 50], ['Sendero de Péndulos', 'Huerto Marchito', 'Altar del Musgo Dorado', 'Puente de Engranajes', 'Arco de las Rosas Negras']);
applyOrderedNames('Acceso Astral', 'Astro', [51, 52, 53, 54, 55], ['Mirador de las Lunas', 'Pasarela de Cristal', 'Altar de las Estrellas', 'Escalera de Niebla', 'Portal del Observatorio']);

applyOrderedNames('Villa Refugio', 'Villa', [-2, -1, 0, 31, 32, 33], ['Plaza de la Taberna', 'Mercado y Bazar', 'Puerta Este y Altar', 'Posada del Farol Azul', 'Casa de Cartografía', 'Camino de los Carros']);
applyOrderedNames('Enclave Subterráneo', 'Enclave', [9, 34, 35], ['Pabellón de los Juramentados', 'Laboratorio Umbrío', 'Pozo de los Juramentos']);
applyOrderedNames('Santuario de los Astrónomos', 'Santuario', [10, 36, 37], ['Observatorio de Cristal', 'Reliquiario de Selene', 'Biblioteca del Firmamento']);

// ENEMIGOS ÉLITE Y NODOS DE RECURSOS
if (ROOM_DEFS[208]) ROOM_DEFS[208].spawns.push({ type: 'armor', x: 380, y: 200, elite: true, name: 'Guardián de Sal' });
if (ROOM_DEFS[414]) ROOM_DEFS[414].spawns.push({ type: 'bomber', x: 360, y: 200, elite: true, name: 'Jardinero de Bronce' });
if (ROOM_DEFS[516]) ROOM_DEFS[516].spawns.push({ type: 'summoner', x: 350, y: 100, elite: true, name: 'Oráculo Fracturado' });
if (ROOM_DEFS[1014]) ROOM_DEFS[1014].spawns.push({ type: 'shield', x: 365, y: 200, elite: true, name: 'Verdugo Carmesí' });
if (ROOM_DEFS[205]) ROOM_DEFS[205].spawns.push({ type: 'duelist', x: 285, y: 200, name: 'Duelista de Sal' });
if (ROOM_DEFS[211]) ROOM_DEFS[211].spawns.push({ type: 'trapper', x: 360, y: 200, name: 'Invocador de Trampas' });
if (ROOM_DEFS[410]) ROOM_DEFS[410].spawns.push({ type: 'beast', x: 300, y: 200, name: 'Bestia de Carga Marchita' });
if (ROOM_DEFS[515]) ROOM_DEFS[515].spawns.push({ type: 'specter', x: 320, y: 110, name: 'Espectro de Cristal' });
if (ROOM_DEFS[103]) {
  ROOM_DEFS[103].spawns.push({ type: 'relic_parrybrooch', x: 300, y: 72 });
  ROOM_DEFS[103].spawns.push({ type: 'citizen', x: 385, y: 200, name: 'Maestro de Guardia', dir: -1, dialog: '«Golpea justo cuando el enemigo se compromete al ataque. No bloquees el miedo: desvía su filo.»' });
}

// Muros rompibles secretos
for (const [roomId, row, col] of [[204, 12, 2], [213, 12, 27], [407, 12, 2], [413, 12, 27], [507, 12, 2], [518, 12, 27], [1007, 12, 2], [1016, 12, 27]]) {
  if (ROOM_DEFS[roomId]) {
    const mapRow = ROOM_DEFS[roomId].map[row];
    ROOM_DEFS[roomId].map[row] = `${mapRow.slice(0, col)}?${mapRow.slice(col + 1)}`;
  }
}

// Nodos de materiales para alquimia y forja
if (ROOM_DEFS[204]) ROOM_DEFS[204].spawns.push({ type: 'material_node', material: 'bone', x: 110, y: 72 });
if (ROOM_DEFS[407]) ROOM_DEFS[407].spawns.push({ type: 'material_node', material: 'flower', x: 120, y: 72 });
if (ROOM_DEFS[507]) ROOM_DEFS[507].spawns.push({ type: 'material_node', material: 'crystal', x: 120, y: 72 });
if (ROOM_DEFS[1007]) ROOM_DEFS[1007].spawns.push({ type: 'material_node', material: 'ash', x: 120, y: 72 });
if (ROOM_DEFS[412]) ROOM_DEFS[412].spawns.push({ type: 'material_node', material: 'gear', x: 370, y: 72 });

// Atajos físicos bidireccionales
const FORTRESS_SHORTCUTS = [
  [208, 218, 'Compuerta de Sal'], [408, 418, 'Ascensor del Péndulo'],
  [508, 518, 'Puente de Prisma'], [1008, 1018, 'Elevador Carmesí']
];
for (const [from, to, label] of FORTRESS_SHORTCUTS) {
  if (ROOM_DEFS[from] && ROOM_DEFS[to]) {
    ROOM_DEFS[from].doors.eastUpper = { to, x: 30, y: 120, shortcut: true, requiresLabel: label };
    ROOM_DEFS[to].doors.westUpper = { to: from, x: 430, y: 120, shortcut: true, requiresLabel: label };
    openUpperDoor(from, 'right');
    openUpperDoor(to, 'left');
  }
}

// Sincronización física de todas las puertas laterales y superiores en los tilemaps
for (const [roomId, room] of Object.entries(ROOM_DEFS)) {
  for (const side of Object.keys(room.doors || {})) {
    if (side === 'left' || side === 'right') openGroundDoor(roomId, side);
    if (side === 'westUpper') openUpperDoor(Number(roomId), 'left');
    if (side === 'eastUpper') openUpperDoor(Number(roomId), 'right');
  }
}
