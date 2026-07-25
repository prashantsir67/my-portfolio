/**
 * ============================================================================
 * HIGH-TECH INTERACTIVE PORTFOLIO ENGINE
 * Author: Prashant Joshi
 * Features: Live Nest Nepal Internship counter, interactive CLI terminal,
 *           SEO Audit calculator, bento tilt physics, and page scroll trackers.
 * ============================================================================
 */

class HighTechPortfolio {
    constructor() {
        // Date coordinates
        this.internshipStartDate = new Date("2026-05-10T09:00:00+05:45"); // Nepal Time Zone 10 May 2026
        
        // Terminal state
        this.terminalLines = [];
        this.terminalCommandHistory = [];
        this.historyIndex = -1;
        
        // Elements cache
        this.themeBtn = document.getElementById('theme-toggle-btn');
        this.terminalInput = document.getElementById('terminal-input');
        this.terminalBody = document.getElementById('terminal-body');
        
        this.init();
    }

    /**
     * Start engines
     */
    init() {
        this.setupInternshipCounter();
        this.setupInteractiveTerminal();
        this.setupSeoAuditTool();
        this.setupBentoTilts();
        this.setupScrollIndicators();
        this.setupInteractiveCursor();
        this.setupRevealObserver();
    }

    /**
     * 1. Real-time Nest Nepal Internship duration counter
     */
    setupInternshipCounter() {
        const yearsEl = document.getElementById('internship-years');
        const monthsEl = document.getElementById('internship-months');
        const daysEl = document.getElementById('internship-days');
        const hoursEl = document.getElementById('internship-hours');
        const minutesEl = document.getElementById('internship-minutes');
        const secondsEl = document.getElementById('internship-seconds');
        const progressBarEl = document.getElementById('internship-progress-bar');
        const textCountEl = document.getElementById('internship-live-counter-text');

        if (!daysEl) return;

        const updateTimer = () => {
            const now = new Date();
            const difference = now.getTime() - this.internshipStartDate.getTime();

            if (difference < 0) {
                // If the clock is in the past relative to the start date
                if (textCountEl) textCountEl.textContent = "Internship starting soon...";
                return;
            }

            // Calculations
            const totalSeconds = Math.floor(difference / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const totalDays = Math.floor(totalHours / 24);

            // Compute calendar units
            let years = now.getFullYear() - this.internshipStartDate.getFullYear();
            let months = now.getMonth() - this.internshipStartDate.getMonth();
            let days = now.getDate() - this.internshipStartDate.getDate();

            if (days < 0) {
                months--;
                // borrow days from previous month
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            const hrs = totalHours % 24;
            const mins = totalMinutes % 60;
            const secs = totalSeconds % 60;

            // Update DOM
            if (yearsEl) yearsEl.textContent = String(years).padStart(2, '0');
            if (monthsEl) monthsEl.textContent = String(months).padStart(2, '0');
            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hrs).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(mins).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(secs).padStart(2, '0');

            // Set progress bar relative to a 6-month internship timeline (180 days approx)
            const durationTarget = 180; // days
            const currentProgressPercent = Math.min(100, (totalDays / durationTarget) * 100);
            if (progressBarEl) {
                progressBarEl.style.width = `${currentProgressPercent.toFixed(2)}%`;
            }

            if (textCountEl) {
                textCountEl.textContent = `${totalDays} Days, ${hrs}h ${mins}m ${secs}s total of SEO Optimization.`;
            }
        };

        // Run instantly
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    /**
     * 2. Interactive Retro Cyber Command Line Terminal
     */
    setupInteractiveTerminal() {
        if (!this.terminalInput) return;

        // Command definitions
        const commands = {
            help: () => `AVAILABLE COMMANDS:
  help        - Display all functional commands
  about       - Details about Prashant Joshi
  internship  - Exact time logged at Nest Nepal
  seo         - Execute quick technical SEO brief
  skills      - View full programming & tools toolkit
  game        - Focus viewport onto the FIFA Penalty Shootout Game
  clear       - Clear output log history
  gsc         - Fetch mock Google Search Console reports
  neoblocks   - Run system kernel code rain`,
            
            about: () => `Prashant Joshi
--------------
Role: SEO Architect & Full-Stack Developer
Education: BCA (Bachelor of Computer Applications) @ Patan Multiple Campus
Location: Kathmandu, Nepal
Status: Currently working as an SEO Intern at Nest Nepal.
Goal: To bridge the gap between high-performance systems and organic revenue.`,
            
            internship: () => {
                const now = new Date();
                const difference = now.getTime() - this.internshipStartDate.getTime();
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                return `ROLE: SEO Intern
COMPANY: Nest Nepal (Leading Web Hosting Provider in Nepal)
START DATE: 10th May 2026
ELAPSED TIME: ${days} days
CORE DUTIES: Technical audits, on-page optimization, content strategizing, Core Web Vitals audit, and backlink networking.`;
            },

            seo: () => `SEO TOOLKIT SUMMARY:
- Technical SEO (Robots, XML, Canonical tags)
- Speed Performance tuning (LCP, FID, CLS scores)
- Strategic Content Architecture & NLP entities
- Modern tools: GSC, GA4, Semrush, Ahrefs, Screaming Frog`,

            skills: () => `CORE TECHNICAL ARSENAL:
- Languages: PHP, JavaScript, SQL, HTML5, CSS3, JSON
- Platforms: WordPress, Next.js, Laravel (PHP)
- Analytics: Google Search Console, Google Analytics 4, Tag Manager
- Database: MySQL, PostgreSQL, SQLite`,

            game: () => {
                const gameSec = document.getElementById('game-section');
                if (gameSec) {
                    gameSec.scrollIntoView({ behavior: 'smooth' });
                    return `REDIRECTING to FIFA Penalty shootout arena...`;
                }
                return `FIFA game section could not be found.`;
            },

            clear: () => {
                this.terminalLines = [];
                const logContainer = document.getElementById('terminal-history');
                if (logContainer) logContainer.innerHTML = '';
                return '';
            },

            gsc: () => {
                const impressions = Math.floor(4000 + Math.random() * 850);
                const ctr = (3.2 + Math.random() * 0.9).toFixed(1);
                return `GSC LIVE REPORT MOCK (Kathmandu region):
-------------------------------------------
Impressions: +${impressions} (Last 28 days)
CTR Average: ${ctr}% (+14% increase)
Top Keywords Ranked:
  1. [seo services nepal]         - Pos: #3
  2. [nest nepal web hosting]     - Pos: #1
  3. [technical seo architect]    - Pos: #7`;
            },

            neoblocks: () => {
                this.runMatrixRainCode();
                return `Booting neoblocks kernel rain...`;
            }
        };

        // Setup Event Listener
        this.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const inputVal = this.terminalInput.value.trim();
                this.terminalInput.value = '';

                if (inputVal === '') return;

                // Log user input command
                this.writeTerminalLine(inputVal, 'user');
                this.terminalCommandHistory.push(inputVal);
                this.historyIndex = this.terminalCommandHistory.length;

                // Process command
                const parts = inputVal.toLowerCase().split(' ');
                const cmd = parts[0];

                let response = '';
                if (commands[cmd]) {
                    response = commands[cmd]();
                } else {
                    response = `Command not recognized: "${cmd}". Type "help" for a list of valid commands.`;
                }

                if (response !== '') {
                    this.writeTerminalLine(response, 'system');
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.terminalInput.value = this.terminalCommandHistory[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.terminalCommandHistory.length - 1) {
                    this.historyIndex++;
                    this.terminalInput.value = this.terminalCommandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.terminalCommandHistory.length;
                    this.terminalInput.value = '';
                }
            }
        });
    }

