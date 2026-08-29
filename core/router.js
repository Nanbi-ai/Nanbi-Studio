// =======================================================================
// NANBI V5.0 MASTER ROUTER (SELF-HEALING)
// =======================================================================

// Fail-safe CSS Guarantee - Prevents White Screen of Death permanently
const FALLBACK_CSS = `
    :root {
        --bg: #F8FAFC;
        --card: #FFFFFF;
        --text: #0F172A;
        --muted: #64748B;
        --border: #E2E8F0;
        --brand-teal-dark: #2C4653;
        --brand-teal-light: #6A8B88;
        --brand-orange-dark: #D35400;
        --brand-orange-light: #E08A6D;
        --hover-bg: rgba(106, 139, 136, 0.15);
        --header-bg: #FFFFFF;
        --active-bg: #EEF2F2;
        --font-base: 16px;
        --bar: 60px;
    }
`;

const UI_SHELL = `
  <style>
    ${FALLBACK_CSS}
    
    html, body { background:var(--bg); color:var(--text); font-size:var(--font-base); font-family:'Nunito', system-ui, sans-serif; height: 100vh; margin: 0; overflow: hidden; display: flex; transition: background 0.3s, color 0.3s; }
    .text-main { color: var(--text); }
    .text-sub { color: var(--muted); }
    
    .app-wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
    
    /* Strictly Locked Sidebar Geometry */
    nav.sidebar { width: 72px; min-width: 72px; background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s; overflow-x: hidden; white-space: nowrap; z-index: 60; height: 100%; }
    nav.sidebar:hover { width: 250px; box-shadow: 4px 0 24px rgba(0,0,0,0.1); }
    
    .sidebar-brand { height: var(--bar); display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 8px; flex-shrink: 0; }
    .sidebar-brand img { height: 26px; width: auto; flex-shrink: 0; }
    
    /* Exact Logo Typography Match */
    .brand-text { font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em; margin-left: 12px; color: var(--brand-teal-dark); opacity: 0; transition: opacity 0.2s; }
    nav.sidebar:hover .sidebar-brand .brand-text { opacity: 1; transition-delay: 0.05s; }
    
    .sidebar-links { flex: 1; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; }
    
    /* Icons & Labels Default strictly to Dark Teal */
    nav.sidebar a { display:flex; align-items:center; height: 44px; margin: 8px 12px; border-radius:6px; color:var(--brand-teal-dark); text-decoration:none; font-weight: 700; overflow: hidden; transition: background 0.15s; }
    nav.sidebar a .icon-box { width: 48px; min-width: 48px; display: flex; justify-content: center; align-items: center; font-size: 1.15rem; transition: color 0.15s; }
    nav.sidebar a .nav-label { font-size: 0.95rem; opacity: 0; transition: opacity 0.2s ease; }
    nav.sidebar:hover a .nav-label { opacity: 1; transition-delay: 0.05s; }
    
    /* Strict Light Teal Background with Dark Orange Action Text */
    nav.sidebar a:hover { background:var(--hover-bg); color: var(--brand-orange-dark); }
    nav.sidebar a:hover .icon-box { color: var(--brand-orange-dark); }
    nav.sidebar a.active { color:var(--brand-orange-dark); background:var(--hover-bg); }
    nav.sidebar a.active .icon-box { color:var(--brand-orange-dark); }
    
    .sidebar-divider { height: 1px; background: var(--border); margin: 8px 12px; }
    nav.sidebar .bottom-pin { margin-bottom: 16px; }
    
    .main-column { display: flex; flex-direction: column; flex: 1; overflow: hidden; background: var(--bg); transition: background 0.3s; }
    header.app-header { height: var(--bar); background: var(--header-bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; flex-shrink: 0; z-index: 40; transition: background 0.3s; }
    
    /* Exact Hierarchy Formatting (nanbi studio > Regions) */
    header.app-header .breadcrumb { display: flex; align-items: center; height: 100%; }
    .header-brand { font-weight: 800; font-size: 1.15rem; color: var(--brand-teal-dark); letter-spacing: -0.02em; }
    .crumb-separator { font-size: 0.8rem; color: var(--muted); margin: 0 16px; opacity: 0.6; }
    header.app-header .section-crumb { font-weight: 700; font-size: 1.05rem; color: var(--text); }
    header.app-header .spacer { flex: 1; }
    
    header.app-header .header-actions { display: flex; gap: 12px; align-items: center; }
    
    .avatar-wrapper { position: relative; }
    .avatar-btn { background: var(--brand-orange-dark); color: #FFF; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; margin-left: 8px; transition: transform 0.2s; }
    .avatar-btn:hover { transform: scale(1.05); }
    .dropdown-menu { display: none; position: absolute; right: 0; top: 44px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 250px; z-index: 100; flex-direction: column; overflow: hidden; }
    .dropdown-menu.show { display: flex; }
    .dropdown-header { padding: 16px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px; }
    .dropdown-header .d-name { font-weight: 800; font-size: 0.95rem; color: var(--text); }
    .dropdown-header .d-email { font-size: 0.8rem; color: var(--muted); }
    .dropdown-item { padding: 12px 16px; font-size: 0.9rem; font-weight: 600; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 12px; transition: all 0.2s; cursor: pointer; }
    .dropdown-item i { width: 16px; text-align: center; color: var(--muted); transition: color 0.2s; }
    .dropdown-item:hover { background: var(--hover-bg); color: var(--brand-orange-dark); }
    .dropdown-item:hover i { color: var(--brand-orange-dark); }
    .dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
    
    /* Removed ALL padding and borders from main to guarantee Edge-to-Edge flat immersion */
    main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  </style>
  
  <div class="app-wrapper">
    <nav class="sidebar">
      <div class="sidebar-brand">
        <img src="icons/nanbi-monogram.svg" alt="nanbi" onerror="this.style.display='none'">
        <span class="brand-text">nanbi</span>
      </div>
      <div class="sidebar-links">
        <a href="#/" id="nav-home"><span class="icon-box"><i class="fas fa-home"></i></span><span class="nav-label">Home</span></a>
        <a href="#/config" id="nav-config"><span class="icon-box"><i class="fas fa-sliders-h"></i></span><span class="nav-label">Configuration</span></a>
        <a href="#/regions" id="nav-regions"><span class="icon-box"><i class="fas fa-map-marked-alt"></i></span><span class="nav-label">Regions</span></a>
      </div>
      <div class="sidebar-divider"></div>
      <a href="#/settings" class="bottom-pin" id="nav-settings"><span class="icon-box"><i class="fas fa-cog"></i></span><span class="nav-label">Studio Settings</span></a>
    </nav>

    <div class="main-column">
      <header class="app-header">
        <div class="breadcrumb">
          <span class="header-brand">nanbi studio</span>
          <i class="fas fa-chevron-right crumb-separator"></i>
          <span id="global-crumb" class="section-crumb"></span>
        </div>
        <span class="spacer"></span>
        <div class="header-actions">
          <div class="avatar-wrapper">
            <button class="avatar-btn" id="avatar-toggle" title="Account Menu">N</button>
            <div class="dropdown-menu" id="account-dropdown">
                <div class="dropdown-header"><span class="d-name">Sovereign Identity</span><span class="d-email">Active Edge Node</span></div>
                <a class="dropdown-item" id="dropdown-theme-toggle" style="cursor: pointer;"><i id="theme-icon" class="fas fa-sun"></i><span id="theme-label">Appearance</span></a>
                <div class="dropdown-divider"></div>
                <a href="#/account" class="dropdown-item"><i class="fas fa-shield-alt"></i> Data Sovereignty</a>
                <a href="#/account" class="dropdown-item"><i class="fas fa-key"></i> Cryptographic Keys</a>
                <div class="dropdown-divider"></div>
                <a href="#/account" class="dropdown-item"><i class="fas fa-id-badge"></i> Subscription Tier</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" style="color: var(--brand-orange-dark); cursor: pointer;"><i class="fas fa-sign-out-alt" style="color: var(--brand-orange-dark);"></i> Disconnect Node</a>
            </div>
          </div>
        </div>
      </header>
      <main id="app-content"></main>
    </div>
  </div>
`;

