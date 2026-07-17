# Backup giornaliero e ripristino

Questo progetto usa backup Git automatici con commit giornalieri.

## Commit automatico

Lo script `daily_backup.bat` crea commit con messaggio:

`Backup automatico - YYYY-MM-DD HH:mm:ss`

## Come tornare a un backup specifico

1. Trova il commit desiderato:

```bash
git log --oneline --decorate --grep="Backup automatico"
```

2. Anteprima senza cambiare branch:

```bash
git checkout <COMMIT_HASH> -- .
```

3. Oppure spostati direttamente su quel punto storico:

```bash
git checkout <COMMIT_HASH>
```

## Ripristino di una data/ora specifica (es. backup delle 18:00)

Puoi filtrare per data:

```bash
git log --since="2026-04-28 17:55" --until="2026-04-28 18:10" --oneline
```

Poi usa l'hash trovato con uno dei comandi di checkout sopra.

## Nota sicurezza

Prima di un ripristino completo, salva eventuali modifiche locali:

```bash
git add .
git commit -m "Checkpoint prima del ripristino"
```
