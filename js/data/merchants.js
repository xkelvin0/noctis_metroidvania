// =========================================================
// js/data/merchants.js — Configuración de Tiendas RPG
// =========================================================

const MERCHANTS_CONFIG = {
  dario: {
    name: 'DARIO EL TUERTO — BAZAR DEL REFUGIO',
    subtitle: '«LA PLATA YA NO VALE NADA EN VÉSPERA, MUCHACHO... SOLO LA ESENCIA FRESCA.»',
    portrait: "url('images/dario_portrait.jpg')",
    items: [
      {
        id: 'elixir_hp', name: 'FRASCO DE SANGRE PURA', icon: '🧪', cost: 35,
        desc: 'Cura 60 HP al instante y purifica la sangre cristalizada.',
        buy: () => { player.hp = Math.min(player.maxHp, player.hp + 60); sfx('heart'); showBanner('¡HAS BEBIDO EL FRASCO DE SANGRE PURA! (+60 HP)', 150); return false; }
      },
      {
        id: 'ring_atk', name: 'ANILLO DEL JURAMENTO CARMESÍ', icon: '💍', cost: 80,
        desc: 'Aumenta permanentemente el filo de tu espada en +10 ATK.',
        buy: () => { player.atk += 10; sfx('relic'); showBanner('¡ANILLO EQUIPADO! FILO CARMESÍ +10 ATK', 160); return true; }
      },
      {
        id: 'tome_vitality', name: 'TOMO DE LA VITALIDAD ANTIGUA', icon: '📜', cost: 100,
        desc: 'Incrementa permanentemente tu Vitalidad Máxima en +35 HP.',
        buy: () => { player.maxHp += 35; player.hp = player.maxHp; sfx('relic'); showBanner('¡VITALIDAD MÁXIMA EXTENDIDA A ' + player.maxHp + ' HP!', 160); return true; }
      },
      {
        id: 'essence_lens', name: 'LENTE DE ADIVINACIÓN ASTRAL', icon: '🧿', cost: 60,
        desc: 'Multiplica la Esencia obtenida de enemigos y muros en un +50%.',
        buy: () => { player.essenceBonus = true; sfx('relic'); showBanner('¡LENTE ASTRAL EQUIPADA! COSECHARÁS MÁS ESENCIA', 160); return true; }
      },
      {
        id: 'map_villa', name: 'CARTA DE VILLA REFUGIO', icon: '🗺️', cost: 25,
        desc: 'Revela Villa Refugio y las rutas de la Fortaleza Carmesí en el Grimorio.',
        buy: () => { purchasedMaps.villa = true; sfx('relic'); showBanner('CARTA DE VILLA REFUGIO AÑADIDA AL GRIMORIO', 160); return true; }
      },
      {
        id: 'map_juramento', name: 'CARTA DEL ENCLAVE SUBTERRÁNEO', icon: '🗺️', cost: 35,
        desc: 'Revela el Pabellón de los Juramentados y sus catacumbas.',
        buy: () => { purchasedMaps.juramento = true; sfx('relic'); showBanner('CARTA DEL ENCLAVE AÑADIDA AL GRIMORIO', 160); return true; }
      },
      {
        id: 'map_astral', name: 'CARTA DEL SANTUARIO ASTRAL', icon: '🗺️', cost: 35,
        desc: 'Revela el Observatorio de Cristal y sus rutas celestes.',
        buy: () => { purchasedMaps.astral = true; sfx('relic'); showBanner('CARTA ASTRAL AÑADIDA AL GRIMORIO', 160); return true; }
      },
      {
        id: 'map_reloj', name: 'CARTA DE LOS JARDINES DEL RELOJ', icon: '🗺️', cost: 40,
        desc: 'Revela los Jardines del Reloj Muerto y el camino del Cronista.',
        buy: () => { purchasedMaps.reloj = true; sfx('relic'); showBanner('CARTA DEL RELOJ AÑADIDA AL GRIMORIO', 160); return true; }
      }
    ]
  },

  elena: {
    name: 'BOTICARIA ELENA — HERBOLARIO Y ALQUIMIA',
    subtitle: '«MIS RAÍCES Y DESTILADOS LUNARES RETIENEN LA CORRUPCIÓN DEL ECLIPSE.»',
    portrait: "url('images/elena_portrait.jpg')",
    items: [
      {
        id: 'poison_coating', name: 'DESTILADO DE ACONITO CARMESÍ', icon: '🌿', cost: 50,
        desc: 'Imbuye tu espada con toxina: los enemigos reciben daño por veneno continuado.',
        buy: () => { player.poisonBlade = true; sfx('relic'); showBanner('¡ESPADA ENVENENADA ACTIVADA!', 160); return true; }
      },
      {
        id: 'stone_salve', name: 'BÁLSAMO DE CORTEZA PÉTREA', icon: '🏺', cost: 65,
        desc: 'Endurece la piel de Alaric: reduce todo el daño recibido en un 25%.',
        buy: () => { player.damageReduction = 0.25; sfx('relic'); showBanner('¡PROTECCIÓN PÉTREA PERMANENTE +25% DEF!', 160); return true; }
      },
      {
        id: 'swift_extract', name: 'EXTRACTO DE NIEBLA VELOZ', icon: '💨', cost: 45,
        desc: 'Aumenta permanentemente la velocidad de carrera y agilidad de Alaric.',
        buy: () => { player.moveSpeed = 3.6; sfx('relic'); showBanner('¡AGILIDAD DE MOVIMIENTO INCREMENTADA!', 160); return true; }
      },
      {
        id: 'greater_heal', name: 'TISANA DE LOTO BLANCO', icon: '🍵', cost: 40,
        desc: 'Restaura por completo la barra de salud (HP al máximo).',
        buy: () => { player.hp = player.maxHp; sfx('heart'); showBanner('¡VIDA RESTAURADA AL MÁXIMO!', 140); return false; }
      }
    ]
  },

  corvus: {
    name: 'ASTRÓNOMO CORVUS — SANTUARIO DE ARCANOS',
    subtitle: '«EL ECLIPSE REVELA VERDADES QUE LA LUZ DEL SOL INTENTABA OCULTAR.»',
    portrait: "url('images/corvus_portrait.jpg')",
    items: [
      {
        id: 'void_orb', name: 'ORBE DE VACÍO ORBITAL', icon: '🔮', cost: 90,
        desc: 'Despierta un orbe astral que gira alrededor de Alaric dañando enemigos cercanos.',
        buy: () => { player.hasOrbitingOrb = true; sfx('relic'); showBanner('¡ORBE ASTRAL ORBITAL DESPERTADO!', 160); return true; }
      },
      {
        id: 'spell_beam', name: 'PRISMA DE LUZ ESTELAR', icon: '✨', cost: 75,
        desc: 'Tu Hechizo Carmesí (Clic Der) se convierte en un haz que perfora múltiples enemigos.',
        buy: () => { player.piercingSpell = true; sfx('relic'); showBanner('¡HECHIZO PERFORANTE DESBLOQUEADO!', 160); return true; }
      },
      {
        id: 'astral_sight', name: 'CÓDICE DE LAS CONSTELACIONES', icon: '🌌', cost: 70,
        desc: 'Reduce el coste de esencia para lanzar magia a solo 5 ♦.',
        buy: () => { player.spellCostReduced = true; sfx('relic'); showBanner('¡COSTE DE HECHIZOS REDUCIDO A LA MITAD!', 160); return true; }
      }
    ]
  },

  boros: {
    name: 'HERRERO BOROS — FORJA CARMESÍ',
    subtitle: '«EL ACERO SOLO CEDE ANTE EL FUEGO Y EL MARTILLO. DIME QUÉ FORJAMOS HOY.»',
    portrait: "url('images/boros_portrait.jpg')",
    items: [
      {
        id: 'forge_atk', name: 'HOJA REFORZADA (+10 ATK)', icon: '⚔️', cost: 40,
        desc: 'Templa tu acero con esencia carmesí aumentando el daño base de tu espada.',
        buy: () => { player.atk += 10; player.atkUpgrades = (player.atkUpgrades || 0) + 1; sfx('relic'); showBanner('¡FORJA: FILO CARMESÍ +10 ATK!', 160); return false; }
      },
      {
        id: 'forge_hp', name: 'CORAZA DE PLACAS (+30 HP MÁX)', icon: '🛡️', cost: 45,
        desc: 'Forja refuerzos de hierro pesado extendiendo tu vitalidad máxima.',
        buy: () => { player.maxHp += 30; player.hp = player.maxHp; player.hpUpgrades = (player.hpUpgrades || 0) + 1; sfx('relic'); showBanner('¡FORJA: VITALIDAD AUMENTADA EN +30 HP!', 160); return false; }
      },
      {
        id: 'forge_reach', name: 'FILO EXTENDIDO (+8 ALCANCE)', icon: '🗡️', cost: 50,
        desc: 'Alarga el corte de tu espada permitiendo golpear desde mayor distancia.',
        buy: () => { player.attackReach = (player.attackReach || 0) + 8; sfx('relic'); showBanner('¡FORJA: ALCANCE DE ESPADA MEJORADO!', 160); return true; }
      },
      {
        id: 'forge_spell', name: 'GRABADO RÚNICO ASTRAL (+8 MAGIA)', icon: '✨', cost: 40,
        desc: 'Inscribe runas arcanas en la empuñadura sumando +8 de daño al hechizo carmesí.',
        buy: () => { player.spellPower = (player.spellPower || 0) + 8; sfx('relic'); showBanner('¡FORJA: POTENCIA DE HECHIZOS +8!', 160); return true; }
      },
      {
        id: 'forge_dash', name: 'MUELLES DE VACÍO (DASH VELOZ)', icon: '💨', cost: 35,
        desc: 'Reduce el enfriamiento entre impulsos sombríos de dash.',
        buy: () => { player.dashRecovery = (player.dashRecovery || 0) + 4; sfx('relic'); showBanner('¡FORJA: RECUPERACIÓN DE DASH MEJORADA!', 160); return true; }
      },
      {
        id: 'forge_heal', name: 'CRISOL DE PURIFICACIÓN (+15 CURA)', icon: '🩸', cost: 40,
        desc: 'Mejora la absorción de esencia viva, curando +15 HP extra en cada canalización.',
        buy: () => { player.healBonus = (player.healBonus || 0) + 15; sfx('relic'); showBanner('¡FORJA: EFECTO DE CURACIÓN +15 HP!', 160); return true; }
      }
    ]
  }
};
