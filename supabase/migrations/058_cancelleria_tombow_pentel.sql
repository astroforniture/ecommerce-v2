-- Cancelleria: correttori Tombow + penne roller Pentel Floatune

with rows(sku, name, brand, image_url, description, subcategory) as (
  values
    (
      'AF-TOMB-60484',
      'Correttore a nastro - 4,2mm x 16mt - ricaricabile - Tombow',
      'Tombow',
      'https://odmultimedia.eu/immagini/MD/60484.jpg',
      'Correttore a nastro Tombow 4,2 mm × 16 m, ricaricabile.',
      'Correttori'
    ),
    (
      'AF-TOMB-29072',
      'Correttore a nastro Mono Correction - 4,2 mm x 10 mt - Tombow',
      'Tombow',
      'https://odmultimedia.eu/immagini/MD/29072.jpg',
      'Correttore a nastro Tombow Mono Correction 4,2 mm × 10 m.',
      'Correttori'
    ),
    (
      'AF-PENT-105424',
      'Penna roller Floatune - punta 1,0 mm - nero - Pentel',
      'Pentel',
      'https://odmultimedia.eu/immagini/MD/105424.jpg',
      'Penna roller Pentel Floatune, punta 1,0 mm, inchiostro nero.',
      'Penne, pennarelli e matite'
    ),
    (
      'AF-PENT-105426',
      'Penna roller Floatune - punta 1,0 mm - blu - Pentel',
      'Pentel',
      'https://odmultimedia.eu/immagini/MD/105426.jpg',
      'Penna roller Pentel Floatune, punta 1,0 mm, inchiostro blu.',
      'Penne, pennarelli e matite'
    ),
    (
      'AF-PENT-105425',
      'Penna roller Floatune - punta 1,0 mm - rosso - Pentel',
      'Pentel',
      'https://odmultimedia.eu/immagini/MD/105425.jpg',
      'Penna roller Pentel Floatune, punta 1,0 mm, inchiostro rosso.',
      'Penne, pennarelli e matite'
    )
)
update public.products as p
set
  name = r.name,
  brand = r.brand,
  image_url = r.image_url,
  description = r.description,
  category = 'Cancelleria',
  subcategory = r.subcategory,
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, image_url, description, subcategory) as (
  values
    (
      'AF-TOMB-60484',
      'Correttore a nastro - 4,2mm x 16mt - ricaricabile - Tombow',
      'Tombow',
      'https://odmultimedia.eu/immagini/MD/60484.jpg',
      'Correttore a nastro Tombow 4,2 mm × 16 m, ricaricabile.',
      'Correttori'
    ),
    (
      'AF-TOMB-29072',
      'Correttore a nastro Mono Correction - 4,2 mm x 10 mt - Tombow',
      'Tombow',
      'https://odmultimedia.eu/immagini/MD/29072.jpg',
      'Correttore a nastro Tombow Mono Correction 4,2 mm × 10 m.',
      'Correttori'
    ),
    (
      'AF-PENT-105424',
      'Penna roller Floatune - punta 1,0 mm - nero - Pentel',
      'Pentel',
      'https://odmultimedia.eu/immagini/MD/105424.jpg',
      'Penna roller Pentel Floatune, punta 1,0 mm, inchiostro nero.',
      'Penne, pennarelli e matite'
    ),
    (
      'AF-PENT-105426',
      'Penna roller Floatune - punta 1,0 mm - blu - Pentel',
      'Pentel',
      'https://odmultimedia.eu/immagini/MD/105426.jpg',
      'Penna roller Pentel Floatune, punta 1,0 mm, inchiostro blu.',
      'Penne, pennarelli e matite'
    ),
    (
      'AF-PENT-105425',
      'Penna roller Floatune - punta 1,0 mm - rosso - Pentel',
      'Pentel',
      'https://odmultimedia.eu/immagini/MD/105425.jpg',
      'Penna roller Pentel Floatune, punta 1,0 mm, inchiostro rosso.',
      'Penne, pennarelli e matite'
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
  description,
  stock
)
select
  r.sku,
  r.name,
  0,
  r.image_url,
  r.brand,
  'Cancelleria',
  r.subcategory,
  r.description,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
