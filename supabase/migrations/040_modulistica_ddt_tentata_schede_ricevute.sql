-- Modulistica: DDT Tentata Vendita + Buoni/Ricevute + Schede Contabili + Ricevute Fiscali

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
      'Documenti di Trasporto e Tentata Vendita',
      'modulistica-documenti-trasporto-tentata-vendita',
      '/office-products?category=Modulistica&subcategory=Documenti%20di%20Trasporto%20e%20Tentata%20Vendita',
      '/cancelleria-penne.jpg',
      v_parent,
      100
    ),
    (
      'Buoni di Consegna e Ricevute',
      'modulistica-buoni-consegna-ricevute',
      '/office-products?category=Modulistica&subcategory=Buoni%20di%20Consegna%20e%20Ricevute',
      '/cancelleria-penne.jpg',
      v_parent,
      110
    ),
    (
      'Schede Contabili e Maste',
      'modulistica-schede-contabili-maste',
      '/office-products?category=Modulistica&subcategory=Schede%20Contabili%20e%20Maste',
      '/cancelleria-penne.jpg',
      v_parent,
      120
    ),
    (
      'Ricevute Fiscali e Fatture',
      'modulistica-ricevute-fiscali-fatture',
      '/office-products?category=Modulistica&subcategory=Ricevute%20Fiscali%20e%20Fatture',
      '/cancelleria-penne.jpg',
      v_parent,
      130
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
  ('E 5220 G', 'Blocco documento di trasporto carico per tentata vendita 50×2 autoricalcante – Formato 29,7×22', 0, '/images/5a2bd0c9-2438-4f03-8594-7dbc2d48802d.jpg', 'Edipro', 'Modulistica', 'Documenti di Trasporto e Tentata Vendita', '29,7 x 22 cm', '8023328522018', 'Blocco documento di trasporto carico per tentata vendita Edipro 50×2 autoricalcante, formato 29,7 × 22 cm.', 100),
  ('E 5221 C', 'Blocco D.D.T. fattura tentata vendita 50×2 autoricalcante – Formato 29,7×22', 0, '/images/3ed3120b-c35b-4039-a941-b10b6dca6d1c.jpg', 'Edipro', 'Modulistica', 'Documenti di Trasporto e Tentata Vendita', '29,7 x 22 cm', '8023328522117', 'Blocco D.D.T. fattura tentata vendita Edipro 50×2 autoricalcante, formato 29,7 × 22 cm.', 100),
  ('E 5183', 'Blocco buono di consegna 100 fogli uso mano – Formato 9,9×17', 0, '/images/2cbbb207-0340-42bb-afd5-4217dd356ff0.jpg', 'Edipro', 'Modulistica', 'Buoni di Consegna e Ricevute', '9,9 x 17 cm', '8023328518301', 'Blocco buono di consegna Edipro 100 fogli uso mano, formato 9,9 × 17 cm.', 100),
  ('E 3399', 'Schede - 2 colonne - 24 x 17 cm (verticale) - Edipro - conf. 100 pezzi', 0, '/images/0f73bb8f-8dbc-4b0a-bed3-69a6b148ad4f.jpg', 'Edipro', 'Modulistica', 'Schede Contabili e Maste', '24 x 17 cm', '8023328339906', 'Schede contabili Edipro a 2 colonne, formato 24 × 17 cm verticale, confezione da 100 pezzi.', 100),
  ('E 3369', 'Schede - 3 colonne - 17 x 24 cm orizzontale - Edipro - conf. 100 pezzi', 0, '/images/67e70187-52d7-4788-bd05-54495c728c0c.jpg', 'Edipro', 'Modulistica', 'Schede Contabili e Maste', '17 x 24 cm', '8023328336905', 'Schede contabili Edipro a 3 colonne, formato 17 × 24 cm orizzontale, confezione da 100 pezzi.', 100),
  ('E 3259', 'Schede - 3 colonne - 15 x 21 cm orizzontale - Edipro - conf. 100 pezzi', 0, '/images/80e3b5c6-de8e-4d92-bcb9-5dfe75970e79.jpg', 'Edipro', 'Modulistica', 'Schede Contabili e Maste', '15 x 21 cm', '8023328325909', 'Schede contabili Edipro a 3 colonne, formato 15 × 21 cm orizzontale, confezione da 100 pezzi.', 100),
  ('E 3406', 'Schede - 3 colonne - 24 x 17 cm verticale - Edipro - conf. 100 pezzi', 0, '/images/9754b9bb-7d4e-4967-a8dd-a99dde182fe8.jpg', 'Edipro', 'Modulistica', 'Schede Contabili e Maste', '24 x 17 cm', '8023328340605', 'Schede contabili Edipro a 3 colonne, formato 24 × 17 cm verticale, confezione da 100 pezzi.', 100),
  ('E 5348 C', 'Blocco fattura/ricevuta fiscale barbiere 50×2 autoricalcante – Formato 22×9,9', 0, '/images/82aed2d3-b9a7-4813-8183-2abd6fee6add.jpg', 'Edipro', 'Modulistica', 'Ricevute Fiscali e Fatture', '22 x 9,9 cm', '8023328534813', 'Blocco fattura/ricevuta fiscale barbiere Edipro 50×2 autoricalcante, formato 22 × 9,9 cm.', 100),
  ('E 5342 C', 'Blocco fattura/ricevuta fiscale parrucchiere 50×2 autoricalcante – Formato 22×9,9', 0, '/images/86e56334-f38d-4d6e-b0aa-2ef9b6fc565a.jpg', 'Edipro', 'Modulistica', 'Ricevute Fiscali e Fatture', '22 x 9,9 cm', '8023328534219', 'Blocco fattura/ricevuta fiscale parrucchiere Edipro 50×2 autoricalcante, formato 22 × 9,9 cm.', 100),
  ('E 5340 C', 'Blocco fattura/ricevuta fiscale generica 50×2 autoricalcante – Formato 22×14,8', 0, '/images/92c5e4d1-0e14-4191-8a5d-6fad90ab6ad3.jpg', 'Edipro', 'Modulistica', 'Ricevute Fiscali e Fatture', '22 x 14,8 cm', '8023328534011', 'Blocco fattura/ricevuta fiscale generica Edipro 50×2 autoricalcante, formato 22 × 14,8 cm.', 100)
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
