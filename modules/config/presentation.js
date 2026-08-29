export async function initPresentationEngine(containerId) {
    const container = document.getElementById(containerId);
    
    let themeLedger, appLedger;
    try {
        const [tRes, aRes] = await Promise.all([ fetch('ledgers/theme_manifest.json'), fetch('ledgers/app_manifest.json') ]);
        themeLedger = await tRes.json();
        appLedger = await aRes.json();
    } catch(err) {
        container.innerHTML = `<div class="text-red-500 font-bold">Failed to load Ledgers.</div>`;
        return;
    }

    const currentTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
    const baseVars = themeLedger.themes[currentTheme].variables;
    const customVars = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + currentTheme)) || {};
    const getVal = (key) => customVars[key] || baseVars[key];
    
    const customAppVars = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
    const getAppVal = (key) => customAppVars[key] || appLedger[key];
    
    container.innerHTML = `
      <div class="flex-1 max-w-7xl">
        <div class="flex items-center gap-4 mb-2">
            <button onclick="history.back()" class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors" style="background: var(--card); border: 1px solid var(--border); color: var(--text);">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 class="text-3xl font-bold text-main" style="font-family: var(--font-brand);">Presentation & Content Engine</h2>
        </div>
        
        <div class="mb-8 ml-12 p-3 rounded" style="background: var(--active-bg); border-left: 3px solid var(--brand-orange-dark);">
            <p class="text-sm font-bold" style="color: var(--text);">Editing Theme: <span style="color: var(--brand-orange-dark); text-transform: uppercase;">${currentTheme}</span></p>
            <p class="text-xs mt-1" style="color: var(--muted);">Changes map directly to the DOM for instant preview.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 ml-12">
            
            <!-- Column 1: Colors -->
            <div class="flex flex-col gap-8">
                <div class="p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border);">
                    <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-palette mr-2"></i>Brand Colors</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Dark Teal</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-teal-dark" value="${getVal('--brand-teal-dark')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Light Teal</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-teal-light" value="${getVal('--brand-teal-light')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Dark Orange</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-orange-dark" value="${getVal('--brand-orange-dark')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main text-[0.85rem]">Light Orange</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-orange-light" value="${getVal('--brand-orange-light')}"></div>
                </div>

                <div class="p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border);">
                    <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-layer-group mr-2"></i>Interface Layout</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Main BG</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--bg" value="${getVal('--bg')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Surface / Card</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--card" value="${getVal('--card')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Header BG</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--header-bg" value="${getVal('--header-bg')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Active Accent</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--active-bg" value="${getVal('--active-bg')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main text-[0.85rem]">Borders</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--border" value="${getVal('--border')}"></div>
                </div>
            </div>

            <!-- Column 2: Typography & Sizing -->
            <div class="flex flex-col gap-8">
                <div class="p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border);">
                    <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-font mr-2"></i>Typography</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Brand Font</span> <input type="text" class="w-32 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--font-brand" value="${getVal('--font-brand')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Main Font</span> <input type="text" class="w-32 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--font-main" value="${getVal('--font-main')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Main Text Color</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--text" value="${getVal('--text')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main text-[0.85rem]">Muted Text Color</span> <input type="color" class="w-10 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--muted" value="${getVal('--muted')}"></div>
                </div>

                <div class="p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border);">
                    <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-expand-arrows-alt mr-2"></i>Sizing Engine</h3>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Sidebar Width</span> <input type="text" class="w-24 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--sidebar-width" value="${getVal('--sidebar-width')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Sidebar Expanded</span> <input type="text" class="w-24 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--sidebar-expanded" value="${getVal('--sidebar-expanded')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Logo Text Size</span> <input type="text" class="w-24 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--brand-size" value="${getVal('--brand-size')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Header Title Size</span> <input type="text" class="w-24 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--header-title-size" value="${getVal('--header-title-size')}"></div>
                    <div class="flex justify-between items-center py-2 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.85rem]">Nav Label Size</span> <input type="text" class="w-24 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--label-size" value="${getVal('--label-size')}"></div>
                    <div class="flex justify-between items-center py-2"><span class="font-bold text-main text-[0.85rem]">Icon Size</span> <input type="text" class="w-24 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--icon-size" value="${getVal('--icon-size')}"></div>
                </div>
            </div>

            <!-- Column 3: Application Content & Icons -->
            <div class="flex flex-col gap-8">
                <div class="p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border);">
                    <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-comment-alt mr-2"></i>Global Text & Icons</h3>
                    
                    <div class="flex flex-col py-2 border-b border-[color:var(--border)]">
                        <span class="font-bold text-main text-[0.85rem] mb-1">Sidebar Brand Text</span>
                        <input type="text" class="w-full p-2 border rounded app-input text-sm font-semibold" style="background:var(--bg); color:var(--brand-teal-dark); border-color:var(--border);" data-key="brand_name" value="${getAppVal('brand_name')}">
                    </div>
                    
                    <div class="flex flex-col py-2 border-b border-[color:var(--border)]">
                        <span class="font-bold text-main text-[0.85rem] mb-1">Header Title</span>
                        <input type="text" class="w-full p-2 border rounded app-input text-sm font-semibold" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="header_title" value="${getAppVal('header_title')}">
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                        <input type="text" class="w-24 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_home_icon" value="${getAppVal('nav_home_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_home_label" value="${getAppVal('nav_home_label')}">
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                        <input type="text" class="w-24 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_config_icon" value="${getAppVal('nav_config_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_config_label" value="${getAppVal('nav_config_label')}">
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                        <input type="text" class="w-24 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_regions_icon" value="${getAppVal('nav_regions_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_regions_label" value="${getAppVal('nav_regions_label')}">
                    </div>
                    
                    <div class="flex justify-between items-center py-3">
                        <input type="text" class="w-24 p-1 border rounded app-input icon-input text-xs font-mono" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_settings_icon" value="${getAppVal('nav_settings_icon')}">
                        <input type="text" class="w-32 p-1 border rounded app-input text-sm" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-key="nav_settings_label" value="${getAppVal('nav_settings_label')}">
                    </div>

                </div>
            </div>

        </div>
        
        <div class="mt-6 ml-12 flex gap-4 pb-12">
            <button id="btn-save-theme" class="px-6 py-3 rounded-lg font-bold transition-all shadow-sm hover:opacity-90" style="background: var(--brand-orange-dark); color: #FFF;">
                <i class="fas fa-save mr-2"></i> Save Configuration
            </button>
            <button id="btn-reset-theme" class="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-75" style="background: transparent; color: var(--muted); border: 1px solid var(--border);">Reset Defaults</button>
        </div>
      </div>
    `;
    
    // Bind Live CSS Updating Logic
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

    // Bind Live App Text/Icon Updating Logic
    container.querySelectorAll('.app-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const key = e.target.getAttribute('data-key');
            const val = e.target.value;
            
            const savedApp = JSON.parse(localStorage.getItem('nanbi_custom_app')) || {};
            savedApp[key] = val;
            localStorage.setItem('nanbi_custom_app', JSON.stringify(savedApp));
            
            // Instantly inject into the DOM via the IDs set in the router
            const targetDOM = document.getElementById('dom_' + key);
            if(targetDOM) {
                if(e.target.classList.contains('icon-input')) {
                    targetDOM.className = val; // Updates font-awesome class
                } else {
                    targetDOM.innerText = val; // Updates text label
                }
            }
        });
    });

    container.querySelector('#btn-save-theme').addEventListener('click', () => {
        alert('Configuration saved to Local Node. (JSON Ledger update protocol pending).');
    });

    container.querySelector('#btn-reset-theme').addEventListener('click', () => {
        const activeTheme = localStorage.getItem('nanbi_theme');
        localStorage.removeItem('nanbi_custom_theme_' + activeTheme);
        localStorage.removeItem('nanbi_custom_app');
        window.location.reload();
    });
}
