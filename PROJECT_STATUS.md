# Contexto y Estado del Proyecto: Noctis - El Eco Carmesí (Metroidvania 2D Web)

Este documento sirve como resumen ejecutivo y transferencia de contexto (Handoff / Project Status) para continuar el desarrollo en una nueva sesión o chat.

---

## 1. Ubicación y Estructura del Proyecto
- **Ruta local**: `C:\Users\kelvi\Documents\videosjuegos con geminis\noctis_metroidvania`
- **Punto de entrada**: `index.html` (abrible directamente en cualquier navegador web)
- **Tecnologías**: HTML5 Canvas, CSS3 Modular, JavaScript Vanilla (sin librerías externas ni bundlers)

### Arquitectura de Archivos:
- `index.html`: Canvas de juego y contenedores de UI (menú de título, cinemática de prólogo, tienda RPG de Dario, menú de pausa gótico y tutoriales).
- `css/`:
  - `base.css`: Reset, estilos del canvas, contenedor y modo de resolución HD.
  - `title.css`: Pantalla de inicio y menú principal.
  - `intro.css`: Cinemática de introducción con diálogos y ambientación.
  - `pause.css`: Menú de pausa gótico con pestañas (Mapa, Reliquias, Misiones, Bestiario, Opciones).
  - `shop.css`: Interfaz de la tienda de Dario con retratos y compra con Esencia.
  - `tutorial.css`: Notificaciones y ventanas flotantes de aprendizaje de habilidades.
- `js/data/`:
  - `bestiary.js`: 8 monstruos y lore completo.
  - `merchants.js`: Catálogo de mejoras y reliquias de Dario.
  - `quests.js`: Misiones del cazador y memorias del Eclipse.
  - `relics.js`: Reliquias desbloqueables (Dash, Doble Salto, Garras de Muro, Ojo Astral).
- `js/ui/`:
  - `intro.js`: Prólogo cinemático con Alaric despertando desorientado.
  - `pause.js`: Menú de pausa, cambio de pestañas, atajos y control de volumen/gráficos.
  - `shop.js`: Lógica del bazar de Dario.
  - `tutorial.js`: Modales flotantes de tutoriales.
- `js/`:
  - `audio.js`: Sintetizador Web Audio API procedural (música y SFX dinámicos).
  - `rooms.js`: Motor base ligero (~60 líneas) con constantes de mapa, API de zonas y registro maestro `ROOM_DEFS`.
  - `rooms/`:
    - `villa.js`: Salas seguras del Hub de la Villa (-2, -1, 0, 31..37), tiendas y diálogos de ciudadanos.
    - `ash_path.js`: Los 8 tramos artesanales del Sendero de Ceniza (101 a 108).
    - `fortress.js`: Salas clásicas del castillo (1 a 30), jefe Lord Malakor y santuarios opcionales (601..604).
    - `expeditions.js`: Generador de 90+ salas exteriores (Catacumbas, Jardines, Observatorio, Fortaleza) con 8 arquetipos rotativos y atajos.
  - `entities.js`: Jugador Alaric, combate, 8 tipos de enemigos, NPCs con diálogo (tecla E) y Jefe Malakor.
  - `sprites.js`: Motor base ligero (~90 líneas) que carga imágenes, tilesets y utilidades de Chroma Key.
  - `sprites/`:
    - `player.js`: Animaciones y renderizado de Alaric (tajo frontal, pogo downward y dash).
    - `bestiary.js`: Renderizado de todos los enemigos, NPCs por oficio, Lord Malakor y retratos de diálogo.
    - `environment.js`: Altares, tiendas, edificios de la ciudad, faroles, adoquines, muros y plataformas.
    - `atmosphere.js`: Fondos góticos por bioma, clima localizado, niebla, cenizas y viñeta.
  - `main.js`: Bucle fijo a 60 FPS, input, escalado de render y HUD gótico.
