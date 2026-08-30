import { CryptoEngine } from '../../core/crypto_engine.js';

export async function initPresentationEngine(containerId) {
    const container = document.getElementById(containerId);
    
    let themeLedger, appLedger;
    try {
        const { data, error } = await window.nanbiDB.from('nanbi_ledgers').select('*');
        if (error) throw error;
        
        const rawTheme = data.find(r => r.ledger_name === 'theme_manifest');
        const rawApp = data.find(r => r.ledger_name === 'app_manifest');

        // DECRYPT PAYLOADS (with fallback for legacy plaintext during transition)
        if (rawTheme?.iv_signature) {
            themeLedger = await CryptoEngine.decryptPayload(rawTheme.payload, rawTheme.iv_signature);
        } else {
            themeLedger = rawTheme?.payload;
        }

        if (rawApp?.iv_signature) {
            appLedger = await CryptoEngine.decryptPayload(rawApp.payload, rawApp.iv_signature);
        } else {
            appLedger = rawApp?.payload || {};
        }

    } catch(err) {
        container.innerHTML = `<div style="color:red; font-weight:bold;">Gateway Error: Cloud Ledgers Offline or Decryption Failed.</div>`;
        return;
    }

    const currentTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
    const baseVars = themeLedger.themes[currentTheme].variables;
    
    const customVars = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + currentTheme)) || {};
    const customAppVars = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
    
    const getVal = (key, defVal) => customVars[key] ?? baseVars[key] ?? defVal;
    const getAppVal = (key, defVal) => customAppVars[key] ?? appLedger[key] ?? defVal;

    // SMART GATEWAY DOM GENERATORS
    const makeThemeInput = (label, key, rules, defVal, width="w-20") => {
        const valStr = JSON.stringify(rules).replace(/"/g, '&quot;');
        return `
        <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]">
            <span class="font-bold text-main" style="font-size: 0.85rem;">${label}</span>
            <input type="text" class="${width} p-1 border rounded gateway-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-target="theme" data-key="${key}" data-validation="${valStr}" data-default="${defVal}" value="${getVal(key, defVal)}">
        </div>`;
    };

    const makeColor = (label, key, defVal) => {
        const valStr = JSON.stringify({ type: 'color', allowEmpty: false }).replace(/"/g, '&quot;');
        return `
        <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]">
            <span class="font-bold text-main" style="font-size: 0.85rem;">${label}</span>
            <input type="color" class="w-10 h-8 rounded gateway-input cursor-pointer border-0 bg-transparent" data-target="theme" data-key="${key}" data-validation="${valStr}" data-default="${defVal}" value="${getVal(key, defVal)}">
        </div>`;
    };

    const makeAppInput = (label, key, rules, defVal) => {
        const valStr = JSON.stringify(rules).replace(/"/g, '&quot;');
        return `
        <div class="flex flex-col py-2 border-b border-[color:var(--border)]">
            <span class="font-bold text-main mb-1" style="font-size: 0.85rem;">${label}</span>
            <input type="text" class="w-full p-2 border rounded gateway-input text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-target="app" data-key="${key}" data-validation="${valStr}" data-default="${defVal}" value="${getAppVal(key, defVal)}">
        </div>`;
    };

    container.innerHTML = `
      <div class="flex-1 w-full max-w-[1400px]">
        <div class="flex items-center gap-4 mb-2">
            <button onclick="history.back()" class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors" style="background: var(--card); border: 1px solid var(--border); color: var(--text);">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="font-size: var(--header-title-size, 1.15rem); font-weight: var(--weight-bold, 700); font-family: var(--font-brand); color: var(--text);">Presentation & Validation Gateway</h2>
        </div>
        
        <div class="mb-8 p-3 rounded" style="background: var(--active-bg); border-left: 3px solid var(--brand-orange-dark); margin-left: 48px;">
            <p style="font-size: var(--label-size, 0.95rem); font-weight: var(--weight-bold, 700); color: var(--text);">Editing Theme: <span style="color: var(--brand-orange-dark); text-transform: uppercase;">${currentTheme}</span></p>
            <p style="font-size: 0.8rem; margin-top: 4px; color: var(--muted);">Smart Gateway & E2E Crypto Active: Data is validated at entry and encrypted locally prior to Supabase transit.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6" style="margin-left: 48px;">
            
            <div class="flex flex-col gap-6">
                <div class="p-5" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius, 8px);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1rem;"><i class="fas fa-palette mr-2"></i>Brand Colors</h3>
                    ${makeColor("Dark Teal", "--brand-teal-dark", "#2C4653")}
                    ${makeColor("Light Teal", "--brand-teal-light", "#6A8B88")}
                    ${makeColor("Dark Orange", "--brand-orange-dark", "#D35400")}
                    ${makeColor("Light Orange", "--brand-orange-light", "#E08A6D")}
                </div>

                <div class="p-5" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius, 8px);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1rem;"><i class="fas fa-layer-group mr-2"></i>Interface Colors</h3>
                    ${makeColor("Main BG", "--bg", "#F8FAFC")}
                    ${makeColor("Card BG", "--card", "#FFFFFF")}
                    ${makeColor("Header BG", "--header-bg", "#FFFFFF")}
                    ${makeColor("Accent BG", "--active-bg", "#EEF2F2")}
                    ${makeColor("Borders", "--border", "#E2E8F0")}
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <div class="p-5" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius, 8px);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1rem;"><i class="fas fa-font mr-2"></i>Global Typography</h3>
                    ${makeThemeInput("Base Size", "--font-base", {type:"size", min:10, max:32, defaultUnit:"px"}, "16px")}
                    ${makeThemeInput("Brand Font", "--font-brand", {type:"text", allowEmpty:false}, "'Nunito', sans-serif", "w-32")}
                    ${makeThemeInput("Main Font", "--font-main", {type:"text", allowEmpty:false}, "'Nunito', sans-serif", "w-32")}
                    ${makeThemeInput("Brand Weight", "--weight-brand", {type:"weight"}, "800", "w-16")}
                    ${makeThemeInput("Main Weight", "--weight-main", {type:"weight"}, "400", "w-16")}
                    ${makeThemeInput("Bold Weight", "--weight-bold", {type:"weight"}, "700", "w-16")}
                    ${makeColor("Title Color", "--page-title-color", "#0F172A")}
                    ${makeColor("Sub Color", "--page-subtitle-color", "#64748B")}
                    ${makeColor("Text Color", "--text", "#0F172A")}
                    ${makeColor("Muted Color", "--muted", "#64748B")}
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <div class="p-5" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius, 8px);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1rem;"><i class="fas fa-expand-arrows-alt mr-2"></i>Sizing Engine</h3>
                    ${makeThemeInput("Page Title", "--page-title-size", {type:"size", min:12, max:64, defaultUnit:"px"}, "30px")}
                    ${makeThemeInput("Page Sub", "--page-subtitle-size", {type:"size", min:10, max:32, defaultUnit:"px"}, "18px")}
                    ${makeThemeInput("Spacing Unit", "--spacing-sm", {type:"size", min:0, max:64, defaultUnit:"px"}, "8px")}
                    ${makeThemeInput("Main Pad", "--main-padding", {type:"size", min:0, max:120, defaultUnit:"px"}, "40px")}
                    ${makeThemeInput("Radius", "--card-radius", {type:"size", min:0, max:40, defaultUnit:"px"}, "8px")}
                    ${makeThemeInput("Sidebar", "--sidebar-width", {type:"size", min:60, max:300, defaultUnit:"px"}, "72px")}
                    ${makeThemeInput("Logo Size", "--brand-size", {type:"size", min:10, max:48, defaultUnit:"px"}, "20px")}
                    ${makeThemeInput("Header Size", "--header-title-size", {type:"size", min:10, max:40, defaultUnit:"px"}, "18px")}
                    ${makeThemeInput("Label Size", "--label-size", {type:"size", min:10, max:24, defaultUnit:"px"}, "15px")}
                    ${makeThemeInput("Icon Size", "--icon-size", {type:"size", min:10, max:40, defaultUnit:"px"}, "18px")}
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <div class="p-5" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius, 8px); height: 600px; overflow-y: auto;">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1rem;"><i class="fas fa-list mr-2"></i>Content & Menus</h3>
                    ${makeAppInput("Brand Name", "brand_name", {type:"text", allowEmpty:false}, "nanbi")}
                    ${makeAppInput("Header Core", "header_title", {type:"text", allowEmpty:true}, "nanbi studio")}
                    
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)] mt-2">
                        <input type="text" class="w-10 p-1 border rounded gateway-input text-xs font-bold text-center" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-target="app" data-key="avatar_initial" data-validation='{"type":"text","allowEmpty":false,"maxLen":2}' data-default="N" value="${getAppVal('avatar_initial', 'N')}">
                        <div class="flex flex-col gap-1 w-40">
                            <input type="text" class="w-full p-1 border rounded gateway-input text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-target="app" data-key="dropdown_identity" data-validation='{"type":"text","allowEmpty":false}' data-default="Sovereign Identity" value="${getAppVal('dropdown_identity', 'Sovereign Identity')}">
                            <input type="text" class="w-full p-1 border rounded gateway-input text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-target="app" data-key="dropdown_node" data-validation='{"type":"text","allowEmpty":false}' data-default="Active Edge Node" value="${getAppVal('dropdown_node', 'Active Edge Node')}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-6 flex gap-4 pb-12" style="margin-left: 48px;">
            <button id="btn-save-theme" class="px-6 py-3 rounded font-bold transition-all shadow-sm hover:opacity-90" style="background: var(--brand-orange-dark); color: #FFF; border-radius: var(--card-radius, 8px);">
                <i class="fas fa-lock mr-2"></i> Encrypt & Save to Cloud
            </button>
            <button id="btn-reset-theme" class="px-6 py-3 rounded font-bold transition-all hover:opacity-75" style="background: transparent; color: var(--muted); border: 1px solid var(--border); border-radius: var(--card-radius, 8px);">Reset Local Cache</button>
        </div>
      </div>
    `;
    
    // SMART VALIDATION GATEWAY LOGIC
    container.querySelectorAll('.gateway-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const el = e.target;
            const target = el.getAttribute('data-target');
            const key = el.getAttribute('data-key');
            let val = el.value.trim();
            const rules = JSON.parse(el.getAttribute('data-validation') || '{}');
            const defaultVal = el.getAttribute('data-default');

            let isValid = true;
            let errorMsg = "";

            if (val === '') {
                if (rules.allowEmpty === false) { isValid = false; errorMsg = "GATEWAY BLOCK: This field is mandatory and cannot be empty."; }
            } else {
                if (rules.type === 'size') {
                    const num = parseFloat(val);
                    if (isNaN(num)) { isValid = false; errorMsg = "GATEWAY BLOCK: Input must be a numerical size."; }
                    else {
                        if (rules.min !== undefined && num < rules.min) { isValid = false; errorMsg = "GATEWAY BLOCK: Minimum allowed size is " + rules.min; }
                        else if (rules.max !== undefined && num > rules.max) { isValid = false; errorMsg = "GATEWAY BLOCK: Maximum allowed size is " + rules.max; }
                        else {
                            const hasUnit = /[a-zA-Z%]+$/.test(val);
                            if (!hasUnit && rules.defaultUnit) val = num + rules.defaultUnit;
                            if (!/^[0-9.]+(px|rem|em|vh|vw|%)$/.test(val)) { isValid = false; errorMsg = "GATEWAY BLOCK: Requires a valid CSS unit."; }
                        }
                    }
                } else if (rules.type === 'color') {
                    if (!val.startsWith('#') && val.length === 6) val = '#' + val;
                    if (!/^#[0-9A-Fa-f]{6}$/.test(val)) { isValid = false; errorMsg = "GATEWAY BLOCK: Must be a valid 6-character Hex code."; }
                } else if (rules.type === 'weight') {
                    if (!/^([1-9]00|normal|bold|bolder|lighter)$/i.test(val)) { isValid = false; errorMsg = "GATEWAY BLOCK: Must be a valid CSS font-weight."; }
                }
            }

            if (!isValid) {
                alert(errorMsg + "\\n\\nReverting to baseline default: " + defaultVal);
                val = defaultVal;
            }

            el.value = val;
            
            if (target === 'theme') {
                document.documentElement.style.setProperty(key, val);
                const activeTheme = localStorage.getItem('nanbi_theme') || 'light';
                const savedConf = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + activeTheme)) || {};
                savedConf[key] = val;
                localStorage.setItem('nanbi_custom_theme_' + activeTheme, JSON.stringify(savedConf));
            } else {
                const savedApp = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
                savedApp[key] = val;
                localStorage.setItem('nanbi_custom_app', JSON.stringify(savedApp));
                
                const targetDOM = document.getElementById('dom_' + key);
                if(targetDOM) {
                    if(el.classList.contains('icon-input')) targetDOM.className = val; 
                    else targetDOM.innerText = val; 
                }
            }
        });
    });

    // E2E CRYPTO SAVE PROTOCOL
    container.querySelector('#btn-save-theme').addEventListener('click', async (e) => {
        const btn = e.target;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Encrypting & Syncing...';
        btn.style.opacity = '0.7';

        try {
            const activeTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
            const customThemeVars = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + activeTheme)) || {};
            
            let rawThemeLedger = JSON.parse(JSON.stringify(themeLedger));
            rawThemeLedger.themes[activeTheme].variables = { ...rawThemeLedger.themes[activeTheme].variables, ...customThemeVars };

            let rawAppLedger = { ...appLedger, ...(JSON.parse(localStorage.getItem('nanbi_custom_app')) || {}) };

            // SHRED AND ENCRYPT BEFORE NETWORK TRANSIT
            const encryptedTheme = await CryptoEngine.encryptPayload(rawThemeLedger);
            const encryptedApp = await CryptoEngine.encryptPayload(rawAppLedger);

            // DISPATCH BLIND CIPHERTEXT TO SUPABASE
            const { error: tErr } = await window.nanbiDB.from('nanbi_ledgers')
                .update({ payload: encryptedTheme.ciphertext, iv_signature: encryptedTheme.iv })
                .eq('ledger_name', 'theme_manifest');
            if (tErr) throw tErr;

            const { error: aErr } = await window.nanbiDB.from('nanbi_ledgers')
                .update({ payload: encryptedApp.ciphertext, iv_signature: encryptedApp.iv })
                .eq('ledger_name', 'app_manifest');
            if (aErr) throw aErr;

            localStorage.removeItem('nanbi_custom_theme_' + activeTheme);
            localStorage.removeItem('nanbi_custom_app');
            localStorage.removeItem('nanbi_edge_theme');
            localStorage.removeItem('nanbi_edge_app');

            btn.innerHTML = '<i class="fas fa-shield-check mr-2"></i> Secured in Cloud';
            setTimeout(() => window.location.reload(), 800);

        } catch(error) {
            console.error(error);
            alert("E2E Sync Failed: " + error.message);
            btn.innerHTML = '<i class="fas fa-lock mr-2"></i> Encrypt & Save to Cloud';
            btn.style.opacity = '1';
        }
    });

    container.querySelector('#btn-reset-theme').addEventListener('click', () => {
        const activeTheme = localStorage.getItem('nanbi_theme');
        localStorage.removeItem('nanbi_custom_theme_' + activeTheme);
        localStorage.removeItem('nanbi_custom_app');
        window.location.reload();
    });
}