// Boot Execution Wrapper prevents White Screen
try {
    let rootNode = document.getElementById('nanbi-root');
    if(!rootNode) {
        rootNode = document.createElement('div');
        rootNode.id = 'nanbi-root';
        document.body.appendChild(rootNode);
    }
    rootNode.innerHTML = UI_SHELL;

    // Attach native DOM events
    const avatarBtn = document.getElementById('avatar-toggle');
    const dropdownMenu = document.getElementById('account-dropdown');

    if(avatarBtn && dropdownMenu) {
        avatarBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.classList.toggle('show'); });
        document.addEventListener('click', (e) => { if (!dropdownMenu.contains(e.target) && e.target !== avatarBtn) dropdownMenu.classList.remove('show'); });
    }
} catch (e) {
    document.getElementById('error-log').innerText = "Critical UI Shell Failure: " + e.message;
}

// 2. Theme Engine Bootloader
let themeLedger = null;
let themeKeys = [];

async function initializeThemeEngine() {
    try {
        const response = await fetch('ledgers/theme_manifest.json');
        if(!response.ok) throw new Error("Manifest not found (404)");
        
        themeLedger = await response.json();
        themeKeys = Object.keys(themeLedger.themes);
        const savedTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
        applyTheme(savedTheme);
    } catch (err) { 
        console.warn("Using Native Fallback CSS. JSON Ledger failed to load:", err.message); 
    }
}

