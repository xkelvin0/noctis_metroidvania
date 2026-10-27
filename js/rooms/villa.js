// =========================================================
// SALAS URBANAS Y HUB DE LA VILLA REFUGIO (js/rooms/villa.js)
// =========================================================

// ZONA 1 DE LA VILLA: Plaza de la Taberna (Entrada Oeste)
ROOM_DEFS["-2"] = {
  name: "Villa Refugio: Plaza de la Taberna & Capilla",
  gridX: -3, gridY: 2,
  doors: {
    left: { to: 15, x: 430, y: 200, requiresAbility: 'hasDoubleJump', requiresLabel: 'DOBLE SALTO' },
    right: { to: -1, x: 30, y: 200 }
  },
  map: [
    "##############################",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "<............................>",
    "<..G...L...C.....W...L...H...>",
    "##############################",
    "##############################"
  ],
  spawns: [
    { type: 'guard', x: 60, y: 200, name: "Vigía del Portón Oeste", dir: 1, dialog: "«¡Alto ahí!... Por los santos... tu piel no es fría como la piedra. ¡Tu pecho late! ¿Quién eres, extranjero?»" },
    { type: 'citizen', x: 150, y: 200, name: "Sacerdote Anselmo", dir: 1, dialog: "«Un milagro impío... sangre viva bajo el Eclipse. Acércate a las campanas de la Capilla si la bruma carmesí hiela tus entrañas.»" },
    { type: 'citizen', x: 230, y: 200, name: "Aldeana María", dir: -1, dialog: "«¿Vienes de las viejas criptas del bosque? Si buscas pertrechos, cruzando la plaza hacia el mercado encontrarás a Dario el tuerto... comercia con lo que queda del viejo mundo.»" },
    { type: 'citizen', x: 290, y: 200, name: "Viajero errante", dir: -1, dialog: "«El frío en mis huesos empeora cada noche... Dicen que en lo alto de la Torre, el señor del castillo todavía vela por nosotros... pero esto no es vida.»" },
    { type: 'citizen', x: 370, y: 200, name: "Posadera Greta", dir: 1, dialog: "«Pasa y calienta tus manos junto a las brasas, cazador. La niebla no entra aquí. Si buscas cruzar hacia la fortaleza, te advierto que la Puerta Este está sellada por los centinelas.»" },
    { type: 'guard', x: 430, y: 200, name: "Centinela Vesperal", dir: -1, dialog: "«Las bestias del bosque temen la luz de los faroles. No te alejes del camino empedrado; los muertos no descansan allá afuera.»" }
  ]
};

// ZONA 2 DE LA VILLA: Mercado y Bazar
ROOM_DEFS["-1"] = {
  name: "Villa Refugio: Mercado & Almacén Central",
  gridX: -2, gridY: 2,
  doors: {
    left:  { to: -2, x: 430, y: 200 },
    right: { to: 0,  x: 30,  y: 200 }
  },
  map: [
    "##############################",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "<............................>",
    "<...M...L....K.....L....A....>",
    "##############################",
    "##############################"
  ],
  spawns: [
    { type: 'citizen', x: 70, y: 200, name: "Dario el Tuerto", dir: 1, dialog: "«¿Tienes Esencia que cambiar por artefactos del viejo mundo?»" },
    { type: 'citizen', x: 140, y: 200, name: "Niña Huérfana Lía", dir: 1, dialog: "«Dicen que el sol era dorado antes del gran silencio... ¿tú has visto el sol de verdad?»" },
    { type: 'citizen', x: 215, y: 200, name: "Mercader de Telas Garrow", dir: -1, dialog: "«Guardo mantos gruesos en el almacén. El viento del castillo congela la carne viva.»" },
    { type: 'citizen', x: 295, y: 200, name: "Erudito Vesperal", dir: -1, dialog: "«El Eclipse no es una maldición divina... fue forzado por manos humanas.»" },
    { type: 'citizen', x: 375, y: 200, name: "Boticaria Elena", dir: 1, dialog: "«Mis hierbas y raíces lunares aún resisten la ponzoña del eclipse.»" },
    { type: 'guard', x: 430, y: 200, name: "Sargento de la Guardia", dir: -1, dialog: "«Puesto de inspección. Si encuentras armamento maldito en la fortaleza, repórtalo.»" }
  ]
};

