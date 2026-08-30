import { CryptoEngine } from '../core/crypto_engine.js';

// =======================================================================
// NANBI V5.0 - REGIONAL TAXONOMY ENGINE (UNCORRUPTED 3-WAY BINDING)
// =======================================================================

let mapInstance = null;
let featureGroup = null;
let currentTaxonomyData = [];
let activeNodeSelection = {
    global: 'GLB-EARTH', country: 'IND', state: 'IN-KA',
    district: 'All', taluk: 'All', territory: 'All', ward: 'All'
};

const TAXONOMY_LEVELS = [
    { id: 'district', label: 'District' },
    { id: 'taluk', label: 'Taluk' },
    { id: 'territory', label: 'Territory (SP)' },
    { id: 'ward', label: 'Ward / GP' }
];

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Inject the pure layout for the Map and Data panes
    container.innerHTML = `
        <div class="flex-1 flex flex-col lg:flex-row gap-4 w-full max-w-[1600px] mx-auto" style="min-height:75vh;">
            
            <!-- Left Column: Map & Dropdowns -->
            <aside class="w-full lg:w-[45%] flex flex-col gap-4 shrink-0">
                <div class="flex-1 bg-white p-2 rounded border border-slate-200 relative shadow-sm min-h-[450px]" style="background: var(--card); border-color: var(--border);">
                    <div id="map-wrapper" style="position:relative; width:100%; height:100%; min-height:450px; z-index:1; border-radius: 4px; overflow: hidden;">
                        <div id="map" style="position:absolute; inset:0;"></div>
                    </div>
                </div>
                
                <div class="p-4 rounded border shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="flex justify-between items-center pb-2 border-b" style="border-color: var(--border);">
                        <span id="geoHierarchyBreadcrumb" class="text-xs font-bold uppercase" style="color: var(--brand-orange-dark);">Karnataka (IN-KA)</span>
                        <button id="btn-sync-regions" class="px-3 py-1 rounded text-[10px] font-bold transition-all" style="background: var(--active-bg); color: var(--brand-teal-dark); border: 1px solid var(--border);">
                            <i class="fas fa-shield-alt mr-1"></i> Encrypt & Save
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs mt-3" id="dropdown-container">
                        <!-- Dropdowns Injected Dynamically -->
                    </div>
                </div>
            </aside>

            <!-- Right Column: Metrics & Data Table -->
            <section class="w-full lg:w-[55%] flex flex-col gap-4 shrink-0 lg:shrink">
                
                <!-- Metrics Bar -->
                <div class="p-4 rounded border flex justify-between items-center shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="text-left">
                        <p class="text-[10px] font-bold uppercase" style="color: var(--muted);">Active Territories</p>
                        <p class="text-2xl font-black" style="color: var(--brand-teal-dark);" id="metricCount">0</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] font-bold uppercase" style="color: var(--muted);">Viability Target</p>
                        <p class="text-lg font-bold" style="color: var(--brand-orange-dark);">₹10L - ₹12L</p>
                    </div>
                </div>

                <!-- Active Node Ledger -->
                <div class="flex-1 p-4 rounded border shadow-sm flex flex-col" style="background: var(--card); border-color: var(--border);">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-sm font-bold text-main"><i class="fas fa-table mr-2" style="color: var(--brand-teal-dark);"></i> Territory Ledger</span>
                        <input type="text" id="input-search-node" placeholder="Search territories..." class="px-2 py-1 border rounded text-xs w-48" style="background: var(--bg); color: var(--text); border-color: var(--border); outline: none;">
                    </div>
                    <div class="w-full overflow-y-auto flex-1 border rounded" style="border-color: var(--border);">
                        <table class="w-full text-left border-collapse" style="font-size: 0.75rem;">
                            <thead style="background: var(--active-bg); position: sticky; top: 0; z-index: 10;">
                                <tr style="border-bottom: 2px solid var(--border); color: var(--muted); text-transform: uppercase;">
                                    <th class="py-2 px-2 font-bold">Territory ID</th>
                                    <th class="py-2 px-2 font-bold">District / Taluk</th>
                                    <th class="py-2 px-2 font-bold">Type</th>
                                    <th class="py-2 px-2 font-bold">MPS Capacity</th>
                                </tr>
                            </thead>
                            <tbody id="node-table-body">
                                <tr><td colspan="4" class="py-6 text-center font-bold" style="color: var(--muted);">Loading Ledger...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    `;

    // 2. Initialize Leaflet Map Engine
    if (!window.L) await loadLeafletLibrary();
    if (mapInstance) { mapInstance.remove(); }
    
    mapInstance = L.map('map', { zoomControl: true, attributionControl: false }).setView([15.3173, 75.7139], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { opacity: 0.8 }).addTo(mapInstance);
    featureGroup = L.featureGroup().addTo(mapInstance);

    // 3. Render Dropdowns
    const dropContainer = document.getElementById('dropdown-container');
    dropContainer.innerHTML = TAXONOMY_LEVELS.map(lvl => `
        <div class="flex flex-col">
            <label style="font-weight:600; color:var(--muted); margin-bottom: 2px;">${lvl.label}</label>
            <select id="sel-${lvl.id}" class="p-1 border rounded" style="background: var(--bg); color: var(--text); border-color: var(--border); outline: none; cursor: pointer;">
                <option value="All">All</option>
            </select>
        </div>
    `).join('');

    // 4. Fetch & Decrypt Data
    await fetchAndRenderData();
    bindEventListeners();
}

