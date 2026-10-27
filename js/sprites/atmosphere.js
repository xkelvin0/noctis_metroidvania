// =========================================================
// ATMÓSFERA GÓTICA, FONDOS, CLIMA Y VIÑETA (js/sprites/atmosphere.js)
// =========================================================

// Dibujado del fondo gótico según la habitación y bioma
function drawGothicBackground(ctx, roomId) {
  // Las zonas seguras de ciudades (-2, -1, 0, 9, 10) comparten el paisaje nocturno de horizonte gótico limpio
  if ([0, -1, -2, 9, 10, 31, 32, 33, 34, 35, 36, 37].includes(Number(roomId))) {
    if (ambientSkylineLoaded) {
      // La ilustración ya contiene eclipse, profundidad e iluminación propios.
      // Se dibuja una sola vez para evitar halos duplicados y parallax artificial.
      ctx.drawImage(ambientSkylineImage, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#140e1d';
      ctx.fillRect(0, 0, W, H);
    }
    drawLocalizedAtmosphere(ctx, roomId, 'city');
    return;
  }

  const zone = typeof getRoomZone === 'function' ? getRoomZone(roomId) : 'carmesi';
  const backdropKey = { juramento: 'catacumbas', astral: 'observatorio', reloj: 'jardines' }[zone] || zone;
  const backdrop = zoneBackgrounds[backdropKey];
  if (backdrop && backdrop.complete && backdrop.naturalWidth > 0) {
    const scale = Math.max(W / backdrop.naturalWidth, H / backdrop.naturalHeight);
    const drawWidth = backdrop.naturalWidth * scale;
    const drawHeight = backdrop.naturalHeight * scale;
    const baseX = (W - drawWidth) / 2;
    const baseY = (H - drawHeight) / 2;
    // Los fondos de zona también son composiciones terminadas: sin duplicados ni tintes globales.
    ctx.drawImage(backdrop, baseX, baseY, drawWidth, drawHeight);
    drawLocalizedAtmosphere(ctx, roomId, zone);
    return;
  }

  ctx.fillStyle = '#140e1d';
  // Dibujar columnas decorativas en los laterales del fondo
  ctx.fillRect(32, 48, 16, 176);
  ctx.fillRect(432, 48, 16, 176);

  // Detalles de arcos góticos superiores
  ctx.strokeStyle = '#221430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(240, 16, 80, 0, Math.PI);
  ctx.stroke();
}

// Efectos de atmósfera localizada (niebla, lluvia, motas o polvillo mágico)
function drawLocalizedAtmosphere(ctx, roomId, zone) {
  const time = (typeof player !== 'undefined' ? player.animTimer : 0);
  const exterior = zone === 'city' || (Number(roomId) >= 101 && Number(roomId) <= 108);
  // Niebla baja por zona; deja el centro legible y concentra el volumen junto al suelo.
  const fogColor = zone === 'juramento' ? '98, 220, 214' : zone === 'astral' ? '154, 188, 255' : zone === 'reloj' ? '198, 145, 84' : '184, 118, 150';
  for (let i = 0; i < 4; i++) {
    const x = ((i * 154 + time * (0.18 + i * 0.025)) % (W + 130)) - 110;
    const y = H - 56 - i * 13 + Math.sin(time * 0.035 + i) * 4;
    ctx.fillStyle = `rgba(${fogColor}, ${0.035 + i * 0.008})`;
    ctx.fillRect(x, y, 150, 18);
  }
  // Lluvia solo en las rutas exteriores: no invade interiores de fortalezas.
  if (exterior) {
    ctx.strokeStyle = 'rgba(159, 209, 255, 0.30)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 26; i++) {
      const x = (i * 37 + time * 1.8) % (W + 20) - 10;
      const y = (i * 61 + time * 3.7) % (H + 24) - 12;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 3, y + 9);
      ctx.stroke();
    }
  }
  // Polvo, ceniza o motas astrales por región.
  const particleColor = zone === 'astral' ? '#b9f2ff' : zone === 'juramento' ? '#7de2d1' : zone === 'reloj' ? '#f4b860' : '#ff4d88';
  ctx.fillStyle = particleColor;
  for (let i = 0; i < 10; i++) {
    const x = (i * 79 + time * (0.28 + i * 0.02)) % W;
    const y = 30 + ((i * 43 + time * 0.16) % 170);
    ctx.globalAlpha = 0.28 + (i % 3) * 0.12;
    ctx.fillRect(x, y, 1 + (i % 2), 1 + (i % 2));
  }
  ctx.globalAlpha = 1;
}

// =========================================================
// PARTÍCULAS AMBIENTALES Y CENIZAS CARMESÍ
// =========================================================
const AMBIENT_PARTICLES_COUNT = 36;
const ambientParticles = [];

// Inicializar motas de polvo y cenizas carmesí flotantes
for (let i = 0; i < AMBIENT_PARTICLES_COUNT; i++) {
  ambientParticles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4 - 0.2, // Deriva suave hacia la izquierda
    vy: Math.random() * 0.35 + 0.1,        // Caen lentamente como ceniza
    size: Math.random() < 0.3 ? 2 : 1,
    alpha: Math.random() * 0.4 + 0.2,
    color: Math.random() < 0.4 ? '#ff0055' : (Math.random() < 0.5 ? '#9d4edd' : '#e2eafc')
  });
}

function updateAndDrawFogParticles(ctx, roomId) {
  const zone = typeof getRoomZone === 'function' ? getRoomZone(roomId) : 'carmesi';
  const zoneParticles = zone === 'juramento' ? ['#7cc7c1', '#b8f2e6']
    : zone === 'astral' ? ['#7de2ff', '#c7d2fe']
    : zone === 'reloj' ? ['#d6813f', '#d8b766']
    : ['#ff0055', '#c77dff'];
  for (const p of ambientParticles) {
    p.x += p.vx;
    p.y += p.vy;

    // Reposicionar al salir de la pantalla
    if (p.y > H) {
      p.y = -4;
      p.x = Math.random() * W;
    }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.size === 2 ? zoneParticles[0] : zoneParticles[1];
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    ctx.restore();
  }
}

// Viñeta perimetral de oscuridad gótica (Efecto opresivo en los bordes)
function drawGothicVignette(ctx) {
  const gradient = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.65);
  gradient.addColorStop(0, 'rgba(7, 5, 10, 0)');
  gradient.addColorStop(0.7, 'rgba(7, 5, 10, 0.35)');
  gradient.addColorStop(1, 'rgba(4, 2, 7, 0.85)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

