-- Aggiorna cover_image_url delle 8 sottocategorie Sicurezza

update public.office_catalog_categories as c
set
  cover_image_url = v.cover_image_url,
  updated_at = now()
from (
  values
    ('sicurezza-nastri', 'https://odmultimedia.eu/immagini/MD/101356.jpg?v=246'),
    ('sicurezza-elmetti', 'https://odmultimedia.eu/immagini/MD/97181.jpg?v=246'),
    ('sicurezza-guanti', 'https://odmultimedia.eu/immagini/LD/76214.jpg?v=246'),
    ('sicurezza-occhiali', 'https://odmultimedia.eu/immagini/MD/79718.jpg?v=246'),
    ('sicurezza-pantaloni', 'https://odmultimedia.eu/immagini/LD/86187.jpg?v=246'),
    ('sicurezza-giubbotti', 'https://odmultimedia.eu/immagini/LD/73755.jpg?v=246'),
    ('sicurezza-giacche', 'https://odmultimedia.eu/immagini/LD/104546.jpg?v=246'),
    ('sicurezza-protezione-udito', 'https://odmultimedia.eu/immagini/LD/79840.jpg?v=246')
) as v(slug, cover_image_url)
where c.slug = v.slug;
