// =======================================================================
// NANBI V5.0 MASTER ROUTER & DYNAMIC CONFIG ENGINE
// =======================================================================
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb3JhY294eWp6Z3BzeXhnd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzgzNzUsImV4cCI6MjEwMzMxNDM3NX0.rNcvhRCw4KyfNpsWH6IYxlQT07zJ7i68Zg5jnpqj9yc";

// 1. Define the Global UI Shell (Stripped of all hardcoded CSS variables)
const UI_SHELL = `
  <style>
    /* Global rules relying entirely on DOM-injected CSS variables */
    html, body { background:var(--bg); color:var(--text); font-size:var(--font-base); font-family:system-ui,-apple-system,sans-serif; height: 100vh; margin: 0; overflow: hidden; display: flex; flex-direction: column; transition: background 0.3s, color 0.3s; }
    
    .surface-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; transition: background 0.3s, border-color 0.3s; }
    .text-main { color: var(--text); }
    .text-sub { color: var(--muted); }
    
    header.app { background:var(--navy); color:#fff; height:var(--bar); display:flex; align-items:center; padding:0 16px; flex-shrink: 0; z-index: 50; transition: background 0.3s, height 0.3s; }
    header.app .brandbox { display:flex; align-items:center; gap:12px; width:200px; }
    header.app .brandbox img { height: 26px; width: auto; }
    header.app h1 { font-size:1.0625rem; margin:0; font-weight:600; white-space:nowrap; }
    header.app .header-actions { display: flex; gap: 8px; margin-left: 20px; align-items: center; }
    header.app .header-actions button { background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    header.app .header-actions button:hover { background: rgba(255,255,255,0.2); }
    header.app .spacer { flex: 1; }
    
    .app-body { display: flex; flex: 1; overflow: hidden; height: calc(100vh - var(--bar)); }
    
    nav.sidebar { width: 64px; background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; transition: width 0.2s ease, box-shadow 0.2s ease, background 0.3s, border-color 0.3s; overflow-x: hidden; white-space: nowrap; z-index: 40; height: 100%; }
    nav.sidebar:hover { width: 240px; box-shadow: 4px 0 15px rgba(0,0,0,0.1); }
    nav.sidebar a { display:flex; align-items:center; padding:12px 0; margin: 8px; border-radius:8px; font-size:0.9rem; color:var(--muted); text-decoration:none; transition: background 0.1s, color 0.3s; }
    nav.sidebar a i { width: 48px; text-align: center; font-size: 1.125rem; flex-shrink: 0; }
    nav.sidebar a span { opacity: 0; transition: opacity 0.2s ease; pointer-events: none; }
    nav.sidebar:hover a span { opacity: 1; transition-delay: 0.1s; }
    nav.sidebar a:hover { background:var(--hover); }
    nav.sidebar a.active { color:var(--coral); font-weight:700; background:rgba(211,84,0,0.08); }
    nav.sidebar a.active i { color:var(--coral); }
    
    nav.sidebar .account-pin { margin-top: auto !important; margin-bottom: 0 !important; border-top: 1px solid var(--border); border-radius: 0; padding: 16px 8px; }
    
    main { flex: 1; padding: 24px; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; transition: background 0.3s; }
  </style>
  
  <header class="app">
    <span class="brandbox">
      <img src="icons/nanbi-monogram.svg" alt="Nanbi" onerror="this.style.display='none'">
      <h1>Nanbi Studio</h1>
    </span>
    <span class="header-actions">
      <button onclick="history.back()" title="Back"><i class="fas fa-chevron-left"></i></button>
      <button onclick="history.forward()" title="Forward"><i class="fas fa-chevron-right"></i></button>
    </span>
    <span id="global-crumb" style="display:flex; align-items:center; padding-left:24px; font-weight:700; font-size: 0.9375rem;"></span>
    
    <span class="spacer"></span>
    <span class="header-actions">
      <button id="theme-toggle" title="Cycle System Theme"><i id="theme-icon" class="fas fa-sun"></i></button>
    </span>
  </header>
  
  <div class="app-body">
    <nav class="sidebar">
      <a href="#/" id="nav-home"><i class="fas fa-home"></i> <span>Home</span></a>
      <a href="#/config" id="nav-config"><i class="fas fa-cogs"></i> <span>Configuration</span></a>
      <a href="#/regions" id="nav-regions"><i class="fas fa-map-marked-alt"></i> <span>Regions</span></a>
      
      <a href="#/settings" class="account-pin" id="nav-settings"><i class="fas fa-user-circle"></i> <span>Account Settings</span></a>
    </nav>
    
    <main id="app-content"></main>
  </div>
`;

document.getElementById('nanbi-root').innerHTML = UI_SHELL;

// 2. Headless Theme Engine Initialization
let themeLedger = null;
let themeKeys = [];

async function initializeThemeEngine() {
    try {
        const response = await fetch('config/theme_manifest.json');
        themeLedger = await response.json();
        themeKeys = Object.keys(themeLedger.themes);
        
        const savedTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
        applyTheme(savedTheme);
    } catch (err) {
        console.error("Theme configuration failed to load:", err);
    }
}

function applyTheme(themeId) {
    if (!themeLedger || !themeLedger.themes[themeId]) return;
    
    const themeData = themeLedger.themes[themeId];
    const root = document.documentElement;
    
    // Dynamically inject CSS variables from JSON ledger
    for (const [key, value] of Object.entries(themeData.variables)) {
        root.style.setProperty(key, value);
    }
    
    document.getElementById('theme-icon').className = `fas ${themeData.icon}`;
    localStorage.setItem('nanbi_theme', themeId);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    if (!themeLedger) return;
    const currentTheme = localStorage.getItem('nanbi_theme');
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    applyTheme(themeKeys[nextIndex]);
});

function setCrumb(title) {
    document.getElementById('global-crumb').innerText = title;
}

function renderView(html) {
    if(window.nanbiActiveMap) { 
        window.nanbiActiveMap.remove(); 
        window.nanbiActiveMap = null; 
    }
    document.getElementById('app-content').innerHTML = html;
}

// 3. Core Routing Logic
function router() {
    const hash = location.hash || "#/";
    
    document.querySelectorAll("nav.sidebar a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === hash);
    });

    if (hash === "#/") {
        setCrumb("Home");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm"><h2 class="text-xl font-bold text-main">Home</h2><p class="text-sm mt-2 text-sub">V5.0 Modular Architecture active. Themes are now driven entirely by the JSON configuration ledger.</p></div>');
    } 
    else if (hash === "#/config") {
        setCrumb("Global Configuration");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm"><h2 class="text-xl font-bold text-main">Governance & Config</h2><p class="text-sm mt-2 text-sub">Ready to establish the Multilingual Regional Hierarchy JSON ledger.</p></div>');
    }
    else if (hash === "#/regions") {
        setCrumb("Regions");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm" style="border-left: 4px solid var(--coral);"><h2 class="text-xl font-bold text-main"><i class="fas fa-lock mr-2" style="color:var(--coral);"></i>Module Locked</h2><p class="text-sm mt-2 text-sub">Awaiting Configuration Engine initialization for dynamic Country > State > District taxonomy.</p></div>');
    }
    else if (hash === "#/settings") {
        setCrumb("Account Settings");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm"><h2 class="text-xl font-bold text-main">Account Preferences</h2><p class="text-sm mt-2 text-sub">Cryptographic identities, localized preferences, and role-based access controls will be managed here.</p></div>');
    }
}

// 4. Boot Sequence
window.addEventListener("hashchange", router);
initializeThemeEngine().then(router);