async function fetchAndRenderData() {
    try {
        const { data, error } = await window.nanbiDB.from('nanbi_ledgers').select('*').eq('ledger_name', 'regional_manifest');
        if (!error && data && data.length > 0) {
            const row = data[0];
            currentTaxonomyData = row.iv_signature ? await CryptoEngine.decryptPayload(row.payload, row.iv_signature) : row.payload;
        } else {
            currentTaxonomyData = [];
        }
    } catch (e) {
        console.warn("Regional ledger retrieval failed. Rendering empty state.", e);
        currentTaxonomyData = [];
    }
    
    document.getElementById('metricCount').innerText = currentTaxonomyData.length;
    refreshUIState();
}

function refreshUIState() {
    // Filter Data based on Dropdowns
    let filtered = currentTaxonomyData;
    if (activeNodeSelection.district !== 'All') filtered = filtered.filter(n => n.District_Name === activeNodeSelection.district);
    if (activeNodeSelection.taluk !== 'All') filtered = filtered.filter(n => n.Taluk_ULB_Jurisdiction === activeNodeSelection.taluk);

    // Update Map
    featureGroup.clearLayers();
    let bounds = [];
    
    filtered.forEach(node => {
        if (node.geojson) {
            try {
                const layer = L.geoJSON(JSON.parse(node.geojson), { 
                    style: { color: '#ffffff', weight: 1, fillColor: node.Territory_Type === 'Urban' ? '#D35400' : '#2C4653', fillOpacity: 0.4 } 
                });
                layer.on('mouseover', e => { e.target.bringToFront(); e.target.setStyle({stroke: true, color: '#1E293B', weight: 2, fillOpacity: 0.7}); });
                layer.on('mouseout', e => e.target.setStyle({color: '#ffffff', weight: 1, fillOpacity: 0.4}));
                layer.on('click', () => syncFromMap(node));
                
                layer.bindPopup(`<div style="font-weight:bold; color:#2C4653;">${node.Territory_ID}</div><div style="font-size:0.75rem; color:#D35400;">${node.Key_Localities_Economic_Profile}</div>`);
                featureGroup.addLayer(layer);
                bounds.push(layer.getBounds());
            } catch(err) {}
        }
    });

    if (bounds.length > 0) mapInstance.fitBounds(bounds, { padding: [20, 20] });

    // Update Table
    const tbody = document.getElementById('node-table-body');
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-4 text-center font-bold" style="color: var(--muted);">No territories found.</td></tr>`;
    } else {
        tbody.innerHTML = filtered.map(node => `
            <tr class="border-b hover:bg-[color:var(--active-bg)] cursor-pointer transition-colors" style="border-color: var(--border);" onclick="document.getElementById('sel-district').value='${node.District_Name}'; document.getElementById('sel-district').dispatchEvent(new Event('change'));">
                <td class="py-2 px-2 font-mono font-bold" style="color: var(--brand-orange-dark);">${node.Territory_ID}</td>
                <td class="py-2 px-2" style="color: var(--text);">${node.District_Name} / ${node.Taluk_ULB_Jurisdiction}</td>
                <td class="py-2 px-2"><span class="px-2 py-0.5 rounded text-[10px] font-bold" style="background: rgba(44,70,83,0.1); color: var(--brand-teal-dark);">${node.Territory_Type}</span></td>
                <td class="py-2 px-2 font-mono font-bold" style="color: var(--text);">${node.Target_MPS_Capacity || '~35,000'}</td>
            </tr>
        `).join('');
    }

    // Populate Dropdowns
    const districts = [...new Set(currentTaxonomyData.map(n => n.District_Name).filter(Boolean))];
    const distSel = document.getElementById('sel-district');
    if (distSel.options.length <= 1) {
        distSel.innerHTML = `<option value="All">All</option>` + districts.map(d => `<option value="${d}">${d}</option>`).join('');
        distSel.value = activeNodeSelection.district;
    }

    const taluks = [...new Set(filtered.map(n => n.Taluk_ULB_Jurisdiction).filter(Boolean))];
    const talukSel = document.getElementById('sel-taluk');
    talukSel.innerHTML = `<option value="All">All</option>` + taluks.map(t => `<option value="${t}">${t}</option>`).join('');
    talukSel.value = activeNodeSelection.taluk;
    
    // Breadcrumb Update
    document.getElementById('geoHierarchyBreadcrumb').innerText = `IN-KA > ${activeNodeSelection.district} > ${activeNodeSelection.taluk}`;
}

