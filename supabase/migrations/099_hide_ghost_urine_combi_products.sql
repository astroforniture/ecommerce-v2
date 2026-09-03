-- Bonifica prodotti fantasma Combi Screen / Urilyzer con associazioni immagine errate.
-- Non elimina gima-24050 (Urilyzer 500 PRO reale).

do $$
begin
  if to_regclass('public.products') is null then
    raise notice 'public.products assente: migrazione saltata.';
    return;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'is_catalog_visible'
  ) then
    update public.products
    set is_catalog_visible = false
    where
      id::text in (
        'gima-32100', 'gima-32200', 'gima-32300',
        'gima-32410', 'gima-32411', 'gima-32412', 'gima-32413', 'gima-32414', 'gima-32415',
        'AF-DIAG-analisi-urina-gima', 'AF-DIAG-urilyzer-100', 'AF-DIAG-urilyzer-500',
        'AF-DIAG-combi-screen-2p', 'AF-DIAG-combi-screen-5p', 'AF-DIAG-combi-screen-8p',
        'AF-DIAG-combi-screen-10p', 'AF-DIAG-combi-screen-11p', 'AF-DIAG-combi-screen-13p'
      )
      or lower(coalesce(sku, '')) in (
        '32100', '32200', '32300', '32410', '32411', '32412', '32413', '32414', '32415'
      )
      or (
        (
          name ilike '%Combi Screen%'
          or name ilike '%Urilyzer 100%'
          or (name ilike '%Urilyzer 500%' and name not ilike '%500 PRO%')
          or name ilike '%Analizzatore analisi urina Gima%'
        )
        and coalesce(sku, '') not ilike '%24050%'
        and id::text not ilike '%24050%'
      );
  else
    delete from public.products
    where
      id::text in (
        'gima-32100', 'gima-32200', 'gima-32300',
        'gima-32410', 'gima-32411', 'gima-32412', 'gima-32413', 'gima-32414', 'gima-32415',
        'AF-DIAG-analisi-urina-gima', 'AF-DIAG-urilyzer-100', 'AF-DIAG-urilyzer-500',
        'AF-DIAG-combi-screen-2p', 'AF-DIAG-combi-screen-5p', 'AF-DIAG-combi-screen-8p',
        'AF-DIAG-combi-screen-10p', 'AF-DIAG-combi-screen-11p', 'AF-DIAG-combi-screen-13p'
      )
      or lower(coalesce(sku, '')) in (
        '32100', '32200', '32300', '32410', '32411', '32412', '32413', '32414', '32415'
      )
      or (
        (
          name ilike '%Combi Screen%'
          or name ilike '%Urilyzer 100%'
          or (name ilike '%Urilyzer 500%' and name not ilike '%500 PRO%')
          or name ilike '%Analizzatore analisi urina Gima%'
        )
        and coalesce(sku, '') not ilike '%24050%'
        and id::text not ilike '%24050%'
      );
  end if;
end $$;
