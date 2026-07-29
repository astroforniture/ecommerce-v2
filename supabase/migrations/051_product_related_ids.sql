-- Campo per IDs cross-sell specifici per prodotto (override regola categoria).
-- Array JSON di stringhe: es. '["AF-XS-ROTOLI-TERMICI-57", "AF-XS-CASSETTO-PORTADENARO"]'
alter table public.products
  add column if not exists related_product_ids jsonb;

comment on column public.products.related_product_ids is
  'Array JSON di ID prodotti cross-sell specifici per questo articolo. Se vuoto usa la regola per categoria.';
