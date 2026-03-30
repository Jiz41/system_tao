// SYSTEM:TAO Service Worker
// キャッシュ最小限・オフライン時は注意喚起のみ

const CACHE_NAME = "system-tao-v1";
const PRECACHE = ["/system_tao/", "/system_tao/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Gemini API等の外部リクエストはネットワークのみ（キャッシュしない）
  if (!url.origin.includes(self.location.origin)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // アプリシェルのみキャッシュフォールバック
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => cached || caches.match("/system_tao/index.html"))
    )
  );
});
