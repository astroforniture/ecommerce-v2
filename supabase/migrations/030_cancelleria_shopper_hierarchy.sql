-- Cancelleria → Shopper (+ figlie Carta / Plastica)
-- Crea la tabella se assente (allineata a 023), poi inserisce la gerarchia.

create table if not exists public.office_catalog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  listing_path text not null,
  cover_image_url text,
  parent_id uuid references public.office_catalog_categories (id) on delete cascade,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists office_catalog_categories_parent_id_idx
  on public.office_catalog_categories (parent_id);

create index if not exists office_catalog_categories_parent_slug_idx
  on public.office_catalog_categories (parent_id, slug);

alter table public.office_catalog_categories enable row level security;

drop policy if exists office_catalog_categories_public_read on public.office_catalog_categories;
create policy office_catalog_categories_public_read
  on public.office_catalog_categories
  for select
  to anon, authenticated
  using (is_active = true);

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
values (
  'Cancelleria',
  'cancelleria',
  '/office-products?category=Cancelleria',
  '/cancelleria-penne.jpg',
  null,
  20
)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
  sort_order = excluded.sort_order,
  updated_at = now();

with parent_cancelleria as (
  select id from public.office_catalog_categories where slug = 'cancelleria'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
select
  'Shopper',
  'shopper',
  '/office-products?category=Cancelleria&cancelleriaView=shopper',
  '/images/shopper-category.png',
  parent_cancelleria.id,
  80
from parent_cancelleria
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  updated_at = now();

with parent_shopper as (
  select id from public.office_catalog_categories where slug = 'shopper'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
select v.name, v.slug, v.listing_path, v.cover_image_url, parent_shopper.id, v.sort_order
from parent_shopper
cross join (
  values
    (
      'Shopper in Carta',
      'shopper-carta',
      '/office-products?category=Cancelleria&cancelleriaView=shopper-carta',
      '/shopper-carta-cover.jpg',
      10
    ),
    (
      'Shopper in Plastica',
      'shopper-plastica',
      '/office-products?category=Cancelleria&cancelleriaView=shopper-plastica',
      '/shopper-plastica-cover.jpg',
      20
    )
) as v(name, slug, listing_path, cover_image_url, sort_order)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  updated_at = now();
