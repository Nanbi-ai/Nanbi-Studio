// =======================================================================
// NANBI V5.0 MASTER ROUTER ENGINE
// =======================================================================
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb3JhY294eWp6Z3BzeXhnd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzgzNzUsImV4cCI6MjEwMzMxNDM3NX0.rNcvhRCw4KyfNpsWH6IYxlQT07zJ7i68Zg5jnpqj9yc";

// 1. Define the Global UI Shell (Hover Sidebar, Logo, Nav Arrows, Account)
const UI_SHELL = `
  <style>
    :root { --navy:#1E293B; --teal:#527C79; --coral:#D35400; --bg:#F8FAFC; --card:#FFFFFF; --text:#0F172A; --muted:#475569; --border:#CBD5E1; --bar:56px; }
    html, body { background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,sans-serif; height: 100vh; margin: 0; overflow: hidden; display: flex; flex-direction: column; }
    
    /* Header Styles */
    header.app { background:var(--navy); color:#fff; height:var(--bar); display:flex; align-items:center; padding:0 16px; flex-shrink: 0; z-index: 50; }
    header.app .brandbox { display:flex; align-items:center; gap:12px; width:200px; }
    header.app .brandbox img { height: 26px; width: auto; }
    header.app h1 { font-size:17px; margin:0; font-weight:600; white-space:nowrap; }
    header.app .nav-arrows { display: flex; gap: 8px; margin-left: 20px; }
    header.app .nav-arrows button { background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    header.app .nav-arrows button:hover { background: rgba(255,255,255,0.2); }
    
    /* Layout Body */
    .app-body { display: flex; flex: 1; overflow: hidden; }
    
    /* Supabase-Style Hover Sidebar */
    nav.sidebar { width: 64px; background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; transition: width 0.2s ease, box-shadow 0.2s ease; overflow-x: hidden; white-space: nowrap; z-index: 40; }
    nav.sidebar:hover { width: 240px; box-shadow: 4px 0 15px rgba(0,0,0,0.05); }
    nav.sidebar a { display:flex; align-items:center; padding:12px 0; margin: 8px; border-radius:8px; font-size:14.5px; color:var(--muted); text-decoration:none; transition: background 0.1s; }
    nav.sidebar a i { width: 48px; text-align: center; font-size: 18px; flex-shrink: 0; }
    nav.sidebar a span { opacity: 0; transition: opacity 0.2s ease; pointer-events: none; }
    nav.sidebar:hover a span { opacity: 1; transition-delay: 0.1s; }
    nav.sidebar a:hover { background:rgba(82,124,121,.10); }
    nav.sidebar a.active { color:var(--coral); font-weight:700; background:rgba(211,84,0,0.08); }
    nav.sidebar a.active i { color:var(--coral); }
    nav.sidebar .account-pin { margin-top: auto; border-top: 1px solid var(--border); border-radius: 0; margin: auto 0 0 0; padding: 16px 8px; }
    
    /* Main Content Area - Fluid Flexbox for 3:2 Ratio Support */
    main { flex: 1; padding: 24px; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; }
  </style>
  
  <header class="app">
    <span class="brandbox">
      <img src="icons/nanbi-monogram.svg" alt="Nanbi" onerror="this.style.display='none'">
      <h1>Nanbi Studio</h1>
    </span>
    <span class="nav-arrows">
      <button onclick="history.back()" title="Back"><i class="fas fa-chevron-left"></i></button>
      <button onclick="history.forward()" title="Forward"><i class="fas fa-chevron-right"></i></button>
    </span>
    <span id="global-crumb" style="display:flex; align-items:center; padding-left:24px; font-weight:700; font-size: 15px;"></span>
  </header>
  
  <div class="app-body">
    <nav class="sidebar">
      <a href="#/" id="nav-home"><i class="fas fa-home"></i> <span>Home</span></a>
      <a href="#/config" id="nav-config"><i class="fas fa-cogs"></i> <span>Configuration</span></a>
      <a href="#/regions" id="nav-regions"><i class="fas fa-map-marked-alt"></i> <span>Regions</span></a>
      
      <a href="#/settings" class="account-pin"><i class="fas fa-user-circle"></i> <span>Account Settings</span></a>
    </nav>
    
    <main id="app-content"></main>
  </div>
`;

// 2. Inject Shell into the DOM
document.getElementById('nanbi-root').innerHTML = UI_SHELL;

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
        renderView('<div class="bg-white p-5 rounded border border-slate-200 shadow-sm flex-1"><h2 class="text-xl font-bold text-slate-800">Home</h2><p class="text-sm mt-2 text-slate-600">V5.0 Modular Architecture active. Fluid layout established.</p></div>');
    } 
    else if (hash === "#/config") {
        setCrumb("Global Configuration");
        renderView('<div class="bg-white p-5 rounded border border-slate-200 shadow-sm flex-1"><h2 class="text-xl font-bold text-slate-800">Governance & Config</h2><p class="text-sm mt-2 text-slate-600">Initializing JSON ledger for Multilingual Hierarchy and Jurisdictional Protocols...</p></div>');
    }
    else if (hash === "#/regions") {
        setCrumb("Regions");
        // Module temporarily halted pending Configuration Ledger completion
        renderView('<div class="bg-amber-50 p-5 rounded border border-amber-200 shadow-sm flex-1"><h2 class="text-xl font-bold text-amber-800"><i class="fas fa-lock mr-2"></i>Module Locked</h2><p class="text-sm mt-2 text-amber-700">The Regions module relies on dynamic localization (Country > State > District > Taluk > Ward). Awaiting Configuration Engine initialization before deployment.</p></div>');
    }
}

// 4. Initialize Router
window.addEventListener("hashchange", router);
router();
