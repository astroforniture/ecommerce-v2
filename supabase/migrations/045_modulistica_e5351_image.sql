-- Modulistica: cover corretta per E 5351 (Stato di cassa)
update public.products
set image_url = '/images/E5351.jpg'
where sku = 'E 5351'
  and category = 'Modulistica';
