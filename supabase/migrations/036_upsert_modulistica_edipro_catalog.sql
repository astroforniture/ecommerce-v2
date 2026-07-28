-- Modulistica: categoria + sottocategorie + articoli Edipro (SKU / EAN)
-- Funzione idempotente: upsert_modulistica_edipro_catalog()
-- CSV di riferimento: scripts/modulistica-edipro.csv

alter table public.products
  add column if not exists ean text;

create index if not exists products_ean_idx on public.products (ean);

create or replace function public.upsert_modulistica_edipro_catalog()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent uuid;
  v_alberghi uuid;
  v_condominio uuid;
  v_count int := 0;
begin
  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
  values (
    'Modulistica',
    'modulistica',
    '/office-products?category=Modulistica',
    '/cancelleria-penne.jpg',
    null,
    25
  )
  on conflict (slug) do update set
    name = excluded.name,
    listing_path = excluded.listing_path,
    cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
    sort_order = excluded.sort_order,
    updated_at = now()
  returning id into v_parent;

  if v_parent is null then
    select id into v_parent from public.office_catalog_categories where slug = 'modulistica' limit 1;
  end if;

  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
  values
    (
      'Alberghi Ristoranti',
      'modulistica-alberghi-ristoranti',
      '/office-products?category=Modulistica&subcategory=Alberghi%20Ristoranti',
      '/cancelleria-penne.jpg',
      v_parent,
      10
    ),
    (
      'Condominio ed Edilizia',
      'modulistica-condominio-edilizia',
      '/office-products?category=Modulistica&subcategory=Condominio%20ed%20Edilizia',
      '/cancelleria-penne.jpg',
      v_parent,
      20
    )
  on conflict (slug) do update set
    name = excluded.name,
    listing_path = excluded.listing_path,
    cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
    parent_id = excluded.parent_id,
    sort_order = excluded.sort_order,
    updated_at = now();

  select id into v_alberghi
  from public.office_catalog_categories
  where slug = 'modulistica-alberghi-ristoranti'
  limit 1;

  select id into v_condominio
  from public.office_catalog_categories
  where slug = 'modulistica-condominio-edilizia'
  limit 1;

  insert into public.products (
    sku, name, price, image_url, brand, category, subcategory, format, ean, description, stock
  )
  values
    (
      'E 5916',
      'Blocco comande - 25x3 fogli autoricalcanti - 17 x 9,9 cm - Edipro',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Alberghi Ristoranti',
      '17 x 9,9 cm',
      '8023328591601',
      'Blocco comande Edipro a 25×3 fogli autoricalcanti, formato 17 × 9,9 cm. Ideale per alberghi e ristoranti.',
      100
    ),
    (
      'E 9117',
      'Blocco comande a 7 tagliandi - 25x2 fogli autoricalcanti - 22 x 10 cm - Edipro',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Alberghi Ristoranti',
      '22 x 10 cm',
      '8023328911706',
      'Blocco comande Edipro a 7 tagliandi, 25×2 fogli autoricalcanti, formato 22 × 10 cm.',
      100
    ),
    (
      'E 5913',
      'Blocco comande - 2 copie autoricalcanti - 17 x 9,9 cm - Edipro',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Alberghi Ristoranti',
      '17 x 9,9 cm',
      '8023328591304',
      'Blocco comande Edipro a 2 copie autoricalcanti, formato 17 × 9,9 cm.',
      100
    ),
    (
      'E 5504 C',
      'Blocco ricevuta d’affitto 50×2 autoricalcante – Formato 9,9×17',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Condominio ed Edilizia',
      '9,9 x 17 cm',
      '8023328550417',
      'Blocco ricevuta d’affitto Edipro 50×2 autoricalcante, formato 9,9 × 17 cm. Per condominio e edilizia.',
      100
    ),
    (
      'E 2529',
      'Verbale assemblea condominio 96 pagine – Formato 31×24,5',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Condominio ed Edilizia',
      '31 x 24,5 cm',
      null,
      'Verbale assemblea di condominio Edipro, 96 pagine, formato 31 × 24,5 cm.',
      100
    ),
    (
      'E 5563 C',
      'Blocco ricevuta generica 50×2 autoricalcante – Formato 9,9×17',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Condominio ed Edilizia',
      '9,9 x 17 cm',
      '8023328556310',
      'Blocco ricevuta generica Edipro 50×2 autoricalcante, formato 9,9 × 17 cm.',
      100
    ),
    (
      'E 2104 A',
      'Registro prima nota IVA corrispettivi 13×2 (1 anno) autoricalcante – Formato 29,7×23',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Condominio ed Edilizia',
      '29,7 x 23 cm',
      '8023328210410',
      'Registro prima nota IVA corrispettivi Edipro 13×2 (1 anno) autoricalcante, formato 29,7 × 23 cm.',
      100
    ),
    (
      'E 2102 A',
      'Registro prima nota IVA corrispettivi 25×2 (2 anni) autoricalcante – Formato 29,7×23',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Condominio ed Edilizia',
      '29,7 x 23 cm',
      '8023328210212',
      'Registro prima nota IVA corrispettivi Edipro 25×2 (2 anni) autoricalcante, formato 29,7 × 23 cm.',
      100
    ),
    (
      'E 2108',
      'Registro dei corrispettivi per mancato o irregolare funzionamento registratori di cassa – Formato 31×24,5',
      0,
      '/cancelleria-penne.jpg',
      'Edipro',
      'Modulistica',
      'Condominio ed Edilizia',
      '31 x 24,5 cm',
      null,
      'Registro dei corrispettivi Edipro per mancato o irregolare funzionamento dei registratori di cassa, formato 31 × 24,5 cm.',
      100
    )
  on conflict (sku) do update set
    name = excluded.name,
    price = excluded.price,
    image_url = excluded.image_url,
    brand = excluded.brand,
    category = excluded.category,
    subcategory = excluded.subcategory,
    format = excluded.format,
    ean = excluded.ean,
    description = excluded.description,
    stock = excluded.stock;

  get diagnostics v_count = row_count;

  return jsonb_build_object(
    'ok', true,
    'category_id', v_parent,
    'subcategory_alberghi_id', v_alberghi,
    'subcategory_condominio_id', v_condominio,
    'products_upserted', 9,
    'rows_affected', v_count
  );
end;
$$;

grant execute on function public.upsert_modulistica_edipro_catalog() to anon, authenticated, service_role;

select public.upsert_modulistica_edipro_catalog();