    /**
     * Print lines to terminal DOM
     */
    writeTerminalLine(text, sender) {
        const logContainer = document.getElementById('terminal-history');
        if (!logContainer) return;

        const line = document.createElement('div');
        
        if (sender === 'user') {
            line.innerHTML = `<span class="terminal-prompt">$</span> <span class="user-typed">${text}</span>`;
        } else {
            line.className = 'terminal-log-output';
            // preserve white space
            line.style.whiteSpace = 'pre-wrap';
            
            // Highlight specific words
            let highlighted = text
                .replace(/(GOAL|SUCCESS|ACTIVE|ONLINE)/g, '<span class="terminal-log-success">$1</span>')
                .replace(/(WARNING|PENDING)/g, '<span class="terminal-log-warning">$1</span>')
                .replace(/(ERROR|OFFLINE)/g, '<span class="terminal-log-error">$1</span>');
                
            line.innerHTML = highlighted;
        }

        logContainer.appendChild(line);

        // Keep scroll at bottom
        if (this.terminalBody) {
            this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
        }
    }

    /**
     * Matrix Code Rain Effect inside Terminal
     */
    runMatrixRainCode() {
        let count = 0;
        const interval = setInterval(() => {
            const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@&";
            let randomLine = "";
            for (let i = 0; i < 45; i++) {
                randomLine += chars[Math.floor(Math.random() * chars.length)] + " ";
            }
            this.writeTerminalLine(randomLine, 'system');
            count++;
            if (count > 25) {
                clearInterval(interval);
                this.writeTerminalLine("SYSTEM KERNEL STABILIZED.", 'success');
            }
        }, 80);
    }