// ZONA 3 DE LA VILLA: Puerta Este y Altar Sagrado
ROOM_DEFS[0] = {
  name: "Villa Refugio: Puerta Este & Puesto de Muralla",
  gridX: -1, gridY: 2,
  doors: {
    left:  { to: -1, x: 430, y: 218 },
    right: { to: 101, x: 30,  y: 218 }
  },
  map: [
    "##############################",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "<............................>",
    "<..F......P......S......G....>",
    "##############################",
    "##############################"
  ],
  spawns: [
    { type: 'citizen', x: 75, y: 200, name: "Herrero Boros", dir: 1, dialog: "«Si buscas acero templado, el castillo tiene metales sagrados olvidados.»" },
    { type: 'guard', x: 175, y: 200, name: "Capitán de la Muralla", dir: 1, dialog: "«Alaric... la puerta del castillo está abierta, pero nadie que cruzó volvió en sus cabales.»" },
    { type: 'citizen', x: 225, y: 200, name: "Refugiado Malherido", dir: -1, dialog: "«Los muros de la fortaleza cambian cuando el eclipse late... ten piedad de los caídos.»" },
    { type: 'citizen', x: 285, y: 200, name: "Sacerdotisa Caída", dir: -1, dialog: "«Reza en el Altar si tu sangre flaquea. El fuego sagrado restaurará tu vitalidad.»" },
    { type: 'guard', x: 375, y: 200, name: "Guardia del Alba", dir: -1, dialog: "«Más allá de la muralla está el patio de la fortaleza. Cuidado con las estacas y lanceros.»" },
    { type: 'guard', x: 430, y: 200, name: "Ballestero de Ronda", dir: -1, dialog: "«Vigilamos la Atalaya. Si una abominación salta el foso, le clavamos virote de plata.»" }
  ]
};

// DISTRITOS URBANOS EXTERIORES DEL REFUGIO
ROOM_DEFS[31] = {
  name: 'Villa Refugio: Posada del Farol Azul', gridX: -4, gridY: 2,
  doors: { left: { to: 32, x: 430, y: 200 }, right: { to: -2, x: 30, y: 200 } },
  map: ['##############################','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','<............................>','<..I...L.....H.....L.....C...>','##############################','##############################'],
  spawns: [
    { type: 'citizen', x: 75, y: 200, name: 'Posadera Greta', dir: 1, dialog: '«Una cama caliente no derrota al Eclipse, pero sí devuelve fuerzas para seguir.»' },
    { type: 'citizen', x: 180, y: 200, name: 'Músico Ivo', dir: -1, dialog: '«Las canciones antiguas esconden rutas; escucha los versos cuando regreses con un sello.»' },
    { type: 'citizen', x: 330, y: 200, name: 'Hermana Calista', dir: 1, dialog: '«La capilla recibe a quien vuelve de las catacumbas. No todos regresan iguales.»' }
  ]
};

ROOM_DEFS[32] = {
  name: 'Villa Refugio: Casa de Cartografía', gridX: -5, gridY: 2,
  doors: { left: { to: 33, x: 430, y: 200 }, right: { to: 31, x: 30, y: 200 } },
  map: ['##############################','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','<............................>','<..Q...L.....W.....L.....H...>','##############################','##############################'],
  spawns: [
    { type: 'citizen', x: 95, y: 200, name: 'Cartógrafa Noa', dir: 1, dialog: '«No vendo caminos: vendo la certeza de no caminar dos veces hacia tu muerte.»' },
    { type: 'citizen', x: 230, y: 200, name: 'Explorador Ciego', dir: -1, dialog: '«Marca los altares. La fortaleza cambia, pero las llamas recuerdan.»' },
    { type: 'citizen', x: 380, y: 200, name: 'Pregonera Sable', dir: 1, dialog: '«¡Cartas frescas, rutas limpias y rumores de pasadizos imposibles!»' }
  ]
};

ROOM_DEFS[33] = {
  name: 'Villa Refugio: Camino de los Carros', gridX: -6, gridY: 2,
  doors: { right: { to: 32, x: 30, y: 200 } },
  map: ['##############################','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................>','#..H...L.....P.....L.....G...>','##############################','##############################'],
  spawns: [
    { type: 'guard', x: 16, y: 200, name: 'Vigía del Derrumbe', dir: 1, stationary: true, dialog: '«El camino oeste terminó bajo el derrumbe. Cuando consigas DOBLE SALTO, ve a la Puerta Este: su salida alta derecha conduce a los Jardines del Reloj.»' },
    { type: 'citizen', x: 260, y: 200, name: 'Carretero Oren', dir: -1, dialog: '«Antes llevaba trigo; ahora llevo cartas para quienes aún esperan una respuesta.»' },
    { type: 'guard', x: 390, y: 200, name: 'Vigía del Camino', dir: -1, dialog: '«Solo un salto doble supera el derrumbe. No es un paseo.»' }
  ]
};

