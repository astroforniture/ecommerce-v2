-- Seed / upsert Modulistica Edipro (categorie + articoli SKU/EAN).
-- Preferisci: select public.upsert_modulistica_edipro_catalog();
-- oppure applica la migration 036.
-- CSV: scripts/modulistica-edipro.csv

select public.upsert_modulistica_edipro_catalog();
