export function initRegionsModule(containerId, supabaseKey) {
    const container = document.getElementById(containerId);
    
    // 1. Inject the pure layout for the Map and Data panes
    container.innerHTML = `
        <div class="flex-1 flex flex-col lg:flex-row gap-3 w-full" style="min-height:75vh;">
            <aside class="w-full lg:w-[38%] flex flex-col gap-3 shrink-0">
                <div class="flex-1 bg-white p-1.5 rounded border border-slate-200 relative shadow-sm min-h-[350px]">
                    <div id="map-wrapper" style="position:relative; width:100%; height:100%; min-height:400px; z-index:1;">
                        <div id="map" style="position:absolute; inset:0;"></div>
                    </div>
                </div>
                <div class="bg-white p-3 rounded border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                        <span id="geoHierarchyBreadcrumb" class="text-[10px] font-bold text-slate-600 uppercase">World View</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-[10px] mt-2">
                        <div class="flex flex-col"><label style="font-weight:600; color:#475569;">Macro Region</label><select id="selCountry" class="p-1 border rounded"><option>Loading...</option></select></div>
                        <div class="flex flex-col"><label style="font-weight:600; color:#475569;">Micro Region</label><select id="selState" disabled class="p-1 border rounded bg-slate-50"><option>All</option></select></div>
                    </div>
                </div>
            </aside>
            <section class="w-full lg:w-[62%] flex flex-col gap-3 shrink-0 lg:shrink">
                <div class="bg-white p-3 rounded border border-slate-200 flex justify-around shadow-sm">
                    <div class="text-center">
                        <p class="text-[10px] font-bold text-slate-500 uppercase">Active Regions</p>
                        <p class="text-2xl font-black text-slate-800" id="metricCount">0</p>
                    </div>
                </div>
            </section>
        </div>
    `;

    // 2. Initialize the Native Leaflet Map Engine
    const map = L.map('map', { zoomControl: true, attributionControl: false }).setView([22.5937, 78.9629], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { opacity: 0.5 }).addTo(map);

    // 3. Authenticate with Supabase
    const nanbiDB = window.supabase.createClient("https://yeoracoxyjzgpsyxgwri.supabase.co", supabaseKey);

    // 4. Fetch the Genesis Data via RPC and render the boundaries
    nanbiDB.rpc('get_countries_geojson').then(res => {
        if(res.data && res.data.length > 0) {
            const sel = document.getElementById('selCountry');
            sel.innerHTML = '<option value="All">Global Overview</option>';
            
            const featureGroup = L.featureGroup();
            
            res.data.forEach(c => {
                sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
                if(c.geojson) {
                    try {
                        const layer = L.geoJSON(JSON.parse(c.geojson), { 
                            style: { color: '#ffffff', weight: 1, fillColor: '#D35400', fillOpacity: 0.4 } 
                        });
                        layer.on('mouseover', e => { e.target.bringToFront(); e.target.setStyle({stroke: true, color: '#1E293B', weight: 2}); });
                        layer.on('mouseout', e => e.target.setStyle({color: '#ffffff', weight: 1}));
                        featureGroup.addLayer(layer);
                    } catch(err) {}
                }
            });
            
            sel.disabled = false;
            featureGroup.addTo(map);
            map.fitBounds(featureGroup.getBounds());
            document.getElementById('metricCount').innerText = res.data.length;
        }
    });
}
