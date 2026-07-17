-- Seed primo record office: Carta Starline STL2005
-- Dati estratti letteralmente dallo screenshot fornito.

insert into public.office_products (
  id,
  name,
  brand,
  producer_code,
  category,
  main_features,
  image_url,
  description,
  price
)
values (
  'STL2005',
  'Carta fotocopie - A3 - 80 gr - 500 fogli - bianca - Starline',
  'STARLINE',
  'STL2005',
  'Carta bianca',
  '{
    "Colore": "Bianco",
    "Tipologia": "Carta bianca",
    "Formato": "A3 (29,7x42cm)",
    "Grammatura": "80gr",
    "Codice OD": "STL2005",
    "Codice produttore": "STL2005.",
    "Pagina catalogo cartaceo": "955",
    "Label": "GREEN"
  }'::jsonb,
  '',
  'Marca: STARLINE. Codice rivenditore non valorizzato nello screenshot (presente testo "crea nuovo codice").',
  null
)
on conflict (id) do update
set
  name = excluded.name,
  brand = excluded.brand,
  producer_code = excluded.producer_code,
  category = excluded.category,
  main_features = excluded.main_features,
  image_url = excluded.image_url,
  description = excluded.description,
  price = excluded.price,
  updated_at = now();