- `img/`:
  - `portraits/`: Retratos de personajes para tiendas y diálogos (Dario, Elena, Corvus, Boros).
  - `backgrounds/`: Fondos panorámicos de zonas y biomas (cielo nocturno, catacumbas, observatorio, jardines, villa).
  - `cinematics/`: Ilustraciones cinemáticas de la intro y el prólogo del cazador.
  - `environment/`: Edificios de la villa, faroles, tiendas, altares y cabañas.
  - `tilesets/`: Hojas de tiles de mazmorras y terreno.

---

## 2. Últimos Cambios y Correcciones Realizadas

1. **Corrección del Crash de Sprites (Pantalla vacía)**:
   - Se corrigió un `ReferenceError: gy is not defined` en `drawChapelSprite()` dentro de `js/sprites.js`. Al eliminar la variable residual, todo el pipeline de dibujo (tiles, Alaric, NPCs, interfaz y HUD) volvió a renderizar a la perfección.

2. **Espaciado y Separación de Edificios**:
   - En la **Sala -1 (Mercado y Almacén Central)**, la Botica (`A`) y el Puesto Militar (`P`) estaban pegados. Se eliminó la barricada duplicada (que ya pertenece a la muralla en la Sala 0) y se distribuyeron holgadamente el puesto de Dario (`M`), el Almacén del Gremio (`K`), la Botica (`A`) y los faroles (`L`), dejando más de 100 píxeles libres entre cada uno.
   - En la **Sala -2 (Plaza de la Taberna & Capilla)**, se separaron la Atalaya (`G`), la Gran Capilla (`C`), el Pozo (`W`) y la Taberna (`H`), reubicando los NPCs junto a sus edificios respectivos.

3. **Mejora de Resolución y Super-Sampling Gráfico**:
   - Se añadió soporte para **Super-Sampling HD (960x540)** con escalado subpíxel `ctx.scale(2, 2)` y filtrado bicúbico de alta fidelidad (`imageSmoothingQuality = 'high'`).
   - El suelo de la ciudad ahora utiliza losas de piedra gótica texturizadas del tileset en vez de trazos geométricos simples.
   - **Alternancia Dinámica de Resolución**:
     - Se puede alternar en tiempo real entre **HD Nítido 960p** y **Retro Pixel 480p** pulsando la tecla **`H`** o desde el menú de pausa (**P / ESC** → Opciones).

4. **Sistema de Guardado y Checkpoints (`localStorage`)**:
   - Puntos de guardado en los Altares de Sangre (`S`) con tecla `E`, restaurando la vida al 100% y emitiendo pilares de partículas doradas/carmesí.
   - Sistema de Checkpoint persistente (`lastAltarRoom`, `lastAltarX`, `lastAltarY`): al morir o seleccionar "Reiniciar desde Último Altar", Alaric reaparece en el último altar consagrado con vida completa, conservando toda la Esencia y habilidades acumuladas.
   - Botón interactivo "💾 Guardar Partida (Progreso Actual)" añadido en la pestaña de Opciones del Grimorio / Menú de Pausa.
   - Carga dinámica del botón "Continuar" en el menú de inicio que restaura estado de salas, muros rotos, almas, habilidades y misiones.

