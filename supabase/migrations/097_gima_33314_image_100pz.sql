-- Update product image for GIMA elettrodi foam 36-40 mm conf. 100 pz (SKU 33314).
update public.products
set image_url = '/images/gima-33314-100pz.png'
where sku in ('33314', 'gima-33314', 'AMS-0031')
   or name ilike 'ELETTRODI MONOUSO FOAM 36-40 mm%';
