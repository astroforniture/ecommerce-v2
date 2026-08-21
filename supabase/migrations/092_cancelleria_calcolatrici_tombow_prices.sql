-- Prezzi listino: calcolatrici Cancelleria + correttori Tombow (SKU AF-* già seedati).

with rows(sku, name, price, subcategory) as (
  values
    (
      'AF-CALC-SHAEL1901',
      'Calcolatrice da tavolo EL 1901 - 12 cifre - display LCD a 5 righe - Sharp',
      80.00::numeric,
      'Calcolatrici'
    ),
    (
      'AF-CALC-81499',
      'Calcolatrice grafica FX CG50 - Casio',
      120.00::numeric,
      'Calcolatrici'
    ),
    (
      'AF-CALC-80344',
      'Calcolatrice scrivente HR-8RCE - 12 cifre - 8,2 x 10,2 x 23,9 cm - nero - Casio',
      35.00::numeric,
      'Calcolatrici'
    ),
    (
      'AF-CALC-CANMP1211LTSC',
      'Canon - Calcolatrice - scrivente - MP-1211 LTSC',
      120.00::numeric,
      'Calcolatrici'
    ),
    (
      'AF-CALC-CANP1DTSC',
      'Canon - Calcolatrice scrivente P1-DTSC - Grigio',
      45.00::numeric,
      'Calcolatrici'
    ),
    (
      'AF-CALC-CANAS8HB',
      'Canon - Calcolatrice tascabile - AS8HB',
      9.00::numeric,
      'Calcolatrici'
    ),
    (
      'AF-TOMB-60484',
      'Correttore a nastro - 4,2mm x 16mt - ricaricabile - Tombow',
      6.00::numeric,
      'Correttori'
    ),
    (
      'AF-TOMB-29072',
      'Correttore a nastro Mono Correction - 4,2 mm x 10 mt - Tombow',
      5.00::numeric,
      'Correttori'
    )
)
update public.products as p
set
  name = r.name,
  price = r.price,
  category = 'Cancelleria',
  subcategory = r.subcategory,
  stock = coalesce(nullif(p.stock, 0), 100)
from rows as r
where p.sku = r.sku;
