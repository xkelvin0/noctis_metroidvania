// =============================================================================
// js/entities/enemies.js - Inteligencia Artificial, Jefes y Proyectiles
// Noctis: Metroidvania - Módulo de Bestiario y Combate Enemigo
// =============================================================================

function defeatEnemyFromStatus(enemy) {
  if (enemy.elite) {
    storyProgress.eliteKills++;
    storyProgress.eliteDefeated = storyProgress.eliteDefeated || {};
    storyProgress.eliteDefeated[enemy.name || `${currentRoomId}_${enemy.type}`] = true;
    addMaterial(materialForCurrentZone(), 3);
  }
  if (typeof recordQuestKill === 'function') recordQuestKill(enemy.type, !!enemy.elite);
  if (typeof recordBestiaryKill === 'function') recordBestiaryKill(enemy.type);

  const essenceMult = (typeof getBestiaryEssenceMultiplier === 'function') ? getBestiaryEssenceMultiplier(enemy.type) : 1;
  const baseOrbCount = enemy.type === 'boss' ? 20 : (enemy.type === 'armor' ? 5 : (enemy.type === 'skeleton' ? 3 : 2));
  const orbCount = Math.round(baseOrbCount * essenceMult);
  for (let index = 0; index < orbCount; index++) {
    essenceOrbs.push({ x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2, w: 5, h: 5, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3.5 - 1, val: 5 });
  }

  const heartBonus = (typeof getBestiaryHeartBonus === 'function') ? getBestiaryHeartBonus(enemy.type) : 0;
  const dropChance = (enemy.type === 'boss' ? 1.0 : 0.35) + heartBonus;
  if (Math.random() < dropChance) {
    heartPickups.push({
      x: enemy.x + enemy.w / 2 - 3,
      y: enemy.y + enemy.h / 2 - 3,
      w: 8, h: 8,
      vx: (Math.random() - 0.5) * 2,
      vy: -2.8,
      heal: 25
    });
  }

  spawnParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#ffbe0b', 18);
  if (enemy.type === 'boss') defeatBoss(enemy);
  const enemyIndex = enemies.indexOf(enemy);
  if (enemyIndex >= 0) enemies.splice(enemyIndex, 1);
}

