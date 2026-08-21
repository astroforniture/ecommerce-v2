-- Campi GPSR (Reg. UE 2023/988) su public.products per scheda prodotto.

alter table public.products
  add column if not exists manufacturer_name text,
  add column if not exists manufacturer_address text,
  add column if not exists importer_name text,
  add column if not exists importer_address text,
  add column if not exists eu_responsible_name text,
  add column if not exists eu_responsible_address text,
  add column if not exists safety_warnings text,
  add column if not exists gpsr jsonb;

comment on column public.products.manufacturer_name is 'GPSR: nome produttore';
comment on column public.products.manufacturer_address is 'GPSR: indirizzo produttore';
comment on column public.products.importer_name is 'GPSR: nome importatore';
comment on column public.products.importer_address is 'GPSR: indirizzo importatore';
comment on column public.products.eu_responsible_name is 'GPSR: responsabile economico UE';
comment on column public.products.eu_responsible_address is 'GPSR: indirizzo responsabile UE';
comment on column public.products.safety_warnings is 'GPSR: avvertenze / note di sicurezza';
comment on column public.products.gpsr is 'GPSR: payload JSON opzionale (override campi colonna)';
