// =========================================================
// js/data/merchants.js — Configuración de Tiendas RPG
// =========================================================

const MERCHANTS_CONFIG = {
  dario: {
    name: 'DARIO EL TUERTO — BAZAR DEL REFUGIO',
    subtitle: '«LA PLATA YA NO VALE NADA EN VÉSPERA, MUCHACHO... SOLO LA ESENCIA FRESCA.»',
    portrait: "url('img/portraits/dario_portrait.jpg')",
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
    portrait: "url('img/portraits/elena_portrait.jpg')",
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
    portrait: "url('img/portraits/corvus_portrait.jpg')",
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
        id: 'astral_eye', name: 'OJO ASTRAL DE VÉSPERA', icon: '👁️', cost: 65,
        desc: 'Permite percibir plataformas etéreas cósmicas (*) haciéndolas sólidas y revela muros agrietados.',
        buy: () => { 
          player.hasAstralEye = true; 
          sfx('relic'); 
          showBanner('¡OJO ASTRAL DESPERTADO! VERÁS LO INVISIBLE EN EL REINO', 180); 
          if (typeof showSkillTutorial === 'function') showSkillTutorial('astraleye');
          return true; 
        }
      },
      {
        id: 'astral_sight', name: 'CÓDICE DE LAS CONSTELACIONES', icon: '🌌', cost: 70,
        desc: 'Reduce el coste de esencia para lanzar magia a solo 5 ♦.',
        buy: () => { player.spellCostReduced = true; sfx('relic'); showBanner('¡COSTE DE HECHIZOS REDUCIDO A LA MITAD!', 160); return true; }
      }
    ]
  },

  cartografa: {
    name: 'CARTÓGRAFA NOA — CASA DE CARTOGRAFÍA',
    subtitle: '«UNA RUTA MARCADA NO ES MENOS PELIGROSA; SOLO TE PERMITE ELEGIR EL PELIGRO.»',
    portrait: "url('img/portraits/dario_portrait.jpg')",
    items: [
      { id: 'atlas_regional', name: 'ATLAS DE VÉSPERA', icon: '🗺️', cost: 70, desc: 'Revela todas las cartas regionales disponibles en el Grimorio.', buy: () => { purchasedMaps.villa = true; purchasedMaps.juramento = true; purchasedMaps.astral = true; purchasedMaps.reloj = true; sfx('relic'); showBanner('¡ATLAS COMPLETO AÑADIDO AL GRIMORIO!', 160); return true; } },
      { id: 'compass_blood', name: 'BRÚJULA DE SANGRE', icon: '🧭', cost: 45, desc: 'Activa permanentemente el marcador opcional de objetivo.', buy: () => { gameSettings.showObjectiveMarker = true; sfx('relic'); showBanner('¡BRÚJULA DE SANGRE SINTONIZADA!', 150); return true; } },
      { id: 'scout_vial', name: 'RACIÓN DEL EXPLORADOR', icon: '🥖', cost: 30, desc: 'Recupera 40 HP antes de iniciar una expedición.', buy: () => { player.hp = Math.min(player.maxHp, player.hp + 40); sfx('heart'); showBanner('¡RACIÓN CONSUMIDA! +40 HP', 130); return false; } }
    ]
  },
  alquimista: {
    name: 'ALQUIMISTA UMBRÍO — LABORATORIO SUBTERRÁNEO',
    subtitle: '«EL CONOCIMIENTO ES COMO EL VENENO: LA DOSIS DECIDE SI TE SALVA.»',
    portrait: "url('img/portraits/elena_portrait.jpg')",
    items: [
      { id: 'umbrio_elixir', name: 'ELIXIR DE MAREA OSCURA', icon: '🧪', cost: 38, desc: 'Restaura 55 HP y elimina el ardor de la corrupción.', buy: () => { player.hp = Math.min(player.maxHp, player.hp + 55); sfx('heart'); showBanner('¡ELIXIR UMBRÍO: +55 HP!', 130); return false; } },
      { id: 'acid_coating', name: 'RECUBRIMIENTO DE SAL NEGRA', icon: '⚗️', cost: 65, desc: 'Activa el filo venenoso para desgastar enemigos resistentes.', buy: () => { player.poisonBlade = true; sfx('relic'); showBanner('¡FILO DE SAL NEGRA ACTIVADO!', 150); return true; } },
      { id: 'stubborn_blood', name: 'SANGRE COAGULADA', icon: '🩸', cost: 75, desc: 'Reduce el daño recibido en un 25%.', buy: () => { player.damageReduction = Math.max(player.damageReduction || 0, 0.25); sfx('relic'); showBanner('¡SANGRE COAGULADA: DEFENSA +25%!', 150); return true; } }
      ,{ id: 'moon_bomb', name: 'BOMBA DE FLOR LUNAR', icon: '💣', cost: 20, ingredients: { flower: 2, ash: 1 }, desc: 'Destila una bomba que aumenta el daño del siguiente hechizo.', buy: () => { player.nextSpellBonus = (player.nextSpellBonus || 0) + 25; sfx('relic'); showBanner('¡BOMBA DESTILADA: PRÓXIMO HECHIZO +25 DAÑO!', 150); return false; } }
      ,{ id: 'antidote', name: 'ANTÍDOTO DE SAL NEGRA', icon: '🧪', cost: 15, ingredients: { bone: 1, flower: 1 }, desc: 'Restablece 35 HP y limpia la corrupción de la sangre.', buy: () => { player.hp = Math.min(player.maxHp, player.hp + 35); sfx('heart'); showBanner('¡ANTÍDOTO PREPARADO: +35 HP!', 130); return false; } }
    ]
  },
  reliquiario: {
    name: 'CUSTODIA SELENE — RELIQUIARIO ASTRAL',
    subtitle: '«NO MIRES LA LUZ DEMASIADO TIEMPO; PODRÍA RECORDAR TU NOMBRE.»',
    portrait: "url('img/portraits/corvus_portrait.jpg')",
    items: [
      { id: 'lunar_core', name: 'NÚCLEO LUNAR', icon: '🌙', cost: 85, desc: 'Aumenta en 12 el poder de los hechizos carmesíes.', buy: () => { player.spellPower = (player.spellPower || 0) + 12; sfx('relic'); showBanner('¡NÚCLEO LUNAR: MAGIA +12!', 150); return true; } },
      { id: 'star_ward', name: 'VIGILIA ESTELAR', icon: '✨', cost: 95, desc: 'Despierta un orbe astral protector alrededor de Alaric.', buy: () => { player.hasOrbitingOrb = true; sfx('relic'); showBanner('¡VIGILIA ESTELAR DESPERTADA!', 150); return true; } },
      { id: 'astral_salve', name: 'BÁLSAMO DE CONSTELACIÓN', icon: '💠', cost: 42, desc: 'Restaura toda la vida antes de entrar al Observatorio.', buy: () => { player.hp = player.maxHp; sfx('heart'); showBanner('¡VIDA RESTAURADA POR LA CONSTELACIÓN!', 150); return false; } }
      ,{ id: 'rune_comet', name: 'RUNA DEL COMETA (+6 MAGIA)', icon: '🌠', cost: 30, ingredients: { crystal: 3, gear: 1 }, desc: 'Graba una runa estelar permanente en el Filo Carmesí.', buy: () => { player.spellPower = (player.spellPower || 0) + 6; sfx('relic'); showBanner('¡RUNA DEL COMETA: +6 MAGIA!', 150); return true; } }
      ,{ id: 'astral_talisman', name: 'TALISMÁN DE LUZ LUNAR', icon: '🌙', cost: 35, ingredients: { crystal: 2, flower: 2 }, desc: 'Reduce el coste de magia y fortalece las runas astrales.', buy: () => { player.spellEfficiency = Math.min(6, (player.spellEfficiency || 0) + 2); sfx('relic'); showBanner('¡TALISMÁN AFINADO: -2 COSTE DE HECHIZO!', 150); return true; } }
    ]
  },
  boros: {
    name: 'HERRERO BOROS — FORJA CARMESÍ',
    subtitle: '«EL ACERO SOLO CEDE ANTE EL FUEGO Y EL MARTILLO. DIME QUÉ FORJAMOS HOY.»',
    portrait: "url('img/portraits/boros_portrait.jpg')",
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
      },
      {
        id: 'forge_ash_blade', name: 'FILIGRANA DE CENIZA (+5 ATK)', icon: '⚒️', cost: 25, ingredients: { ash: 3, bone: 2 },
        desc: 'Forja una mejora de filo con ceniza carmesí y hueso antiguo.',
        buy: () => { player.atk += 5; sfx('relic'); showBanner('¡FILIGRANA FORJADA: +5 ATK!', 150); return true; }
      },
      {
        id: 'forge_amulet_slot', name: 'ENGARCE DE AMULETO (+1 RANURA)', icon: '🧿', cost: 35, ingredients: { bone: 2, crystal: 1 },
        desc: 'Repara un engarce antiguo para equipar un amuleto adicional.',
        buy: () => { player.amuletSlotBonus = Math.min(2, (player.amuletSlotBonus || 0) + 1); sfx('relic'); showBanner('¡ENGARCE RESTAURADO: +1 RANURA!', 150); return true; }
      }
    ]
  }
};
