# Audit immagini Modulistica

Data: 2026-07-28

## Riepilogo

| Voce | Conteggio |
|------|-----------|
| File JPG in `public/images/` (root) | 48 |
| SKU Modulistica in catalogo | 50 |
| SKU con foto unica corretta | 44 |
| SKU senza foto unica (cover hub generica) | 6 |
| Discrepanze corrette in questo passaggio | 3 (+2 nuove assegnazioni) |

## Discrepanze corrette

| SKU | Prima (errata) | Dopo (SKU stampato sulla copertina) |
|-----|----------------|--------------------------------------|
| E 5340 C | `92c5e4d1-…jpg` (era E 5356 A) | `82aed2d3-….jpg` Generica |
| E 5348 C | `82aed2d3-….jpg` (era E 5340 C) | `ad8ad89c-….jpg` Barbiere |
| E 5342 C | `86e56334-….jpg` (era E 5349) | `dc4d3188-….jpg` Parrucchiere |
| E 5349 | *(mancante / generica)* | `86e56334-….jpg` Prima nota 100 fogli |
| E 5356 A | *(mancante / generica)* | `92c5e4d1-….jpg` Prima nota 50×2 IVA |

## SKU senza foto unica in `public/images/`

Questi articoli restano con fallback hub (`/cancelleria-penne.jpg`) finché non arriva una copertina dedicata:

1. `E 5916` — Blocco comande 25x3
2. `E 9117` — Blocco comande a 7 tagliandi
3. `E 5351` — Blocco stato di cassa 100 fogli
4. `E 5567 C` — Ricevuta attività sportive
5. `E2666` — Registro due colonne
6. `E 5196 C` — Buono di consegna 50×2 9,9×17

## Immagini duplicate (stesso SKU già mappato)

Non assegnate come primarie (duplicati di copertine già usate):

- `56af0ef6-….jpg` → E 5220 G (già `5a2bd0c9-….jpg`)
- `a8851a2e-….jpg` → E 5183 (già `2cbbb207-….jpg`)
- `ddbfff85-….jpg` → E 5221 C (già `3ed3120b-….jpg`)
- `e53b5a96-….jpg` → E 3259 (già `80e3b5c6-….jpg`)

## Come aggiornare

```bash
node update-products.js
```

Applica catalogo TS + migration `042` / upsert produzione.
