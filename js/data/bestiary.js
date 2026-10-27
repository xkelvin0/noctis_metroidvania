// =============================================================================
// js/data/bestiary.js — Datos del Bestiario y Diario del Cazador (Hunter's Journal)
// Noctis: Metroidvania - Registro de Monstruos, Bajas y Recompensas de Caza
// =============================================================================

let bestiaryKills = {};
let bestiaryMastery = {};

const BESTIARY_DATA = [
  {
    id: 'skeleton',
    name: 'Esqueleto Lancero',
    icon: '💀',
    title: 'Centinela Sepulcral',
    habitat: 'Patio y Vestíbulo del Castillo',
    hp: 30, dmg: 15, essence: '3 Orbes (15 ♦)',
    desc: 'Restos óseos de la guardia real imbuidos de rencor espectral. Custodian los corredores marchitos armados con largas lanzas de hierro oxidado.',
    weakness: 'Telegrafía su embestida cambiando de color a ámbar. Salta sobre él con un <strong>Down-Slash (S + Clic)</strong> para rebotar ileso en su cráneo o atácale por la espalda tras esquivarlo.',
    killQuota: 8,
    reward: {
      title: 'Sentencia Ósea',
      desc: '+15% de daño con espada contra Esqueletos.',
      type: 'damage',
      dmgBonus: 0.15
    }
  },
  {
    id: 'bat',
    name: 'Murciélago Vesperal',
    icon: '🦇',
    title: 'Vuelo Siniestro de las Criptas',
    habitat: 'Bóvedas Altas y Galerías',
    hp: 20, dmg: 15, essence: '2 Orbes (10 ♦)',
    desc: 'Criaturas de sangre fría que anidan en los techos del castillo. Despiertan y se abalanzan en parábolas erráticas cuando perciben la presencia de Alaric.',
    weakness: 'Tienen baja salud y son lentos al ascender. El <strong>Hechizo Carmesí (Clic Derecho / Q)</strong> los fulmina al instante a distancia antes de que inicien su picada.',
    killQuota: 12,
    reward: {
      title: 'Festín Hematófago',
      desc: '+30% de probabilidad de soltar Corazones de Vida al morir.',
      type: 'drop_heart',
      heartBonus: 0.30
    }
  },
  {
    id: 'armor',
    name: 'Armadura Acorazada',
    icon: '🛡️',
    title: 'Caballero Negro del Eclipse',
    habitat: 'Gran Vestíbulo y Criptas',
    hp: 65, dmg: 20, essence: '5 Orbes (25 ♦)',
    desc: 'Un caparazón de hierro macizo animado por magia de sangre oscura. Su gran pavés frontal desvía por completo cualquier golpe directo de espada o magia.',
    weakness: '<strong>¡Invulnerable de frente!</strong> Debes ejecutar un <strong>Dash Sombrío (Shift)</strong> para atravesarlo limpiamente o saltar con Doble Salto para castigarlo por la espalda.',
    killQuota: 5,
    reward: {
      title: 'Punto Ciego de Acero',
      desc: '+20% de daño total al golpear Armaduras Acorazadas.',
      type: 'damage',
      dmgBonus: 0.20
    }
  },
  {
    id: 'archer',
    name: 'Ballestero Sombrío',
    icon: '🏹',
    title: 'Tirador de la Guardia Marchita',
    habitat: 'Torres y Pasadizos de Ceniza',
    hp: 35, dmg: 16, essence: '3 Orbes (15 ♦)',
    desc: 'Francotirador no-muerto que aguarda en salientes elevadas para atravesar a los intrusos con virotes envenenados.',
    weakness: 'Sus proyectiles tienen una trayectoria predecible: usa el salto con tajo aéreo para acortar distancia antes de su siguiente disparo.',
    killQuota: 6,
    reward: {
      title: 'Reflejos de Cazador',
      desc: '+25% de Esencia Carmesí obtenida al derrotar ballesteros.',
      type: 'essence',
      essenceMult: 1.25
    }
  },
  {
    id: 'bomber',
    name: 'Inmolador de Ceniza',
    icon: '💣',
    title: 'Fanático del Fuego Negro',
    habitat: 'Criptas y Fosos Exteriores',
    hp: 30, dmg: 28, essence: '4 Orbes (20 ♦)',
    desc: 'Un siervo desquiciado que carga con vasijas incandescentes. Corre enloquecido para autodetonarse al menor contacto.',
    weakness: 'Mantenlo a raya con la <strong>Lanza de Sangre</strong> o mátalo en pleno salto antes de que alcance su radio crítico.',
    killQuota: 5,
    reward: {
      title: 'Disipación Ígnea',
      desc: '+15% de daño con hechizos y armas contra inmoladores.',
      type: 'damage',
      dmgBonus: 0.15
    }
  },
  {
    id: 'cultist',
    name: 'Sacerdote del Sol Sangrante',
    icon: '🕯️',
    title: 'Canalizador del Ocaso',
    habitat: 'Capilla Hundida (Sala 04)',
    hp: 45, dmg: 20, essence: '5 Orbes (25 ♦)',
    desc: 'Monje caído que invoca orbes oscuros en círculo y orquesta enjambres de murciélagos si no es interrumpido a tiempo.',
    weakness: 'Interrumpe sus cantos arcanos arrojándole una <strong>Lanza de Sangre (Clic Derecho)</strong> o cerrando distancia con la <strong>Cadena del Condenado (F)</strong>.',
    killQuota: 5,
    reward: {
      title: 'Corte del Hereje',
      desc: '+20% de daño con Hechizos Carmesí contra sacerdotes e invocadores.',
      type: 'damage',
      dmgBonus: 0.20
    }
  },
  {
    id: 'gargoyle',
    name: 'Gárgola Pétrea',
    icon: '🗿',
    title: 'Guardián Alado de Piedra',
    habitat: 'Murallas y Torre del Castillo',
    hp: 55, dmg: 22, essence: '6 Orbes (30 ♦)',
    desc: 'Estatua labrada en piedra volcánica que cobra vida ante intrusos. Escupe ráfagas de esquirlas pétreas antes de arrojarse en picada.',
    weakness: 'Usa el <strong>Martillo de Sangre (S + Ataque en el aire)</strong> para quebrar su coraza rocosa y hacerla descender al suelo.',
    killQuota: 5,
    reward: {
      title: 'Quiebra-Rocas',
      desc: '+25% de daño en rebotes Pogo y Martillo de Sangre contra Gárgolas.',
      type: 'damage',
      dmgBonus: 0.25
    }
  },
  {
    id: 'wraith',
    name: 'Espectro Carmesí',
    icon: '👻',
    title: 'Eco Errante del Eclipse',
    habitat: 'Catacumbas y Foso de las Ánimas',
    hp: 40, dmg: 18, essence: '4 Orbes (20 ♦)',
    desc: 'Almas en pena de los ciudadanos de Véspera que perdieron su cuerpo mortal. Flotan atravesando muros y disparan proyectiles espirituales.',
    weakness: 'Sus proyectiles pueden ser <strong>PARREADOS</strong> con la espada para devolvérselos con daño triplicado y disiparlos.',
    killQuota: 6,
    reward: {
      title: 'Comunión Espiritual',
      desc: '+30% de probabilidad de que los Espectros suelten Corazones de Vida.',
      type: 'drop_heart',
      heartBonus: 0.30
    }
  },
  {
    id: 'abomination',
    name: 'Verdugo de Ceniza',
    icon: '🪓',
    title: 'Subjefe del Foso',
    habitat: 'Foso de las Ánimas (Sala 06)',
    hp: 140, dmg: 28, essence: '12 Orbes (60 ♦)',
    desc: 'Un antiguo carcelero corrompido que empuña una pesada cuchilla. Cada golpe contra el suelo genera una onda sísmica destructiva.',
    weakness: 'Salta en el instante exacto en que azote su hacha para esquivar la onda expansiva y contraataca con la <strong>Forma de Bruma (S + Shift)</strong>.',
    killQuota: 2,
    reward: {
      title: 'Desafío Titánico',
      desc: '+15% de daño total contra Verdugos y Subjefes.',
      type: 'damage',
      dmgBonus: 0.15
    }
  },
  {
    id: 'clockwork_sentinel',
    name: 'Autómata del Reloj',
    icon: '⚙️',
    title: 'Centinela de Bronce Petrificado',
    habitat: 'Jardines del Reloj Muerto',
    hp: 75, dmg: 24, essence: '7 Orbes (35 ♦)',
    desc: 'Mecanismo de relojería impulsado por vapor y sangre condensada. Gira sus cuchillas de bronce a gran velocidad cuando detecta movimiento.',
    weakness: 'Tras su giro de cuchillas queda sobrecalentado durante 2 segundos: es el momento perfecto para conectar combos terrestres de espada.',
    killQuota: 4,
    reward: {
      title: 'Desengranaje Crítico',
      desc: '+20% de daño con espada contra Autómatas del Reloj.',
      type: 'damage',
      dmgBonus: 0.20
    }
  },
  {
    id: 'astral_monk',
    name: 'Astrónomo Hereje',
    icon: '🔮',
    title: 'Vigía de las Constelaciones Muertas',
    habitat: 'Observatorio de Cristal',
    hp: 50, dmg: 22, essence: '6 Orbes (30 ♦)',
    desc: 'Erudito cegado por el conocimiento del eclipse. Teletransporta ráfagas estelares celestes hacia la posición de Alaric.',
    weakness: 'Usa el <strong>Broche del Reflejo</strong> para desviar sus cometas astrales y devolverle un golpe crítico fulminante.',
    killQuota: 4,
    reward: {
      title: 'Alineación Astral',
      desc: '+25% de Esencia Carmesí y +10% de daño contra Astrónomos.',
      type: 'damage',
      dmgBonus: 0.10,
      essenceMult: 1.25
    }
  },
  {
    id: 'duelist',
    name: 'Duelista de Sal',
    icon: '⚔️',
    title: 'Espada del Juramento Roto',
    habitat: 'Catacumbas del Juramento',
    hp: 45, dmg: 15, essence: '4 Orbes (20 ♦)',
    desc: 'Un espadachín que anuncia su estocada antes de cruzar la arena a toda velocidad.',
    weakness: 'Esquiva su línea dorada, espera el final de la embestida y ataca por la espalda.',
    killQuota: 5,
    reward: {
      title: 'Riposte Magistral',
      desc: '+20% de daño de contraataque contra Duelistas de Sal.',
      type: 'damage',
      dmgBonus: 0.20
    }
  },
  {
    id: 'trapper',
    name: 'Invocador de Trampas',
    icon: '🟠',
    title: 'Tejedor Rúnico',
    habitat: 'Catacumbas y fortaleza',
    hp: 45, dmg: 22, essence: '4 Orbes (20 ♦)',
    desc: 'Deja runas explosivas inmóviles que bloquean los caminos seguros.',
    weakness: 'No pises la runa: destruye al invocador desde una plataforma o usa el Dash para cruzar la zona.',
    killQuota: 5,
    reward: {
      title: 'Paso Firme',
      desc: '+25% de probabilidad de que suelten Corazones de Vida.',
      type: 'drop_heart',
      heartBonus: 0.25
    }
  },
  {
    id: 'beast',
    name: 'Bestia de Carga',
    icon: '🐗',
    title: 'Ariete Marchito',
    habitat: 'Jardines del Reloj Muerto',
    hp: 80, dmg: 25, essence: '6 Orbes (30 ♦)',
    desc: 'Una criatura blindada que embiste cuando prepara sus patas contra el suelo.',
    weakness: 'Salta o usa Doble Salto durante la carga; queda expuesta cuando termina su recorrido.',
    killQuota: 4,
    reward: {
      title: 'Domador de Arietes',
      desc: '+15% de daño con espada y Pogo contra Bestias de Carga.',
      type: 'damage',
      dmgBonus: 0.15
    }
  },
  {
    id: 'specter',
    name: 'Espectro de Cristal',
    icon: '👻',
    title: 'Voz sin Cuerpo',
    habitat: 'Observatorio Quebrado',
    hp: 45, dmg: 18, essence: '4 Orbes (20 ♦)',
    desc: 'Cruza paredes y dispara una aguja espectral desde posiciones imposibles.',
    weakness: 'Un Parry devuelve su aguja; no dependas de muros para cubrirte.',
    killQuota: 5,
    reward: {
      title: 'Resonancia de Cristal',
      desc: '+30% de Esencia Carmesí obtenida de Espectros de Cristal.',
      type: 'essence',
      essenceMult: 1.30
    }
  },
  {
    id: 'boss',
    name: 'Lord Malakor',
    icon: '👑',
    title: 'Guardián del Eclipse Carmesí',
    habitat: 'Torre del Eclipse (Sala 05)',
    hp: 260, dmg: 25, essence: '20 Orbes (100 ♦)',
    desc: 'Hermano de Alaric y señor caído del reino. Detuvo el amanecer para desafiar a la muerte, convirtiéndose en el epicentro de la pesadilla.',
    weakness: 'En Fase 1, castígalo entre sus pilares solares con Lanzas de Sangre. En Fase 2 (Alas de Sangre), usa el rebote Pogo sobre sus esferas y la <strong>Forma de Bruma</strong> para eludir su lluvia de meteoros.',
    killQuota: 1,
    reward: {
      title: 'Fin del Ocaso',
      desc: '+10% de daño permanente contra TODOS los enemigos del reino.',
      type: 'damage',
      dmgBonus: 0.10,
      isGlobal: true
    }
  }
];

