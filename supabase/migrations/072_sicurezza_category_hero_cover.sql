-- Cover macro-categoria Sicurezza: hero operatore con elmetto

update public.office_catalog_categories
set
  cover_image_url = '/images/man-with-arms-crossed-working-warehouse.jpg',
  updated_at = now()
where slug = 'sicurezza';
