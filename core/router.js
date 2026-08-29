// =======================================================================
// NANBI V5.0 MASTER ROUTER & DYNAMIC CONFIG ENGINE
// =======================================================================
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb3JhY294eWp6Z3BzeXhnd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzgzNzUsImV4cCI6MjEwMzMxNDM3NX0.rNcvhRCw4KyfNpsWH6IYxlQT07zJ7i68Zg5jnpqj9yc";

// 1. Define the Global UI Shell 
const UI_SHELL = `
  <style>
    html, body { background:var(--bg); color:var(--text); font-size:var(--font-base); font-family:system-ui,-apple-system,sans-serif; height: 100vh; margin: 0; overflow: hidden; display: flex; transition: background 0.3s, color 0.3s; }
    
    .text-main { color: var(--text); }
    .text-sub { color: var(--muted); }
    
    .app-wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
    
    /* True Left Sidebar */
    nav.sidebar { width: 72px; background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s; overflow-x: hidden; white-space: nowrap; z-index: 60; height: 100%; }
    nav.sidebar:hover { width: 250px; box-shadow: 4px 0 24px rgba(0,0,0,0.1); }
    
    .sidebar-brand { height: var(--bar); display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 8px; flex-shrink: 0; }
    .sidebar-brand img { height: 26px; width: 26px; object-fit: contain; flex-shrink: 0; }
    
    /* Strict nanbi branding: lowercase, dark teal green */
    .brand-text { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.03em; margin-left: 12px; color: var(--brand-teal-dark); opacity: 0; transition: opacity 0.2s; }
    nav.sidebar:hover .sidebar-brand .brand-text { opacity: 1; transition-delay: 0.05s; }
    
    .sidebar-links { flex: 1; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; }
    
    /* Icons and Labels strictly default to Dark Teal Green */
    nav.sidebar a { position: relative; display:flex; align-items:center; padding:10px 0; margin: 4px 12px; border-radius:6px; color:var(--brand-teal-dark); text-decoration:none; transition: all 0.15s ease; font-weight: 600; }
    nav.sidebar a .icon-box { width: 48px; display: flex; justify-content: center; align-items: center; font-size: 1.15rem; flex-shrink: 0; transition: color 0.15s; }
    nav.sidebar a .nav-label { font-size: 0.95rem; opacity: 0; transition: opacity 0.2s ease; }
    nav.sidebar:hover a .nav-label { opacity: 1; transition-delay: 0.05s; }
    
    /* True Light Teal Green Hover */
    nav.sidebar a:hover { background:var(--hover-bg); color: var(--brand-orange-dark); }
    nav.sidebar a:hover .icon-box { color: var(--brand-orange-dark); }
    
    nav.sidebar a.active { color:var(--brand-orange-dark); background:var(--hover-bg); }
    nav.sidebar a.active .icon-box { color:var(--brand-orange-dark); }
    
    .sidebar-divider { height: 1px; background: var(--border); margin: 8px 12px; }
    nav.sidebar .bottom-pin { margin-bottom: 16px; }
    
    /* Main Right Column */
    .main-column { display: flex; flex-direction: column; flex: 1; overflow: hidden; background: var(--bg); transition: background 0.3s; }
    
    header.app-header { height: var(--bar); background: var(--header-bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; flex-shrink: 0; z-index: 40; transition: background 0.3s; }
    
    /* Corrected Breadcrumb: nanbi studio > Section */
    header.app-header .breadcrumb { display: flex; align-items: center; }
    header.app-header .header-brand { font-weight: 700; font-size: 1.1rem; color: var(--brand-teal-dark); letter-spacing: -0.02em; }
    header.app-header .crumb-separator { font-size: 0.75rem; color: var(--muted); margin: 0 12px; opacity: 0.6; }
    header.app-header .section-crumb { font-weight: 600; font-size: 0.95rem; color: var(--text); }
    header.app-header .spacer { flex: 1; }
    
    header.app-header .header-actions { display: flex; gap: 12px; align-items: center; }
    .icon-btn { background: transparent; border: none; color: var(--brand-teal-dark); width: 32px; height: 32px; border-radius: 6px; cursor: pointer; transition: 0.2s; font-size: 1.1rem; }
    .icon-btn:hover { background: var(--hover-bg); color: var(--brand-orange-dark); }
    
    .avatar-wrapper { position: relative; }
    .avatar-btn { background: var(--brand-orange-dark); color: #FFF; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; margin-left: 8px; transition: transform 0.2s; }
    .avatar-btn:hover { transform: scale(1.05); }
    
    .dropdown-menu { display: none; position: absolute; right: 0; top: 44px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 250px; z-index: 100; flex-direction: column; overflow: hidden; }
    .dropdown-menu.show { display: flex; }
    
    .dropdown-header { padding: 16px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px; }
    .dropdown-header .d-name { font-weight: 700; font-size: 0.95rem; color: var(--text); }
    .dropdown-header .d-email { font-size: 0.8rem; color: var(--muted); }
    
    .dropdown-item { padding: 12px 16px; font-size: 0.85rem; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 12px; transition: all 0.2s; cursor: pointer; }
    .dropdown-item i { width: 16px; text-align: center; color: var(--muted); transition: color 0.2s; }
    .dropdown-item:hover { background: var(--hover-bg); color: var(--brand-orange-dark); }
    .dropdown-item:hover i { color: var(--brand-orange-dark); }
    .dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
    
    /* Immersive Main Container */
    main { flex: 1; padding: 32px 40px; overflow-y: auto; display: flex; flex-direction: column; }
    
    /* The Light Teal Grey Attention Box */
    .active-attention-box { background: var(--active-bg); border-radius: 8px; padding: 24px; border-left: 4px solid var(--brand-orange-dark); }
  </style>
  
  <div class="app-wrapper">
    <nav class="sidebar">
      <div class="sidebar-brand">
        <img src="icons/nanbi-monogram.svg" alt="Nanbi" onerror="this.style.display='none'">
        <span class="brand-text">nanbi</span>
      </div>
      
      <div class="sidebar-links">
        <a href="#/" id="nav-home">
          <span class="icon-box"><i class="fas fa-home"></i></span>
          <span class="nav-label">Home</span>
        </a>
        <a href="#/config" id="nav-config">
          <span class="icon-box"><i class="fas fa-sitemap"></i></span>
          <span class="nav-label">Configuration</span>
        </a>
        <a href="#/regions" id="nav-regions">
          <span class="icon-box"><i class="fas fa-map-marked-alt"></i></span>
          <span class="nav-label">Regions</span>
        </a>
      </div>
      
      <div class="sidebar-divider"></div>
      <a href="#/settings" class="bottom-pin" id="nav-settings">
        <span class="icon-box"><i class="fas fa-cog"></i></span>
        <span class="nav-label">Studio Settings</span>
      </a>
    </nav>

    <div class="main-column">
      <header class="app-header">
        <div class="breadcrumb">
          <!-- Perfectly placed arrow hierarchy -->
          <span class="header-brand">nanbi studio</span>
          <i class="fas fa-chevron-right crumb-separator"></i>
          <span id="global-crumb" class="section-crumb"></span>
        </div>
        
        <span class="spacer"></span>
        
        <div class="header-actions">
          <div class="avatar-wrapper">
            <button class="avatar-btn" id="avatar-toggle" title="Account Menu">N</button>
            <div class="dropdown-menu" id="account-dropdown">
                <div class="dropdown-header">
                    <span class="d-name">Sovereign Identity</span>
                    <span class="d-email">Active Edge Node</span>
                </div>
                
                <a class="dropdown-item" id="dropdown-theme-toggle">
                    <i id="theme-icon" class="fas fa-sun"></i> 
                    <span id="theme-label">Appearance</span>
                </a>
                
                <div class="dropdown-divider"></div>
                
                <a href="#/account" class="dropdown-item" onclick="closeDropdown()"><i class="fas fa-shield-alt"></i> Data Sovereignty</a>
                <a href="#/account" class="dropdown-item" onclick="closeDropdown()"><i class="fas fa-key"></i> Cryptographic Keys</a>
                
                <div class="dropdown-divider"></div>
                
                <a href="#/account" class="dropdown-item" onclick="closeDropdown()"><i class="fas fa-id-badge"></i> Subscription Tier</a>
                
                <div class="dropdown-divider"></div>
                
                <a class="dropdown-item" onclick="closeDropdown()" style="color: var(--brand-orange-dark);"><i class="fas fa-sign-out-alt" style="color: var(--brand-orange-dark);"></i> Disconnect Node</a>
            </div>
          </div>
        </div>
      </header>
      
      <main id="app-content"></main>
    </div>
  </div>
`;

