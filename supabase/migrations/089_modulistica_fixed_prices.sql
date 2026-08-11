-- Prezzi fissi (imponibile) su prodotti Modulistica con tier rimossi.
-- Nessuno sconto quantità per questi SKU.

do $$
declare
  rec record;
  pid uuid;
begin
  for rec in
    select * from (
      values
        ('E 5349'::text,   8.90::numeric),
        ('E 5349 A',       8.90),
        ('E 5350',        10.90),
        ('E 5356',        10.90),
        ('E 5356 A',      10.90),
        ('E 5359 A',      10.90),
        ('E2769',         10.90),
        ('E2117',         10.90),
        ('E2686',         13.90),
        ('E2656',         12.90),
        ('E 2108',         5.40),
        ('E2666',         12.90),
        ('E 2104 A',       5.40),
        ('E 2102 A',       7.40),
        ('E4034',         11.90),
        ('E4033',         11.90),
        ('E 3399',         9.90),
        ('E 3259',         9.90),
        ('E 3369',         9.90),
        ('E 3406',         9.90)
    ) as t(sku, price_val)
  loop
    select id into pid
    from public.products
    where sku in (rec.sku, replace(rec.sku, ' ', ''))
    limit 1;

    if pid is null then
      raise notice 'SKU % non trovato — skip', rec.sku;
      continue;
    end if;

    update public.products
    set price = rec.price_val
    where id = pid;

    -- Rimuovi qualsiasi tier quantità residuo (prezzo fisso)
    delete from public.product_quantity_prices where product_id = pid;
  end loop;
end $$;
