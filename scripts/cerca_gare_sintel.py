"""
Monitoraggio gare Sintel (Open Data Regione Lombardia) per Astro Forniture.

Dataset: Procedure di gara gestite tramite Sintel
https://www.dati.lombardia.it/Trasparenza/Procedure-di-gara-gestite-tramite-Sintel/8txy-zjw2

Notifiche email: usa cerca_gare_astro.py per il report unificato (automazione).
Config: scripts/.env + scripts/keywords_astro.py
"""

import os
import smtplib
import sys
from datetime import datetime
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

import pandas as pd
import requests
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))
load_dotenv(SCRIPT_DIR / ".env")

from keywords_astro import EXCLUDE_KEYWORDS, KEYWORDS, MAX_IMPORTO, MIN_IMPORTO

URL_API = "https://dati.lombardia.it/resource/8txy-zjw2.json"

STATI_APERTI = ("Pubblicata", "In valutazione", "Invio Offerte Offline")

_SEARCH_FIELDS = ("nome_procedura", "nome_lotto", "categoria_merceologiche")


def _keyword_clause(keywords: list[str]) -> str:
    parts = []
    for kw in keywords:
        pat = kw.lower().replace("'", "''")
        for field in _SEARCH_FIELDS:
            parts.append(f"lower({field}) like '%{pat}%'")
    return " OR ".join(parts)


def _exclude_clause(keywords: list[str]) -> str:
    parts = []
    for kw in keywords:
        pat = kw.lower().replace("'", "''")
        for field in _SEARCH_FIELDS:
            parts.append(f"lower({field}) like '%{pat}%'")
    return f"NOT ({' OR '.join(parts)})"


def _email_configurata() -> bool:
    required = ("SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_TO")
    return all(os.getenv(k, "").strip() for k in required)


def invia_email_risultati(df: pd.DataFrame, allegato: Path, num_gare: int) -> None:
    if not _email_configurata():
        print(
            "Email non inviata: configura SMTP_HOST, SMTP_USER, SMTP_PASSWORD e EMAIL_TO "
            f"in {SCRIPT_DIR / '.env'} (copia da .env.example)."
        )
        return

    host = os.environ["SMTP_HOST"]
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    password = os.environ["SMTP_PASSWORD"]
    destinatari = [e.strip() for e in os.environ["EMAIL_TO"].split(",") if e.strip()]
    mittente = os.getenv("EMAIL_FROM", user).strip()
    use_ssl = port == 465 or os.getenv("SMTP_USE_SSL", "").lower() in ("1", "true", "yes")

    oggi = datetime.now().strftime("%d/%m/%Y")
    oggetto = f"[Astro Forniture] {num_gare} gare Sintel trovate – {oggi}"

    tabella_html = df.to_html(index=False, escape=True, border=1)
    corpo_html = f"""\
<html>
<body>
  <p>Ciao,</p>
  <p>Il monitoraggio Sintel ha trovato <strong>{num_gare}</strong> gara/e in linea con i criteri Astro Forniture.</p>
  {tabella_html}
  <p>In allegato il report Excel completo.</p>
  <p><em>Generato automaticamente da cerca_gare_sintel.py</em></p>
</body>
</html>
"""

    msg = MIMEMultipart()
    msg["From"] = mittente
    msg["To"] = ", ".join(destinatari)
    msg["Subject"] = oggetto
    msg.attach(MIMEText(corpo_html, "html", "utf-8"))

    with open(allegato, "rb") as f:
        part = MIMEApplication(f.read(), _subtype="xlsx")
        part.add_header("Content-Disposition", "attachment", filename=allegato.name)
        msg.attach(part)

    try:
        if use_ssl:
            server_cls = smtplib.SMTP_SSL
        else:
            server_cls = smtplib.SMTP

        with server_cls(host, port, timeout=30) as server:
            if not use_ssl and os.getenv("SMTP_USE_TLS", "true").lower() in (
                "1",
                "true",
                "yes",
            ):
                server.starttls()
            server.login(user, password)
            server.sendmail(mittente, destinatari, msg.as_string())
        print(f"Email inviata a: {', '.join(destinatari)}")
    except smtplib.SMTPException as e:
        print(f"Errore invio email: {e}")


