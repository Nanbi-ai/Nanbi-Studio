// =======================================================================
// NANBI V5.0 - TERRITORY MATRIX ENGINE (NATIVE MODULAR INTEGRATION)
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. INJECT SCOPED CSS & EXACT LAYOUT CHASSIS (MAPPED TO CSS VARIABLES)
    container.innerHTML = `
        <style>
            #regions-module .table-container { overflow-y: auto; max-height: 52vh; }
            #regions-module th { position: sticky; top: 0; background-color: var(--bg); color: var(--text); z-index: 10; text-align: center; border-bottom: 2px solid var(--border); font-weight: 700; }
            #regions-module td { text-align: center; border-bottom: 1px solid var(--border); color: var(--text); font-weight: 500;}
            #regions-module .col-left { text-align: left; }
            #regions-module .row-active { background-color: var(--hover-bg) !important; border-left: 4px solid var(--brand-orange-dark); }
            #regions-module #map-wrapper { position: relative; width: 100%; height: 100%; min-height: 350px; flex: 1; }
            @media (min-width: 1024px) { #regions-module #map-wrapper { min-height: 420px; } }
            #regions-module #map { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 0.25rem; z-index: 1; background: var(--bg); }
            
            /* Map Hover & Tools */
            path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
            path.leaflet-interactive:hover { fill-opacity: 0.8 !important; stroke-width: 2.5px !important; stroke: var(--text) !important; cursor: pointer; }
            #regions-module .map-nav-btn { color: var(--muted); padding: 2px 8px; font-size: 13px; font-weight: bold; transition: color 0.2s; background: transparent; border: none; cursor: pointer; }
            #regions-module .map-nav-btn:hover:not(:disabled) { color: var(--brand-orange-dark); }
            #regions-module .map-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            
            .id-label { background: transparent !important; border: none !important; box-shadow: none !important; font-weight: 600; font-size: 9.5px; color: var(--text); text-shadow: 1px 1px 2px var(--card), -1px -1px 2px var(--card), 1px -1px 2px var(--card), -1px 1px 2px var(--card); text-align: center; }
            #regions-module .hide-scroll::-webkit-scrollbar { display: none; }
            #regions-module .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            #regions-module select { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill="%2394a3b8" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'); background-repeat: no-repeat; background-position: right 4px center; }
        </style>

        <div id="regions-module" class="flex-1 flex flex-col lg:flex-row gap-3 overflow-y-auto lg:overflow-hidden h-full p-2">
            
            <!-- LEFT COLUMN: MAP & DROPDOWNS (38%) -->
            <aside class="w-full lg:w-[38%] flex flex-col gap-3 shrink-0">
                <div class="flex-1 p-1.5 rounded border flex flex-col relative overflow-hidden shadow-sm h-64 lg:h-auto min-h-[300px]" style="background: var(--card); border-color: var(--border);">
                    <div id="map-wrapper" class="rounded overflow-hidden border" style="border-color: var(--border);">
                        <div id="map"></div>
                    </div>
                </div>

                <div class="p-3 rounded border flex flex-col gap-2 shrink-0 shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="flex justify-between items-center pb-1 border-b" style="border-color: var(--border);">
                        <div class="flex items-center gap-1">
                            <button id="btnNavBack" class="map-nav-btn" title="Go Back"><i class="fas fa-chevron-left text-[10px]"></i></button>
                            <button id="btnNavForward" class="map-nav-btn" title="Go Forward"><i class="fas fa-chevron-right text-[10px]"></i></button>
                            <span id="geoHierarchyBreadcrumb" class="text-[10px] font-bold uppercase tracking-wide ml-2 truncate max-w-[200px]" style="color: var(--brand-teal-dark);">World View</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span id="tm-status-local" class="text-[9px] font-mono uppercase tracking-wider" style="color: var(--brand-orange-dark);"></span>
                            <button id="btnResetGlobe" class="text-[10px] font-bold hover:opacity-70 transition px-2" style="color: var(--muted);"><i class="fas fa-globe-americas mr-1"></i> Globe</button>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2 text-[10px] mt-1">
                        <div class="flex flex-col"><label class="font-bold uppercase mb-0.5" style="color: var(--muted);">Country</label><select id="selCountry" class="border rounded p-1 font-medium outline-none" style="background: var(--bg); color: var(--text); border-color: var(--border);"><option value="All">Loading...</option></select></div>
                        <div class="flex flex-col"><label class="font-bold uppercase mb-0.5" style="color: var(--muted);">State / Province</label><select id="selState" class="border rounded p-1 font-medium outline-none" style="background: var(--bg); color: var(--text); border-color: var(--border);" disabled><option value="All">All</option></select></div>
                        <div class="flex flex-col"><label class="font-bold uppercase mb-0.5" style="color: var(--muted);">District</label><select id="selDistrict" class="border rounded p-1 font-medium outline-none" style="background: var(--bg); color: var(--text); border-color: var(--border);" disabled><option value="All">All</option></select></div>
                        <div class="flex flex-col"><label class="font-bold uppercase mb-0.5" style="color: var(--muted);">Taluk / County</label><select id="selTaluk" class="border rounded p-1 font-medium outline-none" style="background: var(--bg); color: var(--text); border-color: var(--border);" disabled><option value="All">All</option></select></div>
                        <div class="flex flex-col col-span-2"><label class="font-bold uppercase mb-0.5" style="color: var(--muted);">Ward / Territory</label><select id="selWard" class="border rounded p-1 font-medium outline-none" style="background: var(--bg); color: var(--text); border-color: var(--border);" disabled><option value="All">All</option></select></div>
                    </div>
                </div>
            </aside>

            <!-- RIGHT COLUMN: STATS & TABLES (62%) -->
            <section class="w-full lg:w-[62%] flex flex-col gap-3 shrink-0 lg:shrink h-auto lg:h-full">
                <div class="p-2.5 rounded border flex justify-around items-center shrink-0 shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="text-center w-1/2">
                        <p class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--muted);">Active Territories</p>
                        <p class="text-2xl font-black mt-1" style="color: var(--text);" id="metricCount">0</p>
                    </div>
                    <div class="w-px h-10" style="background: var(--border);"></div>
                    <div class="text-center w-1/2">
                        <p class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--muted);">Market Capacity</p>
                        <p class="text-2xl font-black mt-1" style="color: var(--brand-orange-dark);" id="metricMPS">₹0</p>
                    </div>
                </div>
                
                <div class="flex-1 rounded border flex flex-col overflow-hidden shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="table-container flex-1 hide-scroll">
                        <table class="w-full border-collapse text-[11px]">
                            <thead>
                                <tr>
                                    <th class="p-2 uppercase tracking-wider text-left pl-4">ID</th>
                                    <th class="p-2 uppercase tracking-wider text-left">Ward Name</th>
                                    <th class="p-2 uppercase tracking-wider text-left">Biz-Class</th>
                                    <th class="p-2 uppercase tracking-wider text-left">Civic Coverage</th>
                                </tr>
                            </thead>
                            <tbody id="territoryTbody" class="cursor-pointer" style="color: var(--text);"></tbody>
                        </table>
                    </div>
                </div>
                
                <div class="h-[22vh] min-h-[160px] rounded border p-3 flex flex-col overflow-hidden shrink-0 shadow-sm" style="background: var(--card); border-color: var(--border);">
                    <div class="flex justify-between items-center border-b pb-1.5 mb-2" style="border-color: var(--border);">
                        <h3 class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--brand-teal-dark);" id="deepDiveTitle">Entity Inspector</h3>
                        <span class="text-[10px] font-mono" style="color: var(--muted);" id="deepDiveSubtitle">Select a territory</span>
                    </div>
                    <div id="deepDiveContent" class="flex-1 overflow-y-auto text-[11px] font-medium flex items-center justify-center" style="color: var(--muted);">
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

    function updateModuleStatus(text) {
        const el = document.getElementById('tm-status-local');
        if (el) el.innerHTML = text;
    }

    function getDistinctColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return `hsl(${Math.abs(hash % 360)}, 45%, 55%)`; 
    }

    // 3. SECURE LEAFLET LOADER
    if (!window.L) {
        await new Promise((resolve) => {
            const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
            const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script);
        });
    }

    // Clean up container if navigating back and forth in SPA
    const mapContainerEl = window.L.DomUtil.get('map');
    if(mapContainerEl != null){ mapContainerEl._leaflet_id = null; }

    map = window.L.map('map', { zoomControl: true, attributionControl: false, zoomSnap: 0.1, zoomDelta: 0.5 }).setView([22.5937, 78.9629], 3);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 0.5 }).addTo(map);

    window.addEventListener('resize', () => { if(map) map.invalidateSize(true); });

    // 4. CORE ENGINE FUNCTIONS (Exactly as you wrote them)
    async function loadCountryList() {
        const { data } = await window.nanbiDB.rpc('get_countries_geojson');
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
            .select('*, local_bodies ( body_name, taluks ( taluk_name, districts ( district_name, states ( state_name, countries (country_name) ) ) ) ), territory_entity_mappings ( relationship_type, civic_entities (entity_name, category_id) )');

        if (error) return;
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
            updateHistoryButtons();
        }

        if (currentGeoLayer) { map.removeLayer(currentGeoLayer); currentGeoLayer = null; }
        markers.forEach(m => map.removeLayer(m)); markers = [];

        updateModuleStatus('Loading ' + level + '...');
        document.getElementById('geoHierarchyBreadcrumb').innerText = parentName ? parentName : 'World View';

        let rpcName = ''; let rpcParams = {}; let targetDropdownId = null;

        if (level === 'world') { rpcName = 'get_countries_geojson'; targetDropdownId = 'selCountry'; }
        else if (level === 'country') { rpcName = 'get_states_for_country'; rpcParams = { p_country: parentName }; targetDropdownId = 'selState'; }
        else if (level === 'state') { rpcName = 'get_districts_for_state'; rpcParams = { p_state: parentName }; targetDropdownId = 'selDistrict'; }
        else if (level === 'district') { rpcName = 'get_taluks_for_district'; rpcParams = { p_district: parentName }; targetDropdownId = 'selTaluk'; }

        if (level === 'taluk') {
            renderWardFallbacks();
            populateWardDropdown(parentName);
            updateModuleStatus('Layer Ready');
            updateUI(level);
            return;
        }

        const { data, error } = await window.nanbiDB.rpc(rpcName, rpcParams);

        if (error || !data || data.length === 0) {
            if (level === 'country') await drawIsolatedBoundary('get_country_polygon', { p_country: parentName }, parentName);
            else if (level === 'state') await drawIsolatedBoundary('get_state_polygon', { p_state: parentName }, parentName);
            else updateModuleStatus('No Sub-divisions');
            updateUI(level);
            return;
        }

        let layerNames = [];
        let featureGroup = window.L.featureGroup();

        data.forEach(item => {
            if (!item.geojson) return;
            try {
                const parsedGeom = JSON.parse(item.geojson);
                const displayName = item.name || '';
                let displayId = (item.id || item.name).includes('-') ? (item.id || item.name).split('-').pop() : (item.id || item.name);

                layerNames.push(displayName);
                const polyColor = getDistinctColor(displayName);
                const layer = window.L.geoJSON(parsedGeom, { style: { color: '#ffffff', weight: 1, fillColor: polyColor, fillOpacity: 0.65 } });

                layer.bindTooltip(displayId, { direction: 'center', className: 'id-label', permanent: level === 'country' || level === 'state', interactive: false });

                layer.on('mouseover', function(e) {
                    e.target.bringToFront(); 
                    if (this.getTooltip()) this.getTooltip().setContent('<span style="color:var(--text); font-size:11px; font-weight:800;">' + displayName + '</span>');
                });
                layer.on('mouseout', function() { if (this.getTooltip()) this.getTooltip().setContent(displayId); });
                layer.on('click', () => { handleMapPolygonClick(level, displayName); });
                
                featureGroup.addLayer(layer);
            } catch(e) {}
        });

        currentGeoLayer = featureGroup.addTo(map);

        if (targetDropdownId && layerNames.length > 0) {
            const sel = document.getElementById(targetDropdownId);
            const currentVal = sel.value;
            sel.innerHTML = '<option value="All">All</option>';
            layerNames.sort().forEach(n => sel.innerHTML += '<option value="' + n + '">' + n + '</option>');
            sel.value = layerNames.includes(currentVal) ? currentVal : 'All';
            sel.disabled = false;
        }

        fitLayerBounds(featureGroup, level === 'world' ? 3 : 11);
        updateModuleStatus('Active');
        updateUI(level);
    }

    async function drawIsolatedBoundary(rpcName, rpcParams, entityName) {
        const { data } = await window.nanbiDB.rpc(rpcName, rpcParams);
        if (data && data.length > 0 && data[0].geojson) {
            const featureGroup = window.L.featureGroup();
            const layer = window.L.geoJSON(JSON.parse(data[0].geojson), {
                style: { color: 'var(--brand-orange-dark)', weight: 1.5, fillColor: 'var(--brand-orange-dark)', fillOpacity: 0.15 }
            });
            layer.bindTooltip(entityName + '<br><span style="font-size:9px; font-weight:normal; color:var(--brand-orange-dark)">Pipeline Territory</span>', { permanent: true, direction: 'center', className: 'id-label' });
            featureGroup.addLayer(layer);
            currentGeoLayer = featureGroup.addTo(map);
            fitLayerBounds(featureGroup, 8);
            updateModuleStatus('Isolated');
        }
    }

    function fitLayerBounds(featureGroup, maxZoomVal) {
        map.invalidateSize(true);
        setTimeout(() => { 
            map.invalidateSize(true);
            map.fitBounds(featureGroup.getBounds(), { padding: [30, 30], maxZoom: maxZoomVal, animate: false }); 
        }, 300);
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

            const circle = window.L.circleMarker([lat, lng], { radius: 6, fillColor: 'var(--brand-orange-dark)', color: 'var(--bg)', weight: 1.5, opacity: 1, fillOpacity: 0.85 }).addTo(map);
            circle.bindTooltip('W-' + item.territory_no, { permanent: true, direction: 'center', className: 'id-label' });
            circle.on('mouseover', (e) => { e.target.bringToFront(); if (circle.getTooltip()) circle.getTooltip().setContent('<span style="color:var(--text); font-size:11px; font-weight:800;">' + item.territory_name + '</span>'); });
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
            cascadeClear(['selState', 'selDistrict', 'selTaluk', 'selWard']); filterMatrix();
            if (e.target.value === 'All') renderSpatialLayer('world', ''); else renderSpatialLayer('country', e.target.value);
        });
        document.getElementById('selState').addEventListener('change', (e) => {
            cascadeClear(['selDistrict', 'selTaluk', 'selWard']); filterMatrix();
            if (e.target.value === 'All') renderSpatialLayer('country', document.getElementById('selCountry').value); else renderSpatialLayer('state', e.target.value);
        });
        document.getElementById('selDistrict').addEventListener('change', (e) => {
            cascadeClear(['selTaluk', 'selWard']); filterMatrix();
            if (e.target.value === 'All') renderSpatialLayer('state', document.getElementById('selState').value); else renderSpatialLayer('district', e.target.value);
        });
        document.getElementById('selTaluk').addEventListener('change', (e) => {
            cascadeClear(['selWard']); filterMatrix();
            if (e.target.value === 'All') renderSpatialLayer('district', document.getElementById('selDistrict').value); else renderSpatialLayer('taluk', e.target.value);
        });
        document.getElementById('selWard').addEventListener('change', (e) => {
            filterMatrix();
            if (e.target.value !== 'All' && filteredData.length === 1) isolateTerritory(filteredData[0]);
            else if (e.target.value === 'All') renderSpatialLayer('taluk', document.getElementById('selTaluk').value);
        });
        document.getElementById('btnResetGlobe').addEventListener('click', () => {
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
            tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center"><div class="text-3xl mb-3" style="color: var(--muted);"><i class="fas fa-layer-group"></i></div><div class="font-bold text-[12px] uppercase tracking-widest mb-1" style="color: var(--brand-orange-dark);">Macro Region Selected</div><div class="text-[11px] font-medium" style="color: var(--muted);">Drill down to a specific <b>Taluk</b> to view granular Ward data matrices.</div></td></tr>';
            return;
        }

        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center"><div class="text-3xl mb-3" style="color: var(--muted);">🚀</div><div class="font-bold text-[12px] uppercase tracking-widest mb-1" style="color: var(--brand-orange-dark);">Pipeline Territory</div><div class="text-[11px] font-medium" style="color: var(--muted);">Territory operations for this region are currently pre-launch.</div></td></tr>';
            return;
        }

        filteredData.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-[color:var(--hover-bg)] transition cursor-pointer";
            tr.onclick = () => { isolateTerritory(item, tr); };

            const civicCount = item.civicEntities.length;
            const civicBadge = civicCount > 0 
                ? '<span style="background: rgba(211,84,0,0.1); color: var(--brand-orange-dark); border: 1px solid var(--brand-orange-dark);" class="px-1.5 py-0.5 rounded font-bold text-[9px]">' + civicCount + ' Nodes</span>'
                : '<span style="background: var(--bg); color: var(--muted);" class="px-1.5 py-0.5 rounded text-[9px] font-semibold">0 Nodes</span>';

            tr.innerHTML = '<td class="p-2 font-mono text-xs font-bold pl-4" style="color: var(--brand-teal-dark); border-right: 1px solid var(--border);">' + item.territory_id + '</td><td class="p-2 font-bold col-left whitespace-nowrap" style="color: var(--text); border-right: 1px solid var(--border);">' + item.territory_name + '</td><td class="p-2 font-bold col-left whitespace-nowrap" style="color: var(--brand-teal-light); border-right: 1px solid var(--border);">' + item.biz_class + '</td><td class="p-2 col-left">' + civicBadge + '</td>';
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
            content.innerHTML = '<div class="italic w-full text-center text-[11px] font-medium py-4" style="color: var(--muted);">No mapped infrastructure found for this sector.</div>';
            return;
        }

        let html = '<div class="w-full flex flex-col gap-1.5">';
        item.civicEntities.forEach(ent => {
            let entName = ent.civic_entities?.entity_name || 'Unknown';
            let relType = ent.relationship_type ? ent.relationship_type.replace(/_/g, ' ') : '';
            html += '<div class="p-1.5 rounded flex justify-between items-center shadow-sm" style="background: var(--bg); border: 1px solid var(--border);"><div class="flex items-center gap-2"><span class="text-base">🏛️</span><div class="flex flex-col"><span class="font-bold text-[11px]" style="color: var(--text);">' + entName + '</span><span class="text-[9px] uppercase font-bold" style="color: var(--muted);">' + relType + '</span></div></div></div>';
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
        updateModuleStatus('CRASH: ' + err.message);
    }
}
