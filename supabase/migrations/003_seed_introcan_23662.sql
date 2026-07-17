-- Seed iniziale record reale: Gima 23662
-- Fonte dati: scheda prodotto Gima print/?sku=23662

insert into public.medical_products (
  sku,
  code,
  id_text,
  name,
  category,
  selling_unit,
  medical_type,
  rdm,
  cnd,
  ean,
  image_url,
  description,
  price,
  macro_id,
  gima_department_label,
  cta
)
values (
  '23662',
  '23662',
  '23662',
  'CATETERE IV INTROCAN SAFETY B-BRAUN 18G 45 mm - sterile',
  'Aghi e siringhe',
  'conf. 50 pz.',
  'Dispositivo medico',
  '505116',
  'C0101010202',
  '4046964047398',
  'https://www.gimaitaly.com/immagini/prodotti/23662.jpg',
  'INTROCAN SAFETY PUR radiopaco sterile 18G (1,3x45 mm), senza lattice/PVC/DEHP, dispositivo di sicurezza automatico, tecnologia Double Flashback.',
  0,
  'farmacia-cura',
  'Health care - pharmacy',
  'quote'
)
on conflict (sku) do update
set
  code = excluded.code,
  id_text = excluded.id_text,
  name = excluded.name,
  category = excluded.category,
  selling_unit = excluded.selling_unit,
  medical_type = excluded.medical_type,
  rdm = excluded.rdm,
  cnd = excluded.cnd,
  ean = excluded.ean,
  image_url = excluded.image_url,
  description = excluded.description,
  price = excluded.price,
  macro_id = excluded.macro_id,
  gima_department_label = excluded.gima_department_label,
  cta = excluded.cta,
  updated_at = now();
