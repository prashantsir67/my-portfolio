<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prashant Joshi | SEO Architect & Full-Stack Developer</title>
    
    <!-- SEO Optimization Meta Tags -->
    <meta name="description" content="Portfolio of Prashant Joshi, specializing in data-driven Technical SEO, Core Web Vitals optimization, organic growth strategies, and full-stack development.">
    <meta name="keywords" content="Prashant Joshi, SEO Architect, Full-Stack Developer, Nest Nepal, Kathmandu SEO, Technical SEO, Patan Multiple Campus, FIFA Game Portfolio">
    <link rel="icon" type="image/png" href="favicon.png">

    <!-- Open Graph Protocol (Facebook) -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://prashant-joshi.com.np/">
    <meta property="og:title" content="Prashant Joshi | SEO Architect & Growth Strategist">
    <meta property="og:description" content="Technical organic growth engine built by Prashant Joshi. Specialized in technical audits, on-page optimization, and full-stack integration.">
    <meta property="og:image" content="https://prashant-joshi.com.np/prashant1.jpg">

    <!-- Twitter Card -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://prashant-joshi.com.np/">
    <meta property="twitter:title" content="Prashant Joshi | SEO Architect & Growth Strategist">
    <meta property="twitter:description" content="SEO optimization and interactive systems dashboard by Prashant Joshi.">
    <meta property="twitter:image" content="https://prashant-joshi.com.np/prashant1.jpg">

    <!-- Google Fonts & FontAwesome Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Core Main Stylesheet -->
    <link rel="stylesheet" href="css/main.css">
