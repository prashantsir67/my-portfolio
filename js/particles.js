/**
 * ============================================================================
 * HIGH-TECH INTERACTIVE CANVAS PARTICLE SYSTEM
 * Author: Prashant Joshi
 * Description: Interactive constellation particle field with cursor magnetism,
 *              dynamic color shifting based on theme, and responsive frame loops.
 * ============================================================================
 */

class InteractiveParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 80;
        this.connectionDistance = 120;
        
        // Mouse state tracking
        this.mouse = {
            x: null,
            y: null,
            radius: 180,
            active: false
        };

        // Theme colors
        this.colors = {
            dark: {
                particle: 'rgba(0, 242, 255, 0.4)',
                connection: 'rgba(0, 242, 255, 0.05)',
                glow: 'rgba(0, 242, 255, 0.1)',
                cursorRepel: 'rgba(255, 0, 127, 0.3)'
            },
            light: {
                particle: 'rgba(2, 132, 199, 0.4)',
                connection: 'rgba(2, 132, 199, 0.05)',
                glow: 'rgba(2, 132, 199, 0.1)',
                cursorRepel: 'rgba(219, 39, 119, 0.3)'
            }
        };

        this.currentColors = this.colors.dark;
        this.animationFrameId = null;

        this.init();
        this.setupEventListeners();
    }

    /**
     * Initialize sizing and spawn particles
     */
    init() {
        this.resize();
        this.updateThemeColors();
        this.spawnParticles();
    }

    /**
     * Handle viewport changes with high-DPI scaling
     */
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        // Adjust particle density based on screen real estate
        if (this.width < 768) {
            this.numParticles = 35;
            this.connectionDistance = 90;
        } else {
            this.numParticles = 90;
            this.connectionDistance = 140;
        }

        // Re-spawn particles if width significantly changed to fit layout
        if (this.particles.length > 0) {
            this.spawnParticles();
        }
    }

    /**
     * Get theme from document element
     */
    updateThemeColors() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.currentColors = this.colors[currentTheme] || this.colors.dark;
    }

    /**
     * Generate initial particle configuration
     */
    spawnParticles() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.3,
                baseAlpha: Math.random() * 0.5 + 0.3,
                // Cybernetic styling values
                pulseSpeed: 0.02 + Math.random() * 0.03,
                pulseVal: Math.random() * Math.PI
            });
        }
    }

    /**
     * Hook events
     */
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.mouse.active = false;
        });

        // Watch for theme switch updates via MutationObserver
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateThemeColors();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    /**
     * Update physics parameters
     */
    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off boundaries
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // Cybernetic breathing / pulsing effect
            p.pulseVal += p.pulseSpeed;
            p.alpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.15;

            // Cursor reaction (magnetic push/pull)
            if (this.mouse.active && this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    // Calculate direction vector
                    const force = (this.mouse.radius - dist) / this.mouse.radius; // 0 to 1 force scale
                    const repelX = (dx / dist) * force * 1.5;
                    const repelY = (dy / dist) * force * 1.5;

                    // Gently ease particles away
                    p.x += repelX;
                    p.y += repelY;
                }
            }
        }
    }

    /**
     * Draw constellation node paths
     */
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw connections first
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    // Fade line based on distance
                    const alpha = (1 - (dist / this.connectionDistance)) * 0.15;
                    this.ctx.strokeStyle = this.currentColors.connection.replace('0.05', alpha.toFixed(2));
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        // 2. Draw nodes on top
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Outer glow for key particles
            if (p.size > 2.2) {
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = this.currentColors.particle;
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fillStyle = this.currentColors.particle.replace('0.4', p.alpha.toFixed(2));
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw micro orbital details for tech look
            if (p.size > 2.5) {
                this.ctx.strokeStyle = this.currentColors.particle.replace('0.4', (p.alpha * 0.3).toFixed(2));
                this.ctx.lineWidth = 0.5;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        this.ctx.shadowBlur = 0; // Reset

        // 3. Highlight cursor interaction range subtly (tech overlay)
        if (this.mouse.active && this.mouse.x !== null && this.mouse.y !== null) {
            this.ctx.strokeStyle = this.currentColors.glow;
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([4, 6]);
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius * 0.4, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]); // Reset dash
        }
    }

    /**
     * Main engine loop
     */
    loop() {
        this.update();
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    /**
     * Terminate loop
     */
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Instantiate particles when DOM is fully prepared
document.addEventListener('DOMContentLoaded', () => {
    const bgParticles = new InteractiveParticleSystem('bg-canvas');
    bgParticles.loop();
});
