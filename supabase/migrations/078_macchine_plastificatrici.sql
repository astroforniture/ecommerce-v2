-- Macchine per Ufficio → Plastificatrici e Materiale (pouches + plastificatrici)

with parent as (
  select id from public.office_catalog_categories where slug in ('macchine-per-ufficio', 'macchine-ufficio')
  order by case when slug = 'macchine-per-ufficio' then 0 else 1 end
  limit 1
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Plastificatrici e Materiale',
  'macchine-plastificatrici-e-materiale',
  '/prodotti/macchine-per-ufficio/plastificatrici-e-materiale',
  'https://odmultimedia.eu/immagini/MD/80357.jpg',
  parent.id,
  50,
  true
from parent
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Plastificatrici e Materiale',
  'macchine-plastificatrici-e-materiale',
  '/prodotti/macchine-per-ufficio/plastificatrici-e-materiale',
  'https://odmultimedia.eu/immagini/MD/80357.jpg',
  null,
  50,
  true
where not exists (
  select 1 from public.office_catalog_categories where slug = 'macchine-plastificatrici-e-materiale'
);

create temporary table tmp_plastificatrici (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  format text,
  description text not null
) on commit drop;

insert into tmp_plastificatrici (sku, name, brand, price, image_url, format, description)
values
  (
    '68540',
    'Pouches A7 - Titanium (Conf. 100 pezzi)',
    'Titanium',
    3.00,
    'https://odmultimedia.eu/immagini/MD/68540.jpg',
    'A7 (80×111 mm)',
    $d$Pouches per plastificazione formato A7 (80×111 mm), spessore 2×125 micron (pesante). Confezione da 100 pezzi Titanium, ideale per badge, tessere e documenti di piccolo formato.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A7 (80×111 mm); Spessore 2×125 micron (Pesante); Confezione 100 pezzi.$d$
  ),
  (
    '68539',
    'Pouches A6 - Titanium (Conf. 100 pezzi)',
    'Titanium',
    6.00,
    'https://odmultimedia.eu/immagini/MD/68539.jpg',
    'A6 (111×154 mm)',
    $d$Pouches per plastificazione formato A6 (111×154 mm), spessore 2×125 micron (pesante). Confezione da 100 pezzi Titanium per foto, cartoncini e documenti tascabili.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A6 (111×154 mm); Spessore 2×125 micron (Pesante); Confezione 100 pezzi.$d$
  ),
  (
    '68555',
    'Pouches A5 Leggere - Titanium (Conf. 100 pezzi)',
    'Titanium',
    6.50,
    'https://odmultimedia.eu/immagini/MD/68555.jpg',
    'A5 (154×216 mm)',
    $d$Pouches A5 leggere (154×216 mm), spessore 2×80 micron. Confezione da 100 pezzi Titanium per plastificazione quotidiana di documenti e fogli A5.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A5 (154×216 mm); Spessore 2×80 micron (Leggero); Confezione 100 pezzi.$d$
  ),
  (
    '68538',
    'Pouches A5 Pesanti - Titanium (Conf. 100 pezzi)',
    'Titanium',
    9.90,
    'https://odmultimedia.eu/immagini/MD/68538.jpg',
    'A5 (154×216 mm)',
    $d$Pouches A5 pesanti (154×216 mm), spessore 2×125 micron. Confezione da 100 pezzi Titanium per una finitura più rigida e resistente.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A5 (154×216 mm); Spessore 2×125 micron (Pesante); Confezione 100 pezzi.$d$
  ),
  (
    '68554',
    'Pouches A4 Leggere - Titanium (Conf. 100 pezzi)',
    'Titanium',
    9.00,
    'https://odmultimedia.eu/immagini/MD/68554.jpg',
    'A4 (216×303 mm)',
    $d$Pouches A4 leggere (216×303 mm), spessore 2×80 micron. Confezione da 100 pezzi Titanium per documenti standard da ufficio.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A4 (216×303 mm); Spessore 2×80 micron (Leggero); Confezione 100 pezzi.$d$
  ),
  (
    '68537',
    'Pouches A4 Pesanti - Titanium (Conf. 100 pezzi)',
    'Titanium',
    15.00,
    'https://odmultimedia.eu/immagini/MD/68537.jpg',
    'A4 (216×330 mm)',
    $d$Pouches A4 pesanti (216×330 mm), spessore 2×125 micron. Confezione da 100 pezzi Titanium per plastificazione resistente di documenti A4.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A4 (216×330 mm); Spessore 2×125 micron (Pesante); Confezione 100 pezzi.$d$
  ),
  (
    '68553',
    'Pouches A3 Leggere - Titanium (Conf. 100 pezzi)',
    'Titanium',
    20.00,
    'https://odmultimedia.eu/immagini/MD/68553.jpg',
    'A3 (303×426 mm)',
    $d$Pouches A3 leggere (303×426 mm), spessore 2×80 micron. Confezione da 100 pezzi Titanium per poster, mappe e documenti grande formato.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A3 (303×426 mm); Spessore 2×80 micron (Leggero); Confezione 100 pezzi.$d$
  ),
  (
    '68536',
    'Pouches A3 Pesanti - Titanium (Conf. 100 pezzi)',
    'Titanium',
    28.00,
    'https://odmultimedia.eu/immagini/MD/68536.jpg',
    'A3 (303×426 mm)',
    $d$Pouches A3 pesanti (303×426 mm), spessore 2×125 micron. Confezione da 100 pezzi Titanium per una plastificazione A3 più robusta.

Specifiche: Tipologia Pouches / Buste plastificazione; Formato A3 (303×426 mm); Spessore 2×125 micron (Pesante); Confezione 100 pezzi.$d$
  ),
  (
    '80357',
    'Plastificatrice Inspire+ A4 - Nera - GBC',
    'GBC',
    40.60,
    'https://odmultimedia.eu/immagini/MD/80357.jpg',
    'A4',
    $d$Plastificatrice a caldo e a freddo, leggera e compatta, ideale per l’uso occasionale a casa o in piccoli uffici. Dotata di interruttore unico intuitivo e leva di rilascio manuale degli inceppamenti. Incluso starter pack da 5 pouch A4 (2×75 micron).

Specifiche: Formato A4; Part number 4402075EU; Spessore 2×75 – 2×125 micron; Preriscaldamento 4–5 min; Velocità 250 mm/min; Rulli 2; Potenza 420 W; Peso 1,24 kg; Modalità caldo e freddo.$d$
  ),
  (
    '80358',
    'Plastificatrice Inspire+ A3 - Nera - GBC',
    'GBC',
    54.20,
    'https://odmultimedia.eu/immagini/MD/80358.jpg',
    'A3',
    $d$Plastificatrice versatile per formati dal badge ID al formato A3. Perfetta per l’uso domestico e in ufficio, supporta la plastificazione sia a caldo che a freddo. Incluso starter pack da 5 pouch A4 (2×75 micron).

Specifiche: Formato A3 (luce max 303 mm); Part number 4402076EU; Spessore 2×75 – 2×125 micron; Preriscaldamento 4–5 min; Velocità 250 mm/min; Rulli 2 riscaldati; Potenza 550 W; Peso 1,68 kg; Modalità caldo e freddo.$d$
  ),
  (
    '84330',
    'Plastificatrice/Taglierina 3in1 A3 - Titanium (Olympia A 340 Combo)',
    'Titanium',
    59.90,
    'https://odmultimedia.eu/immagini/MD/84330.jpg',
    'A3',
    $d$Unità multifunzione avanzata che integra plastificatrice a caldo/freddo, taglierina a rullo integrata e arrotonda-angoli integrato sul retro.

Specifiche: Formato A3 (luce max 330 mm); Spessore 80/100/125 micron (max doc 0,6 mm); Preriscaldamento 3–5 min; Velocità 250 mm/min; Taglierina Diritto/Ondulato/Perforato (3 fogli 80 g/m²); Sistema ABS sblocco inceppamenti; Potenza 365 W; Peso 1,8 kg.$d$
  ),
  (
    '78746',
    'Plastificatrice HomeOffice PL 350-L A3 - Titanium',
    'Titanium',
    65.30,
    'https://odmultimedia.eu/immagini/MD/78746.jpg',
    'A3',
    $d$Plastificatrice ideale per piccoli uffici e uso domestico frequente. Supporta documenti fino al formato A3 garantendo protezione e finitura di livello professionale per stampe e foto.

Specifiche: Formato A3; Modello HomeOffice PL 350-L; Plastificazione a caldo e a freddo.$d$
  ),
  (
    '65245',
    'Plastificatrice Lunar A4 A Caldo - Fellowes',
    'Fellowes',
    69.90,
    'https://odmultimedia.eu/immagini/MD/65245.jpg',
    'A4',
    $d$Plastificatrice compatta ed elegante progettata da Fellowes per l’uso domestico e l’hobby. Garantisce un processo di plastificazione a caldo rapido, sicuro e privo di inceppamenti.

Specifiche: Formato A4; Modello Lunar; Plastificazione a caldo.$d$
  );

update public.products as p
set
  name = t.name,
  brand = t.brand,
  price = t.price,
  image_url = t.image_url,
  format = t.format,
  description = t.description,
  category = 'Macchine per Ufficio',
  subcategory = 'Plastificatrici e Materiale',
  stock = coalesce(p.stock, 50)
from tmp_plastificatrici as t
where p.sku = t.sku;

insert into public.products (
  sku, name, price, image_url, brand, category, subcategory,
  description, format, stock
)
select
  t.sku,
  t.name,
  t.price,
  t.image_url,
  t.brand,
  'Macchine per Ufficio',
  'Plastificatrici e Materiale',
  t.description,
  t.format,
  50
from tmp_plastificatrici as t
where not exists (select 1 from public.products p where p.sku = t.sku);
