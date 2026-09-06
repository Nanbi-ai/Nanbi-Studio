// =======================================================================
// NANBI V5.0 - N-LAYER JURISDICTIONAL TREE & REGIONS ENGINE
// =======================================================================

export async function initRegionsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <style>
            #regions-module .table-container { overflow-y: auto; max-height: 52vh; }
            #regions-module th { position: sticky; top: 0; background-color: var(--card); color: var(--text); z-index: 10; text-align: center; border-bottom: 2px solid var(--border); font-weight: 700; }
            #regions-module td { text-align: center; border-bottom: 1px solid var(--border); color: var(--text); font-weight: 500; }
            #regions-module .col-left { text-align: left; }
            #regions-module .row-active { background-color: var(--active-bg) !important; border-left: 4px solid var(--brand-orange-dark); } 
            #regions-module ::-webkit-scrollbar { width: 6px; }
            #regions-module ::-webkit-scrollbar-thumb { background-color: var(--muted); border-radius: 4px; }
        </style>

        <div id="regions-module" class="flex-1 flex flex-col lg:flex-row gap-3 overflow-y-auto lg:overflow-hidden h-full">
            <!-- LEFT COLUMN: HIERARCHY TREE NAV -->
            <aside class="w-full lg:w-[38%] flex flex-col gap-3 shrink-0">
                <div class="flex-1 bg-[color:var(--card)] p-3 rounded border border-[color:var(--border)] flex flex-col relative overflow-hidden shadow-sm h-64 lg:h-auto min-h-[300px]">
                    <div class="flex justify-between items-center pb-2 border-b border-[color:var(--border)] mb-2">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-main">Universal Jurisdictional Tree</h3>
                        <span id="nodeCountBadge" class="text-[10px] font-mono px-2 py-0.5 rounded bg-[color:var(--active-bg)] text-[color:var(--brand-orange-dark)] font-bold">0 Nodes</span>
                    </div>
                    <div id="treeNavContainer" class="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs">
                        <p class="text-muted italic text-center py-10">Synchronizing with Edge Ledger...</p>
                    </div>
                </div>
            </aside>

            <!-- RIGHT COLUMN: CONFIG HUB & PAYLOAD INSPECTOR -->
            <section class="w-full lg:w-[62%] flex flex-col gap-3 shrink-0 lg:shrink h-auto lg:h-full">
                <div class="flex-1 bg-[color:var(--card)] rounded border border-[color:var(--border)] flex flex-col overflow-hidden shadow-sm p-4">
                    <div class="flex justify-between items-center border-b border-[color:var(--border)] pb-2 mb-3">
                        <div>
                            <h3 class="text-sm font-bold text-main" id="selectedNodeTitle">Select a Regional Node</h3>
                            <p class="text-xs text-muted font-mono" id="selectedNodeMeta">Level: N/A | ID: --</p>
                        </div>
                        <button id="btnSaveConfig" class="px-3 py-1.5 rounded text-xs font-bold transition-all shadow-sm" style="background: var(--brand-orange-dark); color: #FFF; display: none;">
                            <i class="fas fa-save mr-1"></i> Save Config Payload
                        </button>
                    </div>

                    <div class="flex-1 flex flex-col gap-2">
                        <label class="text-[10px] font-bold text-muted uppercase tracking-widest">Dynamic Config Payload (JSONB)</label>
                        <textarea id="jsonConfigEditor" class="w-full flex-1 p-3 font-mono text-xs rounded border border-[color:var(--border)] bg-[color:var(--bg)] text-[color:var(--text)] outline-none resize-none" placeholder="Select a node from the tree to inspect its JSONB configuration..."></textarea>
                    </div>
                </div>
                
                <div class="h-[22vh] min-h-[140px] bg-[color:var(--card)] rounded border border-[color:var(--border)] p-3 flex flex-col overflow-hidden shrink-0 shadow-sm">
                    <div class="flex justify-between items-center border-b border-[color:var(--border)] pb-1.5 mb-2">
                        <h3 class="text-[10px] font-bold uppercase tracking-widest text-muted">Architectural Audit & Reasoning</h3>
                        <span class="text-[10px] text-muted font-mono">DEC-12 Compliance</span>
                    </div>
                    <div id="auditReasonDisplay" class="flex-1 overflow-y-auto text-xs text-muted font-medium flex items-center">
                        Select a node to review its immutability log and architectural reasoning.
                    </div>
                </div>
            </section>
        </div>
    `;

    let allNodes = [];
    let activeNode = null;

    async function fetchTreeNodes() {
        const { data, error } = await window.nanbiDB
            .from('regional_hierarchy_nodes')
            .select('*')
            .order('node_level', { ascending: true });

        if (error) {
            console.error("Tree Fetch Error:", error);
            container.querySelector('#treeNavContainer').innerHTML = `<p class="text-red-500 text-center">Failed to load regional tree.</p>`;
            return;
        }

        allNodes = data || [];
        container.querySelector('#nodeCountBadge').innerText = allNodes.length + " Nodes";
        renderTreeView();
    }

    function renderTreeView() {
        const treeContainer = container.querySelector('#treeNavContainer');
        treeContainer.innerHTML = '';

        if (allNodes.length === 0) {
            treeContainer.innerHTML = `<p class="text-muted italic text-center py-10">No nodes found in database.</p>`;
            return;
        }

        allNodes.forEach(node => {
            const item = document.createElement('div');
            item.className = "p-2 rounded cursor-pointer transition-colors border border-transparent hover:border-[color:var(--border)] hover:bg-[color:var(--active-bg)] flex justify-between items-center";
            if (activeNode && activeNode.node_id === node.node_id) {
                item.classList.add('row-active');
            }

            item.innerHTML = `
                <div>
                    <div class="font-bold text-main">${node.node_name}</div>
                    <div class="text-[10px] text-muted">${node.node_level.toUpperCase()} | ID: ${node.node_id}</div>
                </div>
                <i class="fas fa-chevron-right text-[10px] text-muted"></i>
            `;

            item.onclick = () => selectNode(node);
            treeContainer.appendChild(item);
        });
    }

    function selectNode(node) {
        activeNode = node;
        renderTreeView(); // Refresh active highlight

        container.querySelector('#selectedNodeTitle').innerText = node.node_name;
        container.querySelector('#selectedNodeMeta').innerText = `Level: ${node.node_level.toUpperCase()} | ID: ${node.node_id} | Gov Code: ${node.official_gov_code || 'N/A'}`;
        
        const editor = container.querySelector('#jsonConfigEditor');
        editor.value = JSON.stringify(node.dynamic_config_payload, null, 4);
        editor.disabled = false;

        const saveBtn = container.querySelector('#btnSaveConfig');
        saveBtn.style.display = 'inline-flex';

        const auditDiv = container.querySelector('#auditReasonDisplay');
        auditDiv.innerHTML = `
            <div class="flex flex-col gap-1 w-full">
                <span class="text-main font-bold">Reasoning:</span> <span class="text-text">${node.architectural_reasoning || 'None recorded.'}</span>
                <span class="text-muted text-[10px] mt-1">Last Modified: ${node.updated_at} (Node: ${node.origin_node})</span>
            </div>
        `;
    }

    container.querySelector('#btnSaveConfig').onclick = async () => {
        if (!activeNode) return;
        const editor = container.querySelector('#jsonConfigEditor');
        
        let parsedPayload;
        try {
            parsedPayload = JSON.parse(editor.value);
        } catch (err) {
            alert("Invalid JSON syntax. Please correct the payload before saving.");
            return;
        }

        const reason = prompt("Enter Architectural Reasoning for this update (DEC-12 Mandate):", "Manual update via Nanbi Studio Regions Module");
        if (!reason) return;

        const { error } = await window.nanbiDB
            .from('regional_hierarchy_nodes')
            .update({
                dynamic_config_payload: parsedPayload,
                architectural_reasoning: reason,
                updated_at: new Date().toISOString(),
                origin_node: 'Nanbi_Studio_Web'
            })
            .eq('node_id', activeNode.node_id);

        if (error) {
            alert("Sync Failed: " + error.message);
        } else {
            alert("Payload successfully locked and timestamped.");
            fetchTreeNodes();
        }
    };

    await fetchTreeNodes();
}
