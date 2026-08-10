-- Agende production sync (mirato): banner, sottocategorie, Planning.

-- Banner / cover categoria madre Agende
update public.office_catalog_categories
set
  cover_image_url = 'https://www.bernispa.com/storage/media/51569/alfa.jpg'
where slug = 'agende'
   or (parent_id is null and name ilike 'Agende');

-- Cover sottocategorie attive
update public.office_catalog_categories
set
  cover_image_url = 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg'
where slug in ('agende-giornaliere', 'giornaliere')
   or name ilike 'Agende Giornaliere';

update public.office_catalog_categories
set
  cover_image_url = 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7157AF-1024-1024-0.jpg'
where slug in ('agende-settimanali', 'settimanali')
   or name ilike 'Agende Settimanali';

-- Prodotti Organizer → Planning
update public.products
set subcategory = 'Agende Planning'
where category ilike 'Agende'
  and (
    subcategory ilike 'Agende Organizer / Ad Anelli'
    or subcategory ilike 'Agende Organizer'
  );

-- Prodotti Perpetue → Planning
update public.products
set subcategory = 'Agende Planning'
where category ilike 'Agende'
  and (
    subcategory ilike 'Agende Perpetue / Undated'
    or subcategory ilike 'Agende Perpetue'
    or subcategory ilike '%Undated%'
  );

-- Prodotti Tascabili → Settimanali
update public.products
set subcategory = 'Agende Settimanali'
where category ilike 'Agende'
  and subcategory ilike 'Agende Tascabili';

-- Rinomina Organizer → Planning
update public.office_catalog_categories
set
  name = 'Agende Planning',
  slug = 'agende-planning',
  listing_path = '/agende/planning',
  cover_image_url = 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7755AF-1024-1024-0.jpg',
  is_active = true
where slug in ('agende-organizer', 'organizer', 'agende-planning')
   or name ilike 'Agende Organizer%'
   or name ilike 'Agende Planning';

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Agende Planning',
  'agende-planning',
  '/agende/planning',
  'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7755AF-1024-1024-0.jpg',
  (select id from public.office_catalog_categories where slug = 'agende' limit 1),
  40,
  true
where exists (select 1 from public.office_catalog_categories where slug = 'agende')
  and not exists (select 1 from public.office_catalog_categories where slug = 'agende-planning')
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  is_active = true;

-- Disattiva Perpetue
update public.office_catalog_categories
set is_active = false
where slug in ('agende-perpetue', 'perpetue')
   or name ilike 'Agende Perpetue%'
   or name ilike '%Undated%';

-- Disattiva Tascabili
update public.office_catalog_categories
set is_active = false
where slug in ('agende-tascabili', 'tascabili')
   or name ilike 'Agende Tascabili';
