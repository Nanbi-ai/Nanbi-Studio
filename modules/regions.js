setTimeout(() => {
                map.invalidateSize(true);
                if (polygonLayerGroup.getLayers().length > 0) {
                    polygonLayerGroup.addTo(map); 
                    
                    const mapDom = container.querySelector('#map-wrapper');
                    const padX = Math.floor(mapDom.clientWidth * 0.1);
                    const padY = Math.floor(mapDom.clientHeight * 0.1);
                    
                    let targetBounds;
                    if (nodeId === 'GLOBAL') {
                        targetBounds = window.L.latLngBounds([[-55, -130], [75, 160]]);
                    } else if (strictBounds[nodeId]) {
                        targetBounds = window.L.latLngBounds(strictBounds[nodeId][0], strictBounds[nodeId][1]);
                    } else {
                        targetBounds = polygonLayerGroup.getBounds();
                    }
                    
                    map.fitBounds(targetBounds, { padding: [padX, padY], animate: false });
                }
            }, 50);
