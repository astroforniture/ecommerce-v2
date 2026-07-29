-- Carta → sottocategoria Carta Termica + 9 rotoli (codici OD Multimedia)

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
values (
  'Carta',
  'carta',
  '/office-products?category=Carta',
  '/carta-risme-evidenza.png',
  null,
  40,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Carta Termica',
  'carta-termica',
  '/office-products?category=Carta&subcategory=Carta%20Termica',
  '/images/carta-termica-100072.jpg',
  parent.id,
  30,
  true
from public.office_catalog_categories as parent
where parent.slug = 'carta'
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

-- Upsert prodotti
with rows(sku, name, brand, format, image_url, description) as (
  values
    (
      '100072',
      'Rotolo per POS e carta di credito - 57 mm x 20 m - 55 gr - diametro esterno 40 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi',
      'Sabacart',
      '57 mm x 20 m',
      '/images/carta-termica-100072.jpg',
      'Rotolo carta termica BPA free Sabacart per POS e carta di credito, 57 mm × 20 m, 55 gr, diametro esterno 40 mm, anima 12 mm. Blister da 10 pezzi.'
    ),
    (
      '100149',
      'Rotolo per POS e carta di credito - 57 mm x 30 m - 55 gr - diametro esterno 50 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi',
      'Sabacart',
      '57 mm x 30 m',
      '/images/carta-termica-100149.jpg',
      'Rotolo carta termica BPA free Sabacart per POS e carta di credito, 57 mm × 30 m, 55 gr, diametro esterno 50 mm, anima 12 mm. Blister da 10 pezzi.'
    ),
    (
      '93453',
      'Rotolo per POS e carta di credito - 57 mm x 7 m - 55 gr - diametro esterno 25 mm - senza anima - carta termica BPA free - Rotolificio Pugliese - blister 3 pezzi',
      'Rotolificio Pugliese',
      '57 mm x 7 m',
      '/images/carta-termica-93453.jpg',
      'Rotolo carta termica BPA free Rotolificio Pugliese per POS e carta di credito, 57 mm × 7 m, 55 gr, diametro esterno 25 mm, senza anima. Blister da 3 pezzi.'
    ),
    (
      '93454',
      'Rotolo registratore di cassa - omologato - 79 mm x 80 m - 55 gr - diametro esterno 77 mm - anima 12 mm - carta termica BPA free - Rotolificio Pugliese - blister 10 pezzi',
      'Rotolificio Pugliese',
      '79 mm x 80 m',
      '/images/carta-termica-93454.jpg',
      'Rotolo carta termica BPA free omologato Rotolificio Pugliese per registratore di cassa, 79 mm × 80 m, 55 gr, diametro esterno 77 mm, anima 12 mm. Blister da 10 pezzi.'
    ),
    (
      '104279',
      'Rotolo per registratori di cassa - carta termica BPA free - 79 mm x 60 mt - 48 gr - diametro esterno 64 mm - anima 12 mm - Rotolificio Pugliese - blister 10 pezzi',
      'Rotolificio Pugliese',
      '79 mm x 60 m',
      '/images/carta-termica-104279.jpg',
      'Rotolo carta termica BPA free Rotolificio Pugliese per registratori di cassa, 79 mm × 60 m, 48 gr, diametro esterno 64 mm, anima 12 mm. Blister da 10 pezzi.'
    ),
    (
      '100195',
      'Rotolo per distributore self service - 57 mm x 85 m - 70 gr - diametro esterno 87 mm - anima 12 mm - carta termica BPA free - Sabacart',
      'Sabacart',
      '57 mm x 85 m',
      '/images/carta-termica-100195.jpg',
      'Rotolo carta termica BPA free Sabacart per distributore self service, 57 mm × 85 m, 70 gr, diametro esterno 87 mm, anima 12 mm.'
    ),
    (
      '100332',
      'Rotolo per bilancia - 62,5 mm x 30 m - 55 gr - diametro esterno 50 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi',
      'Sabacart',
      '62,5 mm x 30 m',
      '/images/carta-termica-100332.jpg',
      'Rotolo carta termica BPA free Sabacart per bilancia, 62,5 mm × 30 m, 55 gr, diametro esterno 50 mm, anima 12 mm. Blister da 10 pezzi.'
    ),
    (
      '100335',
      'Rotolo per bilancia - 57 mm x 38 m - 112 gr - diametro esterno 82 mm - anima 25 mm - carta termica adesiva BPA free - Sabacart - blister 4 pezzi',
      'Sabacart',
      '57 mm x 38 m',
      '/images/carta-termica-100335.jpg',
      'Rotolo carta termica adesiva BPA free Sabacart per bilancia, 57 mm × 38 m, 112 gr, diametro esterno 82 mm, anima 25 mm. Blister da 4 pezzi.'
    ),
    (
      '100337',
      'Rotolo per bilancia - 62,5 mm x 38 m - 112 gr - diametro esterno 82 mm - anima 25 mm - carta termica adesiva BPA free - Sabacart - blister 4 pezzi',
      'Sabacart',
      '62,5 mm x 38 m',
      '/images/carta-termica-100337.jpg',
      'Rotolo carta termica adesiva BPA free Sabacart per bilancia, 62,5 mm × 38 m, 112 gr, diametro esterno 82 mm, anima 25 mm. Blister da 4 pezzi.'
    )
)
update public.products as p
set
  name = r.name,
  brand = r.brand,
  format = r.format,
  image_url = r.image_url,
  description = r.description,
  category = 'Carta',
  subcategory = 'Carta Termica',
  price = coalesce(p.price, 0)
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, format, image_url, description) as (
  values
    ('100072', 'Rotolo per POS e carta di credito - 57 mm x 20 m - 55 gr - diametro esterno 40 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi', 'Sabacart', '57 mm x 20 m', '/images/carta-termica-100072.jpg', 'Rotolo carta termica BPA free Sabacart per POS e carta di credito, 57 mm × 20 m, 55 gr, diametro esterno 40 mm, anima 12 mm. Blister da 10 pezzi.'),
    ('100149', 'Rotolo per POS e carta di credito - 57 mm x 30 m - 55 gr - diametro esterno 50 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi', 'Sabacart', '57 mm x 30 m', '/images/carta-termica-100149.jpg', 'Rotolo carta termica BPA free Sabacart per POS e carta di credito, 57 mm × 30 m, 55 gr, diametro esterno 50 mm, anima 12 mm. Blister da 10 pezzi.'),
    ('93453', 'Rotolo per POS e carta di credito - 57 mm x 7 m - 55 gr - diametro esterno 25 mm - senza anima - carta termica BPA free - Rotolificio Pugliese - blister 3 pezzi', 'Rotolificio Pugliese', '57 mm x 7 m', '/images/carta-termica-93453.jpg', 'Rotolo carta termica BPA free Rotolificio Pugliese per POS e carta di credito, 57 mm × 7 m, 55 gr, diametro esterno 25 mm, senza anima. Blister da 3 pezzi.'),
    ('93454', 'Rotolo registratore di cassa - omologato - 79 mm x 80 m - 55 gr - diametro esterno 77 mm - anima 12 mm - carta termica BPA free - Rotolificio Pugliese - blister 10 pezzi', 'Rotolificio Pugliese', '79 mm x 80 m', '/images/carta-termica-93454.jpg', 'Rotolo carta termica BPA free omologato Rotolificio Pugliese per registratore di cassa, 79 mm × 80 m, 55 gr, diametro esterno 77 mm, anima 12 mm. Blister da 10 pezzi.'),
    ('104279', 'Rotolo per registratori di cassa - carta termica BPA free - 79 mm x 60 mt - 48 gr - diametro esterno 64 mm - anima 12 mm - Rotolificio Pugliese - blister 10 pezzi', 'Rotolificio Pugliese', '79 mm x 60 m', '/images/carta-termica-104279.jpg', 'Rotolo carta termica BPA free Rotolificio Pugliese per registratori di cassa, 79 mm × 60 m, 48 gr, diametro esterno 64 mm, anima 12 mm. Blister da 10 pezzi.'),
    ('100195', 'Rotolo per distributore self service - 57 mm x 85 m - 70 gr - diametro esterno 87 mm - anima 12 mm - carta termica BPA free - Sabacart', 'Sabacart', '57 mm x 85 m', '/images/carta-termica-100195.jpg', 'Rotolo carta termica BPA free Sabacart per distributore self service, 57 mm × 85 m, 70 gr, diametro esterno 87 mm, anima 12 mm.'),
    ('100332', 'Rotolo per bilancia - 62,5 mm x 30 m - 55 gr - diametro esterno 50 mm - anima 12 mm - carta termica BPA free - Sabacart - blister 10 pezzi', 'Sabacart', '62,5 mm x 30 m', '/images/carta-termica-100332.jpg', 'Rotolo carta termica BPA free Sabacart per bilancia, 62,5 mm × 30 m, 55 gr, diametro esterno 50 mm, anima 12 mm. Blister da 10 pezzi.'),
    ('100335', 'Rotolo per bilancia - 57 mm x 38 m - 112 gr - diametro esterno 82 mm - anima 25 mm - carta termica adesiva BPA free - Sabacart - blister 4 pezzi', 'Sabacart', '57 mm x 38 m', '/images/carta-termica-100335.jpg', 'Rotolo carta termica adesiva BPA free Sabacart per bilancia, 57 mm × 38 m, 112 gr, diametro esterno 82 mm, anima 25 mm. Blister da 4 pezzi.'),
    ('100337', 'Rotolo per bilancia - 62,5 mm x 38 m - 112 gr - diametro esterno 82 mm - anima 25 mm - carta termica adesiva BPA free - Sabacart - blister 4 pezzi', 'Sabacart', '62,5 mm x 38 m', '/images/carta-termica-100337.jpg', 'Rotolo carta termica adesiva BPA free Sabacart per bilancia, 62,5 mm × 38 m, 112 gr, diametro esterno 82 mm, anima 25 mm. Blister da 4 pezzi.')
)
insert into public.products (sku, name, price, image_url, brand, category, subcategory, format, description, stock)
select
  r.sku,
  r.name,
  0,
  r.image_url,
  r.brand,
  'Carta',
  'Carta Termica',
  r.format,
  r.description,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
