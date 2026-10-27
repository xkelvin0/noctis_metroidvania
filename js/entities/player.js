// =========================================================
// ESTADO, HABILIDADES Y CONTROL DE ALARIC (js/entities/player.js)
// =========================================================

const player = {
  x: 45, y: 200, w: 12, h: 22,
  vx: 0, vy: 0,
  dir: 1,
  hp: 100, maxHp: 100,
  state: 'IDLE',
  onGround: false,
  coyoteTimer: 0,
  jumpsLeft: 1,
  hasDash: false,
  hasDoubleJump: false,
  hasWallJump: false,
  hasHook: false,
  hasMist: false,
  hasDive: false,
  hasAstralEye: false,
  hasParryBrooch: false,
  hasBloodFang: false,
  hasShadeThread: false,
  hasStarWard: false,
  equippedAmulets: [],
  equippedCape: 'carmesi',
  magicTree: { blood: 0, shadow: 0, astro: 0 },
  amuletSlotBonus: 0,
  nextSpellBonus: 0,
  wallDir: 0,
  essence: 0,      // Moneda de Esencia recolectada
  atk: 15,         // Daño base de la espada
  hpUpgrades: 0,   // Contador de mejoras de Vida
  atkUpgrades: 0,  // Contador de mejoras de Daño
  attackReach: 0,
  spellPower: 0,
  spellEfficiency: 0,
  dashRecovery: 0,
  healBonus: 0,
  dashTimer: 0,
  dashCooldown: 0,
  mistTimer: 0,
  mistCooldown: 0,
  diveActive: false,
  hookCooldown: 0,
  attackTimer: 0,
  attackCooldown: 0,
  attackDir: 'forward', // 'forward' | 'down'
  attackHitRegistered: false,
  castCooldown: 0,
  invulnTimer: 0,
  animTimer: 0,
  dropThroughTimer: 0
};

