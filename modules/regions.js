// =======================================================================
// NANBI V5.0 - ZERO-SPACE, 3-WAY INTERACTIVE REGIONS ENGINE
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. ELIMINATE WASTED GLOBAL PADDING FROM ROUTER.JS
    const parentContainer = container.closest('div[style*="padding"]');
    if (parentContainer) {
        parentContainer.style.setProperty('padding', '4px', 'important');
    }

    try {
        container.innerHTML = `
            <style>
                #regions-module { gap: 6px !important; height: 100% !important; overflow: hidden !important; }
                #regions-module .table-container { overflow-y: auto; height: 100%; }
                #regions-module th { position: sticky; top: 0; background-color: #f8fafc; color: #334155; z-index: 10; text-align: center; border-bottom: 2px solid #e2e8f0; font-weight: 800; font-size: 10px; }
                #regions-module td { text-align: center; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600; font-size: 11px; padding: 6px 8px; }
                #regions-module .col-left { text-align: left; }
                
                /* THE ACTIVE ROW HIGHLIGHT */
                #regions-module .row-active { background-color: #fff7ed !important; border-left: 4px solid #D35400 !important; } 
                
                #regions-module .map-box-wrapper { position: relative; width: 100%; flex: 1; min-height: 450px; display: flex; flex-direction: column; border-radius: 6px; }
                #regions-module #map { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 6px; z-index: 1; background: #e2f0f5; }
                
                #regions-module path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
                #regions-module path.leaflet-interactive:hover { fill-opacity: 0.9 !important; stroke-width: 2.5px !important; stroke: #1E293B !important; cursor: pointer; }
                
                .id-label {
                    background: transparent !important; border: none !important; box-shadow: none !important;
                    font-weight: 800; font-size: 11px; color: #1E293B;
                    text-shadow: 1px 1px 2px #ffffff, -1px -1px 2px #ffffff, 1px -1px 2px #ffffff, -1px 1px 2px #ffffff;
                    text-align: center;
                }
                
                /* COMPACT SCROLLBARS */
                #regions-module ::-webkit-scrollbar { width: 4px; }
                #regions-module ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
            </style>

            <div id="regions-module" class="flex-1 flex flex-col overflow-hidden h-full w-full">
                <!-- ULTRA-COMPACT TABS -->
                <div class="flex gap-2 border-b border-slate-200 pb-1.5 shrink-0 px-1">
                    <button id="tabMapMatrix" class="px-4 py-1 rounded text-[11px] font-bold bg-[#D35400] text-white shadow-sm transition">
                        <i class="fas fa-map-marked-alt mr-1.5"></i> Global Map & N-Layer Matrix
                    </button>
                    <button id="tabConfigHub" class="px-4 py-1 rounded text-[11px] font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition">
                        <i class="fas fa-sitemap mr-1.5"></i> Jurisdictional Tree & Config Hub
                    </button>
                </div>

                <!-- VIEW 1: 3-WAY INTERACTIVE MAP & MATRIX -->
                <div id="viewMapMatrix" class="flex flex-col lg:flex-row gap-2 flex-1 overflow-hidden pt-1">
                    
                    <!-- LEFT COLUMN: MAP & HIERARCHY SELECTORS -->
                    <aside class="w-full lg:w-[48%] flex flex-col gap-2 shrink-0 h-full">
                        <div class="bg-white p-1 rounded border border-slate-200 flex flex-col flex-1 relative shadow-sm">
                            <div class="map-box-wrapper border border-slate-200">
                                <div id="map"></div>
                            </div>
                        </div>

                        <div class="bg-white p-2.5 rounded border border-slate-200 flex flex-col gap-1.5 shrink-0 shadow-sm">
                            <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                                <span id="geoHierarchyBreadcrumb" class="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Global Root (World)</span>
                                <button id="btnResetView" class="text-[10px] font-bold text-slate-500 hover:text-[#D35400] transition px-1"><i class="fas fa-undo mr-1"></i> Reset Matrix</button>
                            </div>
                            <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Continent</label><select id="selContinent" class="bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-bold outline-none cursor-pointer"><option value="All">All Continents</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Sub-Continent</label><select id="selSubContinent" class="bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-bold outline-none cursor-pointer" disabled><option value="All">All Sub-Continents</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Country</label><select id="selCountry" class="bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-bold outline-none cursor-pointer" disabled><option value="All">All Countries</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">State / Province</label><select id="selState" class="bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-bold outline-none cursor-pointer" disabled><option value="All">All States</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">District</label><select id="selDistrict" class="bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-bold outline-none cursor-pointer" disabled><option value="All">All Districts</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Taluk / Territory</label><select id="selTaluk" class="bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 font-bold outline-none cursor-pointer" disabled><option value="All">All Taluks</option></select></div>
                            </div>
                        </div>
                    </aside>

                    <!-- RIGHT COLUMN: STATS, TABLE & INSPECTOR -->
                    <section class="w-full lg:w-[52%] flex flex-col gap-2 shrink-0 lg:shrink h-full">
                        <div class="bg-white py-2 rounded border border-slate-200 flex justify-around items-center shrink-0 shadow-sm">
                            <div class="text-center w-1/2">
                                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Filtered Nodes</p>
                                <p class="text-2xl font-black text-slate-800 mt-0" id="metricCount">0</p>
                            </div>
                            <div class="w-px h-10 bg-slate-200"></div>
                            <div class="text-center w-1/2">
                                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Capacity</p>
                                <p class="text-2xl font-black mt-0" style="color: #D35400;" id="metricMPS">₹0</p>
                            </div>
                        </div>

                        <div class="flex-1 bg-white rounded border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                            <div class="table-container">
                                <table class="w-full border-collapse">
                                    <thead class="bg-slate-50 shadow-sm">
                                        <tr class="uppercase tracking-wider">
                                            <th class="py-2.5 px-3 text-left pl-4">Node ID</th>
                                            <th class="py-2.5 px-3 text-left">Jurisdiction Name</th>
                                            <th class="py-2.5 px-3 text-left">Level</th>
                                            <th class="py-2.5 px-3 text-right pr-4">Gov Code</th>
                                        </tr>
                                    </thead>
                                    <tbody id="territoryTbody" class="cursor-pointer">
                                        <tr><td colspan="4" class="py-16 text-center text-slate-400 font-medium">Loading universal matrix...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="h-32 bg-white rounded border border-slate-200 p-3 flex flex-col overflow-hidden shrink-0 shadow-sm">
                            <div class="flex justify-between items-center border-b border-slate-100 pb-1 mb-1.5">
                                <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-800" id="deepDiveTitle">Entity Inspector</h3>
                                <span class="text-[10px] text-slate-500 font-mono font-bold uppercase" id="deepDiveSubtitle">Select a node</span>
                            </div>
                            <div id="deepDiveContent" class="flex-1 overflow-y-auto text-xs text-slate-600 font-medium flex flex-col gap-1">
                                <div class="text-center text-slate-400 mt-4">Awaiting 3-way synchronization...</div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- VIEW 2: CONFIG HUB -->
                <div id="viewConfigHub" class="hidden flex-col lg:flex-row gap-2 flex-1 overflow-hidden pt-1">
                    <aside class="w-full lg:w-[40%] bg-white p-3 rounded border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800">Universal Jurisdictional Tree</h3>
                            <span id="treeNodeCountBadge" class="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-[#D35400] font-bold">0 Nodes</span>
                        </div>
                        <div id="treeListContainer" class="flex-1 overflow-y-auto space-y-1 font-sans">
                            <p class="text-slate-400 italic text-center py-10">Synchronizing with Edge Ledger...</p>
                        </div>
                    </aside>
                    <section class="w-full lg:w-[60%] bg-white p-4 rounded border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
                            <div>
                                <h3 class="text-sm font-bold text-slate-800" id="configNodeTitle">Select a Regional Node</h3>
                                <p class="text-[11px] text-slate-500 font-mono font-bold uppercase" id="configNodeMeta">Level: N/A | ID: --</p>
                            </div>
                            <button id="btnSaveConfigPayload" class="px-4 py-1.5 rounded text-xs font-bold bg-[#D35400] hover:bg-[#b54600] text-white shadow transition flex items-center gap-1.5" style="display:none;">
                                <i class="fas fa-lock"></i> Save Payload
                            </button>
                        </div>
                        <div class="flex-1 flex flex-col gap-1 mb-3">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dynamic JSONB Config Ledger</label>
                            <textarea id="jsonConfigTextarea" class="w-full flex-1 p-3 font-mono text-xs rounded border border-slate-200 bg-slate-900 text-green-400 outline-none resize-none shadow-inner" placeholder="Select a node to inspect..." disabled></textarea>
                        </div>
                        <div class="bg-slate-50 p-3 rounded border border-slate-200 shrink-0">
                            <div class="flex justify-between items-center border-b border-slate-100 pb-1 mb-1.5">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-800">Architectural Audit & Reasoning (DEC-12)</span>
                                <span class="text-[10px] text-slate-500 font-mono font-bold">Cascaded SSOT</span>
                            </div>
                            <div id="auditReasonBox" class="text-xs text-slate-600 font-medium py-1">Select a node to review immutability logs.</div>
                        </div>
                    </section>
                </div>
            </div>
        `;

        // Tab Setup
        const tabMapMatrix = container.querySelector('#tabMapMatrix');
        const tabConfigHub = container.querySelector('#tabConfigHub');
        const viewMapMatrix = container.querySelector('#viewMapMatrix');
        const viewConfigHub = container.querySelector('#viewConfigHub');

        tabMapMatrix.onclick = () => {
            tabMapMatrix.className = "px-4 py-1 rounded text-[11px] font-bold bg-[#D35400] text-white shadow-sm transition";
            tabConfigHub.className = "px-4 py-1 rounded text-[11px] font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition";
            viewMapMatrix.style.display = "flex";
            viewConfigHub.style.display = "none";
            if (map) setTimeout(() => map.invalidateSize(true), 50);
        };

        tabConfigHub.onclick = () => {
            tabConfigHub.className = "px-4 py-1 rounded text-[11px] font-bold bg-[#D35400] text-white shadow-sm transition";
            tabMapMatrix.className = "px-4 py-1 rounded text-[11px] font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition";
            viewConfigHub.style.display = "flex";
            viewMapMatrix.style.display = "none";
            loadJurisdictionalTree();
        };

        // Core Global State
        let map = null, polygonLayerGroup = null;
        let treeNodes = [];
        let layerMapByNodeId = new Map();

        function getDistinctColor(name) {
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
            return `hsl(${Math.abs(hash % 360)}, 65%, 55%)`;
        }

        // Init Leaflet
        if (!window.L) {
            await new Promise((resolve) => {
                const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
                const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script);
            });
        }

        const mapEl = window.L.DomUtil.get('map');
        if (mapEl) mapEl._leaflet_id = null;

        map = window.L.map('map', { zoomControl: true, attributionControl: false }).setView([20.0, 0.0], 2);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 0.65 }).addTo(map);

        // Fetch DB Data
        async function fetchTreeData() {
            try {
                const { data, error } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (error) throw error;
                if (data) {
                    treeNodes = data;
                    populateDropdown('selContinent', 'continent', 'GLOBAL');
                    applyGlobalSelection('GLOBAL'); // Boot with World View
                    setupDropdownListeners();
                }
            } catch (err) {
                console.error("Fetch tree data error:", err);
            }
        }

        // =======================================================================
        // THE MASTER 3-WAY SYNCHRONIZATION ENGINE
        // =======================================================================
        
        // Traces the entire lineage of any node back to the Global root
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
            list.forEach(item => {
                sel.innerHTML += `<option value="${item.node_id}">${item.node_name}</option>`;
            });
            sel.disabled = list.length === 0;
            return list.length > 0;
        }

        function cascadeClear(ids) {
            ids.forEach(id => {
                const el = container.querySelector(`#${id}`);
                if (el) { el.innerHTML = '<option value="All">All</option>'; el.disabled = true; }
            });
        }

        // The unified function called by Maps, Tables, and Dropdowns
        function applyGlobalSelection(nodeId) {
            const activeNode = treeNodes.find(n => n.node_id === nodeId);
            if (!activeNode) return;

            // 1. Sync Dropdowns to Match Lineage
            const lineage = getLineage(nodeId);
            
            if (lineage.continent) {
                container.querySelector('#selContinent').value = lineage.continent;
                populateDropdown('selSubContinent', 'sub_continent', lineage.continent);
            } else cascadeClear(['selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk']);

            if (lineage.sub_continent) {
                container.querySelector('#selSubContinent').value = lineage.sub_continent;
                populateDropdown('selCountry', 'country', lineage.sub_continent);
            } else cascadeClear(['selCountry', 'selState', 'selDistrict', 'selTaluk']);

            if (lineage.country) {
                container.querySelector('#selCountry').value = lineage.country;
                populateDropdown('selState', 'state', lineage.country);
            } else cascadeClear(['selState', 'selDistrict', 'selTaluk']);

            if (lineage.state) {
                container.querySelector('#selState').value = lineage.state;
                populateDropdown('selDistrict', 'district', lineage.state);
            } else cascadeClear(['selDistrict', 'selTaluk']);

            if (lineage.district) {
                container.querySelector('#selDistrict').value = lineage.district;
                populateDropdown('selTaluk', 'taluk', lineage.district);
            } else cascadeClear(['selTaluk']);

            if (lineage.taluk) {
                container.querySelector('#selTaluk').value = lineage.taluk;
            }

            // 2. Filter Global Matrix (Only show exact node + its descendants)
            let matched = treeNodes;
            if (nodeId !== 'GLOBAL') {
                matched = treeNodes.filter(n => n.node_id === nodeId || isDescendant(n, nodeId));
            }

            // 3. Re-render Table
            container.querySelector('#metricCount').innerText = matched.length;
            container.querySelector('#metricMPS').innerText = "₹" + (matched.length * 35000).toLocaleString('en-IN');
            
            const tbody = container.querySelector('#territoryTbody');
            tbody.innerHTML = '';
            
            // Put the selected macro region at the top of the table
            matched.sort((a, b) => (a.node_id === nodeId ? -1 : (b.node_id === nodeId ? 1 : 0)));

            matched.forEach(node => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-100 transition cursor-pointer text-slate-700";
                
                // Highlight the actively selected exact node
                if (node.node_id === nodeId && nodeId !== 'GLOBAL') {
                    tr.classList.add('row-active');
                }

                // Table -> Engine interaction
                tr.onclick = () => applyGlobalSelection(node.node_id);

                tr.innerHTML = `
                    <td class="col-left border-r pl-4"><span class="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-teal-700 font-bold">${node.node_id}</span></td>
                    <td class="font-bold col-left border-r">${node.node_name}</td>
                    <td class="font-bold col-left border-r text-sky-600 uppercase text-[9px] tracking-wider">${node.node_level.replace('_', ' ')}</td>
                    <td class="text-right pr-4 font-mono font-bold">${node.official_gov_code || '--'}</td>
                `;
                tbody.appendChild(tr);
            });

            // Scroll the active row into view
            const activeRow = tbody.querySelector('.row-active');
            if (activeRow) activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

            // 4. Update Inspector
            container.querySelector('#geoHierarchyBreadcrumb').innerText = activeNode.node_name;
            container.querySelector('#deepDiveTitle').innerText = `${activeNode.node_id} — ${activeNode.node_name}`;
            container.querySelector('#deepDiveSubtitle').innerText = `Level: ${activeNode.node_level.replace('_', ' ')}`;
            container.querySelector('#deepDiveContent').innerHTML = `
                <div class="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span class="font-bold text-slate-800">Gov/ISO Code:</span> 
                    <span class="font-mono bg-slate-100 px-1 rounded border border-slate-200">${activeNode.official_gov_code || 'N/A'}</span>
                </div>
                <div class="flex flex-col gap-0.5 pt-1">
                    <span class="font-bold text-slate-800">Architectural Reasoning:</span> 
                    <span class="text-slate-500 italic">${activeNode.architectural_reasoning || 'No ledger entry.'}</span>
                </div>
            `;

            // 5. Re-render Map & Auto-Zoom bounds tightly around the active selection
            if (polygonLayerGroup) map.removeLayer(polygonLayerGroup);
            polygonLayerGroup = window.L.featureGroup();
            layerMapByNodeId.clear();

            matched.forEach(n => {
                if (n.dynamic_config_payload && n.dynamic_config_payload.geojson) {
                    try {
                        let geom = n.dynamic_config_payload.geojson;
                        let polyColor = getDistinctColor(n.node_name);
                        let l = window.L.geoJSON(geom, { 
                            style: { color: '#ffffff', weight: 1.2, fillColor: polyColor, fillOpacity: 0.85 } 
                        });
                        l.bindTooltip(n.node_name, { direction: 'center', className: 'id-label', permanent: false });
                        
                        // Map -> Engine interaction
                        l.on('click', () => applyGlobalSelection(n.node_id));

                        polygonLayerGroup.addLayer(l);
                        layerMapByNodeId.set(n.node_id, l);
                    } catch(e) {}
                }
            });

            if (polygonLayerGroup.getLayers().length > 0) {
                polygonLayerGroup.addTo(map);
                setTimeout(() => {
                    map.invalidateSize(true);
                    // Tight zoom bounds based on the filtered hierarchy
                    map.fitBounds(polygonLayerGroup.getBounds(), { padding: [10, 10], animate: true, maxZoom: 9 });
                }, 50);
            } else if (nodeId === 'GLOBAL') {
                setTimeout(() => { map.invalidateSize(true); map.setView([20.0, 0.0], 2); }, 50);
            }
        }

        // Dropdown -> Engine Event Handlers
        function setupDropdownListeners() {
            container.querySelector('#selContinent').addEventListener('change', (e) => {
                e.target.value === 'All' ? applyGlobalSelection('GLOBAL') : applyGlobalSelection(e.target.value);
            });
            container.querySelector('#selSubContinent').addEventListener('change', (e) => {
                e.target.value === 'All' ? applyGlobalSelection(container.querySelector('#selContinent').value) : applyGlobalSelection(e.target.value);
            });
            container.querySelector('#selCountry').addEventListener('change', (e) => {
                e.target.value === 'All' ? applyGlobalSelection(container.querySelector('#selSubContinent').value) : applyGlobalSelection(e.target.value);
            });
            container.querySelector('#selState').addEventListener('change', (e) => {
                e.target.value === 'All' ? applyGlobalSelection(container.querySelector('#selCountry').value) : applyGlobalSelection(e.target.value);
            });
            container.querySelector('#selDistrict').addEventListener('change', (e) => {
                e.target.value === 'All' ? applyGlobalSelection(container.querySelector('#selState').value) : applyGlobalSelection(e.target.value);
            });
            container.querySelector('#selTaluk').addEventListener('change', (e) => {
                e.target.value === 'All' ? applyGlobalSelection(container.querySelector('#selDistrict').value) : applyGlobalSelection(e.target.value);
            });

            container.querySelector('#btnResetView').addEventListener('click', () => {
                applyGlobalSelection('GLOBAL');
            });
        }

        async function loadJurisdictionalTree() {
            try {
                const treeContainer = container.querySelector('#treeListContainer');
                treeContainer.innerHTML = `<p class="text-slate-400 italic text-center py-10">Synchronizing with Edge Ledger...</p>`;
                
                // Pull fresh in case of updates
                const { data } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (data) {
                    treeNodes = data; // update memory
                    container.querySelector('#treeNodeCountBadge').innerText = data.length + " Nodes";
                    treeContainer.innerHTML = '';
                    
                    data.forEach(node => {
                        const div = document.createElement('div');
                        div.className = "p-2 rounded border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition flex justify-between items-center";
                        div.innerHTML = `<div><div class="font-bold text-slate-800 text-xs">${node.node_name}</div><div class="text-[9px] text-slate-400 uppercase font-mono font-bold">${node.node_level.replace('_', ' ')} | ID: ${node.node_id}</div></div><i class="fas fa-edit text-xs text-slate-400"></i>`;
                        div.onclick = () => {
                            container.querySelector('#configNodeTitle').innerText = node.node_name;
                            container.querySelector('#configNodeMeta').innerText = `Level: ${node.node_level.toUpperCase()} | ID: ${node.node_id}`;
                            const ta = container.querySelector('#jsonConfigTextarea');
                            ta.value = JSON.stringify(node.dynamic_config_payload, null, 4);
                            ta.disabled = false;
                            
                            const auditBox = container.querySelector('#auditReasonBox');
                            auditBox.innerHTML = `<div class="flex flex-col gap-0.5"><span class="text-slate-800 font-bold">Reasoning:</span> <span class="text-slate-600">${node.architectural_reasoning || 'No reason recorded.'}</span><span class="text-slate-400 text-[9px] mt-1 font-mono uppercase">Last Modified: ${node.updated_at || 'Never'}</span></div>`;

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
