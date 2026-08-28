// =======================================================================
// NANBI V5.0 MASTER ROUTER ENGINE
// =======================================================================
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb3JhY294eWp6Z3BzeXhnd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzgzNzUsImV4cCI6MjEwMzMxNDM3NX0.rNcvhRCw4KyfNpsWH6IYxlQT07zJ7i68Zg5jnpqj9yc";

// 1. Define the Global UI Shell (Header & Sidebar)
const UI_SHELL = `
  <style>
    :root { --navy:#1E293B; --teal:#527C79; --coral:#D35400; --bg:#F8FAFC; --card:#FFFFFF; --text:#0F172A; --muted:#475569; --border:#CBD5E1; --bar:56px; --rail:216px; --rail-collapsed:64px; }
    html, body { background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,sans-serif; }
    header.app { position:sticky; top:0; z-index:9999; background:var(--navy); color:#fff; height:var(--bar); display:flex; align-items:stretch; }
    header.app .brandbox { display:flex; align-items:center; gap:10px; padding:0 18px; width:var(--rail); transition:width 0.2s ease; }
    header.app h1 { font-size:17px; margin:0; font-weight:600; white-space:nowrap; }
    main { margin-left:var(--rail); padding:20px 24px; min-height:calc(100vh - var(--bar)); transition:margin-left 0.2s ease; }
    nav.bottom { position:fixed; top:var(--bar); bottom:0; left:0; width:var(--rail); background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; padding:10px 0; transition:width 0.2s ease; overflow-x:hidden; }
    nav.bottom a { display:flex; align-items:center; gap:12px; padding:11px 18px; margin:0 8px; border-radius:8px; font-size:14.5px; color:var(--muted); text-decoration:none; white-space:nowrap; }
    nav.bottom a:hover { background:rgba(82,124,121,.10); }
    nav.bottom a.active { color:var(--coral); font-weight:700; background:rgba(211,84,0,0.08); }
    nav.bottom a.active i { color:var(--coral); }
    body.sidebar-collapsed nav.bottom { width:var(--rail-collapsed); }
    body.sidebar-collapsed main { margin-left:var(--rail-collapsed); }
    body.sidebar-collapsed header.app .brandbox { width:var(--rail-collapsed); overflow:hidden; }
    body.sidebar-collapsed header.app h1 { display:none; }
  </style>
  
  <header class="app">
    <span class="brandbox">
      <button id="nav-toggle" style="background:transparent; border:none; color:white; cursor:pointer; font-size:18px; padding:4px;"><i class="fas fa-bars"></i></button>
      <h1>Nanbi Studio</h1>
    </span>
    <span id="global-crumb" style="display:flex; align-items:center; padding-left:16px; font-weight:700;"></span>
  </header>
  
  <nav class="bottom">
    <a href="#/" id="nav-home"><i class="fas fa-home w-5 text-center"></i> <span>Home</span></a>
    <a href="#/regions" id="nav-regions"><i class="fas fa-map-marked-alt w-5 text-center"></i> <span>Regions</span></a>
  </nav>
  
  <main id="app-content"></main>
`;

// 2. Inject Shell into the DOM
document.getElementById('nanbi-root').innerHTML = UI_SHELL;

// 3. Bind UI Interactions
document.getElementById('nav-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
});

function setCrumb(title) {
    document.getElementById('global-crumb').innerText = title;
}

function renderView(html) {
    // Clear out map instance if navigating away to prevent memory leaks
    if(window.nanbiActiveMap) { 
        window.nanbiActiveMap.remove(); 
        window.nanbiActiveMap = null; 
    }
    document.getElementById('app-content').innerHTML = html;
}

// 4. Core Routing Logic
function router() {
    const hash = location.hash || "#/";
    
    // Update active states on sidebar
    document.querySelectorAll("nav.bottom a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === hash);
    });

    // View Mapping
    if (hash === "#/") {
        setCrumb("Home");
        renderView('<div class="bg-white p-5 rounded border border-slate-200 shadow-sm"><h2 class="text-xl font-bold text-slate-800">Home</h2><p class="text-sm mt-2 text-slate-600">V5.0 Modular Architecture is active. Select a module from the sidebar.</p></div>');
    } 
    else if (hash === "#/regions") {
        setCrumb("Regions");
        renderView('<div id="regions-container" class="w-full h-full flex flex-col">Loading Spatial Engine...</div>');
        
        // Dynamically fetch and execute the isolated Regions module
        import('../modules/regions.js').then(module => {
            module.initRegionsModule('regions-container', SUPABASE_ANON_KEY);
        }).catch(err => {
            renderView(`<div class="bg-red-50 text-red-800 border border-red-200 p-4 rounded shadow-sm"><strong>Engine Failure:</strong> ${err.message}</div>`);
        });
    }
}

// 5. Initialize Router Event Listeners
window.addEventListener("hashchange", router);
router();
