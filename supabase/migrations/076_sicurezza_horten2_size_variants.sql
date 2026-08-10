-- Sicurezza → Giacche: Horten2 Light (89931) con varianti taglia + allegati PDF
-- Evita duplicati per taglia: un solo SKU listino con variants JSON

with parent as (
  select id from public.office_catalog_categories where slug = 'sicurezza'
)
insert into public.office_catalog_categories (name, slug, listing_path, cover_image_url, parent_id, sort_order, is_active)
select
  'Giacche',
  'sicurezza-giacche',
  '/office-products?category=Sicurezza&subcategory=Giacche',
  'https://odmultimedia.eu/immagini/LD/104546.jpg',
  parent.id,
  70,
  true
from parent
on conflict (slug) do update set
  name = excluded.name,
  listing_path = excluded.listing_path,
  is_active = true,
  updated_at = now();

create temporary table tmp_horten2 (
  sku text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  image_url text not null,
  color_name text,
  format text,
  brochure_url text,
  variants jsonb,
  description text not null
) on commit drop;

insert into tmp_horten2 (
  sku, name, brand, price, image_url, color_name, format, brochure_url, variants, description
)
values (
  '89931',
  'Giacca Softshell Horten2 Light - tessuto Softshell/poliestere/elastan - con cappuccio - nero/giallo - Deltaplus',
  'Deltaplus',
  60.00,
  'https://odmultimedia.eu/immagini/LD/89931.jpg',
  'nero/giallo',
  'Softshell con cappuccio · taglie S–3XL',
  '/docs/safety/89931.pdf',
  jsonb_build_object(
    'gallery', jsonb_build_array(),
    'attachments', jsonb_build_object(
      'brochure_url', '/docs/safety/89931.pdf',
      'datasheet_pdf', '/docs/safety/89931-2.pdf',
      'catalog_page_pdf', '/docs/safety/89931-1.pdf'
    ),
    'options', jsonb_build_array(
      jsonb_build_object('label', 'S', 'sku', 'HORT2NJTS'),
      jsonb_build_object('label', 'M', 'sku', 'HORT2NJTM', 'ean', '3295249234782'),
      jsonb_build_object('label', 'L', 'sku', 'HORT2NJGT', 'ean', '3295249234799'),
      jsonb_build_object('label', 'XL', 'sku', 'HORT2NJXG'),
      jsonb_build_object('label', 'XXL', 'sku', 'HORT2NJXX'),
      jsonb_build_object('label', '3XL', 'sku', 'HORT2NJ3X')
    )
  ),
  $d$Giacca Softshell Delta Plus Horten2 Light con cappuccio, nero/giallo. Softshell a 3 strati laminati (poliestere/elastan): antivento, idrorepellente su pioggia fine e traspirante. Cappuccio fisso, zip sotto patta antipioggia, 4 tasche e piping catarifrangente decorativo. Conformità tipica EN ISO 13688:2013 / Regolamento UE 2016/425 (rischi minori). Selezionare la taglia (S–3XL) prima dell’acquisto: ogni taglia ha codice produttore dedicato (es. HORT2NJTM per M). Prezzo unitario imponibile IVA esclusa.$d$
);

update public.products as p
set
  name = t.name,
  brand = t.brand,
  price = t.price,
  image_url = t.image_url,
  color_name = t.color_name,
  format = t.format,
  brochure_url = coalesce(t.brochure_url, p.brochure_url),
  variants = t.variants,
  description = t.description,
  category = 'Sicurezza',
  subcategory = 'Giacche',
  stock = coalesce(p.stock, 100)
from tmp_horten2 as t
where p.sku = t.sku;

insert into public.products (
  sku, name, price, image_url, brand, category, subcategory,
  description, color_name, format, brochure_url, variants, stock
)
select
  t.sku,
  t.name,
  t.price,
  t.image_url,
  t.brand,
  'Sicurezza',
  'Giacche',
  t.description,
  t.color_name,
  t.format,
  t.brochure_url,
  t.variants,
  100
from tmp_horten2 as t
where not exists (select 1 from public.products p where p.sku = t.sku);

-- Allinea anche 89929 (Horten) alle stesse taglie/documenti se presente
update public.products as p
set
  variants = t.variants,
  brochure_url = coalesce(t.brochure_url, p.brochure_url),
  subcategory = 'Giacche',
  category = 'Sicurezza'
from tmp_horten2 as t
where p.sku = '89929';
