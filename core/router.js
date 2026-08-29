// =======================================================================
// NANBI V5.0 MASTER ROUTER (STRICT CLOUD SSOT & ZERO-GAP)
// =======================================================================

const SUPABASE_URL = "https://yeoracoxyjzgpsyxgwri.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb3JhY294eWp6Z3BzeXhnd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzgzNzUsImV4cCI6MjEwMzMxNDM3NX0.rNcvhRCw4KyfNpsWH6IYxlQT07zJ7i68Zg5jnpqj9yc";
window.nanbiDB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let themeLedger = null;
let appLedger = null;
let themeKeys = [];

const FALLBACK_CSS = `
    :root {
        --bg: #F8FAFC; --card: #FFFFFF; --text: #0F172A; --muted: #64748B; --border: #E2E8F0;
        --brand-teal-dark: #2C4653; --brand-teal-light: #6A8B88; --brand-orange-dark: #D35400; --brand-orange-light: #E08A6D;
        --hover-bg: rgba(106, 139, 136, 0.15); --header-bg: #FFFFFF; --active-bg: #EEF2F2;
        --font-base: 16px; --bar: 60px; --sidebar-width: 72px; --sidebar-expanded: 250px;
        --icon-size: 1.15rem; --label-size: 0.95rem; --brand-size: 1.25rem; --header-title-size: 1.15rem;
        --main-padding: 40px; --card-radius: 8px;
    }
`;

