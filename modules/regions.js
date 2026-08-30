// =======================================================================
// NANBI V5.0 - TERRITORY MATRIX ENGINE (RESTORED ORIGINAL CODE)
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Inject the exact layout for the Map and Data panes from your territory_matrix.html
    container.innerHTML = `
        <div class="flex-1 flex flex-col w-full h-full bg-slate-50/50">
            <!-- Header -->
            <div class="flex justify-between items-center mb-4 px-1">
                <div class="flex items-center gap-3">
                    <button onclick="history.back()" class="w-8 h-8 rounded flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-slate-100 transition-colors">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">Territories <span class="text-slate-400 font-normal text-lg ml-2">Matrix Overview</span></h2>
                </div>
                <div class="flex gap-3">
                    <span class="px-3 py-1.5 rounded text-[10px] font-bold text-teal-700 bg-teal-50/50 border border-teal-200 uppercase tracking-wider"><i class="fas fa-circle text-[8px] mr-1"></i> World Active</span>
                    <span class="px-3 py-1.5 rounded text-[10px] font-bold text-slate-500 bg-white border border-slate-200"><i class="fas fa-circle text-[8px] mr-1 text-slate-300"></i> Connected</span>
                </div>
            </div>

            <div class="flex-1 flex flex-col lg:flex-row gap-4 w-full">
                <!-- LEFT COLUMN: Hierarchy & Map (38%) -->
                <aside class="w-full lg:w-[38%] flex flex-col gap-4 shrink-0">
                    <div class="bg-white p-4 rounded border border-slate-200 shadow-sm">
                        <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
                            <span id="geoHierarchyBreadcrumb" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"><i class="fas fa-chevron-left mr-1"></i> <i class="fas fa-chevron-right mr-1"></i> WORLD VIEW</span>
                            <button class="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors"><i class="fas fa-globe mr-1"></i> Globe</button>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="flex flex-col gap-1">
                                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Country</label>
                                <select id="selCountry" class="p-1.5 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 bg-white outline-none">
                                    <option value="All">Loading...</option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">State / Province</label>
                                <select id="selState" disabled class="p-1.5 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 bg-slate-50 outline-none opacity-60">
                                    <option value="All">All</option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">District</label>
                                <select id="selDistrict" disabled class="p-1.5 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 bg-slate-50 outline-none opacity-60">
                                    <option value="All">All</option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Taluk / County</label>
                                <select id="selTaluk" disabled class="p-1.5 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 bg-slate-50 outline-none opacity-60">
                                    <option value="All">All</option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-1 col-span-2">
                                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Ward / Territory</label>
                                <select id="selWard" disabled class="p-1.5 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 bg-slate-50 outline-none opacity-60">
                                    <option value="All">All</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 bg-white p-1.5 rounded border border-slate-200 relative shadow-sm min-h-[400px]">
                        <div id="map-wrapper" style="position:relative; width:100%; height:100%; min-height:400px; z-index:1;">
                            <div id="map" style="position:absolute; inset:0;"></div>
                        </div>
                    </div>
                </aside>

                <!-- RIGHT COLUMN: Metrics & Data Ledger (62%) -->
                <section class="w-full lg:w-[62%] flex flex-col gap-4 shrink-0 lg:shrink">
                    <div class="bg-white p-4 rounded border border-slate-200 flex justify-around items-center shadow-sm">
                        <div class="text-center">
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Territories</p>
                            <p class="text-3xl font-black text-slate-800 mt-1" id="metricCount">0</p>
                        </div>
                        <div class="w-px h-10 bg-slate-200"></div>
                        <div class="text-center">
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market Capacity</p>
                            <p class="text-3xl font-black mt-1" style="color: #D35400;" id="metricCapacity">₹0</p>
                        </div>
                    </div>

                    <div class="flex-1 bg-white rounded border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div class="overflow-y-auto flex-1">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                                    <tr class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th class="py-3 px-4">ID</th>
                                        <th class="py-3 px-4">Ward Name</th>
                                        <th class="py-3 px-4">Biz-Class</th>
                                        <th class="py-3 px-4 text-center">Civic Coverage</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                    <tr>
                                        <td colspan="4" class="py-20 text-center">
                                            <div class="opacity-60 flex flex-col items-center">
                                                <i class="fas fa-layer-group text-4xl text-slate-300 mb-3"></i>
                                                <h4 class="font-bold text-xs uppercase tracking-wider" style="color: #D35400;">Macro Region Selected</h4>
                                                <p class="text-[11px] text-slate-500 mt-1">Drill down to a specific <span class="font-bold text-slate-700">Taluk</span> to view granular Ward data matrices.</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="bg-slate-50 border-t border-slate-200 p-3 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entity Inspector</span>
                            <span class="text-[10px] font-medium text-slate-400" id="inspectorText">Awaiting node selection...</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `;

    // 2. Initialize the Native Leaflet Map Engine (Exactly as you had it)
    if (!window.L) {
        await loadLeafletLibrary(); 
    }
    
    const mapContainer = window.L.DomUtil.get('map');
    if(mapContainer != null){ mapContainer._leaflet_id = null; }

    const map = window.L.map('map', { zoomControl: true, attributionControl: false }).setView([22.5937, 78.9629], 3);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { opacity: 0.5 }).addTo(map);

    // 3. Fetch the Genesis Data via YOUR RPC (Using the global nanbiDB from router)
    try {
        const res = await window.nanbiDB.rpc('get_countries_geojson');
        
        if(res.data && res.data.length > 0) {
            const sel = document.getElementById('selCountry');
            sel.innerHTML = '<option value="All">Global Overview</option>';
            
            const featureGroup = window.L.featureGroup();
            
            res.data.forEach(c => {
                sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
                if(c.geojson) {
                    try {
                        const layer = window.L.geoJSON(JSON.parse(c.geojson), { 
                            // The exact style settings from your snippet
                            style: { color: '#ffffff', weight: 1, fillColor: '#D35400', fillOpacity: 0.4 } 
                        });
                        layer.on('mouseover', e => { e.target.bringToFront(); e.target.setStyle({stroke: true, color: '#1E293B', weight: 2}); });
                        layer.on('mouseout', e => e.target.setStyle({color: '#ffffff', weight: 1}));
                        featureGroup.addLayer(layer);
                    } catch(err) {
                        console.error("GeoJSON parse error", err);
                    }
                }
            });
            
            sel.disabled = false;
            featureGroup.addTo(map);
            map.fitBounds(featureGroup.getBounds());
            
            // Your exact metric update
            document.getElementById('metricCount').innerText = res.data.length;
        }
    } catch (err) {
        console.error("RPC Error:", err);
    }
}

function loadLeafletLibrary() {
    return new Promise((resolve) => {
        if (window.L) return resolve();
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = () => resolve(); document.head.appendChild(script);
    });
}