5. **Expansión y Pulido de Combate / Jefe Lord Malakor**:
   - **Fases de Combate**:
     - *Fase 1*: Ráfagas mágicas, embestida sombría veloz y pilares solares.
     - *Transición a Fase 2 (<= 50% HP)*: Onda expansiva con Screen Shake intenso (`25, 6`), Hitstop dramático (`14 frames`), rugido del Eclipse y despliegue de alas carmesí.
     - *Fase 2 (Furia del Eclipse)*: Pentarráfagas dispersas, doble embestida con teletransporte a la espalda del jugador, pilares en cadena y lluvia de cometas en picada desde el cielo.
   - **Telegrafiado de Ataques**:
     - Indicador `⚠ ¡ALERTA!` sobre la cabeza de Malakor antes de embestidas, ráfagas y cometas.
     - Vector de trayectoria de embestida trazado en el suelo con línea discontinua carmesí.
     - Grietas rúnicas incandescentes en el suelo indicando dónde brotarán los pilares de fuego antes de la erupción.
     - Evasión de niebla espectral (combo breaker) si Malakor recibe 3 golpes seguidos.
   - **Juiciness / Game Feel de Impacto**:
     - Freeze frames (Hitstop de 3 a 6 frames) en cada tajo de espada o rebote pogo.
     - Screen Shake direccional dinámico calibrado por fuerza de impacto.
     - Partículas de salpicaduras de sangre carmesí (`spawnBloodParticles`) con física de gravedad.
   - **Victoria y Drops Épicos**:
     - Derrota con explosión cósmica, soltando el *Corazón del Sol Renacido*, 150 Esencia y 4 Corazones grandes, liberando el cielo y desbloqueando el logro del cazador.

6. **Mecánica Activa de Misiones (`quests.js`)**:
   - 7 misiones activas (Herencia de la Sangre, Voces del Refugio, Cacería Vesperal, Purga de las Criptas, Llama del Santuario, Ecos en la Roca, El Ocaso del Tirano).
   - Disparadores en tiempo real vinculados a muertes de enemigos, conversaciones con NPCs, consagración de altares, muros secretos rotos y reliquias recogidas.
   - Notificaciones y banners flotantes al actualizar o completar misiones.
   - Pestaña de Misiones interactiva en el Grimorio con barras de progreso animadas, porcentajes y botón interactivo `[✦ RECLAMAR +XX ♦]` para cobrar la Esencia.
   - Diálogo dinámico de Dario en el bazar reconociendo el cumplimiento de los contratos de cacería.

7. **Diseño de Nuevas Zonas y Puzzles Metroidvania**:
   - **Muros Escalables (`hasWallJump`)**: Marcas rúnicas de garras en los muros verticales de chimeneas de escalada para guiar los saltos de pared.
   - **Barreras Sombrías (`hasDash` / `B`)**: En Sala 3 (Galería de los Susurros), barrotes crepitantes de energía púrpura que bloquean el paso normal pero se traspasan limpiamente con el Dash Sombrío.
   - **Visión Astral (`hasAstralEye` / `*`)**: Catálogo de Corvus ampliado con el *Ojo Astral de Véspera*; en Sala 13 (Escalinata de Cristal) se colocó un precipicio con plataformas etéreas de cristal `*` y un muro secreto `?` que solo se materializan y vuelven sólidas al equipar el Ojo Astral.

8. **Sistema de Diálogo Paginado y Persistente (Tecla E / ESC)**:
   - **Paginación Inteligente**: Diálogos extensos de supervivientes y guardias se dividen automáticamente en páginas de 2 líneas (`paginateDialogueText`) que encajan perfectamente sin desbordar el marco visual.
   - **Avance de Diálogo con Tecla `E`**: Si el texto tiene múltiples partes, al pulsar `E` se avanza a la siguiente página con efecto de sonido suave (`sfx('orb')`), indicando `[E] Siguiente ▶ (1/2)`.
   - **Persistencia sin Temporizador**: Las conversaciones con NPCs no desaparecen solas por tiempo ni al caminar; permanecen activas en pantalla para que el jugador lea cómodamente a su propio ritmo.
   - **Cierre Rápido y Flexible**: En la última página, presionar `E` cierra la conversación inmediatamente. En cualquier momento, presionar `ESC` también cierra el diálogo sin abrir el menú de pausa.
