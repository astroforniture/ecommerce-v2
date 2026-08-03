-- Macro-categoria Sicurezza + sottocategoria Nastri (17 prodotti tecnici)

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
values (
  'Sicurezza',
  'sicurezza',
  '/office-products?category=Sicurezza',
  'https://odmultimedia.eu/immagini/MD/101358.jpg',
  null,
  58,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Nastri',
  'sicurezza-nastri',
  '/office-products?category=Sicurezza&subcategory=Nastri',
  'https://odmultimedia.eu/immagini/MD/101358.jpg',
  parent.id,
  10,
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
      '98276',
      'Nastro fotoluminescente adesivo - 4 cm x 10 m - giallo/frecce verdi',
      '',
      130.00::numeric,
      'https://odmultimedia.eu/immagini/MD/98276.jpg',
      null::jsonb,
      $d$Nastro adesivo fotoluminescente 4 cm × 10 m, fondo con frecce verdi per indicare vie di esodo e percorsi di sicurezza. La carica luminosa avviene con esposizione alla luce ambientale e restituisce segnalazione in caso di black-out. Applicare su superfici pulite, asciutte e sgrassate; pressare bene i bordi. Ideale per scale, corridoi e uscite di emergenza in conformità alle buone pratiche di segnaletica antinfortunistica. Verificare periodicamente la luminosità residua.$d$
    ),
    (
      '92147',
      'Nastro adesivo DURALINESTRONG 50/05 1021 - permanente - 5 cm x 30 m - rosso - Durable',
      'Durable',
      90.00,
      'https://odmultimedia.eu/immagini/MD/92147.jpg',
      null::jsonb,
      $d$Nastro Durable DURALINESTRONG 50/05 1021 permanente, 5 cm × 30 m, colore rosso. Adesivo industriale ad alta tenuta per demarcazione pavimenti, aree di pericolo e percorsi in magazzini e produzione. Resistente al calpestio e ai detergenti comuni se correttamente applicato. Applicazione: pulire il supporto, stendere senza pieghe, pressare con rullo. Non destinato a superfici porose umide o polverose.$d$
    ),
    (
      '61838',
      'Nastro segnaletico di sicurezza - 7 cm x 200 m - PE - rosso/bianco - Viva',
      'Viva',
      5.50,
      'https://odmultimedia.eu/immagini/MD/61838.jpg',
      null::jsonb,
      $d$Nastro segnaletico Viva in polietilene (PE), 7 cm × 200 m, bicolore rosso/bianco. Ideale per delimitare temporaneamente aree di lavoro, cantieri e zone interdette al passaggio. Non adesivo: da fissare a coni, pali o barriere. Leggero e ad alta visibilità; sostituire se usurato o sporco. Non sostituisce barriere strutturali o DPI obbligatori.$d$
    ),
    (
      '101358',
      'Nastro adesivo antiscivolo DURALINE GRIP+ - 2,5 cm x 15 m - giallo/nero - Durable',
      'Durable',
      40.00,
      'https://odmultimedia.eu/immagini/MD/101358.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101358_1.jpg"]}'::jsonb,
      $d$Nastro antiscivolo Durable DURALINE GRIP+, 2,5 cm × 15 m, giallo/nero a contrasto. Superficie abrasiva per ridurre il rischio di scivolamento su scale, rampe e soglie. Adesivo forte per pavimenti interni; applicare su fondo pulito e asciutto, lasciare maturare l’adesione prima del traffico intenso. Controllare usura periodicamente e sostituire se la grana è consumata. Contribuisce alle misure antinfortunistiche di prevenzione cadute.$d$
    ),
    (
      '101355',
      'Nastro adesivo antiscivolo DURALINE GRIP+ FORMFIT - 5 cm x 15 m - nero - Durable',
      'Durable',
      120.00,
      'https://odmultimedia.eu/immagini/MD/101355.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101355_2.jpg"]}'::jsonb,
      $d$Nastro antiscivolo Durable DURALINE GRIP+ FORMFIT, 5 cm × 15 m, nero. Versione formfit per adattarsi meglio a profili e superfici irregolari mantenendo grip elevato. Indicato per scale metalliche, piattaforme e zone ad alto passaggio. Preparare il supporto (sgrassare, asciugare), applicare senza bolle d’aria e pressare. Verificare compatibilità con detergenti industriali usati in manutenzione.$d$
    ),
    (
      '92150',
      'Nastro adesivo DURALINESTRONG 50/05 1021 - permanente - 5 cm x 30 m - blu - Durable',
      'Durable',
      100.00,
      'https://odmultimedia.eu/immagini/MD/92150.jpg',
      null::jsonb,
      $d$Nastro Durable DURALINESTRONG 50/05 1021 permanente, 5 cm × 30 m, blu. Demarcazione a pavimento per corsie, stoccaggi e zone operative secondo codifica colore aziendale. Adesione permanente e buona resistenza all’usura da calpestio. Applicare su cemento/resina liscia e pulita; evitare applicazione a basse temperature. Rimuovere residui con solventi idonei solo se necessario.$d$
    ),
    (
      '101356',
      'Nastro adesivo antiscivolo DURALINE GRIP+ - 5 cm x 15 m - giallo/nero - Durable',
      'Durable',
      80.00,
      'https://odmultimedia.eu/immagini/MD/101356.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101356_2.jpg"]}'::jsonb,
      $d$Nastro antiscivolo Durable DURALINE GRIP+, 5 cm × 15 m, giallo/nero. Larghezza maggiorata per gradini e percorsi pedonali ad alto rischio scivolamento. Texture abrasiva ad alta aderenza; adesivo permanente per interni. Pulire e asciugare il supporto, applicare con pressione uniforme, non calpestare subito dopo l’applicazione. Elemento tipico dei piani di prevenzione antinfortunistica su scale e rampe.$d$
    ),
    (
      '102021',
      'Nastro mascheratura PRO Outdoor - per esterni - 2,5 cm x 50 m - carta washi - blu - Geko - conf. 6 pezzi',
      'Geko',
      40.00,
      'https://odmultimedia.eu/immagini/MD/102021.jpg',
      null::jsonb,
      $d$Nastro mascheratura Geko PRO Outdoor, 2,5 cm × 50 m, carta washi blu, conf. 6 pezzi. Formulato per esterni: buona tenuta su intonaci e superfici irregolari, rimozione pulita se rispettati tempi d’uso. Ideale per verniciatura e demarcazioni temporanee di cantiere. Applicare su superficie asciutta; non esporre oltre i limiti dichiarati dal produttore per evitare residui. Utile anche per proteggere profili durante lavori di manutenzione.$d$
    ),
    (
      '101803',
      'Striscia adesiva antiscivolo ANTISLIP - 1,9 x 61 cm - nero - Geko - conf. 5 pezzi',
      'Geko',
      6.00,
      'https://odmultimedia.eu/immagini/MD/101803.jpg',
      null::jsonb,
      $d$Strisce adesive antiscivolo Geko ANTISLIP, 1,9 × 61 cm, nero, conf. 5 pezzi. Pronte all’uso per gradini, pedane e soglie: riducono lo scivolamento con superficie grit. Tagliare se necessario, applicare su fondo sgrassato e asciutto, pressare bene. Controllare l’usura e sostituire le strisce consumate. Soluzione rapida per interventi di messa in sicurezza puntuale.$d$
    ),
    (
      '98280',
      'Striscia fotoluminescente antiscivolo - 5 x 80 cm - giallo/nero',
      '',
      100.00,
      'https://odmultimedia.eu/immagini/MD/98280.jpg',
      null::jsonb,
      $d$Striscia fotoluminescente antiscivolo 5 × 80 cm, giallo/nero. Combina grip abrasivo e segnalazione luminosa dopo carica alla luce, utile su scale di emergenza e percorsi di esodo. Applicare su superfici pulite; esporre alla luce per ricaricare il fotoluminescente. Verificare periodicamente aderenza e luminosità. Supporta la visibilità delle vie di fuga in condizioni di scarsa illuminazione.$d$
    ),
    (
      '92151',
      'Nastro adesivo DURALINESTRONG 50/05 1043 - rimovibile - 5 cm x 15 m - giallo/nero - Durable',
      'Durable',
      60.00,
      'https://odmultimedia.eu/immagini/MD/92151.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/92151_2.jpg"]}'::jsonb,
      $d$Nastro Durable DURALINESTRONG 50/05 1043 rimovibile, 5 cm × 15 m, giallo/nero. Demarcazione temporanea o riorganizzabile di aree a rischio senza lasciare residui eccessivi se rimosso correttamente. Ideale per layout variabili in magazzino. Applicare su pavimenti lisci e puliti; rimuovere tirando con angolo costante. Non adatto a traffico di carrelli molto aggressivo per periodi prolungati senza controllo.$d$
    ),
    (
      '53734',
      'Nastro adesivo vinilico 471 - 5 cm x 33 m - giallo - Scotch',
      'Scotch',
      60.00,
      'https://odmultimedia.eu/immagini/MD/53734.jpg',
      null::jsonb,
      $d$Nastro adesivo vinilico Scotch 471, 5 cm × 33 m, giallo. Classico nastro di demarcazione pavimenti e segnaletica a terra: buona flessibilità, bordi nitidi e resistenza moderata a solventi/oli a seconda dell’ambiente. Applicare su superfici lisce; pressare con rullo. Usato in linee produttive e aree logistiche per codifica percorsi. Sostituire se sollevato o usurato per mantenere leggibilità e sicurezza.$d$
    ),
    (
      '101808',
      'Nastro adesivo antiscivolo fosforescente ANTISLIP - 5 cm x 15 m - giallo - Geko',
      'Geko',
      60.00,
      'https://odmultimedia.eu/immagini/MD/101808.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101808_1.jpg"]}'::jsonb,
      $d$Nastro antiscivolo fosforescente Geko ANTISLIP, 5 cm × 15 m, giallo. Grip + effetto luminoso dopo esposizione alla luce, per scale e passaggi critici anche in scarsa illuminazione. Applicare su supporto pulito e asciutto; lasciare maturare l’adesivo. Ricaricare periodicamente esponendo alla luce artificiale/naturale. Integrabile nei piani di sicurezza antincendio e antinfortunistica.$d$
    ),
    (
      '83510',
      'Adesivo da terra - ''forma a T'' - 10 x 15 cm - Durable - conf. 10 pezzi',
      'Durable',
      40.00,
      'https://odmultimedia.eu/immagini/MD/83510.jpg',
      null::jsonb,
      $d$Adesivi da terra Durable a forma di T, 10 × 15 cm, conf. 10 pezzi. Indicati per segnalare punti di sosta, distanze o posizioni attrezzature a pavimento. Adesione rapida su superfici lisce; pulire e asciugare prima dell’applicazione. Resistenti al calpestio leggero/medio; sostituire se scoloriti o sollevati. Utili per organizzazione spazi e percorsi sicuri in uffici e magazzini.$d$
    ),
    (
      '101802',
      'Nastro adesivo antiscivolo ANTISLIP - 2,5 cm x 5 m - giallo/nero - Geko',
      'Geko',
      7.00,
      'https://odmultimedia.eu/immagini/MD/101802.jpg',
      null::jsonb,
      $d$Nastro antiscivolo Geko ANTISLIP, 2,5 cm × 5 m, giallo/nero. Formato corto per interventi puntuali su gradini, pedane e soglie. Superficie grit ad alta aderenza; applicazione su fondo sgrassato. Pressare i bordi e verificare dopo le prime ore di traffico. Soluzione economica per la messa in sicurezza di punti critici.$d$
    ),
    (
      '102020',
      'Nastro mascheratura PRO Sensitive - per superfici delicate - 2,5 cm x 50 m - carta washi - rosa - Geko - conf. 6 pezzi',
      'Geko',
      40.00,
      'https://odmultimedia.eu/immagini/MD/102020.jpg',
      null::jsonb,
      $d$Nastro mascheratura Geko PRO Sensitive, 2,5 cm × 50 m, carta washi rosa, conf. 6 pezzi. Pensato per superfici delicate (vernici fresche, laminati, plastiche): adesione controllata e rimozione pulita nei tempi consigliati. Ideale in verniciatura di precisione e protezione temporanea. Non lasciare oltre i limiti d’uso; rimuovere lentamente. Utile anche in ambiti tecnici dove serve mascheratura senza danneggiare il supporto.$d$
    ),
    (
      '83513',
      'Adesivo da terra - ''striscia'' - 10 x 15 cm - Durable - conf. 10 pezzi',
      'Durable',
      16.00,
      'https://odmultimedia.eu/immagini/MD/83513.jpg',
      null::jsonb,
      $d$Adesivi da terra Durable a striscia, 10 × 15 cm, conf. 10 pezzi. Demarcazione rapida di zone, code o punti di attenzione a pavimento. Applicare su superficie liscia e pulita; pressare uniformemente. Buona visibilità e tenuta al calpestio ordinario. Sostituire se usurati per mantenere chiarezza della segnaletica e sicurezza degli ambienti.$d$
    )
)
update public.products as p
set
  name = r.name,
  brand = nullif(r.brand, ''),
  price = r.price,
  image_url = r.image_url,
  variants = r.variants,
  description = r.description,
  category = 'Sicurezza',
  subcategory = 'Nastri',
  stock = coalesce(p.stock, 100)
