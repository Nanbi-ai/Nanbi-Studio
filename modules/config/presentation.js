export async function initPresentationEngine(containerId) {
    const container = document.getElementById(containerId);
    
    let themeLedger;
    try {
        const res = await fetch('ledgers/theme_manifest.json');
        themeLedger = await res.json();
    } catch(err) {
        container.innerHTML = `<div class="text-red-500 font-bold">Failed to load Theme Ledger.</div>`;
        return;
    }

    const currentTheme = localStorage.getItem('nanbi_theme') || themeLedger.active_default;
    const baseVars = themeLedger.themes[currentTheme].variables;
    const customVars = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + currentTheme)) || {};
    const getVal = (key) => customVars[key] || baseVars[key];
    
    container.innerHTML = `
      <div class="flex-1 max-w-6xl">
        <div class="flex items-center gap-4 mb-2">
            <button onclick="history.back()" class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors" style="background: var(--card); border: 1px solid var(--border); color: var(--text);">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 class="text-3xl font-bold text-main" style="font-family: var(--font-brand);">Presentation Engine</h2>
        </div>
        
        <!-- Explicitly shows which theme is being edited -->
        <div class="mb-8 ml-12 p-3 rounded" style="background: var(--active-bg); border-left: 3px solid var(--brand-orange-dark);">
            <p class="text-sm font-bold" style="color: var(--text);">
                Currently Editing: <span style="color: var(--brand-orange-dark); text-transform: uppercase;">${currentTheme} THEME</span>
            </p>
            <p class="text-xs mt-1" style="color: var(--muted);">Changes map directly to the DOM. Click "Save Configuration" to lock overrides.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 ml-12">
            <div class="p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border);">
                <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-palette mr-2"></i>Brand Colors</h3>
                <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Dark Teal</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-teal-dark" value="${getVal('--brand-teal-dark')}"></div>
                <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Light Teal</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-teal-light" value="${getVal('--brand-teal-light')}"></div>
                <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Dark Orange</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-orange-dark" value="${getVal('--brand-orange-dark')}"></div>
                <div class="flex justify-between items-center py-3"><span class="font-bold text-main text-[0.9rem]">Light Orange</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--brand-orange-light" value="${getVal('--brand-orange-light')}"></div>
            </div>

            <div class="p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border);">
                <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-layer-group mr-2"></i>Core Interface</h3>
                <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Main Background</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--bg" value="${getVal('--bg')}"></div>
                <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Surface / Card</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--card" value="${getVal('--card')}"></div>
                <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Header Background</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--header-bg" value="${getVal('--header-bg')}"></div>
                <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Active Content Highlight</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--active-bg" value="${getVal('--active-bg')}"></div>
                <div class="flex justify-between items-center py-3"><span class="font-bold text-main text-[0.9rem]">Borders</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--border" value="${getVal('--border')}"></div>
            </div>
            
            <!-- New Typography Panel with Font Control -->
            <div class="p-6 rounded-lg lg:col-span-2" style="background: var(--card); border: 1px solid var(--border);">
                <h3 class="font-bold text-main mb-4 text-lg"><i class="fas fa-font mr-2"></i>Typography & Sizing</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Brand Font (Logo/Headers)</span> <input type="text" class="w-48 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--font-brand" value="${getVal('--font-brand')}"></div>
                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)]"><span class="font-bold text-main text-[0.9rem]">Main Font (UI/Text)</span> <input type="text" class="w-48 p-1 border rounded size-input font-mono text-xs" style="background:var(--bg); color:var(--text); border-color:var(--border);" data-var="--font-main" value="${getVal('--font-main')}"></div>
                    <div class="flex justify-between items-center py-3 border-b border-[color:var(--border)] md:border-b-0"><span class="font-bold text-main text-[0.9rem]">Main Text Color</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--text" value="${getVal('--text')}"></div>
                    <div class="flex justify-between items-center py-3"><span class="font-bold text-main text-[0.9rem]">Muted Text Color</span> <input type="color" class="w-12 h-8 rounded cursor-pointer border-0 bg-transparent color-picker" data-var="--muted" value="${getVal('--muted')}"></div>
                </div>
            </div>
        </div>
        
        <div class="mt-6 ml-12 flex gap-4">
            <button id="btn-save-theme" class="px-6 py-3 rounded-lg font-bold transition-all shadow-sm" style="background: var(--brand-orange-dark); color: #FFF;">
                <i class="fas fa-save mr-2"></i> Save Configuration
            </button>
            <button id="btn-reset-theme" class="px-6 py-3 rounded-lg font-bold transition-all" style="background: transparent; color: var(--muted); border: 1px solid var(--border);">Reset Defaults</button>
        </div>
      </div>
    `;
    
    // Bind Event Listeners
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

    container.querySelector('#btn-save-theme').addEventListener('click', () => {
        const activeTheme = localStorage.getItem('nanbi_theme');
        const savedConf = JSON.parse(localStorage.getItem('nanbi_custom_theme_' + activeTheme)) || {};
        console.log(`[LEDGER UPDATE] Save requested for theme: ${activeTheme}`, savedConf);
        alert('Configuration saved to Local Sovereign Node. (In production, this payload updates ledgers/theme_manifest.json via Edge Sync).');
    });

    container.querySelector('#btn-reset-theme').addEventListener('click', () => {
        const activeTheme = localStorage.getItem('nanbi_theme');
        localStorage.removeItem('nanbi_custom_theme_' + activeTheme);
        window.location.reload();
    });
}