9. **Estabilidad al Cambiar de Ventana y Spawns en Umbrales de Puertas**:
   - **Corrección de Spawn en Sala 01**: La puerta de entrada a la Sala 01 tenía un bloque sólido en el techo (`##` en fila 12) y una coordenada `y: 200` que incrustaba la cabeza del jugador dentro del muro, empujándolo fuera del encuadre. Se abrió el espacio del umbral y se calibró el spawn en suelo firme (`x: 26, y: 218`).
   - **Enraizamiento Inmediato para NPCs (`snapToGround`)**: Todos los NPCs y enemigos terrestres buscan hacia abajo la cota del suelo sólido o plataforma y apoyan sus pies de forma puramente vertical al cargar la sala, sin alterar coordenadas horizontales ni simular pasos de física.
   - **Manejo de Foco (`window.blur`, `window.focus`, `visibilitychange`)**: Al alternar de ventana o minimizar la pestaña (Alt+Tab), se liberan todas las teclas retenidas y se protege el acumulador de tiempo contra ráfagas de aceleración (`delta` limitado a 16.6ms).

10. **Modularización Limpia del Motor de Sprites (`js/sprites/`)**:
    - Se subdividió el monolito de ~1600 líneas `js/sprites.js` en una arquitectura limpia y modular:
      - `js/sprites.js` (~90 líneas): Carga y precarga de imágenes/tilesets, canvas Chroma Key fuera de pantalla, caché y utilidades de render de matrices.
      - `js/sprites/player.js`: Paleta, matrices de animación y estados de Alaric (idle, carrera, salto, dash y slash frontal / pogo).
      - `js/sprites/bestiary.js`: Renderizado de los 8 tipos de enemigos, variantes de aldeanos/guardias según oficio, animaciones de Lord Malakor (fases 1 y 2, alas, telegrafiado y barra) y retratos detallados para cuadros de diálogo.
      - `js/sprites/environment.js`: Altares de guardado, tiendas, cabañas, faroles, pozos, edificios militares góticos, baldosas de ciudad, muros y plataformas de mazmorra.
      - `js/sprites/atmosphere.js`: Fondos por bioma, niebla y lluvia por zonas, partículas de ceniza y viñeta de bordes oscuros.
    - Actualizado `index.html` con la secuencia ordenada de scripts sin alterar compatibilidad ni rendimiento.

11. **Organización y Clasificación de Recursos Gráficos en `img/`**:
    - Se reclasificaron las 25 imágenes en subcarpetas semánticas dentro de `img/`:
      - `img/portraits/`: Retratos de personajes para el bazar y diálogos (`boros`, `corvus`, `dario`, `elena`).
      - `img/backgrounds/`: Fondos panorámicos de biomas (`ambient_skyline`, `fortress_carmesi`, `catacumbas`, `observatorio`, `jardines_reloj`, `village_bg`).
      - `img/cinematics/`: Escenas de la secuencia de introducción y prólogo (`intro_bg`, `intro_alaric`, `intro_villa`, `intro_plaza`).
      - `img/environment/`: Sprites de edificios, tiendas, altares, faroles y decoración.
      - `img/tilesets/`: Tilesets de sillar y pavimentos (`dungeon_tileset`, `village_sheet`).
    - Actualizadas todas las rutas en `index.html`, `js/sprites.js`, `js/data/merchants.js` y `js/ui/intro.js`.

12. **Diseño Artesanal del Sendero de Ceniza y Variedad en Mazmorras**:
    - **Sendero de Ceniza (Salas 101 a 108)**: Se eliminó la generación repetitiva y se construyeron 8 mapas artesanales con identidad propia (rutas dobles, templos derruidos, fosos para saltos con Dash, Altar del Caminante y portal monumental a las catacumbas).
    - **Variedad en Mazmorras de Expedición (`makeExpeditionMap`)**: Se sustituyó el generador plano por un motor de 8 arquetipos arquitectónicos rotativos (pasarelas dobles, saltos en zigzag, fosos con islas, baluartes y acueductos) aplicados a Catacumbas (201-224), Jardines (401-424), Observatorio (501-524) y Fortaleza (1001-1020), eliminando la repetición en todo el juego.