function applyTheme(themeId) {
    if (!themeLedger || !themeLedger.themes[themeId]) return;
    const root = document.documentElement;
    const baseThemeData = themeLedger.themes[themeId];
    const userCustomConfig = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + themeId)) || {};
    
    for (const [key, value] of Object.entries(baseThemeData.variables)) {
        root.style.setProperty(key, userCustomConfig[key] || value);
    }
    
    const iconEl = document.getElementById('theme-icon');
    const labelEl = document.getElementById('theme-label');
    if(iconEl) iconEl.className = \`fas \${baseThemeData.icon}\`;
    if(labelEl) labelEl.innerText = \`Theme: \${baseThemeData.name}\`;
    localStorage.setItem('nanbi_theme', themeId);
}

const themeToggleBtn = document.getElementById('dropdown-theme-toggle');
if(themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!themeLedger) return;
        const currentTheme = localStorage.getItem('nanbi_theme');
        const currentIndex = themeKeys.indexOf(currentTheme);
        applyTheme(themeKeys[(currentIndex + 1) % themeKeys.length]);
        if(location.hash.includes("#/config")) window.location.reload(); 
    });
}

function setCrumb(title) { 
    const crumbEl = document.getElementById('global-crumb');
    if(crumbEl) crumbEl.innerText = title; 
}

function renderView(html) {
    if(window.nanbiActiveMap) { window.nanbiActiveMap.remove(); window.nanbiActiveMap = null; }
    const contentEl = document.getElementById('app-content');
    if(contentEl) contentEl.innerHTML = html;
}

// 3. Routing Engine (Perfectly Flat)
function router() {
    try {
        const hash = location.hash || "#/";
        
        document.querySelectorAll("nav.sidebar a").forEach(a => {
            const path = a.getAttribute("href");
            a.classList.toggle("active", hash === path || (path !== "#/" && hash.startsWith(path)));
        });

        if (hash === "#/") {
            setCrumb("Home");
            renderView('<div class="flex-1 w-full h-full p-10"><h2 class="text-3xl font-bold" style="color: var(--text);">Welcome to nanbi studio</h2><p class="text-lg mt-2" style="color: var(--muted);">V5.0 Modular Architecture active. Layout is completely flat and immersive.</p></div>');
        } 
        else if (hash === "#/config") {
            setCrumb("Configuration Hub");
            renderView('<div id="config-hub-container" class="w-full h-full p-10">Loading Hub...</div>');
            import('../modules/config_hub.js').then(m => m.initConfigHub('config-hub-container')).catch(e => console.error("Hub missing:", e));
        }
        else if (hash === "#/config/presentation") {
            setCrumb("Presentation Engine");
            renderView('<div id="config-pres-container" class="w-full h-full p-10">Loading Engine...</div>');
            import('../modules/config/presentation.js').then(m => m.initPresentationEngine('config-pres-container')).catch(e => console.error("Engine missing:", e));
        }
        else if (hash === "#/regions") {
            setCrumb("Regions");
            // Edge-to-edge Flat Immersion. No boxes.
            renderView('<div class="flex-1 w-full h-full p-10" style="background: var(--active-bg); border-left: 4px solid var(--brand-orange-dark);"><h2 class="text-2xl font-bold" style="color:var(--brand-orange-dark);"><i class="fas fa-lock mr-3"></i>Module Locked</h2><p class="text-lg mt-2 font-semibold" style="color: var(--text);">Awaiting Regional Taxonomy JSON payload.</p></div>');
        }
        else if (hash === "#/settings") {
            setCrumb("Studio Settings");
            renderView('<div class="flex-1 w-full h-full p-10"><h2 class="text-3xl font-bold" style="color: var(--text);">System Settings</h2><p class="text-lg mt-2" style="color: var(--muted);">Platform-level configurations.</p></div>');
        }
        else if (hash === "#/account") {
            setCrumb("Account Profile");
            renderView('<div class="flex-1 w-full h-full p-10"><h2 class="text-3xl font-bold" style="color: var(--text);">Data Sovereignty</h2><p class="text-lg mt-2" style="color: var(--muted);">Manage cryptographic credentials.</p></div>');
        }
    } catch (e) {
        console.error("Routing error:", e);
    }
}

// 4. Boot Execution
window.addEventListener("hashchange", router);
initializeThemeEngine().then(router);
