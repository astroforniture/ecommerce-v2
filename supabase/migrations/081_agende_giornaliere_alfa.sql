-- Agende Giornaliere ALFA (serie misure) — prodotti shop
-- Idempotente: insert se mancano, update listino/categoria se già presenti.

with rows(sku, name, brand, price, image_url, description) as (
  values
    (
      '7123AF',
      'Agenda Giornaliera ALFA - 9x13 cm - Nero',
      'ALFA',
      4.60::numeric,
      'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg',
      'Agenda giornaliera ALFA a blocco fisso. Misura 9x13 cm. Seleziona colore copertina in scheda prodotto.'
    ),
    (
      '7142AF',
      'Agenda Giornaliera ALFA - 12x17 cm - Nero',
      'ALFA',
      5.20::numeric,
      'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg',
      'Agenda giornaliera ALFA a blocco fisso. Misura 12x17 cm. Seleziona colore copertina in scheda prodotto.'
    ),
    (
      '7136AF',
      'Agenda Giornaliera ALFA - 15x21 cm A5 - Nero',
      'ALFA',
      5.20::numeric,
      'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg',
      'Agenda giornaliera ALFA a blocco fisso. Misura 15x21 cm A5. Seleziona colore copertina in scheda prodotto.'
    ),
    (
      '7141AF',
      'Agenda Giornaliera ALFA - 17x24 cm - Nero',
      'ALFA',
      8.60::numeric,
      'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg',
      'Agenda giornaliera ALFA a blocco fisso. Misura 17x24 cm. Seleziona colore copertina in scheda prodotto.'
    ),
    (
      '7145AF',
      'Agenda Giornaliera ALFA - 21x30 cm A4 - Sabato/Domenica Separati - Nero',
      'ALFA',
      14.70::numeric,
      'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg',
      'Agenda giornaliera ALFA a blocco fisso. Misura 21x30 cm A4 con sabato/domenica separati. Seleziona colore copertina in scheda prodotto.'
    )
)
insert into public.products (
  sku, name, price, image_url, brand, category, subcategory, description, stock
)
select
  r.sku,
  r.name,
  r.price,
  r.image_url,
  r.brand,
  'Agende',
  'Agende Giornaliere',
  r.description,
  50
from rows r
where not exists (
  select 1 from public.products p where upper(trim(p.sku)) = upper(trim(r.sku))
);

update public.products p
set
  name = r.name,
  brand = r.brand,
  price = r.price,
  image_url = coalesce(nullif(trim(p.image_url), ''), r.image_url),
  description = r.description,
  category = 'Agende',
  subcategory = 'Agende Giornaliere',
  stock = coalesce(p.stock, 50)
from (
  values
    ('7123AF', 'Agenda Giornaliera ALFA - 9x13 cm - Nero', 'ALFA', 4.60::numeric, 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg', 'Agenda giornaliera ALFA a blocco fisso. Misura 9x13 cm. Seleziona colore copertina in scheda prodotto.'),
    ('7142AF', 'Agenda Giornaliera ALFA - 12x17 cm - Nero', 'ALFA', 5.20::numeric, 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg', 'Agenda giornaliera ALFA a blocco fisso. Misura 12x17 cm. Seleziona colore copertina in scheda prodotto.'),
    ('7136AF', 'Agenda Giornaliera ALFA - 15x21 cm A5 - Nero', 'ALFA', 5.20::numeric, 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg', 'Agenda giornaliera ALFA a blocco fisso. Misura 15x21 cm A5. Seleziona colore copertina in scheda prodotto.'),
    ('7141AF', 'Agenda Giornaliera ALFA - 17x24 cm - Nero', 'ALFA', 8.60::numeric, 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg', 'Agenda giornaliera ALFA a blocco fisso. Misura 17x24 cm. Seleziona colore copertina in scheda prodotto.'),
    ('7145AF', 'Agenda Giornaliera ALFA - 21x30 cm A4 - Sabato/Domenica Separati - Nero', 'ALFA', 14.70::numeric, 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg', 'Agenda giornaliera ALFA a blocco fisso. Misura 21x30 cm A4 con sabato/domenica separati. Seleziona colore copertina in scheda prodotto.')
) as r(sku, name, brand, price, image_url, description)
where upper(trim(p.sku)) = upper(trim(r.sku));
