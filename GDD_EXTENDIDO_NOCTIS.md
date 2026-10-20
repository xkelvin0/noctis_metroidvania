# DOCUMENTO DE DISEÑO DE JUEGO (GDD EXTENDIDO)
# Noctis: El Eco Carmesí (Metroidvania Action-RPG)

- **Título Oficial:** *Noctis: El Eco Carmesí*
- **Género:** Action-RPG / Metroidvania 2D / Dark Fantasy
- **Estética:** Pixel Art Gótico Oscuro (16/32-bits), atmósfera decadente inspirada en *Castlevania: Symphony of the Night*, *Blasphemous* y *Dark Souls*.
- **Plataforma:** Web Browser (HTML5 Canvas + JavaScript/TypeScript nativo, 60 FPS) / PC.

---

## 1. Visión General y Premisa Narrativa Innovadora

### 1.1 El Dilema de la Falsa Salvación
La mayoría de los títulos plantean un héroe que salva al mundo de un malvado tirano. En *Noctis*, **la tragedia radica en que el villano ya "salvó" al mundo mediante una blasfemia humanitaria**.

Hace un siglo, la **Peste del Polvo** consumió el reino de Véspera: una aflicción donde la carne viva se desmoronaba en ceniza ardiente entre tormentos indescriptibles. El sumo médico de la Orden y hermano de sangre de Alaric, **Lord Malakor**, se negó a ver morir a su gente. Descubrió un antiguo rito en los manuscritos prohibidos de la sangre y forzó el **Eclipse Perpetuo**.

Vinculó el dolor, el alma y la carne de todo el reino a su propio corazón y a los muros de la Ciudadela:
- Los ciudadanos no mueren ni sufren, pero han quedado convertidos en **espectros de piedra y autómatas de sombra** atrapados en un letargo atemporal.
- El tiempo no corre; las cosechas no crecen ni se pudren. Es un mausoleo viviente.
- Malakor cree genuinamente ser el salvador misericordioso de la humanidad.

### 1.2 Alaric: El Último Corazón Caliente
Encarnas a **Alaric**, quien permaneció en un ataúd sellado en estasis profunda. Es el único ser con sangre viva que fluye por sus venas. Sin embargo, el Eclipse carcome su vitalidad: **su sangre se cristaliza lentamente en vidrio negro**. Para sobrevivir en su travesía debe consumir la **Esencia Carmesí (♦)** liberada de los recuerdos del reino.

### 1.3 Las Reliquias como Recuerdos Extirpados
Para no desfallecer bajo el peso del sufrimiento de miles de almas vinculadas, Malakor tuvo que **amputarse espiritualmente sus tres sentimientos humanos más puros**, cristalizándolos en tres artefactos custodiados en los confines de la fortaleza:
1. **Botas de Ceniza (El Vínculo Fraternal - Dash):** Su compasión de niño al salvar a Alaric de las hogueras de guerra.
2. **Pluma del Cuervo (El Sueño de Trascendencia - Doble Salto):** La promesa juvenil de romper el techo impuesto por dioses sordos.
3. **Garras de Gárgola (La Desesperación del Ascenso - Wall Jump):** El dolor físico y la resolución de escalar la Torre del Eclipse por amor a los enfermos.

---

## 2. Pilares de Jugabilidad (Metroidvania + RPG)

El juego evoluciona de un simple prototipo de 8 salas a una **estructura profunda de Metroidvania + RPG** con 4 pilares:

```
          ┌────────────────────────────────────────┐
          │               CORE LOOP                │
          └──────────────────┬─────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
EXPLORACIÓN Y MUNDO     COMBATE TÁCTICO         SISTEMA RPG
- Ability Gating        - Hit-Stop y Parrying   - Estadísticas y Atributos
- Backtracking          - Pogo Jumping          - Economía de Esencia (♦)
- Ciudades y NPCs       - Hechizos de Sangre    - Herrería, Tiendas y Lore
- Muros Secretos (?)    - Fases de Jefes        - Misiones Secundarias
```

---

## 3. Ciudades, Mercados y Asentamientos Seguros (RPG Hubs)

A diferencia de un calabozo solitario lineal, el mundo cuenta con **núcleos urbanos y campamentos** donde residen los pocos supervivientes semiconscientes protegidos por reliquias de luz:

### 3.1 Villa del Refugio: "El Ocaso Silente"
Un pueblo en ruinas al pie de la Ciudadela protegido por campanas de plata resonantes que ahuyentan las sombras del eclipse.
- **La Taberna de las Brasas:** Punto de reunión donde viajeros y guardias errantes ofrecen pistas sobre secretos ocultos en el mapa.
- **Mercader de Reliquias (Dario el Tuerto):** Vende pociones de sangre, anillos pasivos y llaves arcanas a cambio de Esencia (♦).
- **El Forjador Ciego (Maestro Ignis):** Permite imbuir el Filo Carmesí con runas elementales (sangre, fuego, sombras) a cambio de minerales encontrados en muros rompibles (`?`).
- **La Cronista Vesperal (Hermana Selene):** Ofrece misiones secundarias de cacería de monstruos élite para completar el Bestiario a cambio de amuletos de salud.

### 3.2 El Enclave Subterráneo: "Pabellón de los Juramentados"
Oculto en los acueductos bajo la Capilla Hundida. Los últimos caballeros leales a la corona que no sucumbieron a la mente colmena de Malakor.
- Venta de hechizos prohibidos (Lanzas de Hueso, Escudos de Ceniza).
- Estación de Espejos de Sangre para **Viaje Rápido (Fast Travel)** a cualquier altar del mundo.

---

