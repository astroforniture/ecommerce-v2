-- Rafforza la disattivazione visibilita (SKU alias + nomi) per i 18 articoli cancelleria.

update public.products
set is_catalog_visible = false
where
  is_catalog_visible is distinct from false
  and (
    upper(trim(sku)) in (
      'AF-LEBEZ-3039', '3039',
      'AF-LEBEZ-80328', '80328',
      'AF-CALC-SHAEL1901', 'SHAEL1901', 'EL1901',
      'AF-CALC-LBZ-81913', '81913',
      'AF-CALC-LBZ-81914', '81914',
      'AF-CALC-81499', '81499',
      'AF-CALC-LBZ-81917', '81917',
      'AF-CALC-80344', '80344',
      'AF-CALC-CANMP1211LTSC', 'CANMP1211LTSC',
      'AF-CALC-CANP1DTSC', 'CANP1DTSC', '2304C001',
      'AF-CALC-CANAS8HB', 'CANAS8HB', 'AS8HB',
      'AF-TOMB-60484', '60484',
      'AF-TOMB-29072', '29072',
      'AF-LEBEZ-1303', '1303',
      'AF-LEBEZ-1303B', '1303B',
      'AF-PENT-105426', '105426',
      'AF-PENT-105424', '105424',
      'AF-PENT-105425', '105425'
    )
    or name ilike '%Barattolo matita HB 100%'
    or name ilike '%Barattolo matita HB Neon%'
    or name ilike '%EL 1901%'
    or name ilike '%EL1901%'
    or (name ilike '%MAXI a 12 cifre%' and name ilike '%81913%')
    or (name ilike '%MAXI a 12 cifre%' and name ilike '%81914%')
    or name ilike '%FX CG50%'
    or (name ilike '%Calcolatrice scientifica%' and name ilike '%Lebez%')
    or name ilike '%HR-8RCE%'
    or name ilike '%MP-1211%'
    or name ilike '%P1-DTSC%'
    or name ilike '%AS8HB%'
    or (name ilike '%Correttore a nastro%' and name ilike '%Tombow%' and name ilike '%ricaricabile%')
    or name ilike '%Mono Correction%'
    or (name ilike '%Matita HB 12 pz%' and name ilike '%Lebez%')
    or (name ilike '%Matita HB 4 pz%' and name ilike '%Lebez%')
    or name ilike '%Floatune%'
  );
