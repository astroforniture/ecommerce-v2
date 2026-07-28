-- Modulistica Edipro: espansione sottocategorie + articoli
-- Aggiorna upsert_modulistica_edipro_catalog() e riallinea i nomi legacy.

alter table public.products
  add column if not exists ean text;

create or replace function public.upsert_modulistica_edipro_catalog()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent uuid;
  v_count int := 0;
begin
  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
  values (
    'Modulistica',
    'modulistica',
    '/office-products?category=Modulistica',
    '/cancelleria-penne.jpg',
    null,
    25
  )
  on conflict (slug) do update set
    name = excluded.name,
    listing_path = excluded.listing_path,
    cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
    sort_order = excluded.sort_order,
    updated_at = now()
  returning id into v_parent;

  if v_parent is null then
    select id into v_parent from public.office_catalog_categories where slug = 'modulistica' limit 1;
  end if;

  insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order)
  values
    (
      'Alberghi e Ristoranti',
      'modulistica-alberghi-ristoranti',
      '/office-products?category=Modulistica&subcategory=Alberghi%20e%20Ristoranti',
      '/cancelleria-penne.jpg',
      v_parent,
      10
    ),
    (
      'Condominio, Edilizia e Registri',
      'modulistica-condominio-edilizia',
      '/office-products?category=Modulistica&subcategory=Condominio%2C%20Edilizia%20e%20Registri',
      '/cancelleria-penne.jpg',
      v_parent,
      20
    ),
    (
      'Contabilità, Cassa e Fatture',
      'modulistica-contabilita-cassa-fatture',
      '/office-products?category=Modulistica&subcategory=Contabilit%C3%A0%2C%20Cassa%20e%20Fatture',
      '/cancelleria-penne.jpg',
      v_parent,
      30
    ),
    (
      'Ricevute Sportive e Varie',
      'modulistica-ricevute-sportive-varie',
      '/office-products?category=Modulistica&subcategory=Ricevute%20Sportive%20e%20Varie',
      '/cancelleria-penne.jpg',
      v_parent,
      40
    )
  on conflict (slug) do update set
    name = excluded.name,
    listing_path = excluded.listing_path,
    cover_image_url = coalesce(excluded.cover_image_url, public.office_catalog_categories.cover_image_url),
    parent_id = excluded.parent_id,
    sort_order = excluded.sort_order,
    updated_at = now();

  -- Riallinea sottocategorie legacy sui prodotti già presenti
  update public.products
  set subcategory = 'Alberghi e Ristoranti'
  where category = 'Modulistica'
    and subcategory in ('Alberghi Ristoranti');

  update public.products
  set subcategory = 'Condominio, Edilizia e Registri'
  where category = 'Modulistica'
    and subcategory in ('Condominio ed Edilizia');

  insert into public.products (
    sku, name, price, image_url, brand, category, subcategory, format, ean, description, stock
  )
  values
    ('E 5916', 'Blocco comande - 25x3 fogli autoricalcanti - 17 x 9,9 cm - Edipro', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Alberghi e Ristoranti', '17 x 9,9 cm', '8023328591601', 'Blocco comande Edipro a 25×3 fogli autoricalcanti, formato 17 × 9,9 cm. Ideale per alberghi e ristoranti.', 100),
    ('E 9117', 'Blocco comande a 7 tagliandi - 25x2 fogli autoricalcanti - 22 x 10 cm - Edipro', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Alberghi e Ristoranti', '22 x 10 cm', '8023328911706', 'Blocco comande Edipro a 7 tagliandi, 25×2 fogli autoricalcanti, formato 22 × 10 cm.', 100),
    ('E 5913', 'Blocco comande - 2 copie autoricalcanti - 17 x 9,9 cm - Edipro', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Alberghi e Ristoranti', '17 x 9,9 cm', '8023328591304', 'Blocco comande Edipro a 2 copie autoricalcanti, formato 17 × 9,9 cm.', 100),
    ('E 5504 C', 'Blocco ricevuta d’affitto 50×2 autoricalcante – Formato 9,9×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Condominio, Edilizia e Registri', '9,9 x 17 cm', '8023328550417', 'Blocco ricevuta d’affitto Edipro 50×2 autoricalcante, formato 9,9 × 17 cm. Per condominio e edilizia.', 100),
    ('E 2529', 'Verbale assemblea condominio 96 pagine – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Condominio, Edilizia e Registri', '31 x 24,5 cm', null, 'Verbale assemblea di condominio Edipro, 96 pagine, formato 31 × 24,5 cm.', 100),
    ('E 5563 C', 'Blocco ricevuta generica 50×2 autoricalcante – Formato 9,9×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Condominio, Edilizia e Registri', '9,9 x 17 cm', '8023328556310', 'Blocco ricevuta generica Edipro 50×2 autoricalcante, formato 9,9 × 17 cm.', 100),
    ('E 2104 A', 'Registro prima nota IVA corrispettivi 13×2 (1 anno) autoricalcante – Formato 29,7×23', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Condominio, Edilizia e Registri', '29,7 x 23 cm', '8023328210410', 'Registro prima nota IVA corrispettivi Edipro 13×2 (1 anno) autoricalcante, formato 29,7 × 23 cm.', 100),
    ('E 2102 A', 'Registro prima nota IVA corrispettivi 25×2 (2 anni) autoricalcante – Formato 29,7×23', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Condominio, Edilizia e Registri', '29,7 x 23 cm', '8023328210212', 'Registro prima nota IVA corrispettivi Edipro 25×2 (2 anni) autoricalcante, formato 29,7 × 23 cm.', 100),
    ('E 2108', 'Registro dei corrispettivi per mancato o irregolare funzionamento registratori di cassa – Formato 31×24,5', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Condominio, Edilizia e Registri', '31 x 24,5 cm', null, 'Registro dei corrispettivi Edipro per mancato o irregolare funzionamento dei registratori di cassa, formato 31 × 24,5 cm.', 100),
    ('E 5349', 'Blocco prima nota cassa 100 fogli uso mano – Formato 14,8×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '14,8 x 22 cm', '8023328534905', 'Blocco prima nota cassa Edipro 100 fogli uso mano, formato 14,8 × 22 cm.', 100),
    ('E 5349 A', 'Blocco prima nota cassa 50×2 autoricalcante – Formato 14,8×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '14,8 x 22 cm', '8023328534912', 'Blocco prima nota cassa Edipro 50×2 autoricalcante, formato 14,8 × 22 cm.', 100),
    ('E 5350', 'Blocco prima nota cassa 50×2 autoricalcante (cassa-banca) – Formato 22×29,7', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '22 x 29,7 cm', '8023328535001', 'Blocco prima nota cassa Edipro 50×2 autoricalcante (cassa-banca), formato 22 × 29,7 cm.', 100),
    ('E 5351', 'Blocco stato di cassa 100 fogli uso mano – Formato 22×14,8', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '22 x 14,8 cm', '8023328535100', 'Blocco stato di cassa Edipro 100 fogli uso mano, formato 22 × 14,8 cm.', 100),
    ('E 5356', 'Blocco prima nota cassa 100 fogli uso mano (entrata – uscita – IVA) – Formato 29,7×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '29,7 x 22 cm', '8023328535605', 'Blocco prima nota cassa Edipro 100 fogli uso mano (entrata – uscita – IVA), formato 29,7 × 22 cm.', 100),
    ('E 5356 A', 'Blocco prima nota cassa 50×2 autoricalcante (entrate – uscite - IVA) – Formato 29,7×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '29,7 x 22 cm', '8023328535612', 'Blocco prima nota cassa Edipro 50×2 autoricalcante (entrate – uscite - IVA), formato 29,7 × 22 cm.', 100),
    ('E 5359 A', 'Blocco prima nota cassa 50×2 autoricalcante (entrate – uscite) – Formato 29,7×22', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '29,7 x 22 cm', '8023328535919', 'Blocco prima nota cassa Edipro 50×2 autoricalcante (entrate – uscite), formato 29,7 × 22 cm.', 100),
    ('E 5279 A', 'Blocco fattura generica 50×2 autoricalcante – Formato 22×14,8', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '22 x 14,8 cm', '8023328527914', 'Blocco fattura generica Edipro 50×2 autoricalcante, formato 22 × 14,8 cm.', 100),
    ('E4033', 'Scadenzario effetti passivi con spirale e indici plastificati 36 fogli – Formato 24×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Contabilità, Cassa e Fatture', '24 x 17 cm', null, 'Scadenzario effetti passivi Edipro con spirale e indici plastificati, 36 fogli, formato 24 × 17 cm.', 100),
    ('E 5567 C', 'Blocco ricevuta di pagamento per attività sportive 50×2 autoricalcante – Formato 9,9×17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Ricevute Sportive e Varie', '9,9 x 17 cm', '8023328556716', 'Blocco ricevuta di pagamento per attività sportive Edipro 50×2 autoricalcante, formato 9,9 × 17 cm.', 100),
    ('E 5275 CN', 'Ricevuta Sanitaria 50x2 autoricalcanti - Formato 9,9x17', 0, '/cancelleria-penne.jpg', 'Edipro', 'Modulistica', 'Ricevute Sportive e Varie', '9,9 x 17 cm', '8023328527518', 'Ricevuta sanitaria Edipro 50×2 autoricalcanti, formato 9,9 × 17 cm.', 100)
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

  get diagnostics v_count = row_count;

  return jsonb_build_object(
    'ok', true,
    'category_id', v_parent,
    'products_upserted', 20,
    'rows_affected', v_count
  );
end;
$$;

grant execute on function public.upsert_modulistica_edipro_catalog() to anon, authenticated, service_role;

select public.upsert_modulistica_edipro_catalog();
