-- Allinea image_url in public.products da office_products (se esiste) e da URL OD Multimedia per SKU Starline.
-- Stesso token admin di insert_office_product_admin (public.office_product_insert_tokens).

create or replace function public.sync_products_images_admin(
  p_token text,
  p_apply_od_multimedia boolean default true,
  p_od_sku_regex text default '^STL[0-9]+'
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expected text;
  n_office int := 0;
  n_od int := 0;
begin
  select t.token into v_expected
  from public.office_product_insert_tokens t
  where t.id = 1;

  if v_expected is null or trim(v_expected) = '' then
    return jsonb_build_object(
      'ok',
      false,
      'error',
      'Token non configurato (office_product_insert_tokens).'
    );
  end if;

  if p_token is distinct from v_expected then
    return jsonb_build_object('ok', false, 'error', 'Token non valido');
  end if;

  if to_regclass('public.office_products') is not null then
    update public.products p
    set image_url = v.url
    from (
      select
        op.id::text as legacy_id,
        nullif(trim(op.image_url), '') as url
      from public.office_products op
    ) v
    where (p.image_url is null or btrim(p.image_url) = '')
      and v.url is not null
      and (
        p.id::text = v.legacy_id
        or (p.sku is not null and btrim(p.sku) = v.legacy_id)
      );

    get diagnostics n_office = row_count;
  end if;

  if coalesce(p_apply_od_multimedia, true) then
    update public.products p
    set image_url =
      'https://odmultimedia.eu/immagini/HD/'
      || btrim(p.sku)
      || '.jpg'
    where (p.image_url is null or btrim(p.image_url) = '')
      and p.sku is not null
      and btrim(p.sku) <> ''
      and btrim(p.sku) ~ p_od_sku_regex;

    get diagnostics n_od = row_count;
  end if;

  return jsonb_build_object(
    'ok',
    true,
    'updated_from_office_products',
    n_office,
    'updated_od_multimedia_urls',
    n_od
  );
exception
  when others then
    return jsonb_build_object('ok', false, 'error', sqlerrm);
end;
$$;

grant execute on function public.sync_products_images_admin(text, boolean, text) to anon, authenticated;

comment on function public.sync_products_images_admin is
  'Aggiorna products.image_url da office_products e/o URL https://odmultimedia.eu/immagini/HD/{sku}.jpg per SKU che matchano la regex.';
