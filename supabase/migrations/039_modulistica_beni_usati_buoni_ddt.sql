-- Modulistica: Beni Usati + Buoni di Consegna + DDT

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
      'Registri Fiscali e Beni Usati',
      'modulistica-registri-fiscali-beni-usati',
      '/office-products?category=Modulistica&subcategory=Registri%20Fiscali%20e%20Beni%20Usati',
      '/cancelleria-penne.jpg',
      v_parent,
      70
    ),
    (
      'Buoni di Consegna e Tentata Vendita',
      'modulistica-buoni-consegna-tentata-vendita',
      '/office-products?category=Modulistica&subcategory=Buoni%20di%20Consegna%20e%20Tentata%20Vendita',
      '/cancelleria-penne.jpg',
      v_parent,
      80
    ),
    (
      'Documenti di Trasporto (DDT)',
      'modulistica-documenti-trasporto-ddt',
      '/office-products?category=Modulistica&subcategory=Documenti%20di%20Trasporto%20(DDT)',
      '/cancelleria-penne.jpg',
      v_parent,
      90
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
  ('E2134', 'Registro vendite beni usati 23 pagine numerate – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Registri Fiscali e Beni Usati', '31 x 24,5 cm', null, 'Registro vendite beni usati Edipro, 23 pagine numerate, formato 31 × 24,5 cm.', 100),
  ('E 5199 CT', 'Blocco buono di consegna 33×3 autoricalcante – Formato 9,9×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Buoni di Consegna e Tentata Vendita', '9,9 x 17 cm', '8023328519926', 'Blocco buono di consegna Edipro 33×3 autoricalcante, formato 9,9 × 17 cm.', 100),
  ('E 5196 C', 'Blocco buono di consegna 50×2 autoricalcante – Formato 9,9×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Buoni di Consegna e Tentata Vendita', '9,9 x 17 cm', '8023328519612', 'Blocco buono di consegna Edipro 50×2 autoricalcante, formato 9,9 × 17 cm.', 100),
  ('E 5197 C', 'Blocco buono di consegna 50×2 autoricalcante – Formato 12×17,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Buoni di Consegna e Tentata Vendita', '12 x 17,5 cm', '8023328519711', 'Blocco buono di consegna Edipro 50×2 autoricalcante, formato 12 × 17,5 cm.', 100),
  ('E 5209 C', 'Blocco buono di consegna 50×2 autoricalcante – Formato 22×14,8', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Buoni di Consegna e Tentata Vendita', '22 x 14,8 cm', '8023328520915', 'Blocco buono di consegna Edipro 50×2 autoricalcante, formato 22 × 14,8 cm.', 100),
  ('E 5217 A', 'Blocco nota di consegna tentata vendita 50×2 autoricalcante – Formato 14,8×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Buoni di Consegna e Tentata Vendita', '14,8 x 22 cm', '8023328521714', 'Blocco nota di consegna tentata vendita Edipro 50×2 autoricalcante, formato 14,8 × 22 cm.', 100),
  ('E 5215 CT', 'Blocco documento di trasporto 33×3 autoricalcante – Formato 22×14,8', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Documenti di Trasporto (DDT)', '22 x 14,8 cm', '8023328521523', 'Blocco documento di trasporto Edipro 33×3 autoricalcante, formato 22 × 14,8 cm.', 100),
  ('E 5219 CT', 'Blocco documento di trasporto 33×3 autoricalcante – Formato 29,7×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Documenti di Trasporto (DDT)', '29,7 x 22 cm', '8023328521929', 'Blocco documento di trasporto Edipro 33×3 autoricalcante, formato 29,7 × 22 cm.', 100),
  ('E 5214 C', 'Blocco documento di trasporto 50×2 autoricalcante – Formato 22×14,8', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Documenti di Trasporto (DDT)', '22 x 14,8 cm', '8023328521417', 'Blocco documento di trasporto Edipro 50×2 autoricalcante, formato 22 × 14,8 cm.', 100),
  ('E 5218 C', 'Blocco documento di trasporto 25×4 autoricalcante – Formato 29,7×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Documenti di Trasporto (DDT)', '29,7 x 22 cm', '8023328521813', 'Blocco documento di trasporto Edipro 25×4 autoricalcante, formato 29,7 × 22 cm.', 100)
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