def cerca_gare_sintel(
    min_importo: float = MIN_IMPORTO,
    max_importo: float = MAX_IMPORTO,
    limit: int = 100,
    invia_email: bool = False,
) -> tuple[pd.DataFrame, int]:
    print("Avvio monitoraggio gare Sintel per Astro Forniture...")

    colonne_utili = {
        "id_procedura": "ID Procedura",
        "stazione_appaltante": "Ente Pubblico",
        "nome_procedura": "Oggetto Gara",
        "nome_lotto": "Lotto",
        "valore_economico_procedura": "Valore procedura (EUR)",
        "data_fine_negoziazione": "Scadenza negoziazione",
        "stato_procedura": "Stato",
        "link_procedura": "Link Sintel",
    }
    colonne_vuote = list(colonne_utili.values())

    data_oggi = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    stati = " OR ".join(f"stato_procedura = '{s}'" for s in STATI_APERTI)

    query_where = (
        f"({stati}) "
        f"AND valore_economico_procedura BETWEEN {min_importo} AND {max_importo} "
        f"AND data_fine_negoziazione > '{data_oggi}' "
        f"AND ({_keyword_clause(KEYWORDS)}) "
        f"AND {_exclude_clause(EXCLUDE_KEYWORDS)}"
    )

    params = {"$where": query_where, "$limit": limit, "$order": "data_fine_negoziazione ASC"}

    try:
        response = requests.get(URL_API, params=params, timeout=90)
        response.raise_for_status()
        gare = response.json()

        if not gare:
            print(
                "Nessuna gara Sintel trovata "
                f"(importo {min_importo}-{max_importo} EUR, keyword, scadenza futura)."
            )
            return pd.DataFrame(columns=colonne_vuote), 0

        print(f"Trovate {len(gare)} potenziali gare Sintel.")

        df = pd.DataFrame(gare)
        colonne_presenti = {k: v for k, v in colonne_utili.items() if k in df.columns}
        df_filtrato = df[list(colonne_presenti.keys())].rename(columns=colonne_presenti)

        if "Scadenza negoziazione" in df_filtrato.columns:
            df_filtrato["Scadenza negoziazione"] = df_filtrato[
                "Scadenza negoziazione"
            ].apply(lambda x: x.split("T")[0] if isinstance(x, str) else x)

        if "Link Sintel" in df_filtrato.columns:
            df_filtrato["Link Sintel"] = df_filtrato["Link Sintel"].apply(
                lambda x: x.get("url") if isinstance(x, dict) else x
            )

        nome_file = SCRIPT_DIR / f"gare_sintel_astro_{datetime.now().strftime('%Y%m%d')}.xlsx"
        df_filtrato.to_excel(nome_file, index=False, engine="openpyxl")

        print(f"Report Sintel: {nome_file}")
        print("\n--- ANTEPRIMA SINTEL ---")
        preview_cols = [
            c
            for c in ("Ente Pubblico", "Oggetto Gara", "Valore procedura (EUR)")
            if c in df_filtrato.columns
        ]
        print(df_filtrato[preview_cols].head(10).to_string(index=False))

        if invia_email:
            invia_email_risultati(df_filtrato, nome_file, len(gare))

        return df_filtrato, len(gare)

    except requests.exceptions.RequestException as e:
        print(f"Errore connessione API Sintel: {e}")
        return pd.DataFrame(columns=colonne_vuote), 0
    except Exception as e:
        print(f"Errore imprevisto Sintel: {e}")
        return pd.DataFrame(columns=colonne_vuote), 0


if __name__ == "__main__":
    print("Suggerimento: per report unificato ed email unica usa cerca_gare_astro.py")
    cerca_gare_sintel()
