-- Categoria Agende (hub + sottocategorie) — attiva / visibile in catalogo
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
values (
  'Agende',
  'agende',
  '/agende',
  'https://odmultimedia.eu/immagini/LD/101150.jpg',
  null,
  25,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

with parent_agende as (
  select id from public.office_catalog_categories where slug = 'agende'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select v.name, v.slug, v.listing_path, v.cover_image_url, parent_agende.id, v.sort_order, true
from parent_agende
cross join (
  values
    (
      'Agende Giornaliere',
      'agende-giornaliere',
      '/agende/giornaliere',
      'https://odmultimedia.eu/immagini/LD/101151.jpg',
      10
    ),
    (
      'Agende Settimanali',
      'agende-settimanali',
      '/agende/settimanali',
      'https://odmultimedia.eu/immagini/LD/101152.jpg',
      20
    ),
    (
      'Agende Tascabili',
      'agende-tascabili',
      '/agende/tascabili',
      'https://odmultimedia.eu/immagini/LD/101153.jpg',
      30
    ),
    (
      'Agende Organizer / Ad Anelli',
      'agende-organizer',
      '/agende/organizer',
      'https://odmultimedia.eu/immagini/LD/101154.jpg',
      40
    ),
    (
      'Agende Perpetue / Undated',
      'agende-perpetue',
      '/agende/perpetue',
      'https://odmultimedia.eu/immagini/LD/101155.jpg',
      50
    )
) as v(name, slug, listing_path, cover_image_url, sort_order)
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();
