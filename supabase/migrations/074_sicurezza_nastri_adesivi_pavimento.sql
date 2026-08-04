-- Sicurezza → Nastri: +13 adesivi/segnaletica da pavimento

create temporary table tmp_sicurezza_nastri_extra (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  color_name text,
  format text,
  variants jsonb,
  description text not null
) on commit drop;

insert into tmp_sicurezza_nastri_extra (
  sku, name, brand, price, image_url, color_name, format, variants, description
)
values
  (
    '92152',
    'Striscia segnaletica - da terra - 61 x 15 cm - giallo/nero - Djois',
    'Djois',
    35.00,
    'https://odmultimedia.eu/immagini/MD/92152.jpg',
    'giallo/nero',
    '61 × 15 cm',
    '{"gallery":["https://odmultimedia.eu/immagini/MD/92152_1.jpg"]}'::jsonb,
    $d$Striscia segnaletica adesiva da terra Djois, 61 × 15 cm, giallo/nero. Demarcazione ad alta visibilità per zone di pericolo, percorsi e aree di carico in magazzini e produzione. Superficie antiscivolo tipicamente in classe R9/R10 (verificare scheda lotto) e resistenza elevata al calpestio e al passaggio di carrelli elevatori se correttamente applicata. Facile da applicare su pavimenti lisci e asciutti e rimovibile a fine lavori senza lasciare residui eccessivi. Ideale per segnaletica aziendale permanente o semi-permanente conforme alle buone pratiche di prevenzione.$d$
  ),
  (
    '92143',
    'Segnaletica adesiva - da terra - "finestra" - 40,1 x 31,4 cm - Djois - conf. 10 pezzi',
    'Djois',
    120.00,
    'https://odmultimedia.eu/immagini/MD/92143.jpg',
    null,
    '40,1 × 31,4 cm · conf. 10 pz',
    '{"gallery":["https://odmultimedia.eu/immagini/MD/92143_1.jpg","https://odmultimedia.eu/immagini/MD/92143_2.jpg"]}'::jsonb,
    $d$Segnaletica adesiva da terra Djois a forma di “finestra”, 40,1 × 31,4 cm, confezione da 10 pezzi. Definisce aree di stazionamento, punti di attenzione o box operativi sul pavimento. Materiale resistente al calpestio e al traffico di carrelli (prestazioni antiscivolo tipiche R9/R10 ove dichiarate). Applicazione rapida: pulire, posizionare, pressare i bordi; rimozione agevole in caso di riorganizzazione layout. Adatta a logistica, produzione e retail per segnaletica da pavimento conforme alle procedure aziendali di sicurezza.$d$
  ),
  (
    '83511',
    'Adesivo da terra - "croce" - 15 x 15 cm - Durable - conf. 10 pezzi',
    'Durable',
    35.00,
    'https://odmultimedia.eu/immagini/MD/83511.jpg',
    null,
    '15 × 15 cm · conf. 10 pz',
    null::jsonb,
    $d$Adesivo da terra Durable a forma di croce, 15 × 15 cm, conf. 10 pezzi. Pittogramma/forma geometrica per indicare punti di sosta, intersezioni o zone di attenzione. Resistente al calpestio quotidiano; superfici antiscivolo tipiche della linea Durable per pavimenti (R9/R10 ove marcate). Facile applicazione e rimozione senza danneggiare pavimentazioni lisce. Ideale per magazzini, uffici open space e aree di attesa.$d$
  ),
  (
    '83514',
    'Adesivo da terra - "orme" - 9 x 24 cm - Durable - conf. 5 paia',
    'Durable',
    35.00,
    'https://odmultimedia.eu/immagini/MD/83514.jpg',
    null,
    '9 × 24 cm · conf. 5 paia',
    null,
    $d$Adesivo da terra Durable a forma di orme, 9 × 24 cm, conf. 5 paia. Guida visiva per percorsi pedonali, code e distanziamento. Tenuta elevata al calpestio; materiale pensato per traffico intenso e passaggio occasionale di carrelli leggeri. Applicazione semplice su pavimenti puliti e asciutti; rimozione netta in caso di cambi layout. Supporta la segnaletica aziendale da pavimento e le procedure di sicurezza interne.$d$
  ),
  (
    '87027',
    'Adesivo da terra - "freccia" - 10 x 20 cm - Durable - conf. 10 pezzi',
    'Durable',
    25.00,
    'https://odmultimedia.eu/immagini/MD/87027.jpg',
    null,
    '10 × 20 cm · conf. 10 pz',
    '{"gallery":["https://odmultimedia.eu/immagini/MD/87027_1.jpg"]}'::jsonb,
    $d$Adesivo da terra Durable a forma di freccia, 10 × 20 cm, conf. 10 pezzi. Indica senso di marcia, percorsi obbligati e flussi di persone/merci. Resistenza al calpestio e grip antiscivolo tipico R9/R10 (verificare etichetta). Facile da applicare e sostituire; adatto a pavimenti industriali e commerciali. Utile in logistica, punti vendita e aree di produzione per ordinare i flussi e ridurre rischi di interferenza.$d$
  ),
  (
    '83510',
    'Adesivo da terra - "forma a T" - 10 x 15 cm - Durable - conf. 10 pezzi',
    'Durable',
    25.00,
    'https://odmultimedia.eu/immagini/MD/83510.jpg',
    null,
    '10 × 15 cm · conf. 10 pz',
    null,
    $d$Adesivo da terra Durable a forma di T, 10 × 15 cm, conf. 10 pezzi. Elemento di demarcazione per angoli, baie e punti di allineamento a pavimento. Resistente al calpestio e al traffico di carrelli se correttamente posato; superfici antiscivolo della famiglia Durable. Applicazione e rimozione rapide per layout flessibili. Ideale in magazzini e linee produttive.$d$
  ),
  (
    '83512',
    'Adesivo da terra - "forma a L" - 10 x 10 cm - Durable - conf. 10 pezzi',
    'Durable',
    25.00,
    'https://odmultimedia.eu/immagini/MD/83512.jpg',
    null,
    '10 × 10 cm · conf. 10 pz',
    null,
    $d$Adesivo da terra Durable a forma di L, 10 × 10 cm, conf. 10 pezzi. Angoli di demarcazione per box, pallet e zone operative. Alta resistenza al calpestio; grip tipico antiscivolo R9/R10 ove dichiarato. Posizionamento preciso e rimozione senza tracce eccessive su pavimenti lisci. Complementare a nastri e strisce per segnaletica da pavimento aziendale.$d$
  ),
  (
    '87026',
    'Adesivo da terra - "punto" - diametro 10 cm - Durable - conf. 10 pezzi',
    'Durable',
    15.00,
    'https://odmultimedia.eu/immagini/MD/87026.jpg',
    null,
    'Ø 10 cm · conf. 10 pz',
    null,
    $d$Adesivo da terra Durable a forma di punto, diametro 10 cm, conf. 10 pezzi. Marker circolare per punti di sosta, postazioni o indicatori di distanza. Resistente al calpestio quotidiano; facile applicazione e rimozione. Ideale per uffici, retail e logistica leggera. Integrabile in piani di segnaletica da pavimento e distanziamento.$d$
  ),
  (
    '80656',
    'Adesivo segnalatore Take Care - da terra - "estintore" - 70 x 35 cm - CEP',
    'CEP',
    35.00,
    'https://odmultimedia.eu/immagini/MD/80656.jpg',
    null,
    '70 × 35 cm · estintore',
    '{"gallery":["https://odmultimedia.eu/immagini/MD/80656_1.jpg"]}'::jsonb,
    $d$Adesivo segnalatore Take Care CEP da terra “estintore”, 70 × 35 cm. Indica chiaramente la posizione dell’estintore sul pavimento per una individuazione rapida in emergenza. Materiale ad elevata resistenza al calpestio e al passaggio di carrelli; superficie antiscivolo tipica R9/R10 ove dichiarata. Applicazione semplice su pavimenti puliti; rimozione agevole in caso di spostamento DPI antincendio. Supporta la conformità alle procedure di sicurezza e alla segnaletica di emergenza aziendale.$d$
  ),
  (
    '80657',
    'Adesivo segnalatore Take Care - da terra - "rischio elettrico" - 70 x 35 cm - CEP',
    'CEP',
    35.00,
    'https://odmultimedia.eu/immagini/MD/80657.jpg',
    null,
    '70 × 35 cm · rischio elettrico',
    '{"gallery":["https://odmultimedia.eu/immagini/MD/80657_1.jpg"]}'::jsonb,
    $d$Adesivo segnalatore Take Care CEP da terra “rischio elettrico”, 70 × 35 cm. Avverte della presenza di pericolo elettrico nella zona demarcata. Resistente al calpestio e al traffico di carrelli; grip antiscivolo tipico della linea Take Care. Facile da applicare e rimuovere per aggiornare le zone a rischio. Ideale in locali tecnici, quadri e aree di manutenzione elettrica, a supporto della segnaletica di sicurezza prevista dalle procedure aziendali e dal D.Lgs. 81/08.$d$
  ),
  (
    '92283',
    'Pittogramma adesivo - da terra - "Mantenere la distanza di sicurezza" - diametro 43 cm - Durable',
    'Durable',
    15.00,
    'https://odmultimedia.eu/immagini/MD/92283.jpg',
    null,
    'Ø 43 cm',
    '{"gallery":["https://odmultimedia.eu/immagini/MD/92283_1.jpg","https://odmultimedia.eu/immagini/MD/92283_2.jpg"]}'::jsonb,
    $d$Pittogramma adesivo da terra Durable “Mantenere la distanza di sicurezza”, diametro 43 cm. Messaggio chiaro per distanziamento in code, reception e aree di attesa. Superficie resistente al calpestio intenso; antiscivolo tipico R9/R10 ove marcato. Applicazione e rimozione rapide su pavimenti lisci. Utile per retail, uffici e ambienti pubblici a supporto delle procedure di sicurezza e di organizzazione dei flussi.$d$
  ),
  (
    '90446',
    'Adesivo da terra - "mantenere la distancia di sicurezza" - 90 x 10 cm - Studio T - conf. 5 pezzi',
    'Studio T',
    35.00,
    'https://odmultimedia.eu/immagini/MD/90446.jpg',
    null,
    '90 × 10 cm · conf. 5 pz',
    null,
    $d$Adesivo da terra Studio T “mantener la distancia di seguridad”, 90 × 10 cm, conf. 5 pezzi. Striscia testuale per distanziamento in ambienti bilingue o con clientela internazionale. Resistente al calpestio; facile applicazione e rimozione. Ideale per retail, hospitality e uffici. Integrabile con pittogrammi circolari e orme per una segnaletica da pavimento coerente.$d$
  ),
  (
    '90445',
    'Adesivo da terra - "attendere dietro alla linea" - 45 x 8 cm - Studio T - conf. 5 pezzi',
    'Studio T',
    35.00,
    'https://odmultimedia.eu/immagini/MD/90445.jpg',
    null,
    '45 × 8 cm · conf. 5 pz',
    null,
    $d$Adesivo da terra Studio T “attendere dietro alla linea”, 45 × 8 cm, conf. 5 pezzi. Indica la linea di attesa in casse, sportelli e punti di servizio. Materiale resistente al calpestio quotidiano; applicazione semplice e rimozione netta. Adatto a retail, PA e reception. Contribuisce all’ordine dei flussi e alla sicurezza operativa delle code.$d$
  );

update public.products as p
set
  name = t.name,
  brand = t.brand,
  price = t.price,
  image_url = t.image_url,
  color_name = t.color_name,
  format = t.format,
  variants = t.variants,
  description = t.description,
  category = 'Sicurezza',
  subcategory = 'Nastri',
  stock = coalesce(p.stock, 100)
from tmp_sicurezza_nastri_extra as t
where p.sku = t.sku;

insert into public.products (
  sku, name, price, image_url, brand, category, subcategory,
  description, color_name, format, variants, stock
)
select
  t.sku,
  t.name,
  t.price,
  t.image_url,
  t.brand,
  'Sicurezza',
  'Nastri',
  t.description,
  t.color_name,
  t.format,
  t.variants,
  100
from tmp_sicurezza_nastri_extra as t
where not exists (select 1 from public.products p where p.sku = t.sku);
