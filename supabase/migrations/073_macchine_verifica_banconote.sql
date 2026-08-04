-- Macchine per Ufficio → Verifica banconote (6 conta/verifica)

with parent as (
  select id from public.office_catalog_categories where slug in ('macchine-per-ufficio', 'macchine-ufficio')
  order by case when slug = 'macchine-per-ufficio' then 0 else 1 end
  limit 1
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Verifica banconote',
  'macchine-verifica-banconote',
  '/prodotti/macchine-per-ufficio/verifica-banconote',
  'https://odmultimedia.eu/immagini/MD/77725.jpg',
  parent.id,
  40,
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

-- Se manca il parent, crea comunque la riga hub senza parent_id
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Verifica banconote',
  'macchine-verifica-banconote',
  '/prodotti/macchine-per-ufficio/verifica-banconote',
  'https://odmultimedia.eu/immagini/MD/77725.jpg',
  null,
  40,
  true
where not exists (
  select 1 from public.office_catalog_categories where slug = 'macchine-verifica-banconote'
);

create temporary table tmp_verifica_banconote (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  color_name text,
  format text,
  description text not null
) on commit drop;

insert into tmp_verifica_banconote (sku, name, brand, price, image_url, color_name, format, description)
values
  (
    '92216',
    'Conta/verifica banconote multivalute HT 8913 - HolenBecky',
    'HolenBecky',
    260.00,
    'https://odmultimedia.eu/immagini/MD/92216.jpg',
    null,
    'Multivalute HT 8913',
    $d$Conta/verifica banconote HolenBecky HT 8913 multivalute. Dispositivo professionale per conteggio rapido e controlli anti-falsificazione (UV, MG, IR e/o TH secondo configurazione del lotto) su banconote di più valute. Ideale per retail, GDO, uffici contabili e punti cassa B2B ad alto volume: display chiaro, caricamento semplificato e allarmi in caso di sospetta contraffazione. Verificare sul prodotto l’elenco valute aggiornato e le modalità di calibrazione. Manutenzione: tenere i sensori puliti e usare solo banconote in buono stato per ridurre inceppamenti.$d$
  ),
  (
    '88305',
    'Conta/verifica banconote HT 7.0 - nero - Holenbecky',
    'HolenBecky',
    140.00,
    'https://odmultimedia.eu/immagini/MD/88305.jpg',
    'nero',
    'HT 7.0',
    $d$Conta/verifica banconote HolenBecky HT 7.0, colore nero. Modello compatto per conteggio quotidiano in negozio, farmacia o back-office: verifica di sicurezza tipica UV/MG/IR (controllare marcatura sul lotto) e conteggio affidabile per lotti di banconote. Facile da posizionare sul bancone grazie all’ingombro ridotto. Indicato per attività retail e B2B con flussi di cassa medi. Pulire i rulli e i sensori periodicamente; non forzare banconote piegate o danneggiate.$d$
  ),
  (
    '88304',
    'Conta/verifica banconote HT 7.0 - bianco - Holenbecky',
    'HolenBecky',
    140.00,
    'https://odmultimedia.eu/immagini/MD/88304.jpg',
    'bianco',
    'HT 7.0',
    $d$Conta/verifica banconote HolenBecky HT 7.0, colore bianco. Stesse funzionalità del modello nero: conteggio e controlli anti-falso (UV/MG/IR ove presenti) in un formato da bancone. Ideale per ambienti dove il colore chiaro si integra meglio con l’arredo del punto vendita. Uso quotidiano in retail e uffici amministrativi. Seguire le istruzioni di alimentazione e spegnimento; aggiornare firmware se previsto dal produttore.$d$
  ),
  (
    '85875',
    'Conta/verifica banconote Pixel S2 - 11,7 x 13,6 x 7,1 cm - nero - Iternet',
    'Iternet',
    120.00,
    'https://odmultimedia.eu/immagini/MD/85875.jpg',
    'nero',
    '11,7 × 13,6 × 7,1 cm',
    $d$Conta/verifica banconote Iternet Pixel S2, nero, dimensioni 11,7 × 13,6 × 7,1 cm. Formato ultra-compatto per spazi ridotti: conteggio e rilevazione banconote sospette tramite sensori di sicurezza (UV/MG/IR tipici della serie — verificare scheda tecnica). Pensato per bar, tabacchi, piccoli negozi e desk reception. Facilità d’uso con comandi essenziali e feedback immediato. Conservare al riparo da polvere e umidità eccessiva; non esporre a urti durante il trasporto.$d$
  ),
  (
    '77725',
    'Conta/Verifica banconote HT2280 - 31,1 x 26,1 x 19,5 cm - nero - HolenBecky',
    'HolenBecky',
    420.00,
    'https://odmultimedia.eu/immagini/MD/77725.jpg',
    'nero',
    '31,1 × 26,1 × 19,5 cm',
    $d$Conta/verifica banconote HolenBecky HT2280, nero, dimensioni 31,1 × 26,1 × 19,5 cm. Macchina di fascia superiore per volumi elevati: conteggio veloce, hopper/cassetto di capacità maggiore rispetto ai modelli da bancone e suite di controlli anti-falsificazione UV/MG/IR/TH (verificare configurazione sul lotto). Ideale per centri commerciali, cash-office, grandi retail e servizi di gestione contante B2B. Interfaccia professionale e segnalazioni acustiche/visive in caso di anomalia. Pianificare manutenzione sensori e rulli secondo intensità d’uso.$d$
  ),
  (
    '90207',
    'Conta banconote HT 2150 - Holenburg Iternet',
    'Iternet',
    220.00,
    'https://odmultimedia.eu/immagini/MD/90207.jpg',
    null,
    'HT 2150',
    $d$Conta banconote HT 2150 Holenburg / Iternet. Soluzione intermedia per conteggio affidabile in ambienti retail e uffici contabili: velocità di conteggio elevata e controlli di sicurezza (UV/MG/IR ove dichiarati) per individuare banconote non conformi. Adatta a punti cassa con flussi regolari e a riconciliazioni di fine giornata. Facile da operare anche da personale non tecnico. Verificare valute supportate e modalità ADD/BATCH sul manuale; tenere pulita la pista di alimentazione.$d$
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
  category = 'Macchine per Ufficio',
  subcategory = 'Verifica banconote',
  stock = coalesce(p.stock, 50)
from tmp_verifica_banconote as t
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
  'Macchine per Ufficio',
  'Verifica banconote',
  t.description,
  t.color_name,
  t.format,
  50
from tmp_verifica_banconote as t
where not exists (select 1 from public.products p where p.sku = t.sku);
