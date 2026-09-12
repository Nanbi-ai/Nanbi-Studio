// =======================================================================
// NANBI V5.0 - DUAL-ENGINE AGENTIC REGIONS (GPS-DRIVEN, 3D DEFAULT)
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let el = container;
    while (el && el.id !== 'nanbi-root') {
        el.style.setProperty('padding', '2px', 'important');
        el.style.setProperty('margin', '0px', 'important');
        el = el.parentElement;
    }

    // STATIC DEPENDENCY CHECK
    if (!window.L || !window.Globe || !window.turf) {
        container.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;"><b>Critical Fault:</b> Spatial libraries (Leaflet, Turf, Globe.gl) not found in index.html.</div>`;
        return;
    }

    try {
        container.innerHTML = `
            <style>
                #regions-module { width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden !important; box-sizing: border-box; font-family: var(--font-main); }
                .panel-card { background-color: var(--card); border: 1px solid var(--border); border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                
                #regions-module select { background-color: var(--bg); color: var(--text); border: 1px solid var(--border); padding: 6px; border-radius: 4px; outline: none; font-weight: 700; width: 100%; font-size: 10px; }
                #regions-module select:disabled { opacity: 0.4; cursor: not-allowed; }
                
                #regions-module th { position: sticky; top: 0; background-color: var(--bg); color: var(--muted); z-index: 10; text-align: left; border-bottom: 2px solid var(--border); font-weight: 800; font-size: 10px; padding: 10px; text-transform: uppercase; }
                #regions-module td { text-align: left; border-bottom: 1px solid var(--border); color: var(--text); font-weight: 600; font-size: 11px; padding: 10px; }
                #regions-module .row-active { background-color: var(--hover-bg) !important; border-left: 4px solid var(--brand-orange-dark) !important; } 
                
                /* DUAL ENGINE CONTAINER (3D Default) */
                #regions-module #map-wrapper { position: relative; width: 100%; height: 100%; min-height: 0; flex: 1; border-radius: 5px; background-color: #0f172a; overflow: hidden; }
                #map-2d, #map-3d { position: absolute; inset: 0; width: 100%; height: 100%; }
                #map-2d { background-color: #D4F1F9; z-index: 5; visibility: hidden; opacity: 0; } 
                #map-3d { background-color: #0f172a; z-index: 10; visibility: visible; opacity: 1; display: flex; justify-content: center; align-items: center; }
                .leaflet-container { background: transparent !important; }
                
                /* 2D/3D TOGGLE */
                .engine-toggle { position: absolute; top: 12px; right: 12px; z-index: 999; display: flex; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
                .engine-btn { padding: 6px 12px; font-size: 10px; font-weight: 800; cursor: pointer; transition: all 0.2s; border: none; outline: none; }
                .engine-btn.active { background: var(--brand-orange-dark); color: white; }
                .engine-btn.inactive { background: transparent; color: var(--muted); }
                .engine-btn.inactive:hover { background: var(--hover-bg); }
                
                /* POLYGON INTERACTION */
                #regions-module path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
                #regions-module path.leaflet-interactive:hover { stroke: #0f172a !important; stroke-width: 1.5px !important; fill-opacity: 0.9 !important; cursor: pointer; }
                
                /* HOLLOW PRESENTATION TYPOGRAPHY */
                .map-label { background: transparent !important; border: none !important; box-shadow: none !important; display: flex; justify-content: center; align-items: center; text-align: center; pointer-events: none; }
                .label-text { font-family: var(--font-main); display: inline-block; white-space: normal; word-wrap: break-word; line-height: 1.1; }
                .label-active .label-text { font-weight: 600; font-size: 11px; text-shadow: 0px 0px 3px #ffffff, 0px 0px 5px rgba(255,255,255,0.9); }
                .label-shadowed .label-text { font-weight: 600; font-size: 9.5px; opacity: 0.6; text-shadow: 0px 0px 2px rgba(255,255,255,0.6); }
                
                #regions-module ::-webkit-scrollbar { width: 6px; }
                #regions-module ::-webkit-scrollbar-thumb { background-color: var(--border); border-radius: 4px; }
            </style>

            <div id="regions-module" class="gap-1.5 p-1">
                <div class="shrink-0 flex gap-2 border-b border-[color:var(--border)] pb-1.5 px-1 z-20 relative">
                    <button id="tabMapMatrix" class="px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--brand-orange-dark)] text-white shadow-sm transition"><i class="fas fa-map-marked-alt mr-1.5"></i> Global Map & N-Layer Matrix</button>
                    <button id="tabConfigHub" class="px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--card)] text-[color:var(--muted)] border border-[color:var(--border)] hover:bg-[color:var(--hover-bg)] transition"><i class="fas fa-sitemap mr-1.5"></i> Jurisdictional Tree & Config Hub</button>
                </div>

                <div id="viewMapMatrix" class="flex flex-col lg:flex-row flex-1 min-h-0 min-w-0 gap-2">
                    <aside class="flex-1 lg:max-w-[45%] flex flex-col h-full min-h-0 min-w-0 gap-2 z-10">
                        <div class="flex-1 panel-card flex flex-col h-full w-full relative min-h-0">
                            <div id="map-wrapper" class="flex-1 min-h-0">
                                <div class="engine-toggle">
                                    <button id="btn3D" class="engine-btn active">3D GLOBE</button>
                                    <button id="btn2D" class="engine-btn inactive">2D MATRIX</button>
                                </div>
                                <div id="map-2d"></div>
                                <div id="map-3d"></div>
                            </div>
                        </div>
                        <div class="shrink-0 panel-card p-3 shadow-sm z-20">
                            <div class="flex justify-between items-center pb-1.5 border-b border-[color:var(--border)] mb-2">
                                <span id="geoHierarchyBreadcrumb" class="text-[11px] font-bold text-[color:var(--text)] uppercase tracking-wide">Acquiring GPS Signal...</span>
                                <button id="btnResetView" class="text-[10px] font-bold text-[color:var(--muted)] hover:text-[color:var(--brand-orange-dark)] transition"><i class="fas fa-undo mr-1"></i> Reset Matrix</button>
                            </div>
                            <div class="grid grid-cols-2 gap-x-3 gap-y-2">
                                <div class="flex flex-col"><label class="font-bold text-[color:var(--muted)] uppercase text-[9px] mb-0.5">Continent</label><select id="selContinent"><option value="All">All Continents</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-[color:var(--muted)] uppercase text-[9px] mb-0.5">Sub-Continent</label><select id="selSubContinent" disabled><option value="All">All Sub-Continents</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-[color:var(--muted)] uppercase text-[9px] mb-0.5">Country</label><select id="selCountry" disabled><option value="All">All Countries</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-[color:var(--muted)] uppercase text-[9px] mb-0.5">State / Province</label><select id="selState" disabled><option value="All">All States</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-[color:var(--muted)] uppercase text-[9px] mb-0.5">District</label><select id="selDistrict" disabled><option value="All">All Districts</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-[color:var(--muted)] uppercase text-[9px] mb-0.5">Taluk / Territory</label><select id="selTaluk" disabled><option value="All">All Taluks</option></select></div>
                            </div>
                        </div>
                    </aside>

                    <section class="flex-1 lg:max-w-[55%] flex flex-col h-full min-h-0 min-w-0 gap-2 relative">
                        <div class="shrink-0 panel-card flex justify-around items-center py-2">
                            <div class="text-center w-1/2"><p class="text-[9px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Filtered Nodes</p><p class="text-xl font-black text-[color:var(--text)] mt-0.5" id="metricCount">0</p></div>
                            <div class="w-px h-8 bg-[color:var(--border)]"></div>
                            <div class="text-center w-1/2"><p class="text-[9px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Global Capacity</p><p class="text-xl font-black mt-0.5 text-[color:var(--brand-orange-dark)]" id="metricMPS">₹0</p></div>
                        </div>

                        <div class="flex-1 panel-card flex flex-col overflow-hidden min-h-0">
                            <div class="flex-1 overflow-y-auto">
                                <table class="w-full border-collapse">
                                    <thead><tr><th class="pl-4">Node ID</th><th>Jurisdiction Name</th><th>Level</th><th class="text-right pr-4">Gov Code</th></tr></thead>
                                    <tbody id="territoryTbody" class="cursor-pointer"><tr><td colspan="4" class="py-16 text-center text-[color:var(--brand-orange-dark)] font-medium">Synchronizing with Edge Ledger...</td></tr></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="shrink-0 h-32 panel-card p-3 overflow-y-auto z-20">
                            <div class="flex justify-between items-center border-b border-[color:var(--border)] pb-1 mb-1.5"><h3 class="text-[11px] font-bold uppercase tracking-widest text-[color:var(--text)]" id="deepDiveTitle">Entity Inspector</h3><span class="text-[9px] text-[color:var(--muted)] font-mono font-bold uppercase" id="deepDiveSubtitle">Select a node</span></div>
                            <div id="deepDiveContent" class="flex flex-col gap-1.5 text-xs text-[color:var(--muted)] font-medium"><div class="text-center mt-4">Awaiting 3-way synchronization...</div></div>
                        </div>
                    </section>
                </div>

                <div id="viewConfigHub" class="hidden flex-col lg:flex-row flex-1 min-h-0 min-w-0 gap-2 p-1">
                    <aside class="flex-1 lg:max-w-[40%] panel-card p-3 flex flex-col min-h-0">
                        <div class="flex justify-between items-center pb-2 border-b border-[color:var(--border)] mb-2 shrink-0"><h3 class="text-xs font-bold uppercase tracking-widest text-[color:var(--text)]">Universal Jurisdictional Tree</h3><span id="treeNodeCountBadge" class="text-[10px] font-mono px-2 py-0.5 rounded border border-[color:var(--brand-orange-dark)] text-[color:var(--brand-orange-dark)] font-bold">0 Nodes</span></div>
                        <div id="treeListContainer" class="flex-1 overflow-y-auto space-y-1 font-sans pr-1"></div>
                    </aside>
                    <section class="flex-1 lg:max-w-[60%] panel-card p-4 flex flex-col min-h-0">
                        <div class="flex justify-between items-center pb-2 border-b border-[color:var(--border)] mb-3 shrink-0">
                            <div><h3 class="text-sm font-bold text-[color:var(--text)]" id="configNodeTitle">Select a Regional Node</h3><p class="text-[11px] text-[color:var(--muted)] font-mono font-bold uppercase" id="configNodeMeta">Level: N/A | ID: --</p></div>
                            <button id="btnSaveConfigPayload" class="px-4 py-1.5 rounded text-xs font-bold bg-[color:var(--brand-orange-dark)] text-white shadow transition flex items-center gap-1.5" style="display:none;"><i class="fas fa-lock"></i> Save Payload</button>
                        </div>
                        <div class="flex-1 flex flex-col gap-1 mb-3 min-h-0"><label class="text-[10px] font-bold text-[color:var(--muted)] uppercase tracking-widest">JSONB Config Ledger</label><textarea id="jsonConfigTextarea" class="w-full flex-1 p-3 font-mono text-xs rounded border border-[color:var(--border)] bg-transparent text-[color:var(--text)] outline-none resize-none shadow-inner" disabled></textarea></div>
                    </section>
                </div>
            </div>
        `;

        // UI NAVIGATION
        const tabMapMatrix = container.querySelector('#tabMapMatrix');
        const tabConfigHub = container.querySelector('#tabConfigHub');
        const viewMapMatrix = container.querySelector('#viewMapMatrix');
        const viewConfigHub = container.querySelector('#viewConfigHub');

        tabMapMatrix.onclick = () => {
            tabMapMatrix.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--brand-orange-dark)] text-white shadow-sm transition";
            tabConfigHub.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--card)] text-[color:var(--muted)] border border-[color:var(--border)] hover:bg-[color:var(--hover-bg)] transition";
            viewMapMatrix.style.display = "flex"; viewConfigHub.style.display = "none";
            if (map2D) setTimeout(() => map2D.invalidateSize(true), 50);
        };

        tabConfigHub.onclick = () => {
            tabConfigHub.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--brand-orange-dark)] text-white shadow-sm transition";
            tabMapMatrix.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--card)] text-[color:var(--muted)] border border-[color:var(--border)] hover:bg-[color:var(--hover-bg)] transition";
            viewConfigHub.style.display = "flex"; viewMapMatrix.style.display = "none";
            loadJurisdictionalTree();
        };

        // ENGINE TOGGLE LOGIC
        let activeEngine = '3D';
        const btn2D = container.querySelector('#btn2D');
        const btn3D = container.querySelector('#btn3D');
        const map2DContainer = container.querySelector('#map-2d');
        const map3DContainer = container.querySelector('#map-3d');

        btn2D.onclick = () => {
            activeEngine = '2D';
            btn2D.className = "engine-btn active"; btn3D.className = "engine-btn inactive";
            map2DContainer.style.visibility = 'visible'; map2DContainer.style.opacity = '1'; map2DContainer.style.zIndex = '10';
            map3DContainer.style.visibility = 'hidden'; map3DContainer.style.opacity = '0'; map3DContainer.style.zIndex = '5';
            if (map2D) setTimeout(() => map2D.invalidateSize(true), 50);
        };

        btn3D.onclick = () => {
            activeEngine = '3D';
            btn3D.className = "engine-btn active"; btn2D.className = "engine-btn inactive";
            map3DContainer.style.visibility = 'visible'; map3DContainer.style.opacity = '1'; map3DContainer.style.zIndex = '10';
            map2DContainer.style.visibility = 'hidden'; map2DContainer.style.opacity = '0'; map2DContainer.style.zIndex = '5';
            if (map3D) {
                const w = map3DContainer.clientWidth;
                const h = map3DContainer.clientHeight;
                if (w > 0 && h > 0) map3D.width(w).height(h);
            }
        };

        // Ensure structural paint for engine dimensions
        await new Promise(r => requestAnimationFrame(r));

        // INITIALIZE 2D LEAFLET
        if (window.nanbiMapInstance) window.nanbiMapInstance.remove();
        let map2D = window.L.map('map-2d', { 
            preferCanvas: true, zoomControl: true, attributionControl: false, zoomSnap: 0, zoomDelta: 0.5, worldCopyJump: true, minZoom: 1.0 
        }).setView([20.0, 0.0], 1.5);
        window.nanbiMapInstance = map2D;

        // INITIALIZE 3D GLOBE
        const initW = map3DContainer.clientWidth || 800;
        const initH = map3DContainer.clientHeight || 500;
        
        let map3D = window.Globe()(map3DContainer)
            .width(initW)
            .height(initH)
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .showAtmosphere(true)
            .atmosphereColor('#3a228a')
            .atmosphereAltitude(0.15)
            .polygonCapColor(() => 'rgba(200, 0, 0, 0.6)')
            .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
            .polygonStrokeColor(() => '#111')
            .polygonAltitude(0.01);

        window.addEventListener('resize', () => {
            if(map2D) map2D.invalidateSize();
            if(map3D) {
                const w = map3DContainer.clientWidth;
                const h = map3DContainer.clientHeight;
                if (w > 0 && h > 0) map3D.width(w).height(h);
            }
        });

        let treeNodes = [];
        let polygonLayerGroup = null;

        function toTitleCase(str) { return (!str) ? '' : str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); }

        // ==========================================
        // AGENTIC HIERARCHY SAFEGUARDS (Depth-limited to block infinite loops)
        // ==========================================
        function getAncestorAtLevel(nodeId, level) {
            let curr = treeNodes.find(n => n.node_id === nodeId);
            let depth = 0;
            while (curr && curr.node_id !== 'GLOBAL' && depth < 50) {
                if (curr.node_level === level) return curr;
                curr = treeNodes.find(n => n.node_id === curr.parent_id);
                depth++;
            }
            return null;
        }

        function getLineage(nodeId) {
            let lineage = {}; let curr = treeNodes.find(n => n.node_id === nodeId);
            let depth = 0;
            while (curr && curr.node_id !== 'GLOBAL' && depth < 50) { 
                lineage[curr.node_level] = curr.node_id; 
                curr = treeNodes.find(n => n.node_id === curr.parent_id); 
                depth++;
            }
            return lineage;
        }

        function isDescendant(node, parentId) {
            let curr = treeNodes.find(n => n.node_id === node.parent_id); 
            let depth = 0;
            while (curr && depth < 50) { 
                if (curr.node_id === parentId) return true; 
                curr = treeNodes.find(n => n.node_id === curr.parent_id); 
                depth++; 
            }
            return false;
        }

        // ==========================================
        // AUTONOMOUS GPS & PROFILE ROUTING
        // ==========================================
        function locateNodeByGPS(lng, lat) {
            const pt = window.turf.point([lng, lat]);
            let foundCountry = null;
            
            for (let n of treeNodes.filter(x => x.node_level === 'country' && x.dynamic_config_payload?.geojson)) {
                try {
                    let geom = n.dynamic_config_payload.geojson;
                    if (geom.type === 'FeatureCollection') geom = geom.features[0].geometry;
                    else if (geom.type === 'Feature') geom = geom.geometry;
                    if (window.turf.booleanPointInPolygon(pt, geom)) { foundCountry = n; break; }
                } catch(e) {}
            }
            if (!foundCountry) return null;

            let foundState = null;
            for (let n of treeNodes.filter(x => x.node_level === 'state' && x.parent_id === foundCountry.node_id && x.dynamic_config_payload?.geojson)) {
                try {
                    let geom = n.dynamic_config_payload.geojson;
                    if (geom.type === 'FeatureCollection') geom = geom.features[0].geometry;
                    else if (geom.type === 'Feature') geom = geom.geometry;
                    if (window.turf.booleanPointInPolygon(pt, geom)) { foundState = n; break; }
                } catch(e) {}
            }
            return foundState ? foundState.node_id : foundCountry.node_id;
        }

        function determineUserRegionViaGPS() {
            return new Promise((resolve) => {
                const profileFallback = 'IN-KA'; 
                
                if (!navigator.geolocation) {
                    console.warn("Geolocation missing. Defaulting to profile context.");
                    return resolve(profileFallback);
                }

                const bc = container.querySelector('#geoHierarchyBreadcrumb');
                if(bc) bc.innerText = "Acquiring GPS Signal...";

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // setTimeout detaches heavy calculation from UI thread to prevent freezing
                        setTimeout(() => {
                            const nodeId = locateNodeByGPS(position.coords.longitude, position.coords.latitude) || profileFallback;
                            resolve(nodeId);
                        }, 50); 
                    },
                    (error) => {
                        console.warn("GPS Request Denied/Failed. Falling back to Profile Context.");
                        resolve(profileFallback);
                    },
                    { timeout: 6000, maximumAge: 60000, enableHighAccuracy: false }
                );
            });
        }

        async function fetchTreeData() {
            try {
                const { data, error } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (error) throw error;
                if (data) {
                    treeNodes = data.filter(n => n.node_id !== 'ATA' && n.node_id !== 'AN'); 
                    populateDropdown('selContinent', 'continent', 'GLOBAL');
                    
                    const activeAnchor = await determineUserRegionViaGPS();
                    
                    applyGlobalSelection(activeAnchor);
                    setupDropdownListeners();
                }
            } catch (err) { 
                const tbody = container.querySelector('#territoryTbody');
                if(tbody) tbody.innerHTML = `<tr><td colspan="4" class="py-16 text-center text-red-500 font-bold">Ledger sync failed. Check console.</td></tr>`;
                console.error("Fetch Tree Data Error:", err); 
            }
        }

        function populateDropdown(targetId, level, parentId) {
            const sel = container.querySelector(`#${targetId}`); sel.innerHTML = '<option value="All">All</option>';
            const list = treeNodes.filter(n => n.node_level === level && n.parent_id === parentId);
            list.forEach(item => { sel.innerHTML += `<option value="${item.node_id}">${item.node_name}</option>`; });
            sel.disabled = list.length === 0; return list.length > 0;
        }

        function cascadeClear(ids) { ids.forEach(id => { const el = container.querySelector(`#${id}`); if (el) { el.innerHTML = '<option value="All">All</option>'; el.disabled = true; } }); }

        function applyGlobalSelection(nodeId) {
            const fallbackGlobalNode = { node_id: 'GLOBAL', node_name: 'World', node_level: 'root', dynamic_config_payload: {} };
            const activeNode = treeNodes.find(n => n.node_id === nodeId) || fallbackGlobalNode;

            const lineage = getLineage(nodeId);
            if (nodeId === 'GLOBAL') {
                container.querySelector('#selContinent').value = 'All'; cascadeClear(['selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk']);
            } else {
                if (lineage.continent) { container.querySelector('#selContinent').value = lineage.continent; populateDropdown('selSubContinent', 'sub_continent', lineage.continent); }
                if (lineage.sub_continent) { container.querySelector('#selSubContinent').value = lineage.sub_continent; populateDropdown('selCountry', 'country', lineage.sub_continent); } else cascadeClear(['selCountry', 'selState', 'selDistrict', 'selTaluk']);
                if (lineage.country) { container.querySelector('#selCountry').value = lineage.country; populateDropdown('selState', 'state', lineage.country); } else cascadeClear(['selState', 'selDistrict', 'selTaluk']);
                if (lineage.state) { container.querySelector('#selState').value = lineage.state; populateDropdown('selDistrict', 'district', lineage.state); } else cascadeClear(['selDistrict', 'selTaluk']);
                if (lineage.district) { container.querySelector('#selDistrict').value = lineage.district; populateDropdown('selTaluk', 'taluk', lineage.district); } else cascadeClear(['selTaluk']);
                if (lineage.taluk) { container.querySelector('#selTaluk').value = lineage.taluk; }
            }

            let tableNodes = [];
            if (nodeId === 'GLOBAL') tableNodes = treeNodes.filter(n => n.node_level === 'continent');
            else { tableNodes = treeNodes.filter(n => n.node_id === nodeId || n.parent_id === nodeId); tableNodes.sort((a, b) => (a.node_id === nodeId ? -1 : (b.node_id === nodeId ? 1 : 0))); }

            container.querySelector('#metricCount').innerText = tableNodes.length;
            container.querySelector('#metricMPS').innerText = "₹" + (tableNodes.length * 35000).toLocaleString('en-IN');
            
            const tbody = container.querySelector('#territoryTbody'); tbody.innerHTML = '';
            tableNodes.forEach(node => {
                const tr = document.createElement('tr'); tr.className = "hover:bg-[color:var(--hover-bg)] transition cursor-pointer text-[color:var(--text)]";
                if (node.node_id === nodeId && nodeId !== 'GLOBAL') tr.classList.add('row-active');
                tr.onclick = () => applyGlobalSelection(node.node_id);
                tr.innerHTML = `
                    <td class="col-left border-r pl-4"><span class="bg-transparent border border-[color:var(--brand-orange-dark)] px-1.5 py-0.5 rounded font-mono text-[color:var(--brand-orange-dark)] font-bold">${node.node_id}</span></td>
                    <td class="font-bold col-left border-r">${node.node_name}</td>
                    <td class="font-bold col-left border-r text-[color:var(--muted)] uppercase text-[9px] tracking-wider">${node.node_level.replace('_', ' ')}</td>
                    <td class="text-right pr-4 font-mono font-bold">${node.official_gov_code || '--'}</td>
                `;
                tbody.appendChild(tr);
            });

            container.querySelector('#geoHierarchyBreadcrumb').innerText = activeNode.node_name;
            container.querySelector('#deepDiveTitle').innerText = `${activeNode.node_id} — ${activeNode.node_name}`;
            container.querySelector('#deepDiveSubtitle').innerText = `Level: ${activeNode.node_level.replace('_', ' ')}`;

            if (polygonLayerGroup) map2D.removeLayer(polygonLayerGroup);
            polygonLayerGroup = window.L.featureGroup();
            
            let globePolygons = [];
            let globeLabels = [];
            let activeGeoJSONFeatures = [];

            let countryNodes = treeNodes.filter(n => n.node_level === 'country' && n.dynamic_config_payload && n.dynamic_config_payload.geojson);

            countryNodes.forEach(n => {
                try {
                    let isActiveRegion = (nodeId === 'GLOBAL') || (n.node_id === nodeId || isDescendant(n, nodeId));
                    let rawGeom = n.dynamic_config_payload.geojson;
                    
                    // AUTONOMOUS GEOJSON NORMALIZER
                    let cleanGeom = rawGeom;
                    if (rawGeom && rawGeom.type === 'FeatureCollection' && rawGeom.features && rawGeom.features.length > 0) {
                        cleanGeom = rawGeom.features[0].geometry;
                    } else if (rawGeom && rawGeom.type === 'Feature') {
                        cleanGeom = rawGeom.geometry;
                    }
                    if (!cleanGeom || (cleanGeom.type !== 'Polygon' && cleanGeom.type !== 'MultiPolygon')) return;
                    
                    let effectiveColor = '#e2e8f0'; 
                    if (n.dynamic_config_payload && n.dynamic_config_payload.fill_color) effectiveColor = n.dynamic_config_payload.fill_color;
                    
                    if (activeNode.node_level === 'root') {
                        let cont = getAncestorAtLevel(n.node_id, 'continent');
                        if (cont && cont.dynamic_config_payload && cont.dynamic_config_payload.fill_color) effectiveColor = cont.dynamic_config_payload.fill_color;
                    } else if (activeNode.node_level === 'continent') {
                        let sub = getAncestorAtLevel(n.node_id, 'sub_continent');
                        if (sub && sub.dynamic_config_payload && sub.dynamic_config_payload.fill_color) effectiveColor = sub.dynamic_config_payload.fill_color;
                    }

                    // 3D Globe Properties
                    let feature = {
                        type: "Feature",
                        geometry: cleanGeom,
                        properties: { 
                            name: n.node_name, 
                            node_id: n.node_id,
                            color: isActiveRegion ? effectiveColor : '#1e293b',
                            altitude: isActiveRegion ? 0.015 : 0.005,
                            isActive: isActiveRegion
                        }
                    };
                    globePolygons.push(feature);
                    if (isActiveRegion) activeGeoJSONFeatures.push(feature);

                    // 2D Matrix Rendering
                    let styleOptions = isActiveRegion ? { color: '#0f172a', weight: 0.6, fillColor: effectiveColor, fillOpacity: 0.95 } : { color: '#64748b', weight: 0.3, fillColor: effectiveColor, fillOpacity: 0.15 }; 
                    let lPrimary = window.L.geoJSON(cleanGeom, { style: styleOptions });
                    polygonLayerGroup.addLayer(lPrimary);
                    
                    const clickHandler = () => {
                        if (activeNode.node_level === 'root') { let cont = getAncestorAtLevel(n.node_id, 'continent'); if (cont) applyGlobalSelection(cont.node_id); }
                        else if (activeNode.node_level === 'continent') { let sub = getAncestorAtLevel(n.node_id, 'sub_continent'); if (sub) applyGlobalSelection(sub.node_id); }
                        else applyGlobalSelection(n.node_id);
                    };
                    lPrimary.on('click', clickHandler);

                } catch(e) {}
            });

            let labelData = new Map();
            countryNodes.forEach(n => {
                let isActiveRegion = (nodeId === 'GLOBAL') || (n.node_id === nodeId || isDescendant(n, nodeId));
                let targetLabelNode = null;
                
                if (nodeId === 'GLOBAL') targetLabelNode = getAncestorAtLevel(n.node_id, 'continent');
                else if (activeNode.node_level === 'continent') targetLabelNode = isActiveRegion ? getAncestorAtLevel(n.node_id, 'sub_continent') : getAncestorAtLevel(n.node_id, 'continent');
                else if (activeNode.node_level === 'sub_continent') {
                    if (isActiveRegion) targetLabelNode = n; 
                    else { let sameCont = getAncestorAtLevel(n.node_id, 'continent')?.node_id === getAncestorAtLevel(activeNode.node_id, 'continent')?.node_id; targetLabelNode = sameCont ? getAncestorAtLevel(n.node_id, 'sub_continent') : getAncestorAtLevel(n.node_id, 'continent'); }
                } else {
                    if (isActiveRegion) targetLabelNode = n;
                    else { let sameSub = getAncestorAtLevel(n.node_id, 'sub_continent')?.node_id === getAncestorAtLevel(activeNode.node_id, 'sub_continent')?.node_id; targetLabelNode = sameSub ? n : getAncestorAtLevel(n.node_id, 'sub_continent') || getAncestorAtLevel(n.node_id, 'continent'); }
                }

                if (targetLabelNode && !labelData.has(targetLabelNode.node_id)) {
                    labelData.set(targetLabelNode.node_id, { name: targetLabelNode.node_name, isActive: isActiveRegion, payload: targetLabelNode.dynamic_config_payload });
                }
            });

            labelData.forEach((data, id) => {
                if (!data.payload || !data.payload.label_anchor) return;
                
                let anchor = data.payload.label_anchor;
                let textColor = (data.payload && data.payload.label_color) ? data.payload.label_color : '';
                let rotation = (data.payload && data.payload.label_rotation) ? data.payload.label_rotation : '0deg';
                let maxWidth = (data.payload && data.payload.label_max_width) ? data.payload.label_max_width : '65px';
                let cssClass = data.isActive ? 'label-active' : 'label-shadowed';
                let formattedName = toTitleCase(data.name || '');
                let inlineStyle = `transform: rotate(${rotation}); max-width: ${maxWidth};`;
                if (textColor) inlineStyle += ` color: ${textColor}; text-shadow: none;`;

                // 2D Label
                let marker = window.L.marker(anchor, {
                    icon: window.L.divIcon({ className: `map-label ${cssClass}`, html: `<div class="label-text" style="${inlineStyle}">${formattedName}</div>`, iconSize: [120, 40], iconAnchor: [60, 20] }),
                    interactive: false
                });
                polygonLayerGroup.addLayer(marker);
                
                // 3D DOM Labels
                if (data.isActive || nodeId === 'GLOBAL') {
                    globeLabels.push({
                        lat: anchor[0],
                        lng: anchor[1],
                        name: formattedName,
                        style: inlineStyle,
                        cssClass: cssClass
                    });
                }
            });

            // Execute 3D Globe Injection
            if (map3D) {
                map3D.polygonsData(globePolygons)
                    .polygonCapColor(d => d.properties.color)
                    .polygonSideColor(d => d.properties.isActive ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)')
                    .polygonStrokeColor(() => '#111')
                    .polygonAltitude(d => d.properties.altitude)
                    .onPolygonClick(d => applyGlobalSelection(d.properties.node_id));
                    
                map3D.htmlElementsData(globeLabels)
                    .htmlLat(d => d.lat)
                    .htmlLng(d => d.lng)
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.style.pointerEvents = 'none';
                        el.innerHTML = `<div class="map-label ${d.cssClass}"><div class="label-text" style="${d.style}">${d.name}</div></div>`;
                        return el;
                    });
            }

            // AUTONOMOUS SPATIAL MATH (TURF.JS)
            if (activeGeoJSONFeatures.length > 0 && window.turf) {
                setTimeout(() => {
                    try {
                        const collection = window.turf.featureCollection(activeGeoJSONFeatures);
                        const bbox = window.turf.bbox(collection);
                        const center = window.turf.center(collection);
                        const [lng, lat] = center.geometry.coordinates;

                        // 2D MAP MATH
                        if (polygonLayerGroup.getLayers().length > 0) {
                            polygonLayerGroup.addTo(map2D);
                            const targetBounds = window.L.latLngBounds([bbox[1], bbox[0]], [bbox[3], bbox[2]]);
                            const currentSize = map2D.getSize(); 
                            const padX = Math.max(10, Math.floor(currentSize.x * 0.05)); 
                            const padY = Math.max(10, Math.floor(currentSize.y * 0.05)); 
                            map2D.fitBounds(targetBounds, { padding: [padX, padY], animate: true, duration: 1.0 });
                        }

                        // 3D GLOBE MATH
                        if (map3D && nodeId !== 'GLOBAL') {
                            const maxDiff = Math.max(Math.abs(bbox[2] - bbox[0]), Math.abs(bbox[3] - bbox[1]));
                            let altitude = maxDiff / 50; 
                            if (altitude < 0.3) altitude = 0.3;
                            map3D.pointOfView({ lat: lat, lng: lng, altitude: altitude }, 1500);
                        }
                    } catch(err) {
                        console.error("Spatial Calculation Error:", err);
                    }
                }, 50);
            }
        }

        function setupDropdownListeners() {
            ['selContinent', 'selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk'].forEach(id => {
                container.querySelector(`#${id}`).addEventListener('change', (e) => {
                    if (e.target.value !== 'All') applyGlobalSelection(e.target.value);
                    else {
                        const cs = e.target.id;
                        if (cs === 'selTaluk') applyGlobalSelection(container.querySelector('#selDistrict').value);
                        else if (cs === 'selDistrict') applyGlobalSelection(container.querySelector('#selState').value);
                        else if (cs === 'selState') applyGlobalSelection(container.querySelector('#selCountry').value);
                        else if (cs === 'selCountry') applyGlobalSelection(container.querySelector('#selSubContinent').value);
                        else if (cs === 'selSubContinent') applyGlobalSelection(container.querySelector('#selContinent').value);
                        else applyGlobalSelection('GLOBAL');
                    }
                });
            });
            container.querySelector('#btnResetView').addEventListener('click', () => applyGlobalSelection('GLOBAL'));
        }

        async function loadJurisdictionalTree() {
            try {
                const treeContainer = container.querySelector('#treeListContainer');
                treeContainer.innerHTML = `<p class="text-[color:var(--muted)] italic text-center py-10">Synchronizing with Edge Ledger...</p>`;
                
                const { data } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (data) {
                    treeNodes = data.filter(n => n.node_id !== 'ATA' && n.node_id !== 'AN'); 
                    container.querySelector('#treeNodeCountBadge').innerText = treeNodes.length + " Nodes";
                    treeContainer.innerHTML = '';
                    
                    treeNodes.forEach(node => {
                        const div = document.createElement('div');
                        div.className = "p-2.5 rounded border border-[color:var(--border)] hover:bg-[color:var(--hover-bg)] cursor-pointer transition flex justify-between items-center";
                        div.innerHTML = `<div><div class="font-bold text-[color:var(--text)] text-xs">${node.node_name}</div><div class="text-[9px] text-[color:var(--muted)] uppercase font-mono font-bold">${node.node_level.replace('_', ' ')} | ID: ${node.node_id}</div></div><i class="fas fa-edit text-xs text-[color:var(--muted)]"></i>`;
                        div.onclick = () => {
                            container.querySelector('#configNodeTitle').innerText = node.node_name;
                            container.querySelector('#configNodeMeta').innerText = `Level: ${node.node_level.toUpperCase()} | ID: ${node.node_id}`;
                            const ta = container.querySelector('#jsonConfigTextarea');
                            ta.value = JSON.stringify(node.dynamic_config_payload, null, 4); ta.disabled = false;
                            
                            const btn = container.querySelector('#btnSaveConfigPayload');
                            btn.style.display = 'flex';
                            btn.onclick = async () => {
                                let parsed;
                                try { parsed = JSON.parse(ta.value); } catch(e) { alert("Invalid JSON Syntax."); return; }
                                let reason = prompt("Enter Architectural Reasoning (DEC-12):", "Configured via Config Hub");
                                if (!reason) return;
                                
                                await window.nanbiDB.from('regional_hierarchy_nodes').update({ dynamic_config_payload: parsed, architectural_reasoning: reason, updated_at: new Date().toISOString() }).eq('node_id', node.node_id);
                                alert("Payload successfully locked and encrypted.");
                                loadJurisdictionalTree();
                            };
                        };
                        treeContainer.appendChild(div);
                    });
                }
            } catch (err) {}
        }

        await fetchTreeData();

    } catch (err) {
        container.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;"><b>Critical Engine Fault:</b> ${err.message}</div>`;
    }
}