document.getElementById('nanbi-root').innerHTML = UI_SHELL;

const avatarBtn = document.getElementById('avatar-toggle');
const dropdownMenu = document.getElementById('account-dropdown');

avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== avatarBtn) {
        dropdownMenu.classList.remove('show');
    }
});

window.closeDropdown = function() {
    dropdownMenu.classList.remove('show');
};

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
    
    for (const [key, value] of Object.entries(themeData.variables)) {
        root.style.setProperty(key, value);
    }
    
    document.getElementById('theme-icon').className = `fas ${themeData.icon}`;
    document.getElementById('theme-label').innerText = `Theme: ${themeData.name}`;
    localStorage.setItem('nanbi_theme', themeId);
}

document.getElementById('dropdown-theme-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
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

// 4. Core Routing Logic (Completely Immersive UI)
function router() {
    const hash = location.hash || "#/";
    
    document.querySelectorAll("nav.sidebar a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === hash);
    });

    if (hash === "#/") {
        setCrumb("Home");
        renderView('<div class="flex-1"><h2 class="text-2xl font-bold text-main">Home</h2><p class="text-base mt-2 text-sub">V5.0 Modular Architecture. Boxy styling removed for complete layout immersion.</p></div>');
    } 
    else if (hash === "#/config") {
        setCrumb("Global Configuration");
        renderView('<div class="flex-1"><h2 class="text-2xl font-bold text-main">Governance & Config</h2><p class="text-base mt-2 text-sub">Ready to establish the Multilingual Regional Hierarchy JSON ledger.</p></div>');
    }
    else if (hash === "#/regions") {
        setCrumb("Regions");
        // Utilizes the Light Teal Grey Attention Box requested
        renderView('<div class="active-attention-box flex-1"><h2 class="text-xl font-bold" style="color:var(--brand-orange-dark);"><i class="fas fa-lock mr-2"></i>Module Locked</h2><p class="text-base mt-2 text-main">Awaiting Configuration Engine initialization for dynamic taxonomy.</p></div>');
    }
    else if (hash === "#/settings") {
        setCrumb("Studio Settings");
        renderView('<div class="flex-1"><h2 class="text-2xl font-bold text-main">System Settings</h2><p class="text-base mt-2 text-sub">Platform-level configurations will be managed here.</p></div>');
    }
    else if (hash === "#/account") {
        setCrumb("Account Profile");
        renderView('<div class="flex-1"><h2 class="text-2xl font-bold text-main">Data Sovereignty & Access</h2><p class="text-base mt-2 text-sub">Manage node configurations, local memory sync rules, and cryptographic credentials.</p></div>');
    }
}

// 5. Boot Sequence
window.addEventListener("hashchange", router);
initializeThemeEngine().then(router);
