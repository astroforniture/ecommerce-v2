-- Rimuove la sottocategoria «Agende Tascabili» e riassegna eventuali prodotti residui.

-- Prodotti ancora etichettati come Tascabili → Agende Settimanali (categoria Agende invariata).
update public.products
set
  subcategory = 'Agende Settimanali',
  updated_at = now()
where category ilike 'Agende'
  and subcategory ilike 'Agende Tascabili';

-- Disattiva / nasconde la voce catalogo (idempotente).
update public.office_catalog_categories
set
  is_active = false,
  updated_at = now()
where slug in ('agende-tascabili', 'tascabili')
   or name ilike 'Agende Tascabili';
