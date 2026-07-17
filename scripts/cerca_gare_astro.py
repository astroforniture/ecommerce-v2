"""
Monitoraggio gare Astro Forniture – entry point unificato (Sintel + MePA).

Esegue entrambi i controlli, genera un unico Excel con due fogli e invia
una sola email di riepilogo. Usare questo script per l'automazione giornaliera.

Dipendenze: pip install -r scripts/requirements-gare.txt
Config: scripts/.env (SMTP) + scripts/keywords_astro.py (keyword e budget)
"""

from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))
load_dotenv(SCRIPT_DIR / ".env")

from cerca_gare_mepa import cerca_gare_mepa
from cerca_gare_sintel import cerca_gare_sintel
from email_gare import invia_report_unificato
from keywords_astro import MAX_IMPORTO, MIN_IMPORTO


def _salva_report_unificato(
    df_sintel: pd.DataFrame,
    df_mepa: pd.DataFrame,
) -> Path:
    oggi = datetime.now().strftime("%Y%m%d")
    percorso = SCRIPT_DIR / f"gare_astro_report_{oggi}.xlsx"
    with pd.ExcelWriter(percorso, engine="openpyxl") as writer:
        df_sintel.to_excel(writer, sheet_name="Sintel", index=False)
        df_mepa.to_excel(writer, sheet_name="MePA", index=False)
    return percorso


def esegui_monitoraggio(invia_email: bool = True) -> None:
    print("=" * 60)
    print("MONITORAGGIO GARE ASTRO FORNITURE (Sintel + MePA)")
    print(f"Budget: {MIN_IMPORTO:,.0f} – {MAX_IMPORTO:,.0f} EUR")
    print("=" * 60)

    df_sintel, n_sintel = cerca_gare_sintel(invia_email=False)
    print("-" * 60)
    df_mepa, n_mepa = cerca_gare_mepa(invia_email=False)

    percorso = _salva_report_unificato(df_sintel, df_mepa)
    print("-" * 60)
    print(f"Report unificato: {percorso}")
    print(f"Totale: {n_sintel} Sintel + {n_mepa} MePA = {n_sintel + n_mepa} opportunità")

    if invia_email:
        invia_report_unificato(
            df_sintel,
            df_mepa,
            percorso,
            n_sintel,
            n_mepa,
            SCRIPT_DIR / ".env",
        )


if __name__ == "__main__":
    esegui_monitoraggio()
