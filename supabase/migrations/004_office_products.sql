-- Tabella catalogo office (cartoleria/forniture)
-- Struttura allineata a src/types/officeProduct.ts

create table if not exists public.office_products (
  id text primary key,
  name text not null,
  brand text not null,
  producer_code text not null,
  category text not null,
  main_features jsonb not null default '{}'::jsonb,
  image_url text not null,
  description text,
  price numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint office_products_producer_code_unique unique (producer_code)
);

create index if not exists office_products_category_idx
  on public.office_products (category);

create index if not exists office_products_brand_idx
  on public.office_products (brand);

alter table public.office_products enable row level security;

-- Lettura pubblica dal frontend (anon key)
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'office_products'
      and policyname = 'office_products_select_public'
  ) then
    create policy "office_products_select_public"
      on public.office_products
      for select
      to anon, authenticated
      using (true);
  end if;
end $$;

comment on table public.office_products is 'Catalogo prodotti office (cartoleria e forniture)';
