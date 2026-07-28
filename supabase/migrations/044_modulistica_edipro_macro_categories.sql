-- Modulistica: accorpa micro-sottocategorie nelle 5 macro Edipro
-- (Alberghi e Ristoranti, Condominio ed Edilizia, Contabilità IVA e Generale,
--  Magazzino e Trasporti, Stampati Fiscali) + cover image dedicate.

create or replace function public.realign_modulistica_edipro_macros()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent uuid;
  v_products int := 0;
  v_deactivated int := 0;
begin
  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
  values (
    'Modulistica',
    'modulistica',
    '/office-products?category=Modulistica',
    '/cancelleria-penne.jpg',
    null,
    25,
    true
  )
  on conflict (slug) do update set
    name = excluded.name,
    listing_path = excluded.listing_path,
    cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
    sort_order = excluded.sort_order,
    is_active = true,
    updated_at = now()
  returning id into v_parent;

  if v_parent is null then
    select id into v_parent from public.office_catalog_categories where slug = 'modulistica' limit 1;
  end if;

  -- 5 macro ufficiali (riusa slug esistenti dove possibile)
  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
  values
    (
      'Alberghi e Ristoranti',
      'modulistica-alberghi-ristoranti',
      '/office-products?category=Modulistica&subcategory=Alberghi%20e%20Ristoranti',
      '/images/d06c153f-a63e-428c-ada0-6a10dfb17f4a.jpg',
      v_parent,
      10,
      true
    ),
    (
      'Condominio ed Edilizia',
      'modulistica-condominio-edilizia',
      '/office-products?category=Modulistica&subcategory=Condominio%20ed%20Edilizia',
      '/images/298dec2f-59c6-4cf3-b8a1-c27af2d613ab.jpg',
      v_parent,
      20,
      true
    ),
    (
      'Contabilità IVA e Generale',
      'modulistica-contabilita-iva-generale',
      '/office-products?category=Modulistica&subcategory=Contabilit%C3%A0%20IVA%20e%20Generale',
      '/images/86e56334-f38d-4d6e-b0aa-2ef9b6fc565a.jpg',
      v_parent,
      30,
      true
    ),
    (
      'Magazzino e Trasporti',
      'modulistica-magazzino-trasporti',
      '/office-products?category=Modulistica&subcategory=Magazzino%20e%20Trasporti',
      '/images/2534e81f-339e-4485-8400-f3367285121e.jpg',
      v_parent,
      40,
      true
    ),
    (
      'Stampati Fiscali',
      'modulistica-stampati-fiscali',
      '/office-products?category=Modulistica&subcategory=Stampati%20Fiscali',
      '/images/82aed2d3-b9a7-4813-8183-2abd6fee6add.jpg',
      v_parent,
      50,
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

  -- Disattiva micro-sottocategorie e vecchie schede ridondanti
  update public.office_catalog_categories
  set is_active = false, updated_at = now()
  where parent_id = v_parent
    and slug like 'modulistica-%'
    and slug not in (
      'modulistica-alberghi-ristoranti',
      'modulistica-condominio-edilizia',
      'modulistica-contabilita-iva-generale',
      'modulistica-magazzino-trasporti',
      'modulistica-stampati-fiscali'
    );

  get diagnostics v_deactivated = row_count;

  -- Sposta tutti i prodotti Modulistica sotto le 5 macro
  update public.products
  set subcategory = case
    when subcategory in ('Alberghi Ristoranti', 'Alberghi e Ristoranti')
      then 'Alberghi e Ristoranti'
    when subcategory in ('Condominio ed Edilizia', 'Condominio, Edilizia e Registri')
      then 'Condominio ed Edilizia'
    when subcategory in (
      'Contabilità, Cassa e Fatture',
      'Contabilita, Cassa e Fatture',
      'Contabilità IVA e Generale',
      'Contabilita IVA e Generale',
      'Registri Contabili e Cassa',
      'Registri Fiscali e IVA',
      'Registri Fiscali e Beni Usati',
      'Schede Contabili e Maste'
    ) then 'Contabilità IVA e Generale'
    when subcategory in (
      'Buoni di Consegna e Tentata Vendita',
      'Documenti di Trasporto (DDT)',
      'Documenti di Trasporto',
      'Documenti di Trasporto e Tentata Vendita',
      'Buoni di Consegna e Ricevute',
      'Magazzino e Trasporti'
    ) then 'Magazzino e Trasporti'
    when subcategory in (
      'Ricevute Sportive e Varie',
      'Ricevute Fiscali e Fatture',
      'Stampati Fiscali'
    ) then 'Stampati Fiscali'
    else subcategory
  end
  where category = 'Modulistica';

  get diagnostics v_products = row_count;

  -- IVA corrispettivi: da vecchio "Condominio… e Registri" a Contabilità
  update public.products
  set subcategory = 'Contabilità IVA e Generale'
  where category = 'Modulistica'
    and sku in ('E 2104 A', 'E 2102 A', 'E 2108');

  return jsonb_build_object(
    'ok', true,
    'products_updated', v_products,
    'micro_categories_deactivated', v_deactivated
  );
end;
$$;

select public.realign_modulistica_edipro_macros();
