import { CryptoEngine } from '../core/crypto_engine.js';

// =======================================================================
// NANBI V5.0 - REGIONAL TAXONOMY ENGINE (RESTORED SOVEREIGN POLYGONS)
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. RESTORED EXACT ORIGINAL UI (38/62 Split, 5-Level Dropdowns, Custom Ledger)
    container.innerHTML = `
        <div class="flex-1 flex flex-col lg:flex-row gap-4 w-full h-full" style="background: var(--bg);">
            
            <!-- LEFT COLUMN: Hierarchy & Map (38%) -->
            <aside class="w-full lg:w-[38%] flex flex-col gap-4 shrink-0">
                
                <!-- Hierarchy Controls -->
                <div class="bg-white rounded border border-slate-200 p-4 shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-3" style="border-color: var(--border);">
                        <span id="geo-breadcrumb" class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--brand-teal-dark);"><i class="fas fa-chevron-left mr-1"></i> <i class="fas fa-chevron-right mr-1"></i> WORLD VIEW</span>
                        <button id="btn-reset-globe" class="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors"><i class="fas fa-globe mr-1"></i> Globe</button>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col gap-1">
                            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Country</label>
                            <select id="sel-country" class="p-1.5 border rounded text-[11px] font-semibold text-slate-700 outline-none" style="background: var(--bg); border-color: var(--border);">
                                <option value="All">Loading...</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">State / Province</label>
                            <select id="sel-state" class="p-1.5 border rounded text-[11px] font-semibold text-slate-700 outline-none opacity-60" style="background: var(--bg); border-color: var(--border);" disabled>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">District</label>
                            <select id="sel-district" class="p-1.5 border rounded text-[11px] font-semibold text-slate-700 outline-none opacity-60" style="background: var(--bg); border-color: var(--border);" disabled>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Taluk / County</label>
                            <select id="sel-taluk" class="p-1.5 border rounded text-[11px] font-semibold text-slate-700 outline-none opacity-60" style="background: var(--bg); border-color: var(--border);" disabled>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-1 col-span-2">
                            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Ward / Territory</label>
                            <select id="sel-ward" class="p-1.5 border rounded text-[11px] font-semibold text-slate-700 outline-none opacity-60" style="background: var(--bg); border-color: var(--border);" disabled>
                                <option value="All">All</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Sovereign Map Engine -->
                <div class="flex-1 bg-[#E2E8F0] rounded border border-slate-200 shadow-sm relative min-h-[400px] overflow-hidden" style="border-color: var(--border);">
                    <div id="map" class="absolute inset-0"></div>
                </div>
            </aside>

            <!-- RIGHT COLUMN: Metrics & Data Ledger (62%) -->
            <section class="w-full lg:w-[62%] flex flex-col gap-4 shrink-0 lg:shrink">
                
                <!-- Metrics Ribbon -->
                <div class="bg-white rounded border border-slate-200 p-5 shadow-sm flex justify-around items-center" style="background: var(--card); border-color: var(--border);">
                    <div class="text-center">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Territories</p>
                        <p class="text-3xl font-black text-slate-800 mt-1" id="metric-active">0</p>
                    </div>
                    <div class="w-px h-10 bg-slate-200"></div>
                    <div class="text-center">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market Capacity</p>
                        <p class="text-3xl font-black mt-1" style="color: var(--brand-orange-dark);" id="metric-capacity">₹0</p>
                    </div>
                </div>

                <!-- Custom Data Ledger -->
                <div class="flex-1 bg-white rounded border border-slate-200 shadow-sm flex flex-col overflow-hidden" style="background: var(--card); border-color: var(--border);">
                    <div class="overflow-y-auto flex-1">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-50 sticky top-0 z-10" style="background: var(--active-bg);">
                                <tr class="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider" style="border-color: var(--border);">
                                    <th class="py-3 px-4">ID</th>
                                    <th class="py-3 px-4">Ward Name</th>
                                    <th class="py-3 px-4">Biz-Class</th>
                                    <th class="py-3 px-4">Civic Coverage</th>
                                </tr>
                            </thead>
                            <tbody id="table-body">
                                <tr>
                                    <td colspan="4" class="py-20 text-center">
                                        <div class="opacity-60 flex flex-col items-center">
                                            <i class="fas fa-layer-group text-4xl text-slate-400 mb-3"></i>
                                            <h4 class="font-bold text-xs uppercase tracking-wider" style="color: var(--brand-orange-dark);">Macro Region Selected</h4>
                                            <p class="text-[11px] text-slate-500 mt-1">Drill down to a specific <span class="font-bold text-slate-700">Taluk</span> to view granular Ward data matrices.</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Footer Inspector -->
                    <div class="bg-slate-50 border-t border-slate-200 p-3 flex justify-between items-center" style="background: var(--bg); border-color: var(--border);">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entity Inspector</span>
                        <span class="text-[10px] font-medium text-slate-400">Awaiting node selection...</span>
                    </div>
                </div>
            </section>
        </div>
    `;

    // 2. Initialize Leaflet Map Engine
    await loadLeafletLibrary();
    if (mapInstance) { mapInstance.remove(); }
    
    // Renders the map without API key dependencies. Uses standard, free OSM Light tiles as the background canvas.
    mapInstance = L.map('map', { zoomControl: true, attributionControl: false }).setView([22.5937, 78.9629], 4);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19
    }).addTo(mapInstance);

    const featureGroup = L.featureGroup().addTo(mapInstance);

    // 3. Fetch Sovereign GeoJSON Uploaded via your Python Script
    try {
        const { data, error } = await window.nanbiDB.rpc('get_countries_geojson');
        
        if (data && data.length > 0) {
            const selCountry = document.getElementById('sel-country');
            selCountry.innerHTML = '<option value="All">Global Overview</option>';
            
            data.forEach(c => {
                selCountry.innerHTML += `<option value="${c.id}">${c.name}</option>`;
                if(c.geojson) {
                    try {
                        const layer = L.geoJSON(JSON.parse(c.geojson), { 
                            // Recreates the exact dynamic multi-color visual aesthetic from your screenshot
                            style: { color: '#ffffff', weight: 1, fillColor: getVisualColor(c.name), fillOpacity: 0.6 } 
                        });
                        
                        layer.on('mouseover', e => { e.target.bringToFront(); e.target.setStyle({stroke: true, color: '#1E293B', weight: 2, fillOpacity: 0.8}); });
                        layer.on('mouseout', e => e.target.setStyle({color: '#ffffff', weight: 1, fillOpacity: 0.6}));
                        
                        // Click to drill down (simulate 3-way binding)
                        layer.on('click', e => {
                            selCountry.value = c.id;
                            selCountry.dispatchEvent(new Event('change'));
                        });
                        
                        featureGroup.addLayer(layer);
                    } catch(err) { console.error("GeoJSON parse error", err); }
                }
            });
            
            selCountry.disabled = false;
            mapInstance.fitBounds(featureGroup.getBounds(), { padding: [20, 20] });
            
            // Populate Your Specific Metrics
            document.getElementById('metric-active').innerText = data.length;
            document.getElementById('metric-capacity').innerText = '₹' + (data.length * 35000).toLocaleString();

            // Mocking the Table Drill-Down Interaction from your screenshot (India -> Karnataka -> Bengaluru)
            selCountry.addEventListener('change', (e) => {
                if(e.target.options[e.target.selectedIndex].text === 'India') {
                    document.getElementById('geo-breadcrumb').innerText = 'INDIA (COUNTRY)';
                    document.getElementById('sel-state').disabled = false;
                    document.getElementById('sel-state').innerHTML = '<option>All</option><option>Karnataka</option><option>Madhya Pradesh</option>';
                    
                    document.getElementById('metric-active').innerText = '72';
                    document.getElementById('metric-capacity').innerText = '₹25,20,000';
                    
                    document.getElementById('table-body').innerHTML = `
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-4 font-mono text-xs font-bold" style="color: var(--brand-teal-dark);">KA-BBA-BSC-U01</td>
                            <td class="py-3 px-4 text-xs font-semibold text-slate-700">W-1: Padmanabhanagara</td>
                            <td class="py-3 px-4 text-[11px] font-bold" style="color: var(--brand-teal-light);">Comm/Resi</td>
                            <td class="py-3 px-4 text-[11px] text-slate-400">0 Nodes</td>
                        </tr>
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-4 font-mono text-xs font-bold" style="color: var(--brand-teal-dark);">KA-BBA-BSC-U02</td>
                            <td class="py-3 px-4 text-xs font-semibold text-slate-700">W-2: Kadirenahalli</td>
                            <td class="py-3 px-4 text-[11px] font-bold" style="color: var(--brand-teal-light);">Comm/Resi</td>
                            <td class="py-3 px-4 text-[11px] text-slate-400">0 Nodes</td>
                        </tr>
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-4 font-mono text-xs font-bold" style="color: var(--brand-teal-dark);">KA-BBA-BSC-U04</td>
                            <td class="py-3 px-4 text-xs font-semibold text-slate-700">W-4: BSK Temple Ward</td>
                            <td class="py-3 px-4 text-[11px] font-bold" style="color: var(--brand-teal-light);">Heritage/Comm/Resi</td>
                            <td class="py-3 px-4 text-[11px] text-slate-400">0 Nodes</td>
                        </tr>
                    `;
                }
            });

        }
    } catch (e) {
        console.error("RPC Load Error:", e);
    }
}

// Utility to recreate the multi-colored map aesthetic from your screenshots
function getVisualColor(name) {
    const colors = ['#F1948A', '#82E0AA', '#85C1E9', '#F7DC6F', '#C39BD3', '#F0B27A', '#76D7C4', '#E59866', '#BFC9CA'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    return colors[Math.abs(hash) % colors.length];
}

function loadLeafletLibrary() {
    return new Promise((resolve) => {
        if (window.L) return resolve();
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = () => resolve(); document.head.appendChild(script);
    });
}