function generateUIShell(appConfig) {
    return `
      <style>
        ` + FALLBACK_CSS + `
        html, body { background:var(--bg); color:var(--text); font-size:var(--font-base); font-family:var(--font-main, 'Nunito', system-ui, sans-serif); height: 100vh; margin: 0; overflow: hidden; display: flex; transition: background 0.3s, color 0.3s; }
        .text-main { color: var(--text); }
        .text-sub { color: var(--muted); }
        .app-wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        
        nav.sidebar { width: var(--sidebar-width); min-width: var(--sidebar-width); background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s; overflow-x: hidden; white-space: nowrap; z-index: 60; height: 100%; }
        nav.sidebar:hover { width: var(--sidebar-expanded); box-shadow: 4px 0 24px rgba(0,0,0,0.1); }
        
        .sidebar-brand { height: var(--bar); display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 8px; flex-shrink: 0; }
        .sidebar-brand img { height: 26px; width: auto; flex-shrink: 0; }
        .brand-text { font-family: var(--font-brand, 'Nunito', sans-serif); font-size: var(--brand-size); font-weight: 800; letter-spacing: -0.02em; margin-left: 12px; color: var(--brand-teal-dark); opacity: 0; transition: opacity 0.2s; }
        nav.sidebar:hover .sidebar-brand .brand-text { opacity: 1; transition-delay: 0.05s; }
        
        .sidebar-links { flex: 1; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; }
        nav.sidebar a { display:flex; align-items:center; height: 44px; margin: 8px 12px; border-radius:var(--card-radius); color:var(--brand-teal-dark); text-decoration:none; font-weight: 700; overflow: hidden; transition: background 0.15s; }
        nav.sidebar a .icon-box { width: 48px; min-width: 48px; display: flex; justify-content: center; align-items: center; font-size: var(--icon-size); transition: color 0.15s; }
        nav.sidebar a .nav-label { font-size: var(--label-size); opacity: 0; transition: opacity 0.2s ease; }
        nav.sidebar:hover a .nav-label { opacity: 1; transition-delay: 0.05s; }
        nav.sidebar a:hover, nav.sidebar a.active { background:var(--hover-bg); color: var(--brand-orange-dark); }
        nav.sidebar a:hover .icon-box, nav.sidebar a.active .icon-box { color: var(--brand-orange-dark); }
        
        .sidebar-divider { height: 1px; background: var(--border); margin: 8px 12px; }
        nav.sidebar .bottom-pin { margin-bottom: 16px; }
        
        .main-column { display: flex; flex-direction: column; flex: 1; overflow: hidden; background: var(--bg); transition: background 0.3s; }
        header.app-header { height: var(--bar); background: var(--header-bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; flex-shrink: 0; z-index: 40; transition: background 0.3s; }
        
        header.app-header .breadcrumb { display: flex; align-items: center; height: 100%; }
        .header-brand { font-family: var(--font-brand, 'Nunito', sans-serif); font-weight: 800; font-size: var(--header-title-size); color: var(--brand-teal-dark); letter-spacing: -0.02em; }
        .crumb-separator { font-size: 0.8rem; color: var(--muted); margin: 0 16px; opacity: 0.6; }
        header.app-header .section-crumb { font-weight: 700; font-size: 1.05rem; color: var(--text); }
        header.app-header .spacer { flex: 1; }
        
        .avatar-wrapper { position: relative; display: flex; align-items: center; }
        .avatar-btn { background: var(--brand-orange-dark); color: #FFF; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-family: var(--font-brand, 'Nunito', sans-serif); font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; margin-left: 8px; transition: transform 0.2s; }
        .avatar-btn:hover { transform: scale(1.05); }
        .dropdown-menu { display: none; position: absolute; right: 0; top: 44px; background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius); box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 250px; z-index: 100; flex-direction: column; overflow: hidden; }
        .dropdown-menu.show { display: flex; }
        .dropdown-header { padding: 16px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px; }
        .dropdown-header .d-name { font-family: var(--font-brand, 'Nunito', sans-serif); font-weight: 800; font-size: 0.95rem; color: var(--text); }
        .dropdown-header .d-email { font-size: 0.8rem; color: var(--muted); }
        .dropdown-item { padding: 12px 16px; font-size: 0.9rem; font-weight: 600; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 12px; transition: all 0.2s; cursor: pointer; }
        .dropdown-item i { width: 16px; text-align: center; color: var(--muted); transition: color 0.2s; }
        .dropdown-item:hover { background: var(--hover-bg); color: var(--brand-orange-dark); }
        .dropdown-item:hover i { color: var(--brand-orange-dark); }
        .dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
        
        main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
      </style>
      
      <div class="app-wrapper">
        <nav class="sidebar">
          <div class="sidebar-brand">
            <img src="icons/nanbi-monogram.svg" alt="nanbi" onerror="this.style.display='none'">
            <span class="brand-text" id="dom_brand_name">` + (appConfig.brand_name || 'nanbi') + `</span>
          </div>
          <div class="sidebar-links">
            <a href="#/" id="nav-home">
                <span class="icon-box"><i class="` + (appConfig.nav_home_icon || 'fas fa-home') + `" id="dom_nav_home_icon"></i></span>
                <span class="nav-label" id="dom_nav_home_label">` + (appConfig.nav_home_label || 'Home') + `</span>
            </a>
            <a href="#/config" id="nav-config">
                <span class="icon-box"><i class="` + (appConfig.nav_config_icon || 'fas fa-sliders-h') + `" id="dom_nav_config_icon"></i></span>
                <span class="nav-label" id="dom_nav_config_label">` + (appConfig.nav_config_label || 'Configuration') + `</span>
            </a>
            <a href="#/regions" id="nav-regions">
                <span class="icon-box"><i class="` + (appConfig.nav_regions_icon || 'fas fa-map-marked-alt') + `" id="dom_nav_regions_icon"></i></span>
                <span class="nav-label" id="dom_nav_regions_label">` + (appConfig.nav_regions_label || 'Regions') + `</span>
            </a>
          </div>
          <div class="sidebar-divider"></div>
          <a href="#/settings" class="bottom-pin" id="nav-settings">
              <span class="icon-box"><i class="` + (appConfig.nav_settings_icon || 'fas fa-cog') + `" id="dom_nav_settings_icon"></i></span>
              <span class="nav-label" id="dom_nav_settings_label">` + (appConfig.nav_settings_label || 'Studio Settings') + `</span>
          </a>
        </nav>

        <div class="main-column">
          <header class="app-header">
            <div class="breadcrumb">
              <span class="header-brand" id="dom_header_title">` + (appConfig.header_title || 'nanbi studio') + `</span>
              <i class="fas fa-chevron-right crumb-separator"></i>
              <span id="global-crumb" class="section-crumb"></span>
            </div>
            <span class="spacer"></span>
            <div class="header-actions">
              <div class="avatar-wrapper">
                <button class="avatar-btn" id="avatar-toggle" title="Account Menu">` + (appConfig.avatar_initial || 'N') + `</button>
                <div class="dropdown-menu" id="account-dropdown">
                    <div class="dropdown-header">
                        <span class="d-name">` + (appConfig.dropdown_identity || 'Sovereign Identity') + `</span>
                        <span class="d-email">` + (appConfig.dropdown_node || 'Active Edge Node') + `</span>
                    </div>
                    <a class="dropdown-item" id="dropdown-theme-toggle" style="cursor: pointer;"><i id="theme-icon" class="fas fa-sun"></i><span id="theme-label">Appearance</span></a>
                    <div class="dropdown-divider"></div>
                    <a href="#/account" class="dropdown-item"><i class="fas fa-shield-alt"></i> ` + (appConfig.menu_sovereignty || 'Data Sovereignty') + `</a>
                    <a href="#/account" class="dropdown-item"><i class="fas fa-key"></i> ` + (appConfig.menu_keys || 'Cryptographic Keys') + `</a>
                    <div class="dropdown-divider"></div>
                    <a href="#/account" class="dropdown-item"><i class="fas fa-id-badge"></i> ` + (appConfig.menu_tier || 'Subscription Tier') + `</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" style="color: var(--brand-orange-dark); cursor: pointer;"><i class="fas fa-sign-out-alt" style="color: var(--brand-orange-dark);"></i> ` + (appConfig.menu_disconnect || 'Disconnect Node') + `</a>
                </div>
              </div>
            </div>
          </header>
          <main id="app-content"></main>
        </div>
      </div>
    `;
}

