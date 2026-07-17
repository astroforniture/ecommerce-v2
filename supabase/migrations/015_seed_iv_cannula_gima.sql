-- Aghi, cateteri IV e cannule (Linea Specializzata Astro Medical)
-- Rigenerabile con: npm run emit-iv-cannula-sql

INSERT INTO public.products (sku, name, price, image_url, brand, category, description)
VALUES
  ('gima-23662', 'CATETERE IV INTROCAN SAFETY B-BRAUN 18G 45 mm — sterile — GIMA 23662', 193, 'https://www.gimaitaly.com/images/prodotti/medium/23662.jpg', 'B.Braun', 'Linea Specializzata Astro Medical', 'CATETERE IV INTROCAN SAFETY B-BRAUN 18G 45 mm — sterile — GIMA 23662. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23663', 'CATETERE IV INTROCAN SAFETY B-BRAUN 20G 32 mm — sterile — GIMA 23663', 193, 'https://www.gimaitaly.com/images/prodotti/medium/23663.jpg', 'B.Braun', 'Linea Specializzata Astro Medical', 'CATETERE IV INTROCAN SAFETY B-BRAUN 20G 32 mm — sterile — GIMA 23663. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23664', 'CATETERE IV INTROCAN SAFETY B-BRAUN 22G 25 mm — sterile — GIMA 23664', 193, 'https://www.gimaitaly.com/images/prodotti/medium/23664.jpg', 'B.Braun', 'Linea Specializzata Astro Medical', 'CATETERE IV INTROCAN SAFETY B-BRAUN 22G 25 mm — sterile — GIMA 23664. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23705', 'AGHI BD QUINCKE 18G — 1,2×90 mm — rosa — GIMA 23705', 39.9, 'https://www.gimaitaly.com/images/prodotti/medium/23705.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGHI BD QUINCKE 18G — 1,2×90 mm — rosa — GIMA 23705. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23707', 'AGHI BD QUINCKE 20G — 0,9×90 mm — giallo — GIMA 23707', 39.9, 'https://www.gimaitaly.com/images/prodotti/medium/23707.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGHI BD QUINCKE 20G — 0,9×90 mm — giallo — GIMA 23707. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23709', 'AGHI BD QUINCKE 22G — 0,7×90 mm — nero — GIMA 23709', 39.9, 'https://www.gimaitaly.com/images/prodotti/medium/23709.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGHI BD QUINCKE 22G — 0,7×90 mm — nero — GIMA 23709. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23712', 'AGO CANNULA BD VENFLON PRO SAFETY 18G 32 mm — sterile — GIMA 23712', 66.5, 'https://www.gimaitaly.com/images/prodotti/medium/23712.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGO CANNULA BD VENFLON PRO SAFETY 18G 32 mm — sterile — GIMA 23712. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23713', 'AGO CANNULA BD VENFLON PRO SAFETY 20G 32 mm — sterile — GIMA 23713', 66.5, 'https://www.gimaitaly.com/images/prodotti/medium/23713.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGO CANNULA BD VENFLON PRO SAFETY 20G 32 mm — sterile — GIMA 23713. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23714', 'AGO CANNULA BD VENFLON PRO SAFETY 22G 25 mm — sterile — GIMA 23714', 66.5, 'https://www.gimaitaly.com/images/prodotti/medium/23714.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGO CANNULA BD VENFLON PRO SAFETY 22G 25 mm — sterile — GIMA 23714. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23716', 'AGO CANNULA BD VENFLON 20G 32 mm — sterile — GIMA 23716', 33.2, 'https://www.gimaitaly.com/images/prodotti/medium/23716.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGO CANNULA BD VENFLON 20G 32 mm — sterile — GIMA 23716. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23717', 'AGO CANNULA BD VENFLON 22G 25 mm — sterile — GIMA 23717', 33.2, 'https://www.gimaitaly.com/images/prodotti/medium/23717.jpg', 'BD', 'Linea Specializzata Astro Medical', 'AGO CANNULA BD VENFLON 22G 25 mm — sterile — GIMA 23717. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23733', 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 18G 45 mm — sterile — GIMA 23733', 90, 'https://www.gimaitaly.com/images/prodotti/medium/23733.jpg', 'B.Braun', 'Linea Specializzata Astro Medical', 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 18G 45 mm — sterile — GIMA 23733. Prezzo unitario imponibile IVA esclusa.'),
  ('gima-23734', 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 20G 33 mm — sterile — GIMA 23734', 90, 'https://www.gimaitaly.com/images/prodotti/medium/23734.jpg', 'B.Braun', 'Linea Specializzata Astro Medical', 'CATETERE IV VASOFIX SAFETY PUR B-BRAUN 20G 33 mm — sterile — GIMA 23734. Prezzo unitario imponibile IVA esclusa.')
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  description = EXCLUDED.description;
