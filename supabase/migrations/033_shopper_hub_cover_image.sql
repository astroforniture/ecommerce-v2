-- Cover tile Cancelleria → Shopper: carta + plastica affiancate (1:1).

update public.office_catalog_categories
set
  cover_image_url = '/images/shopper-category.png',
  updated_at = now()
where slug = 'shopper';
