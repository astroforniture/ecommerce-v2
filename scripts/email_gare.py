"""Invio email condiviso per i monitoraggi gare Astro Forniture."""

from __future__ import annotations

import os
import smtplib
from datetime import datetime
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

import pandas as pd

from keywords_astro import MAX_IMPORTO


def email_configurata() -> bool:
    required = ("SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_TO")
    return all(os.getenv(k, "").strip() for k in required)


def invia_report_unificato(
    df_sintel: pd.DataFrame,
    df_mepa: pd.DataFrame,
    allegato: Path,
    n_sintel: int,
    n_mepa: int,
    env_path: Path,
) -> None:
    if not email_configurata():
        print(
            "Email non inviata: configura SMTP in "
            f"{env_path} (vedi .env.example)."
        )
        return

    host = os.environ["SMTP_HOST"]
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    password = os.environ["SMTP_PASSWORD"]
    destinatari = [e.strip() for e in os.environ["EMAIL_TO"].split(",") if e.strip()]
    mittente = os.getenv("EMAIL_FROM", user).strip()
    use_ssl = port == 465 or os.getenv("SMTP_USE_SSL", "").lower() in ("1", "true", "yes")

    totale = n_sintel + n_mepa
    oggi = datetime.now().strftime("%d/%m/%Y")
    oggetto = (
        f"[Astro Forniture] Report gare {oggi} – "
        f"{n_sintel} Sintel, {n_mepa} MePA ({totale} totali)"
    )

    if totale == 0:
        riepilogo = (
            "<p>Nessuna gara trovata oggi con i criteri configurati "
            f"(budget fino a {MAX_IMPORTO:,.0f} EUR).</p>"
        )
    else:
        riepilogo = (
            f"<p><strong>{n_sintel}</strong> gare Sintel (Lombardia) e "
            f"<strong>{n_mepa}</strong> bandi MePA (Acquisti in Rete PA).</p>"
        )

    sezioni = []
    if n_sintel:
        sezioni.append("<h3>Sintel – Lombardia</h3>" + df_sintel.head(20).to_html(index=False, escape=True, border=1))
    if n_mepa:
        sezioni.append("<h3>MePA – Acquisti in Rete PA</h3>" + df_mepa.head(20).to_html(index=False, escape=True, border=1))

    corpo_html = f"""\
<html><body>
  <p>Ciao,</p>
  <p>Ecco il report unificato del monitoraggio gare Astro Forniture.</p>
  {riepilogo}
  {''.join(sezioni)}
  <p>Report Excel completo in allegato (fogli <em>Sintel</em> e <em>MePA</em>).</p>
  <p><em>Generato automaticamente da cerca_gare_astro.py</em></p>
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

    try:
        server_cls = smtplib.SMTP_SSL if use_ssl else smtplib.SMTP
        with server_cls(host, port, timeout=30) as server:
            if not use_ssl and os.getenv("SMTP_USE_TLS", "true").lower() in ("1", "true", "yes"):
                server.starttls()
            server.login(user, password)
            server.sendmail(mittente, destinatari, msg.as_string())
        print(f"Email unificata inviata a: {', '.join(destinatari)}")
    except smtplib.SMTPException as exc:
        print(f"Errore invio email: {exc}")
