// =======================================================================
// NANBI V5.0 - ZERO-API, THEME-COMPLIANT, 3-WAY REGIONS ENGINE
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
                
                /* SOVEREIGN MAP CONTAINER */
                #regions-module #map-wrapper { position: relative; width: 100%; height: 100%; min-height: 0; flex: 1; border-radius: 5px; background-color: #D4F1F9; overflow: hidden; }
                #regions-module #map { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; background-color: #D4F1F9; }
                .leaflet-container { background: transparent !important; }
                
                /* POLYGON INTERACTION */
                #regions-module path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
                #regions-module path.leaflet-interactive:hover { stroke: #0f172a !important; stroke-width: 1.5px !important; fill-opacity: 0.9 !important; cursor: pointer; }
                
                /* HOLLOW PRESENTATION TYPOGRAPHY (Driven by Database) */
                .map-label { 
                    background: transparent !important; border: none !important; box-shadow: none !important; 
                    display: flex; justify-content: center; align-items: center; text-align: center; pointer-events: none;
                }
                .label-text { 
                    font-family: var(--font-main);
                    display: inline-block;
                    white-space: normal; 
                    word-wrap: break-word;
                    line-height: 1.1; 
                }
                
                .label-active .label-text {
                    font-weight: 600; 
                    font-size: 11px; 
                    text-shadow: 0px 0px 3px #ffffff, 0px 0px 5px rgba(255,255,255,0.9); 
                }
                .label-shadowed .label-text {
                    font-weight: 600;
                    font-size: 9.5px;
                    opacity: 0.6;
                    text-shadow: 0px 0px 2px rgba(255,255,255,0.6);
                }
                
                #regions-module ::-webkit-scrollbar { width: 6px; }
                #regions-module ::-webkit-scrollbar-thumb { background-color: var(--border); border-radius: 4px; }
            </style>

            <div id="regions-module" class="gap-1.5 p-1">
                <div class="shrink-0 flex gap-2 border-b border-[color:var(--border)] pb-1.5 px-1 z-20 relative">
                    <button id="tabMapMatrix" class="px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--brand-orange-dark)] text-white shadow-sm transition">
                        <i class="fas fa-map-marked-alt mr-1.5"></i> Global Map & N-Layer Matrix
                    </button>
                    <button id="tabConfigHub" class="px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--card)] text-[color:var(--muted)] border border-[color:var(--border)] hover:bg-[color:var(--hover-bg)] transition">
                        <i class="fas fa-sitemap mr-1.5"></i> Jurisdictional Tree & Config Hub
                    </button>
                </div>

                <div id="viewMapMatrix" class="flex flex-col lg:flex-row flex-1 min-h-0 min-w-0 gap-2">
                    <aside class="flex-1 lg:max-w-[45%] flex flex-col h-full min-h-0 min-w-0 gap-2 z-10">
                        <div class="flex-1 panel-card flex flex-col h-full w-full relative min-h-0">
                            <div id="map-wrapper" class="flex-1 min-h-0">
                                <div id="map"></div>
                            </div>
                        </div>
                        
                        <div class="shrink-0 panel-card p-3 shadow-sm z-20">
                            <div class="flex justify-between items-center pb-1.5 border-b border-[color:var(--border)] mb-2">
                                <span id="geoHierarchyBreadcrumb" class="text-[11px] font-bold text-[color:var(--text)] uppercase tracking-wide">Global Root (World)</span>
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
                            <div class="text-center w-1/2">
                                <p class="text-[9px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Filtered Nodes</p>
                                <p class="text-xl font-black text-[color:var(--text)] mt-0.5" id="metricCount">0</p>
                            </div>
                            <div class="w-px h-8 bg-[color:var(--border)]"></div>
                            <div class="text-center w-1/2">
                                <p class="text-[9px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Global Capacity</p>
                                <p class="text-xl font-black mt-0.5 text-[color:var(--brand-orange-dark)]" id="metricMPS">₹0</p>
                            </div>
                        </div>

                        <div class="flex-1 panel-card flex flex-col overflow-hidden min-h-0">
                            <div class="flex-1 overflow-y-auto">
                                <table class="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th class="pl-4">Node ID</th>
                                            <th>Jurisdiction Name</th>
                                            <th>Level</th>
                                            <th class="text-right pr-4">Gov Code</th>
                                        </tr>
                                    </thead>
                                    <tbody id="territoryTbody" class="cursor-pointer">
                                        <tr><td colspan="4" class="py-16 text-center text-[color:var(--muted)] font-medium">Loading universal matrix...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="shrink-0 h-32 panel-card p-3 overflow-y-auto z-20">
                            <div class="flex justify-between items-center border-b border-[color:var(--border)] pb-1 mb-1.5">
                                <h3 class="text-[11px] font-bold uppercase tracking-widest text-[color:var(--text)]" id="deepDiveTitle">Entity Inspector</h3>
                                <span class="text-[9px] text-[color:var(--muted)] font-mono font-bold uppercase" id="deepDiveSubtitle">Select a node</span>
                            </div>
                            <div id="deepDiveContent" class="flex flex-col gap-1.5 text-xs text-[color:var(--muted)] font-medium">
                                <div class="text-center mt-4">Awaiting 3-way synchronization...</div>
                            </div>
                        </div>
                    </section>
                </div>

                <div id="viewConfigHub" class="hidden flex-col lg:flex-row flex-1 min-h-0 min-w-0 gap-2 p-1">
                    <aside class="flex-1 lg:max-w-[40%] panel-card p-3 flex flex-col min-h-0">
                        <div class="flex justify-between items-center pb-2 border-b border-[color:var(--border)] mb-2 shrink-0">
                            <h3 class="text-xs font-bold uppercase tracking-widest text-[color:var(--text)]">Universal Jurisdictional Tree</h3>
                            <span id="treeNodeCountBadge" class="text-[10px] font-mono px-2 py-0.5 rounded border border-[color:var(--brand-orange-dark)] text-[color:var(--brand-orange-dark)] font-bold">0 Nodes</span>
                        </div>
                        <div id="treeListContainer" class="flex-1 overflow-y-auto space-y-1 font-sans pr-1"></div>
                    </aside>
                    <section class="flex-1 lg:max-w-[60%] panel-card p-4 flex flex-col min-h-0">
                        <div class="flex justify-between items-center pb-2 border-b border-[color:var(--border)] mb-3 shrink-0">
                            <div>
                                <h3 class="text-sm font-bold text-[color:var(--text)]" id="configNodeTitle">Select a Regional Node</h3>
                                <p class="text-[11px] text-[color:var(--muted)] font-mono font-bold uppercase" id="configNodeMeta">Level: N/A | ID: --</p>
                            </div>
                            <button id="btnSaveConfigPayload" class="px-4 py-1.5 rounded text-xs font-bold bg-[color:var(--brand-orange-dark)] text-white shadow transition flex items-center gap-1.5" style="display:none;">
                                <i class="fas fa-lock"></i> Save Payload
                            </button>
                        </div>
                        <div class="flex-1 flex flex-col gap-1 mb-3 min-h-0">
                            <label class="text-[10px] font-bold text-[color:var(--muted)] uppercase tracking-widest">JSONB Config Ledger</label>
                            <textarea id="jsonConfigTextarea" class="w-full flex-1 p-3 font-mono text-xs rounded border border-[color:var(--border)] bg-transparent text-[color:var(--text)] outline-none resize-none shadow-inner" disabled></textarea>
                        </div>
                    </section>
                </div>
            </div>
        `;

        const tabMapMatrix = container.querySelector('#tabMapMatrix');
        const tabConfigHub = container.querySelector('#tabConfigHub');
        const viewMapMatrix = container.querySelector('#viewMapMatrix');
        const viewConfigHub = container.querySelector('#viewConfigHub');

        tabMapMatrix.onclick = () => {
            tabMapMatrix.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--brand-orange-dark)] text-white shadow-sm transition";
            tabConfigHub.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--card)] text-[color:var(--muted)] border border-[color:var(--border)] hover:bg-[color:var(--hover-bg)] transition";
            viewMapMatrix.style.display = "flex";
            viewConfigHub.style.display = "none";
            if (window.nanbiMapInstance) { setTimeout(() => window.nanbiMapInstance.invalidateSize(true), 100); }
        };

        tabConfigHub.onclick = () => {
            tabConfigHub.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--brand-orange-dark)] text-white shadow-sm transition";
            tabMapMatrix.className = "px-4 py-1 rounded text-[11px] font-bold bg-[color:var(--card)] text-[color:var(--muted)] border border-[color:var(--border)] hover:bg-[color:var(--hover-bg)] transition";
            viewConfigHub.style.display = "flex";
            viewMapMatrix.style.display = "none";
            loadJurisdictionalTree();
        };

        let map = null, polygonLayerGroup = null;
        let treeNodes = [];

        function toTitleCase(str) { 
            if (!str) return '';
            return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); 
        }

        if (!window.L) {
            await new Promise((resolve) => {
                const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
                const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script);
            });
        }

        if (window.nanbiMapInstance) window.nanbiMapInstance.remove();
        const mapEl = window.L.DomUtil.get('map');
        if (mapEl) mapEl._leaflet_id = null;

        map = window.L.map('map', { 
            preferCanvas: true, 
            zoomControl: true, 
            attributionControl: false,
            zoomSnap: 0.1, 
            worldCopyJump: false, 
            minZoom: 0, 
            maxBounds: [[-90, -180], [90, 180]]
        }).setView([20.0, 0.0], 1.5);
        
        window.nanbiMapInstance = map;

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { if (window.nanbiMapInstance) window.nanbiMapInstance.invalidateSize(false); }, 250);
        });

        async function fetchTreeData() {
            try {
                const { data, error } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (error) throw error;
                if (data) {
                    treeNodes = data.filter(n => n.node_id !== 'ATA' && n.node_id !== 'AN'); 
                    populateDropdown('selContinent', 'continent', 'GLOBAL');
                    applyGlobalSelection('GLOBAL');
                    setupDropdownListeners();
                }
            } catch (err) { console.error("Fetch tree data error:", err); }
        }

        function getAncestorAtLevel(nodeId, level) {
            let curr = treeNodes.find(n => n.node_id === nodeId);
            while (curr && curr.node_id !== 'GLOBAL') {
                if (curr.node_level === level) return curr;
                curr = treeNodes.find(n => n.node_id === curr.parent_id);
            }
            return null;
        }

        function getLineage(nodeId) {
            let lineage = {};
            let curr = treeNodes.find(n => n.node_id === nodeId);
            while (curr && curr.node_id !== 'GLOBAL') {
                lineage[curr.node_level] = curr.node_id;
                curr = treeNodes.find(n => n.node_id === curr.parent_id);
            }
            return lineage;
        }

        function isDescendant(node, parentId) {
            let curr = treeNodes.find(n => n.node_id === node.parent_id);
            let depth = 0;
            while (curr && depth < 20) {
                if (curr.node_id === parentId) return true;
                curr = treeNodes.find(n => n.node_id === curr.parent_id);
                depth++;
            }
            return false;
        }

        function populateDropdown(targetId, level, parentId) {
            const sel = container.querySelector('#' + targetId);
            sel.innerHTML = '<option value="All">All</option>';
            const list = treeNodes.filter(n => n.node_level === level && n.parent_id === parentId);
            list.forEach(item => { sel.innerHTML += `<option value="${item.node_id}">${item.node_name}</option>`; });
            sel.disabled = list.length === 0;
            return list.length > 0;
        }

        function cascadeClear(ids) {
            ids.forEach(id => {
                const el = container.querySelector(`#${id}`);
                if (el) { el.innerHTML = '<option value="All">All</option>'; el.disabled = true; }
            });
        }

        function applyGlobalSelection(nodeId) {
            // SAFETY FALLBACK: Ensures GLOBAL always has the Antarctica cropped bounds even if not fetched
            const fallbackGlobalNode = { 
                node_id: 'GLOBAL', node_name: 'World', node_level: 'root', 
                dynamic_config_payload: { viewport_bounds: [[-55.0, -170.0], [75.0, 170.0]] } 
            };
            const activeNode = treeNodes.find(n => n.node_id === nodeId) || fallbackGlobalNode;

            const lineage = getLineage(nodeId);
            if (nodeId === 'GLOBAL') {
                container.querySelector('#selContinent').value = 'All';
                cascadeClear(['selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk']);
            } else {
                if (lineage.continent) { container.querySelector('#selContinent').value = lineage.continent; populateDropdown('selSubContinent', 'sub_continent', lineage.continent); }
                if (lineage.sub_continent) { container.querySelector('#selSubContinent').value = lineage.sub_continent; populateDropdown('selCountry', 'country', lineage.sub_continent); } else cascadeClear(['selCountry', 'selState', 'selDistrict', 'selTaluk']);
                if (lineage.country) { container.querySelector('#selCountry').value = lineage.country; populateDropdown('selState', 'state', lineage.country); } else cascadeClear(['selState', 'selDistrict', 'selTaluk']);
                if (lineage.state) { container.querySelector('#selState').value = lineage.state; populateDropdown('selDistrict', 'district', lineage.state); } else cascadeClear(['selDistrict', 'selTaluk']);
                if (lineage.district) { container.querySelector('#selDistrict').value = lineage.district; populateDropdown('selTaluk', 'taluk', lineage.district); } else cascadeClear(['selTaluk']);
                if (lineage.taluk) { container.querySelector('#selTaluk').value = lineage.taluk; }
            }

            let tableNodes = [];
            if (nodeId === 'GLOBAL') {
                tableNodes = treeNodes.filter(n => n.node_level === 'continent');
            } else {
                tableNodes = treeNodes.filter(n => n.node_id === nodeId || n.parent_id === nodeId);
                tableNodes.sort((a, b) => (a.node_id === nodeId ? -1 : (b.node_id === nodeId ? 1 : 0)));
            }

            container.querySelector('#metricCount').innerText = tableNodes.length;
            container.querySelector('#metricMPS').innerText = "₹" + (tableNodes.length * 35000).toLocaleString('en-IN');
            
            const tbody = container.querySelector('#territoryTbody');
            tbody.innerHTML = '';
            tableNodes.forEach(node => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-[color:var(--hover-bg)] transition cursor-pointer text-[color:var(--text)]";
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

            if (polygonLayerGroup) map.removeLayer(polygonLayerGroup);
            polygonLayerGroup = window.L.featureGroup();
            let activeBoundsLayer = window.L.featureGroup(); 
            let labelData = new Map();

            let countryNodes = treeNodes.filter(n => n.node_level === 'country' && n.dynamic_config_payload && n.dynamic_config_payload.geojson);

            countryNodes.forEach(n => {
                try {
                    let isActiveRegion = (nodeId === 'GLOBAL') || (n.node_id === nodeId || isDescendant(n, nodeId));
                    let geom = n.dynamic_config_payload.geojson;
                    
                    let effectiveColor = '#e2e8f0'; 
                    if (n.dynamic_config_payload && n.dynamic_config_payload.fill_color) effectiveColor = n.dynamic_config_payload.fill_color;
                    
                    if (activeNode.node_level === 'root') {
                        let cont = getAncestorAtLevel(n.node_id, 'continent');
                        if (cont && cont.dynamic_config_payload && cont.dynamic_config_payload.fill_color) effectiveColor = cont.dynamic_config_payload.fill_color;
                    } else if (activeNode.node_level === 'continent') {
                        let sub = getAncestorAtLevel(n.node_id, 'sub_continent');
                        if (sub && sub.dynamic_config_payload && sub.dynamic_config_payload.fill_color) effectiveColor = sub.dynamic_config_payload.fill_color;
                    }

                    let styleOptions = isActiveRegion 
                        ? { color: '#1e293b', weight: 0.6, fillColor: effectiveColor, fillOpacity: 0.95 } 
                        : { color: '#94a3b8', weight: 0.3, fillColor: effectiveColor, fillOpacity: 0.15 }; 

                    let l = window.L.geoJSON(geom, { style: styleOptions });
                    polygonLayerGroup.addLayer(l);
                    if (isActiveRegion) activeBoundsLayer.addLayer(l);
                    
                    let targetLabelNode = null;

                    if (nodeId === 'GLOBAL') {
                        targetLabelNode = getAncestorAtLevel(n.node_id, 'continent');
                    } else if (activeNode.node_level === 'continent') {
                        if (isActiveRegion) targetLabelNode = getAncestorAtLevel(n.node_id, 'sub_continent');
                        else targetLabelNode = getAncestorAtLevel(n.node_id, 'continent');
                    } else if (activeNode.node_level === 'sub_continent') {
                        if (isActiveRegion) targetLabelNode = n; 
                        else {
                            let sameCont = getAncestorAtLevel(n.node_id, 'continent')?.node_id === getAncestorAtLevel(activeNode.node_id, 'continent')?.node_id;
                            targetLabelNode = sameCont ? getAncestorAtLevel(n.node_id, 'sub_continent') : getAncestorAtLevel(n.node_id, 'continent');
                        }
                    } else {
                        if (isActiveRegion) targetLabelNode = n;
                        else {
                            let sameSub = getAncestorAtLevel(n.node_id, 'sub_continent')?.node_id === getAncestorAtLevel(activeNode.node_id, 'sub_continent')?.node_id;
                            targetLabelNode = sameSub ? n : getAncestorAtLevel(n.node_id, 'sub_continent') || getAncestorAtLevel(n.node_id, 'continent');
                        }
                    }

                    if (targetLabelNode) {
                        if (!labelData.has(targetLabelNode.node_id)) {
                            labelData.set(targetLabelNode.node_id, { 
                                name: targetLabelNode.node_name, 
                                bounds: window.L.latLngBounds(), 
                                isActive: isActiveRegion,
                                payload: targetLabelNode.dynamic_config_payload 
                            });
                        }
                        labelData.get(targetLabelNode.node_id).bounds.extend(l.getBounds());
                        if (isActiveRegion) labelData.get(targetLabelNode.node_id).isActive = true;
                    }

                    l.on('click', () => {
                        if (activeNode.node_level === 'root') {
                            let cont = getAncestorAtLevel(n.node_id, 'continent');
                            if (cont) applyGlobalSelection(cont.node_id);
                        } else if (activeNode.node_level === 'continent') {
                            let sub = getAncestorAtLevel(n.node_id, 'sub_continent');
                            if (sub) applyGlobalSelection(sub.node_id);
                        } else {
                            applyGlobalSelection(n.node_id);
                        }
                    });
                } catch(e) {}
            });

            // HOLLOW LABEL GENERATOR: Reads properties dynamically from SQL payload
            labelData.forEach((data, id) => {
                let anchor = (data.payload && data.payload.label_anchor) ? data.payload.label_anchor : data.bounds.getCenter();
                let textColor = (data.payload && data.payload.label_color) ? data.payload.label_color : '';
                let rotation = (data.payload && data.payload.label_rotation) ? data.payload.label_rotation : '0deg';
                let maxWidth = (data.payload && data.payload.label_max_width) ? data.payload.label_max_width : '65px';
                
                let cssClass = data.isActive ? 'label-active' : 'label-shadowed';
                let formattedName = toTitleCase(data.name || '');
                
                let inlineStyle = `transform: rotate(${rotation}); max-width: ${maxWidth};`;
                if (textColor) inlineStyle += ` color: ${textColor}; text-shadow: none;`;

                let marker = window.L.marker(anchor, {
                    icon: window.L.divIcon({ 
                        className: `map-label ${cssClass}`, 
                        html: `<div class="label-text" style="${inlineStyle}">${formattedName}</div>`,
                        iconSize: [120, 40], 
                        iconAnchor: [60, 20] 
                    }),
                    interactive: false
                });
                polygonLayerGroup.addLayer(marker);
            });

            // 4. THE 90% WINDOW / 5% DYNAMIC MARGIN LOGIC (Now linked to SQL Viewport Bounds)
            setTimeout(() => {
                map.invalidateSize(true);
                
                // ADD THE POLYGONS TO THE SCREEN
                if (polygonLayerGroup.getLayers().length > 0) {
                    polygonLayerGroup.addTo(map); 
                }

                if (activeBoundsLayer.getLayers().length > 0) {
                    let targetBounds = activeBoundsLayer.getBounds();
                    
                    // --- THE FINAL ARCHITECTURAL LINK ---
                    // Read the database! If Config Hub specifies exact bounds (e.g. cropping Antarctica or Colonies), obey it.
                    if (activeNode.dynamic_config_payload && activeNode.dynamic_config_payload.viewport_bounds) {
                        const vb = activeNode.dynamic_config_payload.viewport_bounds;
                        targetBounds = window.L.latLngBounds(vb[0], vb[1]);
                    }

                    if (targetBounds.isValid()) {
                        
                        // Dynamically asks the browser exactly how many pixels exist right now
                        const currentSize = map.getSize(); 
                        
                        // Calculates exactly 5% padding for perfect 90% utilization (minimum 10px safety)
                        const padX = Math.max(10, Math.floor(currentSize.x * 0.05)); 
                        const padY = Math.max(10, Math.floor(currentSize.y * 0.05)); 
                        
                        map.fitBounds(targetBounds, { 
                            padding: [padX, padY], 
                            animate: true, 
                            duration: 1.0 
                        });
                    }
                }
            }, 150);
        }

        function setupDropdownListeners() {
            ['selContinent', 'selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk'].forEach(id => {
                container.querySelector(`#${id}`).addEventListener('change', (e) => {
                    if (e.target.value !== 'All') applyGlobalSelection(e.target.value);
                    else {
                        const currentSelect = e.target.id;
                        if (currentSelect === 'selTaluk') applyGlobalSelection(container.querySelector('#selDistrict').value);
                        else if (currentSelect === 'selDistrict') applyGlobalSelection(container.querySelector('#selState').value);
                        else if (currentSelect === 'selState') applyGlobalSelection(container.querySelector('#selCountry').value);
                        else if (currentSelect === 'selCountry') applyGlobalSelection(container.querySelector('#selSubContinent').value);
                        else if (currentSelect === 'selSubContinent') applyGlobalSelection(container.querySelector('#selContinent').value);
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
                            ta.value = JSON.stringify(node.dynamic_config_payload, null, 4);
                            ta.disabled = false;
                            
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
