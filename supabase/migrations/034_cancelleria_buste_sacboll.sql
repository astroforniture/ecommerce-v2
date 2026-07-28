-- Cancelleria → Buste (+ prodotti Sacboll Blasetti con varianti formato)
-- Idempotente su slug / sku.

insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
select
  'Buste',
  'buste',
  '/office-products?category=Cancelleria&cancelleriaView=buste',
  'https://odmultimedia.eu/immagini/MD/46145.jpg',
  parent_cancelleria.id,
  70
from public.office_catalog_categories as parent_cancelleria
where parent_cancelleria.slug = 'cancelleria'
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  cover_image_url = excluded.cover_image_url,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  updated_at = now();

delete from public.products
where sku in ('AF-SACBOLL-AVANA', 'AF-SACBOLL-BIANCO')
   or sku ilike 'AF-SACBOLL-%';

insert into public.products (
  sku,
  name,
  price,
  image_url,
  brand,
  category,
  subcategory,
  color_name,
  description,
  stock,
  variants
)
values
  (
    'AF-SACBOLL-AVANA',
    'Buste Imbottite Sacboll Blasetti - Avana',
    1.70,
    'https://odmultimedia.eu/immagini/MD/46145.jpg',
    'Blasetti',
    'Cancelleria',
    'Buste',
    'Avana',
    'Buste imbottite Sacboll Blasetti in carta FSC avana con imbottitura a bolle d’aria e chiusura a strip adesiva. Ideali per spedizioni di oggetti fragili. Scegli il formato esterno; ogni confezione contiene 10 pezzi.',
    100,
    '[
      {"label":"CD - 20 x 22 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-CD","packQty":10,"packLabel":"Conf. 10 pz","price":1.7,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0709","finish":"16 x 18 cm"},
      {"label":"A - 13 x 20 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-A","packQty":10,"packLabel":"Conf. 10 pz","price":1.66,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0710","finish":"11 x 16 cm"},
      {"label":"B - 14 x 27 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-B","packQty":10,"packLabel":"Conf. 10 pz","price":1.8,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0711","finish":"12 x 21 cm"},
      {"label":"C - 17 x 27 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-C","packQty":10,"packLabel":"Conf. 10 pz","price":1.96,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0712","finish":"15 x 21 cm"},
      {"label":"D - 20 x 32 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-D","packQty":10,"packLabel":"Conf. 10 pz","price":2.54,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0713","finish":"18 x 26 cm"},
      {"label":"E - 24 x 32 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-E","packQty":10,"packLabel":"Conf. 10 pz","price":2.8,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0717","finish":"21 x 26 cm"},
      {"label":"FG - 25 x 39 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-FG","packQty":10,"packLabel":"Conf. 10 pz","price":3.2,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0714","finish":"22 x 33 cm"},
      {"label":"H - 29 x 42 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-H","packQty":10,"packLabel":"Conf. 10 pz","price":3.6,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0715","finish":"26 x 36 cm"},
      {"label":"J - 32 x 50 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-J","packQty":10,"packLabel":"Conf. 10 pz","price":4.6,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0716","finish":"29 x 44 cm"},
      {"label":"K - 37 x 55 cm (Conf. 10 pz)","sku":"AF-SACBOLL-AVANA-K","packQty":10,"packLabel":"Conf. 10 pz","price":5.8,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0718","finish":"34 x 48 cm"}
    ]'::jsonb
  ),
  (
    'AF-SACBOLL-BIANCO',
    'Buste Imbottite Sacboll Blasetti - Bianco',
    1.70,
    'https://odmultimedia.eu/immagini/MD/46145.jpg',
    'Blasetti',
    'Cancelleria',
    'Buste',
    'Bianco',
    'Buste imbottite Sacboll Blasetti in carta FSC bianca con imbottitura a bolle d’aria e chiusura a strip adesiva. Ideali per spedizioni di oggetti fragili. Scegli il formato esterno; ogni confezione contiene 10 pezzi.',
    100,
    '[
      {"label":"CD - 20 x 22 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-CD","packQty":10,"packLabel":"Conf. 10 pz","price":1.7,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0881","finish":"16 x 18 cm"},
      {"label":"B - 14 x 27 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-B","packQty":10,"packLabel":"Conf. 10 pz","price":1.8,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0882","finish":"12 x 21 cm"},
      {"label":"C - 17 x 27 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-C","packQty":10,"packLabel":"Conf. 10 pz","price":1.96,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0883","finish":"15 x 21 cm"},
      {"label":"D - 20 x 32 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-D","packQty":10,"packLabel":"Conf. 10 pz","price":2.54,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0884","finish":"18 x 26 cm"},
      {"label":"E - 24 x 32 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-E","packQty":10,"packLabel":"Conf. 10 pz","price":2.8,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0885","finish":"21 x 26 cm"},
      {"label":"FG - 25 x 39 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-FG","packQty":10,"packLabel":"Conf. 10 pz","price":3.2,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0886","finish":"22 x 33 cm"},
      {"label":"H - 29 x 42 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-H","packQty":10,"packLabel":"Conf. 10 pz","price":3.6,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0887","finish":"26 x 36 cm"},
      {"label":"J - 32 x 50 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-J","packQty":10,"packLabel":"Conf. 10 pz","price":4.6,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0888","finish":"29 x 44 cm"},
      {"label":"K - 37 x 55 cm (Conf. 10 pz)","sku":"AF-SACBOLL-BIANCO-K","packQty":10,"packLabel":"Conf. 10 pz","price":5.8,"image_url":"https://odmultimedia.eu/immagini/MD/46145.jpg","quality":"0889","finish":"34 x 48 cm"}
    ]'::jsonb
  )
on conflict (sku) do update set
  name = excluded.name,
  price = excluded.price,
  image_url = excluded.image_url,
  brand = excluded.brand,
  category = excluded.category,
  subcategory = excluded.subcategory,
  color_name = excluded.color_name,
  description = excluded.description,
  stock = excluded.stock,
  variants = excluded.variants;
