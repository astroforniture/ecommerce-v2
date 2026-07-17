-- Catalogo medico Astro (lettura pubblica da SPA con anon key)
-- Esegui in Supabase: SQL Editor → New query → Incolla → Run

create table if not exists public.medical_products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  full_description text not null,
  price numeric(12, 2) not null check (price >= 0),
  -- Slug macro come in src/data/medicalProducts.ts (es. diagnostica, emergenza, arredo)
  macro_id text not null,
  -- Deve coincidere con labelAsPublished Gima (es. "Medical bags")
  gima_department_label text not null,
  image_url text,
  cta text check (cta is null or cta in ('quote', 'buy')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists medical_products_macro_id_idx
  on public.medical_products (macro_id);

create index if not exists medical_products_sku_idx
  on public.medical_products (sku);

alter table public.medical_products enable row level security;

-- Solo lettura per il sito (chiave anon)
create policy "medical_products_select_public"
  on public.medical_products
  for select
  to anon, authenticated
  using (true);

-- Inserimenti/aggiornamenti: usa Dashboard Table Editor (autenticato) o service role lato server.
-- Nessuna policy insert/update per anon di proposito.

comment on table public.medical_products is 'Catalogo Gima / Astro Medical; popolato da back-office o import';

-- Esempio (dati reali solo se coerenti col listino):
-- insert into public.medical_products
--   (sku, name, full_description, price, macro_id, gima_department_label, cta)
-- values
--   (
--     '27226',
--     'GIMA CASE 430 con inserti spugna — arancione',
--     'Valigia GIMA certificata IP67…',
--     289.00,
--     'organizzazione-ausili',
--     'Medical bags',
--     'quote'
--   );
