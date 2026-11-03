'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

// Die Anwendung liegt aktuell als gebündelte index.html vor. Wir prüfen die
// tatsächlichen Generatoren daraus, nicht eine separate Nachimplementierung.
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const begin = html.indexOf('y={c:0,d:1,e:2,f:3,g:4,a:5,h:6}');
const end = html.indexOf('var en=', begin);

assert.ok(begin !== -1 && end > begin, 'Aufgabengeneratoren im Bundle auffindbar');
const { M, N, Qt, Et, ye } = Function(
  'var ' + html.slice(begin, end) + ';return {M,N,Qt,Et,ye};'
)();

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
  assert.ok(html.includes('Deine Eingabe: ${_e.trim()}. ${N.explanation}'));
});
