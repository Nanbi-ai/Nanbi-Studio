import { CryptoEngine } from '../core/crypto_engine.js';

// =======================================================================
// NANBI V5.0 - REGIONAL TAXONOMY ENGINE (RPC RESTORED & OPENSTREETMAP)
// =======================================================================

let mapInstance = null;
let featureGroup = null;
let currentTaxonomyData = [];

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Inject the pure layout for the Map and Data panes
    container.innerHTML = `
        <div class="flex-1 flex flex-col lg:flex-row gap-4 w-full max-w-[1600px] mx-auto" style="min-height:75vh;">
            
            <!-- Left Column: Map & Dropdowns -->
            <aside class="w-full lg:w-[45%] flex flex-col gap-4 shrink-0">
                <div class="flex-1 bg-white p-2 rounded border relative shadow-sm min-h-[450px]" style="background: var(--card); border-color: var(--border);">
                    <div id="map-wrapper" style="position:relative; width:100%; height:100%; min-height:450px; z-index:1; border-radius: 4px; overflow: hidden;">
                        <div id="map" style="position:absolute; inset:0;"></div>
                    </div>
                </div>
                
                <div class="p-4 rounded border shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="flex justify-between items-center pb-2 border-b" style="border-color: var(--border);">
                        <span id="geoHierarchyBreadcrumb" class="text-[10px] font-bold uppercase" style="color: var(--brand-orange-dark);">World View</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-[10px] mt-3">
                        <div class="flex flex-col">
                            <label style="font-weight:600; color:var(--muted); margin-bottom: 2px;">Macro Region</label>
                            <select id="selCountry" class="p-1.5 border rounded" style="background: var(--bg); color: var(--text); border-color: var(--border); outline: none;">
                                <option>Loading...</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label style="font-weight:600; color:var(--muted); margin-bottom: 2px;">Micro Region</label>
                            <select id="selState" disabled class="p-1.5 border rounded" style="background: var(--active-bg); color: var(--muted); border-color: var(--border); outline: none;">
                                <option>All</option>
                            </select>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Right Column: Metrics & Data Table -->
            <section class="w-full lg:w-[55%] flex flex-col gap-4 shrink-0 lg:shrink">
                <div class="p-4 rounded border flex justify-between items-center shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="text-left">
                        <p class="text-[10px] font-bold uppercase" style="color: var(--muted);">Active Regions</p>
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
                                    <th class="py-2 px-2 font-bold">Region ID</th>
                                    <th class="py-2 px-2 font-bold">Region Name</th>
                                    <th class="py-2 px-2 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody id="node-table-body">
                                <tr><td colspan="3" class="py-6 text-center font-bold" style="color: var(--muted);">Loading Ledger...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    `;

    // 2. Initialize Leaflet Map Engine (RESTORED OPENSTREETMAP - NO API KEY REQUIRED)
    if (!window.L) await loadLeafletLibrary();
    if (mapInstance) { mapInstance.remove(); }
    
    mapInstance = L.map('map', { zoomControl: true, attributionControl: false }).setView([22.5937, 78.9629], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { opacity: 0.7 }).addTo(mapInstance);
    featureGroup = L.featureGroup().addTo(mapInstance);

    // 3. Fetch Data via existing Supabase RPC
    await fetchAndRenderData();
}

async function fetchAndRenderData() {
    try {
        // RESTORED: Calling your existing Supabase RPC to fetch the 250+ countries and polygons you uploaded
        const { data, error } = await window.nanbiDB.rpc('get_countries_geojson');
        
        if (error) throw error;

        if (data && data.length > 0) {
            currentTaxonomyData = data;
            const sel = document.getElementById('selCountry');
            sel.innerHTML = '<option value="All">Global Overview</option>';
            
            document.getElementById('metricCount').innerText = data.length;

            const tbody = document.getElementById('node-table-body');
            let tableHTML = '';

            data.forEach(c => {
                // Populate Dropdown
                sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
                
                // Populate Table
                tableHTML += `
                    <tr class="border-b hover:bg-[color:var(--active-bg)] cursor-pointer transition-colors" style="border-color: var(--border);">
                        <td class="py-2 px-2 font-mono font-bold" style="color: var(--brand-orange-dark);">${c.id || 'N/A'}</td>
                        <td class="py-2 px-2 font-bold text-main">${c.name || 'Unknown'}</td>
                        <td class="py-2 px-2 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold" style="background: #E6F4EA; color: #137333;">Active</span></td>
                    </tr>
                `;

                // Draw Polygon on Map
                if(c.geojson) {
                    try {
                        const layer = L.geoJSON(JSON.parse(c.geojson), { 
                            style: { color: '#ffffff', weight: 1, fillColor: '#D35400', fillOpacity: 0.4 } 
                        });
                        layer.on('mouseover', e => { e.target.bringToFront(); e.target.setStyle({stroke: true, color: '#1E293B', weight: 2}); });
                        layer.on('mouseout', e => e.target.setStyle({color: '#ffffff', weight: 1}));
                        featureGroup.addLayer(layer);
                    } catch(err) {
                        console.error("GeoJSON parse error for", c.name);
                    }
                }
            });

            sel.disabled = false;
            tbody.innerHTML = tableHTML;

            if (featureGroup.getLayers().length > 0) {
                mapInstance.fitBounds(featureGroup.getBounds(), { padding: [20, 20] });
            }
        } else {
            document.getElementById('node-table-body').innerHTML = `<tr><td colspan="3" class="py-4 text-center font-bold text-red-500">RPC returned no data.</td></tr>`;
        }
    } catch (e) {
        console.error("Map Engine RPC Error:", e);
        document.getElementById('node-table-body').innerHTML = `<tr><td colspan="3" class="py-4 text-center font-bold text-red-500">Failed to connect to database RPC.</td></tr>`;
    }
}

function loadLeafletLibrary() {
    return new Promise((resolve) => {
        if (window.L) return resolve();
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = () => resolve(); document.head.appendChild(script);
    });
}
