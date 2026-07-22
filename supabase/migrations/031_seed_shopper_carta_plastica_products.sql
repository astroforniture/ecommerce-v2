-- Catalogo Shopper Cancelleria: pulizia + 3 plastica Mater-Bi + 6 carta Mainetti Bags
-- price = 0 → listino su richiesta (colonna NOT NULL su products).
-- Idempotente su sku.

delete from public.products
where subcategory in ('Shopper in Plastica', 'Shopper in Carta')
   or sku ilike 'AF-SHOPPER-%'
   or name ilike 'Shopper in carta kraft%'
   or name ilike 'Shopper compostabile%'
   or name ilike 'Sacchetto compostabile%';

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
values
  (
    'AF-SHOPPER-PLASTICA-MIDI-28X50',
    'Shoppers Midi - 28 x 50 cm - mater-bi - bianco - scatola 500 pezzi',
    0,
    '/shopper-plastica-cover.jpg',
    'Mater-Bi',
    'Cancelleria',
    'Shopper in Plastica',
    'Shopper compostabile Mater-Bi formato Midi 28 × 50 cm, colore bianco. Confezione: scatola da 500 pezzi. Ideale per spesa e attività commerciali. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-PLASTICA-MINI-22X40',
    'Shoppers Mini - 22 x 40 cm - mater-bi - bianco - scatola 500 pezzi',
    0,
    '/shopper-plastica-cover.jpg',
    'Mater-Bi',
    'Cancelleria',
    'Shopper in Plastica',
    'Shopper compostabile Mater-Bi formato Mini 22 × 40 cm, colore bianco. Confezione: scatola da 500 pezzi. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-PLASTICA-MAXI-30X60',
    'Shoppers Maxi - 30 x 60 cm - mater-bi - bianco - scatola 500 pezzi',
    0,
    '/shopper-plastica-cover.jpg',
    'Mater-Bi',
    'Cancelleria',
    'Shopper in Plastica',
    'Shopper compostabile Mater-Bi formato Maxi 30 × 60 cm, colore bianco. Confezione: scatola da 500 pezzi. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-CARTA-14X9X21',
    'Shopper - maniglie cordino - 14 x 9 x 21 cm - carta kraft - bianco - Mainetti Bags - conf. 25 pezzi',
    0,
    '/shopper-carta-cover.jpg',
    'Mainetti Bags',
    'Cancelleria',
    'Shopper in Carta',
    'Shopper in carta kraft bianco con maniglie a cordino. Dimensioni 14 × 9 × 21 cm. Confezione da 25 pezzi. Ideale per boutique e confezioni regalo. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-CARTA-54X14X45',
    'Shopper - maniglie cordino - 54 x 14 x 45 cm - carta kraft - bianco - Mainetti Bags - conf. 10 pezzi',
    0,
    '/shopper-carta-cover.jpg',
    'Mainetti Bags',
    'Cancelleria',
    'Shopper in Carta',
    'Shopper in carta kraft bianco con maniglie a cordino. Dimensioni 54 × 14 × 45 cm. Confezione da 10 pezzi. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-CARTA-18X8X24',
    'Shopper - maniglie cordino - 18 x 8 x 24 cm - carta kraft - bianco - Mainetti Bags - conf. 25 pezzi',
    0,
    '/shopper-carta-cover.jpg',
    'Mainetti Bags',
    'Cancelleria',
    'Shopper in Carta',
    'Shopper in carta kraft bianco con maniglie a cordino. Dimensioni 18 × 8 × 24 cm. Confezione da 25 pezzi. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-CARTA-45X15X50',
    'Shopper - maniglie cordino - 45 x 15 x 50 cm - carta kraft - bianco - Mainetti Bags - conf. 25 pezzi',
    0,
    '/shopper-carta-cover.jpg',
    'Mainetti Bags',
    'Cancelleria',
    'Shopper in Carta',
    'Shopper in carta kraft bianco con maniglie a cordino. Dimensioni 45 × 15 × 50 cm. Confezione da 25 pezzi. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-CARTA-36X12X41',
    'Shopper - maniglie cordino - 36 x 12 x 41 cm - carta kraft - bianco - Mainetti Bags - conf. 25 pezzi',
    0,
    '/shopper-carta-cover.jpg',
    'Mainetti Bags',
    'Cancelleria',
    'Shopper in Carta',
    'Shopper in carta kraft bianco con maniglie a cordino. Dimensioni 36 × 12 × 41 cm. Confezione da 25 pezzi. Prezzo su preventivo.',
    100
  ),
  (
    'AF-SHOPPER-CARTA-22X10X29',
    'Shopper - maniglie cordino - 22 x 10 x 29 cm - carta kraft - bianco - Mainetti Bags - conf. 25 pezzi',
    0,
    '/shopper-carta-cover.jpg',
    'Mainetti Bags',
    'Cancelleria',
    'Shopper in Carta',
    'Shopper in carta kraft bianco con maniglie a cordino. Dimensioni 22 × 10 × 29 cm. Confezione da 25 pezzi. Prezzo su preventivo.',
    100
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
