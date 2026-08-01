-- Prezzo listino 8,00 € (imponibile) per sottocategorie Modulistica:
-- Condominio ed Edilizia, Contabilità IVA e Generale, Magazzino e Trasporti, Stampati Fiscali

update public.products
set price = 8.00
where category = 'Modulistica'
  and subcategory in (
    'Condominio ed Edilizia',
    'Contabilità IVA e Generale',
    'Magazzino e Trasporti',
    'Stampati Fiscali'
  );
