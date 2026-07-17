-- Buste forate Starline (STL7413) + colonne moderne se mancanti (allineamento app)

alter table public.office_products
  add column if not exists sku text,
  add column if not exists parent_sku text,
  add column if not exists color_name text;

update public.office_products op
set sku = op.producer_code
where (op.sku is null or trim(op.sku) = '')
  and op.producer_code is not null
  and trim(op.producer_code) <> '';

insert into public.office_products (
  id,
  name,
  brand,
  producer_code,
  sku,
  category,
  main_features,
  image_url,
  description,
  price
)
values (
  'STL7413',
  'Buste forate Starline',
  'STARLINE',
  'STL7413',
  'STL7413',
  'Buste e cartelline',
  '{}'::jsonb,
  'https://odmultimedia.eu/immagini/HD/STL7413.jpg',
  null,
  null
)
on conflict (id) do update
set
  name = excluded.name,
  brand = excluded.brand,
  producer_code = excluded.producer_code,
  sku = excluded.sku,
  category = excluded.category,
  main_features = excluded.main_features,
  image_url = excluded.image_url,
  description = excluded.description,
  price = excluded.price,
  updated_at = now();