function updateEnemies() {
  if (respawnFrames > 0) return;
  for (const e of enemies) {
    if (e.poisonTimer > 0) { e.poisonTimer--; if (e.poisonTimer % 30 === 0) { e.hp -= 2; spawnParticles(e.x + e.w / 2, e.y + 8, '#70e000', 4); } }
    if (e.bleedTimer > 0) { e.bleedTimer--; if (e.bleedTimer % 24 === 0) { e.hp -= 3; spawnBloodParticles(e.x + e.w / 2, e.y + 8, e.dir || 1, 3); } }
    if (e.freezeTimer > 0) { e.freezeTimer--; e.vx *= 0.35; }
    if (e.guardBrokenTimer > 0) e.guardBrokenTimer--;
    if (e.hurtTimer > 0) e.hurtTimer--;
    if (!e.isFriendly && e.hp <= 0) {
      defeatEnemyFromStatus(e);
      continue;
    }

    if (e.type === 'citizen') {
      // Ciudadano pacífico paseando de lado a lado por la calle
      e.vy = Math.min(e.vy + 0.32, 6);
      if (e.stationary) {
        e.vx = 0;
        moveWithCollisions(e);
        continue;
      }
      e.walkTimer--;
      if (e.walkTimer <= 0) {
        e.dir = -e.dir;
        e.vx = e.dir * (0.35 + Math.random() * 0.2);
        e.walkTimer = 90 + Math.random() * 80;
      }
      // No salir de la habitación
      if (e.x < 30) { e.dir = 1; e.vx = 0.45; }
      if (e.x > W - 50) { e.dir = -1; e.vx = -0.45; }
      moveWithCollisions(e);
      continue; // No atacan ni dañan
    }

    if (e.type === 'skeleton') {
      e.vy = Math.min(e.vy + 0.32, 6);
      const dist = Math.hypot((player.x - e.x), (player.y - e.y));

      // Aplicar retroceso de impacto
      if (e.knockbackX) {
        e.vx = e.knockbackX;
        e.knockbackX *= 0.82;
        if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
      } else if (e.lungeTimer > 0) {
        e.lungeTimer--;
        e.vx = e.dir * 3.2;
      } else if (e.attackTelegraph > 0) {
        e.attackTelegraph--;
        e.vx = 0;
        if (e.attackTelegraph === 0) e.lungeTimer = 14;
      } else if (dist < 75 && Math.abs(player.y - e.y) < 24) {
        e.dir = player.x < e.x ? -1 : 1;
        e.attackTelegraph = 25;
      } else {
        e.vx = e.dir * 0.75;
        const aheadCol = Math.floor((e.x + (e.dir > 0 ? e.w + 2 : -2)) / TILE);
        const footRow = Math.floor((e.y + e.h + 2) / TILE);
        const wallCol = getTileAt(aheadCol, Math.floor((e.y + 8) / TILE));
        const floorBelow = getTileAt(aheadCol, footRow);
        if (wallCol === '#' || (floorBelow === '.' || floorBelow === '^')) {
          e.dir *= -1;
        }
      }
      moveWithCollisions(e);
    } else if (e.type === 'bat') {
      const dist = Math.hypot(player.x - e.x, player.y - e.y);
      if (!e.active && dist < 150) e.active = true;
      if (e.active) {
        if (e.knockbackX) {
          e.x += e.knockbackX;
          e.knockbackX *= 0.85;
          if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
        } else {
          e.t += 0.1;
          e.dir = player.x < e.x ? -1 : 1;
          e.x += e.dir * 1.1;
          e.y = e.baseY + 35 + Math.sin(e.t) * 26;
        }
      }
    } else if (e.type === 'armor') {
      e.vy = Math.min(e.vy + 0.32, 6);
      if (e.knockbackX) {
        e.vx = e.knockbackX;
        e.knockbackX *= 0.8;
        if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
      } else {
        e.dir = player.x < e.x ? -1 : 1;
        e.vx = e.dir * 0.45;
      }
      moveWithCollisions(e);
    } else if (e.type === 'archer') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      if (--e.actionTimer <= 0) {
        e.actionTimer = 95;
        projectiles.push({ x: e.x + 8, y: e.y + 10, vx: e.dir * 3.4, vy: -0.4, r: 3 });
      }
      moveWithCollisions(e);
    } else if (e.type === 'bomber') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      e.vx = e.dir * 0.9;
      moveWithCollisions(e);
      if (Math.hypot(player.x - e.x, player.y - e.y) < 20) {
        damagePlayer(28, e.x);
        e.x = -100;
        e.hp = 0;
      }
    } else if (e.type === 'summoner') {
      e.t = (e.t || 0) + 0.08;
      e.y = e.baseY + Math.sin(e.t) * 8;
      if (--e.actionTimer <= 0) {
        e.actionTimer = 150;
        enemies.push({ type: 'bat', x: e.x, y: e.y, baseY: e.y, w: 14, h: 12, vx: 0, vy: 0, hp: 20, maxHp: 20, active: true, t: 0, hurtTimer: 0 });
      }
    } else if (e.type === 'shield') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      e.vx = e.dir * 0.3;
      moveWithCollisions(e);
    } else if (e.type === 'duelist') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      if (e.actionTimer-- <= 0) { e.actionTimer = 95; e.lungeTimer = 16; e.attackTelegraph = 20; }
      if (e.attackTelegraph > 0) { e.attackTelegraph--; e.vx = 0; }
      else if (e.lungeTimer > 0) { e.lungeTimer--; e.vx = e.dir * 3.5; }
      else e.vx = e.dir * 0.85;
      moveWithCollisions(e);
    } else if (e.type === 'trapper') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      if (--e.actionTimer <= 0) {
        e.actionTimer = 135;
        projectiles.push({ x: e.x + 8, y: 210, vx: 0, vy: 0, r: 7, trap: true, life: 115 });
        showBanner('TRAMPA RÚNICA DESPLEGADA', 45);
      }
      moveWithCollisions(e);
    } else if (e.type === 'beast') {
      e.vy = Math.min(e.vy + 0.32, 6);
      e.dir = player.x < e.x ? -1 : 1;
      if (e.chargeTimer > 0) { e.chargeTimer--; e.vx = e.dir * 4.4; }
      else if (--e.actionTimer <= 0) { e.actionTimer = 115; e.chargeTimer = 24; e.attackTelegraph = 16; }
      else e.vx = e.dir * 0.7;
      if (e.attackTelegraph > 0) { e.attackTelegraph--; e.vx = 0; }
      moveWithCollisions(e);
    } else if (e.type === 'specter') {
      e.t = (e.t || 0) + 0.07;
      e.dir = player.x < e.x ? -1 : 1;
      e.x += e.dir * 0.8;
      e.y = e.baseY + Math.sin(e.t) * 22;
      if (Math.abs(player.x - e.x) < 34 && --e.actionTimer <= 0) { e.actionTimer = 100; projectiles.push({ x: e.x, y: e.y + 10, vx: e.dir * 3.2, vy: 0, r: 4, spectral: true }); }
    } else if (e.type === 'boss') {
      if (e.entryTimer > 0) {
        e.entryTimer--;
        e.vx = 0;
        e.vy = Math.min(e.vy + 0.32, 6);
        moveWithCollisions(e);
        if (e.entryTimer % 8 === 0) spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.bossColor, 3);
        continue;
      }
      // COMPROBACIÓN FASE 2: LORD MALAKOR DESATADO (<= 50% HP)
      if (!e.phase2 && e.hp <= e.maxHp * 0.5) {
        e.phase2 = true;
        e.phaseTimer = 110;
        e.pattern = -1; // Modo de transformación
        e.attackStep = -1;
        e.isTelegraphing = true;
        e.telegraphType = 'phase2_roar';
        sfx('relic');
        triggerShake(25, 6);
        triggerHitStop(14);
        showBanner(`¡${e.name.toUpperCase()} — FASE 2: ${e.phaseName.toUpperCase()}!`, 200);
        floatingTexts.push({
          text: `¡FASE 2: ${e.phaseName.toUpperCase()}!`,
          x: e.x - 45,
          y: e.y - 18,
          vy: -1.0,
          life: 60,
          color: e.bossColor
        });
        for (let k = 0; k < 35; k++) {
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.bossColor, 2);
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ffbe0b', 2);
          spawnBloodParticles(e.x + e.w / 2, e.y + e.h / 2, (k % 2 === 0 ? 1 : -1), 2);
        }
      }

      e.vy = Math.min(e.vy + 0.32, 6);
      if (e.knockbackX) {
        e.x += e.knockbackX;
        e.knockbackX *= 0.8;
        if (Math.abs(e.knockbackX) < 0.1) e.knockbackX = 0;
      }
      e.phaseTimer--;
      e.arenaTimer--;
      if (e.arenaTimer <= 0) {
        e.arenaTimer = e.phase2 ? 75 : 115;
        const hazardSpeed = e.phase2 ? 4.2 : 3.1;
        if (e.bossId === 'juramento') {
          const direction = player.x < W / 2 ? 1 : -1;
          projectiles.push({ x: direction > 0 ? 14 : W - 14, y: 207, vx: direction * hazardSpeed, vy: -0.15, r: 6, tidal: true });
        } else if (e.bossId === 'reloj') {
          const startX = 70 + Math.floor(Math.random() * 6) * 60;
          projectiles.push({ x: startX, y: 28, vx: player.x > startX ? 0.6 : -0.6, vy: hazardSpeed, r: 6, clockwave: true });
        } else if (e.bossId === 'astral') {
          const startX = 40 + Math.floor(Math.random() * 7) * 55;
          projectiles.push({ x: startX, y: 18, vx: (player.x - startX) * 0.018, vy: hazardSpeed, r: 5, comet: true });
        } else {
          const direction = player.x < W / 2 ? 1 : -1;
          projectiles.push({ x: direction > 0 ? 18 : W - 18, y: 165, vx: direction * hazardSpeed, vy: -0.3, r: 5, bloodBlade: true });
        }
        if (e.phase2) showBanner(`ARENA: ${e.arenaName.toUpperCase()}`, 48);
      }

      if (e.phaseTimer <= 0) {
        const attackOrder = e.attackOrder[e.phase2 ? 1 : 0];
        e.attackStep = (e.attackStep + 1) % attackOrder.length;
        e.pattern = attackOrder[e.attackStep];
        e.dir = player.x < e.x ? -1 : 1;
        e.isTelegraphing = true;

        if (e.pattern === 0) {
          // Ráfaga de proyectiles oscuros (telegrafiada 22 frames)
          e.telegraphType = 'burst';
          e.telegraphTimer = e.phase2 ? 18 : 25;
          e.phaseTimer = e.phase2 ? 75 : 95;
          e.vx = 0;
        } else if (e.pattern === 1) {
          // Embestida rápida sombría (telegrafiada 24 frames)
          e.telegraphType = 'dash';
          e.telegraphTimer = e.phase2 ? 20 : 28;
          e.phaseTimer = e.phase2 ? 65 : 80;
          e.vx = 0;
          e.dashSecondStrike = false;
        } else if (e.pattern === 2) {
          // Pilares solares del suelo (telegrafiadas grietas en suelo)
          e.telegraphType = 'pillars';
          e.telegraphTimer = e.phase2 ? 26 : 35;
          e.phaseTimer = e.phase2 ? 85 : 110;
          e.pillars = e.bossId === 'juramento' ? [92, 164, 316, 388]
            : (e.bossId === 'astral' ? [70, 132, 210, 288, 350, 412]
              : (e.bossId === 'reloj' ? [115, 205, 295, 385] : [70, 140, 210, 280, 350, 410]));
          e.vx = 0;
        } else if ((e.pattern === 3 || e.pattern === 4) && e.phase2) {
          e.telegraphType = e.bossId === 'juramento' ? 'tidal_wave'
            : e.bossId === 'reloj' ? 'clock_sweep'
            : e.bossId === 'carmesi' ? 'blood_blades'
            : 'comets';
          e.telegraphTimer = 22;
          e.phaseTimer = 85;
          if (e.bossId === 'astral' || e.bossId === 'malakor') { e.x = 228; e.y = 80; }
          e.vx = 0;
        }
      }

      // Procesar telegrafiado y ejecución de ataques
      if (e.telegraphTimer > 0) {
        e.telegraphTimer--;
        if (e.telegraphTimer === 0) {
          e.isTelegraphing = false;
          // Ejecutar el ataque según patrón
          if (e.pattern === 0) {
            // Disparar ráfaga
            const angles = e.phase2 ? [-0.35, -0.18, 0, 0.18, 0.35] : [-0.25, 0, 0.25];
            for (const a of angles) {
              const baseAngle = Math.atan2((player.y + 10) - (e.y + 15), (player.x + 6) - (e.x + 12)) + a;
              const spd = e.phase2 ? 3.8 : 2.8;
              projectiles.push({
                x: e.x + 10, y: e.y + 14,
                vx: Math.cos(baseAngle) * spd,
                vy: Math.sin(baseAngle) * spd,
                r: e.phase2 ? 5 : 4
              });
            }
            sfx('sword');
            triggerShake(6, 2);
          } else if (e.pattern === 1) {
            // Iniciar embestida
            e.vx = e.dir * (e.phase2 ? 6.2 : 4.4);
            sfx('dash');
            triggerShake(8, 3);
            spawnParticles(e.x, e.y + 16, '#ff0055', 12);
          } else if (e.pattern === 2) {
            // Confirmar pilares
            sfx('relic');
          } else if ((e.pattern === 3 || e.pattern === 4) && e.phase2) {
            sfx('cast');
            triggerShake(12, 3.5);
            if (e.bossId === 'juramento') {
              for (const direction of [-1, 1]) projectiles.push({ x: e.x + 10, y: 205, vx: direction * 4.2, vy: -0.35, r: 7, tidal: true });
            } else if (e.bossId === 'reloj') {
              for (const direction of [-1, 1]) projectiles.push({ x: e.x + 10, y: 130, vx: direction * 3.2, vy: 0, r: 8, clockwave: true });
            } else if (e.bossId === 'carmesi') {
              for (const direction of [-1, 1]) projectiles.push({ x: e.x + 10, y: e.y + 12, vx: direction * 4.8, vy: -1.2, r: 5, bloodBlade: true });
            } else {
              for (let c = 0; c < 6; c++) {
                const startX = 60 + c * 60 + (Math.random() - 0.5) * 20;
                projectiles.push({ x: startX, y: 15, vx: (player.x - startX) * 0.02, vy: 3.4 + Math.random() * 1.5, r: 5 });
              }
            }
          }
        }
      }

      // En Fase 2, durante patrón 1 (dash), si termina el primer dash puede hacer un teletransporte de contraataque
      if (e.pattern === 1 && e.phase2 && !e.dashSecondStrike && e.phaseTimer === 30) {
        e.dashSecondStrike = true;
        sfx('dash');
        spawnParticles(e.x, e.y + 16, '#9d4edd', 14);
        e.x = (player.dir === 1) ? player.x - 35 : player.x + 35;
        e.dir = player.x < e.x ? -1 : 1;
        e.vx = e.dir * 4.5;
        spawnParticles(e.x, e.y + 16, '#ff0055', 14);
        triggerShake(8, 2.5);
      }

      // Erupción de Pilares (patrón 2)
      if (e.pattern === 2 && e.pillars && e.pillars.length > 0) {
        const hitFrame = e.phase2 ? 30 : 45;
        if (e.phaseTimer === hitFrame) {
          sfx('hit');
          triggerShake(14, 4);
          for (const px of e.pillars) {
            spawnParticles(px, 210, e.phase2 ? '#ff0055' : '#ff5400', 16);
            if (Math.abs((player.x + 6) - px) < 14 && player.y + player.h > 140) {
              damagePlayer(e.phase2 ? 30 : 25, px);
            }
          }
        }
      }
      moveWithCollisions(e);
    }

    if (aabb(player, e)) {
      if (!e.isFriendly) {
        damagePlayer(15, e.x + e.w / 2);
      }
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    if (p.trap) {
      p.life--;
      if (p.life <= 0) { projectiles.splice(i, 1); continue; }
      if (aabb(player, { x: p.x - p.r, y: p.y - p.r, w: p.r * 2, h: p.r * 2 })) { damagePlayer(22, p.x); projectiles.splice(i, 1); }
      continue;
    }
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
      projectiles.splice(i, 1);
      continue;
    }

    if (p.fromPlayer) {
      // Proyectil disparado por Alaric
      let hit = false;
      const pBox = { x: p.x - p.r, y: p.y - p.r, w: p.r * 2, h: p.r * 2 };

      // Impacto con muros y muros rompibles
      const tileC = Math.floor(p.x / TILE);
      const tileR = Math.floor(p.y / TILE);
      const tileAtP = getTileAt(tileC, tileR);
      if (tileAtP === '?') {
        const key = `${currentRoomId}_${tileC}_${tileR}`;
        if (!brokenWalls[key]) {
          if (breakableWallHits[key] === undefined) breakableWallHits[key] = 3;
          breakableWallHits[key]--;
          const tileCenterX = tileC * TILE + TILE / 2;
          const tileCenterY = tileR * TILE + TILE / 2;
          if (breakableWallHits[key] <= 0) {
            brokenWalls[key] = true;
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
                x: tileCenterX, y: tileCenterY,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 4 - 1,
                life: 25 + Math.random() * 15,
                color: ['#4a3b5c', '#7209b7', '#adb5bd', '#332447'][Math.floor(Math.random() * 4)]
              });
            }
            for (let k = 0; k < 8; k++) {
              essenceOrbs.push({
                x: tileCenterX, y: tileCenterY,
                w: 5, h: 5,
                vx: (Math.random() - 0.5) * 4.5,
                vy: -Math.random() * 3.5 - 1.5,
                val: 5
              });
            }
            heartPickups.push({
              x: tileCenterX - 4, y: tileCenterY - 4,
              w: 8, h: 8,
              vx: (Math.random() - 0.5) * 2, vy: -3.2,
              heal: 35
            });
          } else {
            sfx('hit');
            triggerShake(5, 2);
            triggerHitStop(2);
            floatingTexts.push({
              text: `${breakableWallHits[key]} golpes restantes`,
              x: tileCenterX - 30, y: tileCenterY - 10,
              vy: -0.8,
              life: 25
            });
            spawnParticles(tileCenterX, tileCenterY, '#7209b7', 8);
          }
          projectiles.splice(i, 1);
          continue;
        }
      } else if (tileAtP === '#') {
        spawnParticles(p.x, p.y, '#ff0055', 4);
        projectiles.splice(i, 1);
        continue;
      }
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (aabb(pBox, e)) {
          if (e.type === 'armor' && (p.vx > 0 ? e.dir === -1 : e.dir === 1)) {
            // Escudo frontal de la armadura bloquea
            sfx('hit');
            spawnParticles(p.x, p.y, '#adb5bd', 6);
            hit = true;
            break;
          }

          const bestiaryMult = (typeof getBestiaryDamageMultiplier === 'function') ? getBestiaryDamageMultiplier(e.type) : 1;
          const finalSpellDmg = Math.round(p.dmg * bestiaryMult);
          e.hp -= finalSpellDmg;
          if (p.freeze) { e.freezeTimer = 100; spawnParticles(e.x + e.w / 2, e.y + 8, '#7de2ff', 8); }
          e.hurtTimer = 12;
          triggerShake(e.type === 'boss' ? 7 : 4, 2);
          triggerHitStop(e.type === 'boss' ? 4 : 2);
          spawnBloodParticles(e.x + e.w / 2, e.y + e.h / 2, p.vx > 0 ? 1 : -1, 8);
          
          // Empuje por impacto mágico a distancia
          const kbSpell = e.type === 'boss' ? 0.6 : (e.type === 'armor' ? 1.2 : 2.5);
          e.knockbackX = (p.vx > 0 ? 1 : -1) * kbSpell;
          if (e.type !== 'boss') e.vy = -1.4;

          sfx('hit');
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ff0055', 10);

          floatingTexts.push({
            text: `-${finalSpellDmg}${bestiaryMult > 1 ? ' ✦' : ''}`,
            x: e.x + e.w / 2 - 4,
            y: e.y - 6,
            vy: -1.3,
            life: 25,
            color: bestiaryMult > 1 ? '#ffbe0b' : '#ff007f'
          });

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
                x: e.x + e.w / 2, y: e.y + e.h / 2,
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
                x: e.x + e.w / 2 - 3, y: e.y + e.h / 2 - 3,
                w: 8, h: 8,
                vx: (Math.random() - 0.5) * 2, vy: -2.8,
                heal: 25
              });
            }
            if (e.type === 'boss') defeatBoss(e);
            enemies.splice(j, 1);
          }
          hit = true;
          break;
        }
      }
      if (hit) {
        projectiles.splice(i, 1);
        continue;
      }
    } else {
      // Proyectil enemigo hacia Alaric
      if (aabb(player, { x: p.x - p.r, y: p.y - p.r, w: p.r * 2, h: p.r * 2 })) {
        damagePlayer(15, p.x);
        projectiles.splice(i, 1);
      }
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
    if (pt.life <= 0) particles.splice(i, 1);
  }

  // Física e imán de Orbes de Esencia
  for (let i = essenceOrbs.length - 1; i >= 0; i--) {
    const o = essenceOrbs[i];
    o.vy = Math.min(o.vy + 0.22, 5);
    o.vx *= 0.96;

    // Imán hacia Alaric cuando está cerca
    const dx = (player.x + player.w / 2) - o.x;
    const dy = (player.y + player.h / 2) - o.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 65) {
      o.vx += (dx / dist) * 0.65;
      o.vy += (dy / dist) * 0.65;
    }

    moveWithCollisions(o);

    // Recolectar orbe al tocarlo
    if (aabb(player, o)) {
      player.essence += o.val;
      sfx('orb');
      spawnParticles(o.x, o.y, '#ff0055', 4);
      essenceOrbs.splice(i, 1);
    }
  }

  // Física y recolección de Corazones de Vida
  for (let i = heartPickups.length - 1; i >= 0; i--) {
    const h = heartPickups[i];
    h.vy = Math.min(h.vy + 0.2, 4.5);
    h.vx *= 0.95;

    // Imán hacia Alaric cuando está cerca y no tiene la vida al tope
    const dx = (player.x + player.w / 2) - h.x;
    const dy = (player.y + player.h / 2) - h.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 55) {
      h.vx += (dx / dist) * 0.55;
      h.vy += (dy / dist) * 0.55;
    }

    moveWithCollisions(h);

    if (aabb(player, h)) {
      const healedAmount = h.heal + player.healBonus;
      player.hp = Math.min(player.maxHp, player.hp + healedAmount);
      sfx('heart');
      floatingTexts.push({
        text: `+${healedAmount} HP`,
        x: player.x + player.w / 2 - 8,
        y: player.y - 6,
        vy: -1.0,
        life: 28,
        color: '#00f5d4'
      });
      spawnParticles(h.x + 4, h.y + 4, '#ff0055', 10);
      spawnParticles(h.x + 4, h.y + 4, '#00f5d4', 6);
      heartPickups.splice(i, 1);
    }
  }

  // Actualizar Textos Flotantes de Daño
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy;
    ft.life--;
    if (ft.life <= 0) floatingTexts.splice(i, 1);
  }

  // Actualizar Screen Shake
  if (screenShakeTimer > 0) screenShakeTimer--;
}