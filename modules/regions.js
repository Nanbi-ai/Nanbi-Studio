// =======================================================================
// NANBI V5.0 - UNIVERSAL N-LAYER REGIONS & CONFIG HUB ENGINE
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. EXACT UI CHASSIS WITH PROPER MAP CONTAINER SIZING & N-LAYER SELECTORS
    container.innerHTML = `
        <style>
            #regions-module .table-container { overflow-y: auto; max-height: 48vh; }
            #regions-module th { position: sticky; top: 0; background-color: #f8fafc; color: #334155; z-index: 10; text-align: center; border-bottom: 2px solid #e2e8f0; font-weight: 700; }
            #regions-module td { text-align: center; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 500; }
            #regions-module .col-left { text-align: left; }
            #regions-module .row-active { background-color: #fff7ed !important; border-left: 4px solid #D35400; } 
            
            /* FIXED MAP CONTAINER HEIGHT & ABSOLUTE POSITIONING */
            #regions-module #map-container-box { position: relative; width: 100%; height: 360px; flex-shrink: 0; }
            #regions-module #map { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 0.25rem; z-index: 1; }
            
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
                    <i class="fas fa-map-marked-alt mr-1.5"></i> Spatial Map & N-Layer Matrix
                </button>
                <button id="tabConfigHub" class="px-4 py-1.5 rounded text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition">
                    <i class="fas fa-sitemap mr-1.5"></i> Universal Jurisdictional Tree & Config Hub
                </button>
            </div>

            <!-- VIEW 1: MAP & N-LAYER MATRIX -->
            <div id="viewMapMatrix" class="flex flex-col lg:flex-row gap-3 flex-1 overflow-hidden">
                <aside class="w-full lg:w-[40%] flex flex-col gap-3 shrink-0">
                    <!-- MAP BOX -->
                    <div class="bg-white p-1.5 rounded border border-slate-200 flex flex-col relative overflow-hidden shadow-sm">
                        <div id="map-container-box" class="rounded overflow-hidden border border-slate-200 bg-[#e2f0f5]">
                            <div id="map"></div>
                        </div>
                    </div>

                    <!-- N-LAYER DYNAMIC MACRO-ROUTING DROPDOWNS -->
                    <div class="bg-white p-3 rounded border border-slate-200 flex flex-col gap-2 shrink-0 shadow-sm">
                        <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                            <span id="geoHierarchyBreadcrumb" class="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Global Root (World)</span>
                            <button id="btnResetView" class="text-[10px] font-bold text-slate-500 hover:text-[#D35400] transition px-2"><i class="fas fa-globe-americas mr-1"></i> Reset View</button>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-[10px] mt-1">
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Continent</label><select id="selContinent" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none"><option value="All">All Continents</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Sub-Continent</label><select id="selSubContinent" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Sub-Continents</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Country</label><select id="selCountry" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Countries</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">State / Province</label><select id="selState" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All States</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">District</label><select id="selDistrict" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Districts</option></select></div>
                            <div class="flex flex-col"><label class="font-bold text-slate-500 uppercase mb-0.5">Taluk / Territory</label><select id="selTaluk" class="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 font-medium outline-none" disabled><option value="All">All Taluks</option></select></div>
                        </div>
                    </div>
                </aside>

                <section class="w-full lg:w-[60%] flex flex-col gap-3 shrink-0 lg:shrink h-auto lg:h-full">
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
                                        <th class="py-3 px-4 text-left pl-4">Node ID</th>
                                        <th class="py-3 px-4 text-left">Node Name</th>
                                        <th class="py-3 px-4 text-left">Level</th>
                                        <th class="py-3 px-4 text-right">Gov Code</th>
                                    </tr>
                                </thead>
                                <tbody id="territoryTbody" class="cursor-pointer text-slate-700">
                                    <tr>
                                        <td colspan="4" class="py-16 text-center">
                                            <div class="opacity-70 flex flex-col items-center">
                                                <i class="fas fa-layer-group text-4xl text-slate-300 mb-3"></i>
                                                <h4 class="font-bold text-xs uppercase tracking-wider text-[#D35400]">Macro Region Selected</h4>
                                                <p class="text-[11px] text-slate-500 mt-1">Select a jurisdiction from the tree or dropdowns to inspect data.</p>
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
                            <span class="text-[10px] text-slate-500 font-mono" id="deepDiveSubtitle">Select a node</span>
                        </div>
                        <div id="deepDiveContent" class="flex-1 overflow-y-auto text-[11px] text-slate-500 font-medium flex items-center justify-center">
                            Awaiting node selection...
                        </div>
                    </div>
                </section>
            </div>

            <!-- VIEW 2: UNIVERSAL JURISDICTIONAL TREE & CONFIG HUB -->
            <div id="viewConfigHub" class="hidden flex-col lg:flex-row gap-3 flex-1 overflow-hidden">
                <aside class="w-full lg:w-[45%] bg-white p-4 rounded border border-slate-200 flex flex-col shadow-sm">
                    <div class="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-700">N-Layer Universal Jurisdictional Tree</h3>
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
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dynamic Config Payload (JSONB - Config Hub)</label>
                        <textarea id="jsonConfigTextarea" class="w-full flex-1 p-3 font-mono text-xs rounded border border-slate-200 bg-slate-900 text-green-400 outline-none resize-none" placeholder="Select a node from the tree to inspect its JSONB configuration..." disabled></textarea>
                    </div>
                    <div class="bg-slate-50 p-3 rounded border border-slate-200 shrink-0">
                        <div class="flex justify-between items-center border-b border-slate-100 pb-1 mb-1">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Architectural Audit & Reasoning (DEC-12)</span>
                            <span class="text-[10px] text-slate-400 font-mono">Cascaded SSOT</span>
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

    // 3. LEAFLET MAP & N-LAYER JURISDICTIONAL HIERARCHY
    let map = null, currentGeoLayer = null, markers = [];
    let treeNodes = [];

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

    async function fetchTreeData() {
        const { data, error } = await window.nanbiDB
            .from('regional_hierarchy_nodes')
            .select('*')
            .order('node_level', { ascending: true });

        if (!error && data) {
            treeNodes = data;
            populateDropdowns();
            updateTableAndMetrics(treeNodes);
        }
    }

    function populateDropdowns() {
        const continents = treeNodes.filter(n => n.node_level === 'continent');
        const selCont = container.querySelector('#selContinent');
        selCont.innerHTML = '<option value="All">All Continents</option>';
        continents.forEach(c => selCont.innerHTML += `<option value="${c.node_id}">${c.node_name}</option>`);
        selCont.disabled = false;
    }

    function setupDropdownListeners() {
        container.querySelector('#selContinent').addEventListener('change', (e) => {
            const val = e.target.value;
            const subContSel = container.querySelector('#selSubContinent');
            subContSel.innerHTML = '<option value="All">All Sub-Continents</option>';
            subContSel.disabled = true;
            cascadeClear(['selCountry', 'selState', 'selDistrict', 'selTaluk']);

            if (val !== 'All') {
                const subs = treeNodes.filter(n => n.node_level === 'sub_continent' && n.parent_id === val);
                subs.forEach(s => subContSel.innerHTML += `<option value="${s.node_id}">${s.node_name}</option>`);
                subContSel.disabled = subs.length === 0;
            }
            filterAndRender();
        });

        container.querySelector('#selSubContinent').addEventListener('change', (e) => {
            const val = e.target.value;
            const countrySel = container.querySelector('#selCountry');
            countrySel.innerHTML = '<option value="All">All Countries</option>';
            countrySel.disabled = true;
            cascadeClear(['selState', 'selDistrict', 'selTaluk']);

            if (val !== 'All') {
                const countries = treeNodes.filter(n => n.node_level === 'country' && n.parent_id === val);
                countries.forEach(co => countrySel.innerHTML += `<option value="${co.node_id}">${co.node_name}</option>`);
                countrySel.disabled = countries.length === 0;
            }
            filterAndRender();
        });

        container.querySelector('#selCountry').addEventListener('change', (e) => {
            const val = e.target.value;
            const stateSel = container.querySelector('#selState');
            stateSel.innerHTML = '<option value="All">All States</option>';
            stateSel.disabled = true;
            cascadeClear(['selDistrict', 'selTaluk']);

            if (val !== 'All') {
                const states = treeNodes.filter(n => n.node_level === 'state' && n.parent_id === val);
                states.forEach(st => stateSel.innerHTML += `<option value="${st.node_id}">${st.node_name}</option>`);
                stateSel.disabled = states.length === 0;
            }
            filterAndRender();
        });

        container.querySelector('#selState').addEventListener('change', (e) => {
            const val = e.target.value;
            const distSel = container.querySelector('#selDistrict');
            distSel.innerHTML = '<option value="All">All Districts</option>';
            distSel.disabled = true;
            cascadeClear(['selTaluk']);

            if (val !== 'All') {
                const dists = treeNodes.filter(n => n.node_level === 'district' && n.parent_id === val);
                dists.forEach(d => distSel.innerHTML += `<option value="${d.node_id}">${d.node_name}</option>`);
                distSel.disabled = dists.length === 0;
            }
            filterAndRender();
        });

        container.querySelector('#selDistrict').addEventListener('change', (e) => {
            const val = e.target.value;
            const talukSel = container.querySelector('#selTaluk');
            talukSel.innerHTML = '<option value="All">All Taluks/Territories</option>';
            talukSel.disabled = true;

            if (val !== 'All') {
                const taluks = treeNodes.filter(n => (n.node_level === 'taluk' || n.node_level === 'territory_sp') && n.parent_id === val);
                taluks.forEach(t => talukSel.innerHTML += `<option value="${t.node_id}">${t.node_name}</option>`);
                talukSel.disabled = taluks.length === 0;
            }
            filterAndRender();
        });

        container.querySelector('#selTaluk').addEventListener('change', () => filterAndRender());

        container.querySelector('#btnResetView').addEventListener('click', () => {
            container.querySelector('#selContinent').value = 'All';
            cascadeClear(['selSubContinent', 'selCountry', 'selState', 'selDistrict', 'selTaluk']);
            updateTableAndMetrics(treeNodes);
            map.setView([22.5937, 78.9629], 4);
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

        let activeId = null;
        if (taluk !== 'All') activeId = taluk;
        else if (dist !== 'All') activeId = dist;
        else if (state !== 'All') activeId = state;
        else if (country !== 'All') activeId = country;
        else if (subCont !== 'All') activeId = subCont;
        else if (cont !== 'All') activeId = cont;

        let matched = treeNodes;
        if (activeId) {
            matched = treeNodes.filter(n => n.node_id === activeId || isDescendant(n, activeId));
        }

        updateTableAndMetrics(matched);
    }

    function isDescendant(node, parentId) {
        let curr = treeNodes.find(n => n.node_id === node.parent_id);
        while (curr) {
            if (curr.node_id === parentId) return true;
            curr = treeNodes.find(n => n.node_id === curr.parent_id);
        }
        return false;
    }

    function updateTableAndMetrics(nodesList) {
        container.querySelector('#metricCount').innerText = nodesList.length;
        container.querySelector('#metricMPS').innerText = "₹" + (nodesList.length * 35000).toLocaleString('en-IN');

        const tbody = container.querySelector('#territoryTbody');
        tbody.innerHTML = '';

        if (nodesList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="py-16 text-center text-slate-400">No nodes match the selected filter criteria.</td></tr>';
            return;
        }

        nodesList.forEach(node => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50 transition cursor-pointer text-slate-700";
            tr.onclick = () => inspectNodeEntity(node, tr);
            tr.innerHTML = `
                <td class="p-2 font-mono text-xs font-bold text-teal-700 border-r border-slate-100 pl-4">${node.node_id}</td>
                <td class="p-2 font-bold col-left border-r border-slate-100 whitespace-nowrap">${node.node_name}</td>
                <td class="p-2 font-bold col-left border-r border-slate-100 whitespace-nowrap text-sky-600 uppercase">${node.node_level}</td>
                <td class="p-2 text-right pr-4 font-mono">${node.official_gov_code || 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function inspectNodeEntity(node, trElement) {
        document.querySelectorAll('#territoryTbody tr').forEach(r => r.classList.remove('row-active'));
        if (trElement) trElement.classList.add('row-active');
        container.querySelector('#deepDiveTitle').innerText = `${node.node_id} — ${node.node_name}`;
        container.querySelector('#deepDiveSubtitle').innerText = `Level: ${node.node_level.toUpperCase()} | Parent: ${node.parent_id || 'None'}`;
        
        const content = container.querySelector('#deepDiveContent');
        content.innerHTML = `
            <div class="w-full flex flex-col gap-1 p-2 bg-slate-50 rounded border border-slate-200">
                <span class="font-bold text-slate-800">Reasoning:</span> <span class="text-slate-600">${node.architectural_reasoning || 'No audit log.'}</span>
            </div>
        `;
    }

    // 4. JURISDICTIONAL TREE & CONFIG HUB ENGINE
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
    setupDropdownListeners();
    try {
        await fetchTreeData();
    } catch(e) {
        console.warn("Tree boot warning:", e);
    }
}
