/**
 * ============================================================================
 * REAL FOOTBALL PHYSICS ENGINE
 * Floating bouncing ball inside viewport with draggable throw mechanics,
 * wall bouncing, goal post detection, and sticky scoreboard overlay.
 * ============================================================================
 */

class FootballPhysics {
    constructor() {
        this.canvas = document.getElementById('football-overlay-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Ball state
        this.ball = {
            x: 0, y: 0,
            vx: 2.8, vy: -3.2,
            radius: 22,
            mass: 1,
            spin: 0,          // angular velocity for rotation visual
            angle: 0,         // current rotation angle (degrees)
            dragging: false,
            dragOffsetX: 0,
            dragOffsetY: 0
        };

        // Physics constants
        this.gravity = 0.30;
        this.friction = 0.985;       // air resistance
        this.bounceDampen = 0.72;    // energy loss on bounce
        this.spinDecay = 0.97;

        // Drag tracking
        this.drag = {
            active: false,
            startX: 0, startY: 0,
            prevX: 0, prevY: 0,
            prevTime: 0,
            velX: 0, velY: 0
        };

        // Goal post (right side wall)
        this.goal = {
            side: 'right',      // wall the goal is on
            topY: 0,
            bottomY: 0,
            depth: 40,
            width: 12,
            postThickness: 10,
            scored: false,
            scoreFlashTimer: 0
        };

        // Score
        this.score = 0;
        this.scoreboardVisible = false;

        // Resize + spawn
        this.resize();
        this.setupListeners();
        this.startLoop();
    }

    /* ------------------------------------------------------------------
       Layout & Geometry
    ------------------------------------------------------------------ */
    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Place ball in centre on first resize
        if (this.ball.x === 0) {
            this.ball.x = this.canvas.width  / 2;
            this.ball.y = this.canvas.height / 2;
        }

        // Goal mouth: centre of right wall, 30% of screen height
        const goalHalfHeight = this.canvas.height * 0.15;
        const centreY = this.canvas.height / 2;
        this.goal.topY    = centreY - goalHalfHeight;
        this.goal.bottomY = centreY + goalHalfHeight;
        this.goal.x       = this.canvas.width - this.goal.depth;
    }

