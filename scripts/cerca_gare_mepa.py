"""
Monitoraggio bandi MePA / Acquisti in Rete PA (vetrina pubblica).

Interroga l'API pubblica della vetrina bandi (senza login SPID):
  - RDO APERTE: richieste di offerta MePA visibili a tutti gli OE
  - ALTRI BANDI: gare pubblicate da stazioni appaltanti

Documentazione portale:
  https://www.acquistinretepa.it/opencms/opencms/vetrina_bandi.html?filter=RDO

Nota tecnica: la pagina web è AngularJS; i dati arrivano via POST JSON su
/publicservices/vetrineservices/getAltriBandiRdoAperte . Il filtro testuale
del portale (campo idt) accetta soprattutto numeri bando/RDO: le keyword
Astro vengono quindi applicate lato script su titolo/descrizione/categorie.

Dipendenze: pip install -r scripts/requirements-gare.txt
Automazione / email unificata: scripts/cerca_gare_astro.py
"""

from __future__ import annotations

import os
import smtplib
import sys
from datetime import datetime
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

import pandas as pd
import requests
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))
load_dotenv(SCRIPT_DIR / ".env")

from keywords_astro import EXCLUDE_KEYWORDS, KEYWORDS, MAX_IMPORTO, MIN_IMPORTO

BASE_URL = "https://www.acquistinretepa.it"
VETRINA_URL = f"{BASE_URL}/opencms/opencms/vetrina_bandi.html"
API_RDO_AB = f"{BASE_URL}/publicservices/vetrineservices/getAltriBandiRdoAperte"

HTTP_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; AstroForniture-Monitor/1.0)",
    "Accept": "application/json",
    "Content-Type": "application/json",
}

# Tipi di vetrina da monitorare
VETRINA_RDO = {"label": "RDO APERTE", "id": 1, "totale": 1, "tipo": "RDO aperte"}
VETRINA_ALTRI = {"label": "ALTRI BANDI", "id": 5, "totale": 5, "tipo": "Altri bandi"}


def _testo_gara(item: dict[str, Any]) -> str:
    parts = [
        item.get("titoloBando"),
        item.get("descrizioneBando"),
        item.get("riassuntoBando"),
        item.get("descrizioneEnte"),
        item.get("enteCommittente"),
        item.get("stazioneAppaltante"),
        item.get("categoriaPortale"),
    ]
    cats = item.get("categorieMerceologiche") or item.get("categoria") or []
    if isinstance(cats, list):
        parts.extend(str(c) for c in cats)
    return " ".join(str(p) for p in parts if p).lower()


def _match_keywords(text: str) -> bool:
    return any(kw in text for kw in KEYWORDS)


def _has_excluded(text: str) -> bool:
    return any(kw in text for kw in EXCLUDE_KEYWORDS)


def _parse_importo(valore: Any) -> float | None:
    if valore is None or valore == "":
        return None
    testo = str(valore).strip()
    try:
        return float(testo)
    except ValueError:
        pass
    try:
        return float(testo.replace(".", "").replace(",", "."))
    except ValueError:
        return None


def _scadenza_futura(value: Any) -> bool:
    if value in (None, ""):
        return True
    try:
        ms = int(value)
        return ms > int(datetime.now().timestamp() * 1000)
    except (TypeError, ValueError):
        return True


def _parse_data_ms(value: Any) -> str:
    if value in (None, ""):
        return ""
    try:
        ms = int(value)
        return datetime.fromtimestamp(ms / 1000).strftime("%Y-%m-%d")
    except (TypeError, ValueError, OSError):
        return str(value)


def _link_scheda(item: dict[str, Any]) -> str:
    id_bando = item.get("idBando")
    if id_bando:
        return f"{BASE_URL}/opencms/opencms/scheda_altri_bandi.html?idBando={id_bando}"
    numero = item.get("numeroRdo") or item.get("numeroBando")
    return f"{VETRINA_URL}?filter=RDO" + (f"#{numero}" if numero else "")


def _fetch_pagina(
    strumento: dict[str, Any],
    pagina: int,
    item_pagina: int = 100,
) -> dict[str, Any]:
    payload = {
        "isArchive": False,
        "strumento": [
            {
                "label": strumento["label"],
                "id": strumento["id"],
                "totale": strumento["totale"],
            }
        ],
        "categoria": [],
        "tempo": {"dataDa": None, "dataA": None},
        "paginazione": {"pagina": pagina, "itemPagina": item_pagina},
        "orderBy": {"campo": "dataPubblicazione", "verso": "desc"},
        "idt": "",
    }
    response = requests.post(API_RDO_AB, headers=HTTP_HEADERS, json=payload, timeout=90)
    response.raise_for_status()
    data = response.json()
    if data.get("result", {}).get("exitCode") != "200":
        raise RuntimeError(
            f"API MePA errore: {data.get('result', {}).get('text', data)}"
        )
    return data


def scarica_vetrina(
    strumento: dict[str, Any],
    max_pagine: int = 30,
    item_pagina: int = 100,
) -> list[dict[str, Any]]:
    risultati: list[dict[str, Any]] = []
    for pagina in range(1, max_pagine + 1):
        data = _fetch_pagina(strumento, pagina, item_pagina)
        batch = (data.get("payload") or {}).get("elencoBandi") or []
        if not batch:
            break
        risultati.extend(batch)
        if len(batch) < item_pagina:
            break
    return risultati


