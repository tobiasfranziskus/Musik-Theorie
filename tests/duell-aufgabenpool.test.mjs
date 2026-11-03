import test from 'node:test';
import assert from 'node:assert/strict';
import {createDuelQuestionPool} from '../src/duell/aufgabenpool.mjs';

function task(name,staff=null) {
  return {mode:'mc',q:name,options:['A','B','C','D'],correct:1,
    explanation:name+' erklärt',...(staff?{staff}:{})};
}
const fallback=[
  ['Ersatz 1',['1','2','3','4'],2,'F1'],
  ['Ersatz 2',['a','b','c','d'],0,'F2'],
  ['Ersatz 3',['I','II','III','IV'],3,'F3'],
];
function setup(sections,{adaptTask=(gen,t)=>t,renderStaff=()=>'<svg>staff</svg>',
 renderGrandStaff=()=>'<svg>grand</svg>',fallbackQuestions=fallback,
 shuffle=a=>[...a].reverse(),taskSignature=t=>t.q}={}) {
  return createDuelQuestionPool({sections,adaptTask,renderStaff,renderGrandStaff,
    fallbackQuestions,shuffle,taskSignature});
}

test('Fragen stammen aus dem gewählten Themenbereich und nicht aus Gehörbildung', () => {
  const sections=[
    {id:'noten',gens:[()=>task('Name')]},
    {id:'werte',gens:[()=>task('Rhythmus')]},
    {id:'gehoer',gens:[()=>task('Verboten')]},
  ];
  const pool=setup(sections);
  const all=pool(4,'all');
  assert.ok(all.some(q=>q.prompt==='Name'));
  assert.ok(all.some(q=>q.prompt==='Rhythmus'));
  assert.ok(all.every(q=>q.prompt!=='Verboten'));
  const onlyNotes=pool(2,'noten');
  assert.ok(onlyNotes.some(q=>q.prompt==='Name'));
  assert.ok(onlyNotes.every(q=>q.prompt!=='Rhythmus'));
});

test('Mehrfach identische Aufgaben werden nur einmal übernommen', () => {
  const pool=setup([{id:'noten',gens:[()=>task('Immer dieselbe Aufgabe')]}]);
  const result=pool(5,'all');
  assert.equal(result.filter(q=>q.prompt==='Immer dieselbe Aufgabe').length,1);
  assert.equal(result.length,4,'drei verfügbare Ersatzfragen ergänzen');
  assert.equal(new Set(result.map(q=>q.prompt)).size,4);
});

test('SVG für einzelnes Notensystem und Klaviersystem wird unverändert übernommen', () => {
  const sections=[{id:'noten',gens:[
    ()=>task('Ein System',{notes:[{name:'c',octave:4}]}),
    ()=>task('Klaviersystem',{chords:[{treble:[],bass:[]}]}),
  ]}];
  const q=setup(sections)(2,'all');
  assert.equal(q.find(x=>x.prompt==='Ein System')?.svgHtml,'<svg>staff</svg>');
  assert.equal(q.find(x=>x.prompt==='Klaviersystem')?.svgHtml,'<svg>grand</svg>');
  for(const item of q) {
    assert.equal(item.options.length,4);
    assert.equal(item.correct,1);
    assert.ok(item.explanation.includes('erklärt'));
  }
});

test('Ungeeignete, hörbasierte und werfende Generatoren werden übersprungen', () => {
  const sections=[{id:'noten',gens:[
    ()=>{throw Error('absichtlich fehlerhaft')},
    ()=>task('Setze die Note f¹'),
    ()=>task('Unkritisch'),
    ()=>task('Nur Audio'),
  ]}];
  const pool=setup(sections,{adaptTask:(generator,q)=>
    q.q.startsWith('Setze')||q.q==='Nur Audio'?null:q});
  const result=pool(3,'all');
  assert.ok(result.some(x=>x.prompt==='Unkritisch'));
  assert.ok(result.every(x=>!x.prompt.startsWith('Setze')&&x.prompt!=='Nur Audio'));
});

test('Kandidaten ohne SVG und die Ersatzfragen behalten ihre Lösungen', () => {
  const sections=[{id:'noten',gens:[()=>task('Nur Text')]}];
  const pool=setup(sections,{fallbackQuestions:fallback.slice(0,2)});
  const list=pool(4,'all');
  assert.equal(list.length,3);
  assert.equal(list.find(x=>x.prompt==='Nur Text')?.svgHtml,'');
  assert.equal(list.find(x=>x.prompt==='Ersatz 1')?.correct,2);
  assert.equal(list.find(x=>x.prompt==='Ersatz 2')?.correct,0);
});

test('Ausgabe bleibt leer bei Zielzahl 0 und fehlendem Ersatzpool', () => {
  const pool=setup([],{fallbackQuestions:[]});
  assert.deepEqual(pool(0,'all'),[]);
  assert.deepEqual(pool(12,'noten'),[]);
});
