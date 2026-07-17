-- Generato da: node scripts/emit-public-products-sql.mjs
-- Fonte: scripts/legacy-office-catalog.seed.json
--
-- Prodotto "ufficiali" da migration: STL2005 (005), STL7413 (007).
-- Righe DEMO-*: esempi da catalogo di sviluppo (non c'era un array mock nel codice TS).
--
-- Opzionale — copia tutto ciò che hai ancora in office_products:
-- INSERT INTO public.products (id, sku, name, price, image_url)
-- SELECT
--   op.id::text,
--   COALESCE(NULLIF(trim(op.sku), ''), op.id::text),
--   op.name,
--   op.price,
--   NULLIF(trim(op.image_url), '')
-- FROM public.office_products op
-- ON CONFLICT (id) DO UPDATE SET
--   sku = EXCLUDED.sku,
--   name = EXCLUDED.name,
--   price = EXCLUDED.price,
--   image_url = EXCLUDED.image_url;
-- (Adatta i nomi colonna se il tuo schema usa producer_code al posto di sku, ecc.)

INSERT INTO public.products (id, sku, name, price, image_url)
VALUES
  ('STL2005', 'STL2005', 'Carta fotocopie - A3 - 80 gr - 500 fogli - bianca - Starline', 10.55, 'https://odmultimedia.eu/immagini/HD/STL2005.jpg'),
  ('STL7413', 'STL7413', 'Buste forate Starline', NULL, 'https://odmultimedia.eu/immagini/HD/STL7413.jpg'),
  ('DEMO-A4-80', 'DEMO-A4-80', 'Carta A4 80 g/mq — risma 500 fogli (demo catalogo)', 4.9, 'https://images.unsplash.com/photo-1586075010923-2dd45780fb2d?w=600&q=80'),
  ('DEMO-TONER-BW', 'DEMO-TONER-BW', 'Toner compatibile stampante laser monocromatica (demo)', 42, 'https://images.unsplash.com/photo-1612815154858-60aa4c43e64e?w=600&q=80'),
  ('DEMO-NOTE-A4', 'DEMO-NOTE-A4', 'Quaderno a spirale A4 — 80 fogli a righe (demo)', 3.25, 'https://images.unsplash.com/photo-1544716278-ca5e3f16abd8?w=600&q=80'),
  ('DEMO-PEN-BLUE', 'DEMO-PEN-BLUE', 'Penna gel blu — confezione 12 pezzi (demo)', 2.8, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80'),
  ('DEMO-POSTIT', 'DEMO-POSTIT', 'Foglietti adesivi — 76×76 mm, giallo (demo)', 1.95, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80'),
  ('DEMO-RINGBINDER', 'DEMO-RINGBINDER', 'Raccoglitore ad anelli A4 — dorso 4 cm (demo)', 5.4, 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80')
ON CONFLICT (id) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;
