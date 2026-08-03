-- Prodotti per igiene: nuovi aspirapolvere (Macchine) + carrelli/panni (Attrezzature)
-- Aggiorna anche prezzo WTP 30XE (102069) a 280.00

with rows(sku, name, brand, price, image_url, subcategory, description) as (
  values
    (
      '105489',
      'Aspirapolvere MultiCiclonico - 700W - 17KPa - 2 filtri HEPA - Girmi',
      'Girmi',
      120.00::numeric,
      'https://odmultimedia.eu/immagini/MD/105489.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere multiciclonico Girmi da 700 W con pressione di aspirazione dichiarata 17 kPa. Sistema a cicloni per separare polvere e detriti riducendo l’intasamento del filtro; doppio filtro HEPA per trattenere particelle fini e allergeni. Adatto a pavimenti duri e tappeti in ambienti domestici e uffici di piccole/medie dimensioni. Svuotare periodicamente il contenitore e pulire i filtri HEPA secondo le istruzioni del produttore per mantenere le prestazioni.$d$
    ),
    (
      '103816',
      'Aspirapolvere cordless - 30 W - 37 x 12 x 11 cm - bianco/verde - Girmi',
      'Girmi',
      55.00,
      'https://odmultimedia.eu/immagini/MD/103816.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere cordless compatto Girmi, 30 W, dimensioni 37×12×11 cm, finitura bianco/verde. Ideale per riprese rapide su scrivanie, auto, divani e angoli difficili grazie all’assenza di cavo. Autonomia e tempi di ricarica secondo scheda tecnica del produttore; svuotare il serbatoio polvere dopo ogni utilizzo intensivo. Non sostituisce un aspirapolvere a piena potenza per grandi superfici.$d$
    ),
    (
      '102071',
      'Aspirapolvere e liquidi professionale Windy 265IF - 2400 W - 65 L - 96 x 44 x 46 cm - Lavor',
      'Lavor',
      520.00,
      'https://odmultimedia.eu/immagini/MD/102071.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere aspiraliquidi professionale Lavor Windy 265IF: potenza 2400 W, serbatoio 65 L, ingombro 96×44×46 cm. Pensato per pulizie industriali e cantieri: aspira solidi e liquidi, con struttura robusta e grande capacità per interventi prolungati. Utilizzare con filtri e accessori previsti; dopo aspirazione liquidi svuotare e asciugare il serbatoio. DPI e procedure di sicurezza secondo manuale; non aspirare sostanze infiammabili o corrosive non autorizzate.$d$
    ),
    (
      '102069',
      'Aspirapolvere e liquidi semiprofessionale WTP 30XE - 1600 W - 30 L - 68 x 34 x 34 cm - Lavor',
      'Lavor',
      280.00,
      'https://odmultimedia.eu/immagini/MD/102069.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere aspiraliquidi semiprofessionale Lavor WTP 30XE: 1600 W, serbatoio 30 L, dimensioni 68×34×34 cm. Versatile per negozi, uffici e piccole attività: aspira polvere e liquidi con buona autonomia di carico. Svuotare e pulire filtro/serbatoio dopo l’uso; verificare tenuta e accessori prima di ogni intervento. Non impiegare su liquidi infiammabili o chimici non compatibili con le specifiche del costruttore.$d$
    ),
    (
      '82502',
      'Carrello per pulizie Pressclean - 50 L - 81 x 43,5 x 88 cm - Medial',
      'Medial',
      300.00,
      'https://odmultimedia.eu/immagini/MD/82502.jpg',
      'Attrezzature e Panni',
      $d$Carrello per pulizie Medial Pressclean con capacità 50 L e dimensioni 81×43,5×88 cm. Configurazione professionale per trasporto secchi, utensili e materiale di consumo in hotel, uffici e strutture collettive. Struttura stabile su ruote; verificare il blocco delle ruote in sosta e non sovraccaricare oltre la portata indicata. Ideale in abbinamento a mop, frange e detergenti della linea igiene.$d$
    ),
    (
      '95336',
      'Carrello per pulizie Grouse26 - 25 L - 41 x 58 x 93 cm - blu/rosso - Taxon',
      'Taxon',
      160.00,
      'https://odmultimedia.eu/immagini/MD/95336.jpg',
      'Attrezzature e Panni',
      $d$Carrello pulizie Taxon Grouse26, capacità 25 L, dimensioni 41×58×93 cm, colorazione blu/rosso per separazione zone o utensili. Compatto e maneggevole per corridoi e spazi ristretti; adatto a servizi di pulizia quotidiana in uffici e negozi. Controllare periodicamente ruote e ganci; non superare il carico massimo. Facilita l’organizzazione di secchi, mop e prodotti detergenti.$d$
    ),
    (
      '79730',
      'Carrello per pulizie professionali Evolution - 48 L - 67,5 x119 x115 cm - PerfettoFactory',
      'PerfettoFactory',
      400.00,
      'https://odmultimedia.eu/immagini/MD/79730.jpg',
      'Attrezzature e Panni',
      $d$Carrello professionale PerfettoFactory Evolution, capacità 48 L, dimensioni 67,5×119×115 cm. Piattaforma ampia per attrezzature complete di pulizia (secchi, presse, sacchi e utensili) in ambienti ad alto passaggio. Struttura destinata a uso intensivo; movimentare con cautela, bloccare le ruote in sosta e distribuire il carico in modo equilibrato. Adatto a facility management e imprese di cleaning.$d$
    ),
    (
      '89410',
      'Panni microfibra Ultrega - 40 x 40 cm - azzurro - PerfettoFactory - conf. 10 pezzi',
      'PerfettoFactory',
      20.00,
      'https://odmultimedia.eu/immagini/MD/89410.jpg',
      'Attrezzature e Panni',
      $d$Panni in microfibra PerfettoFactory Ultrega, formato 40×40 cm, colore azzurro, confezione da 10 pezzi. Ideali per spolvero e detergazione di superfici dure (scrivanie, vetri, arredi) con ridotto uso di chimici grazie all’effetto meccanico della microfibra. Lavabili secondo indicazioni del produttore; non utilizzare ammorbidenti che riducono le prestazioni. Codice colore utile per separare zone (es. ufficio vs bagno) nei piani H.A.C.C.P. / igiene.$d$
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
  subcategory = r.subcategory,
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, price, image_url, subcategory, description) as (
  values
    (
      '105489',
      'Aspirapolvere MultiCiclonico - 700W - 17KPa - 2 filtri HEPA - Girmi',
      'Girmi',
      120.00::numeric,
      'https://odmultimedia.eu/immagini/MD/105489.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere multiciclonico Girmi da 700 W con pressione di aspirazione dichiarata 17 kPa. Sistema a cicloni per separare polvere e detriti riducendo l’intasamento del filtro; doppio filtro HEPA per trattenere particelle fini e allergeni. Adatto a pavimenti duri e tappeti in ambienti domestici e uffici di piccole/medie dimensioni. Svuotare periodicamente il contenitore e pulire i filtri HEPA secondo le istruzioni del produttore per mantenere le prestazioni.$d$
    ),
    (
      '103816',
      'Aspirapolvere cordless - 30 W - 37 x 12 x 11 cm - bianco/verde - Girmi',
      'Girmi',
      55.00,
      'https://odmultimedia.eu/immagini/MD/103816.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere cordless compatto Girmi, 30 W, dimensioni 37×12×11 cm, finitura bianco/verde. Ideale per riprese rapide su scrivanie, auto, divani e angoli difficili grazie all’assenza di cavo. Autonomia e tempi di ricarica secondo scheda tecnica del produttore; svuotare il serbatoio polvere dopo ogni utilizzo intensivo. Non sostituisce un aspirapolvere a piena potenza per grandi superfici.$d$
    ),
    (
      '102071',
      'Aspirapolvere e liquidi professionale Windy 265IF - 2400 W - 65 L - 96 x 44 x 46 cm - Lavor',
      'Lavor',
      520.00,
      'https://odmultimedia.eu/immagini/MD/102071.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere aspiraliquidi professionale Lavor Windy 265IF: potenza 2400 W, serbatoio 65 L, ingombro 96×44×46 cm. Pensato per pulizie industriali e cantieri: aspira solidi e liquidi, con struttura robusta e grande capacità per interventi prolungati. Utilizzare con filtri e accessori previsti; dopo aspirazione liquidi svuotare e asciugare il serbatoio. DPI e procedure di sicurezza secondo manuale; non aspirare sostanze infiammabili o corrosive non autorizzate.$d$
    ),
    (
      '102069',
      'Aspirapolvere e liquidi semiprofessionale WTP 30XE - 1600 W - 30 L - 68 x 34 x 34 cm - Lavor',
      'Lavor',
      280.00,
      'https://odmultimedia.eu/immagini/MD/102069.jpg',
      'Macchine per Pulizia',
      $d$Aspirapolvere aspiraliquidi semiprofessionale Lavor WTP 30XE: 1600 W, serbatoio 30 L, dimensioni 68×34×34 cm. Versatile per negozi, uffici e piccole attività: aspira polvere e liquidi con buona autonomia di carico. Svuotare e pulire filtro/serbatoio dopo l’uso; verificare tenuta e accessori prima di ogni intervento. Non impiegare su liquidi infiammabili o chimici non compatibili con le specifiche del costruttore.$d$
    ),
    (
      '82502',
      'Carrello per pulizie Pressclean - 50 L - 81 x 43,5 x 88 cm - Medial',
      'Medial',
      300.00,
      'https://odmultimedia.eu/immagini/MD/82502.jpg',
      'Attrezzature e Panni',
      $d$Carrello per pulizie Medial Pressclean con capacità 50 L e dimensioni 81×43,5×88 cm. Configurazione professionale per trasporto secchi, utensili e materiale di consumo in hotel, uffici e strutture collettive. Struttura stabile su ruote; verificare il blocco delle ruote in sosta e non sovraccaricare oltre la portata indicata. Ideale in abbinamento a mop, frange e detergenti della linea igiene.$d$
    ),
    (
      '95336',
      'Carrello per pulizie Grouse26 - 25 L - 41 x 58 x 93 cm - blu/rosso - Taxon',
      'Taxon',
      160.00,
      'https://odmultimedia.eu/immagini/MD/95336.jpg',
      'Attrezzature e Panni',
      $d$Carrello pulizie Taxon Grouse26, capacità 25 L, dimensioni 41×58×93 cm, colorazione blu/rosso per separazione zone o utensili. Compatto e maneggevole per corridoi e spazi ristretti; adatto a servizi di pulizia quotidiana in uffici e negozi. Controllare periodicamente ruote e ganci; non superare il carico massimo. Facilita l’organizzazione di secchi, mop e prodotti detergenti.$d$
    ),
    (
      '79730',
      'Carrello per pulizie professionali Evolution - 48 L - 67,5 x119 x115 cm - PerfettoFactory',
      'PerfettoFactory',
      400.00,
      'https://odmultimedia.eu/immagini/MD/79730.jpg',
      'Attrezzature e Panni',
      $d$Carrello professionale PerfettoFactory Evolution, capacità 48 L, dimensioni 67,5×119×115 cm. Piattaforma ampia per attrezzature complete di pulizia (secchi, presse, sacchi e utensili) in ambienti ad alto passaggio. Struttura destinata a uso intensivo; movimentare con cautela, bloccare le ruote in sosta e distribuire il carico in modo equilibrato. Adatto a facility management e imprese di cleaning.$d$
    ),
    (
      '89410',
      'Panni microfibra Ultrega - 40 x 40 cm - azzurro - PerfettoFactory - conf. 10 pezzi',
      'PerfettoFactory',
      20.00,
      'https://odmultimedia.eu/immagini/MD/89410.jpg',
      'Attrezzature e Panni',
      $d$Panni in microfibra PerfettoFactory Ultrega, formato 40×40 cm, colore azzurro, confezione da 10 pezzi. Ideali per spolvero e detergazione di superfici dure (scrivanie, vetri, arredi) con ridotto uso di chimici grazie all’effetto meccanico della microfibra. Lavabili secondo indicazioni del produttore; non utilizzare ammorbidenti che riducono le prestazioni. Codice colore utile per separare zone (es. ufficio vs bagno) nei piani H.A.C.C.P. / igiene.$d$
    )
)
insert into public.products (sku, name, price, image_url, brand, category, subcategory, description, stock)
select
  r.sku,
  r.name,
  r.price,
  r.image_url,
  r.brand,
  'Prodotti per igiene',
  r.subcategory,
  r.description,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
