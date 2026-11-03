import test from 'node:test';
import assert from 'node:assert/strict';
import {startDuelCountdown} from '../src/duell/timer.mjs';

function simulatedClock() {
  let now=0, callback=null, delay=null, canceled=[],events=[];
  const api={
    now:()=>now,
    schedule:(fn,ms)=>{callback=fn;delay=ms;events.push('scheduled');return 17},
    cancel:id=>{canceled.push(id);events.push('cancel');callback=null;},
  };
  return {
    api,
    events,
    delay:()=>delay,
    canceled:()=>canceled,
    tick:(at)=>{now=at;const run=callback;if(run)run();},
    now:()=>now,
  };
}

test('Der echte Countdown startet mit genau 100 ms und zeigt den Rest korrekt', () => {
  const clock=simulatedClock();
  const values=[],finished=[];
  const handle=startDuelCountdown(12,p=>values.push(p),()=>finished.push(true),clock.api);
  assert.equal(handle,17);
  assert.equal(clock.delay(),100);
  clock.tick(3000);clock.tick(6000);clock.tick(11900);
  assert.deepEqual(values,[75,50,100*(12000-11900)/12000]);
  assert.deepEqual(finished,[]);
  assert.deepEqual(clock.canceled(),[]);
});

test('Fristablauf: zuerst die Fortschrittsanzeige, dann Intervall löschen, dann Auswertung', () => {
  const clock=simulatedClock(),events=clock.events;
  startDuelCountdown(2,p=>events.push(['progress',p]),()=>events.push('expired'),clock.api);
  clock.tick(400);
  clock.tick(2000);
  clock.tick(3000);
  assert.deepEqual(events,[
    'scheduled',['progress',80],['progress',0],'cancel','expired',
  ]);
  assert.deepEqual(clock.canceled(),[17]);
});

test('Bei 0 oder sehr kurzer Rundenzeit endet die erste Intervallprüfung', () => {
  for(const duration of [0,0.001]){
    const clock=simulatedClock(),result=[];
    startDuelCountdown(duration,p=>result.push(p),()=>result.push('end'),clock.api);
    clock.tick(100);
    assert.deepEqual(result,[0,'end']);
  }
});

test('Externes Abbrechen verhindert weitere Intervalle', () => {
  const clock=simulatedClock(),values=[];
  const id=startDuelCountdown(5,p=>values.push(p),()=>values.push('end'),clock.api);
  clock.tick(1000);
  clock.api.cancel(id);
  clock.tick(6000);
  assert.deepEqual(values,[80]);
  assert.deepEqual(clock.canceled(),[17]);
});

test('Rundentimer ist beim Import unabhängig vom Browser', () => {
  assert.equal(typeof startDuelCountdown,'function');
  // Kein window/performance beim Import, alle APIs explizit übergeben.
});
