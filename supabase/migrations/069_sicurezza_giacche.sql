-- Sicurezza → sottocategoria Giacche (10 Softshell)

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Giacche',
  'sicurezza-giacche',
  '/office-products?category=Sicurezza&subcategory=Giacche',
  'https://odmultimedia.eu/immagini/LD/86181.jpg',
  parent.id,
  70,
  true
from parent
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

create temporary table tmp_sicurezza_giacche (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  color_name text,
  format text,
  description text not null
) on commit drop;

insert into tmp_sicurezza_giacche (sku, name, brand, price, image_url, color_name, format, description)
values
  (
    '86181',
    'Giacca Softshell MySen 2 - tessuto Softshell/poliestere/elastan - taglia M - grigio/fucsia - Deltaplus',
    'Deltaplus',
    60.00,
    'https://odmultimedia.eu/immagini/LD/86181.jpg',
    'grigio/fucsia',
    'M · Softshell PE/elastan',
    $d$Giacca Softshell Deltaplus MySen 2, taglia M, grigio/fucsia. Tessuto Softshell a tre strati tipici (maglia esterna, membrana, pile interno) in poliestere/elastan: antivento, idrorepellente su pioggia leggera e traspirante per attività dinamiche. Vestibilità aderente ma flessibile grazie all’elastan; contrasto fucsia per riconoscibilità in squadra. Ideale per magazzino, facility e outdoor temperato. Non è un DPI di alta visibilità EN ISO 20471: per cantieri stradali usare modelli fluo certificati. Lavare a basse temperature per preservare l’idrorepellenza.$d$
  ),
  (
    '89929',
    'Giacca Softshell Horten - tessuto Softshell/poliestere/elastan - con cappuccio - taglia M - nero/giallo - Deltaplus',
    'Deltaplus',
    60.00,
    'https://odmultimedia.eu/immagini/LD/89929.jpg',
    'nero/giallo',
    'M · Softshell con cappuccio',
    $d$Giacca Softshell Deltaplus Horten con cappuccio, taglia M, nero/giallo. Softshell PE/elastan antivento e idrorepellente, cappuccio regolabile per protezione da vento e spruzzi. Traspirabilità tipica Softshell per ridurre la condensazione durante il movimento. Contrasto giallo estetico, non equivalente a marcatura EN ISO 20471. Adatta a logistica, manutenzione e spostamenti outdoor. Chiudere zip e mantelli dopo il lavaggio; riattivare l’idrorepellenza con calore delicato se indicato dal produttore.$d$
  ),
  (
    '104546',
    'Giacca Softshell Lulea2 - taglia XL - grigio/nero - Deltaplus',
    'Deltaplus',
    60.00,
    'https://odmultimedia.eu/immagini/LD/104546.jpg',
    'grigio/nero',
    'XL · Softshell',
    $d$Giacca Softshell Deltaplus Lulea2, taglia XL, grigio/nero. Capospalla tecnico Softshell per uso professionale: barriera al vento, superficie idrorepellente e traspirabilità per microclima asciutto sotto sforzo. Vestibilità XL ampia, adatta sopra pile o maglia. Profilo scuro discreto per produzione e magazzino. Non certificata EN ISO 20471. Controllare cuciture e zip dopo usi intensivi; non esporre a fiamme libere se non presente certificazione termica dedicata.$d$
  ),
  (
    '104541',
    'Giacca Softshell 2 in 1 Soccia - taglia L - nero/rosso - Deltaplus',
    'Deltaplus',
    65.00,
    'https://odmultimedia.eu/immagini/LD/104541.jpg',
    'nero/rosso',
    'L · Softshell 2 in 1',
    $d$Giacca Softshell 2 in 1 Deltaplus Soccia, taglia L, nero/rosso. Sistema convertibile: strato Softshell antivento/idrorepellente/traspirante abbinabile a un secondo elemento (tipicamente pile o lining removibile — verificare configurazione sul lotto) per adattarsi a temperature variabili. Vestibilità L comoda per uso quotidiano in cantiere leggero e logistica. Contrasto rosso estetico, non EN ISO 20471. Ideale mezza stagione; smontare e lavare i componenti secondo etichetta.$d$
  ),
  (
    '105192',
    'Giacca da lavoro Softshell Texpel™ Splash Eco - L - nero/grigio - Portwest',
    'Portwest',
    60.00,
    'https://odmultimedia.eu/immagini/LD/105192.jpg',
    'nero/grigio',
    'L · Texpel Splash Eco Softshell',
    $d$Giacca da lavoro Softshell Portwest Texpel™ Splash Eco, taglia L, nero/grigio. Tecnologia Texpel Splash Eco orientata a idrorepellenza e resistenza agli schizzi con approach più sostenibile rispetto a trattamenti tradizionali (verificare claim Eco sul lotto). Softshell antivento e traspirante per lavoro outdoor e indoor non climatizzato. Vestibilità L professionale Portwest. Non è un capo alta visibilità EN ISO 20471. Seguire istruzioni di lavaggio per mantenere performance Splash.$d$
  ),
  (
    '97983',
    'Giacca Softshell donna Space Lady - taglia L - grigio/fucsia - U-Power',
    'U-Power',
    90.00,
    'https://odmultimedia.eu/immagini/LD/97983.jpg',
    'grigio/fucsia',
    'L · Softshell donna',
    $d$Giacca Softshell donna U-Power Space Lady, taglia L, grigio/fucsia. Taglio femminile Softshell: antivento, idrorepellente e traspirante per libertà di movimento. Contrasto fucsia tipico U-Power Lady. Ideale per logistica, facility e outdoor temperato. Non certificata EN ISO 20471 (per alta visibilità scegliere Miky / Moonlight). Vestibilità L strutturata; lavare delicato e non stirare a temperatura elevata sulla membrana.$d$
  ),
  (
    '89950',
    'Giacca alta visibilità Softshell Miky - taglia L - giallo fluo - U-Power',
    'U-Power',
    100.00,
    'https://odmultimedia.eu/immagini/LD/89950.jpg',
    'giallo fluo',
    'L · Softshell EN ISO 20471',
    $d$Giacca alta visibilità Softshell U-Power Miky, taglia L, giallo fluo. Softshell antivento e idrorepellente combinata a segnale fluo e bande catarifrangenti secondo requisiti tipici EN ISO 20471 (verificare classe 1/2/3 e marcatura CE sul prodotto). Traspirabilità Softshell per attività dinamiche in cantiere e viabilità. Vestibilità L. Lavare rispettando le istruzioni per non degradare fluo e riflettanza; sostituire se le bande sono screpolate o il colore è sbiadito oltre i limiti di sicurezza.$d$
  ),
  (
    '89955',
    'Giacca alta visibilità Softshell Miky - taglia XL - arancio fluo - U-Power',
    'U-Power',
    100.00,
    'https://odmultimedia.eu/immagini/LD/89955.jpg',
    'arancio fluo',
    'XL · Softshell EN ISO 20471',
    $d$Giacca alta visibilità Softshell U-Power Miky, taglia XL, arancio fluo. Stessa piattaforma tecnica del modello giallo: Softshell antivento/idrorepellente/traspirante con certificazione tipica EN ISO 20471 (controllare classe sul lotto). Colore arancio fluo spesso richiesto su cantieri ferroviari e stradali. Vestibilità XL per strati intermedi. Manutenzione delicata delle bande catarifrangenti; non utilizzare come unico DPI se il rischio richiede indumenti ignifughi o antistatici dedicati.$d$
  ),
  (
    '86491',
    'Giacca Softshell Moonlight 2 alta visibilità - poliestere - taglia L - giallo fluo - Deltaplus',
    'Deltaplus',
    90.00,
    'https://odmultimedia.eu/immagini/LD/86491.jpg',
    'giallo fluo',
    'L · Softshell PE EN ISO 20471',
    $d$Giacca Softshell alta visibilità Deltaplus Moonlight 2 in poliestere, taglia L, giallo fluo. Softshell professionale antivento e idrorepellente con traspirabilità per lavoro outdoor; segnale fluo e inserti catarifrangenti conformi ai requisiti EN ISO 20471 (verificare classe e marcatura). Vestibilità L con zip e tasche da lavoro. Ideale per viabilità, logistica e cantieri. Conservare lontano da solventi aggressivi; riapplicare trattamenti idrorepellenti se consigliati dal produttore dopo lavaggi ripetuti.$d$
  ),
  (
    '86494',
    'Giacca Softshell Moonlight 2 alta visibilità - poliestere - taglia M - arancio fluo - Deltaplus',
    'Deltaplus',
    90.00,
    'https://odmultimedia.eu/immagini/LD/86494.jpg',
    'arancio fluo',
    'M · Softshell PE EN ISO 20471',
    $d$Giacca Softshell alta visibilità Deltaplus Moonlight 2 in poliestere, taglia M, arancio fluo. Variante arancio della serie Moonlight 2: protezione Softshell (vento, pioggia leggera, traspirazione) e DPI di segnalazione secondo EN ISO 20471 (controllare classe CE). Taglia M più aderente per operatori snelli o uso sopra maglia tecnica. Adatta a ambienti a traffico e scarsa luminosità. Ispezionare bande e cuciture periodicamente; sostituire il capo se compromesso.$d$
  );

update public.products as p
set
  name = t.name,
  brand = t.brand,
  price = t.price,
  image_url = t.image_url,
  color_name = t.color_name,
  format = t.format,
  description = t.description,
  category = 'Sicurezza',
  subcategory = 'Giacche',
  stock = coalesce(p.stock, 100)
from tmp_sicurezza_giacche as t
where p.sku = t.sku;

insert into public.products (
  sku, name, price, image_url, brand, category, subcategory,
  description, color_name, format, stock
)
select
  t.sku,
  t.name,
  t.price,
  t.image_url,
  t.brand,
  'Sicurezza',
  'Giacche',
  t.description,
  t.color_name,
  t.format,
  100
from tmp_sicurezza_giacche as t
where not exists (select 1 from public.products p where p.sku = t.sku);
