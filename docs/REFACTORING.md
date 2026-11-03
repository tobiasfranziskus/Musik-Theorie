# Refactoring-Plan

## Ziel

Die Musiktheorie-Anwendung soll verständlich, modular und zuverlässig testbar werden. **Keine sichtbaren, spielerischen oder musiktheoretischen Verhaltensänderungen** während eines reinen Refactorings. Die `index.html` bleibt als Einstiegspunkt von GitHub Pages erhalten.

## Stufe 1 – Auslieferung entkoppeln (PR #2)

- [x] Gebündelten JS-Inhalt unverändert nach `src/app.js` verschieben.
- [x] CSS unverändert nach `src/styles.css` verschieben.
- [x] Beide Assets mit relativen URLs aus der `index.html` laden; korrekt unter GitHub Pages mit Repository-Unterpfad.
- [x] Bestehende Aufgabentests auf die neue Dateistruktur umstellen.
- [x] Syntaxprüfung, CI und Dokumentation ergänzen.
- [x] Chrome-Smoke-Test mit echten JS- und CSS-Dateien durchführen.
- [ ] Browserabnahme auf iPad/Safari, besonders Notensystem, Touch und Duell.

**Wichtig:** Die beiden großen Dateien enthalten bislang generierten/minifizierten Code. Ihre Auslagerung allein macht die interne Logik noch nicht lesbarer. Ein kosmetisches „Beautifying“ reicht für echte Modularität nicht aus.

## Stufe 2 – Fachlogik aus dem Bundle lösen

- [x] Notenbezeichnung und Oktavlogik (inkl. `f1`/`f¹`/`f4`) nach `src/music/notennamen.mjs` auslagern, mit tatsächlicher Verwendung in `src/app.js`.
- [x] 720 Darstellungsfälle und 3.255 Eingabevarianten gegen die bisherigen Funktionen auf identische Ergebnisse prüfen; zusätzlich unabhängige Unit-Tests und Browser-Smoke-Test.
- [x] Tonhöhenkern (`src/music/tonhoehen.mjs`): diatonische Indizes, Oktavumrechnung, chromatische Halbtonwerte ausgelagert; Vergleich mit der bestehenden Implementierung über 2.581 Fälle ohne Abweichung.
- [ ] Weitere musiktheoretische Berechnungen isolieren.
- [ ] Intervalle, Tonleitern, Akkorde und weitere Berechnungen in eigenständig testbare Module überführen.
- Generatoren und Prüffunktionen separat von der Darstellung abbilden.
- Neue Module zuerst durch Äquivalenztests gegen den vorhandenen Code absichern; dann einzeln an die Oberfläche anbinden.

## Stufe 3 – Oberfläche und Musikduell

- Notensystem-Rendering und Eingabelogik als getrennte Komponenten.
- Musikduell: Aufgabenpool, Fragen-/Zeitverwaltung, Punktelogik und Darstellung voneinander trennen.
- Zwei unabhängig ausgerichtete Notenansichten für die gegenüberliegenden Tischseiten bewahren.
- Auf iPad Safari: Querformat, Touch-Eingabe, kleine Displays und Spielablauf manuell prüfen.

## Stufe 4 – Aufräumen

- Erst nach erfolgreicher Migration ungenutzten Bundle-Code entfernen.
- Abhängigkeiten dokumentieren, Code formatieren, Wartbarkeit verbessern.
- Bei Bedarf Build-System einführen **nur im gesonderten PR**, zusammen mit einer zuverlässigen GitHub-Pages-Veröffentlichung.

## Freigaberegel

Jede Stufe einzeln als PR mit lauffähigen Tests. Keine automatische Übernahme in `main`.
