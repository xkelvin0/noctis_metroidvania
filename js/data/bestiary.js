// =========================================================
// js/data/bestiary.js — Datos del Bestiario
// =========================================================

const BESTIARY_DATA = [
  {
    id: 'skeleton',
    name: 'Esqueleto Lancero',
    icon: '💀',
    title: 'Centinela Sepulcral',
    habitat: 'Patio y Vestíbulo del Castillo',
    hp: 30, dmg: 15, essence: '3 Orbes (15 ♦)',
    desc: 'Restos óseos de la guardia real imbuidos de rencor espectral. Custodian los corredores marchitos armados con largas lanzas de hierro oxidado.',
    weakness: 'Telegrafía su embestida cambiando de color a ámbar. Salta sobre él con un <strong>Down-Slash (S + Clic)</strong> para rebotar ileso en su cráneo o atácale por la espalda tras esquivarlo.'
  },
  {
    id: 'bat',
    name: 'Murciélago Vesperal',
    icon: '🦇',
    title: 'Vuelo Siniestro de las Criptas',
    habitat: 'Bóvedas Altas y Galerías',
    hp: 20, dmg: 15, essence: '2 Orbes (10 ♦)',
    desc: 'Criaturas de sangre fría que anidan en los techos del castillo. Despiertan y se abalanzan en parábolas erráticas cuando perciben la presencia de Alaric.',
    weakness: 'Tienen baja salud y son lentos al ascender. El <strong>Hechizo Carmesí (Clic Derecho / Q)</strong> los fulmina al instante a distancia antes de que inicien su picada.'
  },
  {
    id: 'armor',
    name: 'Armadura Acorazada',
    icon: '🛡️',
    title: 'Caballero Negro del Eclipse',
    habitat: 'Gran Vestíbulo y Criptas',
    hp: 65, dmg: 20, essence: '5 Orbes (25 ♦)',
    desc: 'Un caparazón de hierro macizo animado por magia de sangre oscura. Su gran pavés frontal desvía por completo cualquier golpe directo de espada o magia.',
    weakness: '<strong>¡Invulnerable de frente!</strong> Debes ejecutar un <strong>Dash Sombrío (Shift)</strong> para atravesarlo limpiamente o saltar con Doble Salto para castigarlo por la espalda.'
  },
  {
    id: 'gargoyle',
    name: 'Gárgola Pétrea',
    icon: '🗿',
    title: 'Guardián Alado de Piedra',
    habitat: 'Murallas y Torre del Castillo',
    hp: 55, dmg: 22, essence: '6 Orbes (30 ♦)',
    desc: 'Estatua labrada en piedra volcánica que cobra vida ante intrusos. Escupe ráfagas de esquirlas pétreas antes de arrojarse en picada.',
    weakness: 'Usa el <strong>Martillo de Sangre (S + Ataque en el aire)</strong> para quebrar su coraza rocosa y hacerla descender al suelo.'
  },
  {
    id: 'wraith',
    name: 'Espectro Carmesí',
    icon: '👻',
    title: 'Eco Errante del Eclipse',
    habitat: 'Catacumbas y Foso de las Ánimas',
    hp: 40, dmg: 18, essence: '4 Orbes (20 ♦)',
    desc: 'Almas en pena de los ciudadanos de Véspera que perdieron su cuerpo mortal. Flotan atravesando muros y disparan proyectiles espirituales.',
    weakness: 'Sus proyectiles pueden ser <strong>PARREADOS</strong> con la espada para devolvérselos con daño triplicado y disiparlos.'
  },
  {
    id: 'abomination',
    name: 'Verdugo de Ceniza',
    icon: '🪓',
    title: 'Subjefe del Foso',
    habitat: 'Foso de las Ánimas (Sala 06)',
    hp: 140, dmg: 28, essence: '12 Orbes (60 ♦)',
    desc: 'Un antiguo carcelero corrompido que empuña una pesada cuchilla. Cada golpe contra el suelo genera una onda sísmica destructiva.',
    weakness: 'Salta en el instante exacto en que azote su hacha para esquivar la onda expansiva y contraataca con la <strong>Forma de Bruma (S + Shift)</strong>.'
  },
  {
    id: 'cultist',
    name: 'Sacerdote del Sol Sangrante',
    icon: '🕯️',
    title: 'Canalizador del Ocaso',
    habitat: 'Capilla Hundida (Sala 04)',
    hp: 45, dmg: 20, essence: '5 Orbes (25 ♦)',
    desc: 'Monje caído que invoca orbes oscuros en círculo y cura a los monstruos cercanos si no es interrumpido a tiempo.',
    weakness: 'Interrumpe sus cantos arcanos arrojándole una <strong>Lanza de Sangre (Clic Derecho)</strong> o cerrando distancia con la <strong>Cadena del Condenado (F)</strong>.'
  },
  {
    id: 'clockwork_sentinel',
    name: 'Autómata del Reloj',
    icon: '⚙️',
    title: 'Centinela de Bronce Petrificado',
    habitat: 'Jardines del Reloj Muerto',
    hp: 75, dmg: 24, essence: '7 Orbes (35 ♦)',
    desc: 'Mecanismo de relojería impulsado por vapor y sangre condensada. Gira sus cuchillas de bronce a gran velocidad cuando detecta movimiento.',
    weakness: 'Tras su giro de cuchillas queda sobrecalentado durante 2 segundos: es el momento perfecto para conectar combos terrestres de espada.'
  },
  {
    id: 'astral_monk',
    name: 'Astrónomo Hereje',
    icon: '🔮',
    title: 'Vigía de las Constelaciones Muertas',
    habitat: 'Observatorio de Cristal',
    hp: 50, dmg: 22, essence: '6 Orbes (30 ♦)',
    desc: 'Erudito cegado por el conocimiento del eclipse. Teletransporta ráfagas estelares celestes hacia la posición de Alaric.',
    weakness: 'Usa el <strong>Broche del Reflejo</strong> para desviar sus cometas astrales y devolverle un golpe crítico fulminante.'
  },
  {
    id: 'boss',
    name: 'Lord Malakor',
    icon: '👑',
    title: 'Guardián del Eclipse Carmesí',
    habitat: 'Torre del Eclipse (Sala 05)',
    hp: 260, dmg: 25, essence: '20 Orbes (100 ♦)',
    desc: 'Hermano de Alaric y señor caído del reino. Detuvo el amanecer para desafiar a la muerte, convirtiéndose en el epicentro de la pesadilla.',
    weakness: 'En Fase 1, castígalo entre sus pilares solares con Lanzas de Sangre. En Fase 2 (Alas de Sangre), usa el rebote Pogo sobre sus esferas y la <strong>Forma de Bruma</strong> para eludir su lluvia de meteoros.'
  },
  {
    id: 'duelist', name: 'Duelista de Sal', icon: '⚔️', title: 'Espada del Juramento Roto', habitat: 'Catacumbas del Juramento', hp: 45, dmg: 15, essence: '4 Orbes (20 ♦)',
    desc: 'Un espadachín que anuncia su estocada antes de cruzar la arena a toda velocidad.', weakness: 'Esquiva su línea dorada, espera el final de la embestida y ataca por la espalda.'
  },
  {
    id: 'trapper', name: 'Invocador de Trampas', icon: '🟠', title: 'Tejedor Rúnico', habitat: 'Catacumbas y fortaleza', hp: 45, dmg: 22, essence: '4 Orbes (20 ♦)',
    desc: 'Deja runas explosivas inmóviles que bloquean los caminos seguros.', weakness: 'No pises la runa: destruye al invocador desde una plataforma o usa el Dash para cruzar la zona.'
  },
  {
    id: 'beast', name: 'Bestia de Carga', icon: '🐗', title: 'Ariete Marchito', habitat: 'Jardines del Reloj Muerto', hp: 80, dmg: 25, essence: '6 Orbes (30 ♦)',
    desc: 'Una criatura blindada que embiste cuando prepara sus patas contra el suelo.', weakness: 'Salta o usa Doble Salto durante la carga; queda expuesta cuando termina su recorrido.'
  },
  {
    id: 'specter', name: 'Espectro de Cristal', icon: '👻', title: 'Voz sin Cuerpo', habitat: 'Observatorio Quebrado', hp: 45, dmg: 18, essence: '4 Orbes (20 ♦)',
    desc: 'Cruza paredes y dispara una aguja espectral desde posiciones imposibles.', weakness: 'Un Parry devuelve su aguja; no dependas de muros para cubrirte.'
  }
];
