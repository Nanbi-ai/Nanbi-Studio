function renderPolygons(nodesList) {
        if (currentGeoLayer) map.removeLayer(currentGeoLayer);
        let group = window.L.featureGroup();

        nodesList.forEach(n => {
            if (n.dynamic_config_payload && n.dynamic_config_payload.geojson) {
                try {
                    let geom = n.dynamic_config_payload.geojson;
                    let l = window.L.geoJSON(geom, { 
                        style: { color: '#D35400', weight: 1.2, fillColor: '#E08A6D', fillOpacity: 0.6 } 
                    });
                    l.bindTooltip(n.node_name, { direction: 'center', className: 'id-label', permanent: false });
                    group.addLayer(l);
                } catch(e) {}
            }
        });

        if (group.getLayers().length > 0) {
            currentGeoLayer = group.addTo(map);
            setTimeout(() => {
                map.invalidateSize();
                map.fitBounds(group.getBounds(), { padding: [30, 30], maxZoom: 7 });
            }, 100);
        }
    }
