"""Configurazione definitiva monitoraggio gare Astro Forniture (Sintel + MePA)."""

CONFIG_VERSION = "1.0"

MIN_IMPORTO = 400
MAX_IMPORTO = 150_000

KEYWORDS = [
    # Ufficio / cancelleria
    "cancelleria",
    "ufficio",
    "carta per fotocopie",
    "carta a4",
    "risme",
    "carte termiche",
    "toner",
    "cartucce",
    "faldoni",
    "scrittoio",
    "rotoli pos",
    "rotoli cassa",
    "agenda",
    "raccoglitore",
    "stampanti",
    "etichettatrice",
    "nastro",
    "elastici",
    "buste forate",
    "timbro",
    "timbri",
    # Linea medicale
    "sfigmomanometro",
    "stetoscopio",
    "pulsossimetro",
    "termometro",
    "letto da degenza",
    "poltrona per prelievi",
    "carrello sanitario",
    "lampada scialitica",
    "rianimazione",
    "defibrillatore",
    "dae",
    "barella",
    "forbici chirurgiche",
    "pinza emostatica",
    "guanti in nitrile",
    "garze",
    "siringhe",
    "medicazione",
    "ghiaccio",
    "monouso",
    "elettrocardiografo",
    "aspiratore chirurgico",
    "dispositivi medici",
    "materiale sanitario",
]

EXCLUDE_KEYWORDS = [
    "rifiuti",
    "raccolta differenziata",
    "smaltimento",
    "distruzione documenti",
]
