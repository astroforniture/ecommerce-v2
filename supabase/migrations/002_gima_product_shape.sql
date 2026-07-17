-- Allinea `medical_products` alla struttura GimaProduct
-- e mantiene compatibilita con il catalogo Astro Medical.

alter table public.medical_products
  add column if not exists code text,
  add column if not exists category text,
  add column if not exists selling_unit text,
  add column if not exists medical_type text,
  add column if not exists rdm text,
  add column if not exists cnd text,
  add column if not exists ean text,
  add column if not exists description text;

-- Garantisce id testuale = codice (richiesta interfaccia GimaProduct)
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'medical_products'
      and column_name = 'id_text'
  ) then
    alter table public.medical_products add column id_text text;
  end if;
end $$;

update public.medical_products
set
  code = coalesce(code, sku),
  id_text = coalesce(id_text, code, sku);

alter table public.medical_products
  alter column code set not null,
  alter column category set not null,
  alter column selling_unit set not null,
  alter column medical_type set not null,
  alter column rdm set not null,
  alter column cnd set not null,
  alter column ean set not null,
  alter column image_url set not null,
  alter column id_text set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'medical_products_code_unique'
  ) then
    alter table public.medical_products
      add constraint medical_products_code_unique unique (code);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'medical_products_id_text_eq_code'
  ) then
    alter table public.medical_products
      add constraint medical_products_id_text_eq_code check (id_text = code);
  end if;
end $$;

create index if not exists medical_products_code_idx
  on public.medical_products (code);

comment on column public.medical_products.id_text is 'ID logico testo uguale al codice Gima';
comment on column public.medical_products.code is 'Codice articolo Gima';
comment on column public.medical_products.category is 'Categoria prodotto (come in scheda Gima)';
comment on column public.medical_products.selling_unit is 'Unita di vendita (es. conf. 50 pz.)';
comment on column public.medical_products.medical_type is 'Tipo dispositivo (es. Dispositivo medico)';
comment on column public.medical_products.rdm is 'RDM/NSIS (se disponibile in scheda)';
comment on column public.medical_products.cnd is 'Codice CND';
comment on column public.medical_products.ean is 'Codice EAN13';
