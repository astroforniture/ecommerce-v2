-- Sicurezza → Dispositivi di protezione per l'udito (9 DPI udito)

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Dispositivi di protezione per l''udito',
  'sicurezza-protezione-udito',
  '/office-products?category=Sicurezza&subcategory=Dispositivi+di+protezione+per+l%27udito',
  'https://odmultimedia.eu/immagini/LD/73573.jpg',
  parent.id,
  80,
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

create temporary table tmp_sicurezza_udito (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  color_name text,
  format text,
  description text not null
) on commit drop;

insert into tmp_sicurezza_udito (sku, name, brand, price, image_url, color_name, format, description)
values
  (
    '73573',
    'Tappi auricolari monouso - diametro 12 mm - SNR 37 dB - rosso - Deltaplus - dispenser da 200 paia',
    'Deltaplus',
    30.00,
    'https://odmultimedia.eu/immagini/LD/73573.jpg',
    'rosso',
    'Ø12 mm · SNR 37 dB · 200 paia',
    $d$Tappi auricolari monouso Deltaplus, diametro 12 mm, colore rosso, dispenser da 200 paia. Inserti in schiuma espandibile per attenuazione elevata: SNR 37 dB (Single Number Rating — verificare valore sul lotto). Conformità tipica EN 352-2 per inserti auricolari. Ideali per industria rumorosa, cantieri e zone con esposizione prolungata a livelli elevati, quando è richiesta massima attenuazione e ricambio frequente. Istruzione d’uso: arrotolare, inserire a fondo nel canale e attendere l’espansione; monouso — non riutilizzare se sporchi o deformati. Conservare il dispenser chiuso e asciutto.$d$
  ),
  (
    '73575',
    'Cuffia antirumore SPA3 - SNR 23 dB - ABS/polistirene/gomma piuma - blu/nero - Deltaplus',
    'Deltaplus',
    10.00,
    'https://odmultimedia.eu/immagini/LD/73575.jpg',
    'blu/nero',
    'SNR 23 dB · EN 352-1',
    $d$Cuffia antirumore Deltaplus SPA3 in ABS/polistirene con cuscinetti in gomma piuma, blu/nero. Attenuazione SNR 23 dB: adatta a rumori di livello moderato (magazzino, officina leggera, manutenzione). Conformità EN 352-1 per cuffie. Coppe leggere e archetto regolabile per comfort su turni medi. Non sufficiente da sola per ambienti ad altissimo rumore (preferire X5A / Optime II o tappi ad alto SNR). Controllare integrità dei cuscinetti; sostituire se induriti o crepati per mantenere la tenuta acustica.$d$
  ),
  (
    '79015',
    'Coppia di tamponi di ricambio 1311 - per archetti 1310 - SNR 26 dB - arancione - 3M',
    '3M',
    4.00,
    'https://odmultimedia.eu/immagini/LD/79015.jpg',
    'arancione',
    'Ricambio 1311 · SNR 26 dB',
    $d$Coppia di tamponi di ricambio 3M 1311 per archetti 1310, arancione. Consumabile per mantenere l’attenuazione dichiarata del sistema a banda (SNR tipico 26 dB con archetto 1310 — verificare sulla confezione). Destinati a inserti EN 352-2 montati su archetto. Sostituire quando i tamponi sono compressi, sporchi o non tornano alla forma originale. Non utilizzare su archetti non compatibili; igiene: un paio per utente o secondo protocollo aziendale.$d$
  ),
  (
    '79807',
    'Cuffia protettiva Peltor X1A - SNR 27 dB - verde/nero - 3M',
    '3M',
    35.00,
    'https://odmultimedia.eu/immagini/LD/79807.jpg',
    'verde/nero',
    'Peltor X1A · SNR 27 dB',
    $d$Cuffia protettiva 3M Peltor X1A, verde/nero, SNR 27 dB. Fascia bassa della serie X: attenuazione bilanciata per industrie e cantieri con rumore medio-alto, mantenendo comfort e peso contenuto. Conformità EN 352-1. Design X con archetto a filo e coppe ottimizzate. Ideale quando serve protezione superiore a cuffie entry-level (es. SPA3) senza arrivare agli SNR elevati della X5A. Verificare compatibilità con elmetti/accessori Peltor se previsti; ispezionare cuscinetti e tenuta periodicamente.$d$
  ),
  (
    '79748',
    'Inserti auricolari E.A.R. Classic con cordicella - SNR 28 dB - giallo - 3M - conf. 200 pezzi',
    '3M',
    130.00,
    'https://odmultimedia.eu/immagini/LD/79748.jpg',
    'giallo',
    'E.A.R. Classic · SNR 28 dB · 200 pz',
    $d$Inserti auricolari 3M E.A.R. Classic con cordicella, giallo, confezione da 200 pezzi. Classici in PVC a cellula lenta: attenuazione SNR 28 dB, conformità EN 352-2. La cordicella riduce il rischio di perdita e facilita l’uso intermittente (ingressi/uscite da zone rumorose). Indicati per industria, aeronautica leggera e ambienti con rumore continuo. Rullare bene prima dell’inserimento; non tagliare gli inserti. Conservare puliti; sostituire secondo igiene aziendale (tipicamente monouso o giornaliero).$d$
  ),
  (
    '79841',
    'Cuffia protettiva Peltor Optime II - SNR 31 dB - verde - 3M',
    '3M',
    35.00,
    'https://odmultimedia.eu/immagini/LD/79841.jpg',
    'verde',
    'Optime II · SNR 31 dB',
    $d$Cuffia protettiva 3M Peltor Optime II, verde, SNR 31 dB. Modello di riferimento per attenuazione elevata in ambienti rumorosi (industria pesante, cantieri, impianti). EN 352-1; coppe ampie e soft sealing rings per tenuta e comfort. Ideale quando SNR ~23–27 non bastano ma non è necessario il massimo della X5A. Controllare pressione dell’archetto e stato dei cuscinetti: una tenuta scadente riduce l’attenuazione reale rispetto al valore SNR di laboratorio.$d$
  ),
  (
    '79840',
    'Cuffia protettiva Peltor X5A - SNR 37 dB - nero - 3M',
    '3M',
    80.00,
    'https://odmultimedia.eu/immagini/LD/79840.jpg',
    'nero',
    'Peltor X5A · SNR 37 dB',
    $d$Cuffia protettiva 3M Peltor X5A, nero, SNR 37 dB. Alta attenuazione della serie X per esposizioni elevate (presse, macchinari pesanti, ambienti molto rumorosi). Conformità EN 352-1. Coppe di grande volume e design ottimizzato per massimizzare l’isolamento mantenendo indossabilità. Usare solo quando il rischio lo richiede: un’attenuazione eccessiva può isolare eccessivamente da segnali utili — valutare con RSPP. Manutenzione: cuscinetti e inserti igienici originali 3M.$d$
  ),
  (
    '79891',
    'Cuffia protettiva Peltor Optime I - SNR 27 dB - giallo - 3M',
    '3M',
    30.00,
    'https://odmultimedia.eu/immagini/LD/79891.jpg',
    'giallo',
    'Optime I · SNR 27 dB',
    $d$Cuffia protettiva 3M Peltor Optime I, giallo, SNR 27 dB. Versione “entry” della famiglia Optime: attenuazione solida EN 352-1 per rumori medio-alti con comfort quotidiano. Ideale per magazzino, carpenteria e produzione generale. Più leggera/meno “chiusa” dell’Optime II (SNR 31). Verificare marcatura CE e valori HML/SNR sul prodotto; sostituire i cuscinetti quando perdono elasticità per non ridurre la protezione effettiva.$d$
  ),
  (
    '61175',
    'Inserti auricolari con archetto 1310 - SNR 26 dB - blu/arancio - 3M',
    '3M',
    10.00,
    'https://odmultimedia.eu/immagini/LD/61175.jpg',
    'blu/arancio',
    'Archetto 1310 · SNR 26 dB',
    $d$Inserti auricolari con archetto 3M 1310, blu/arancio, SNR 26 dB. Sistema banded: tamponi su archetto per uso rapido e intermittente (ingressi in zona rumorosa senza maneggiare inserti monouso). Conformità EN 352-2. Comodi quando i guanti o le mani sporche sconsigliano i tappi a schiuma. Attenuazione inferiore ai tappi SNR 37: adatti a rumori medi. Usare ricambi 1311 quando i tamponi sono usurati; non modificare l’archetto. Igienizzare secondo protocollo aziendale.$d$
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
  subcategory = 'Dispositivi di protezione per l''udito',
  stock = coalesce(p.stock, 100)
from tmp_sicurezza_udito as t
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
  'Dispositivi di protezione per l''udito',
  t.description,
  t.color_name,
  t.format,
  100
from tmp_sicurezza_udito as t
where not exists (select 1 from public.products p where p.sku = t.sku);
