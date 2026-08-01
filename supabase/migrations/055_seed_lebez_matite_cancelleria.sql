-- Cancelleria → Penne, pennarelli e matite: matite Lebez (4 SKU)
-- Codici produttore dalle schede Lebez (immagini ufficiali).

with rows(sku, name, image_url, description, pack_label) as (
  values
    (
      'AF-LEBEZ-3039',
      'Barattolo matita HB 100 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/3039.jpg',
      'Pratico barattolo trasparente da 100 matite in grafite HB con gommina.',
      '100 pz'
    ),
    (
      'AF-LEBEZ-80328',
      'Barattolo matita HB Neon 36 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/80328.jpg',
      'Barattolo da 36 matite HB in vivaci colori fluorescenti/neon con gommino superiore.',
      '36 pz'
    ),
    (
      'AF-LEBEZ-1303',
      'Matita HB 12 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/1303.jpg',
      'Confezione da 12 matite in grafite gradazione HB con gommina integrata.',
      '12 pz'
    ),
    (
      'AF-LEBEZ-1303B',
      'Matita HB 4 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/1303B.jpg',
      'Blister/Scatola da 4 matite classiche HB con gommina.',
      '4 pz'
    )
)
update public.products as p
set
  name = r.name,
  brand = 'Lebez',
  image_url = r.image_url,
  description = r.description,
  category = 'Cancelleria',
  subcategory = 'Penne, pennarelli e matite',
  format = r.pack_label,
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(sku, name, image_url, description, pack_label) as (
  values
    (
      'AF-LEBEZ-3039',
      'Barattolo matita HB 100 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/3039.jpg',
      'Pratico barattolo trasparente da 100 matite in grafite HB con gommina.',
      '100 pz'
    ),
    (
      'AF-LEBEZ-80328',
      'Barattolo matita HB Neon 36 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/80328.jpg',
      'Barattolo da 36 matite HB in vivaci colori fluorescenti/neon con gommino superiore.',
      '36 pz'
    ),
    (
      'AF-LEBEZ-1303',
      'Matita HB 12 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/1303.jpg',
      'Confezione da 12 matite in grafite gradazione HB con gommina integrata.',
      '12 pz'
    ),
    (
      'AF-LEBEZ-1303B',
      'Matita HB 4 pz - Lebez',
      'https://www.lebez.com/wp-content/uploads/2023/11/1303B.jpg',
      'Blister/Scatola da 4 matite classiche HB con gommina.',
      '4 pz'
    )
)
insert into public.products (
  sku,
  name,
  price,
  image_url,
  brand,
  category,
  subcategory,
  format,
  description,
  stock
)
select
  r.sku,
  r.name,
  0,
  r.image_url,
  'Lebez',
  'Cancelleria',
  'Penne, pennarelli e matite',
  r.pack_label,
  r.description,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
