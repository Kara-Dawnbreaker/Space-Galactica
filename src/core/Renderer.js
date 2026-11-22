export class Renderer {
  constructor(context) {
    this.ctx = context;
    this.stars = Array.from({ length: 95 }, (_, i) => ({
      x: ((i * 97.13) % 997) / 997, y: ((i * 53.71) % 991) / 991,
      size: i % 9 === 0 ? 2 : 1, phase: i * 0.7
    }));
  }

  draw(width, height, mode, player, state, enemies = [], projectiles = [], particles = [], pickups = []) {
    const ctx = this.ctx;
    const sea = mode === "sea";
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (sea) {
      gradient.addColorStop(0, "#062b3c"); gradient.addColorStop(0.55, "#071c32"); gradient.addColorStop(1, "#030c1c");
    } else {
      gradient.addColorStop(0, "#101b38"); gradient.addColorStop(0.55, "#080f25"); gradient.addColorStop(1, "#030711");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    this.drawBackdrop(width, height, sea);
    if (state !== "menu") {
      enemies.forEach((enemy) => this.drawEnemy(enemy, sea));
      pickups.forEach((pickup) => this.drawWeaponPickup(pickup));
      projectiles.forEach((projectile) => this.drawProjectile(projectile, sea));
      particles.forEach((particle) => this.drawParticle(particle, sea));
      this.drawPlayer(player, sea);
    }
    this.drawFrame(width, height, sea);
  }

  drawBackdrop(width, height, sea) {
    const ctx = this.ctx;
    ctx.save();
    if (sea) {
      for (let i = 0; i < 34; i++) {
        const x = ((i * 83) % 997) / 997 * width, y = ((i * 137) % 991) / 991 * height, r = 1 + i % 4;
        ctx.strokeStyle = `rgba(111,226,224,${0.12 + (i % 3) * 0.05})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = "rgba(1,8,22,.25)"; ctx.fillRect(0, height * 0.82, width, height * 0.18);
    } else {
      this.stars.forEach((star) => {
        ctx.globalAlpha = 0.35 + (Math.sin(performance.now() / 900 + star.phase) + 1) * 0.2;
        ctx.fillStyle = "#b8eaff"; ctx.fillRect(star.x * width, star.y * height, star.size, star.size);
      });
      ctx.globalAlpha = 1; ctx.strokeStyle = "rgba(107,140,210,.08)";
      ctx.beginPath(); ctx.arc(width * 0.78, height * 0.22, Math.min(width, height) * 0.12, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  drawPlayer(player, sea) {
    const ctx = this.ctx, accent = sea ? "#63ead7" : "#70ddff";
    if (player.invulnerableTimer > 0 && Math.floor(performance.now() / 90) % 2 === 0) return;
    ctx.save(); ctx.translate(player.x, player.y); ctx.shadowColor = accent; ctx.shadowBlur = 16;
    ctx.fillStyle = "#e9f7ff"; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(13, 12);
    ctx.lineTo(4, 8); ctx.lineTo(0, 13); ctx.lineTo(-4, 8); ctx.lineTo(-13, 12); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = accent; ctx.fillRect(-3, -3, 6, 10);
    ctx.fillStyle = sea ? "#1d9d9a" : "#2586c5"; ctx.fillRect(-3, 13, 6, 5); ctx.restore();
  }

  drawEnemy(enemy, sea) {
    const ctx = this.ctx;
    const palette = sea
      ? { drone: "#71d9c9", scout: "#b4f2e8", tank: "#e0a76e" }
      : { drone: "#f17b9a", scout: "#ffca78", tank: "#b48cff" };
    const color = palette[enemy.type] ?? palette.drone;
    ctx.save(); ctx.translate(enemy.x, enemy.y); ctx.shadowColor = color; ctx.shadowBlur = 10;
    ctx.fillStyle = color; ctx.beginPath();
    if (enemy.type === "tank") {
      ctx.moveTo(0, -enemy.radius); ctx.lineTo(enemy.radius, -5); ctx.lineTo(enemy.radius * 0.72, enemy.radius);
      ctx.lineTo(-enemy.radius * 0.72, enemy.radius); ctx.lineTo(-enemy.radius, -5);
    } else if (enemy.type === "scout") {
      ctx.moveTo(0, enemy.radius); ctx.lineTo(enemy.radius, -enemy.radius); ctx.lineTo(0, -enemy.radius * 0.45); ctx.lineTo(-enemy.radius, -enemy.radius);
    } else {
      ctx.moveTo(-enemy.radius, -enemy.radius * 0.55); ctx.lineTo(-enemy.radius * 0.45, -enemy.radius);
      ctx.lineTo(enemy.radius * 0.45, -enemy.radius); ctx.lineTo(enemy.radius, -enemy.radius * 0.55);
      ctx.lineTo(enemy.radius * 0.7, enemy.radius); ctx.lineTo(-enemy.radius * 0.7, enemy.radius);
    }
    ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    const barWidth = enemy.radius * 2;
    ctx.fillStyle = "#172235"; ctx.fillRect(-barWidth / 2, -enemy.radius - 8, barWidth, 3);
    ctx.fillStyle = color; ctx.fillRect(-barWidth / 2, -enemy.radius - 8, barWidth * (enemy.health / enemy.maxHealth), 3);
    ctx.restore();
  }

  drawProjectile(projectile, sea) {
    const ctx = this.ctx;
    const colors = { "heavy-bolt": "#ffb45e", "plasma-orb": "#bc8cff", "rail-shot": "#fff2a8", "singularity": "#df9cff", "solar-flare": "#ff9b5e", "piercer": "#9cf7ff" };
    ctx.save(); ctx.fillStyle = projectile.owner === "player" ? (colors[projectile.style] ?? (sea ? "#7effe9" : "#8cecff")) : "#ff8d9d";
    ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  drawWeaponPickup(pickup) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(pickup.x, pickup.y);
    ctx.rotate(pickup.age * 1.8);
    ctx.shadowColor = "#ffe27a";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ffe27a";
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(11, 0); ctx.lineTo(0, 12); ctx.lineTo(-11, 0);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#33250b";
    ctx.fillRect(-2, -6, 4, 12);
    ctx.restore();
  }

  drawParticle(particle, sea) {
    const ctx = this.ctx;
    ctx.save(); ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = sea ? "#8affdf" : "#9beaff"; ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4); ctx.restore();
  }

  drawFrame(width, height, sea) {
    const ctx = this.ctx; ctx.save();
    ctx.strokeStyle = sea ? "rgba(91,227,211,.13)" : "rgba(105,198,255,.13)";
    ctx.lineWidth = 1; ctx.strokeRect(8.5, 8.5, Math.max(0, width - 17), Math.max(0, height - 17)); ctx.restore();
  }
}