// 2. Strict Cloud Bootloader Engine (Fail Fast Protocol)
async function bootloader() {
    try {
        // STRICT CLOUD AUDIT: Fetches exclusively from Supabase Database
        const { data, error } = await window.nanbiDB.from('nanbi_ledgers').select('*');
        if (error) throw new Error("Cloud DB Error: " + error.message);
        if (!data || data.length === 0) throw new Error("Ledgers missing in Supabase.");

        const rawTheme = data.find(r => r.ledger_name === 'theme_manifest');
        const rawApp = data.find(r => r.ledger_name === 'app_manifest');

        if (!rawTheme) throw new Error("theme_manifest missing in DB");
        if (!rawApp) throw new Error("app_manifest missing in DB");

        themeLedger = rawTheme.payload;
        const baseAppConfig = rawApp.payload;

        const userAppConfig = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
        appLedger = Object.assign({}, baseAppConfig, userAppConfig);

        themeKeys = Object.keys(themeLedger.themes);
        const savedTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;

        let rootNode = document.getElementById('nanbi-root');
        if(!rootNode) {
            rootNode = document.createElement('div');
            rootNode.id = 'nanbi-root';
            document.body.appendChild(rootNode);
        }
        
        rootNode.innerHTML = generateUIShell(appLedger);

        applyTheme(savedTheme);
        attachShellEvents();
        
        window.addEventListener("hashchange", router);
        router();

    } catch (e) {
        // STRICT ERROR BOUNDARY
        document.body.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#0F172A; color:#F8FAFC; font-family:monospace; text-align:center;"><div style="background:#7F1D1D; border: 1px solid #EF4444; padding:32px; border-radius:8px; max-width:600px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);"><h2 style="margin-top:0; color:#FECACA; font-size: 24px;">SYSTEM HALT</h2><p style="font-size:16px; margin: 16px 0; color:#FCA5A5;">Cloud Bootloader Integrity Failure</p><div style="background:#450a0a; padding: 12px; border-radius: 4px; color:#f87171; font-weight:bold; margin-bottom: 16px;">' + e.message + '</div></div></div>';
        console.error("Bootloader Halted:", e);
    }
}

// 3. Theme Application Engine
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
    
    if(iconEl) iconEl.className = 'fas ' + baseThemeData.icon;
    if(labelEl) labelEl.innerText = 'Theme: ' + baseThemeData.name;
    
    localStorage.setItem('nanbi_theme', themeId);
}

