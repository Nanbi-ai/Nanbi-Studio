-- =======================================================================
-- NANBI V5.0 - STEP 1: MACRO DATABASE REMEDIATION & ONTOLOGY FIX
-- =======================================================================

-- 1. THE ONTOLOGY FIX: Purge the Oceanic Anomaly (Bottom-Up to satisfy Foreign Keys)
-- A. Delete the oceanic 'country' polygons attached to the Seven Seas sub-continents
DELETE FROM regional_hierarchy_nodes 
WHERE parent_id IN (SELECT node_id FROM regional_hierarchy_nodes WHERE parent_id = 'SE');

-- B. Delete the Seven Seas sub-continents
DELETE FROM regional_hierarchy_nodes WHERE parent_id = 'SE';

-- C. Delete the Seven Seas continent itself
DELETE FROM regional_hierarchy_nodes WHERE node_id = 'SE';

-- 2. FIX THE WORLD MAP (Restore Greenland/Canada, keep Antarctica out)
UPDATE regional_hierarchy_nodes 
SET dynamic_config_payload = coalesce(dynamic_config_payload, '{}'::jsonb) || 
'{"viewport_bounds": [[-55.0, -180.0], [90.0, 180.0]]}'::jsonb
WHERE node_id = 'GLOBAL';

-- 3. TIGHTEN CONTINENT VIEWPORT BOUNDS (Stop showing the whole world)
UPDATE regional_hierarchy_nodes 
SET dynamic_config_payload = coalesce(dynamic_config_payload, '{}'::jsonb) || 
'{"viewport_bounds": [[-11.0, 26.0], [82.0, 180.0]], "label_anchor": [34.0, 90.0], "label_color": "#0f172a"}'::jsonb
WHERE node_id = 'AS';

UPDATE regional_hierarchy_nodes 
SET dynamic_config_payload = coalesce(dynamic_config_payload, '{}'::jsonb) || 
'{"viewport_bounds": [[35.0, -11.0], [72.0, 45.0]], "label_anchor": [51.0, 15.0], "label_color": "#0f172a"}'::jsonb
WHERE node_id = 'EU';

UPDATE regional_hierarchy_nodes 
SET dynamic_config_payload = coalesce(dynamic_config_payload, '{}'::jsonb) || 
'{"viewport_bounds": [[10.0, -170.0], [84.0, -50.0]], "label_anchor": [45.0, -100.0], "label_color": "#0f172a"}'::jsonb
WHERE node_id = 'NO';

-- 4. ENFORCE STRICT AFRICA ONTOLOGY & FIX ORPHANS
UPDATE regional_hierarchy_nodes SET node_name = 'Central Africa' WHERE node_id = 'AF-MAF';

UPDATE regional_hierarchy_nodes 
SET parent_id = 'AF-SAF' 
WHERE node_level = 'country' 
AND node_name IN ('South Africa', 'Namibia', 'Botswana', 'Lesotho', 'Eswatini');

-- 5. ENFORCE STRICT OCEANIA ONTOLOGY
UPDATE regional_hierarchy_nodes SET node_name = 'Australasia' WHERE node_id = 'OC-ANZ';

-- 6. ENFORCE STRICT SOUTH AMERICA ONTOLOGY (Building the 4 Pillars)
INSERT INTO regional_hierarchy_nodes (node_id, node_name, node_level, parent_id, official_gov_code)
VALUES 
('SO-AND', 'Andean States', 'sub_continent', 'SO', 'SO-AND'),
('SO-GUI', 'The Guianas', 'sub_continent', 'SO', 'SO-GUI'),
('SO-SOU', 'Southern Cone', 'sub_continent', 'SO', 'SO-SOU'),
('SO-BRA', 'Brazil', 'sub_continent', 'SO', 'SO-BRA')
ON CONFLICT (node_id) DO UPDATE SET node_name = EXCLUDED.node_name;

-- Map the countries precisely to the new pillars
UPDATE regional_hierarchy_nodes SET parent_id = 'SO-AND' WHERE node_name IN ('Colombia', 'Ecuador', 'Peru', 'Bolivia', 'Venezuela');
UPDATE regional_hierarchy_nodes SET parent_id = 'SO-GUI' WHERE node_name IN ('Guyana', 'Suriname', 'French Guiana');
UPDATE regional_hierarchy_nodes SET parent_id = 'SO-SOU' WHERE node_name IN ('Argentina', 'Chile', 'Uruguay', 'Paraguay', 'Falkland Islands');
UPDATE regional_hierarchy_nodes SET parent_id = 'SO-BRA' WHERE node_name IN ('Brazil');

-- Purge the old monolithic UN sub-continent (SO-SAM) if it still exists
DELETE FROM regional_hierarchy_nodes WHERE node_id = 'SO-SAM' AND node_level = 'sub_continent';
