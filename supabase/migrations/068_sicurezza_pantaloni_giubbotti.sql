-- Sicurezza → sottocategorie Pantaloni (9) e Giubbotti (2)

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select v.name, v.slug, v.listing_path, v.cover_image_url, parent.id, v.sort_order, true
from parent
cross join (
  values
    (
      'Pantaloni',
      'sicurezza-pantaloni',
      '/office-products?category=Sicurezza&subcategory=Pantaloni',
      'https://odmultimedia.eu/immagini/LD/86184.jpg',
      50
    ),
    (
      'Giubbotti',
      'sicurezza-giubbotti',
      '/office-products?category=Sicurezza&subcategory=Giubbotti',
      'https://odmultimedia.eu/immagini/LD/73755.jpg',
      60
    )
) as v(name, slug, listing_path, cover_image_url, sort_order)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

create temporary table tmp_sicurezza_abbigliamento (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  subcategory text not null,
  color_name text,
  format text,
  description text not null
) on commit drop;

insert into tmp_sicurezza_abbigliamento (sku, name, brand, price, image_url, subcategory, color_name, format, description)
values
  (
    '86184',
    'Pantalone da lavoro Panostrpa - sargia/poliestere/cotone/elastan - taglia M - blu/arancio - Deltaplus',
    'Deltaplus',
    40.00,
    'https://odmultimedia.eu/immagini/LD/86184.jpg',
    'Pantaloni',
    'blu/arancio',
    'M · sargia PE/cotone/elastan',
    $d$Pantalone da lavoro Deltaplus Panostrpa, taglia M, blu/arancio. Tessuto in sargia mista poliestere/cotone con elastan per elasticità nei movimenti e resistenza all’usura tipica di officina e cantiere. Vestibilità ergonomica con tasche multifunzione e rinforzi nelle zone di attrito. Ideale come abbigliamento professionale quotidiano. Non è un capo di alta visibilità certificato EN ISO 20471: i dettagli arancio hanno funzione di contrasto estetico. Lavare secondo etichetta; sostituire se cuciture o tessuto risultano lacerati.$d$
  ),
  (
    '86189',
    'Pantalone da lavoro Panostrpa - sargia/poliestere/cotone/elastan - taglia L - grigio/nero - Deltaplus',
    'Deltaplus',
    40.00,
    'https://odmultimedia.eu/immagini/LD/86189.jpg',
    'Pantaloni',
    'grigio/nero',
    'L · sargia PE/cotone/elastan',
    $d$Pantalone da lavoro Deltaplus Panostrpa, taglia L, grigio/nero. Stessa costruzione tecnica del modello blu/arancio: sargia PE/cotone con elastan per comfort e resistenza meccanica. Profilo professionale discreto per magazzino, manutenzione e produzione. Vestibilità regolata e tasche utili per utensili leggeri. Controllare vestibilità in vita e cavallo; non utilizzare come DPI di alta visibilità (EN ISO 20471) se non presente marcatura specifica sul lotto.$d$
  ),
  (
    '82220',
    'Pantalone da lavoro Palaos Paligpa - cotone - taglia L - grigio - Deltaplus',
    'Deltaplus',
    30.00,
    'https://odmultimedia.eu/immagini/LD/82220.jpg',
    'Pantaloni',
    'grigio',
    'L · cotone',
    $d$Pantalone da lavoro Deltaplus Palaos Paligpa in cotone, taglia L, grigio. Capo traspirante e confortevole per turni lunghi in ambienti temperati: il cotone favorisce l’assorbimento dell’umidità e una vestibilità naturale. Adatto a edilizia leggera, logistica e servizi. Resistenza all’usura adeguata all’uso quotidiano; preferire Panostrpa/miste tecniche se serve maggiore elasticità o resistenza a oli. Lavaggio a temperatura moderata; non è certificato EN ISO 20471.$d$
  ),
  (
    '82218',
    'Pantalone da lavoro Palaos Paligpa - cotone - taglia L - blu - Deltaplus',
    'Deltaplus',
    30.00,
    'https://odmultimedia.eu/immagini/LD/82218.jpg',
    'Pantaloni',
    'blu',
    'L · cotone',
    $d$Pantalone da lavoro Deltaplus Palaos Paligpa in cotone, taglia L, blu. Versione blu della linea Palaos: tessuto cotone per comfort e traspirabilità, vestibilità classica da lavoro. Ideale per squadre che distinguono i ruoli tramite colore. Buona scelta entry-level per magazzino e manutenzione. Verificare tasche e cuciture dopo lavaggi intensivi; non sostituisce pantaloni alta visibilità EN ISO 20471 né capi ignifughi.$d$
  ),
  (
    '86187',
    'Pantalone da lavoro Panostrpa - sargia/poliestere/cotone/elastan - taglia XXL - blu/arancio - Deltaplus',
    'Deltaplus',
    40.00,
    'https://odmultimedia.eu/immagini/LD/86187.jpg',
    'Pantaloni',
    'blu/arancio',
    'XXL · sargia PE/cotone/elastan',
    $d$Pantalone da lavoro Deltaplus Panostrpa, taglia XXL, blu/arancio. Taglia oversize della serie Panostrpa con sargia tecnica PE/cotone/elastan: elasticità nei punti di flessione (ginocchio, bacino) e tenuta all’abrasione. Vestibilità ampia per operatori che lavorano in movimento o sopra indumenti intermedi. Indicato per cantiere e industria. I contrasti arancio non equivalgono a certificazione EN ISO 20471 senza marcatura CE specifica.$d$
  ),
  (
    '86191',
    'Pantalone da lavoro Panostrpa - sargia/poliestere/cotone/elastan - taglia XXL - grigio/nero - Deltaplus',
    'Deltaplus',
    40.00,
    'https://odmultimedia.eu/immagini/LD/86191.jpg',
    'Pantaloni',
    'grigio/nero',
    'XXL · sargia PE/cotone/elastan',
    $d$Pantalone da lavoro Deltaplus Panostrpa, taglia XXL, grigio/nero. Variante XXL grigio/nero della famiglia Panostrpa: tessuto sargia mista con elastan per resistenza e libertà di movimento. Profilo scuro adatto a ambienti dove l’alta visibilità non è richiesta. Comfort per uso prolungato; tasche e rinforzi tipici della linea. Lavare a rovescio per preservare i colori; ispezionare cuciture e zip periodicamente.$d$
  ),
  (
    '89919',
    'Pantalone da lavoro Panostyle M6PAN - taglia XL - PE/cotone - bianco/grigio - Deltaplus',
    'Deltaplus',
    40.00,
    'https://odmultimedia.eu/immagini/LD/89919.jpg',
    'Pantaloni',
    'bianco/grigio',
    'XL · PE/cotone',
    $d$Pantalone da lavoro Deltaplus Panostyle M6PAN, taglia XL, bianco/grigio. Tessuto poliestere/cotone per un buon equilibrio tra resistenza, stabilità dimensionale e comfort. Design Panostyle orientato a un look professionale pulito, adatto anche a ambienti dove serve un capo chiaro (pulizie, food area non-critical, facility). Vestibilità XL con tasche funzionali. Non è un DPI di alta visibilità EN ISO 20471; per zone a traffico usare modelli fluo certificati.$d$
  ),
  (
    '73752',
    'Pantalone alta visibilità PHPA2 - sargia/poliestere/cotone - taglia L - arancio fluo - Deltaplus',
    'Deltaplus',
    60.00,
    'https://odmultimedia.eu/immagini/LD/73752.jpg',
    'Pantaloni',
    'arancio fluo',
    'L · alta visibilità EN ISO 20471',
    $d$Pantalone alta visibilità Deltaplus PHPA2 in sargia poliestere/cotone, taglia L, arancio fluo. Capo DPI per ambienti a rischio scarsa visibilità (cantieri stradali, logistica, impianti): colore fluo e bande catarifrangenti secondo requisiti tipici EN ISO 20471 (verificare classe 1/2/3 e marcatura CE sul lotto). Tessuto resistente all’usura con vestibilità da lavoro. Lavare rispettando le istruzioni per non degradare il fluo e le bande riflettenti; sostituire se le bande sono screpolate o il colore è sbiadito oltre i limiti di sicurezza.$d$
  ),
  (
    '89959',
    'Pantalone invernale alta visibilità Beacon - giallo fluo - taglia XL - U-Power',
    'U-Power',
    60.00,
    'https://odmultimedia.eu/immagini/LD/89959.jpg',
    'Pantaloni',
    'giallo fluo',
    'XL · invernale EN ISO 20471',
    $d$Pantalone invernale alta visibilità U-Power Beacon, taglia XL, giallo fluo. Abbigliamento antinfortunistico per la stagione fredda: isolamento termico e protezione dalla vista ridotta grazie a colore fluo e inserti catarifrangenti conformi ai requisiti EN ISO 20471 (controllare classe e marcatura sul prodotto). Ideale per cantieri outdoor, viabilità e magazzini refrigerati. Vestibilità XL per indossare strati intermedi. Verificare eventuali claim di impermeabilità/vento sul lotto; non esporre a fiamme libere se non certificato EN ISO 11612.$d$
  ),
  (
    '73755',
    'Giubbotto alta visibilità Reno HV - poliestere/poliuretano - taglia XL - giallo fluo - Deltaplus',
    'Deltaplus',
    80.00,
    'https://odmultimedia.eu/immagini/LD/73755.jpg',
    'Giubbotti',
    'giallo fluo',
    'XL · PE/PU EN ISO 20471',
    $d$Giubbotto alta visibilità Deltaplus Reno HV in poliestere/poliuretano, taglia XL, giallo fluo. Capospalla DPI per esterni e condizioni umide: rivestimento PU per barriera agli schizzi e al vento leggero, fluo + bande catarifrangenti secondo EN ISO 20471 (verificare classe sul certificato). Vestibilità XL ampia, chiudibile e adatta sopra pile/maglia. Ideale per viabilità, cantiere e logistica outdoor. Manutenzione: lavare delicato per preservare riflettanza; riparare o sostituire se cuciture o coating sono danneggiati.$d$
  ),
  (
    '73757',
    'Giubbotto alta visibilità Reno HV - poliestere/poliuretano - taglia XL - arancio fluo - Deltaplus',
    'Deltaplus',
    80.00,
    'https://odmultimedia.eu/immagini/MD/73757.jpg',
    'Giubbotti',
    'arancio fluo',
    'XL · PE/PU EN ISO 20471',
    $d$Giubbotto alta visibilità Deltaplus Reno HV in poliestere/poliuretano, taglia XL, arancio fluo. Stessa piattaforma tecnica del modello giallo: tessuto PE con coating PU, protezione e segnalazione secondo EN ISO 20471 (controllare classe e pittogrammi). Colore arancio fluo spesso richiesto su cantieri ferroviari/stradali per distinguibilità. Comfort XL per movimenti e indumenti sottostanti. Non sostituisce abiti ignifughi o antistatici se il rischio lo richiede; usare solo entro i limiti dichiarati dal produttore.$d$
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
  subcategory = t.subcategory,
  stock = coalesce(p.stock, 100)
from tmp_sicurezza_abbigliamento as t
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
  t.subcategory,
  t.description,
  t.color_name,
  t.format,
  100
from tmp_sicurezza_abbigliamento as t
where not exists (select 1 from public.products p where p.sku = t.sku);
