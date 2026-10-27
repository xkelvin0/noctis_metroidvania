// =========================================================
// js/data/relics.js — Datos de Reliquias y Tutoriales
// =========================================================

const RELICS_DATA = [
  {
    key: 'hasDash',
    name: 'Botas de Ceniza',
    icon: '👟',
    color: '#00f5d4',
    command: 'Shift Izquierdo / K / C',
    desc: 'Permite deslizarse velozmente en una ráfaga espectral, atravesando enemigos y traspasando barrotes sombríos púrpuras (B) sin recibir daño.',
    room: 'Sala 03: Galería de los Susurros'
  },
  {
    key: 'hasDoubleJump',
    name: 'Pluma del Cuervo',
    icon: '🪶',
    color: '#ffbe0b',
    command: 'Espacio / W / Z (En el aire)',
    desc: 'Concede un segundo impulso acrobático en pleno vuelo, permitiendo alcanzar salientes elevados y maniobrar sobre trampas de pinchos mortales.',
    room: 'Sala 04: La Capilla Hundida'
  },
  {
    key: 'hasWallJump',
    name: 'Garras de Gárgola',
    icon: '🧗',
    color: '#ff007f',
    command: 'Pegarse a un muro + Espacio',
    desc: 'Permite deslizarse lentamente por cualquier pared de piedra y propulsarse hacia el lado opuesto en un ágil salto de escalada vertical.',
    room: 'Sala 07: Cripta Subterránea'
  },
  {
    key: 'hasHook',
    name: 'Cadena del Condenado',
    icon: '⛓️',
    color: '#7de2ff',
    command: 'Tecla F (Lanzar gancho)',
    desc: 'Dispara una cadena espectral hacia arriba o en diagonal que impulsa a Alaric hacia el techo o argollas, alcanzando zonas elevadas.',
    room: 'Sala 14: Observatorio Astral'
  },
  {
    key: 'hasMist',
    name: 'Forma de Bruma',
    icon: '🌫️',
    color: '#c77dff',
    command: 'S + Shift',
    desc: 'Alaric se disuelve temporalmente en niebla espectral, volviéndose completamente invulnerable a trampas, pinchos y enemigos.',
    room: 'Sala 12: Criptas del Juramento'
  },
  {
    key: 'hasDive',
    name: 'Martillo de Sangre',
    icon: '💥',
    color: '#ef476f',
    command: 'S + Ataque (En el aire)',
    desc: 'Cae en picada brutal desde el aire provocando una onda expansiva de sangre al tocar el suelo que destruye suelos frágiles agrietados.',
    room: 'Sala 16: Jardines del Reloj'
  },
  {
    key: 'hasAstralEye',
    name: 'Ojo Astral de Véspera',
    icon: '👁️',
    color: '#fee440',
    command: 'Pasiva permanente',
    desc: 'Revela la ubicación de muros rompibles (?) y pasajes ocultos con un resplandor dorado pulsante visible a través de la piedra.',
    room: 'Sala 10: Santuario de los Astrónomos'
  },
  {
    key: 'hasParryBrooch',
    name: 'Broche del Reflejo',
    icon: '🛡️',
    color: '#06d6a0',
    command: 'Ataque contra proyectil',
    desc: 'Perfecciona el bloqueo. Desviar un proyectil o asestar un parry devuelve el golpe triplicado e inflige un aturdimiento crítico.',
    room: 'Sala 09: Enclave Subterráneo'
  }
];

const MINOR_RELICS_DATA = [
  { key: 'hasBloodFang', id: 'blood_fang', name: 'Colmillo de la Herida', icon: '🩸', color: '#ff4d6d', desc: 'Amuleto menor: tus golpes pueden causar sangrado.' },
  { key: 'hasShadeThread', id: 'shade_thread', name: 'Hilo de Sombra', icon: '🕯️', color: '#c77dff', desc: 'Amuleto menor: el dash se recupera antes.' },
  { key: 'hasStarWard', id: 'star_ward', name: 'Vigilia Estelar', icon: '✦', color: '#7de2ff', desc: 'Amuleto menor: reduce el daño recibido.' }
];