13. **Modularización Limpia del Sistema de Habitaciones (`js/rooms/`)**:
    - Se subdividió el monolito de ~1400 líneas `js/rooms.js` en una arquitectura limpia y modular de 4 submódulos:
      - `js/rooms.js` (~60 líneas): Constantes de pantalla y tilemap, API de zonas (`getRoomZone`), etiquetas de mapa y helpers de puertas (`openGroundDoor`, `openUpperDoor`).
      - `js/rooms/villa.js`: Salas del Hub urbano de Villa Refugio (-2, -1, 0, 31..37), comercios y diálogos de ciudadanos/guardias.
      - `js/rooms/ash_path.js`: Los 8 tramos artesanales del Sendero de Ceniza (101 a 108).
      - `js/rooms/fortress.js`: Salas clásicas del castillo (1 a 30), sala del Jefe Lord Malakor (5) y santuarios opcionales (601..604).
      - `js/rooms/expeditions.js`: Motor generador de expediciones (Catacumbas, Jardines, Observatorio, Fortaleza) con 8 arquetipos rotativos, rutas de acceso (41..55) y atajos físicos bidireccionales.
    - Se verificó la inicialización completa de las 159 salas del juego en orden estricto de dependencias en `index.html`.

14. **Modularización Arquitectónica de Entidades (`js/entities/`)**:
    - Se refactorizó el archivo más pesado del juego (`js/entities.js`, originalmente 2.034 líneas) dividiéndolo en 4 submódulos limpios, desacoplados y con responsabilidades únicas:
      - `js/entities/physics.js` (177 líneas): Detección AABB, verificación de colisión de tiles (`#`, `?`, `B`), `moveWithCollisions`, `snapToGround`, cálculo de daño, screen shake, hit-stop y partículas de sangre/chispas.
      - `js/entities/player.js` (812 líneas): Definición del objeto `player` (Alaric) y bucle de control `updatePlayer` (máquina de estados, salto, doble salto, wall-slide, wall-jump, dash con frames de invencibilidad, pogo-slash aéreo, ataques con espada, hechizos arcanos, ruptura de muros frágiles, interacción con altares y recolección de reliquias).
      - `js/entities/enemies.js` (609 líneas): Lógica `updateEnemies` y `defeatEnemyFromStatus` para los 8 arquetipos de enemigos, ciudadanos y guardias con IA de patrulla, combate y teletransporte del Jefe Lord Malakor (2 fases, pilares de sangre, telegrafiado de ataques), proyectiles, orbes de esencia magnéticos y textos de daño flotante.
      - `js/entities.js` (438 líneas): Estado global del mundo (`currentRoomId`, `materials`, `seals`, `storyProgress`), datos y memorias de jefes, banners de texto y diálogos con paginación, guardado en `localStorage` y la función central `loadRoom`.
    - Integrado en `index.html` y validado al 100% mediante suite de tests en Node.js VM.

15. **Modularización del Núcleo de Ejecución y Motor (`js/core/` y `js/main.js`)**:
    - Se extrajeron y modularizaron las 713 líneas de `js/main.js` en una arquitectura limpia dentro de `js/core/`:
      - `js/core/input.js` (128 líneas): Gestión de buffers de entrada `keys` y `justPressed`, listeners de ratón, atajos del grimorio (M, K, N, L, O, H, ESC) y control de pérdida de foco (`resetInputAndTiming`).
      - `js/core/hud.js` (163 líneas): Renderizado del HUD gótico con gradientes de vida dinámica, orbes de esencia, poder de ataque, sellos del eclipse, minimapa dinámico en tiempo real, banners con retratos de NPCs y diálogo paginado, y widget medidor de FPS.
      - `js/core/render.js` (231 líneas): Renderizado completo de escena (`drawWorld`): fondos atmosféricos y partículas de niebla, tilemap completo de salas y ciudades, orbes, reliquias, prompts de interacción contextuales, enemigos, proyectiles, jugador y viñeta gótica.
      - `js/core/save.js` (132 líneas): Gestión de la pantalla de inicio, inicio de nueva partida con reseteo de estadísticas y restauración de partida guardada desde `localStorage`.
      - `js/main.js` (125 líneas): Núcleo orquestador ultra liviano; gestión de resolución HD 960p / Retro Pixel 480p, composición de capas en `draw()` y bucle de paso fijo (`loop`) a 60 FPS con timestep acumulativo.

