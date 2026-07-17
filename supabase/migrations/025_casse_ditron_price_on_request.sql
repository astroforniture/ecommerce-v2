-- Casse Ditron: prezzo non pubblico (solo preventivo)
update public.products
set price = null
where sku like 'AF-DITRON-%';

comment on column public.products.price is
  'Prezzo imponibile unitario; NULL = su preventivo / non mostrato al pubblico.';
