const G_CACHE_CURR_VERSION = "v0.0.3";
const G_CACHE_PREV_VERSION = "v0.0.2";

self.addEventListener("install", installWorker);
self.addEventListener("fetch", fetchWorker);
self.addEventListener("activate", activateWorker);

async function __fetchResource__(event) {
	try {
		let resource = await caches.match(event.request);
	
		if(resource) {
			return resource;
		}
	
		resource = await fetch(event.request);
	
		(await caches.open(G_CACHE_CURR_VERSION)).put(event.request, resource.clone());
	
		return resource;
	} catch(error) {
		console.error("[WORKER]:", error);
	}
}

function activateWorker(event) {
	console.log("[WORKER]: Activate", event);
}

async function fetchWorker(event) {
	console.log("[WORKER]: Fetch", event.request);

	event.respondWith((async () => __fetchResource__(event))());
}

async function installWorker(event) {
	console.log("[WORKER]: Install!", event);

	if(caches.has(G_CACHE_PREV_VERSION)) {
		await caches.delete(G_CACHE_PREV_VERSION);
	}

	const STATIC_RESOURCE_PATHS = [
		// Some metadata and others
		"/sitemap.xml",
		"/robots.txt",
		"/Eco-Kompaß.xlsx",
		// Pages
		"/kompass.html",
		"/index.html",
		"/404.html",
		"/how-to-use.html",
		// Images
		"/src/imgs/PWA_1_Chrome_Mobile.webp",
		"/src/imgs/PWA_2_Chrome_Mobile.webp",
		"/src/imgs/PWA_3_Chrome_Mobile.webp",
		"/src/imgs/PWA_2_Chrome_PC.webp",
		"/src/imgs/PWA_1_Chrome_PC.webp",
		"/src/imgs/PWA_1_Edge.webp",
		"/src/imgs/PWA_2_Edge.webp",
		"/src/imgs/PWA_3_Edge.webp",
		"/src/imgs/Umberto_Eco.webp",
		"/favico32x32.webp",
		"/favico144x144.webp",
		"/favico192x192.webp",
		"/favico512x512.webp",
		"/favico1024x1024.webp",
		// CSS
		"/404.css",
		"/index.css",
		"/kompass.css",
		"/how-to-use.css",
		// Elements css
		"/src/element/Button/Button.css",
		"/src/element/Checkbox/Checkbox.css",
		"/src/element/Empty/Empty.css",
		"/src/element/Error/Error.css",
		"/src/element/List/ListItem.css",
		"/src/element/Pagination/Pagination.css",
		"/src/element/Select/Select.css",
		"/src/element/Text-Area/TextArea.css",
		"/src/element/Text-Input/TextInput.css",
		// Manifest
		"/404.manifest.json",
		"/index.manifest.json",
		"/kompass.manifest.json",
		"/how-to-use.manifest.json",
		// Fonts
		"/src/fonts/Poppins-Black.woff2",
		"/src/fonts/Poppins-ExtraBold.woff2",
		"/src/fonts/Poppins-Bold.woff2",
		"/src/fonts/Poppins-ExtraLight.woff2",
		"/src/fonts/Poppins-Light.woff2",
		"/src/fonts/Poppins-Medium.woff2",
		"/src/fonts/Poppins-Regular.woff2",
		"/src/fonts/Poppins-SemiBold.woff2",
		"/src/fonts/Poppins-Thin.woff2",
		// JS
		"/404.js",
		"/index.js",
		"/kompass.js",
		"/how-to-use.js",
		"/NUMBER.const.js",
		"/STRING.const.js",
		// JS Utils		
		"/src/utils/registerSW.utils.js",
		"/src/utils/isInRange.utils.js",
		// Element JS
		"/src/element/Empty/Empty.js",
		"/src/element/List/List.js",
		"/src/element/List/ListItem.js",
		"/src/element/Pagination/Pagination.js",
		"/src/element/Select/Select.js",
		// Libs
		"/src/libs/statix/NUMBER.const.js",
		"/src/libs/statix/STRING.const.js",
		"/src/libs/statix/src/element.core.js",
		"/src/libs/statix/src/statix.core.js",
		"/src/libs/statix/src/StatixContext.core.js",
		"/src/libs/statix/src/StatixDOM.core.js",
		"/src/libs/statix/src/StatixElement.core.js",
		"/src/libs/statix/src/StatixErrors.core.js",
		"/src/libs/statix/src/StatixSignal.core.js",
		"/src/libs/statix/src/utils.core.js",
		"/src/libs/statix/src/utils/appendChildWhenExist.utils.js",
		"/src/libs/statix/src/utils/debug.utils.js",
		"/src/libs/statix/src/utils/define.utils.js",
		"/src/libs/statix/src/utils/diff.utils.js",
		"/src/libs/statix/src/utils/getRootFromOptions.utils.js",
		"/src/libs/statix/src/utils/is.utils.js",
	];

	try {
		await (await caches.open(G_CACHE_CURR_VERSION)).addAll(STATIC_RESOURCE_PATHS);
	} catch(error) {
		console.error("[WORKER]:", error);
	}
}