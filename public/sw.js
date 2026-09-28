/**
 * NEXORA AI - Service Worker
 * Robust Network-First Service Worker for PWA compliance
 */

const CACHE_NAME = 'nexora-cache-v2';

// Clean up stale caches immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Never intercept non-http, dev assets, Vite internals, or hot-module-replacement
  if (
    !url.protocol.startsWith('http') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('warmup') ||
    url.search.includes('v=')
  ) {
    return;
  }

  // Network-First strategy: Always fetch fresh from network
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Do not cache errors or non-basic responses
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }

        // Cache static production assets only
        if (
          url.pathname.startsWith('/pwa-') ||
          url.pathname.endsWith('.png') ||
          url.pathname.endsWith('.svg') ||
          url.pathname.endsWith('.ico')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache only when completely offline
        return caches.match(event.request);
      })
  );
});
