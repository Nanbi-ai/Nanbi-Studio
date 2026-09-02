// =======================================================================
// NANBI V5.0 - TERRITORY MATRIX ENGINE (RESTORED NATIVE TAILWIND UI)
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. EXACT HTML & TAILWIND CHASSIS FROM TERRITORY-MATRIX.HTML
    container.innerHTML = `
        <style>
            #regions-module .table-container { overflow-y: auto; max-height: 52vh; }
            #regions-module th { position: sticky; top: 0; background-color: #f8fafc; color: #334155; z-index: 10; text-align: center; border-bottom: 2px solid #e2e8f0; font-weight: 700; }
            #regions-module td { text-align: center; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 500;}
            #regions-module .col-left { text-align: left; }
            #regions-module .row-active { background-color: #fff7ed !important; border-left: 4px solid #D35400; } 
            
            #regions-module #map-wrapper { position: relative; width: 100%; height: 100%; min-height: 350px; flex: 1; }
            @media (min-width: 1024px) { #regions-module #map-wrapper { min-height: 420px; } }
            #regions-module #map { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 0.25rem; z-index: 1; }
            
            /* Dark Navy Hover Stroke Fix */
            #regions-module path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
            #regions-module path.leaflet-interactive:hover { fill-opacity: 0.8 !important; stroke-width: 2.5px !important; stroke: #1E293B !important; cursor: pointer; }
            
            #regions-module .map-nav-btn { color: #475569; padding: 2px 8px; font-size: 13px; font-weight: bold; transition: color 0.2s; background: transparent; border: none; cursor: pointer; }
            #regions-module .map-nav-btn:hover:not(:disabled) { color: #D35400; }
            #regions-module .map-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            
            /* 9.5px Non-Bold Labels */
            .id-label {
                background: transparent !important; border: none !important; box-shadow: none !important;
                font-weight: 600; font-size: 9.5px; color: #1E293B;
                text-shadow: 1px 1px 2px #ffffff, -1px -1px 2px #ffffff, 1px -1px 2px #ffffff, -1px 1px 2px #ffffff;
                text-align: center;
            }

            #regions-module ::-webkit-scrollbar { width: 6px; }
            #regions-module ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
            #regions-module .hide-scroll::-webkit-scrollbar { display: none; }
            #regions-module .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            #regions-module select { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill="%2394a3b8" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'); background-repeat: no-repeat; background-position: right 4px center; }
        </style>

        <div id="regions-module" class="flex-1 flex flex-col lg:flex-row gap-3 overflow-y-auto lg:overflow-hidden h-full">
            
            <!-- LEFT COLUMN: MAP & DROPDOWNS -->
            <aside class="w-full lg:w-[38%] flex flex-col gap-3 shrink-0">
                <div class="flex-1 bg-white p-1.5 rounded border border-slate-200 flex flex-col relative overflow-hidden shadow-sm h-64 lg:h-auto min-h-[300px]">
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

            <!-- RIGHT COLUMN: STATS & TABLES -->
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
                    <div class="table-container flex-1 hide-scroll">
                        <table class="w-full border-collapse text-[11px]">
                            <thead class="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                                <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th class="py-4 px-6 text-left pl-4">ID</th>
                                    <th class="py-4 px-6 text-left">Ward Name</th>
                                    <th class="py-4 px-6 text-left">Biz-Class</th>
                                    <th class="py-4 px-6 text-right">Civic Coverage</th>
                                </tr>
                            </thead>
                            <tbody id="territoryTbody" class="cursor-pointer text-slate-700">
                                <tr>
                                    <td colspan="4" class="py-24 text-center">
                                        <div class="opacity-70 flex flex-col items-center">
                                            <i class="fas fa-layer-group text-5xl text-slate-300 mb-4"></i>
                                            <h4 class="font-bold text-sm uppercase tracking-wider" style="color: #D35400;">Macro Region Selected</h4>
                                            <p class="text-[12px] text-slate-500 mt-2">Drill down to a specific <span class="font-bold text-slate-700">Taluk</span> to view granular Ward data matrices.</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="h-[22vh] min-h-[160px] bg-white rounded border border-slate-200 p-3 flex flex-col overflow-hidden shrink-0 shadow-sm">
                    <div class="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2">
                        <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500" id="deepDiveTitle">Entity Inspector</h3>
                        <span class="text-[10px] text-slate-500 font-mono" id="deepDiveSubtitle">Select a territory</span>
                    </div>
                    <div id="deepDiveContent" class="flex-1 overflow-y-auto text-[11px] text-slate-500 font-medium flex items-center justify-center">
                        Awaiting node selection...
                    </div>
                </div>
            </section>
        </div>
    `;

    // 2. ENCAPSULATED MODULE STATE
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

    // 3. SECURE LEAFLET LOADER & INITIALIZATION
    if (!window.L) {
        await new Promise((resolve) => {
            const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
            const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script);
        });
    }

    const mapContainerEl = window.L.DomUtil.get('map');
    if(mapContainerEl != null){ mapContainerEl._leaflet_id = null; }

    map = window.L.map('map', { zoomControl: true, attributionControl: false, zoomSnap: 0.1, zoomDelta: 0.5 }).setView([22.5937, 78.9629], 4);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 0.5 }).addTo(map);
    window.addEventListener('resize', () => { if(map) map.invalidateSize(true); });

    // 4. CORE ENGINE FUNCTIONS
    async function loadCountryList() {
        const { data } = await window.nanbiDB.rpc('get_countries_geojson').limit(2000);
        if (data && data.length > 0) {
            allCountryNames = data.map(d => d.name).filter(Boolean).sort();
            const sel = document.getElementById('selCountry');
            sel.innerHTML = '<option value="All">All Countries</option>';
            allCountryNames.forEach(c => sel.innerHTML += '<option value="' + c + '">' + c + '</option>');
            sel.disabled = false;
        }
    }

    async function fetchRelationalData() {
        const { data, error } = await window.nanbiDB
            .from('territories')
            .select('*, local_bodies ( body_name, taluks ( taluk_name, districts ( district_name, states ( state_name, countries (country_name) ) ) ) ), territory_entity_mappings ( relationship_type, civic_entities (entity_name, category_id) )')
            .limit(2000);

        if (error) return;
        globalData = (data || []).map(t => ({
            ...t,
            country: t.local_bodies?.taluks?.districts?.states?.countries?.country_name || 'India',
            state: t.local_bodies?.taluks?.districts?.states?.state_name || 'Karnataka',
            district: t.local_bodies?.taluks?.districts?.district_name || 'Bengal Urban',
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
            updateHistoryButtons();
        }

        document.getElementById('geoHierarchyBreadcrumb').innerText = parentName ? parentName : 'World View';

        let rpcName = ''; let rpcParams = {}; let targetDropdownId = null;
        let parentRpc = ''; let parentParams = {}; 

        if (level === 'world') { 
            rpcName = 'get_countries_geojson'; targetDropdownId = 'selCountry'; 
        }
        else if (level === 'country') { 
            rpcName = 'get_states_for_country'; rpcParams = { p_country: parentName }; targetDropdownId = 'selState'; 
            parentRpc = 'get_country_polygon'; parentParams = { p_country: parentName };
        }
        else if (level === 'state') { 
            rpcName = 'get_districts_for_state'; rpcParams = { p_state: parentName }; targetDropdownId = 'selDistrict'; 
            parentRpc = 'get_state_polygon'; parentParams = { p_state: parentName };
        }
        else if (level === 'district') { 
            rpcName = 'get_taluks_for_district'; rpcParams = { p_district: parentName }; targetDropdownId = 'selTaluk'; 
            parentRpc = 'get_district_polygon'; parentParams = { p_district: parentName };
        }

        if (level === 'taluk') {
            renderWardFallbacks();
            populateWardDropdown(parentName);
            updateUI(level);
            return;
        }

        let newFeatureGroup = window.L.featureGroup();
        let boundsToFit = null;
        let hasValidData = false;

        // 1. FETCH & DRAW PARENT LAYER AS A SOLID BASE (RESTORED RPC LOGIC WITH LIMIT OVERRIDE)
        if (parentRpc && parentName) {
            try {
                const { data: pData } = await window.nanbiDB.rpc(parentRpc, parentParams).limit(2000);
                if (pData && pData.length > 0 && pData[0].geojson) {
                    const pLayer = window.L.geoJSON(JSON.parse(pData[0].geojson), {
                        style: { color: '#D35400', weight: 1.5, fillColor: '#e2e8f0', fillOpacity: 0.3 },
                        interactive: false 
                    });
                    pLayer.bindTooltip(parentName, { permanent: true, direction: 'center', className: 'id-label' });
                    newFeatureGroup.addLayer(pLayer);
                    boundsToFit = pLayer.getBounds();
                    hasValidData = true;
                }
            } catch (e) {
                console.warn("Parent boundary fetch skipped/failed.");
            }
        }

        // 2. FETCH & DRAW CHILD DATA (LIMIT OVERRIDE APPLIED)
        const { data, error } = await window.nanbiDB.rpc(rpcName, rpcParams).limit(2000);
        let layerNames = [];

        if (!error && data && data.length > 0) {
            data.forEach(item => {
                const rawStr = String(item.display_name || item.official_name || item.name || item.id || '');
                const displayName = rawStr;
                
                // ALWAYS push to dropdown array, even if geojson is missing
                layerNames.push(displayName);
                
                if (!item.geojson) return; // Safely skip drawing missing polygons

                try {
                    const parsedGeom = JSON.parse(item.geojson);
                    const polyColor = getDistinctColor(displayName);
                    const layer = window.L.geoJSON(parsedGeom, { 
                        style: { color: '#ffffff', weight: 1.2, fillColor: polyColor, fillOpacity: 0.75 } 
                    });

                    // PERMANENT LABELS: Exclude 'world'. Apply only to Country, State, District (Taluks).
                    const isPermanent = (level === 'country' || level === 'state' || level === 'district');
                    const shortId = rawStr.includes('-') ? rawStr.split('-').pop() : rawStr;
                    
                    const labelContent = isPermanent ? shortId : displayName;

                    layer.bindTooltip(labelContent, { 
                        direction: 'center', 
                        className: 'id-label', 
                        permanent: isPermanent, 
                        interactive: false 
                    });

                    layer.on('mouseover', function() {
                        if (this.getTooltip()) this.getTooltip().setContent('<span style="color:#1E293B; font-size:11px; font-weight:800;">' + displayName + '</span>');
                    });
                    layer.on('mouseout', function() { 
                        if (this.getTooltip()) this.getTooltip().setContent(labelContent); 
                    });
                    layer.on('click', () => { handleMapPolygonClick(level, displayName); });
                    
                    newFeatureGroup.addLayer(layer);
                    hasValidData = true;
                } catch(e) {}
            });
        }

        // 3. SECURE SWAP: NEVER CLEAR THE MAP UNLESS WE HAVE NEW DATA TO SHOW
        if (hasValidData) {
            if (currentGeoLayer) { map.removeLayer(currentGeoLayer); }
            markers.forEach(m => map.removeLayer(m)); markers = [];
            
            currentGeoLayer = newFeatureGroup.addTo(map);

            // GEOGRAPHIC SANITY CHECK: Protects against corrupted data launching the camera to Europe
            if (!boundsToFit && newFeatureGroup.getLayers().length > 0) {
                const childBounds = newFeatureGroup.getBounds();
                const center = childBounds.getCenter();
                if (level !== 'world' && (center.lat < 5 || center.lat > 38 || center.lng < 65 || center.lng > 100)) {
                    console.warn("Corrupted geometry coordinates detected outside India. Ignoring Bounds.");
                } else {
                    boundsToFit = childBounds;
                }
            }

            map.invalidateSize(true);
            setTimeout(() => { 
                map.invalidateSize(true);
                if (boundsToFit && boundsToFit.isValid()) {
                    map.fitBounds(boundsToFit, { padding: [30, 30], maxZoom: level === 'world' ? 3 : 11, animate: true }); 
                } else if (!boundsToFit) {
                    map.setView([22.5937, 78.9629], 4);
                }
            }, 300);
        } else {
            console.warn("No geometry found for this selection. Preserving current map view.");
        }

        // 4. Populate Dropdowns safely using unique sorted names
        if (targetDropdownId && layerNames.length > 0) {
            const sel = document.getElementById(targetDropdownId);
            const currentVal = sel.value;
            sel.innerHTML = '<option value="All">All</option>';
            [...new Set(layerNames)].sort().forEach(n => sel.innerHTML += '<option value="' + n + '">' + n + '</option>');
            sel.value = layerNames.includes(currentVal) ? currentVal : 'All';
            sel.disabled = false;
        }

        updateUI(level);
    }

    function handleMapPolygonClick(level, entityName) {
        if (level === 'world') { document.getElementById('selCountry').value = entityName; document.getElementById('selCountry').dispatchEvent(new Event('change')); }
        else if (level === 'country') { document.getElementById('selState').value = entityName; document.getElementById('selState').dispatchEvent(new Event('change')); }
        else if (level === 'state') { document.getElementById('selDistrict').value = entityName; document.getElementById('selDistrict').dispatchEvent(new Event('change')); }
        else if (level === 'district') { document.getElementById('selTaluk').value = entityName; document.getElementById('selTaluk').dispatchEvent(new Event('change')); }
    }

    function initHistoryControls() {
        document.getElementById('btnNavBack').onclick = () => {
            if (historyIndex > 0) {
                historyIndex--;
                const prev = navHistory[historyIndex];
                syncDropdownsToHistory(prev);
                renderSpatialLayer(prev.level, prev.parentName, false);
                updateHistoryButtons();
            }
        };
        document.getElementById('btnNavForward').onclick = () => {
            if (historyIndex < navHistory.length - 1) {
                historyIndex++;
                const next = navHistory[historyIndex];
                syncDropdownsToHistory(next);
                renderSpatialLayer(next.level, next.parentName, false);
                updateHistoryButtons();
            }
        };
        updateHistoryButtons();
    }

    function updateHistoryButtons() {
        document.getElementById('btnNavBack').disabled = historyIndex === 0;
        document.getElementById('btnNavForward').disabled = historyIndex >= navHistory.length - 1;
    }

    function syncDropdownsToHistory(state) {
        if (state.level === 'world') {
            document.getElementById('selCountry').value = 'All';
            cascadeClear(['selState', 'selDistrict', 'selTaluk', 'selWard']);
        } else if (state.level === 'country') {
            document.getElementById('selCountry').value = state.parentName;
            cascadeClear(['selDistrict', 'selTaluk', 'selWard']);
        } else if (state.level === 'state') {
            document.getElementById('selState').value = state.parentName;
            cascadeClear(['selTaluk', 'selWard']);
        }
        filterMatrix();
    }

    function renderWardFallbacks() {
        markers.forEach(m => map.removeLayer(m)); markers = [];
        let latlngs = [];

        filteredData.forEach(item => {
            const wNo = parseInt(item.territory_no) || 0;
            const row = Math.floor(wNo / 10); const col = wNo % 10;
            const lat = wardGeoAnchor[wNo] ? wardGeoAnchor[wNo][0] : 12.8900 + (row * 0.006);
            const lng = wardGeoAnchor[wNo] ? wardGeoAnchor[wNo][1] : 77.5600 + (col * 0.006);
            latlngs.push([lat, lng]);

            const circle = window.L.circleMarker([lat, lng], { radius: 6, fillColor: '#D35400', color: '#ffffff', weight: 1.5, opacity: 1, fillOpacity: 0.85 }).addTo(map);
            circle.bindTooltip('W-' + item.territory_no, { permanent: true, direction: 'center', className: 'id-label' });
            circle.on('mouseover', (e) => { e.target.bringToFront(); if (circle.getTooltip()) circle.getTooltip().setContent('<span style="color:#1E293B; font-size:11px; font-weight:800;">' + item.territory_name + '</span>'); });
            circle.on('mouseout', () => { if (circle.getTooltip()) circle.getTooltip().setContent('W-' + item.territory_no); });
            circle.on('click', () => { isolateTerritory(item); });
            markers.push(circle);
        });

        if (latlngs.length > 0) { 
            setTimeout(() => { map.invalidateSize(true); map.fitBounds(window.L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 14, animate: false }); }, 300);
        }
    }

    function populateWardDropdown(talukName) {
        const selWard = document.getElementById('selWard');
        selWard.innerHTML = '<option value="All">All</option>';
        const wards = globalData.filter(i => i.taluk === talukName).map(i => i.territory_name).sort();
        wards.forEach(w => selWard.innerHTML += '<option value="' + w + '">' + w + '</option>');
        selWard.disabled = wards.length === 0;
    }

    function cascadeClear(ids) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            el.innerHTML = '<option value="All">All</option>'; el.disabled = true;
        });
    }

    function initDropdownListeners() {
        document.getElementById('selCountry').addEventListener('change', (e) => {
            const val = e.target.value;
            cascadeClear(['selState', 'selDistrict', 'selTaluk', 'selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('world', ''); else renderSpatialLayer('country', val);
        });
        document.getElementById('selState').addEventListener('change', (e) => {
            const val = e.target.value;
            cascadeClear(['selDistrict', 'selTaluk', 'selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('country', document.getElementById('selCountry').value); else renderSpatialLayer('state', val);
        });
        document.getElementById('selDistrict').addEventListener('change', (e) => {
            const val = e.target.value;
            cascadeClear(['selTaluk', 'selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('state', document.getElementById('selState').value); else renderSpatialLayer('district', val);
        });
        document.getElementById('selTaluk').addEventListener('change', (e) => {
            const val = e.target.value;
            cascadeClear(['selWard']); filterMatrix();
            if (val === 'All') renderSpatialLayer('district', document.getElementById('selDistrict').value); else renderSpatialLayer('taluk', val);
        });
        document.getElementById('selWard').addEventListener('change', (e) => {
            filterMatrix();
            if (e.target.value !== 'All' && filteredData.length === 1) isolateTerritory(filteredData[0]);
            else if (e.target.value === 'All') renderSpatialLayer('taluk', document.getElementById('selTaluk').value);
        });
        document.getElementById('btnGlobe').addEventListener('click', () => {
            const sel = document.getElementById('selCountry'); sel.value = 'All'; sel.dispatchEvent(new Event('change'));
        });
    }

    function filterMatrix() {
        const c = document.getElementById('selCountry').value, s = document.getElementById('selState').value;
        const d = document.getElementById('selDistrict').value, t = document.getElementById('selTaluk').value, w = document.getElementById('selWard').value;
        filteredData = globalData.filter(item => 
            (c === 'All' || item.country === c) && (s === 'All' || item.state === s) &&
            (d === 'All' || item.district === d) && (t === 'All' || item.taluk === t) && (w === 'All' || item.territory_name === w)
        );
        updateUI();
    }

    function updateUI(level) {
        document.getElementById('metricCount').innerText = filteredData.length;
        document.getElementById('metricMPS').innerText = "₹" + (filteredData.length * 35000).toLocaleString('en-IN');
        
        const tbody = document.getElementById('territoryTbody'); tbody.innerHTML = '';
        
        if (level === 'world' || level === 'country' || level === 'state' || level === 'district') {
            tbody.innerHTML = '<tr><td colspan="4" class="py-24 text-center"><div class="opacity-70 flex flex-col items-center"><i class="fas fa-layer-group text-5xl text-slate-300 mb-4"></i><h4 class="font-bold text-sm uppercase tracking-wider" style="color: #D35400;">Macro Region Selected</h4><p class="text-[12px] text-slate-500 mt-2">Drill down to a specific <span class="font-bold text-slate-700">Taluk</span> to view granular Ward data matrices.</p></div></td></tr>';
            return;
        }

        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="py-24 text-center"><div class="opacity-70 flex flex-col items-center"><i class="fas fa-rocket text-4xl text-pink-500 mb-4"></i><h4 class="font-bold text-xs uppercase tracking-wider" style="color: #334155;">Yet to be launched</h4><p class="text-[11px] text-slate-400 mt-2">Territory operations for this region are currently in the pipeline.</p></div></td></tr>';
            return;
        }

        filteredData.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50 transition cursor-pointer text-slate-700";
            tr.onclick = () => { isolateTerritory(item, tr); };

            const civicCount = item.civicEntities.length;
            const civicBadge = civicCount > 0 
                ? '<span class="bg-orange-100 text-[#D35400] border border-orange-200 px-1.5 py-0.5 rounded font-bold text-[9px]">' + civicCount + ' Nodes</span>'
                : '<span class="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px] font-semibold">0 Nodes</span>';

            tr.innerHTML = '<td class="p-2 font-mono text-xs font-bold text-teal-700 border-r border-slate-100 pl-4">' + item.territory_id + '</td><td class="p-2 font-bold col-left border-r border-slate-100 whitespace-nowrap">' + item.territory_name + '</td><td class="p-2 font-bold col-left border-r border-slate-100 whitespace-nowrap text-sky-600">' + item.biz_class + '</td><td class="p-2 col-left">' + civicBadge + '</td>';
            tbody.appendChild(tr);
        });
    }

    function isolateTerritory(item, trElement = null) {
        const selWard = document.getElementById('selWard');
        if (selWard && selWard.value !== item.territory_name) { selWard.value = item.territory_name; }

        document.querySelectorAll('#territoryTbody tr').forEach(r => r.classList.remove('row-active'));
        if (trElement) { trElement.classList.add('row-active'); }
        else {
            const rows = document.querySelectorAll('#territoryTbody tr');
            for (let r of rows) {
                if (r.innerText.includes(item.territory_id)) { r.classList.add('row-active'); r.scrollIntoView({block: "center", behavior: "smooth"}); break; }
            }
        }

        const wNo = parseInt(item.territory_no) || 0;
        const row = Math.floor(wNo / 10); const col = wNo % 10;
        const lat = wardGeoAnchor[wNo] ? wardGeoAnchor[wNo][0] : 12.8900 + (row * 0.006);
        const lng = wardGeoAnchor[wNo] ? wardGeoAnchor[wNo][1] : 77.5600 + (col * 0.006);
        
        map.invalidateSize(true);
        setTimeout(() => { map.fitBounds(window.L.latLngBounds([[lat - 0.002, lng - 0.002], [lat + 0.002, lng + 0.002]]), { padding: [25, 25], maxZoom: 15, animate: false }); }, 100);

        document.getElementById('deepDiveTitle').innerText = item.territory_id + ' — ' + item.territory_name;
        document.getElementById('deepDiveSubtitle').innerText = 'H3: ' + item.h3_polygon_anchor;

        const content = document.getElementById('deepDiveContent');
        if (item.civicEntities.length === 0) {
            content.innerHTML = '<div class="text-slate-500 italic w-full text-center text-[11px] font-medium py-4">No mapped infrastructure found for this sector.</div>';
            return;
        }

        let html = '<div class="w-full flex flex-col gap-1.5">';
        item.civicEntities.forEach(ent => {
            let entName = ent.civic_entities?.entity_name || 'Unknown';
            let relType = ent.relationship_type ? ent.relationship_type.replace(/_/g, ' ') : '';
            html += '<div class="bg-slate-50 border border-slate-200 p-1.5 rounded flex justify-between items-center shadow-sm"><div class="flex items-center gap-2"><span class="text-base">🏛️</span><div class="flex flex-col"><span class="font-bold text-[11px] text-slate-800">' + entName + '</span><span class="text-[9px] uppercase font-bold text-slate-500">' + relType + '</span></div></div></div>';
        });
        html += '</div>';
        content.innerHTML = html;
    }

    // 5. START BOOT SEQUENCE
    try {
        initDropdownListeners();
        initHistoryControls();
        await fetchRelationalData(); 
        await loadCountryList();
        await renderSpatialLayer('world', '', false);
    } catch(err) {
        console.error('CRASH:', err.message);
    }
}
