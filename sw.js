
// Service Worker básico para PWA
const CACHE_NAME = 'mercado-dn3j-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through strategy. 
  // For a full offline experience, you would implement caching here.
  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback response if network fails
      return new Response("Você está offline. Verifique sua conexão.", {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
