-- Timbro per Aziende e Farmacie — Cancelleria / Timbri
-- Hub card: /office-products?category=Cancelleria&cancelleriaView=timbri
-- Idempotente su sku.

INSERT INTO public.products (
  sku,
  name,
  price,
  image_url,
  brand,
  category,
  subcategory,
  description,
  stock
)
VALUES (
  'AF-TIMBRO-AZIENDE',
  'Timbro per Aziende e Farmacie',
  12.90,
  '/timbri.jpg',
  'TRODAT / COLOP',
  'Cancelleria',
  'Timbri',
  'Timbro autoinchiostrante professionale ideale per aziende, professionisti, farmacie e studi medici. Personalizzabile con ragione sociale, P.IVA e dati aziendali.',
  50
)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  stock = EXCLUDED.stock;
