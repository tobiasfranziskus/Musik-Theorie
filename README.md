# Musiktheorie – Interaktiv & Musikduell

Interaktive Musiktheorie-Übungen in 13 Themenbereichen und ein Tischduell für zwei bis vier Personen. Die Anwendung ist für die statische Veröffentlichung über GitHub Pages ausgelegt und benötigt zur Ausführung keinen Server und kein Build-System.

## Dateien

- `index.html`: schlanker Einstiegspunkt mit Metadaten und Lizenzhinweis.
- `src/app.js`: bestehender React-/Anwendungscode aus dem ursprünglichen Bundle; die Notennamenlogik ruft bereits ein unabhängiges Modul auf.
- `src/styles.css`: unveränderter gebündelter CSS-Code.
- `src/music/notennamen.mjs`: eigenständige, DOM-freie Funktionen für deutsche Notennamen, Vorzeichen und Oktav-Eingaben.
- `src/music/tonhoehen.mjs`: diatonische Indexpositionen und chromatische Tonhöhen als unabhängige Rechenfunktionen.
- `src/music/intervalle.mjs`: der 13-teilige Intervallkatalog und diatonisch korrekt geschriebene Auf-/Abwärtstranspositionen.
- `src/music/tonleitern.mjs`: Dur-/Moll-Tonleitervorlagen und Tonleiterberechnung, inklusive Chromatik und Ganztonleitern.
- `src/music/akkorde.mjs`: Dreiklänge, Umkehrungen, Vorzeichenprüfung und Akkordbezeichnungen.
- `src/music/bewertung.mjs`: eigenständige Bewertung von Noteneingaben (Reihenfolge, enharmonische Gleichheit und Duplikate).
- `src/aufgaben/notennamen.mjs`: vier unabhängige Aufgabengeneratoren für Notennamen (Multiple Choice, Enharmonik, Notensetzen, Texteingabe).
- `src/aufgaben/intervalle.mjs`: vier Generatoren für Halb-/Ganztonschritte, Intervallbildung, Erkennung und Intervallhören.
- `src/aufgaben/tonleitern.mjs`: vier Generatoren für Dur-, Moll-, chromatische und Ganztonleitern.
- `src/aufgaben/akkorde.mjs`: sechs Generatoren für Dreiklänge, Umkehrungen, freie Akkordnamen und Akkordhören.
- `src/aufgaben/rhythmus.mjs`: fünf Generatoren für Notenwerte, Pausen, Taktstrich und Triolen.
- `src/aufgaben/quintenzirkel-vorzeichen.mjs`: Paralleltonarten, Quintenzirkel und Generalvorzeichen erkennen.
- `src/aufgaben/harmoniefunktionen.mjs`: T/S/D, Parallelfunktionen, Funktionen erkennen, Sept- und Sixte-ajoutée-Akkorde; gemeinsamer Dur-Funktionskatalog für die harmonische Analyse.
- `src/aufgaben/kadenz-analyse.mjs`: Kadenzen, Stimmführungsfehler und Harmonische Analyse mit gemeinsam importiertem Dur-Funktionskatalog.
- `src/ui/notensystem.mjs`: zustandslose SVG-Erzeugung für einfache Notensysteme, Klaviersystem und interaktive Noteneingabe, einschließlich der unveränderten Schlüssel-/Notenformen.
- `src/ui/noteneingabe.mjs`: Touch- und Mausklicks über die SVG-Transformationsmatrix in die korrekte Notenposition umrechnen – unabhängig von React.
- `src/duell/spielregeln.mjs`: Spielerinitialisierung, Antwortmischung je Spieler und Punktevergabe (Serien- und Schnelligkeitsbonus) ohne React oder DOM.
- `src/duell/rundensteuerung.mjs`: Rundenzeitberechnung, Antwortaufnahme, vollständige Antwortprüfung und nächster Fragenindex, ohne Browser-Timer und React.
- `src/duell/aufgabenpool.mjs`: Fragenpool mit Themenfilter, Aufgaben-Konvertierung, Duplikatschutz, Notensystem-SVG und Ersatzfragen unabhängig von React.
- `src/duell/timer.mjs`: echte Rundenuhr mit 100-ms-Browser-Intervall, Zeitfortschritt, selbständigem Zeitablauf-Abbruch und in Tests austauschbarer Uhr.
- `tests/aufgaben.test.cjs`: Regressionstests für Aufgaben, Duell und Dateistruktur unter Verwendung des echten Notennamen-Moduls.
- `tests/notennamen.test.mjs`: direkte Unit-Tests für Notennamen und Eingaben.
- `tests/tonhoehen.test.mjs`: direkte Unit-Tests für diatonische und chromatische Tonhöhen.
- `tests/intervalle.test.mjs`: Intervallnamen, enharmonische Schreibweisen und Abwärtstransposition.
- `tests/tonleitern.test.mjs`: Tonleiter-Vorlagen, Halbtonabstände und Vorzeichen.
- `tests/akkorde.test.mjs`: Dur/Moll/verminderte/übermäßige Dreiklänge, Umkehrungen und Akkordnamen.
- `tests/bewertung.test.mjs`: Regressionstests für die Bewertung geordneter und gestapelter Noten.
- `tests/notennamen-generatoren.test.mjs`: direkte Tests aller vier Notennamen-Generatoren einschließlich `f1`.
- `tests/intervall-generatoren.test.mjs`: Intervall-Aufgabengeneratoren und Hörintervalle.
- `tests/tonleiter-generatoren.test.mjs`: Vier Tonleiter-Aufgabentypen, Mollvarianten und Oktavlagen.
- `tests/akkord-generatoren.test.mjs`: sechs Akkordgeneratoren, Umkehrungen und freie Akkordnamen.
- `tests/rhythmus-generatoren.test.mjs`: alle fünf Rhythmusaufgabentypen samt Taktangaben und Triolen.
- `tests/quintenzirkel-vorzeichen.test.mjs`: Quintenzirkel, Generalvorzeichen, Paralleltonarten und Schlüsselwahl.
- `tests/harmoniefunktionen-generatoren.test.mjs`: Haupt-/Nebenfunktionen, Dreiklänge, Umkehrungen und Vierklänge.
- `tests/kadenz-analyse.test.mjs`: Kadenzen, Stimmführung, Stimmenverteilung im Klaviersystem und harmonische Analyse.
- `tests/notensystem-renderer.test.mjs`: 14 Referenzdarstellungen mit vollständigen SVG-Prüfsummen, darunter drei Schlüssel, Vorzeichen, Triolen, Noteneingabe und Klaviersystem.
- `tests/noteneingabe-touch.test.mjs`: SVG-Touchkoordinaten, drei Schlüssel, Eingabegrenzen, Vorzeichen, Skalierung und 180°-Drehung.
- `tests/duell-spielregeln.test.mjs`: zwei bis vier Spieler, individuelle Antwortreihenfolge, Serienbonus, Schnellstenbonus und neue Runden.
- `tests/duell-rundensteuerung.test.mjs`: Rundenende durch Zeitablauf oder letzte Antwort, zeitgestempelte Spielerantworten und Fragenwechsel.
- `tests/duell-aufgabenpool.test.mjs`: Themenfilter, Duplikate, Hörübungen ausschließen, Rendering und Fallback-Logik.
- `tests/duell-timer.test.mjs`: Intervallstart, Fortschrittswerte, Ablauf-Reihenfolge und ID-Rückgabe für mehrere Rundenuhren.
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
node --check src/music/tonleitern.mjs
node --check src/music/akkorde.mjs
node --check src/music/bewertung.mjs
node --check src/aufgaben/notennamen.mjs
node --check src/aufgaben/intervalle.mjs
node --check src/aufgaben/tonleitern.mjs
node --check src/aufgaben/akkorde.mjs
node --check src/aufgaben/rhythmus.mjs
node --check src/aufgaben/quintenzirkel-vorzeichen.mjs
node --check src/aufgaben/harmoniefunktionen.mjs
node --check src/aufgaben/kadenz-analyse.mjs
node --check src/ui/notensystem.mjs
node --check src/ui/noteneingabe.mjs
node --check src/duell/spielregeln.mjs
node --check src/duell/rundensteuerung.mjs
node --check src/duell/aufgabenpool.mjs
node --check src/duell/timer.mjs
node --test tests/*.test.*
node tests/browser-smoke.cjs  # Chrome/Chromium auf dem System erforderlich
```

## Wartbarkeit

**Stufe 1 und die fachlichen Teilmodule von Stufe 2 sind in `main` integriert.** Auf den gestapelten, noch nicht integrierten Draft-PRs #8–#16 folgen die Bewertungslogik und alle 32 Aufgabengeneratoren. PR #17 trennt zusätzlich die SVG-Notensystem-Erzeugung aus dem verbleibenden React-Bundle. PR #18 isoliert die Positionsberechnung für Touch und Maus. PR #19 modularisiert die reinen Duellregeln für Spieler, Antwortoptionen und Punkte. PR #20 trennt zudem Rundenzeitberechnung, Antwortaufnahme und Fragenwechsel vom React-Bundle. Duellsteuerung, Eingabeverwaltung und Teile der Oberfläche in `src/app.js` sind weiterhin gebündelt/minifiziert. Siehe [Refactoring-Plan](docs/REFACTORING.md).

Änderungen an Fragen, Notation, Eingaben und Bewertung werden möglichst durch Tests abgesichert. Die öffentliche `main`-Version bleibt bis zur Freigabe eines PR unverändert.
