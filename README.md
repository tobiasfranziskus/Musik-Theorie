# Musiktheorie – Interaktiv & Musikduell

Interaktive Musiktheorie-Übungen in 13 Themenbereichen und ein Tischduell für zwei bis vier Personen. Die Anwendung ist für die statische Veröffentlichung über GitHub Pages ausgelegt und benötigt zur Ausführung keinen Server und kein Build-System.

## Dateien

- `index.html`: schlanker Einstiegspunkt mit Metadaten und Lizenzhinweis.
- `src/app.js`: derzeit der **unveränderte, gebündelte** React-/Anwendungscode aus der ursprünglichen HTML-Datei.
- `src/styles.css`: der **unveränderte, gebündelte** CSS-Code.
- `tests/aufgaben.test.cjs`: Regressionstests für Notennamen, Lösungen, Duell und Dateistruktur.
- `tests/browser-smoke.cjs`: Chrome-Smoke-Test, der die ausgelagerten Assets über einen lokalen HTTP-Server lädt und den tatsächlichen Start der Oberfläche prüft.
- `.github/workflows/aufgaben-regression.yml`: automatische Prüfungen für Pull Requests und `main`.

## Lokal starten

Die Dateien müssen über HTTP bereitgestellt werden, weil `index.html` ein JavaScript-Modul lädt.

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000/` im Browser öffnen.

## Tests

Voraussetzung: Node.js 22 oder neuer. Externe npm-Abhängigkeiten sind nicht erforderlich.

```bash
node --check src/app.js
node --test tests/aufgaben.test.cjs
node tests/browser-smoke.cjs  # Chrome/Chromium auf dem System erforderlich
```

## Wartbarkeit

Die Trennung aus `index.html`, JS und CSS ist **Stufe 1** des Refactorings. Die Datei `src/app.js` ist noch kein lesbar modularisierter Quellcode, sondern der bislang verwendete Bundle-Inhalt. Eine weitere Trennung in Musiktheorie, Aufgabengeneratoren, Auswertung und UI erfolgt schrittweise mit Tests. Siehe [Refactoring-Plan](docs/REFACTORING.md).

Änderungen an Fragen, Notation, Eingaben und Bewertung werden möglichst durch Tests abgesichert. Die öffentliche `main`-Version bleibt bis zur Freigabe eines PR unverändert.
