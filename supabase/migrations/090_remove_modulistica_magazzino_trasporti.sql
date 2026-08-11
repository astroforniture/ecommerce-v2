-- Rimozione completa sottocategoria "Magazzino e Trasporti" da Modulistica.
-- SKU rimossi: E 5199 CT, E 5196 C, E 5197 C, E 5209 C, E 5217 A,
--              E 5215 CT, E 5219 CT, E 5214 C, E 5218 C,
--              E 5220 G, E 5221 C, E 5183

do $$
declare
  skus text[] := array[
    'E 5199 CT','E5199CT',
    'E 5196 C','E5196C',
    'E 5197 C','E5197C',
    'E 5209 C','E5209C',
    'E 5217 A','E5217A',
    'E 5215 CT','E5215CT',
    'E 5219 CT','E5219CT',
    'E 5214 C','E5214C',
    'E 5218 C','E5218C',
    'E 5220 G','E5220G',
    'E 5221 C','E5221C',
    'E 5183','E5183'
  ];
  pid uuid;
  s text;
begin
  foreach s in array skus loop
    select id into pid from public.products where sku = s limit 1;
    if pid is not null then
      delete from public.product_quantity_prices where product_id = pid;
      delete from public.products where id = pid;
      raise notice 'Eliminato prodotto SKU %', s;
    end if;
  end loop;
end $$;
