-- Allinea il Timbro AF-TIMBRO-AZIENDE a Cancelleria > Accessori Scrivania
-- (prodotto singolo, non hub/sottocategoria dedicata).

update public.products
set
  category = 'Cancelleria',
  subcategory = 'Accessori Scrivania',
  name = 'Timbro per Aziende e Farmacie',
  price = 12.90,
  image_url = coalesce(nullif(trim(image_url), ''), '/timbri.jpg'),
  brand = coalesce(nullif(trim(brand), ''), 'Trodat'),
  description = 'Timbro autoinchiostrante professionale ideale per aziende, professionisti, farmacie e studi medici. Personalizzabile con ragione sociale, P.IVA e dati aziendali.',
  stock = coalesce(stock, 50)
where sku = 'AF-TIMBRO-AZIENDE';
