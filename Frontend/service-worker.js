const CACHE_NAME = "event-navigation-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  // You can include additional assets like images or JSON files here.
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Intercept fetch requests and serve cached assets if available.
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Clean up any old caches.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Listen for messages from the client (e.g., "downloadOffline")
self.addEventListener("message", (event) => {
  if (event.data.action === "downloadOffline") {
    caches.open(CACHE_NAME).then((cache) => {
      // Optionally, add dynamic assets like the latest route data.
      cache.addAll(urlsToCache).catch((error) => console.error("Error caching files:", error));
    });
  }
});
