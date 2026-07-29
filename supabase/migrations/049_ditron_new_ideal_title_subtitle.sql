-- NEW iDEAL: titolo + sottotitolo aggiornati
alter table public.products
  add column if not exists subtitle text;

update public.products
set
  name = 'Registratore Telematico Ditron NEW iDEAL',
  subtitle = 'Registratore di cassa touch con Wi-Fi integrato, installazione, configurazione e assistenza dedicate per negozi, bar, ristoranti e attività commerciali.',
  brochure_url = coalesce(brochure_url, '/pdf/brochure-new-ideal.pdf'),
  category = 'Macchine per Ufficio',
  subcategory = coalesce(nullif(trim(subcategory), ''), 'Casse Ditron')
where sku = 'AF-DITRON-new-ideal';
