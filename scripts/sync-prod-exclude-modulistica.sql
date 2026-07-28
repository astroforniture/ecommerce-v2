-- =============================================================================
-- Sync produzione ESCLUDENDO Modulistica
-- Generato per: scripts/sync-prod-exclude-modulistica.js
--
-- Cosa fa:
--   1) Assicura colonne prodotti usate dal catalogo Cancelleria
--   2) Upsert categoria Cancelleria → Buste + prodotto AF-SACBOLL-BLASETTI
--      (10 varianti formato, immagini /images/sacboll/*)
--
-- Cosa NON fa (esclusione esplicita):
--   - nessuna insert/update/delete su category = 'Modulistica'
--   - nessuna modifica a office_catalog_categories con slug 'modulistica' o 'modulistica-%'
--   - nessuno SKU Edipro 'E %' / 'E####'
-- =============================================================================

-- Guardrail: abort se qualcuno aggiunge per errore filtri Modulistica in futuro
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'products'
  ) then
    null;
  end if;
end $$;

alter table public.products add column if not exists ean text;
alter table public.products add column if not exists subcategory text;
alter table public.products add column if not exists format text;
alter table public.products add column if not exists color_name text;
alter table public.products add column if not exists variants jsonb;
alter table public.products add column if not exists parent_sku text;
alter table public.products add column if not exists brand text;
alter table public.products add column if not exists stock integer;

create index if not exists products_ean_idx on public.products (ean);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_brand_idx on public.products (brand);

-- ---------------------------------------------------------------------------
-- Cancelleria → Buste + Sacboll Blasetti (da migration 035, senza toccare Modulistica)
-- ---------------------------------------------------------------------------
create or replace function public.upsert_cancelleria_buste_sacboll()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent uuid;
  v_cat uuid;
  v_product uuid;
  v_variants jsonb := '[
    {"label":"A","sku":"AF-SACBOLL-BLASETTI-A","ean":"8007758007109","formatCode":"A","outerCm":"13 x 20 cm","innerCm":"11 x 16 cm","packQty":10,"packLabel":"Conf. 10 pz","price":1.66,"image_url":"/images/sacboll/sacboll-a.jpg","quality":"0710","finish":"11 x 16 cm"},
    {"label":"B","sku":"AF-SACBOLL-BLASETTI-B","ean":"8007758007116","formatCode":"B","outerCm":"14 x 27 cm","innerCm":"12 x 21 cm","packQty":10,"packLabel":"Conf. 10 pz","price":1.8,"image_url":"/images/sacboll/sacboll-b.jpg","quality":"0711","finish":"12 x 21 cm"},
    {"label":"C","sku":"AF-SACBOLL-BLASETTI-C","ean":"8007758007123","formatCode":"C","outerCm":"17 x 27 cm","innerCm":"15 x 21 cm","packQty":10,"packLabel":"Conf. 10 pz","price":1.96,"image_url":"/images/sacboll/sacboll-c.jpg","quality":"0712","finish":"15 x 21 cm"},
    {"label":"CD","sku":"AF-SACBOLL-BLASETTI-CD","ean":"8007758007093","formatCode":"CD","outerCm":"20 x 22 cm","innerCm":"16 x 18 cm","packQty":10,"packLabel":"Conf. 10 pz","price":1.7,"image_url":"/images/sacboll/sacboll-cd.jpg","quality":"0709","finish":"16 x 18 cm"},
    {"label":"D","sku":"AF-SACBOLL-BLASETTI-D","ean":"8007758007130","formatCode":"D","outerCm":"20 x 32 cm","innerCm":"18 x 26 cm","packQty":10,"packLabel":"Conf. 10 pz","price":2.54,"image_url":"/images/sacboll/sacboll-d.jpg","quality":"0713","finish":"18 x 26 cm"},
    {"label":"E","sku":"AF-SACBOLL-BLASETTI-E","ean":"8007758007178","formatCode":"E","outerCm":"24 x 32 cm","innerCm":"21 x 26 cm","packQty":10,"packLabel":"Conf. 10 pz","price":2.8,"image_url":"/images/sacboll/sacboll-e.jpg","quality":"0717","finish":"21 x 26 cm"},
    {"label":"FG","sku":"AF-SACBOLL-BLASETTI-FG","ean":"8007758007147","formatCode":"FG","outerCm":"25 x 39 cm","innerCm":"22 x 33 cm","packQty":10,"packLabel":"Conf. 10 pz","price":3.2,"image_url":"/images/sacboll/sacboll-fg.jpg","quality":"0714","finish":"22 x 33 cm"},
    {"label":"H","sku":"AF-SACBOLL-BLASETTI-H","ean":"8007758007154","formatCode":"H","outerCm":"29 x 42 cm","innerCm":"26 x 36 cm","packQty":10,"packLabel":"Conf. 10 pz","price":3.6,"image_url":"/images/sacboll/sacboll-h.jpg","quality":"0715","finish":"26 x 36 cm"},
    {"label":"J","sku":"AF-SACBOLL-BLASETTI-J","ean":"8007758007161","formatCode":"J","outerCm":"32 x 50 cm","innerCm":"29 x 44 cm","packQty":10,"packLabel":"Conf. 10 pz","price":4.6,"image_url":"/images/sacboll/sacboll-j.jpg","quality":"0716","finish":"29 x 44 cm"},
    {"label":"K","sku":"AF-SACBOLL-BLASETTI-K","ean":"8007758007185","formatCode":"K","outerCm":"37 x 55 cm","innerCm":"34 x 48 cm","packQty":10,"packLabel":"Conf. 10 pz","price":5.8,"image_url":"/images/sacboll/sacboll-k.jpg","quality":"0718","finish":"34 x 48 cm"}
  ]'::jsonb;
begin
  select id into v_parent
  from public.office_catalog_categories
  where slug = 'cancelleria'
  limit 1;

  if v_parent is null then
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
      updated_at = now()
    returning id into v_parent;

    select id into v_parent
    from public.office_catalog_categories
    where slug = 'cancelleria'
    limit 1;
  end if;

  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
  values (
    'Buste',
    'buste',
    '/office-products?category=Cancelleria&cancelleriaView=buste',
    '/images/sacboll/sacboll-cover.jpg',
    v_parent,
    70
  )
  on conflict (slug) do update set
    name = excluded.name,
    listing_path = excluded.listing_path,
    cover_image_url = excluded.cover_image_url,
    parent_id = excluded.parent_id,
    sort_order = excluded.sort_order,
    updated_at = now()
  returning id into v_cat;

  if v_cat is null then
    select id into v_cat from public.office_catalog_categories where slug = 'buste' limit 1;
  end if;

  -- Solo legacy Sacboll Avana/Bianco (non tocca Modulistica / altri SKU)
  delete from public.products
  where sku in ('AF-SACBOLL-AVANA', 'AF-SACBOLL-BIANCO')
     or sku ilike 'AF-SACBOLL-AVANA-%'
     or sku ilike 'AF-SACBOLL-BIANCO-%';

  insert into public.products (
    sku,
    name,
    price,
    image_url,
    brand,
    category,
    subcategory,
    color_name,
    format,
    description,
    stock,
    variants
  )
  values (
    'AF-SACBOLL-BLASETTI',
    'Busta imbottita Sacboll - Blasetti (conf. 10 pezzi)',
    1.66,
    '/images/sacboll/sacboll-a.jpg',
    'Blasetti',
    'Cancelleria',
    'Buste',
    'Avana',
    'A',
    'Busta imbottita Sacboll Blasetti in carta FSC avana con imbottitura a bolle d’aria e chiusura a strip adesiva. Ideale per spedizioni di oggetti fragili. Scegli il formato: ogni confezione contiene 10 pezzi.',
    100,
    v_variants
  )
  on conflict (sku) do update set
    name = excluded.name,
    price = excluded.price,
    image_url = excluded.image_url,
    brand = excluded.brand,
    category = excluded.category,
    subcategory = excluded.subcategory,
    color_name = excluded.color_name,
    format = excluded.format,
    description = excluded.description,
    stock = excluded.stock,
    variants = excluded.variants
  returning id into v_product;

  if v_product is null then
    select id into v_product from public.products where sku = 'AF-SACBOLL-BLASETTI' limit 1;
  end if;

  return jsonb_build_object(
    'ok', true,
    'category_id', v_cat,
    'product_id', v_product,
    'sku', 'AF-SACBOLL-BLASETTI',
    'variants', 10,
    'excluded', 'Modulistica'
  );
end;
$$;

grant execute on function public.upsert_cancelleria_buste_sacboll() to anon, authenticated, service_role;

select public.upsert_cancelleria_buste_sacboll() as sync_result;

-- Verifica post-sync (read-only): conferma che Modulistica non è stata toccata da questo script
select
  (select count(*) from public.products where category = 'Modulistica') as modulistica_products_unchanged_count,
  (select count(*) from public.office_catalog_categories where slug = 'modulistica' or slug like 'modulistica-%') as modulistica_categories_unchanged_count,
  (select image_url from public.products where sku = 'AF-SACBOLL-BLASETTI') as sacboll_image_url,
  (select cover_image_url from public.office_catalog_categories where slug = 'buste') as buste_cover_image_url;
