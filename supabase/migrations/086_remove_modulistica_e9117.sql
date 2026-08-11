-- Rimuove dal catalogo shop il Blocco comande a 7 tagliandi (SKU E 9117).

do $$
declare
  pid uuid;
begin
  select id into pid
  from public.products
  where sku in ('E 9117', 'E9117')
  limit 1;

  if pid is null then
    raise notice 'SKU E 9117 non trovato — niente da eliminare';
    return;
  end if;

  delete from public.product_quantity_prices where product_id = pid;
  delete from public.products where id = pid;
end $$;
