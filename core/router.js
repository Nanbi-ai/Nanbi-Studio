import { CryptoEngine } from './crypto_engine.js';

// =======================================================================
// NANBI V5.0 MASTER ROUTER (UNIVERSAL SWITCHBOARD & E2E CRYPTO)
// =======================================================================

const SUPABASE_URL = "https://yeoracoxyjzgpsyxgwri.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb3JhY294eWp6Z3BzeXhnd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzgzNzUsImV4cCI6MjEwMzMxNDM3NX0.rNcvhRCw4KyfNpsWH6IYxlQT07zJ7i68Zg5jnpqj9yc";
window.nanbiDB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let themeLedger = null;
let appLedger = null;
let themeKeys = [];

const BASELINE_APP = {
    brand_name: "nanbi", header_title: "nanbi studio",
    avatar_initial: "N", dropdown_identity: "Sovereign Identity", dropdown_node: "Active Edge Node",
    page_home_title: "Welcome", page_home_subtitle: "Modular Architecture Active.",
    page_regions_title: "Module Locked", page_regions_subtitle: "Awaiting Taxonomy Payload.",
    page_settings_title: "System Settings", page_settings_subtitle: "Platform-level configurations.",
    page_account_title: "Data Sovereignty", page_account_subtitle: "Manage cryptographic credentials and session states.",
    page_loading_text: "Loading...", page_error_text: "Module Load Failure",
    active_modules: [
        { id: "home", path: "#/", icon: "fas fa-home", label: "Home", locked: true, sort_order: 0, access_level: ["Founder"] },
        { id: "config", path: "#/config", icon: "fas fa-sliders-h", label: "Configuration", locked: false, sort_order: 1, access_level: ["Founder"] },
        { id: "regions", path: "#/regions", icon: "fas fa-map-marked-alt", label: "Regions", locked: false, sort_order: 2, access_level: ["Founder"] },
        { id: "settings", path: "#/settings", icon: "fas fa-cog", label: "Studio Settings", locked: false, sort_order: 99, access_level: ["Founder"] }
    ]
};

const BASELINE_THEME_VARS = {
    "--bg": "#F8FAFC", "--card": "#FFFFFF", "--text": "#0F172A", "--muted": "#64748B", "--border": "#E2E8F0",
    "--brand-teal-dark": "#2C4653", "--brand-teal-light": "#6A8B88", "--brand-orange-dark": "#D35400", "--brand-orange-light": "#E08A6D",
    "--hover-bg": "rgba(106, 139, 136, 0.15)", "--header-bg": "#FFFFFF", "--active-bg": "#EEF2F2",
    "--font-base": "16px", "--font-brand": "'Nunito', sans-serif", "--font-main": "'Nunito', sans-serif",
    "--weight-brand": "800", "--weight-main": "400", "--weight-bold": "700",
    "--page-title-color": "#0F172A", "--page-subtitle-color": "#64748B",
    "--page-title-size": "1.875rem", "--page-subtitle-size": "1.125rem", "--spacing-sm": "8px",
    "--bar": "60px", "--sidebar-width": "72px", "--sidebar-expanded": "250px",
    "--icon-size": "1.15rem", "--label-size": "0.95rem", "--brand-size": "1.25rem", "--header-title-size": "1.15rem",
    "--main-padding": "40px", "--card-radius": "8px"
};

