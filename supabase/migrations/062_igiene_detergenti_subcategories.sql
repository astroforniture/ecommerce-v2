-- Prodotti per igiene: sottocategorie Detergenti / Attrezzature e Panni / Macchine per Pulizia
-- + descrizioni tecniche aggiornate per i 24 detergenti

with parent as (
  select id from public.office_catalog_categories where slug = 'prodotti-per-igiene'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select v.name, v.slug, v.listing_path, v.cover_image_url, parent.id, v.sort_order, true
from parent
cross join (
  values
    (
      'Detergenti',
      'igiene-detergenti',
      '/office-products?category=Prodotti%20per%20igiene&subcategory=Detergenti',
      'https://odmultimedia.eu/immagini/MD/103584.jpg',
      10
    ),
    (
      'Attrezzature e Panni',
      'igiene-attrezzature-panni',
      '/office-products?category=Prodotti%20per%20igiene&subcategory=Attrezzature%20e%20Panni',
      'https://odmultimedia.eu/immagini/MD/70970.jpg',
      20
    ),
    (
      'Macchine per Pulizia',
      'igiene-macchine-pulizia',
      '/office-products?category=Prodotti%20per%20igiene&subcategory=Macchine%20per%20Pulizia',
      'https://odmultimedia.eu/immagini/MD/102069.jpg',
      30
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

-- Attrezzature e Panni
update public.products
set subcategory = 'Attrezzature e Panni'
where category = 'Prodotti per igiene'
  and sku in (
    '102066', '105942', '95310',
    '74092', '74076', '70970', '91807', '74085', '74090',
    '91814', '74079'
  );

-- Macchine per Pulizia
update public.products
set subcategory = 'Macchine per Pulizia'
where category = 'Prodotti per igiene'
  and sku in ('102069', '105442');

-- Detergenti (24) + descrizioni tecniche
with rows(sku, description) as (
  values
    (
      '103584',
      $d$Detergente disinfettante concentrato Lysoform Plus per pavimenti duri e superfici lavabili. Formulazione professionale ad azione detergente e igienizzante, idonea ai piani di sanificazione in ambienti civili e commerciali. Profumazione «freschezza alpina». Dosaggio tipico: diluire in acqua secondo le indicazioni in etichetta (generalmente poche decine di ml per litro d’acqua per la manutenzione ordinaria). Applicare con mop, frangia o lavasciuga; non miscelare con prodotti a base di ammoniaca o acidi. Tanica da 5 L per uso intensivo.$d$
    ),
    (
      '93248',
      $d$Sgrassatore disinfettante Chanteclair Up Side Down in flacone spray ergonomico da 600 ml, utilizzabile anche a testa in giù per raggiungere punti difficili. Agisce su grassi di cucina, residui alimentari e sporco tenace su piani di lavoro, piastre, forni e superfici lavabili. Ideale in cucine professionali e ambienti H.A.C.C.P. Spruzzare, lasciare agire secondo etichetta, risciacquare se richiesto dalle istruzioni del produttore. Non utilizzare su superfici delicate non compatibili con sgrassatori alcalini.$d$
    ),
    (
      '105934',
      $d$Spray multiuso Amuchina Professional Superfici per la disinfezione di superfici dure non porose. Azione battericida e virucida dichiarata dal produttore; adatto a uffici, ambulatori, negozi e aree ad alto passaggio. Flacone trigger da 750 ml pronto all’uso: spruzzare uniformemente, lasciare agire il tempo di contatto indicato in etichetta, quindi asciugare o risciacquare se previsto. Non diluire. Conservare lontano da fonti di calore e tenere fuori dalla portata dei bambini.$d$
    ),
    (
      '61002',
      $d$Crema abrasiva delicata Cif classica sgrassante, confezione professionale da 2 L. Ideale per smacchiare e lucidare lavelli, piani in ceramica/acciaio, piastrelle e sanitari, rimuovendo calcare leggero, grasso e aloni. Applicare con spugna umida, strofinare, risciacquare abbondantemente. Non usare su superfici delicate, legno non protetto o materiali abrasione-sensibili. Adatta a pulizie quotidiane in bagni e cucine di uffici e attività commerciali.$d$
    ),
    (
      '105817',
      $d$Detergente bagno Alca Bio in trigger da 750 ml, fragranza eucalipto. Formulato per sanitari, rubinetterie, cabine doccia e superfici smaltate: rimuove residui di sapone, aloni e sporco quotidiano lasciando una sensazione di freschezza. Pronto all’uso: spruzzare, lasciare agire brevemente, risciacquare. Adatto a routine di igiene in bagni aziendali e strutture ricettive. Verificare compatibilità su materiali sensibili prima dell’uso prolungato.$d$
    ),
    (
      '91763',
      $d$Detergente alcalino universale Sanitec Matic Floor, tanica 5 L per uso professionale e macchine lavapavimenti. Elevato potere sgrassante su pavimenti industriali, ceramica, gres e superfici lavabili soggette a traffico intenso. Ideale in piani di sanificazione H.A.C.C.P. di cucine, laboratori e aree produttive. Dosare in acqua secondo scheda tecnica (concentrazioni tipiche basse per manutenzione, più elevate per sporco pesante). Non mischiare con acidi o candeggina.$d$
    ),
    (
      '98685',
      $d$Detergente professionale Chanteclair H24 per bagno, flacone trigger 700 ml. Azione igienizzante dedicata a sanitari, docce, piastrelle e superfici umide: contrasta calcare, sapone e odori. Pronto all’uso per interventi quotidiani in bagni di uffici, palestre e strutture collettive. Spruzzare, lasciare agire, passare con panno o risciacquare. Seguire le precauzioni d’uso e i pittogrammi di sicurezza riportati in etichetta.$d$
    ),
    (
      '76401',
      $d$Candeggina in gel igienizzante Amacasa, confezione 1500 ml. Consistenza gel per un’adesione prolungata su superfici verticali (sanitari, scarichi, piastrelle). Azione sbiancante e igienizzante su macchie organiche e residui difficili. Applicare sul punto da trattare, lasciare agire secondo etichetta, risciacquare. Non miscelare mai con acidi (sviluppo di gas pericolosi) né con ammoniaca. Usare guanti e aerare l’ambiente durante l’applicazione.$d$
    ),
    (
      '67538',
      $d$Candeggina liquida igienizzante Amacasa da 1 L, profumo floreale. Adatta a sbiancare e igienizzare superfici lavabili, pavimenti e tessuti resistenti al cloro, secondo le diluizioni indicate in etichetta. Utilizzo tipico: diluire in acqua fredda per la pulizia ordinaria; non impiegare su lana, seta o colori non solidi. Non mischiare con detergenti acidi o a base ammoniacale. Conservare in luogo fresco, al riparo dalla luce.$d$
    ),
    (
      '61000',
      $d$Detergente concentrato per piatti Scric in tanica professionale da 5 L. Elevato potere sgrassante su stoviglie, posate e utensili da cucina; genera schiuma controllata e risciacquo facilitato. Ideale per lavaggio manuale in cucine collettive, mensa e bar. Dosare poche gocce o ml in acqua calda secondo intensità dello sporco. Compatibile con piani di igiene alimentare se usato correttamente e seguito da risciacquo accurato.$d$
    ),
    (
      '91733',
      $d$Sgrassatore disinfettante Sanitec Multi Activ, trigger 750 ml, fragranza pino. Formulazione professionale multiuso per cucine, piani di lavoro, attrezzature e superfici lavabili: combina azione sgrassante e disinfettante. Pronto all’uso; spruzzare, lasciare il tempo di contatto indicato, risciacquare se richiesto. Adatto ad ambienti con requisiti H.A.C.C.P. Non utilizzare su alluminio anodizzato o superfici non compatibili con alcali senza prova preliminare.$d$
    ),
    (
      '99945',
      $d$Detergente per pavimenti Smac Express «freschezza intensa», flacone 1 L pronto all’uso o da diluire secondo etichetta. Rimuove lo sporco quotidiano da ceramica, gres, marmo trattato e superfici lavabili, lasciando una fragranza intensa e ambienti più freschi. Ideale per uffici, negozi e aree comuni. Applicare con mop o frangia ben strizzata; non richiedere risciacquo se previsto dal produttore. Evitare eccessi di prodotto per non lasciare aloni.$d$
    ),
    (
      '60997',
      $d$Sgrassatore per pavimenti Svelto alla fragranza limone, tanica 5 L. Detergente professionale ad alto potere sgrassante per pavimenti di cucine, mense e aree industriali leggere. Diluire in acqua secondo scheda tecnica; applicare a mop, lavasciuga o straccio. Efficace su grassi alimentari e calpestio. Non miscelare con candeggina o acidi. Conservare chiuso e al riparo dal gelo.$d$
    ),
    (
      '105939',
      $d$Acqua demineralizzata Amacasa in tanica da 2 L. Acqua demineralizzata/deionizzata per uso tecnico: rabbocco ferri da stiro, umidificatori, autoclave leggera, diluizioni di prodotti concentrati e pulizia di vetri/specchi senza residui calcarei. Non potabile. Conservare a temperatura ambiente, chiusa ermeticamente per evitare contaminazioni. Ideale a supporto delle operazioni di igiene professionale.$d$
    ),
    (
      '96808',
      $d$Detergente alcalino Sanitec Matic Extra per sporco pesante, tanica 5 L. Formulazione ad elevata alcalinità destinata a pavimenti e superfici molto sporche (officine, cucine industriali, aree logistiche). Utilizzabile a mano o con macchine lavapavimenti. Dosare con attenzione secondo scheda di sicurezza e tecnica; risciacquare se necessario. Non impiegare su superfici delicate, legno o alluminio sensibili. DPI consigliati: guanti e occhiali in caso di manipolazione concentrata.$d$
    ),
    (
      '49805',
      $d$Candeggina in gel WC Net Instant White, flacone 700 ml. Gel addensato per la pulizia e l’igienizzazione di WC e superfici verticali del bagno: aderisce sotto il bordo e nelle zone critiche. Azione sbiancante su aloni e residui. Applicare, lasciare agire, spazzolare se serve e risciacquare. Non mischiare con altri detergenti (in particolare acidi). Aerare il locale durante l’uso.$d$
    ),
    (
      '106019',
      $d$Igienizzante multiuso Amuchina Professional senza risciacquo, flacone 750 ml. Pensato per la sanificazione rapida di superfici dure non porose tra un intervento e l’altro: uffici, reception, spogliatoi, punti vendita. Pronto all’uso; spruzzare e lasciare asciugare secondo le indicazioni del produttore (senza risciacquo se dichiarato in etichetta). Verificare compatibilità con materiali sensibili. Tenere lontano da alimenti non protetti durante l’applicazione.$d$
    ),
    (
      '95921',
      $d$Disinfettante detergente alcolico Tekna, flacone 400 ml. Soluzione a base alcolica per la disinfezione rapida di superfici e dispositivi non invasivi, con azione detergente concomitante. Ideale per piani di lavoro, maniglie, strumentazione e punti di contatto frequenti. Applicare con panno o spruzzo (se previsto), lasciare evaporare il tempo di contatto indicato. Infiammabile: tenere lontano da fiamme e scintille; usare in ambienti aerati.$d$
    ),
    (
      '105949',
      $d$Profumatore Deo Spray Sanitec Gold Argan per ambienti e tessuti, trigger 300 ml. Elimina gli odori e lascia una nota olfattiva calda e persistente su tende, divani, moquette e aria ambienti (secondo istruzioni). Spruzzare a distanza, evitando il contatto diretto con occhi e superfici delicate. Non saturare i tessuti; effettuare prova su angolo nascosto. Complemento ideale alle routine di pulizia in uffici, hotel e aree comuni.$d$
    ),
    (
      '49804',
      $d$Disincrostante disinfettante WC Net, flacone 700 ml. Formulazione acida per rimuovere calcare, urina e incrostazioni da WC, bidet e scarichi, con azione disinfettante dichiarata. Applicare sotto il bordo e sulle superfici interne, lasciare agire, spazzolare e risciacquare. Non miscelare con candeggina o prodotti clorati (rischio di vapori tossici). Usare guanti e aerare il bagno.$d$
    ),
    (
      '96806',
      $d$Detergente pavimenti Sanitec Sirpav HC a schiuma controllata, fragranza pino, tanica 5 L. Ideale per lavaggio manuale o meccanizzato di grandi superfici: genera schiuma facile da gestire e un buon potere detergente su sporco urbano e calpestio. Dosare in acqua secondo scheda tecnica. Adatto a ceramica, gres e pavimenti lavabili di centri commerciali, scuole e aziende. Non miscelare con altri detergenti ad azione contrastante.$d$
    ),
    (
      '86246',
      $d$Detergente disinfettante Sanitec Bakterio, flacone 1 L, fragranza pino balsamico. Prodotto professionale per la detergazione e disinfezione di superfici lavabili in ambienti civili e sanitari leggeri. Diluire secondo etichetta per pavimenti e superfici; tempo di contatto essenziale per l’efficacia disinfettante. Idoneo a piani di sanificazione periodica. Non abbinare a prodotti a base di cloro o acidi forti.$d$
    ),
    (
      '74144',
      $d$Detergente per pavimenti Alca Jolie, flacone 1 L, bouquet floreale/speziato. Detergente quotidiano per la manutenzione di pavimenti domestici e professionali leggeri: rimuove lo sporco e lascia una fragranza piacevole e persistente. Diluire in acqua secondo indicazioni; applicare a mop ben strizzato. Non richiede sempre risciacquo (verificare etichetta). Evitare ristagni di prodotto sui parquet non protetti.$d$
    ),
    (
      '99954',
      $d$Detersivo liquido per lavatrice Deox Colorati e Scuri, flacone 1,5 L. Formulato per preservare intensità e brillantezza dei tessuti scuri e colorati, contrastando lo sbiadimento tipico dei lavaggi frequenti. Dosare in base alla durezza dell’acqua e al carico, secondo tabella in etichetta. Adatto a cicli a 30–40 °C e lavaggi professionali leggeri di divise/teli. Non usare come pretrattamento aggressivo su fibre delicate senza prova.$d$
    )
)
update public.products as p
set
  subcategory = 'Detergenti',
  description = r.description
from rows as r
where p.sku = r.sku
  and p.category = 'Prodotti per igiene';