const MAGIC_TREE_DATA = [
  { id: 'blood', icon: '🩸', name: 'Sangre', color: '#ff4d6d', desc: 'Aumenta sangrado y poder de impacto.' },
  { id: 'shadow', icon: '🌑', name: 'Sombra', color: '#c77dff', desc: 'Mejora movilidad y recuperación de dash.' },
  { id: 'astro', icon: '✦', name: 'Astro', color: '#7de2ff', desc: 'Potencia hechizos y control astral.' }
];

const TUTORIALS_DATA = {
  dash: {
    badge: '⚡',
    title: 'Capas de Sombra (Dash Rápido)',
    command: 'SHIFT',
    desc: 'Te desmaterializas momentáneamente hacia la dirección en que miras para deslizarte a gran velocidad.',
    tip: '¡Esquiva proyectiles y atraviesa enemigos sin recibir daño! Esencial para evadir trampas de púas cortas.'
  },
  doublejump: {
    badge: '🪶',
    title: 'Alas de la Condenación (Doble Salto)',
    command: 'ESPACIO / W (En el Aire)',
    desc: 'Despliega alas de energía carmesí en el aire para impulsarte en un segundo salto consecutivo.',
    tip: 'Alcanza cornisas elevadas inaccesibles y úsalo para reajustar tu caída en zonas de plataformas peligrosas.'
  },
  walljump: {
    badge: '🐾',
    title: 'Garras Vampíricas (Salto en Pared)',
    command: 'ESPACIO / W (Pegado al Muro)',
    desc: 'Te aferras firmemente a superficies verticales y te impulsas saltando en dirección contraria.',
    tip: 'Rebota entre dos paredes contiguas manteniendo la dirección hacia el muro para escalar pozos profundos.'
  },
  hook: {
    badge: '⛓️',
    title: 'Cadena del Condenado (Gancho)',
    command: 'TECLA F',
    desc: 'Lanza una cadena maldita de almas hacia argollas y anclajes góticos de techo para propulsarte por los aires.',
    tip: 'Cruza abismos mortales y salones con fosos de púas donde no hay suelo firme en qué aterrizar.'
  },
  mist: {
    badge: '🌫️',
    title: 'Forma de Bruma Espectral',
    command: 'S + SHIFT',
    desc: 'Conviértete en una niebla sombría incorpórea durante un breve segundo.',
    tip: 'Atraviesa verjas de hierro, barrotes de celdas cerradas y salones con lásers espectrales.'
  },
  dive: {
    badge: '🔨',
    title: 'Martillo de Sangre (Ataque en Picada)',
    command: 'S + CLIC IZQ (En el Aire)',
    desc: 'Desciende a velocidad fulminante cayendo en picada con tu espada envuelta en energía densa.',
    tip: 'Rompe baldosas y suelos agrietados para descubrir pasadizos subterráneos, además de causar daño masivo en área al impactar el suelo.'
  },
  astraleye: {
    badge: '👁️',
    title: 'Ojo Astral del Vidente',
    command: 'PASIVO (AUTOMÁTICO)',
    desc: 'Otorga visión mística a Alaric, detectando ilusiones, fallas y grietas en la arquitectura antigua.',
    tip: 'Los muros falsos e ilusorios que ocultan secretos parpadearán con una runa dorada brillante indicando dónde golpear.'
  },
  parrybrooch: {
    badge: '⚜️',
    title: 'Broche del Reflejo (Contraataque Crítico)',
    command: 'CLIC IZQ (Justo al Recibir Golpe)',
    desc: 'Al blandir tu espada en el instante exacto en que un enemigo te ataca, desvías por completo el daño.',
    tip: 'Aturde al agresor y desata una onda de choque carmesí que inflige 2.5x daño crítico inmediato.'
  }
};
