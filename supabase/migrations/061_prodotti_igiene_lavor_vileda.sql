-- Prodotti per igiene: 3 SKU aggiuntivi (Lavor + Vileda)

with rows(sku, name, brand, price, image_url, description) as (
  values
    (
      '102069',
      'Aspirapolvere e liquidi semiprofessionale WTP 30XE - 1600 W - 30 L - 68 x 34 x 34 cm - Lavor',
      'Lavor',
      290.00::numeric,
      'https://odmultimedia.eu/immagini/MD/102069.jpg',
      'Aspirapolvere e liquidi semiprofessionale Lavor WTP 30XE, 1600 W, 30 L, 68×34×34 cm.'
    ),
    (
      '105442',
      'Aspirapolvere e liquidi Rudy 20S - 1200 W - 20 L - Lavor',
      'Lavor',
      100.00,
      'https://odmultimedia.eu/immagini/MD/105442.jpg',
      'Aspirapolvere e liquidi Lavor Rudy 20S, 1200 W, 20 L.'
    ),
    (
      '91807',
      'Rotolo MicronSolo - bianco - 180 panni - 25 x 32 cm - Vileda',
      'Vileda',
      45.00,
      'https://odmultimedia.eu/immagini/LD/91807.jpg',
      'Rotolo panni Vileda MicronSolo bianco, 180 panni, 25×32 cm.'
    )
)
update public.products as p
set
  name = r.name,
  brand = r.brand,
  price = r.price,
  image_url = r.image_url,
  description = r.description,
  category = 'Prodotti per igiene',
  subcategory = null
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, price, image_url, description) as (
  values
    (
      '102069',
      'Aspirapolvere e liquidi semiprofessionale WTP 30XE - 1600 W - 30 L - 68 x 34 x 34 cm - Lavor',
      'Lavor',
      290.00::numeric,
      'https://odmultimedia.eu/immagini/MD/102069.jpg',
      'Aspirapolvere e liquidi semiprofessionale Lavor WTP 30XE, 1600 W, 30 L, 68×34×34 cm.'
    ),
    (
      '105442',
      'Aspirapolvere e liquidi Rudy 20S - 1200 W - 20 L - Lavor',
      'Lavor',
      100.00,
      'https://odmultimedia.eu/immagini/MD/105442.jpg',
      'Aspirapolvere e liquidi Lavor Rudy 20S, 1200 W, 20 L.'
    ),
    (
      '91807',
      'Rotolo MicronSolo - bianco - 180 panni - 25 x 32 cm - Vileda',
      'Vileda',
      45.00,
      'https://odmultimedia.eu/immagini/LD/91807.jpg',
      'Rotolo panni Vileda MicronSolo bianco, 180 panni, 25×32 cm.'
    )
)
insert into public.products (sku, name, price, image_url, brand, category, description, stock)
select
  r.sku,
  r.name,
  r.price,
  r.image_url,
  r.brand,
  'Prodotti per igiene',
  r.description,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
