// =======================================================================
// NANBI V5.0 - TERRITORY MATRIX ENGINE (100% SOVEREIGN - NO OSM TILES)
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. EXACT RESTORATION OF YOUR ORIGINAL LAYOUT
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
                            <span id="geoBreadcrumb" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"><i class="fas fa-chevron-left mr-1"></i> <i class="fas fa-chevron-right mr-1"></i> WORLD VIEW</span>
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

                    <!-- Sovereign Integration (No External Tiles) -->
                    <div class="flex-1 bg-white p-1.5 rounded border border-slate-200 relative shadow-sm min-h-[400px]">
                        <div id="map-wrapper" style="position:relative; width:100%; height:100%; min-height:400px; z-index:1;">
                            <div id="map" style="position:absolute; inset:0; background: #e2e8f0; border-radius: 4px;"></div>
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
                            <span class="text-[10px] font-medium text-slate-400" id="inspectorText">Select a territory...</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `;

    // 2. Initialize the Native Leaflet Map Engine (ZERO EXTERNAL TILES)
    if (!window.L) {
        await loadLeafletLibrary(); 
    }
    
    const mapContainer = window.L.DomUtil.get('map');
    if(mapContainer != null){ mapContainer._leaflet_id = null; }

    const map = window.L.map('map', { zoomControl: true, attributionControl: false }).setView([22.5937, 78.9629], 3);
    // ABSOLUTELY NO L.tileLayer(...) HERE. The map background is purely the CSS #e2e8f0.

    const featureGroup = window.L.featureGroup().addTo(map);

    // 3. Fetch the Sovereign GeoJSON Polygons via YOUR RPC
    try {
        const res = await window.nanbiDB.rpc('get_countries_geojson');
        
        if(res.data && res.data.length > 0) {
            const sel = document.getElementById('selCountry');
            sel.innerHTML = '<option value="All">Global Overview</option>';
            
            res.data.forEach(c => {
                sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
                if(c.geojson) {
                    try {
                        const layer = window.L.geoJSON(JSON.parse(c.geojson), { 
                            style: { color: '#ffffff', weight: 1, fillColor: getVisualColor(c.name), fillOpacity: 0.8 } 
                        });
                        layer.on('mouseover', e => { e.target.bringToFront(); e.target.setStyle({stroke: true, color: '#1E293B', weight: 2}); });
                        layer.on('mouseout', e => e.target.setStyle({color: '#ffffff', weight: 1}));
                        
                        layer.on('click', () => {
                            sel.value = c.id;
                            sel.dispatchEvent(new Event('change'));
                        });

                        featureGroup.addLayer(layer);
                    } catch(err) {
                        console.error("GeoJSON parse error", err);
                    }
                }
            });
            
            sel.disabled = false;
            map.fitBounds(featureGroup.getBounds());
            
            document.getElementById('metricCount').innerText = res.data.length;
            document.getElementById('metricCapacity').innerText = '₹' + (res.data.length * 35000).toLocaleString();

            // Interactivity Mock based on your Screenshots
            sel.addEventListener('change', (e) => {
                if (e.target.options[e.target.selectedIndex].text === 'India') {
                    document.getElementById('geoBreadcrumb').innerHTML = '<i class="fas fa-chevron-left mr-1"></i> <i class="fas fa-chevron-right mr-1"></i> INDIA (COUNTRY)';
                    const selState = document.getElementById('selState');
                    selState.disabled = false;
                    selState.classList.remove('bg-slate-50', 'opacity-60');
                    selState.classList.add('bg-white');
                    selState.innerHTML = '<option>All</option><option>Karnataka</option><option>Madhya Pradesh</option><option>Uttar Pradesh</option>';
                    
                    document.getElementById('metricCount').innerText = '72';
                    document.getElementById('metricCapacity').innerText = '₹25,20,000';
                    
                    document.getElementById('tableBody').innerHTML = `
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-4 font-mono text-xs font-bold text-teal-700">KA-BBA-BSC-U01</td>
                            <td class="py-3 px-4 text-xs font-semibold text-slate-700">W-1: Padmanabhanagara</td>
                            <td class="py-3 px-4 text-[10px] font-bold text-teal-600">Comm/Resi</td>
                            <td class="py-3 px-4 text-[10px] text-slate-400 text-center">0 Nodes</td>
                        </tr>
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-4 font-mono text-xs font-bold text-teal-700">KA-BBA-BSC-U02</td>
                            <td class="py-3 px-4 text-xs font-semibold text-slate-700">W-2: Kadirenahalli</td>
                            <td class="py-3 px-4 text-[10px] font-bold text-teal-600">Comm/Resi</td>
                            <td class="py-3 px-4 text-[10px] text-slate-400 text-center">0 Nodes</td>
                        </tr>
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-4 font-mono text-xs font-bold text-teal-700">KA-BBA-BSC-U03</td>
                            <td class="py-3 px-4 text-xs font-semibold text-slate-700">W-3: Yarab Nagar</td>
                            <td class="py-3 px-4 text-[10px] font-bold text-teal-600">Comm/Resi</td>
                            <td class="py-3 px-4 text-[10px] text-slate-400 text-center">0 Nodes</td>
                        </tr>
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-4 font-mono text-xs font-bold text-teal-700">KA-BBA-BSC-U04</td>
                            <td class="py-3 px-4 text-xs font-semibold text-slate-700">W-4: BSK Temple Ward</td>
                            <td class="py-3 px-4 text-[10px] font-bold text-teal-600">Heritage/Comm/Resi</td>
                            <td class="py-3 px-4 text-[10px] text-slate-400 text-center">0 Nodes</td>
                        </tr>
                    `;
                }
            });
        }
    } catch (err) {
        console.error("RPC Error:", err);
    }
}

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
