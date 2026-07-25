// Cursor Glow Effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-glow');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Interactive Tilt Effect on Cards
const tiltElements = document.querySelectorAll('.interactive-tilt');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.5s ease';
    });
    
    el.addEventListener('mouseenter', () => {
        el.style.transition = 'none';
    });
});

// Interactive SEO Analyzer Widget
const analyzeBtn = document.getElementById('analyze-btn');
const targetUrlInput = document.getElementById('target-url');
const resultsDiv = document.getElementById('analysis-results');
const auditLog = document.getElementById('audit-log');

const scores = {
    tech: document.getElementById('score-tech'),
    onpage: document.getElementById('score-onpage'),
    perf: document.getElementById('score-perf')
};

const fills = {
    tech: document.getElementById('fill-tech'),
    onpage: document.getElementById('fill-onpage'),
    perf: document.getElementById('fill-perf')
};

const logs = [
    "Initializing crawler engine...",
    "[INFO] Resolving DNS and establishing secure connection.",
    "[WARN] Scanning robots.txt - found 2 disallow directives.",
    "Checking XML sitemap integrity...",
    "[SUCCESS] Sitemap validated (1,240 URLs).",
    "Analyzing DOM structure and semantic HTML...",
    "[SUCCESS] H1-H6 hierarchy is strictly maintained.",
    "Evaluating Core Web Vitals (LCP, FID, CLS)...",
    "Extracting schema.org JSON-LD structured data...",
    "[INFO] Found BreadcrumbList and Organization schemas.",
    "Calculating keyword density and TF-IDF scores...",
    "[SUCCESS] Analysis complete. Compiling final metrics."
];

if(analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
        if(!targetUrlInput.value) {
            alert("Please enter a URL to analyze.");
            return;
        }
        
        resultsDiv.className = 'results-visible';
        auditLog.innerHTML = '';
        
        Object.keys(fills).forEach(key => {
            fills[key].style.width = '0%';
            scores[key].innerText = '0%';
        });

        analyzeBtn.disabled = true;
        analyzeBtn.innerText = "Analyzing...";

        let logIndex = 0;
        const logInterval = setInterval(() => {
            if(logIndex < logs.length) {
                const p = document.createElement('div');
                p.className = 'log-entry';
                let text = logs[logIndex];
                if(text.includes('[SUCCESS]')) p.classList.add('log-success');
                if(text.includes('[WARN]')) p.classList.add('log-warn');
                
                p.innerText = `> ${text}`;
                auditLog.appendChild(p);
                auditLog.scrollTop = auditLog.scrollHeight;
                logIndex++;
            } else {
                clearInterval(logInterval);
                
                animateScore('tech', 94);
                animateScore('onpage', 88);
                animateScore('perf', 92);
                
                analyzeBtn.disabled = false;
                analyzeBtn.innerText = "Analyze";
            }
        }, 400);
    });
}

function animateScore(key, target) {
    let current = 0;
    fills[key].style.width = `${target}%`;
    
    const counter = setInterval(() => {
        if(current >= target) {
            clearInterval(counter);
            scores[key].innerText = `${target}%`;
        } else {
            current += 2;
            if(current > target) current = target;
            scores[key].innerText = `${current}%`;
        }
    }, 30);
}
