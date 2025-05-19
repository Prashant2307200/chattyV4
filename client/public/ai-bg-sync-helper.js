// Helper for background sync of AI requests
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
