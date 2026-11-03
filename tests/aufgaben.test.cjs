'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

// Wir prüfen weiterhin die tatsächlich ausgelieferten Generatoren im Bundle
// und nicht eine getrennte, möglicherweise abweichende Nachimplementierung.
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bundle = fs.readFileSync(path.join(root, 'src', 'app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'styles.css'), 'utf8');
const begin = bundle.indexOf('y={c:0,d:1,e:2,f:3,g:4,a:5,h:6}');
const end = bundle.indexOf('var en=', begin);

assert.ok(begin !== -1 && end > begin, 'Aufgabengeneratoren im Bundle auffindbar');
let M, N, Qt, Et, ye;

test.before(async () => {
  // Echte ESM-Implementierung laden und in die unveränderte Generator-Sammlung
  // einspeisen. Der Test prüft damit dieselben Funktionen wie der Browser.
  const url = pathToFileURL(path.join(root, 'src', 'music', 'notennamen.mjs')).href;
  const { formatGermanNote, parseGermanNoteInput } = await import(url);
  const pitchUrl = pathToFileURL(path.join(root, 'src', 'music', 'tonhoehen.mjs')).href;
  const { diatonicIndex, noteFromDiatonicIndex, chromaticPitch } = await import(pitchUrl);
  const intervalUrl = pathToFileURL(path.join(root, 'src', 'music', 'intervalle.mjs')).href;
  const { INTERVALS, transposeDiatonic } = await import(intervalUrl);
  const scalesUrl = pathToFileURL(path.join(root, 'src', 'music', 'tonleitern.mjs')).href;
  const scales = await import(scalesUrl);
  const chordsUrl = pathToFileURL(path.join(root, 'src', 'music', 'akkorde.mjs')).href;
  const chords = await import(chordsUrl);
  const gradingUrl = pathToFileURL(path.join(root, 'src', 'music', 'bewertung.mjs')).href;
  const { gradeWrittenNotes } = await import(gradingUrl);
  const nameTasksUrl = pathToFileURL(path.join(root, 'src', 'aufgaben', 'notennamen.mjs')).href;
  const { createNoteNameTaskGenerators } = await import(nameTasksUrl);
  const intervalTaskUrl = pathToFileURL(path.join(root, 'src', 'aufgaben', 'intervalle.mjs')).href;
  const { createIntervalTaskGenerators } = await import(intervalTaskUrl);
  const scaleTaskUrl = pathToFileURL(path.join(root, 'src', 'aufgaben', 'tonleitern.mjs')).href;
  const { createScaleTaskGenerators } = await import(scaleTaskUrl);
  const chordTaskUrl = pathToFileURL(path.join(root, 'src', 'aufgaben', 'akkorde.mjs')).href;
  const { createChordTaskGenerators } = await import(chordTaskUrl);
  const rhythmTaskUrl = pathToFileURL(path.join(root, 'src', 'aufgaben', 'rhythmus.mjs')).href;
  const { createRhythmTaskGenerators } = await import(rhythmTaskUrl);
  const keyTasksUrl = pathToFileURL(path.join(root, 'src', 'aufgaben', 'quintenzirkel-vorzeichen.mjs')).href;
  const { createKeySignatureTaskGenerators } = await import(keyTasksUrl);
  const harmonyTasksUrl = pathToFileURL(path.join(root, 'src', 'aufgaben', 'harmoniefunktionen.mjs')).href;
  const { MAJOR_FUNCTIONS, createHarmonyTaskGenerators } = await import(harmonyTasksUrl);
  const chordExports = [
    'buildTriad', 'invertChord', 'hasSimpleAccidentals',
    'chordSymbol', 'chordDescription',
  ];
  const scaleExports = [
    'MAJOR_KEYS', 'MINOR_KEYS', 'MAJOR_STEPS', 'NATURAL_MINOR_STEPS',
    'HARMONIC_MINOR_STEPS', 'MELODIC_MINOR_STEPS', 'CHROMATIC_SCALES',
    'WHOLE_TONE_SCALES', 'scaleFromSemitones', 'parseCompactPitch',
  ];
  ({ M, N, Qt, Et, ye } = Function(
    'formatGermanNote', 'parseGermanNoteInput',
    'diatonicIndex', 'noteFromDiatonicIndex', 'chromaticPitch',
    'INTERVALS', 'transposeDiatonic', ...scaleExports, ...chordExports, 'gradeWrittenNotes',
    'createNoteNameTaskGenerators', 'createIntervalTaskGenerators', 'createScaleTaskGenerators',
    'createChordTaskGenerators', 'createRhythmTaskGenerators',
    'createKeySignatureTaskGenerators', 'MAJOR_FUNCTIONS', 'createHarmonyTaskGenerators',
    'var ' + bundle.slice(begin, end) + ';return {M,N,Qt,Et,ye};'
  )(formatGermanNote, parseGermanNoteInput, diatonicIndex, noteFromDiatonicIndex, chromaticPitch,
    INTERVALS, transposeDiatonic, ...scaleExports.map(name => scales[name]),
    ...chordExports.map(name => chords[name]), gradeWrittenNotes,
    createNoteNameTaskGenerators, createIntervalTaskGenerators, createScaleTaskGenerators,
    createChordTaskGenerators, createRhythmTaskGenerators, createKeySignatureTaskGenerators,
    MAJOR_FUNCTIONS, createHarmonyTaskGenerators));
});

test('Notennamen: f1, f¹ und f4 sind als f¹ gültig', () => {
  const parsed = ye('f1');
  assert.ok(parsed.some(note => note.name === 'f' && note.octave === 4));
  let checked = 0;
  for (let i = 0; i < 5000; i++) {
    const task = N('mixed');
    const note = task.staff.notes[0];
    if (note.name === 'f' && note.octave === 4 && !note.accidental) {
      checked++;
      assert.equal(task.checkFn('f1'), true, task.explanation);
      assert.equal(task.checkFn('f¹'), true, task.explanation);
      assert.equal(task.checkFn('f4'), true, task.explanation);
    }
  }
  assert.ok(checked >= 10, 'Genügend f¹-Aufgaben generiert');
});

test('Musikduell verrät nicht die Antwort beim Notensetzen', () => {
  for (let i = 0; i < 200; i++) {
    const task = M('mixed');
    assert.match(task.q, /^Setze die Note /u);
    assert.equal(Qt(M, task), null, 'Notensetzaufgabe darf nicht als verräterische Multiple Choice erscheinen');
  }
});

test('Korrekte Textlösungen werden akzeptiert', () => {
  for (let i = 0; i < 2000; i++) {
    const task = N('mixed');
    assert.equal(task.checkFn(task.correctDisplay), true, task.explanation);
  }
});

test('Multiple-Choice-Indizes der Aufgaben sind gültig', () => {
  assert.equal(Et.length, 13);
  let checked = 0;
  for (const section of Et) {
    for (const generator of section.gens) {
      for (let i = 0; i < 50; i++) {
        const task = generator('mixed');
        if (task.mode !== 'mc') continue;
        checked++;
        assert.ok(Array.isArray(task.options) && task.options.length > 1, section.id);
        assert.ok(Number.isInteger(task.correct), section.id);
        assert.ok(task.correct >= 0 && task.correct < task.options.length, section.id);
      }
    }
  }
  assert.ok(checked > 100, 'Ausreichend MC-Aufgaben geprüft');
});

test('Falsche Texteingabe wird in der Rückmeldung gezeigt', () => {
  assert.ok(bundle.includes('Deine Eingabe: ${_e.trim()}. ${N.explanation}'));
});


test('Musikduell zeigt zwei unabhängig ausgerichtete Kopien desselben Notensystems', () => {
  const topCall = 'le.svgHtml?duelNotationForSide(le.svgHtml,!0):null';
  const bottomCall = 'le.svgHtml?duelNotationForSide(le.svgHtml,!1):null';
  assert.equal(bundle.split(topCall).length - 1, 1, 'eine Notendarstellung für die obere Tischseite');
  assert.equal(bundle.split(bottomCall).length - 1, 1, 'eine Notendarstellung für die untere Tischseite');
  assert.ok(bundle.indexOf(topCall) < bundle.indexOf(bottomCall), 'Noten stehen an der jeweils richtigen Seite');
  const begin = bundle.indexOf('function duelNotationForSide(');
  const end = bundle.indexOf('function de(e,t)', begin);
  assert.ok(begin >= 0 && end > begin, 'Notensystem-Renderer im Bundle vorhanden');
  const jsx = { jsx: (tag, props) => ({ tag, props }) };
  const render = Function('I', bundle.slice(begin, end) + ';return duelNotationForSide;')(jsx);
  const svg = '<svg><text>f¹</text></svg>';
  const top = render(svg, true);
  const bottom = render(svg, false);
  assert.equal(top.props.children.props.style.rotate, '180deg');
  assert.equal(bottom.props.children.props.style.rotate, '0deg');
  assert.equal(top.props.children.props.dangerouslySetInnerHTML.__html, svg);
  assert.equal(bottom.props.children.props.dangerouslySetInnerHTML.__html, svg);
  assert.match(styles, /\.duel-score-svg>svg\{[^}]*max-height:9vh/);
});

test('GitHub Pages lädt die ausgelagerten Assets über relative Pfade', () => {
  assert.match(html, /<script type="module" src="\.\/src\/app\.js"><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="\.\/src\/styles\.css"\s*\/>/);
  assert.doesNotMatch(html, /<script type="module">/);
  assert.doesNotMatch(html, /<style>/);
  assert.ok(bundle.length > 100_000);
  assert.ok(styles.length > 10_000);
  assert.match(html, /<div id="root"><\/div>/);
});

test('Notennamen-Modul wird aus dem App-Bundle relativ geladen', () => {
  assert.match(bundle, /import \{ formatGermanNote, parseGermanNoteInput \} from '\.\/music\/notennamen\.mjs';/);
});


test('Intervall-Modul wird vom App-Bundle geladen', () => {
  assert.ok(bundle.includes("import { INTERVALS, transposeDiatonic } from './music/intervalle.mjs';"));
});


test('Tonleitern werden über das eigenständige Modul geladen', () => {
  assert.ok(bundle.includes("from './music/tonleitern.mjs';"));
  assert.ok(bundle.includes('scaleFromSemitones(e,t,n,r)'));
  assert.ok(bundle.includes('parseCompactPitch(e)'));
});


test('Akkordmodul wird in den echten Generatoren verwendet', () => {
  assert.ok(bundle.includes("from './music/akkorde.mjs';"));
  assert.ok(bundle.includes('buildTriad(e,t,n,r,i)'));
  assert.ok(bundle.includes('invertChord(e,t)'));
  assert.ok(bundle.includes('chordSymbol(e,t,n)'));
});


test('Bewertungsmodul wird von der Anwendung geladen', () => {
  assert.ok(bundle.includes("from './music/bewertung.mjs';"));
  assert.ok(bundle.includes('gradeWrittenNotes(e,t,n,r)'));
});


test('Vier Notennamen-Aufgabengeneratoren werden aus dem Modul verwendet', () => {
  assert.ok(bundle.includes("from './aufgaben/notennamen.mjs';"));
  for (const call of [
    'noteNameTaskGenerators.multipleChoice(e)',
    'noteNameTaskGenerators.enharmonic()',
    'noteNameTaskGenerators.placement(e)',
    'noteNameTaskGenerators.textEntry(e)',
  ]) assert.ok(bundle.includes(call), call);
});


test('Vier Intervall-Generatoren werden tatsächlich aus ihrem Modul aufgerufen', () => {
  assert.ok(bundle.includes("from './aufgaben/intervalle.mjs';"));
  for (const call of [
    'intervalTaskGenerators.halfWholeStep(e)',
    'intervalTaskGenerators.buildInterval(e)',
    'intervalTaskGenerators.recognizeInterval(e)',
    'intervalTaskGenerators.listeningInterval()',
  ]) assert.ok(bundle.includes(call), call);
});


test('Tonleiter-Generatoren werden von der Anwendung aus dem Modul geladen', () => {
  assert.ok(bundle.includes("from './aufgaben/tonleitern.mjs';"));
  for (const call of [
    'scaleTaskGenerators.majorScale(e)',
    'scaleTaskGenerators.minorScale(e)',
    'scaleTaskGenerators.chromaticScale(e)',
    'scaleTaskGenerators.wholeToneScale(e)',
  ]) assert.ok(bundle.includes(call), call);
});


test('Sechs Akkord-Aufgabengeneratoren werden aus dem Modul geladen', () => {
  assert.ok(bundle.includes("from './aufgaben/akkorde.mjs';"));
  for (const call of [
    'chordTaskGenerators.buildTriadTask(e)',
    'chordTaskGenerators.identifyTriad(e)',
    'chordTaskGenerators.identifyInversion(e)',
    'chordTaskGenerators.buildInversion(e)',
    'chordTaskGenerators.writtenTriadName(e)',
    'chordTaskGenerators.listeningTriad()',
  ]) assert.ok(bundle.includes(call), call);
});


test('Fünf Rhythmus-Aufgabengeneratoren werden tatsächlich aus dem Modul genutzt', () => {
  assert.ok(bundle.includes("from './aufgaben/rhythmus.mjs';"));
  for (const call of [
    'rhythmTaskGenerators.missingNoteValue(e)',
    'rhythmTaskGenerators.missingRestValue(e)',
    'rhythmTaskGenerators.identifyRest(e,t)',
    'rhythmTaskGenerators.barLine(e)',
    'rhythmTaskGenerators.triplet(e)',
  ]) assert.ok(bundle.includes(call), call);
});


test('Quintenzirkel- und Vorzeichenaufgaben verwenden das neue Modul', () => {
  assert.ok(bundle.includes("from './aufgaben/quintenzirkel-vorzeichen.mjs';"));
  assert.ok(bundle.includes('keySignatureTasks.circleOfFifths()'));
  assert.ok(bundle.includes('keySignatureTasks.readKeySignature(e)'));
});


test('Vier Harmonie- und Vierklanggeneratoren nutzen das neue Modul', () => {
  assert.ok(bundle.includes("from './aufgaben/harmoniefunktionen.mjs';"));
  assert.ok(bundle.includes('var Ye=MAJOR_FUNCTIONS'));
  for (const call of [
    'harmonyTasks.buildFunctionChord(e)',
    'harmonyTasks.identifyFunction(e)',
    'harmonyTasks.buildExtendedChord(e)',
    'harmonyTasks.identifyExtendedChord(e)',
  ]) assert.ok(bundle.includes(call), call);
});
