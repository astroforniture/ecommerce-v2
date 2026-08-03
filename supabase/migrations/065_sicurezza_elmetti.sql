-- Sicurezza → sottocategoria Elmetti (8 DPI capo Deltaplus)

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Elmetti',
  'sicurezza-elmetti',
  '/office-products?category=Sicurezza&subcategory=Elmetti',
  'https://odmultimedia.eu/immagini/MD/76209.jpg',
  parent.id,
  20,
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

with rows(sku, name, brand, price, image_url, variants, description) as (
  values
    (
      '88940',
      'Elmetto forestale Forestier 3 - arancio - Deltaplus',
      'Deltaplus',
      60.00::numeric,
      'https://odmultimedia.eu/immagini/MD/88940.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/88940_1.jpg"]}'::jsonb,
      $d$Elmetto forestale Deltaplus Forestier 3, colore arancio ad alta visibilità. DPI per il capo destinato ad attività boschive e forestali: calotta robusta, protezione da urti e penetrazione secondo requisiti tipici della norma EN 397 (verificare marcatura CE e certificato sul lotto). Bardatura interna regolabile per un adattamento sicuro alla circonferenza cranica; punti di ancoraggio multipli per stabilità. Non utilizzare in presenza di rischi elettrici oltre i limiti dichiarati dal produttore; ispezionare dopo ogni urto e sostituire se danneggiato.$d$
    ),
    (
      '73578',
      'Elmetto di protezione Zircon 1 - giallo - Deltaplus',
      'Deltaplus',
      15.00,
      'https://odmultimedia.eu/immagini/MD/73578.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/73578_1.jpg"]}'::jsonb,
      $d$Elmetto di protezione Deltaplus Zircon 1, giallo. Calotta in materiale termoplastico per uso generale in cantiere e industria leggera, conforme ai requisiti EN 397 ove marcato. Regolazione tipicamente a cremagliera per un fissaggio rapido e stabile; bardatura a più punti di ancoraggio per distribuire il carico in caso di impatto. Ideale come DPI di base contro caduta oggetti. Non forare la calotta; sostituire dopo urti significativi o scaduta la vita utile indicata dal fabbricante.$d$
    ),
    (
      '76209',
      'Elmetto da cantiere Granite Wind - bianco - Deltaplus',
      'Deltaplus',
      50.00,
      'https://odmultimedia.eu/immagini/MD/76209.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/76209_2.jpg","https://odmultimedia.eu/immagini/MD/76209_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Granite Wind, bianco. Modello ventilato (Wind) per migliorare il comfort termico nei lavori prolungati all’aperto, mantenendo la protezione da urti secondo EN 397 (verificare etichetta). Bardatura regolabile (spesso a cremagliera) e sistema di ancoraggio multipunto (tipicamente 6–8 punti a seconda della configurazione). Compatibile con accessori previsti dal produttore (visiere, cuffie) se omologati. Conservare al riparo da solventi e luce intensa; non modificare la struttura.$d$
    ),
    (
      '73577',
      'Elmetto di protezione Quartz Up III - bianco - Deltaplus',
      'Deltaplus',
      20.00,
      'https://odmultimedia.eu/immagini/MD/73577.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/73577_1.jpg"]}'::jsonb,
      $d$Elmetto di protezione Deltaplus Quartz Up III, bianco. DPI capo per edilizia e manutenzione: calotta resistente agli urti, regolazione cranica precisa (cremagliera o equivalente) e bardatura con più punti di ancoraggio per tenuta laterale. Conforme ai requisiti EN 397 se presente marcatura CE corrispondente. Controllare l’assenza di cricche e l’integrità della bardatura prima di ogni turno. Non utilizzare come protezione elettrica se non esplicitamente certificato per tensione.$d$
    ),
    (
      '82366',
      'Elmetto da cantiere Granite Wind - giallo fluo - Deltaplus',
      'Deltaplus',
      50.00,
      'https://odmultimedia.eu/immagini/MD/82366.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/82366_2.jpg","https://odmultimedia.eu/immagini/MD/82366_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Granite Wind, giallo fluo ad alta visibilità. Stessa famiglia ventilata Wind del modello bianco: comfort in ambienti caldi e protezione da impatto secondo EN 397 (controllare marcatura). Regolazione a cremagliera e bardatura multipunto per stabilità anche in movimento. Il colore fluo migliora la rilevabilità dell’operatore in cantieri e aree a traffico. Ispezionare dopo cadute o urti; non dipingere né forare la calotta.$d$
    ),
    (
      '97181',
      'Elmetto da cantiere ONYX2 - bianco - Deltaplus',
      'Deltaplus',
      160.00,
      'https://odmultimedia.eu/immagini/MD/97181.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/97181_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus ONYX2, bianco. Modello di fascia alta con comfort e protezione avanzati per ambienti professionali intensivi. Progettato per conformità EN 397; verificare sul prodotto eventuali opzioni di isolamento elettrico o accessori omologati. Bardatura ergonomica con regolazione precisa (cremagliera) e ancoraggi multipli (tipicamente 6–8 punti) per trattenere l’elmetto in caso di caduta o inclinazione. Manutenzione: pulire con detergenti neutri, sostituire imbottiture usurate, non esporre a fiamme libere.$d$
    ),
    (
      '97183',
      'Elmetto da cantiere Diamond VI Wind - giallo - Deltaplus',
      'Deltaplus',
      25.00,
      'https://odmultimedia.eu/immagini/MD/97183.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/97183_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Diamond VI Wind, giallo. Versione ventilata della serie Diamond VI per lavori all’aperto e ambienti caldi, con protezione da urti secondo EN 397 ove certificato. Regolazione cranica a cremagliera e bardatura a più punti di ancoraggio per un fit sicuro. Indicato per edilizia, logistica e impianti. Controllare slot per accessori (cuffie/visiere) e usare solo ricambi originali. Dopo un impatto forte sostituire l’intero DPI.$d$
    ),
    (
      '97182',
      'Elmetto da cantiere Diamond VI Wind - blu - Deltaplus',
      'Deltaplus',
      25.00,
      'https://odmultimedia.eu/immagini/MD/97182.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/97182_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Diamond VI Wind, blu. Stesse caratteristiche tecniche del modello giallo della serie Wind: ventilazione, regolazione a cremagliera e bardatura multipunto per stabilità. Protezione del capo conforme ai requisiti EN 397 (verificare etichetta CE e dichiarazione di conformità). Ideale per distinguere ruoli/squadre tramite colore. Non utilizzare oltre i limiti di temperatura/elettricità dichiarati; conservare lontano da solventi aggressivi.$d$
    )
)
update public.products as p
set
  name = r.name,
  brand = r.brand,
  price = r.price,
  image_url = r.image_url,
  variants = r.variants,
  description = r.description,
  category = 'Sicurezza',
  subcategory = 'Elmetti',
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, price, image_url, variants, description) as (
  values
    (
      '88940',
      'Elmetto forestale Forestier 3 - arancio - Deltaplus',
      'Deltaplus',
      60.00::numeric,
      'https://odmultimedia.eu/immagini/MD/88940.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/88940_1.jpg"]}'::jsonb,
      $d$Elmetto forestale Deltaplus Forestier 3, colore arancio ad alta visibilità. DPI per il capo destinato ad attività boschive e forestali: calotta robusta, protezione da urti e penetrazione secondo requisiti tipici della norma EN 397 (verificare marcatura CE e certificato sul lotto). Bardatura interna regolabile per un adattamento sicuro alla circonferenza cranica; punti di ancoraggio multipli per stabilità. Non utilizzare in presenza di rischi elettrici oltre i limiti dichiarati dal produttore; ispezionare dopo ogni urto e sostituire se danneggiato.$d$
    ),
    (
      '73578',
      'Elmetto di protezione Zircon 1 - giallo - Deltaplus',
      'Deltaplus',
      15.00,
      'https://odmultimedia.eu/immagini/MD/73578.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/73578_1.jpg"]}'::jsonb,
      $d$Elmetto di protezione Deltaplus Zircon 1, giallo. Calotta in materiale termoplastico per uso generale in cantiere e industria leggera, conforme ai requisiti EN 397 ove marcato. Regolazione tipicamente a cremagliera per un fissaggio rapido e stabile; bardatura a più punti di ancoraggio per distribuire il carico in caso di impatto. Ideale come DPI di base contro caduta oggetti. Non forare la calotta; sostituire dopo urti significativi o scaduta la vita utile indicata dal fabbricante.$d$
    ),
    (
      '76209',
      'Elmetto da cantiere Granite Wind - bianco - Deltaplus',
      'Deltaplus',
      50.00,
      'https://odmultimedia.eu/immagini/MD/76209.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/76209_2.jpg","https://odmultimedia.eu/immagini/MD/76209_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Granite Wind, bianco. Modello ventilato (Wind) per migliorare il comfort termico nei lavori prolungati all’aperto, mantenendo la protezione da urti secondo EN 397 (verificare etichetta). Bardatura regolabile (spesso a cremagliera) e sistema di ancoraggio multipunto (tipicamente 6–8 punti a seconda della configurazione). Compatibile con accessori previsti dal produttore (visiere, cuffie) se omologati. Conservare al riparo da solventi e luce intensa; non modificare la struttura.$d$
    ),
    (
      '73577',
      'Elmetto di protezione Quartz Up III - bianco - Deltaplus',
      'Deltaplus',
      20.00,
      'https://odmultimedia.eu/immagini/MD/73577.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/73577_1.jpg"]}'::jsonb,
      $d$Elmetto di protezione Deltaplus Quartz Up III, bianco. DPI capo per edilizia e manutenzione: calotta resistente agli urti, regolazione cranica precisa (cremagliera o equivalente) e bardatura con più punti di ancoraggio per tenuta laterale. Conforme ai requisiti EN 397 se presente marcatura CE corrispondente. Controllare l’assenza di cricche e l’integrità della bardatura prima di ogni turno. Non utilizzare come protezione elettrica se non esplicitamente certificato per tensione.$d$
    ),
    (
      '82366',
      'Elmetto da cantiere Granite Wind - giallo fluo - Deltaplus',
      'Deltaplus',
      50.00,
      'https://odmultimedia.eu/immagini/MD/82366.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/82366_2.jpg","https://odmultimedia.eu/immagini/MD/82366_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Granite Wind, giallo fluo ad alta visibilità. Stessa famiglia ventilata Wind del modello bianco: comfort in ambienti caldi e protezione da impatto secondo EN 397 (controllare marcatura). Regolazione a cremagliera e bardatura multipunto per stabilità anche in movimento. Il colore fluo migliora la rilevabilità dell’operatore in cantieri e aree a traffico. Ispezionare dopo cadute o urti; non dipingere né forare la calotta.$d$
    ),
    (
      '97181',
      'Elmetto da cantiere ONYX2 - bianco - Deltaplus',
      'Deltaplus',
      160.00,
      'https://odmultimedia.eu/immagini/MD/97181.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/97181_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus ONYX2, bianco. Modello di fascia alta con comfort e protezione avanzati per ambienti professionali intensivi. Progettato per conformità EN 397; verificare sul prodotto eventuali opzioni di isolamento elettrico o accessori omologati. Bardatura ergonomica con regolazione precisa (cremagliera) e ancoraggi multipli (tipicamente 6–8 punti) per trattenere l’elmetto in caso di caduta o inclinazione. Manutenzione: pulire con detergenti neutri, sostituire imbottiture usurate, non esporre a fiamme libere.$d$
    ),
    (
      '97183',
      'Elmetto da cantiere Diamond VI Wind - giallo - Deltaplus',
      'Deltaplus',
      25.00,
      'https://odmultimedia.eu/immagini/MD/97183.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/97183_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Diamond VI Wind, giallo. Versione ventilata della serie Diamond VI per lavori all’aperto e ambienti caldi, con protezione da urti secondo EN 397 ove certificato. Regolazione cranica a cremagliera e bardatura a più punti di ancoraggio per un fit sicuro. Indicato per edilizia, logistica e impianti. Controllare slot per accessori (cuffie/visiere) e usare solo ricambi originali. Dopo un impatto forte sostituire l’intero DPI.$d$
    ),
    (
      '97182',
      'Elmetto da cantiere Diamond VI Wind - blu - Deltaplus',
      'Deltaplus',
      25.00,
      'https://odmultimedia.eu/immagini/MD/97182.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/97182_1.jpg"]}'::jsonb,
      $d$Elmetto da cantiere Deltaplus Diamond VI Wind, blu. Stesse caratteristiche tecniche del modello giallo della serie Wind: ventilazione, regolazione a cremagliera e bardatura multipunto per stabilità. Protezione del capo conforme ai requisiti EN 397 (verificare etichetta CE e dichiarazione di conformità). Ideale per distinguere ruoli/squadre tramite colore. Non utilizzare oltre i limiti di temperatura/elettricità dichiarati; conservare lontano da solventi aggressivi.$d$
    )
)
insert into public.products (sku, name, price, image_url, brand, category, subcategory, description, variants, stock)
select
  r.sku,
  r.name,
  r.price,
  r.image_url,
  r.brand,
  'Sicurezza',
  'Elmetti',
  r.description,
  r.variants,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