ROOM_DEFS[34] = {
  name: 'Enclave Subterráneo: Laboratorio Umbrío', gridX: -1, gridY: 4,
  doors: { left: { to: 35, x: 430, y: 200 }, right: { to: 9, x: 30, y: 200 } },
  map: ['##############################','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','<............................>','<..U...L.....W.....L.....H...>','##############################','##############################'],
  spawns: [
    { type: 'citizen', x: 85, y: 200, name: 'Alquimista Umbrío', dir: 1, dialog: '«Cada veneno tiene su antídoto; el problema es sobrevivir a ambos.»' },
    { type: 'citizen', x: 230, y: 200, name: 'Ayudante Mirea', dir: -1, dialog: '«No toques los frascos verdes. Tampoco los que respiran.»' },
    { type: 'citizen', x: 385, y: 200, name: 'Minero Tesk', dir: 1, dialog: '«El pozo bajo el laboratorio comunica con tumbas anteriores al Eclipse.»' }
  ]
};

ROOM_DEFS[35] = {
  name: 'Enclave Subterráneo: Pozo de los Juramentos', gridX: -2, gridY: 4,
  doors: { right: { to: 34, x: 30, y: 200 } },
  map: ['##############################','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................>','<..W...L.....C.....L.....H...>','##############################','##############################'],
  spawns: [
    { type: 'guard', x: 100, y: 200, name: 'Escudero Renal', dir: 1, dialog: '«Cada caballero dejó aquí un juramento. El tuyo todavía no tiene palabras.»' },
    { type: 'citizen', x: 260, y: 200, name: 'Viuda Neris', dir: -1, dialog: '«Escucho a mi esposo cantar desde el pozo. Sé que no debo responder.»' },
    { type: 'guard', x: 390, y: 200, name: 'Centinela de Sal', dir: -1, dialog: '«El agua mantiene alejadas a ciertas cosas. No preguntes cuáles.»' }
  ]
};

ROOM_DEFS[36] = {
  name: 'Santuario de los Astrónomos: Reliquiario de Selene', gridX: 1, gridY: 1,
  doors: { left: { to: 10, x: 430, y: 200 }, right: { to: 37, x: 30, y: 200 } },
  map: ['##############################','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','<............................>','<..R...L.....C.....L.....V...>','##############################','##############################'],
  spawns: [
    { type: 'citizen', x: 85, y: 200, name: 'Custodia Selene', dir: 1, dialog: '«Las reliquias no eligen al fuerte, Alaric. Eligen al que aún puede escuchar.»' },
    { type: 'citizen', x: 230, y: 200, name: 'Monja Estelar Lyra', dir: -1, dialog: '«El reliquiario guarda luces que no pertenecen a este cielo.»' },
    { type: 'citizen', x: 385, y: 200, name: 'Aprendiz Ciro', dir: 1, dialog: '«Si una estrella cae dentro de un frasco, ¿sigue siendo una estrella?»' }
  ]
};

ROOM_DEFS[37] = {
  name: 'Santuario de los Astrónomos: Biblioteca del Firmamento', gridX: 2, gridY: 1,
  doors: { left: { to: 36, x: 430, y: 200 } },
  map: ['##############################','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','#............................#','<............................#','<..V...L.....R.....L.....C...#','##############################','##############################'],
  spawns: [
    { type: 'citizen', x: 90, y: 200, name: 'Archivista Ptol', dir: 1, dialog: '«Los mapas del cielo también tienen puertas. Algunas llevan hacia dentro.»' },
    { type: 'citizen', x: 235, y: 200, name: 'Astrónoma Iriel', dir: -1, dialog: '«Después de cada sello, una constelación pierde una estrella.»' },
    { type: 'guard', x: 385, y: 200, name: 'Guardián de Cristal', dir: -1, dialog: '«La biblioteca no es refugio. Es una frontera contra lo que observa desde arriba.»' }
  ]
};

