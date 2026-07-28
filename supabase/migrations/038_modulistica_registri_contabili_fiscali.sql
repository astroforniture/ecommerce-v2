-- Modulistica: Registri Contabili e Cassa + Registri Fiscali e IVA

alter table public.products
  add column if not exists ean text;

do $$
declare
  v_parent uuid;
begin
  select id into v_parent from public.office_catalog_categories where slug = 'modulistica' limit 1;

  if v_parent is null then
    insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
    values (
      'Modulistica',
      'modulistica',
      '/office-products?category=Modulistica',
      '/cancelleria-penne.jpg',
      null,
      25
    )
    on conflict (slug) do update set name = excluded.name
    returning id into v_parent;

    select id into v_parent from public.office_catalog_categories where slug = 'modulistica' limit 1;
  end if;

  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
  values
    (
      'Registri Contabili e Cassa',
      'modulistica-registri-contabili-cassa',
      '/office-products?category=Modulistica&subcategory=Registri%20Contabili%20e%20Cassa',
      '/cancelleria-penne.jpg',
      v_parent,
      50
    ),
    (
      'Registri Fiscali e IVA',
      'modulistica-registri-fiscali-iva',
      '/office-products?category=Modulistica&subcategory=Registri%20Fiscali%20e%20IVA',
      '/cancelleria-penne.jpg',
      v_parent,
      60
    )
  on conflict (slug) do update set
    name = excluded.name,
    listing_path = excluded.listing_path,
    cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
    parent_id = excluded.parent_id,
    sort_order = excluded.sort_order,
    updated_at = now();
end $$;

insert into public.products (
  sku, name, price, image_url, brand, category, subcategory, format, ean, description, stock
)
values
  ('E4034', 'Scadenzario effetti attivi con spirale e indici plastificati 36 fogli – Formato 24×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Contabili e Cassa', '24 x 17 cm', null, 'Scadenzario effetti attivi Edipro con spirale e indici plastificati, 36 fogli, formato 24 × 17 cm.', 100),
  ('E2656', 'Registro dare/avere/saldo 96 pagine – Formato 17×12', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Contabili e Cassa', '17 x 12 cm', null, 'Registro dare/avere/saldo Edipro, 96 pagine, formato 17 × 12 cm.', 100),
  ('E2666', 'Registro due colonne 96 pagine – Formato 24×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Contabili e Cassa', '24 x 17 cm', null, 'Registro due colonne Edipro, 96 pagine, formato 24 × 17 cm.', 100),
  ('E2686', 'Registro cassa entrate/uscite 96 pagine – Formato 24×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Contabili e Cassa', '24 x 17 cm', null, 'Registro cassa entrate/uscite Edipro, 96 pagine, formato 24 × 17 cm.', 100),
  ('E2769', 'Registro 3 colonne 96 pagine – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Contabili e Cassa', '31 x 24,5 cm', null, 'Registro 3 colonne Edipro, 96 pagine, formato 31 × 24,5 cm.', 100),
  ('E2649', 'Registro libro cassa 96 pagine – Formato 17×12', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Contabili e Cassa', '17 x 12 cm', null, 'Registro libro cassa Edipro, 96 pagine, formato 17 × 12 cm.', 100),
  ('E2172', 'Giornale degli affari 96 pagine – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Fiscali e IVA', '31 x 24,5 cm', null, 'Giornale degli affari Edipro, 96 pagine, formato 31 × 24,5 cm.', 100),
  ('E2103', 'Registro IVA corrispettivi 15 pagine numerate – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Fiscali e IVA', '31 x 24,5 cm', null, 'Registro IVA corrispettivi Edipro, 15 pagine numerate, formato 31 × 24,5 cm.', 100),
  ('E2117', 'Registro acquisti beni usati 23 pagine numerate – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Fiscali e IVA', '31 x 24,5 cm', null, 'Registro acquisti beni usati Edipro, 23 pagine numerate, formato 31 × 24,5 cm.', 100),
  ('E2133', 'Registro IVA fatture 22 pagine numerate – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Fiscali e IVA', '31 x 24,5 cm', null, 'Registro IVA fatture Edipro, 22 pagine numerate, formato 31 × 24,5 cm.', 100)
on conflict (sku) do update set
  name = excluded.name,
  price = excluded.price,
  image_url = excluded.image_url,
  brand = excluded.brand,
  category = excluded.category,
  subcategory = excluded.subcategory,
  format = excluded.format,
  ean = excluded.ean,
  description = excluded.description,
  stock = excluded.stock;
