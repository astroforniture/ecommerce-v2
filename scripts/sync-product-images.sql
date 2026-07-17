-- Esegui in SQL Editor (Supabase) se preferisci non usare la RPC dall'admin.
-- 1) Copia image_url da office_products quando id/sku coincidono e products.image_url è vuoto.
-- 2) Per i rimanenti con SKU tipo Starline (STL…), usa il pattern OD Multimedia.

-- --- Passo 1: da office_products (tabella legacy) ---
UPDATE public.products p
SET image_url = v.url
FROM (
  SELECT
    op.id::text AS legacy_id,
    nullif(trim(op.image_url), '') AS url
  FROM public.office_products op
) v
WHERE (p.image_url IS NULL OR btrim(p.image_url) = '')
  AND v.url IS NOT NULL
  AND (
    p.id::text = v.legacy_id
    OR (p.sku IS NOT NULL AND btrim(p.sku) = v.legacy_id)
  );

-- --- Passo 2: URL catalogo OD Multimedia HD (come STL2005 / STL7413 nel repo) ---
UPDATE public.products p
SET image_url =
  'https://odmultimedia.eu/immagini/HD/'
  || btrim(p.sku)
  || '.jpg'
WHERE (p.image_url IS NULL OR btrim(p.image_url) = '')
  AND p.sku IS NOT NULL
  AND btrim(p.sku) <> ''
  AND btrim(p.sku) ~ '^STL[0-9]+';
