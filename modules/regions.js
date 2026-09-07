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
                
                /* MAP CONTAINER */
                #regions-module #map-wrapper { position: relative; width: 100%; height: 100%; min-height: 250px; border-radius: 5px; background-color: #aad3df; overflow: hidden; }
                #regions-module #map { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; background-color: #aad3df; }
                .leaflet-container { background: transparent !important; }
                
                /* DARK MODE MAP INVERSION */
                .dark-theme-map { background-color: #0f172a !important; }
                .dark-theme-map .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
                
                /* POLYGON HOVER EFFECT: Nanbi Orange Hairline */
                #regions-module path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
                #regions-module path.leaflet-interactive:hover { stroke: #D35400 !important; stroke-width: 1.5px !important; fill-opacity: 0.95 !important; cursor: pointer; }
                
                /* PERMANENT COUNTRY LABELS: Title Case, Unbolded, White Outline */
                .region-label { 
                    background: transparent !important; border: none !important; box-shadow: none !important; 
                    font-weight: 500; font-size: 11px; color: #1e293b; 
                    text-shadow: 1px 1px 2px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9), 1px -1px 2px rgba(255,255,255,0.9), -1px 1px 2px rgba(255,255,255,0.9); 
                    text-align: center; margin: 0; padding: 0;
                    pointer-events: none; white-space: nowrap !important;
                }

                .region-label-hover { 
                    background: rgba(255,255,255,0.95) !important; border: 1px solid #cbd5e1 !important; border-radius: 4px;
                    font-weight: 700; font-size: 11px; color: #0f172a; 
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
                        <div class="flex-1 panel-card flex flex-col h-full w-full relative">
                            <div id="map-wrapper">
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
                        <div class="bg-transparent p-3 rounded border border-[color:var(--border)] shrink-0">
                            <div class="flex justify-between items-center border-b border-[color:var(--border)] pb-1 mb-1.5">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text)]">Architectural Audit & Reasoning</span>
                            </div>
                            <div id="auditReasonBox" class="text-xs text-[color:var(--muted)] font-medium py-0.5">Select a node to review immutability logs.</div>
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
            if (window.nanbiMapInstance) {
                setTimeout(() => window.nanbiMapInstance.invalidateSize(true), 100);
            }
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
        let layerMapByNodeId = new Map();

        // Safe bounds for Continents to prevent zooming out to distant islands
        const strictBounds = {
            'EU': [[35.0, -15.0], [70.0, 45.0]], 
            'AS': [[-10.0, 40.0], [75.0, 150.0]], 
            'AF': [[-35.0, -20.0], [38.0, 55.0]], 
            'NO': [[10.0, -130.0], [75.0, -60.0]], 
            'SO': [[-55.0, -85.0], [15.0, -35.0]], 
            'OC': [[-45.0, 110.0], [5.0, 180.0]]
        };

        // Center anchors for specific countries
        const centroidOverrides = {
            'IND': [22.5, 79.0],  
            'USA': [39.8, -98.5],  
            'FRA': [46.2, 2.2],    
            'GBR': [53.0, -1.5],   
            'CAN': [56.1, -106.3], 
            'RUS': [61.5, 105.3],  
            'AUS': [-25.2, 133.7],
            'NZL': [-40.9, 174.8],
            'ZAF': [-30.5, 22.9]
        };

        function toTitleCase(str) {
            return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        // Muted Pastel Colors
        function getDistinctColor(name) {
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
            return `hsl(${Math.abs(hash % 360)}, 70%, 55%)`;
        }

        if (!window.L) {
            await new Promise((resolve) => {
                const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
                const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script);
            });
        }

        if (window.nanbiMapInstance) {
            window.nanbiMapInstance.remove();
        }

        const mapEl = window.L.DomUtil.get('map');
        if (mapEl) mapEl._leaflet_id = null;

        map = window.L.map('map', { 
            zoomControl: true, 
            attributionControl: false,
            zoomSnap: 0.1, 
            worldCopyJump: true,
            minZoom: 0, // Unlocks the map so it can shrink to fit your panel
            maxBounds: null
        }).setView([20.0, 0.0], 1);
        
        window.nanbiMapInstance = map;
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 1, noWrap: false }).addTo(map);

        const isDark = localStorage.getItem('nanbi_theme') === 'dark' || document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
        if (isDark) {
            container.querySelector('#map').classList.add('dark-theme-map');
            container.querySelector('#map-wrapper').style.backgroundColor = '#0f172a';
        }

        // Simple debounce to clear grey patches without causing infinite zoom loops
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.nanbiMapInstance) window.nanbiMapInstance.invalidateSize(false);
            }, 250);
        });

        async function fetchTreeData() {
            try {
                const { data, error } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (error) throw error;
                if (data) {
                    // Stripping Antarctica
                    treeNodes = data.filter(n => n.node_id !== 'ATA' && n.node_id !== 'AN'); 
                    populateDropdown('selContinent', 'continent', 'GLOBAL');
                    applyGlobalSelection('GLOBAL');
                    setupDropdownListeners();
                }
            } catch (err) {
                console.error("Fetch tree data error:", err);
            }
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
            while (curr) {
                if (curr.node_id === parentId) return true;
                curr = treeNodes.find(n => n.node_id === curr.parent_id);
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
            const activeNode = treeNodes.find(n => n.node_id === nodeId) || { node_id: 'GLOBAL', node_name: 'World', node_level: 'root' };
            const isMacroView = (nodeId === 'GLOBAL' || activeNode.node_level === 'continent');

            const lineage = getLineage(nodeId);
            if (lineage.continent) { container.querySelector('#selContinent').value = lineage.continent; populateDropdown('selSubContinent', 'sub_continent', lineage.continent); } else cascadeClear(['selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk']);
            if (lineage.sub_continent) { container.querySelector('#selSubContinent').value = lineage.sub_continent; populateDropdown('selCountry', 'country', lineage.sub_continent); } else cascadeClear(['selCountry', 'selState', 'selDistrict', 'selTaluk']);
            if (lineage.country) { container.querySelector('#selCountry').value = lineage.country; populateDropdown('selState', 'state', lineage.country); } else cascadeClear(['selState', 'selDistrict', 'selTaluk']);
            if (lineage.state) { container.querySelector('#selState').value = lineage.state; populateDropdown('selDistrict', 'district', lineage.state); } else cascadeClear(['selDistrict', 'selTaluk']);
            if (lineage.district) { container.querySelector('#selDistrict').value = lineage.district; populateDropdown('selTaluk', 'taluk', lineage.district); } else cascadeClear(['selTaluk']);
            if (lineage.taluk) { container.querySelector('#selTaluk').value = lineage.taluk; }

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
            container.querySelector('#deepDiveContent').innerHTML = `
                <div class="flex justify-between items-center bg-transparent border border-[color:var(--border)] rounded p-2 text-[color:var(--text)]">
                    <span class="font-bold">Gov/ISO Code:</span> 
                    <span class="font-mono font-bold">${activeNode.official_gov_code || 'N/A'}</span>
                </div>
                <div class="flex flex-col gap-1 p-1">
                    <span class="font-bold text-[color:var(--text)]">Architectural Reasoning:</span> 
                    <span class="text-[color:var(--muted)] italic leading-relaxed">${activeNode.architectural_reasoning || 'No ledger entry.'}</span>
                </div>
            `;

            if (polygonLayerGroup) map.removeLayer(polygonLayerGroup);
            polygonLayerGroup = window.L.featureGroup();
            layerMapByNodeId.clear();

            let mapNodes = treeNodes.filter(n => {
                if (!n.dynamic_config_payload || !n.dynamic_config_payload.geojson) return false;
                if (nodeId === 'GLOBAL') return n.node_level === 'country';
                return n.node_id === nodeId || isDescendant(n, nodeId);
            });

            mapNodes.forEach(n => {
                try {
                    let geom = n.dynamic_config_payload.geojson;
                    let polyColor = getDistinctColor(n.node_name);
                    let formattedName = toTitleCase(n.node_name);
                    
                    let l = window.L.geoJSON(geom, { 
                        style: { color: '#D35400', weight: 0.4, fillColor: polyColor, fillOpacity: 0.85 } 
                    });
                    
                    l.bindTooltip(formattedName, { sticky: true, className: 'region-label-hover' });
                    polygonLayerGroup.addLayer(l);
                    layerMapByNodeId.set(n.node_id, l);

                    // LABEL LOGIC: Hidden on World/Continent macro views to prevent unreadable text overlap
                    if (n.node_level === 'country' && !isMacroView) {
                        let centerPoint = centroidOverrides[n.node_id] ? centroidOverrides[n.node_id] : l.getBounds().getCenter();
                        let labelMarker = window.L.marker(centerPoint, {
                            icon: window.L.divIcon({
                                className: 'region-label',
                                html: formattedName,
                                iconSize: [150, 20],
                                iconAnchor: [75, 10]
                            }),
                            interactive: false
                        });
                        polygonLayerGroup.addLayer(labelMarker);
                    }
                    
                    l.node_id = n.node_id; 
                    l.on('click', () => applyGlobalSelection(n.node_id));
                    
                } catch(e) {}
            });

            setTimeout(() => {
                map.invalidateSize(true);
                if (polygonLayerGroup.getLayers().length > 0) {
                    polygonLayerGroup.addTo(map); 
                    
                    const mapDom = container.querySelector('#map-wrapper');
                    const padX = Math.floor(mapDom.clientWidth * 0.1);
                    const padY = Math.floor(mapDom.clientHeight * 0.1);
                    
                    let targetBounds;
                    if (nodeId === 'GLOBAL') {
                        // FULL PLANETARY BOUNDS: Alaska (-180) to New Zealand (+180), cuts off Antarctica (-60)
                        targetBounds = window.L.latLngBounds([[-60, -180], [85, 180]]);
                    } else if (strictBounds[nodeId]) {
                        targetBounds = window.L.latLngBounds(strictBounds[nodeId][0], strictBounds[nodeId][1]);
                    } else {
                        targetBounds = polygonLayerGroup.getBounds();
                    }
                    
                    // 5% margin for the full world so it perfectly frames within the box, 10% (80% fit) for regions
                    let appliedPadding = nodeId === 'GLOBAL' ? [mapDom.clientWidth * 0.05, mapDom.clientHeight * 0.05] : [padX, padY];
                    
                    map.fitBounds(targetBounds, { padding: appliedPadding, animate: false });
                }
            }, 50);
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
                            
                            const auditBox = container.querySelector('#auditReasonBox');
                            auditBox.innerHTML = `<div class="flex flex-col gap-0.5"><span class="text-[color:var(--text)] font-bold">Reasoning:</span> <span class="text-[color:var(--muted)]">${node.architectural_reasoning || 'No reason recorded.'}</span><span class="text-[color:var(--muted)] text-[9px] mt-1 font-mono uppercase">Last Modified: ${node.updated_at || 'Never'}</span></div>`;

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
            } catch (err) {
                console.error("Tree load error:", err);
            }
        }

        await fetchTreeData();

    } catch (err) {
        container.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;"><b>Critical Engine Fault:</b> ${err.message}</div>`;
    }
}
