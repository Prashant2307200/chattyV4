const CACHE_NAME = 'chatty-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image.png',
  '/avatar.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    )
  );
});

// Custom caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  // Example: API requests - Network First
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  // Static assets - Cache First
  if (request.destination === 'script' || request.destination === 'style' || request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, fetchRes.clone());
            return fetchRes;
          });
        });
      })
    );
    return;
  }
  // Default: try cache, then network
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});

// Push notifications
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Chatty Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: '/image.png',
    badge: '/avatar.png',
    data: data.url || '/' // URL to open on click
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});

// Background Sync for AI responses
self.addEventListener('sync', function(event) {
  if (event.tag === 'ai-response-queue') {
    event.waitUntil(retryAIRequests());
  }
});

async function retryAIRequests() {
  const queue = await getQueue('ai-response-queue');
  while (queue.length) {
    const req = queue.shift();
    try {
      await fetch(req.url, req.options);
    } catch (e) {
      queue.unshift(req);
      break;
    }
  }
  await setQueue('ai-response-queue', queue);
}

async function getQueue(name) {
  const cache = await caches.open('bg-sync');
  const res = await cache.match(name);
  if (!res) return [];
  return await res.json();
}

async function setQueue(name, queue) {
  const cache = await caches.open('bg-sync');
  await cache.put(name, new Response(JSON.stringify(queue)));
}
