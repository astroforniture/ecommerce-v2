-- Cancelleria → Calcolatrici (+ 13 prodotti catalogo)

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Calcolatrici',
  'calcolatrici',
  '/office-products?category=Cancelleria&cancelleriaView=calcolatrici',
  'https://odmultimedia.eu/immagini/HD/81499.jpg',
  parent.id,
  55,
  true
from public.office_catalog_categories as parent
where parent.slug = 'cancelleria'
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

with rows(sku, name, brand, image_url, description) as (
  values
    (
      'AF-CALC-81499',
      'Calcolatrice grafica FX CG50 - Casio',
      'Casio',
      'https://odmultimedia.eu/immagini/HD/81499.jpg',
      'Calcolatrice grafica Casio FX CG50.'
    ),
    (
      'AF-CALC-CANMP1211LTSC',
      'Canon - Calcolatrice - scrivente - MP-1211 LTSC',
      'Canon',
      'https://odmultimedia.eu/immagini/MD/CANMP1211LTSC.jpg',
      'Calcolatrice scrivente Canon MP-1211 LTSC.'
    ),
    (
      'AF-CALC-CANP1DTSC',
      'Canon - Calcolatrice scrivente P1-DTSC - Grigio - 2304C001',
      'Canon',
      'https://odmultimedia.eu/immagini/MD/CANP1STSC.jpg',
      'Calcolatrice scrivente Canon P1-DTSC, grigio (2304C001).'
    ),
    (
      'AF-CALC-OLIB4646',
      'Olivetti - Calcolatrice scrivente - da tavolo - SUMMA 303',
      'Olivetti',
      'https://odmultimedia.eu/immagini/MD/OLIB4646.jpg',
      'Calcolatrice scrivente da tavolo Olivetti SUMMA 303.'
    ),
    (
      'AF-CALC-OLIB5896',
      'Olivetti - Calcolatrice scrivente - da tavolo - LOGOS 904T',
      'Olivetti',
      'https://odmultimedia.eu/immagini/MD/OLIB5896.jpg',
      'Calcolatrice scrivente da tavolo Olivetti LOGOS 904T.'
    ),
    (
      'AF-CALC-SHAEL1901',
      'Calcolatrice da tavolo EL 1901 - 12 cifre - display LCD a 5 righe - Sharp - EL1901',
      'Sharp',
      'https://odmultimedia.eu/immagini/MD/SHAEL1901.jpg',
      'Calcolatrice da tavolo Sharp EL 1901, 12 cifre, display LCD a 5 righe.'
    ),
    (
      'AF-CALC-80344',
      'Calcolatrice scrivente HR-8RCE - 12 cifre - 8,2 x 10,2 x 23,9 cm - nero - Casio',
      'Casio',
      'https://odmultimedia.eu/immagini/MD/80344.jpg',
      'Calcolatrice scrivente Casio HR-8RCE, 12 cifre, nero.'
    ),
    (
      'AF-CALC-CANAS8HB',
      'Canon - Calcolatrice tascabile - AS8HB',
      'Canon',
      'https://odmultimedia.eu/immagini/MD/CANAS8HB.jpg',
      'Calcolatrice tascabile Canon AS8HB.'
    ),
    (
      'AF-CALC-SHAEL233SB',
      'Sharp - Calcolatrice tascabile - EL233SB',
      'Sharp',
      'https://odmultimedia.eu/immagini/MD/SHAEL233SB.jpg',
      'Calcolatrice tascabile Sharp EL233SB.'
    ),
    (
      'AF-CALC-SHAEL379SB',
      'Sharp - Calcolatrice tascabile - EL379SB',
      'Sharp',
      'https://odmultimedia.eu/immagini/MD/SHAEL379SB.jpg',
      'Calcolatrice tascabile Sharp EL379SB.'
    ),
    (
      'AF-CALC-LBZ-81914',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez (81914)',
      'Lebez',
      'https://www.lebez.com/wp-content/uploads/2024/07/81914_1.jpg',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez.'
    ),
    (
      'AF-CALC-LBZ-81913',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez (81913)',
      'Lebez',
      'https://www.lebez.com/wp-content/uploads/2024/07/81913_1.jpg',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez.'
    ),
    (
      'AF-CALC-LBZ-81917',
      'Calcolatrice scientifica 10+2 cifre - Lebez',
      'Lebez',
      'https://www.lebez.com/wp-content/uploads/2024/07/81917_1.jpg',
      'Calcolatrice scientifica 10+2 cifre - Lebez.'
    )
)
update public.products as p
set
  name = r.name,
  brand = r.brand,
  image_url = r.image_url,
  description = r.description,
  category = 'Cancelleria',
  subcategory = 'Calcolatrici',
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, image_url, description) as (
  values
    (
      'AF-CALC-81499',
      'Calcolatrice grafica FX CG50 - Casio',
      'Casio',
      'https://odmultimedia.eu/immagini/HD/81499.jpg',
      'Calcolatrice grafica Casio FX CG50.'
    ),
    (
      'AF-CALC-CANMP1211LTSC',
      'Canon - Calcolatrice - scrivente - MP-1211 LTSC',
      'Canon',
      'https://odmultimedia.eu/immagini/MD/CANMP1211LTSC.jpg',
      'Calcolatrice scrivente Canon MP-1211 LTSC.'
    ),
    (
      'AF-CALC-CANP1DTSC',
      'Canon - Calcolatrice scrivente P1-DTSC - Grigio - 2304C001',
      'Canon',
      'https://odmultimedia.eu/immagini/MD/CANP1STSC.jpg',
      'Calcolatrice scrivente Canon P1-DTSC, grigio (2304C001).'
    ),
    (
      'AF-CALC-OLIB4646',
      'Olivetti - Calcolatrice scrivente - da tavolo - SUMMA 303',
      'Olivetti',
      'https://odmultimedia.eu/immagini/MD/OLIB4646.jpg',
      'Calcolatrice scrivente da tavolo Olivetti SUMMA 303.'
    ),
    (
      'AF-CALC-OLIB5896',
      'Olivetti - Calcolatrice scrivente - da tavolo - LOGOS 904T',
      'Olivetti',
      'https://odmultimedia.eu/immagini/MD/OLIB5896.jpg',
      'Calcolatrice scrivente da tavolo Olivetti LOGOS 904T.'
    ),
    (
      'AF-CALC-SHAEL1901',
      'Calcolatrice da tavolo EL 1901 - 12 cifre - display LCD a 5 righe - Sharp - EL1901',
      'Sharp',
      'https://odmultimedia.eu/immagini/MD/SHAEL1901.jpg',
      'Calcolatrice da tavolo Sharp EL 1901, 12 cifre, display LCD a 5 righe.'
    ),
    (
      'AF-CALC-80344',
      'Calcolatrice scrivente HR-8RCE - 12 cifre - 8,2 x 10,2 x 23,9 cm - nero - Casio',
      'Casio',
      'https://odmultimedia.eu/immagini/MD/80344.jpg',
      'Calcolatrice scrivente Casio HR-8RCE, 12 cifre, nero.'
    ),
    (
      'AF-CALC-CANAS8HB',
      'Canon - Calcolatrice tascabile - AS8HB',
      'Canon',
      'https://odmultimedia.eu/immagini/MD/CANAS8HB.jpg',
      'Calcolatrice tascabile Canon AS8HB.'
    ),
    (
      'AF-CALC-SHAEL233SB',
      'Sharp - Calcolatrice tascabile - EL233SB',
      'Sharp',
      'https://odmultimedia.eu/immagini/MD/SHAEL233SB.jpg',
      'Calcolatrice tascabile Sharp EL233SB.'
    ),
    (
      'AF-CALC-SHAEL379SB',
      'Sharp - Calcolatrice tascabile - EL379SB',
      'Sharp',
      'https://odmultimedia.eu/immagini/MD/SHAEL379SB.jpg',
      'Calcolatrice tascabile Sharp EL379SB.'
    ),
    (
      'AF-CALC-LBZ-81914',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez (81914)',
      'Lebez',
      'https://www.lebez.com/wp-content/uploads/2024/07/81914_1.jpg',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez.'
    ),
    (
      'AF-CALC-LBZ-81913',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez (81913)',
      'Lebez',
      'https://www.lebez.com/wp-content/uploads/2024/07/81913_1.jpg',
      'Calcolatrice da tavolo MAXI a 12 cifre - Lebez.'
    ),
    (
      'AF-CALC-LBZ-81917',
      'Calcolatrice scientifica 10+2 cifre - Lebez',
      'Lebez',
      'https://www.lebez.com/wp-content/uploads/2024/07/81917_1.jpg',
      'Calcolatrice scientifica 10+2 cifre - Lebez.'
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
  'Calcolatrici',
  r.description,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
