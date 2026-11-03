import test from 'node:test';
import assert from 'node:assert/strict';
import {createDuelSessionHook} from '../src/duell/sitzung.mjs';

function simulatedReact() {
  const slots=[];let cursor=0;
  const React={
    useState(initial){
      const id=cursor++;
      if(!slots[id])slots[id]={type:'state',value:initial};
      const slot=slots[id];
      return [slot.value,next=>{slot.value=typeof next==='function'?next(slot.value):next;}];
    },
    useRef(initial){
      const id=cursor++;
      if(!slots[id])slots[id]={type:'ref',value:{current:initial}};
      return slots[id].value;
    },
    useEffect(){cursor++},
  };
  return {React,render(fn){cursor=0;return fn();},slots};
}
const questions=[
  {prompt:'Frage 1',options:['c','d','e','f'],correct:0},
  {prompt:'Frage 2',options:['a','b','c','d'],correct:0},
];
test('Duell ohne Zeitlimit erzeugt keinen Browser-Timer und wird durch letzte Antwort beendet',()=>{
  const runtime=simulatedReact(),feedback=[];
  const use=createDuelSessionHook({React:runtime.React,generateQuestions:()=>questions,
    playFeedback:correct=>feedback.push(correct)});
  const render=()=>runtime.render(()=>use(true,['treble','bass']));
  let s=render();
  s.l(0); // keine Uhr
  s=render();
  assert.equal(s.c,0);
  s.ae();
  s=render();
  assert.equal(s.T.current,null,'kein Timer gestartet');
  assert.equal(s.E.current.length,2);
  s.O(0,0);
  s=render();
  assert.equal(s.x,false,'erste Antwort beendet nicht die ganze Runde');
  s.O(1,0);
  s=render();
  assert.equal(s.x,true,'zweite Antwort schließt die Runde ab');
  assert.equal(feedback.length,1);
  s.se(s.E.current,'erneut',questions[0]);
  assert.equal(feedback.length,1,'doppelte Bewertung verhindert');
  s.ce();
  s=render();
  assert.equal(s.g,1);
  assert.equal(s.T.current,null,'auch zweite Runde ist zeitfrei');
});

test('Stoppuhr-Regeln für reguläre Duelle bleiben separat abgedeckt',()=>{
  const runtime=simulatedReact();
  const use=createDuelSessionHook({React:runtime.React,generateQuestions:()=>questions,playFeedback:()=>{}});
  const s=runtime.render(()=>use(true,['treble','bass']));
  assert.equal(s.c,12,'historischer Default unverändert');
});
