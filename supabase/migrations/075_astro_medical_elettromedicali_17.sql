-- Astro Medical Shop: 17 elettromedicali GIMA — inserimento solo se assenti
-- Deduplica su sku gima-*, sku numerico e nome (case-insensitive)

create temporary table tmp_astro_medical_elettromed (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  subcategory text not null,
  brochure_url text,
  variants jsonb,
  description text not null
) on commit drop;

insert into tmp_astro_medical_elettromed (
  sku, name, brand, price, image_url, subcategory, brochure_url, variants, description
)
values
  (
    'gima-24050',
    'ANALIZZATORE URINA URILYZER 500 PRO con stampante',
    'Gima',
    3000.00,
    'https://www.gimaitaly.com/images/prodotti/medium/24050.jpg',
    'Elettromedicali',
    null,
    null::jsonb,
    $d$Analizzatore urinario Urilyzer 500 PRO con stampante integrata (cod. GIMA 24050). Strumento professionale per screening urinari ad alto volume in laboratorio e ambulatorio: lettura automatica delle strisce, gestione risultati e stampa immediata dei referti. Ideale per strutture sanitarie e poliambulatori. Verificare strisce e consumabili compatibili sulla scheda tecnica del produttore. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-56800',
    'DENSITOMETRO OSSEO AD ULTRASUONI SUNLIGHT MINIOMNI PER LA VALUTAZIONE DELL''OSTEOPOROSI con sonda CM + software - adulti',
    'Gima',
    12000.00,
    'https://www.gimaitaly.com/images/prodotti/medium/56800.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=56800',
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/56800_b.jpg","https://www.gimaitaly.com/images/prodotti/medium/56800_c.jpg","https://www.gimaitaly.com/images/prodotti/medium/56800_d.jpg","https://www.gimaitaly.com/images/prodotti/medium/56800_e.jpg"]}'::jsonb,
    $d$Densitometro osseo a ultrasuoni Sunlight MiniOmni (cod. GIMA 56800) per valutazione dell’osteoporosi negli adulti, completo di sonda CM e software. Soluzione non invasiva per screening della densità ossea in ambulatorio e centri diagnostici, senza radiazioni ionizzanti. Include gestione dati paziente e reportistica secondo configurazione produttore. Consultare la scheda tecnica ufficiale per protocolli d’uso e requisiti di installazione. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-28123',
    'AEROSOL SMART',
    'Gima',
    30.00,
    'https://www.gimaitaly.com/images/prodotti/medium/28123.jpg',
    'Elettromedicali',
    null,
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/28123_b.jpg"]}'::jsonb,
    $d$Aerosol Smart (cod. GIMA 28123). Nebulizzatore compatto per terapia aerosolica domestica e ambulatoriale leggera: utilizzo intuitivo, dimensioni ridotte e manutenzione semplice. Indicato per la somministrazione di soluzioni prescritte secondo protocollo sanitario. Verificare accessori e filtri di ricambio sulla scheda prodotto. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-28065',
    'AEROSOL MESH INDOSSABILE',
    'Gima',
    55.00,
    'https://www.gimaitaly.com/images/prodotti/medium/28065.jpg',
    'Elettromedicali',
    null,
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/28065_d.jpg","https://www.gimaitaly.com/images/prodotti/medium/28065_e.jpg"]}'::jsonb,
    $d$Aerosol mesh indossabile (cod. GIMA 28065). Tecnologia a rete vibrante per nebulizzazione silenziosa e portatile, adatta a uso continuo o on-the-go. Ideale per pazienti che necessitano di terapia aerosolica senza vincoli di rete elettrica fissa (secondo autonomia batteria dichiarata). Facile da indossare e da sanificare. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-28338',
    'MAGNETOTERAPIA MAG 1000 - 2 canali',
    'Gima',
    250.00,
    'https://www.gimaitaly.com/images/prodotti/medium/28338.jpg',
    'Elettromedicali',
    null,
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/28338_a.jpg"]}'::jsonb,
    $d$Apparecchio di magnetoterapia MAG 1000 a 2 canali (cod. GIMA 28338). Dispositivo per trattamenti di magnetoterapia a bassa frequenza in ambito fisioterapico e riabilitativo: due uscite indipendenti per gestire più applicatori o zone. Programmi e intensità secondo manuale produttore; abbinabile ad accessori dedicati (es. materasso TAP2000). Uso professionale. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-28339',
    'MATERASSO TAP2000 PER MAGNETOTERAPIA',
    'Gima',
    160.00,
    'https://www.gimaitaly.com/images/prodotti/medium/28339.jpg',
    'Elettromedicali',
    null,
    null,
    $d$Materasso TAP2000 per magnetoterapia (cod. GIMA 28339). Accessorio a grande superficie per trattamenti total body o ampi distretti, pensato per l’abbinamento con generatori di magnetoterapia della linea (es. MAG 1000). Facilita il posizionamento del paziente e l’erogazione uniforme del campo secondo configurazione. Verificare compatibilità connettore/canale sullo strumento. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-33234',
    'ECG CARDIONICA A 1 CANALE CON AFIB e BLUETOOTH',
    'Gima',
    150.00,
    'https://www.gimaitaly.com/images/prodotti/medium/33234.jpg',
    'Elettromedicali',
    null,
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/33234_b.jpg","https://www.gimaitaly.com/images/prodotti/medium/33234_c.jpg","https://www.gimaitaly.com/images/prodotti/medium/33234_d.jpg"]}'::jsonb,
    $d$ECG Cardionica a 1 canale con rilevazione AFib e Bluetooth (cod. GIMA 33234). Elettrocardiografo compatto per screening ambulatoriale e monitoraggio: tracciato mono-canale, algoritmo dedicato alla fibrillazione atriale e trasferimento dati via Bluetooth verso dispositivi/software compatibili. Adatto a medicina generale e controlli rapidi. Seguire istruzioni di posizionamento elettrodi e qualità del segnale. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-34606',
    'CONCENTRATORE DI OSSIGENO SILENT 5 litri',
    'Gima',
    600.00,
    'https://www.gimaitaly.com/images/prodotti/medium/34606.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=34606',
    null,
    $d$Concentratore di ossigeno Silent 5 litri (cod. GIMA 34606). Unità stazionaria a basso rumore per ossigenoterapia a lungo termine in ambito domiciliare o ambulatoriale: portata fino a 5 L/min secondo specifiche, funzionamento continuo da rete elettrica. Ideale dove è richiesta continuità terapeutica con comfort acustico. Consultare la scheda tecnica per purezza O₂, allarmi e manutenzione filtri. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-34589',
    'CONCENTRATORE DI OSSIGENO PORTATILE SPIRIT 1l',
    'Gima',
    1800.00,
    'https://www.gimaitaly.com/images/prodotti/medium/34589.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=34589',
    null,
    $d$Concentratore di ossigeno portatile Spirit 1 L (cod. GIMA 34589). Soluzione mobile per pazienti che necessitano di ossigenoterapia fuori casa: autonomia a batteria, peso contenuto e modalità di erogazione secondo scheda produttore. Indicato per mobilità quotidiana sotto supervisione sanitaria. Verificare autonomia dichiarata, ricariche e accessori (cannule, borse). Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-56600',
    'VENTILATORE DI EMERGENZA SHANGRILA 510S',
    'Gima',
    3900.00,
    'https://www.gimaitaly.com/images/prodotti/medium/56600.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=56600',
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/56600_a.jpg","https://www.gimaitaly.com/images/prodotti/medium/56600_c.jpg","https://www.gimaitaly.com/images/prodotti/medium/56600_e.jpg"]}'::jsonb,
    $d$Ventilatore di emergenza Shangrila 510S (cod. GIMA 56600). Ventilatore portatile per supporto respiratorio in emergenza, trasporto e scenari pre-ospedalieri: modalità ventilative e allarmi secondo configurazione CE del produttore. Destinato a personale sanitario formato. Consultare la scheda tecnica per circuiti paziente, alimentazione e autonomia. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-34502',
    'BOMBOLA OSSIGENO 2 l - riduttore UNI',
    'Gima',
    270.00,
    'https://www.gimaitaly.com/images/prodotti/medium/picture_nd.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=34502',
    null,
    $d$Bombola ossigeno da 2 litri con riduttore UNI (cod. GIMA 34502). Kit per ossigenoterapia o backup di emergenza in ambito sanitario: capacità 2 L e riduttore conforme attacco UNI. Gestione, ricarica e stoccaggio secondo normative gas medicali e istruzioni del fornitore. Verificare stato di riempimento e scadenze collaudo. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-29585',
    'MONITOR FETALE GIMA CMS800G',
    'Gima',
    750.00,
    'https://www.gimaitaly.com/images/prodotti/medium/29585.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=29585',
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/29585_a.jpg"]}'::jsonb,
    $d$Monitor fetale Gima CMS800G (cod. GIMA 29585). Cardiotocografo per monitoraggio del battito cardiaco fetale e delle contrazioni uterine in ambulatorio ostetrico: display, stampante/tracce e sonde secondo allestimento. Strumento per personale sanitario ostetrico/ginecologico. Consultare scheda tecnica per accessori e protocolli. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-32000',
    'CAMERA A RAGGI-X PORTATILE REMEX KA6 con collimatore',
    'Gima',
    11000.00,
    'https://www.gimaitaly.com/images/prodotti/medium/32000.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=32000',
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/32000_b.jpg","https://www.gimaitaly.com/images/prodotti/medium/32000_c.jpg","https://www.gimaitaly.com/images/prodotti/medium/32000_d.jpg"]}'::jsonb,
    $d$Camera a raggi-X portatile Remex KA6 con collimatore (cod. GIMA 32000). Generatore radiografico mobile per acquisizioni in ambulatorio, pronto soccorso o setting remoti: potenza e collimazione per limitare il campo irradiato. Destinato esclusivamente a operatori abilitati in radiologia. Installazione, schermature e dosimetria secondo normativa vigente e scheda produttore. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-32010',
    'CAMERA A RAGGI-X PORTATILE DIGITALE REMEX T-100',
    'Gima',
    3000.00,
    'https://www.gimaitaly.com/images/prodotti/medium/32010.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=32010',
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/32010_b.jpg","https://www.gimaitaly.com/images/prodotti/medium/32010_c.jpg","https://www.gimaitaly.com/images/prodotti/medium/32010_d.jpg","https://www.gimaitaly.com/images/prodotti/medium/32010_e.jpg"]}'::jsonb,
    $d$Camera a raggi-X portatile digitale Remex T-100 (cod. GIMA 32010). Sistema radiografico digitale mobile per acquisizione e visualizzazione immediata delle immagini, adatto a setting clinici che richiedono mobilità. Uso riservato a personale autorizzato; requisiti di radioprotezione e formazione obbligatori. Dettagli su detector, connettività e dosi sulla scheda tecnica. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-35562',
    'LAVASTRUMENTI TUTTNAUER senza sistema di asciugatura',
    'Tuttnauer',
    6000.00,
    'https://www.gimaitaly.com/images/prodotti/medium/35562.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=35562',
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/35562_a.jpg"]}'::jsonb,
    $d$Lavastrumenti Tuttnauer senza sistema di asciugatura (cod. GIMA 35562). Macchina per il lavaggio/disinfezione termica dello strumentario in CSSD e ambulatori chirurgici: cicli validabili e gestione carico secondo specifiche produttore. Versione senza modulo di asciugatura integrato (asciugatura esterna o processo successivo). Ideale per centrali di sterilizzazione di medie dimensioni. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-35563',
    'LAVASTRUMENTI TUTTNAUER con sistema di asciugatura',
    'Tuttnauer',
    7000.00,
    'https://www.gimaitaly.com/images/prodotti/medium/35563.jpg',
    'Elettromedicali',
    'https://www.gimaitaly.com/Catalogo/PrintDataSheet?sku=35563',
    null,
    $d$Lavastrumenti Tuttnauer con sistema di asciugatura (cod. GIMA 35563). Versione completa con asciugatura integrata per ottimizzare il flusso lavaggio–asciugatura dello strumentario prima della sterilizzazione. Destinata a CSSD e strutture chirurgiche. Consultare scheda tecnica per capacità camera, consumi e cicli. Prezzo unitario imponibile IVA esclusa.$d$
  ),
  (
    'gima-24600',
    'ANALIZZATORE IMMUNOLOGICO DI FLUORESCENZA',
    'Gima',
    1100.00,
    'https://www.gimaitaly.com/images/prodotti/big/24600.jpg',
    'Elettromedicali',
    null,
    '{"gallery":["https://www.gimaitaly.com/images/prodotti/medium/24600_a.jpg","https://www.gimaitaly.com/images/prodotti/medium/24600_b.jpg","https://www.gimaitaly.com/images/prodotti/medium/24600_c.jpg"]}'::jsonb,
    $d$Analizzatore immunologico a fluorescenza (cod. GIMA 24600). Piattaforma POCT/laboratorio leggero per lettura di cassette immunoanalitiche (es. marker cardiaci, infettivologici, metabolici secondo menu disponibile). Risultati rapidi per supporto decisionale clinico; cassette e lotto da verificare sul catalogo consumabili. Uso professionale. Prezzo unitario imponibile IVA esclusa.$d$
  );

