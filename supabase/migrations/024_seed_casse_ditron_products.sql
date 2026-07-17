-- Prodotti Casse Ditron (Macchine per Ufficio)
insert into public.products (sku, name, price, image_url, brand, category, description)
values
  (
    'AF-DITRON-advance-safemoney',
    'ADVANCE | SafeMoney',
    null,
    '/macchine-per-ufficio/casse-ditron/image_18c927.jpg',
    'Ditronetwork',
    'Macchine per Ufficio',
    'Sistema di cash-handling progettato per automatizzare la gestione dei pagamenti in contanti, rendendo i flussi più rapidi e sicuri. Riduce gli errori di cassa, protegge dai furti ed è ideale per punti vendita ad alta affluenza. Integra uno schermo touchscreen grafico da 10" e supporta la gestione multicassa.'
  ),
  (
    'AF-DITRON-pax-q58-gem',
    'PAX SERIE Q58 GEM | Pos Bancario',
    null,
    '/macchine-per-ufficio/casse-ditron/image_18cd43.png',
    'PAX',
    'Macchine per Ufficio',
    'Terminale di pagamento da banco PAX Serie Q58 GEM: design moderno, processore veloce e connettività avanzata. Ideale per Banking e Retail, integrabile con registratori telematici Ditron e dematerializzazione scontrini.'
  ),
  (
    'AF-DITRON-new-ideal',
    'NEW iDEAL',
    null,
    '/macchine-per-ufficio/casse-ditron/image_18d0c9.jpg',
    'Ditronetwork',
    'Macchine per Ufficio',
    'Registratore Telematico conforme ai requisiti dell''Agenzia delle Entrate. Display touch, interfaccia intuitiva e sistema antitampering per la massima sicurezza dei dati fiscali.'
  )
on conflict (sku) do update set
  name = excluded.name,
  price = excluded.price,
  image_url = excluded.image_url,
  brand = excluded.brand,
  category = excluded.category,
  description = excluded.description;

-- Metadati estesi in office_catalog_categories (opzionale, se tabella presente)
update public.office_catalog_categories
set cover_image_url = '/macchine-per-ufficio/image_184622.png',
    updated_at = now()
where slug = 'casse-ditron';