</head>
<body>

    <!-- Custom Futuristic Cursor Nodes -->
    <div id="custom-cursor"></div>
    <div id="custom-cursor-ring"></div>
    <div id="custom-cursor-glow"></div>

    <!-- Scanner overlay scanning line -->
    <div class="scanner-effect"></div>

    <!-- Global Scroll Progress Indicator -->
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 3px; z-index: 2000; pointer-events: none;">
        <div id="scroll-progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #00f2ff, #7000ff); transition: width 0.1s ease-out; box-shadow: 0 0 8px #00f2ff;"></div>
    </div>

    <!-- Interactive Background Elements -->
    <canvas id="bg-canvas"></canvas>
    <div class="cyber-grid"></div>

    <!-- Navigation Header -->
    <nav id="navbar">
        <div class="logo-container">
            <a href="#" class="logo">PRASHANT<span>JOSHI</span></a>
        </div>
        <div class="nav-links">
            <a href="#about" class="active">About</a>
            <a href="#bento-metrics">Dashboard</a>
            <a href="#game-section">FIFA Game</a>
            <a href="#seo-calculator">SEO Tool</a>
            <a href="#experience">Timeline</a>
            <a href="#contact">Contact</a>
        </div>
        <div class="nav-actions">
            <button id="theme-toggle-btn" class="theme-toggle-btn" title="Toggle Theme Modes">
                <i class="fas fa-moon"></i>
            </button>
            <a href="mailto:joshiprashant9835@gmail.com" class="btn-hire">Hire Me</a>
        </div>
    </nav>

    <!-- Main Content Container -->
    <main>
        
        <!-- Hero and Terminal Section -->
        <header id="about" class="hero-section">
            <div class="hero-content" data-cyber-reveal>
                <div class="hero-badge">
                    <span class="pulse-dot"></span>
                    SEO Core Engine Online
                </div>
                <div class="hero-profile-container">
                    <div class="hero-profile-frame">
                        <img src="prashant1.jpg" alt="Prashant Joshi Profile Pic" class="hero-profile-img">
                    </div>
                    <div class="hero-profile-text">
                        <h2>Prashant Joshi</h2>
                        <p>Kathmandu, Nepal</p>
                    </div>
                </div>
                <h1 class="hero-title">Dominating Search <br><span class="gradient-text-accent">With Precision.</span></h1>
                <p class="hero-description">
                    I am an SEO Architect and Full-Stack Developer bridging organic growth tactics with high-performance codebase architecture. Specialized in technical website audits, Core Web Vitals optimizations, and database scaling.
                </p>
                <div class="hero-buttons">
                    <a href="#game-section" class="btn-primary">Play FIFA Kicks</a>
                    <a href="#contact" class="btn-outline">Start Site Audit</a>
                </div>
            </div>

            <div class="hero-visual" data-cyber-reveal>
                <div class="cyber-terminal">
                    <div class="terminal-header">
                        <div class="terminal-buttons">
                            <span class="terminal-btn red"></span>
                            <span class="terminal-btn yellow"></span>
                            <span class="terminal-btn green"></span>
                        </div>
                        <div class="terminal-title">prashant@cyber-node:~</div>
                    </div>
                    <div id="terminal-body" class="terminal-body">
                        <div class="terminal-history" id="terminal-history">
                            <div><span class="terminal-prompt">$</span> status --active</div>
                            <div class="terminal-log-output">System Active. Load: 0.12 | RAM: 4.1/16GB | CPU Temp: 42°C</div>
                            <div><span class="terminal-prompt">$</span> info --academics</div>
                            <div class="terminal-log-output">Education: BCA @ Patan Multiple Campus [ACTIVE]</div>
                            <div><span class="terminal-prompt">$</span> seo --audit</div>
                            <div class="terminal-log-output terminal-log-success">Top rankings detected: 10+ keywords in Page 1.</div>
                            <div><span class="terminal-prompt">$</span> neoblocks --info</div>
                            <div class="terminal-log-output">Type "help" to view all active terminal commands.</div>
                        </div>
                        <div class="terminal-input-line">
                            <span class="terminal-prompt">$</span>
                            <input type="text" id="terminal-input" class="terminal-input-field" placeholder="enter command..." autocomplete="off" spellcheck="false">
                        </div>
                    </div>
                </div>
                <div class="scroll-hint">
                    <span>Explore System</span>
                    <div class="scroll-indicator"></div>
                </div>
            </div>
        </header>

        <!-- Bento Grid Dashboard Section -->
        <section id="bento-metrics" class="bento-section" data-cyber-reveal>
            <div class="section-header">
                <span class="section-tag">Cyber Metrics</span>
                <h2 class="section-title">Operations <span class="gradient-text-accent">Dashboard</span></h2>
            </div>

            <div class="bento-grid-dashboard">
                
                <!-- Nest Nepal Internship Live Tracker -->
                <div class="bento-card bento-col-2 bento-row-2">
                    <span class="card-badge">LIVE DATABASE</span>
                    <div class="internship-counter-container">
                        <div class="internship-header">
                            <div>
                                <h4>Nest Nepal Internship</h4>
                                <p style="margin-top: 4px; font-size: 0.85rem; color: var(--text-secondary);">SEO Strategist & Technical Auditor</p>
                            </div>
                            <p>ACTIVE</p>
                        </div>
                        
                        <!-- Real-time running timer columns -->
                        <div class="internship-timer-grid">
                            <div class="timer-box">
                                <div id="internship-years" class="timer-num">00</div>
                                <div class="timer-lbl">Years</div>
                            </div>
                            <div class="timer-box">
                                <div id="internship-months" class="timer-num">00</div>
                                <div class="timer-lbl">Months</div>
                            </div>
                            <div class="timer-box">
                                <div id="internship-days" class="timer-num">00</div>
                                <div class="timer-lbl">Days</div>
                            </div>
                            <div class="timer-box">
                                <div id="internship-hours" class="timer-num">00</div>
                                <div class="timer-lbl">Hours</div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                            <div class="timer-box">
                                <div id="internship-minutes" class="timer-num">00</div>
                                <div class="timer-lbl">Mins</div>
                            </div>
                            <div class="timer-box">
                                <div id="internship-seconds" class="timer-num">00</div>
                                <div class="timer-lbl">Secs</div>
                            </div>
                        </div>

                        <!-- Progress Bar relative to targeted internship timeline -->
                        <div class="internship-progress-bar-wrap">
                            <div id="internship-progress-bar" class="internship-progress-bar"></div>
                        </div>

                        <div class="internship-footer">
                            <i class="fas fa-circle"></i>
                            <span id="internship-live-counter-text">Loading elapsed days...</span>
                        </div>
                    </div>
                </div>

                <!-- Google Search Console Mock Report -->
                <div class="bento-card bento-col-2 bento-row-2">
                    <span class="card-badge">SEO ANALYTICS</span>
                    <div class="analytics-dashboard">
                        <div class="analytics-header">
                            <h4 style="font-family: var(--font-heading); font-weight: 700;">Organic Traffic Curve</h4>
                            <div class="analytics-tabs">
                                <button class="analytics-tab active">28D</button>
                                <button class="analytics-tab">3M</button>
                            </div>
                        </div>
                        <div class="gsc-stat-grid">
                            <div class="gsc-stat-item">
                                <div class="gsc-stat-label">Impressions</div>
                                <div class="gsc-stat-val">+4.0K</div>
                                <div class="gsc-stat-trend up">
                                    <i class="fas fa-caret-up"></i> +12.4%
                                </div>
                            </div>
                            <div class="gsc-stat-item">
                                <div class="gsc-stat-label">Clicks</div>
                                <div class="gsc-stat-val">320</div>
                                <div class="gsc-stat-trend up">
                                    <i class="fas fa-caret-up"></i> +8.2%
                                </div>
                            </div>
                            <div class="gsc-stat-item">
                                <div class="gsc-stat-label">Avg Pos</div>
                                <div class="gsc-stat-val">4.2</div>
                                <div class="gsc-stat-trend up">
                                    <i class="fas fa-caret-up"></i> +0.6
                                </div>
                            </div>
                        </div>

                        <!-- Vector SVG Chart Drawing -->
                        <div class="mock-chart-container">
                            <svg viewBox="0 0 300 100" class="mock-chart-svg">
                                <defs>
                                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#00f2ff" stop-opacity="0.3"></stop>
                                        <stop offset="100%" stop-color="#00f2ff" stop-opacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path class="area" d="M 0,100 L 0,80 Q 30,65 60,70 T 120,40 T 180,55 T 240,20 T 300,10 L 300,100 Z"></path>
                                <path class="line" d="M 0,80 Q 30,65 60,70 T 120,40 T 180,55 T 240,20 T 300,10"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Academic Bento Card -->
                <div class="bento-card bento-col-2">
                    <span class="card-badge">ACADEMICS</span>
                    <div class="bento-card-content">
                        <i class="fas fa-graduation-cap card-icon"></i>
                        <h3 class="card-title">BCA Undergraduate</h3>
                        <p class="card-description">Patan Multiple Campus | 2022 - Present. Blending computer science fundamentals with software engineering principles.</p>
                    </div>
                </div>

                <!-- Core Stack Bento Card -->
                <div class="bento-card bento-col-2">
                    <span class="card-badge">CORE STACK</span>
                    <div class="bento-card-content">
                        <i class="fas fa-laptop-code card-icon"></i>
                        <h3 class="card-title">Full-Stack Capability</h3>
                        <p class="card-description">Experienced in PHP, MySQL, Vanilla JavaScript, and API integrations for building fast and robust web architectures.</p>
                    </div>
                </div>

                <!-- Lifestyle Bento Card: Fitness -->
                <div class="bento-card">
                    <span class="card-badge">LIFESTYLE</span>
                    <div class="bento-card-content">
                        <i class="fas fa-dumbbell card-icon" style="color: var(--accent-tertiary);"></i>
                        <h3 class="card-title" style="font-size: 1.3rem;">Fitness</h3>
                        <p class="card-description">Discipline and stamina focused training.</p>
                    </div>
                </div>

                <!-- Lifestyle Bento Card: Travelling -->
                <div class="bento-card">
                    <span class="card-badge">EXPLORING</span>
                    <div class="bento-card-content">
                        <i class="fas fa-route card-icon"></i>
                        <h3 class="card-title" style="font-size: 1.3rem;">Travels</h3>
                        <p class="card-description">Seeking out remote nature trails and peaks.</p>
                    </div>
                </div>

                <!-- Keywords Bento Card -->
                <div class="bento-card bento-col-2">
                    <span class="card-badge">RANKINGS</span>
                    <div class="bento-card-content">
                        <i class="fas fa-arrow-trend-up card-icon"></i>
                        <h3 class="card-title">10+ Top 10 Keywords</h3>
                        <p class="card-description">Proven track record of optimizing and driving high-converting targeted keywords straight to the top of search rankings.</p>
                    </div>
                </div>

            </div>
        </section>

        <!-- FIFA Goal Shootout Interactive Game Section -->
        <section id="game-section" class="fifa-section" data-cyber-reveal>
            <div class="section-header">
                <span class="section-tag">FIFA World Cup Special</span>
                <h2 class="section-title">Penalty Shootout <span class="gradient-text-accent">Arcade</span></h2>
            </div>

            <div class="fifa-game-wrapper">
                
                <!-- Game Canvas Arena -->
                <div class="fifa-game-canvas-area">
                    <!-- Overlay Game Screen -->
                    <div class="game-overlay-screen" id="game-overlay">
                        <h3 class="game-overlay-title">FIFA <span>PENALTY</span> CHALLENGE</h3>
                        <p class="game-overlay-desc">Swipe or drag the football upward from the spot to shoot. Adjust angle and speed to curl the ball around the keeper's dive!</p>
                        <button class="btn-game-start">INITIALIZE STADIUM</button>
                    </div>
                    
                    <canvas id="football-game-canvas"></canvas>
                </div>

                <!-- Stats Dashboard Side Panel -->
                <div class="game-stats-panel">
                    <div class="game-panel-section">
                        <div class="game-panel-title">
                            <i class="fas fa-trophy"></i> SCOREBOARD
                        </div>
                        <div class="game-stats-grid">
                            <div class="game-stat-box">
                                <div id="fifa-score" class="game-stat-number">0</div>
                                <div class="game-stat-label">SCORE</div>
                            </div>
                            <div class="game-stat-box">
                                <div id="fifa-streak" class="game-stat-number text-success">0</div>
                                <div class="game-stat-label">STREAK</div>
                            </div>
                        </div>

                        <div class="high-score-wrap">
                            <span class="high-score-label">HIGH SCORE:</span>
                            <span id="fifa-highscore" class="high-score-value">0</span>
                        </div>
                    </div>

                    <div class="game-panel-section">
                        <div class="game-panel-title">
                            <i class="fas fa-chart-simple"></i> STATISTICS
                        </div>
                        <div class="game-stats-grid">
                            <div class="game-stat-box">
                                <div id="fifa-shots" class="game-stat-number">0/0</div>
                                <div class="game-stat-label">GOAL/SHOT</div>
                            </div>
                            <div class="game-stat-box">
                                <div id="fifa-accuracy" class="game-stat-number">0%</div>
                                <div class="game-stat-label">ACCURACY</div>
                            </div>
                        </div>
                    </div>

                    <div class="game-panel-section">
                        <div class="game-panel-title">
                            <i class="fas fa-gamepad"></i> GUIDE & CONTROLS
                        </div>
                        <ul class="football-guide-list">
                            <li><i class="fas fa-circle-info"></i> Click/Touch the ball to start swipe</li>
                            <li><i class="fas fa-arrows-up-down-left-right"></i> Speed of swipe alters power</li>
                            <li><i class="fas fa-rotate"></i> Curve swipe left/right for spin</li>
                            <li><i class="fas fa-bullseye"></i> Hit targets for bonus multiplier</li>
                        </ul>
                    </div>

                    <div class="game-panel-section" style="text-align: center;">
                        <div class="game-panel-title" style="justify-content: center; margin-bottom: 0.5rem;">
                            FIELD ANNOUNCEMENTS
                        </div>
                        <div id="fifa-game-notify" class="game-stat-number" style="font-size: 1.1rem; letter-spacing: 1px;">
                            ---
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- Advanced SEO Toolkit (Simulated Site Auditor) -->
        <section id="seo-calculator" class="seo-toolkit-section" data-cyber-reveal>
            <div class="section-header">
                <span class="section-tag">Dev Engine</span>
                <h2 class="section-title">Technical SEO <span class="gradient-text-accent">Analyzer</span></h2>
            </div>

            <div class="seo-grid">
                
                <!-- Audit Inputs Form -->
                <div class="seo-card-tool">
                    <div class="seo-tool-header">
                        <h3 class="seo-tool-title">Site Crawler</h3>
                        <p class="seo-tool-desc">Test load vectors, metadata integrity, and layout responsiveness metrics.</p>
                    </div>

                    <div class="seo-tool-body">
                        <div class="tool-input-group">
                            <label class="tool-label">Target Domain URL</label>
                            <input type="url" id="seo-url-input" class="tool-input" placeholder="https://example.com" value="https://nestnepal.com">
                        </div>

                        <div class="tool-input-group">
                            <label class="tool-label">Target Optimization Keyword</label>
                            <input type="text" id="seo-keyword-input" class="tool-input" placeholder="e.g. web hosting nepal" value="web hosting nepal">
                        </div>

                        <div class="tool-input-group">
                            <label class="tool-label">Audit Strictness Level</label>
                            <select id="seo-strictness" class="tool-input tool-select">
                                <option value="standard">Standard technical parameters</option>
                                <option value="strict">Strict crawler check (Core Web Vitals)</option>
                                <option value="experimental">NLP Entity matching checks</option>
                            </select>
                        </div>

                        <button id="btn-seo-audit" class="btn-tool-calculate">LAUNCH FULL AUDIT</button>
                    </div>
                </div>

                <!-- Audit Results Pane (Simulated UI response) -->
                <div class="seo-card-tool" style="justify-content: flex-start;">
                    <div class="seo-tool-header">
                        <h3 class="seo-tool-title">Audit Log Outputs</h3>
                        <p class="seo-tool-desc">Simulated indexation index values after technical crawl.</p>
                    </div>

                    <div id="seo-audit-results" class="seo-tool-results active">
                        <div class="results-grid">
                            <div class="result-item">
                                <div class="result-label">Core Web Vitals</div>
                                <div id="res-speed" class="result-value high-score">94/100</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">On-Page Score</div>
                                <div id="res-onpage" class="result-value high-score">88/100</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">Mobile Score</div>
                                <div id="res-mobile" class="result-value">92/100</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">First Input Delay</div>
                                <div id="res-loadtime" class="result-value high-score">0.82s</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">Schema Integration</div>
                                <div id="res-schema" class="result-value high-score">A+</div>
                            </div>
                            <div class="result-item">
                                <div class="result-label">Indexed Pages</div>
                                <div id="res-pages" class="result-value">340</div>
                            </div>
                        </div>

                        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed var(--card-border);">
                            <h5 style="color: var(--accent-primary); font-size: 0.85rem; margin-bottom: 0.5rem;">CRAWLER ADVICE:</h5>
                            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                                URL resolves securely via SSL. Robots.txt rules allowed indexation blocks. Meta titles matches requested keyword density perfectly. Next step: Compress remaining asset payloads to reduce FID.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- Professional Experience & History Section -->
        <section id="experience" class="experience-section" data-cyber-reveal>
            <div class="section-header">
                <span class="section-tag">Proof of Capability</span>
                <h2 class="section-title">Professional <span class="gradient-text-accent">Chronology</span></h2>
            </div>

            <div class="timeline-container">
                
                <!-- Internship Job -->
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-meta">
                        <span class="timeline-date">May 2026 - Present</span>
                        <span class="timeline-company">NEST NEPAL (Kathmandu)</span>
                    </div>
                    <div class="timeline-content">
                        <h3 class="timeline-title">SEO Intern</h3>
                        <p style="color: var(--text-secondary);">Currently serving as an SEO strategist optimizing web architecture visibility parameters.</p>
                        <ul class="timeline-list">
                            <li>Technical page layout index optimization boosting overall crawling speed vectors.</li>
                            <li>Implemented Schema structured layouts across core product groups.</li>
                            <li>Ahrefs/Semrush backlink monitoring and link-building network outreach tasks.</li>
                            <li>On-page title/meta audit boosting click-through-ratio metrics by over 14%.</li>
                        </ul>
                    </div>
                </div>

                <!-- Freelance Job -->
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-meta">
                        <span class="timeline-date">2024 - 2025</span>
                        <span class="timeline-company">SEO Freelance Practitioner</span>
                    </div>
                    <div class="timeline-content">
                        <h3 class="timeline-title">SEO Architect & Full-Stack Strategist</h3>
                        <p style="color: var(--text-secondary);">Designed dynamic websites with optimized SEO architectures to dominate localized keyword phrases.</p>
                        <ul class="timeline-list">
                            <li>Audited and ranked 10+ high-competition keywords in Top 10 ranks.</li>
                            <li>Built responsive web architectures using PHP, MySQL database structures, and semantic markup schemas.</li>
                            <li>Core Web Vitals audits reducing payload latencies and cumulative layout shifts.</li>
                        </ul>
                    </div>
                </div>

                <!-- Academic Node -->
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-meta">
                        <span class="timeline-date">2022 - Present</span>
                        <span class="timeline-company">Patan Multiple Campus</span>
                    </div>
                    <div class="timeline-content">
                        <h3 class="timeline-title">Bachelor of Computer Applications (BCA)</h3>
                        <p style="color: var(--text-secondary);">Acquiring comprehensive methodologies in computational mathematics, database schemas, and networks.</p>
                    </div>
                </div>

            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact-section" data-cyber-reveal>
            <div class="section-header">
                <span class="section-tag">Direct Comms</span>
                <h2 class="section-title">Launch <span class="gradient-text-accent">Transmission</span></h2>
            </div>

            <div class="contact-layout">
                
                <!-- Left contact details cards -->
                <div class="contact-info">
                    <div class="contact-card-box">
                        <div class="contact-icon-wrap">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-details">
                            <h5>Contact Mobile</h5>
                            <p><a href="tel:+9779868797135">+977 9868797135</a></p>
                        </div>
                    </div>

                    <div class="contact-card-box">
                        <div class="contact-icon-wrap">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="contact-details">
                            <h5>Secure Mail</h5>
                            <p><a href="mailto:joshiprashant9835@gmail.com">joshiprashant9835@gmail.com</a></p>
                        </div>
                    </div>

                    <div class="contact-card-box">
                        <div class="contact-icon-wrap">
                            <i class="fas fa-location-dot"></i>
                        </div>
                        <div class="contact-details">
                            <h5>Current Node Coordinates</h5>
                            <p>Kathmandu, Nepal</p>
                        </div>
                    </div>
                </div>

                <!-- Right secure connection form -->
                <form class="cyber-form" onsubmit="event.preventDefault(); alert('Message transmission completed successfully!');">
                    <div class="form-row">
                        <div class="cyber-input-wrap">
                            <label class="cyber-label">Operator Name</label>
                            <input type="text" class="cyber-input" placeholder="e.g. John Doe" required>
                        </div>
                        <div class="cyber-input-wrap">
                            <label class="cyber-label">Return Address (Email)</label>
                            <input type="email" class="cyber-input" placeholder="e.g. john@example.com" required>
                        </div>
                    </div>

                    <div class="cyber-input-wrap">
                        <label class="cyber-label">Transmission Subject</label>
                        <input type="text" class="cyber-input" placeholder="e.g. SEO Audit Request" required>
                    </div>

                    <div class="cyber-input-wrap">
                        <label class="cyber-label">Secure Payload Message</label>
                        <textarea class="cyber-input cyber-textarea" placeholder="Input details here..." required></textarea>
                    </div>

                    <button type="submit" class="btn-submit">
                        TRANSMIT SECURE DATA
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>

            </div>
        </section>

    </main>

    <!-- Footer Area -->
    <footer>
        <a href="#" class="footer-logo">PRASHANT<span>JOSHI</span></a>
        
        <div class="footer-socials">
            <a href="https://www.linkedin.com/in/prashant-joshi7" target="_blank" class="footer-social-link" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
            <a href="https://www.facebook.com/prashantjoshi12345/" target="_blank" class="footer-social-link" title="Facebook"><i class="fab fa-facebook"></i></a>
            <a href="https://www.instagram.com/prashant.mnr/" target="_blank" class="footer-social-link" title="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="https://github.com" target="_blank" class="footer-social-link" title="GitHub"><i class="fab fa-github"></i></a>
            <a href="https://wa.me/9779868797135" target="_blank" class="footer-social-link" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        </div>

        <p class="footer-text">
            &copy; <?php echo date("Y"); ?> Prashant Joshi. Built with high-performance Vanilla Code structures. All rights reserved.
        </p>
    </footer>

    <!-- Core Script Injections -->
    <script src="js/particles.js"></script>
    <script src="js/game.js"></script>
    <script src="js/portfolio.js"></script>
</body>
</html>