    /* ------------------------------------------------------------------
       Event Listeners
    ------------------------------------------------------------------ */
    setupListeners() {
        window.addEventListener('resize', () => this.resize());

        // --- Mouse ---
        this.canvas.addEventListener('mousedown', e => this.onPointerDown(e.clientX, e.clientY));
        window.addEventListener('mousemove',  e => this.onPointerMove(e.clientX, e.clientY));
        window.addEventListener('mouseup',    e => this.onPointerUp(e.clientX,   e.clientY));

        // --- Touch ---
        this.canvas.addEventListener('touchstart', e => {
            const t = e.touches[0];
            this.onPointerDown(t.clientX, t.clientY);
        }, { passive: true });
        this.canvas.addEventListener('touchmove', e => {
            const t = e.touches[0];
            this.onPointerMove(t.clientX, t.clientY);
            e.preventDefault();
        }, { passive: false });
        this.canvas.addEventListener('touchend', e => {
            const t = e.changedTouches[0];
            this.onPointerUp(t.clientX, t.clientY);
        });

        // ESC to close scoreboard
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.hideScoreboard();
        });

        // X button on scoreboard
        const closeBtn = document.getElementById('sb-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.hideScoreboard());
    }

    onPointerDown(cx, cy) {
        const dx = cx - this.ball.x;
        const dy = cy - this.ball.y;
        if (Math.sqrt(dx*dx + dy*dy) <= this.ball.radius * 1.6) {
            this.ball.dragging   = true;
            this.drag.active     = true;
            this.drag.startX     = cx;
            this.drag.startY     = cy;
            this.drag.prevX      = cx;
            this.drag.prevY      = cy;
            this.drag.prevTime   = performance.now();
            this.drag.velX       = 0;
            this.drag.velY       = 0;

            // Freeze ball while held
            this.ball.vx = 0;
            this.ball.vy = 0;
            this.ball.spin = 0;
            document.body.style.userSelect = 'none';
        }
    }

    onPointerMove(cx, cy) {
        if (!this.drag.active) return;
        const now = performance.now();
        const dt  = now - this.drag.prevTime || 16;

        // Track instantaneous velocity for throw
        this.drag.velX = (cx - this.drag.prevX) / dt * 16;
        this.drag.velY = (cy - this.drag.prevY) / dt * 16;

        this.drag.prevX    = cx;
        this.drag.prevY    = cy;
        this.drag.prevTime = now;

        this.ball.x = cx;
        this.ball.y = cy;
    }

    onPointerUp(cx, cy) {
        if (!this.drag.active) return;
        this.drag.active   = false;
        this.ball.dragging = false;
        document.body.style.userSelect = '';

        // Launch with finger velocity, capped for playability
        const maxSpeed = 28;
        let vx = this.drag.velX;
        let vy = this.drag.velY;
        const speed = Math.sqrt(vx*vx + vy*vy);
        if (speed > maxSpeed) {
            vx = (vx / speed) * maxSpeed;
            vy = (vy / speed) * maxSpeed;
        }
        this.ball.vx   = vx;
        this.ball.vy   = vy;
        this.ball.spin = vx * 0.25; // spin = horizontal velocity contribution
    }

    /* ------------------------------------------------------------------
       Physics Update
    ------------------------------------------------------------------ */
    update() {
        if (this.ball.dragging) return;

        const b  = this.ball;
        const W  = this.canvas.width;
        const H  = this.canvas.height;
        const R  = b.radius;

        // Gravity
        b.vy += this.gravity;

        // Air friction
        b.vx *= this.friction;
        b.vy *= this.friction;

        // Spin decay
        b.spin  *= this.spinDecay;
        b.angle += b.spin;

        // Move
        b.x += b.vx;
        b.y += b.vy;

        // --- Wall collisions ---

        // Left wall
        if (b.x - R < 0) {
            b.x  = R;
            b.vx = Math.abs(b.vx) * this.bounceDampen;
            b.spin = -b.spin * 0.5;
        }

        // Right wall  — but check goal mouth first
        if (b.x + R > W - this.goal.depth) {
            const inGoalMouth = b.y + R > this.goal.topY && b.y - R < this.goal.bottomY;

            if (inGoalMouth) {
                // Ball enters goal zone — score if passes the back wall
                if (b.x + R > W) {
                    b.x  = W - R;
                    b.vx = -Math.abs(b.vx) * this.bounceDampen; // bounce off back net
                    if (!this.goal.scored) {
                        this.goal.scored = true;
                        this.goal.scoreFlashTimer = 90;
                        this.score++;
                        this.showScoreboard();
                    }
                }
            } else {
                // Hit goalpost frame or side wall
                if (b.x + R > W - this.goal.depth) {
                    b.x  = W - this.goal.depth - R;
                    b.vx = -Math.abs(b.vx) * this.bounceDampen;
                    b.spin = -b.spin * 0.4;
                    this.goal.scored = false;
                }
            }
        }

        // Reset goal.scored when ball leaves goal area
        if (b.x + R < W - this.goal.depth - 5) {
            this.goal.scored = false;
        }

        // Top wall
        if (b.y - R < 0) {
            b.y  = R;
            b.vy = Math.abs(b.vy) * this.bounceDampen;
            b.spin *= 0.8;
        }

        // Bottom wall (floor)
        if (b.y + R > H) {
            b.y    = H - R;
            b.vy   = -Math.abs(b.vy) * this.bounceDampen;
            b.vx  *= 0.92; // ground friction
            b.spin *= 0.7;
            if (Math.abs(b.vy) < 0.8) b.vy = 0; // rest threshold
        }

        // Goal flash timer
        if (this.goal.scoreFlashTimer > 0) this.goal.scoreFlashTimer--;
    }

    /* ------------------------------------------------------------------
       Rendering
    ------------------------------------------------------------------ */
    draw() {
        const ctx = this.ctx;
        const b   = this.ball;
        const W   = this.canvas.width;
        const H   = this.canvas.height;

        ctx.clearRect(0, 0, W, H);

        this.drawGoalPost(ctx, W, H);
        this.drawBallShadow(ctx);
        this.drawBall(ctx);
    }

    drawBallShadow(ctx) {
        const b = this.ball;
        const H = this.canvas.height;
        // Shadow on the floor — scales with height above ground
        const distToFloor = H - b.y;
        const shadowAlpha = Math.max(0, 0.35 - distToFloor * 0.0006);
        const shadowScaleX = 1 + distToFloor * 0.002;
        const shadowScaleY = 0.25;
        const shadowY = H - 4;

        ctx.save();
        ctx.globalAlpha = shadowAlpha;
        ctx.scale(shadowScaleX, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.ellipse(b.x / shadowScaleX, shadowY, b.radius * 0.9, b.radius * shadowScaleY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBall(ctx) {
        const b = this.ball;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle * Math.PI / 180);

        // Outer glow / ambient light
        const glow = ctx.createRadialGradient(0, 0, b.radius * 0.5, 0, 0, b.radius * 1.5);
        glow.addColorStop(0, 'rgba(255,255,255,0.08)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Main ball body gradient (classic white/grey sphere)
        const ballGrad = ctx.createRadialGradient(-b.radius * 0.3, -b.radius * 0.35, b.radius * 0.05, 0, 0, b.radius);
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.45, '#f0f0f0');
        ballGrad.addColorStop(1, '#b0b0b0');
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // --- FIFA Classic Hexagon Panel Pattern ---
        ctx.save();
        ctx.clip();  // clip panels inside ball circle

        // Black pentagon patches (classic football 6-panel pattern)
        const patches = [
            { px:  0,              py:  0              },
            { px:  b.radius * 0.55, py: -b.radius * 0.55 },
            { px: -b.radius * 0.55, py: -b.radius * 0.55 },
            { px:  b.radius * 0.55, py:  b.radius * 0.55 },
            { px: -b.radius * 0.55, py:  b.radius * 0.55 },
        ];

        patches.forEach(p => {
            ctx.fillStyle = 'rgba(20,20,20,0.85)';
            ctx.beginPath();
            this.drawHexagon(ctx, p.px, p.py, b.radius * 0.38);
            ctx.fill();
            ctx.strokeStyle = 'rgba(50,50,50,0.6)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });
        ctx.restore();

        // Specular highlight
        const highlight = ctx.createRadialGradient(-b.radius * 0.32, -b.radius * 0.38, 0, -b.radius * 0.2, -b.radius * 0.25, b.radius * 0.5);
        highlight.addColorStop(0, 'rgba(255,255,255,0.9)');
        highlight.addColorStop(0.5, 'rgba(255,255,255,0.15)');
        highlight.addColorStop(1, 'transparent');
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball outline
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // Drag handle indicator when hovering (subtle ring)
        if (this.drag.active) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0,242,255,0.7)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    drawHexagon(ctx, cx, cy, r) {
        ctx.moveTo(cx + r, cy);
        for (let i = 1; i <= 6; i++) {
            const ang = (Math.PI / 3) * i;
            ctx.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
        }
        ctx.closePath();
    }

    drawGoalPost(ctx, W, H) {
        const g = this.goal;
        const postX = W - g.depth;
        const flash = g.scoreFlashTimer > 0;
        const netColor = flash ? 'rgba(0,255,80,0.35)' : 'rgba(255,255,255,0.06)';
        const postColor = flash ? '#00ff80' : '#e0e0e0';

        // Goal net background fill
        ctx.save();
        ctx.fillStyle = netColor;
        ctx.strokeStyle = 'transparent';
        ctx.beginPath();
        ctx.rect(postX, g.topY, g.depth, g.bottomY - g.topY);
        ctx.fill();

        // Draw net strings
        ctx.strokeStyle = flash ? 'rgba(0,255,80,0.2)' : 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 0.8;
        const netSpacing = 14;
        // Vertical net lines
        for (let nx = postX + netSpacing; nx < W; nx += netSpacing) {
            ctx.beginPath();
            ctx.moveTo(nx, g.topY);
            ctx.lineTo(nx, g.bottomY);
            ctx.stroke();
        }
        // Horizontal net lines
        for (let ny = g.topY + netSpacing; ny < g.bottomY; ny += netSpacing) {
            ctx.beginPath();
            ctx.moveTo(postX, ny);
            ctx.lineTo(W, ny);
            ctx.stroke();
        }
        ctx.restore();

        // Goal frame posts (metal look)
        ctx.save();
        ctx.strokeStyle = postColor;
        ctx.lineWidth = g.postThickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (flash) {
            ctx.shadowBlur = 18;
            ctx.shadowColor = '#00ff80';
        }

        // Top crossbar
        ctx.beginPath();
        ctx.moveTo(postX - 4, g.topY);
        ctx.lineTo(W, g.topY);
        ctx.stroke();

        // Bottom crossbar
        ctx.beginPath();
        ctx.moveTo(postX - 4, g.bottomY);
        ctx.lineTo(W, g.bottomY);
        ctx.stroke();

        // Near post (left vertical bar of goal mouth)
        ctx.beginPath();
        ctx.moveTo(postX, g.topY);
        ctx.lineTo(postX, g.bottomY);
        ctx.stroke();

        ctx.restore();

        // "GOAL" label above post
        ctx.save();
        ctx.font = 'bold 11px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = flash ? '#00ff80' : 'rgba(255,255,255,0.35)';
        ctx.fillText('GOAL', postX + g.depth / 2, g.topY - 12);
        ctx.restore();

        // Score flash GOAL! text
        if (flash) {
            const alpha = Math.min(1, this.goal.scoreFlashTimer / 20);
            const scale = 1 + (1 - this.goal.scoreFlashTimer / 90) * 0.5;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.font = `bold ${Math.round(52 * scale)}px "Space Grotesk", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#00ff80';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00ff80';
            ctx.fillText('GOAL! ⚽', postX + g.depth / 2, H / 2 - 40);
            ctx.restore();
        }
    }

    /* ------------------------------------------------------------------
       Scoreboard
    ------------------------------------------------------------------ */
    showScoreboard() {
        const sb = document.getElementById('football-scoreboard');
        if (!sb) return;
        document.getElementById('sb-score').textContent = this.score;
        sb.classList.add('sb-visible');
        this.scoreboardVisible = true;
    }

    hideScoreboard() {
        const sb = document.getElementById('football-scoreboard');
        if (!sb) return;
        sb.classList.remove('sb-visible');
        this.scoreboardVisible = false;
    }

    updateScoreDisplay() {
        if (this.scoreboardVisible) {
            const el = document.getElementById('sb-score');
            if (el) el.textContent = this.score;
        }
    }

    /* ------------------------------------------------------------------
       Main Loop
    ------------------------------------------------------------------ */
    startLoop() {
        const loop = () => {
            this.update();
            this.draw();
            this.updateScoreDisplay();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.footballGame = new FootballPhysics();
});
