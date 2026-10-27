// =========================================================
// SPRITES DEL BESTIARIO Y NPCS (js/sprites/bestiary.js)
// =========================================================

// Dibujado de todos los tipos de enemigos y aldeanos/NPCs
function drawEnemySprite(ctx, e, animClock) {
  const ex = Math.round(e.x);
  const ey = Math.round(e.y);
  const isHurt = (e.hurtTimer > 0 && e.hurtTimer % 2 === 0);

  if (e.type === 'citizen') {
    const sName = (e.name || '').toLowerCase();
    const isGuard = e.isGuard || sName.includes('guardia') || sName.includes('centinela') || 
      sName.includes('capitán') || sName.includes('vigía') || sName.includes('paladín') || 
      sName.includes('ballestero') || sName.includes('sargento');
    const isCleric = sName.includes('sacerdot') || sName.includes('monja') || sName.includes('clérigo') || sName.includes('hermano');
    const isScholar = sName.includes('erudito') || sName.includes('astrónomo') || sName.includes('alquimista') || sName.includes('corvus');
    const isChild = sName.includes('niña') || sName.includes('niño') || sName.includes('lía');
    const isInnkeeper = sName.includes('posader');
    const isCartographer = sName.includes('cartógraf') || sName.includes('cartograf');
    const isMusician = sName.includes('músico') || sName.includes('musico');
    const isTraveler = sName.includes('viajero') || sName.includes('explorador') || sName.includes('carretero');
    const isMerchant = sName.includes('mercader') || sName.includes('pregoner') || sName.includes('dario') || sName.includes('boticaria');

    const isWalking = !e.stationary && Math.abs(e.vx || 0) > 0.05;
    const animationPhase = Array.from(e.name || '').reduce((total, character) => total + character.charCodeAt(0), 0) % 24;
    const animationFrame = Math.floor((animClock + animationPhase) / (isWalking ? 6 : 18)) % 4;
    const step = isWalking ? [0, 1, 0, -1][animationFrame] : 0;
    const bodyBob = isWalking ? [0, 1, 0, 1][animationFrame] : [0, 0, -1, 0][animationFrame];

    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = '#050308';
    ctx.beginPath();
    ctx.ellipse(ex + 6, ey + 22, isGuard ? 8 : 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, bodyBob);

    if (isGuard) {
      // ==========================================
      // GUARDIA DE VÉSPERA / CENTINELA ACORAZADO
      // ==========================================
      // Capa roja tras la armadura
      ctx.fillStyle = '#7a001a';
      ctx.fillRect(ex + (e.dir === 1 ? 1 : 10), ey + 6, 3, 14);

      // Yelmo de Acero (Sallet con visera)
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(ex + 3, ey + 1, 8, 7);
      ctx.fillStyle = '#495057';
      ctx.fillRect(ex + 4, ey + 4, 6, 2); // Ranura de la visera
      // Penacho o Cresta Carmesí de la guardia
      ctx.fillStyle = '#d90429';
      ctx.fillRect(ex + 5, ey - 3, 4, 4);
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(ex + 6, ey - 1, 2, 2);

      // Placas de Acero del Torso y Hombreras
      ctx.fillStyle = '#ced4da';
      ctx.fillRect(ex + 2, ey + 8, 10, 8);
      // Tabardo heráldico carmesí con cruz de oro
      ctx.fillStyle = '#9d0208';
      ctx.fillRect(ex + 5, ey + 8, 4, 8);
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(ex + 6, ey + 10, 2, 4);

      // Escudo Heráldico de la Ciudadela en el flanco
      const shieldX = e.dir === 1 ? ex : ex + 9;
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(shieldX, ey + 7, 5, 11);
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(shieldX + 1, ey + 8, 3, 9);
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(shieldX + 2, ey + 10, 1, 5);

      // Piernas con grebas de hierro
      ctx.fillStyle = '#495057';
      ctx.fillRect(ex + 3 + (isGuard ? 0 : step), ey + 16, 3, 6);
      ctx.fillRect(ex + 8 - (isGuard ? 0 : step), ey + 16, 3, 6);

      // Gran Alabarda / Pica de Guardia en mano
      const halberdX = e.dir === 1 ? ex + 12 : ex - 1;
      // Asta de madera oscura
      ctx.fillStyle = '#3a2618';
      ctx.fillRect(halberdX, ey - 7, 2, 29);
      // Cuchilla de acero reluciente y punta de lanza
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(halberdX - 2, ey - 7, 6, 4);
      ctx.fillRect(halberdX, ey - 11, 2, 5);
      ctx.fillStyle = '#ffd166'; // Virola dorada
      ctx.fillRect(halberdX - 1, ey - 3, 4, 2);

    } else if (isCleric) {
      // Sacerdotes y Monjas con hábitos ceremoniales
      ctx.fillStyle = '#f4f1de'; // Hábito blanco marfil o indigo
      ctx.fillRect(ex + 2, ey + 6, 8, 14);
      ctx.fillStyle = '#3d405b'; // Capucha
      ctx.fillRect(ex + 3, ey + 1, 6, 6);
      ctx.fillStyle = '#f5cac3'; // Rostro
      ctx.fillRect(ex + (e.dir === 1 ? 5 : 3), ey + 3, 4, 3);
      // Cruz de oro en el pecho
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(ex + 5, ey + 9, 2, 4);
      ctx.fillRect(ex + 4, ey + 10, 4, 1);
      // Sandalias
      ctx.fillStyle = '#3a2618';
      ctx.fillRect(ex + 3 + step, ey + 19, 3, 3);
      ctx.fillRect(ex + 7 - step, ey + 19, 3, 3);

    } else if (isScholar) {
      // Erudito / Astrónomo con túnica astral violeta
      ctx.fillStyle = '#3c096c';
      ctx.fillRect(ex + 2, ey + 6, 8, 14);
      ctx.fillStyle = '#5a189a';
      ctx.fillRect(ex + 3, ey + 1, 6, 5);
      ctx.fillStyle = '#f5cac3';
      ctx.fillRect(ex + (e.dir === 1 ? 5 : 3), ey + 3, 4, 3);
      // Runas estelares bordadas
      ctx.fillStyle = '#7de2ff';
      ctx.fillRect(ex + 4, ey + 9, 2, 2);
      ctx.fillRect(ex + 6, ey + 13, 2, 2);
      ctx.fillStyle = '#240046';
      ctx.fillRect(ex + 3 + step, ey + 18, 3, 4);
      ctx.fillRect(ex + 7 - step, ey + 18, 3, 4);

    } else if (isChild) {
      // Niña pequeña con bufanda y estatura menor
      ctx.fillStyle = '#9c6644'; // Cabello castaño
      ctx.fillRect(ex + 4, ey + 7, 5, 4);
      ctx.fillStyle = '#f5cac3';
      ctx.fillRect(ex + (e.dir === 1 ? 5 : 3), ey + 8, 4, 3);
      ctx.fillStyle = '#d90429'; // Bufanda roja
      ctx.fillRect(ex + 3, ey + 11, 7, 3);
      ctx.fillStyle = '#ddb892'; // Vestido
      ctx.fillRect(ex + 3, ey + 14, 6, 6);
      ctx.fillStyle = '#7f5539';
      ctx.fillRect(ex + 3 + step, ey + 19, 2, 3);
      ctx.fillRect(ex + 6 - step, ey + 19, 2, 3);

    } else {
      // Aldeanos con silueta y accesorios según su oficio.
      const palette = isInnkeeper
        ? { coat: '#8f3547', cloth: '#d9c7aa', dark: '#4a2028', accent: '#e9b96d', hair: '#593827' }
        : isCartographer
          ? { coat: '#315d68', cloth: '#9bc8c9', dark: '#182f38', accent: '#d7b86e', hair: '#3f3028' }
          : isMusician
            ? { coat: '#5a3c78', cloth: '#b59ac8', dark: '#2d203b', accent: '#d89b54', hair: '#35261f' }
            : isTraveler
              ? { coat: '#4d5145', cloth: '#8f9279', dark: '#292c27', accent: '#9b6b43', hair: '#403127' }
              : isMerchant
                ? { coat: '#5e4938', cloth: '#a9865f', dark: '#33271f', accent: '#c9a45f', hair: '#4b3224' }
                : { coat: '#45584f', cloth: '#839b87', dark: '#25332e', accent: '#b58a59', hair: '#493328' };
      const faceX = e.dir === 1 ? ex + 5 : ex + 3;
      const frontX = e.dir === 1 ? ex + 8 : ex + 1;
      const backX = e.dir === 1 ? ex + 1 : ex + 9;

      // Cabello, rostro y nariz forman un perfil legible, no un bloque frontal.
      ctx.fillStyle = palette.hair;
      ctx.fillRect(ex + 3, ey + 1, 7, 5);
      ctx.fillRect(backX + (e.dir === 1 ? 1 : -1), ey + 4, 2, 5);
      ctx.fillStyle = '#d6a080';
      ctx.fillRect(faceX, ey + 3, 4, 4);
      ctx.fillRect(e.dir === 1 ? ex + 9 : ex + 2, ey + 5, 2, 2);
      ctx.fillStyle = '#211820';
      ctx.fillRect(e.dir === 1 ? ex + 8 : ex + 4, ey + 4, 1, 1);

      // Hombros, brazos y faldón escalonado crean una silueta orgánica.
      ctx.fillStyle = palette.coat;
      ctx.fillRect(ex + 2, ey + 8, 8, 3);
      ctx.fillRect(ex + 3, ey + 11, 6, 6);
      ctx.fillRect(ex + 2, ey + 16, 8, 2);
      ctx.fillStyle = palette.dark;
      ctx.fillRect(ex + 1, ey + 9 + step, 2, 7);
      ctx.fillRect(ex + 9, ey + 9 - step, 2, 7);
      ctx.fillStyle = palette.cloth;
      ctx.fillRect(ex + 4, ey + 9, 4, 6);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(ex + 3, ey + 15, 6, 1);

      // Botas separadas y animadas para evitar el aspecto de rectángulo único.
      ctx.fillStyle = '#201b1a';
      ctx.fillRect(ex + 2 + step, ey + 18, 3, 4);
      ctx.fillRect(ex + 7 - step, ey + 18, 3, 4);
      ctx.fillStyle = '#4b382b';
      ctx.fillRect(ex + 1 + step, ey + 21, 4, 1);
      ctx.fillRect(ex + 7 - step, ey + 21, 4, 1);

      if (isInnkeeper) {
        ctx.fillStyle = '#eee0c8';
        ctx.fillRect(ex + 4, ey + 10, 4, 4);
        ctx.fillRect(ex + 5, ey + 14, 2, 3);
        ctx.fillStyle = '#8f3547';
        ctx.fillRect(ex + 5, ey + 11, 2, 1);
      } else if (isCartographer) {
        ctx.strokeStyle = '#b78b52';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ex + 3, ey + 8); ctx.lineTo(ex + 8, ey + 17); ctx.stroke();
        ctx.fillStyle = '#d8c18a';
        ctx.fillRect(frontX, ey + 11, 3, 6);
        ctx.fillStyle = '#6f4d2c';
        ctx.fillRect(frontX, ey + 10, 3, 1);
        ctx.fillRect(frontX, ey + 17, 3, 1);
      } else if (isMusician) {
        ctx.fillStyle = '#9a6238';
        ctx.fillRect(frontX - 1, ey + 11, 4, 5);
        ctx.fillStyle = '#d8a15b';
        ctx.fillRect(frontX, ey + 12, 2, 3);
        ctx.fillStyle = '#704225';
        ctx.fillRect(e.dir === 1 ? frontX + 2 : frontX - 4, ey + 8, 4, 1);
      } else if (isTraveler || isMerchant) {
        ctx.fillStyle = palette.accent;
        ctx.fillRect(backX, ey + 11, 3, 5);
        ctx.fillStyle = palette.dark;
        ctx.fillRect(backX, ey + 12, 3, 1);
      }
    }

    // Pequeño indicador luminoso superior para personajes interactivos
    ctx.fillStyle = isGuard ? '#ff0055' : 'rgba(255, 190, 11, 0.8)';
    ctx.fillRect(ex + 5, ey - 2, 2, 2);
    ctx.restore();
    return;
  }

  if (e.type === 'skeleton') {
    // Esqueleto Lancero
    const boneColor = isHurt ? '#ffffff' : (e.attackTelegraph > 0 ? '#ffbe0b' : '#e0d8e8');
    ctx.fillStyle = boneColor;
    // Cráneo
    ctx.fillRect(ex + 3, ey, 8, 7);
    ctx.fillStyle = '#0c0814';
    ctx.fillRect(ex + (e.dir === 1 ? 7 : 4), ey + 2, 2, 2); // Cuenca ocular
    // Costillas y columna
    ctx.fillStyle = boneColor;
    ctx.fillRect(ex + 6, ey + 7, 2, 8);
    ctx.fillRect(ex + 3, ey + 8, 8, 2);
    ctx.fillRect(ex + 4, ey + 11, 6, 2);
    // Piernas animadas al caminar
    const step = Math.floor(animClock / 8) % 2;
    ctx.fillRect(ex + 3 + step, ey + 15, 2, 7);
    ctx.fillRect(ex + 9 - step, ey + 15, 2, 7);
    // Lanza larga
    ctx.fillStyle = e.lungeTimer > 0 ? '#ff0055' : '#adb5bd';
    const spearX = e.dir === 1 ? ex + 4 : ex - 10;
    ctx.fillRect(spearX, ey + 10, 20, 2);
    if (e.attackTelegraph > 0) {
      const pulse = Math.sin(animClock * 0.45) * 0.25 + 0.75;
      ctx.strokeStyle = `rgba(255, 190, 11, ${pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ex + 7, ey + 12);
      ctx.lineTo(ex + e.dir * 38 + 7, ey + 12);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  else if (e.type === 'bat') {
    // Murciélago Vesperal con aleteo
    const flap = Math.floor(animClock / 5) % 2 === 0;
    ctx.fillStyle = isHurt ? '#ffffff' : '#7209b7';
    // Cuerpo central
    ctx.fillRect(ex + 5, ey + 3, 4, 6);
    // Alas extendidas arriba o abajo
    ctx.fillStyle = isHurt ? '#ffffff' : '#9d4edd';
    if (flap) {
      ctx.fillRect(ex, ey, 5, 4);
      ctx.fillRect(ex + 9, ey, 5, 4);
    } else {
      ctx.fillRect(ex, ey + 6, 5, 4);
      ctx.fillRect(ex + 9, ey + 6, 5, 4);
    }
    // Ojos rojos brillantes
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(ex + 5, ey + 4, 1, 1);
    ctx.fillRect(ex + 8, ey + 4, 1, 1);
  }

  else if (e.type === 'armor') {
    // Armadura Espectral Acorazada
    ctx.fillStyle = isHurt ? '#ffffff' : '#343a40';
    ctx.fillRect(ex + 2, ey + 4, e.w - 4, e.h - 4);
    // Yelmo con penacho carmesí
    ctx.fillStyle = '#d90429';
    ctx.fillRect(ex + 6, ey, 6, 4);
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(ex + 4, ey + 3, 10, 6);
    // Ojos espectrales celestes
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(ex + (e.dir === 1 ? 10 : 5), ey + 5, 3, 2);
    // Gran Escudo Frontal
    ctx.fillStyle = '#00bbf9';
    const sx = e.dir === 1 ? ex + e.w - 3 : ex - 1;
    ctx.fillRect(sx, ey + 4, 4, e.h - 6);
    ctx.fillStyle = '#e0fbfc';
    ctx.fillRect(sx + 1, ey + 6, 2, e.h - 10);
  }

  else if (e.type === 'archer' || e.type === 'bomber' || e.type === 'summoner' || e.type === 'shield' || e.type === 'duelist' || e.type === 'trapper' || e.type === 'beast' || e.type === 'specter') {
    const palette = { archer: '#80ed99', bomber: '#ff5400', summoner: '#c77dff', shield: '#00bbf9', duelist: '#f72585', trapper: '#f4a261', beast: '#bc6c25', specter: '#b8f2e6' };
    ctx.fillStyle = isHurt ? '#ffffff' : palette[e.type];
    ctx.fillRect(ex + 3, ey + 3, e.w - 6, e.h - 3);
    ctx.fillStyle = '#1f162b';
    ctx.fillRect(ex + 5, ey + 6, e.w - 10, 3);
    if (e.type === 'archer') ctx.fillRect(e.dir === 1 ? ex + 11 : ex - 5, ey + 9, 10, 2);
    if (e.type === 'bomber') { ctx.fillStyle = '#ffbe0b'; ctx.fillRect(ex + 7, ey, 3, 4); }
    if (e.type === 'summoner') { ctx.fillStyle = '#ffccd5'; ctx.fillRect(ex + 6, ey - 2, 4, 4); }
    if (e.type === 'shield') { ctx.fillStyle = '#e0fbfc'; ctx.fillRect(e.dir === 1 ? ex + 12 : ex, ey + 5, 4, 13); }
    if (e.type === 'duelist') { ctx.fillStyle = '#f1faee'; ctx.fillRect(e.dir === 1 ? ex + 12 : ex - 6, ey + 10, 10, 2); }
    if (e.type === 'trapper') { ctx.fillStyle = '#ffd166'; ctx.fillRect(ex + 6, ey + 14, 4, 4); }
    if (e.type === 'beast') { ctx.fillStyle = '#5a3921'; ctx.fillRect(ex + 1, ey + 14, e.w - 2, 6); ctx.fillStyle = '#f4a261'; ctx.fillRect(e.dir === 1 ? ex + 12 : ex + 1, ey + 7, 5, 5); }
    if (e.type === 'specter') { ctx.globalAlpha = 0.65; ctx.fillRect(ex + 1, ey + 1, e.w - 2, e.h - 3); ctx.globalAlpha = 1; }
  }

  else if (e.type === 'boss') {
    const bossColor = e.bossColor || '#ff0055';
    const floatY = ey + Math.sin(animClock * (e.phase2 ? 0.16 : 0.08)) * (e.phase2 ? 5 : 3);
    const entryAlpha = e.entryTimer > 0 ? Math.max(0.25, 1 - e.entryTimer / 75) : 1;
    ctx.save();
    ctx.globalAlpha = entryAlpha;
    
    // FASE 2: Alas espectrales carmesí gigantes
    if (e.phase2) {
      const wingBob = Math.sin(animClock * 0.2) * 4;
      ctx.fillStyle = bossColor;
      ctx.globalAlpha = 0.75;
      // Ala Izquierda
      ctx.beginPath();
      ctx.moveTo(ex + 4, floatY + 12);
      ctx.lineTo(ex - 18, floatY - 8 + wingBob);
      ctx.lineTo(ex - 6, floatY + 22);
      ctx.fill();
      ctx.globalAlpha = 1;
      // Ala Derecha
      ctx.beginPath();
      ctx.moveTo(ex + e.w - 4, floatY + 12);
      ctx.lineTo(ex + e.w + 18, floatY - 8 + wingBob);
      ctx.lineTo(ex + e.w + 6, floatY + 22);
      ctx.fill();
    }

    // Manto real exterior (más oscuro e incandescente en Fase 2)
    ctx.fillStyle = isHurt ? '#ffffff' : (e.phase2 ? '#720026' : '#590d22');
    ctx.fillRect(ex, floatY + 6, e.w, e.h - 6);
    // Armadura pectoral oscura
    ctx.fillStyle = isHurt ? '#ffffff' : '#1f162b';
    ctx.fillRect(ex + 4, floatY + 8, e.w - 8, e.h - 12);
    // Cabeza y Corona de Cuernos
    ctx.fillStyle = '#e2eafc';
    ctx.fillRect(ex + 7, floatY + 2, 10, 7);
    ctx.fillStyle = e.phase2 ? bossColor : '#ffbe0b';
    ctx.fillRect(ex + 5, floatY - 3, 3, 6);
    ctx.fillRect(ex + 16, floatY - 3, 3, 6);
    // Ojos de fuego (amarillo incandescente en fase 2)
    ctx.fillStyle = e.phase2 ? '#ffbe0b' : '#ff0055';
    ctx.fillRect(ex + (e.dir === 1 ? 13 : 8), floatY + 4, 3, 2);

    // TELEGRAFIADO DE ATAQUES DE LORD MALAKOR
    if (e.isTelegraphing || (e.telegraphTimer && e.telegraphTimer > 0)) {
      const pulseT = Math.sin(animClock * 0.3) * 0.3 + 0.7;
      ctx.fillStyle = bossColor;
      ctx.globalAlpha = pulseT;
      ctx.font = 'bold 13px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ ¡ALERTA!', ex + e.w / 2, floatY - 10);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';

      // Telegrafiado de Embestida (vector de peligro)
      if (e.telegraphType === 'dash') {
        ctx.strokeStyle = bossColor;
        ctx.globalAlpha = pulseT * 0.75;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        const targetX = e.dir === 1 ? ex + 190 : ex - 190;
        ctx.moveTo(ex + e.w / 2, floatY + 16);
        ctx.lineTo(targetX, floatY + 16);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
      }

      // Telegrafiado de Ráfaga Mágica (orbe condensándose en la mano)
      if (e.telegraphType === 'burst') {
        const hx = ex + (e.dir === 1 ? e.w + 6 : -6);
        const hy = floatY + 14;
        ctx.fillStyle = bossColor;
        ctx.globalAlpha = pulseT * 0.85;
        ctx.beginPath(); ctx.arc(hx, hy, 7 * pulseT, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      // Telegrafiado de Cometas (rayos verticales descendentes)
      if (e.telegraphType === 'comets') {
        ctx.strokeStyle = `rgba(255, 0, 85, ${pulseT * 0.45})`;
        ctx.lineWidth = 1;
        for (let c = 0; c < 6; c++) {
          const startX = 60 + c * 60;
          ctx.beginPath(); ctx.moveTo(startX, 10); ctx.lineTo(startX, 240); ctx.stroke();
        }
      }
    }

    // Pilares de Fuego y Barra de Vida del Jefe
    if (e.pattern === 2 && e.pillars) {
      for (const px of e.pillars) {
        if (e.phaseTimer > 40) {
          // Fase 1 de advertencia: Grietas rúnicas incandescentes en el suelo
          const crackPulse = Math.sin(animClock * 0.25) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(255, 0, 85, ${crackPulse * 0.65})`;
          ctx.fillRect(px - 10, 218, 20, 6);
          ctx.strokeStyle = '#ffbe0b';
          ctx.strokeRect(px - 10, 218, 20, 6);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px - 1, 215, 2, 9);
        } else if (e.phaseTimer > 20) {
          // Fase 2: Erupción masiva del pilar de sangre
          const pGrad = ctx.createLinearGradient(px - 8, 220, px + 8, 220);
          pGrad.addColorStop(0, '#720026');
          pGrad.addColorStop(0.5, e.phase2 ? '#ff0055' : '#ff5400');
          pGrad.addColorStop(1, '#ffbe0b');
          ctx.fillStyle = pGrad;
          ctx.fillRect(px - 8, 60, 16, 164);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px - 2, 60, 4, 164);
        }
      }
    }

    // Barra de vida inferior del Jefe
    ctx.fillStyle = '#220916';
    ctx.fillRect(120, 245, 240, 8);
    ctx.fillStyle = e.phase2 ? '#ff0055' : '#e63946';
    const hpW = Math.max(0, 240 * (e.hp / e.maxHp));
    ctx.fillRect(120, 245, hpW, 8);
    if (e.phase2) {
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(120, 245, hpW, 2);
    }
    ctx.strokeStyle = e.phase2 ? '#ffbe0b' : '#ffccd5';
    ctx.strokeRect(120, 245, 240, 8);

    // Texto de nombre del Jefe
    ctx.font = '10px "VT323", monospace';
    ctx.fillStyle = e.phase2 ? '#ffbe0b' : '#ffccd5';
    ctx.textAlign = 'center';
    ctx.fillText(e.phase2 ? `⚡ ${e.name.toUpperCase()} (FASE 2: FURIA DEL ECLIPSE) ⚡` : e.name.toUpperCase(), 240, 240);
    ctx.textAlign = 'left';
    ctx.restore();
  }
}

