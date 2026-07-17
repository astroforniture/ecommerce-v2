-- Etichettatrici di test per ricerca globale (query "eti", "etichettatrice", …)
-- Esegui in Supabase → SQL Editor. Idempotente su sku.

INSERT INTO public.products (sku, name, price, image_url, brand, category, subcategory, description)
VALUES
  (
    'AF-ETCH-BROTHER-PT-E610P',
    'Etichettatrice Elettronica Portatile Brother PT-E610P',
    189.00,
    'https://odmultimedia.eu/immagini/MD/BRO-PTD210.jpg',
    'Brother',
    'Macchine per Ufficio',
    'Etichettatrici',
    'Etichettatrice elettronica portatile Brother P-touch per ufficio, magazzino e cavi. ' ||
    'Stampa etichette laminati e nastri TZ; tastiera QWERTY; ideale per etichettatura professionale.'
  ),
  (
    'AF-ETCH-LABELS-COMPAT-24X12',
    'Etichette Adesive Compatibili — rotolo 24 mm × 12 m (bianco)',
    12.50,
    'https://placehold.co/400x400/e2e8f0/1e293b?text=Etichette',
    'Generico',
    'Macchine per Ufficio',
    'Etichettatrici',
    'Nastro etichette adesive compatibile con etichettatrici Brother e Dymo. ' ||
    'Rotolo continuo bianco 24 mm; per scaffali, cavi e identificazione ufficio.'
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description;
