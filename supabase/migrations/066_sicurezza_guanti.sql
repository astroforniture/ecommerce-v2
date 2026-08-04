-- Sicurezza → sottocategoria Guanti (18 DPI mani)

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Guanti',
  'sicurezza-guanti',
  '/office-products?category=Sicurezza&subcategory=Guanti',
  'https://odmultimedia.eu/immagini/LD/97069.jpg',
  parent.id,
  30,
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

with rows(
  sku, name, brand, price, image_url, color_name, format,
  min_order_quantity, order_quantity_step, description
) as (
  values
    (
      '97069',
      'Guanti mechanical Safety Palmpro 161 - XL - arancione - Icoguanti',
      'Icoguanti',
      4.00::numeric,
      'https://odmultimedia.eu/immagini/LD/97069.jpg',
      'arancione',
      'XL',
      null::integer,
      null::integer,
      $d$Guanti da lavoro Icoguanti Mechanical Safety Palmpro 161, taglia XL, colore arancione. DPI per le mani destinato a manipolazioni generali e attività meccaniche leggere/medie: palmo rinforzato per grip e resistenza all’abrasione. Conforme ai requisiti generali EN 420 (taglia, comfort, innocuità) e, ove marcato sul lotto, alla EN 388 per rischi meccanici (abrasione, taglio, strappo, perforazione — verificare i livelli sul pittogramma). Ideali per magazzino, assemblaggio e manutenzione. Controllare l’integrità prima dell’uso; sostituire se usurati o contaminati.$d$
    ),
    (
      '97083',
      'Guanti mechanical Safety Palmpro 212 - M - grigio/nero - Icoguanti',
      'Icoguanti',
      4.00,
      'https://odmultimedia.eu/immagini/LD/97083.jpg',
      'grigio/nero',
      'M',
      null,
      null,
      $d$Guanti da lavoro Icoguanti Mechanical Safety Palmpro 212, taglia M, grigio/nero. Modello meccanico con rivestimento sul palmo per aderenza e protezione dall’abrasione in operazioni di movimentazione e montaggio. Rispetta i requisiti EN 420; prestazioni meccaniche secondo EN 388 se presenti sul prodotto (controllare marcatura CE e livelli). Buon equilibrio tra destrezza e resistenza per uso quotidiano in officina e logistica. Non utilizzare a contatto con sostanze chimiche aggressive se non certificato EN 374.$d$
    ),
    (
      '92224',
      'Guanti antistatico VE702PESD - poliestere/carbonio - 08 - bianco - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/92224.jpg',
      'bianco',
      '08',
      null,
      null,
      $d$Guanti antistatici Deltaplus VE702PESD in poliestere con filato al carbonio, taglia 08, bianco. Progettati per ambienti ESD (electrostatic discharge) in elettronica e assemblaggio di componenti sensibili: dissipano le cariche elettrostatiche riducendo il rischio di danneggiamento. Conformi ai requisiti generali EN 420; verificare sul lotto eventuali riferimenti a norme ESD / EN 16350 ove applicabili. Palmo tipicamente in PU per grip e destrezza. Lavare secondo istruzioni del produttore; non utilizzare come protezione chimica o antitaglio.$d$
    ),
    (
      '73637',
      'Guanti da lavoro pesante NI175 - nitrile - 10 - blu - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73637.jpg',
      'blu',
      '10',
      null,
      null,
      $d$Guanti da lavoro pesante Deltaplus NI175 in nitrile, taglia 10, blu. Guanto robusto per manipolazioni impegnative: il nitrile offre buona resistenza a oli, grassi e abrasione rispetto al lattice classico. Destinato a officina, manutenzione e edilizia leggera. Conformità tipica EN 420 e prestazioni meccaniche EN 388 (verificare livelli sul pittogramma). Buona aderenza anche in presenza di residui oleosi. Ispezionare cuciture e rivestimento; sostituire al primo segno di foratura o usura del palmo.$d$
    ),
    (
      '88944',
      'Guanti antistatica Themis VV792 ESD - 08 - ruggine/grigio - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/88944.jpg',
      'ruggine/grigio',
      '08',
      null,
      null,
      $d$Guanti antistatici Deltaplus Themis VV792 ESD, taglia 08, ruggine/grigio. Serie ESD per linee di produzione elettronica e clean area: struttura in maglia con proprietà dissipative per controllare le scariche elettrostatiche. Requisiti generali EN 420; prestazioni meccaniche EN 388 ove marcate; verificare conformità ESD sul certificato del produttore. Rivestimento sul palmo per grip e precisione. Ideali per montaggio PCB e componenti sensibili. Non sostituiscono guanti chimici EN 374 né antitaglio ad alto livello.$d$
    ),
    (
      '73639',
      'Guanti da lavoro pesante NI015 - nitrile leggero - 10 - giallo - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73639.jpg',
      'giallo',
      '10',
      null,
      null,
      $d$Guanti da lavoro pesante Deltaplus NI015 in nitrile leggero, taglia 10, giallo. Versione più snella rispetto ai guanti nitrilici spessi: combina protezione da oli/abrasione con maggiore flessibilità per lavori di precisione media. EN 420 per requisiti generali; EN 388 per rischi meccanici (controllare marcatura). Indicati per assemblaggio, magazzino e manutenzione. Il colore giallo migliora la visibilità del DPI. Conservare al riparo da UV e solventi aggressivi non previsti dalla scheda tecnica.$d$
    ),
    (
      '73633',
      'Guanti da lavoro VE630 - poliestere/palmo lattice - 10 - grigio - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73633.jpg',
      'grigio',
      '10',
      null,
      null,
      $d$Guanti da lavoro Deltaplus VE630 in poliestere con palmo in lattice, taglia 10, grigio. Classico guanto di manipolazione: supporto in maglia traspirante e rivestimento lattice sul palmo per grip in ambienti asciutti. Conformità EN 420; prestazioni EN 388 tipiche per abrasione e grip (verificare livelli). Adatto a edilizia, giardinaggio professionale e logistica. Attenzione: contiene lattice naturale — non idoneo in caso di allergia al lattice. Non utilizzare a contatto con oli/solventi che degradano il lattice.$d$
    ),
    (
      '73626',
      'Guanti di precisione VE702PG - poliestere/palmo PU - 09 - grigio - Deltaplus',
      'Deltaplus',
      1.50,
      'https://odmultimedia.eu/immagini/LD/73626.jpg',
      'grigio',
      '09',
      12,
      12,
      $d$Guanti di precisione Deltaplus VE702PG in poliestere con palmo in poliuretano (PU), taglia 09, grigio. Guanto leggero ad alta destrezza per assemblaggio, picking e lavori di finezza: il PU sul palmo garantisce aderenza e resistenza all’abrasione senza irrigidire le dita. EN 420 e, ove marcato, EN 388 per rischi meccanici di base. Ideale in magazzino e produzione. Vendita a multipli di 12 (confezione tipica). Non offre protezione chimica (EN 374) né antitaglio elevato.$d$
    ),
    (
      '76169',
      'Guanti Docker DC103 - pelle crosta bovino - 10 - beige/blu - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/76169.jpg',
      'beige/blu',
      '10',
      12,
      12,
      $d$Guanti Docker Deltaplus DC103 in pelle crosta bovino, taglia 10, beige/blu. Guanto robusto per movimentazione merci, edilizia e lavori pesanti: la crosta bovina resiste ad abrasione e calore moderato da attrito. Requisiti generali EN 420; prestazioni meccaniche secondo EN 388 (verificare pittogramma). Manichetta tipicamente rinforzata per protezione del polso. Vendita a multipli di 12. Non adatto a rischi chimici liquidi; per saldatura preferire modelli certificati EN 407 / EN 12477.$d$
    ),
    (
      '76078',
      'Guanti di precisione VE712GR - poliestere/palmo nitrile - 09 - nero/grigio - Deltaplus',
      'Deltaplus',
      3.00,
      'https://odmultimedia.eu/immagini/LD/76078.jpg',
      'nero/grigio',
      '09',
      10,
      10,
      $d$Guanti di precisione Deltaplus VE712GR in poliestere con palmo in nitrile, taglia 09, nero/grigio. Destrezza elevata e grip migliorato su superfici leggermente oleose grazie al nitrile. Conformità EN 420; EN 388 per abrasione/taglio/strappo/perforazione secondo livelli dichiarati. Ideali per montaggio meccanico, logistica e manutenzione. Vendita a multipli di 10. Controllare usura del rivestimento; non utilizzare come barriera chimica completa se non certificato EN 374.$d$
    ),
    (
      '87183',
      'Guanti Wet&Dry VV636BL - poliammide/palmo nitrile - 10 - blu/nero - Deltaplus',
      'Deltaplus',
      7.00,
      'https://odmultimedia.eu/immagini/LD/87183.jpg',
      'blu/nero',
      '10',
      12,
      12,
      $d$Guanti Deltaplus Wet&Dry VV636BL in poliammide con palmo nitrile, taglia 10, blu/nero. Progettati per ambienti misti asciutto/umido: il rivestimento nitrile migliora l’aderenza su superfici bagnate o leggermente oleose. EN 420 e prestazioni meccaniche EN 388 (verificare marcatura). Adatti a industria alimentare non alimentare-contact specifico, manutenzione e magazzino refrigerato. Vendita a multipli di 12. Verificare eventuali claim food contact sul lotto; non sostituiscono guanti chimici EN 374 per solventi aggressivi.$d$
    ),
    (
      '73644',
      'Guanti per saldatori CA515R - pelle crosta bovino - 10 - rosso - Deltaplus',
      'Deltaplus',
      10.00,
      'https://odmultimedia.eu/immagini/LD/73644.jpg',
      'rosso',
      '10',
      12,
      12,
      $d$Guanti per saldatori Deltaplus CA515R in pelle crosta bovino, taglia 10, rosso. DPI per saldatura e lavori a caldo: pelle spessa contro scintille, calore per contatto e abrasione. Conformità tipica EN 420; rischi termici secondo EN 407 e, per saldatura, EN 12477 ove marcato sul prodotto (verificare tipo A/B). Cuciture rinforzate e manichetto lungo per proteggere avambraccio. Vendita a multipli di 12. Non immergere in liquidi; tenere asciutti e sostituire se irrigiditi o bruciati.$d$
    ),
    (
      '76214',
      'Guanti da lavoro FBN49 - pelle pieno fiore bovino - 10 - bianco - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/76214.jpg',
      'bianco',
      '10',
      12,
      12,
      $d$Guanti da lavoro Deltaplus FBN49 in pelle pieno fiore bovino, taglia 10, bianco. Pelle fiore più flessibile e confortevole della crosta: buona destrezza con resistenza meccanica elevata per edilizia, carpenteria e movimentazione. EN 420; EN 388 per rischi meccanici (controllare livelli). Ideali per uso prolungato dove serve grip e durata. Vendita a multipli di 12. Trattare con prodotti specifici per pelle; non esporre a fiamme libere senza certificazione EN 407.$d$
    ),
    (
      '82101',
      'Guanti per protezione chimica VE509 - neoprene - 09/10 - nero - Deltaplus',
      'Deltaplus',
      5.50,
      'https://odmultimedia.eu/immagini/LD/82101.jpg',
      'nero',
      '09/10',
      null,
      null,
      $d$Guanti per protezione chimica Deltaplus VE509 in neoprene, taglia 09/10, nero. Guanto impermeabile per contatto con detergenti, oli e molte sostanze chimiche industriali (verificare tabella di permeazione del produttore). Conformità EN 420 e protezione chimica EN ISO 374-1 (tipi A/B/C e lettere delle sostanze — controllare marcatura sul lotto); spesso anche EN 388 per rischi meccanici basici. Ideali per manutenzione, pulizie professionali e laboratori. Ispezionare per microfori; non riutilizzare se contaminati da sostanze pericolose oltre le indicazioni.$d$
    ),
    (
      '88941',
      'Guanti per protezione meccanica VE715GR - maglia/nitrile - 08 - grigio - Deltaplus',
      'Deltaplus',
      3.00,
      'https://odmultimedia.eu/immagini/LD/88941.jpg',
      'grigio',
      '08',
      null,
      null,
      $d$Guanti per protezione meccanica Deltaplus VE715GR in maglia con rivestimento nitrile, taglia 08, grigio. DPI per rischi meccanici quotidiani: abrasione, grip e resistenza allo strappo in officina e logistica. EN 420 e EN 388 (verificare i quattro/sei livelli del pittogramma, inclusa eventuale resistenza al taglio ISO). Buona traspirabilità del dorso in maglia. Non destinati a rischi chimici liquidi (EN 374) né a saldatura (EN 407). Sostituire quando il rivestimento è liscio o forato.$d$
    ),
    (
      '88948',
      'Guanti antitaglio Venicut F01 - Xtrem Cut/nitrile - 09 - grigio - Deltaplus',
      'Deltaplus',
      15.00,
      'https://odmultimedia.eu/immagini/LD/88948.jpg',
      'grigio',
      '09',
      null,
      null,
      $d$Guanti antitaglio Deltaplus Venicut F01 (tecnologia Xtrem Cut) con rivestimento nitrile, taglia 09, grigio. Alta protezione dal taglio per manipolazione di lamiere, vetro e utensili affilati, mantenendo destrezza grazie al supporto tecnico e al palmo nitrile. Conformità EN 420 e EN 388 con livello di taglio elevato (verificare codice ISO 13997 / lettera sul pittogramma sul prodotto). Ideali in metalmeccanica e logistica di materiali taglienti. Non proteggono da rischi elettrici o chimici aggressivi; ispezionare dopo ogni taglio sospetto.$d$
    ),
    (
      '73630',
      'Guanti di precisione VE727NO - poliammide/nitrile PU - 09 - grigio/nero - Deltaplus',
      'Deltaplus',
      6.50,
      'https://odmultimedia.eu/immagini/LD/73630.jpg',
      'grigio/nero',
      '09',
      null,
      null,
      $d$Guanti di precisione Deltaplus VE727NO in poliammide con rivestimento nitrile/PU, taglia 09, grigio/nero. Destrezza elevata e grip versatile per assemblaggio fine, elettronica non ESD-specifica e manutenzione di precisione. EN 420; EN 388 per prestazioni meccaniche (controllare marcatura). Il mix nitrile/PU bilancia aderenza e flessibilità. Adatti a turni lunghi grazie al supporto in maglia leggera. Non utilizzare come barriera chimica completa senza EN 374; tenere asciutti e puliti.$d$
    ),
    (
      '91059',
      'Guanti in nitrile non talcato - uso medicale - M/L - azzurro - Logex (scatola 100 pz)',
      'Logex',
      10.00,
      'https://odmultimedia.eu/immagini/LD/91059.jpg',
      'azzurro',
      'M/L (scatola 100 pz)',
      null,
      null,
      $d$Guanti in nitrile non talcato Logex per uso medicale/esame, taglie M/L, azzurro, confezione da 100 pezzi. Monouso, senza polvere (powder-free) per ridurre irritazioni e contaminazione da talco. Indicati per assistenza sanitaria, laboratori e igiene professionale: barriera contro agenti biologici secondo requisiti tipici EN 455 (dispositivi medici) e, ove dichiarato, EN ISO 374-5 per rischi microbici. Alternativa al lattice per ridotto rischio allergico alle proteine del lattice. Monouso: non risterilizzare; smaltire secondo protocollo rifiuti sanitari.$d$
    )
)
update public.products as p
set
  name = r.name,
  brand = r.brand,
  price = r.price,
  image_url = r.image_url,
  color_name = r.color_name,
  format = r.format,
  description = r.description,
  category = 'Sicurezza',
  subcategory = 'Guanti',
  min_order_quantity = r.min_order_quantity,
  order_quantity_step = r.order_quantity_step,
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(
  sku, name, brand, price, image_url, color_name, format,
  min_order_quantity, order_quantity_step, description
) as (
  values
    (
      '97069',
      'Guanti mechanical Safety Palmpro 161 - XL - arancione - Icoguanti',
      'Icoguanti',
      4.00::numeric,
      'https://odmultimedia.eu/immagini/LD/97069.jpg',
      'arancione',
      'XL',
      null::integer,
      null::integer,
      $d$Guanti da lavoro Icoguanti Mechanical Safety Palmpro 161, taglia XL, colore arancione. DPI per le mani destinato a manipolazioni generali e attività meccaniche leggere/medie: palmo rinforzato per grip e resistenza all’abrasione. Conforme ai requisiti generali EN 420 (taglia, comfort, innocuità) e, ove marcato sul lotto, alla EN 388 per rischi meccanici (abrasione, taglio, strappo, perforazione — verificare i livelli sul pittogramma). Ideali per magazzino, assemblaggio e manutenzione. Controllare l’integrità prima dell’uso; sostituire se usurati o contaminati.$d$
    ),
    (
      '97083',
      'Guanti mechanical Safety Palmpro 212 - M - grigio/nero - Icoguanti',
      'Icoguanti',
      4.00,
      'https://odmultimedia.eu/immagini/LD/97083.jpg',
      'grigio/nero',
      'M',
      null,
      null,
      $d$Guanti da lavoro Icoguanti Mechanical Safety Palmpro 212, taglia M, grigio/nero. Modello meccanico con rivestimento sul palmo per aderenza e protezione dall’abrasione in operazioni di movimentazione e montaggio. Rispetta i requisiti EN 420; prestazioni meccaniche secondo EN 388 se presenti sul prodotto (controllare marcatura CE e livelli). Buon equilibrio tra destrezza e resistenza per uso quotidiano in officina e logistica. Non utilizzare a contatto con sostanze chimiche aggressive se non certificato EN 374.$d$
    ),
    (
      '92224',
      'Guanti antistatico VE702PESD - poliestere/carbonio - 08 - bianco - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/92224.jpg',
      'bianco',
      '08',
      null,
      null,
      $d$Guanti antistatici Deltaplus VE702PESD in poliestere con filato al carbonio, taglia 08, bianco. Progettati per ambienti ESD (electrostatic discharge) in elettronica e assemblaggio di componenti sensibili: dissipano le cariche elettrostatiche riducendo il rischio di danneggiamento. Conformi ai requisiti generali EN 420; verificare sul lotto eventuali riferimenti a norme ESD / EN 16350 ove applicabili. Palmo tipicamente in PU per grip e destrezza. Lavare secondo istruzioni del produttore; non utilizzare come protezione chimica o antitaglio.$d$
    ),
    (
      '73637',
      'Guanti da lavoro pesante NI175 - nitrile - 10 - blu - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73637.jpg',
      'blu',
      '10',
      null,
      null,
      $d$Guanti da lavoro pesante Deltaplus NI175 in nitrile, taglia 10, blu. Guanto robusto per manipolazioni impegnative: il nitrile offre buona resistenza a oli, grassi e abrasione rispetto al lattice classico. Destinato a officina, manutenzione e edilizia leggera. Conformità tipica EN 420 e prestazioni meccaniche EN 388 (verificare livelli sul pittogramma). Buona aderenza anche in presenza di residui oleosi. Ispezionare cuciture e rivestimento; sostituire al primo segno di foratura o usura del palmo.$d$
    ),
    (
      '88944',
      'Guanti antistatica Themis VV792 ESD - 08 - ruggine/grigio - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/88944.jpg',
      'ruggine/grigio',
      '08',
      null,
      null,
      $d$Guanti antistatici Deltaplus Themis VV792 ESD, taglia 08, ruggine/grigio. Serie ESD per linee di produzione elettronica e clean area: struttura in maglia con proprietà dissipative per controllare le scariche elettrostatiche. Requisiti generali EN 420; prestazioni meccaniche EN 388 ove marcate; verificare conformità ESD sul certificato del produttore. Rivestimento sul palmo per grip e precisione. Ideali per montaggio PCB e componenti sensibili. Non sostituiscono guanti chimici EN 374 né antitaglio ad alto livello.$d$
    ),
    (
      '73639',
      'Guanti da lavoro pesante NI015 - nitrile leggero - 10 - giallo - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73639.jpg',
      'giallo',
      '10',
      null,
      null,
      $d$Guanti da lavoro pesante Deltaplus NI015 in nitrile leggero, taglia 10, giallo. Versione più snella rispetto ai guanti nitrilici spessi: combina protezione da oli/abrasione con maggiore flessibilità per lavori di precisione media. EN 420 per requisiti generali; EN 388 per rischi meccanici (controllare marcatura). Indicati per assemblaggio, magazzino e manutenzione. Il colore giallo migliora la visibilità del DPI. Conservare al riparo da UV e solventi aggressivi non previsti dalla scheda tecnica.$d$
    ),
    (
      '73633',
      'Guanti da lavoro VE630 - poliestere/palmo lattice - 10 - grigio - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73633.jpg',
      'grigio',
      '10',
      null,
      null,
      $d$Guanti da lavoro Deltaplus VE630 in poliestere con palmo in lattice, taglia 10, grigio. Classico guanto di manipolazione: supporto in maglia traspirante e rivestimento lattice sul palmo per grip in ambienti asciutti. Conformità EN 420; prestazioni EN 388 tipiche per abrasione e grip (verificare livelli). Adatto a edilizia, giardinaggio professionale e logistica. Attenzione: contiene lattice naturale — non idoneo in caso di allergia al lattice. Non utilizzare a contatto con oli/solventi che degradano il lattice.$d$
    ),
    (
      '73626',
      'Guanti di precisione VE702PG - poliestere/palmo PU - 09 - grigio - Deltaplus',
      'Deltaplus',
      1.50,
      'https://odmultimedia.eu/immagini/LD/73626.jpg',
      'grigio',
      '09',
      12,
      12,
      $d$Guanti di precisione Deltaplus VE702PG in poliestere con palmo in poliuretano (PU), taglia 09, grigio. Guanto leggero ad alta destrezza per assemblaggio, picking e lavori di finezza: il PU sul palmo garantisce aderenza e resistenza all’abrasione senza irrigidire le dita. EN 420 e, ove marcato, EN 388 per rischi meccanici di base. Ideale in magazzino e produzione. Vendita a multipli di 12 (confezione tipica). Non offre protezione chimica (EN 374) né antitaglio elevato.$d$
    ),
    (
      '76169',
      'Guanti Docker DC103 - pelle crosta bovino - 10 - beige/blu - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/76169.jpg',
      'beige/blu',
      '10',
      12,
      12,
      $d$Guanti Docker Deltaplus DC103 in pelle crosta bovino, taglia 10, beige/blu. Guanto robusto per movimentazione merci, edilizia e lavori pesanti: la crosta bovina resiste ad abrasione e calore moderato da attrito. Requisiti generali EN 420; prestazioni meccaniche secondo EN 388 (verificare pittogramma). Manichetta tipicamente rinforzata per protezione del polso. Vendita a multipli di 12. Non adatto a rischi chimici liquidi; per saldatura preferire modelli certificati EN 407 / EN 12477.$d$
    ),
    (
      '76078',
      'Guanti di precisione VE712GR - poliestere/palmo nitrile - 09 - nero/grigio - Deltaplus',
      'Deltaplus',
      3.00,
      'https://odmultimedia.eu/immagini/LD/76078.jpg',
      'nero/grigio',
      '09',
      10,
      10,
      $d$Guanti di precisione Deltaplus VE712GR in poliestere con palmo in nitrile, taglia 09, nero/grigio. Destrezza elevata e grip migliorato su superfici leggermente oleose grazie al nitrile. Conformità EN 420; EN 388 per abrasione/taglio/strappo/perforazione secondo livelli dichiarati. Ideali per montaggio meccanico, logistica e manutenzione. Vendita a multipli di 10. Controllare usura del rivestimento; non utilizzare come barriera chimica completa se non certificato EN 374.$d$
    ),
    (
      '87183',
      'Guanti Wet&Dry VV636BL - poliammide/palmo nitrile - 10 - blu/nero - Deltaplus',
      'Deltaplus',
      7.00,
      'https://odmultimedia.eu/immagini/LD/87183.jpg',
      'blu/nero',
      '10',
      12,
      12,
      $d$Guanti Deltaplus Wet&Dry VV636BL in poliammide con palmo nitrile, taglia 10, blu/nero. Progettati per ambienti misti asciutto/umido: il rivestimento nitrile migliora l’aderenza su superfici bagnate o leggermente oleose. EN 420 e prestazioni meccaniche EN 388 (verificare marcatura). Adatti a industria alimentare non alimentare-contact specifico, manutenzione e magazzino refrigerato. Vendita a multipli di 12. Verificare eventuali claim food contact sul lotto; non sostituiscono guanti chimici EN 374 per solventi aggressivi.$d$
    ),
    (
      '73644',
      'Guanti per saldatori CA515R - pelle crosta bovino - 10 - rosso - Deltaplus',
      'Deltaplus',
      10.00,
      'https://odmultimedia.eu/immagini/LD/73644.jpg',
      'rosso',
      '10',
      12,
      12,
      $d$Guanti per saldatori Deltaplus CA515R in pelle crosta bovino, taglia 10, rosso. DPI per saldatura e lavori a caldo: pelle spessa contro scintille, calore per contatto e abrasione. Conformità tipica EN 420; rischi termici secondo EN 407 e, per saldatura, EN 12477 ove marcato sul prodotto (verificare tipo A/B). Cuciture rinforzate e manichetto lungo per proteggere avambraccio. Vendita a multipli di 12. Non immergere in liquidi; tenere asciutti e sostituire se irrigiditi o bruciati.$d$
    ),
    (
      '76214',
      'Guanti da lavoro FBN49 - pelle pieno fiore bovino - 10 - bianco - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/76214.jpg',
      'bianco',
      '10',
      12,
      12,
      $d$Guanti da lavoro Deltaplus FBN49 in pelle pieno fiore bovino, taglia 10, bianco. Pelle fiore più flessibile e confortevole della crosta: buona destrezza con resistenza meccanica elevata per edilizia, carpenteria e movimentazione. EN 420; EN 388 per rischi meccanici (controllare livelli). Ideali per uso prolungato dove serve grip e durata. Vendita a multipli di 12. Trattare con prodotti specifici per pelle; non esporre a fiamme libere senza certificazione EN 407.$d$
    ),
    (
      '82101',
      'Guanti per protezione chimica VE509 - neoprene - 09/10 - nero - Deltaplus',
      'Deltaplus',
      5.50,
      'https://odmultimedia.eu/immagini/LD/82101.jpg',
      'nero',
      '09/10',
      null,
      null,
      $d$Guanti per protezione chimica Deltaplus VE509 in neoprene, taglia 09/10, nero. Guanto impermeabile per contatto con detergenti, oli e molte sostanze chimiche industriali (verificare tabella di permeazione del produttore). Conformità EN 420 e protezione chimica EN ISO 374-1 (tipi A/B/C e lettere delle sostanze — controllare marcatura sul lotto); spesso anche EN 388 per rischi meccanici basici. Ideali per manutenzione, pulizie professionali e laboratori. Ispezionare per microfori; non riutilizzare se contaminati da sostanze pericolose oltre le indicazioni.$d$
    ),
    (
      '88941',
      'Guanti per protezione meccanica VE715GR - maglia/nitrile - 08 - grigio - Deltaplus',
      'Deltaplus',
      3.00,
      'https://odmultimedia.eu/immagini/LD/88941.jpg',
      'grigio',
      '08',
      null,
      null,
      $d$Guanti per protezione meccanica Deltaplus VE715GR in maglia con rivestimento nitrile, taglia 08, grigio. DPI per rischi meccanici quotidiani: abrasione, grip e resistenza allo strappo in officina e logistica. EN 420 e EN 388 (verificare i quattro/sei livelli del pittogramma, inclusa eventuale resistenza al taglio ISO). Buona traspirabilità del dorso in maglia. Non destinati a rischi chimici liquidi (EN 374) né a saldatura (EN 407). Sostituire quando il rivestimento è liscio o forato.$d$
    ),
    (
      '88948',
      'Guanti antitaglio Venicut F01 - Xtrem Cut/nitrile - 09 - grigio - Deltaplus',
      'Deltaplus',
      15.00,
      'https://odmultimedia.eu/immagini/LD/88948.jpg',
      'grigio',
      '09',
      null,
      null,
      $d$Guanti antitaglio Deltaplus Venicut F01 (tecnologia Xtrem Cut) con rivestimento nitrile, taglia 09, grigio. Alta protezione dal taglio per manipolazione di lamiere, vetro e utensili affilati, mantenendo destrezza grazie al supporto tecnico e al palmo nitrile. Conformità EN 420 e EN 388 con livello di taglio elevato (verificare codice ISO 13997 / lettera sul pittogramma sul prodotto). Ideali in metalmeccanica e logistica di materiali taglienti. Non proteggono da rischi elettrici o chimici aggressivi; ispezionare dopo ogni taglio sospetto.$d$
    ),
    (
      '73630',
      'Guanti di precisione VE727NO - poliammide/nitrile PU - 09 - grigio/nero - Deltaplus',
      'Deltaplus',
      6.50,
      'https://odmultimedia.eu/immagini/LD/73630.jpg',
      'grigio/nero',
      '09',
      null,
      null,
      $d$Guanti di precisione Deltaplus VE727NO in poliammide con rivestimento nitrile/PU, taglia 09, grigio/nero. Destrezza elevata e grip versatile per assemblaggio fine, elettronica non ESD-specifica e manutenzione di precisione. EN 420; EN 388 per prestazioni meccaniche (controllare marcatura). Il mix nitrile/PU bilancia aderenza e flessibilità. Adatti a turni lunghi grazie al supporto in maglia leggera. Non utilizzare come barriera chimica completa senza EN 374; tenere asciutti e puliti.$d$
    ),
    (
      '91059',
      'Guanti in nitrile non talcato - uso medicale - M/L - azzurro - Logex (scatola 100 pz)',
      'Logex',
      10.00,
      'https://odmultimedia.eu/immagini/LD/91059.jpg',
      'azzurro',
      'M/L (scatola 100 pz)',
      null,
      null,
      $d$Guanti in nitrile non talcato Logex per uso medicale/esame, taglie M/L, azzurro, confezione da 100 pezzi. Monouso, senza polvere (powder-free) per ridurre irritazioni e contaminazione da talco. Indicati per assistenza sanitaria, laboratori e igiene professionale: barriera contro agenti biologici secondo requisiti tipici EN 455 (dispositivi medici) e, ove dichiarato, EN ISO 374-5 per rischi microbici. Alternativa al lattice per ridotto rischio allergico alle proteine del lattice. Monouso: non risterilizzare; smaltire secondo protocollo rifiuti sanitari.$d$
    )
)
insert into public.products (
  sku, name, price, image_url, brand, category, subcategory,
  description, color_name, format, min_order_quantity, order_quantity_step, stock
)
select
  r.sku,
  r.name,
  r.price,
  r.image_url,
  r.brand,
  'Sicurezza',
  'Guanti',
  r.description,
  r.color_name,
  r.format,
  r.min_order_quantity,
  r.order_quantity_step,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
