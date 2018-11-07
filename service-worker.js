// Set a name for the current cache
var cacheName = 'v1';

// Default files to always cache
var cacheFiles = [
	'./'
]

self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Installed :)');

    e.waitUntil(
	    caches.open(cacheName).then( (cache) => {
				console.log('[ServiceWorker] Caching...');
				return cache.addAll(cacheFiles);
	  	})
		);
});

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activated :)');

    e.waitUntil(
			caches.keys().then( (cache) => {
				return Promise.all(cache.map( (currentCacheName) => {
					// If a cached item is saved under a previous cacheName
					if (currentCacheName !== cacheName) {
						// Delete that cached file
						console.log('[ServiceWorker] Removing Cached Files from old cache - ', currentCacheName);

						return cache.delete(currentCacheName);
					}
				}));
			})
		);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		// Check in cache for the request being made
		caches.match(e.request)
			.then( (response) => {
				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					
					return response;
				}

				// If the request is NOT in the cache, fetch and cache
				var requestClone = e.request.clone();
				fetch(requestClone)
					.then( (response) => {
						console.log('[ServiceWorker] Fetching ', e.request.url);
						
						if ( !response ) {
							console.log("[ServiceWorker] 404 ", e.request.url)
							return response;
						}

						var responseClone = response.clone();

						caches.open(cacheName).then( (cache) => {
							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							return response;
				    });
					})
					.catch( (err) => {
						console.log('[ServiceWorker] Error while Fetching & Caching New Data', err);
					});
		})
	);
});