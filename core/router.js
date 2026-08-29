// =======================================================================
// NANBI V5.0 MASTER ROUTER & THEME ENGINE
// =======================================================================
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb3JhY294eWp6Z3BzeXhnd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzgzNzUsImV4cCI6MjEwMzMxNDM3NX0.rNcvhRCw4KyfNpsWH6IYxlQT07zJ7i68Zg5jnpqj9yc";

// 1. Define the Global UI Shell (Theme Variables, Hover Sidebar, Logo, Nav Arrows, Account)
const UI_SHELL = `
  <style>
    /* Light Theme (Default) */
    :root { 
      --navy: #1E293B; --teal: #527C79; --coral: #D35400; 
      --bg: #F8FAFC; --card: #FFFFFF; --text: #0F172A; 
      --muted: #475569; --border: #CBD5E1; --hover: rgba(82,124,121,.10);
      --bar: 56px; 
    }
    
    /* Dark Theme */
    [data-theme="dark"] { 
      --navy: #0B0F19; --teal: #4FD1C5; --coral: #ED8936; 
      --bg: #0F172A; --card: #1E293B; --text: #F8FAFC; 
      --muted: #94A3B8; --border: #334155; --hover: rgba(255,255,255,.05);
    }

    /* Global Resets */
    html, body { background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,sans-serif; height: 100vh; margin: 0; overflow: hidden; display: flex; flex-direction: column; transition: background 0.3s, color 0.3s; }
    
    /* Custom Utility Classes for Theme Adapting */
    .surface-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; transition: background 0.3s, border-color 0.3s; }
    .text-main { color: var(--text); }
    .text-sub { color: var(--muted); }
    
    /* Header Styles */
    header.app { background:var(--navy); color:#fff; height:var(--bar); display:flex; align-items:center; padding:0 16px; flex-shrink: 0; z-index: 50; transition: background 0.3s; }
    header.app .brandbox { display:flex; align-items:center; gap:12px; width:200px; }
    header.app .brandbox img { height: 26px; width: auto; }
    header.app h1 { font-size:17px; margin:0; font-weight:600; white-space:nowrap; }
    header.app .header-actions { display: flex; gap: 8px; margin-left: 20px; align-items: center; }
    header.app .header-actions button { background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    header.app .header-actions button:hover { background: rgba(255,255,255,0.2); }
    header.app .spacer { flex: 1; }
    
    /* Layout Body */
    .app-body { display: flex; flex: 1; overflow: hidden; height: calc(100vh - var(--bar)); }
    
    /* Supabase-Style Hover Sidebar */
    nav.sidebar { width: 64px; background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; transition: width 0.2s ease, box-shadow 0.2s ease, background 0.3s, border-color 0.3s; overflow-x: hidden; white-space: nowrap; z-index: 40; height: 100%; }
    nav.sidebar:hover { width: 240px; box-shadow: 4px 0 15px rgba(0,0,0,0.1); }
    nav.sidebar a { display:flex; align-items:center; padding:12px 0; margin: 8px; border-radius:8px; font-size:14.5px; color:var(--muted); text-decoration:none; transition: background 0.1s, color 0.3s; }
    nav.sidebar a i { width: 48px; text-align: center; font-size: 18px; flex-shrink: 0; }
    nav.sidebar a span { opacity: 0; transition: opacity 0.2s ease; pointer-events: none; }
    nav.sidebar:hover a span { opacity: 1; transition-delay: 0.1s; }
    nav.sidebar a:hover { background:var(--hover); }
    nav.sidebar a.active { color:var(--coral); font-weight:700; background:rgba(211,84,0,0.08); }
    nav.sidebar a.active i { color:var(--coral); }
    
    /* Pinned Bottom Item */
    nav.sidebar .account-pin { margin-top: auto !important; margin-bottom: 0 !important; border-top: 1px solid var(--border); border-radius: 0; padding: 16px 8px; }
    
    /* Main Content Area */
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
    <span id="global-crumb" style="display:flex; align-items:center; padding-left:24px; font-weight:700; font-size: 15px;"></span>
    
    <span class="spacer"></span>
    <span class="header-actions">
      <button id="theme-toggle" title="Toggle Light/Dark Theme"><i class="fas fa-moon"></i></button>
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

// 2. Inject Shell into the DOM
document.getElementById('nanbi-root').innerHTML = UI_SHELL;

// 3. Initialize Theme Engine
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

function setTheme(mode) {
    if (mode === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('nanbi_theme', 'dark');
    } else {
        htmlEl.removeAttribute('data-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('nanbi_theme', 'light');
    }
}

// Load saved theme on boot
const savedTheme = localStorage.getItem('nanbi_theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
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

// 4. Core Routing Logic
function router() {
    const hash = location.hash || "#/";
    
    document.querySelectorAll("nav.sidebar a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === hash);
    });

    if (hash === "#/") {
        setCrumb("Home");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm"><h2 class="text-xl font-bold text-main">Home</h2><p class="text-sm mt-2 text-sub">V5.0 Modular Architecture active. Fluid layout established.</p></div>');
    } 
    else if (hash === "#/config") {
        setCrumb("Global Configuration");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm"><h2 class="text-xl font-bold text-main">Governance & Config</h2><p class="text-sm mt-2 text-sub">Initializing JSON ledger for Multilingual Hierarchy and Jurisdictional Protocols...</p></div>');
    }
    else if (hash === "#/regions") {
        setCrumb("Regions");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm" style="border-left: 4px solid var(--coral);"><h2 class="text-xl font-bold text-main"><i class="fas fa-lock mr-2" style="color:var(--coral);"></i>Module Locked</h2><p class="text-sm mt-2 text-sub">The Regions module relies on dynamic localization. Awaiting Configuration Engine initialization before deployment.</p></div>');
    }
    else if (hash === "#/settings") {
        setCrumb("Account Settings");
        renderView('<div class="surface-card p-5 flex-1 shadow-sm"><h2 class="text-xl font-bold text-main">Account Preferences</h2><p class="text-sm mt-2 text-sub">Cryptographic identities, localized preferences, and role-based access controls will be managed here.</p></div>');
    }
}

// 5. Initialize Router
window.addEventListener("hashchange", router);
router();
