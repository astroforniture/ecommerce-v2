-- Shopper: 2 prodotti base con varianti misura (JSONB), al posto di 9 SKU separati.

delete from public.products
where subcategory in ('Shopper in Plastica', 'Shopper in Carta')
   or sku ilike 'AF-SHOPPER-%';

insert into public.products (
  sku,
  name,
  price,
  image_url,
  brand,
  category,
  subcategory,
  description,
  stock,
  variants
)
values
  (
    'AF-SHOPPER-PLASTICA-MATERBI',
    'Shopper Bio / Plastica Mater-Bi',
    0,
    '/shopper-plastica-cover.jpg',
    'Mater-Bi',
    'Cancelleria',
    'Shopper in Plastica',
    'Sacchetti e shopper compostabili e in plastica per la spesa, ortofrutta e attività commerciali. Materiale Mater-Bi compostabile, colore bianco. Scegli la misura (Mini, Midi o Maxi); ogni confezione è una scatola da 500 pezzi.',
    100,
    '[
      {"label":"Mini - 22 x 40 cm (Scatola 500 pz)","sku":"AF-SHOPPER-PLASTICA-MINI-22X40","packQty":500,"packLabel":"Scatola 500 pz","price":0,"image_url":"/shopper-plastica-cover.jpg"},
      {"label":"Midi - 28 x 50 cm (Scatola 500 pz)","sku":"AF-SHOPPER-PLASTICA-MIDI-28X50","packQty":500,"packLabel":"Scatola 500 pz","price":0,"image_url":"/shopper-plastica-cover.jpg"},
      {"label":"Maxi - 30 x 60 cm (Scatola 500 pz)","sku":"AF-SHOPPER-PLASTICA-MAXI-30X60","packQty":500,"packLabel":"Scatola 500 pz","price":0,"image_url":"/shopper-plastica-cover.jpg"}
    ]'::jsonb
  ),
  (
    'AF-SHOPPER-CARTA-MAINETTI',
    'Shopper in Carta Kraft Bianca - Mainetti Bags',
    0,
    '/shopper-carta-cover.jpg',
    'Mainetti Bags',
    'Cancelleria',
    'Shopper in Carta',
    'Buste e shopper in carta ideali per negozi, boutique e confezioni regalo. Carta kraft bianca con maniglie a cordino. Scegli la misura; la confezione varia in base al formato.',
    100,
    '[
      {"label":"14 x 9 x 21 cm (Conf. 25 pz)","sku":"AF-SHOPPER-CARTA-14X9X21","packQty":25,"packLabel":"Conf. 25 pz","price":0,"image_url":"/shopper-carta-cover.jpg"},
      {"label":"18 x 8 x 24 cm (Conf. 25 pz)","sku":"AF-SHOPPER-CARTA-18X8X24","packQty":25,"packLabel":"Conf. 25 pz","price":0,"image_url":"/shopper-carta-cover.jpg"},
      {"label":"22 x 10 x 29 cm (Conf. 25 pz)","sku":"AF-SHOPPER-CARTA-22X10X29","packQty":25,"packLabel":"Conf. 25 pz","price":0,"image_url":"/shopper-carta-cover.jpg"},
      {"label":"36 x 12 x 41 cm (Conf. 25 pz)","sku":"AF-SHOPPER-CARTA-36X12X41","packQty":25,"packLabel":"Conf. 25 pz","price":0,"image_url":"/shopper-carta-cover.jpg"},
      {"label":"45 x 15 x 50 cm (Conf. 25 pz)","sku":"AF-SHOPPER-CARTA-45X15X50","packQty":25,"packLabel":"Conf. 25 pz","price":0,"image_url":"/shopper-carta-cover.jpg"},
      {"label":"54 x 14 x 45 cm (Conf. 10 pz)","sku":"AF-SHOPPER-CARTA-54X14X45","packQty":10,"packLabel":"Conf. 10 pz","price":0,"image_url":"/shopper-carta-cover.jpg"}
    ]'::jsonb
  )
on conflict (sku) do update set
  name = excluded.name,
  price = excluded.price,
  image_url = excluded.image_url,
  brand = excluded.brand,
  category = excluded.category,
  subcategory = excluded.subcategory,
  description = excluded.description,
  stock = excluded.stock,
  variants = excluded.variants;
