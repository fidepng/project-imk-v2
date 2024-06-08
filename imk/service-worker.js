const cacheName = "sw-v1";

// Daftar file yang perlu di-cache
const cacheFiles = [
  "/imk/",
  "/imk/index.html",
  "/imk/manifest.json",
  "/imk/pages/menu.html",
  "/imk/pages/math-quiz.html",
  "/imk/pages/common-knowledge-quiz.html",
  "/imk/scripts/math-quiz.js",
  "/imk/scripts/common-knowledge-quiz.js",
  "/imk/scripts/accessibility.js",
  "/imk/scripts/sidebar.js",
  "/imk/styles/home.css",
  "/imk/styles/math-quiz.css",
  "/imk/styles/common-knowledge-quiz.css",
  "/imk/styles/menu.css",
  "/imk/assets/bootstrap-5.3.3-dist/css/bootstrap.min.css",
  "/imk/assets/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js",
  "/imk/assets/blurry-gradient-haikei.svg",
  "/imk/assets/body-bg.jpg",
  "/imk/assets/gold-trophy.svg",
  "/imk/assets/settings.svg",
  "/imk/assets/icon-192.png",
  "/imk/assets/icon-512.png",
  "/imk/assets/maskable-icon.png",
  "/imk/assets/animal/kucing1.svg",
  "/imk/assets/animal/kucing2.svg",
  "/imk/assets/sound/correct.wav",
  "/imk/assets/sound/incorrect.wav",
  "/imk/assets/sound/finish.wav",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(cacheFiles))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== cacheName)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        const responseToCache = networkResponse.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
      // .catch(() => {
      //   return caches.match('/imk/offline.html');
      // });
    })
  );
});
