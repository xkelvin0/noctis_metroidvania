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
  - `rooms.js`: 31 salas conectadas (incluyendo el Hub de 3 zonas de la Villa Refugio: -2, -1, 0).
  - `entities.js`: Jugador Alaric, combate, 8 tipos de enemigos, NPCs con diálogo (tecla E) y Jefe Malakor.
  - `sprites.js`: Motor de renderizado con chroma-key automático y recorte de sprite sheets.
  - `main.js`: Bucle fijo a 60 FPS, input, escalado de render y HUD gótico.

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

---

## 3. Controles Principales del Juego
- **A / D** o **Flechas Izquierda / Derecha**: Moverse
- **W / Espacio / Flecha Arriba**: Saltar (Doble salto si se tiene la reliquia)
- **J / Clic Izquierdo**: Atacar con la espada
- **K / Clic Derecho / Shift**: Dash sombrío
- **E**: Interactuar (hablar con aldeanos/guardias, abrir tienda de Dario, leer carteles)
- **P / ESC**: Menú de pausa (Mapa grande, Diario de Reliquias, Bestiario, Misiones, Opciones)
- **H**: Alternar Modo Gráfico (HD Nítido 960p vs Retro Pixel 480p)
- **O**: Silenciar / Activar Música

---

## 4. Estado del Repositorio Git
- Inicializado localmente en la rama `main`.
- Commit inicial realizado con todos los archivos tracked.