16. **Modularización del Menú de Pausa y Grimorio (`js/ui/pause/`)**:
    - Se refactorizó `js/ui/pause.js` (572 líneas) dividiéndolo en submódulos por pestaña y responsabilidad:
      - `js/ui/pause/map.js` (220 líneas): Renderizado del Gran Mapa (`renderLargeMap`), leyenda de candados de habilidades, estadísticas regionales (`getRegionStats`), marcador de objetivo y tooltips interactivos de sala.
      - `js/ui/pause/relics.js` (65 líneas): Panel de reliquias descubiertas, resumen de materiales, equipamiento de ranuras de amuletos y mejoras del Árbol de Magia.
      - `js/ui/pause/bestiary.js` (37 líneas): Selector lateral de monstruos, estadísticas de combate, debilidades tácticas y hábitat.
      - `js/ui/pause/quests.js` (88 líneas): Registro de misiones interactivas con reclamo de recompensas, barras de progreso y memorias del eclipse selladas.
      - `js/ui/pause/options.js` (105 líneas): Ajustes de volumen, reasignación de teclas (`captureBinding`), dificultad, efectos de vibración/destellos y alternancia de gráficos.
      - `js/ui/pause.js` (110 líneas): Coordinador maestro de pestañas, alternancia de pausa `togglePause`, reinicio y guardado manual.
    - Integrado en `index.html` y verificado al 100% en Node.js VM.

17. **Game Feel y Combate Visceral (Impact Flash, Slash Arcs y Pogo Jugoso)**:
    - **Arco de Espada en Medialuna (*Slash Arc*)**: Renderizado multicapa en `js/sprites/player.js` con halo carmesí exterior (`#ff0055`), filo interior de acero blanco brillante (`#ffffff`), destellos en cruz de acero en la punta y seguimiento angular suave según la progresión del ataque.
    - **Tajo hacia Abajo / Pogo Mejorado**: Estela semicircular descendente con filo penetrante vertical, impulso de rebote elevado (`vy = -6.8`), reinicio automático del enfriamiento del Dash para permitir combos aéreos fluidos (estilo *Hollow Knight*) y chispas radiales `spawnImpactSparks`.
    - **Destello de Impacto Puro (*Hit Flash*)**: Cuando cualquier monstruo o jefe recibe un impacto, su silueta se tiñe de blanco puro radiante durante los primeros 3 frames de daño (`hurtTimer >= 9`), otorgando una sensación de impacto contundente e instantáneo.
    - **Física de Retroceso y Clang Sonoro**: Alaric experimenta un ligero retroceso mutuo al impactar con la espada para aportar peso al golpe; implementado efecto sonoro sintetizado `pogo_hit` con doble resonancia metálica al rebotar sobre enemigos o pinchos.

18. **Soporte Completo para Mandos (Gamepad API & Háptica Dual-Rumble)**:
    - **Detección Automática de Mandos**: Escucha global de eventos `gamepadconnected` y `gamepaddisconnected` con banners contextuales en pantalla.
    - **Mapeo Estándar (Xbox, PlayStation, Nintendo Switch)**:
      - Stick Analógico Izquierdo / Cruceta D-Pad: Movimiento horizontal y agacharse.
      - Botón A / Cruz (0): Salto y doble salto.
      - Botón X / Cuadrado (2): Ataque con espada.
      - Botón RB / R1 (5) o Gatillo LT / L2 (6): Dash Sombrío.
      - Botón B / Círculo (1) o Gatillo RT / R2 (7): Hechizo de sangre / disparo arcano.
      - Botón Y / Triángulo (3): Interactuar con aldeanos, tiendas y consagrar altares.
      - Botón LB / L1 (4): Gancho espectral.
      - Botón Select / Back / Share (8): Acceso directo al Mapa Grande.
      - Botón Start / Menu (9): Menú de Pausa / Grimorio.
    - **Navegación de Grimorio con Mando**: Cambio de pestañas con LB / RB (como en consolas), botón A para aceptar/reclamar y botón B para reanudar.
    - **Vibración Háptica Dual-Rumble**: Integración de `vibrationActuator.playEffect('dual-rumble')` sincronizada con el daño sufrido, ruptura de muros frágiles, rebote de pogo e impactos de jefes. Toggle configurable en la pestaña de Opciones.

