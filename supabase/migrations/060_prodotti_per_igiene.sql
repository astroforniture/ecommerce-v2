-- Macro-categoria «Prodotti per igiene» + 34 prodotti (codici OD Multimedia)

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
values (
  'Prodotti per igiene',
  'prodotti-per-igiene',
  '/office-products?category=Prodotti%20per%20igiene',
  'https://odmultimedia.eu/immagini/MD/103584.jpg',
  null,
  55,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

with rows(sku, name, brand, price, image_url, description) as (
  values
    (
      '103584',
      'Detergente disinfettante Lysoform Plus - per pavimenti - freschezza alpina - 5 L - Lysoform',
      'Lysoform',
      24.00::numeric,
      'https://odmultimedia.eu/immagini/MD/103584.jpg',
      'Detergente disinfettante Lysoform Plus per pavimenti, freschezza alpina, tanica 5 L.'
    ),
    (
      '93248',
      'Sgrassatore disinfettante Up Side Down - 600 ml - Chanteclair',
      'Chanteclair',
      5.20,
      'https://odmultimedia.eu/immagini/MD/93248.jpg',
      'Sgrassatore disinfettante Chanteclair Up Side Down, flacone 600 ml.'
    ),
    (
      '70970',
      'Panno PVAmicro - azzurro - 35x38 cm - Vileda',
      'Vileda',
      5.00,
      'https://odmultimedia.eu/immagini/MD/70970.jpg',
      'Panno microfibra Vileda PVAmicro azzurro, 35×38 cm.'
    ),
    (
      '105934',
      'Superfici Spray Multiuso battericida e virucida - 750 ml - Amuchina Professional',
      'Amuchina Professional',
      6.20,
      'https://odmultimedia.eu/immagini/MD/105934.jpg',
      'Spray multiuso battericida e virucida Amuchina Professional per superfici, 750 ml.'
    ),
    (
      '61002',
      'Crema Cif classica - sgrassante - 2 L - Cif',
      'Cif',
      20.00,
      'https://odmultimedia.eu/immagini/MD/61002.jpg',
      'Crema sgrassante Cif classica, confezione 2 L.'
    ),
    (
      '105817',
      'Detergente bagno Bio trigger - eucalipto - 750 ml - Alca',
      'Alca',
      7.00,
      'https://odmultimedia.eu/immagini/MD/105817.jpg',
      'Detergente bagno Alca Bio trigger eucalipto, 750 ml.'
    ),
    (
      '91763',
      'Detergente alcalino universale Matic Floor - 5 L - Sanitec',
      'Sanitec',
      36.00,
      'https://odmultimedia.eu/immagini/MD/91763.jpg',
      'Detergente alcalino universale Sanitec Matic Floor, tanica 5 L.'
    ),
    (
      '102066',
      'Carrello per le pulizie Uni-J 4.1 - multifunzione - 12 L - 75 x 60 x 118 cm - Taxon',
      'Taxon',
      295.00,
      'https://odmultimedia.eu/immagini/MD/102066.jpg',
      'Carrello pulizie Taxon Uni-J 4.1 multifunzione, 12 L, 75×60×118 cm.'
    ),
    (
      '98685',
      'Detergente Professional bagno igienizzante H24 - in trigger - 700 ml - Chanteclair',
      'Chanteclair',
      13.00,
      'https://odmultimedia.eu/immagini/MD/98685.jpg',
      'Detergente professionale bagno igienizzante Chanteclair H24, trigger 700 ml.'
    ),
    (
      '76401',
      'Candeggina gel igienizzante - 1500 ml - Amacasa',
      'Amacasa',
      6.00,
      'https://odmultimedia.eu/immagini/MD/76401.jpg',
      'Candeggina gel igienizzante Amacasa, 1500 ml.'
    ),
    (
      '74092',
      'Mop Moccioso - cotone - 240 gr - bianco - Perfetto',
      'Perfetto',
      6.50,
      'https://odmultimedia.eu/immagini/MD/74092.jpg',
      'Mop Moccioso Perfetto in cotone, 240 gr, bianco.'
    ),
    (
      '67538',
      'Candeggina igienizzante - profumo floreale - 1 L - Amacasa',
      'Amacasa',
      2.50,
      'https://odmultimedia.eu/immagini/MD/67538.jpg',
      'Candeggina igienizzante Amacasa profumo floreale, 1 L.'
    ),
    (
      '61000',
      'Detergente per piatti - Scric - tanica da 5 L',
      'Scric',
      17.00,
      'https://odmultimedia.eu/immagini/MD/61000.jpg',
      'Detergente per piatti Scric, tanica 5 L.'
    ),
    (
      '91733',
      'Sgrassatore disinfettante Multi Activ - trigger 750 ml - pino - Sanitec',
      'Sanitec',
      6.00,
      'https://odmultimedia.eu/immagini/MD/91733.jpg',
      'Sgrassatore disinfettante Sanitec Multi Activ pino, trigger 750 ml.'
    ),
    (
      '99945',
      'Smac Express pavimenti - freschezza intensa - 1 L - Smac',
      'Smac',
      4.50,
      'https://odmultimedia.eu/immagini/MD/99945.jpg',
      'Detergente pavimenti Smac Express freschezza intensa, 1 L.'
    ),
    (
      '74085',
      'Retine di ricambio per scopa Pulipolvere - 45x22 cm - giallo - Perfetto - conf. 20 pezzi',
      'Perfetto',
      5.00,
      'https://odmultimedia.eu/immagini/MD/74085.jpg',
      'Retine di ricambio Perfetto per scopa Pulipolvere, 45×22 cm, giallo, conf. 20 pezzi.'
    ),
    (
      '60997',
      'Sgrassatore per pavimenti - limone - Svelto - tanica da 5 L',
      'Svelto',
      20.00,
      'https://odmultimedia.eu/immagini/MD/60997.jpg',
      'Sgrassatore per pavimenti Svelto limone, tanica 5 L.'
    ),
    (
      '105939',
      'Acqua demineralizzata - 2 L - Amacasa',
      'Amacasa',
      2.50,
      'https://odmultimedia.eu/immagini/MD/105939.jpg',
      'Acqua demineralizzata Amacasa, 2 L.'
    ),
    (
      '74090',
      'Frangia di ricambio Penta - cotone - 80 cm - PerfettoFactory',
      'PerfettoFactory',
      17.00,
      'https://odmultimedia.eu/immagini/MD/74090.jpg',
      'Frangia di ricambio Penta PerfettoFactory in cotone, 80 cm.'
    ),
    (
      '96808',
      'Detergente alcalino Matic Extra - per sporco pesante - 5 L - Sanitec',
      'Sanitec',
      50.00,
      'https://odmultimedia.eu/immagini/MD/96808.jpg',
      'Detergente alcalino Sanitec Matic Extra per sporco pesante, tanica 5 L.'
    ),
    (
      '49805',
      'Candeggina Gel Instant White - 700 ml - WC Net',
      'WC Net',
      5.50,
      'https://odmultimedia.eu/immagini/MD/49805.jpg',
      'Candeggina gel WC Net Instant White, 700 ml.'
    ),
    (
      '91814',
      'Spugne accoppiate - rosso - Scotch-Brite - conf.10 pezzi',
      'Scotch-Brite',
      22.00,
      'https://odmultimedia.eu/immagini/MD/91814.jpg',
      'Spugne accoppiate Scotch-Brite rosso, conf. 10 pezzi.'
    ),
    (
      '106019',
      'Igienizzante multiuso senza risciacquo - 750 ml - Amuchina Professional',
      'Amuchina Professional',
      6.50,
      'https://odmultimedia.eu/immagini/MD/106019.jpg',
      'Igienizzante multiuso senza risciacquo Amuchina Professional, 750 ml.'
    ),
    (
      '95921',
      'Disinfettante detergente alcolico - 400 ml - Tekna',
      'Tekna',
      8.50,
      'https://odmultimedia.eu/immagini/MD/95921.jpg',
      'Disinfettante detergente alcolico Tekna, 400 ml.'
    ),
    (
      '105949',
      'Profumatore Deo Spray - per ambienti e tessuti - trigger 300 ml - gold argan - Sanitec',
      'Sanitec',
      7.00,
      'https://odmultimedia.eu/immagini/MD/105949.jpg',
      'Profumatore Sanitec Deo Spray ambienti e tessuti, gold argan, trigger 300 ml.'
    ),
    (
      '49804',
      'Disincrostante disinfettante - 700 ml - WC Net',
      'WC Net',
      5.00,
      'https://odmultimedia.eu/immagini/MD/49804.jpg',
      'Disincrostante disinfettante WC Net, 700 ml.'
    ),
    (
      '96806',
      'Detergente pavimenti Sirpav HC - a schiuma - 5 L - pino - Sanitec',
      'Sanitec',
      36.00,
      'https://odmultimedia.eu/immagini/MD/96806.jpg',
      'Detergente pavimenti Sanitec Sirpav HC a schiuma, pino, tanica 5 L.'
    ),
    (
      '95310',
      'Carrello per pulizie Star 2 - cromato - 48 L - 82 x 71 x 105 cm - Taxon',
      'Taxon',
      320.00,
      'https://odmultimedia.eu/immagini/MD/95310.jpg',
      'Carrello pulizie Taxon Star 2 cromato, 48 L, 82×71×105 cm.'
    ),
    (
      '86246',
      'Detergente disinfettante Bakterio - 1 L - pino balsamico - Sanitec',
      'Sanitec',
      5.20,
      'https://odmultimedia.eu/immagini/MD/86246.jpg',
      'Detergente disinfettante Sanitec Bakterio pino balsamico, 1 L.'
    ),
    (
      '105942',
      'Carrello per le pulizie UniJ-K 3.1 - multifunzione - 74 x 60 x 104 cm - Taxon',
      'Taxon',
      240.00,
      'https://odmultimedia.eu/immagini/MD/105942.jpg',
      'Carrello pulizie Taxon UniJ-K 3.1 multifunzione, 74×60×104 cm.'
    ),
    (
      '74144',
      'Detergente per pavimenti Jolie - floreale/speziato - Alca - flacone da 1 L',
      'Alca',
      7.00,
      'https://odmultimedia.eu/immagini/MD/74144.jpg',
      'Detergente pavimenti Alca Jolie floreale/speziato, flacone 1 L.'
    ),
    (
      '74076',
      'Panno catturapolvere - antistatico - 22x28 cm - bianco - Perfetto - conf. 20 pezzi',
      'Perfetto',
      5.20,
      'https://odmultimedia.eu/immagini/MD/74076.jpg',
      'Panno catturapolvere antistatico Perfetto, 22×28 cm, bianco, conf. 20 pezzi.'
    ),
    (
      '99954',
      'Detersivo lavatrice Deox Colorati e Scuri - 1,5 L - Deox',
      'Deox',
      10.00,
      'https://odmultimedia.eu/immagini/MD/99954.jpg',
      'Detersivo lavatrice Deox Colorati e Scuri, 1,5 L.'
    ),
    (
      '74079',
      'Spugna zincata - 30 gr - metallo zincato - Perfetto - conf. 2 pezzi',
      'Perfetto',
      2.50,
      'https://odmultimedia.eu/immagini/MD/74079.jpg',
      'Spugna zincata Perfetto 30 gr, metallo zincato, conf. 2 pezzi.'
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
    ('103584', 'Detergente disinfettante Lysoform Plus - per pavimenti - freschezza alpina - 5 L - Lysoform', 'Lysoform', 24.00::numeric, 'https://odmultimedia.eu/immagini/MD/103584.jpg', 'Detergente disinfettante Lysoform Plus per pavimenti, freschezza alpina, tanica 5 L.'),
    ('93248', 'Sgrassatore disinfettante Up Side Down - 600 ml - Chanteclair', 'Chanteclair', 5.20, 'https://odmultimedia.eu/immagini/MD/93248.jpg', 'Sgrassatore disinfettante Chanteclair Up Side Down, flacone 600 ml.'),
    ('70970', 'Panno PVAmicro - azzurro - 35x38 cm - Vileda', 'Vileda', 5.00, 'https://odmultimedia.eu/immagini/MD/70970.jpg', 'Panno microfibra Vileda PVAmicro azzurro, 35×38 cm.'),
    ('105934', 'Superfici Spray Multiuso battericida e virucida - 750 ml - Amuchina Professional', 'Amuchina Professional', 6.20, 'https://odmultimedia.eu/immagini/MD/105934.jpg', 'Spray multiuso battericida e virucida Amuchina Professional per superfici, 750 ml.'),
    ('61002', 'Crema Cif classica - sgrassante - 2 L - Cif', 'Cif', 20.00, 'https://odmultimedia.eu/immagini/MD/61002.jpg', 'Crema sgrassante Cif classica, confezione 2 L.'),
    ('105817', 'Detergente bagno Bio trigger - eucalipto - 750 ml - Alca', 'Alca', 7.00, 'https://odmultimedia.eu/immagini/MD/105817.jpg', 'Detergente bagno Alca Bio trigger eucalipto, 750 ml.'),
    ('91763', 'Detergente alcalino universale Matic Floor - 5 L - Sanitec', 'Sanitec', 36.00, 'https://odmultimedia.eu/immagini/MD/91763.jpg', 'Detergente alcalino universale Sanitec Matic Floor, tanica 5 L.'),
    ('102066', 'Carrello per le pulizie Uni-J 4.1 - multifunzione - 12 L - 75 x 60 x 118 cm - Taxon', 'Taxon', 295.00, 'https://odmultimedia.eu/immagini/MD/102066.jpg', 'Carrello pulizie Taxon Uni-J 4.1 multifunzione, 12 L, 75×60×118 cm.'),
    ('98685', 'Detergente Professional bagno igienizzante H24 - in trigger - 700 ml - Chanteclair', 'Chanteclair', 13.00, 'https://odmultimedia.eu/immagini/MD/98685.jpg', 'Detergente professionale bagno igienizzante Chanteclair H24, trigger 700 ml.'),
    ('76401', 'Candeggina gel igienizzante - 1500 ml - Amacasa', 'Amacasa', 6.00, 'https://odmultimedia.eu/immagini/MD/76401.jpg', 'Candeggina gel igienizzante Amacasa, 1500 ml.'),
    ('74092', 'Mop Moccioso - cotone - 240 gr - bianco - Perfetto', 'Perfetto', 6.50, 'https://odmultimedia.eu/immagini/MD/74092.jpg', 'Mop Moccioso Perfetto in cotone, 240 gr, bianco.'),
    ('67538', 'Candeggina igienizzante - profumo floreale - 1 L - Amacasa', 'Amacasa', 2.50, 'https://odmultimedia.eu/immagini/MD/67538.jpg', 'Candeggina igienizzante Amacasa profumo floreale, 1 L.'),
    ('61000', 'Detergente per piatti - Scric - tanica da 5 L', 'Scric', 17.00, 'https://odmultimedia.eu/immagini/MD/61000.jpg', 'Detergente per piatti Scric, tanica 5 L.'),
    ('91733', 'Sgrassatore disinfettante Multi Activ - trigger 750 ml - pino - Sanitec', 'Sanitec', 6.00, 'https://odmultimedia.eu/immagini/MD/91733.jpg', 'Sgrassatore disinfettante Sanitec Multi Activ pino, trigger 750 ml.'),
    ('99945', 'Smac Express pavimenti - freschezza intensa - 1 L - Smac', 'Smac', 4.50, 'https://odmultimedia.eu/immagini/MD/99945.jpg', 'Detergente pavimenti Smac Express freschezza intensa, 1 L.'),
    ('74085', 'Retine di ricambio per scopa Pulipolvere - 45x22 cm - giallo - Perfetto - conf. 20 pezzi', 'Perfetto', 5.00, 'https://odmultimedia.eu/immagini/MD/74085.jpg', 'Retine di ricambio Perfetto per scopa Pulipolvere, 45×22 cm, giallo, conf. 20 pezzi.'),
    ('60997', 'Sgrassatore per pavimenti - limone - Svelto - tanica da 5 L', 'Svelto', 20.00, 'https://odmultimedia.eu/immagini/MD/60997.jpg', 'Sgrassatore per pavimenti Svelto limone, tanica 5 L.'),
    ('105939', 'Acqua demineralizzata - 2 L - Amacasa', 'Amacasa', 2.50, 'https://odmultimedia.eu/immagini/MD/105939.jpg', 'Acqua demineralizzata Amacasa, 2 L.'),
    ('74090', 'Frangia di ricambio Penta - cotone - 80 cm - PerfettoFactory', 'PerfettoFactory', 17.00, 'https://odmultimedia.eu/immagini/MD/74090.jpg', 'Frangia di ricambio Penta PerfettoFactory in cotone, 80 cm.'),
    ('96808', 'Detergente alcalino Matic Extra - per sporco pesante - 5 L - Sanitec', 'Sanitec', 50.00, 'https://odmultimedia.eu/immagini/MD/96808.jpg', 'Detergente alcalino Sanitec Matic Extra per sporco pesante, tanica 5 L.'),
    ('49805', 'Candeggina Gel Instant White - 700 ml - WC Net', 'WC Net', 5.50, 'https://odmultimedia.eu/immagini/MD/49805.jpg', 'Candeggina gel WC Net Instant White, 700 ml.'),
    ('91814', 'Spugne accoppiate - rosso - Scotch-Brite - conf.10 pezzi', 'Scotch-Brite', 22.00, 'https://odmultimedia.eu/immagini/MD/91814.jpg', 'Spugne accoppiate Scotch-Brite rosso, conf. 10 pezzi.'),
    ('106019', 'Igienizzante multiuso senza risciacquo - 750 ml - Amuchina Professional', 'Amuchina Professional', 6.50, 'https://odmultimedia.eu/immagini/MD/106019.jpg', 'Igienizzante multiuso senza risciacquo Amuchina Professional, 750 ml.'),
    ('95921', 'Disinfettante detergente alcolico - 400 ml - Tekna', 'Tekna', 8.50, 'https://odmultimedia.eu/immagini/MD/95921.jpg', 'Disinfettante detergente alcolico Tekna, 400 ml.'),
    ('105949', 'Profumatore Deo Spray - per ambienti e tessuti - trigger 300 ml - gold argan - Sanitec', 'Sanitec', 7.00, 'https://odmultimedia.eu/immagini/MD/105949.jpg', 'Profumatore Sanitec Deo Spray ambienti e tessuti, gold argan, trigger 300 ml.'),
    ('49804', 'Disincrostante disinfettante - 700 ml - WC Net', 'WC Net', 5.00, 'https://odmultimedia.eu/immagini/MD/49804.jpg', 'Disincrostante disinfettante WC Net, 700 ml.'),
    ('96806', 'Detergente pavimenti Sirpav HC - a schiuma - 5 L - pino - Sanitec', 'Sanitec', 36.00, 'https://odmultimedia.eu/immagini/MD/96806.jpg', 'Detergente pavimenti Sanitec Sirpav HC a schiuma, pino, tanica 5 L.'),
    ('95310', 'Carrello per pulizie Star 2 - cromato - 48 L - 82 x 71 x 105 cm - Taxon', 'Taxon', 320.00, 'https://odmultimedia.eu/immagini/MD/95310.jpg', 'Carrello pulizie Taxon Star 2 cromato, 48 L, 82×71×105 cm.'),
    ('86246', 'Detergente disinfettante Bakterio - 1 L - pino balsamico - Sanitec', 'Sanitec', 5.20, 'https://odmultimedia.eu/immagini/MD/86246.jpg', 'Detergente disinfettante Sanitec Bakterio pino balsamico, 1 L.'),
    ('105942', 'Carrello per le pulizie UniJ-K 3.1 - multifunzione - 74 x 60 x 104 cm - Taxon', 'Taxon', 240.00, 'https://odmultimedia.eu/immagini/MD/105942.jpg', 'Carrello pulizie Taxon UniJ-K 3.1 multifunzione, 74×60×104 cm.'),
    ('74144', 'Detergente per pavimenti Jolie - floreale/speziato - Alca - flacone da 1 L', 'Alca', 7.00, 'https://odmultimedia.eu/immagini/MD/74144.jpg', 'Detergente pavimenti Alca Jolie floreale/speziato, flacone 1 L.'),
    ('74076', 'Panno catturapolvere - antistatico - 22x28 cm - bianco - Perfetto - conf. 20 pezzi', 'Perfetto', 5.20, 'https://odmultimedia.eu/immagini/MD/74076.jpg', 'Panno catturapolvere antistatico Perfetto, 22×28 cm, bianco, conf. 20 pezzi.'),
    ('99954', 'Detersivo lavatrice Deox Colorati e Scuri - 1,5 L - Deox', 'Deox', 10.00, 'https://odmultimedia.eu/immagini/MD/99954.jpg', 'Detersivo lavatrice Deox Colorati e Scuri, 1,5 L.'),
    ('74079', 'Spugna zincata - 30 gr - metallo zincato - Perfetto - conf. 2 pezzi', 'Perfetto', 2.50, 'https://odmultimedia.eu/immagini/MD/74079.jpg', 'Spugna zincata Perfetto 30 gr, metallo zincato, conf. 2 pezzi.')
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
