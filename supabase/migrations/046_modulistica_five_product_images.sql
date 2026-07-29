-- Modulistica: cover per E 5911, E 9117, E2666, E 5196 C, E 5567 C
-- Corregge anche SKU legacy E 5916 → E 5911 (copertina/EAN Edipro).

-- Rinomina SKU se presente il vecchio codice
update public.products
set
  sku = 'E 5911',
  ean = '8023328591106',
  image_url = '/images/E5911.jpg',
  name = 'Blocco comande - 25x3 fogli autoricalcanti - 17 x 9,9 cm - Edipro',
  subcategory = 'Alberghi e Ristoranti',
  category = 'Modulistica'
where sku = 'E 5916';

update public.products
set image_url = '/images/E5911.jpg',
    ean = coalesce(ean, '8023328591106'),
    subcategory = 'Alberghi e Ristoranti',
    category = 'Modulistica'
where sku = 'E 5911';

insert into public.products (
  sku, name, price, image_url, brand, category, subcategory, format, ean, description, stock
)
select
  'E 5911',
  'Blocco comande - 25x3 fogli autoricalcanti - 17 x 9,9 cm - Edipro',
  0,
  '/images/E5911.jpg',
  'Edipro',
  'Modulistica',
  'Alberghi e Ristoranti',
  '17 x 9,9 cm',
  '8023328591106',
  'Blocco comande Edipro a 25×3 fogli autoricalcanti, formato 17 × 9,9 cm. Ideale per alberghi e ristoranti.',
  100
where not exists (select 1 from public.products where sku = 'E 5911');

update public.products set image_url = '/images/E9117.jpg' where sku = 'E 9117';
update public.products set image_url = '/images/E2666.jpg' where sku = 'E2666';
update public.products set image_url = '/images/E5196C.jpg' where sku = 'E 5196 C';
update public.products set image_url = '/images/E5567C.jpg' where sku = 'E 5567 C';
