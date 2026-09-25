-- Aliquota IVA per prodotto (default 22%). Valori ammessi tipici: 0.22, 0.10, 0.04
-- oppure percentuali 22 / 10 / 4. Il FE normalizza entrambe le forme.

do $$
begin
  if to_regclass('public.products') is null then
    raise notice 'Tabella public.products non trovata: migrazione vat_rate saltata.';
    return;
  end if;

  alter table public.products
    add column if not exists vat_rate numeric(5, 4);

  comment on column public.products.vat_rate is
    'Aliquota IVA (frazione, es. 0.22 / 0.10 / 0.04). NULL = 22% default applicativo.';
end
$$;