function generateUIShell(appConfig) {
    const sortedModules = (appConfig.active_modules || []).sort((a, b) => a.sort_order - b.sort_order);
    
    let dynamicLinksHTML = '';
    let settingsLinkHTML = '';
    
    sortedModules.forEach(mod => {
        const linkHTML = `<a href="${mod.path}" id="nav-${mod.id}">
            <span class="icon-box"><i class="${mod.icon}" id="dom_nav_${mod.id}_icon"></i></span>
            <span class="nav-label" id="dom_nav_${mod.id}_label">${mod.label}</span>
        </a>`;
        
        if (mod.id === 'settings') {
            settingsLinkHTML = linkHTML.replace('<a ', '<a class="bottom-pin" ');
        } else {
            dynamicLinksHTML += linkHTML;
        }
    });

    return `
      <style>
        html, body { background:var(--bg); color:var(--text); font-size:var(--font-base); font-family:var(--font-main); font-weight:var(--weight-main); height: 100vh; margin: 0; overflow: hidden; display: flex; transition: background 0.3s, color 0.3s; }
        .text-main { color: var(--text); }
        .text-sub { color: var(--muted); }
        .app-wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; }
        
        nav.sidebar { width: var(--sidebar-width); min-width: var(--sidebar-width); background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s; overflow-x: hidden; white-space: nowrap; z-index: 60; height: 100%; }
        nav.sidebar:hover { width: var(--sidebar-expanded); box-shadow: 4px 0 24px rgba(0,0,0,0.1); }
        
        .sidebar-brand { height: var(--bar); display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--border); margin-bottom: var(--spacing-sm); flex-shrink: 0; }
        .sidebar-brand img { height: 26px; width: auto; flex-shrink: 0; }
        .brand-text { font-family: var(--font-brand); font-size: var(--brand-size); font-weight: var(--weight-brand); letter-spacing: -0.02em; margin-left: 12px; color: var(--brand-teal-dark); opacity: 0; transition: opacity 0.2s; }
        nav.sidebar:hover .sidebar-brand .brand-text { opacity: 1; transition-delay: 0.05s; }
        
        .sidebar-links { flex: 1; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; }
        nav.sidebar a { display:flex; align-items:center; height: 44px; margin: 8px 12px; border-radius:var(--card-radius); color:var(--brand-teal-dark); text-decoration:none; font-weight: var(--weight-bold); overflow: hidden; transition: background 0.15s; }
        nav.sidebar a .icon-box { width: 48px; min-width: 48px; display: flex; justify-content: center; align-items: center; font-size: var(--icon-size); transition: color 0.15s; }
        nav.sidebar a .nav-label { font-size: var(--label-size); opacity: 0; transition: opacity 0.2s ease; }
        nav.sidebar:hover a .nav-label { opacity: 1; transition-delay: 0.05s; }
        nav.sidebar a:hover, nav.sidebar a.active { background:var(--active-bg); color: var(--brand-orange-dark); }
        nav.sidebar a:hover .icon-box, nav.sidebar a.active .icon-box { color: var(--brand-orange-dark); }
        
        .sidebar-divider { height: 1px; background: var(--border); margin: 8px 12px; }
        nav.sidebar .bottom-pin { margin-bottom: 16px; }
        
        .main-column { display: flex; flex-direction: column; flex: 1; overflow: hidden; background: var(--bg); transition: background 0.3s; }
        header.app-header { height: var(--bar); background: var(--header-bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; flex-shrink: 0; z-index: 40; transition: background 0.3s; }
        
        header.app-header .breadcrumb { display: flex; align-items: center; height: 100%; }
        .header-brand { font-family: var(--font-brand); font-weight: var(--weight-brand); font-size: var(--header-title-size); color: var(--brand-teal-dark); letter-spacing: -0.02em; }
        .crumb-separator { font-size: var(--label-size); color: var(--muted); margin: 0 16px; opacity: 0.6; }
        header.app-header .section-crumb { font-weight: var(--weight-bold); font-size: var(--label-size); color: var(--text); }
        header.app-header .spacer { flex: 1; }
        
        /* Dropdown Restored Styles */
        .avatar-wrapper { position: relative; display: flex; align-items: center; }
        .avatar-btn { background: var(--brand-orange-dark); color: var(--card); border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-family: var(--font-brand); font-weight: var(--weight-brand); font-size: var(--label-size); display: flex; align-items: center; justify-content: center; margin-left: 8px; transition: transform 0.2s; }
        .avatar-btn:hover { transform: scale(1.05); }
        
        .avatar-dropdown { position: absolute; top: 48px; right: 0; background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius); box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 220px; display: none; flex-direction: column; z-index: 100; overflow: hidden; }
        .avatar-dropdown.show { display: flex; }
        .avatar-dropdown-header { padding: 16px; border-bottom: 1px solid var(--border); background: var(--bg); }
        .avatar-dropdown-header .identity { font-weight: var(--weight-bold); font-size: 0.9rem; color: var(--text); }
        .avatar-dropdown-header .node { font-size: 0.75rem; color: var(--brand-orange-dark); margin-top: 4px; font-weight: var(--weight-bold); }
        .avatar-dropdown a { padding: 12px 16px; color: var(--text); text-decoration: none; font-size: 0.85rem; font-weight: var(--weight-bold); display: flex; align-items: center; transition: background 0.2s; }
        .avatar-dropdown a i { width: 24px; color: var(--brand-teal-dark); }
        .avatar-dropdown a:hover { background: var(--active-bg); color: var(--brand-orange-dark); }
        .avatar-dropdown a:hover i { color: var(--brand-orange-dark); }
        
        main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
      </style>
      
      <div class="app-wrapper">
        <nav class="sidebar">
          <div class="sidebar-brand">
            <img src="icons/nanbi-monogram.svg" alt="" onerror="this.style.display='none'">
            <span class="brand-text" id="dom_brand_name">${appConfig.brand_name}</span>
          </div>
          
          <div class="sidebar-links" id="dynamic-sidebar-links">
            ${dynamicLinksHTML}
          </div>
          
          <div class="sidebar-divider"></div>
          ${settingsLinkHTML}
        </nav>

        <div class="main-column">
          <header class="app-header">
            <div class="breadcrumb">
              <span class="header-brand" id="dom_header_title">${appConfig.header_title}</span>
              <i class="fas fa-chevron-right crumb-separator"></i>
              <span id="global-crumb" class="section-crumb"></span>
            </div>
            <span class="spacer"></span>
            <div class="header-actions">
              <div class="avatar-wrapper">
                <button class="avatar-btn" id="avatar-toggle" title="Account Menu">${appConfig.avatar_initial}</button>
                <div class="avatar-dropdown" id="account-dropdown">
                   <div class="avatar-dropdown-header">
                      <div class="identity" id="dom_dropdown_identity">${appConfig.dropdown_identity}</div>
                      <div class="node"><i class="fas fa-network-wired mr-1"></i> <span id="dom_dropdown_node">${appConfig.dropdown_node}</span></div>
                   </div>
                   <a href="#/account"><i class="fas fa-shield-alt"></i> Data Sovereignty</a>
                </div>
              </div>
            </div>
          </header>
          <main id="app-content"></main>
        </div>
      </div>
    `;
}