// Normalización de tipos de enemigos del juego hacia identificadores del Bestiario
function normalizeBestiaryType(type) {
  if (!type) return null;
  if (type === 'summoner') return 'cultist';
  if (type === 'shield') return 'armor';
  return type;
}

function hasBestiaryMastery(monsterId) {
  const norm = normalizeBestiaryType(monsterId);
  return !!(norm && bestiaryMastery[norm]);
}

function recordBestiaryKill(enemyType) {
  const id = normalizeBestiaryType(enemyType);
  if (!id) return;
  const m = BESTIARY_DATA.find(x => x.id === id);
  if (!m) return;

  bestiaryKills[id] = (bestiaryKills[id] || 0) + 1;

  if (bestiaryKills[id] >= m.killQuota && !bestiaryMastery[id]) {
    bestiaryMastery[id] = true;
    if (typeof sfx === 'function') sfx('relic');
    if (typeof showBanner === 'function') {
      showBanner(`✦ DIARIO DEL CAZADOR: ¡${m.name.toUpperCase()} DOMINADO! (${m.reward.title})`, 220);
    }
    if (typeof floatingTexts !== 'undefined' && typeof player !== 'undefined') {
      floatingTexts.push({
        text: `¡MAESTRÍA: ${m.reward.title}!`,
        x: player.x - 24,
        y: player.y - 18,
        vy: -1.2,
        life: 50,
        color: '#ffbe0b'
      });
    }
    if (typeof saveProgress === 'function') {
      saveProgress();
    }
    if (typeof updateBestiaryUI === 'function') {
      updateBestiaryUI();
    }
  }
}