// 4. Shell Interaction Events
function attachShellEvents() {
    const avatarBtn = document.getElementById('avatar-toggle');
    const dropdownMenu = document.getElementById('account-dropdown');

    if(avatarBtn && dropdownMenu) {
        avatarBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.classList.toggle('show'); });
        document.addEventListener('click', (e) => { if (!dropdownMenu.contains(e.target) && e.target !== avatarBtn) dropdownMenu.classList.remove('show'); });
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
}

// 5. Navigation Utilities
function setCrumb(title) { 
    const crumbEl = document.getElementById('global-crumb');
    if(crumbEl) crumbEl.innerText = title; 
}

function renderView(html) {
    if(window.nanbiActiveMap) { window.nanbiActiveMap.remove(); window.nanbiActiveMap = null; }
    const contentEl = document.getElementById('app-content');
    if(contentEl) contentEl.innerHTML = '<div class="flex-1 w-full h-full" style="padding: var(--main-padding);">' + html + '</div>';
}

// 6. Primary Routing Engine
function router() {
    try {
        const hash = location.hash || "#/";
        
        document.querySelectorAll("nav.sidebar a").forEach(a => {
            const path = a.getAttribute("href");
            a.classList.toggle("active", hash === path || (path !== "#/" && hash.startsWith(path)));
        });

        if (hash === "#/") {
            setCrumb(appLedger.nav_home_label || "Home");
            renderView('<h2 style="font-size: var(--header-title-size); font-weight: bold; color: var(--text);">Welcome to ' + (appLedger.header_title || 'nanbi studio') + '</h2><p style="font-size: var(--label-size); margin-top: 8px; color: var(--muted);">V5.0 Modular Architecture active. Layout is completely flat and immersive.</p>');
        } 
        else if (hash === "#/config") {
            setCrumb(appLedger.nav_config_label || "Configuration");
            renderView('<div id="config-hub-container" class="w-full h-full">Loading Hub...</div>');
            import('../modules/config_hub.js').then(m => m.initConfigHub('config-hub-container')).catch(e => {
                document.getElementById('config-hub-container').innerHTML = '<div style="color:red; font-weight:bold;">Failed to load Hub module.</div>';
            });
        }
        else if (hash === "#/config/presentation") {
            setCrumb("Presentation Engine");
            renderView('<div id="config-pres-container" class="w-full h-full">Loading Engine...</div>');
            import('../modules/config/presentation.js').then(m => m.initPresentationEngine('config-pres-container')).catch(e => {
                document.getElementById('config-pres-container').innerHTML = '<div style="color:red; font-weight:bold;">Failed to load Engine module.</div>';
            });
        }
        else if (hash === "#/regions") {
            setCrumb(appLedger.nav_regions_label || "Regions");
            renderView('<div style="background: var(--active-bg); border-left: 4px solid var(--brand-orange-dark); padding: var(--main-padding); border-radius: var(--card-radius);"><h2 style="font-size: var(--header-title-size); font-weight: bold; color: var(--brand-orange-dark);"><i class="fas fa-lock" style="margin-right: 12px;"></i>Module Locked</h2><p style="font-size: var(--label-size); margin-top: 8px; color: var(--text); font-weight: 600;">Awaiting Regional Taxonomy JSON payload.</p></div>');
        }
        else if (hash === "#/settings") {
            setCrumb(appLedger.nav_settings_label || "Studio Settings");
            renderView('<h2 style="font-size: var(--header-title-size); font-weight: bold; color: var(--text);">' + (appLedger.nav_settings_label || 'Studio Settings') + '</h2><p style="font-size: var(--label-size); margin-top: 8px; color: var(--muted);">Platform-level configurations.</p>');
        }
        else if (hash === "#/account") {
            setCrumb("Account Profile");
            renderView('<h2 style="font-size: var(--header-title-size); font-weight: bold; color: var(--text);">Data Sovereignty</h2><p style="font-size: var(--label-size); margin-top: 8px; color: var(--muted);">Manage cryptographic credentials.</p>');
        }
    } catch (e) {
        console.error("Routing error:", e);
    }
}

// 7. Execute Bootloader
bootloader();