def filtra_gare(
    items: list[dict[str, Any]],
    min_importo: float = MIN_IMPORTO,
    max_importo: float = MAX_IMPORTO,
) -> list[dict[str, Any]]:
    filtrate: list[dict[str, Any]] = []
    visti: set[str] = set()

    for item in items:
        if not _scadenza_futura(item.get("dataScadenzaBando")):
            continue

        testo = _testo_gara(item)
        if not _match_keywords(testo) or _has_excluded(testo):
            continue

        importo = _parse_importo(item.get("valore"))
        if importo is not None and not (min_importo <= importo <= max_importo):
            continue

        chiave = str(item.get("numeroRdo") or item.get("numeroBando") or item.get("idBando"))
        if chiave in visti:
            continue
        visti.add(chiave)
        filtrate.append(item)

    return filtrate


def normalizza_righe(items: list[dict[str, Any]], tipo_vetrina: str) -> pd.DataFrame:
    rows = []
    for item in items:
        rows.append(
            {
                "Tipo": tipo_vetrina,
                "N. RDO/Bando": item.get("numeroRdo") or item.get("numeroBando"),
                "Ente": item.get("descrizioneEnte") or item.get("enteCommittante"),
                "Oggetto": item.get("titoloBando"),
                "Valore (EUR)": _parse_importo(item.get("valore")),
                "Scadenza": _parse_data_ms(item.get("dataScadenzaBando")),
                "Stato": item.get("statoBando"),
                "Strumento": item.get("strumento"),
                "Link MePA": _link_scheda(item),
            }
        )
    return pd.DataFrame(rows)


def _email_configurata() -> bool:
    required = ("SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_TO")
    return all(os.getenv(k, "").strip() for k in required)


def invia_email_risultati(df: pd.DataFrame, allegato: Path, num_gare: int) -> None:
    if not _email_configurata():
        print(
            "Email non inviata: configura SMTP in "
            f"{SCRIPT_DIR / '.env'} (vedi .env.example)."
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
    oggetto = f"[Astro Forniture] {num_gare} bandi MePA trovati – {oggi}"
    tabella_html = df.to_html(index=False, escape=True, border=1)
    corpo_html = f"""\
<html><body>
  <p>Monitoraggio MePA (Acquisti in Rete PA): <strong>{num_gare}</strong> opportunità.</p>
  {tabella_html}
  <p>Report Excel in allegato.</p>
</body></html>
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

    server_cls = smtplib.SMTP_SSL if use_ssl else smtplib.SMTP
    with server_cls(host, port, timeout=30) as server:
        if not use_ssl and os.getenv("SMTP_USE_TLS", "true").lower() in ("1", "true", "yes"):
            server.starttls()
        server.login(user, password)
        server.sendmail(mittente, destinatari, msg.as_string())
    print(f"Email inviata a: {', '.join(destinatari)}")


def cerca_gare_mepa(
    min_importo: float = MIN_IMPORTO,
    max_importo: float = MAX_IMPORTO,
    invia_email: bool = False,
) -> tuple[pd.DataFrame, int]:
    print("Avvio monitoraggio bandi MePA (Acquisti in Rete PA)...")

    colonne_vuote = [
        "Tipo",
        "N. RDO/Bando",
        "Ente",
        "Oggetto",
        "Valore (EUR)",
        "Scadenza",
        "Stato",
        "Strumento",
        "Link MePA",
    ]

    try:
        raw_rdo = scarica_vetrina(VETRINA_RDO)
        raw_altri = scarica_vetrina(VETRINA_ALTRI)
        print(f"Scaricate {len(raw_rdo)} RDO aperte e {len(raw_altri)} altri bandi (grezzi).")

        match_rdo = filtra_gare(raw_rdo, min_importo, max_importo)
        match_altri = filtra_gare(raw_altri, min_importo, max_importo)
        totale = len(match_rdo) + len(match_altri)

        if totale == 0:
            print(
                f"Nessun bando MePA trovato (importo {min_importo}-{max_importo} EUR, keyword Astro)."
            )
            return pd.DataFrame(columns=colonne_vuote), 0

        df = pd.concat(
            [
                normalizza_righe(match_rdo, "RDO aperte"),
                normalizza_righe(match_altri, "Altri bandi"),
            ],
            ignore_index=True,
        )

        nome_file = SCRIPT_DIR / f"gare_mepa_astro_{datetime.now().strftime('%Y%m%d')}.xlsx"
        df.to_excel(nome_file, index=False, engine="openpyxl")

        print(f"Trovati {totale} bandi MePA pertinenti.")
        print(f"Report MePA: {nome_file}")
        print("\n--- ANTEPRIMA MEPA ---")
        preview = [c for c in ("Tipo", "Ente", "Oggetto", "Valore (EUR)") if c in df.columns]
        print(df[preview].head(15).to_string(index=False))

        if invia_email:
            invia_email_risultati(df, nome_file, totale)

        return df, totale

    except requests.exceptions.RequestException as exc:
        print(f"Errore connessione API MePA: {exc}")
        return pd.DataFrame(columns=colonne_vuote), 0
    except Exception as exc:
        print(f"Errore imprevisto MePA: {exc}")
        return pd.DataFrame(columns=colonne_vuote), 0


# ---------------------------------------------------------------------------
# Fallback Playwright (opzionale)
# ---------------------------------------------------------------------------
# Se l'API pubblica cambiasse, vedi commento in cerca_gare_mepa.py (versione precedente).


if __name__ == "__main__":
    print("Suggerimento: per report unificato ed email unica usa cerca_gare_astro.py")
    cerca_gare_mepa()
