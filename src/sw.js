self.addEventListener('install', installWorker);
self.addEventListener('fetch', fetchWorker);

function fetchWorker(event) {
	event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
}

async function installWorker() {
	const STATIC_RESOURCE_PATHS = [
		// Images
		"/src/imgs/PWA_1_Chrome_Mobile.jpg",
		"/src/imgs/PWA_2_Chrome_Mobile.jpg",
		"/src/imgs/PWA_3_Chrome_Mobile.jpg",
		"/src/imgs/PWA_2_Chrome_PC.png",
		"/src/imgs/PWA_1_Chrome_PC.png",
		"/src/imgs/Umberto_Eco.webp",
		"/src/imgs/PWA_1_Edge.png",
		"/src/imgs/PWA_2_Edge.png",
		"/src/imgs/PWA_3_Edge.png",
		// CSS
		"/src/css/flex-column.css",
		"/src/css/media-query.css",
		"/src/css/variable.css",
		"/src/css/flex-row.css",
		"/src/css/position.css",
		"/src/css/common.css",
		"/src/css/reset.css",
		"/src/css/font.css",
		"/kompass.css",
		"/index.css",
		// Fonts
		"/src/fonts/Poppins-Light.woff2",
		// HTML
		"/kompass.html",
		"/index.html"
	]
	
	await (await caches.open("KOMPASS_PWA")).addAll(STATIC_RESOURCE_PATHS);
}