create temporary table tmp_astro_medical_dedupe_report (
  sku text primary key,
  name text not null,
  esito text not null,
  match_sku text
) on commit drop;

insert into tmp_astro_medical_dedupe_report (sku, name, esito, match_sku)
select
  t.sku,
  t.name,
  'SKIP_ALREADY_PRESENT',
  p.sku
from tmp_astro_medical_elettromed t
join lateral (
  select p0.sku
  from public.products p0
  where
    p0.sku = t.sku
    or p0.sku = replace(t.sku, 'gima-', '')
    or lower(trim(p0.name)) = lower(trim(t.name))
  order by
    case
      when p0.sku = t.sku then 0
      when p0.sku = replace(t.sku, 'gima-', '') then 1
      else 2
    end
  limit 1
) p on true;

insert into public.products (
  sku, name, price, image_url, brand, category, subcategory,
  description, brochure_url, variants, stock
)
select
  t.sku,
  t.name,
  t.price,
  t.image_url,
  t.brand,
  'Linea Specializzata Astro Medical',
  t.subcategory,
  t.description,
  t.brochure_url,
  t.variants,
  20
from tmp_astro_medical_elettromed t
where not exists (
  select 1 from tmp_astro_medical_dedupe_report r where r.sku = t.sku
);

insert into tmp_astro_medical_dedupe_report (sku, name, esito, match_sku)
select t.sku, t.name, 'INSERTED', t.sku
from tmp_astro_medical_elettromed t
where not exists (
  select 1 from tmp_astro_medical_dedupe_report r where r.sku = t.sku
);

select sku, name, esito, match_sku
from tmp_astro_medical_dedupe_report
order by
  case when esito = 'SKIP_ALREADY_PRESENT' then 0 else 1 end,
  sku;
