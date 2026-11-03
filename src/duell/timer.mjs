/**
 * Echte Duell-Intervallverwaltung. Der Browser liefert Uhr und Intervall-API
 * als Abhängigkeiten; beim Import gibt es keine DOM- oder Timer-Nebenwirkungen.
 * Die Reihenfolge bleibt: Startzeit bestimmen, 100-ms-Intervall starten,
 * Fortschritt anzeigen, beim Ablauf Intervall löschen und Runde beenden.
 */
import {duelTimeProgress} from './rundensteuerung.mjs';

export function startDuelCountdown(durationSeconds, onProgress, onExpired, {now,schedule,cancel}) {
  const durationMs = durationSeconds * 1000;
  const deadline = now() + durationMs;
  const handle = schedule(() => {
    const progress = duelTimeProgress(now(),deadline,durationMs);
    onProgress(progress.percent);
    if (progress.expired) {
      cancel(handle);
      onExpired();
    }
  },100);
  return handle;
}
