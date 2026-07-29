-- FAQ prodotto: colonna JSONB + seed NEW iDEAL
alter table public.products
  add column if not exists faq jsonb;

comment on column public.products.faq is
  'Array JSON di oggetti { "question": string, "answer": string } per FAQ in scheda prodotto.';

update public.products
set faq = '[
  {
    "question": "Il NEW iDEAL è un registratore telematico conforme?",
    "answer": "Sì. È un Registratore Telematico conforme ai requisiti dell’Agenzia delle Entrate per la memorizzazione e la trasmissione dei corrispettivi, con memoria fiscale su Micro SD certificata RT."
  },
  {
    "question": "Include Wi-Fi e collegamento a cassetto?",
    "answer": "Sì: ha Wi-Fi integrato, porta Ethernet, porte seriali, USB e connettore per cassetto. È pensato per negozi, bar, ristoranti e attività commerciali che necessitano di connettività flessibile."
  },
  {
    "question": "Il prezzo include installazione e configurazione?",
    "answer": "Il NEW iDEAL è venduto su preventivo: in offerta possiamo includere installazione, configurazione fiscale, assistenza iniziale e opzioni dedicate alla tua attività. Contattaci per un’offerta personalizzata."
  },
  {
    "question": "Posso scaricare la scheda tecnica?",
    "answer": "Sì. Nella scheda prodotto trovi il pulsante “Scarica Brochure PDF (Scheda Tecnica)” con le specifiche ufficiali Ditron NEW iDEAL."
  }
]'::jsonb
where sku = 'AF-DITRON-new-ideal';