function bindEventListeners() {
    ['district', 'taluk'].forEach(lvl => {
        const el = document.getElementById(`sel-${lvl}`);
        if (el) {
            el.addEventListener('change', (e) => {
                activeNodeSelection[lvl] = e.target.value;
                if (lvl === 'district') activeNodeSelection.taluk = 'All';
                refreshUIState();
            });
        }
    });

    const searchInput = document.getElementById('input-search-node');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            const filtered = currentTaxonomyData.filter(n => (n.Territory_ID || '').toLowerCase().includes(q) || (n.District_Name || '').toLowerCase().includes(q));
            // Basic table re-render for search
            document.getElementById('node-table-body').innerHTML = filtered.map(node => `
                <tr class="border-b hover:bg-[color:var(--active-bg)] cursor-pointer" style="border-color: var(--border);">
                    <td class="py-2 px-2 font-mono font-bold" style="color: var(--brand-orange-dark);">${node.Territory_ID}</td>
                    <td class="py-2 px-2" style="color: var(--text);">${node.District_Name}</td>
                    <td class="py-2 px-2 text-[10px] font-bold">${node.Territory_Type}</td>
                    <td class="py-2 px-2 font-mono">${node.Target_MPS_Capacity}</td>
                </tr>
            `).join('');
        });
    }

    const btnSync = document.getElementById('btn-sync-regions');
    if (btnSync) {
        btnSync.addEventListener('click', async () => {
            btnSync.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Encrypting...';
            try {
                const encryptedPayload = await CryptoEngine.encryptPayload(currentTaxonomyData);
                const { error } = await window.nanbiDB.from('nanbi_ledgers').upsert({
                    ledger_name: 'regional_manifest', payload: encryptedPayload.ciphertext, iv_signature: encryptedPayload.iv
                }, { onConflict: 'ledger_name' });
                if (error) throw error;
                btnSync.innerHTML = '<i class="fas fa-check mr-1"></i> Saved';
                setTimeout(() => { btnSync.innerHTML = '<i class="fas fa-shield-alt mr-1"></i> Encrypt & Save'; }, 2000);
            } catch (err) {
                alert("Sync Failed: " + err.message);
                btnSync.innerHTML = '<i class="fas fa-shield-alt mr-1"></i> Encrypt & Save';
            }
        });
    }
}

function syncFromMap(node) {
    activeNodeSelection.district = node.District_Name || 'All';
    activeNodeSelection.taluk = node.Taluk_ULB_Jurisdiction || 'All';
    document.getElementById('sel-district').value = activeNodeSelection.district;
    refreshUIState();
}

function loadLeafletLibrary() {
    return new Promise((resolve) => {
        if (window.L) return resolve();
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = () => resolve(); document.head.appendChild(script);
    });
}
