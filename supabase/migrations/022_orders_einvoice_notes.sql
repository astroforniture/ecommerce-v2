-- Fattura elettronica opzionale e note ordine in checkout
alter table public.orders
  add column if not exists wants_electronic_invoice boolean not null default false,
  add column if not exists e_invoice_company_name text,
  add column if not exists e_invoice_vat text,
  add column if not exists e_invoice_tax_code text,
  add column if not exists e_invoice_sdi_or_pec text,
  add column if not exists order_notes text;

comment on column public.orders.wants_electronic_invoice is 'Cliente ha richiesto fattura elettronica al checkout.';
comment on column public.orders.e_invoice_company_name is 'Ragione sociale per fattura elettronica.';
comment on column public.orders.e_invoice_vat is 'Partita IVA per fattura elettronica.';
comment on column public.orders.e_invoice_tax_code is 'Codice fiscale per fattura elettronica.';
comment on column public.orders.e_invoice_sdi_or_pec is 'Codice SDI (7 car.) o indirizzo PEC per fattura elettronica.';
comment on column public.orders.order_notes is 'Note ordine / richieste particolari / orari di consegna.';
