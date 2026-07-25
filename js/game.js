/**
 * ============================================================================
 * FIFA INTERACTIVE FOOTBALL PENALTY SHOOTOUT GAME
 * Author: Prashant Joshi | FIFA Special Edition
 * Description: Standalone canvas-based football game featuring goalie AI,
 *              ball physics, spin curling, targets, procedural particle systems,
 *              and synthetic audio using the Web Audio API.
 * ============================================================================
 */

class FifaShootoutGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        
        // Game State Engine
        this.states = {
            SETUP: 'setup',
            READY: 'ready',
            AIMING: 'aiming',
            FLYING: 'flying',
            GOAL: 'goal',
            SAVE: 'save',
            MISS: 'miss'
        };
        this.currentState = this.states.SETUP;

        // Statistics
        this.stats = {
            score: 0,
            streak: 0,
            shots: 0,
            goals: 0,
            saves: 0,
            accuracy: 0
        };
        this.highScore = parseInt(localStorage.getItem('pg_fifa_highscore') || '0');

        // Physics Constants
        this.gravity = 0.18;
        this.airResistance = 0.99;
        this.friction = 0.98;

        // Sound System
        this.audioCtx = null;
        this.soundEnabled = true;

        // Dimensions & Calibration
        this.baseWidth = 800;
        this.baseHeight = 450;
        this.scaleX = 1;
        this.scaleY = 1;

        // Entities
        this.ball = {
            x: 400,
            y: 380,
            z: 0, // Depth simulation (0 at penalty spot, 1 at goal line)
            baseRadius: 16,
            radius: 16,
            vx: 0,
            vy: 0,
            vz: 0,
            spin: 0, // Left/Right spin curl
            spinY: 0, // Top/Back spin
            isDragging: false,
            trail: []
        };

        this.goal = {
            x: 150,
            y: 80,
            width: 500,
            height: 200,
            depth: 80
        };

        // Goalkeeper
        this.keeper = {
            x: 400,
            y: 200,
            width: 60,
            height: 90,
            targetX: 400,
            speed: 4.5,
            state: 'center', // center, diving-left, diving-right, jump, recover
            diveTimer: 0,
            diveX: 0,
            diveY: 0
        };

        // Aiming Interaction Vectors
        this.touchStart = { x: 0, y: 0, time: 0 };
        this.touchEnd = { x: 0, y: 0, time: 0 };

        // Play field Targets (bonus points)
        this.targets = [];
        this.particles = [];

        // UI binds
        this.overlay = document.querySelector('.game-overlay-screen');
        this.startButton = document.querySelector('.btn-game-start');

        this.init();
    }

    /**
     * Start the game
     */
    init() {
        this.resize();
        this.spawnTargets();
        this.setupEventListeners();
        this.resetBall();
        this.updateStatsUI();

        // Draw static arena first
        this.drawArena();
    }

    /**
     * Set up UI controls
     */
    setupEventListeners() {
        // Drag/Swipe controls
        this.canvas.addEventListener('mousedown', (e) => this.handleDragStart(e.clientX, e.clientY));
        this.canvas.addEventListener('mousemove', (e) => this.handleDragMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', (e) => this.handleDragEnd(e.clientX, e.clientY));

        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.handleDragStart(touch.clientX, touch.clientY);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.handleDragMove(touch.clientX, touch.clientY);
            e.preventDefault();
        }, { passive: false });
        this.canvas.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            this.handleDragEnd(touch.clientX, touch.clientY);
        });

        // Start overlay trigger
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.initAudio();
                if (this.overlay) {
                    this.overlay.classList.add('hidden');
                }
                this.currentState = this.states.READY;
                this.playSynthSound('start');
                this.startGameLoop();
            });
        }

        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resize & Scale helper
     */
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        // Keep aspect ratio
        this.canvas.height = rect.width * (this.baseHeight / this.baseWidth);

        this.scaleX = this.canvas.width / this.baseWidth;
        this.scaleY = this.canvas.height / this.baseHeight;
    }

    /**
     * Web Audio API Synthesizer
     */
    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /**
     * Generates sounds synthetically
     */
    playSynthSound(type) {
        if (!this.audioCtx || !this.soundEnabled) return;

        // Resume if suspended by browser
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;

        try {
            switch (type) {
                case 'start': {
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(261.63, now); // C4
                    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.3); // C5
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start();
                    osc.stop(now + 0.3);
                    break;
                }
                case 'kick': {
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15); // Deep thud
                    gain.gain.setValueAtTime(0.4, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start();
                    osc.stop(now + 0.2);
                    break;
                }
                case 'post': {
                    const osc1 = this.audioCtx.createOscillator();
                    const osc2 = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc1.type = 'triangle';
                    osc1.frequency.setValueAtTime(800, now);
                    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.25);
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(1000, now);
                    osc2.frequency.setValueAtTime(600, now + 0.05);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc1.start();
                    osc2.start();
                    osc1.stop(now + 0.3);
                    osc2.stop(now + 0.3);
                    break;
                }
                case 'goal': {
                    // Cheering crowd synth + high chime
                    const noise = this.audioCtx.createBufferSource();
                    const osc = this.audioCtx.createOscillator();
                    const noiseGain = this.audioCtx.createGain();
                    const oscGain = this.audioCtx.createGain();

                    // Generate white noise buffer
                    const bufferSize = this.audioCtx.sampleRate * 1.5;
                    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    noise.buffer = buffer;

                    // Low-pass filter for crowd sound
                    const filter = this.audioCtx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(800, now);
                    filter.Q.setValueAtTime(1, now);

                    noiseGain.gain.setValueAtTime(0.25, now);
                    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(440, now); // A4
                    osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
                    osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
                    oscGain.gain.setValueAtTime(0.1, now);
                    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

                    noise.connect(filter);
                    filter.connect(noiseGain);
                    noiseGain.connect(this.audioCtx.destination);

                    osc.connect(oscGain);
                    oscGain.connect(this.audioCtx.destination);

                    noise.start();
                    osc.start();
                    noise.stop(now + 1.2);
                    osc.stop(now + 0.5);
                    break;
                }
                case 'save': {
                    // Dull thud + friction squeak
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start();
                    osc.stop(now + 0.25);
                    break;
                }
                case 'miss': {
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.linearRampToValueAtTime(100, now + 0.5);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start();
                    osc.stop(now + 0.5);
                    break;
                }
            }
        } catch (e) {
            console.error('Audio synthesizer error', e);
        }
    }

    /**
     * Spawn Targets inside goal mouth
     */
    spawnTargets() {
        this.targets = [
            { x: this.goal.x + 40, y: this.goal.y + 40, r: 24, score: 300, label: 'TOP CORNER' },
            { x: this.goal.x + this.goal.width - 40, y: this.goal.y + 40, r: 24, score: 300, label: 'TOP CORNER' },
            { x: this.goal.x + 60, y: this.goal.y + this.goal.height - 40, r: 28, score: 150, label: 'BOTTOM CORNER' },
            { x: this.goal.x + this.goal.width - 60, y: this.goal.y + this.goal.height - 40, r: 28, score: 150, label: 'BOTTOM CORNER' }
        ];
    }

    /**
     * Reset ball coordinates
     */
    resetBall() {
        this.ball.x = 400;
        this.ball.y = 380;
        this.ball.z = 0;
        this.ball.radius = this.ball.baseRadius;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.vz = 0;
        this.ball.spin = 0;
        this.ball.spinY = 0;
        this.ball.trail = [];

        this.keeper.x = 400;
        this.keeper.y = 200;
        this.keeper.targetX = 400;
        this.keeper.state = 'center';
        this.keeper.diveTimer = 0;

        if (this.currentState !== this.states.SETUP) {
            this.currentState = this.states.READY;
        }
    }

    /**
     * User clicks/touches ball
     */
    handleDragStart(clientX, clientY) {
        if (this.currentState !== this.states.READY) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (clientX - rect.left) / this.scaleX;
        const mouseY = (clientY - rect.top) / this.scaleY;

        // Check if cursor is over ball bounds
        const dx = mouseX - this.ball.x;
        const dy = mouseY - this.ball.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < this.ball.radius * 1.5) {
            this.ball.isDragging = true;
            this.touchStart.x = mouseX;
            this.touchStart.y = mouseY;
            this.touchStart.time = Date.now();
        }
    }

    /**
     * User drags/swipes
     */
    handleDragMove(clientX, clientY) {
        if (!this.ball.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (clientX - rect.left) / this.scaleX;
        const mouseY = (clientY - rect.top) / this.scaleY;

        // Visual drag line vector can be simulated here
        this.touchEnd.x = mouseX;
        this.touchEnd.y = mouseY;
    }

    /**
     * User releases mouse (Kicking mechanism)
     */
    handleDragEnd(clientX, clientY) {
        if (!this.ball.isDragging) return;
        this.ball.isDragging = false;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (clientX - rect.left) / this.scaleX;
        const mouseY = (clientY - rect.top) / this.scaleY;

        this.touchEnd.x = mouseX;
        this.touchEnd.y = mouseY;
        this.touchEnd.time = Date.now();

        const duration = this.touchEnd.time - this.touchStart.time;
        if (duration < 50) return; // Ignore micro clicks

        // Calculate kick direction vectors
        const dx = this.touchEnd.x - this.touchStart.x;
        const dy = this.touchEnd.y - this.touchStart.y;

        // Ensure shooting upward direction
        if (dy >= 0) {
            // Player swiped backwards or horizontally, not a forward kick
            return;
        }

        // Apply kick velocity
        // Scale vectors down into playable physics magnitudes
        const speedScale = 0.06;
        this.ball.vx = dx * speedScale;
        this.ball.vy = dy * speedScale;
        
        // Depth velocity (Z-index speed)
        // High speed swipe -> faster ball depth
        const swipeDistance = Math.sqrt(dx*dx + dy*dy);
        this.ball.vz = Math.max(0.015, swipeDistance * 0.00018);

        // Spin / curl calculation based on swipe curvature or exit angle
        // Curved swipes create horizontal spin vector
        this.ball.spin = -dx * 0.035; 
        this.ball.spinY = dy * 0.01;

        this.currentState = this.states.FLYING;
        this.stats.shots++;
        
        // Goalkeeper AI decides div direction
        this.makeGoalkeeperDecision();

        this.playSynthSound('kick');
        this.spawnKickParticles();
    }

    /**
     * Goalkeeper AI logic (determines diving response)
     */
    makeGoalkeeperDecision() {
        // Simple AI decision based on ball trajectory + random delay error
        const chance = Math.random();
        
        // Goalkeeper starts dive relative to ball trajectory
        // Estimate landing position
        const timeToGoal = 1.0 / this.ball.vz;
        const estimatedX = this.ball.x + (this.ball.vx * timeToGoal) + (0.5 * this.ball.spin * timeToGoal * timeToGoal);
        
        // Adjust speed depending on streak difficulty scaling
        const difficulty = Math.min(0.9, 0.45 + (this.stats.streak * 0.05));

        setTimeout(() => {
            if (this.currentState !== this.states.FLYING) return;

            if (chance < difficulty) {
                // Good dive, track estimation
                this.keeper.targetX = estimatedX;
                this.keeper.state = estimatedX < 400 ? 'diving-left' : 'diving-right';
            } else {
                // Div in random/wrong direction
                const diveError = (Math.random() - 0.5) * 400;
                this.keeper.targetX = 400 + diveError;
                this.keeper.state = this.keeper.targetX < 400 ? 'diving-left' : 'diving-right';
            }
        }, 150 + Math.random() * 100);
    }

    /**
     * Particles spawning: Kick impact
     */
    spawnKickParticles() {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: this.ball.x,
                y: this.ball.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                size: Math.random() * 4 + 2,
                color: 'rgba(255, 255, 255, 0.6)',
                life: 30,
                maxLife: 30
            });
        }
    }

    /**
     * Particles spawning: Goal confetti
     */
    spawnGoalParticles() {
        for (let i = 0; i < 60; i++) {
            const colors = ['#00f2ff', '#7000ff', '#ff007f', '#ffff00', '#00ff00'];
            this.particles.push({
                x: this.ball.x,
                y: this.ball.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 4,
                size: Math.random() * 5 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 60 + Math.random() * 40,
                maxLife: 100
            });
        }
    }

    /**
     * Game Frame Calculations
     */
    update() {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.currentState !== this.states.FLYING) return;

        // Move Goalkeeper towards target
        const keeperMoveSpeed = this.keeper.speed + (this.stats.streak * 0.3);
        if (this.keeper.state === 'diving-left' || this.keeper.state === 'diving-right') {
            const dx = this.keeper.targetX - this.keeper.x;
            this.keeper.x += dx * 0.12; // Diving ease
            
            // vertical dive jump arc
            this.keeper.y = 200 - Math.abs(dx * 0.18);
        }

        // Apply Spin Curving Forces
        this.ball.vx += this.ball.spin * 0.05;
        this.ball.vy += this.ball.spinY * 0.02 + this.gravity; // Gravity pulling it down

        // Move Ball coordinates
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        
        // Depth progression (Z advances from 0 to 1)
        this.ball.z += this.ball.vz;
        
        // Shrink ball size based on simulated perspective depth
        this.ball.radius = Math.max(6, this.ball.baseRadius * (1 - this.ball.z * 0.6));

        // Keep Trail
        this.ball.trail.push({ x: this.ball.x, y: this.ball.y, r: this.ball.radius });
        if (this.ball.trail.length > 12) this.ball.trail.shift();

        // Check if ball reaches goal mouth plane (Z >= 0.9)
        if (this.ball.z >= 0.9) {
            this.evaluateBallAtGoalLine();
        }
    }

    /**
     * Score and Hit Evaluation
     */
    evaluateBallAtGoalLine() {
        const bx = this.ball.x;
        const by = this.ball.y;

        // 1. Goalpost Collision bounds
        const postLeft = this.goal.x;
        const postRight = this.goal.x + this.goal.width;
        const crossbar = this.goal.y;

        // Hit post left?
        if (Math.abs(bx - postLeft) < 15 && by > crossbar - 10 && by < crossbar + this.goal.height) {
            this.bounceOffPost('left');
            return;
        }

        // Hit post right?
        if (Math.abs(bx - postRight) < 15 && by > crossbar - 10 && by < crossbar + this.goal.height) {
            this.bounceOffPost('right');
            return;
        }

        // Hit crossbar?
        if (Math.abs(by - crossbar) < 15 && bx > postLeft - 10 && bx < postRight + 10) {
            this.bounceOffPost('crossbar');
            return;
        }

        // 2. Goalkeeper Save bounds
        const kx = this.keeper.x;
        const ky = this.keeper.y;
        
        // Goalkeeper reach box
        const saveWidth = 75;
        const saveHeight = 95;
        if (bx > kx - saveWidth && bx < kx + saveWidth && by > ky - saveHeight && by < ky + saveHeight) {
            this.triggerSave();
            return;
        }

        // 3. Goal mouth range validation
        if (bx > postLeft && bx < postRight && by > crossbar && by < crossbar + this.goal.height) {
            // Check Target Hits
            let hitTarget = null;
            for (let t of this.targets) {
                const dx = bx - t.x;
                const dy = by - t.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < t.r + this.ball.radius) {
                    hitTarget = t;
                    break;
                }
            }

            this.triggerGoal(hitTarget);
        } else {
            // Missed outside goal box
            this.triggerMiss();
        }
    }

    /**
     * Collision behavior
     */
    bounceOffPost(postType) {
        this.currentState = this.states.MISS;
        this.playSynthSound('post');
        
        // Reflect physics velocity vectors
        if (postType === 'left') {
            this.ball.vx = -Math.abs(this.ball.vx) * 0.6;
        } else if (postType === 'right') {
            this.ball.vx = Math.abs(this.ball.vx) * 0.6;
        } else {
            // Crossbar
            this.ball.vy = Math.abs(this.ball.vy) * 0.6;
        }
        
        this.ball.vz = -this.ball.vz * 0.3; // reflect out slightly

        // Spawn post hit spark particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.ball.x,
                y: this.ball.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: Math.random() * 3 + 1,
                color: '#ffffff',
                life: 20
            });
        }

        setTimeout(() => this.resetBall(), 1800);
    }

    /**
     * Goal scored!
     */
    triggerGoal(targetHit) {
        this.currentState = this.states.GOAL;
        this.stats.goals++;
        this.stats.streak++;
        
        let scoreAward = 100;
        let msg = "GOAL!";
        
        if (targetHit) {
            scoreAward += targetHit.score;
            msg = `🎯 ${targetHit.label} (+${targetHit.score})!`;
            // Flash target glow
            this.spawnGoalParticles();
        }

        // Streak multipliers
        if (this.stats.streak > 1) {
            scoreAward *= this.stats.streak;
            msg += ` STREAK x${this.stats.streak}!`;
        }

        this.stats.score += scoreAward;
        
        if (this.stats.score > this.highScore) {
            this.highScore = this.stats.score;
            localStorage.setItem('pg_fifa_highscore', this.highScore);
        }

        this.playSynthSound('goal');
        this.spawnGoalParticles();
        this.updateStatsUI();

        // Print custom notification to user
        this.showInGameNotification(msg, 'success');

        setTimeout(() => this.resetBall(), 2200);
    }

    /**
     * Goalkeeper blocked the shot
     */
    triggerSave() {
        this.currentState = this.states.SAVE;
        this.stats.saves++;
        this.stats.streak = 0; // Break streak

        // Deflect ball physics
        this.ball.vx = (Math.random() - 0.5) * 3;
        this.ball.vy = -Math.abs(this.ball.vy) * 0.4;
        this.ball.vz = -this.ball.vz * 0.2;

        this.playSynthSound('save');
        this.updateStatsUI();
        this.showInGameNotification("SAVED BY THE KEEPER!", 'warning');

        setTimeout(() => this.resetBall(), 2000);
    }

    /**
     * Ball missed goal posts
     */
    triggerMiss() {
        this.currentState = this.states.MISS;
        this.stats.streak = 0; // Break streak

        this.playSynthSound('miss');
        this.updateStatsUI();
        this.showInGameNotification("SHOT WIDE!", 'error');

        setTimeout(() => this.resetBall(), 2000);
    }

    /**
     * Display game notifications on canvas overlays
     */
    showInGameNotification(text, type) {
        // Simply log it in console terminal or visual display inside sidebars
        const notifyEl = document.getElementById('fifa-game-notify');
        if (notifyEl) {
            notifyEl.textContent = text;
            notifyEl.className = `game-stat-number ${type}`;
            setTimeout(() => {
                if (notifyEl.textContent === text) {
                    notifyEl.textContent = '---';
                    notifyEl.className = 'game-stat-number';
                }
            }, 2000);
        }
    }

    /**
     * Refresh scoreboard numbers in DOM HTML
     */
    updateStatsUI() {
        // Calc Accuracy
        if (this.stats.shots > 0) {
            this.stats.accuracy = Math.round((this.stats.goals / this.stats.shots) * 100);
        }

        const scoreEl = document.getElementById('fifa-score');
        const streakEl = document.getElementById('fifa-streak');
        const shotsEl = document.getElementById('fifa-shots');
        const accuracyEl = document.getElementById('fifa-accuracy');
        const highscoreEl = document.getElementById('fifa-highscore');

        if (scoreEl) scoreEl.textContent = this.stats.score;
        if (streakEl) streakEl.textContent = this.stats.streak;
        if (shotsEl) shotsEl.textContent = `${this.stats.goals}/${this.stats.shots}`;
        if (accuracyEl) accuracyEl.textContent = `${this.stats.accuracy}%`;
        if (highscoreEl) highscoreEl.textContent = this.highScore;
    }

    /**
     * Draw pitch lines, net background meshes, goalposts
     */
    drawArena() {
        const ctx = this.ctx;
        const w = this.canvas.width / this.scaleX;
        const h = this.canvas.height / this.scaleY;

        // 1. Draw Field Green Turf (with gradient grass lanes)
        const turfGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
        turfGrad.addColorStop(0, '#103e1e');
        turfGrad.addColorStop(0.3, '#145c28');
        turfGrad.addColorStop(1, '#1b7d34');
        ctx.fillStyle = turfGrad;
        ctx.fillRect(0, 0, w, h);

        // Sky / Stadium backdrop
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        skyGrad.addColorStop(0, '#02000a');
        skyGrad.addColorStop(1, '#0e2316');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Stadium Stands light glow
        ctx.fillStyle = 'rgba(0, 242, 255, 0.04)';
        ctx.beginPath();
        ctx.arc(w/2, 0, 250, 0, Math.PI * 2);
        ctx.fill();

        // 2. Pitch lines (Penalty Box arcs)
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 3;
        
        // Horizon line
        ctx.beginPath();
        ctx.moveTo(0, h * 0.4);
        ctx.lineTo(w, h * 0.4);
        ctx.stroke();

        // Goal box outer area
        ctx.beginPath();
        ctx.moveTo(100, h * 0.4);
        ctx.lineTo(80, h * 0.95);
        ctx.lineTo(720, h * 0.95);
        ctx.lineTo(700, h * 0.4);
        ctx.stroke();

        // Penalty spot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(400, 380, 5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Goalmouth Net details
        const gx = this.goal.x;
        const gy = this.goal.y;
        const gw = this.goal.width;
        const gh = this.goal.height;
        const gd = this.goal.depth;

        // Draw Net Depth box
        ctx.fillStyle = 'rgba(10, 25, 15, 0.65)';
        ctx.fillRect(gx, gy, gw, gh);

        // Draw Net lines mesh
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        
        // Vertical net strings
        for (let x = gx + 10; x < gx + gw; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, gy);
            ctx.lineTo(x + (x - 400) * 0.05, gy + gh);
            ctx.stroke();
        }
        // Horizontal net strings
        for (let y = gy + 10; y < gy + gh; y += 15) {
            ctx.beginPath();
            ctx.moveTo(gx, y);
            ctx.lineTo(gx + gw, y);
            ctx.stroke();
        }

        // Draw goalposts posts frame (Metallic silver/white cylinders)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.moveTo(gx, gy + gh);
        ctx.lineTo(gx, gy);
        ctx.lineTo(gx + gw, gy);
        ctx.lineTo(gx + gw, gy + gh);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset

        // 4. Draw Score Targets inside goal
        if (this.currentState === this.states.READY || this.currentState === this.states.AIMING) {
            this.targets.forEach(t => {
                // Outer ring
                ctx.strokeStyle = 'rgba(255, 0, 127, 0.6)';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);

                // Inner yellow core
                ctx.fillStyle = 'rgba(255, 242, 0, 0.4)';
                ctx.beginPath();
                ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
                ctx.fill();

                // Target Score label
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.font = '8px var(--font-heading)';
                ctx.textAlign = 'center';
                ctx.fillText(`+${t.score}`, t.x, t.y - t.r - 4);
            });
        }
    }

    /**
     * Draw Goalkeeper Sprite representation
     */
    drawGoalkeeper() {
        const ctx = this.ctx;
        const kx = this.keeper.x;
        const ky = this.keeper.y;
        const kw = this.keeper.width;
        const kh = this.keeper.height;

        ctx.save();

        // Add subtle shadow beneath keeper
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(kx, 280, 25 + Math.abs(200 - ky) * 0.15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Goalkeeper styling (futuristic jersey look)
        // Draw head
        ctx.fillStyle = '#ffdbac'; // Skin
        ctx.beginPath();
        ctx.arc(kx, ky - 35, 10, 0, Math.PI * 2);
        ctx.fill();

        // Hair / Helmet
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(kx, ky - 37, 10, Math.PI, Math.PI * 2);
        ctx.fill();

        // Jersey Torso (cyan & violet details)
        const jerseyGrad = ctx.createLinearGradient(kx - 15, ky, kx + 15, ky);
        jerseyGrad.addColorStop(0, '#7000ff');
        jerseyGrad.addColorStop(1, '#ff007f');
        ctx.fillStyle = jerseyGrad;
        ctx.beginPath();
        ctx.moveTo(kx - 15, ky - 25);
        ctx.lineTo(kx + 15, ky - 25);
        ctx.lineTo(kx + 20, ky + 15);
        ctx.lineTo(kx - 20, ky + 15);
        ctx.closePath();
        ctx.fill();

        // Diver position arms/legs adjustment
        if (this.keeper.state === 'diving-left') {
            // Left arm outstretched
            ctx.strokeStyle = '#ffdbac';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(kx - 15, ky - 20);
            ctx.lineTo(kx - 45, ky - 35);
            ctx.stroke();

            // Right arm back
            ctx.beginPath();
            ctx.moveTo(kx + 15, ky - 20);
            ctx.lineTo(kx + 30, ky - 5);
            ctx.stroke();

            // Gloves (Glowing green)
            ctx.fillStyle = '#00ff66';
            ctx.beginPath();
            ctx.arc(kx - 45, ky - 35, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.keeper.state === 'diving-right') {
            // Right arm outstretched
            ctx.strokeStyle = '#ffdbac';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(kx + 15, ky - 20);
            ctx.lineTo(kx + 45, ky - 35);
            ctx.stroke();

            // Left arm back
            ctx.beginPath();
            ctx.moveTo(kx - 15, ky - 20);
            ctx.lineTo(kx - 30, ky - 5);
            ctx.stroke();

            // Gloves
            ctx.fillStyle = '#00ff66';
            ctx.beginPath();
            ctx.arc(kx + 45, ky - 35, 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Default center posture (Goalie stance)
            // Left arm bent
            ctx.strokeStyle = '#ffdbac';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(kx - 15, ky - 20);
            ctx.lineTo(kx - 30, ky - 10);
            ctx.stroke();

            // Right arm bent
            ctx.beginPath();
            ctx.moveTo(kx + 15, ky - 20);
            ctx.lineTo(kx + 30, ky - 10);
            ctx.stroke();

            // Gloves
            ctx.fillStyle = '#00ff66';
            ctx.beginPath();
            ctx.arc(kx - 30, ky - 10, 5, 0, Math.PI * 2);
            ctx.arc(kx + 30, ky - 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    /**
     * Draw Football sphere
     */
    drawBall() {
        const ctx = this.ctx;
        const bx = this.ball.x;
        const by = this.ball.y;
        const br = this.ball.radius;

        // 1. Draw Flight Trail
        if (this.ball.trail.length > 0) {
            ctx.save();
            for (let i = 0; i < this.ball.trail.length; i++) {
                const step = this.ball.trail[i];
                const opacity = (i / this.ball.trail.length) * 0.15;
                ctx.fillStyle = `rgba(0, 242, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(step.x, step.y, step.r * 0.95, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 2. Draw Ball Shadow relative to Z altitude
        ctx.save();
        const groundY = 380 - (380 - by) * 0.2; // project shadow onto floor
        const shadowScale = Math.max(0.2, 1 - (380 - by) * 0.005);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(bx, groundY, br * shadowScale, br * 0.35 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Draw FIFA ball details
        ctx.save();
        
        // Sphere outer base
        const sphereGrad = ctx.createRadialGradient(bx - br*0.3, by - br*0.3, br*0.1, bx, by, br);
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.7, '#e2e8f0');
        sphereGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI*2);
        ctx.fill();

        // Draw Soccer panel stripes (cyber football design)
        ctx.strokeStyle = '#02000a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Dynamic arcs representing panels revolving with spin
        const spinOffset = (Date.now() * 0.008 * this.ball.spin) % br;
        ctx.arc(bx + spinOffset, by, br * 0.9, 0, Math.PI*2);
        ctx.stroke();

        // Glowing tech core ring
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00f2ff';
        ctx.beginPath();
        ctx.arc(bx, by, br * 0.5, 0, Math.PI*2);
        ctx.stroke();

        ctx.restore();

        // 4. Draw drag trajectory guide (dotted pointer line)
        if (this.ball.isDragging) {
            ctx.strokeStyle = 'rgba(0, 242, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(this.touchStart.x, this.touchStart.y);
            ctx.lineTo(this.touchEnd.x, this.touchEnd.y);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Aim cursor target
            ctx.strokeStyle = '#ff007f';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(this.touchEnd.x, this.touchEnd.y, 10, 0, Math.PI*2);
            ctx.stroke();
        }
    }

    /**
     * Draw particle elements
     */
    drawParticles() {
        const ctx = this.ctx;
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Main Renderer Loop
     */
    render() {
        // Redraw pitch structure
        this.drawArena();

        // Draw particles
        this.drawParticles();

        // Draw Goalkeeper
        this.drawGoalkeeper();

        // Draw ball
        this.drawBall();
    }

    /**
     * Game Frame loop runner
     */
    startGameLoop() {
        const loop = () => {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

// Bind FIFA game to canvas on DOM complete
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new FifaShootoutGame('football-game-canvas');
});
