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
- [x] Browserabnahme auf iPad/Safari, besonders Notensystem, Touch und Duell – laut Nutzerfreigabe am 03.11.2026 als erledigt bestätigt (nicht von CI automatisiert geprüft).

**Wichtig:** Die beiden großen Dateien enthalten bislang generierten/minifizierten Code. Ihre Auslagerung allein macht die interne Logik noch nicht lesbarer. Ein kosmetisches „Beautifying“ reicht für echte Modularität nicht aus.

## Stufe 2 – Fachlogik aus dem Bundle lösen

- [x] Notenbezeichnung und Oktavlogik (inkl. `f1`/`f¹`/`f4`) nach `src/music/notennamen.mjs` auslagern, mit tatsächlicher Verwendung in `src/app.js`.
- [x] 720 Darstellungsfälle und 3.255 Eingabevarianten gegen die bisherigen Funktionen auf identische Ergebnisse prüfen; zusätzlich unabhängige Unit-Tests und Browser-Smoke-Test.
- [x] Tonhöhenkern (`src/music/tonhoehen.mjs`): diatonische Indizes, Oktavumrechnung, chromatische Halbtonwerte ausgelagert; Vergleich mit der bestehenden Implementierung über 2.581 Fälle ohne Abweichung.
- [ ] Weitere musiktheoretische Berechnungen isolieren.
- [x] Intervallkatalog und Transposition nach `src/music/intervalle.mjs` auslagern; **222.642 Referenzfälle ohne Abweichung**, abhängige Tonhöhenfunktion über ES-Import.
- [x] Tonleiter-Daten (Dur, natürlich/harmonisch/melodisch Moll, Chromatik und Ganztonleitern) und Erzeugungsfunktion nach `src/music/tonleitern.mjs` auslagern; 980 SPN-Eingaben und 1.050 Tonleitererzeugungen mit bisherigem Verhalten verglichen, 0 Unterschiede.
- [x] Akkordfunktionen (`src/music/akkorde.mjs`): Dreiklänge, Umkehrungen, Doppelvorzeichenfilter, Akkordkürzel und vollständige Bezeichnungen ausgelagert; **14.880 Funktionsvergleiche** mit bisherigem Verhalten ohne Abweichung.
- [x] Notenbewertung (`src/music/bewertung.mjs`) auslagern: geordnete Aufgaben, Akkord-Reihenfolge, Mehrfachnoten und enharmonische Gleichheit; 50.020 Referenzfälle ohne Abweichung (PR #8).
- [x] Vier Notennamen-Aufgabengeneratoren nach `src/aufgaben/notennamen.mjs` auslagern: Multiple Choice, Enharmonik, Notensetzen und Texteingabe. **3.200 deterministische Aufgabenvergleiche einschließlich Zufallsfolge ohne Abweichung** (PR #9).
- [x] Vier Intervall-Aufgabengeneratoren inkl. Halb-/Ganztonschritte und Hören nach `src/aufgaben/intervalle.mjs` auslagern; **5.600 deterministische Vergleiche ohne Abweichung** (PR #10).
- [x] Vier Tonleiter-Aufgabengeneratoren nach `src/aufgaben/tonleitern.mjs` auslagern: Dur, Moll, Chromatik und Ganztonleitern; **5.600 deterministische Vergleiche ohne Abweichung** (PR #11).
- [x] Sechs Dreiklang-Aufgabengeneratoren inkl. Umkehrungen, freier Eingabe und Hörakkorden nach `src/aufgaben/akkorde.mjs` auslagern. **8.400 deterministische Aufgabenvergleiche** und **9.800 Antwortprüfungen**, jeweils ohne Abweichung (PR #12).
- [x] Fünf Rhythmusgeneratoren nach `src/aufgaben/rhythmus.mjs` auslagern (Noten-/Pausenwerte, Pausen erkennen, Taktstrich, Triolen): **5.200 deterministische Aufgabenerzeugungen und Zufallsfortsetzungen ohne Abweichung** (PR #13).
- [x] Quintenzirkel und Generalvorzeichen (`src/aufgaben/quintenzirkel-vorzeichen.mjs`) als zwei Generatoren auslagern: **6.000 deterministische Vergleichsfälle und identische Zufallsfortsetzung**, keine Abweichungen (PR #14).
- [ ] Weitere Generatorgruppen und Komponenten aus dem Bundle trennen.

### Inventur der Aufgabengeneratoren (13 Themenbereiche)

Aus den `gens`-Registrierungen in `src/app.js`: **32 Generatorfunktionen**, davon **25 modularisiert** und **7 noch im Bundle**. Die beiden Hörgeneratoren sind bereits in die Intervall- und Akkordmodule übernommen.

| Bereich | Generatoren | Zustand |
| --- | --- | --- |
| Notennamen | 4 | ausgelagert (#9) |
| Halb-/Ganztonschritte | 1 | ausgelagert (#10) |
| Intervalle | 2 | ausgelagert (#10) |
| Dreiklänge | 5 | ausgelagert (#12) |
| Tonleitern | 4 | ausgelagert (#11) |
| Gehörbildung | 2 | ausgelagert (#10, #12) |
| Noten-/Pausenwerte | 5 | ausgelagert (#13) |
| Haupt-/Nebendreiklänge | 2 | offen |
| Weitere Akkorde | 2 | offen |
| Quintenzirkel | 1 | ausgelagert (#14) |
| Vorzeichen lesen | 1 | ausgelagert (#14) |
| Kadenz | 2 | offen |
| Harmonische Analyse | 1 | offen |

**Empfohlene Reihenfolge:** Als Nächstes Haupt-/Nebendreiklänge und weitere Akkorde (vier Generatoren), anschließend Kadenz und Harmonieanalyse (drei). Vor jedem Auslagern Zufallsfolge, Notation, Antwortvalidierung und Browser-Start gegen den bestehenden Code prüfen.

**Hinweis zur Codequalität:** PR #12 verschiebt die sechs bisher kompakten Generatorfunktionskörper in ein eigenes Modul mit benannter Factory und unabhängigen Tests. Der eigentliche Funktionskörper wird noch in einem separaten, rein kosmetisch/refaktorierenden Schritt lesbar formatiert; keine Mischänderungen an der Aufgabenlogik.
- Generatoren und Prüffunktionen separat von der Darstellung abbilden.
- Neue Module zuerst durch Äquivalenztests gegen den vorhandenen Code absichern; dann einzeln an die Oberfläche anbinden.

## Stufe 3 – Oberfläche und Musikduell

- Notensystem-Rendering und Eingabelogik als getrennte Komponenten.
- Musikduell: Aufgabenpool, Fragen-/Zeitverwaltung, Punktelogik und Darstellung voneinander trennen.
- Zwei unabhängig ausgerichtete Notenansichten für die gegenüberliegenden Tischseiten bewahren.
- [x] iPad-/Safari-Abnahme für Querformat, Touch-Eingabe und Duell durch den Nutzer als abgeschlossen gemeldet; erneute Prüfung nach späteren UI-Änderungen erforderlich.

## Stufe 4 – Aufräumen

- Erst nach erfolgreicher Migration ungenutzten Bundle-Code entfernen.
- Abhängigkeiten dokumentieren, Code formatieren, Wartbarkeit verbessern.
- Bei Bedarf Build-System einführen **nur im gesonderten PR**, zusammen mit einer zuverlässigen GitHub-Pages-Veröffentlichung.

## Freigaberegel

Jede Stufe einzeln als PR mit lauffähigen Tests. Keine automatische Übernahme in `main`.
