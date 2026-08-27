-- Nascosta visibilita temporanea di 18 articoli cancelleria (calcolatrici, matite, penne, correttori).
-- I record restano in public.products; il frontend li esclude via SUPPRESSED_CATALOG_SKUS.
-- Se esiste (o viene creata) is_catalog_visible, imposta false per allineare il DB.

alter table public.products
  add column if not exists is_catalog_visible boolean not null default true;

update public.products
set is_catalog_visible = false
where upper(trim(sku)) in (
  'AF-LEBEZ-3039',
  'AF-LEBEZ-80328',
  'AF-CALC-SHAEL1901',
  'AF-CALC-LBZ-81913',
  'AF-CALC-LBZ-81914',
  'AF-CALC-81499',
  'AF-CALC-LBZ-81917',
  'AF-CALC-80344',
  'AF-CALC-CANMP1211LTSC',
  'AF-CALC-CANP1DTSC',
  'AF-CALC-CANAS8HB',
  'AF-TOMB-60484',
  'AF-TOMB-29072',
  'AF-LEBEZ-1303',
  'AF-LEBEZ-1303B',
  'AF-PENT-105426',
  'AF-PENT-105424',
  'AF-PENT-105425'
);
