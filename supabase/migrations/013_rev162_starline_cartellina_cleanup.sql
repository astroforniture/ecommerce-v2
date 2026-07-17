-- Rev. 162 — Cartelline Starline: rimuovi varianti colore non ufficiali dal catalogo `public.products`.
-- Colori ufficiali lato app: Giallo, Rosso, Verde, Arancio, Blu, Azzurro, Ciclamino, Bianco, Colori Assortiti (5 colori).
-- Esegui backup prima di applicare in produzione.

begin;

-- 1) Cancella righe con color_name esplicito tra i colori da eliminare (case-insensitive).
delete from public.products p
where coalesce(p.brand, '') ilike '%starline%'
  and lower(p.name) like '%cartellin%'
  and lower(trim(coalesce(p.color_name, ''))) in (
    'nero',
    'black',
    'lime',
    'fucsia',
    'fuchsia',
    'lilla',
    'lilac',
    'lavanda',
    'viola',
    'magenta'
  );

-- 2) Opzionale: righe senza color_name ma titolo che indica solo varianti obsolete (pattern conservativi).
delete from public.products p
where coalesce(p.brand, '') ilike '%starline%'
  and lower(p.name) like '%cartellin%'
  and length(trim(coalesce(p.color_name, ''))) = 0
  and (
    lower(p.name) ~ '(^|[^a-z0-9])(nero|lime|fucsia|lilla)([^a-z0-9]|$)'
    or lower(p.name) ~ '(^|[^a-z0-9])(fuchsia|magenta|lavanda)([^a-z0-9]|$)'
  );

commit;
