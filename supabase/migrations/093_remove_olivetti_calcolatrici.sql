-- Rimozione calcolatrici Olivetti LOGOS 904T e SUMMA 303 dal catalogo shop.

do $$
declare
  skus text[] := array['AF-CALC-OLIB4646', 'AF-CALC-OLIB5896'];
  pid uuid;
  s text;
begin
  foreach s in array skus loop
    select id into pid from public.products where sku = s limit 1;
    if pid is not null then
      if exists (
        select 1 from information_schema.tables
        where table_schema = 'public' and table_name = 'product_quantity_prices'
      ) then
        delete from public.product_quantity_prices where product_id = pid;
      end if;
      delete from public.products where id = pid;
      raise notice 'Eliminato prodotto SKU %', s;
    end if;
  end loop;
end $$;
