
// Service Worker básico para PWA
const CACHE_NAME = 'mercado-dn3j-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de outros esquemas (como chrome-extension)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback response if network fails
      return new Response("Você está offline. Verifique sua conexão.", {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })
  );
});
