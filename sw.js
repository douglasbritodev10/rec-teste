const CACHE_NAME = "simonetti-" + Date.now();
const urlsToCache = [
  "./",
  "./index.html",
  "./agendamento.html",
  "./ajuste.html",
  "./cargas do dia.html",
  "./login.html",
  "./offline.html",
  "./manifest.json",
  "./icon-192.png",
  "./first_login.html",
  "./icon-512.png",
  "./favicon.ico.png"
];

// Instala e guarda os arquivos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Ativa e apaga todos os caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Intercepta todas as requisições
self.addEventListener("fetch", (event) => {
  // Se for uma navegação (abrir páginas HTML)
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./offline.html"))
    );
    return;
  }

  // Para recursos (css, js, imagens etc.)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
