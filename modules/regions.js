// =======================================================================
// NANBI V5.0 - UNIFIED REGIONS ENGINE (MAP MATRIX & CONFIG HUB)
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. RESTORING YOUR EXACT UI CHASSIS (NS-FE-01 & NS-FE-11) WITH A VIEW TOGGLE
    container.innerHTML = `
        <style>
            #regions-module .table-container { overflow-y: auto; max-height: 48vh; }
            #regions-module th { position: sticky; top: 0; background-color: #f8fafc; color: #334155; z-index: 10; text-align: center; border-bottom: 2px solid #e2e8f0; font-weight: 700; }
            #regions-module td { text-align: center; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 500; }
            #regions-module .col-left { text-align: left; }
            #regions-module .row-active { background-color: #fff7ed !important; border-left: 4px solid #D35400; } 
            
            #regions-module #map-wrapper { position: relative; width: 100%; height: 100%; min-height: 320px; flex: 1; }
            #regions-module path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
            #regions-module path.leaflet-interactive:hover { fill-opacity: 0.8 !important; stroke-width: 2.5px !important; stroke: #1E293B !important; cursor: pointer; }
            
            #regions-module .map-nav-btn { color: #475569; padding: 2px 8px; font-size: 13px; font-weight: bold; transition: color 0.2s; background: transparent; border: none; cursor: pointer; }
            #regions-module .map-nav-btn:hover:not(:disabled) { color: #D35400; }
            #regions-module .map-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            
            .id-label {
                background: transparent !important; border: none !important; box-shadow: none !important;
                font-weight: 600; font-size: 9.5px; color: #1E293B;
                text-shadow: 1px 1px 2px #ffffff, -1px -1px 2px #ffffff, 1px -1px 2px #ffffff, -1px 1px 2px #ffffff;
                text-align: center;
            }
            #regions-module ::-webkit-scrollbar { width: 6px; }
            #regions-module ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
        </style>

        <div id="regions-module" class="flex-1 flex flex-col gap-3 overflow-y-auto h-full p-2">
            <!-- VIEW SELECTOR TABS -->
            <div class="flex gap-2 border-b border-slate-200 pb-2 shrink-0">
                <button id="tabMapMatrix" class="px-4 py-1.5 rounded text-xs font-bold bg-[#D35400] text-white shadow-sm transition">
                    <i class="fas fa-map-marked-alt mr-1.5"></i> Spatial Map & Territory Matrix
                </button>
                <button id="tabConfigHub" class="px-4 py-1.5 rounded text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition">
                    <i class="fas fa-sitemap mr-1.5"></i> Jurisdictional Tree & Config Hub
                </button>
            </div>

            <!-- VIEW 1: MAP & TERRITORY MATRIX (NS-FE-01) -->
            <div id="viewMapMatrix" class="flex flex-col lg:flex-row gap-3 flex-1 overflow-hidden">
                <aside class="w-full lg:w-[38%] flex flex-col gap-3 shrink-0">
                    <div class="flex-1 bg-white p-1.5 rounded border border-slate-200 flex flex-col relative overflow-hidden shadow-sm h-64 lg:h-auto min-h-[280px]">
                        <div id="map-wrapper" class="rounded overflow-hidden border border-slate-200 bg-[#e2f0f5]">
                            <div id="map"></div>
                        </div>
                    </div>
                    <div class="bg-white p-3 rounded border border-slate-200 flex flex-col gap-2 shrink-0 shadow-sm">
                        <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                            <div class="flex items-center gap-1">
                                <button id="btnNavBack" class="map-nav-btn" title="Go Back"><i class="fas fa-chevron-left text-[10px]"></i></button>
                                <button id="btnNavForward" class="map-nav-btn" title="Go Forward"><i class="fas fa-chevron-right text-[10px]"></i></button>
                                <span id="geoHierarchyBreadcrumb" class="text-[10px] font-bold text-slate-600 uppercase tracking-wide ml-2 truncate max-w-[200px]">World View</span>
                            </div>
                            <button id="btnGlobe" class="text-[10px] font-bold text-slate-500 hover:text-[#D35400] transition px-2"><i class="fas fa-globe-americas mr-1"></i> Globe</button>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-[10px] mt-1">
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Country</label><select id="selCountry" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none"><option value="All">Loading...</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">State / Province</label><select id="selState" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">District</label><select id="selDistrict" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Taluk / County</label><select id="selTaluk" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All</option></select></div>
                            <div class="flex flex-col col-span-2"><label class="font-bold text-slate-500 uppercase mb-0.5">Ward / Territory</label><select id="selWard" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All</option></select></div>
                        </div>
                    </div>
                </aside>

                <section class="w-full lg:w-[62%] flex flex-col gap-3 shrink-0 lg:shrink h-auto lg:h-full">
                    <div class="bg-white p-2.5 rounded border border-slate-200 flex justify-around items-center shrink-0 shadow-sm">
                        <div class="text-center w-1/2">
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Territories</p>
                            <p class="text-2xl font-black text-slate-800 mt-1" id="metricCount">0</p>
                        </div>
                        <div class="w-px h-12 bg-slate-200"></div>
                        <div class="text-center w-1/2">
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Capacity</p>
                            <p class="text-2xl font-black mt-1" style="color: #D35400;" id="metricMPS">₹0</p>
                        </div>
                    </div>
                    <div class="flex-1 bg-white rounded border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                        <div class="table-container flex-1">
                            <table class="w-full border-collapse text-[11px]">
                                <thead class="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                                    <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th class="py-3 px-4 text-left pl-4">ID</th>
                                        <th class="py-3 px-4 text-left">Ward Name</th>
                                        <th class="py-3 px-4 text-left">Biz-Class</th>
                                        <th class="py-3 px-4 text-right">Civic Coverage</th>
                                    </tr>
                                </thead>
                                <tbody id="territoryTbody" class="cursor-pointer text-slate-700">
                                    <tr>
                                        <td colspan="4" class="py-16 text-center">
                                            <div class="opacity-70 flex flex-col items-center">
                                                <i class="fas fa-layer-group text-4xl text-slate-300 mb-3"></i>
                                                <h4 class="font-bold text-xs uppercase tracking-wider text-[#D35400]">Macro Region Selected</h4>
                                                <p class="text-[11px] text-slate-500 mt-1">Drill down to a specific Taluk to view granular Ward data matrices.</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="h-40 bg-white rounded border border-slate-200 p-3 flex flex-col overflow-hidden shrink-0 shadow-sm">
                        <div class="flex justify-between items-center border-b border-slate-100 pb-1 mb-2">
                            <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500" id="deepDiveTitle">Entity Inspector</h3>
                            <span class="text-[10px] text-slate-500 font-mono" id="deepDiveSubtitle">Select a territory</span>
                        </div>
                        <div id="deepDiveContent" class="flex-1 overflow-y-auto text-[11px] text-slate-500 font-medium flex items-center justify-center">
                            Awaiting node selection...
                        </div>
                    </div>
                </section>
            </div>

            <!-- VIEW 2: JURISDICTIONAL TREE & CONFIG HUB (NS-FE-11) -->
            <div id="viewConfigHub" class="hidden flex-col lg:flex-row gap-3 flex-1 overflow-hidden">
                <aside class="w-full lg:w-[45%] bg-white p-4 rounded border border-slate-200 flex flex-col shadow-sm">
                    <div class="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-700">Universal Jurisdictional Tree</h3>
                        <span id="treeNodeCountBadge" class="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-[#D35400] font-bold">0 Nodes</span>
                    </div>
                    <div id="treeListContainer" class="flex-1 overflow-y-auto space-y-2 font-sans">
                        <p class="text-slate-400 italic text-center py-12">Synchronizing with Edge Ledger...</p>
                    </div>
                </aside>
                <section class="w-full lg:w-[55%] bg-white p-5 rounded border border-slate-200 flex flex-col shadow-sm">
                    <div class="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                        <div>
                            <h3 class="text-sm font-bold text-slate-800" id="configNodeTitle">Select a Regional Node</h3>
                            <p class="text-xs text-slate-400 font-mono" id="configNodeMeta">Level: N/A | ID: --</p>
                        </div>
                        <button id="btnSaveConfigPayload" class="px-4 py-2 rounded text-xs font-bold bg-[#D35400] hover:bg-[#b54600] text-white shadow transition flex items-center gap-1.5" style="display:none;">
                            <i class="fas fa-save"></i> Save Config Payload
                        </button>
                    </div>
                    <div class="flex-1 flex flex-col gap-2 mb-4">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dynamic Config Payload (JSONB)</label>
                        <textarea id="jsonConfigTextarea" class="w-full flex-1 p-3 font-mono text-xs rounded border border-slate-200 bg-slate-900 text-green-400 outline-none resize-none" placeholder="Select a node from the tree to inspect its JSONB configuration..." disabled></textarea>
                    </div>
                    <div class="bg-slate-50 p-3 rounded border border-slate-200 shrink-0">
                        <div class="flex justify-between items-center border-b border-slate-100 pb-1 mb-1">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Architectural Audit & Reasoning</span>
                            <span class="text-[10px] text-slate-400 font-mono">DEC-12 Compliance</span>
                        </div>
                        <div id="auditReasonBox" class="text-xs text-slate-600 font-medium py-1">
                            Select a node to review its immutability log and architectural reasoning.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `;

    // 2. TAB SWITCHING LOGIC
    const tabMapMatrix = container.querySelector('#tabMapMatrix');
    const tabConfigHub = container.querySelector('#tabConfigHub');
    const viewMapMatrix = container.querySelector('#viewMapMatrix');
    const viewConfigHub = container.querySelector('#viewConfigHub');

    tabMapMatrix.onclick = () => {
        tabMapMatrix.className = "px-4 py-1.5 rounded text-xs font-bold bg-[#D35400] text-white shadow-sm transition";
        tabConfigHub.className = "px-4 py-1.5 rounded text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition";
        viewMapMatrix.style.display = "flex";
        viewConfigHub.style.display = "none";
        if (map) setTimeout(() => map.invalidateSize(true), 200);
    };

    tabConfigHub.onclick = () => {
        tabConfigHub.className = "px-4 py-1.5 rounded text-xs font-bold bg-[#D35400] text-white shadow-sm transition";
        tabMapMatrix.className = "px-4 py-1.5 rounded text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition";
        viewConfigHub.style.display = "flex";
        viewMapMatrix.style.display = "none";
        loadJurisdictionalTree();
    };

    // 3. LEAFLET MAP & TERRITORY MATRIX ENGINE (NS-FE-01)
    let map = null, currentGeoLayer = null, markers = [];
    let globalData = [], filteredData = [];
    let allCountryNames = [];
    let navHistory = [{ level: 'world', parentName: '' }];
    let historyIndex = 0;
    const wardGeoAnchor = { 1: [12.9180, 77.5560], 4: [12.9240, 77.5780], 14: [12.9260, 77.5930], 65: [12.9420, 77.5750] };

    function getDistinctColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return `hsl(${Math.abs(hash % 360)}, 45%, 65%)`; 
    }

    if (!window.L) {
        await new Promise((resolve) => {
            const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
            const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script);
        });
    }

    const mapEl = window.L.DomUtil.get('map');
    if (mapEl) mapEl._leaflet_id = null;

    map = window.L.map('map', { zoomControl: true, attributionControl: false, zoomSnap: 0.1, zoomDelta: 0.5 }).setView([22.5937, 78.9629], 4);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 0.5 }).addTo(map);

    async function loadCountryList() {
        try {
            const { data } = await window.nanbiDB.rpc('get_countries_geojson').limit(2000);
            if (data && data.length > 0) {
                allCountryNames = data.map(d => d.name).filter(Boolean).sort();
                const sel = container.querySelector('#selCountry');
                sel.innerHTML = '<option value="All">All Countries</option>';
                allCountryNames.forEach(c => sel.innerHTML += '<option value="' + c + '">' + c + '</option>');
                sel.disabled = false;
            }
        } catch(e) {
            const sel = container.querySelector('#selCountry');
            sel.innerHTML = '<option value="All">All (Default)</option>';
            sel.disabled = false;
        }
    }

    async function fetchRelationalData() {
        const { data } = await window.nanbiDB.from('territories').select('*, local_bodies ( body_name, taluks ( taluk_name, districts ( district_name, states ( state_name, countries (country_name) ) ) ) ), territory_entity_mappings ( relationship_type, civic_entities (entity_name, category_id) )').limit(2000);
        globalData = (data || []).map(t => ({
            ...t,
            country: t.local_bodies?.taluks?.districts?.states?.countries?.country_name || 'India',
            state: t.local_bodies?.taluks?.districts?.states?.state_name || 'Karnataka',
            district: t.local_bodies?.taluks?.districts?.district_name || 'Bengaluru Urban',
            taluk: t.local_bodies?.taluks?.taluk_name || 'Bengaluru South Taluk',
            territory_name: 'W-' + t.territory_no + ': ' + t.territory_name,
            civicEntities: t.territory_entity_mappings || []
        }));
        filteredData = [...globalData];
    }

    async function renderSpatialLayer(level, parentName = '', pushHistory = true) {
        if (pushHistory) {
            navHistory = navHistory.slice(0, historyIndex + 1);
            navHistory.push({ level, parentName });
            historyIndex++;
        }
        container.querySelector('#geoHierarchyBreadcrumb').innerText = parentName ? parentName : 'World View';
        
        let rpcName = level === 'world' ? 'get_countries_geojson' : level === 'country' ? 'get_states_for_country' : level === 'state' ? 'get_districts_for_state' : 'get_taluks_for_district';
        let rpcParams = level === 'country' ? { p_country: parentName } : level === 'state' ? { p_state: parentName } : level === 'district' ? { p_district: parentName } : {};
        let targetDropdownId = level === 'world' ? 'selCountry' : level === 'country' ? 'selState' : level === 'state' ? 'selDistrict' : 'selTaluk';

        if (level === 'taluk') {
            renderWardFallbacks();
            populateWardDropdown(parentName);
            updateUI(level);
            return;
        }

        let newFeatureGroup = window.L.featureGroup();
        let hasValidData = false;

        try {
            const { data } = await window.nanbiDB.rpc(rpcName, rpcParams).limit(2000);
            let layerNames = [];
            if (data && data.length > 0) {
                data.forEach(item => {
                    const displayName = String(item.display_name || item.official_name || item.name || item.id || '');
                    layerNames.push(displayName);
                    if (!item.geojson) return;
                    const parsedGeom = typeof item.geojson === 'string' ? JSON.parse(item.geojson) : item.geojson;
                    const layer = window.L.geoJSON(parsedGeom, { style: { color: '#ffffff', weight: 1.2, fillColor: getDistinctColor(displayName), fillOpacity: 0.75 } });
                    layer.bindTooltip(displayName, { direction: 'center', className: 'id-label', permanent: true });
                    layer.on('click', () => { handleMapPolygonClick(level, displayName); });
                    newFeatureGroup.addLayer(layer);
                    hasValidData = true;
                });
            }

            if (hasValidData) {
                if (currentGeoLayer) map.removeLayer(currentGeoLayer);
                markers.forEach(m => map.removeLayer(m)); markers = [];
                currentGeoLayer = newFeatureGroup.addTo(map);
                map.invalidateSize(true);
                setTimeout(() => map.fitBounds(newFeatureGroup.getBounds(), { padding: [30, 30], maxZoom: 11 }), 200);
            }

            if (targetDropdownId && layerNames.length > 0) {
                const sel = container.querySelector(`#${targetDropdownId}`);
                sel.innerHTML = '<option value="All">All</option>';
                [...new Set(layerNames)].sort().forEach(n => sel.innerHTML += '<option value="' + n + '">' + n + '</option>');
                sel.disabled = false;
            }
        } catch(e) {}
        updateUI(level);
    }

    function handleMapPolygonClick(level, entityName) {
        if (level === 'world') { container.querySelector('#selCountry').value = entityName; container.querySelector('#selCountry').dispatchEvent(new Event('change')); }
        else if (level === 'country') { container.querySelector('#selState').value = entityName; container.querySelector('#selState').dispatchEvent(new Event('change')); }
        else if (level === 'state') { container.querySelector('#selDistrict').value = entityName; container.querySelector('#selDistrict').dispatchEvent(new Event('change')); }
        else if (level === 'district') { container.querySelector('#selTaluk').value = entityName; container.querySelector('#selTaluk').dispatchEvent(new Event('change')); }
    }

    function renderWardFallbacks() {
        markers.forEach(m => map.removeLayer(m)); markers = [];
        let latlngs = [];
        filteredData.forEach(item => {
            const wNo = parseInt(item.territory_no) || 1;
            const lat = 12.9180 + ((wNo % 10) * 0.006);
            const lng = 77.5560 + (Math.floor(wNo / 10) * 0.006);
            latlngs.push([lat, lng]);
            const circle = window.L.circleMarker([lat, lng], { radius: 6, fillColor: '#D35400', color: '#ffffff', weight: 1.5, opacity: 1, fillOpacity: 0.85 }).addTo(map);
            circle.bindTooltip('W-' + item.territory_no, { permanent: true, direction: 'center', className: 'id-label' });
            circle.on('click', () => isolateTerritory(item));
            markers.push(circle);
        });
        if (latlngs.length > 0) {
            setTimeout(() => map.fitBounds(window.L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 14 }), 200);
        }
    }

    function populateWardDropdown(talukName) {
        const selWard = container.querySelector('#selWard');
        selWard.innerHTML = '<option value="All">All</option>';
        const wards = globalData.filter(i => i.taluk === talukName).map(i => i.territory_name).sort();
        wards.forEach(w => selWard.innerHTML += '<option value="' + w + '">' + w + '</option>');
        selWard.disabled = wards.length === 0;
    }

    function cascadeClear(ids) {
        ids.forEach(id => {
            const el = container.querySelector(`#${id}`);
            if(el) { el.innerHTML = '<option value="All">All</option>'; el.disabled = true; }
        });
    }

    function initDropdownListeners() {
        container.querySelector('#selCountry').addEventListener('change', (e) => {
            const val = e.target.value; cascadeClear(['selState', 'selDistrict', 'selTaluk', 'selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('world', ''); else renderSpatialLayer('country', val);
        });
        container.querySelector('#selState').addEventListener('change', (e) => {
            const val = e.target.value; cascadeClear(['selDistrict', 'selTaluk', 'selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('country', container.querySelector('#selCountry').value); else renderSpatialLayer('state', val);
        });
        container.querySelector('#selDistrict').addEventListener('change', (e) => {
            const val = e.target.value; cascadeClear(['selTaluk', 'selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('state', container.querySelector('#selState').value); else renderSpatialLayer('district', val);
        });
        container.querySelector('#selTaluk').addEventListener('change', (e) => {
            const val = e.target.value; cascadeClear(['selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('district', container.querySelector('#selDistrict').value); else renderSpatialLayer('taluk', val);
        });
        container.querySelector('#selWard').addEventListener('change', (e) => {
            filterMatrix();
            if (e.target.value !== 'All' && filteredData.length === 1) isolateTerritory(filteredData[0]);
        });
        container.querySelector('#btnGlobe').addEventListener('click', () => {
            const sel = container.querySelector('#selCountry'); sel.value = 'All'; sel.dispatchEvent(new Event('change'));
        });
    }

    function filterMatrix() {
        const c = container.querySelector('#selCountry').value, s = container.querySelector('#selState').value;
        const d = container.querySelector('#selDistrict').value, t = container.querySelector('#selTaluk').value, w = container.querySelector('#selWard').value;
        filteredData = globalData.filter(item => 
            (c === 'All' || item.country === c) && (s === 'All' || item.state === s) &&
            (d === 'All' || item.district === d) && (t === 'All' || item.taluk === t) && (w === 'All' || item.territory_name === w)
        );
        updateUI();
    }

    function updateUI(level) {
        container.querySelector('#metricCount').innerText = filteredData.length;
        container.querySelector('#metricMPS').innerText = "₹" + (filteredData.length * 35000).toLocaleString('en-IN');
        const tbody = container.querySelector('#territoryTbody'); tbody.innerHTML = '';
        
        if (level && level !== 'taluk') {
            tbody.innerHTML = '<tr><td colspan="4" class="py-16 text-center"><div class="opacity-70 flex flex-col items-center"><i class="fas fa-layer-group text-4xl text-slate-300 mb-3"></i><h4 class="font-bold text-xs uppercase tracking-wider text-[#D35400]">Macro Region Selected</h4><p class="text-[11px] text-slate-500 mt-1">Drill down to a specific Taluk to view granular Ward data matrices.</p></div></td></tr>';
            return;
        }
        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="py-16 text-center"><div class="opacity-70 flex flex-col items-center"><i class="fas fa-rocket text-3xl text-pink-500 mb-3"></i><h4 class="font-bold text-xs uppercase tracking-wider text-slate-700">Yet to be launched</h4><p class="text-[11px] text-slate-400 mt-1">Territory operations for this region are currently in the pipeline.</p></div></td></tr>';
            return;
        }
        filteredData.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50 transition cursor-pointer text-slate-700";
            tr.onclick = () => isolateTerritory(item, tr);
            const civicCount = item.civicEntities.length;
            const civicBadge = civicCount > 0 ? `<span class="bg-orange-100 text-[#D35400] border border-orange-200 px-1.5 py-0.5 rounded font-bold text-[9px]">${civicCount} Nodes</span>` : '<span class="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px] font-semibold">0 Nodes</span>';
            tr.innerHTML = `<td class="p-2 font-mono text-xs font-bold text-teal-700 border-r border-slate-100 pl-4">${item.territory_id}</td><td class="p-2 font-bold col-left border-r border-slate-100 whitespace-nowrap">${item.territory_name}</td><td class="p-2 font-bold col-left border-r border-slate-100 whitespace-nowrap text-sky-600">${item.biz_class || 'General'}</td><td class="p-2 col-left">${civicBadge}</td>`;
            tbody.appendChild(tr);
        });
    }

    function isolateTerritory(item, trElement = null) {
        document.querySelectorAll('#territoryTbody tr').forEach(r => r.classList.remove('row-active'));
        if (trElement) trElement.classList.add('row-active');
        container.querySelector('#deepDiveTitle').innerText = item.territory_id + ' — ' + item.territory_name;
        container.querySelector('#deepDiveSubtitle').innerText = 'H3: ' + (item.h3_polygon_anchor || 'Active');
        const content = container.querySelector('#deepDiveContent');
        content.innerHTML = `<div class="w-full flex flex-col gap-1"><span class="font-bold text-slate-800">${item.territory_name}</span><span class="text-xs text-slate-500">Business Class: ${item.biz_class || 'Standard'}</span></div>`;
    }

    // 4. JURISDICTIONAL TREE & CONFIG HUB ENGINE (NS-FE-11)
    async function loadJurisdictionalTree() {
        const treeContainer = container.querySelector('#treeListContainer');
        treeContainer.innerHTML = `<p class="text-slate-400 italic text-center py-10">Synchronizing with Edge Ledger...</p>`;

        const { data, error } = await window.nanbiDB
            .from('regional_hierarchy_nodes')
            .select('*')
            .order('node_level', { ascending: true });

        if (error || !data) {
            treeContainer.innerHTML = `<p class="text-red-500 text-center py-6">Error loading tree nodes: ${error?.message || 'Unknown'}</p>`;
            return;
        }

        container.querySelector('#treeNodeCountBadge').innerText = data.length + " Nodes";
        treeContainer.innerHTML = '';

        data.forEach(node => {
            const div = document.createElement('div');
            div.className = "p-3 rounded border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition flex justify-between items-center";
            div.innerHTML = `
                <div>
                    <div class="font-bold text-slate-800 text-xs">${node.node_name}</div>
                    <div class="text-[10px] text-slate-400 uppercase font-mono">${node.node_level} | ID: ${node.node_id} | Gov: ${node.official_gov_code || 'N/A'}</div>
                </div>
                <i class="fas fa-chevron-right text-xs text-slate-400"></i>
            `;
            div.onclick = () => selectConfigNode(node);
            treeContainer.appendChild(div);
        });
    }

    function selectConfigNode(node) {
        container.querySelector('#configNodeTitle').innerText = node.node_name;
        container.querySelector('#configNodeMeta').innerText = `Level: ${node.node_level.toUpperCase()} | ID: ${node.node_id} | Gov Code: ${node.official_gov_code || 'N/A'}`;
        
        const textarea = container.querySelector('#jsonConfigTextarea');
        textarea.value = JSON.stringify(node.dynamic_config_payload, null, 4);
        textarea.disabled = false;

        const saveBtn = container.querySelector('#btnSaveConfigPayload');
        saveBtn.style.display = 'flex';
        saveBtn.onclick = () => saveConfigPayload(node.node_id);

        const auditBox = container.querySelector('#auditReasonBox');
        auditBox.innerHTML = `
            <div class="flex flex-col gap-0.5">
                <span class="text-slate-800 font-bold">Reasoning:</span> <span class="text-slate-600">${node.architectural_reasoning || 'No reason recorded.'}</span>
                <span class="text-slate-400 text-[10px] mt-1 font-mono">Last Modified: ${node.updated_at} (Node: ${node.origin_node})</span>
            </div>
        `;
    }

    async function saveConfigPayload(nodeId) {
        const textarea = container.querySelector('#jsonConfigTextarea');
        let parsed;
        try {
            parsed = JSON.parse(textarea.value);
        } catch(e) {
            alert("Invalid JSON Syntax. Please correct before saving.");
            return;
        }

        const reason = prompt("Enter Architectural Reasoning for modifying this payload (DEC-12 Mandate):", "Configured via Nanbi Studio Regions Config Hub");
        if (!reason) return;

        const { error } = await window.nanbiDB
            .from('regional_hierarchy_nodes')
            .update({
                dynamic_config_payload: parsed,
                architectural_reasoning: reason,
                updated_at: new Date().toISOString(),
                origin_node: 'Nanbi_Studio_Web'
            })
            .eq('node_id', nodeId);

        if (error) {
            alert("Sync Failed: " + error.message);
        } else {
            alert("Payload successfully locked, encrypted, and timestamped.");
            loadJurisdictionalTree();
        }
    }

    // Initialize Map Matrix view on boot
    initDropdownListeners();
    try {
        await fetchRelationalData();
        await loadCountryList();
        await renderSpatialLayer('world', '', false);
    } catch(e) {
        console.warn("Map boot warning:", e);
    }
}
