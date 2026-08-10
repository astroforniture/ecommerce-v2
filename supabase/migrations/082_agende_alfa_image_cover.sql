-- Cover sottocategoria Agende Giornaliere → immagine ALFA ufficiale
update public.office_catalog_categories
set
  cover_image_url = 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg',
  updated_at = now()
where slug = 'agende-giornaliere';

-- Allinea image_url prodotti ALFA già presenti
update public.products
set image_url = 'https://www.bocchiosrl.it/ftp/bocchio/immagini/thumb/A7136AF-1024-1024-0.jpg'
where upper(trim(sku)) in ('7123AF', '7142AF', '7136AF', '7141AF', '7145AF');
