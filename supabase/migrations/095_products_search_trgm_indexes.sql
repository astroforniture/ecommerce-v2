-- Indici testo per live search (ILIKE / trigram).

create extension if not exists pg_trgm;

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);

create index if not exists products_sku_trgm_idx
  on public.products using gin ((sku::text) gin_trgm_ops);