    /**
     * 3. High-Tech Interactive SEO Keyword & Speed Analyzer Tool
     */
    setupSeoAuditTool() {
        const auditBtn = document.getElementById('btn-seo-audit');
        const urlInput = document.getElementById('seo-url-input');
        const keywordInput = document.getElementById('seo-keyword-input');
        const resultsBox = document.getElementById('seo-audit-results');

        if (!auditBtn) return;

        auditBtn.addEventListener('click', () => {
            const urlVal = urlInput.value.trim();
            const keywordVal = keywordInput.value.trim();

            if (urlVal === '') {
                alert('Please enter a website URL to scan.');
                return;
            }

            auditBtn.textContent = 'SCANNING SITE ARCS...';
            auditBtn.disabled = true;

            // Simulated dynamic audit reports based on input URL length/keywords
            setTimeout(() => {
                // Generate metrics
                const scoreSpeed = Math.floor(75 + Math.random() * 24);
                const scoreOnpage = Math.floor(80 + Math.random() * 19);
                const scoreMobile = Math.floor(85 + Math.random() * 15);
                const scoreSchema = Math.random() > 0.4 ? 'A+' : 'B';
                const loadTime = (0.5 + Math.random() * 1.8).toFixed(2);
                const totalCrawled = Math.floor(100 + Math.random() * 800);

                // Populate DOM results
                document.getElementById('res-speed').textContent = `${scoreSpeed}/100`;
                document.getElementById('res-speed').className = `result-value ${scoreSpeed >= 90 ? 'high-score' : 'low-score'}`;
                
                document.getElementById('res-onpage').textContent = `${scoreOnpage}/100`;
                document.getElementById('res-onpage').className = `result-value ${scoreOnpage >= 90 ? 'high-score' : 'low-score'}`;

                document.getElementById('res-mobile').textContent = `${scoreMobile}/100`;
                
                document.getElementById('res-loadtime').textContent = `${loadTime}s`;
                document.getElementById('res-loadtime').className = `result-value ${loadTime <= 1.2 ? 'high-score' : 'low-score'}`;

                document.getElementById('res-schema').textContent = scoreSchema;
                document.getElementById('res-schema').className = `result-value ${scoreSchema === 'A+' ? 'high-score' : ''}`;

                document.getElementById('res-pages').textContent = totalCrawled;

                // Open panel
                if (resultsBox) {
                    resultsBox.classList.add('active');
                }

                auditBtn.textContent = 'LAUNCH FULL AUDIT';
                auditBtn.disabled = false;
            }, 1500);
        });
    }

    /**
     * 4. Bento Card Mouse-move glow follow (no 3D tilt — prevents text hiding)
     */
    setupBentoTilts() {
        const bentoCards = document.querySelectorAll('.bento-card, .seo-card-tool, .cyber-form');

        bentoCards.forEach(card => {
            // Inject glow follower element if not present
            let glow = card.querySelector('.card-glow');
            if (!glow) {
                glow = document.createElement('div');
                glow.className = 'card-glow';
                card.appendChild(glow);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move glow to cursor position inside card
                glow.style.left = `${x}px`;
                glow.style.top  = `${y}px`;
            });

            // No 3D rotation — only CSS translateY(-6px) on :hover handles the lift
        });
    }


    /**
     * 5. Active link scroll tracker & Progress bar
     */
    setupScrollIndicators() {
        const navbar = document.getElementById('navbar');
        const scrollProgress = document.getElementById('scroll-progress-bar');
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.nav-links a:not(.btn-hire)');

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY || document.documentElement.scrollTop;
            
            // Update glass navbar style
            if (navbar) {
                if (scrollPos > 40) {
                    navbar.classList.add('nav-scrolled');
                } else {
                    navbar.classList.remove('nav-scrolled');
                }
            }

            // Update page top progress tracker
            if (scrollProgress) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const percent = (scrollPos / height) * 100;
                scrollProgress.style.width = `${percent}%`;
            }

            // Track active section to color nav links
            sections.forEach(sec => {
                const top = sec.offsetTop - 140;
                const height = sec.offsetHeight;
                const id = sec.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    /**
     * 6. Smooth Custom Interactive Cursor Actions
     */
    setupInteractiveCursor() {
        const cursor = document.getElementById('custom-cursor');
        const ring = document.getElementById('custom-cursor-ring');
        const glow = document.getElementById('custom-cursor-glow');

        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Direct snap cursor dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
            
            // Direct snap cursor ambient glow
            if (glow) {
                glow.style.left = `${mouseX}px`;
                glow.style.top = `${mouseY}px`;
            }
        });

        // Smooth trailing interpolation for the outer ring
        const tick = () => {
            const ease = 0.15;
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;

            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;

            requestAnimationFrame(tick);
        };
        tick();

        // Hover events for active elements
        const hoverables = document.querySelectorAll('a, button, input, select, textarea, .bento-card, .btn-game-start, #football-game-canvas');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });

        // Click active state animation
        window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
        window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
    }

    /**
     * 7. Reveal Observer for slide-in animation effects
     */
    setupRevealObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('[data-cyber-reveal]');
        revealElements.forEach(el => observer.observe(el));
    }
}

// Launch high-tech portfolio controllers
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioInstance = new HighTechPortfolio();
    
    // Wire theme mode toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        
        // Initial setup
        const localTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', localTheme);
        if (icon) {
            icon.className = localTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }

        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            
            if (icon) {
                icon.className = nextTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }
});
