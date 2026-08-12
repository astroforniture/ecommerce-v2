-- Modulistica > Magazzino e Trasporto: 4 buoni di consegna Data Ufficio con tier pricing.

insert into public.products (sku, name, price, image_url, brand, category, subcategory, format, description, stock)
select 'DU161570000', 'Blocco buoni di consegna - 50/50 copie autoric. - 11,5 x 16,5 cm - DU161570000 - Data Ufficio', 4.00, 'https://odmultimedia.eu/immagini/HD/90880.jpg', 'Data Ufficio', 'Modulistica', 'Magazzino e Trasporto', '11,5 x 16,5 cm', 'Blocco buoni di consegna Data Ufficio 50/50 copie autoricalcanti, formato 11,5 × 16,5 cm.', 100
where not exists (select 1 from public.products where sku = 'DU161570000');

insert into public.products (sku, name, price, image_url, brand, category, subcategory, format, description, stock)
select 'DU164570000', 'Blocco buoni di consegna - 50/50 copie autoric. - 21,5 x 14,8 cm - DU164570000 - Data Ufficio', 4.50, 'https://odmultimedia.eu/immagini/HD/90891.jpg', 'Data Ufficio', 'Modulistica', 'Magazzino e Trasporto', '21,5 x 14,8 cm', 'Blocco buoni di consegna Data Ufficio 50/50 copie autoricalcanti, formato 21,5 × 14,8 cm.', 100
where not exists (select 1 from public.products where sku = 'DU164570000');

insert into public.products (sku, name, price, image_url, brand, category, subcategory, format, description, stock)
select 'DU161583300', 'Blocco buoni di consegna - 33/33/33 copie autoric. - 11,5 x 16,5 cm - DU161583300 - Data Ufficio', 4.00, 'https://odmultimedia.eu/immagini/HD/90881.jpg', 'Data Ufficio', 'Modulistica', 'Magazzino e Trasporto', '11,5 x 16,5 cm', 'Blocco buoni di consegna Data Ufficio 33/33/33 copie autoricalcanti, formato 11,5 × 16,5 cm.', 100
where not exists (select 1 from public.products where sku = 'DU161583300');

insert into public.products (sku, name, price, image_url, brand, category, subcategory, format, description, stock)
select 'DU164583300', 'Blocco buoni di consegna - 33/33/33 copie autoric. - 21,5 x 14,8 cm - DU164583300 - Data Ufficio', 4.70, 'https://odmultimedia.eu/immagini/HD/90892.jpg', 'Data Ufficio', 'Modulistica', 'Magazzino e Trasporto', '21,5 x 14,8 cm', 'Blocco buoni di consegna Data Ufficio 33/33/33 copie autoricalcanti, formato 21,5 × 14,8 cm.', 100
where not exists (select 1 from public.products where sku = 'DU164583300');

update public.products set price = 4.00 where sku = 'DU161570000';
update public.products set price = 4.50 where sku = 'DU164570000';
update public.products set price = 4.00 where sku = 'DU161583300';
update public.products set price = 4.70 where sku = 'DU164583300';

do $$
declare
  has_threshold boolean;
  has_min_qty boolean;
  rec record;
  pid uuid;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'product_quantity_prices' and column_name = 'quantity_threshold'
  ) into has_threshold;

  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'product_quantity_prices' and column_name = 'min_quantity'
  ) into has_min_qty;

  if not has_threshold and not has_min_qty then
    raise notice 'Tabella product_quantity_prices senza colonne soglia — skip Data Ufficio tiers';
    return;
  end if;

  for rec in
    select * from (
      values
        ('DU161570000'::text, 1, 4.00::numeric),
        ('DU161570000', 11, 3.20),
        ('DU161570000', 21, 2.50),
        ('DU164570000', 1, 4.50),
        ('DU164570000', 11, 3.80),
        ('DU164570000', 21, 3.00),
        ('DU161583300', 1, 4.00),
        ('DU161583300', 11, 3.20),
        ('DU161583300', 21, 2.50),
        ('DU164583300', 1, 4.70),
        ('DU164583300', 11, 4.20),
        ('DU164583300', 21, 3.50)
    ) as t(sku, min_qty, unit_price)
  loop
    select id into pid from public.products where sku = rec.sku limit 1;
    if pid is null then
      raise notice 'SKU % non trovato — skip tier', rec.sku;
      continue;
    end if;

    if rec.min_qty = 1 then
      delete from public.product_quantity_prices where product_id = pid;
    end if;

    if has_threshold then
      insert into public.product_quantity_prices (product_id, quantity_threshold, price_per_unit)
      values (pid, rec.min_qty, rec.unit_price);
    else
      insert into public.product_quantity_prices (product_id, min_quantity, price_per_unit)
      values (pid, rec.min_qty, rec.unit_price);
    end if;
  end loop;
end $$;
