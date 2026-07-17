-- Catalogo categorie / sottocategorie office (navigazione e card hub)
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

comment on table public.office_catalog_categories is
  'Macro-categorie e sottocategorie del catalogo office (hub Macchine per Ufficio, ecc.).';

-- Macro-categoria Macchine per Ufficio
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
values (
  'Macchine per Ufficio',
  'macchine-per-ufficio',
  '/prodotti/macchine-per-ufficio',
  null,
  null,
  40
)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Sottocategorie sotto Macchine per Ufficio
with parent_macchine as (
  select id from public.office_catalog_categories where slug = 'macchine-per-ufficio'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
select v.name, v.slug, v.listing_path, v.cover_image_url, parent_macchine.id, v.sort_order
from parent_macchine
cross join (
  values
    (
      'Distruggi Documenti',
      'distruggi-documenti',
      '/prodotti/macchine-per-ufficio/distruggi-documenti',
      'https://odmultimedia.eu/immagini/MD/92766.jpg',
      10
    ),
    (
      'Etichettatrici',
      'etichettatrici',
      '/prodotti/macchine-per-ufficio/etichettatrici',
      'https://odmultimedia.eu/immagini/HD/48891.jpg',
      20
    ),
    (
      'Casse Ditron',
      'casse-ditron',
      '/prodotti/macchine-per-ufficio/casse-ditron',
      '/macchine-per-ufficio/image_184622.png',
      30
    )
) as v(name, slug, listing_path, cover_image_url, sort_order)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  updated_at = now();

alter table public.office_catalog_categories enable row level security;

drop policy if exists office_catalog_categories_public_read on public.office_catalog_categories;
create policy office_catalog_categories_public_read
  on public.office_catalog_categories
  for select
  to anon, authenticated
  using (is_active = true);
