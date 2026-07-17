-- Catalogo usato dal frontend: src/api/officeProductsSupabase.ts → tabella `public.products`
-- Se il catalogo risulta vuoto o la tabella non esiste, applica questa migration in Supabase SQL Editor
-- oppure: supabase db push / migrate.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  price numeric(12, 2),
  image_url text,
  brand text,
  category text,
  description text,
  variants jsonb,
  parent_sku text,
  color_name text,
  stock integer
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_brand_idx on public.products (brand);

alter table public.products enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'products'
      and policyname = 'products_select_public'
  ) then
    create policy "products_select_public"
      on public.products
      for select
      to anon, authenticated
      using (true);
  end if;
end $$;

comment on table public.products is 'Catalogo e-commerce office (lettura da anon/authenticated per policy products_select_public)';

-- 5 prodotti di prova (cancelleria / archiviazione). Idempotente su sku.
insert into public.products (sku, name, price, image_url, brand, category, description)
values
  (
    'DEMO-PEN-001',
    'Penna a sfera blu — confezione 50 pz',
    12.90,
    'https://placehold.co/400x400/e2e8f0/1e293b?text=Penna',
    'STARLINE',
    'Cancelleria',
    'Penna a scatto, inchiostro blu, tratto medio. Ideale per ufficio e scuola.'
  ),
  (
    'DEMO-REG-A4',
    'Registratore in cartone dorso 8 cm — A4',
    8.50,
    'https://placehold.co/400x400/e2e8f0/1e293b?text=Registratore',
    'Esselte',
    'Archiviazione',
    'Registratore con meccanismo a leva, dorso 8 cm, formato A4.'
  ),
  (
    'DEMO-FALD-A4',
    'Faldone legale con elastico — A4',
    3.20,
    'https://placehold.co/400x400/e2e8f0/1e293b?text=Faldone',
    'STARLINE',
    'Archiviazione',
    'Cartoncino rinforzato, chiusura con elastici colorati.'
  ),
  (
    'DEMO-POST-IT',
    'Post-it giallo 76x76 mm — blocchetto 100 fogli',
    4.10,
    'https://placehold.co/400x400/e2e8f0/1e293b?text=Post-it',
    '3M',
    'Cancelleria',
    'Note adesive rimovibili, ad alta visibilità.'
  ),
  (
    'DEMO-GRAF',
    'Graffatrice metallica — 24/6',
    15.00,
    'https://placehold.co/400x400/e2e8f0/1e293b?text=Graffatrice',
    'Leitz',
    'Cancelleria',
    'Graffatrice da tavolo per punti 24/6 e 26/6, capacità 25 fogli.'
  )
on conflict (sku) do nothing;