from rows as r
where p.sku = r.sku;

with rows(sku, name, brand, price, image_url, variants, description) as (
  values
    (
      '98276',
      'Nastro fotoluminescente adesivo - 4 cm x 10 m - giallo/frecce verdi',
      '',
      130.00::numeric,
      'https://odmultimedia.eu/immagini/MD/98276.jpg',
      null::jsonb,
      $d$Nastro adesivo fotoluminescente 4 cm × 10 m, giallo con frecce verdi per indicare vie di esodo e percorsi di sicurezza. La carica luminosa avviene con esposizione alla luce ambientale e restituisce segnalazione in caso di black-out. Applicare su superfici pulite, asciutte e sgrassate; pressare bene i bordi. Ideale per scale, corridoi e uscite di emergenza in conformità alle buone pratiche di segnaletica antinfortunistica. Verificare periodicamente la luminosità residua.$d$
    ),
    (
      '92147',
      'Nastro adesivo DURALINESTRONG 50/05 1021 - permanente - 5 cm x 30 m - rosso - Durable',
      'Durable',
      90.00,
      'https://odmultimedia.eu/immagini/MD/92147.jpg',
      null::jsonb,
      $d$Nastro Durable DURALINESTRONG 50/05 1021 permanente, 5 cm × 30 m, colore rosso. Adesivo industriale ad alta tenuta per demarcazione pavimenti, aree di pericolo e percorsi in magazzini e produzione. Resistente al calpestio e ai detergenti comuni se correttamente applicato. Applicazione: pulire il supporto, stendere senza pieghe, pressare con rullo. Non destinato a superfici porose umide o polverose.$d$
    ),
    (
      '61838',
      'Nastro segnaletico di sicurezza - 7 cm x 200 m - PE - rosso/bianco - Viva',
      'Viva',
      5.50,
      'https://odmultimedia.eu/immagini/MD/61838.jpg',
      null::jsonb,
      $d$Nastro segnaletico Viva in polietilene (PE), 7 cm × 200 m, bicolore rosso/bianco. Ideale per delimitare temporaneamente aree di lavoro, cantieri e zone interdette al passaggio. Non adesivo: da fissare a coni, pali o barriere. Leggero e ad alta visibilità; sostituire se usurato o sporco. Non sostituisce barriere strutturali o DPI obbligatori.$d$
    ),
    (
      '101358',
      'Nastro adesivo antiscivolo DURALINE GRIP+ - 2,5 cm x 15 m - giallo/nero - Durable',
      'Durable',
      40.00,
      'https://odmultimedia.eu/immagini/MD/101358.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101358_1.jpg"]}'::jsonb,
      $d$Nastro antiscivolo Durable DURALINE GRIP+, 2,5 cm × 15 m, giallo/nero a contrasto. Superficie abrasiva per ridurre il rischio di scivolamento su scale, rampe e soglie. Adesivo forte per pavimenti interni; applicare su fondo pulito e asciutto, lasciare maturare l’adesione prima del traffico intenso. Controllare usura periodicamente e sostituire se la grana è consumata. Contribuisce alle misure antinfortunistiche di prevenzione cadute.$d$
    ),
    (
      '101355',
      'Nastro adesivo antiscivolo DURALINE GRIP+ FORMFIT - 5 cm x 15 m - nero - Durable',
      'Durable',
      120.00,
      'https://odmultimedia.eu/immagini/MD/101355.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101355_2.jpg"]}'::jsonb,
      $d$Nastro antiscivolo Durable DURALINE GRIP+ FORMFIT, 5 cm × 15 m, nero. Versione formfit per adattarsi meglio a profili e superfici irregolari mantenendo grip elevato. Indicato per scale metalliche, piattaforme e zone ad alto passaggio. Preparare il supporto (sgrassare, asciugare), applicare senza bolle d’aria e pressare. Verificare compatibilità con detergenti industriali usati in manutenzione.$d$
    ),
    (
      '92150',
      'Nastro adesivo DURALINESTRONG 50/05 1021 - permanente - 5 cm x 30 m - blu - Durable',
      'Durable',
      100.00,
      'https://odmultimedia.eu/immagini/MD/92150.jpg',
      null::jsonb,
      $d$Nastro Durable DURALINESTRONG 50/05 1021 permanente, 5 cm × 30 m, blu. Demarcazione a pavimento per corsie, stoccaggi e zone operative secondo codifica colore aziendale. Adesione permanente e buona resistenza all’usura da calpestio. Applicare su cemento/resina liscia e pulita; evitare applicazione a basse temperature. Rimuovere residui con solventi idonei solo se necessario.$d$
    ),
    (
      '101356',
      'Nastro adesivo antiscivolo DURALINE GRIP+ - 5 cm x 15 m - giallo/nero - Durable',
      'Durable',
      80.00,
      'https://odmultimedia.eu/immagini/MD/101356.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101356_2.jpg"]}'::jsonb,
      $d$Nastro antiscivolo Durable DURALINE GRIP+, 5 cm × 15 m, giallo/nero. Larghezza maggiorata per gradini e percorsi pedonali ad alto rischio scivolamento. Texture abrasiva ad alta aderenza; adesivo permanente per interni. Pulire e asciugare il supporto, applicare con pressione uniforme, non calpestare subito dopo l’applicazione. Elemento tipico dei piani di prevenzione antinfortunistica su scale e rampe.$d$
    ),
    (
      '102021',
      'Nastro mascheratura PRO Outdoor - per esterni - 2,5 cm x 50 m - carta washi - blu - Geko - conf. 6 pezzi',
      'Geko',
      40.00,
      'https://odmultimedia.eu/immagini/MD/102021.jpg',
      null::jsonb,
      $d$Nastro mascheratura Geko PRO Outdoor, 2,5 cm × 50 m, carta washi blu, conf. 6 pezzi. Formulato per esterni: buona tenuta su intonaci e superfici irregolari, rimozione pulita se rispettati tempi d’uso. Ideale per verniciatura e demarcazioni temporanee di cantiere. Applicare su superficie asciutta; non esporre oltre i limiti dichiarati dal produttore per evitare residui. Utile anche per proteggere profili durante lavori di manutenzione.$d$
    ),
    (
      '101803',
      'Striscia adesiva antiscivolo ANTISLIP - 1,9 x 61 cm - nero - Geko - conf. 5 pezzi',
      'Geko',
      6.00,
      'https://odmultimedia.eu/immagini/MD/101803.jpg',
      null::jsonb,
      $d$Strisce adesive antiscivolo Geko ANTISLIP, 1,9 × 61 cm, nero, conf. 5 pezzi. Pronte all’uso per gradini, pedane e soglie: riducono lo scivolamento con superficie grit. Tagliare se necessario, applicare su fondo sgrassato e asciutto, pressare bene. Controllare l’usura e sostituire le strisce consumate. Soluzione rapida per interventi di messa in sicurezza puntuale.$d$
    ),
    (
      '98280',
      'Striscia fotoluminescente antiscivolo - 5 x 80 cm - giallo/nero',
      '',
      100.00,
      'https://odmultimedia.eu/immagini/MD/98280.jpg',
      null::jsonb,
      $d$Striscia fotoluminescente antiscivolo 5 × 80 cm, giallo/nero. Combina grip abrasivo e segnalazione luminosa dopo carica alla luce, utile su scale di emergenza e percorsi di esodo. Applicare su superfici pulite; esporre alla luce per ricaricare il fotoluminescente. Verificare periodicamente aderenza e luminosità. Supporta la visibilità delle vie di fuga in condizioni di scarsa illuminazione.$d$
    ),
    (
      '92151',
      'Nastro adesivo DURALINESTRONG 50/05 1043 - rimovibile - 5 cm x 15 m - giallo/nero - Durable',
      'Durable',
      60.00,
      'https://odmultimedia.eu/immagini/MD/92151.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/92151_2.jpg"]}'::jsonb,
      $d$Nastro Durable DURALINESTRONG 50/05 1043 rimovibile, 5 cm × 15 m, giallo/nero. Demarcazione temporanea o riorganizzabile di aree a rischio senza lasciare residui eccessivi se rimosso correttamente. Ideale per layout variabili in magazzino. Applicare su pavimenti lisci e puliti; rimuovere tirando con angolo costante. Non adatto a traffico di carrelli molto aggressivo per periodi prolungati senza controllo.$d$
    ),
    (
      '53734',
      'Nastro adesivo vinilico 471 - 5 cm x 33 m - giallo - Scotch',
      'Scotch',
      60.00,
      'https://odmultimedia.eu/immagini/MD/53734.jpg',
      null::jsonb,
      $d$Nastro adesivo vinilico Scotch 471, 5 cm × 33 m, giallo. Classico nastro di demarcazione pavimenti e segnaletica a terra: buona flessibilità, bordi nitidi e resistenza moderata a solventi/oli a seconda dell’ambiente. Applicare su superfici lisce; pressare con rullo. Usato in linee produttive e aree logistiche per codifica percorsi. Sostituire se sollevato o usurato per mantenere leggibilità e sicurezza.$d$
    ),
    (
      '101808',
      'Nastro adesivo antiscivolo fosforescente ANTISLIP - 5 cm x 15 m - giallo - Geko',
      'Geko',
      60.00,
      'https://odmultimedia.eu/immagini/MD/101808.jpg',
      '{"gallery":["https://odmultimedia.eu/immagini/MD/101808_1.jpg"]}'::jsonb,
      $d$Nastro antiscivolo fosforescente Geko ANTISLIP, 5 cm × 15 m, giallo. Grip + effetto luminoso dopo esposizione alla luce, per scale e passaggi critici anche in scarsa illuminazione. Applicare su supporto pulito e asciutto; lasciare maturare l’adesivo. Ricaricare periodicamente esponendo alla luce artificiale/naturale. Integrabile nei piani di sicurezza antincendio e antinfortunistica.$d$
    ),
    (
      '83510',
      'Adesivo da terra - ''forma a T'' - 10 x 15 cm - Durable - conf. 10 pezzi',
      'Durable',
      40.00,
      'https://odmultimedia.eu/immagini/MD/83510.jpg',
      null::jsonb,
      $d$Adesivi da terra Durable a forma di T, 10 × 15 cm, conf. 10 pezzi. Indicati per segnalare punti di sosta, distanze o posizioni attrezzature a pavimento. Adesione rapida su superfici lisce; pulire e asciugare prima dell’applicazione. Resistenti al calpestio leggero/medio; sostituire se scoloriti o sollevati. Utili per organizzazione spazi e percorsi sicuri in uffici e magazzini.$d$
    ),
    (
      '101802',
      'Nastro adesivo antiscivolo ANTISLIP - 2,5 cm x 5 m - giallo/nero - Geko',
      'Geko',
      7.00,
      'https://odmultimedia.eu/immagini/MD/101802.jpg',
      null::jsonb,
      $d$Nastro antiscivolo Geko ANTISLIP, 2,5 cm × 5 m, giallo/nero. Formato corto per interventi puntuali su gradini, pedane e soglie. Superficie grit ad alta aderenza; applicazione su fondo sgrassato. Pressare i bordi e verificare dopo le prime ore di traffico. Soluzione economica per la messa in sicurezza di punti critici.$d$
    ),
    (
      '102020',
      'Nastro mascheratura PRO Sensitive - per superfici delicate - 2,5 cm x 50 m - carta washi - rosa - Geko - conf. 6 pezzi',
      'Geko',
      40.00,
      'https://odmultimedia.eu/immagini/MD/102020.jpg',
      null::jsonb,
      $d$Nastro mascheratura Geko PRO Sensitive, 2,5 cm × 50 m, carta washi rosa, conf. 6 pezzi. Pensato per superfici delicate (vernici fresche, laminati, plastiche): adesione controllata e rimozione pulita nei tempi consigliati. Ideale in verniciatura di precisione e protezione temporanea. Non lasciare oltre i limiti d’uso; rimuovere lentamente. Utile anche in ambiti tecnici dove serve mascheratura senza danneggiare il supporto.$d$
    ),
    (
      '83513',
      'Adesivo da terra - ''striscia'' - 10 x 15 cm - Durable - conf. 10 pezzi',
      'Durable',
      16.00,
      'https://odmultimedia.eu/immagini/MD/83513.jpg',
      null::jsonb,
      $d$Adesivi da terra Durable a striscia, 10 × 15 cm, conf. 10 pezzi. Demarcazione rapida di zone, code o punti di attenzione a pavimento. Applicare su superficie liscia e pulita; pressare uniformemente. Buona visibilità e tenuta al calpestio ordinario. Sostituire se usurati per mantenere chiarezza della segnaletica e sicurezza degli ambienti.$d$
    )
)
insert into public.products (sku, name, price, image_url, brand, category, subcategory, description, variants, stock)
select
  r.sku,
  r.name,
  r.price,
  r.image_url,
  nullif(r.brand, ''),
  'Sicurezza',
  'Nastri',
  r.description,
  r.variants,
  100
from rows as r
where not exists (select 1 from public.products p where p.sku = r.sku);