19. **Transiciones Cinematográficas de Sala (Room Transition Smooth Wipe/Slide) & Auditoría**:
    - **Duración y Curva Cinematográfica (150 ms)**:
      - Transición de cortinilla direccional de 150 ms con curva de atenuación cúbica (*cubic ease-out*).
      - Efecto de niebla/sombra con gradiente carmesí y púrpura oscuro (`#07030d` y `rgba(53, 20, 69, ...)`).
    - **Sincronización de Carga a Mitad de Camino (75 ms)**:
      - En el punto medio de la cortinilla (75 ms), con la pantalla 100% velada, se ejecuta `loadRoom(...)`, evitando cualquier parpadeo de entidades, recolocación de cámara o glitches visuales.
    - **Direccionalidad Cardinal Completa**:
      - El barrido se adapta a la dirección del viaje (`'right'`, `'left'`, `'up'`, `'down'`), reforzando la continuidad espacial del mapa interconectado.
    - **Congelamiento de Entidades**:
      - Durante los 150 ms de transición, el movimiento del jugador y la IA de los enemigos se congelan para evitar caídas o daños accidentales al cruzar puertas.
    - **Auditoría y Corrección de Bugs Críticos**:
      - *Bug 1 resuelto*: Se corrigió la condición de cruce por la puerta izquierda en `js/entities/player.js` (`(!doors.westUpper || player.y > 140)`), evitando que el jugador se quedase bloqueado en el aire en salas con una sola puerta oeste.
      - *Bug 2 resuelto*: Se añadió guardia en `js/ui/pause.js` para impedir abrir el menú de pausa durante los 150 ms de cambio de sala, previniendo desincronizaciones de estado.

---

## 3. Controles Principales del Juego
- **Teclado / Ratón**:
  - **A / D** o **Flechas**: Moverse
  - **W / Espacio**: Saltar (Doble salto / Salto en pared)
  - **J / Clic Izquierdo**: Atacar con la espada (Pogo jump si se ataca hacia abajo en el aire)
  - **K / Clic Derecho / Shift**: Dash sombrío
  - **E**: Interactuar (hablar, tiendas, guardar partida en altares)
  - **P / ESC**: Menú de pausa / Grimorio
  - **M / K / N / L**: Atajos directos a Mapa, Bestiario, Reliquias y Misiones
  - **H**: Alternar Modo Gráfico (HD 960p vs Retro Pixel 480p)
  - **O**: Silenciar / Activar Música
- **Mando (Xbox / PlayStation / Switch)**:
  - **Stick Izquierdo / Cruceta**: Moverse / Agacharse
  - **Botón A / Cruz**: Saltar
  - **Botón X / Cuadrado**: Atacar
  - **Botón RB / R1 o Gatillo LT**: Dash Sombrío
  - **Botón B / Círculo o Gatillo RT**: Hechizo
  - **Botón Y / Triángulo**: Interactuar
  - **Botón LB / L1**: Gancho
  - **Start**: Menú de Pausa
  - **Back / Select**: Gran Mapa
  - **LB / RB en Pausa**: Navegar pestañas del Grimorio

---

## 4. Estado del Repositorio Git
- Inicializado localmente en la rama `main`.
- Todos los sistemas implementados, probados y con validación de sintaxis 100% limpia.
