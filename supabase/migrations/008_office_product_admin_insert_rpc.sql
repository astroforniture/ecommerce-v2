-- RPC per inserire/aggiornare prodotti office dal pannello admin (token in tabella, non in git).
-- Dopo la migrazione, in SQL Editor Supabase eseguire:
--   insert into public.office_product_insert_tokens (id, token)
--   values (1, 'il-tuo-token-lungo-segretissimo')
--   on conflict (id) do update set token = excluded.token;

create table if not exists public.office_product_insert_tokens (
  id int primary key check (id = 1),
  token text not null
);

alter table public.office_product_insert_tokens enable row level security;

create or replace function public.insert_office_product_admin(
  p_token text,
  p_id text,
  p_sku text,
  p_name text,
  p_brand text,
  p_category text,
  p_image_url text,
  p_description text default null,
  p_price numeric default null,
  p_parent_sku text default null,
  p_color_name text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expected text;
  v_sku text := nullif(trim(coalesce(p_sku, '')), '');
  v_id text := nullif(trim(coalesce(p_id, '')), '');
begin
  if v_id is null then
    return jsonb_build_object('ok', false, 'error', 'id obbligatorio');
  end if;

  select t.token into v_expected
  from public.office_product_insert_tokens t
  where t.id = 1;

  if v_expected is null or trim(v_expected) = '' then
    return jsonb_build_object(
      'ok',
      false,
      'error',
      'Token non configurato: inserisci una riga in office_product_insert_tokens (vedi commento migrazione 008).'
    );
  end if;

  if p_token is distinct from v_expected then
    return jsonb_build_object('ok', false, 'error', 'Token non valido');
  end if;

  if v_sku is null then
    v_sku := v_id;
  end if;

  insert into public.office_products (
    id,
    name,
    brand,
    producer_code,
    sku,
    category,
    main_features,
    image_url,
    description,
    price,
    parent_sku,
    color_name
  )
  values (
    v_id,
    p_name,
    p_brand,
    v_sku,
    v_sku,
    p_category,
    '{}'::jsonb,
    p_image_url,
    p_description,
    p_price,
    nullif(trim(coalesce(p_parent_sku, '')), ''),
    nullif(trim(coalesce(p_color_name, '')), '')
  )
  on conflict (id) do update
  set
    name = excluded.name,
    brand = excluded.brand,
    producer_code = excluded.producer_code,
    sku = excluded.sku,
    category = excluded.category,
    main_features = excluded.main_features,
    image_url = excluded.image_url,
    description = excluded.description,
    price = excluded.price,
    parent_sku = excluded.parent_sku,
    color_name = excluded.color_name,
    updated_at = now();

  return jsonb_build_object('ok', true, 'id', v_id);
exception
  when others then
    return jsonb_build_object('ok', false, 'error', sqlerrm);
end;
$$;

grant execute on function public.insert_office_product_admin(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  numeric,
  text,
  text
) to anon, authenticated;

comment on function public.insert_office_product_admin is
  'Inserisce/aggiorna office_products; richiede token in office_product_insert_tokens.';