function getBestiaryDamageMultiplier(enemyType) {
  let mult = 1.0;
  // Si el jefe supremo Malakor ha sido dominado, otorga +10% daño global
  if (bestiaryMastery['boss']) {
    mult *= 1.10;
  }
  const norm = normalizeBestiaryType(enemyType);
  if (norm && bestiaryMastery[norm]) {
    const entry = BESTIARY_DATA.find(x => x.id === norm);
    if (entry && entry.reward && entry.reward.dmgBonus) {
      mult *= (1 + entry.reward.dmgBonus);
    }
  }
  return mult;
}

function getBestiaryHeartBonus(enemyType) {
  const norm = normalizeBestiaryType(enemyType);
  if (norm && bestiaryMastery[norm]) {
    const entry = BESTIARY_DATA.find(x => x.id === norm);
    if (entry && entry.reward && entry.reward.heartBonus) {
      return entry.reward.heartBonus;
    }
  }
  return 0;
}

function getBestiaryEssenceMultiplier(enemyType) {
  let mult = 1.0;
  const norm = normalizeBestiaryType(enemyType);
  if (norm && bestiaryMastery[norm]) {
    const entry = BESTIARY_DATA.find(x => x.id === norm);
    if (entry && entry.reward && entry.reward.essenceMult) {
      mult *= entry.reward.essenceMult;
    }
  }
  return mult;
}