async function bootloader() {
    try {
        const { data, error } = await window.nanbiDB.from('nanbi_ledgers').select('*');
        if (error || !data || data.length === 0) throw new Error("Cloud sync failed or empty.");

        const rawTheme = data.find(r => r.ledger_name === 'theme_manifest');
        const rawApp = data.find(r => r.ledger_name === 'app_manifest');

        if (rawTheme?.iv_signature) {
            themeLedger = await CryptoEngine.decryptPayload(rawTheme.payload, rawTheme.iv_signature);
        } else {
            themeLedger = rawTheme?.payload; 
        }

        let fetchedAppConfig = {};
        if (rawApp?.iv_signature) {
            fetchedAppConfig = await CryptoEngine.decryptPayload(rawApp.payload, rawApp.iv_signature);
        } else {
            fetchedAppConfig = rawApp?.payload || {}; 
        }

        localStorage.setItem('nanbi_edge_theme', JSON.stringify(themeLedger));
        localStorage.setItem('nanbi_edge_app', JSON.stringify(fetchedAppConfig));

        const userAppConfig = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
        appLedger = Object.assign({}, BASELINE_APP, fetchedAppConfig, userAppConfig);

    } catch (e) {
        console.warn("Cloud connection interrupted. Booting from Edge TEE Cache.", e);
        const edgeTheme = localStorage.getItem('nanbi_edge_theme');
        const edgeApp = localStorage.getItem('nanbi_edge_app');
        
        if (edgeTheme && edgeApp) {
            themeLedger = JSON.parse(edgeTheme);
            const userAppConfig = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
            appLedger = Object.assign({}, BASELINE_APP, JSON.parse(edgeApp), userAppConfig);
        } else {
            themeLedger = { themes: { default: { variables: BASELINE_THEME_VARS, icon: 'fa-sun', name: 'Default' } }, active_default: 'default' };
            appLedger = Object.assign({}, BASELINE_APP);
        }
    }

    themeKeys = Object.keys(themeLedger.themes);
    const savedTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;

    let rootNode = document.getElementById('nanbi-root');
    if(!rootNode) {
        rootNode = document.createElement('div');
        rootNode.id = 'nanbi-root';
        document.body.appendChild(rootNode);
    }
    
    rootNode.innerHTML = generateUIShell(appLedger);

    // Dropdown Event Listener Restored
    const avatarBtn = document.getElementById('avatar-toggle');
    const accountDropdown = document.getElementById('account-dropdown');
    if (avatarBtn && accountDropdown) {
        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accountDropdown.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!accountDropdown.contains(e.target) && e.target !== avatarBtn) {
                accountDropdown.classList.remove('show');
            }
        });
    }

    applyTheme(savedTheme);
    window.addEventListener("hashchange", router);
    router();
}

