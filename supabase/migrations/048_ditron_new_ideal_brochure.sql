-- Brochure PDF NEW iDEAL (Casse Ditron)
alter table public.products
  add column if not exists brochure_url text;

update public.products
set brochure_url = '/pdf/brochure-new-ideal.pdf'
where sku = 'AF-DITRON-new-ideal';
