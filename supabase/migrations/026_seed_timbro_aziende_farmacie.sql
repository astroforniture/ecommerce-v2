-- Timbro per Aziende e Farmacie (Cancelleria > Timbri)
-- Idempotente su sku. Esegui anche da: scripts/seed-timbro-aziende-farmacie.sql

insert into public.products (
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
values (
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
on conflict (sku) do update set
  name = excluded.name,
  price = excluded.price,
  image_url = excluded.image_url,
  brand = excluded.brand,
  category = excluded.category,
  subcategory = excluded.subcategory,
  description = excluded.description,
  stock = excluded.stock;
