/*
 * Musiktheorie Offline-Shell: nur Dateien dieser GitHub-Pages-App.
 *
 * Revision bei Änderungen an der Offline-Shell inkrementieren.
 * Online: Netzwerk zuerst, aktualisierte Dateien werden im Cache ersetzt.
 * Offline: vollständig vorab gespeicherte App-Shell wird ausgeliefert.
 *
 * Die Lernstände liegen weiterhin ausschließlich im Browser-Storage.
 */
const CACHE_PREFIX = 'musiktheorie-offline-';
const CACHE_NAME = CACHE_PREFIX + '2026-11-04-v4';
const SHELL_URL = new URL('./', self.registration.scope).href;
const APP_FILES = [
  "./",
  "./manifest.webmanifest",
  "./src/app.js",
  "./src/aufgaben/akkorde.mjs",
  "./src/aufgaben/harmoniefunktionen.mjs",
  "./src/aufgaben/intervalle.mjs",
  "./src/aufgaben/kadenz-analyse.mjs",
  "./src/aufgaben/notennamen.mjs",
  "./src/aufgaben/quintenzirkel-vorzeichen.mjs",
  "./src/aufgaben/rhythmus.mjs",
  "./src/aufgaben/tonleitern.mjs",
  "./src/duell/ansicht.mjs",
  "./src/duell/aufgabenpool.mjs",
  "./src/duell/rundensteuerung.mjs",
  "./src/duell/sitzung.mjs",
  "./src/duell/spielregeln.mjs",
  "./src/duell/timer.mjs",
  "./src/music/akkorde.mjs",
  "./src/music/beispiel-audio.mjs",
  "./src/music/bewertung.mjs",
  "./src/music/intervalle.mjs",
  "./src/music/notennamen.mjs",
  "./src/music/tonhoehen.mjs",
  "./src/music/tonleitern.mjs",
  "./src/styles.css",
  "./src/ui/noteneingabe.mjs",
  "./src/ui/notensystem.mjs",
  "./src/unterricht/druck.css",
  "./src/unterricht/lernplan.mjs",
  "./src/unterricht/oberflaeche.mjs",
  "./src/unterricht/profile.mjs",
  "./src/unterricht/qr-code.mjs",
  "./src/unterricht/vendor/qrcode.mjs"
];
const APP_URLS = APP_FILES.map(path => new URL(path, self.registration.scope).href);
const APP_PATHS = new Set(APP_URLS.map(url => new URL(url).pathname));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Installation schlägt vollständig fehl, wenn ein Modul nicht erreichbar
    // ist. Eine zuvor funktionierende Offline-Version bleibt dadurch aktiv.
    await cache.addAll(APP_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;

  const isNavigation = request.mode === 'navigate';
  if (!isNavigation && !APP_PATHS.has(url.pathname)) return;

  // Parameterisierte Unterrichtslinks benutzen dieselbe statische HTML-Shell.
  // Sie werden nie einzeln (und potenziell unbegrenzt) im Cache abgelegt.
  const normalizedURL = isNavigation
    ? SHELL_URL
    : new URL(url.pathname, url.origin).href;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok && response.type !== 'opaque') {
        // Keine personenbezogenen API-Antworten oder Fremdquellen cachen.
        // HTML aus nicht existierenden Unterseiten nicht als Shell speichern.
        if (!isNavigation || url.pathname === scope.pathname ||
            url.pathname === new URL('./index.html', scope).pathname) {
          await cache.put(normalizedURL, response.clone());
        }
      }
      return response;
    } catch {
      const cached = await cache.match(normalizedURL);
      if (cached) return cached;
      return Response.error();
    }
  })());
});