function updatePlayer(keys, justPressed) {
  if (respawnFrames > 0) {
    respawnFrames--;
    return;
  }
  player.animTimer++;
  if (player.invulnTimer > 0) player.invulnTimer--;
  if (player.dashCooldown > 0) player.dashCooldown--;
  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.castCooldown > 0) player.castCooldown--;
  if (player.dropThroughTimer > 0) player.dropThroughTimer--;

  const leftKey = keys[gameSettings.leftKey || 'a'] || keys['arrowleft'];
  const rightKey = keys[gameSettings.rightKey || 'd'] || keys['arrowright'];
  const downKey = keys[gameSettings.downKey || 's'] || keys['arrowdown'];
  const customJump = gameSettings.jumpKey || ' ';
  const jumpPressed = justPressed['w'] || justPressed[customJump] || justPressed['z'] || justPressed['arrowup'];
  const jumpHeld = keys['w'] || keys[customJump] || keys['z'] || keys['arrowup'];
  const attackPressed = justPressed['mouseLeft'] || justPressed[gameSettings.attackKey || 'mouseLeft'];
  const castPressed = justPressed['mouseRight'] || justPressed[gameSettings.castKey || 'q'];
  const dashPressed = justPressed['shiftleft'] || justPressed['shift'] || justPressed[gameSettings.dashKey || 'shift'];
  const hookPressed = justPressed[gameSettings.hookKey || 'f'];
  const interactPressed = justPressed[gameSettings.interactKey || 'e'];
  const travelPressed = justPressed[gameSettings.travelKey || 't'];

  if (arrivalGuideBeacon && Number(currentRoomId) !== -2) arrivalGuideBeacon = false;

  // Al llegar a la Villa, el objetivo inicial se lee primero y el jugador da un paso antes de ver UI contextual.
  if (arrivalPromptLocked && bannerTimer <= 0 && (leftKey || rightKey)) {
    arrivalPromptLocked = false;
  }

  // RELIQUIA: Forma de Bruma (S + Shift)
  if (player.hasMist && downKey && dashPressed && player.mistCooldown <= 0 && player.mistTimer <= 0) {
    player.mistTimer = 45; // ~0.75s de forma intangible
    player.mistCooldown = 90;
    player.invulnTimer = 50;
    sfx('dash');
    showBanner("FORMA DE BRUMA ACTIVADA", 60);
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#c77dff', 16);
  }

  if (player.mistTimer > 0) {
    player.mistTimer--;
    player.state = 'MIST';
    player.vx = player.dir * 4.2;
    player.vy = 0;
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#7209b7', 2);
  }

  // RELIQUIA: Gancho de Sombra (Cadena del Condenado - Tecla F)
  if (hookPressed && player.hasHook && player.hookCooldown <= 0) {
    player.hookCooldown = 40;
    player.vy = -7.5; // Impulso vertical / acrobático hacia el techo
    player.vx = player.dir * 4.8;
    sfx('dash');
    showBanner("CADENA DEL CONDENADO", 50);
    triggerShake(4, 2);
    for (let k = 0; k < 12; k++) {
      particles.push({
        x: player.x + player.w / 2 + (Math.random() - 0.5) * 4,
        y: player.y - k * 6,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -2,
        life: 20,
        color: '#7de2ff'
      });
    }
  }

  // RELIQUIA: Martillo de Sangre / Dive Attack (S + Ataque en el aire)
  if (player.hasDive && downKey && attackPressed && !player.onGround && !player.diveActive) {
    player.diveActive = true;
    player.vy = 8.5; // Caída acelerada en picada
    player.vx = 0;
    sfx('cast');
    showBanner("¡MARTILLO DE SANGRE!", 50);
    triggerShake(5, 2);
  }

  if (player.diveActive) {
    player.vy = 9.5;
    spawnParticles(player.x + player.w / 2, player.y + player.h, '#ff0055', 4);
    if (player.onGround) {
      player.diveActive = false;
      triggerShake(12, 5);
      triggerHitStop(6);
      sfx('hit');
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ef476f', 24);
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffbe0b', 16);
      for (const e of enemies) {
        if (Math.hypot(e.x - player.x, e.y - player.y) < 70) {
          const bestiaryMult = (typeof getBestiaryDamageMultiplier === 'function') ? getBestiaryDamageMultiplier(e.type) : 1;
          const diveDmg = Math.round(player.atk * 1.8 * bestiaryMult);
          e.hp -= diveDmg;
          e.hurtTimer = 16;
          e.vy = -3.5;
          floatingTexts.push({
            text: `-${diveDmg}${bestiaryMult > 1 ? ' ✦' : ''}`,
            x: e.x + e.w / 2,
            y: e.y - 6,
            vy: -1.4,
            life: 30,
            color: bestiaryMult > 1 ? '#ffbe0b' : '#ef476f'
          });
        }
      }
    }
  }

  // Hechizo Carmesí / Sub-Arma: Lanza de Sangre (Clic Derecho o Q) - Consume Esencia
  if (castPressed && player.castCooldown <= 0) {
    const SPELL_COST = Math.max(4, 10 - (player.spellEfficiency || 0));
    if (player.essence >= SPELL_COST) {
      player.essence -= SPELL_COST;
      player.castCooldown = 22;
      sfx('cast');
      triggerShake(4, 1.5);
      const spellDamage = Math.round(player.atk * 1.4 + (player.spellPower || 0) + (player.magicTree.astro || 0) * 3 + (player.nextSpellBonus || 0));
      player.nextSpellBonus = 0;
      projectiles.push({
        x: player.x + (player.dir === 1 ? player.w + 4 : -4),
        y: player.y + 10,
        vx: player.dir * 6.5,
        vy: 0,
        r: 3.5,
        fromPlayer: true,
        dmg: spellDamage, freeze: !!player.hasAstralEye
      });
      spawnParticles(player.x + (player.dir === 1 ? player.w : 0), player.y + 10, '#ff0055', 8);
    } else {
      sfx('hit');
      showBanner("ESENCIA INSUFICIENTE (Requiere 10 ♦)", 70);
    }
  }

  // Habilidad: Dash Sombrío
  if (dashPressed && !downKey && player.hasDash && player.dashCooldown <= 0 && player.dashTimer <= 0) {
    player.dashTimer = 11;
    player.dashCooldown = Math.max(10, 32 - (player.dashRecovery || 0) - ((player.equippedAmulets || []).includes('shade_thread') ? 6 : 0) - (player.magicTree.shadow || 0) * 2);
    player.vy = 0;
    player.vx = player.dir * 6.5;
    sfx('dash');
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#9d4edd', 10);
  }

  if (player.dashTimer > 0) {
    player.dashTimer--;
    player.vy = 0;
    player.vx = player.dir * 6.5;
    player.state = 'DASH';
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#7b2cbf', 2);

    if (jumpPressed && (player.onGround || player.coyoteTimer > 0 || player.jumpsLeft > 0)) {
      player.dashTimer = 0;
      player.vy = -6.2;
      player.vx = player.dir * 5.2;
      if (player.onGround || player.coyoteTimer > 0) {
        player.coyoteTimer = 0;
        player.jumpsLeft = player.hasDoubleJump ? 1 : 0;
      } else {
        player.jumpsLeft--;
      }
      sfx('jump');
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#c77dff', 8);
    }
  } else {
    const speed = 2.2;
    if (leftKey) {
      player.vx = -speed;
      player.dir = -1;
    } else if (rightKey) {
      player.vx = speed;
      player.dir = 1;
    } else {
      player.vx *= 0.7;
      if (Math.abs(player.vx) < 0.1) player.vx = 0;
    }

    player.vy = Math.min(player.vy + 0.32, 6.5);

    // Deslizamiento en pared (WALL_SLIDE) si tiene las Garras de Gárgola
    const touchingWall = player.hasWallJump && !player.onGround && player.wallDir !== 0 &&
                         ((player.wallDir === -1 && leftKey) || (player.wallDir === 1 && rightKey));
    if (touchingWall && player.vy > 1.2) {
      player.vy = 1.2;
      if (player.animTimer % 8 === 0) sfx('wallslide');
      spawnParticles(player.x + (player.wallDir === 1 ? player.w : 0), player.y + 10, '#adb5bd', 1);
    }

    if (player.onGround) {
      player.coyoteTimer = 6;
      player.jumpsLeft = player.hasDoubleJump ? 2 : 1;
    } else if (player.coyoteTimer > 0) {
      player.coyoteTimer--;
    }

    if (downKey && jumpPressed && player.onGround) {
      player.dropThroughTimer = 10;
      player.onGround = false;
    } else if (jumpPressed) {
      if (player.hasWallJump && !player.onGround && player.wallDir !== 0) {
        player.vy = -6.0;
        player.vx = -player.wallDir * 4.2;
        player.dir = -player.wallDir;
        sfx('jump');
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#00bbf9', 10);
      } else if (player.coyoteTimer > 0) {
        player.vy = -6.2;
        player.coyoteTimer = 0;
        player.jumpsLeft = player.hasDoubleJump ? 1 : 0;
        sfx('jump');
      } else if (player.jumpsLeft > 0) {
        player.vy = -5.8;
        player.jumpsLeft--;
        sfx('jump');
        spawnParticles(player.x + player.w / 2, player.y + player.h, '#c77dff', 8);
      }
    }

    if (!jumpHeld && player.vy < -2.2) {
      player.vy *= 0.65;
    }

    if (attackPressed && player.attackCooldown <= 0) {
      player.attackTimer = 12;
      player.attackCooldown = 18;
      player.attackDir = (downKey && !player.onGround) ? 'down' : 'forward';
      player.attackHitRegistered = false;
      sfx('sword');
    }

    if (player.attackTimer > 0) {
      player.attackTimer--;
      player.state = 'ATTACK';
    } else if (!player.onGround) {
      player.state = player.vy < 0 ? 'JUMP' : 'FALL';
    } else if (Math.abs(player.vx) > 0.2) {
      player.state = 'RUN';
    } else {
      player.state = 'IDLE';
    }
  }

  moveWithCollisions(player, true);

  for (const ent of enemies) {
    if (!ent.isFriendly || !ent.blocksPassage || (ent.blockUntilAbility && player[ent.blockUntilAbility])) continue;
    if (!aabb(player, ent)) continue;
    if (player.x + player.w / 2 <= ent.x + ent.w / 2) player.x = ent.x - player.w;
    else player.x = ent.x + ent.w;
    player.vx = 0;
  }

  // Interacción con el entorno
  const cx = Math.floor((player.x + player.w / 2) / TILE);
  const cy = Math.floor((player.y + player.h / 2) / TILE);
  const footRow = Math.floor((player.y + player.h - 1) / TILE);
  const footTile = getTileAt(cx, footRow);

  // Pasos discretos según la superficie predominante de cada región
  if (player.onGround && Math.abs(player.vx) > 0.75 && player.attackTimer <= 0 && player.dashTimer <= 0) {
    player.stepTimer = (player.stepTimer || 0) - 1;
    if (player.stepTimer <= 0) {
      const zone = typeof getRoomZone === 'function' ? getRoomZone(currentRoomId) : 'carmesi';
      const stepSound = isCityRoom(currentRoomId) ? 'step_wood'
        : zone === 'juramento' ? 'step_water'
          : zone === 'reloj' ? 'step_metal' : 'step_stone';
      sfx(stepSound);
      player.stepTimer = 10;
    }
  } else {
    player.stepTimer = 0;
  }

  // Daño por pinchos (a menos que ejecute un Down-Slash / Pogo con éxito)
  const isPogoSlash = player.attackTimer > 2 && player.attackDir === 'down';
  if (footTile === '^') {
    if (isPogoSlash) {
      player.vy = -6.8;
      player.jumpsLeft = player.hasDoubleJump ? 1 : 0;
      player.dashCooldown = 0;
      sfx('pogo_hit');
      triggerShake(7, 2.5);
      triggerHitStop(3);
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffffff', 10);
      spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffbe0b', 8);
      spawnImpactSparks(player.x + player.w / 2, player.y + player.h, player.dir);
    } else {
      damagePlayer(20, cx * TILE + 8);
    }
  }

  // Interacción con el Altar: E (Guardar/Curar), 1 (Mejorar Vida), 2 (Mejorar Espada)
  const isAtAltar = (getTileAt(cx, cy) === 'S' || getTileAt(cx, footRow) === 'S' || getTileAt(cx, footRow - 1) === 'S');
  if (isAtAltar) {
    const hpCost = 30 + player.hpUpgrades * 25;
    const atkCost = 40 + player.atkUpgrades * 30;

    if (interactPressed) {
      lastAltarRoom = currentRoomId;
      lastAltarX = player.x;
      lastAltarY = player.y;
      storyProgress.discoveredAltars[currentRoomId] = true;
      if (typeof recordQuestAltar === 'function') {
        recordQuestAltar(currentRoomId);
      }
      player.hp = player.maxHp;
      saveProgress();
      sfx('relic');
      showBanner(`✦ ALMA CONSAGRADA: PARTIDA GUARDADA EN EL ALTAR ✦ | [1] +25 HP | [2] +5 ATK | [T] Viaje`, 230);
      floatingTexts.push({ text: "¡PARTIDA GUARDADA!", x: player.x - 24, y: player.y - 18, vy: -1.0, life: 40, color: '#ffbe0b' });
      floatingTexts.push({ text: "¡HP RESTAURADO!", x: player.x - 20, y: player.y - 8, vy: -1.2, life: 35, color: '#00f5d4' });
      spawnParticles(player.x + 6, player.y + 10, '#ffbe0b', 24);
      spawnParticles(player.x + 6, player.y + 10, '#ff0055', 16);
    } else if (travelPressed) {
      const altarRooms = Object.keys(storyProgress.discoveredAltars).map(Number).filter(id => id !== currentRoomId);
      if (altarRooms.length) {
        storyProgress.fastTravelIndex = ((storyProgress.fastTravelIndex || 0) + 1) % altarRooms.length;
        const destination = altarRooms[storyProgress.fastTravelIndex];
        sfx('relic');
        triggerShake(10, 3);
        spawnParticles(player.x + 6, player.y + 10, '#c77dff', 25);
        loadRoom(destination, 235, 200);
        showBanner(`✦ VIAJE RÁPIDO: ${ROOM_DEFS[destination].name.toUpperCase()} ✦`, 150);
        return;
      } else {
        showBanner("ACTIVA OTRO ALTAR PARA DESBLOQUEAR VIAJE RÁPIDO", 120);
      }
    } else if (justPressed['1']) {
      if (player.essence >= hpCost) {
        player.essence -= hpCost;
        player.hpUpgrades++;
        player.maxHp += 25;
        player.hp = player.maxHp;
        saveProgress();
        sfx('relic');
        showBanner(`¡VIDA MEJORADA A ${player.maxHp} HP!`, 140);
        spawnParticles(player.x + 6, player.y + 10, '#00f5d4', 20);
      } else {
        sfx('hit');
        showBanner(`ESENCIA INSUFICIENTE: Necesitas ${hpCost} ♦ para mejorar HP`, 120);
      }
    } else if (justPressed['2']) {
      if (player.essence >= atkCost) {
        player.essence -= atkCost;
        player.atkUpgrades++;
        player.atk += 5;
        saveProgress();
        sfx('relic');
        showBanner(`¡FILO CARMESÍ MEJORADO A ${player.atk} ATK!`, 140);
        spawnParticles(player.x + 6, player.y + 10, '#ff0055', 20);
      } else {
        sfx('hit');
        showBanner(`ESENCIA INSUFICIENTE: Necesitas ${atkCost} ♦ para mejorar ATK`, 120);
      }
    }
  }

  // Interacción con NPCs y tiendas (Tecla E)
  if (interactPressed && !arrivalPromptLocked) {
    if (bannerTimer > 0 && bannerSpeaker) {
      if (dialoguePages && dialoguePages.length > 1 && dialoguePageIndex < dialoguePages.length - 1) {
        dialoguePageIndex++;
        sfx('orb');
        bannerTimer = 999999;
        return;
      } else {
        closeBanner();
        sfx('click');
        return;
      }
    }

    if (!isAtAltar) {
      let closestNpc = null;
      let closestDist = 42;
      for (const ent of enemies) {
        if (ent.type === 'citizen' && ent.isFriendly) {
          const d = Math.hypot((player.x + player.w / 2) - (ent.x + (ent.w || 12) / 2), (player.y + player.h / 2) - (ent.y + (ent.h || 22) / 2));
          if (d < closestDist) {
            closestDist = d;
            closestNpc = ent;
          }
        }
      }

      if (closestNpc) {
        sfx('orb');
        if (typeof recordQuestTalk === 'function') {
          recordQuestTalk(closestNpc.name);
        }
        if (closestNpc.name.includes('Cartógrafa')) {
          if (typeof openShop === 'function') openShop('cartografa');
        } else if (closestNpc.name.includes('Alquimista Umbrío')) {
          if (typeof openShop === 'function') openShop('alquimista');
        } else if (closestNpc.name.includes('Custodia Selene')) {
          if (typeof openShop === 'function') openShop('reliquiario');
        } else if (closestNpc.name.includes('Elena')) {
          if (typeof openShop === 'function') openShop('elena');
        } else if (closestNpc.name.includes('Corvus')) {
          if (typeof openShop === 'function') openShop('corvus');
        } else if (closestNpc.name.includes('Boros')) {
          if (typeof openShop === 'function') openShop('boros');
        } else if (closestNpc.name.includes('Dario')) {
          if (typeof openShop === 'function') openShop('dario');
        } else {
          const dialog = closestNpc.dialog || '«La niebla carmesí susurra cosas extrañas...»';
          showBanner(dialog, 600, closestNpc.name);
        }
      } else {
        if (getTileAt(cx, cy) === 'M' || getTileAt(cx, footRow) === 'M') {
          if (typeof openShop === 'function') openShop('dario');
        } else if (getTileAt(cx, cy) === 'F' || getTileAt(cx, footRow) === 'F') {
          if (typeof openShop === 'function') openShop('boros');
        }
      }
    }
  }

  // Interacción con Espejo de Sangre 'T' en Sala 07
  const isAtMirror = (getTileAt(cx, cy) === 'T' || getTileAt(cx, footRow) === 'T');
  if (isAtMirror) {
    if (interactPressed || travelPressed) {
      sfx('relic');
      triggerShake(10, 3);
      spawnParticles(player.x + 6, player.y + 10, '#c77dff', 25);
      loadRoom(2, 235, 200);
      showBanner("✦ TELETRANSPORTE AL ALTAR DEL GRAN VESTÍBULO (SALA 02) ✦", 150);
      return;
    }
  }

  // Transiciones entre habitaciones y puertas de progreso
  const doors = ROOM_DEFS[currentRoomId] ? ROOM_DEFS[currentRoomId].doors : {};
  const useDoor = (door, direction) => {
    if (door.requiresAllSeals && !allSealsRestored()) {
      showBanner(`EL SANTUARIO DEL ECLIPSE EXIGE LOS 4 SELLOS (${sealCount()}/4)`, 180);
      return true;
    }
    if (door.requiresSealCount && sealCount() < door.requiresSealCount) {
      showBanner(`RUTA SELLADA: REQUIERE ${door.requiresSealCount} SELLOS (${sealCount()}/${door.requiresSealCount})`, 180);
      if (player.x < 14) {
        player.x = 14;
        player.vx = 0;
      }
      return true;
    }
    if (door.requiresAbility && !player[door.requiresAbility]) {
      showBanner(`RUTA BLOQUEADA: REQUIERE ${door.requiresLabel}`, 150);
      if (player.x < 14) {
        player.x = 14;
        player.vx = 0;
      }
      return true;
    }
    startRoomTransition(door.to, door.x, door.y, direction);
    return true;
  };

  if (player.x + player.w > W - 6 && doors.eastUpper && player.y <= 140) {
    useDoor(doors.eastUpper, 'right');
    return;
  }
  if (player.x + player.w > W - 6 && doors.right) {
    useDoor(doors.right, 'right');
    return;
  }
  if (player.x < 6 && doors.westUpper && player.y <= 140) {
    useDoor(doors.westUpper, 'left');
    return;
  }
  if (player.x < 6 && doors.left && (!doors.westUpper || player.y > 140)) {
    useDoor(doors.left, 'left');
    return;
  }
  if (player.y < 10 && doors.up) {
    useDoor(doors.up, 'up');
    return;
  }
  if (player.y + player.h > H - 10 && doors.down) {
    useDoor(doors.down, 'down');
    return;
  }

  // Combate con espada (Frontal o Hacia Abajo / Pogo Jump)
  if (player.attackTimer > 3 && player.attackTimer < 10) {
    const isDown = player.attackDir === 'down';
    const swordBox = isDown
      ? {
          x: player.x - 4,
          y: player.y + player.h - 2,
          w: player.w + 8,
          h: 18
        }
      : {
          x: player.dir === 1 ? player.x + 2 : player.x - (24 + player.attackReach),
          y: player.y - 2,
          w: 24 + player.attackReach + player.w,
          h: 22
        };

    // Parreo de proyectiles enemigos
    for (let k = projectiles.length - 1; k >= 0; k--) {
      const prj = projectiles[k];
      if (!prj.fromPlayer && aabb(swordBox, { x: prj.x - prj.r, y: prj.y - prj.r, w: prj.r * 2, h: prj.r * 2 })) {
        prj.fromPlayer = true;
        prj.vx = -prj.vx * (player.hasParryBrooch ? 2.4 : 1.6);
        prj.vy = (Math.random() - 0.5) * 1.5;
        prj.dmg = player.atk * (player.hasParryBrooch ? 4.5 : 2.5);
        sfx('parry');
        triggerShake(player.hasParryBrooch ? 12 : 8, player.hasParryBrooch ? 4 : 3);
        triggerHitStop(player.hasParryBrooch ? 8 : 5);
        floatingTexts.push({
          text: player.hasParryBrooch ? "¡CONTRAGOLPE CRÍTICO!" : "¡PARRY!",
          x: prj.x - 24,
          y: prj.y - 12,
          vy: -1.2,
          life: 35,
          color: player.hasParryBrooch ? '#06d6a0' : '#ffbe0b'
        });
        spawnParticles(prj.x, prj.y, player.hasParryBrooch ? '#06d6a0' : '#ffbe0b', 18);
        spawnParticles(prj.x, prj.y, '#ffffff', 10);
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.hurtTimer <= 0 && aabb(swordBox, e)) {
        if (!isDown && e.type === 'armor' && e.dir !== player.dir) {
          sfx(e.type === 'boss' ? 'boss_hit' : (e.type === 'armor' ? 'armor_hit' : (e.type === 'skeleton' ? 'bone_hit' : 'hit')));
          spawnParticles(swordBox.x + 10, swordBox.y + 8, '#adb5bd', 5);
          continue;
        }
        const bestiaryMult = (typeof getBestiaryDamageMultiplier === 'function') ? getBestiaryDamageMultiplier(e.type) : 1;
        const dealtDmg = Math.round(player.atk * bestiaryMult);
        e.hp -= dealtDmg;
        if (player.poisonBlade) e.poisonTimer = 150;
        const bleedChance = (player.bleedChance || 0) + ((player.equippedAmulets || []).includes('blood_fang') ? 0.28 : 0) + (player.magicTree.blood || 0) * 0.08;
        if (bleedChance > 0 && Math.random() < bleedChance) { e.bleedTimer = 120 + (player.magicTree.blood || 0) * 20; spawnBloodParticles(e.x + e.w / 2, e.y + 8, player.dir, 6); }
        if (player.hasParryBrooch && e.type === 'armor') e.guardBreak = (e.guardBreak || 0) + 1;
        if (e.guardBreak >= 3) { e.guardBrokenTimer = 120; e.guardBreak = 0; showBanner('¡GUARDIA ROTA!', 70); }
        e.hurtTimer = 12;
        triggerShake(e.type === 'boss' ? 9 : (isDown ? 7 : 5), e.type === 'boss' ? 4 : 2.5);
        triggerHitStop(e.type === 'boss' ? 6 : (isDown ? 4 : 3));
        spawnBloodParticles(e.x + e.w / 2, e.y + e.h / 2, player.dir, 10);

        if (isDown) {
          player.vy = -6.8;
          player.jumpsLeft = player.hasDoubleJump ? 1 : 0;
          player.dashCooldown = 0;
          e.vy = 2.0;
          sfx('pogo_hit');
          spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffffff', 8);
          spawnParticles(player.x + player.w / 2, player.y + player.h, '#ffbe0b', 6);
          spawnImpactSparks(e.x + e.w / 2, e.y + 4, player.dir);
        } else {
          player.vx -= player.dir * 0.9;
          const kbForce = e.type === 'boss' ? 0.8 : (e.type === 'armor' ? 1.6 : 3.2);
          e.knockbackX = player.dir * kbForce;
          if (e.type !== 'boss') e.vy = -1.8;
          spawnImpactSparks(e.x + (player.dir === 1 ? 2 : e.w - 2), e.y + e.h / 2, player.dir);
        }

        if (e.type === 'boss') {
          e.comboHits = (e.comboHits || 0) + 1;
          if (e.comboHits >= 3 && e.phaseTimer > 15) {
            e.comboHits = 0;
            sfx('dash');
            spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#9d4edd', 20);
            e.x = (player.x > 240) ? 90 : 380;
            e.vy = -1;
            spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#9d4edd', 20);
            floatingTexts.push({ text: "¡EVASIÓN SOMBRÍA!", x: e.x - 25, y: e.y - 12, vy: -1.0, life: 30, color: '#c77dff' });
          }
        }

        floatingTexts.push({
          text: `-${dealtDmg}${bestiaryMult > 1 ? ' ✦' : ''}`,
          x: e.x + e.w / 2 - 4,
          y: e.y - 4,
          vy: -1.2,
          life: 25,
          color: bestiaryMult > 1 ? '#ffbe0b' : '#ffccd5'
        });

        sfx('hit');
        if (e.hp <= 0) {
          if (e.elite) { storyProgress.eliteKills++; storyProgress.eliteDefeated = storyProgress.eliteDefeated || {}; storyProgress.eliteDefeated[e.name || `${currentRoomId}_${e.type}`] = true; addMaterial(materialForCurrentZone(), 3); }
          if (typeof recordQuestKill === 'function') {
            recordQuestKill(e.type, !!e.elite);
          }
          if (typeof recordBestiaryKill === 'function') {
            recordBestiaryKill(e.type);
          }
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ffbe0b', 18);

          const essenceMult = (typeof getBestiaryEssenceMultiplier === 'function') ? getBestiaryEssenceMultiplier(e.type) : 1;
          const baseOrbCount = e.type === 'boss' ? 20 : (e.type === 'armor' ? 5 : (e.type === 'skeleton' ? 3 : 2));
          const orbCount = Math.round(baseOrbCount * essenceMult);
          for (let k = 0; k < orbCount; k++) {
            essenceOrbs.push({
              x: e.x + e.w / 2,
              y: e.y + e.h / 2,
              w: 5, h: 5,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 3.5 - 1,
              val: 5
            });
          }

          const heartBonus = (typeof getBestiaryHeartBonus === 'function') ? getBestiaryHeartBonus(e.type) : 0;
          const dropChance = (e.type === 'boss' ? 1.0 : 0.35) + heartBonus;
          if (Math.random() < dropChance) {
            heartPickups.push({
              x: e.x + e.w / 2 - 3,
              y: e.y + e.h / 2 - 3,
              w: 8, h: 8,
              vx: (Math.random() - 0.5) * 2,
              vy: -2.8,
              heal: 25
            });
          }

          if (e.type === 'boss') defeatBoss(e);
          enemies.splice(i, 1);
        }
      }
    }

    // Interacción de espada con Muros Secretos Rompibles ('?')
    if (!player.attackHitRegistered) {
      const minCol = Math.floor(swordBox.x / TILE);
      const maxCol = Math.floor((swordBox.x + swordBox.w) / TILE);
      const minRow = Math.floor(swordBox.y / TILE);
      const maxRow = Math.floor((swordBox.y + swordBox.h) / TILE);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
          const key = `${currentRoomId}_${c}_${r}`;
          if (brokenWalls[key]) continue;

          const currentRoom = ROOM_DEFS[currentRoomId];
          const rawTile = currentRoom && currentRoom.map && currentRoom.map[r] ? currentRoom.map[r][c] : '#';
          if (rawTile === '?') {
            player.attackHitRegistered = true;
            if (breakableWallHits[key] === undefined) breakableWallHits[key] = 3;
            breakableWallHits[key]--;

            const tileCenterX = c * TILE + TILE / 2;
            const tileCenterY = r * TILE + TILE / 2;

            if (breakableWallHits[key] <= 0) {
              brokenWalls[key] = true;
              if (typeof recordQuestWall === 'function') {
                recordQuestWall();
              }
              addMaterial(materialForCurrentZone(), 1);
              sfx('crumble');
              triggerShake(10, 4);
              triggerHitStop(4);
              floatingTexts.push({
                text: "¡SECRETO REVELADO!",
                x: tileCenterX - 35,
                y: tileCenterY - 14,
                vy: -1.0,
                life: 45
              });

              for (let k = 0; k < 18; k++) {
                particles.push({
                  x: tileCenterX,
                  y: tileCenterY,
                  vx: (Math.random() - 0.5) * 5,
                  vy: -Math.random() * 4 - 1,
                  life: 25 + Math.random() * 15,
                  color: ['#4a3b5c', '#7209b7', '#adb5bd', '#332447'][Math.floor(Math.random() * 4)]
                });
              }

              for (let k = 0; k < 8; k++) {
                essenceOrbs.push({
                  x: tileCenterX,
                  y: tileCenterY,
                  w: 5, h: 5,
                  vx: (Math.random() - 0.5) * 4.5,
                  vy: -Math.random() * 3.5 - 1.5,
                  val: 5
                });
              }
              heartPickups.push({
                x: tileCenterX - 4,
                y: tileCenterY - 4,
                w: 8, h: 8,
                vx: (Math.random() - 0.5) * 2,
                vy: -3.2,
                heal: 35
              });
              storyProgress.secretRewards = storyProgress.secretRewards || {};
              if (!storyProgress.secretRewards[key]) {
                const rewardIndex = Object.keys(storyProgress.secretRewards).length % 3;
                storyProgress.secretRewards[key] = true;
                if (rewardIndex === 0) {
                  player.maxHp += 10;
                  player.hp = Math.min(player.maxHp, player.hp + 10);
                  showBanner('SECRETO: FRAGMENTO DE CORAZÓN (+10 VIDA MÁX.)', 170);
                } else if (rewardIndex === 1) {
                  player.atk += 2;
                  showBanner('SECRETO: ESQUIRLA DE FILO (+2 ATK)', 170);
                } else {
                  player.spellPower = (player.spellPower || 0) + 3;
                  showBanner('SECRETO: RUNA MENOR (+3 MAGIA)', 170);
                }
                saveProgress();
              }
            } else {
              sfx('hit');
              triggerShake(5, 2);
              triggerHitStop(2);
              floatingTexts.push({
                text: `${breakableWallHits[key]} golpes restantes`,
                x: tileCenterX - 30,
                y: tileCenterY - 10,
                vy: -0.8,
                life: 25
              });
              spawnParticles(tileCenterX, tileCenterY, '#7209b7', 8);
              spawnParticles(tileCenterX, tileCenterY, '#adb5bd', 6);
            }
            break;
          }
        }
        if (player.attackHitRegistered) break;
      }
    }
  }

  // Recolección de Reliquias
  for (let i = relics.length - 1; i >= 0; i--) {
    const r = relics[i];
    if (aabb(player, r)) {
      if (r.type === 'dash') player.hasDash = true;
      if (r.type === 'doublejump') player.hasDoubleJump = true;
      if (r.type === 'walljump') player.hasWallJump = true;
      if (r.type === 'hook') player.hasHook = true;
      if (r.type === 'mist') player.hasMist = true;
      if (r.type === 'dive') player.hasDive = true;
      if (r.type === 'astraleye') player.hasAstralEye = true;
      if (r.type === 'parrybrooch') player.hasParryBrooch = true;
      if (r.type === 'bloodfang') player.hasBloodFang = true;
      if (r.type === 'shadethread') player.hasShadeThread = true;
      if (r.type === 'starward') player.hasStarWard = true;
      if (r.type === 'materialnode') {
        storyProgress.collectedNodes = storyProgress.collectedNodes || {};
        storyProgress.collectedNodes[r.nodeKey] = true;
        addMaterial(r.material, 2);
        showBanner(`NODO RECOLECTADO: +2 ${MATERIALS_DATA[r.material].name.toUpperCase()}`, 120);
      }
      if (r.type === 'sun_heart') {
        player.essence += 150;
        player.hp = player.maxHp;
      }
      sfx('relic');
      showBanner("RELIQUIA OBTENIDA: " + r.name, 190);
      spawnParticles(r.x + 7, r.y + 7, '#00f5d4', 24);
      if (typeof showSkillTutorial === 'function') {
        showSkillTutorial(r.type);
      }
      saveProgress();
      if (typeof checkQuestNotifications === 'function' && typeof getQuestCurrentStates === 'function') {
        checkQuestNotifications(getQuestCurrentStates());
      }
      relics.splice(i, 1);
    }
  }
}
