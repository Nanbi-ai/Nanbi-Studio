export async function initPresentationEngine(containerId) {
    const container = document.getElementById(containerId);
    
    let themeLedger, appLedger;
    try {
        const { data, error } = await window.nanbiDB.from('nanbi_ledgers').select('*');
        if (error) throw error;
        
        themeLedger = data.find(r => r.ledger_name === 'theme_manifest')?.payload;
        appLedger = data.find(r => r.ledger_name === 'app_manifest')?.payload;
    } catch(err) {
        container.innerHTML = `<div style="color:red; font-weight:bold;">Failed to load Cloud Ledgers.</div>`;
        return;
    }

    const currentTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
    const baseVars = themeLedger.themes[currentTheme].variables;
    
    const customVars = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + currentTheme)) || {};
    const getVal = (key) => customVars[key] !== undefined ? customVars[key] : baseVars[key];
    
    const customAppVars = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
    const getAppVal = (key) => customAppVars[key] !== undefined ? customAppVars[key] : appLedger[key];
    
    container.innerHTML = `
      <div class="flex-1 w-full max-w-7xl">
        <div class="flex items-center gap-4 mb-2">
            <button onclick="history.back()" class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors" style="background: var(--card); border: 1px solid var(--border); color: var(--text);">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="font-size: var(--header-title-size); font-weight: bold; font-family: var(--font-brand); color: var(--text);">Presentation & Content Engine</h2>
        </div>
        
        <div class="mb-8 p-3 rounded" style="background: var(--active-bg); border-left: 3px solid var(--brand-orange-dark); margin-left: 48px;">
            <p style="font-size: var(--label-size); font-weight: bold; color: var(--text);">Editing Theme: <span style="color: var(--brand-orange-dark); text-transform: uppercase;">${currentTheme}</span></p>
            <p style="font-size: 0.8rem; margin-top: 4px; color: var(--muted);">Changes map directly to the DOM for instant preview. Click Save to push to Supabase.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" style="margin-left: 48px;">
            
            <div class="flex flex-col gap-8">
                <div class="p-6" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1.05rem;"><i class="fas fa-palette mr-2"></i>Brand Colors</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Dark Teal</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-teal-dark" value="${getVal('--brand-teal-dark')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Light Teal</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-teal-light" value="${getVal('--brand-teal-light')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Dark Orange</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-orange-dark" value="${getVal('--brand-orange-dark')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main" style="font-size: 0.85rem;">Light Orange</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-orange-light" value="${getVal('--brand-orange-light')}"></div>
                </div>

                <div class="p-6" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1.05rem;"><i class="fas fa-layer-group mr-2"></i>Interface Colors</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Main BG</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--bg" value="${getVal('--bg')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Surface / Card</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--card" value="${getVal('--card')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Header BG</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--header-bg" value="${getVal('--header-bg')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Active Accent</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--active-bg" value="${getVal('--active-bg')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main" style="font-size: 0.85rem;">Borders</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--border" value="${getVal('--border')}"></div>
                </div>
            </div>

            <div class="flex flex-col gap-8">
                <div class="p-6" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1.05rem;"><i class="fas fa-font mr-2"></i>Typography</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Brand Font</span> <input type="text" class="w-32 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--font-brand" value="${getVal('--font-brand')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Main Font</span> <input type="text" class="w-32 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--font-main" value="${getVal('--font-main')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Main Text</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--text" value="${getVal('--text')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main" style="font-size: 0.85rem;">Muted Text</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--muted" value="${getVal('--muted')}"></div>
                </div>

                <div class="p-6" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius);">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1.05rem;"><i class="fas fa-expand-arrows-alt mr-2"></i>Sizing & Geometry</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Main Padding</span> <input type="text" class="w-20 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--main-padding" value="${getVal('--main-padding')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Card Radius</span> <input type="text" class="w-20 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--card-radius" value="${getVal('--card-radius')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Sidebar Width</span> <input type="text" class="w-20 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--sidebar-width" value="${getVal('--sidebar-width')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Logo Size</span> <input type="text" class="w-20 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--brand-size" value="${getVal('--brand-size')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Header Size</span> <input type="text" class="w-20 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--header-title-size" value="${getVal('--header-title-size')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main" style="font-size: 0.85rem;">Label Size</span> <input type="text" class="w-20 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--label-size" value="${getVal('--label-size')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main" style="font-size: 0.85rem;">Icon Size</span> <input type="text" class="w-20 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--icon-size" value="${getVal('--icon-size')}"></div>
                </div>
            </div>

            <div class="flex flex-col gap-8">
                <div class="p-6" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--card-radius); height: 600px; overflow-y: auto;">
                    <h3 class="font-bold text-main mb-4" style="font-size: 1.05rem;"><i class="fas fa-comment-alt mr-2"></i>Global Text & Menus</h3>
                    
                    <div class="flex flex-col py-2 border-b border-[color:var(--border)]">
                        <span class="font-bold text-main mb-1" style="font-size: 0.85rem;">Brand Name</span>
                        <input type="text" class="w-full p-2 border rounded app-input text-sm font-semibold" style="background:var(--bg); color:var(--brand-teal-dark); border-color:var(--border);" data-key="brand_name" value="${getAppVal('brand_name')}">
                    </div>
                    
                    <div class="flex flex-col py-2 border-b border-[color:var(--border)]">
                        <span class="font-bold text-main mb-1" style="font-size: 0.85rem;">Header Title</span>
                        <input type="text" class="w-full p-2 border rounded app-input text-sm font-semibold" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="header_title" value="${getAppVal('header_title')}">
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)] mt-2">
                        <input type="text" class="w-12 p-1 border rounded app-input text-xs font-bold text-center" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="avatar_initial" value="${getAppVal('avatar_initial')}" title="Avatar Initial">
                        <div class="flex flex-col gap-1 w-48">
                            <input type="text" class="w-full p-1 border rounded app-input text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="dropdown_identity" value="${getAppVal('dropdown_identity')}">
                            <input type="text" class="w-full p-1 border rounded app-input text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="dropdown_node" value="${getAppVal('dropdown_node')}">
                        </div>
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                        <input type="text" class="w-20 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_home_icon" value="${getAppVal('nav_home_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_home_label" value="${getAppVal('nav_home_label')}">
                    </div>
                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                        <input type="text" class="w-20 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_config_icon" value="${getAppVal('nav_config_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_config_label" value="${getAppVal('nav_config_label')}">
                    </div>
                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                        <input type="text" class="w-20 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_regions_icon" value="${getAppVal('nav_regions_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_regions_label" value="${getAppVal('nav_regions_label')}">
                    </div>
                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                        <input type="text" class="w-20 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_settings_icon" value="${getAppVal('nav_settings_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_settings_label" value="${getAppVal('nav_settings_label')}">
                    </div>
                    
                    <div class="flex flex-col py-3 gap-2">
                        <span class="font-bold text-main text-[0.85rem]">Dropdown Menu Labels</span>
                        <input type="text" class="w-full p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="menu_sovereignty" value="${getAppVal('menu_sovereignty')}">
                        <input type="text" class="w-full p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="menu_keys" value="${getAppVal('menu_keys')}">
                        <input type="text" class="w-full p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="menu_tier" value="${getAppVal('menu_tier')}">
                        <input type="text" class="w-full p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="menu_disconnect" value="${getAppVal('menu_disconnect')}">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-6 flex gap-4 pb-12" style="margin-left: 48px;">
            <button id="btn-save-theme" class="px-6 py-3 rounded font-bold transition-all shadow-sm hover:opacity-90" style="background: var(--brand-orange-dark); color: #FFF; border-radius: var(--card-radius);">
                <i class="fas fa-cloud-upload-alt mr-2"></i> Save to Cloud (Supabase)
            </button>
            <button id="btn-reset-theme" class="px-6 py-3 rounded font-bold transition-all hover:opacity-75" style="background: transparent; color: var(--muted); border: 1px solid var(--border); border-radius: var(--card-radius);">Reset Local Cache</button>
        </div>
      </div>
    `;
    
    container.querySelectorAll('.color-picker, .size-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const varName = e.target.getAttribute('data-var');
            const val = e.target.value;
            document.documentElement.style.setProperty(varName, val);
            
            const activeTheme = localStorage.getItem('nanbi_theme');
            const savedConf = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + activeTheme)) || {};
            savedConf[varName] = val;
            localStorage.setItem('nanbi_custom_theme_' + activeTheme, JSON.stringify(savedConf));
        });
    });

    container.querySelectorAll('.app-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const key = e.target.getAttribute('data-key');
            const val = e.target.value;
            
            const savedApp = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
            savedApp[key] = val;
            localStorage.setItem('nanbi_custom_app', JSON.stringify(savedApp));
            
            const targetDOM = document.getElementById('dom_' + key);
            if(targetDOM) {
                if(e.target.classList.contains('icon-input')) targetDOM.className = val; 
                else targetDOM.innerText = val; 
            }
        });
    });

    container.querySelector('#btn-save-theme').addEventListener('click', async (e) => {
        const btn = e.target;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Syncing to Supabase...';
        btn.style.opacity = '0.7';

        try {
            const activeTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
            const customThemeVars = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + activeTheme)) || {};
            let exportThemeLedger = JSON.parse(JSON.stringify(themeLedger));
            exportThemeLedger.themes[activeTheme].variables = { ...exportThemeLedger.themes[activeTheme].variables, ...customThemeVars };

            const customAppVars = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
            let exportAppLedger = { ...appLedger, ...customAppVars };

            const { error: tErr } = await window.nanbiDB.from('nanbi_ledgers').update({ payload: exportThemeLedger }).eq('ledger_name', 'theme_manifest');
            if (tErr) throw tErr;

            const { error: aErr } = await window.nanbiDB.from('nanbi_ledgers').update({ payload: exportAppLedger }).eq('ledger_name', 'app_manifest');
            if (aErr) throw aErr;

            localStorage.removeItem('nanbi_custom_theme_' + activeTheme);
            localStorage.removeItem('nanbi_custom_app');

            btn.innerHTML = '<i class="fas fa-check mr-2"></i> Success!';
            setTimeout(() => window.location.reload(), 800);

        } catch(error) {
            console.error(error);
            alert("Cloud Sync Failed: " + error.message);
            btn.innerHTML = '<i class="fas fa-cloud-upload-alt mr-2"></i> Save to Cloud (Supabase)';
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