function applyTheme(themeId) {
    if (!themeLedger || !themeLedger.themes[themeId]) return;
    const root = document.documentElement;
    const baseThemeData = themeLedger.themes[themeId];
    const userCustomConfig = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + themeId)) || {};
    
    for (const [key, value] of Object.entries(BASELINE_THEME_VARS)) {
        const themeVal = baseThemeData.variables[key];
        const finalVal = userCustomConfig[key] ?? themeVal ?? value;
        root.style.setProperty(key, finalVal);
    }
    localStorage.setItem('nanbi_theme', themeId);
}

function setCrumb(title) { 
    const crumbEl = document.getElementById('global-crumb');
    if(crumbEl) crumbEl.innerText = title || ''; 
}

function renderView(html) {
    const contentEl = document.getElementById('app-content');
    if(contentEl) contentEl.innerHTML = '<div class="flex-1 w-full h-full" style="padding: var(--main-padding);">' + html + '</div>';
}

function router() {
    try {
        const hash = location.hash || "#/";
        
        document.querySelectorAll("nav.sidebar a").forEach(a => {
            const path = a.getAttribute("href");
            a.classList.toggle("active", hash === path || (path !== "#/" && hash.startsWith(path)));
        });

        const activeModule = (appLedger.active_modules || []).find(m => m.path === hash || (m.path !== "#/" && hash.startsWith(m.path)));
        if (activeModule) {
            setCrumb(activeModule.label);
        } else {
            setCrumb("");
        }

        if (hash === "#/") {
            renderView('<h2 style="font-size: var(--page-title-size); font-weight: var(--weight-bold); font-family: var(--font-brand); color: var(--page-title-color);">' + appLedger.page_home_title + '</h2><p style="font-size: var(--page-subtitle-size); margin-top: var(--spacing-sm); color: var(--page-subtitle-color);">' + appLedger.page_home_subtitle + '</p>');
        } 
        else if (hash === "#/config") {
            renderView('<div id="config-hub-container" class="w-full h-full"><p style="font-weight: var(--weight-bold); color: var(--muted);">' + appLedger.page_loading_text + '</p></div>');
            import('../modules/config_hub.js').then(m => m.initConfigHub('config-hub-container')).catch(e => {
                document.getElementById('config-hub-container').innerHTML = '<div style="color:red; font-weight:var(--weight-bold);">' + appLedger.page_error_text + '</div>';
            });
        }
        else if (hash === "#/config/presentation") {
            setCrumb("Presentation Engine");
            renderView('<div id="config-pres-container" class="w-full h-full"><p style="font-weight: var(--weight-bold); color: var(--muted);">' + appLedger.page_loading_text + '</p></div>');
            import('../modules/config/presentation.js').then(m => m.initPresentationEngine('config-pres-container')).catch(e => {
                document.getElementById('config-pres-container').innerHTML = '<div style="color:red; font-weight:var(--weight-bold);">' + appLedger.page_error_text + '</div>';
            });
        }
        else if (hash === "#/regions") {
            renderView('<div style="background: var(--active-bg); border-left: 4px solid var(--brand-orange-dark); padding: var(--main-padding); border-radius: var(--card-radius);"><h2 style="font-size: var(--page-title-size); font-family: var(--font-brand); font-weight: var(--weight-bold); color: var(--brand-orange-dark);"><i class="fas fa-lock" style="margin-right: 12px;"></i>' + appLedger.page_regions_title + '</h2></div>');
        }
        else if (hash === "#/account") {
            setCrumb("Data Sovereignty");
            renderView('<div style="background: var(--active-bg); padding: var(--main-padding); border-radius: var(--card-radius);"><h2 style="font-size: var(--page-title-size); font-family: var(--font-brand); font-weight: var(--weight-bold); color: var(--brand-teal-dark);"><i class="fas fa-shield-alt" style="margin-right: 12px;"></i>' + appLedger.page_account_title + '</h2><p style="margin-top: 8px; font-weight: var(--weight-bold); color: var(--muted);">' + appLedger.page_account_subtitle + '</p></div>');
        }
    } catch (e) {
        console.error("Routing error:", e);
    }
}

bootloader();