## 4. Estructura del Macro-Mundo (6 Regiones Interconectadas, 35+ Salas)

El mundo pasa de 8 salas aisladas a una red de 6 biomas distintivos:

| Región | Ambiente / Estética | Habilidad Requerida | Peligros / Trampas |
| :--- | :--- | :--- | :--- |
| **1. El Ocaso Silente & Murallas** | Bosque petrificado y muralla exterior bajo el cielo púrpura. | Salto Básico y Espada | Esqueletos patrulla, cuervos de plomo. |
| **2. La Gran Ciudadela & Vestíbulo** | Salones palaciegos góticos, vidrieras rotas, alfombras raídas. | Dash Sombrío (Botas de Ceniza) | Rejas de sombra (`B`), armaduras con escudo impenetrable. |
| **3. Acueductos y Capilla Hundida** | Bóvedas húmedas, altares inundados de líquido carmesí. | Doble Salto (Pluma del Cuervo) | Caídas a pinchos sobre plataformas móviles, niebla tóxica. |
| **4. Cripta de los Antepasados** | Catacumbas con sarcófagos verticales y muros falsos agrietados (`?`). | Salto en Pared (Garras de Gárgola) | Chimeneas altas con pinchos, vampiros acechantes. |
| **5. Los Jardines Marchitos del Reloj** | Torres de engranajes congelados y flores de cristal petrificado. | Dash Aéreo + Parrying de péndulos | Engranajes trituradores, gárgolas mecánicas. |
| **6. Torre del Eclipse Astral** | El pináculo donde el sol rojo sangra hacia el trono de Malakor. | Todas las reliquias combinadas | Pilares de fuego solar, lluvia de meteoros, vacío abisal. |

---

## 5. Sistema de Progresión RPG: Estadísticas y Economía

### 5.1 Estadísticas del Jugador (Alaric)
- **Vitalidad (HP Máximo):** Salud física. Si llega a cero, el corazón de Alaric se petrifica y reaparece en el último Altar.
- **Vigor (Estamina / Éter):** Determina la frecuencia de uso del Dash y el Bloqueo/Parrying.
- **Potencia Carmesí (ATK):** Daño físico de la espada y de los rebotes descendentes (Pogo).
- **Concentración de Sangre (Esencia Max):** Permite disparar hechizos arcanos de larga distancia (Hechizo Carmesí, Dagas de Sangre).

### 5.2 Sistema de Moneda y Transacciones (Esencia ♦)
- Derrotar enemigos y romper alijos en paredes secretas otorga **Esencia (♦)** física que flota hacia el jugador.
- **Riesgo de Muerte (Souls-lite):** Al morir, se pierde el 50% de la Esencia no bancarizada en un Altar, dejando un remanente espectral en el lugar de la muerte que Alaric puede recuperar.
- **Altares de Sangre:** Guardan la partida, curan el 100% de la salud, restauran los enemigos de la sala y permiten comprar puntos de atributo definitivos.

---

## 6. Mecánicas de Combate y "Game Feel" Avanzado

1. **Hit-Stop / Frame Freeze:** Congelamiento de 3 a 5 frames al impactar con espada para imprimir masa física a los cortes.
2. **Parrying de Proyectiles y Contraataque:** Al golpear proyectiles en el instante previo al impacto, se desvían con daño multiplicado (x2.5) y aturdimiento.
3. **Pogo Jump / Down-Slash:** Saltar sobre enemigos o pinchos presionando `S + Clic`, rebotando indefinidamente y reiniciando el salto aéreo.
4. **Paredes Secretas Destructibles (`?`):** Muros agrietados que tras 3 golpes de espada o hechizos se desmoronan revelando cofres, atajos entre biomas y alijos gigantes de esencia.
5. **Jefes de Múltiples Fases:** Cada gran jefe cuenta con transformaciones visuales, patrones acelerados y diálogos reactivos a la salud restante.

---

## 7. Diseño de Misiones y Rejugabilidad

- **Misión Principal:** "El Despertar de la Ceniza" — Recuperar las tres memorias de Malakor y ascender a la Torre del Eclipse.
- **Finales Múltiples:**
  - **Final 1: El Despertar Sangriento (Normal):** Destruyes a Malakor y el Núcleo; el sol vuelve, los durmientes son liberados pero la plaga los reduce a cenizas; Alaric queda solo en un reino en ruinas.
  - **Final 2: El Heredero del Eclipse (Secreto):** Si encuentras las 3 Reliquias y todas las cartas de memoria en las paredes secretas, Alaric toma el lugar de Malakor como nuevo Guardián, manteniendo el sueño pero con su sangre viva controlando la fortaleza.
  - **Final 3: La Cura de Cristal (Verdadero):** Si compras el Elixir Primordial en el mercado subterráneo y purificas el Núcleo sin matar a Malakor en la Fase 2 mediante Parrying de su corazón, el sol sale y la plaga es purificada, devolviendo la vida al reino.

---

## 8. Arquitectura Técnica y Escalabilidad

- **Canvas 2D Modular:** Timestep fijo de 60 FPS, soporte de pantalla completa 16:9 con pixel-art nativo.
- **Gestor de Estados (FSM) Desacoplado:** Alaric, enemigos y jefes se rigen por máquinas de estados finitos que impiden solapamiento de animaciones y fallos de colisión.
- **Persistencia Robusta:** Todo el progreso (salas descubiertas, paredes rotas, atributos, reliquias y misiones) se sincroniza en `localStorage` con serialización JSON tolerante a fallos.
- **Zero External Audio Dependencies:** Música procedural y efectos FX generados íntegramente con la **Web Audio API** (osciladores polifónicos y síntesis substractiva).