// =========================================================
// RETRATOS DETALLADOS PIXEL ART PARA DIÁLOGOS DE PERSONAJES
// =========================================================
function drawNpcPortrait(ctx, speakerName, px, py, size = 30) {
  const s = speakerName.toLowerCase();
  
  // Marco del retrato
  ctx.fillStyle = '#0a0512';
  ctx.fillRect(px, py, size, size);
  ctx.strokeStyle = '#5a3d72';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);

  // Fondo del retrato según alineación
  let bgGrad = ctx.createLinearGradient(px, py, px, py + size);
  if (s.includes('maría') || s.includes('elena') || s.includes('lyra')) {
    bgGrad.addColorStop(0, '#2d1832');
    bgGrad.addColorStop(1, '#120816');
  } else if (s.includes('greta') || s.includes('boros') || s.includes('dario')) {
    bgGrad.addColorStop(0, '#362016');
    bgGrad.addColorStop(1, '#150c07');
  } else if (s.includes('corvus') || s.includes('erudito') || s.includes('alquimista')) {
    bgGrad.addColorStop(0, '#162838');
    bgGrad.addColorStop(1, '#08121a');
  } else if (s.includes('vane') || s.includes('guardia') || s.includes('escudero')) {
    bgGrad.addColorStop(0, '#242a38');
    bgGrad.addColorStop(1, '#0e121a');
  } else {
    bgGrad.addColorStop(0, '#281c3c');
    bgGrad.addColorStop(1, '#0e0817');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(px + 1, py + 1, size - 2, size - 2);

  // Cara base
  ctx.fillStyle = '#f5cac3';
  ctx.fillRect(px + 9, py + 10, 12, 12);
  // Cuello
  ctx.fillStyle = '#e0a899';
  ctx.fillRect(px + 12, py + 22, 6, 4);

  if (s.includes('maría')) {
    // Aldeana María: Pañuelo carmesí rústico y cabello castaño
    ctx.fillStyle = '#6f1d1b';
    ctx.fillRect(px + 7, py + 5, 16, 7); // Pañuelo
    ctx.fillRect(px + 6, py + 11, 4, 11);
    ctx.fillRect(px + 20, py + 11, 4, 11);
    ctx.fillStyle = '#ffe6a7';
    ctx.fillRect(px + 8, py + 11, 14, 2); // Broche
    // Ojos y boca
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#c9184a';
    ctx.fillRect(px + 13, py + 19, 4, 1);
    // Vestido
    ctx.fillStyle = '#43281c';
    ctx.fillRect(px + 7, py + 25, 16, 5);
  } else if (s.includes('greta')) {
    // Posadera Greta: Cofia blanca de taberna y delantal
    ctx.fillStyle = '#f4f1de';
    ctx.fillRect(px + 8, py + 5, 14, 6); // Cofia
    ctx.fillStyle = '#7f4f24';
    ctx.fillRect(px + 6, py + 10, 4, 9); // Pelo rizado castaño
    ctx.fillRect(px + 20, py + 10, 4, 9);
    // Rostro alegre
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#9c6644';
    ctx.fillRect(px + 13, py + 18, 4, 2);
    // Vestimenta
    ctx.fillStyle = '#582f0e';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  } else if (s.includes('boros')) {
    // Herrero Boros: Cinta de forja, barba espesa y cicatriz
    ctx.fillStyle = '#2b2d42';
    ctx.fillRect(px + 7, py + 6, 16, 4); // Pelo rapado oscuro
    ctx.fillStyle = '#8d0801';
    ctx.fillRect(px + 6, py + 9, 18, 3); // Cinta de sudor roja
    // Ojos decididos
    ctx.fillStyle = '#000000';
    ctx.fillRect(px + 11, py + 13, 3, 2);
    ctx.fillRect(px + 17, py + 13, 3, 2);
    // Barba espesa de herrero
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(px + 8, py + 17, 14, 8);
    // Peto de cuero quemado
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(px + 5, py + 24, 20, 6);
  } else if (s.includes('dario')) {
    // Mercader Dario el Tuerto: Parche de cuero y capucha
    ctx.fillStyle = '#2d1e2f';
    ctx.fillRect(px + 6, py + 5, 18, 7); // Capucha
    ctx.fillStyle = '#111111';
    ctx.fillRect(px + 10, py + 13, 4, 3); // Parche en ojo izquierdo
    ctx.fillRect(px + 7, py + 11, 10, 1); // Tira de parche
    // Ojo sano astuto
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(px + 17, py + 13, 2, 2);
    // Bigote fino
    ctx.fillStyle = '#33272a';
    ctx.fillRect(px + 12, py + 18, 6, 2);
    // Cuello de pieles
    ctx.fillStyle = '#5c4d3c';
    ctx.fillRect(px + 5, py + 24, 20, 6);
  } else if (s.includes('corvus')) {
    // Astrónomo Mayor Corvus: Capucha mística azul con tiara astral
    ctx.fillStyle = '#1d3557';
    ctx.fillRect(px + 6, py + 5, 18, 7);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(px + 13, py + 6, 4, 3); // Símbolo astral
    // Ojos celestes iluminados
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    // Barba canosa
    ctx.fillStyle = '#ced4da';
    ctx.fillRect(px + 11, py + 18, 8, 7);
    ctx.fillStyle = '#14213d';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  } else if (s.includes('vane') || s.includes('guardia') || s.includes('centinela') || s.includes('vigía') || s.includes('capitán') || s.includes('ballestero') || s.includes('sargento') || s.includes('paladín')) {
    // Capitán / Guardia / Centinela: Casco de hierro con visera, cresta roja y armadura
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(px + 7, py + 4, 16, 9); // Yelmo de acero
    ctx.fillStyle = '#adb5bd';
    ctx.fillRect(px + 8, py + 5, 14, 2); // Reflejo metálico
    ctx.fillStyle = '#d90429';
    ctx.fillRect(px + 12, py + 1, 6, 3); // Penacho rojo
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 10, py + 10, 10, 2); // Ranura de visera
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(px + 12, py + 10, 2, 1); // Ojo iluminado
    // Hombrera de armadura y tabardo
    ctx.fillStyle = '#495057';
    ctx.fillRect(px + 5, py + 23, 20, 7);
    ctx.fillStyle = '#9d0208';
    ctx.fillRect(px + 12, py + 23, 6, 7); // Tabardo carmesí
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(px + 14, py + 25, 2, 3);
  } else if (s.includes('anselmo') || s.includes('silas')) {
    // Sacerdote / Monje: Hábito con capucha y cruz dorada
    ctx.fillStyle = '#3d405b';
    ctx.fillRect(px + 6, py + 5, 18, 8); // Capucha
    ctx.fillStyle = '#f5cac3';
    ctx.fillRect(px + 9, py + 10, 12, 10); // Rostro sereno
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 13, 2, 2);
    ctx.fillRect(px + 17, py + 13, 2, 2);
    ctx.fillStyle = '#f4f1de';
    ctx.fillRect(px + 5, py + 23, 20, 7); // Manto
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(px + 14, py + 24, 2, 5); // Cruz de oro
    ctx.fillRect(px + 12, py + 25, 6, 2);
  } else if (s.includes('lía') || s.includes('niña')) {
    // Niña Huérfana Lía: Cabello castaño y bufanda carmesí
    ctx.fillStyle = '#9c6644';
    ctx.fillRect(px + 8, py + 6, 14, 8);
    ctx.fillStyle = '#f5cac3';
    ctx.fillRect(px + 10, py + 11, 10, 9);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#d90429';
    ctx.fillRect(px + 8, py + 20, 14, 5); // Bufanda roja
    ctx.fillStyle = '#ddb892';
    ctx.fillRect(px + 7, py + 25, 16, 5);
  } else if (s.includes('elena') || s.includes('lyra')) {
    // Boticaria / Sacerdotisa: Velo violeta y colgante de hierbas
    ctx.fillStyle = '#4a154b';
    ctx.fillRect(px + 7, py + 5, 16, 7);
    ctx.fillRect(px + 6, py + 12, 4, 12);
    ctx.fillRect(px + 20, py + 12, 4, 12);
    // Ojos esmeralda
    ctx.fillStyle = '#52b788';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#d8bbff';
    ctx.fillRect(px + 13, py + 21, 4, 4); // Amuleto
    ctx.fillStyle = '#31103f';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  } else {
    // Erudito / Viajero genérico de Véspera: Capucha oscura de viajero
    ctx.fillStyle = '#343a40';
    ctx.fillRect(px + 6, py + 5, 18, 7);
    ctx.fillRect(px + 6, py + 11, 4, 12);
    ctx.fillRect(px + 20, py + 11, 4, 12);
    ctx.fillStyle = '#212529';
    ctx.fillRect(px + 11, py + 14, 2, 2);
    ctx.fillRect(px + 17, py + 14, 2, 2);
    ctx.fillStyle = '#1b263b';
    ctx.fillRect(px + 6, py + 24, 18, 6);
  }

  // Brillo exterior dorado del marco
  ctx.strokeStyle = 'rgba(255, 190, 11, 0.4)';
  ctx.strokeRect(px + 1.5, py + 1.5, size - 3, size - 3);
}

