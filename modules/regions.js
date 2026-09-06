// =======================================================================
// NANBI V5.0 - ULTIMATE OPTIMIZED 3-WAY INTERACTIVE REGIONS ENGINE
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        container.innerHTML = `
            <style>
                #regions-module { padding: 2px !important; gap: 4px !important; height: 100% !important; overflow: hidden !important; }
                #regions-module .table-container { overflow-y: auto; max-height: 62vh; }
                #regions-module th { position: sticky; top: 0; background-color: #f8fafc; color: #334155; z-index: 10; text-align: center; border-bottom: 2px solid #e2e8f0; font-weight: 700; }
                #regions-module td { text-align: center; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 500; }
                #regions-module .col-left { text-align: left; }
                #regions-module .row-active { background-color: #fff7ed !important; border-left: 4px solid #D35400; } 
                
                /* ZERO GREY SPACE MAP CONTAINER FIX */
                #regions-module .map-box-wrapper { position: relative; width: 100%; flex: 1; min-height: 400px; display: flex; flex-direction: column; }
                #regions-module #map { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 4px; z-index: 1; }
                
                #regions-module path.leaflet-interactive { transition: fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s; outline: none; }
                #regions-module path.leaflet-interactive:hover { fill-opacity: 0.9 !important; stroke-width: 2.5px !important; stroke: #1E293B !important; cursor: pointer; }
                
                .id-label {
                    background: transparent !important; border: none !important; box-shadow: none !important;
                    font-weight: 700; font-size: 10px; color: #1E293B;
                    text-shadow: 1px 1px 2px #ffffff, -1px -1px 2px #ffffff, 1px -1px 2px #ffffff, -1px 1px 2px #ffffff;
                    text-align: center;
                }
            </style>

            <div id="regions-module" class="flex-1 flex flex-col gap-1 overflow-hidden h-full">
                <!-- ULTRA-COMPACT TABS -->
                <div class="flex gap-2 border-b border-slate-200 pb-1 shrink-0 px-0.5">
                    <button id="tabMapMatrix" class="px-3 py-0.5 rounded text-xs font-bold bg-[#D35400] text-white shadow-sm transition">
                        <i class="fas fa-map-marked-alt mr-1"></i> Global Map & N-Layer Matrix
                    </button>
                    <button id="tabConfigHub" class="px-3 py-0.5 rounded text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition">
                        <i class="fas fa-sitemap mr-1"></i> Jurisdictional Tree & Config Hub
                    </button>
                </div>

                <!-- VIEW 1: 3-WAY INTERACTIVE MAP & MATRIX -->
                <div id="viewMapMatrix" class="flex flex-col lg:flex-row gap-1.5 flex-1 overflow-hidden px-0.5 pb-0.5">
                    <!-- LEFT COLUMN: MAP & HIERARCHY SELECTORS -->
                    <aside class="w-full lg:w-[48%] flex flex-col gap-1.5 shrink-0 h-full">
                        <div class="bg-white p-0.5 rounded border border-slate-200 flex flex-col flex-1 relative overflow-hidden shadow-sm">
                            <div class="map-box-wrapper rounded overflow-hidden border border-slate-200 bg-[#e2f0f5]">
                                <div id="map"></div>
                            </div>
                        </div>

                        <div class="bg-white p-2 rounded border border-slate-200 flex flex-col gap-1 shrink-0 shadow-sm">
                            <div class="flex justify-between items-center pb-0.5 border-b border-slate-100">
                                <span id="geoHierarchyBreadcrumb" class="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Global Root (World)</span>
                                <button id="btnResetView" class="text-[10px] font-bold text-slate-500 hover:text-[#D35400] transition px-1"><i class="fas fa-globe-americas mr-1"></i> Reset View</button>
                            </div>
                            <div class="grid grid-cols-2 gap-1 text-[10px]">
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Continent</label><select id="selContinent" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none"><option value="All">All Continents</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Sub-Continent</label><select id="selSubContinent" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Sub-Continents</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Country</label><select id="selCountry" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Countries</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">State / Province</label><select id="selState" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All States</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">District</label><select id="selDistrict" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Districts</option></select></div>
                                <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Taluk / Territory</label><select id="selTaluk" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Taluks</option></select></div>
                            </div>
                        </div>
                    </aside>

                    <!-- RIGHT COLUMN: STATS, TABLE & ENTITY INSPECTOR -->
                    <section class="w-full lg:w-[52%] flex flex-col gap-1.5 shrink-0 lg:shrink h-full">
                        <div class="bg-white p-1.5 rounded border border-slate-200 flex justify-around items-center shrink-0 shadow-sm">
                            <div class="text-center w-1/2">
                                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Nodes</p>
                                <p class="text-lg font-black text-slate-800 mt-0" id="metricCount">0</p>
                            </div>
                            <div class="w-px h-8 bg-slate-200"></div>
                            <div class="text-center w-1/2">
                                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Capacity</p>
                                <p class="text-lg font-black mt-0" style="color: #D35400;" id="metricMPS">₹0</p>
                            </div>
                        </div>

                        <div class="flex-1 bg-white rounded border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                            <div class="table-container flex-1">
                                <table class="w-full border-collapse text-[11px]">
                                    <thead class="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                                        <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th class="py-2 px-2.5 text-left pl-3">Node ID</th>
                                            <th class="py-2 px-2.5 text-left">Node Name</th>
                                            <th class="py-2 px-2.5 text-left">Level</th>
                                            <th class="py-2 px-2.5 text-right pr-3">Gov Code</th>
                                        </tr>
                                    </thead>
                                    <tbody id="territoryTbody" class="cursor-pointer text-slate-700">
                                        <tr><td colspan="4" class="py-12 text-center text-slate-400">Loading global registry...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="h-28 bg-white rounded border border-slate-200 p-2 flex flex-col overflow-hidden shrink-0 shadow-sm">
                            <div class="flex justify-between items-center border-b border-slate-100 pb-0.5 mb-1">
                                <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500" id="deepDiveTitle">Entity Inspector</h3>
                                <span class="text-[9px] text-slate-500 font-mono" id="deepDiveSubtitle">Select a node</span>
                            </div>
                            <div id="deepDiveContent" class="flex-1 overflow-y-auto text-[11px] text-slate-500 font-medium flex items-center justify-center">
                                Awaiting node selection...
                            </div>
                        </div>
                    </section>
                </div>

                <!-- VIEW 2: CONFIG HUB -->
                <div id="viewConfigHub" class="hidden flex-col lg:flex-row gap-1.5 flex-1 overflow-hidden px-0.5 pb-0.5">
                    <aside class="w-full lg:w-[45%] bg-white p-2.5 rounded border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex justify-between items-center pb-1.5 border-b border-slate-100 mb-1.5">
                            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-700">Universal Jurisdictional Tree</h3>
                            <span id="treeNodeCountBadge" class="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-[#D35400] font-bold">0 Nodes</span>
                        </div>
                        <div id="treeListContainer" class="flex-1 overflow-y-auto space-y-1 font-sans">
                            <p class="text-slate-400 italic text-center py-10">Synchronizing with Edge Ledger...</p>
                        </div>
                    </aside>
                    <section class="w-full lg:w-[55%] bg-white p-3.5 rounded border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex justify-between items-center pb-1.5 border-b border-slate-100 mb-2">
                            <div>
                                <h3 class="text-sm font-bold text-slate-800" id="configNodeTitle">Select a Regional Node</h3>
                                <p class="text-xs text-slate-400 font-mono" id="configNodeMeta">Level: N/A | ID: --</p>
                            </div>
                            <button id="btnSaveConfigPayload" class="px-3 py-1 rounded text-xs font-bold bg-[#D35400] hover:bg-[#b54600] text-white shadow transition flex items-center gap-1" style="display:none;">
                                <i class="fas fa-save"></i> Save Config Payload
                            </button>
                        </div>
                        <div class="flex-1 flex flex-col gap-1 mb-2">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dynamic Config Payload (JSONB - Config Hub)</label>
                            <textarea id="jsonConfigTextarea" class="w-full flex-1 p-2 font-mono text-xs rounded border border-slate-200 bg-slate-900 text-green-400 outline-none resize-none" placeholder="Select a node from the tree to inspect its JSONB configuration..." disabled></textarea>
                        </div>
                        <div class="bg-slate-50 p-2 rounded border border-slate-200 shrink-0">
                            <div class="flex justify-between items-center border-b border-slate-100 pb-0.5 mb-0.5">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Architectural Audit & Reasoning (DEC-12)</span>
                                <span class="text-[9px] text-slate-400 font-mono">Cascaded SSOT</span>
                            </div>
                            <div id="auditReasonBox" class="text-xs text-slate-600 font-medium py-0.5">Select a node to review audit logs.</div>
                        </div>
                    </section>
                </div>
            </div>
        `;

        // Tabs
        const tabMapMatrix = container.querySelector('#tabMapMatrix');
        const tabConfigHub = container.querySelector('#tabConfigHub');
        const viewMapMatrix = container.querySelector('#viewMapMatrix');
        const viewConfigHub = container.querySelector('#viewConfigHub');

        tabMapMatrix.onclick = () => {
            tabMapMatrix.className = "px-3 py-0.5 rounded text-xs font-bold bg-[#D35400] text-white shadow-sm transition";
            tabConfigHub.className = "px-3 py-0.5 rounded text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition";
            viewMapMatrix.style.display = "flex";
            viewConfigHub.style.display = "none";
            if (map) {
                setTimeout(() => map.invalidateSize(true), 50);
            }
        };

        tabConfigHub.onclick = () => {
            tabConfigHub.className = "px-3 py-0.5 rounded text-xs font-bold bg-[#D35400] text-white shadow-sm transition";
            tabMapMatrix.className = "px-3 py-0.5 rounded text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition";
            viewConfigHub.style.display = "flex";
            viewMapMatrix.style.display = "none";
            loadJurisdictionalTree();
        };

        let map = null, polygonLayerGroup = null;
        let treeNodes = [];
        let layerMapByNodeId = new Map();

        function getDistinctColor(name) {
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
            return `hsl(${Math.abs(hash % 360)}, 65%, 60%)`;
        }

        if (!window.L) {
            await new Promise((resolve) => {
                const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
                const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script);
            });
        }

        const mapEl = window.L.DomUtil.get('map');
        if (mapEl) mapEl._leaflet_id = null;

        map = window.L.map('map', { zoomControl: true, attributionControl: false, zoomSnap: 0.1 }).setView([20.0, 0.0], 2);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 0.6 }).addTo(map);

        async function fetchTreeData() {
            try {
                const { data, error } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (error) throw error;
                if (data) {
                    treeNodes = data;
                    populateContinents();
                    updateTableAndMetrics(treeNodes);
                    renderPolygons(treeNodes);
                    setupListeners();
                }
            } catch (err) {
                console.error("Fetch tree data error:", err);
            }
        }

        function populateContinents() {
            const continents = treeNodes.filter(n => n.node_level === 'continent');
            const sel = container.querySelector('#selContinent');
            sel.innerHTML = '<option value="All">All Continents</option>';
            continents.forEach(c => sel.innerHTML += `<option value="${c.node_id}">${c.node_name}</option>`);
            sel.disabled = false;
        }

        function setupListeners() {
            container.querySelector('#selContinent').addEventListener('change', (e) => {
                const val = e.target.value;
                const sub = container.querySelector('#selSubContinent');
                sub.innerHTML = '<option value="All">All Sub-Continents</option>';
                sub.disabled = true;
                cascadeClear(['selCountry', 'selState', 'selDistrict', 'selTaluk']);
                if (val !== 'All') {
                    const list = treeNodes.filter(n => n.node_level === 'sub_continent' && n.parent_id === val);
                    list.forEach(s => sub.innerHTML += `<option value="${s.node_id}">${s.node_name}</option>`);
                    sub.disabled = list.length === 0;
                }
                filterAndRender();
            });

            container.querySelector('#selSubContinent').addEventListener('change', (e) => {
                const val = e.target.value;
                const co = container.querySelector('#selCountry');
                co.innerHTML = '<option value="All">All Countries</option>';
                co.disabled = true;
                cascadeClear(['selState', 'selDistrict', 'selTaluk']);
                if (val !== 'All') {
                    const list = treeNodes.filter(n => n.node_level === 'country' && n.parent_id === val);
                    list.forEach(c => co.innerHTML += `<option value="${c.node_id}">${c.node_name}</option>`);
                    co.disabled = list.length === 0;
                }
                filterAndRender();
            });

            container.querySelector('#selCountry').addEventListener('change', (e) => {
                const val = e.target.value;
                const st = container.querySelector('#selState');
                st.innerHTML = '<option value="All">All States</option>';
                st.disabled = true;
                cascadeClear(['selDistrict', 'selTaluk']);
                if (val !== 'All') {
                    const list = treeNodes.filter(n => n.node_level === 'state' && n.parent_id === val);
                    list.forEach(s => st.innerHTML += `<option value="${s.node_id}">${s.node_name}</option>`);
                    st.disabled = list.length === 0;
                }
                filterAndRender();
            });

            container.querySelector('#selState').addEventListener('change', (e) => {
                const val = e.target.value;
                const di = container.querySelector('#selDistrict');
                di.innerHTML = '<option value="All">All Districts</option>';
                di.disabled = true;
                cascadeClear(['selTaluk']);
                if (val !== 'All') {
                    const list = treeNodes.filter(n => n.node_level === 'district' && n.parent_id === val);
                    list.forEach(d => di.innerHTML += `<option value="${d.node_id}">${d.node_name}</option>`);
                    di.disabled = list.length === 0;
                }
                filterAndRender();
            });

            container.querySelector('#selDistrict').addEventListener('change', (e) => {
                const val = e.target.value;
                const ta = container.querySelector('#selTaluk');
                ta.innerHTML = '<option value="All">All Taluks/Territories</option>';
                ta.disabled = true;
                if (val !== 'All') {
                    const list = treeNodes.filter(n => (n.node_level === 'taluk' || n.node_level === 'territory_sp') && n.parent_id === val);
                    list.forEach(t => ta.innerHTML += `<option value="${t.node_id}">${t.node_name}</option>`);
                    ta.disabled = list.length === 0;
                }
                filterAndRender();
            });

            container.querySelector('#selTaluk').addEventListener('change', () => filterAndRender());

            container.querySelector('#btnResetView').addEventListener('click', () => {
                container.querySelector('#selContinent').value = 'All';
                cascadeClear(['selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk']);
                updateTableAndMetrics(treeNodes);
                renderPolygons(treeNodes);
                map.setView([20.0, 0.0], 2);
            });
        }

        function cascadeClear(ids) {
            ids.forEach(id => {
                const el = container.querySelector(`#${id}`);
                if (el) { el.innerHTML = '<option value="All">All</option>'; el.disabled = true; }
            });
        }

        function filterAndRender() {
            const cont = container.querySelector('#selContinent').value;
            const subCont = container.querySelector('#selSubContinent').value;
            const country = container.querySelector('#selCountry').value;
            const state = container.querySelector('#selState').value;
            const dist = container.querySelector('#selDistrict').value;
            const taluk = container.querySelector('#selTaluk').value;

            let activeId = taluk !== 'All' ? taluk : dist !== 'All' ? dist : state !== 'All' ? state : country !== 'All' ? country : subCont !== 'All' ? subCont : cont !== 'All' ? cont : null;

            let matched = treeNodes;
            if (activeId) {
                matched = treeNodes.filter(n => n.node_id === activeId || isDescendant(n, activeId));
            }

            updateTableAndMetrics(matched);
            renderPolygons(matched);
        }

        function isDescendant(node, parentId) {
            let curr = treeNodes.find(n => n.node_id === node.parent_id);
            while (curr) {
                if (curr.node_id === parentId) return true;
                curr = treeNodes.find(n => n.node_id === curr.parent_id);
            }
            return false;
        }

        // 3-WAY INTERACTIVE POLYGON RENDERING WITH MULTI-COLOR & EXACT BOUNDS ZOOMING
        function renderPolygons(nodesList) {
            if (polygonLayerGroup) map.removeLayer(polygonLayerGroup);
            polygonLayerGroup = window.L.featureGroup();
            layerMapByNodeId.clear();

            nodesList.forEach(n => {
                if (n.dynamic_config_payload && n.dynamic_config_payload.geojson) {
                    try {
                        let geom = n.dynamic_config_payload.geojson;
                        let polyColor = getDistinctColor(n.node_name);
                        let l = window.L.geoJSON(geom, { 
                            style: { color: '#ffffff', weight: 1.2, fillColor: polyColor, fillOpacity: 0.8 } 
                        });
                        l.bindTooltip(n.node_name, { direction: 'center', className: 'id-label', permanent: false });
                        
                        // MAP -> TABLE & INSPECTOR 3-WAY INTERACTIVITY
                        l.on('click', () => {
                            selectNodeFromMapOrTable(n);
                        });

                        polygonLayerGroup.addLayer(l);
                        layerMapByNodeId.set(n.node_id, l);
                    } catch(e) {}
                }
            });

            if (polygonLayerGroup.getLayers().length > 0) {
                polygonLayerGroup.addTo(map);
                setTimeout(() => {
                    map.invalidateSize(true);
                    map.fitBounds(polygonLayerGroup.getBounds(), { padding: [20, 20], maxZoom: 7 });
                }, 50);
            }
        }

        // 3-WAY INTERACTION HANDLER: MAP/TABLE SELECTION
        function selectNodeFromMapOrTable(node) {
            // Find and highlight table row
            const rows = container.querySelectorAll('#territoryTbody tr');
            let targetRow = null;
            rows.forEach(r => {
                if (r.innerText.includes(node.node_id)) {
                    r.classList.add('row-active');
                    targetRow = r;
                } else {
                    r.classList.remove('row-active');
                }
            });
            if (targetRow) {
                targetRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }

            // Update Entity Inspector
            container.querySelector('#deepDiveTitle').innerText = `${node.node_id} — ${node.node_name}`;
            container.querySelector('#deepDiveSubtitle').innerText = `Level: ${node.node_level.toUpperCase()}`;
            container.querySelector('#deepDiveContent').innerHTML = `
                <div class="p-1.5 bg-slate-50 rounded border text-slate-700 w-full flex flex-col gap-0.5">
                    <span class="font-bold">Gov Code:</span> ${node.official_gov_code || 'N/A'}
                    <span class="font-bold">Reasoning:</span> ${node.architectural_reasoning || 'N/A'}
                </div>
            `;

            // Zoom map to specific node bounds if geometry exists
            const layer = layerMapByNodeId.get(node.node_id);
            if (layer && layer.getBounds) {
                map.fitBounds(layer.getBounds(), { padding: [40, 40], maxZoom: 8, animate: true });
            }
        }

        function updateTableAndMetrics(nodesList) {
            container.querySelector('#metricCount').innerText = nodesList.length;
            container.querySelector('#metricMPS').innerText = "₹" + (nodesList.length * 35000).toLocaleString('en-IN');
            const tbody = container.querySelector('#territoryTbody');
            tbody.innerHTML = '';
            if (nodesList.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="py-12 text-center text-slate-400">No nodes match selected criteria.</td></tr>';
                return;
            }
            nodesList.forEach(node => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 transition cursor-pointer text-slate-700";
                
                // TABLE -> MAP & INSPECTOR 3-WAY INTERACTIVITY
                tr.onclick = () => {
                    selectNodeFromMapOrTable(node);
                };

                tr.innerHTML = `
                    <td class="py-2 px-2.5 font-mono text-xs font-bold text-teal-700 border-r pl-3">${node.node_id}</td>
                    <td class="py-2 px-2.5 font-bold col-left border-r">${node.node_name}</td>
                    <td class="py-2 px-2.5 font-bold col-left border-r text-sky-600 uppercase">${node.node_level}</td>
                    <td class="py-2 px-2.5 text-right pr-3 font-mono">${node.official_gov_code || 'N/A'}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        async function loadJurisdictionalTree() {
            try {
                const treeContainer = container.querySelector('#treeListContainer');
                treeContainer.innerHTML = `<p class="text-slate-400 italic text-center py-10">Synchronizing with Edge Ledger...</p>`;
                const { data } = await window.nanbiDB.from('regional_hierarchy_nodes').select('*').order('node_level');
                if (data) {
                    container.querySelector('#treeNodeCountBadge').innerText = data.length + " Nodes";
                    treeContainer.innerHTML = '';
                    data.forEach(node => {
                        const div = document.createElement('div');
                        div.className = "p-2 rounded border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition flex justify-between items-center";
                        div.innerHTML = `<div><div class="font-bold text-slate-800 text-xs">${node.node_name}</div><div class="text-[9px] text-slate-400 uppercase font-mono">${node.node_level} | ID: ${node.node_id}</div></div><i class="fas fa-chevron-right text-xs text-slate-400"></i>`;
                        div.onclick = () => {
                            container.querySelector('#configNodeTitle').innerText = node.node_name;
                            container.querySelector('#configNodeMeta').innerText = `Level: ${node.node_level.toUpperCase()} | ID: ${node.node_id}`;
                            const ta = container.querySelector('#jsonConfigTextarea');
                            ta.value = JSON.stringify(node.dynamic_config_payload, null, 4);
                            ta.disabled = false;
                            const btn = container.querySelector('#btnSaveConfigPayload');
                            btn.style.display = 'flex';
                            btn.onclick = async () => {
                                let parsed = JSON.parse(ta.value);
                                let reason = prompt("Enter Architectural Reasoning (DEC-12):", "Configured via Config Hub");
                                if (!reason) return;
                                await window.nanbiDB.from('regional_hierarchy_nodes').update({ dynamic_config_payload: parsed, architectural_reasoning: reason, updated_at: new Date().toISOString() }).eq('node_id', node.node_id);
                                alert("Saved successfully.");
                                loadJurisdictionalTree();
                            };
                        };
                        treeContainer.appendChild(div);
                    });
                }
            } catch (err) {
                console.error("Jurisdictional tree load error:", err);
            }
        }

        await fetchTreeData();

    } catch (err) {
        container.innerHTML = `<div style="padding: 40px; color: red; font-family: monospace;"><b>Critical Engine Fault:</b> ${err.message}</div>`;
        console.error("Regions Engine Fatal Error:", err);
    }
}
