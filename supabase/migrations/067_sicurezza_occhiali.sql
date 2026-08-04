-- Sicurezza → sottocategoria Occhiali (20 DPI occhi)

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Occhiali',
  'sicurezza-occhiali',
  '/office-products?category=Sicurezza&subcategory=Occhiali',
  'https://odmultimedia.eu/immagini/MD/76211.jpg',
  parent.id,
  40,
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

with rows(sku, name, brand, price, image_url, color_name, format, description) as (
  values
    (
      '76211',
      'Occhiali Fuji 2 Gradient - policarbonato - Deltaplus',
      'Deltaplus',
      20.00::numeric,
      'https://odmultimedia.eu/immagini/MD/76211.jpg',
      null::text,
      'policarbonato',
      $d$Occhiali di protezione Deltaplus Fuji 2 Gradient in policarbonato. DPI per gli occhi con lente a gradiente per uso misto interno/esterno: riduce l’abbagliamento mantenendo buona visibilità. Classe ottica tipicamente 1 per uso continuo; conformità EN 166 (protezione personale occhi) e filtri UV secondo EN 170 ove marcati. Trattamenti antigraffio e/o antiappannamento verificabili sull’etichetta del lotto. Ideali per officina, magazzino e manutenzione. Conservare in custodia; sostituire se graffi profondi compromettono la visione.$d$
    ),
    (
      '79718',
      'Occhiali di protezione Virtua AP - policarbonato - grigio - 3M',
      '3M',
      7.00,
      'https://odmultimedia.eu/immagini/MD/79718.jpg',
      'grigio',
      'policarbonato',
      $d$Occhiali di protezione 3M Virtua AP in policarbonato, lente grigia. Design wraparound per copertura laterale e comfort prolungato. Classe ottica 1 (uso continuo) tipica della serie Virtua; conformità EN 166 e filtro solare EN 172 per riduzione dell’abbagliamento (lente grigia). Protezione UV secondo marcatura EN 170/EN 172 sul prodotto. Indicati per esterni, edilizia e logistica. Non utilizzare per saldatura o raggi IR intensi senza filtro EN 169 adeguato.$d$
    ),
    (
      '79717',
      'Occhiali di protezione Virtua AP - policarbonato - trasparente - 3M',
      '3M',
      7.00,
      'https://odmultimedia.eu/immagini/MD/79717.jpg',
      'trasparente',
      'policarbonato',
      $d$Occhiali di protezione 3M Virtua AP in policarbonato, lente trasparente. Stessa famiglia del modello grigio: calotta leggera, aderenza stabile e ampia area di visione. Classe ottica 1; EN 166 per rischi meccanici da impatto a bassa energia; protezione UV EN 170 tipica delle lenti chiare 3M. Ideali per interni, assemblaggio e laboratori. Pulire con panni microfibra e detergenti neutri; non usare solventi aggressivi sulle lenti trattate.$d$
    ),
    (
      '73584',
      'Occhiali monolente Piton Clear - incolore - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73584.jpg',
      'incolore',
      'monolente policarbonato',
      $d$Occhiali monolente Deltaplus Piton Clear, incolore. Struttura a lente unica in policarbonato per protezione frontale e laterale economica e leggera. Conformità EN 166; classe ottica tipicamente 1; filtro UV EN 170 su lenti chiare ove marcato. Adatti a visitatori, magazzino e lavori generici a basso rischio. Verificare simbologia F/B per resistenza agli urti. Sostituire alla prima crepa o opacizzazione della lente.$d$
    ),
    (
      '92223',
      'Occhiali Brava2 - policarbonato - lente antiappannamento - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/92223.jpg',
      null,
      'policarbonato antiappannamento',
      $d$Occhiali Deltaplus Brava2 in policarbonato con trattamento antiappannamento. Pensati per ambienti umidi o con sbalzi termici (celle, cucine professionali, esterni freschi). EN 166, classe ottica 1 tipica; UV EN 170; trattamento N (anti-fog) e spesso K (antigraffio) se presenti sulla marcatura. Buona copertura e comfort per uso prolungato. Non strofinare a secco la lente trattata; seguire istruzioni di manutenzione Deltaplus.$d$
    ),
    (
      '79692',
      'Occhiali a maschera Galeras Smoke - policarbonato/PVC - Deltaplus',
      'Deltaplus',
      11.00,
      'https://odmultimedia.eu/immagini/LD/79692.jpg',
      'smoke',
      'maschera policarbonato/PVC',
      $d$Occhiali a maschera Deltaplus Galeras Smoke in policarbonato con corpo in PVC, lente fumé. Protezione avvolgente contro polveri, schegge e schizzi: tenuta perimetrale superiore agli occhiali a stanghetta. EN 166 (spesso con simboli di liquidi/polveri se marcati); lente smoke con filtro solare EN 172; UV secondo marcatura. Indicati per edilizia, falegnameria e ambienti polverosi all’aperto. Controllare l’integrità della guarnizione e la ventilazione per ridurre l’appannamento.$d$
    ),
    (
      '73586',
      'Occhiali per saldatura Pacaya T5 - policarbonato/nylon - Deltaplus',
      'Deltaplus',
      20.00,
      'https://odmultimedia.eu/immagini/LD/73586.jpg',
      null,
      'saldatura policarbonato/nylon',
      $d$Occhiali per saldatura Deltaplus Pacaya T5 in policarbonato/nylon. DPI specifici per saldatura e taglio: filtri secondo EN 169 (numero di scala tipicamente T5 / scala 5 — verificare marcatura sul lotto) per attenuare luce intensa e radiazioni UV/IR tipiche dei processi. Struttura EN 166 per tenuta e resistenza meccanica. Non sostituiscono maschere elettroniche ad alte temperature se il rischio lo richiede; usare solo per i processi e le scale dichiarate. Controllare usura della lente filtrante prima di ogni sessione.$d$
    ),
    (
      '73583',
      'Occhiali a maschera Ruiz 1 - policarbonato/PVC - incolore - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/73583.jpg',
      'incolore',
      'maschera policarbonato/PVC',
      $d$Occhiali a maschera Deltaplus Ruiz 1 in policarbonato/PVC, lente incolore. Mascherina economica per protezione da polveri e schizzi liquidi in manutenzione e pulizie. Conformità EN 166; classe ottica 1 ove dichiarata; UV EN 170 su lente chiara. Buona alternativa agli occhiali a stanghetta quando serve copertura completa. Verificare simbologie 3/4/5 (liquidi/polveri fini) se presenti. Pulire dopo uso con detergenti neutri; non esporre a solventi che attaccano il PVC.$d$
    ),
    (
      '79722',
      'Occhiali di protezione Securefit SF202AF - policarbonato - grigio - 3M',
      '3M',
      12.50,
      'https://odmultimedia.eu/immagini/LD/79722.jpg',
      'grigio',
      'policarbonato AF',
      $d$Occhiali 3M SecureFit SF202AF in policarbonato, lente grigia con tecnologia antiappannamento (AF). Sistema SecureFit a pressione differenziata sulle stanghette per tenuta senza tensione eccessiva. Classe ottica 1; EN 166; filtro solare EN 172 (grigio); UV e trattamenti K/N secondo etichetta 3M. Ideali per esterni e lavori con sbalzi di temperatura. Non idonei alla saldatura (usare EN 169). Conservare al riparo da graffi e heat extreme.$d$
    ),
    (
      '79691',
      'Occhiali a maschera Galeras Clear - policarbonato/PVC - incolore - Deltaplus',
      'Deltaplus',
      11.00,
      'https://odmultimedia.eu/immagini/LD/79691.jpg',
      'incolore',
      'maschera policarbonato/PVC',
      $d$Occhiali a maschera Deltaplus Galeras Clear in policarbonato/PVC, lente incolore. Versione chiara della famiglia Galeras per interni e ambienti con poca luce: massima trasparenza e protezione perimetrale. EN 166; UV EN 170; eventuali marchi 3/4/5 per liquidi e polveri. Adatti a falegnameria, muratura e laboratori. Controllare valvole/ventilazione e guarnizione; sostituire se la lente è opacizzata o crepata.$d$
    ),
    (
      '88914',
      'Occhiali detectabili Helium2 - policarbonato - monoblocco - trasparente/blu - Deltaplus',
      'Deltaplus',
      12.00,
      'https://odmultimedia.eu/immagini/LD/88914.jpg',
      'trasparente/blu',
      'monoblocco detectabile',
      $d$Occhiali detectabili Deltaplus Helium2 in policarbonato monoblocco, trasparente/blu. Progettati per industrie alimentari e farmaceutiche: parti metal-detectable / X-ray detectable per ridurre il rischio di contaminazione da frammenti. EN 166, classe ottica 1 tipica; UV EN 170. Design monoblocco igienico, facile da sanificare. Ideali in HACCP e zone clean. Verificare protocollo di rilevabilità del sito; non utilizzare in saldatura.$d$
    ),
    (
      '103955',
      'Occhiali Meia Smoke - policarbonato - Deltaplus',
      'Deltaplus',
      12.00,
      'https://odmultimedia.eu/immagini/LD/103955.jpg',
      'smoke',
      'policarbonato',
      $d$Occhiali Deltaplus Meia Smoke in policarbonato, lente fumé. Stile sportivo wraparound per protezione e comfort in esterni. EN 166; filtro solare EN 172; UV secondo marcatura; classe ottica 1 per uso continuo ove dichiarata. Trattamenti antigraffio/antiappannamento da confermare sull’etichetta. Indicati per edilizia, giardinaggio professionale e logistica outdoor. Non sostituiscono occhiali da saldatura EN 169.$d$
    ),
    (
      '105580',
      'Occhiali a mascherina GoggleGear™ serie 3000 - cinturino tela - 3M',
      '3M',
      16.00,
      'https://odmultimedia.eu/immagini/LD/105580.jpg',
      null,
      'mascherina cinturino tela',
      $d$Occhiali a mascherina 3M GoggleGear™ serie 3000 con cinturino in tela. Protezione a tenuta contro polveri e schizzi, compatibile con altri DPI 3M ove previsto. Conformità EN 166; possibili simbologie liquidi/polveri; classe ottica 1 tipica; UV EN 170 su lenti chiare. Cinturino tessuto regolabile per uso prolungato in ambienti asciutti. Ideali per chimica leggera, falegnameria e manutenzione. Controllare tenuta della guarnizione e sostituire lenti graffiate con ricambi originali.$d$
    ),
    (
      '105579',
      'Occhiali a mascherina GoggleGear™ serie 3000 - cinturino neoprene - 3M',
      '3M',
      24.00,
      'https://odmultimedia.eu/immagini/LD/105579.jpg',
      null,
      'mascherina cinturino neoprene',
      $d$Occhiali a mascherina 3M GoggleGear™ serie 3000 con cinturino in neoprene. Stessa piattaforma di protezione della versione tela, con cinturino neoprene più adatto ad ambienti umidi o dove serve maggiore aderenza e comfort sulla fronte. EN 166; UV EN 170; trattamenti antigraffio/antiappannamento secondo configurazione lente. Ideali per industria, cantieri e lavaggi. Non usare per saldatura ad arco senza filtro EN 169 dedicato.$d$
    ),
    (
      '93233',
      'Occhiali di sicurezza Solus 2000 - lenti trasparenti antigraffio - blu - 3M',
      '3M',
      28.00,
      'https://odmultimedia.eu/immagini/LD/93233.jpg',
      'blu',
      'policarbonato antigraffio',
      $d$Occhiali di sicurezza 3M Solus 2000, montatura blu, lenti trasparenti antigraffio. Fascia premium: comfort ergonomico, ampia visione e trattamento K (scratch resistant) tipico Solus; spesso anche N (anti-fog) — verificare marcatura. EN 166 classe ottica 1; UV EN 170. Ideali per produzione, laboratori e uso quotidiano prolungato. Compatibili con altri DPI della linea 3M ove indicato. Pulire con prodotti consigliati 3M per preservare i coating.$d$
    ),
    (
      '104148',
      'Occhiali Brava2 Wheat - policarbonato - lente antiappannamento e antigraffio - incolore - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/104148.jpg',
      'incolore',
      'policarbonato K/N',
      $d$Occhiali Deltaplus Brava2 Wheat in policarbonato, lente incolore con trattamenti antiappannamento e antigraffio (simboli N e K EN 166 ove marcati). Versione “Wheat” della famiglia Brava2 per ambienti con umidità e rischio abrasione superficiale. Classe ottica 1; UV EN 170. Adatti a industria alimentare, magazzino refrigerato e officina. Evitare panni abrasivi; sostituire se i coating risultano consumati.$d$
    ),
    (
      '92222',
      'Sovraocchiali Hekla 2 - in policarbonato - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/92222.jpg',
      null,
      'sovraocchiali policarbonato',
      $d$Sovraocchiali Deltaplus Hekla 2 in policarbonato. Da indossare sopra gli occhiali da vista per protezione ospite/operatore senza rimuovere la correzione ottica. EN 166; classe ottica tipicamente 1; UV EN 170. Ampia calotta per alloggiare montature standard. Ideali per visitatori di reparto, manutenzione e laboratori. Verificare che non ci sia gioco eccessivo; non usare come unico DPI in saldatura.$d$
    ),
    (
      '79728',
      'Sovraocchiali di protezione serie 2800 - policarbonato - montatura blu scuro - lenti trasparente - 3M',
      '3M',
      16.00,
      'https://odmultimedia.eu/immagini/LD/79728.jpg',
      'blu scuro / trasparente',
      'sovraocchiali policarbonato',
      $d$Sovraocchiali di protezione 3M serie 2800 in policarbonato, montatura blu scuro e lenti trasparenti. Protezione sovrapposta su occhiali da vista: copertura laterale e frontale secondo EN 166. Classe ottica 1; UV EN 170; trattamenti antigraffio tipici 3M. Ideali per visitatori e operatori che devono mantenere la propria correzione. Controllare compatibilità con la montatura sottostante; pulire regolarmente per evitare distorsioni da sporco.$d$
    ),
    (
      '103843',
      'Sovraocchiali regolabili Haruna Clear - trasparente/nero - Deltaplus',
      'Deltaplus',
      16.00,
      'https://odmultimedia.eu/immagini/LD/103843.jpg',
      'trasparente/nero',
      'sovraocchiali regolabili',
      $d$Sovraocchiali regolabili Deltaplus Haruna Clear, trasparente/nero. Sistema di regolazione per adattarsi a diverse montature da vista e morfologie. Lente chiara per interni; EN 166; UV EN 170; classe ottica 1 ove dichiarata. Buona alternativa premium agli overglasses fissi. Indicati per produzione, quality control e laboratori. Regolare le stanghette/ponte prima dell’uso; sostituire se la lente presenta distorsioni.$d$
    ),
    (
      '103844',
      'Sovraocchiali regolabili Haruna Smoke - fumé/nero - Deltaplus',
      'Deltaplus',
      16.00,
      'https://odmultimedia.eu/immagini/LD/103844.jpg',
      'fumé/nero',
      'sovraocchiali regolabili',
      $d$Sovraocchiali regolabili Deltaplus Haruna Smoke, fumé/nero. Stessa piattaforma regolabile del modello Clear, con lente smoke per esterni e riduzione abbagliamento (EN 172 ove marcato) oltre a EN 166 e UV. Ideali per operatori con occhiali da vista che lavorano all’aperto o in aree molto illuminate. Non idonei alla saldatura (richiede EN 169). Conservare in custodia per proteggere i coating.$d$
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
  subcategory = 'Occhiali',
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, price, image_url, color_name, format, description) as (
  values
    (
      '76211',
      'Occhiali Fuji 2 Gradient - policarbonato - Deltaplus',
      'Deltaplus',
      20.00::numeric,
      'https://odmultimedia.eu/immagini/MD/76211.jpg',
      null::text,
      'policarbonato',
      $d$Occhiali di protezione Deltaplus Fuji 2 Gradient in policarbonato. DPI per gli occhi con lente a gradiente per uso misto interno/esterno: riduce l’abbagliamento mantenendo buona visibilità. Classe ottica tipicamente 1 per uso continuo; conformità EN 166 (protezione personale occhi) e filtri UV secondo EN 170 ove marcati. Trattamenti antigraffio e/o antiappannamento verificabili sull’etichetta del lotto. Ideali per officina, magazzino e manutenzione. Conservare in custodia; sostituire se graffi profondi compromettono la visione.$d$
    ),
    (
      '79718',
      'Occhiali di protezione Virtua AP - policarbonato - grigio - 3M',
      '3M',
      7.00,
      'https://odmultimedia.eu/immagini/MD/79718.jpg',
      'grigio',
      'policarbonato',
      $d$Occhiali di protezione 3M Virtua AP in policarbonato, lente grigia. Design wraparound per copertura laterale e comfort prolungato. Classe ottica 1 (uso continuo) tipica della serie Virtua; conformità EN 166 e filtro solare EN 172 per riduzione dell’abbagliamento (lente grigia). Protezione UV secondo marcatura EN 170/EN 172 sul prodotto. Indicati per esterni, edilizia e logistica. Non utilizzare per saldatura o raggi IR intensi senza filtro EN 169 adeguato.$d$
    ),
    (
      '79717',
      'Occhiali di protezione Virtua AP - policarbonato - trasparente - 3M',
      '3M',
      7.00,
      'https://odmultimedia.eu/immagini/MD/79717.jpg',
      'trasparente',
      'policarbonato',
      $d$Occhiali di protezione 3M Virtua AP in policarbonato, lente trasparente. Stessa famiglia del modello grigio: calotta leggera, aderenza stabile e ampia area di visione. Classe ottica 1; EN 166 per rischi meccanici da impatto a bassa energia; protezione UV EN 170 tipica delle lenti chiare 3M. Ideali per interni, assemblaggio e laboratori. Pulire con panni microfibra e detergenti neutri; non usare solventi aggressivi sulle lenti trattate.$d$
    ),
    (
      '73584',
      'Occhiali monolente Piton Clear - incolore - Deltaplus',
      'Deltaplus',
      4.00,
      'https://odmultimedia.eu/immagini/LD/73584.jpg',
      'incolore',
      'monolente policarbonato',
      $d$Occhiali monolente Deltaplus Piton Clear, incolore. Struttura a lente unica in policarbonato per protezione frontale e laterale economica e leggera. Conformità EN 166; classe ottica tipicamente 1; filtro UV EN 170 su lenti chiare ove marcato. Adatti a visitatori, magazzino e lavori generici a basso rischio. Verificare simbologia F/B per resistenza agli urti. Sostituire alla prima crepa o opacizzazione della lente.$d$
    ),
    (
      '92223',
      'Occhiali Brava2 - policarbonato - lente antiappannamento - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/92223.jpg',
      null,
      'policarbonato antiappannamento',
      $d$Occhiali Deltaplus Brava2 in policarbonato con trattamento antiappannamento. Pensati per ambienti umidi o con sbalzi termici (celle, cucine professionali, esterni freschi). EN 166, classe ottica 1 tipica; UV EN 170; trattamento N (anti-fog) e spesso K (antigraffio) se presenti sulla marcatura. Buona copertura e comfort per uso prolungato. Non strofinare a secco la lente trattata; seguire istruzioni di manutenzione Deltaplus.$d$
    ),
    (
      '79692',
      'Occhiali a maschera Galeras Smoke - policarbonato/PVC - Deltaplus',
      'Deltaplus',
      11.00,
      'https://odmultimedia.eu/immagini/LD/79692.jpg',
      'smoke',
      'maschera policarbonato/PVC',
      $d$Occhiali a maschera Deltaplus Galeras Smoke in policarbonato con corpo in PVC, lente fumé. Protezione avvolgente contro polveri, schegge e schizzi: tenuta perimetrale superiore agli occhiali a stanghetta. EN 166 (spesso con simboli di liquidi/polveri se marcati); lente smoke con filtro solare EN 172; UV secondo marcatura. Indicati per edilizia, falegnameria e ambienti polverosi all’aperto. Controllare l’integrità della guarnizione e la ventilazione per ridurre l’appannamento.$d$
    ),
    (
      '73586',
      'Occhiali per saldatura Pacaya T5 - policarbonato/nylon - Deltaplus',
      'Deltaplus',
      20.00,
      'https://odmultimedia.eu/immagini/LD/73586.jpg',
      null,
      'saldatura policarbonato/nylon',
      $d$Occhiali per saldatura Deltaplus Pacaya T5 in policarbonato/nylon. DPI specifici per saldatura e taglio: filtri secondo EN 169 (numero di scala tipicamente T5 / scala 5 — verificare marcatura sul lotto) per attenuare luce intensa e radiazioni UV/IR tipiche dei processi. Struttura EN 166 per tenuta e resistenza meccanica. Non sostituiscono maschere elettroniche ad alte temperature se il rischio lo richiede; usare solo per i processi e le scale dichiarate. Controllare usura della lente filtrante prima di ogni sessione.$d$
    ),
    (
      '73583',
      'Occhiali a maschera Ruiz 1 - policarbonato/PVC - incolore - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/73583.jpg',
      'incolore',
      'maschera policarbonato/PVC',
      $d$Occhiali a maschera Deltaplus Ruiz 1 in policarbonato/PVC, lente incolore. Mascherina economica per protezione da polveri e schizzi liquidi in manutenzione e pulizie. Conformità EN 166; classe ottica 1 ove dichiarata; UV EN 170 su lente chiara. Buona alternativa agli occhiali a stanghetta quando serve copertura completa. Verificare simbologie 3/4/5 (liquidi/polveri fini) se presenti. Pulire dopo uso con detergenti neutri; non esporre a solventi che attaccano il PVC.$d$
    ),
    (
      '79722',
      'Occhiali di protezione Securefit SF202AF - policarbonato - grigio - 3M',
      '3M',
      12.50,
      'https://odmultimedia.eu/immagini/LD/79722.jpg',
      'grigio',
      'policarbonato AF',
      $d$Occhiali 3M SecureFit SF202AF in policarbonato, lente grigia con tecnologia antiappannamento (AF). Sistema SecureFit a pressione differenziata sulle stanghette per tenuta senza tensione eccessiva. Classe ottica 1; EN 166; filtro solare EN 172 (grigio); UV e trattamenti K/N secondo etichetta 3M. Ideali per esterni e lavori con sbalzi di temperatura. Non idonei alla saldatura (usare EN 169). Conservare al riparo da graffi e heat extreme.$d$
    ),
    (
      '79691',
      'Occhiali a maschera Galeras Clear - policarbonato/PVC - incolore - Deltaplus',
      'Deltaplus',
      11.00,
      'https://odmultimedia.eu/immagini/LD/79691.jpg',
      'incolore',
      'maschera policarbonato/PVC',
      $d$Occhiali a maschera Deltaplus Galeras Clear in policarbonato/PVC, lente incolore. Versione chiara della famiglia Galeras per interni e ambienti con poca luce: massima trasparenza e protezione perimetrale. EN 166; UV EN 170; eventuali marchi 3/4/5 per liquidi e polveri. Adatti a falegnameria, muratura e laboratori. Controllare valvole/ventilazione e guarnizione; sostituire se la lente è opacizzata o crepata.$d$
    ),
    (
      '88914',
      'Occhiali detectabili Helium2 - policarbonato - monoblocco - trasparente/blu - Deltaplus',
      'Deltaplus',
      12.00,
      'https://odmultimedia.eu/immagini/LD/88914.jpg',
      'trasparente/blu',
      'monoblocco detectabile',
      $d$Occhiali detectabili Deltaplus Helium2 in policarbonato monoblocco, trasparente/blu. Progettati per industrie alimentari e farmaceutiche: parti metal-detectable / X-ray detectable per ridurre il rischio di contaminazione da frammenti. EN 166, classe ottica 1 tipica; UV EN 170. Design monoblocco igienico, facile da sanificare. Ideali in HACCP e zone clean. Verificare protocollo di rilevabilità del sito; non utilizzare in saldatura.$d$
    ),
    (
      '103955',
      'Occhiali Meia Smoke - policarbonato - Deltaplus',
      'Deltaplus',
      12.00,
      'https://odmultimedia.eu/immagini/LD/103955.jpg',
      'smoke',
      'policarbonato',
      $d$Occhiali Deltaplus Meia Smoke in policarbonato, lente fumé. Stile sportivo wraparound per protezione e comfort in esterni. EN 166; filtro solare EN 172; UV secondo marcatura; classe ottica 1 per uso continuo ove dichiarata. Trattamenti antigraffio/antiappannamento da confermare sull’etichetta. Indicati per edilizia, giardinaggio professionale e logistica outdoor. Non sostituiscono occhiali da saldatura EN 169.$d$
    ),
    (
      '105580',
      'Occhiali a mascherina GoggleGear™ serie 3000 - cinturino tela - 3M',
      '3M',
      16.00,
      'https://odmultimedia.eu/immagini/LD/105580.jpg',
      null,
      'mascherina cinturino tela',
      $d$Occhiali a mascherina 3M GoggleGear™ serie 3000 con cinturino in tela. Protezione a tenuta contro polveri e schizzi, compatibile con altri DPI 3M ove previsto. Conformità EN 166; possibili simbologie liquidi/polveri; classe ottica 1 tipica; UV EN 170 su lenti chiare. Cinturino tessuto regolabile per uso prolungato in ambienti asciutti. Ideali per chimica leggera, falegnameria e manutenzione. Controllare tenuta della guarnizione e sostituire lenti graffiate con ricambi originali.$d$
    ),
    (
      '105579',
      'Occhiali a mascherina GoggleGear™ serie 3000 - cinturino neoprene - 3M',
      '3M',
      24.00,
      'https://odmultimedia.eu/immagini/LD/105579.jpg',
      null,
      'mascherina cinturino neoprene',
      $d$Occhiali a mascherina 3M GoggleGear™ serie 3000 con cinturino in neoprene. Stessa piattaforma di protezione della versione tela, con cinturino neoprene più adatto ad ambienti umidi o dove serve maggiore aderenza e comfort sulla fronte. EN 166; UV EN 170; trattamenti antigraffio/antiappannamento secondo configurazione lente. Ideali per industria, cantieri e lavaggi. Non usare per saldatura ad arco senza filtro EN 169 dedicato.$d$
    ),
    (
      '93233',
      'Occhiali di sicurezza Solus 2000 - lenti trasparenti antigraffio - blu - 3M',
      '3M',
      28.00,
      'https://odmultimedia.eu/immagini/LD/93233.jpg',
      'blu',
      'policarbonato antigraffio',
      $d$Occhiali di sicurezza 3M Solus 2000, montatura blu, lenti trasparenti antigraffio. Fascia premium: comfort ergonomico, ampia visione e trattamento K (scratch resistant) tipico Solus; spesso anche N (anti-fog) — verificare marcatura. EN 166 classe ottica 1; UV EN 170. Ideali per produzione, laboratori e uso quotidiano prolungato. Compatibili con altri DPI della linea 3M ove indicato. Pulire con prodotti consigliati 3M per preservare i coating.$d$
    ),
    (
      '104148',
      'Occhiali Brava2 Wheat - policarbonato - lente antiappannamento e antigraffio - incolore - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/104148.jpg',
      'incolore',
      'policarbonato K/N',
      $d$Occhiali Deltaplus Brava2 Wheat in policarbonato, lente incolore con trattamenti antiappannamento e antigraffio (simboli N e K EN 166 ove marcati). Versione “Wheat” della famiglia Brava2 per ambienti con umidità e rischio abrasione superficiale. Classe ottica 1; UV EN 170. Adatti a industria alimentare, magazzino refrigerato e officina. Evitare panni abrasivi; sostituire se i coating risultano consumati.$d$
    ),
    (
      '92222',
      'Sovraocchiali Hekla 2 - in policarbonato - Deltaplus',
      'Deltaplus',
      5.00,
      'https://odmultimedia.eu/immagini/LD/92222.jpg',
      null,
      'sovraocchiali policarbonato',
      $d$Sovraocchiali Deltaplus Hekla 2 in policarbonato. Da indossare sopra gli occhiali da vista per protezione ospite/operatore senza rimuovere la correzione ottica. EN 166; classe ottica tipicamente 1; UV EN 170. Ampia calotta per alloggiare montature standard. Ideali per visitatori di reparto, manutenzione e laboratori. Verificare che non ci sia gioco eccessivo; non usare come unico DPI in saldatura.$d$
    ),
    (
      '79728',
      'Sovraocchiali di protezione serie 2800 - policarbonato - montatura blu scuro - lenti trasparente - 3M',
      '3M',
      16.00,
      'https://odmultimedia.eu/immagini/LD/79728.jpg',
      'blu scuro / trasparente',
      'sovraocchiali policarbonato',
      $d$Sovraocchiali di protezione 3M serie 2800 in policarbonato, montatura blu scuro e lenti trasparenti. Protezione sovrapposta su occhiali da vista: copertura laterale e frontale secondo EN 166. Classe ottica 1; UV EN 170; trattamenti antigraffio tipici 3M. Ideali per visitatori e operatori che devono mantenere la propria correzione. Controllare compatibilità con la montatura sottostante; pulire regolarmente per evitare distorsioni da sporco.$d$
    ),
    (
      '103843',
      'Sovraocchiali regolabili Haruna Clear - trasparente/nero - Deltaplus',
      'Deltaplus',
      16.00,
      'https://odmultimedia.eu/immagini/LD/103843.jpg',
      'trasparente/nero',
      'sovraocchiali regolabili',
      $d$Sovraocchiali regolabili Deltaplus Haruna Clear, trasparente/nero. Sistema di regolazione per adattarsi a diverse montature da vista e morfologie. Lente chiara per interni; EN 166; UV EN 170; classe ottica 1 ove dichiarata. Buona alternativa premium agli overglasses fissi. Indicati per produzione, quality control e laboratori. Regolare le stanghette/ponte prima dell’uso; sostituire se la lente presenta distorsioni.$d$
    ),
    (
      '103844',
      'Sovraocchiali regolabili Haruna Smoke - fumé/nero - Deltaplus',
      'Deltaplus',
      16.00,
      'https://odmultimedia.eu/immagini/LD/103844.jpg',
      'fumé/nero',
      'sovraocchiali regolabili',
      $d$Sovraocchiali regolabili Deltaplus Haruna Smoke, fumé/nero. Stessa piattaforma regolabile del modello Clear, con lente smoke per esterni e riduzione abbagliamento (EN 172 ove marcato) oltre a EN 166 e UV. Ideali per operatori con occhiali da vista che lavorano all’aperto o in aree molto illuminate. Non idonei alla saldatura (richiede EN 169). Conservare in custodia per proteggere i coating.$d$
    )
)
insert into public.products (
  sku, name, price, image_url, brand, category, subcategory,
  description, color_name, format, stock
)
select
  r.sku,
  r.name,
  r.price,
  r.image_url,
  r.brand,
  'Sicurezza',
  'Occhiali',
  r.description,
  r.color_name,
  r.format,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
