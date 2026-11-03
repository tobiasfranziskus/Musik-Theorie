# Musiktheorie – Interaktiv & Musikduell

Interaktive Musiktheorie-Übungen in 13 Themenbereichen und ein Tischduell für zwei bis vier Personen. Die Anwendung ist für die statische Veröffentlichung über GitHub Pages ausgelegt und benötigt zur Ausführung keinen Server und kein Build-System.

## Dateien

- `index.html`: schlanker Einstiegspunkt mit Metadaten und Lizenzhinweis.
- `src/app.js`: bestehender React-/Anwendungscode aus dem ursprünglichen Bundle; die Notennamenlogik ruft bereits ein unabhängiges Modul auf.
- `src/styles.css`: unveränderter gebündelter CSS-Code.
- `src/music/notennamen.mjs`: eigenständige, DOM-freie Funktionen für deutsche Notennamen, Vorzeichen und Oktav-Eingaben.
- `src/music/tonhoehen.mjs`: diatonische Indexpositionen und chromatische Tonhöhen als unabhängige Rechenfunktionen.
- `src/music/intervalle.mjs`: der 13-teilige Intervallkatalog und diatonisch korrekt geschriebene Auf-/Abwärtstranspositionen.
- `tests/aufgaben.test.cjs`: Regressionstests für Aufgaben, Duell und Dateistruktur unter Verwendung des echten Notennamen-Moduls.
- `tests/notennamen.test.mjs`: direkte Unit-Tests für Notennamen und Eingaben.
- `tests/tonhoehen.test.mjs`: direkte Unit-Tests für diatonische und chromatische Tonhöhen.
- `tests/intervalle.test.mjs`: Intervallnamen, enharmonische Schreibweisen und Abwärtstransposition.
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
node --check src/music/notennamen.mjs
node --check src/music/tonhoehen.mjs
node --check src/music/intervalle.mjs
node --test tests/*.test.*
node tests/browser-smoke.cjs  # Chrome/Chromium auf dem System erforderlich
```

## Wartbarkeit

Die Trennung aus `index.html`, JS und CSS ist **Stufe 1** des Refactorings. In **Stufe 2** werden zuerst deutsche Notennamen/Oktaven aus `src/app.js` in ein eigenständig testbares ES-Modul ausgelagert. Der übrige Code in `src/app.js` bleibt vorerst ein gebündelter/minifizierter Quellstand. Eine weitere Trennung in Musiktheorie, Aufgabengeneratoren, Auswertung und UI erfolgt schrittweise mit Tests. Siehe [Refactoring-Plan](docs/REFACTORING.md).

Änderungen an Fragen, Notation, Eingaben und Bewertung werden möglichst durch Tests abgesichert. Die öffentliche `main`-Version bleibt bis zur Freigabe eines PR unverändert.
